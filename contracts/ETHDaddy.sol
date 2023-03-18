// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ETHDaddy is ERC721 {
    uint256 public maxSupply; //get initialized with 0
    address public owner;

    struct Domain {
        string name;
        uint256 cost;
        bool isOwned;
    }

    mapping (uint256 => Domain) domains;

    constructor(
        string memory _name, 
        string memory _symbol
    )ERC721(_name, _symbol)
    {
        owner = msg.sender;
    }

    modifier onlyOwner {
       require(msg.sender == owner);
       _;
    }

// 1. List Domains
    function list(string memory _name, uint256 _cost) public onlyOwner {
        maxSupply++;
        domains[maxSupply] = Domain(_name, _cost, false);
    }

    function mint(uint256 _id) public payable {
        require(_id != 0);
        require(_id <= maxSupply);
        require(msg.value >= domains[_id].cost);

        domains[_id].isOwned = true;
        _safeMint(msg.sender, _id);
    }

    function getDomains(uint256 _id) public view returns(Domain memory){
        return domains[_id];
    }

    function getBalance() public view returns(uint256){
        return address(this).balance;
    }

    function withdraw() public payable {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
