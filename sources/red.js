
/* --------------------######-------------------- Default obj's extension & --- */

### require prototypes/Array
### require prototypes/String
### require prototypes/Number

/* --------------------######-------------------- FRAMEWORK --- */

(function(win) {

	var	redjs = function(name, node) {return new redjsCollection(name, node);},
		_ = redjs,
		hash = ('redjs'+Math.random()).replace('0.', ''),
		type,
		doc = document,
		ielt9 = _.ielt9;

	function redjsCollection(name, context) {
		this.ns = getNodes(name, context);
		this.length = this.ns.length;
	}

	_.proto = {
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
		}
	};

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

// ########################---------- INNER FUNCTIONS

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


### require helpers/browser

### require helpers/type

// ########################---------- SELLECTORS

	_.id = function(name) {return doc.getElementById(name);};

	_.tag = function(name, node) {return (node || doc).getElementsByTagName(name);};

	_.className = (function() {
		if(document.getElementsByClassName) {
			return function(name, node) {
				return (node || document).getElementsByClassName(name);
			}
		}
		else {
			return function(name, node) {
				if(name) {
					var	nodes = _.tag('*', node),
						classArray = name.split(/\s+/),
						classes = classArray.length,
						result = [], i,l,j;

					for(i = 0, l = nodes.length; i < l; i++) {
						for(j = 0; j < classes; j++) {
							if(nodes[i].className.hasWord(classArray[j])) {
								result.push(nodes[i]);
								break;
							}
						}
					}
					return result;
				}
				else {throw Error('Not enough arguments');}
			}
		}
	})();

// ########################---------- UTILITES

	_.hash = hash;

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

// compatibility

	_.easyModeOn = function() {
		if(!window._) {window._ = _; return true;}
		return false;
	};

	_.easyModeOff = function() {
		if(window._ == _ && window._ === redjs) {delete window._; return true;}
		return false;
	};

// debuging

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


### require data

### require callbacks/deferred

### require css

### require dom

### require events

// ########################---------- PROTO EXTENSION

	_.extend({

		'each': function(f, context) {
			this.ns.forEach(f, context);
			return this;
		},

	// collection manipulation

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
		},


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

	});


### include modules


// --------- GLOBALS

	if(!win._) win._ = _;
	win.redjs = redjs;

})(window);





