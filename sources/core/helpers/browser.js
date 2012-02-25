
//~ <component>
//~	Name: Browser Helper
//~	Info: Assume browser & feature detection
//~ </component>


	function Browser() {
		this.value = 'unknown';
		this.version = Browser.ie.version();
		Browser.variants.forEach(function(c) {
			this[c] = !!~Browser.str.indexOf(c);
			if(this[c]) {
				this.value = c;
			}
		}, this);
		if(this.version !== undefined) {
			if(!this.msie) {
				this[this.value] = false;
				this.value = 'msie';
				this.msie = true;
			}
		}
		this.features = {};
		this.toString = function() {
			return this.value;
		}
	}

	Browser.str = (navigator.userAgent || navigator.vendor || '').toLowerCase();
	Browser.variants = ['msie', 'chrome', 'firefox', 'opera', 'safari', 'kde', 'camino'];
	Browser.ie = {
		'variants': [6, 7, 8, 9],
		'version': function() {
			var html = [];
			this.variants.forEach(function(c) {
				html.push('<!--[if IE ' + c + ']><div title="' + c + '"></div><![endif]-->');
			});
			testNode.innerHTML = html.join();
			var node = testNode.getElementsByTagName('div')[0];
			if(node) {
				return node.getAttribute('title');
			}
			return undefined;
		}
	};

	function Platform() {
		this.value = 'unknown';
		Platform.variants.forEach(function(c) {
			this[c] = !!~Platform.str.indexOf(c);
			if(this[c]) {
				this.value = c;
			}
		}, this);
		this.toString = function() {
			return this.value;
		}
	}

	Platform.str = navigator.platform.toLowerCase();
	Platform.variants = ['win', 'mac', 'linux', 'iphone', 'ipod'];


	var	browser = new Browser(),
		platform = new Platform(),
		ielt9 = '\v' == 'v' && browser.msie;


	// features detection

	function Features() {

		testNode.innerHTML = '<div style="float: left; opacity: .99"></div>';
		var testNodeChild = testNode.getElementsByTagName('div')[0];

		this.JSON = !!win.JSON;
		this.getElementsByClassName = !!doc.getElementsByClassName;
		this.mouseenter = 'onmouseenter' in htmlNode;
		this.mouseleave = 'onmouseleave' in htmlNode;
		this.opacity = testNodeChild.style.opacity.charAt(0) == '0';
		this.cssFloat = testNodeChild.style.cssFloat == 'left';

	}

	browser.features = new Features();

	_.browser = browser;
	_.platform = platform;
	_.ielt9 = ielt9;
