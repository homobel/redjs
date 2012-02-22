
//~ <component>
//~	Name: Forms Placeholder Controller
//~	Info: Provides placeholder emulation
//~ </component>


	// placeholder

	function _RedFormsPlaceholder() {

		this.checkAutofilling = function() {
			if(this.input.val() === '') {
				this.placeholder.show(200);
			}
			else {
				this.placeholder.hide(200);
			}
		};

	}

	function RedFormsPlaceholder(node) {

		this.placeholder;
		this.wrap;
		this.input = _(node);
		this.ptext = this.input.attr('placeholder');

		var inputType = this.input.attr('type');

		if(this.ptext && (inputType === 'text' || inputType === 'password')) {

			var	height = this.input.height(true, true)+'px',
				_this = this,
				timer;

			this.input.attr('placeholder', '');

			this.wrap = _('+div').addClass(_.fc.placeholder.selectors.placeholderWrap).css('float', this.input.css('float'));
			this.placeholder = _('+div').addClass(_.fc.placeholder.selectors.placeholder).html(this.ptext).css({
					'height': height,
					'lineHeight': height,
					'textIndent': this.input.css('textIndent'),
					'paddingLeft': this.input.css('paddingLeft'),
					'opacity': 0
				});

			this.wrap.append(this.placeholder);
			this.input.wrap(this.wrap.ns[0]);

			function check() {
				timer = setTimeout(function() {
					var form = _this.input.parent('form');
					if(form) {
						form.find('input').each(function(c) {
							if(c !== node) {
								c = _(c);
								var type = c.attr('type');
								if(type === 'text' || type === 'password') {
									var controller = c.formData('controller');
									if(controller) {
										controller.checkAutofilling();
									}
								}
							}
						});
					}
				}, 60);
			}

			check();

			this.input.focus(function() {
				_this.input.keyup(check);
				_this.placeholder.hide(200);
				_this.input.delClass(_.fc.placeholder.selectors.transparentText);
			});

			this.input.blur(function() {
				_this.input.unbind('keyup', check);
				if(!_this.input.val()) {
					_this.placeholder.show(200);
					_this.input.addClass(_.fc.placeholder.selectors.transparentText);
				}
			});

		}

	}

	RedFormsPlaceholder.prototype = new _RedFormsPlaceholder();

	_.extend({
		'placeholder': function() {
			this.ns.forEach(function(c) {
				_.fc.placeholder(c);
			});
			return this;
		}
	});

	_.fc.placeholder = function(node) {
		if(_.formData(node, 'controller') === undefined) {
			var controller = new RedFormsPlaceholder(node);
			_.formData(node, 'controller', controller);
		}
	};

	_.fc.placeholder.selectors = {
		'placeholderWrap': 'redjs-input-placeholder-wrap',
		'placeholder': 'redjs-input-placeholder',
		'transparentText': 'redjs-transparent-text'
	};
