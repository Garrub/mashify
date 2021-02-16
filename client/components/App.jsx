import React, {useEffect, useState, useRef} from 'react';

const App = () => {
  const [paths, setPaths] = useState([]);
  const audio1 = useRef();
  const audio2 = useRef();
  const [ready1, setReady1] = useState(false);
  const [ready2, setReady2] = useState(false);
  var prevTime1 = 0;
  var prevTime2 = 0;



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

  const handleTimeUpdate = (source) => {

  }



  return (
    <div>
      <audio ref={audio1} src="assets/music/oopsIDidItAgain.mp3" preload="auto" type="audio/mpeg" controls onCanPlayThrough={() => setReady1(true)} onTimeUpdate={() => {
        console.log(potato);
        potato = audio1.current.currentTime;
      }}>
        Your browser does not support the audio tag
      </audio>
      <audio ref={audio2} src="assets/music/babyOneMoreTime.mp3" preload="auto" type="audio/mpeg" controls onCanPlayThrough={() => setReady2(true)}>Your browser does not support the audio tag</audio>
      <button disabled={!ready1 || !ready2 || (paths.length === 0)} onClick={() => audio1.current.play()}>Play!</button>
    </div>
  );
};

export default App;