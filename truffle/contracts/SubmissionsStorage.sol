// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.17;

contract SubmissionsStorage{
    address owner;
    uint256 subscriptionID;

    struct SubscriptionData {
        uint256 _subscriptionID;
        string encryptedData;
        bool processed;
        uint256 amountLocked;
    }

    mapping(address => SubscriptionData) private submissionDatas;

    event NewSubmission(address _address);
    event SubmissionProcessed(address _address);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only the owner can call this func");
        _;
    }

    receive() external payable {
        submissionDatas[msg.sender].amountLocked = msg.value;
    }

    function getSubmissionDatas(address _address)
        public
        view
        onlyOwner
        returns (SubscriptionData memory)
    {
        return submissionDatas[_address];
    }

    function postNewSubmission(string memory _encryptedData, address _address)
        external
        onlyOwner
    {
        require(
            submissionDatas[_address].amountLocked == 1 ether,
            "need to lock 1 eth before"
        );
        subscriptionID++;
        submissionDatas[_address].processed = false;
        submissionDatas[_address]._subscriptionID = subscriptionID;
        submissionDatas[_address].encryptedData = _encryptedData;
        emit NewSubmission(_address);
    }

    function declineSubmission(address _address) external payable onlyOwner {
        uint256 amount = submissionDatas[_address].amountLocked;
        submissionDatas[_address].amountLocked = 0; // Probably useless
        delete submissionDatas[_address];
        (bool sent, ) = payable(_address).call{value: amount, gas: 23000}("");
        require(sent, "refund unsuccessful");
        emit SubmissionProcessed(_address);
    }

    function acceptSubmission(address _address) external payable onlyOwner {
        uint256 amount = submissionDatas[_address].amountLocked;
        submissionDatas[_address].amountLocked = 0; // Probably useless
        submissionDatas[_address].processed = true;
        (bool sent, ) = payable(_address).call{value: amount, gas: 23000}("");
        require(sent, "refund unsuccessful");
        emit SubmissionProcessed(_address);
    }
}