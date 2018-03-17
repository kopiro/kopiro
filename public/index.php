<?php 
require_once __DIR__ . '/../app.php';
?><!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<title>Flavio De Stefano - kopiro - Portfolio</title>

	<meta name="robots" content="index, follow"/>
	<meta name="description" content="software developer for passion, music and photography enthusiast"/>
	<meta name="author" content="Flavio De Stefano">

	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">

	<link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
	
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
	<link href="/style.css?v=2" rel="stylesheet" />
</head>
<body>

	<div id="giant">k</div>

	<div id="content">

		<h1 id="title">Flavio De Stefano</h1>
		<h2 id="desc">one of the greatest satisfactions is to create something on your own. my best way to do it's by coding.</h2>
		<a target="_blank" rel="noopener" href="https://pgp.mit.edu/pks/lookup?op=get&search=0xEDE51005D982268E">GPG: 0xEDE51005D982268E</a>

		<h3>press</h3>
		<ul>
			<?php foreach (get_medium_posts() as $r) : ?>
				<li><a target="_blank" rel="noopener" href="<?= $r->link ?>"><?= $r->name ?></a></li>
			<?php endforeach; ?>
		</ul>

		<h3>oss projects</h3>
		<ul>
			<?php foreach (array_slice(get_repos(), 0, 10) as $r) : ?>
				<li><a target="_blank" rel="noopener" href="<?= $r->link ?>"><?= $r->name ?></a></li>
			<?php endforeach; ?>
		</ul>

		<h3>caffeina oss projects</h3>
		<ul>
		<?php foreach (array_slice(get_ca_repos(), 0, 10) as $r) : ?>
				<li><a target="_blank" rel="noopener" href="<?= $r->link ?>"><?= $r->name ?></a></i></li>
			<?php endforeach; ?>
		</ul>

		<h3>other projects</h3>
		<ul>
			<li><a target="_blank" rel="noopener" href="http://www.polpettamag.com">polpettamag</a></li>
			<li><a target="_blank" rel="noopener" href="http://www.ducciograssiarchitects.com/">duccio grassi architects</a></i></li>
			<li><a target="_blank" rel="noopener" href="http://ilpaesaggiodellabonifica.it">Il Paesaggio della Bonifica</a></li>
			<li><a target="_blank" rel="noopener" href="http://ecruarchitetti.it">écru architetti</a></li>
		</ul>
		
		<h3>reach me anywhere</h3>
		<div id="social-icons">
			<a target="_blank" rel="noopener" href="/github"><i class="fa fa-github"></i></a>
			<a target="_blank" rel="noopener" href="/linkedin"><i class="fa fa-linkedin"></i></a>
			<a target="_blank" rel="noopener" href="/medium"><i class="fa fa-medium"></i></a>
			<a target="_blank" rel="noopener" href="/twitter"><i class="fa fa-twitter"></i></a>
			<a target="_blank" rel="noopener" href="/stackoverflow"><i class="fa fa-stack-overflow"></i></a>
		</div>

	</div>

	<?php require __DIR__ . '/../analytics.php'; ?>

</body>
</html>
