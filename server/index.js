require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 4668;
const decorateBeats = require('./utils/analyzeBeats.js');

app.use(express.static(path.join(__dirname, '..', 'dist')));

var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT,
  clientSecret: process.env.SPOTIFY_SECRET,
});

app.get('/api', (req, res) => {
  spotifyApi.clientCredentialsGrant()
    .then(data => {
      spotifyApi.setAccessToken(data.body['access_token']);
    })
    .then(() => spotifyApi.searchTracks('track:oops I did it again artist:Britney Spears'))
    .then(data => spotifyApi.getAudioAnalysisForTrack(data.body.tracks.items[0].id))
    .then(analysis => {
      //console.log(analysis.body.segments);
      //var events = analysis.body.segments.map(segment2event);
      //res.send(events);
      console.log(analysis.body.beats[0]);
      decorateBeats(analysis.body.beats, analysis.body.segments, (err, beats) => {
        if (err) {
          console.log('errrrr');
          res.status(500).send(err);
        } else {
          console.log('here');
          res.send(beats);
        }
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(err)
    });
});


app.listen(port, () => {
  console.log(`Server is now listening on port ${port}`);
});