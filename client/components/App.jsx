import React, { useEffect, useState, useRef } from 'react';
import Mash from './Mash.jsx';

const App = () => {
  const [paths, setPaths] = useState([]);
  const audio1 = useRef();
  const audio2 = useRef();
  const [ready1, setReady1] = useState(false);
  const [ready2, setReady2] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [prevTime, setPrevTime] = useState([0, 0]);


  const buildUrl = (songs, timbre) => {
    if (songs.length === 1) {
      return `/api2?track=${songs[0].track}&artist=${songs[0].artist}${timbre ? `&timbre=${timbre}` : ''}`;
    }
    return `/api?track1=${songs[0].track}&artist1=${songs[0].artist}&track2=${songs[1].track}&artist2=${songs[1].artist}${timbre ? `&timbre=${timbre}` : ''}`;
  }

  useEffect(() => {
    //fetch('/api2?track=all star&artist=smash mouth&timbre=15')
    fetch('/api')
      .then(response => response.json())
      .then(parsed => {
        var paths = parsed.map(song => song.paths);
        console.log(paths);
        setPaths(paths);
        console.log('paths loaded');
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (paths.length === 0) {
      return;
    }
  }, [paths]);

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
      <audio ref={audio1} id="audio1" src="assets/music/oopsIDidItAgain.mp3" preload="auto" type="audio/mpeg" controls onCanPlayThrough={() => setReady1(true)} onTimeUpdate={handleTimeUpdate}>
        Your browser does not support the audio tag
      </audio>
      <audio ref={audio2} id="audio2" src="assets/music/babyOneMoreTime.mp3" preload="auto" type="audio/mpeg" controls onCanPlayThrough={() => setReady2(true)} onTimeUpdate={handleTimeUpdate}>Your browser does not support the audio tag</audio>
      <button disabled={!ready1 || !ready2 || (paths.length === 0)} onClick={() => audio1.current.play()}>Play!</button>
      <Mash songs={[
        {currentTime: prevTime[0], duration: audio1.current ? audio1.current.duration : 180, paths: paths[0]},
        {currentTime: prevTime[1], duration: audio2.current ? audio2.current.duration : 180, paths: paths[1]}
      ]}/>
    </div>
  );
};

export default App;