var AlbumTubeServices = angular.module('AlbumTubeServices', []);

AlbumTubeServices.factory('YoutubeService', ['$window', '$rootScope', '$http', '$q' /*,'PlaylistService'*/, function ($window, $rootScope, $http, $q /*,PlaylistService*/) {
	var youtubeConfig = {
		url:'https://gdata.youtube.com/feeds/api/videos?start-index=1&safeSearch=none&v=2&alt=json&callback=JSON_CALLBACK',
		method:'GET',
		params:{
			'max-results':1
		}
	}

	var YoutubeService = {
		player:null,
		getSong:function (artist, callback) {
			var config = angular.copy(youtubeConfig, {});
			//config.params.limit = 10;
			config.params.q = artist;

			$http.jsonp(config.url, config).
				success(function (data, status, headers, config) {
					console.log(data);
					return callback(data.feed.entry[0].id.$t.split(':').reverse()[0]);
				}).
				error(function (data, status, headers, config) {
				});
		},playerStateChange:function(){
			$rootScope.$emit('playerStateChange');
		}
		,playerState: function(){
			return (this.player != null ? this.player.getPlayerState() : -1);
		}
		,getVideoTotalDuration:function(){
			return (this.player != null ? this.player.getDuration() : 0);
		}
	};

	$window.onYouTubeIframeAPIReady = function () {
		YoutubeService.player = new YT.Player('player', {
			height:'320',
			width:'480',
			events:{
//				'onReady':onPlayerReady,
				'onStateChange':YoutubeService.playerStateChange
			}
		});
	}
	return YoutubeService;
}]);


AlbumTubeServices.factory('PlaylistService', ['$window', '$rootScope', '$http', '$q', function ($window, $rootScope, $http, $q) {

	var PlaylistService = {

	};
	return PlaylistService;
}]);



AlbumTubeServices.factory('LastFmService', ['$rootScope', '$http', '$q', function ($rootScope, $http, $q) {
	var lastFmConfig = {
		url:'http://ws.audioscrobbler.com/2.0/',
		method:'GET',
		params:{
			format:'json',
			api_key:'75d1a18e9f19edc195ab48a98754ba67'
		}
	}

	var LastFmService = {
		name:"LastFm",
		getTopAlbumsForArtist:function (artist, callback) {
			var config = angular.copy(lastFmConfig, {});//todo: try not providing  {}
			config.params.artist = artist;
			config.params.method = 'artist.gettopalbums';
			config.params.limit = 10;
			config.params.autocorrect = 1;


			$http(config).
				success(function (data, status, headers, config) {
					return callback(data.topalbums.album)
				}).
				error(function (data, status, headers, config) {
				});
		}, getAlbumInfo:function (data, callback) {
			var config = angular.copy(lastFmConfig, {});
			console.log(data);
			config.params.artist = data.artist;
			config.params.album = data.album;
			config.params.method = 'album.getinfo';

			$http(config).
				success(function (data, status, headers, config) {
					return callback(data.album)
				}).
				error(function (data, status, headers, config) {
				});
		}
	};
	return LastFmService;
}]);


AlbumTubeServices.factory('PlayList', ['$rootScope', '$http', '$q', function ($rootScope, $http, $q) {

	var PlayList = {
		add:function(){

		},
		remove:function(){

		},
		getNext:function(){

		},
		getPrev:function(){

		}
		,
		getList:function(){

		}

	};
	return PlayList;
}])