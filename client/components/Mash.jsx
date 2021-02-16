import React from 'react';
import styled from 'styled-components';
import SongBar from './SongBar.jsx';

const Mash = (props) => {
  return (
    <MashContainer>
      <SongBar currentTime={props.currentTime} duration={props.duration}/>
    </MashContainer>
  );
};

const MashContainer = styled.div`
  height: 100px;
  width: 400px;
`;

export default Mash;