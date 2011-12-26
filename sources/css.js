
// ########################---------- CSS

	(function() {

		_.gstyle = (function() {
			if (!win.getComputedStyle) {
				return function(node, rule) {return node.currentStyle[rule];}
			} else {
				return function(node, rule) {return win.getComputedStyle(node, null)[rule];}
			}
		})();

		var exceptions = {
			'float': (function() {
				if(ielt9) {
					return  function(node, val) {
						if(val === undefined) {
							return _.gstyle(node, 'styleFloat');
						}
						else {
							node.style.styleFloat = val;
						}
					}
				}
				else {
					return  function(node, val) {
						if(val === undefined) {
							return _.gstyle(node, 'float') || _.gstyle(node, 'cssFloat');
						}
						else {
							node.style.cssFloat = val;
						}
					}
				}
			})(),
			'opacity': (function() {
				if(ielt9) {
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
				else {
					return  function(node, num) {
						if(num === undefined) {
							return _.gstyle(node, 'opacity').toFloat();
						}
						else {
							node.style.opacity = num;
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

		_.height = function(node, padding, border, margin) {
			var height = (padding)?node.offsetHeight:_.gstyle(node, height).toInt();
			if(border) {
				var	borderTopWidth = _.css(node, 'borderTopWidth'),
					borderBottomWidth = _.css(node, 'borderBottomWidth');
				borderTopWidth = isNaN(borderTopWidth)?0:borderTopWidth.toInt();
				borderBottomWidth = isNaN(borderBottomWidth)?0:borderBottomWidth.toInt();
				height += borderTopWidth+borderBottomWidth;
			}
			margin = (margin)?_.gstyle(node, 'marginTop').toInt()+_.gstyle(node, 'marginBottom').toInt():0;
			return height+margin+border;
		};


		_.extend({

			'css': function(name, value) {
				if(value !== undefined || name instanceof Object) {
					this.ns.forEach(function(c) {
						_.css(c, name, value);
					});
				}
				else {
					if(this.ns[0]) return _.css(this.ns[0], name);
				}
				return this;
			},
			'height': function(padding, border, margin) {
				if(this.ns[0]) return _.height(this.ns[0], padding, border, margin);
			}

		});

	})();
