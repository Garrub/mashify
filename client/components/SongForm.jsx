import React, {useState} from 'react';
import styled from 'styled-components';

const SongForm = (props) => {
  const [track1, setTrack1] = useState('');
  const [track2, setTrack2] = useState('');
  const [timbre, setTimbre] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    props.fetchSongs(track1, track2, timbre);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FieldLabel>
        Track 1:
        <Menu value={track1} onChange={e => setTrack1(e.target.value)}>
          <option value="">--SELECT AN OPTION--</option>
          <option value="oopsIDidItAgain">Oops! ...I Did It Again - Britney Spears</option>
          <option value="babyOneMoreTime">...Baby One More Time - Britney Spears</option>
          <option value="gangnamStyle">Gangnam Style - PSY</option>
          <option value="allStar">All Star - Smash Mouth</option>
        </Menu>
      </FieldLabel>
      <FieldLabel>
        Track 2:
        <Menu value={track2} onChange={e => setTrack2(e.target.value)}>
          <option value="">--SELF MASH--</option>
          <option value="oopsIDidItAgain">Oops! ...I Did It Again - Britney Spears</option>
          <option value="babyOneMoreTime">...Baby One More Time - Britney Spears</option>
          <option value="gangnamStyle">Gangnam Style - PSY</option>
          <option value="allStar">All Star - Smash Mouth</option>
        </Menu>
      </FieldLabel>
      <FieldLabel>
        Timbre Threshold:
        <UserInput type="number" value={timbre} onChange={e => setTimbre(e.target.value)} ></UserInput>
      </FieldLabel>
      <FormSubmit type="submit" value="Mash!" disabled={track1 === ''}/>
    </FormContainer>
  );
};

const FormContainer = styled.form`
  margin-bottom: 20px;
  display: flex;
  gap: 4px;
`;
const Menu = styled.select``;
const UserInput = styled.input``;
const FieldLabel = styled.label``;
const FormSubmit = styled.input``;

export default SongForm;