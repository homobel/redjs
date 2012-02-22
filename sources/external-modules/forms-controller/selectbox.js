
//~ <component>
//~	Name: Forms Selectbox Controller
//~	Info: Provides selectbox emulation
//~ </component>


	// prototype

	function _RedFormsSelect(node) {

		this.val = function(value) {
			if(value === undefined) {
				return this.value;
			}
			else {
				value = value.toString();
				for(var i = 0, l = this.li.length; i < l; i++) {
					var c = this.li.eq(i);
					if(c.html().trim() === value) {
						this.li.delClass(_.fc.selectbox.selectors.checked).eq(i).addClass(_.fc.selectbox.selectors.checked);
						this.current.html(value);
						this.value = value;
						return true;
					}
				}
				return false;
			}
		};

	}

	// constructor

	function RedFormsSelect(node, id, value, input) {

		var	_this = this,
			tag = node.tagName.toLowerCase();

		if(tag === 'ul') {
			if(id !== undefined) {
				node = _primaryWrap(node, id, _.fc.selectbox.selectors.selectboxWarp, value);
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
		this.current;
		this.li;

		if(this.wrap.length && this.input.length && this.ul.length) {

			this.current = this.ul.before('<span></span>').addClass(_.fc.selectbox.selectors.selectCurrent);

			var	ico = this.ul.before('<span></span>').addClass(_.fc.selectbox.selectors.selectIco),
				slectBody = this.ul.wrap('div', {'className': _.fc.selectbox.selectors.selectBody}).parent();

			this.li = this.ul.find('li').each(function(c, i) {

				c = _(c);

				var text = c.html().trim();

				c.attr('title', text);
				if(text === _this.input.val()) {
					_this.current.html(text);
					c.addClass(_.fc.selectbox.selectors.checked);
					_this.value = text;
					_this.startValue = text;
				}

				c.click(function() {
					if(text !== _this.value) {
						_this.input.val(text);
					}
				});

			});

		}
		else {
			throw Error('Invalid html structure!');
		}

	}

	RedFormsSelect.prototype = new _RedFormsSelect();

	// obj extension

	_.extend({
		'selectbox': function(id, value) {
			this.ns.forEach(function(c) {
				_.fc.selectbox(c, id, value);
			});
			return this;
		}
	});

	_.fc.selectbox = function(node, id, value) {
		var input = _('input', node);
		if(input.length && input.formData('controller') === undefined) {
			var controller = new RedFormsSelect(node, id, value, input);
			input.formData('controller', controller);
		}
	};

	_.fc.selectbox.selectors = {
		'selectWarp': 'redjs-select-wrap',
		'selectBody': 'redjs-select-body',
		'selectCurrent': 'redjs-select-current',
		'selectIco': 'redjs-select-ico',
		'checked': 'redjs-select-selected'
	};
