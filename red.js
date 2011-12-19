
//	RedJS library v. 0.7						//
//										//
//	by: Archy Sharp 							//
//	see https://github.com/homobel/redjs for details	//

'use strict';

/* --------------------######-------------------- Default obj's extension --- */

;(function(A) {

	// Back compatibility js 1.6

	if(!A.indexOf) {

		A.indexOf = function(object) {
			for (var i = 0, l = this.length; i < l; i++) {
				if (i in this && this[i] === object) {
					return i;
				}
			}
			return -1;
		};

		A.lastIndexOf = function(object) {
			for (var i = this.length - 1; i >= 0; i--) {
				if (i in this && this[i] === object) {
					return i;
				}
			}
			return -1;
		};

		A.forEach = function(fn, thisObj) {
			for (var i = 0, l = this.length; i < l; i++) {
				if (i in this) {
					fn.call(thisObj, this[i], i, this);
				}
			}
		};

		A.map = function(fn, thisObj) {
			var result = new Array(this.length);
			for (var i = 0, l = this.length; i < l; i++) {
				if (i in this) {
					result[i] = fn.call(thisObj, this[i], i, this);
				}
			}
			return result;
		};

		A.filter = function(fn, thisObj) {
			var result = [];
			for (var i = 0, l = this.length; i < l; i++) {
				if (i in this && fn.call(thisObj, this[i], i, this)) {
					result.push(this[i]);
				}
			}
			return result;
		};

		A.every = function(fn, thisObj) {
			for (var i = 0, l = this.length; i < l; i++) {
				if (i in this && !fn.call(thisObj, this[i], i, this)) {
					return false;
				}
			}
			return true;
		};

		A.some = function(fn, thisObj) {
			for (var i = 0, l = this.length; i < l; i++) {
				if (i in this && fn.call(thisObj, this[i], i, this)) {
					return true;
				}
			}
			return false;
		};

	}

	// additional

	A.forEachInv = function(fn, thisObj) {
		for (var i = this.length; i-- ;) {
			if (i in this) {
				fn.call(thisObj, this[i], i, this);
			}
		}
	};

	A.copy = function() {
		return this.slice(0);
	};

	A.del = function(n) {
		if(n in this) {
			this.splice(n, 1);
		}
		return this;
	};

	A.linear = function() {
		var M = [];
		function linear(m) {
			if(m instanceof Array) m.forEach(linear);
			else M.push(m);
		}
		linear(this);
		return M;
	};

	A.pushOnce = function(n) {
		var index = this.indexOf(n);
		if(!~index) {this.push(n); return this.length-1;}
		return index;
	};

	A.toggle = function(n) {
		var index = this.indexOf(n);
		if(index == -1) {
			this.push(n);
		}
		else {
			this.del(index);
		}
		return index;
	};

})(Array.prototype);

;(function(S) {

	S.isMail = function() {
		return !!~this.search(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/);
	}

	S.hasWord = function(word) {
		if(this.search('\\b' + word + '\\b') == -1) {return false;}
		return true;
	}

	S.camelCase = function() {
		return this.replace(/-\D/g, function(match){
			return match.charAt(1).toUpperCase();
		});
	}

	S.toInt = function(base){
		return parseInt(this, base || 10);
	}

	S.toFloat = function(base){
		return parseFloat(this);
	}

	function tenBasedColor(string) {
		if(string.length === 1) {string += string;}
		return string.toInt(16).limit(0, 255)
	}

	S.getColors = function() {
		if(this.charAt(0) == '#') {
			if(this.length == 4) {
				return this.match(/\w/g).map(tenBasedColor);
			}
			else {
				return this.match(/\w{2}/g).map(tenBasedColor);
			}
		}
		else {
			return this.match(/\d{1,3}/g).map(function(c) {return c.toInt().limit(0, 255);})
		}
	}

	S.toRgb = function() {
		return 'rgb('+this.getColors().join(',')+')';
	},

	S.toHex = function() {
		return '#'+this.getColors().map(function(c) {
			var color = c.toString(16);
			return (color.length === 1)?0+color:color;
		}).join('')
	}

})(String.prototype);

;(function(N) {

	N.limit = function(a, b) {
		var min = Math.min(a, b), max = Math.max(a, b);
		return Math.min(max, Math.max(min, this));
	}

})(Number.prototype);

/* --------------------######-------------------- FRAMEWORK --- */

;(function(win) {

	var	_ = function(name, node) {return new RedJScollection(name, node);},
		redjs = _,
		ielt9 = '\v' == 'v',

		hash = ('redjs'+Math.random()).replace('0.', ''),

		doc = document,
		win = window,
		type;

// ########################---------- TYPE DETERMINANT

	;(function() {

		function Type(n) {this.val = n};

		function getType(something) {
			switch(typeof something) {
				case 'undefined': return getType['undefined'];
				case 'boolean': return getType['boolean'];
				case 'number': return getType['number'];
				case 'string': return getType['string'];
				case 'function': if(something.call) {return getType['function'];};
				case 'object': if(something instanceof RedJScollection) {return  getType['redjs'];}
						else if(something === null) {return getType['null'];}
						else if(something instanceof Array) {return getType['array'];}
						else if(something.nodeName && something.nodeType !== undefined) {return getType['node'];}
						else if(something.length !== undefined) {return getType['nodelist'];}
						else if(Object.prototype.toString.call(something) == '[object Object]') {return getType['object'];}
			};
			return getType['unknown'];
		};

		Type.prototype = {
			'toString': function() {return types[this.val];},
			'is': function(typeStr) {
				return types[this.val] == typeStr;
			}
		};

	  	var	types = ['undefined', 'boolean', 'number', 'string', 'function', 'node', 'nodelist', 'array', 'object', 'null', 'redjs', 'unknown'];

		types.forEach(function(c, i) {
			this[c] = new Type(i);
			this[i] = c;
		}, getType);

		type = _.type = getType;

	})();

// ########################---------- INNER FUNCTIONS

	function toArraySimple(obj) {
		var argType = type(obj);
		if(argType.is('array')) {return obj;}
		else if(argType.is('nodelist')) {
			var arr = [];
			for(var i = 0; i < obj.length; i++) {
				arr.push(obj[i]);
			}
			return arr;
		}
		else if(argType.is('object')) {
			var arr = [];
			for(var prop in obj) {
				arr.push(obj[prop]);
			}
			return arr;
		}
		else if(argType.is('redjs')) {return obj.ns;}
		else if(argType.is('undefined') || argType.is('null') || argType.is('unknown')) {
			return [];
		}
		else {
			return [obj];
		}
	};

// ########################---------- UTILITES

// browser

	_.browser = (function() {

		var agent = {}, nav = navigator.userAgent.toLowerCase();

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

		return agent;

	})();

	_.ielt9 = ielt9;

	_.hash = hash;

	_.isEmptyObj = function(obj) {
		for(var prop in obj) {return false;}
		return true;
	};

	_.joinObj = function() {
		var O = new Object();
		for(var i = 0; i<arguments.length; i++) {
			for(var p in arguments[i]) {

				/* Debug edition
				if(!(p in O)) {O[p] = arguments[i][p];}
				else {throw new Error('Incorrect objects join!');}
				*/

				O[p] = arguments[i][p];
			}
		}
		return O;
	};

	_.toArray = function() {
		var l = arguments.length;
		if(l > 1) {
			var M = [];
			for(var i = 0; i<l; i++) {
				M = M.concat(toArraySimple(arguments[i]));
			}
			return M;
		}
		else {
			return toArraySimple(arguments[0]);
		}
	};

// compatibility

	_.easyModeOn = function() {
		if(!window._) {window._ = _; return true;}
		return false;
	}

	_.easyModeOff = function() {
		if(window._ == _ && window._ === redjs) {delete window._; return true;}
		return false;
	}

// debuging

	_.props = function(obj){
		var result = [];
		for(var prop in obj) result.push(prop+' = '+obj[prop]);
		console.log(result.join('\n'));
	};

	_.time = function(func) {
		var t = Date.now();
		func();
		return Date.now()-t;
	};

// ########################---------- DATA

	;(function() {

		var	cacheNextVal = 0,
			dataHash = 'data___'+hash;

		function hookCache(node) {
			node[dataHash] = cacheNextVal++;
			_.cache[node[dataHash]] = {};
		}

		function data(node, name, val) {
			if(node) {
				var key = node[dataHash];
				if(arguments.length == 2)  {
					if(key !== undefined) {
						return _.cache[key][name];
					}
					return undefined;
				}
				else if(arguments.length === 3) {
					if(val === null) {
						delete _.cache[key][name];
					}
					else {
						if(key === undefined) {hookCache(node);}
						_.cache[node[dataHash]][name] = val;
						return val;
					}
				}
			}
		}

		_.data = data;
		_.cache = {};

	})();

// ########################---------- DEFFERED

	;(function() {

		var	slice = Array.prototype.slice,
			_FuncList = {
				'exec': function(obj) {
					this.calls++;
					var args = arguments;
					this.list.forEach(function(c) {
						c.apply(obj, slice.call(args, 1));
					});
					return this;
				},
				'add': function(func) {
					if(func.call) {
						this.list.push(func);
					}
					return this;
				},
				'del': function(func, flag) {
					var n = this.list.indexOf(func);
					if(flag) {
						while(~n) {
							this.list.del(n);
							n = this.list.indexOf(func);
						}
					}
					else {
						this.list.del(n);
					}
					return this;
				}
			},
			_Deferred = {
				'resolve': function(context) {
					if(this.status == -1) {
						this.status = 1;
						this.context = context;
						this.arg = slice.call(arguments, 1);
						this.successList.exec(context, this.arg);
						this.anywayList.exec(context, this.arg);
					}
				},
				'reject': function(context) {
					if(this.status == -1) {
						this.status = 0;
						this.context = context;
						this.arg = slice.call(arguments, 1);
						this.errorList.exec(context, this.arg);
						this.anywayList.exec(context, this.arg);
					}
				},
				'success': function(func) {
					if(this.status == -1) this.successList.add(func);
					else if(this.status === 1) func.apply(this.context, this.arg);
					return this;
				},
				'error': function(func) {
					if(this.status == -1) this.errorList.add(func);
					else if(this.status === 0) func.apply(this.context, this.arg);
					return this;
				},
				'anyway': function(func) {
					if(this.status == -1) this.anywayList.add(func);
					else if(this.status === 0) func.apply(this.context, this.arg);
					return this;
				}
			};

		function FuncList() {
			this.calls = 0;
			this.list = [];
		}

		function Deferred() {
			this.status = -1;
			this.errorList = new FuncList();
			this.successList = new FuncList();
			this.anywayList = new FuncList();
		}

		FuncList.prototype = _FuncList;
		Deferred.prototype = _Deferred;

		_.funcList = function() {
			return new FuncList();
		};

		_.deferred = function() {
			return new Deferred();
		};

		_.when = function() {

			var	when = new Deferred(),
				args = arguments,
				i, l = args.length,
				counter = 0,
				err = false;

			for(i = 0; i<l; i++) {
				if(args[i] instanceof Deferred) {
					args[i].success(function() {
						if(++counter == l) {
							if(err) {when.reject();}
							else {when.resolve();}
						}
					}).error(function() {
						err = true;
						if(++counter == l) {when.reject();}
					});
				}
			}
			return when;
		};

	})();

// ########################---------- AJAX

	;(function() {

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
				xmlreq = xmlreq || _.aj.obj(),
				resptimer,
				timeout;

			function checkStatus() {  
				if (xmlreq.readyState == 4 && xmlreq.status == 200) { 
					clearInterval(timeout);
					clearInterval(resptimer);
					var resp = (params.accept == 'xml')?xmlreq.responseXML:xmlreq.responseText;
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

// ########################----------- COOKIES

	;(function() { 

		function getCookie(name) {
			if(name && new RegExp('(?:^|;\\s*)' + name + '=([^;]*)').test(document.cookie)) {
				return decodeURIComponent(RegExp.$1);
			}
		}

		function setCookie(name, value, days, attrs) {
			var cookie = [name+'='+encodeURIComponent(value || '')];
			if(days) cookie.push('max-age='+days*86400);
			if(attrs) for(var prop in attrs) {
				cookie.push(prop+'='+attrs[prop]);
			};
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

// ########################---------- CROSSBROWSER METHODS WORKING WITH SINGLE NODE

// --------- SELECTORS

	_.id = function(name) {return doc.getElementById(name);};

	_.tag = function(name, node) {return (node || doc).getElementsByTagName(name);};

	_.className = (function() {
		if(document.getElementsByClassName) {
			return function(name, node) {
				return (node || document).getElementsByClassName(name);
			}
		}
		else {
			return function(name, node) {
				if(name) {
					var	nodes = _.tag('*', node),
						classArray = name.split(/\s+/),
						classes = classArray.length,
						result = [], i,l,j;
		
					for(i = 0, l = nodes.length; i < l; i++) {
						for(j = 0; j < classes; j++) {
							if(nodes[i].className.hasWord(classArray[j])) {
								result.push(nodes[i]);
								break;
							}
						}
					}
					return result;
				}
				else {throw Error('Not enough arguments');}
			}
		}
	})();

// --------- CSS

	;(function() {

		_.gstyle = (function() {
			if (!win.getComputedStyle) {
				return function(node, rule) {return node.currentStyle[rule];}
			} else {
				return function(node, rule) {return win.getComputedStyle(node, null)[rule];} 
			}
		})();

		var exceptions = {
			'float': (function() {
				if(ielt9) {
					return  function(node, val) {
						if(val === undefined) {
							return _.gstyle(node, 'styleFloat');
						}
						else {
							node.style.styleFloat = val;
						}
					}
				}
				else {
					return  function(node, val) {
						if(val === undefined) {
							return _.gstyle(node, 'float') || _.gstyle(node, 'cssFloat');
						}
						else {
							node.style.cssFloat = val;
						}
					}
				}
			})(),
			'opacity': (function() {
				if(ielt9) {
					return  function(node, num) {
						if(num === undefined) {
							var co = _.gstyle(node, 'filter');
							if(co.charAt(0) == 'a') {
								return parseFloat(co.match(/\d+/)[0]/100);
							}
							else return 1;
						}
						else {
							node.style.filter = 'alpha(Opacity='+num*100+')';
						}
					}
				}
				else {
					return  function(node, num) {
						if(num === undefined) {
							return parseFloat(_.gstyle(node, 'opacity'));
						}
						else {
							node.style.opacity = num;
						}
					}
				}
			})()
		};

		_.css = function(node, property, value) {
			var propertyType = type(property);
			if(propertyType.is('string')) {
				if(property in exceptions) {
					return exceptions[property](node, value);
				}
				else {
					if(value === undefined) {
						return _.gstyle(node, property);
					}
					else {
						node.style[property] = value;
					}
				}
			}
			else if(propertyType.is('object')) {
				for(var prop in property) {
					_.css(node, prop, property[prop]);
				}
			}
		};

		_.height = function(node, padding, border, margin) {

			var height = (padding)?node.offsetHeight:_.gstyle(node, height).toInt();

			if(border) {

				var	borderTopWidth = _.css(node, 'borderTopWidth'),
					borderBottomWidth = _.css(node, 'borderBottomWidth');

				borderTopWidth = isNaN(borderTopWidth)?0:borderTopWidth.toInt();
				borderBottomWidth = isNaN(borderBottomWidth)?0:borderBottomWidth.toInt();

				height += borderTopWidth+borderBottomWidth;
			}
			margin = (margin)?_.gstyle(node, 'marginTop').toInt()+_.gstyle(node, 'marginBottom').toInt():0;
			return height+margin+border;
		};

	})();

// --------- ANIMATION

	;(function() {

		var	animationDelay = 16,
			fn = {
				'linear': function(x) {
					return x;
				},
				'swing': function(x) {
					return (-Math.cos(x*Math.PI)/2)+0.5;
				}
			},
			animationData = 'animation___'+hash;

		function animationStatus(node, type, val) {
			var animData = _.data(node, animationData) || _.data(node, animationData, {});
			if(val !== undefined) {animData[type] = val; return;}
			return animData[type];
		}

		_.animate = function(node, type, terminal, time, callback, fnName) {

			function changeCss() {
				var	now = Date.now() - start,
					progress = now / time,
					result = ((terminal - current)*easing(progress)+current).limit(current, terminal);

				_.css(node, type, result+unit);

				if(progress < 1) {
					node[timerName] = setTimeout(changeCss, animationDelay);
				}
				else {
					_.css(node, type, terminal);
					animationStatus(node, type, '');
					if(callback) {callback.call(node);}
				}
			}

			var	currentAnimStatus = animationStatus(node, type),
				currCss = _.css(node, type).toString(),
				current = (type == 'opacity')?currCss.toFloat():currCss.toInt(),
				diff = current-terminal,
				animStatus = (diff<0)?0:1,
				timerName = 'animation_'+type+'___'+hash;

			if(currentAnimStatus !== animStatus && diff !== 0) {
				if(currentAnimStatus !== undefined) {clearTimeout(node[timerName]);}

				var	unit = currCss.match(/[a-z]+/),
					easing = fn[fnName] || fn['swing'],
					start = Date.now();

				unit = (unit)?unit:'';
				animationStatus(node, type, animStatus);

				node[timerName] = setTimeout(changeCss, animationDelay);
			}

		};

		_.hide = function(node, time, callback) {
			if(time) {
				_.animate(node, 'opacity', 0, time, function() {
					node.style.display = 'none';
					if(callback) callback();
				});
			}
			else {
				if (!node.display) {
					var display = _.gstyle(node, 'display');
					if(display != 'none') {node.display = display}
					else {node.display = 'block';}
				}
				node.style.display = 'none';
			}
		};

		_.show = function(node, time, callback) {
			if(time) {
				if(_.gstyle(node, 'display') == 'none') {
					_.css(node, 'opacity', 0);
					node.style.display = 'block';
				}
				_.animate(node, 'opacity', 1, time, function() {
					if(callback) callback();
				});
			}
			else {
				node.style.display = node.display || 'block';
			}
		};

	})();

// --------- DOM MANIPULATION

	_.create = function(tagName, attr) {
		var node = doc.createElement(tagName);
		if(attr) {
			for(var prop in attr) {
				node.setAttribute(prop, attr[prop]);
			}
		}
		return node;
	};

	_.wrap = function(node, wrapper, attr) {
		if(wrapper.hasWord) {
			wrapper = _.create(wrapper, attr);
		}
		node.parentNode.insertBefore(wrapper, node);
		wrapper.appendChild(node);
	};

	_.children = function(node, tagName) {
		var c = node.childNodes, C = [];
		if(tagName) {tagName = tagName.toUpperCase();}
		for(var i = 0; i < c.length; i++) {
			if(tagName && c[i].nodeName != tagName) {continue;}
			if(c[i].nodeType === 1) {C.push(c[i]);}
		}
		return C;
	};

	_.firstChild = function(node, child) {
		if(child === undefined) {
			var child = node.firstChild;
			while(child.nodeType !== 1 && child.nextSibling) {
				child = child.nextSibling;
			}
			if(child.nodeType === 1) return child;
			return undefined;
		}
		else {
			if(typeof child == 'string') child= _.create(child);
			node.insertBefore(child, node.firstChild);
			return child;
		}
	};

	_.getNodeText = function(node) {
		return node.text || node.textContent || '';
	};

// --------- CLASS MANIPULATION

	_.addClass = function(node, name) {
		if(!node.className.hasWord(name)) {
			if(!node.className) {node.className = name;}
			else {node.className += ' ' + name;}
		}
	};

	_.delClass = function(node, name) {
		node.className = node.className.replace(new RegExp('[ ]*\\b' + name +'\\b'), '');
	};

	_.hasClass = function(node, name) {
		return node.className.hasWord(name);
	};

	_.toggleClass = function(node, name) {
		if(node.className.hasWord(name)) {
			_.delClass(node, name);
			return false;
		}
		else {
			_.addClass(node, name);
			return true;
		}
	};

// --------- EVENTS

	var eventNames = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'focus', 'blur', 'change', 'submit', 'keypress'];

	if(_.browser.msie) {
		eventNames.push('mouseenter', 'mouseleave');
	}

	;(function() {

		var	addEvent = (function() {
				if(win.addEventListener){
					return function(node, type, handler) {node.addEventListener(type, handler, false);};
				} else {
					return function(node, type, handler) {node.attachEvent('on'+type, handler);};
				}
			})(),
			delEvent = (function() {
				if(win.removeEventListener){
					return function(node, type, handler) {node.removeEventListener(type, handler, false);};
				} else {
					return function(node, type, handler) {node.detachEvent('on'+type, handler);};
				}
			})(),
			createEv = (function() {
				if(doc.createEventObject) {
					return function(e) {return e || document.createEventObject();};
				} else if(document.createEvent) {
					return function(e) {return e || document.createEvent('HTMLEvents');};
				}
			})(),
			fireEv = (function() {
				if(doc.createEventObject) {
					return function(node, type, e) {node.fireEvent('on'+type, e);};
				} else if(document.createEvent) {
					return function(node, type, e) {e.initEvent(type, false, false); node.dispatchEvent(e);};
				}
			})(),

			eventHash = 'event___'+hash,
			handlerHash = 'handler___'+hash,

			_EventData = {
				'set': function(event, func, once) {
					if(this.events[event] === undefined) this.events[event] = [];
					if(once) this.events[event].pushOnce(func);
					else this.events[event].push(func);
				},
				'unset': function(eventType, func) {
					var event = this.events[eventType];
					if(event === undefined) return 0;
					event.del(event.indexOf(func));
					if(event.length === 0) {delete this.events[eventType]; return 0;}
					return event.length;
				},
				'clear': function(event) {
					delete this.events[event];
				},
				'call': function(node, e) {
					var event = this.events[e.type];
					if(event) {
						event.forEach(function(c) {
							if(c.call(this, e) === false) {e.preventDefault();}
						}, node);
					}
				}
			},
			fixEv = (function() {
				if(!ielt9) {
					return function(e) {
						return e;
					}
				}
				else {
					return function() {
						var e = win.event;
						e.target = e.srcElement;
						e.relaredTarget = (e.target==e.fromElemet)?e.toElement:e.fromElement;
						e.stopPropagation = stopPropagation;
						e.charCode = e.keyCode;
						e.preventDefault = preventDefault;
						return e;
					}
				}
			})();

		EventData.prototype = _EventData;

		function EventData() {
			this.events = {};
		}

		function getNodeEventData(node) {
			return _.data(node, eventHash) || _.data(node, eventHash, new EventData);
		}

		function preventDefault() {
			this.returnValue = false;
		}

		function stopPropagation() {
			this.cancelBubble = true;
		}

		function execute(e) {
			e = fixEv(e);
			getNodeEventData(this).call(this, e);
		}

		_.event = {
			'artificial': {},
			'add': function(node, event, method, once) {
				getNodeEventData(node).set(event, method, once);
				if(~eventNames.indexOf(event)) {
					if(!node[handlerHash]) node[handlerHash] = function(e) {execute.call(node, e);};
					addEvent(node, event, node[handlerHash]);
				}
				else if(_.event.artificial[event]) {
					_.bind(node, _.event.artificial[event].base, _.event.artificial[event].ini, true);
				}
			},
			'del': function(node, event, method) {
				var rest = getNodeEventData(node).unset(event, method);
				if(rest === 0) {
					if(~eventNames.indexOf(event)) {
						delEvent(node, event, node[handlerHash]);
					}
					else if(_.event.artificial[event]) {
						_.unbind(node, _.event.artificial[event].base, _.event.artificial[event].ini);
					}
					delete node[handlerHash];
				}
			},
			'clear': function(node, event) {
				getNodeEventData(node).clear(event);
				delEvent(node, event, node[handlerHash]);
			},
			'create': function(name, base, condition) {
				if(~eventNames.indexOf(name)) return;
				_.event.artificial[name] = {
					'base': base,
					'ini': function(e) {
						if(condition(e, this)) {_.force(this, name, e);}
					}
				};
			},
			'fix': fixEv
		};

		_.force = function(node, eventType, e) {
			if(node && eventType) {
				var e = createEv(e);
				if(eventType in eventNames) {
					fireEv(node, eventType);
				}
				else {
					var e = _.joinObj(e, {'type': eventType});
					getNodeEventData(node).call(node, e);
				}
			}
			else {throw Error('Call _.force function without required argument!');}
		};

		_.bind = _.event.add;
		_.unbind = _.event.del;

	})();

// ########################---------- RED JS COLLECTION

	function getArrWithElemById(name) {
		return toArraySimple(_.id(name));
	}

	function getArrWithElemsByTag(name, node) {
		return toArraySimple(_.tag(name, node));
	}

	function getArrWithElemsByClass(name, node) {
		return toArraySimple(_.className(name, node));;
	}

	function getNodes(name, node) { // return array with matched elements
		if(name === undefined || name === '') {return [];}
		var	inContext = !!node,
			firstType = type(name);

		if(inContext) {
			var secondType = type(name);
			if(secondType.is('string')) {
				node = getNodes(node);
			}
			else node = toArraySimple(node);
		}
		if(firstType.is('string')) {
			var firstChar = name.charAt(0);
			if(firstChar == '#') {
				return getArrWithElemById(name.substr(1, name.length));
			}
			else if(firstChar == '.') {
				var className = name.substr(1, name.length);
				if(inContext) {
					for(var nodes = [], i = 0, l = node.length; i<l; i++) {
						nodes = nodes.concat(getArrWithElemsByClass(className, node[i]));
					}
					return nodes;
					
				}
				else {
					return getArrWithElemsByClass(className);
				}
			}
			else if(firstChar == '+') {
				return [_.create(name.substr(1, name.length))];
			}
			else {
				if(inContext) {
					for(var nodes = [], i = 0, l = node.length; i<l; i++) {
						nodes = nodes.concat(getArrWithElemsByTag(name, node[i]));
					}
					return nodes;
					
				}
				else {
					return getArrWithElemsByTag(name);
				}
			}
		}
		else if (firstType.is('redjs')) {
			return name.ns;
		}
		else {
			return toArraySimple(name);
		}
	}

	function RedJScollection(name, context) {
		this.ns = getNodes(name, context);
		this.length = this.ns.length;
	};

	_.fn = {
		'constructor': _,
		'include': function() {
			for(var i = 0, l = arguments.length; i < l; i++) {
				var nodes = getNodes(arguments[i]);
				nodes.forEach(function(c) {
					if(!~this.ns.indexOf(c)) {
						this.ns.push(c)
					}
				}, this);
				this.length = this.ns.length;
			}
			return this;
		},
		'exclude': function() {
			for(var i = 0, l = arguments.length; i < l; i++) {
				var nodes = getNodes(arguments[i]);
				this.ns = this.ns.filter(function(c) {
					return !~nodes.indexOf(c);
				}, this);
				this.length = this.ns.length;
			}
			return this;
		}
	};

	RedJScollection.prototype = _.fn;

	_.multi = function() { // multiselection
		var M = _();
		for(var i = 0, l = arguments.length; i<l; i++) {
			M.include(arguments[i]);
		}
		return M;
	};

// ########################---------- FN EXTENSION

	_.extend = function(obj) {
		if(typeof obj == 'object') {
			for(var m in obj) {
				_.fn[m] = obj[m];
				
				/* debug edition
				if(_.fn[m] === undefined) {
					_.fn[m] = obj[m];
				}
				else {
					throw new Error('Object extension: object has the same property!');
				}
				*/
			}
		}
	};

	_.extend({

		'each': function(f) {
			this.ns.forEach(f);
			return this;
		},

// data manipulation

		'data': function(name, val) {
			if(name !== undefined && name !== '') {
				if(arguments.length == 2) {
					this.ns.forEach(function(c) {
						_.data(c, name, val);
					});
				}
				else {
					if(this.ns[0]) return _.data(this.ns[0], name);
				}
			}
			return this;
		},

// collection manipulation

		'eq': function(n) {
			if(this.ns[n]) return _(this.ns[n]);
			return this;
		},
		'first': function() {
			return this.eq(0);
		},
		'last': function() {
			return this.eq(this.length-1);
		},
		'children': function(tagName) {
			var M = _();
			this.ns.forEach(function(c) {
				M.include(_.children(c, tagName));
			});
			return M;
		},
		'parent': function() {
			var M = _();
			this.ns.forEach(function(c) {
				M.include(c.parentNode);
			});
			return M;
		},
		'firstChild': function(child) {
			if(child === undefined) {
				var M = _();
				this.ns.forEach(function(c) {
					M.include(_.firstChild(c));
				});
				return M;
			}
			else {
				var M = _();
				this.each(function(c) {
					M.include(_.firstChild(c, child));
				});
				return M;
			}
		},
		'filter': function(func) {
			if(this.length > 0 && func.call) {
				var M = this.ns.filter(function(c) {						return func.call(c);
					return true;
				});
				return _(M);
			}
			return this;
		},
		'find': function(selector) {
			return _(selector, this);
		},

// appearance manipulation

		'hide': function(time, callback) {
			this.ns.forEach(function(c) {
				_.hide(c, time, callback);
			});
			return this;
		},
		'show': function(time, callback) {
			this.ns.forEach(function(c) {
				_.show(c, time, callback);
			});
			return this;
		},
		'animate': function(type, terminal, time, fnName, callback) {
			this.ns.forEach(function(c) {
				_.animate(c, type, terminal, time, fnName, callback);
			});
			return this;
		},

// events

		'bind': function(event, action) {
			this.ns.forEach(function(c) {
				_.bind(c, event, action);
			});
			return this;
		},
		'unbind': function(event, action) {
			this.ns.forEach(function(c) {
				_.unbind(c, event, action);
			});
			return this;
		},
		'force': function(event_type) {
			this.ns.forEach(function(c) {
				_.force(c, event_type);
			});
			return this;
		},
		'clearEvent': function(ev) {
			this.ns.forEach(function(c) {
				_.event.clear(c, ev);
			});
			return this;
		},

// attr manipulation

		'attr': function(name, val) {
			if(arguments.length === 2) {
				this.ns.forEach(function(c) {
					c.setAttribute(name, val);
				});
			}
			else {
				if(this.ns[0]) return this.ns[0].getAttribute(name);
			}
			return this;
		},
		'addClass': function(name) {
			this.ns.forEach(function(c) {_.addClass(c, name);});
			return this;
		},
		'toggleClass': function(name) {
			this.ns.forEach(function(c) {_.toggleClass(c, name);});
			return this;
		},
		'delClass': function(name) {
			this.ns.forEach(function(c) {
				_.delClass(c, name);
			});
			return this;
		},
		'hasClass': function(name) {
			if(this.ns[0]) return _.hasClass(this.ns[0], name);
		},
		'css': function(name, value) {
			if(value !== undefined || name instanceof Object) {
				this.ns.forEach(function(c) {
					_.css(c, name, value);
				});
			}
			else {
				if(this.ns[0]) return _.css(this.ns[0], name);
			}
			return this;
		},
		'height': function(padding, border, margin) {
			if(this.ns[0]) return _.height(this.ns[0], padding, border, margin);
		},
		'val': function(value) {
			if(value !== undefined) {
				this.ns.forEach(function(c) {
					c.value = value;
				});
				return this;
			}
			else {
				if(this.ns[0]) return this.ns[0].value;
			}
		},

// dom manipulation

		'wrap': function(wrapper) {
			this.ns.forEach(function(c) {
				_.wrap(c, wrapper);
			});
			return this;
		},
		'html': function(html) {
			if(html !== undefined) {
				this.ns.forEach(function(c) {
					c.innerHTML = html;
				});
			}
			else {
				if(this.ns[0]) return this.ns[0].innerHTML;
			}
			return this;
		},
		'append': function(node) {
			var nodeType = type(node);
			if(nodeType.is('node')) {
				this.each(function(c) {
					c.appendChild(node);
				});
			}
			else if(nodeType.is('redjs')) {
				this.each(function(c) {
					node.each(function(cc) {
						c.appendChild(cc);
					});
				});
			}
			return this;
		}

	});

// --------- EVENTS ADDING

	;(function() {

		var events = eventNames.copy();

		function parentCheck(e, parent) {
			var related = e.relatedTarget;
			while(related && e.tagName != 'HTML') {
				if(related == parent) {return false;}
				related = related.parentNode;
			}
			return true;
		}

		if(!_.browser.msie) {
			_.event.create('mouseenter', 'mouseover', parentCheck);
			_.event.create('mouseleave', 'mouseout', parentCheck);

			events.push('mouseenter', 'mouseleave');
		}

		events.forEach(function(c) {
			var ev = {};
			ev[c] = function(method) {
					this.ns.forEach(function(cc) {_.event.add(cc, c, method);});
					return this;
				};
			_.extend(ev);
		});

	})();

// --------- GLOBALS

	if(!win._) win._ = _;
	win.redjs = redjs;

})(window);

