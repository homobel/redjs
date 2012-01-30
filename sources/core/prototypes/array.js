
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

	A.toggle = function(n) {
		var index = this.indexOf(n);
		if(index == -1) {
			this.push(n);
		}
		else {
			this.del(index);
		}
		return index;
	};

})(Array.prototype);
