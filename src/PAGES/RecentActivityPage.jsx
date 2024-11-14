import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import { abi } from '../abi';
import Menu from '../COMPONENTS/Menu';
import gif from '../ASSETS/loader.gif';

const RecentActivityPage = ({ contract, user }) => {
  const [userEvents, setUserEvents] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    fetchUserEvents();
  }, []);

  const fetchUserEvents = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const instance = new web3.eth.Contract(abi, contract);

      // Fetch ProductListed events where the user is the seller
      const soldEvents = await instance.getPastEvents('ProductListed', {
        filter: { seller: user },
        fromBlock: 0,
        toBlock: 'latest'
      });

      // Fetch ProductBought events where the user is the buyer
      const boughtEvents = await instance.getPastEvents('ProductBought', {
        filter: { buyer: user },
        fromBlock: 0,
        toBlock: 'latest'
      });

      // Combine both sets of events
      const allEvents = [...soldEvents, ...boughtEvents];

      // Convert BigInt properties to strings
      const formattedEvents = allEvents.map(event => {
        return {
          type: event.event, // Event type: ProductListed or ProductBought
          productId: event.returnValues.productId,
          seller: event.event === 'ProductListed' ? user : event.returnValues.seller,
          buyer: event.event === 'ProductBought' ? user : event.returnValues.buyer,
          name: event.returnValues.name,
          priceInTokens: event.returnValues.priceInTokens.toString()
        };
      });

      setUserEvents(formattedEvents);
      setLoader(false);
    } catch (error) {
      console.error('Error fetching user events:', error);
      setLoader(false);
    }
  };

  return (
    <RecentActivityContainer>
      <h2>Recent Activity</h2>
      <MenuContainer>
        <Menu contract={contract} user={user} />
      </MenuContainer>
      <EventList>
        {loader ? (
          <Loader src={gif} alt="Loader" />
        ) : (
          userEvents.map((event, index) => (
            <EventRow key={index}>
              <p>Event Type: {event.type}</p>
              <p>Product ID: {Number(event.productId)}</p>
              <p>{event.type === 'ProductListed' ? 'Seller' : 'Buyer'}: {event.type === 'ProductListed' ? event.seller : event.buyer}</p>
              <p>Name: {event.name}</p>
              <p>Price in Tokens: {event.priceInTokens}</p>
            </EventRow>
          ))
        )}
      </EventList>
    </RecentActivityContainer>
  );
};

const RecentActivityContainer = styled.div`
  padding: 20px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const EventRow = styled.div`
  border: 1px solid #E4EBE9;
  padding: 20px;
  border-radius: 5px;
  margin: 10px 0;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  p {
    margin-bottom: 5px;
  }
`;

const MenuContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
`;

const Loader = styled.img`
  width: 50px;
  height: 50px;
`;

export default RecentActivityPage;
