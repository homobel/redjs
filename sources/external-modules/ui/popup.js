
//~ <component>
//~	Name: RedJS UI Popups
//~	Info: Popups module
//~ </component>


	// ini method

	_.ui.popup = function(node) {

		var	id = node.getAttribute('id'),
			data = uiData(node, 'popup', {}),
			popup = _(node),
			closer = _('.'+_.ui.popup.selectors.closer, node),
			caller = _('#'+id+'_caller');

		if(id) {
			_.ui.cache[id] = popup;
		}

		closer.click(function(e) {
			e.preventDefault();
			_.ui.popup.close(popup);
		});

		caller.click(function(e) {
			e.preventDefault();
			_.ui.popup.open(popup);
		});
	};

	_.ui.popup.selectors = {
		'closer': 'redjs-popup-closer',
		'shellActive': 'redjs-popup-shell',
		'shellInactive': 'redjs-popup-shell-inactive'
	};

	_.ui.popup.shell = new function() {
		this.active = _('+div').addClass(_.ui.popup.selectors.shellActive);
		this.inactive = _('+div').addClass(_.ui.popup.selectors.shellInactive);
	};


	_.ui.popup.effects = {
		'fade': {
			'show': function(popup, callback) {
				popup.show(250, callback);
			},
			'hide': function(popup, callback) {
				popup.hide(250, callback);
			}
		}
	};

	_.ui.popup.lastOpened = undefined;
	_.ui.popup.defaultEffect = 'fade';
	_.ui.popup.queue = [];


	// controll methods

	_.ui.popup.open = function(popup, fn) {
		var pptype = _.type(popup);
		if(pptype == _.type.redjs) {

			if(_.ui.popup.lastOpened === undefined) {
				this.shell.active.show();
			}
			else {
				var lastOpened = _.ui.cache[_.ui.popup.lastOpened];
				if(lastOpened && lastOpened.attr('id') != popup.attr('id')) {
					var fn = fn || _.ui.popup.defaultEffect;
					_.ui.popup.effects[fn].hide(lastOpened);
				}
			}

			var id = popup.attr('id');
			_.ui.popup.lastOpened = id;
			_.ui.popup.queue.delByVal(id).unshift(id);

			popup.force('open');

			var fn = fn || _.ui.popup.defaultEffect;
			_.ui.popup.effects[fn].show(popup, function() {
				popup.force('opened');
			});

		}
	};

	_.ui.popup.close = function(popup, all) {
		var pptype = _.type(popup);
		if(pptype == _.type.redjs) {

			var id = popup.attr('id');
			_.ui.popup.lastOpened = _.ui.popup.queue.delByVal(id)[0];

			if(_.ui.popup.lastOpened === undefined || all) {
				this.shell.active.hide();
			}
			else {
				var lastOpened = _.ui.cache[_.ui.popup.lastOpened];
				if(lastOpened) {
					var fn = fn || _.ui.popup.defaultEffect;
					_.ui.popup.effects[fn].show(lastOpened);
				}
			}

			popup.force('close');

			var fn = fn || _.ui.popup.defaultEffect;
			_.ui.popup.effects[fn].hide(popup, function() {
				popup.force('closed');
			});
		}
		else {
			_.ui.popup.queue.forEach(function(c) {
				_.ui.cache[c].force('close');
				_.ui.cache[c].force('closed');
			});
			_.ui.popup.queue = [];
			_.ui.popup.close(_.ui.cache[_.ui.popup.lastOpened], true);
			_.ui.lastOpened = undefined;
		}
	};


	_(document).bind('ready', function() {

		var body = _('body');

		body.firstChild(_.ui.popup.shell.inactive.ns[0]);
		body.firstChild(_.ui.popup.shell.active.ns[0]);

		_.ui.popup.shell.active.click(function() {
			_.ui.popup.close();
		});

	});

	_.extend({
		'popup': function() {
			this.ns.forEach(function(c) {
				_.ui.popup(c);
			});
			return this;
		}
	});
