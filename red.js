

//	RedJS library v. 0.8

//	by: Archy Sharp
//	see https://github.com/homobel/redjs for details

//	Licensed under the MIT license.



/* --------------------######-------------------- Default obj's extension & --- */


(function(A) {

	// Back compatibility js 1.6

	if(!A.indexOf) {

		A.indexOf = function(object) {
			for(var i = 0, l = this.length; i < l; i++) {
				if(i in this && this[i] === object) return i;
			}
			return -1;
		};

		A.lastIndexOf = function(object) {
			for(var i = this.length - 1; i >= 0; i--) {
				if(i in this && this[i] === object) return i;
			}
			return -1;
		};

		A.forEach = function(fn, thisObj) {
			for(var i = 0, l = this.length; i < l; i++) {
				if(i in this) fn.call(thisObj, this[i], i, this);
			}
		};

		A.map = function(fn, thisObj) {
			var result = new Array(this.length);
			for(var i = 0, l = this.length; i < l; i++) {
				if(i in this) result[i] = fn.call(thisObj, this[i], i, this);
			}
			return result;
		};

		A.filter = function(fn, thisObj) {
			var result = [];
			for(var i = 0, l = this.length; i < l; i++) {
				if(i in this && fn.call(thisObj, this[i], i, this)) result.push(this[i]);
			}
			return result;
		};

		A.every = function(fn, thisObj) {
			for(var i = 0, l = this.length; i < l; i++) {
				if(i in this && !fn.call(thisObj, this[i], i, this)) return false;
			}
			return true;
		};

		A.some = function(fn, thisObj) {
			for(var i = 0, l = this.length; i < l; i++) {
				if(i in this && fn.call(thisObj, this[i], i, this)) return true;
			}
			return false;
		};

	}

	// additional

	A.forEachInvert = function(fn, thisObj) {
		for(var i = this.length; i--;) {
			if(i in this) fn.call(thisObj, this[i], i, this);
		}
	};

	A.copy = function() {
		return this.slice(0);
	};

	A.del = function(n) {
		if(n in this) this.splice(n, 1);
		return this;
	};

	A.linear = function() {
		var M = [];
		function linear(m) {
			if(m instanceof Array) m.forEach(linear);
			else M.push(m);
		}
		linear(this);
		return M;
	};

	A.pushOnce = function(n) {
		var index = this.indexOf(n);
		if(!~index) {this.push(n); return this.length-1;}
		return index;
	};

	A.toggle = function(n) {
		var index = this.indexOf(n);
		if(index == -1) this.push(n);
		else this.del(index);
		return index;
	};

})(Array.prototype);

(function(S) {

	S.isMail = function() {
		return !!~this.search(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/);
	};

	S.hasWord = function(word) {
		if(this.search('\\b' + word + '\\b') == -1) return false;
		return true;
	};

	S.camelCase = function() {
		return this.replace(/-\D/g, function(match) {
			return match.charAt(1).toUpperCase();
		});
	};

	S.toInt = function(base) {
		return parseInt(this, base || 10);
	};

	S.toFloat = function(base) {
		return parseFloat(this);
	};

	function tenBasedColor(string) {
		if(string.length === 1) string += string;
		return string.toInt(16).limit(0, 255);
	}

	S.getColors = function() {
		var M;
		if(this.charAt(0) == '#') {
			if(this.length == 4) M = this.match(/\w/g).map(tenBasedColor);
			else M = this.match(/\w{2}/g).map(tenBasedColor);
		}
		else {
			M = this.match(/\d{1,3}/g);
			if(M) M = M.map(function(c) {return c.toInt().limit(0, 255);});
		}
		return M || [];
	};

	S.toRgb = function() {
		var colors = this.getColors();
		if(colors[0] && colors[1] && colors[2]) return 'rgb('+colors.join(',')+')';
		return false;
	};

	S.toHex = function() {
		var colors = this.getColors();
		if(colors[0] && colors[1] && colors[2]) return '#'+colors.map(function(c) {
			var color = c.toString(16);
			return (color.length === 1)?0+color:color;
		}).join('');
		return false;
	};

})(String.prototype);

(function(N) {

	N.limit = function(a, b) {
		if(b === undefined) return this;
		var min = Math.min(a, b), max = Math.max(a, b);
		return Math.min(max, Math.max(min, this));
	};

	N.toInt = function(base) {
		return parseInt(this, base || 10);
	};

	N.toFloat = function(base) {
		return parseFloat(this);
	};

	N.rand = function() {
		return (this*Math.random()).toInt();
	}

})(Number.prototype);
/* --------------------######-------------------- FRAMEWORK --- */

(function(win) {

	var	redjs = function(name, node) {return new redjsCollection(name, node);},
		_ = redjs,
		hash = ('redjs'+Math.random()).replace('.', ''),
		type,
		doc = document,
		docElem = doc.documentElement;

	_.hash = hash;
	_.proto = {};

	function redjsCollection(name, context) {
		this.ns = getNodes(name, context);
		this.length = this.ns.length;
	}

	redjsCollection.prototype = _.proto;

	_.multi = function() {
		var M = _();
		for(var i = 0, l = arguments.length; i<l; i++) {
			M.include(arguments[i]);
		}
		return M;
	};

	_.extend = function(obj) {
		if(typeof obj == 'object') {
			for(var prop in obj) {
				if(obj.hasOwnProperty(prop)) _.proto[prop] = obj[prop];
			}
		}
	};


// ########################---------- BROWSER

	(function() {

		var	agent = {},
			nav = navigator.userAgent.toLowerCase();

		if(~nav.search(/firefox/)) {
			agent.firefox = true;
		}
		else if(~nav.search(/msie/)) {
			agent.msie = true;
		}
		else if(~nav.search(/opera/)) {
			agent.opera = true;
		}
		else if(~nav.search(/chrome/)) {
			agent.chrome = true;
		}
		else if(~nav.search(/safari/)) {
			agent.safari = true;
		}

		_.browser = agent;
		_.ielt9 = '\v' == 'v';

	})();

	var ielt9 = _.ielt9;
// ########################---------- TYPE DETERMINANT

	(function() {

		function Type(n) {this.val = n}

		function getType(something) {
			switch(typeof something) {
				case 'undefined': return getType['undefined'];
				case 'boolean': return getType['boolean'];
				case 'number': return getType['number'];
				case 'string': return getType['string'];
				case 'function': if(something.call) {return getType['function'];}
				case 'object': if(something instanceof redjsCollection) {return  getType['redjs'];}
							else if(something === null) {return getType['null'];}
								else if(something instanceof Array) {return getType['array'];}
									else if(something.nodeName && something.nodeType !== undefined) {return getType['node'];}
										else if(something.length !== undefined) {return getType['nodelist'];}
											else if(Object.prototype.toString.call(something) == '[object Object]') {return getType['object'];}
			}
			return getType['unknown'];
		}

		Type.prototype = {
			'toString': function() {return types[this.val];},
			'is': function(typeStr) {
				return types[this.val] == typeStr;
			}
		};

	  	var	types = ['undefined', 'boolean', 'number', 'string', 'function', 'node', 'nodelist', 'array', 'object', 'null', 'redjs', 'unknown'];

		types.forEach(function(c, i) {
			this[c] = new Type(i);
			this[i] = c;
		}, getType);

		type = _.type = getType;

	})();

// ########################---------- OBJECT

	_.isEmptyObj = function(obj) {
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop)) return false;
		}
		return true;
	};

	_.joinObj = function() {
		var O = new Object();
		for(var i = 0; i<arguments.length; i++) {
			if(arguments[i]) {
				for(var p in arguments[i]) if(arguments[i].hasOwnProperty(p)) O[p] = arguments[i][p];
			}
		}
		return O;
	};
// ########################---------- ARRAY

	function toArraySimple(obj) {
		var argType = type(obj);
		if(argType.is('array')) {return obj;}
		else if(argType.is('nodelist')) {
			var arr = [];
			for(var i = 0, l = obj.length; i < l; i++) {
				arr.push(obj[i]);
			}
			return arr;
		}
		else if(argType.is('object')) {
			var arr = [];
			for(var prop in obj) {
				if(obj.hasOwnProperty(prop)) arr.push(obj[prop]);
			}
			return arr;
		}
		else if(argType.is('redjs')) {return obj.ns;}
		else if(argType.is('undefined') || argType.is('null') || argType.is('unknown')) {
			return [];
		}
		else {
			return [obj];
		}
	}

	_.toArray = function() {
		var l = arguments.length;
		if(l > 1) {
			var M = [];
			for(var i = 0; i<l; i++) {
				M = M.concat(toArraySimple(arguments[i]));
			}
			return M;
		}
		else {
			return toArraySimple(arguments[0]);
		}
	};
// ########################---------- SELLECTORS

	_.id = function(name) {
		return doc.getElementById(name);
	};

	_.tag = function(name, node) {
		return (node || doc).getElementsByTagName(name);
	};

	_.className = (function() {
		if(document.getElementsByClassName) return function(name, node) {
			return (node || document).getElementsByClassName(name);
		}
		else return function(name, node) {
			if(name) {

				var	nodes = _.tag('*', node),
					classArray = name.split(/\s+/),
					classes = classArray.length,
					result = [], i,l,j;

				for(i = 0, l = nodes.length; i < l; i++) {
					var trigger = true;
					for(j = 0; j < classes; j++) {
						if(!nodes[i].className.hasWord(classArray[j])) trigger = false;
					}
					if(trigger) result.push(nodes[i]);
				}
				return result;
			}
			else {throw Error('Not enough arguments');}
		}
	})();


	// converting to array methods
	
	function getArrWithElemById(name) {
		return toArraySimple(_.id(name));
	}
	
	function getArrWithElemsByTag(name, node) {
		return toArraySimple(_.tag(name, node));
	}
	
	function getArrWithElemsByClass(name, node) {
		return toArraySimple(_.className(name, node));
	}



	function getNodes(name, node) {

		if(name === undefined || name === '') {return [];}
		var	inContext = !!node,
			firstType = type(name);

		if(inContext) {
			var secondType = type(name);
			if(secondType.is('string')) {
				node = getNodes(node);
			}
			else node = toArraySimple(node);
		}
		if(firstType.is('string')) {
			var firstChar = name.charAt(0);
			if(firstChar == '#') {
				return getArrWithElemById(name.substr(1));
			}
			else if(firstChar == '.') {
				var className = name.substr(1);
				if(inContext) {
					for(var nodes = [], i = 0, l = node.length; i<l; i++) {
						nodes = nodes.concat(getArrWithElemsByClass(className, node[i]));
					}
					return nodes;

				}
				else {
					return getArrWithElemsByClass(className);
				}
			}
			else if(firstChar == '+') {
				return [_.create(name.substr(1))];
			}
			else {
				if(inContext) {
					for(var nodes = [], i = 0, l = node.length; i<l; i++) {
						nodes = nodes.concat(getArrWithElemsByTag(name, node[i]));
					}
					return nodes;

				}
				else {
					return getArrWithElemsByTag(name);
				}
			}
		}
		else if (firstType.is('redjs')) {
			return name.ns;
		}
		else {
			return toArraySimple(name);
		}
	}



// ########################---------- DATA MODULE

	(function() {

		var	cacheNextVal = 0,
			dataHash = 'data___'+hash;

		function hookCache(node) {
			node[dataHash] = cacheNextVal++;
			_.dataCache[node[dataHash]] = {};
		}

		function data(node, name, val) {
			if(node) {
				var key = node[dataHash];
				if(arguments.length == 2)  {
					if(key !== undefined) {
						return _.dataCache[key][name];
					}
					return undefined;
				}
				else if(arguments.length === 3) {
					if(val === null) {
						delete _.dataCache[key][name];
					}
					else {
						if(key === undefined) {hookCache(node);}
						_.dataCache[node[dataHash]][name] = val;
						return val;
					}
				}
			}
		}

		_.data = data;
		_.dataCache = {};

		_.extend({

			'data': function(name, val) {
				if(name !== undefined && name !== '') {
					if(arguments.length == 2) {
						this.ns.forEach(function(c) {
							_.data(c, name, val);
						});
					}
					else {
						if(this.ns[0]) return _.data(this.ns[0], name);
					}
				}
				return this;
			}

		});

	})();

// ########################---------- DEFFERED

	(function() {

		var	slice = Array.prototype.slice,
			_FuncList = {
				'exec': function(obj) {
					this.calls++;
					var args = arguments;
					this.list.forEach(function(c) {
						c.apply(obj, slice.call(args, 1));
					});
					return this;
				},
				'add': function(func) {
					if(func && func.call) {
						this.list.push(func);
					}
					return this;
				},
				'del': function(func, flag) {
					var n = this.list.indexOf(func);
					if(flag) {
						while(~n) {
							this.list.del(n);
							n = this.list.indexOf(func);
						}
					}
					else {
						this.list.del(n);
					}
					return this;
				}
			},
			_Deferred = {
				'resolve': function(context) {
					if(this.status == -1) {
						this.status = 1;
						this.context = context;
						this.arg = slice.call(arguments, 1);
						this.successList.exec.apply(this.successList, arguments);
						this.anywayList.exec.apply(this.anywayList, arguments);
					}
				},
				'reject': function(context) {
					if(this.status == -1) {
						this.status = 0;
						this.context = context;
						this.arg = slice.call(arguments, 1);
						this.errorList.exec.apply(this.errorList, arguments);
						this.anywayList.exec.apply(this.anywayList, arguments);
					}
				},
				'success': function(func) {
					if(this.status == -1) this.successList.add(func);
					else if(this.status === 1) func.apply(this.context, this.arg);
					return this;
				},
				'error': function(func) {
					if(this.status == -1) this.errorList.add(func);
					else if(this.status === 0) func.apply(this.context, this.arg);
					return this;
				},
				'anyway': function(func) {
					if(this.status == -1) this.anywayList.add(func);
					else if(this.status === 0) func.apply(this.context, this.arg);
					return this;
				}
			};

		function FuncList() {
			this.calls = 0;
			this.list = [];
		}

		function Deferred() {
			this.status = -1;
			this.errorList = new FuncList();
			this.successList = new FuncList();
			this.anywayList = new FuncList();
		}

		FuncList.prototype = _FuncList;
		Deferred.prototype = _Deferred;

		_.funcList = function() {
			return new FuncList();
		};

		_.deferred = function() {
			return new Deferred();
		};

		_.when = function() {

			var	when = new Deferred(),
				args = arguments,
				i, l = args.length,
				counter = 0,
				err = false;

			for(i = 0; i<l; i++) {
				if(args[i] instanceof Deferred) {
					args[i].success(function() {
						if(++counter == l) {
							if(err) {when.reject();}
							else {when.resolve();}
						}
					}).error(function() {
						err = true;
						if(++counter == l) {when.reject();}
					});
				}
			}
			return when;
		};

	})();

// ########################---------- CSS

	(function() {

		_.gstyle = (function() {
			if (!win.getComputedStyle) return function(node, rule) {
				return node.currentStyle[rule];
			};
			else return function(node, rule) {
				return win.getComputedStyle(node, null)[rule];
			};
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
			var height;
			if(padding) {
				height = node.offsetHeight;
			}
			else {
				height = _.gstyle(node, 'height').toInt();
				if(isNaN(height)) height = 0;
			}
			if(border) {
				var	borderTopWidth = _.css(node, 'borderTopWidth'),
					borderBottomWidth = _.css(node, 'borderBottomWidth');
				borderTopWidth = isNaN(borderTopWidth)?0:borderTopWidth.toInt();
				borderBottomWidth = isNaN(borderBottomWidth)?0:borderBottomWidth.toInt();
				height += borderTopWidth+borderBottomWidth;
			}
			else {
				border = 0;
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

// ########################----------- EVENTS

	(function() {

		var	addEvent = (function() {
				if(win.addEventListener) {
					return function(node, type, handler) {node.addEventListener(type, handler, false);};
				} else {
					return function(node, type, handler) {node.attachEvent('on'+type, handler);};
				}
			})(),
			delEvent = (function() {
				if(win.removeEventListener) {
					return function(node, type, handler) {node.removeEventListener(type, handler, false);};
				} else {
					return function(node, type, handler) {node.detachEvent('on'+type, handler);};
				}
			})(),

			fixEvent = (function() {
				if(!ielt9) {
					return function(e) {
						return e;
					}
				}
				else {
					return function() {
						var e = win.event, html = document.documentElement, body = document.body;
						e.target = e.srcElement;
						e.relaredTarget = (e.target==e.fromElemet)?e.toElement:e.fromElement;
						e.stopPropagation = stopPropagation;
						e.charCode = e.keyCode;
						e.preventDefault = preventDefault;
						e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
						e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
						return e;
					}
				}
			})(),

			_EventData = {
				'set': function(event, func, once) {
					if(this.events[event] === undefined) this.events[event] = [];
					if(once) this.events[event].pushOnce(func);
					else this.events[event].push(func);
				},
				'unset': function(eventType, func) {
					var event = this.events[eventType];
					if(event === undefined) return 0;
					event.del(event.indexOf(func));
					if(event.length === 0) {delete this.events[eventType]; return 0;}
					return event.length;
				},
				'clear': function(event) {
					delete this.events[event];
				},
				'call': function(node, e) {
					var event = this.events[e.type];
					if(event) {
						event.forEach(function(c) {
							if(c.call(node, e) === false) {e.preventDefault();}
						});
					}
				}
			};

		function EventData() {
			this.events = {};
		}

		EventData.prototype = _EventData;



		function preventDefault() {
			this.returnValue = false;
		}

		function stopPropagation() {
			this.cancelBubble = true;
		}




		function EventController() {

			var	eventHash = 'event___'+hash,
				handlerHash = 'handler___'+hash,

				_this = this,

				eventsList = ['abort', 'load', 'unload', 'click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove', 'focus', 'blur', 'change', 'submit', 'keypress', 'keydown', 'keyup'],
				eventsType = {
					'UIEvents': ['DOMFocusIn', 'DOMFocusOut', 'DOMActivate'],
					'MouseEvents': ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove'],
					'HTMLEvents': ['load', 'unload', 'abort', 'error', 'select', 'change', 'submit', 'reset', 'focus', 'blur', 'resize', 'scroll'],
					'KeyboardEvent': ['keypress', 'keydown', 'keyup'],
					'MutationEvent': ['DOMSubtreeModified', 'DOMNodeInserted', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument', 'DOMNodeInsertedIntoDocument', 'DOMAttrModified', 'DOMCharacterDataModified']
				},

				createEvent = (function() {
					if(ielt9) {
						return function(type, e, params) {
							var e = doc.createEventObject(e);
							if(params && !params.type) params.type = type;
							for(var prop in params) {
								e[prop] = params[prop];
							}
							return e;
						};
					}
					else {
						return function(type, e, params) {
							e = _.joinObj(e, params);
							var	etype = getEventType(type, e),
								event = document.createEvent(etype);
							if(etype === 'MouseEvents') event.initMouseEvent(type, !e.cancelBubble, !!e.cancelable, win, 1, e.sceenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);
							else if(etype === 'UIEvents') event.initUIEvent(type, !e.cancelBubble, !!e.cancelable, win, 1);
							else if(etype === 'KeyboardEvent') event.initKeyboardEvent(type, !e.cancelBubble, !!e.cancelable, win, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.keyCode, e.charCode);
							else if(etype === 'MutationEvent') event.initEvent(type, !e.cancelBubble, !!e.cancelable, e.relatedNode, e.prevValue, e.newValue, e.attrName, e.attrChange);
							else event.initEvent(type, !e.cancelBubble, !!e.cancelable); // HTMLEvents
							return event;
						};
					}
				})(),

				fireEvent = (function() {
					if(ielt9) return function(node, type, e, params) {
						e = createEvent(type, e, params);
						try {node.fireEvent('on'+type, e);}
						catch(err) {
							getNodeEventData(node).call(node, e);
							if(!e.cancelBubble && node.parentNode) {fireEvent(node.parentNode, 'type', e);}
						}
						return e;
					};
					else return function(node, type, e, params) {
						e = createEvent(type, e, params);
						node.dispatchEvent(e);
						return e;
					};
				})();


			if(_.browser.msie || _.browser.opera) {
				eventsList.push('mouseenter', 'mouseleave');
				eventsType.MouseEvents.push('mouseenter', 'mouseleave');
			}

			// Inner

			function getEventType(type, e) {
				if(e && e.type) type = e.type;
				for(var prop in eventsType) {
					if(~eventsType[prop].indexOf(type)) return prop;
				}
				return 'HTMLEvents';
			}

			function execute(e) {
				e = fixEvent(e);
				getNodeEventData(this).call(this, e);
			}

			function getNodeEventData(node, instance) {
				return _.data(node, eventHash) || _.data(node, eventHash, new EventData);
			}

			function setNodeEventData(node, obj) {
				_.data(node, eventHash, obj);
			}

			// Public

			this.list = eventsList;
			this.artificial = {};


			this.add = function(node, event, method, once) {
				getNodeEventData(node).set(event, method, once);
				if(!node[handlerHash]) node[handlerHash] = function(e) {
					getNodeEventData(node).call(node, fixEvent(e));
				};
				try {addEvent(node, event, node[handlerHash]);} catch(err) {}
				if(_this.artificial[event]) {
					_this.add(node, _this.artificial[event].base, _this.artificial[event]['ini'], true);
				}
			};

			this.copyEvents = function(clone, node) {
				var nodeEventData = getNodeEventData(node);
				if(!_.isEmptyObj(nodeEventData)) {
					setNodeEventData(clone, nodeEventData);
					clone[handlerHash] = function(e) {getNodeEventData(clone).call(clone, fixEvente(e));};
					for(var prop in nodeEventData.events) {
						try {addEvent(clone, prop, clone[handlerHash]);} catch(err) {}
						if(_this.artificial[prop]) {
							_this.add(clone, _this.artificial[prop].base, _this.artificial[prop]['ini'], true);
						}
					}
				}
			};

			this.del = function(node, event, method) {
				var rest = getNodeEventData(node);
				if(rest.unset(event, method) === 0) {
					try {delEvent(node, event, node[handlerHash]);} catch(err) {}
					if(_.isEmptyObj(rest.events)) delete node[handlerHash];
					if(_this.artificial[event]) {_this.del(node, _this.artificial[event].base, _this.artificial[event].ini);}
				}
			};

			this.clear = function(node, event) {
				var rest = getNodeEventData(node);
				rest.clear(event);
				delEvent(node, event, node[handlerHash]);
				if(_this.artificial[event]) {_this.del(node, _this.artificial[event].base, _this.artificial[event].ini);}
				if(_.isEmptyObj(rest.events)) delete node[handlerHash];
			};

			this.create = function(params) {
				if(~eventsList.indexOf(params.name)) return;
				params.condition = params.condition || function() {return true;};
				_.event.artificial[params.name] = _.joinObj({
					'ini': function(e) {
						if(params.condition.call(this, e)) {
							_.force(this, params.name, e, {'cancelBubble': true});
						}
					}
				}, params);
			};

			this.force = function(node, eventType, e, params) {
				if(node && eventType) {
					return fireEvent(node, eventType, e, params);
				}
				else {throw Error('Not enough arguments');}
			};

			this.fix = fixEvent

		}

		_.event = new EventController();

		_.force = _.event.force;

		_.bind = _.event.add;
		_.unbind = _.event.del;

		_.addEvent = addEvent;
		_.delEvent = delEvent;

		_.extend({

			'bind': function(event, action) {
				this.ns.forEach(function(c) {
					_.bind(c, event, action);
				});
				return this;
			},
			'unbind': function(event, action) {
				this.ns.forEach(function(c) {
					_.unbind(c, event, action);
				});
				return this;
			},
			'force': function(event_type) {
				this.ns.forEach(function(c) {
					_.force(c, event_type);
				});
				return this;
			},
			'clearEvent': function(ev) {
				this.ns.forEach(function(c) {
					_.event.clear(c, ev);
				});
				return this;
			}

		});

	})();

// --------- EVENTS ADDING

	(function() {

		var events = _.event.list.copy();

		function contains(node, child) {
			return toArraySimple(_.tag('*', node)).some(function(c) {
				return c === child
			});
		}
		function parentCheck(event) {
			var related = event.relatedTarget, resp, parent = contains(this, related);
			if(related == null) return true;
			if(!related) return false;
			resp = (related !== this && related.tagName !== docElem && related.prefix !== 'xul' && !parent);
			if(!resp) event.stopPropagation();
			return resp;
		}

		if(!_.browser.msie) {

			_.event.create({
				'name': 'mouseenter',
				'base': 'mouseover',
				'condition': parentCheck
			});

			_.event.create({
				'name': 'mouseleave',
				'base': 'mouseout',
				'condition': parentCheck
			});

			events.push('mouseenter', 'mouseleave');
		}

		events.forEach(function(c) {
			var ev = {};
			ev[c] = function(method) {
					this.ns.forEach(function(cc) {_.event.add(cc, c, method);});
					return this;
				};
			_.extend(ev);
		});

	})();
// ########################---------- PROTO EXTENSION

	_.extend({

		'each': function(f, context) {
			this.ns.forEach(f, context);
			return this;
		},

		'include': function() {
			for(var i = 0, l = arguments.length; i < l; i++) {
				var nodes = getNodes(arguments[i]);
				nodes.forEach(function(c) {
					if(!~this.ns.indexOf(c)) {
						this.ns.push(c)
					}
				}, this);
				this.length = this.ns.length;
			}
			return this;
		},
		'exclude': function() {
			for(var i = 0, l = arguments.length; i < l; i++) {
				var nodes = getNodes(arguments[i]);
				this.ns = this.ns.filter(function(c) {
					return !~nodes.indexOf(c);
				}, this);
				this.length = this.ns.length;
			}
			return this;
		},

		'eq': function(n) {
			if(this.ns[n]) return _(this.ns[n]);
			return this;
		},
		'first': function() {
			return this.eq(0);
		},
		'last': function() {
			return this.eq(this.length-1);
		},
		'filter': function(func) {
			if(this.length > 0 && func.call) {
				var M = this.ns.filter(function(c) {
						return func.call(c);
					return true;
				});
				return _(M);
			}
			return this;
		},
		'find': function(selector) {
			return _(selector, this);
		}

	});



	_.extend({

		'val': function(value) {
			if(value !== undefined) {
				this.ns.forEach(function(c) {
					c.value = value;
				});
				return this;
			}
			else {
				if(this.ns[0]) return this.ns[0].value;
			}
		}

	});// compatibility

	_.easyModeOn = function() {
		if(!win._) {win._ = _; return true;}
		return false;
	};

	_.easyModeOff = function() {
		if(win._ == _ && win._ === redjs) {delete win._; return true;}
		return false;
	};


// ########################---------- AJAX

	(function() {

		_.aj = {};

		_.aj.obj = function() {
			return new XMLHttpRequest();
		};

		_.aj.settings = {
			'type': 'post',
			'url': location.href,
			'user': null,
			'password': null,
			'contentType': {
				'xml': 'application/xml, text/xml',
				'html': 'text/html',
				'text': 'text/plain',
				'json': 'application/json, text/javascript',
				'script': 'text/javascript',
				'urlencoded': 'application/x-www-form-urlencoded',
				'multipart': 'multipart/form-data'
			},
			'accept': 'json',
			'interval': 150,
			'longReq': 60000,
			'middleReq': 30000
		};

		function encodeData(obj) {
			if(type(obj).is('object')) {
				var data=[];
				for(var prop in obj) {
					data.push(prop+'='+encodeURIComponent(obj[prop]));
				}
				data = data.join('&');
				return data;
			}
			return '';
		}

		function ajaxParams(params) {
			if(!(params instanceof Object)) {
				this.url = params;
			}
			else {
				for(var prop in params) {
					this[prop] = params[prop];
				}
			}
		}

		// OPTIONS: url (str), type (str), before (F), interval (uint), timeout (uint), data (Obj), context(Obj), dataType/send (str), accept (str), user (str), password (str)

		ajaxParams.prototype = _.aj.settings;

		_.aj.query = function(params, xmlreq) {

			params = new ajaxParams(params);

			var	d = _.deferred(),
				resptimer,
				timeout;

			xmlreq = xmlreq || _.aj.obj();

			function checkStatus() {
				if (xmlreq.readyState == 4 && xmlreq.status == 200) {
					clearInterval(timeout);
					clearInterval(resptimer);
					var resp = (params.accept == 'xml')?xmlreq.responseXML:xmlreq.responseText;
					d.resolve(params.context, resp);
				}
			}

			if(params.before instanceof Function) {
				params.before();
			}

			if(type(params.timeout).is('number')) {
				timeout = setTimeout(function() {
					clearInterval(resptimer);
					d.reject(params.context, 'timeout');
				}, params.timeout);
			}

			resptimer = setInterval(checkStatus, params.interval);

			var accept = _.aj.settings.contentType[params.accept];

			if(params.type == 'post') {
				xmlreq.open('post', params.url, true);
				xmlreq.setRequestHeader('Content-Type', _.aj.settings.contentType.urlencoded);
				xmlreq.setRequestHeader('Accept', accept);
				xmlreq.send(encodeData(params.data));
			}
			else {
				xmlreq.open('get', params.url+'?'+encodeData(params.data), true);
				xmlreq.setRequestHeader('Accept', accept);
				xmlreq.send(null);
			}

			d.error(function() {
				xmlreq.abort();
			});

			return d;
		};

		_.getScript = function(url, flag) {
			var script =  _.aj.query({'url': url, 'accept': 'script'});
			if(!flag) {
				script.success(function(data, context) {
					eval.call(context, data);
				});
			}
			return script;
		};

	})();

// ########################----------- ANIMATION

	(function() {

		var	animationDelay = 16,
			fn = {
				'linear': function(x) {
					return x;
				},
				'swing': function(x) {
					return (-Math.cos(x*Math.PI)/2)+0.5;
				}
			},
			animationData = 'animation___'+hash;

		function animationStatus(node, type, val) {
			var animData = _.data(node, animationData) || _.data(node, animationData, {});
			if(val !== undefined) {animData[type] = val; return;}
			return animData[type];
		}

		_.animate = function(node, type, terminal, time, callback, fnName) {

			function changeCss() {
				var	now = Date.now() - start,
					progress = now / time,
					result = ((terminal - current)*easing(progress)+current).limit(current, terminal);

				_.css(node, type, result+unit);

				if(progress < 1) {
					node[timerName] = setTimeout(changeCss, animationDelay);
				}
				else {
					_.css(node, type, terminal);
					animationStatus(node, type, '');
					if(callback) {callback.call(node);}
				}
			}

			var	currentAnimStatus = animationStatus(node, type),
				currCss = _.css(node, type).toString(),
				current = (type == 'opacity')?currCss.toFloat():currCss.toInt(),
				diff = current-terminal,
				animStatus = (diff<0)?0:1,
				timerName = 'animation_'+type+'___'+hash;

			if(currentAnimStatus !== animStatus && diff !== 0) {
				if(currentAnimStatus !== undefined) {clearTimeout(node[timerName]);}

				var	unit = currCss.match(/[a-z]+/),
					easing = fn[fnName] || fn['swing'],
					start = Date.now();

				unit = (unit)?unit:'';
				animationStatus(node, type, animStatus);

				node[timerName] = setTimeout(changeCss, animationDelay);
			}

		};

		_.hide = function(node, time, callback) {
			if(time) {
				_.animate(node, 'opacity', 0, time, function() {
					node.style.display = 'none';
					if(callback) callback();
				});
			}
			else {
				if (!node.display) {
					var display = _.gstyle(node, 'display');
					if(display != 'none') {node.display = display}
					else {node.display = 'block';}
				}
				node.style.display = 'none';
			}
		};

		_.show = function(node, time, callback) {
			if(time) {
				if(_.gstyle(node, 'display') == 'none') {
					_.css(node, 'opacity', 0);
					node.style.display = 'block';
				}
				_.animate(node, 'opacity', 1, time, function() {
					if(callback) callback();
				});
			}
			else {
				node.style.display = node.display || 'block';
			}
		};


		_.extend({

			'hide': function(time, callback) {
				this.ns.forEach(function(c) {
					_.hide(c, time, callback);
				});
				return this;
			},
			'show': function(time, callback) {
				this.ns.forEach(function(c) {
					_.show(c, time, callback);
				});
				return this;
			},
			'animate': function(type, terminal, time, fnName, callback) {
				this.ns.forEach(function(c) {
					_.animate(c, type, terminal, time, fnName, callback);
				});
				return this;
			}

		});

	})();

// ########################----------- COOKIES

	(function() {

		function getCookie(name) {
			if(name && new RegExp('(?:^|;\\s*)' + name + '=([^;]*)').test(document.cookie)) {
				return decodeURIComponent(RegExp.$1);
			}
		}

		function setCookie(name, value, days, attrs) {
			var cookie = [name+'='+encodeURIComponent(value || '')];
			if(days) cookie.push('max-age='+days*86400);
			if(attrs) for(var prop in attrs) {
				cookie.push(prop+'='+attrs[prop]);
			}
			document.cookie = cookie.join('; ');
		}

		_.cookie = function(name, value, days, attr) {
			if(arguments.length < 2) {
				return getCookie(name);
			}
			else {
				setCookie(name, value, days, attr);
			}
		};

	})();

// ########################----------- DEBUG

(function() {

	_.props = function(obj) {
		var result = [];
		for(var prop in obj) {result.push(prop+' = '+obj[prop]);}
		console.log(result.join('\n'));
	};

	_.time = function(func) {
		var t = Date.now();
		func();
		return Date.now()-t;
	};

})();
if(!win.JSON) {
	win.JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {


        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }


        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':


            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

            return String(value);


        case 'object':


            if (!value) {
                return 'null';
            }


            gap += indent;
            partial = [];


            if (Object.prototype.toString.apply(value) === '[object Array]') {


                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {


                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {


            var i;
            gap = '';
            indent = '';


            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }


            } else if (typeof space === 'string') {
                indent = space;
            }


            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            return str('', {'': value});
        };
    }


    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

            var j;

            function walk(holder, key) {

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {


                j = eval('(' + text + ')');

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

            throw new SyntaxError('JSON.parse');
        };
    }
}());
// --------- GLOBALS

	if(!win._) win._ = _;
	win.redjs = redjs;

})(window);





