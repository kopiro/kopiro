<?php 

require_once __DIR__ . '/../app.php';

?><!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<title>Flavio De Stefano - aka @kopiro</title>

	<meta name="robots" content="index, follow"/>
	<meta name="description" content="software developer for passion, music and photography enthusiast"/>
	<meta name="author" content="Flavio De Stefano">

	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">

	<link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
	
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
	<link href="https://fonts.googleapis.com/css?family=Noto+Sans" rel="stylesheet">
	<link href="/style.css?v=2" rel="stylesheet" />
</head>
<body>

	<h1>Flavio De Stefano</h1>
	<h2>One of the greatest satisfactions is to create something on your own. My best way to do it's by coding.</h2>
	
	<div id="story"><?= get_about() ?></div>

	<h3>Press</h3>
	<ul>
		<?php foreach (get_press() as $r) : ?>
			<li>
				<a target="_blank" rel="noopener" href="<?= $r->link ?>">
					<?= $r->name ?> <span>(<?= date('M Y', strtotime($r->date)) ?>)</span>
				</a>
			</li>
		<?php endforeach; ?>
	</ul>
	<br/>

	<h3>OSS Projects</h3>
	<ul>
		<?php foreach (get_oss_projects() as $e) : ?>
			<li>
				<?php if ($e->url) : ?><a target="_blank" rel="noopener" href="<?= $e->url ?>"><?php endif; ?>
				<b><?= $e->name ?></b>: <span><?= $e->description ?></span>
				<?php if ($e->url) : ?></a><?php endif; ?>
			</li>
		<?php endforeach; ?>
	</ul>
	<br/>

	<h3>Projects</h3>
	<ul>
		<?php foreach (get_projects() as $e) : ?>
			<li>
				<?php if ($e->url) : ?><a target="_blank" rel="noopener" href="<?= $e->url ?>"><?php endif; ?>
				<b><?= $e->name ?></b>: <span><?= $e->description ?> (<?= $e->role . ($e->company ? ' for @' . $e->company : '')?>, <?= $e->year ?>)</span>
				<?php if ($e->url) : ?></a><?php endif; ?>
			</li>
		<?php endforeach; ?>
	</ul>
	<br/>

	<h3>reach me anywhere {</h3>
	<div id="social-icons">
		<a target="_blank" rel="noopener" href="/github" style="color: #26292E"><i class="fa fa-github"></i></a>
		<a target="_blank" rel="noopener" href="/linkedin" style="color: #4077AB"><i class="fa fa-linkedin"></i></a>
		<a target="_blank" rel="noopener" href="/medium" style="color: #87DB87"><i class="fa fa-medium"></i></a>
		<a target="_blank" rel="noopener" href="/twitter" style="color: #5F94CF"><i class="fa fa-twitter"></i></a>
		<a target="_blank" rel="noopener" href="/stackoverflow" style="color: #DA894C"><i class="fa fa-stack-overflow"></i></a>
	</div>

	<br/>
	<h6><a target="_blank" rel="noopener" href="https://pgp.mit.edu/pks/lookup?op=get&search=0xEDE51005D982268E">GPG: 0xEDE51005D982268E</a></h6>

	<?php require __DIR__ . '/../analytics.php'; ?>

</body>
</html>
