
//~ <component>
//~	Name: Forms Errors Provider
//~	Info: Form errors provider function
//~ </component>


_.fc.errorsProvider = function() {

	var	form = _(this),
		data = form.formData('controller');

	if(data) {
		var errs = data.errors;
		if(errs !== undefined) {
			errs.forEach(function(validationError) {

				var	c = _(validationError.node),
					data = c.formData('errorsprovider', {});

				if(!data.wrapped) {

					var wrap = _('+span').addClass(_.fc.errorsProvider.selectors.wrap).css({
						'float': c.css('float'),
						'width': c.width(true, true) + 'px'
					});

					c.wrap(wrap);
					data.wrapped = true;
				}

				if(!data.on) {
					var errNode = _('+span').attr('title', validationError.msg).addClass(_.fc.errorsProvider.selectors.error);
					c.parent().append(errNode).show(800, null, 'wobble');

					function remove() {
						c.unbind('change', remove);
						errNode.remove();
						data.on = false;
					}

					c.change(remove);
					data.on = true;
				}

			});
		}
	}
};

_.fc.errorsProvider.selectors = {
	'error': 'redjs-validation-error',
	'wrap': 'redjs-validation-wrap'
};
