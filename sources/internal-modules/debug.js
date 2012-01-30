
//~ <component>
//~	Name: Debug
//~	Info: Debug API
//~ </component>


(function() {

	_.props = function(obj) {
		var result = [];
		for(var prop in obj) {result.push(prop+' = '+obj[prop]);}
		console.log(result.join('\n'));
	};

	_.time = function(func) {
		var t = Date.now();
		func();
		return Date.now()-t;
	};

})();