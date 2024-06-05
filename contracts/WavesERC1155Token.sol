// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
    🤖 Feed free to write your code the way you want to. We only expect
    that you satisfy the following requirements:

        - Should be Ownable
        - Should be ERC1155
*/

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import '@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract WavesERC1155Token is ERC1155, ERC1155Burnable, Ownable {
    // Token ID to its URI mapping
    mapping(uint256 => string) private _tokenURIs;
    uint256 private _tokenCount;

    event MembershipCreated(
        address indexed creatorAddress,
        uint256 indexed membershipID,
        uint256 amount
    );

    constructor(
        string memory _uri,
        address account
    ) ERC1155(_uri) Ownable(account) {}

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    /**
     * Function to set the URI for a specific token ID.
     * Can only be called by the contract owner.
     */
    function setTokenURI(
        uint256 tokenId,
        string memory newURI
    ) public onlyOwner {
        _tokenURIs[tokenId] = newURI;
        emit URI(newURI, tokenId); // Emit URI event to notify clients of the change
    }

    /**
     * Override the uri function to return the token-specific URI if it exists.
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        string memory tokenSpecificURI = _tokenURIs[tokenId];
        if (bytes(tokenSpecificURI).length > 0) {
            return tokenSpecificURI;
        } else {
            return super.uri(tokenId);
        }
    }

    /**
     * Function to create new membership and mint to creator.
     * Can only be called by the contract owner.
     */
    function createNewMembership(
        uint256 amount,
        address creatorAddress
    ) public onlyOwner {
        require(
            amount <= 20,
            'Membership amount should not be greater than 20'
        );

        _mint(creatorAddress, _tokenCount, amount, '');
        emit MembershipCreated(creatorAddress, _tokenCount, amount);
        _tokenCount = _tokenCount + 1;
    }
}
