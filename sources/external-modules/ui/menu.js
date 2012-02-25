
//~ <component>
//~	Name: RedJS UI Menus
//~	Info: Menus module
//~ </component>


	_.ui.menu = function(wrap) {

			var	_this = _.ui.menu,
				wrap = _(wrap),
				submenu = '.' + _this.selectors.submenu,
				hover = _this.selectors.hover,
				delay = _this.options.delay,
				duration = _this.options.duration;

			wrap.find(submenu).hide();

			function fixPoints(parent) {

				var	children = parent.children('li'),
					current,
					timer;

				children.each(function(c, i) {

					var	c = _(c),
						sub = c.find(submenu).eq(0);

					c.mouseenter(function(e) {
						if(sub.length > 0) {
							if(current !== undefined) {
								clearTimeout(timer);
								if(current !== c) {
									current.delClass(hover).find(submenu).hide();
								}
							}
							sub.show(duration);
							current = c;
						}
						c.addClass(hover);
					});
					c.mouseleave(function(e) {
						if(sub.length === 0) {c.delClass(hover);}
						else timer = setTimeout(function() {
							c.delClass(hover).find(submenu).hide();
							current = undefined;
						}, delay);
					});

					fixPoints(sub);
				});

			};

			fixPoints(wrap);

	};

	_.ui.menu.selectors = {
		'submenu': 'redjs-menu-sub',
		'hover': 'redjs-hover'
	};

	_.ui.menu.options = {
		'delay': 800,
		'duration': 300
	};

	_.extend({
		'menu': function() {
			this.ns.forEach(function(c) {
				_.ui.menu(c);
			});
			return this;
		}
	});
