
//~ <component>
//~	Name: Forms Form Controller
//~	Info: Provides form controller
//~ </component>


	// prototype

	function _RedForm() {

		this.validate = function() {
	
			var inputs = this.form.find('input').include(this.form.find('textarea'));
	
			if(inputs.length && this.id) {

				var	errs = [],
					rules = _.fc.validation[this.id];

				if(rules) {
					inputs.each(function(c) {

						var	name = c.getAttribute('name'),
							rule = rules[name];

						if(name && rule) {
							rule = rule.split(' ');
							for(var i = 0; rule[i]; i++) {
								if(rule[i] in _.fc.validators) {
									if(!_.fc.validators[rule[i]](c, errs)) {
										break;
									}
								}
							}
						}

					});

					if(errs.length) {
						this.errors = errs;
						this.form.force('validationfail');
						this.locked = false;
						return false;
					}
				}
			}
			return true;
		};

		this.clear = function() {
			var inputs = this.form.find('input').include(this.form.find('textarea'));
			inputs.each(function(c) {
				c = _(c);

				var	controller = c.formData('controller'),
					startVal = controller.startValue || '';

				c.val(startVal);
				c.force('blur');
			});
		};

		this.getValues = function(obj) {

			var	inputs = this.form.find('input').include(this.form.find('textarea')),
				obj = obj || {};

			inputs.each(function(c) {
				var id = c.name || c.id;
				if(id) {
					obj[id] = c.value;
				}
			});
			return obj;
		};

		this.setValues = function(param, flag) {
			var inputs = this.form.find('input').include(this.form.find('textarea'));
			if(flag) {
				this.clear();
			}
			inputs.each(function(c) {
				var id = c.name || c.id;
				if(param[id] !== undefined) {
					c = _(c);
					c.force('focus');
					c.val(param[id]);
				}
			});
		};

	}

	// constructor

	function RedForm(node) {

		// ini

		var _this = this;

		this.form = _(node);
		this.id = node.id;
		this.locked = false;
		this.errors;

		if(this.id) {
			_.fc.cache[this.id] = this.form;
		}

		_('.' + _.fc.selectbox.selectors.selectWarp, node).selectbox();
		_('.' + _.fc.checkbox.selectors.checkboxWarp, node).checkbox();
		_('.' + _.fc.radiobox.selectors.radioboxWarp, node).radiobox();

		_('input', node).filter(function() {
			var type = _(this).attr('type');
			return type === 'text' || type === 'password';
		}).placeholder();



		function submit(e) {
			if(_.fc.submition[_this.id]) {
				e.preventDefault();
				if(!_this.locked) {
					_this.locked = true;
					if(_this.validate()) {
						_.fc.submition[_this.id].call(_this.form);
					}
					else {
						_this.locked = false;
					}
				}
			}
			else {
				if(!_this.validate()) {
					e.preventDefault();
				}
			}
		}

		_('.' + _.fc.form.selectors.submit, node).click(submit);
		_this.form.submit(submit);

	}

	RedForm.prototype = new _RedForm();

	// obj extension

	_.extend({
		'form': function() {
			this.ns.forEach(function(c) {
				_.fc.form(c);
			});
			return this;
		}
	});

	_.fc.form = function(node) {
		if(formData(node, 'controller') === undefined) {
			var controller = new RedForm(node);
			formData(node, 'controller', controller);
		}
	};

	_.fc.form.selectors = {
		'disabled': 'redjs-disabled',
		'submit': 'redjs-submit'
	};

