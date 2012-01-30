
//~ <component>
//~	Name: Data
//~	Info: Provides data API
//~ </component>


	function hookCache(node) {
		node[data.hash] = data.next++;
		_.dataCache[node[data.hash]] = {};
	}

	function data(node, name, val) {
		if(node) {
			var key = node[data.hash];
			if(arguments.length == 2)  {
				if(key !== undefined) {
					return _.dataCache[key][name];
				}
				return undefined;
			}
			else if(arguments.length === 3) {
				if(val === null) {
					delete _.dataCache[key][name];
				}
				else {
					if(key === undefined) {hookCache(node);}
					_.dataCache[node[data.hash]][name] = val;
					return val;
				}
			}
		}
	}

	data.next = 0;
	data.hash = 'data___'+hash;

	_.data = data;
	_.dataCache = {};

	_.extend({

		'data': function(name, val) {
			if(name !== undefined && name !== '') {
				if(arguments.length == 2) {
					this.ns.forEach(function(c) {
						_.data(c, name, val);
					});
				}
				else {
					if(this.ns[0]) return _.data(this.ns[0], name);
				}
			}
			return this;
		}

	});
