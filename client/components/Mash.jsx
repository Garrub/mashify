import React from 'react';
import styled from 'styled-components';
import SongBar from './SongBar.jsx';

const Mash = ({ songs, seek }) => {
  var paths1 = !songs[0].paths ? [] : Object.keys(songs[0].paths).map(startTime => [startTime, songs[0].paths[startTime]]);
  var paths2 = !songs[1].paths ? [] : Object.keys(songs[1].paths).map(startTime => [startTime, songs[1].paths[startTime]]);
  return (
    <MashContainer>
      {songs.map((song, i) => <SongBar key={`sb${i}`} id={`sb${i}`} seek={seek} currentTime={song.currentTime} duration={song.duration} order={i * 2} />)}
      <MashLines xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 300">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>
        {paths1.map((path, i) => <line key={i} x1={`${path[0] / songs[0].duration * 100}%`} y1="0" x2={`${path[1] / songs[1].duration * 100}%`} y2="300" stroke="#000" strokeWidth="1" markerEnd="url(#arrowhead)"/>)}
        {paths2.map((path, i) => <line key={i} x1={`${path[0] / songs[1].duration * 100}%`} y1="300" x2={`${path[1] / songs[0].duration * 100}%`} y2="0" stroke="#000" strokeWidth="1" markerEnd="url(#arrowhead)"/>)}
      </MashLines>
    </MashContainer>
  );
};

const MashContainer = styled.div`
  height: 400px;
  width: 700px;
  display: flex;
  flex-direction: column;
`;

const MashLines = styled.svg`
  order: 1;
  width: 100%;
  height: 300px;
`;

export default Mash;