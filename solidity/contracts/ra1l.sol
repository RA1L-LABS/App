// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract RA1L is Ownable, ERC721 {
    string public uri = "https://app.ra1l.com/api/nft/id/";
    uint256 private _totalSupply = 0;
    mapping(address => bool) private _partner;
    mapping(address => bool) private _autoapprove;
    mapping(address => mapping(address => bool)) private _requests;
    mapping(address => mapping(address => bool)) private _approved;
    mapping(address => string) private _data;

    // Struct for managing approvals
    struct Approvals {
        address owner;
        address requester;
    }
    Approvals[] private _approvals;

    constructor() ERC721("RA1L", "RA1L") {}

    function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }

    // Owner adminstration flow
    function mintFor(address to, string memory userData) public onlyOwner {
        require(balanceOf(to) == 0, "RA1L: You may only mint 1 per account");
        _mint(to, _totalSupply + 1);
        _data[to] = userData;
        _totalSupply += 1;
    }

    // Owner adminstration user data flow
    function updateUserData(
        address to,
        string memory userData
    ) public onlyOwner {
        require(balanceOf(to) > 0, "RA1L: Account does not have a token");
        _data[to] = userData;
    }

    function mint(string memory userData) public {
        address to = _msgSender();
        require(balanceOf(to) == 0, "RA1L: You may only mint 1 per account");
        _mint(to, _totalSupply + 1);
        _data[to] = userData;
        _totalSupply += 1;
    }

    // View auto approve status
    function autoApproveStatus() public view returns (bool) {
        return _autoapprove[_msgSender()];
    }

    // Sets auto approval status
    function toggleApproval(bool status) public {
        _autoapprove[_msgSender()] = status;
    }

    // Sets partner status
    function setPartner(address partner, bool status) public onlyOwner {
        _partner[partner] = status;
    }

    // Checks partner status
    function isPartner() public view returns (bool) {
        return _partner[_msgSender()];
    }

    function updateURI(string memory _uri) public onlyOwner {
        uri = _uri;
    }

    function _baseURI() internal view override returns (string memory) {
        return uri;
    }

    // Function to request disclosure from multiple owners
    function requestMultiDisclosure(address[] memory _owners) public {
        address _requester = msg.sender;
        require(_partner[_requester], "RA1L: You are not a partner");

        for (uint j = 0; j < _owners.length; j++) {
            address _owner = _owners[j];

            // Check if the approval already exists
            bool approvalExists = false;
            for (uint i = 0; i < _approvals.length; i++) {
                if (
                    _approvals[i].owner == _owner &&
                    _approvals[i].requester == _requester
                ) {
                    approvalExists = true;
                    break;
                }
            }
            if (!approvalExists) {
                // Approval does not exist, add to the array
                _approvals.push(Approvals(_owner, _requester));
            }
        }
    }

    // Request disclosure
    function requestDisclosure(address _owner) public {
        address _requester = _msgSender();
        require(_partner[_requester], "RA1L: You are not a partner");

        // Check if the approval already exists
        for (uint i = 0; i < _approvals.length; i++) {
            if (
                _approvals[i].owner == _owner &&
                _approvals[i].requester == _requester
            ) {
                // Approval already exists, return without adding
                return;
            }
        }
        // Approval does not exist, add to the array
        _approvals.push(Approvals(_owner, _requester));
    }

    // Revoke disclosure
    function revokeDisclosure(address _requester) public {
        address _owner = _msgSender();
        _approved[_owner][_requester] = false;
    }
    // Approve disclosure
    function approveDisclosure(address _requester) public {
        address _owner = _msgSender();

        // Check if the approval already exists
        for (uint i = 0; i < _approvals.length; i++) {
            if (
                _approvals[i].owner == _owner &&
                _approvals[i].requester == _requester
            ) {
                // Approval exists, add to the approved list
                _approved[_owner][_requester] = true;
                // Remove the approval from the array
                _removeApproval(i);
                return;
            }
        }
    }

    // Function to remove approval at a specific index
    function _removeApproval(uint index) private {
        require(index < _approvals.length, "Index out of bounds");
        // Move the last element to the place of the element to delete
        _approvals[index] = _approvals[_approvals.length - 1];
        // Remove the last element
        _approvals.pop();
    }

    // Retrieve disclosure
    function retrieveDisclosure(
        address _owner
    ) public view returns (string memory) {
        address _requester = _msgSender();
        require(_partner[_requester], "RA1L: You are not a partner");
        if (_autoapprove[_owner]) {
            return _data[_owner];
        } else {
            if (_approved[_owner][_requester]) {
                return _data[_owner];
            }
        }

        return "";
    }

    /**
     * @dev KYC Passes are soul bound
     * note This prevents safeTransferFrom from operating
     */
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        require(false, "RA1L: Tokens are soul bound");
        from = from;
        to = to;
        tokenId = tokenId;
    }
}
