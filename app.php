<?php

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/classes/kopdo.php';

// Define constants
define('SQL_DATE', 'Y-m-d H:i:s');
ini_set('display_errors', getenv('DEBUG'));

// Functions

function sanitize_output($buffer) {
    $search = array(
        '/\>[^\S ]+/s',     // strip whitespaces after tags, except space
        '/[^\S ]+\</s',     // strip whitespaces before tags, except space
        '/(\s)+/s',         // shorten multiple whitespace sequences
        '/<!--(.|\s)*?-->/' // Remove HTML comments
    );
    $replace = array(
        '>',
        '<',
        '\\1',
        ''
    );
    $buffer = preg_replace($search, $replace, $buffer);
    return $buffer;
}

function get_socials() {
	return KOPDO::all("socials", "*");
}

function get_press() {
	return KOPDO::all("press", "*", "visible = 1 ORDER BY claps_count DESC");
}

function get_oss_projects() {
	return KOPDO::all("oss_projects", "*", "visible = 1 AND description IS NOT NULL ORDER BY (stars_count + forks_count) DESC", []);
}

function get_projects() {
	return KOPDO::all("projects", "*", "visible = 1 ORDER BY year DESC", []);
}

function get_about() {
	$p = file_get_contents(__DIR__ . '/README.md');
	return (new ParsedownExtra())->text($p);
}

function http_request($url, $ttl = 86400, $decode = true) {
	$key = 'http_' . sha1($url);
	$file = sys_get_temp_dir() . '/' . $key;
	$r = @file_get_contents($file);

	if ($r == null || (filemtime($file) + (24 * 60 * 60) < time())) {
		$ch = curl_init($url);

		curl_setopt($ch, CURLOPT_PORT , 443);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_USERAGENT, 'Website');
		curl_setopt($ch, CURLOPT_HTTPHEADER, [ 'Accept: application/json' ]); 
		$r = curl_exec($ch);

		file_put_contents($file, $r);

		curl_close($ch);
	}

	$r = str_replace('])}while(1);</x>', '', $r);
	return $decode ? json_decode($r) : $r;
}

function update_oss_projects() {
	$repos = [];
	foreach (explode(',', getenv('GITHUB_USERNAMES')) as $profile) {
		$repos = array_merge($repos, http_request('https://api.github.com/users/' . $profile . '/repos?per_page=500&&access_token=' . getenv('GITHUB_TOKEN')));
	}

	foreach ($repos as $k => $r) {
		if ($r->fork) continue;
		$e = [
			'github_id' => $r->id,
			'name' => $r->name,
			'description' => $r->description,
			'url' => $r->html_url,
			'stars_count' => $r->stargazers_count,
			'forks_count' => $r->forks_count,
			'year' => intval(date('Y', strtotime($r->created_at))),
			'fork' => $r->fork ? 1 : 0,
			'owner' => $r->owner->login,
			'visible' => 1
		];

		if (false == KOPDO::val("oss_projects", "id", "github_id = ?", [ $e['github_id'] ])) {
			echo "Inserting {$e['github_id']}... ";
			echo KOPDO::insert("oss_projects", $e);
			echo PHP_EOL;
		} else {
			// echo "Skipping repo {$e['name']}... " . PHP_EOL;
		}
	}
}

function get_gists() {
	$gists = [];
	foreach (array_slice(http_request('https://api.github.com/gists?per_page=200&&access_token=' . getenv('GITHUB_TOKEN')), 0, 30) as $k => $r) {
		if (!$r->public) continue;
		if (!$r->description) continue;
		$gists[] = (object)[
			'link' => $r->html_url,
			'name' => $r->description,
			'date' => date('Y, M d', strtotime($r->created_at))
		];
	}
	return $gists;
}

function update_press() {
	$medium_raw = http_request('https://medium.com/@' . getenv('MEDIUM_USERNAME') . '/latest');
	foreach ($medium_raw->payload->references->Post as $r) {
		$e = [
			'medium_id' => $r->id,
			'name' => $r->title,
			'url' => 'https://medium.com/' . getenv('MEDIUM_USERNAME') . '/' . $r->uniqueSlug,
			'date' => date(SQL_DATE, floor($r->firstPublishedAt / 1000)),
			'claps_count' => intval($r->virtuals->totalClapCount),
			'visible' => 1
		];

		if (false == KOPDO::val("press", "id", "medium_id = ?", [ $e['medium_id'] ])) {
			echo "Inserting {$e['medium_id']}... ";
			echo KOPDO::insert("press", $e);
			echo PHP_EOL;
		} else {
			// echo "Skipping press {$e['name']}... " . PHP_EOL;
		}
	}
}

function get_tweets() {
	$file = sys_get_temp_dir() . '/twitter.json';
	$r = @file_get_contents($file);

	if ($r == null || (filemtime($file) + (1 * 60 * 60) < time())) {

		$settings = [
		'oauth_access_token' => getenv('TWITTER_TOKEN'),
		'oauth_access_token_secret' => getenv('TWITTER_SECRET'),
		'consumer_key' => getenv('TWITTER_CONSUMER_TOKEN'),
		'consumer_secret' => getenv('TWITTER_CONSUMER_SECRET')
		];
		$twitter = new TwitterAPIExchange($settings);

		$r = $twitter->setGetfield('?screen_name=' . getenv('TWITTER_USERNAME') . '&count=50')
		->buildOauth('https://api.twitter.com/1.1/statuses/user_timeline.json', 'GET')
		->performRequest();

		$tweets = [];
		foreach (json_decode($r) as $t) {
			if ($t->retweeted) continue;
			if (strpos($t->text, "I'm") === 0) continue;
			if (strpos($t->text, "I liked a") === 0) continue;
			if (strpos($t->text, "http") === 0) continue;
			if (count($tweets) >= 10) break;
			$tweets[] = (object)[
				'text' => $t->text,
				'id' => $t->id_str,
				'link' => 'http://twitter.com/' . getenv('TWITTER_USERNAME') . '/status/' . $t->id_str,
				'date' => date('Y, M d', strtotime($t->created_at))
			];
		}

		file_put_contents($file, json_encode($tweets));
		return $tweets;
	}

	return json_decode($r);
}

// Boot

KOPDO::connect('mysql:host=' . getenv('DB_HOST') . '; port=' . getenv('DB_PORT') . '; dbname=' . getenv('DB_NAME') . '; charset=utf8', getenv('DB_USER'), getenv('DB_PASS'));
