
// ########################---------- DOM MANIPULATION

	(function() {

		var	nodeTypeDefault = [1];

		function simpleAttrParser(rule) {
			var res = {};
			rule = rule.split(/(?=[#.])/).forEach(function(c) {
				var first = c.charAt(0);
				if(first === '#') res.id = c.substr(1);
				else if(first === '.') res.className = c.substr(1);
				else if(c.length) res.tagName = c.toUpperCase();
			});
			return res;
		}

		function nodesFromString(str) {
			var fragment = _.create('div');
			fragment.innerHTML = str;
			return fragment.childNodes;
		}

		_.create = function(tagName, attr) {
			var node = doc.createElement(tagName);
			if(attr) for(var prop in attr) node.setAttribute(prop, attr[prop]);
			return node;
		};

		_.wrap = function(node, wrapper, attr) {
			if(wrapper.hasWord) wrapper = _.create(wrapper, attr);
			node.parentNode.insertBefore(wrapper, node);
			wrapper.appendChild(node);
		};

		_.wrapInner = function(node, wrapper, attr) {
			if(wrapper.hasWord) wrapper = _.create(wrapper, attr);
			for(var n = node.childNodes; n[0]; wrapper.appendChild(n[0])) {}
			node.appendChild(wrapper);
		};

		_.children = function(node, rule, nodeTypes) {
			if(typeof rule == 'string') rule = simpleAttrParser(rule || '');
			nodeTypes = nodeTypes || nodeTypeDefault;
			var c = node.childNodes, C = [];
			mainIterator: for(var i = 0, l = c.length; i < l; i++) {
				for(var j = 0, k = nodeTypes.length; j < k; j++) if(c[i].nodeType !== nodeTypes[j]) continue mainIterator;
				for(var p in rule) if(c[i][p] !== rule[p]) continue mainIterator;
				C.push(c[i]);
			}
			return C;
		};

		_.parent = function(node, rule) {
			if(typeof rule == 'string') rule = simpleAttrParser(rule || '');
			mainIterator: for(var parent = node; parent = parent.parentNode;) {
				for(var prop in rule) if(parent[prop] !== rule[prop]) continue mainIterator;
				return parent;
			}
			return null;
		};

		_.clone = function(node, param) {
			var clone = node.cloneNode(param);
			_.event.copyEvents(clone, node);
			if(param) {
				var clones = _.tag('*', clone), nodes = _.tag('*', node);
				for(var i = 0, l = nodes.length; i < l; i++) {
					_.event.copyEvents(clones[i], nodes[i]);
				}
			}
			return clone;
		};

		_.remove = function(node) {
			node.parentNode.removeChild(node);
		};

		_.before = function(what, where) {
			var M = [];
			if(typeof what === 'string') what = nodesFromString(what);
			what = toArraySimple(what);
			what.forEach(function(c) {
				M.push(c);
				where.parentNode.insertBefore(c, where);
			});
			return M;
		};

		_.append = function(what, where) {
			var M = [];
			if(typeof what === 'string') what = nodesFromString(what);
			what = toArraySimple(what);
			what.forEach(function(c) {
				M.push(c);
				where.appendChild(c);
			});
			return M;
		};

		_.firstChild = function(node, child) {
			if(child === undefined) {
				child = node.firstChild;
				while(child.nodeType !== 1 && child.nextSibling) {
					child = child.nextSibling;
				}
				if(child.nodeType === 1) return child;
				return undefined;
			}
			else {
				if(typeof child == 'string') child= _.create(child);
				node.insertBefore(child, node.firstChild);
				return child;
			}
		};

		_.getNodeText = function(node) {
			return node.text || node.textContent || '';
		};


	// --------- CLASS MANIPULATION

		_.addClass = function(node, name) {
			if(!node.className.hasWord(name)) {
				if(!node.className) {node.className = name;}
				else {node.className += ' ' + name;}
			}
		};

		_.delClass = function(node, name) {
			node.className = node.className.replace(new RegExp('[ ]*\\b' + name +'\\b'), '');
		};

		_.hasClass = function(node, name) {
			return node.className.hasWord(name);
		};

		_.toggleClass = function(node, name) {
			if(node.className.hasWord(name)) {
				_.delClass(node, name);
				return false;
			}
			else {
				_.addClass(node, name);
				return true;
			}
		};

		_.extend({

			'children': function(rule) {
				var M = _();
				if(typeof rule == 'string') rule = simpleAttrParser(rule || '');
				this.ns.forEach(function(c) {
					M.include(_.children(c, rule));
				});
				return M;
			},
			'parent': function(rule) {
				var M = _();
				if(typeof rule == 'string') rule = simpleAttrParser(rule || '');
				this.ns.forEach(function(c) {
					M.include(_.parent(c, rule));
				});
				return M;
			},
			'firstChild': function(child) {
			    	var M = _();
				if(child === undefined) {
					this.ns.forEach(function(c) {
						M.include(_.firstChild(c));
					});
					return M;
				}
				else {
					this.each(function(c) {
						M.include(_.firstChild(c, child));
					});
					return M;
				}
			},
			'clone': function(all) {
				var M = _();
				this.ns.forEach(function(c) {
					M.include(_.clone(c, all));
				});
				return M;
			},
			'wrap': function(wrapper) {
				this.ns.forEach(function(c) {
					_.wrap(c, wrapper);
				});
				return this;
			},
			'remove': function(node) {
				this.ns.forEach(function(c) {
					_.remove(c);
				});
				return this;
			},
			'html': function(html) {
				if(html !== undefined) {
					this.ns.forEach(function(c) {
						c.innerHTML = html;
					});
				}
				else {
					if(this.ns[0]) return this.ns[0].innerHTML;
				}
				return this;
			},
			'append': function(node) {
				if(this.ns[0]) return _(_.append(node, this.ns[0]).filter(function(c) {return c.nodeType === 1;}));
				return this;
			},
			'appendTo': function(node) {
				_.append(this.ns, node);
				return this;
			},

			'before': function() {
				if(this.ns[0]) return _(_.before(node, this.ns[0]).filter(function(c) {return c.nodeType === 1;}));
			},
			'beforeTo': function(node) {
				_.before(this.ns, node);
				return this;
			},

		// attr manipulation

			'attr': function(name, val) {
				if(arguments.length === 2) {
					this.ns.forEach(function(c) {
						c.setAttribute(name, val);
					});
				}
				else {
					if(this.ns[0]) return this.ns[0].getAttribute(name, 2);
				}
				return this;
			},
			'addClass': function(name) {
				this.ns.forEach(function(c) {_.addClass(c, name);});
				return this;
			},
			'toggleClass': function(name) {
				this.ns.forEach(function(c) {_.toggleClass(c, name);});
				return this;
			},
			'delClass': function(name) {
				this.ns.forEach(function(c) {
					_.delClass(c, name);
				});
				return this;
			},
			'hasClass': function(name) {
				if(this.ns[0]) return _.hasClass(this.ns[0], name);
				else return false;
			}

		});

	})();
