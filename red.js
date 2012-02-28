
//~	RedJS (C) 2012 Archy Sharp
//~	https://github.com/homobel/redjs
//~	Dual licensed under the MIT and GPL v2 licenses:
//~	- http://www.opensource.org/licenses/mit-license.php
//~	- http://www.gnu.org/licenses/gpl-2.0.html

//~	Json2.js (C) Douglas Crockford
//~	douglas@crockford.com
//~	http://www.JSON.org/


//~ <component>
//~	Name: RedJS
//~	Info: Color your javascript
//~ </component>



//~ <component>
//~	Name: Array 1.6 compatibility
//~	Info: Array 1.6 functions for old browsers (e.g. ie7, ie8)
//~ </component>


(function(A) {

	if(!A.indexOf && !A.forEach) {

		A.indexOf = function(object) {
			for(var i = 0, l = this.length; i < l; i++) {
				if(i in this && this[i] === object) {
					return i;
				}
			}
			return -1;
		};

		A.lastIndexOf = function(object) {
			for(var i = this.length - 1; i >= 0; i--) {
				if(i in this && this[i] === object) {
					return i;
				}
			}
			return -1;
		};

		A.forEach = function(fn, thisObj) {
			for(var i = 0, l = this.length; i < l; i++) {
				if(i in this) {
					fn.call(thisObj, this[i], i, this);
				}
			}
		};

		A.map = function(fn, thisObj) {
			var result = new Array(this.length);
			for(var i = 0, l = this.length; i < l; i++) {
				if(i in this) {
					result[i] = fn.call(thisObj, this[i], i, this);
				}
			}
			return result;
		};

		A.filter = function(fn, thisObj) {
			var result = [];
			for(var i = 0, l = this.length; i < l; i++) {
				if(i in this && fn.call(thisObj, this[i], i, this)) {
					result.push(this[i]);
				}
			}
			return result;
		};

		A.every = function(fn, thisObj) {
			for(var i = 0, l = this.length; i < l; i++) {
				if(i in this && !fn.call(thisObj, this[i], i, this)) {
					return false;
				}
			}
			return true;
		};

		A.some = function(fn, thisObj) {
			for(var i = 0, l = this.length; i < l; i++) {
				if(i in this && fn.call(thisObj, this[i], i, this)) {
					return true;
				}
			}
			return false;
		};

	}

})(Array.prototype);



//~ <component>
//~	Name: Array Prototype
//~	Info: Extends Array prototype
//~ </component>

(function(A) {

	A.forEachInvert = function(fn, thisObj) {
		for(var i = this.length; i--; ) {
			if(i in this) {
				fn.call(thisObj, this[i], i, this);
			}
		}
	};

	A.copy = function() {
		return this.slice(0);
	};

	A.del = function(n) {
		if(n in this) {
			this.splice(n, 1);
		}
		return this;
	};

	A.delByVal = function(value) {
		this.del(this.indexOf(value));
		return this;
	};

	A.linear = function() {
		var M = [];
		function linear(m) {
			if(m instanceof Array) {
				m.forEach(linear);
			}
			else {
				M.push(m);
			}
		}

		linear(this);
		return M;
	};

	A.pushOnce = function(n) {
		var index = this.indexOf(n);
		if(!~index) {
			this.push(n);
			return this.length - 1;
		}
		return index;
	};

})(Array.prototype);


//~ <component>
//~	Name: String Prototype
//~	Info: Extends String prototype
//~ </component>

(function(S) {

	S.isMail = function() {
		return !!~this.search(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/);
	};

	S.hasWord = function(word) {
		if(this.search('\\b' + word + '\\b') == -1) {
			return false;
		}
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

	S.toFloat = function() {
		return parseFloat(this);
	};

	S.toNumber = function() {
		return ~this.indexOf('.') ? this.toFloat() :  this.toInt();
	};

	function tenBasedColor(string) {
		if(string.length === 1) {
			string += string;
		}
		return string.toInt(16).limit(0, 255);
	}

	S.getColors = function() {
		var M;
		if(this.charAt(0) == '#') {
			if(this.length == 4) {
				M = this.match(/\w/g).map(tenBasedColor);
			}
			else {
				M = this.match(/\w{2}/g).map(tenBasedColor);
			}
		}
		else {
			M = this.match(/\d{1,3}/g);
			if(M) {
				M = M.map(function(c) {
					return c.toInt().limit(0, 255);
				});

			}
		}
		return M || [];
	};

	S.toRgb = function() {
		var colors = this.getColors();
		if(colors[0] && colors[1] && colors[2]) {
			return 'rgb(' + colors.join(',') + ')';
		}
		return false;
	};

	S.toHex = function() {
		var colors = this.getColors();
		if(colors[0] && colors[1] && colors[2]) {
			return '#' + colors.map(function(c) {
			var color = c.toString(16);
			return (color.length === 1) ? 0 + color : color;
			}).join('');
		}
		return false;
	};

	S.trim = function(chars) {
		return this.ltrim(chars).rtrim(chars);
	};

	S.ltrim = function(chars) {
		chars = chars || '\\s';
		return this.replace(new RegExp('^[' + chars + ']+', 'g'), '');
	};

	S.rtrim = function(chars) {
		chars = chars || '\\s';
		return this.replace(new RegExp('[' + chars + ']+$', 'g'), '');
	};

})(String.prototype);


//~ <component>
//~	Name: Number Prototype
//~	Info: Extends Number prototype
//~ </component>

(function(N) {

	N.limit = function(a, b) {
		if(b === undefined) {
			return this;
		}
		var min = Math.min(a, b), max = Math.max(a, b);
		return Math.min(max, Math.max(min, this));
	};

	N.toInt = function(base) {
		return parseInt(this, base || 10);
	};

	N.toFloat = function() {
		return parseFloat(this);
	};

	N.rand = function() {
		return Math.round(this * Math.random());
	};

})(Number.prototype);



(function(win, doc, undefined) {

	var	redjs = function(name, node) {return new RedCollection(name, node);},
		_ = redjs,
		hash = ('redjs' + Math.random()).replace('.', ''),
		type = getType,
		htmlNode = doc.documentElement,
		headNode = getNodesByTag('head')[0],
		testNode = doc.createElement('div'),
		testStyle = testNode.style,
		slice = Array.prototype.slice;

	_.hash = hash;
	_.version = '0.8.1';
	_.proto = {};

	_.slice = slice;

	function RedCollection(name, context) {
		this.ns = getNodes(name, context);
		this.length = this.ns.length;
	}

	RedCollection.prototype = _.proto;

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
				if(obj.hasOwnProperty(prop)) {
					_.proto[prop] = obj[prop];
				}
			}
		}
	};


//~ <component>
//~	Name: Browser Helper
//~	Info: Assume browser & feature detection
//~ </component>


	function Browser() {
		this.value = 'unknown';
		this.version = Browser.ie.version();
		Browser.variants.forEach(function(c) {
			this[c] = !!~Browser.str.indexOf(c);
			if(this[c]) {
				this.value = c;
			}
		}, this);
		if(this.version !== undefined) {
			if(!this.msie) {
				this[this.value] = false;
				this.value = 'msie';
				this.msie = true;
			}
		}
		this.features = {};
		this.toString = function() {
			return this.value;
		}
	}

	Browser.str = (navigator.userAgent || navigator.vendor || '').toLowerCase();
	Browser.variants = ['msie', 'chrome', 'firefox', 'opera', 'safari', 'kde', 'camino'];
	Browser.ie = {
		'variants': [6, 7, 8, 9],
		'version': function() {
			var html = [];
			this.variants.forEach(function(c) {
				html.push('<!--[if IE ' + c + ']><div title="' + c + '"></div><![endif]-->');
			});
			testNode.innerHTML = html.join();
			var node = testNode.getElementsByTagName('div')[0];
			if(node) {
				return node.getAttribute('title');
			}
			return undefined;
		}
	};

	function Platform() {
		this.value = 'unknown';
		Platform.variants.forEach(function(c) {
			this[c] = !!~Platform.str.indexOf(c);
			if(this[c]) {
				this.value = c;
			}
		}, this);
		this.toString = function() {
			return this.value;
		}
	}

	Platform.str = navigator.platform.toLowerCase();
	Platform.variants = ['win', 'mac', 'linux', 'iphone', 'ipod'];


	var	browser = new Browser(),
		platform = new Platform(),
		ielt9 = '\v' == 'v' && browser.msie;


	// features detection

	function Features() {

		testNode.innerHTML = '<div style="float: left; opacity: .99"></div>';
		var testNodeChild = testNode.getElementsByTagName('div')[0];

		this.JSON = !!win.JSON;
		this.getElementsByClassName = !!doc.getElementsByClassName;
		this.mouseenter = 'onmouseenter' in htmlNode;
		this.mouseleave = 'onmouseleave' in htmlNode;
		this.opacity = testNodeChild.style.opacity.charAt(0) == '0';
		this.cssFloat = testNodeChild.style.cssFloat == 'left';

	}

	browser.features = new Features();

	_.browser = browser;
	_.platform = platform;
	_.ielt9 = ielt9;


//~ <component>
//~	Name: Type Helper
//~	Info: Provides type function
//~ </component>


	function _Type() {
		this.toString = function() {
			return Type.variants[this.val];
		};
		this.is = function(typeStr) {
			return Type.variants[this.val] == typeStr;
		};
	}

	function Type(n) {this.val = n}

	function getType(something) {
		switch(typeof something) {
			case 'undefined': return getType['undefined'];
			case 'boolean': return getType['boolean'];
			case 'number': return getType['number'];
			case 'string': return getType['string'];
			case 'function': if(something.call) {
				return getType['function'];
			}
		}

		// for window

		if(something instanceof RedCollection) {
			return  getType['redjs'];
		}
		else if(something === null) {
			return getType['null'];
		}
		else if(something == win) {
			return getType['object'];
		}
		else if(something instanceof Array) {
			return getType['array'];
		}
		else if(something.nodeName && something.nodeType !== undefined) {
			return getType['node'];
		}
		else if(something.length !== undefined) {
			return getType['nodelist'];
		}
		else if(Object.prototype.toString.call(something) == '[object Object]') {
			return getType['object'];
		}
		return getType['unknown'];
	}

	Type.prototype = new _Type();	Type.variants = ['undefined', 'boolean', 'number', 'string', 'function', 'node', 'nodelist', 'array', 'object', 'null', 'redjs', 'unknown'];

	Type.variants.forEach(function(c, i) {
		this[c] = new Type(i);
		this[i] = c;
	}, getType);

	_.type = getType;


//~ <component>
//~	Name: Object Helper
//~	Info: Provides object helpers
//~ </component>


	function isEmptyObj(obj) {
		for(var prop in obj) {
			if(obj.hasOwnProperty(prop)) {
				return false;
			}
		}
		return true;
	}

	_.isEmptyObj = isEmptyObj;


	function joinObj() {
		var Obj = new Object();
		for(var i = 0; i<arguments.length; i++) {
			if(arguments[i]) {
				for(var p in arguments[i]) {
					if(arguments[i].hasOwnProperty(p)) {
						Obj[p] = arguments[i][p];
					}
				}
			}
		}
		return Obj;
	};

	_.joinObj = joinObj;


//~ <component>
//~	Name: Array Helper
//~	Info: Provides array convertor
//~ </component>


	function toArraySimple(obj) {
		var argType = type(obj);
		if(argType.is('array')) {
			return obj;
		}
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
				if(obj.hasOwnProperty(prop)) {
					arr.push(obj[prop]);
				}
			}
			return arr;
		}
		else if(argType.is('redjs')) {
			return obj.ns;
		}
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
			for(var i = 0; i < l; i++) {
				M = M.concat(toArraySimple(arguments[i]));
			}
			return M;
		}
		else {
			return toArraySimple(arguments[0]);
		}
	};



//~ <component>
//~	Name: Selectors
//~	Info: Provides node selection API
//~ </component>

	// id selectors
	function getNodeById(name, node) {
		if(node === undefined) {
			return doc.getElementById(name);
		}
		else {
			return getNodeByIdAndParent(name, node);
		}
	}

	function getNodeByIdAndParent(name, node) {
		var children = _.children(node);
		for(var i = 0, l = children.length; i < l; i++) {
			if(children[i].getAttribute('id') == name) {
				return children[i];
			}
			else {
				var res = getNodeByIdAndParent(name, children[i]);
				if(res !== null) {
					return res;
				}
			}
		}
		return null;
	}

	// tag selectors
	function getNodesByTag(name, node) {
		return (node || doc).getElementsByTagName(name);
	}


	_.id = getNodeById;
	_.tag = getNodesByTag;
	_.className = (function() {
		if(document.getElementsByClassName) {
			return function(name, node) {
				return (node || document).getElementsByClassName(name);
			};
		}
		else {
			return function(name, node) {
				if(name) {
					var	nodes = _.tag('*', node),
						classArray = name.split(/\s+/),
						classes = classArray.length,
						result = [], i,l,j;

					for(i = 0, l = nodes.length; i < l; i++) {
						var trigger = true;
						for(j = 0; j < classes; j++) {
							if(!nodes[i].className.hasWord(classArray[j])) {
								trigger = false;
							}
						}
						if(trigger) {
							result.push(nodes[i]);
						}
					}
					return result;
				}
				else {
					throw Error('Not enough arguments');
				}
			};
		}
	})();

	// converting to array methods
	
	function getArrWithElemById(name, node) {
		return toArraySimple(_.id(name, node));
	}
	
	function getArrWithElemsByTag(name, node) {
		return toArraySimple(_.tag(name, node));
	}
	
	function getArrWithElemsByClass(name, node) {
		return toArraySimple(_.className(name, node));
	}

	// Collection sellector

	function getNodes(name, node) {

		if(name === undefined || name === '') {
			return [];
		}
		if(name === win) {
			return [win];
		}

		var	inContext = !!node,
			firstType = type(name);

		if(inContext) {
			if(typeof node == 'string') {
				node = getNodes(node);
			}
			else {
				node = toArraySimple(node);
			}
		}
		if(firstType.is('string')) {
			var firstChar = name.charAt(0);
			if(firstChar == '#') {
				var idName = name.substr(1);
				if(inContext) {
					for(var nodes = [], i = 0, l = node.length; i < l; i++) {
						nodes = nodes.concat(getArrWithElemById(idName, node[i]));
					}
					return nodes;
				}
				else {
					return getArrWithElemById(idName);
				}
			}
			else if(firstChar == '.') {
				var className = name.substr(1);
				if(inContext) {
					for(var nodes = [], i = 0, l = node.length; i < l; i++) {
						nodes = nodes.concat(getArrWithElemsByClass(className, node[i]));
					}
					return nodes;
				}
				else {
					return getArrWithElemsByClass(className);
				}
			}
			else if(firstChar == '+') {
				return [_.create(name.substr(1), node)];
			}
			else {
				if(inContext) {
					for(var nodes = [], i = 0, l = node.length; i < l; i++) {
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


//~ <component>
//~	Name: Data
//~	Info: Provides data API
//~ </component>


	function data(node, name, val) {
		if(node) {
			var key = node[data.hash];
			if(arguments.length == 2)  {
				if(key !== undefined) {
					return _.dataCache[key][name];
				}
			}
			else if(arguments.length === 3) {
				if(val === null) {
					delete _.dataCache[key][name];
				}
				else {
					if(key === undefined) {
						data.hookCache(node);
					}
					_.dataCache[node[data.hash]][name] = val;
					return val;
				}
			}
		}
	}

	data.next = 0;
	data.hash = 'data___'+hash;
	data.hookCache = function(node) {
		node[data.hash] = data.next++;
		_.dataCache[node[data.hash]] = {};
	};

	_.data = data;
	_.dataCache = {};


	function provideData(node, name, value) {
		var dataObj = data(node, name);
		if(dataObj === undefined) {
			return data(node, name, value);
		}
		return dataObj;
	}

	_.provideData = provideData;


	_.extend({

		'data': function(name, val) {
			if(arguments.length == 2) {
				this.ns.forEach(function(c) {
					_.data(c, name, val);
				});
				return this;
			}
			else {
				if(this.ns[0]) {
					return _.data(this.ns[0], name);
				}
			}
		},
		'provideData': function() {
			if(arguments.length == 2) {
				this.ns.forEach(function(c) {
					_.provideDate(c, name, val);
				});
				return this;
			}
			else {
				if(this.ns[0]) {
					return _.provideDate(this.ns[0], name);
				}
			}
		}

	});


//~ <component>
//~	Name: Deferred
//~	Info: Provides callbacks API
//~ </component>

(function() {

	var	slice = Array.prototype.slice, _FuncList = {
			'exec': function(params, obj) {
				this.calls++;
				this.list.forEach(function(c) {
					c.apply(obj, params  || []);
				});
				return this;
			},
			'add': function(func) {
				if(func && func  instanceof Function) {
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
			'resolve': function(params, context) {
				if(this.status == -1) {
					this.status = 1;
					this.context = context;
					this.params = params || [];
					this.successList.exec(this.params, this.context);
					this.anywayList.exec(this.params, this.context);
				}
			},
			'reject': function(params, context) {
				if(this.status == -1) {
					this.status = 0;
					this.context = context;
					this.params = params || [];
					this.errorList.exec(this.params, this.context);
					this.anywayList.exec(this.params, this.context);
				}
			},
			'success': function(func) {
				if(this.status == -1) {
					this.successList.add(func);
				}
				else if(this.status === 1) {
					func.apply(this.context, this.params);
				}
				return this;
			},
			'error': function(func) {
				if(this.status == -1) {
					this.errorList.add(func);
				}
				else if(this.status === 0) {
					func.apply(this.context, this.params);
				}
				return this;
			},
			'anyway': function(func) {
				if(this.status == -1) {
					this.anywayList.add(func);
				}
				else {
					func.apply(this.context, this.params);
				}
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
			i,
			l = args.length,
			counter = 0,
			err = false;

		for( i = 0; i < l; i++) {
			if(args[i] instanceof Deferred) {
				args[i].success(function() {
					if(++counter == l) {
						if(err) {
							when.reject();
						}
						else {
							when.resolve();
						}
					}
				}).error(function() {
					err = true;
					if(++counter == l) {
						when.reject();
					}
				});

			}
		}
		return when;
	};

})();


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
			var height;
			if(padding) {
				height = node.offsetHeight;
			}
			else {
				height = _.gstyle(node, 'height').toInt() || 0;
			}
			if(border) {
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
			var width;
			if(padding) {
				width = node.offsetWidth;
			}
			else {
				width = _.gstyle(node, 'width').toInt() || 0;
			}
			if(border) {
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


//~ <component>
//~	Name: Dom
//~	Info: Provides Dom API
//~ </component>


	(function() {

		var	nodeTypeDefault = [1];

		function simpleAttrParser(rule) {
			var res = {};
			rule.split(/(?=[#.])/).forEach(function(c) {
				var first = c.charAt(0);
				if(first === '#') {
					res.id = c.substr(1);
				}
				else if(first === '.') {
					res.className = c.substr(1);
				}
				else if(c.length) {
					res.tagName = c.toUpperCase();
				}
			});
			return res;
		}

		function attrCheck(node, rule) {
			for(var p in rule) {
				if(p === 'tagName') {
					if(node.tagName.toUpperCase() !== rule[p]) {
						return false;
					}
				}
				else if(p === 'className') {
					if(!_.hasClass(node, rule[p])) {
						return false;
					}
				}
				else {
					if(node[p] !== rule[p]) {
						return false;
					}
				}
			}
			return true;
		}

		function nodesFromString(str) {
			return _.create('div', {'innerHTML': str}).childNodes;
		}


		_.create = function(tagName, attr) {
			var node = doc.createElement(tagName);
			if(attr) {
				for(var prop in attr) {
					node[prop] = attr[prop];
				}
			}
			return node;
		};

		_.wrap = function(node, wrapper, attr) {
			if(typeof wrapper == 'string') {
				wrapper = _.create(wrapper, attr);
			}
			node.parentNode.insertBefore(wrapper, node);
			wrapper.appendChild(node);
		};

		_.wrapInner = function(node, wrapper, attr) {
			if(typeof wrapper == 'string') {
				wrapper = _.create(wrapper, attr);
			}
			for(var n = node.childNodes; n[0]; wrapper.appendChild(n[0])) {}
			node.appendChild(wrapper);
		};

		_.children = function(node, rule, nodeTypes) {
			if(typeof rule == 'string') {
				rule = simpleAttrParser(rule || '');
			}
			nodeTypes = nodeTypes || nodeTypeDefault;
			var c = node.childNodes, C = [];
			for(var i = 0, l = c.length; i < l; i++) {
				if(!~nodeTypes.indexOf(c[i].nodeType)) {
					continue;
				}
				if(!attrCheck(c[i], rule)) {
					continue;
				}
				C.push(c[i]);
			}
			return C;
		};

		_.parent = function(node, rule) {
			if(typeof rule == 'string') {
				rule = simpleAttrParser(rule || '');
			}
			for(var parent = node; parent = parent.parentNode;) {
				if(!attrCheck(parent, rule)) {
					continue;
				}
				return parent;
			}
			return null;
		};

		_.clone = function(node, param) {
			var clone = node.cloneNode(param);
			_.event.copyEvents(clone, node);
			if(param) {
				var	clones = _.tag('*', clone),
					nodes = _.tag('*', node);
				for(var i = 0, l = nodes.length; i < l; i++) {
					_.event.copyEvents(clones[i], nodes[i]);
				}
			}
			return clone;
		};

		_.remove = function(node) {
			var key = node[data.hash];
			if(key !== undefined) {
				delete _.dataCache[key];
			}
			node.parentNode.removeChild(node);
		};

		_.before = function(what, where) {
			var M = [];
			if(typeof what === 'string') {
				what = nodesFromString(what);
			}
			what = toArraySimple(what);
			what.forEach(function(c) {
				M.push(c);
				where.parentNode.insertBefore(c, where);
			});
			return M;
		};

		_.after = function(what, where) {
			var M = [];
			if(typeof what === 'string') {
				what = nodesFromString(what);
			}
			what = toArraySimple(what);
			what.forEach(function(c) {
				M.push(c);
				for(var next = where.nextSibling; next.nodeType !== 1; next = where.nextSibling) {}
				if(next.nodeType === 1) {
					where.parentNode.insertBefore(c, where);
				}
				else {
					where.parentNode.appendChild(c);
				}
			});
			return M;
		};

		_.append = function(what, where) {
			var M = [];
			if(typeof what === 'string') {
				what = nodesFromString(what);
			}
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
				if(child.nodeType === 1) {
					return child;
				}
				return null;
			}
			else {
				if(typeof child == 'string') {
					child = _.create(child);
				}
				if(node.firstChild) {
					node.insertBefore(child, node.firstChild);
				}
				else {
					node.appendChild(child);
				}
				return child;
			}
		};

	// --------- CLASS MANIPULATION

		_.addClass = function(node, name) {
			if(!node.className.hasWord(name)) {
				if(!node.className) {
					node.className = name;
				}
				else {
					node.className += ' ' + name;
				}
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
				if(typeof rule == 'string') {
					rule = simpleAttrParser(rule || '');
				}
				this.ns.forEach(function(c) {
					M.include(_.children(c, rule));
				});
				return M;
			},
			'parent': function(rule) {
				var M = _();
				if(typeof rule == 'string') {
					rule = simpleAttrParser(rule || '');
				}
				this.ns.forEach(function(c) {
					var parent = _.parent(c, rule);
					if(parent !== null) {
						M.include(parent);
					}
				});
				return M;
			},
			'firstChild': function(child) {
				if(child === undefined) {
			 	   	var M = _();
					this.ns.forEach(function(c) {
						var first = _.firstChild(c);
						if(first !== null) {
							M.include(first);
						}
					});
					return M;
				}
				else {
					if(this.ns[0]) {
						_.firstChild(this.ns[0], child);
					}
					return this;
				}
			},
			'clone': function(all) {
				var M = _();
				this.ns.forEach(function(c) {
					M.include(_.clone(c, all));
				});
				return M;
			},
			'wrap': function(wrapper, attr) {
				var wrapperType = type(wrapper);
				if(wrapperType.is('string')) {
					wrapper = _.create(wrapper, attr);
				}
				else if(wrapperType.is('redjs')) {
					wrapper = wrapper.ns[0];
				}
				this.ns.forEach(function(c) {
					_.wrap(c, wrapper);
				});
				return this;
			},
			'wrapInner': function(wrapper, attr) {
				var wrapperType = type(wrapper);
				if(wrapperType.is('string')) {
					wrapper = _.create(wrapper, attr);
				}
				else if(wrapperType.is('redjs')) {
					wrapper = wrapper.ns[0];
				}
				this.ns.forEach(function(c) {
					_.wrapInner(c, wrapper);
				});
				return this;
			},
			'remove': function() {
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
					if(this.ns[0]) {
						return this.ns[0].innerHTML;
					}
					return '';
				}
				return this;
			},
			'append': function(node) {
				if(this.ns[0]) {
					return _(_.append(node, this.ns[0]).filter(function(c) {
						return c.nodeType === 1;
					}));
				}
				return this;
			},
			'appendTo': function(node) {
				_.append(this.ns, node);
				return this;
			},

			'before': function(node) {
				if(this.ns[0]) {
					return _(_.before(node, this.ns[0]).filter(function(c) {
						return c.nodeType === 1;
					}));
				}
				return this;
			},
			'beforeTo': function(node) {
				_.before(this.ns, node);
				return this;
			},

			'after': function(node) {
				if(this.ns[0]) {
					return _(_.after(node, this.ns[0]).filter(function(c) {
						return c.nodeType === 1;
					}));
				}
				return this;
			},
			'afterTo': function(node) {
				_.after(this.ns, node);
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
					if(this.ns[0]) {
						return this.ns[0].getAttribute(name, 2);
					}
					return null;
				}
				return this;
			},
			'addClass': function(name) {
				this.ns.forEach(function(c) {
					_.addClass(c, name);
				});
				return this;
			},
			'toggleClass': function(name) {
				this.ns.forEach(function(c) {
					_.toggleClass(c, name);
				});
				return this;
			},
			'delClass': function(name) {
				this.ns.forEach(function(c) {
					_.delClass(c, name);
				});
				return this;
			},
			'hasClass': function(name) {
				if(this.ns[0]) {
					return _.hasClass(this.ns[0], name);
				}
				else {
					return false;
				}
			}

		});

	})();


//~ <component>
//~	Name: Events
//~	Info: Provides Events API
//~ </component>


(function() {

	var	eventHash = 'event___' + hash,
		handlerHash = 'handler___' + hash,

		eventsList = ['abort', 'load', 'click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove', 'focus', 'blur', 'change', 'submit', 'keypress', 'keydown', 'keyup'],
		eventsType = {
			'UIEvents' : ['DOMFocusIn', 'DOMFocusOut', 'DOMActivate'],
			'MouseEvents' : ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove'],
			'HTMLEvents' : ['load', 'unload', 'abort', 'error', 'select', 'change', 'submit', 'reset', 'focus', 'blur', 'resize', 'scroll'],
			'KeyboardEvent' : ['keypress', 'keydown', 'keyup'],
			'MutationEvent' : ['DOMSubtreeModified', 'DOMNodeInserted', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument', 'DOMNodeInsertedIntoDocument', 'DOMAttrModified', 'DOMCharacterDataModified']
		},

		addEvent = (function() {
			if(win.addEventListener) {
				return function(node, type, handler) {
					node.addEventListener(type, handler, false);
				};
			}
			else {
				return function(node, type, handler) {
					node.attachEvent('on' + type, handler);
				};
			}
		})(),
		delEvent = (function() {
			if(win.removeEventListener) {
				return function(node, type, handler) {
					node.removeEventListener(type, handler, false);
				};
			}
			else {
				return function(node, type, handler) {
					node.detachEvent('on' + type, handler);
				};
			}
		})(),

		createEvent = (function() {
			if(doc.createEventObject) {
				return function(type, e, params) {
					e = doc.createEventObject(e);
					if(!params) {
						params = {};
					}
					if(!params.type) {
						params.type = type;
					}
					for(var prop in params) {
						if(params.hasOwnProperty(prop)) {
							e[prop] = params[prop];
						}
					}
					if(!e.type) {
						throw Error('Empty event type!');
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
					else event.initEvent(type, !e.cancelBubble, !!e.cancelable);
					return event;
				};
			}
		})(),
		fireEvent = (function() {
			if(testNode.fireEvent) {
				return function(node, type, e, params) {
					e = createEvent(type, e, params);
					try {
						node.fireEvent('on' + type, e);
					}
					catch(err) {
						getNodeEventData(node).callFns(node, e);
						if(!e.cancelBubble && node.parentNode) {
							fireEvent(node.parentNode, 'type', e);
						}
					}
					return e;
				};
			}
			else {
				return function(node, type, e, params) {
					e = createEvent(type, e, params);
					node.dispatchEvent(e);
					return e;
				};
			}
		})(),
		fixEvent = (function() {
			if(doc.createEventObject) {
				return function() {
					var e = win.event, body = doc.body;
					e.target = e.srcElement;
					e.relaredTarget = (e.target == e.fromElemet) ? e.toElement : e.fromElement;
					e.stopPropagation = stopPropagation;
					e.charCode = e.keyCode;
					e.preventDefault = preventDefault;
					e.pageX = e.clientX + (htmlNode && htmlNode.scrollLeft || body && body.scrollLeft || 0) - (htmlNode.clientLeft || 0);
					e.pageY = e.clientY + (htmlNode && htmlNode.scrollTop || body && body.scrollTop || 0) - (htmlNode.clientTop || 0);
					return e;
				};
			}
			else {
				return function(e) {
					return e;
				};
			}
		})(),

		_EventData = {
			'set': function(event, func, once) {
				if(this.events[event] === undefined) {
					this.events[event] = [];
				}
				if(once) {
					this.events[event].pushOnce(func);
				}
				else {
					this.events[event].push(func);
				}
			},
			'unset': function(eventType, func) {
				var event = this.events[eventType];
				if(event === undefined) {
					return 0;
				}
				event.del(event.indexOf(func));
				if(event.length === 0) {
					delete this.events[eventType];
					return 0;
				}
				return event.length;
			},
			'clear': function(event) {
				// to add handlers remover
				delete this.events[event];
			},
	
			'callFns': function(node, e) {
				var event = this.events[e.type];
				if(event) {
					event.forEach(function(c) {
						if(c.call(node, e) === false) {
							e.preventDefault();
						}
					});
				}
			}
		};

	if(_.browser.features.mouseenter && _.browser.features.mouseleave) {
		eventsList.push('mouseenter', 'mouseleave');
		eventsType.MouseEvents.push('mouseenter', 'mouseleave');
	}

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

	// Inner

	function getEventType(type, e) {
		if(e && e.type) {
			type = e.type;
		}
		for(var prop in eventsType) {
			if(~eventsType[prop].indexOf(type)) {
				return prop;
			}
		}
		return 'HTMLEvents';
	}

	function execute(e) {
		e = fixEvent(e);
		getNodeEventData(this).callFns(this, e);
	}

	function getNodeEventData(node) {
		return data(node, eventHash) || data(node, eventHash, new EventData());
	}

	function setNodeEventData(node, obj) {
		data(node, eventHash, obj);
	}

	function EventController() {

		var _this = this;

		// Public

		this.list = eventsList;
		this.artificial = {};

		this.add = function(node, event, method, once) {
			getNodeEventData(node).set(event, method, once);
			if(!node[handlerHash])
				node[handlerHash] = function(e) {
					getNodeEventData(node).callFns(node, fixEvent(e));
				};

			try {
				addEvent(node, event, node[handlerHash]);
			}
			catch(err) {}
			if(_this.artificial[event]) {
				_this.add(node, _this.artificial[event].base, _this.artificial[event].ini, true);
			}
		};

		this.copyEvents = function(clone, node) {
			var nodeEventData = getNodeEventData(node);
			if(!_.isEmptyObj(nodeEventData)) {
				setNodeEventData(clone, nodeEventData);
				clone[handlerHash] = function(e) {
					getNodeEventData(clone).callFns(clone, fixEvente(e));
				};
				for(var prop in nodeEventData.events) {
					try {
						addEvent(clone, prop, clone[handlerHash]);
					}
					catch(err) {}
					if(_this.artificial[prop]) {
						_this.add(clone, _this.artificial[prop].base, _this.artificial[prop].ini, true);
					}
				}
			}
		};

		this.del = function(node, event, method) {
			var rest = getNodeEventData(node);
			if(rest.unset(event, method) === 0) {
				try {
					delEvent(node, event, node[handlerHash]);
				}
				catch(err) {
				}
				if(_.isEmptyObj(rest.events)) {
					delete node[handlerHash];
				}
				if(_this.artificial[event]) {
					_this.del(node, _this.artificial[event].base, _this.artificial[event].ini);
				}
			}
		};

		this.clear = function(node, event) {
			var rest = getNodeEventData(node);
			rest.clear(event);
			delEvent(node, event, node[handlerHash]);
			if(_this.artificial[event]) {
				_this.del(node, _this.artificial[event].base, _this.artificial[event].ini);
			}
			if(_.isEmptyObj(rest.events)) {
				delete node[handlerHash];
			}
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
			else {
				throw Error('Not enough arguments');
			}
		};

		this.fix = fixEvent;

	}

	_.event = new EventController();

	_.force = _.event.force;

	_.bind = _.event.add;
	_.unbind = _.event.del;

	_.addEvent = addEvent;
	_.delEvent = delEvent;

	_.extend({

		'bind' : function(event, action) {
			this.ns.forEach(function(c) {
				_.bind(c, event, action);
			});
			return this;
		},
		'unbind' : function(event, action) {
			this.ns.forEach(function(c) {
				_.unbind(c, event, action);
			});
			return this;
		},
		'force' : function(event_type) {
			this.ns.forEach(function(c) {
				_.force(c, event_type);
			});
			return this;
		},
		'clearEvent' : function(ev) {
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
		if(related == null) {
			return true;
		}
		if(!related) {
			return false;
		}
		resp = (related !== this && related.tagName !== htmlNode && related.prefix !== 'xul' && !parent);
		if(!resp) {
			event.stopPropagation();
		}
		return resp;
	}

	if(!_.browser.features.mouseenter && !_.browser.features.mouseleave) {

		_.event.create({
			'name': 'mouseenter',
			'base': 'mouseover',
			'condition' : parentCheck
		});

		_.event.create({
			'name': 'mouseleave',
			'base': 'mouseout',
			'condition' : parentCheck
		});

		events.push('mouseenter', 'mouseleave');
	}

	events.forEach(function(c) {
		var ev = {};
		ev[c] = function(method) {
			if(method === undefined) {
				this.ns.forEach(function(cc) {
					_.force(cc, c);
				});
			}
			else {
				this.ns.forEach(function(cc) {
					_.bind(cc, c, method);
				});
			}
			return this;
		};
		_.extend(ev);
	});

/*
	var mousewheelEventName = doc.createEventObject ? 'mousewheel' : 'DOMMouseScroll';

	_.event.create({
		'name': 'mousewheel',
		'base': mousewheelEventName
	});

	_.extend({
		'mousewheel': function(method) {
			this.ns.forEach(function(c) {
				_.bind(c, mousewheelEventName, method);
			});
		}
	});
*/


})();


// ----------------------------- Collection manipulations

	_.extend({

		'each': function(func, context) {
			this.ns.forEach(func, context);
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
			if(this.ns[n]) {
				return _(this.ns[n]);
			}
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
				});
				return _(M);
			}
			return this;
		},
		'find': function(selector) {
			return _(selector, this);
		}

	});


// compatibility

	_.shortModeOn = function() {
		if(!win._) {
			win._ = _;
			return true;
		}
		return false;
	};

	_.shortModeOff = function() {
		if(win._ == _ && win._ === redjs) {
			delete win._;
			return true;
		}
		return false;
	};


//~ <component>
//~	Name: JSON
//~	Info: JSON for old browsers (e.g. ie7)
//~ </component>


if(!win.JSON) {
	win.JSON = {};
	_.browser.features.JSON = true;
}

// Author: Douglas Crockford
// douglas@crockford.com
// 2010-11-18
// JSON is a light-weight, language independent, data interchange format.
// See http://www.JSON.org/

(function() {

	'use strict';

	function f(n) {
		return n < 10 ? '0' + n : n;
	}

	if(typeof Date.prototype.toJSON !== 'function') {

		Date.prototype.toJSON = function(key) {
			return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null;
		};

		String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
			return this.valueOf();
		};

	}

	var	cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		gap,
		indent,
		meta = {    // table of character substitutions
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"': '\\"',
			'\\': '\\\\'
		},
		rep;

	function quote(string) {
		escapable.lastIndex = 0;
		return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
			var c = meta[a];
			return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		}) + '"' : '"' + string + '"';
	}

	function str(key, holder) {

		var	i,           // The loop counter.
			k,           // The member key.
			v,           // The member value.
			length,
			mind = gap,
			partial,
			value = holder[key];

		if(value && typeof value === 'object' && typeof value.toJSON === 'function') {
			value = value.toJSON(key);
		}

		if(typeof rep === 'function') {
			value = rep.call(holder, key, value);
		}

		switch (typeof value) {
			case 'string': return quote(value);
			case 'number': return isFinite(value) ? String(value) : 'null';
			case 'boolean':
			case 'null': return String(value);
			case 'object':

				if(!value) {
					return 'null';
				}
				gap += indent;
				partial = [];

				if(Object.prototype.toString.apply(value) === '[object Array]') {
					length = value.length;
					for( i = 0; i < length; i += 1) {
						partial[i] = str(i, value) || 'null';
					}
					v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
					gap = mind;
					return v;
				}

				if(rep && typeof rep === 'object') {
					length = rep.length;
					for( i = 0; i < length; i += 1) {
						if( typeof rep[i] === 'string') {
							k = rep[i];
							v = str(k, value);
							if(v) {
								partial.push(quote(k) + ( gap ? ': ' : ':') + v);
							}
						}
					}
				}
				else {
					for(k in value) {
						if(Object.prototype.hasOwnProperty.call(value, k)) {
							v = str(k, value);
							if(v) {
								partial.push(quote(k) + ( gap ? ': ' : ':') + v);
							}
						}
					}
				}
				v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
				gap = mind;
				return v;
		}
	}

	if(typeof JSON.stringify !== 'function') {
		JSON.stringify = function(value, replacer, space) {

			var i;
			gap = '';
			indent = '';

			if( typeof space === 'number') {
				for( i = 0; i < space; i += 1) {
					indent += ' ';
				}
			}
			else if(typeof space === 'string') {
				indent = space;
			}
			rep = replacer;
			if(replacer && typeof replacer !== 'function' && ( typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
				throw new Error('JSON.stringify');
			}
			return str('', {
				'': value
			});
		};

	}

	if(typeof JSON.parse !== 'function') {
		JSON.parse = function(text, reviver) {

			var j;

			function walk(holder, key) {
				var k, v, value = holder[key];
				if(value && typeof value === 'object') {
					for(k in value) {
						if(Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if(v !== undefined) {
								value[k] = v;
							}
							else { delete
								value[k];
							}
						}
					}
				}
				return reviver.call(holder, key, value);
			}

			text = String(text);
			cx.lastIndex = 0;
			if(cx.test(text)) {
				text = text.replace(cx, function(a) {
					return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				});

			}

			if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
				j = eval('(' + text + ')');

				return typeof reviver === 'function' ? walk({'': j}, '') : j;
			}

			throw new SyntaxError('JSON.parse');
		};

	}

}());


//~ <component>
//~	Name: Ajax
//~	Info: Ajax API
//~ </component>


	(function() {

		_.aj = {
			'obj': function() {
				return new XMLHttpRequest();
			},
			'settings': {
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
			},
			'encodeData': function (obj) {
				if(type(obj).is('object')) {
					var data=[];
					for(var prop in obj) {
						data.push(prop + '=' + encodeURIComponent(obj[prop]));
					}
					return data.join('&');
				}
				return '';
			}
		};

		// parameters constructor

		function RedAjaxParams(params) {
			var type = _.type(params);
			if(type.is('string')) {
				this.url = params;
			}
			else if(type.is('object')) {
				for(var prop in params) {
					this[prop] = params[prop];
				}
			}
		}

		RedAjaxParams.prototype = _.aj.settings;

		// error constructor

		function RedAjaxError(type, message) {
			this.type = type;
			this.message = message;
		}

		RedAjaxError.prototype.toString = function() {
			return this.message;
		};

		// main function
		// OPTIONS: url (str), type (str), before (F), interval (uint), timeout (uint), data (Obj), context(Obj), dataType/send (str), accept (str), user (str), password (str)

		_.aj.query = function(params, xmlreq) {

			params = new RedAjaxParams(params);

			var	d = _.deferred(),
				resptimer,
				timeout;

			// use greated object if necessary
			xmlreq = xmlreq || _.aj.obj();

			function checkStatus() {
				if(xmlreq.readyState == 4 && xmlreq.status == 200) {
					clearInterval(timeout);
					clearInterval(resptimer);
					var resp = params.accept == 'xml' ? xmlreq.responseXML : xmlreq.responseText;
					if(params.accept == 'json') {
						resp = JSON.parse(resp);
					}
					d.resolve([resp], params.context);
				}
			}

			if(params.before instanceof Function) {
				params.before();
			}

			if(typeof params.timeout == 'number') {
				timeout = setTimeout(function() {
					clearInterval(resptimer);
					d.reject(new RedAjaxError('timeout', 'Too long ajax request!'), params.context);
				}, params.timeout);
			}

			resptimer = setInterval(checkStatus, params.interval);

			var acceptHeader = _.aj.settings.contentType[params.accept];

			if(params.type == 'post') {
				xmlreq.open('post', params.url, true);
				xmlreq.setRequestHeader('Content-Type', _.aj.settings.contentType.urlencoded);
				xmlreq.setRequestHeader('Accept', acceptHeader);
				xmlreq.send(_.aj.encodeData(params.data));
			}
			else {
				xmlreq.open('get', params.url+'?'+_.aj.encodeData(params.data), true);
				xmlreq.setRequestHeader('Accept', acceptHeader);
				xmlreq.send(null);
			}

			d.error(function() {
				xmlreq.abort();
			});

			return d;
		};

		_.script = function(url) {
			var script =  _.aj.query({'url': url, 'accept': 'script'});
			if(!flag) {
				script.success(function(data, context) {
					_('+script').attr('type', 'text/javascript').html(data).appendTo(headNode).remove();
				});
			}
			return script;
		};

	})();

//~ <component>
//~	Name: Animation
//~	Info: Animation API
//~ </component>


	function animate(node, type, terminal, time, callback, effect) {

		function changeCss() {

			var	now = Date.now() - start,
				progress = now / time,
				result = ((terminal - current) * easing(progress) + current).limit(current, terminal);

			_.css(node, type, result + unit);

			if(progress < 1) {
				animationTypeData.timer = setTimeout(changeCss, animate.delay);
			}
			else {
				_.css(node, type, terminal);
				delete animationData[type];
				if(callback) {
					callback.call(node);
				}
			}
		}

		var	animationData = animate.data(node, type, {}),
			animationTypeData = animationData[type],
			currCss = _.css(node, type).toString(),
			current = currCss.toNumber() || 0,
			diff = current - terminal,
			animStatus = diff < 0 ? 'increase' : 'decrease';

		if(animationTypeData === undefined || animationTypeData.status !== animStatus) {
			if(animationTypeData !== undefined) {				clearTimeout(animationData[type].timer);
				delete animationData[type];			}
			if(diff !== 0) {

				var	unit = currCss.match(/[a-z]+/) || '',
					unit = unit == 'auto' ? 'px' : unit,
					easing = typeof effect == 'function' ? effect : animate.effect[effect] || animate.effect[animate.defaultEffect],
					start = Date.now();

				animationData[type] = animationTypeData = {
					'status': animStatus,
					'timer': setTimeout(changeCss, animate.delay)
				};

			}
		}

	};	animate.hash = 'animation___' + hash;
	animate.data = function(node, type, value) {
		var data = _.provideData(node, animate.hash, {});
		if(data[type] === undefined) {
			data[type] = value;
		}
		return data[type];
	};
	animate.delay = 16;
 	animate.effect = {		'linear': function(x) {
			return x;
		},
		'wobble': function(pos) {
			return (-Math.cos(pos * Math.PI * (9 * pos)) / 2) + 0.5;
		},
		'swing': function(x) {
			return (-Math.cos(x * Math.PI) / 2) + 0.5;
		}	};
	animate.defaultEffect = 'swing';	_.animate = animate;

	_.hide = function(node, time, callback, effect) {
		if(time) {
			_.animate(node, 'opacity', 0, time, function() {
				node.style.display = 'none';
				if(callback) callback();
			}, effect);
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

	_.show = function(node, time, callback, effect) {
		if(time) {
			if(_.gstyle(node, 'display') == 'none') {
				_.css(node, 'opacity', 0);
				node.style.display = 'block';
			}
			_.animate(node, 'opacity', 1, time, function() {
				if(callback) callback();
			}, effect);
		}
		else {
			node.style.display = node.display || 'block';
		}
	};


	_.extend({
		'hide': function(time, callback, effect) {
			this.ns.forEach(function(c) {
				_.hide(c, time, callback, effect);
			});
			return this;
		},
		'show': function(time, callback, effect) {
			this.ns.forEach(function(c) {
				_.show(c, time, callback, effect);
			});
			return this;
		},
		'animate': function(type, terminal, time, effect, callback) {
			this.ns.forEach(function(c) {
				_.animate(c, type, terminal, time, effect, callback);
			});
			return this;
		}
	});

//~ <component>
//~	Name: Cookies
//~	Info: Cookies API
//~ </component>


	(function() {

		function getCookie(name) {
			if(name && new RegExp('(?:^|;\\s*)' + name + '=([^;]*)').test(document.cookie)) {
				return decodeURIComponent(RegExp.$1);
			}
		}

		function setCookie(name, value, days, attrs) {
			var cookie = [name+'='+encodeURIComponent(value || '')];
			if(days) {
				cookie.push('max-age='+parseInt(days*86400));
			}
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

//~ <component>
//~	Name: Debug
//~	Info: Debug API
//~ </component>


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

// ----------------------------- Global variables initiation

	if(!win._) {
		win._ = _;
	}
	win.redjs = redjs;

// ----------------------------- Viewport binding

	function refreshViewportSize() {
		_.viewport = {
			'width': htmlNode.clientWidth,
			'height': htmlNode.clientHeight
		};
	}

	_.addEvent(win, 'resize', refreshViewportSize);

})(window, document);


//~ <component>
//~	Name: Forms Controller
//~	Info: Provides form emulations & form controllers
//~ </component>


(function(_, undefined) {

	var hash = 'form___' + _.hash;

	// error constructor

	function ValidationError(node, test) {
		this.node = node;
		this.test = test;
		this.msg = ValidationError.messages[test];
	}

	ValidationError.messages = {
		'required': 'This field is required!',
		'email': 'Email address is not valid!'
	};

	// form constructor

	function FormController() {

		this.cache = {};

		this.validators = {
			'required': function(c, errs) {
				if(c.value == '') {
					errs.push(new ValidationError(c, 'required'));
					return false;
				}
				return true;
			},
			'email': function(c, errs) {
				if(!c.value.isMail()) {
					errs.push(new ValidationError(c, 'email'));
					return false;
				}
				return true;
			}
		};

		this.validation = {};
		this.submition = {};

	}

	_.fc = new FormController();

	// common wrapper

	function _primaryWrap(node, name, className, value) {

		var input = _('+input').attr('name', name).attr('id', name).attr('type', 'hidden');

		if(value !== undefined) {
			input.attr('value', value);
		}

		var wrap = _(node).delClass(className).wrap('div').parent().addClass(className);
		wrap.append(input);

		return wrap;

	}

	// data provider

	function formData(node, prop, value) {
		var data = _.provideData(node, hash, {});
		if(data[prop] === undefined) {
			data[prop] = value;
		}
		return data[prop];
	}



//~ <component>
//~	Name: Forms Checkbox Controller
//~	Info: Provides checkbox emulation
//~ </component>


	// prototype

	function _RedFormsCheckbox() {

		this.val = function(value) {
			if(value === undefined) {
				return this.value;
			}
			else {
				value = value.toString();
				if(value === 'false') {
					this.wrap.delClass(_.fc.checkbox.selectors.checked);
				}
				else {
					this.wrap.addClass(_.fc.checkbox.selectors.checked);
				}
				this.value = value;
				return true;
			}
		};

	}

	// constructor

	function RedFormsCheckbox(node, id, value, input) {

		var	_this = this,
			tag = node.tagName.toLowerCase();

		if(tag === 'label') {
			if(id !== undefined) {
				node = _primaryWrap(node, id, _.fc.checkbox.selectors.checkboxWarp, value);
			}
			else {
				throw Error('Not enough arguments!');
			}
		}

		this.wrap = _(node);
		this.input = input;
		this.label = this.wrap.find('label');
		this.value;
		this.startValue;
		this.box;

		if(this.wrap.length && this.input.length && this.label.length) {

			this.box = this.label.before('<span></span>').addClass(_.fc.checkbox.selectors.checkbox);
			this.value = this.input.val();
			this.startValue = this.value;

			if(this.value == 'true') {
				this.wrap.addClass(_.fc.checkbox.selectors.checked);
			}
			else {
				this.input.val('false');
			}

			_.multi(this.box).click(function(e) {
				if(_this.value === 'true') {
					_this.input.val('false');
				}
				else {
					_this.input.val('true');
				}

			});

		}
		else {
			throw Error('Invalid html structure!');
		}

	}

	RedFormsCheckbox.prototype = new _RedFormsCheckbox();

	// obj extension

	_.extend({
		'checkbox': function(id, value) {
			this.ns.forEach(function(c) {
				_.fc.checkbox(c, id, value);
			});
			return this;
		}
	});

	_.fc.checkbox = function(node, id, value) {
		var input = _('input', node);
		if(input.length && input.formData('controller') === undefined) {
			var controller = new RedFormsCheckbox(node, id, value, input);
			input.formData('controller', controller);
		}
	};

	_.fc.checkbox.selectors = {
		'checkboxWarp': 'redjs-checkbox-wrap',
		'checkbox': 'redjs-checkbox',
		'checked': 'redjs-checkbox-checked'
	};







//~ <component>
//~	Name: Forms Errors Provider
//~	Info: Form errors provider function
//~ </component>


_.fc.errorsProvider = function() {

	var	form = _(this),
		data = form.formData('controller');

	if(data) {
		var errs = data.errors;
		if(errs !== undefined) {
			errs.forEach(function(validationError) {

				var	c = _(validationError.node),
					data = c.formData('errorsprovider', {});

				if(!data.wrapped) {
					var wrap = _('+span').addClass(_.fc.errorsProvider.selectors.wrap).css({
						'float': c.css('float'),
						'width': c.css('width')
					});
					c.wrap(wrap);
					data.wrapped = true;
				}

				if(!data.on) {
					var errNode = _('+span').attr('title', validationError.msg).addClass(_.fc.errorsProvider.selectors.error);
					c.parent().append(errNode).show(800, null, 'wobble');

					function remove() {
						c.unbind('change', remove);
						errNode.remove();
						data.on = false;
					}

					c.change(remove);
					data.on = true;
				}

			});
		}
	}
};

_.fc.errorsProvider.selectors = {
	'error': 'redjs-validation-error',
	'wrap': 'redjs-validation-wrap'
};

//~ <component>
//~	Name: Forms Form Controller
//~	Info: Provides form controller
//~ </component>


	// prototype

	function _RedForm() {

		this.validate = function() {
	
			var inputs = this.form.find('input').include(this.form.find('textarea'));
	
			if(inputs.length && this.id) {

				var	errs = [],
					rules = _.fc.validation[this.id];

				if(rules) {
					inputs.each(function(c) {

						var	name = c.getAttribute('name'),
							rule = rules[name];

						if(name && rule) {
							rule = rule.split(' ');
							for(var i = 0; rule[i]; i++) {
								if(rule[i] in _.fc.validators) {
									if(!_.fc.validators[rule[i]](c, errs)) {
										break;
									}
								}
							}
						}

					});

					if(errs.length) {
						this.errors = errs;
						this.form.force('validationfail');
						this.locked = false;
						return false;
					}
				}
			}
			return true;
		};

		this.clear = function() {
			var inputs = this.form.find('input').include(this.form.find('textarea'));
			inputs.each(function(c) {
				c = _(c);

				var	controller = c.formData('controller'),
					startVal = controller.startValue || '';

				c.val(startVal);
				c.force('blur');
			});
		};

		this.getValues = function(obj) {

			var	inputs = this.form.find('input').include(this.form.find('textarea')),
				obj = obj || {};

			inputs.each(function(c) {
				var id = c.name || c.id;
				if(id) {
					obj[id] = c.value;
				}
			});
			return obj;
		};

		this.setValues = function(param, flag) {
			var inputs = this.form.find('input').include(this.form.find('textarea'));
			if(flag) {
				this.clear();
			}
			inputs.each(function(c) {
				var id = c.name || c.id;
				if(param[id] !== undefined) {
					c = _(c);
					c.force('focus');
					c.val(param[id]);
				}
			});
		};

	}

	// constructor

	function RedForm(node) {

		// ini

		var _this = this;

		this.form = _(node);
		this.id = node.id;
		this.locked = false;
		this.errors;

		if(this.id) {
			_.fc.cache[this.id] = this.form;
		}

		_('.' + _.fc.selectbox.selectors.selectWarp, node).selectbox();
		_('.' + _.fc.checkbox.selectors.checkboxWarp, node).checkbox();
		_('.' + _.fc.radiobox.selectors.radioboxWarp, node).radiobox();

		_('input', node).filter(function() {
			var type = _(this).attr('type');
			return type === 'text' || type === 'password';
		}).placeholder();



		function submit(e) {
			if(_.fc.submition[_this.id]) {
				e.preventDefault();
				if(!_this.locked) {
					_this.locked = true;
					if(_this.validate()) {
						_.fc.submition[_this.id].call(_this.form);
					}
					else {
						_this.locked = false;
					}
				}
			}
			else {
				if(!_this.validate()) {
					e.preventDefault();
				}
			}
		}

		_('.' + _.fc.form.selectors.submit, node).click(submit);
		_this.form.submit(submit);

	}

	RedForm.prototype = new _RedForm();

	// obj extension

	_.extend({
		'form': function() {
			this.ns.forEach(function(c) {
				_.fc.form(c);
			});
			return this;
		}
	});

	_.fc.form = function(node) {
		if(formData(node, 'controller') === undefined) {
			var controller = new RedForm(node);
			formData(node, 'controller', controller);
		}
	};

	_.fc.form.selectors = {
		'disabled': 'redjs-disabled',
		'submit': 'redjs-submit'
	};


//~ <component>
//~	Name: Forms Placeholder Controller
//~	Info: Provides placeholder emulation
//~ </component>


	// placeholder

	function _RedFormsPlaceholder() {

		this.checkAutofilling = function() {
			if(this.input.val() === '') {
				this.placeholder.show(200);
			}
			else {
				this.placeholder.hide(200);
			}
		};

	}

	function RedFormsPlaceholder(node) {

		this.placeholder;
		this.wrap;
		this.input = _(node);
		this.ptext = this.input.attr('placeholder');

		var inputType = this.input.attr('type');

		if(this.ptext && (inputType === 'text' || inputType === 'password')) {

			var	height = this.input.height(true, true)+'px',
				_this = this,
				timer;

			this.input.attr('placeholder', '');

			this.wrap = _('+div').addClass(_.fc.placeholder.selectors.placeholderWrap).css('float', this.input.css('float'));
			this.placeholder = _('+div').addClass(_.fc.placeholder.selectors.placeholder).html(this.ptext).css({
					'height': height,
					'lineHeight': height,
					'textIndent': this.input.css('textIndent'),
					'paddingLeft': this.input.css('paddingLeft'),
					'opacity': 0
				});

			this.wrap.append(this.placeholder);
			this.input.wrap(this.wrap.ns[0]);

			function check() {
				timer = setTimeout(function() {
					var form = _this.input.parent('form');
					if(form) {
						form.find('input').each(function(c) {
							if(c !== node) {
								c = _(c);
								var type = c.attr('type');
								if(type === 'text' || type === 'password') {
									var controller = c.formData('controller');
									if(controller) {
										controller.checkAutofilling();
									}
								}
							}
						});
					}
				}, 60);
			}

			check();

			this.input.focus(function() {
				_this.input.keyup(check);
				_this.placeholder.hide(200);
				_this.input.delClass(_.fc.placeholder.selectors.transparentText);
			});

			this.input.blur(function() {
				_this.input.unbind('keyup', check);
				if(!_this.input.val()) {
					_this.placeholder.show(200);
					_this.input.addClass(_.fc.placeholder.selectors.transparentText);
				}
			});

		}

	}

	RedFormsPlaceholder.prototype = new _RedFormsPlaceholder();

	_.extend({
		'placeholder': function() {
			this.ns.forEach(function(c) {
				_.fc.placeholder(c);
			});
			return this;
		}
	});

	_.fc.placeholder = function(node) {
		if(_.formData(node, 'controller') === undefined) {
			var controller = new RedFormsPlaceholder(node);
			_.formData(node, 'controller', controller);
		}
	};

	_.fc.placeholder.selectors = {
		'placeholderWrap': 'redjs-input-placeholder-wrap',
		'placeholder': 'redjs-input-placeholder',
		'transparentText': 'redjs-transparent-text'
	};

//~ <component>
//~	Name: Forms Radiobox Controller
//~	Info: Provides radiobox emulation
//~ </component>


	// prototype

	function _RedFormsRadiobox(node) {

		this.val = function(value) {
			if(value === undefined) {
				return this.value;
			}
			else {
				value = value.toString();
				for(var i = 0, l = this.li.length; i < l; i++) {
					c = this.li.eq(i).find('label');
					if(c.html().trim() === value) {
						this.li.delClass(_.fc.radiobox.selectors.checked).eq(i).addClass(_.fc.radiobox.selectors.checked);
						this.value = value;
						return true;
					}
				}
				return false;
			}
		};

	}

	// constructor

	function RedFormsRadiobox(node, id, value, input) {

		var	_this = this,
			tag = node.tagName.toLowerCase();

		if(tag === 'ul') {
			if(id !== undefined) {
				node = _primaryWrap(node, id, _.fc.radiobox.selectors.radioboxWarp, value);
			}
			else {
				throw Error('Not enough arguments!');
			}
		}

		this.wrap = _(node);
		this.input = input;
		this.ul = this.wrap.find('ul');
		this.value;
		this.startValue;
		this.li;

		if(this.wrap.length && this.input.length && this.ul.length) {

			var	defaultFlag = true,
				value = _this.input.val();

			this.startValue = value;

			this.li = this.ul.find('li').each(function(c, i) {

				c = _(c);

				var	text = c.html().trim(),
					label = c.wrapInner('label').find('label'),
					box = label.before('<span></span>').addClass(_.fc.radiobox.selectors.radiobox);

				if(text == value) {
					c.addClass(_.fc.radiobox.selectors.checked);
					defaultFlag = false;
					_this.value = value;
				}

				_.multi(box).click(function(e) {

					if(!_(this).parent('li').hasClass(_.fc.radiobox.selectors.checked)) {
						_this.li.delClass(_.fc.radiobox.selectors.checked).eq(i).addClass(_.fc.radiobox.selectors.checked);
						_this.input.val(text);
						_this.value = text;
					}

				});

			});

			if(defaultFlag) {
				this.li.eq(0).children('label').click();
			}

		}
		else {
			throw Error('Invalid html structure!');
		}
	}

	RedFormsRadiobox.prototype = new _RedFormsRadiobox();

	// obj extension

	_.extend({
		'radiobox': function(id, value) {
			this.ns.forEach(function(c) {
				_.fc.radiobox(c, id, value);
			});
			return this;
		}
	});

	_.fc.radiobox = function(node, id, value) {
		var input = _('input', node);
		if(input.length && input.formData('controller') === undefined) {
			var controller = new RedFormsRadiobox(node, id, value, input);
			input.formData('controller', controller);
		}
	};

	_.fc.radiobox.selectors = {
		'radioboxWarp': 'redjs-radio-wrap',
		'radiobox': 'redjs-radiobox',
		'checked': 'redjs-radiobox-checked'
	};



//~ <component>
//~	Name: Forms Selectbox Controller
//~	Info: Provides selectbox emulation
//~ </component>


	// prototype

	function _RedFormsSelect(node) {

		this.val = function(value) {
			if(value === undefined) {
				return this.value;
			}
			else {
				value = value.toString();
				for(var i = 0, l = this.li.length; i < l; i++) {
					var c = this.li.eq(i);
					if(c.html().trim() === value) {
						this.li.delClass(_.fc.selectbox.selectors.checked).eq(i).addClass(_.fc.selectbox.selectors.checked);
						this.current.html(value);
						this.value = value;
						return true;
					}
				}
				return false;
			}
		};

	}

	// constructor

	function RedFormsSelect(node, id, value, input) {

		var	_this = this,
			tag = node.tagName.toLowerCase();

		if(tag === 'ul') {
			if(id !== undefined) {
				node = _primaryWrap(node, id, _.fc.selectbox.selectors.selectboxWarp, value);
			}
			else {
				throw Error('Not enough arguments!');
			}
		}

		this.wrap = _(node);
		this.input = input;
		this.ul = this.wrap.find('ul');
		this.value;
		this.startValue;
		this.current;
		this.li;

		if(this.wrap.length && this.input.length && this.ul.length) {

			this.current = this.ul.before('<span></span>').addClass(_.fc.selectbox.selectors.selectCurrent);

			var	ico = this.ul.before('<span></span>').addClass(_.fc.selectbox.selectors.selectIco),
				slectBody = this.ul.wrap('div', {'className': _.fc.selectbox.selectors.selectBody}).parent();

			this.li = this.ul.find('li').each(function(c, i) {

				c = _(c);

				var text = c.html().trim();

				c.attr('title', text);
				if(text === _this.input.val()) {
					_this.current.html(text);
					c.addClass(_.fc.selectbox.selectors.checked);
					_this.value = text;
					_this.startValue = text;
				}

				c.click(function() {
					if(text !== _this.value) {
						_this.input.val(text);
					}
				});

			});

		}
		else {
			throw Error('Invalid html structure!');
		}

	}

	RedFormsSelect.prototype = new _RedFormsSelect();

	// obj extension

	_.extend({
		'selectbox': function(id, value) {
			this.ns.forEach(function(c) {
				_.fc.selectbox(c, id, value);
			});
			return this;
		}
	});

	_.fc.selectbox = function(node, id, value) {
		var input = _('input', node);
		if(input.length && input.formData('controller') === undefined) {
			var controller = new RedFormsSelect(node, id, value, input);
			input.formData('controller', controller);
		}
	};

	_.fc.selectbox.selectors = {
		'selectWarp': 'redjs-select-wrap',
		'selectBody': 'redjs-select-body',
		'selectCurrent': 'redjs-select-current',
		'selectIco': 'redjs-select-ico',
		'checked': 'redjs-select-selected'
	};



	// public API

	_.formData = formData;

	_.extend({

		'formData': function(prop, value) {
			if(this.ns[0]) {
				return formData(this.ns[0], prop, value);
			}
		},
		'val': function(value, add) {
			if(value !== undefined) {
				this.ns.forEach(function(c) {
					var controller = formData(c, 'controller');
					if(controller) {
						if('val' in controller) {
							if(controller.val(value)) {
								c.value = value;
							}
						}
						else if('setValues' in controller) {
							return controller.setValues(value, add);
						}
						else {
							c.value = value;
						}
					}
					else {
						c.value = value;
					}
				});
				return this;
			}
			else {
				if(this.ns[0]) {
					var controller = formData(this.ns[0], 'controller');
					if(controller) {
						if('val' in controller) {
							return controller.val();
						}
						else if('getValues' in controller) {
							return controller.getValues(add);
						}
						else {
							return this.ns[0].value;
						}
					}
					else {
						return this.ns[0].value;
					}
				}
			}
		}

	});

})(redjs);

//~ <component>
//~	Name: RedJS UI
//~	Info: UI library
//~ </component>


(function(_, undefined) {

	_.ui = {'cache': {}};

	var hash = 'ui___'+_.hash;

	// data provider

	function uiData(node, prop, value) {
		var data = _.provideData(node, hash, {});
		if(data[prop] === undefined) {
			data[prop] = value;
		}
		return data[prop];
	}



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

//~ <component>
//~	Name: RedJS UI Popups
//~	Info: Popups module
//~ </component>


	// ini method

	_.ui.popup = function(node) {

		var	id = node.getAttribute('id'),
			data = uiData(node, 'popup', {}),
			popup = _(node),
			closer = _('.'+_.ui.popup.selectors.closer, node),
			caller = _('#'+id+'_caller');

		if(id) {
			_.ui.cache[id] = popup;
		}

		closer.click(function(e) {
			e.preventDefault();
			_.ui.popup.close(popup);
		});

		caller.click(function(e) {
			e.preventDefault();
			_.ui.popup.open(popup);
		});
	};

	_.ui.popup.selectors = {
		'closer': 'redjs-popup-closer',
		'shellActive': 'redjs-popup-shell',
		'shellInactive': 'redjs-popup-shell-inactive'
	};

	_.ui.popup.shell = new function() {
		this.active = _('+div').addClass(_.ui.popup.selectors.shellActive);
		this.inactive = _('+div').addClass(_.ui.popup.selectors.shellInactive);
	};


	_.ui.popup.effects = {
		'fade': {
			'show': function(popup, callback) {
				popup.show(250, callback);
			},
			'hide': function(popup, callback) {
				popup.hide(250, callback);
			}
		}
	};

	_.ui.popup.lastOpened = undefined;
	_.ui.popup.defaultEffect = 'fade';
	_.ui.popup.queue = [];


	// controll methods

	_.ui.popup.open = function(popup, fn) {
		var pptype = _.type(popup);
		if(pptype == _.type.redjs) {

			if(_.ui.popup.lastOpened === undefined) {
				this.shell.active.show();
			}
			else {
				var lastOpened = _.ui.cache[_.ui.popup.lastOpened];
				if(lastOpened && lastOpened.attr('id') != popup.attr('id')) {
					var fn = fn || _.ui.popup.defaultEffect;
					_.ui.popup.effects[fn].hide(lastOpened);
				}
			}

			var id = popup.attr('id');
			_.ui.popup.lastOpened = id;
			_.ui.popup.queue.delByVal(id).unshift(id);

			popup.force('open');

			var fn = fn || _.ui.popup.defaultEffect;
			_.ui.popup.effects[fn].show(popup, function() {
				popup.force('opened');
			});

		}
	};

	_.ui.popup.close = function(popup, all) {
		var pptype = _.type(popup);
		if(pptype == _.type.redjs) {

			var id = popup.attr('id');
			_.ui.popup.lastOpened = _.ui.popup.queue.delByVal(id)[0];

			if(_.ui.popup.lastOpened === undefined || all) {
				this.shell.active.hide();
			}
			else {
				var lastOpened = _.ui.cache[_.ui.popup.lastOpened];
				if(lastOpened) {
					var fn = fn || _.ui.popup.defaultEffect;
					_.ui.popup.effects[fn].show(lastOpened);
				}
			}

			popup.force('close');

			var fn = fn || _.ui.popup.defaultEffect;
			_.ui.popup.effects[fn].hide(popup, function() {
				popup.force('closed');
			});
		}
		else {
			_.ui.popup.queue.forEach(function(c) {
				_.ui.cache[c].force('close');
				_.ui.cache[c].force('closed');
			});
			_.ui.popup.queue = [];
			_.ui.popup.close(_.ui.cache[_.ui.popup.lastOpened], true);
			_.ui.lastOpened = undefined;
		}
	};


	_(document).bind('ready', function() {

		var body = _('body');

		body.firstChild(_.ui.popup.shell.inactive.ns[0]);
		body.firstChild(_.ui.popup.shell.active.ns[0]);

		_.ui.popup.shell.active.click(function() {
			_.ui.popup.close();
		});

	});

	_.extend({
		'popup': function() {
			this.ns.forEach(function(c) {
				_.ui.popup(c);
			});
			return this;
		}
	});

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


	// public API

	_.uiData = uiData;

	_.extend({

		'uiData': function(prop, value) {
			if(this.ns[0]) {
				return _.uiData(this.ns[0], prop, value);
			}
		}

	});

})(redjs);

