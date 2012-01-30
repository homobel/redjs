
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
