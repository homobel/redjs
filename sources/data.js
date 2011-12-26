
// ########################---------- DATA MODULE

	(function() {

		var	cacheNextVal = 0,
			dataHash = 'data___'+hash;

		function hookCache(node) {
			node[dataHash] = cacheNextVal++;
			_.dataCache[node[dataHash]] = {};
		}

		function data(node, name, val) {
			if(node) {
				var key = node[dataHash];
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
						_.dataCache[node[dataHash]][name] = val;
						return val;
					}
				}
			}
		}

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

	})();
