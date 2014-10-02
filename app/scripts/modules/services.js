var AlbumTubeServices = angular.module('AlbumTubeServices', []);

AlbumTubeServices.factory('YoutubeService', ['$window', '$rootScope', '$http', '$q' /*,'PlaylistService'*/, function ($window, $rootScope, $http, $q /*,PlaylistService*/) {
  var youtubeConfig = {
    url: 'https://gdata.youtube.com/feeds/api/videos?start-index=1&safeSearch=none&v=2&alt=json&callback=JSON_CALLBACK',
    method: 'GET',
    params: {
      'max-results': 1
    }
  };

  var YoutubeService = {
    player: null,
    getSong: function (artist, callback) {
      var config = angular.copy(youtubeConfig, {});
      //config.params.limit = 10;
      config.params.q = artist;

      $http.jsonp(config.url, config).
        success(function (data, status, headers, config) {
          return callback(data.feed.entry[0].id.$t.split(':').reverse()[0]);
        }).
        error(function (data, status, headers, config) {
        });
    },
    playerStateChange: function () {
      $rootScope.$emit('playerStateChange');
    },
    playerState: function () {
      return (this.player != null ? this.player.getPlayerState() : -1);
    },
    getVideoTotalDuration: function () {
      return (this.player != null ? this.player.getDuration() : 0);
    }
  };

  $window.onYouTubeIframeAPIReady = function () {
    YoutubeService.player = new YT.Player('player', {
      height: '320',
      width: '480',
      events: {
//				'onReady':onPlayerReady,
        'onStateChange': YoutubeService.playerStateChange
      }
    });
  }
  return YoutubeService;
}]);


AlbumTubeServices.factory('PlayerService', function ($window, $rootScope, YoutubeService) {

  var PlayerService = {};

  PlayerService.play = function (track) {
    console.log('PlayerService.play');
    YoutubeService.getSong(track.artist.name + ' ' + track.name, function (youtubeId) {
      YoutubeService.player.loadVideoById(youtubeId, 0, 'large');
    });

  };
//	if (YoutubeService.playerState() == 1) {
//		PlaylistService.list.shift();
//
//
//	}

  PlayerService.playNext = function (track) {
    console.log('PlayerService.play');
    YoutubeService.getSong(track.artist.name + ' ' + track.name, function (youtubeId) {
      YoutubeService.player.loadVideoById(youtubeId, 0, 'large');
    });

  };

  return PlayerService;
});


AlbumTubeServices.factory('PlaylistService', function ($window, $rootScope, PlayerService, YoutubeService) {

  var PlaylistService = {};
  var trackIndex = 0;
  PlaylistService.list = [];


  PlaylistService.addSong = function (track) {
    var wasEmpty = this.list.length === 0;

    this.list.push(angular.copy(track));

    if (wasEmpty) {
      PlaylistService.playTrack(0);
    }
  };

  PlaylistService.addSongs = function (list) {
    var wasEmpty = this.list.length === 0;

    Array.prototype.splice.apply(this.list, [ this.list.length, 0].concat(list));

    if (wasEmpty) {
      PlaylistService.playTrack(0);
    }
  };

  PlaylistService.addSongsAndPlay = function (list) {
    Array.prototype.splice.apply(this.list, [trackIndex + 1, 0].concat(list));

    if (this.list.length === 1) {
      PlaylistService.playTrack(0);
    } else {
      PlaylistService.playTrack(trackIndex + 1);
    }
  };

  PlaylistService.currentSong = function () {
    return this.list[trackIndex];
  };

  PlaylistService.playTrack = function (index) {
    console.log('PlaylistService.playTrack');
    var track = PlaylistService.list[index];

    PlaylistService.list.map(function (track) {
      track.playing = false;
    });

    track.playing = true;

    trackIndex = index;
    PlayerService.play(track);
  };

  PlaylistService.playNext = function () {
    trackIndex++;
    PlaylistService.playTrack(trackIndex);
  };

  $rootScope.$on('playerStateChange', function () {
    if (YoutubeService.playerState() == 0) {

      PlaylistService.PlaylistService.playNext();
    }
  });

  return PlaylistService;
});


AlbumTubeServices.factory('LastFmService', ['$rootScope', '$http', '$q', function ($rootScope, $http, $q) {
  var lastFmConfig = {
    url: 'http://ws.audioscrobbler.com/2.0/',
    method: 'GET',
    params: {
      format: 'json',
      api_key: '75d1a18e9f19edc195ab48a98754ba67'
    }
  };

  var LastFmService = {
    name: "LastFm",
    getTopAlbumsForArtist: function (artist, callback) {
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
    }, getAlbumInfo: function (data, callback) {
      var config = angular.copy(lastFmConfig, {});
      config.params.artist = data.artist;
      config.params.album = data.album;
      config.params.method = 'album.getinfo';

      $http(config).
        success(function (data, status, headers, config) {


//					data.album.tracks.track.map(function (track) {
//						track.uniqueId = _.uniqueId('track_')
//					});

          return callback(data.album)
        }).
        error(function (data, status, headers, config) {
        });
    }
  };
  return LastFmService;
}]);
