// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract BioHeritageToken is ERC20, Ownable, ERC20Permit {
    mapping(address => bool) public registeredUsers;
    mapping(uint256 => Event) public events;
    mapping(uint256 => Product) public marketplace;

    uint256 public eventCount;
    uint256 public productCount;

    struct Event {
        address organizer;
        string name;
        string location;
        string mobileNumber;
        uint256 startTime;
        uint256 endTime;
        address[] participants;
        bool ended;
        mapping(address => bool) isParticipant;
        mapping(address => bool) isPresent;
    }

    struct Product {
        address seller;
        string name;
        uint256 priceInTokens;
        bool sold;
    }

    event EventCreated(uint256 eventId, address organizer, string name, string location, string mobileNumber, uint256 startTime, uint256 endTime);
    event UserRegistered(address user);
    event UserParticipated(uint256 eventId, address user);
    event EventEnded(uint256 eventId);
    event ProductListed(uint256 productId, address seller, string name, uint256 priceInTokens);
    event ProductBought(uint256 productId, address buyer, uint256 priceInTokens);

    constructor(address initialOwner)
        ERC20("BioHeritageToken", "BHT")
        Ownable(initialOwner)
        ERC20Permit("BioHeritageToken")
    {}

    modifier onlyRegistered() {
        require(registeredUsers[msg.sender], "User not registered");
        _;
    }

    function register() external {
        require(!registeredUsers[msg.sender], "User already registered");
        registeredUsers[msg.sender] = true;
        emit UserRegistered(msg.sender);
    }

    function createEvent(string memory name, string memory location, string memory mobileNumber, uint256 startTime, uint256 endTime) external onlyRegistered {
        require(startTime < endTime, "Invalid event time");

        eventCount++;
        Event storage newEvent = events[eventCount];
        newEvent.organizer = msg.sender;
        newEvent.name = name;
        newEvent.location = location;
        newEvent.mobileNumber = mobileNumber;
        newEvent.startTime = startTime;
        newEvent.endTime = endTime;
        newEvent.ended = false;

        emit EventCreated(eventCount, msg.sender, name, location, mobileNumber, startTime, endTime);
    }

    function participateInEvent(uint256 eventId) external onlyRegistered {
        Event storage myEvent = events[eventId];
        require(block.timestamp < myEvent.endTime, "Event has already ended");
        require(!myEvent.isParticipant[msg.sender], "User already participating");

        myEvent.participants.push(msg.sender);
        myEvent.isParticipant[msg.sender] = true;

        emit UserParticipated(eventId, msg.sender);
    }
    function getEventParticipants(uint256 eventId) external view returns (address[] memory) {
        return events[eventId].participants;
    }

    function isParticipantOfEvent(uint256 eventId, address userAddress) external view returns (bool) {
        return events[eventId].isParticipant[userAddress];
    }


    function endEvent(uint256 eventId) external onlyRegistered {
        Event storage myEvent = events[eventId];
        require(msg.sender == myEvent.organizer, "Only organizer can end the event");
        require(!myEvent.ended, "Event already ended");

        myEvent.ended = true;

        for (uint256 i = 0; i < myEvent.participants.length; i++) {
                _mint(myEvent.participants[i], 10);
        }

        emit EventEnded(eventId);
    }

    function markPresent(uint256 eventId, address participant) external onlyRegistered {
        Event storage myEvent = events[eventId];
        require(msg.sender == myEvent.organizer, "Only organizer can mark attendance");
        require(myEvent.isParticipant[participant], "User is not a participant");

        myEvent.isPresent[participant] = true;
    }

    function listProduct(string memory name, uint256 priceInTokens) external onlyRegistered {
        require(priceInTokens > 0, "Invalid price");

        productCount++;
        Product storage newProduct = marketplace[productCount];
        newProduct.seller = msg.sender;
        newProduct.name = name;
        newProduct.priceInTokens = priceInTokens;
        newProduct.sold = false;

        emit ProductListed(productCount, msg.sender, name, priceInTokens);
    }

    function buyProduct(uint256 productId) external onlyRegistered {
        Product storage myProduct = marketplace[productId];
        require(!myProduct.sold, "Product already sold");
        require(balanceOf(msg.sender) >= myProduct.priceInTokens, "Insufficient tokens");

        _transfer(msg.sender, myProduct.seller, myProduct.priceInTokens);
        myProduct.sold = true;

        emit ProductBought(productId, msg.sender, myProduct.priceInTokens);
    }
}
