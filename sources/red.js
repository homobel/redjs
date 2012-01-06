
/* --------------------######-------------------- Default obj's extension & --- */

### require prototypes/Array
### require prototypes/String
### require prototypes/Number

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

### require helpers/browser
### require helpers/type
### require helpers/object
### require helpers/array
### require selectors
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


### require forms

// compatibility

	_.easyModeOn = function() {
		if(!win._) {win._ = _; return true;}
		return false;
	};

	_.easyModeOff = function() {
		if(win._ == _ && win._ === redjs) {delete win._; return true;}
		return false;
	};

### include modules

// --------- GLOBALS

	if(!win._) win._ = _;
	win.redjs = redjs;

})(window);





