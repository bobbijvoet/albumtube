//'use strict';
var SearchArtistCtrl = app.controller('SearchArtistCtrl',
	['$rootScope', '$scope', '$location', 'LastFmService', 'YoutubeService', function ($rootScope, $scope, $location, LastFmService, YoutubeService) {
		var albumIndex = 0, trackIndex = 0;
		$scope.youtubeSrc = "http://youtube.com/";
		$scope.videoScreenIsHidden = true;
		$scope.state = YoutubeService.playerState();
		$scope.artist = 'nicolay';

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

			console.log('play');
			trackIndex = index;
			var track = $scope.albums[albumIndex].tracks[trackIndex];
			YoutubeService.getSong(track.artist.name + ' ' + track.name, function (youtubeId) {
				track.playing = true;
				console.log(youtubeId);
				YoutubeService.player.loadVideoById(youtubeId, 0, 'large');
			});
		}

		$scope.playNext = function () {
			var track = $scope.albums[albumIndex].tracks[trackIndex];
			track.playing = false;
			//TODO:  Play next in queue
			$rootScope.$emit('nextTrack');
			$scope.playSong(trackIndex + 1);
		}

		$rootScope.$on('playerStateChange', function () {
			$scope.$apply(function () {
				$scope.state = YoutubeService.playerState();
				if ($scope.state == 0) {
					$scope.playNext();
				}
			})
		});

		$scope.togglePause = function () {
			if (YoutubeService.playerState() == 1) {
				YoutubeService.player.pauseVideo();
			} else {
				YoutubeService.player.playVideo();
			}
		}

		$scope.toggleVideoScreen = function () {
			console.log(YoutubeService.getVideoTotalDuration())
			$scope.videoScreenIsHidden = !$scope.videoScreenIsHidden;
		}

//		$scope.addToPlaylist = function() {
//
//		}
	}]);
