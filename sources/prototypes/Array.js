
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
