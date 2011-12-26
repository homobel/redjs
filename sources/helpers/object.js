
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