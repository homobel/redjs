
//~ <component>
//~	Name: Forms Radiobox Controller
//~	Info: Provides radiobox emulation
//~ </component>


	// prototype

	function _RedFormsRadiobox(node) {

		this.val = function(value) {
			if(value === undefined) {
				return this.value;
			}
			else {
				value = value.toString();
				for(var i = 0, l = this.li.length; i < l; i++) {
					c = this.li.eq(i).find('label');
					if(c.html().trim() === value) {
						this.li.delClass(_.fc.radiobox.selectors.checked).eq(i).addClass(_.fc.radiobox.selectors.checked);
						this.value = value;
						return true;
					}
				}
				return false;
			}
		};

	}

	// constructor

	function RedFormsRadiobox(node, id, value, input) {

		var	_this = this,
			tag = node.tagName.toLowerCase();

		if(tag === 'ul') {
			if(id !== undefined) {
				node = _primaryWrap(node, id, _.fc.radiobox.selectors.radioboxWarp, value);
			}
			else {
				throw Error('Not enough arguments!');
			}
		}

		this.wrap = _(node);
		this.input = input;
		this.ul = this.wrap.find('ul');
		this.value;
		this.startValue;
		this.li;

		if(this.wrap.length && this.input.length && this.ul.length) {

			var	defaultFlag = true,
				value = _this.input.val();

			this.startValue = value;

			this.li = this.ul.find('li').each(function(c, i) {

				c = _(c);

				var	text = c.html().trim(),
					label = c.wrapInner('label').find('label'),
					box = label.before('<span></span>').addClass(_.fc.radiobox.selectors.radiobox);

				if(text == value) {
					c.addClass(_.fc.radiobox.selectors.checked);
					defaultFlag = false;
					_this.value = value;
				}

				_.multi(box).click(function(e) {

					if(!_(this).parent('li').hasClass(_.fc.radiobox.selectors.checked)) {
						_this.li.delClass(_.fc.radiobox.selectors.checked).eq(i).addClass(_.fc.radiobox.selectors.checked);
						_this.input.val(text);
						_this.value = text;
					}

				});

			});

			if(defaultFlag) {
				this.li.eq(0).children('label').click();
			}

		}
		else {
			throw Error('Invalid html structure!');
		}
	}

	RedFormsRadiobox.prototype = new _RedFormsRadiobox();

	// obj extension

	_.extend({
		'radiobox': function(id, value) {
			this.ns.forEach(function(c) {
				_.fc.radiobox(c, id, value);
			});
			return this;
		}
	});

	_.fc.radiobox = function(node, id, value) {
		var input = _('input', node);
		if(input.length && input.formData('controller') === undefined) {
			var controller = new RedFormsRadiobox(node, id, value, input);
			input.formData('controller', controller);
		}
	};

	_.fc.radiobox.selectors = {
		'radioboxWarp': 'redjs-radio-wrap',
		'radiobox': 'redjs-radiobox',
		'checked': 'redjs-radiobox-checked'
	};


