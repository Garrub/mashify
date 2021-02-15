import React, {useEffect, useState, useRef} from 'react';

const App = () => {
  const [paths, setPaths] = useState([]);
  const audio1 = useRef();
  const audio2 = useRef();


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
    setInterval(() => {
      console.log(audio1.current.currentTime);
    }, 1000);
  }, [paths]);

  return (
    <div>
      <audio ref={audio1} src="assets/music/oopsIDidItAgain.mp3" preload="auto" type="audio/mpeg" controls>Your browser does not support the audio tag</audio>
      <audio ref={audio2} src="assets/music/babyOneMoreTime.mp3" preload="auto" type="audio/mpeg" controls>Your browser does not support the audio tag</audio>
    </div>
  );
};

export default App;