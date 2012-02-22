
//~ <component>
//~	Name: Forms Controller
//~	Info: Provides form emulations & form controllers
//~ </component>


(function(_, undefined) {

	var hash = 'form___' + _.hash;

	// error constructor

	function ValidationError(node, test) {
		this.node = node;
		this.test = test;
		this.msg = ValidationError.messages[test];
	}

	ValidationError.messages = {
		'required': 'This field is required!',
		'email': 'Email address is not valid!'
	};

	// form constructor

	function FormController() {

		this.cache = {};

		this.validators = {
			'required': function(c, errs) {
				if(c.value == '') {
					errs.push(new ValidationError(c, 'required'));
					return false;
				}
				return true;
			},
			'email': function(c, errs) {
				if(!c.value.isMail()) {
					errs.push(new ValidationError(c, 'email'));
					return false;
				}
				return true;
			}
		};

		this.validation = {};
		this.submition = {};

	}

	_.fc = new FormController();

	// common wrapper

	function _primaryWrap(node, name, className, value) {

		var input = _('+input').attr('name', name).attr('id', name).attr('type', 'hidden');

		if(value !== undefined) {
			input.attr('value', value);
		}

		var wrap = _(node).delClass(className).wrap('div').parent().addClass(className);
		wrap.append(input);

		return wrap;

	}

	// data provider

	function formData(node, prop, value) {
		var data = _.provideData(node, hash, {});
		if(data[prop] === undefined) {
			data[prop] = value;
		}
		return data[prop];
	}


//~ require: forms-controller


	// public API

	_.formData = formData;

	_.extend({

		'formData': function(prop, value) {
			if(this.ns[0]) {
				return formData(this.ns[0], prop, value);
			}
		},
		'val': function(value, add) {
			if(value !== undefined) {
				this.ns.forEach(function(c) {
					var controller = formData(c, 'controller');
					if(controller) {
						if('val' in controller) {
							if(controller.val(value)) {
								c.value = value;
							}
						}
						else if('setValues' in controller) {
							return controller.setValues(value, add);
						}
						else {
							c.value = value;
						}
					}
					else {
						c.value = value;
					}
				});
				return this;
			}
			else {
				if(this.ns[0]) {
					var controller = formData(this.ns[0], 'controller');
					if(controller) {
						if('val' in controller) {
							return controller.val();
						}
						else if('getValues' in controller) {
							return controller.getValues(add);
						}
						else {
							return this.ns[0].value;
						}
					}
					else {
						return this.ns[0].value;
					}
				}
			}
		}

	});

})(redjs);
