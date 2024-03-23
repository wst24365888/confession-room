import { ConfessionRoom__factory, type ConfessionRoom } from "$lib/contracts";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from "ethers";

export class ConfessionContractManager {
    private contractAddress = "0xdFF32f49F49D7DFcDf5Ca4eE68d14953aB976F87";
    private contract: ConfessionRoom | null = null;
    private provider: ethers.BrowserProvider | ethers.JsonRpcProvider;

    constructor(provider?: ethers.BrowserProvider | ethers.JsonRpcProvider) {
        if (provider === undefined) {
            provider = new ethers.BrowserProvider(window.ethereum as MetaMaskInpageProvider)
        }
        this.provider = provider;
    }

    async connect() {
        try {
            // Request access to the user's MetaMask accounts
            const accounts = await this.provider.send("eth_requestAccounts", []);

            // If accounts are available
            if (accounts && accounts.length > 0) {
                console.log("MetaMask provider detected:", accounts);

                // Create a contract instance
                this.contract = ConfessionRoom__factory.connect(this.contractAddress, await this.provider.getSigner());
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
}