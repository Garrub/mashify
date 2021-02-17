import React, { useEffect, useState, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Mash from './Mash.jsx';
import SongForm from './SongForm.jsx';
import songlist from '../lib/songlist.js';

const App = () => {
  const [paths, setPaths] = useState([]);
  const audio1 = useRef();
  const audio2 = useRef();
  const [ready1, setReady1] = useState(false);
  const [ready2, setReady2] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [prevTime, setPrevTime] = useState([0, 0]);
  const [targetSongs, setTargetSongs] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(audio1);
  const [paused, setPaused] = useState(true);
  const [volume, setVolume] = useState(0.5);


  const seek = (e) => {
    if (!ready1 || !ready2) {
      console.log('not ready');
      return;
    }
    setSwapping(true);
    var ref = e.target.id === 'sb0' ? audio1 : audio2;
    ref.current.currentTime = e.nativeEvent.offsetX / 700 * ref.current.duration;
  };

  const updateTargetSongs = (songId1, songId2) => {
    if (songId2 === '' || songId1 === songId2) {
      var songs = [songlist[songId1]];
    } else {
      var songs = [songlist[songId1], songlist[songId2]];
    }
    setTargetSongs(songs);
    return songs;
  };


  const fetchSongs = (songId1, songId2, timbre) => {
    var songs = updateTargetSongs(songId1, songId2);
    fetch(buildUrl(songs, timbre))
      .then(response => response.json())
      .then(parsed => {
        var paths = parsed.map(song => song.paths);
        console.log(paths);
        setPaths(paths);
        console.log('paths loaded');
      })
      .catch(err => console.error(err));
  };

  const buildUrl = (songs, timbre) => {
    if (songs.length === 1) {
      return `/api2?track=${songs[0].track}&artist=${songs[0].artist}${timbre ? `&timbre=${timbre}` : ''}`;
    }
    return `/api?track1=${songs[0].track}&artist1=${songs[0].artist}&track2=${songs[1].track}&artist2=${songs[1].artist}${timbre ? `&timbre=${timbre}` : ''}`;
  }

  const handleTimeUpdate = (e) => {
    var [idx, nextAudio] = e.target.id === 'audio1' ? [0, audio2] : [1, audio1];
    var timestamps = Object.keys(paths[idx]);
    if (!swapping) {
      for (var i = 0; i < timestamps.length; i++) {
        if ((prevTime[idx] < timestamps[i]) && (e.target.currentTime >= timestamps[i])) {
          if (Math.random() < 0.33) {
            break;
          }
          setSwapping(true);
          var target = Number(paths[idx][timestamps[i]]);
          console.log(`swap to ${nextAudio.current.id}: from ${e.target.id}@${e.target.currentTime} to ${nextAudio.current.id}@${target}, prev: ${prevTime[idx]}`);
          setCurrentAudio(nextAudio);
          nextAudio.current.currentTime = target;
          nextAudio.current.play();
          e.target.pause();
          break;
        }
      }
    } else {
      setSwapping(false);
    }
    //setPrevTime()
    //prevTime[idx] = e.target.currentTime;
    var newPrev = e.target.id === 'audio1' ? [e.target.currentTime, target] : [target, e.target.currentTime];
    setPrevTime(newPrev);
  }


  return (
    <div>
      <GlobalStyle />
      <Header>MASHIFY</Header>
      <AppContainer>
        <SongForm fetchSongs={fetchSongs} />
        {!targetSongs[0] ? null : <audio ref={audio1} id="audio1" src={`assets/music/${targetSongs[0].id}.mp3`} preload="auto" type="audio/mpeg" onCanPlayThrough={(e) => {
          setReady1(true);
          e.target.volume = volume;
        }} onTimeUpdate={handleTimeUpdate}>
          Your browser does not support the audio tag
      </audio>}
        {!targetSongs[0] ? null : <audio ref={audio2} id="audio2" src={`assets/music/${targetSongs[1] ? targetSongs[1].id : targetSongs[0].id}.mp3`} preload="auto" type="audio/mpeg" onCanPlayThrough={(e) => {
          setReady2(true);
          e.target.volume = volume;
        }} onTimeUpdate={handleTimeUpdate}>Your browser does not support the audio tag</audio>}
        <div>
          <Button disabled={!ready1 || !ready2 || (paths.length === 0)} onClick={() => {
            if (paused) {
              currentAudio.current.play();
              setPaused(false);
            } else {
              currentAudio.current.pause();
              setPaused(true);
            }
          }}>{paused ? '\u25B6' : '\u275a\u275a'}</Button>
          <Volume type="range" min="0.0" max="1.0" step="0.1" value={volume} onChange={e => {
            setVolume(Number(e.target.value));
            if (audio1.current && audio2.current) {
              audio1.current.volume = Number(e.target.value);
              audio2.current.volume = Number(e.target.value);

            }
          }}/>
        </div>
        <Mash playing={currentAudio.current ? currentAudio.current.id : null} songs={[
          { currentTime: prevTime[0], duration: audio1.current ? audio1.current.duration : 180, paths: paths[0] },
          { currentTime: prevTime[1], duration: audio2.current ? audio2.current.duration : 180, paths: paths[1] }
        ]} seek={seek} />
      </AppContainer>
    </div>
  );
};

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    color: #fff;
    background-color: #202020;
    font-family: 'Montserrat', sans-serif;
  }
`;

const Header = styled.h1`
  text-align: center;
  font-size: 42px;
  line-height: 1em;
`;
const AppContainer = styled.div`
  width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px auto;

`;
const Button = styled.button`
  width: 100px;
  height: 66px;
  margin-bottom: 20px;
  font-size: 30px;
`;

const Volume = styled.input`
  transform: rotate(-90deg);
  width: 66px;
`;

export default App;