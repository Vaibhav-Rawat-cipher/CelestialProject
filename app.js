const CONTRACT_ADDRESS = "";
const CONTRACT_ABI = [
    
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

