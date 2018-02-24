const SHA256 = require('crypto-js/sha256');

class Transactions {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

/**
  // Block class
  // Creating an empty Block constructor with following variables:
  // index        -> where the blockchain sits on the chain
  // timestamp    -> when it was created
  // transactions         -> any type of transactions (e.g. details of transaction)
  // previousHash -> string containing previous Hash of the block before (ensures integrity of Blockchain)
  // nonce        -> Random number
**/
class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    // Calculate the hash function of the block.
    // i.e take the value of the block, pass it through the hash function, return Hash,
    // this will identify our block on blockchain,
    // using SHA256 for this, javascript does not support it by default will require 'crypto-js' library for this.
    calculateHash() {
        return SHA256(this.index + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block("01/01/2018", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTrasactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Congratulations on successfully mining a Block!");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transactions(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransactions(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for(const block of this.chain) {
            for(const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let vipCoin = new Blockchain();
vipCoin.createTransactions(new Transactions('address1', 'address2', 100));
vipCoin.createTransactions(new Transactions('address2', 'address1', 50));

console.log('\n Starting the miner....');
vipCoin.minePendingTrasactions('batman-address');

console.log('\nBalance of Batman is', vipCoin.getBalanceOfAddress('batman-address'));

console.log('\n Starting the miner again....');
vipCoin.minePendingTrasactions('batman-address');

console.log('\nBalance of Batman is', vipCoin.getBalanceOfAddress('batman-address'));
