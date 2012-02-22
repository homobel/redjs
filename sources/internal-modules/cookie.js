
//~ <component>
//~	Name: Cookies
//~	Info: Cookies API
//~ </component>


	(function() {

		function getCookie(name) {
			if(name && new RegExp('(?:^|;\\s*)' + name + '=([^;]*)').test(document.cookie)) {
				return decodeURIComponent(RegExp.$1);
			}
		}

		function setCookie(name, value, days, attrs) {
			var cookie = [name+'='+encodeURIComponent(value || '')];
			if(days) {
				cookie.push('max-age='+parseInt(days*86400));
			}
			if(attrs) for(var prop in attrs) {
				cookie.push(prop+'='+attrs[prop]);
			}
			document.cookie = cookie.join('; ');
		}

		_.cookie = function(name, value, days, attr) {
			if(arguments.length < 2) {
				return getCookie(name);
			}
			else {
				setCookie(name, value, days, attr);
			}
		};

	})();
