
//~ <component>
//~	Name: Deferred
//~	Info: Provides callbacks API
//~ </component>

(function() {

	var	slice = Array.prototype.slice, _FuncList = {
			'exec': function(params, obj) {
				this.calls++;
				this.list.forEach(function(c) {
					c.apply(obj, params  || []);
				});
				return this;
			},
			'add': function(func) {
				if(func && func  instanceof Function) {
					this.list.push(func);
				}
				return this;
			},
			'del': function(func, flag) {
				var n = this.list.indexOf(func);
				if(flag) {
					while(~n) {
						this.list.del(n);
						n = this.list.indexOf(func);
					}
				}
				else {
					this.list.del(n);
				}
				return this;
			}
		},
		_Deferred = {
			'resolve': function(params, context) {
				if(this.status == -1) {
					this.status = 1;
					this.context = context;
					this.params = params || [];
					this.successList.exec(this.params, this.context);
					this.anywayList.exec(this.params, this.context);
				}
			},
			'reject': function(params, context) {
				if(this.status == -1) {
					this.status = 0;
					this.context = context;
					this.params = params || [];
					this.errorList.exec(this.params, this.context);
					this.anywayList.exec(this.params, this.context);
				}
			},
			'success': function(func) {
				if(this.status == -1) {
					this.successList.add(func);
				}
				else if(this.status === 1) {
					func.apply(this.context, this.params);
				}
				return this;
			},
			'error': function(func) {
				if(this.status == -1) {
					this.errorList.add(func);
				}
				else if(this.status === 0) {
					func.apply(this.context, this.params);
				}
				return this;
			},
			'anyway': function(func) {
				if(this.status == -1) {
					this.anywayList.add(func);
				}
				else {
					func.apply(this.context, this.params);
				}
				return this;
			}
		};

	function FuncList() {
		this.calls = 0;
		this.list = [];
	}

	function Deferred() {
		this.status = -1;
		this.errorList = new FuncList();
		this.successList = new FuncList();
		this.anywayList = new FuncList();
	}

	FuncList.prototype = _FuncList;
	Deferred.prototype = _Deferred;

	_.funcList = function() {
		return new FuncList();
	};

	_.deferred = function() {
		return new Deferred();
	};

	_.when = function() {

		var	when = new Deferred(),
			args = arguments,
			i,
			l = args.length,
			counter = 0,
			err = false;

		for( i = 0; i < l; i++) {
			if(args[i] instanceof Deferred) {
				args[i].success(function() {
					if(++counter == l) {
						if(err) {
							when.reject();
						}
						else {
							when.resolve();
						}
					}
				}).error(function() {
					err = true;
					if(++counter == l) {
						when.reject();
					}
				});

			}
		}
		return when;
	};

})();
