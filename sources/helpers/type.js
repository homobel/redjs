
// ########################---------- TYPE DETERMINANT

	(function() {

		function Type(n) {this.val = n}

		function getType(something) {
			switch(typeof something) {
				case 'undefined': return getType['undefined'];
				case 'boolean': return getType['boolean'];
				case 'number': return getType['number'];
				case 'string': return getType['string'];
				case 'function': if(something.call) {return getType['function'];}
				case 'object': if(something instanceof redjsCollection) {return  getType['redjs'];}
							else if(something === null) {return getType['null'];}
								else if(something instanceof Array) {return getType['array'];}
									else if(something.nodeName && something.nodeType !== undefined) {return getType['node'];}
										else if(something.length !== undefined) {return getType['nodelist'];}
											else if(Object.prototype.toString.call(something) == '[object Object]') {return getType['object'];}
			}
			return getType['unknown'];
		}

		Type.prototype = {
			'toString': function() {return types[this.val];},
			'is': function(typeStr) {
				return types[this.val] == typeStr;
			}
		};

	  	var	types = ['undefined', 'boolean', 'number', 'string', 'function', 'node', 'nodelist', 'array', 'object', 'null', 'redjs', 'unknown'];

		types.forEach(function(c, i) {
			this[c] = new Type(i);
			this[i] = c;
		}, getType);

		type = _.type = getType;

	})();
