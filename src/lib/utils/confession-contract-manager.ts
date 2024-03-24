import Web3 from "web3";
import { Contract } from "web3-eth-contract";

const confessionRoomABI = [
    {
        inputs: [
            {
                internalType: "string",
                name: "confessionText",
                type: "string",
            },
        ],
        name: "confess",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "length",
                type: "uint256",
            },
        ],
        name: "StringsInsufficientHexLength",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "confessions",
        outputs: [
            {
                internalType: "string",
                name: "confessions",
                type: "string",
            },
            {
                internalType: "address",
                name: "user",
                type: "address",
            },
            {
                internalType: "string",
                name: "avatar",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getAllConfessions",
        outputs: [
            {
                components: [
                    {
                        internalType: "string",
                        name: "confessions",
                        type: "string",
                    },
                    {
                        internalType: "address",
                        name: "user",
                        type: "address",
                    },
                    {
                        internalType: "string",
                        name: "avatar",
                        type: "string",
                    },
                    {
                        internalType: "uint256",
                        name: "timestamp",
                        type: "uint256",
                    },
                ],
                internalType: "struct ConfessionRoom.AddressConfessions[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getConfessionsLength",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];

export class ConfessionContractManager {
    private provider: Web3;
    private confessionRoomAddress = "0x007fa63dEFf06b39f369C5deF4Ad564e39df20e2";
    private confessionRoomContract: Contract<typeof confessionRoomABI> | null = null;
    private userAccount: string | null = null;

    constructor(provider: Web3) {
        this.provider = provider;
    }

    async connect() {
        try {
            // Request access to the user's MetaMask accounts
            const accounts = await this.provider.eth.requestAccounts();

            // If accounts are available
            if (accounts && accounts.length > 0) {
                console.log("MetaMask provider detected:", accounts);
                this.userAccount = accounts[0];

                // Create a confessionRoomContract instance
                this.confessionRoomContract = new this.provider.eth.Contract(
                    confessionRoomABI,
                    this.confessionRoomAddress
                );
                console.log("Contract instance created");
            } else {
                console.log("MetaMask provider detected, but no accounts available");
            }
        } catch (error) {
            console.error("Error detecting MetaMask provider:", error);
        }
    }

    async getAllConfessions() {
        if (this.confessionRoomContract) {
            const confessions = await this.confessionRoomContract.methods
                .getAllConfessions()
                .call();
            return confessions;
        } else {
            console.error("Contract not connected");
        }
    }

    async createConfession(confession: string) {
        if (this.confessionRoomContract) {
            const tx = await this.confessionRoomContract.methods
                .confess(confession)
                .send({ from: this.userAccount ?? "" });
            console.log("Transaction:", tx);
            return tx;
        } else {
            console.error("Contract not connected");
        }
    }

    async tipTo(receiver: string, amount: number) {
        console.log(`Attempting to send transaction from ${this.userAccount} to ${receiver}`);

        const receipt = await this.provider.eth.sendTransaction({
            // @ts-expect-error: The `from` property is a string
            from: this.userAccount,
            to: receiver,
            value: this.provider.utils.toWei(amount.toString(), "ether"),
        });

        console.log(`Transaction successful with hash: ${receipt.transactionHash}`);
    }
}
