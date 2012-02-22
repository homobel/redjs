
//~ <component>
//~	Name: Data
//~	Info: Provides data API
//~ </component>


	function data(node, name, val) {
		if(node) {
			var key = node[data.hash];
			if(arguments.length == 2)  {
				if(key !== undefined) {
					return _.dataCache[key][name];
				}
			}
			else if(arguments.length === 3) {
				if(val === null) {
					delete _.dataCache[key][name];
				}
				else {
					if(key === undefined) {
						data.hookCache(node);
					}
					_.dataCache[node[data.hash]][name] = val;
					return val;
				}
			}
		}
	}

	data.next = 0;
	data.hash = 'data___'+hash;
	data.hookCache = function(node) {
		node[data.hash] = data.next++;
		_.dataCache[node[data.hash]] = {};
	};

	_.data = data;
	_.dataCache = {};


	function provideData(node, name, value) {
		var dataObj = data(node, name);
		if(dataObj === undefined) {
			return data(node, name, value);
		}
		return dataObj;
	}

	_.provideData = provideData;


	_.extend({

		'data': function(name, val) {
			if(arguments.length == 2) {
				this.ns.forEach(function(c) {
					_.data(c, name, val);
				});
				return this;
			}
			else {
				if(this.ns[0]) {
					return _.data(this.ns[0], name);
				}
			}
		},
		'provideData': function() {
			if(arguments.length == 2) {
				this.ns.forEach(function(c) {
					_.provideDate(c, name, val);
				});
				return this;
			}
			else {
				if(this.ns[0]) {
					return _.provideDate(this.ns[0], name);
				}
			}
		}

	});
