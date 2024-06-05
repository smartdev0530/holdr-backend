// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
    🤖 Feed free to write your code the way you want to. We only expect
    that you satisfy the following requirements:

        - Should be Ownable
        - Should be ERC1155
*/

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WavesERC1155Token is ERC1155, Ownable {
    constructor(string memory uri, address account) ERC1155(uri) Ownable(account) {}

    function mint(address account, uint256 id, uint256 amount, bytes memory data) public onlyOwner {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }
}