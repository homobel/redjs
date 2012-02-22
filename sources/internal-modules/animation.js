
//~ <component>
//~	Name: Animation
//~	Info: Animation API
//~ </component>


	function animate(node, type, terminal, time, callback, effect) {

		function changeCss() {

			var	now = Date.now() - start,
				progress = now / time,
				result = ((terminal - current) * easing(progress) + current).limit(current, terminal);

			_.css(node, type, result + unit);

			if(progress < 1) {
				animationTypeData.timer = setTimeout(changeCss, animate.delay);
			}
			else {
				_.css(node, type, terminal);
				delete animationData[type];
				if(callback) {
					callback.call(node);
				}
			}
		}

		var	animationData = animate.data(node, type, {}),
			animationTypeData = animationData[type],
			currCss = _.css(node, type).toString(),
			current = currCss.toNumber() || 0,
			diff = current - terminal,
			animStatus = diff < 0 ? 'increase' : 'decrease';

		if(animationTypeData === undefined || animationTypeData.status !== animStatus) {
			if(animationTypeData !== undefined) {				clearTimeout(animationData[type].timer);
				delete animationData[type];			}
			if(diff !== 0) {

				var	unit = currCss.match(/[a-z]+/) || '',
					unit = unit == 'auto' ? 'px' : unit,
					easing = typeof effect == 'function' ? effect : animate.effect[effect] || animate.effect[animate.defaultEffect],
					start = Date.now();

				animationData[type] = animationTypeData = {
					'status': animStatus,
					'timer': setTimeout(changeCss, animate.delay)
				};

			}
		}

	};	animate.hash = 'animation___' + hash;
	animate.data = function(node, type, value) {
		var data = _.provideData(node, animate.hash, {});
		if(data[type] === undefined) {
			data[type] = value;
		}
		return data[type];
	};
	animate.delay = 16;
 	animate.effect = {		'linear': function(x) {
			return x;
		},
		'wobble': function(pos) {
			return (-Math.cos(pos * Math.PI * (9 * pos)) / 2) + 0.5;
		},
		'swing': function(x) {
			return (-Math.cos(x * Math.PI) / 2) + 0.5;
		}	};
	animate.defaultEffect = 'swing';	_.animate = animate;

	_.hide = function(node, time, callback, effect) {
		if(time) {
			_.animate(node, 'opacity', 0, time, function() {
				node.style.display = 'none';
				if(callback) callback();
			}, effect);
		}
		else {
			if (!node.display) {
				var display = _.gstyle(node, 'display');
				if(display != 'none') {node.display = display}
				else {node.display = 'block';}
			}
			node.style.display = 'none';
		}
	};

	_.show = function(node, time, callback, effect) {
		if(time) {
			if(_.gstyle(node, 'display') == 'none') {
				_.css(node, 'opacity', 0);
				node.style.display = 'block';
			}
			_.animate(node, 'opacity', 1, time, function() {
				if(callback) callback();
			}, effect);
		}
		else {
			node.style.display = node.display || 'block';
		}
	};


	_.extend({
		'hide': function(time, callback, effect) {
			this.ns.forEach(function(c) {
				_.hide(c, time, callback, effect);
			});
			return this;
		},
		'show': function(time, callback, effect) {
			this.ns.forEach(function(c) {
				_.show(c, time, callback, effect);
			});
			return this;
		},
		'animate': function(type, terminal, time, effect, callback) {
			this.ns.forEach(function(c) {
				_.animate(c, type, terminal, time, effect, callback);
			});
			return this;
		}
	});
