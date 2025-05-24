import { SC_ADDRESS } from "../utils/constants";
import { useWalletStore } from "../../store/wallet";
import { msgBroadcastClient, chainGrpcWasmApi  } from "../services";
import {
    MsgExecuteContractCompat,
    toBase64,
    fromBase64,
  } from "@injectivelabs/sdk-ts";


export const getCandidates = async (): Promise<string[]> => {
    const response = (await chainGrpcWasmApi.fetchSmartContractState(
        SC_ADDRESS,
        toBase64({ get_candidates: {} })
    )) as { data: string };

    const { candidates } = fromBase64(response.data) as { candidates: string[] }

    return candidates;
};

export const getVotes = async (): Promise<Record<string, number>> => {
    const response = (await chainGrpcWasmApi.fetchSmartContractState(
        SC_ADDRESS,
        toBase64({ get_votes: {} })
    )) as { data: string };

    const { votes } = fromBase64(response.data) as { votes: Record<string, number> }

    return votes;
};

export const submitVote = async (candidate: string): Promise<void> => {
    const { injectiveAddress, connectWallet } = useWalletStore.getState();

    try {

        const msg = MsgExecuteContractCompat.fromJSON({
            sender: injectiveAddress,
            contractAddress: SC_ADDRESS,
            msg: {
                vote: {
                    candidate: candidate,
                },
            },
            funds: [
                {
                    denom: `factory/${injectiveAddress}/eligible_to_vote`,
                    amount: "1",
                },
            ]
        });

        await msgBroadcastClient.broadcast({
            msgs: msg,
            injectiveAddress: injectiveAddress,
        });

    } catch (error: any) {
        console.error("Error submitting vote:", error);

        if (!error.message.includes("You do not have enough funds")) {
            throw error;
        }

        const msg = MsgExecuteContractCompat.fromJSON({
            sender: injectiveAddress,
            contractAddress: SC_ADDRESS,
            msg: {
                vote: {
                    candidate: candidate,
                },
            }
        });

        await msgBroadcastClient.broadcast({
            msgs: msg,
            injectiveAddress: injectiveAddress,
        });
    }
};

