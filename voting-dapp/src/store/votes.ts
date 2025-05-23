import { create } from "zustand";
import { getCandidates, getVotes, submitVote } from "../app/services/sc";

import { useWalletStore } from "./wallet";


type VotesState = {
    votes: Record<string, number>;
    candidates: string[];
    fetchVotes: () => void;
    fetchCandidates: () => void;
    addVote: (candidate: string) => void;
}

export const useVotesStore = create<VotesState>()(
    (set, get) => ({
        votes: {},
        candidates: [],
        fetchVotes: async () => {
            try {
                const votes = await getVotes();
                set({ votes: votes });
            } catch (error) {
                console.error("Error fetching votes:", error);
            }
        },
        fetchCandidates: async () => {
            try {
                const candidates = await getCandidates();
                set({ candidates: candidates });
            } catch (error) {
                console.error("Error fetching candidates:", error);
            }
        },
        addVote: async (candidate: string) => {
            const { injectiveAddress, connectWallet } = useWalletStore.getState();

            if (!injectiveAddress) {
                alert("Please connect your wallet first.");
                return;
            }

            try {
                await submitVote(candidate);
                const votes = await getVotes();
                set({ votes: votes });
            } catch (error) {
                console.error("Error submitting vote:", error);
                alert(error);
            }
        }
    }),
);