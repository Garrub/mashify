import React from 'react';
import styled from 'styled-components';
import SongBar from './SongBar.jsx';

const Mash = ({songs}) => {
  return (
    <MashContainer>
      {songs.map((song, i) => <SongBar key={`sb${i}`} currentTime={song.currentTime} duration={song.duration}/>)}
    </MashContainer>
  );
};

const MashContainer = styled.div`
  height: 100px;
  width: 400px;
`;

export default Mash;