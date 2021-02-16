require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 4668;
const {decorateBeats, getMatchingBeats} = require('./utils/analyzeBeats.js');

app.use(express.static(path.join(__dirname, '..', 'dist')));

var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT,
  clientSecret: process.env.SPOTIFY_SECRET,
});

app.get('/api', (req, res) => {
  var song1;
  var song2;
  var track1 = req.query.track1 || 'oops I did it again';
  var artist1 = req.query.artist1 || 'britney spears';
  var track2 = req.query.track2 || 'baby one more time';
  var artist2 = req.query.artist2 || 'britney spears';
  var {pitch, timbre, loud} = req.query;
  spotifyApi.clientCredentialsGrant()
    .then(data => {
      spotifyApi.setAccessToken(data.body['access_token']);
    })
    .then(() => spotifyApi.searchTracks(`track:${track1} artist:${artist1}`))
    .then(data => spotifyApi.getAudioAnalysisForTrack(data.body.tracks.items[0].id))
    .then(analysis => {
      decorateBeats(analysis.body.beats, analysis.body.segments);
      song1 = analysis.body.beats
    })
    .then(() => spotifyApi.searchTracks(`track:${track2} artist:${artist2}`))
    .then(data => spotifyApi.getAudioAnalysisForTrack(data.body.tracks.items[0].id))
    .then(analysis => {
      decorateBeats(analysis.body.beats, analysis.body.segments)
      song2 = analysis.body.beats;
    })
    .then(() => {
      res.send([{
        paths: getMatchingBeats(song1, song2, null, timbre, pitch, loud),
        length: song1.length
      }, {
        paths: getMatchingBeats(song2, song1, null, timbre, pitch, loud),
        length: song2.length
      }]);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(err)
    });
});

app.get('/api2', (req, res) => {
  var song1;
  var song2;
  var track = req.query.track || 'baby one more time';
  var artist = req.query.artist || 'britney spears';
  var {pitch, timbre, loud} = req.query;
  spotifyApi.clientCredentialsGrant()
    .then(data => {
      spotifyApi.setAccessToken(data.body['access_token']);
    })
    .then(() => spotifyApi.searchTracks(`track:${track} artist:${artist}`))
    .then(data => spotifyApi.getAudioAnalysisForTrack(data.body.tracks.items[0].id))
    .then(analysis => {
      decorateBeats(analysis.body.beats, analysis.body.segments);
      song1 = analysis.body.beats;
      song2 = analysis.body.beats;
    })
    .then(() => {
      var match = getMatchingBeats(song1, song2, 'same', timbre, pitch, loud);
      res.send([{
        paths: match,
        length: song1.length
      }, {
        paths: match,
        length: song2.length
      }]);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(err)
    });
});


app.listen(port, () => {
  console.log(`Server is now listening on port ${port}`);
});