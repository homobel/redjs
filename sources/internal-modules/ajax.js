
//~ <component>
//~	Name: Ajax
//~	Info: Ajax API
//~ </component>


	(function() {

		_.aj = {};

		_.aj.obj = function() {
			return new XMLHttpRequest();
		};

		_.aj.settings = {
			'type': 'post',
			'url': location.href,
			'user': null,
			'password': null,
			'contentType': {
				'xml': 'application/xml, text/xml',
				'html': 'text/html',
				'text': 'text/plain',
				'json': 'application/json, text/javascript',
				'script': 'text/javascript',
				'urlencoded': 'application/x-www-form-urlencoded',
				'multipart': 'multipart/form-data'
			},
			'accept': 'json',
			'interval': 150,
			'longReq': 60000,
			'middleReq': 30000
		};

		function encodeData(obj) {
			if(type(obj).is('object')) {
				var data=[];
				for(var prop in obj) {
					data.push(prop+'='+encodeURIComponent(obj[prop]));
				}
				data = data.join('&');
				return data;
			}
			return '';
		}

		function ajaxParams(params) {
			if(!(params instanceof Object)) {
				this.url = params;
			}
			else {
				for(var prop in params) {
					this[prop] = params[prop];
				}
			}
		}

		// OPTIONS: url (str), type (str), before (F), interval (uint), timeout (uint), data (Obj), context(Obj), dataType/send (str), accept (str), user (str), password (str)

		ajaxParams.prototype = _.aj.settings;

		_.aj.query = function(params, xmlreq) {

			params = new ajaxParams(params);

			var	d = _.deferred(),
				resptimer,
				timeout;

			xmlreq = xmlreq || _.aj.obj();

			function checkStatus() {
				if(xmlreq.readyState == 4 && xmlreq.status == 200) {
					clearInterval(timeout);
					clearInterval(resptimer);
					var resp = (params.accept == 'xml')?xmlreq.responseXML:xmlreq.responseText;
					if(params.accept == 'json') {
						resp = JSON.parse(resp);
					}
					d.resolve(params.context, resp);
				}
			}

			if(params.before instanceof Function) {
				params.before();
			}

			if(type(params.timeout).is('number')) {
				timeout = setTimeout(function() {
					clearInterval(resptimer);
					d.reject(params.context, 'timeout');
				}, params.timeout);
			}

			resptimer = setInterval(checkStatus, params.interval);

			var accept = _.aj.settings.contentType[params.accept];

			if(params.type == 'post') {
				xmlreq.open('post', params.url, true);
				xmlreq.setRequestHeader('Content-Type', _.aj.settings.contentType.urlencoded);
				xmlreq.setRequestHeader('Accept', accept);
				xmlreq.send(encodeData(params.data));
			}
			else {
				xmlreq.open('get', params.url+'?'+encodeData(params.data), true);
				xmlreq.setRequestHeader('Accept', accept);
				xmlreq.send(null);
			}

			d.error(function() {
				xmlreq.abort();
			});

			return d;
		};

		_.getScript = function(url, flag) {
			var script =  _.aj.query({'url': url, 'accept': 'script'});
			if(!flag) {
				script.success(function(data, context) {
					eval.call(context, data);
				});
			}
			return script;
		};

	})();
