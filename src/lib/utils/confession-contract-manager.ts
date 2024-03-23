import { ConfessionRoom__factory, type ConfessionRoom } from "$lib/contracts";
import { ethers } from "ethers";

export class ConfessionContractManager {
    private contractAddress = "0xAf7D5Ed0B97fA0C549c8470be442aF4f2929E376";
    private contract: ConfessionRoom | null = null;
    private provider: ethers.Eip1193Provider;

    constructor(provider: ethers.Eip1193Provider) {
        this.provider = provider;
    }

    async connect() {
        try {
            // Request access to the user's MetaMask accounts
            const accounts = await this.provider.request({ method: "eth_requestAccounts" });

            // If accounts are available
            if (accounts && accounts.length > 0) {
                console.log("MetaMask provider detected:", accounts);

                // Create a contract instance
                this.contract = ConfessionRoom__factory.connect(this.contractAddress);
                console.log("Contract instance created");
            } else {
                console.log("MetaMask provider detected, but no accounts available");
            }
        } catch (error) {
            console.error("Error detecting MetaMask provider:", error);
        }
    }

    async getConfessions() {
        if (this.contract) {
            const confessions = await this.contract.getAllConfessions();
            console.log("Confessions:", confessions);
            return confessions;
        } else {
            console.error("Contract not connected");
        }
    }

    async createConfession(confession: string) {
        if (this.contract) {
            const tx = await this.contract.confess(confession);
            console.log("Transaction:", tx);
            return tx;
        } else {
            console.error("Contract not connected");
        }
    }
}
