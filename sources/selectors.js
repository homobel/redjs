// ########################---------- SELLECTORS

	_.id = function(name) {return doc.getElementById(name);};

	_.tag = function(name, node) {return (node || doc).getElementsByTagName(name);};

	_.className = (function() {
		if(document.getElementsByClassName) {
			return function(name, node) {
				return (node || document).getElementsByClassName(name);
			}
		}
		else {
			return function(name, node) {
				if(name) {
					var	nodes = _.tag('*', node),
						classArray = name.split(/\s+/),
						classes = classArray.length,
						result = [], i,l,j;

					for(i = 0, l = nodes.length; i < l; i++) {
						for(j = 0; j < classes; j++) {
							if(nodes[i].className.hasWord(classArray[j])) {
								result.push(nodes[i]);
								break;
							}
						}
					}
					return result;
				}
				else {throw Error('Not enough arguments');}
			}
		}
	})();

	function getArrWithElemById(name) {
		return toArraySimple(_.id(name));
	}

	function getArrWithElemsByTag(name, node) {
		return toArraySimple(_.tag(name, node));
	}

	function getArrWithElemsByClass(name, node) {
		return toArraySimple(_.className(name, node));
	}

	function getNodes(name, node) {
		if(name === undefined || name === '') {return [];}
		var	inContext = !!node,
			firstType = type(name);

		if(inContext) {
			var secondType = type(name);
			if(secondType.is('string')) {
				node = getNodes(node);
			}
			else node = toArraySimple(node);
		}
		if(firstType.is('string')) {
			var firstChar = name.charAt(0);
			if(firstChar == '#') {
				return getArrWithElemById(name.substr(1));
			}
			else if(firstChar == '.') {
				var className = name.substr(1);
				if(inContext) {
					for(var nodes = [], i = 0, l = node.length; i<l; i++) {
						nodes = nodes.concat(getArrWithElemsByClass(className, node[i]));
					}
					return nodes;

				}
				else {
					return getArrWithElemsByClass(className);
				}
			}
			else if(firstChar == '+') {
				return [_.create(name.substr(1))];
			}
			else {
				if(inContext) {
					for(var nodes = [], i = 0, l = node.length; i<l; i++) {
						nodes = nodes.concat(getArrWithElemsByTag(name, node[i]));
					}
					return nodes;

				}
				else {
					return getArrWithElemsByTag(name);
				}
			}
		}
		else if (firstType.is('redjs')) {
			return name.ns;
		}
		else {
			return toArraySimple(name);
		}
	}