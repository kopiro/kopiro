<?php

require_once __DIR__ . '/config.php';
ini_set('display_errors', 0);

function http_request($url, $ttl = 86400, $decode = true) {
	$key = sha1($url);
	$file = __DIR__ . '/cache/' . $key;
	$r = file_get_contents($file);

	if ($r == null || (filemtime($file) + (24 * 60 * 60) < time())) {
		$ch = curl_init($url);
		
		curl_setopt($ch, CURLOPT_PORT , 443);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_USERAGENT, 'kopiro.it');
		curl_setopt($ch, CURLOPT_HTTPHEADER, [ 'Accept: application/json' ]); 
		$r = curl_exec($ch);

		file_put_contents($file, $r);

		curl_close($ch);
	}

	$r = str_replace('])}while(1);</x>', '', $r);
	return $decode ? json_decode($r) : $r;
}

function get_ca_repos() {
	$carepos = [];
	foreach (http_request('https://api.github.com/users/caffeinalab/repos?per_page=200&&access_token='.GITHUB_TOKEN) as $k => $r) {
		if ($r->fork) continue;
		if (substr($r->description, -1) !== '.') continue;
		$carepos[] = (object)[
		'link' => $r->html_url,
		'name' => $r->name,
		'description' => $r->description,
		'stargazers_count' => $r->stargazers_count,
		'date' => date('Y, M d', strtotime($r->created_at))
		];
	}
	usort($carepos, function($b,$a){ return $a->stargazers_count - $b->stargazers_count; });
	return $carepos;
}

function get_repos() {
	$repos = [];
	foreach (http_request('https://api.github.com/users/kopiro/repos?per_page=200&&access_token='.GITHUB_TOKEN) as $k => $r) {
		if ($r->fork) continue;
		$repos[] = (object)[
		'link' => $r->html_url,
		'name' => $r->name,
		'description' => $r->description,
		'stargazers_count' => $r->stargazers_count,
		'date' => date('Y, M d', strtotime($r->created_at))
		];
	}
	usort($repos, function($b,$a){ return $a->stargazers_count - $b->stargazers_count; });
	return $repos;
}

function get_gists() {
	$gists = [];
	foreach (array_slice(http_request('https://api.github.com/gists?per_page=200&&access_token='.GITHUB_TOKEN), 0, 30) as $k => $r) {
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

function get_medium_posts() {
	$medium = [];
	$medium_raw = http_request('https://medium.com/@destefanoflavio/latest');
	foreach ($medium_raw->payload->references->Post as $r) {
		$medium[] = (object)[
		'link' => 'https://medium.com/destefanoflavio/' . $r->uniqueSlug,
		'name' => $r->title,
		'date' => date('Y, M d', floor($r->firstPublishedAt / 1000))		
		];
	}
	return $medium;
}
