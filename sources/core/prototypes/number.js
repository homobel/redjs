
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

	N.toFloat = function(base) {
		return parseFloat(this);
	};

	N.rand = function() {
		return (this * Math.random()).toInt();
	};

})(Number.prototype);
