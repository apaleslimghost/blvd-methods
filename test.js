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
		},

		'args and return value': function() {
			var handler = sinon.stub().returns('foo');
			var wrapped = wrapper(handler);
			var req = {method: method};

			expect(wrapped(req)).to.be('foo');
			expect(handler).was.calledWith(req);
		},

		'withGetMethod inner': function() {
			var wrapper = μ[camelCase(method)].withGetMethod(function getMethod_() {
				return method;
			});
			var handler = sinon.spy();
			var wrapped = wrapper(handler);

			wrapped({method: method});
			expect(handler).was.called();
		},

		'withGetMethod outer': function() {
			var wrapper = μ.withGetMethod(function getMethod_() {
				return method;
			})[camelCase(method)];
			var handler = sinon.spy();
			var wrapped = wrapper(handler);

			wrapped({method: method});
			expect(handler).was.called();
		},

		'withOnFail inner': function() {
			var wrapper = μ[camelCase(method)].withOnFail(function onFail_() {
				return 'foo';
			});
			var wrapped = wrapper(function(){});

			expect(wrapped({method: 'nope'})).to.be('foo');
		},

		'withOnFail outer': function() {
			var wrapper = μ.withOnFail(function onFail_() {
				return 'foo';
			})[camelCase(method)];
			var wrapped = wrapper(function(){});

			expect(wrapped({method: 'nope'})).to.be('foo');
		}
	};
});