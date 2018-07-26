<?php require 'header.php'; ?>

<h1>Flavio De Stefano</h1>
<h2>One of the greatest satisfactions is to create something on your own. My best way to do it's by coding.</h2>

<div id="story"><?= get_about() ?></div>

<h3>Press</h3>
<ul>
	<?php foreach (get_press() as $r) : ?>
		<li>
			<a target="_blank" rel="noopener" href="<?= $r->url ?>">
				<b><?= $r->name ?></b> <span>(<?= date('M Y', strtotime($r->date)) ?>)</span>
			</a>
		</li>
	<?php endforeach; ?>
</ul>
<br/>

<h3>Everywhere</h3>
<ul>
	<?php foreach (get_socials() as $e) : ?>
		<li><a target="_blank" rel="noopener" href="https://www.kopiro.it/<?= strtolower($e->service) ?>"><b><?= $e->service ?></b></a></li>
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

<h6><a target="_blank" rel="noopener" href="https://pgp.mit.edu/pks/lookup?op=get&search=0xEDE51005D982268E">GPG: 0xEDE51005D982268E</a></h6>

<?php require 'footer.php'; ?>
