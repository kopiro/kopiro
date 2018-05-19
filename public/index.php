<?php

require __DIR__ . '/../app.php';
ob_start('sanitize_output');
require __DIR__ . '/../templates/homepage.php';