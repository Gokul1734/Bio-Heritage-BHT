import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import { abi } from '../abi';
import { useNavigate } from 'react-router-dom';
import Menu from '../COMPONENTS/Menu';
import gif from '../ASSETS/loader.gif';

const OrganizeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const FormContainer = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    margin-bottom: 20px;
    color: #E4EBE9;
  }

  form {
    width: 100%;
    display: flex;
    flex-direction: column;

    input,
    select {
      margin-bottom: 15px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      width: 100%;
      box-sizing: border-box;
    }

    div {
      display: flex;
      flex-direction: column;
      margin-bottom: 15px;
      width: 100%;

      label {
        margin-bottom: 5px;
        color: #333;
      }
    }

    button {
      background-color: #E4EBE9;
      color: #fff;
      border: none;
      border-radius: 5px;
      padding: 10px 20px;
      cursor: pointer;
      transition: all 0.3s ease-in-out;

      &:hover {
        background-color: #1b5e20;
      }
    }
  }
`;

const Loader = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const MenuContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
`;

const Organize = ({ contract, user, setUser }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();

  // Convert datetime-local input to Unix timestamp
  const convertToTimestamp = (datetime) => {
    return Math.floor(new Date(datetime).getTime() / 1000);
  };

  useEffect(() => {
    if (!localStorage.getItem('BioHeritageHub')) {
      navigate('/');
    } else {
      setUser(JSON.parse(localStorage.getItem('BioHeritageHub')).address);
    }
  }, []);

  const handleSubmitForm = async (e) => {
    setLoader(true);
    e.preventDefault();
    try {
      const web3 = new Web3(window.ethereum);
      const Instance = new web3.eth.Contract(abi, contract);
      await Instance.methods
        .createEvent(
          name,
          location,
          mobileNumber,
          convertToTimestamp(startTime),
          convertToTimestamp(endTime)
        )
        .send({ from: user });
      alert('Event created successfully!');
      setLoader(false);
      navigate('/dashboard');
    } catch (err) {
      setLoader(false);
      alert('Failed to create event');
    }
  };

  return (
    <OrganizeContainer>
      <FormContainer>
        <h1>Create Event</h1>
        <form onSubmit={handleSubmitForm}>
          <input
            type="text"
            placeholder="Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <div>
            <label>Start Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label>End Time</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
          <button type="submit">Create Event</button>
        </form>
      </FormContainer>
      <MenuContainer>
        <Menu contract={contract} user={user} />
      </MenuContainer>
      {loader && <Loader src={gif} alt="Loader" />}
    </OrganizeContainer>
  );
};

export default Organize;
