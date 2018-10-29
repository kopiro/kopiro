CREATE TABLE `oss_projects`
(
  `id` int
(11) unsigned NOT NULL AUTO_INCREMENT,
  `github_id` int
(11) DEFAULT NULL,
  `year` int
(11) DEFAULT NULL,
  `name` varchar
(4000) DEFAULT NULL,
  `description` varchar
(4000) DEFAULT NULL,
  `visible` tinyint
(1) NOT NULL DEFAULT '0',
  `role` varchar
(255) DEFAULT NULL,
  `url` varchar
(255) DEFAULT NULL,
  `stars_count` int
(11) DEFAULT NULL,
  `forks_count` int
(11) DEFAULT NULL,
  `fork` tinyint
(1) NOT NULL DEFAULT '0',
  `owner` varchar
(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON
UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY
(`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `press`
(
  `id` int
(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar
(255) DEFAULT NULL,
  `url` text,
  `medium_id` varchar
(100) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `claps_count` int
(11) DEFAULT NULL,
  `visible` tinyint
(1) NOT NULL DEFAULT '1',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON
UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY
(`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `projects`
(
  `id` int
(11) unsigned NOT NULL AUTO_INCREMENT,
  `year` int
(11) DEFAULT NULL,
  `name` varchar
(255) DEFAULT NULL,
  `description` text,
  `visible` tinyint
(1) NOT NULL DEFAULT '1',
  `role` varchar
(255) DEFAULT NULL,
  `company` varchar
(100) DEFAULT NULL,
  `url` varchar
(4000) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON
UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY
(`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `socials`
(
  `id` int
(11) unsigned NOT NULL AUTO_INCREMENT,
  `service` varchar
(255) DEFAULT NULL,
  `username` varchar
(255) DEFAULT NULL,
  PRIMARY KEY
(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;