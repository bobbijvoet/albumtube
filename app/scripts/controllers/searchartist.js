//'use strict';
var SearchArtistCtrl = app.controller('SearchArtistCtrl', function ($rootScope, $scope, $location, LastFmService, YoutubeService, PlaylistService) {
	var albumIndex = 0, trackIndex = 0;
	$scope.youtubeSrc = "http://youtube.com/";
	$scope.videoScreenIsHidden = true;
	$scope.state = YoutubeService.playerState();
	$scope.artist = 'arpanet';
	$scope.currentTrack = {};


	$scope.playlist =  {};//PlaylistService.list;

	$scope.playlist.list = PlaylistService.list;




	/*$scope.$watch( function () { return PlaylistService.list; }, function (data) {
//	    $scope.playlist = data;
		console.log(PlaylistService.list.length);

	  }, true);*/


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

		LastFmService.getAlbumInfo({artist: album.artist.name, album: album.name}, function (data) {
			$scope.album = album;
			$scope.albums[$scope.albums.indexOf($scope.album)].tracks = data.tracks.track;

			PlaylistService.addSongs(data.tracks.track);
		});
	}


	$scope.addTracks = function (list) {
		PlaylistService.addSong(angular.copy(list[0]));
	}

	$scope.playTracks = function (list) {
		PlaylistService.addSongsAndPlay(angular.copy(list));



	}

	$scope.playPlaylistTrack = function (index) {
		PlaylistService.playTrack(index);
	}

	$scope.playNext = function () {
		PlaylistService.playNext();
	}

	$rootScope.$on('playlistUpdate', function () {
		$scope.$apply(function () {
			$scope.state = YoutubeService.playerState();
			if ($scope.state == 0) {
				$scope.playNext();
			}
		})
	});

	$rootScope.$on('playerStateChange', function () {
		$scope.$apply(function () {

			$scope.state = YoutubeService.playerState();
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
});
