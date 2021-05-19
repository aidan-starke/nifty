// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {
    string[] public nfts;

    mapping(string => bool) _nftExists;

    constructor() ERC721("NFT", "NF") {}

    function totalSupply() public view returns (uint256) {
        return uint256(nfts.length);
    }

    function mint(string memory _nft) public {
        require(!_nftExists[_nft]);

        nfts.push(_nft);
        uint256 _id = totalSupply();
        _mint(msg.sender, _id);
        _nftExists[_nft] = true;
    }
}
