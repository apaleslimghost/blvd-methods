var methods   = require('http').METHODS || require('methods');
var camelCase = require('camel-case');
var curry     = require('curry');
var extend    = require('util')._extend;

methods.forEach(function(method) {
	var handler = camelCase(method);
	exports[handler + '_'] = curry(function(getMethod, fn) {
		return function() {
			if(getMethod.apply(this, arguments).toLowerCase() === method.toLowerCase()) {
				return fn.apply(this, arguments);
			}
		};
	});
});

exports.withGetMethod = function(getMethod) {
	var out = [];

	methods.forEach(function(method) {
		var handler = camelCase(method);
		out[handler] = exports[handler + '_'](getMethod);
	});

	return out;
};

extend(exports, exports.withGetMethod(function getMethod_(req) {
	return req.method;
}));