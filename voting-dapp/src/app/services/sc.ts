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

    const msg = MsgExecuteContractCompat.fromJSON({
        sender: injectiveAddress,
        contractAddress: SC_ADDRESS,
        msg: {
            vote: {
                candidate: candidate,
            },
        },
    });

    await msgBroadcastClient.broadcast({
        msgs: msg,
        injectiveAddress: injectiveAddress,
    });
};

