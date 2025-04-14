// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
contract SubAccessControl {
         address public owner;
         uint256 public Subfee;
         uint256 public SubDuration;
         event Subscribed(address indexed user,uint endTime);
         event Withdraw(address indexed owner,uint amount);
         
        modifier OnlyOwner() {
            require(msg.sender==owner,"Owner nhi to kyo kr rha");
            _;
        }
        mapping ( address => uint256 ) public SubEndtime;
        modifier ActiveOrNot(){
            require(SubEndtime[msg.sender]>=block.timestamp,"Firse kharid");
            _;
        }
        
        constructor (uint256 _fee, uint256 _duration) {
        owner=msg.sender;
        Subfee=_fee/100;
        SubDuration=_duration;
        }

        function SubscribeNow() external payable {
        require(msg.value>=Subfee,"Paisa kam ha");
        uint256 currentExpiry = SubEndtime[msg.sender];
        if(currentExpiry<block.timestamp){
            SubEndtime[msg.sender]=block.timestamp+SubDuration;
        }
        else{
            SubEndtime[msg.sender]+=SubDuration;
        }
        emit Subscribed(msg.sender,SubEndtime[msg.sender]);
        }        
        function AccessCheck(address user) public view returns (bool) {
            if (SubEndtime[user]>=block.timestamp) {
                return true; 
            }
            else{
            return false;
            }
        }
        
    event FeeAndDurationUpdated(uint256 newFee,uint256 newDuration);
    function UpdateFeeAndDuration(uint256 Newfee , uint256 Newduration) external OnlyOwner {
        Subfee=Newfee/100;
        SubDuration=Newduration;
        emit FeeAndDurationUpdated(Subfee,SubDuration);
    }
}