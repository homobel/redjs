
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
