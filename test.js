var sinon = require('sinon');
var expect = require('sinon-expect').enhance(
	require('expect.js'),
	sinon,
	'was'
);

var camelCase = require('camel-case');
var methods = require('http').METHODS || require('methods');

var μ = require('./');

methods.forEach(function(method) {
	var wrapper = μ[camelCase(method)];

	exports[method] = {
		'basic usage': function() {
			var handler = sinon.spy();
			var wrapped = wrapper(handler);

			wrapped({method: method});
			expect(handler).was.called();
		}
	};
});