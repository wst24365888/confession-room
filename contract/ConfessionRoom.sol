// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/utils/Strings.sol";

contract ConfessionRoom {
    mapping(address => string) avatar;
    mapping(bytes32 => AddressConfessions) tips;
    struct AddressConfessions {
        string confessions;
        address author;
        string avatar;
        uint256 timestamp;
        uint256 tipsAmount;
        bytes32 hashAddress;
    }
    AddressConfessions[] public confessions;

    function confess(string memory confessionText) public {
        if (bytes(avatar[msg.sender]).length == 0) {
            string[5] memory colors;
            bytes32 randomHash = keccak256(
                abi.encodePacked(block.timestamp, block.difficulty)
            );

            for (uint256 i = 0; i < 5; i++) {
                bytes memory color = new bytes(6);
                for (uint256 j = 0; j < 3; j++) {
                    uint8 randomNumber = uint8(randomHash[i * 3 + j]);
                    string memory hexDigit = Strings.toHexString(
                        uint256(randomNumber),
                        2
                    );
                    color[j * 2] = bytes(hexDigit)[4];
                    color[j * 2 + 1] = bytes(hexDigit)[5];
                }
                colors[i] = string(abi.encodePacked(color));
            }

            // Construct the avatar URL
            string memory avatarURL = string(
                abi.encodePacked(
                    "source.boringavatars.com/marble/120/Maria Mitchell?colors=",
                    colors[0],
                    ",",
                    colors[1],
                    ",",
                    colors[2],
                    ",",
                    colors[3],
                    ",",
                    colors[4]
                )
            );

            avatar[msg.sender] = avatarURL;
        }

        bytes32 hashAddress = keccak256(
            abi.encode(
                confessionText,
                msg.sender,
                avatar[msg.sender],
                block.timestamp,
                0,
                address(0)
            )
        );
        AddressConfessions memory confession = AddressConfessions(
            confessionText,
            msg.sender,
            avatar[msg.sender],
            block.timestamp,
            0,
            hashAddress
        );

        confessions.push(confession);
        tips[hashAddress] = confession;
    }

    function getConfessionsLength() public view returns (uint256) {
        return confessions.length;
    }

    function getAllConfessions()
        public
        view
        returns (AddressConfessions[] memory)
    {
        return confessions;
    }

    function tipsTo(bytes32 confessionAddress, uint256 tipsAmount)
        public
    {
        tips[confessionAddress].tipsAmount += tipsAmount;
    }
}
