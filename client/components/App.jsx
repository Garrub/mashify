import React, { useEffect, useState, useRef } from 'react';

const App = () => {
  const [paths, setPaths] = useState([]);
  const audio1 = useRef();
  const audio2 = useRef();
  const [ready1, setReady1] = useState(false);
  const [ready2, setReady2] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [prevTime, setPrevTime] = useState([0, 0]);



  useEffect(() => {
    fetch('/api')
      .then(response => response.json())
      .then(paths => {
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
    </div>
  );
};

export default App;