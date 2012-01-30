
//~ <component>
//~	Name: Type Helper
//~	Info: Provides type function
//~ </component>


	function _Type() {
		this.toString = function() {
			return Type.variants[this.val];
		};
		this.is = function(typeStr) {
			return Type.variants[this.val] == typeStr;
		};
	}

	function Type(n) {this.val = n}

	function getType(something) {
		switch(typeof something) {
			case 'undefined': return getType['undefined'];
			case 'boolean': return getType['boolean'];
			case 'number': return getType['number'];
			case 'string': return getType['string'];
			case 'function': if(something.call) {
				return getType['function'];
			}
		}

		// for window

		if(something instanceof RedCollection) {
			return  getType['redjs'];
		}
		else if(something === null) {
			return getType['null'];
		}
		else if(something == win) {
			return getType['object'];
		}
		else if(something instanceof Array) {
			return getType['array'];
		}
		else if(something.nodeName && something.nodeType !== undefined) {
			return getType['node'];
		}
		else if(something.length !== undefined) {
			return getType['nodelist'];
		}
		else if(Object.prototype.toString.call(something) == '[object Object]') {
			return getType['object'];
		}
		return getType['unknown'];
	}

	Type.prototype = new _Type();	Type.variants = ['undefined', 'boolean', 'number', 'string', 'function', 'node', 'nodelist', 'array', 'object', 'null', 'redjs', 'unknown'];

	Type.variants.forEach(function(c, i) {
		this[c] = new Type(i);
		this[i] = c;
	}, getType);

	_.type = getType;
