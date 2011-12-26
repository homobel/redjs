
// ########################----------- EVENTS

	(function() {

		var	addEvent = (function() {
				if(win.addEventListener) {
					return function(node, type, handler) {node.addEventListener(type, handler, false);};
				} else {
					return function(node, type, handler) {node.attachEvent('on'+type, handler);};
				}
			})(),
			delEvent = (function() {
				if(win.removeEventListener) {
					return function(node, type, handler) {node.removeEventListener(type, handler, false);};
				} else {
					return function(node, type, handler) {node.detachEvent('on'+type, handler);};
				}
			})(),

			fixEvent = (function() {
				if(!ielt9) {
					return function(e) {
						return e;
					}
				}
				else {
					return function() {
						var e = win.event, html = document.documentElement, body = document.body;
						e.target = e.srcElement;
						e.relaredTarget = (e.target==e.fromElemet)?e.toElement:e.fromElement;
						e.stopPropagation = stopPropagation;
						e.charCode = e.keyCode;
						e.preventDefault = preventDefault;
						e.pageX = e.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
						e.pageY = e.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);
						return e;
					}
				}
			})(),

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
							if(c.call(node, e) === false) {e.preventDefault();}
						});
					}
				}
			};

		function EventData() {
			this.events = {};
		}

		EventData.prototype = _EventData;



		function preventDefault() {
			this.returnValue = false;
		}

		function stopPropagation() {
			this.cancelBubble = true;
		}




		function EventController() {

			var	eventHash = 'event___'+hash,
				handlerHash = 'handler___'+hash,

				_this = this,

				eventsList = ['abort', 'load', 'unload', 'click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove', 'focus', 'blur', 'change', 'submit', 'keypress', 'keydown', 'keyup'],
				eventsType = {
					'UIEvents': ['DOMFocusIn', 'DOMFocusOut', 'DOMActivate'],
					'MouseEvents': ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove'],
					'HTMLEvents': ['load', 'unload', 'abort', 'error', 'select', 'change', 'submit', 'reset', 'focus', 'blur', 'resize', 'scroll'],
					'KeyboardEvent': ['keypress', 'keydown', 'keyup'],
					'MutationEvent': ['DOMSubtreeModified', 'DOMNodeInserted', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument', 'DOMNodeInsertedIntoDocument', 'DOMAttrModified', 'DOMCharacterDataModified']
				},

				createEvent = (function() {
					if(ielt9) return function(type, e, params) {
						e = _.joinObj(e, params);
						if(type) e.type = type;
						return doc.createEventObject(e);
					};
					else return function(type, e, params) {
						e = _.joinObj(e, params);
						var	etype = getEventType(type, e),
							event = document.createEvent(etype);
						if(etype === 'MouseEvents') event.initMouseEvent(type, !e.cancelBubble, !!e.cancelable, win, 1, e.sceenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.relatedTarget);
						else if(etype === 'UIEvents') event.initUIEvent(type, !e.cancelBubble, !!e.cancelable, win, 1);
						else if(etype === 'KeyboardEvent') event.initKeyboardEvent(type, !e.cancelBubble, !!e.cancelable, win, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.keyCode, e.charCode);
						else if(etype === 'MutationEvent') event.initEvent(type, !e.cancelBubble, !!e.cancelable, e.relatedNode, e.prevValue, e.newValue, e.attrName, e.attrChange);
						else event.initEvent(type, !e.cancelBubble, !!e.cancelable); // HTMLEvents
						return event;
					};
				})(),

				fireEvent = (function() {
					if(ielt9) return function(node, type, e, params) {
						e = createEvent(type, e, params);
						try {node.fireEvent('on'+type, e);}
						catch(err) {
							getNodeEventData(node).call(node, e);
							if(!e.cancelBubble && node.parentNode) {fireEvent(node.parentNode, 'type', e);}
						}
						return e;
					};
					else return function(node, type, e, params) {
						e = createEvent(type, e, params);
						node.dispatchEvent(e);
						return e;
					};
				})();


			if(_.browser.msie || _.browser.opera) {
				eventsList.push('mouseenter', 'mouseleave');
				eventsType.MouseEvents.push('mouseenter', 'mouseleave');
			}

			// Inner

			function getEventType(type, e) {
				if(e && e.type) type = e.type;
				for(var prop in eventsType) {
					if(~eventsType[prop].indexOf(type)) return prop;
				}
				return 'HTMLEvents';
			}

			function execute(e) {
				e = fixEvent(e);
				getNodeEventData(this).call(this, e);
			}

			function getNodeEventData(node, instance) {
				return _.data(node, eventHash) || _.data(node, eventHash, new EventData);
			}

			function setNodeEventData(node, obj) {
				_.data(node, eventHash, obj);
			}

			// Public

			this.list = eventsList;
			this.artificial = {};


			this.add = function(node, event, method, once) {
				getNodeEventData(node).set(event, method, once);
				if(!node[handlerHash]) node[handlerHash] = function(e) {
					getNodeEventData(node).call(node, fixEvent(e));
				};
				try {addEvent(node, event, node[handlerHash]);} catch(err) {}
				if(_this.artificial[event]) {
					_this.add(node, _this.artificial[event].base, _this.artificial[event]['ini'], true);
				}
			};

			this.copyEvents = function(clone, node) {
				var nodeEventData = getNodeEventData(node);
				if(!_.isEmptyObj(nodeEventData)) {
					setNodeEventData(clone, nodeEventData);
					clone[handlerHash] = function(e) {getNodeEventData(clone).call(clone, fixEvente(e));};
					for(var prop in nodeEventData.events) {
						try {addEvent(clone, prop, clone[handlerHash]);} catch(err) {}
						if(_this.artificial[prop]) {
							_this.add(clone, _this.artificial[prop].base, _this.artificial[prop]['ini'], true);
						}
					}
				}
			};

			this.del = function(node, event, method) {
				var rest = getNodeEventData(node);
				if(rest.unset(event, method) === 0) {
					try {delEvent(node, event, node[handlerHash]);} catch(err) {}
					if(_.isEmptyObj(rest.events)) delete node[handlerHash];
					if(_this.artificial[event]) {_this.del(node, _this.artificial[event].base, _this.artificial[event].ini);}
				}
			};

			this.clear = function(node, event) {
				var rest = getNodeEventData(node);
				rest.clear(event);
				delEvent(node, event, node[handlerHash]);
				if(_this.artificial[event]) {_this.del(node, _this.artificial[event].base, _this.artificial[event].ini);}
				if(_.isEmptyObj(rest.events)) delete node[handlerHash];
			};

			this.create = function(params) {
				if(~eventsList.indexOf(params.name)) return;
				params.condition = params.condition || function() {return true;};
				_.event.artificial[params.name] = _.joinObj({
					'ini': function(e) {
						if(params.condition.call(this, e)) {
							_.force(this, params.name, e, {'cancelBubble': true});
						}
					}
				}, params);
			};

			this.force = function(node, eventType, e, params) {
				if(node && eventType) {
					return fireEvent(node, eventType, e, params);
				}
				else {throw Error('Not enough arguments');}
			};

			this.fix = fixEvent

		}

		_.event = new EventController();

		_.force = _.event.force;

		_.bind = _.event.add;
		_.unbind = _.event.del;

		_.addEvent = addEvent;
		_.delEvent = delEvent;

		_.extend({

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
			}

		});

	})();

// --------- EVENTS ADDING

	(function() {

		var events = _.event.list.copy();

		function contains(node, child) {
			return toArraySimple(_.tag('*', node)).some(function(c) {
				return c === child
			});
		}
		function parentCheck(event) {
			var related = event.relatedTarget, resp, parent = contains(this, related);
			if(related == null) return true;
			if(!related) return false;
			resp = (related !== this && related.tagName !== doc.documentElement && related.prefix !== 'xul' && !parent);
			if(!resp) event.stopPropagation();
			return resp;
		}

		if(!_.browser.msie) {

			_.event.create({
				'name': 'mouseenter',
				'base': 'mouseover',
				'condition': parentCheck
			});

			_.event.create({
				'name': 'mouseleave',
				'base': 'mouseout',
				'condition': parentCheck
			});

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
