import React from 'react';
import styled from 'styled-components';

const SongBar = ({currentTime, duration, order}) => {
  var played = `${currentTime / duration * 100}%`;
  return (
    <SongBarContainer played={played} order={order}/>
  );
};

const SongBarContainer = styled.div.attrs(props => ({
  style: {
    background: `linear-gradient(to right, #0f0 ${props.played}, #00f ${props.played} 100%)`,
    order: props.order
  }
}))`
  height: 50px;
  width: 100%;
`;

export default SongBar;