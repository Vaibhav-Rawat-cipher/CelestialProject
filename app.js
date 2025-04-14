const CONTRACT_ADDRESS = "0xe4d0ce3b3c5f52942690cf9fa6599ff292e2498c";
const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_fee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_duration",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newFee",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newDuration",
				"type": "uint256"
			}
		],
		"name": "FeeAndDurationUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "endTime",
				"type": "uint256"
			}
		],
		"name": "Subscribed",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "SubscribeNow",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "Newfee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "Newduration",
				"type": "uint256"
			}
		],
		"name": "UpdateFeeAndDuration",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdraw",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "AccessCheck",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "SubDuration",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "SubEndtime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "Subfee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let provider;
let signer;
let contract;

window.addEventListener("DOMContentLoaded", async () => {
    if (typeof window.ethereum !== "undefined") {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    } else {
        alert("Please install MetaMask");
    }

    document.getElementById("SUB1").addEventListener("click", subscribe);
    document.getElementById("ACCESS_SUB1").addEventListener("click", checkAccess);
    document.getElementById("ACCESS_FAD").addEventListener("click", updateFeeAndDuration);
    document.getElementById("C_F1").addEventListener("click", getFee);
    document.getElementById("C_D1").addEventListener("click", getDuration);
    document.getElementById("C_E1").addEventListener("click", getExpiry);
});

async function subscribe() {
    try {
        const fee = await contract.Subfee();
        const tx = await contract.SubscribeNow({ value: fee });
        await tx.wait();
        alert("Subscribed successfully!");
    } catch (err) {
        console.error(err);
        alert("Subscription failed");
    }
}

async function checkAccess() {
    const inputs = document.querySelectorAll("#Access-CHECKER input");
    const address = inputs[0].value.trim();
    if (!ethers.utils.isAddress(address)) {
        alert("Invalid address");
        return;
    }
    try {
        const hasAccess = await contract.AccessCheck(address);
        alert(hasAccess ? "✅ Access granted" : "❌ No access");
    } catch (err) {
        console.error(err);
    }
}

async function updateFeeAndDuration() {
    const inputs = document.querySelectorAll("#FAD input");
    const newFee = inputs[0].value.trim();
    const newDuration = inputs[1].value.trim();

    try {
        const tx = await contract.UpdateFeeAndDuration(newFee, newDuration);
        await tx.wait();
        alert("Fee and duration updated!");
    } catch (err) {
        console.error(err);
        alert("Update failed (are you the owner?)");
    }
}

async function getFee() {
    try {
        const fee = await contract.Subfee();
        alert(`Current fee: ${fee.toString()} wei`);
    } catch (err) {
        console.error(err);
    }
}

async function getDuration() {
    try {
        const duration = await contract.SubDuration();
        alert(`Current duration: ${duration.toString()} seconds`);
    } catch (err) {
        console.error(err);
    }
}

async function getExpiry() {
    const inputs = document.querySelectorAll("#Check_Expiry input");
    const address = inputs[0].value.trim();

    if (!ethers.utils.isAddress(address)) {
        alert("Invalid address");
        return;
    }

    try {
        const expiry = await contract.SubEndtime(address);
        const readable = new Date(expiry.toNumber() * 1000).toLocaleString();
        alert(`Subscription expires on: ${readable}`);
    } catch (err) {
        console.error(err);
    }
}

