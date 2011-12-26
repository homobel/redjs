
	_.extend({

		'val': function(value) {
			if(value !== undefined) {
				this.ns.forEach(function(c) {
					c.value = value;
				});
				return this;
			}
			else {
				if(this.ns[0]) return this.ns[0].value;
			}
		}

	});