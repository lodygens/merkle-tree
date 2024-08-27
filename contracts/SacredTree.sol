// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

contract SacredTree {

    bytes32 public root; // PART 1: STORE ROOT HERE
    bytes32[] public hashes;

    constructor(string[] memory leaves) {
        require(leaves.length > 0, "leaves array is empty");

        console.log("SacredTree constructor");

        for (uint256 i = 0; i < leaves.length; i++) {
            hashes.push(keccak256(abi.encodePacked(leaves[i])));
        }

        uint256 n = leaves.length;
        uint256 offset = 0;

        while (n > 0) {
            console.log("SacredTree n = %i; offset = %i; len(hashes) = %i", n, offset, hashes.length);
            for (uint256 i = 0; i < n - 1; i += 2) {
                console.log("SacredTree h2 (%i, %i)",(offset + i),(offset + i + 1));

                bytes32 h2 = 
                    keccak256(
                        abi.encodePacked(
                            hashes[offset + i], hashes[offset + i + 1]
                        )
                    );

                //string memory hexString = string(abi.encodePacked("0x", h2));
        	    string memory h2string = Strings.toHexString(uint256(h2), 32);                
                console.log("SacredTree h2 ",
                            Strings.toHexString(uint256(hashes[offset + i]), 32), 
                            Strings.toHexString(uint256(hashes[offset + i + 1]), 32),
                            h2string);

                hashes.push(h2);
            }
            offset += n;
            n = n / 2;
        }

        root = hashes[hashes.length - 1];
        string memory rootString = Strings.toHexString(uint256(root), 32);
        console.log("SacredTree root ", rootString);

    }

    function computehash(string memory _str) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_str));
    }

    /// Verify that an address is trusted by the tree.
    /// @param trustee Address to verify
    /// @param proof Merkle proof for verification
    function verify(
        address trustee, 
        bytes32[] calldata proof) 
    external view returns (bool) {
        // PART 2: CODE HERE
    }

}
