
//~ <component>
//~	Name: RedJS
//~	Info: Color your javascript
//~ </component>


//~ require: compatibility/array.js

//~ require: prototypes/array.js
//~ require: prototypes/string.js
//~ require: prototypes/number.js


(function(win) {

	var	redjs = function(name, node) {return new RedCollection(name, node);},
		_ = redjs,
		hash = ('redjs'+Math.random()).replace('.', ''),
		type = getType,
		doc = document,
		htmlNode = doc.documentElement,
		headNode = doc.getElementsByTagName('head')[0],
		testNode = doc.createElement('div'),
		testStyle = testNode.style,
		slice = Array.prototype.slice;

	_.hash = hash;
	_.version = '0.8.1';
	_.proto = {};

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
				if(obj.hasOwnProperty(prop)) _.proto[prop] = obj[prop];
			}
		}
	};

//~ require: helpers/browser.js
//~ require: helpers/type.js
//~ require: helpers/object.js
//~ require: helpers/array.js

//~ require: selectors.js
//~ require: data.js
//~ require: callbacks/deferred.js
//~ require: css.js
//~ require: dom.js
//~ require: events.js

// ----------------------------- RedJS proto extending

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


//~ require: forms.js

// compatibility

	_.easyModeOn = function() {
		if(!win._) {win._ = _; return true;}
		return false;
	};

	_.easyModeOff = function() {
		if(win._ == _ && win._ === redjs) {delete win._; return true;}
		return false;
	};

//~ require: compatibility/json2.js
//~ include: ../internal-modules

// ----------------------------- Global variables initiation

	if(!win._) win._ = _;
	win.redjs = redjs;

// ----------------------------- Viewport binding

	function __refreshViewport() {
		_.viewport = {
			'width': htmlNode.clientWidth,
			'height': htmlNode.clientHeight
		};
	}

	_.addEvent(win, 'resize', __refreshViewport);

})(window);

//~ include: ../external-modules
