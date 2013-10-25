//'use strict';
var SearchArtistCtrl = app.controller('SearchArtistCtrl', function ($rootScope, $scope, $location, LastFmService, YoutubeService, PlaylistService) {
	var albumIndex = 0, trackIndex = 0;
	$scope.youtubeSrc = "http://youtube.com/";
	$scope.videoScreenIsHidden = true;
	$scope.state = YoutubeService.playerState();
	$scope.artist = 'nicolay';
	$scope.currentTrack = {};


	$scope.playlist = PlaylistService.playlist;


	$scope.findAlbumsForArtist = function () {
		LastFmService.getTopAlbumsForArtist($scope.artist, function (data) {
			$scope.albums = data;
		});
	}

	$scope.loadAlbumTracks = function (index) {
		albumIndex = index;
		var album = $scope.albums[albumIndex];
		LastFmService.getAlbumInfo({artist: album.artist.name, album: album.name}, function (data) {
			$scope.album = album;
			$scope.albums[$scope.albums.indexOf($scope.album)].tracks = data.tracks.track;
		});
	}


	$scope.playAlbumTracks = function (index) {
		var album = $scope.albums[index];
//
		LastFmService.getAlbumInfo({artist: album.artist.name, album: album.name}, function (data) {
			console.log(data);
			PlaylistService.addSongs(data.tracks.track);
			$scope.playlist = PlaylistService.getList();

		});
	}


	$scope.addToPlaylist = function (list) {
		console.log(list);
//			addToPlaylist

//			albumIndex = index;
//			var album = $scope.albums[albumIndex];
//			LastFmService.getAlbumInfo({artist:album.artist.name, album:album.name}, function (data) {
//				$scope.album = album;
//				$scope.albums[$scope.albums.indexOf($scope.album)].tracks = data.tracks.track;
//			});
	}

	$scope.playSong = function (index) {
		//Set old currentTrack playing state to false
		$scope.currentTrack.playing = false;

		//Set new currentTrack
		trackIndex = index;
		$scope.currentTrack = $scope.albums[albumIndex].tracks[index];
		YoutubeService.getSong($scope.currentTrack.artist.name + ' ' + $scope.currentTrack.name, function (youtubeId) {
			$scope.currentTrack.playing = true;
			console.log(youtubeId);
			YoutubeService.player.loadVideoById(youtubeId, 0, 'large');
		});
	}
	$scope.playTrack = function (track) {
		YoutubeService.getSong(track.artist.name + ' ' + track.name, function (youtubeId) {
//			$scope.currentTrack.playing = true;
//			console.log(youtubeId);
			YoutubeService.player.loadVideoById(youtubeId, 0, 'large');
		});
	}



	$scope.playNext = function () {
		var track = $scope.albums[albumIndex].tracks[trackIndex];
		console.log(trackIndex);
		track.playing = false;
		//TODO:  Play next in queue
//			$rootScope.$emit('nextTrack');
		$scope.playSong(trackIndex + 1);
	}

//	$rootScope.$on('playerStateChange', function () {
//		$scope.$apply(function () {
//
//			$scope.playlist = PlaylistService.getList();
//
//			console.log($scope.playlist.length);
//
//		})
//	});

	$rootScope.$on('playlistUpdate', function () {
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
});
