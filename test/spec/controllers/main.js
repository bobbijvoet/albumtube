'use strict';

describe('Controller: SearchArtistCtrl', function () {

	// load the controller's module
	beforeEach(module('AlbumTube'));

	var SearchArtistCtrl,
		scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller) {
		scope = {};
		SearchArtistCtrl = $controller('SearchArtistCtrl', {
			$scope: scope
		});
	}));

	it('set initial artist value to nicolay', function () {
		expect(scope.artist).toBe('nicolay');
	});

	it('set initial artist value to nicolay', function () {
		expect(scope.artist).toBe('nicolay');
	});
});
