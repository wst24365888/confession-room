/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type { ConfessionRoom, ConfessionRoomInterface } from "../ConfessionRoom";

const _abi = [
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
                internalType: "struct ShowGirl.AddressConfessions[]",
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
] as const;

export class ConfessionRoom__factory {
    static readonly abi = _abi;
    static createInterface(): ConfessionRoomInterface {
        return new Interface(_abi) as ConfessionRoomInterface;
    }
    static connect(address: string, runner?: ContractRunner | null): ConfessionRoom {
        return new Contract(address, _abi, runner) as unknown as ConfessionRoom;
    }
}
