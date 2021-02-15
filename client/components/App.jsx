import React, {useEffect, useState} from 'react';
import * as Tone from 'tone'

const App = () => {
  const [events, setEvents] = useState([]);
  /*const AMinorScale = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const addOctaveNumbers = (scale, octaveNumber) => scale.map(note => {
    const firstOctaveNoteIndex = scale.indexOf('C') !== -1 ? scale.indexOf('C') : scale.indexOf('C#')
    const noteOctaveNumber = scale.indexOf(note) < firstOctaveNoteIndex ? octaveNumber - 1 : octaveNumber;
    return `${note}${noteOctaveNumber}`
  });
  const AMinorScaleWithOctave = addOctaveNumbers(AMinorScale, 4);
  */
  const synth = new Tone.Synth().toMaster()
  /*
  AMinorScaleWithOctave.forEach((note, index) => {
    synth.triggerAttackRelease(note, '4n', index + 1)
  });
  */
  useEffect(() => {
    fetch('/api')
      .then(response => response.json())
      .then(events => {
        console.log(events);
        setEvents(events);
        console.log('events loaded');
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (events.length === 0) {
      return;
    }
    var part = new Tone.Part((time, value) => {
      synth.triggerAttackRelease(value.note, value.duration, time)
    }, events).start(0);
  }, [events]);

  return <div>
    <button id="enable-tone" onClick={
      () => {
        Tone.start();
      }
    }>
      Enable Tone
    </button>
    <button id="play-button" onClick={
    () => {
      if (Tone.Transport.state !== 'started'){
        Tone.Transport.start();
        console.log('start');
      } else {
        Tone.Transport.stop();
        console.log('stop');
      }
    }
  }>Play/Pause</button>
  </div>;
};

export default App;