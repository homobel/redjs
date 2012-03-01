
//~ <component>
//~	Name: Css
//~	Info: Provides styles API
//~ </component>


	(function() {

		_.gstyle = (function() {
			if (win.getComputedStyle) return function(node, rule) {
				return win.getComputedStyle(node, null)[rule];
			};
			else return function(node, rule) {
				return node.currentStyle[rule];
			};
		})();

		var exceptions = {
			'float': (function() {
				if(_.browser.features.cssFloat) {
					return  function(node, val) {
						if(val === undefined) {
							return _.gstyle(node, 'float') || _.gstyle(node, 'cssFloat');
						}
						else {
							node.style.cssFloat = val;
						}
					}
				}
				else {
					return  function(node, val) {
						if(val === undefined) {
							return _.gstyle(node, 'styleFloat');
						}
						else {
							node.style.styleFloat = val;
						}
					}
				}
			})(),
			'opacity': (function() {
				if(_.browser.features.opacity) {
					return  function(node, num) {
						if(num === undefined) {
							return _.gstyle(node, 'opacity').toFloat();
						}
						else {
							node.style.opacity = num;
						}
					}
				}
				else {
					return  function(node, num) {
						if(num === undefined) {
							var co = _.gstyle(node, 'filter');
							if(co.charAt(0) == 'a') {
								return (co.match(/\d+/)[0]/100).toFloat();
							}
							else return 1;
						}
						else {
							node.style.filter = 'alpha(Opacity='+num*100+')';
						}
					}
				}
			})()
		};

		_.css = function(node, property, value) {
			var propertyType = type(property);
			if(propertyType.is('string')) {
				if(property in exceptions) {
					return exceptions[property](node, value);
				}
				else {
					if(value === undefined) {
						return _.gstyle(node, property);
					}
					else {
						node.style[property] = value;
					}
				}
			}
			else if(propertyType.is('object')) {
				for(var prop in property) {
					_.css(node, prop, property[prop]);
				}
			}
		};

		// sizeing

		_.height = function(node, padding, border, margin) {

			var height = padding ? node.offsetHeight : _.gstyle(node, 'height').toInt() || 0;

			if(padding && !border) {

				var	borderTopWidth = _.gstyle(node, 'borderTopWidth').toInt() || 0,
					borderBottomWidth = _.gstyle(node, 'borderBottomWidth').toInt() || 0;

				height -= borderTopWidth + borderBottomWidth;
			}
			else if(!padding && border) {

				var	borderTopWidth = _.gstyle(node, 'borderTopWidth').toInt() || 0,
					borderBottomWidth = _.gstyle(node, 'borderBottomWidth').toInt() || 0;

				height += borderTopWidth + borderBottomWidth;

			}


			if(margin) {

				var	marginTop = _.gstyle(node, 'marginTop').toInt() || 0,
					marginBottom = _.gstyle(node, 'marginBottom').toInt() || 0;

				height += marginTop + marginBottom;
			}
			return height;
		};

		_.width = function(node, padding, border, margin) {

			var width = padding ? node.offsetWidth : _.gstyle(node, 'width').toInt() || 0;

			if(padding && !border) {

				var	borderLeftWidth = _.gstyle(node, 'borderLeftWidth').toInt() || 0,
					borderRightWidth = _.gstyle(node, 'borderRightWidth').toInt() || 0;

				width -= borderLeftWidth + borderRightWidth;

			}
			else if(!padding && border) {

				var	borderLeftWidth = _.gstyle(node, 'borderLeftWidth').toInt() || 0,
					borderRightWidth = _.gstyle(node, 'borderRightWidth').toInt() || 0;

				width += borderLeftWidth + borderRightWidth;
			}

			if(margin) {

				var	marginLeft = _.gstyle(node, 'marginLeft').toInt() || 0,
					marginRight = _.gstyle(node, 'marginRight').toInt() || 0;

				width += marginLeft + marginRight;
			}
			return width;
		};

		_.screen = {
			width: win.screen.width,
			height: win.screen.height
		};


		// refresh in red.js main file
		_.viewport = {
			width: htmlNode.clientWidth,
			height: htmlNode.clientHeight
		};

		// scroll

		_.scrollTop = function(value) {
			if(value === undefined) {
				return htmlNode.scrollTop;
			}
			else {
				win.scrollTo(htmlNode.scrollLeft, value);
			}
		};

		_.scrollLeft = function(value) {
			if(value === undefined) {
				return htmlNode.scrollLeft;
			}
			else {
				win.scrollTo(value, htmlNode.scrollLeft);
			}
		};

		// offset

		_.offset = function(node) {

			if(node.offsetLeft === undefined) {
				throw TypeError('Invalid node argument');
			}

			var offsetLeft = 0, offsetTop = 0;

			do {
				offsetTop  += node.offsetTop;
				offsetLeft += node.offsetLeft;
			} while (node = node.offsetParent);

			return {
				'top': offsetTop,
				'left': offsetLeft
			};
		};

		_.extend({
			'css': function(name, value) {
				if(value !== undefined || typeof name == 'object') {
					this.ns.forEach(function(c) {
						_.css(c, name, value);
					});
				}
				else {
					if(this.ns[0]) {
						return _.css(this.ns[0], name);
					}
					return '';
				}
				return this;
			},
			'height': function(padding, border, margin) {
				if(this.ns[0]) {
					return _.height(this.ns[0], padding, border, margin);
				}
				return 0;
			},
			'width': function(padding, border, margin) {
				if(this.ns[0]) {
					return _.width(this.ns[0], padding, border, margin);
				}
				return 0;
			},
			'offset': function(padding, border, margin) {
				if(this.ns[0]) {
					return _.offset(this.ns[0]);
				}
				return {
					'top': 0,
					'left': 0
				};
			}
		});

	})();
