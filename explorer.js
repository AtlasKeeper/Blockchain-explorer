const { Web3 } = require('web3');
const readline = require('readline');

const web3 = new Web3('https://mainnet.infura.io/v3/07cc9dedb1e7450c8a246fe93b7de9dd');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const GAS_UPDATE_INTERVAL = 60000; // Update gas price every 60 seconds

// Display a typing animation with loading messages when the program starts
displayTypingAnimation();

// Function to repeatedly fetch and display gas price
async function displayGasPrice() {
    while (true) {
        await getGasPrice();
        await sleep(GAS_UPDATE_INTERVAL);
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
    // Start displaying gas price in the background
    displayGasPrice();

    // Allow the user to interact with the program until they choose to exit
    while (true) {
        await performAction();
        const continuePrompt = await askQuestion('Do you want to perform another action? (yes/no): ');
        if (continuePrompt.toLowerCase() !== 'yes') {
            break;
        }
    }

    rl.close();
}

function displayTypingAnimation() {
    const loadingMessages = [
        'Booting up the blockchain...',
        'Connecting to Ethereum network...',
        'Syncing with the blockchain...',
        'Initializing the explorer...',
        'Fetching the latest data...',
    ];

    async function typeMessage(message) {
        for (let i = 0; i < message.length; i++) {
            process.stdout.write(message[i]);
            await sleep(25); // Adjust typing speed as needed
        }
        process.stdout.write('\n');
    }

    async function displayLoading() {
        for (const message of loadingMessages) {
            await typeMessage(`Blockchain Explorer: ${message}`);
            await sleep(500); // Pause between messages (adjust as needed)
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
        }
        // Call the main function to start the program after the loading messages
        main();
    }

    displayLoading();
}

async function getGasPrice() {
    try {
        const gasPrice = await web3.eth.getGasPrice();
        console.log(`Current Ethereum Gas Price: ${web3.utils.fromWei(gasPrice, 'gwei')} Gwei`);
    } catch (error) {
        console.error('Error fetching gas price:', error.message);
    }
}

async function performAction() {
    console.log('Choose an action:');
    console.log('1. Check Transaction');
    console.log('2. Check Balance');
    console.log('3. Get Latest Block Number');
    console.log('4. Go Back');

    const choice = await askQuestion('Enter the number of your choice: ');

    if (choice === '1') {
        await checkTransaction();
    } else if (choice === '2') {
        await checkBalance();
    } else if (choice === '3') {
        await getLatestBlockNumber();
    } else if (choice === '4') {
        return; // Go back to the main menu
    } else {
        console.log('Invalid choice.');
    }
}

async function checkTransaction() {
    const txHash = await askQuestion('Enter Transaction ID: ');
    const tx = await web3.eth.getTransaction(txHash);
    if (!tx) {
        console.log('Transaction not found.');
    } else {
        console.log('Transaction Information:');
        console.log(`Block Hash: ${tx.blockHash}`);
        console.log(`Block Number: ${tx.blockNumber}`);
        console.log(`From: ${tx.from}`);
        console.log(`To: ${tx.to}`);
        console.log(`Value: ${web3.utils.fromWei(tx.value.toString(), 'ether')} ETH`);
    }
}

async function checkBalance() {
    const address = await askQuestion('Enter Ethereum Address: ');
    const balance = await web3.eth.getBalance(address);
    console.log(`Balance of ${address}: ${web3.utils.fromWei(balance, 'ether')} ETH`);
}

async function getLatestBlockNumber() {
    const latestBlockNumber = await web3.eth.getBlockNumber();
    console.log(`Latest Block Number: ${latestBlockNumber}`);
}

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

// The main function call is moved inside the displayTypingAnimation function
