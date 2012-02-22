
//~ <component>
//~	Name: RedJS UI Tree
//~	Info: Tree module
//~ </component>


	_.ui.tree = function(node) {

			var	wrap = _(node),
				id = wrap.attr('id'),
				data = uiData(node, 'tree', {}),

				back = _.ui.tree.selectors.back,

				children = data.branches = wrap.children(),
				back = data.back = _('.'+back, node).click(toStart);

			if(id) {_.ui.cache[id] = node;}

			for(var i = 0, l = children.length; i < l; i++) {
				var child = children.eq(i);
				if(child.css('display') != 'none') {
					data.start = child;
					break;
				}
			}

			function toStart() {
				data.branches.hide();
				data.start.show();
			}

			data.toStart = toStart;
	};

	_.ui.tree.selectors = {
		'back': 'back'
	};

	_.extend({
		'tree': function() {
			this.ns.forEach(function(c) {
				_.ui.tree(c);
			});
			return this;
		}
	});
