import React from 'react';
import styled from 'styled-components';

const SongBar = ({currentTime, duration}) => {
  var played = `${currentTime / duration * 100}%`;
  return (
    <SongBarContainer played={played}/>
  );
};

const SongBarContainer = styled.div.attrs(props => ({
  style: {
    background: `linear-gradient(to right, #0f0 ${props.played}, #00f ${props.played} 100%)`
  }
}))`
  height: 30px;
  width: 100%;
`;

export default SongBar;