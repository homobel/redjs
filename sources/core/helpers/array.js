
//~ <component>
//~	Name: Array Helper
//~	Info: Provides array convertor
//~ </component>


	function toArraySimple(obj) {
		var argType = type(obj);
		if(argType.is('array')) {
			return obj;
		}
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
				if(obj.hasOwnProperty(prop)) {
					arr.push(obj[prop]);
				}
			}
			return arr;
		}
		else if(argType.is('redjs')) {
			return obj.ns;
		}
		else if(argType.is('undefined') || argType.is('null') || argType.is('unknown')) {
			return [];
		}
		else {
			return [obj];
		}
	}

	_.toArray = function() {
		var l = arguments.length;
		if(l > 1) {
			var M = [];
			for(var i = 0; i < l; i++) {
				M = M.concat(toArraySimple(arguments[i]));
			}
			return M;
		}
		else {
			return toArraySimple(arguments[0]);
		}
	};
