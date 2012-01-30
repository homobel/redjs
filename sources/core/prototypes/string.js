
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

	S.toFloat = function(base) {
		return parseFloat(this);
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

})(String.prototype);
