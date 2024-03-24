<script lang="ts">
    import type { Confession } from "$lib/types/confession";
    import { ConfessionContractManager } from "$lib/utils/confession-contract-manager";
    import { onMount } from "svelte";
    import Web3 from "web3";

    let confession = "";
    let tipReceiver = "";
    let tipAmount = 0;
    let confessions: Confession[] = [];
    let contractManager: ConfessionContractManager;
    let onToggleTipModal = false;

    onMount(async () => {
        if (!window.ethereum) {
            return;
        }

        contractManager = new ConfessionContractManager(new Web3(window.ethereum));
        await contractManager.connect();

        fetchConfessions();
    });

    const handleSubmitConfession = () => {
        if (confession.trim().length > 0) {
            contractManager.createConfession(confession);
            confession = "";
        }
    };

    const fetchConfessions = async () => {
        confessions = (await contractManager.getAllConfessions()) as Confession[];
        for (let i = 0; i < confessions.length; i++) {
            confessions[i].avatar = `https://${confessions[i].avatar}`;
            confessions[i].timestamp = Number.parseInt(
                (BigInt(confessions[i].timestamp) * BigInt(1000)).toString()
            );
        }
        confessions = confessions.sort((a, b) => b.timestamp - a.timestamp);

        setTimeout(fetchConfessions, 1000);
    };

    const handleSubmitTipTo = () => {
        onToggleTipModal = false;
        if (tipReceiver.trim().length > 0 && tipAmount > 0) {
            contractManager.tipTo(tipReceiver, tipAmount);
            tipReceiver = "";
            tipAmount = 0;
        }
    };
</script>

<section class="bg-white py-8 antialiased lg:py-16 dark:bg-gray-900">
    <div class="mx-auto max-w-2xl px-4">
        <div class="mb-6 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 lg:text-2xl dark:text-white">
                Confessions ({confessions?.length ?? 0})
            </h2>
        </div>
        <form on:submit|preventDefault={handleSubmitConfession} class="mb-6">
            <div
                class="mb-4 rounded-lg rounded-t-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            >
                <label for="confession" class="sr-only">Your confession</label>
                <textarea
                    id="confession"
                    rows="6"
                    class="w-full border-0 px-0 text-sm text-gray-900 focus:outline-none focus:ring-0 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                    placeholder="Write your confession..."
                    required
                    bind:value={confession}
                />
            </div>
            <div class="flex w-full justify-end">
                <button
                    type="submit"
                    class="bg-primary-700 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800 inline-flex items-center rounded-lg px-4 py-2.5 text-center text-xs font-medium text-white focus:ring-4"
                >
                    Post
                </button>
            </div>
        </form>

        {#each confessions as confession (confession.timestamp)}
            <article class="mb-3 rounded-lg bg-white p-6 text-base dark:bg-gray-900">
                <div class="mb-2 flex items-center justify-between">
                    <div class="flex items-center">
                        <p
                            class="mr-3 inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white"
                        >
                            <img
                                class="mr-2 h-6 w-6 rounded-full"
                                src={confession.avatar}
                                alt={confession.user.toString()}
                            />
                            {confession.user.toString()}
                        </p>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        <time
                            datetime={new Date(confession.timestamp).toLocaleString()}
                            title={new Date(confession.timestamp).toLocaleString()}
                        >
                            {new Date(confession.timestamp).toLocaleString()}
                        </time>
                    </p>
                </div>
                <p class="text-gray-400 dark:text-gray-400">{confession.confessions}</p>
                <div class="mt-4 flex items-center space-x-4">
                    <button
                        type="button"
                        class="flex items-center text-sm font-medium text-gray-600 hover:underline dark:text-gray-600"
                        on:click={() => {
                            onToggleTipModal = true;
                            tipReceiver = confession.user.toString();
                        }}
                    >
                    ▲ Tip
                    </button>
                </div>
            </article>
        {/each}
    </div>
</section>

{#if onToggleTipModal}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
        <form on:submit|preventDefault={handleSubmitTipTo} class="mb-6 rounded-lg bg-gray-900 p-6">
            <span class="text-white">
                Tip to
                <span class="text-gray-400">{tipReceiver}</span>
            </span>
            <div class="h-4"></div>
            <div
                class="mb-4 rounded-lg rounded-t-lg border border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
            >
                <label for="tipAmount" class="sr-only">Tip amount</label>
                <input
                    id="tipAmount"
                    type="number"
                    step="0.01"
                    class="w-full border-0 px-0 text-sm text-gray-900 focus:outline-none focus:ring-0 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                    placeholder="Tip amount"
                    required
                    bind:value={tipAmount}
                />
            </div>
            <div class="flex w-full justify-end gap-4">
                <button
                    type="button"
                    class="bg-primary-700 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800 inline-flex items-center rounded-lg px-4 py-2.5 text-center text-xs font-medium text-white focus:ring-4"
                    on:click={() => (onToggleTipModal = false)}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    class="bg-primary-700 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800 inline-flex items-center rounded-lg px-4 py-2.5 text-center text-xs font-medium text-white focus:ring-4"
                >
                    Confirm
                </button>
            </div>
        </form>
    </div>
{/if}
