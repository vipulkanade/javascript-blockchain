const SHA256 = require('crypto-js/sha256');

/**
  // Block class
  // Creating an empty Block constructor with following variables:
  // index        -> where the blockchain sits on the chain
  // timestamp    -> when it was created
  // data         -> any type of data (e.g. details of transaction)
  // previousHash -> string containing previous Hash of the block before (ensures integrity of Blockchain)
  // nonce        -> Random number
**/
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    // Calculate the hash function of the block.
    // i.e take the value of the block, pass it through the hash function, return Hash,
    // this will identify our block on blockchain,
    // using SHA256 for this, javascript does not support it by default will require 'crypto-js' library for this.
    calculateHash() {
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
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
        this.difficulty = 4;
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2018", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
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

console.log("Mining Block 1....");
vipCoin.addBlock(new Block(1, "02/20/2018", {amount: 4}));

console.log("Mining Block 2....");
vipCoin.addBlock(new Block(2, "02/22/2018", {amount: 10}));

// console.log('Is blockchain valid? ' + vipCoin.isChainValid());
//
// vipCoin.chain[1].data = { amount : 100 };
// vipCoin.chain[1].hash = vipCoin.chain[1].calculateHash();
//
// console.log('Is blockchain valid? ' + vipCoin.isChainValid());
//console.log(JSON.stringify(vipCoin, null, 4));
