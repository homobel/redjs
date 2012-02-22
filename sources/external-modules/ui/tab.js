
//~ <component>
//~	Name: RedJS UI Tabs
//~	Info: Tabs module
//~ </component>


	_.ui.tab = function(node, params) {

		var	_this = _.ui.tab,
			wrap = _(node),
			id = wrap.attr('id'),
			children = wrap.children(),
			data = uiData(node, 'tab', {}),

			head = _this.selectors.head,
			content = _this.selectors.content,
			current = _this.selectors.current,
			params = params || {};

		if(id) {_.ui.cache[id] = node;}

		data.contents = wrap.find('.'+content).children();
		data.headers = wrap.find('.'+head);
		data.current = 0;

		if('tab-selector' in params) {
			data.headers = data.headers.find(params['tab-selector']);
		}
		else {
			data.headers = data.headers.children();
		}

		data.headers.each(function(c, i) {
			c = _(c);
			c.click(function(e) {
				e.stopPropagation();
				if(!c.hasClass(current)) {
					data.current = i;
					wrap.force('tabIndexChanged');
					data.headers.delClass(current).eq(i).addClass(current);
					data.contents.hide().eq(i).show(params.speed);
				}
			});
		});

	};

	_.ui.tab.selectors = {
		'head': 'tabs-header',
		'content': 'tabs-content',
		'current': 'current'
	};

	_.extend({
		'tab': function(params) {
			this.ns.forEach(function(c) {
				_.ui.tab(c, params);
			});
			return this;
		}
	});
