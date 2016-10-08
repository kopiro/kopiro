var liTpl = _.template( $('#list-tpl').html() );

$.getJSON('http://api.kopiro.it', function(data) {
	_.each([ 'repos', 'carepos', 'gists', 'posts' ], function(type) {
		var $section = $('#' + type + ' > ul');
		var html = '';
		_.each(data[type], function(r) {
			r.type = type;
			html += liTpl(r);
		});
		$section.html(html);
	});
});
