
//~ <component>
//~	Name: Animation
//~	Info: Animation API
//~ </component>


	(function() {

		var	animationDelay = 16,
			fn = {
				'linear': function(x) {
					return x;
				},
				'swing': function(x) {
					return (-Math.cos(x*Math.PI)/2)+0.5;
				}
			},
			animationData = 'animation___'+hash;

		function animationStatus(node, type, val) {
			var animData = _.data(node, animationData) || _.data(node, animationData, {});
			if(val !== undefined) {animData[type] = val; return;}
			return animData[type];
		}

		_.animate = function(node, type, terminal, time, callback, fnName) {

			function changeCss() {
				var	now = Date.now() - start,
					progress = now / time,
					result = ((terminal - current)*easing(progress)+current).limit(current, terminal);

				_.css(node, type, result+unit);

				if(progress < 1) {
					node[timerName] = setTimeout(changeCss, animationDelay);
				}
				else {
					_.css(node, type, terminal);
					animationStatus(node, type, '');
					if(callback) {callback.call(node);}
				}
			}

			var	currentAnimStatus = animationStatus(node, type),
				currCss = _.css(node, type).toString(),
				current = (type == 'opacity')?currCss.toFloat():currCss.toInt(),
				diff = current-terminal,
				animStatus = (diff<0)?0:1,
				timerName = 'animation_'+type+'___'+hash;

			if(currentAnimStatus !== animStatus && diff !== 0) {
				if(currentAnimStatus !== undefined) {clearTimeout(node[timerName]);}

				var	unit = currCss.match(/[a-z]+/),
					easing = fn[fnName] || fn['swing'],
					start = Date.now();

				unit = (unit)?unit:'';
				animationStatus(node, type, animStatus);

				node[timerName] = setTimeout(changeCss, animationDelay);
			}

		};

		_.hide = function(node, time, callback) {
			if(time) {
				_.animate(node, 'opacity', 0, time, function() {
					node.style.display = 'none';
					if(callback) callback();
				});
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

		_.show = function(node, time, callback) {
			if(time) {
				if(_.gstyle(node, 'display') == 'none') {
					_.css(node, 'opacity', 0);
					node.style.display = 'block';
				}
				_.animate(node, 'opacity', 1, time, function() {
					if(callback) callback();
				});
			}
			else {
				node.style.display = node.display || 'block';
			}
		};


		_.extend({

			'hide': function(time, callback) {
				this.ns.forEach(function(c) {
					_.hide(c, time, callback);
				});
				return this;
			},
			'show': function(time, callback) {
				this.ns.forEach(function(c) {
					_.show(c, time, callback);
				});
				return this;
			},
			'animate': function(type, terminal, time, fnName, callback) {
				this.ns.forEach(function(c) {
					_.animate(c, type, terminal, time, fnName, callback);
				});
				return this;
			}

		});

	})();
