'use strict';

window.mobileDevice = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) )

var app = angular.module('AlbumTube', ['ngResource', 'AlbumTubeServices', 'touch'])
	.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
		.otherwise({
			redirectTo:'/home'
		});
}]);
