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

	S.toHex = function(str) {
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

	var	_ = redjs = function(name, node) {return new _.fn.ini(name, node);},
		hash = ('redjs'+Math.random()).replace('0.', ''),
		ielt9 = ('\v' == 'v'),
		doc = document,
		win = window,
		type = (function() {
		
		  	var types = ['undefined', 'boolean', 'number', 'string', 'func', 'node', 'nodelist', 'array', 'object', 'null', 'redjs'];
		
			function num(n) {this.val = n};
			num.prototype.toString = function() {return types[this.val];}
		
			function getType(something) {
				switch (typeof something) {
					case 'undefined': return getType['undefined'];
					case 'boolean': return getType['boolean'];
					case 'number': return getType['number'];
					case 'string': return getType['string'];
					case 'function': if(something.call) {return getType['func'];};
					case 'object': if(something instanceof _) {return  getType['redjs'];}
							else if(something === null) {return getType['null'];}
							else if(something instanceof Array) {return getType['array'];}
							else if(something.nodeName && something.nodeType) {return getType['node'];}
							else if(something.length) {return getType['nodelist'];}
							else if(Object.prototype.toString.call(something) == '[object Object]') {return getType['object'];}
				}
				return -1;
			}
		
			types.forEach(function(c, i) {
				this[c] = new num(i);
				this[i] = c;
			}, getType);
		
			return getType;
		
		})(),
		events = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'focus', 'blur', 'change', 'submit', 'dragstart', 'dragenter', 'dragover', 'drop', 'keypress'];

	function toArraySimple(obj) {
		var argType = type(obj);

		if(argType == type.array) {return obj;}
		else if(argType == type.nodelist) {
			var arr = [];
			for(var i = 0; i < obj.length; i++) {
				arr.push(obj[i]);
			}
			return arr;
		}
		else if(argType == type.object) {
			var arr = [];
			for(var prop in obj) {
				arr.push(obj[prop]);
			}
			return arr;
		}
		else if(argType == type.redjs) {return obj.ns;}
		else {
			return [obj];
		}
	}

	function getNodes(name, node) { // return array with matched elements

		if(name === undefined || name === '') {return [];}

		var	inContext = !!node,
			firstType = type(name),
			secondType = type(node);

		if(inContext) {
			if(secondType == type.redjs) {node = node.ns;}
			if(secondType == type.node) {node = [node];}
		}

		if(firstType == type.string) {
			if(name.charAt(0) == '#') {
				var nodes = _.id(name.substr(1, name.length));
				if(nodes) {return [nodes];}
			}
			else if(name.charAt(0) == '.') {
				if(inContext) {
					var nodes = [], n;
					for(var i = 0, l = node.length; i<l; i++) {
						n = _.className(name.substr(1, name.length), node[i]);
						if(n.length) {nodes = nodes.concat(toArraySimple(n));}
					}
					if(nodes.length) {return nodes;}
				}
				else {
					var nodes = _.className(name.substr(1, name.length));
					if(nodes.length) return toArraySimple(nodes);
				}
			}
			else {				if(inContext) {
					var nodes = [], n;
					for(var i = 0, l = node.length; i<l; i++) {
						n = _.tag(name, node[i]);
						if(n.length) {nodes = nodes.concat(toArraySimple(n));}
					}
					if(nodes.length) {return nodes;}
				}
				else {
					var nodes = _.tag(name, node);
					if(nodes.length) return toArraySimple(nodes);
				}
			}
		}
		else if (firstType == type.redjs) {
			return name.ns;
		}
		else {
			return toArraySimple(name);
		}

		// if no elements matched

		return [];
	}

	_.fn = _.prototype = {
		'constructor': _,
		'ini': function(name, context) {
			this.ns = getNodes(name, context);
			this.length = this.ns.length;
		},
		'include': function(node) {
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
		'exclude': function(node) {
			for(var i = 0, l = arguments.length; i < l; i++) {
				var nodes = getNodes(arguments[i]);
	
				this.ns = this.ns.filter(function(c) {
					return !~nodes.indexOf(c);
				}, this);
	
				this.length = this.ns.length;
			}
			return this;
		}
	}

	_.fn.ini.prototype = _.fn;

	_.multi = function() { // multiselection
		var elements = [];
		for(var i = 0, l = arguments.length; i<l; i++) {
			elements = elements.concat(getNodes(arguments[i]));
		}
		return _(elements);
	};

// ########################---------- UTILITES

	_.ielt9 = ielt9;

	_.type = type;

	_.hash = hash;

	_.props = function(obj){
		var result = [];
		for(var prop in obj) result.push(prop+' = '+obj[prop]);
		console.log(result.join('\n'));
	};

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

	_.easyModeOn = function() {
		if(!window._) {window._ = _; return true;}
		return false;
	}

	_.easyModeOff = function() {
		if(window._ == _) {delete window._; return true;}
		return false;
	}

// ########################---------- DATA

	;(function() {

		var cacheNextVal = 0;

		function hookCache(node) {
			node[hash] = cacheNextVal++;
			_.cache[node[hash]] = {};
		}

		function data(node, name, val) {
			if(arguments.length == 2)  {
				if(node[hash] !== undefined) {
					return _.cache[node[hash]][name];
				}
				return undefined;
			}
			else if(arguments.length == 3) {
				if(!val) {
					delete _.cache[node[hash]][name];
				}
				else {
					if(node[hash] === undefined) {hookCache(node);}
					_.cache[node[hash]][name] = val;
					return val;
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
					var arg = arguments;
					this.calls++;
					this.list.forEach(function(c) {
						c.apply(this, slice.call(arg, 1));
					}, obj);
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
						this.arg = slice.call(arguments);
						this.successList.exec(context, this.arg);
					}
				},
				'reject': function(context) {
					if(this.status == -1) {
						this.status = 0;
						this.context = context;
						this.arg = slice.call(arguments);
						this.errorList.exec(context, slice.call(arguments));
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
			if(type(obj) == type.object) {
				var data=[];
				for(var i in obj) {
					data.push(i+'='+encodeURIComponent(obj[i]));
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

			if(type(params.timeout) == type.number) {
				timeout = setTimeout(function() {
					clearInterval(resptimer);
					d.reject(params.context, 'timeout');
				}, params.timeout);
			}

			resptimer = setInterval(checkStatus, params.interval);

			var accept = _.aj.settings.contentType[params.accept];

			if(params.type == 'post') {
				xmlreq.open('POST', params.url, true);
				xmlreq.setRequestHeader('Content-type', _.aj.settings.contentType.urlencoded);
				xmlreq.setRequestHeader('Accept', accept);
				xmlreq.send(encodeData(params.data));
			}
			else {
				xmlreq.open('GET', params.url+'?'+encodeData(params.data), true);
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

		var exeptions = {
			'float': (function() {
				if(_.ielt9) {
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

			// somth else
		};

		_.css = function(node, property, value) {
			if(node) {
				var propertyType = type(property);
				if(propertyType == type.string) {
					if(property in exeptions) {
						return exeptions[property](node, value);
					}
					else {
						if(value === undefined) {
							return _.gstyle(node, property)
						}
						else {
							node.style[property] = value;
						}
					}
				}
				else if(propertyType == type.object) {
					for(var prop in property) {
						_.css(node, prop, property[prop]);
					}
				}
			}
		}

		_.height = function(node, padding, border, margin) {
			var	height = (padding)?node.offsetHeight:_.gstyle(node, height).toInt(),
				border = (border)?_.gstyle(node, 'borderTopWidth').toInt()+_.gstyle(node, 'borderBottomWidth').toInt():0,
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
			if(val !== undefined) {animData[type] = val;}
			else {return animData[type];}
		}

		_.animate = function(node, type, terminal, time, fnName, callback) {

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
					start = +new Date();

				unit = (unit)?unit:'';
				animationStatus(node, type, animStatus);

				node[timerName] = setTimeout(function() {
					var	now = (+new Date()) - start,
						progress = now / time,
						result = ((terminal - current)*easing(progress)+current).limit(current, terminal);

					_.css(node, type, result+unit);

					if (progress < 1) {
						node[timerName] = setTimeout(arguments.callee, animationDelay);
					}
					else {
						_.css(node, type, terminal);
						animationStatus(node, type, '');
						if(callback) {callback.call(node);}
					}
				}, animationDelay);
			}

			return node;
		};

		_.hide = function(node, time, callback) {
			if(time) {
				_.animate(node, 'opacity', 0, time, '', function() {
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
				_.animate(node, 'opacity', 1, time, '', function() {
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
				node[prop] = attr[prop];
			}
		}
		return node;
	};

	_.wrap = function(node, wrapper) {
		if(wrapper.hasWord) {
			wrapper = _.create(wrapper);
		}
		node.parentNode.insertBefore(wrapper, node);
		wrapper.appendChild(node);
	};

	_.children = function(node, tagName) {
		var c = node.childNodes, C = [];
		if(tagName) {
			tagName = tagName.toUpperCase();
			for(var i=0; i<c.length; i++) {
				if(c[i].nodeName == tagName && c[i].nodeType == 1) {C.push(c[i]);}
			}
			return C;
		}
		else {
			for(var i=0; i<c.length; i++) {
				if(c[i].nodeType == 1) {C.push(c[i]);}
			}
			return C;
		}
		return [];
	};

	_.firstChild = function(node, child) {
		if(child) {
			node.insertBefore(child, node.firstChild);
		}
		else {
			return node.firstChild;
		}
	};

	_.getNodeText = function(node) {
		return node.text || node.textContent || '';
	};

// --------- CLASS MANIPULATION

	_.addClass = function(node, name) {
		if(node && name) {
			if(!node.className.hasWord(name)) {
				if(!node.className) {node.className = name;}
				else {node.className += ' ' + name;}
			}
		}
	};

	_.delClass = function(node, name) {
		if(node && name) {
			node.className = node.className.replace(new RegExp('[ ]*\\b' + name +'\\b'), '');
		}
	};

	_.toggleClass = function(node, name) {
		if(node && name) {
			if(node.className.hasWord(name)) {
				_.delClass(node, name);
				return false;
			}
			else {
				_.addClass(node, name);
				return true;
			}
		}
	};

// --------- EVENTS

	;(function() {

		var	addEvent = (function(){
				if (win.addEventListener){
					return function(node, type, handler) {node.addEventListener(type, handler, false);};
				} else {
					return function(node, type, handler) {node.attachEvent('on'+type, handler);};
				}
			})(),
			delEvent = (function(){
				if (win.removeEventListener){
					return function(node, type, handler) {node.removeEventListener(type, handler, false);};
				} else {
					return function(node, type, handler) {node.detachEvent('on'+type, handler);};
				}
			})(),
			eventData = 'event___'+hash,
			handlerName = 'handler___'+hash;

		function addEventToDataObj(event, method, node) {
			var ev = _.data(node, eventData) || _.data(node, eventData, {});
			if(ev[event] === undefined) {ev[event] = [];}
			ev[event].push(method);
		}

		function delEventFromDataObj(event, method, node) {
			var ev = _.data(node, eventData);
			if(ev !== undefined && ev[event] !== undefined) {
				ev[event].del(ev[event].indexOf(method));
				return ev[event].length;
			}
			return 0;
		}		function fixEv(e) {
			var e = e || win.event;
			if(!e.target) {e.target = e.srcElement;}
			if(e.type == 'keypress' && !e.charCode) {
				e.charCode = e.keyCode;
			}
			if(!e.stopPropagation) e.stopPropagation = stopPropagation;
			if(!e.preventDefault) e.preventDefault = preventDefault;
			return e;
		}

		function execute(e) {
			e = fixEv(e);
			_.data(this, eventData)[e.type].forEach(function(c) {
				if(c.call(this, e) === false) {e.preventDefault();}
			}, this);
		}

		function preventDefault() {
			this.returnValue = false;
		}

		function stopPropagation() {
			this.cancelBubble = true;
		}

		function ieForce(node, event_type) {
			var evt = document.createEventObject();
			node.fireEvent('on'+event_type, evt);
			return node;
		}

		function otherForce(node, event_type) {
			var evt = document.createEvent('HTMLEvents');
			evt.initEvent(event_type, false, false);
			node.dispatchEvent(evt);
			return node;
		}

		_.event = {
			'add': function(node, event, method) {
				if(node && event && method) {
					addEventToDataObj(event, method, node);
					if(!node[handlerName]) {
						node[handlerName] = function(e) {execute.call(node, e);};
					}
					if(~events.indexOf(event)) {
						addEvent(node, event, node[handlerName]);
					}
				}
			},
			'del': function(node, event, method) {
				if(node && event && method) {
					var restEv = delEventFromDataObj(event, method, node);
					if(~events.indexOf(event) && restEv === 0) {
						delEvent(node, event, node[handlerName]);
						delete node[handlerName];
					}
				}
				
			},
			'clear': function(node, event) {
				if(node && event && _.data(node, eventData)) {
					var eventDataObj = _.data(node, eventData);
					delete eventDataObj[event];
					if(_.isEmptyObj(eventDataObj)) {
						delEvent(node, event, node[handlerName]);
					}				}
			},
			'fix': fixEv
		};

		_.force = function(node, event_type) {
			if(node && event_type) {
				if(event_type in events) {
					if (doc.createEventObject) {
						ieForce(node, event_type);
					} else if (document.createEvent) {
						otherForce(node, event_type);
					}
				}
				else {
					var elementEvents =  _.data(node, eventData);
					if(elementEvents && elementEvents[event_type]) {
						elementEvents[event_type].forEach(function(c) {
							c.call(this);
						}, this);
					}
				}
			}
			else {throw Error('Call _.force function without required argument!');}
		};

	})();

// ########################---------- WORKING WITH COLLECTIONS

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
					return _.data(this.ns[0], name);
				}
			}
			return this;
		},

// collection manipulation
		'eq': function(n) {
			return _(this.ns[n]);
		},
		'children': function(tagName) {
			var M = _();
			this.ns.forEach(function(c) {
				M.include(_.children(c, tagName));
			});
			return M;
		},
		'last': function() {
			return this.eq(this.length-1);
		},
		'first': function() {
			return this.eq(0);
		},
		'parent': function() {
			var M = _();
			this.ns.forEach(function(c) {
				M.include(c.parentNode);
			});
			return M;
		},
		'firstChild': function(child) {
			if(child) {
				this.each(function(c) {
					_.firstChild(c, child);
				});
			}
			else {
				var M = _();
				this.ns.forEach(function(c) {
					M.include(c.firstChild);
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
			if(event && action) {
				this.ns.forEach(function(c) {
					_.event.add(c, event, action);
				});
			}
			return this;
		},
		'unbind': function(event, action) {
			if(event && action) {
				this.ns.forEach(function(c) {
					_.event.del(c, event, action);
				});
			}
			return this;
		},
		'force': function(event_type) {
			this.ns.forEach(function(c) {
				_.force(c, event_type);
			});
			return this;
		},
		'clearEv': function(ev) {
			this.ns.forEach(function(c) {
				_.event.clear(c, ev);
			});
			return this;
		},

// attr manipulation
		'attr': function(name, val) {
			if(name) {
				if(arguments.length == 2) {
					this.ns.forEach(function(c) {
						c.setAttribute(name, val);
					});
				}
				else {
					return this.ns[0].getAttribute(name);
				}
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
		'css': function(name, value) {
			var nameType = type(name);
			if(nameType == type.object || (name && value)) {
				this.ns.forEach(function(c) {
					_.css(c, name, value);
				});
			}
			else if(nameType == type.string) {
				return _.css(this.ns[0], name);
			}
			return this;
		},
		'height': function(padding, border, margin) {
			return _.height(this.ns[0], padding, border, margin);
		},
		'val': function(value) {
			if(value) {
				this.ns.forEach(function(c) {
					c.value = value;
				});
				return this;
			}
			else {
				return this.ns[0].value;
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
				return this;
			}
			else {
				return this.ns[0].innerHTML;
			}
		},
		'append': function(node) {
			var nodeType = type(node);
			if(nodeType == type.node) {
				this.each(function(c) {
					c.appendChild(node);
				});
			}
			else if(nodeType == type.redjs) {
				this.each(function(c) {
					node.each(function(cc) {
						c.appendChild(cc);
					});
				});
			}
			return this;
		}
	});

	events.forEach(function(c) {
		var ev = {};
		ev[c] = function(method) {
				this.ns.forEach(function(cc) {_.event.add(cc, c, method);});
				return this;
			};
		_.extend(ev);
	});

	win._ = _;
	win.redjs = redjs;

})(window);

