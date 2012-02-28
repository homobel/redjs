
//~ <component>
//~	Name: Ajax
//~	Info: Ajax API
//~ </component>


	(function() {

		_.aj = {
			'obj': function() {
				return new XMLHttpRequest();
			},
			'settings': {
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
			},
			'encodeData': function (obj) {
				if(type(obj).is('object')) {
					var data=[];
					for(var prop in obj) {
						data.push(prop + '=' + encodeURIComponent(obj[prop]));
					}
					return data.join('&');
				}
				return '';
			}
		};

		// parameters constructor

		function RedAjaxParams(params) {
			var type = _.type(params);
			if(type.is('string')) {
				this.url = params;
			}
			else if(type.is('object')) {
				for(var prop in params) {
					this[prop] = params[prop];
				}
			}
		}

		RedAjaxParams.prototype = _.aj.settings;

		// error constructor

		function RedAjaxError(type, message) {
			this.type = type;
			this.message = message;
		}

		RedAjaxError.prototype.toString = function() {
			return this.message;
		};

		// main function
		// OPTIONS: url (str), type (str), before (F), interval (uint), timeout (uint), data (Obj), context(Obj), dataType/send (str), accept (str), user (str), password (str)

		_.aj.query = function(params, xmlreq) {

			params = new RedAjaxParams(params);

			var	d = _.deferred(),
				resptimer,
				timeout;

			// use greated object if necessary
			xmlreq = xmlreq || _.aj.obj();

			function checkStatus() {
				if(xmlreq.readyState == 4 && xmlreq.status == 200) {
					clearInterval(timeout);
					clearInterval(resptimer);
					var resp = params.accept == 'xml' ? xmlreq.responseXML : xmlreq.responseText;
					if(params.accept == 'json') {
						resp = JSON.parse(resp);
					}
					d.resolve([resp], params.context);
				}
			}

			if(params.before instanceof Function) {
				params.before();
			}

			if(typeof params.timeout == 'number') {
				timeout = setTimeout(function() {
					clearInterval(resptimer);
					d.reject(new RedAjaxError('timeout', 'Too long ajax request!'), params.context);
				}, params.timeout);
			}

			resptimer = setInterval(checkStatus, params.interval);

			var acceptHeader = _.aj.settings.contentType[params.accept];

			if(params.type == 'post') {
				xmlreq.open('post', params.url, true);
				xmlreq.setRequestHeader('Content-Type', _.aj.settings.contentType.urlencoded);
				xmlreq.setRequestHeader('Accept', acceptHeader);
				xmlreq.send(_.aj.encodeData(params.data));
			}
			else {
				xmlreq.open('get', params.url+'?'+_.aj.encodeData(params.data), true);
				xmlreq.setRequestHeader('Accept', acceptHeader);
				xmlreq.send(null);
			}

			d.error(function() {
				xmlreq.abort();
			});

			return d;
		};

		_.script = function(url) {
			var script =  _.aj.query({'url': url, 'accept': 'script'});
			if(!flag) {
				script.success(function(data, context) {
					_('+script').attr('type', 'text/javascript').html(data).appendTo(headNode).remove();
				});
			}
			return script;
		};

	})();
