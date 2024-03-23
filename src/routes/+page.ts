import { ConfessionContractManager } from "$lib/utils/confession-contract-manager";
import { ethers } from "ethers";

export const load = async () => {
    const contractManager = new ConfessionContractManager(
        new ethers.JsonRpcProvider("https://rpc.sepolia.linea.build")
    );

    await contractManager.connect();
    const confessions = await contractManager.getConfessions();

    return {
        confessions
    };
}