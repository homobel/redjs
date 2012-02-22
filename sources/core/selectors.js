
//~ <component>
//~	Name: Selectors
//~	Info: Provides node selection API
//~ </component>


	_.id = function(name, node) {
		if(node === undefined) {
			return doc.getElementById(name);
		}
		else {
			return getNodeByIdAndParent(name, node);
		}
	};

	function getNodeByIdAndParent(name, node) {
		var children = _.children(node);
		for(var i = 0, l = children.length; i < l; i++) {
			if(children[i].getAttribute('id') == name) {
				return children[i];
			}
			else {
				var res = getNodeByIdAndParent(name, children[i]);
				if(res !== null) {
					return res;
				}
			}
		}
		return null;
	}

	_.tag = function(name, node) {
		return (node || doc).getElementsByTagName(name);
	};

	_.className = (function() {
		if(document.getElementsByClassName) return function(name, node) {
			return (node || document).getElementsByClassName(name);
		}
		else return function(name, node) {
			if(name) {

				var	nodes = _.tag('*', node),
					classArray = name.split(/\s+/),
					classes = classArray.length,
					result = [], i,l,j;

				for(i = 0, l = nodes.length; i < l; i++) {
					var trigger = true;
					for(j = 0; j < classes; j++) {
						if(!nodes[i].className.hasWord(classArray[j])) trigger = false;
					}
					if(trigger) result.push(nodes[i]);
				}
				return result;
			}
			else {throw Error('Not enough arguments');}
		}
	})();


	// converting to array methods
	
	function getArrWithElemById(name, node) {
		return toArraySimple(_.id(name, node));
	}
	
	function getArrWithElemsByTag(name, node) {
		return toArraySimple(_.tag(name, node));
	}
	
	function getArrWithElemsByClass(name, node) {
		return toArraySimple(_.className(name, node));
	}



	function getNodes(name, node) {

		if(name === undefined || name === '') {return [];}
		if(name === win) {return [win];}

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
				var idName = name.substr(1);
				if(inContext) {
					for(var nodes = [], i = 0, l = node.length; i<l; i++) {
						nodes = nodes.concat(getArrWithElemById(idName, node[i]));
					}
					return nodes;
				}
				else {
					return getArrWithElemById(idName);
				}
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


