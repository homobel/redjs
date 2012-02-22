
//~ <component>
//~	Name: RedJS UI
//~	Info: UI library
//~ </component>


(function(_, undefined) {

	_.ui = {'cache': {}};

	var hash = 'ui___'+_.hash;

	// data provider

	function uiData(node, prop, value) {
		var data = _.provideData(node, hash, {});
		if(data[prop] === undefined) {
			data[prop] = value;
		}
		return data[prop];
	}


//~ require: ui

	// public API

	_.uiData = uiData;

	_.extend({

		'uiData': function(prop, value) {
			if(this.ns[0]) {
				return _.uiData(this.ns[0], prop, value);
			}
		}

	});

})(redjs);
