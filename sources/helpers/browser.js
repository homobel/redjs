
// ########################---------- BROWSER

	(function() {

		var	agent = {},
			nav = navigator.userAgent.toLowerCase();

		if(~nav.search(/firefox/)) {
			agent.firefox = true;
		}
		else if(~nav.search(/msie/)) {
			agent.msie = true;
		}
		else if(~nav.search(/opera/)) {
			agent.opera = true;
		}
		else if(~nav.search(/chrome/)) {
			agent.chrome = true;
		}
		else if(~nav.search(/safari/)) {
			agent.safari = true;
		}

		_.browser = agent;
		_.ielt9 = '\v' == 'v';

	})();
