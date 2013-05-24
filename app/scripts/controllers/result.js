//'use strict';
var SearchArtistCtrl = app.controller('SearchArtistCtrl',
	['$rootScope', '$scope', '$location', 'LastFmService', 'YoutubeService', function ($rootScope, $scope, $location, LastFmService, YoutubeService) {

		$scope.findAlbumsForArtist = function () {
			LastFmService.getTopAlbumsForArtist($scope.artist, function (data) {
				$scope.albums = data;
			});
		}

		$scope.getAlbumTracks = function (index) {
			albumIndex = index;
			var album = $scope.albums[albumIndex];
			LastFmService.getAlbumInfo({artist:album.artist.name, album:album.name}, function (data) {
				$scope.album = album;
				$scope.albums[$scope.albums.indexOf($scope.album)].tracks = data.tracks.track;
			});
		}

		$scope.playSong = function (index) {
			//TODO: Set album index right
			trackIndex = index;
			var track = $scope.albums[albumIndex].tracks[trackIndex];
			YoutubeService.getSong(track.artist.name + ' ' + track.name, function (youtubeId) {
				track.playing = true;
				YoutubeService.player.loadVideoById(youtubeId, 0, 'large');
			});
		}

		$scope.playNext = function () {
			var track = $scope.albums[albumIndex].tracks[trackIndex];
			track.playing = false;
			//TODO:  Play next in queue
			$scope.playSong(trackIndex + 1);
		}

		$rootScope.$on('addTrack', function () {

		});

	}]);
