var methods   = require('http').METHODS || require('methods');
var camelCase = require('camel-case');
var curry     = require('curry');
var jalfrezi  = require('jalfrezi');
var extend    = require('util')._extend;

methods.forEach(function(method) {
	var handler = camelCase(method);
	var inner = function(options, fn) {
		return function() {
			if(options.getMethod.apply(this, arguments).toLowerCase() === method.toLowerCase()) {
				return fn.apply(this, arguments);
			}

			return options.onFail.apply(this, arguments);
		};
	};
	inner.displayName = handler;

	var outer = exports[handler] = jalfrezi({
		getMethod: getMethod_,
		onFail: onFail_
	}, inner);

	exports[handler + '_'] = outer[handler + '_'];
});

function getMethod_(req) {
	return req.method;
}

function onFail_() {
	return false;
}

exports.methods_ = curry(function(getMethod, onFail) {
	var out = [];

	methods.forEach(function(method) {
		var handler = camelCase(method);
		out[handler] = exports[handler + '_']({
			getMethod: getMethod,
			onFail: onFail
		});
	});

	return out;
});

exports.withGetMethod = function(getMethod) {
	return exports.methods_(getMethod, onFail_);
};

exports.withOnFail = exports.methods_(getMethod_);
