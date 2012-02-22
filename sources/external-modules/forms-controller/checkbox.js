
//~ <component>
//~	Name: Forms Checkbox Controller
//~	Info: Provides checkbox emulation
//~ </component>


	// prototype

	function _RedFormsCheckbox() {

		this.val = function(value) {
			if(value === undefined) {
				return this.value;
			}
			else {
				value = value.toString();
				if(value === 'false') {
					this.wrap.delClass(_.fc.checkbox.selectors.checked);
				}
				else {
					this.wrap.addClass(_.fc.checkbox.selectors.checked);
				}
				this.value = value;
				return true;
			}
		};

	}

	// constructor

	function RedFormsCheckbox(node, id, value, input) {

		var	_this = this,
			tag = node.tagName.toLowerCase();

		if(tag === 'label') {
			if(id !== undefined) {
				node = _primaryWrap(node, id, _.fc.checkbox.selectors.checkboxWarp, value);
			}
			else {
				throw Error('Not enough arguments!');
			}
		}

		this.wrap = _(node);
		this.input = input;
		this.label = this.wrap.find('label');
		this.value;
		this.startValue;
		this.box;

		if(this.wrap.length && this.input.length && this.label.length) {

			this.box = this.label.before('<span></span>').addClass(_.fc.checkbox.selectors.checkbox);
			this.value = this.input.val();
			this.startValue = this.value;

			if(this.value == 'true') {
				this.wrap.addClass(_.fc.checkbox.selectors.checked);
			}
			else {
				this.input.val('false');
			}

			_.multi(this.box).click(function(e) {
				if(_this.value === 'true') {
					_this.input.val('false');
				}
				else {
					_this.input.val('true');
				}

			});

		}
		else {
			throw Error('Invalid html structure!');
		}

	}

	RedFormsCheckbox.prototype = new _RedFormsCheckbox();

	// obj extension

	_.extend({
		'checkbox': function(id, value) {
			this.ns.forEach(function(c) {
				_.fc.checkbox(c, id, value);
			});
			return this;
		}
	});

	_.fc.checkbox = function(node, id, value) {
		var input = _('input', node);
		if(input.length && input.formData('controller') === undefined) {
			var controller = new RedFormsCheckbox(node, id, value, input);
			input.formData('controller', controller);
		}
	};

	_.fc.checkbox.selectors = {
		'checkboxWarp': 'redjs-checkbox-wrap',
		'checkbox': 'redjs-checkbox',
		'checked': 'redjs-checkbox-checked'
	};






