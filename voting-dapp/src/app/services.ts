import { MsgBroadcaster } from "@injectivelabs/wallet-core";
import { walletStrategy } from "./services/wallet";
import { NETWORK } from "./utils/constants";
import { getNetworkEndpoints } from "@injectivelabs/networks";
import { ChainGrpcWasmApi } from "@injectivelabs/sdk-ts";

export const msgBroadcastClient = new MsgBroadcaster({
  walletStrategy,
  network: NETWORK,
});

export const chainGrpcWasmApi = new ChainGrpcWasmApi(getNetworkEndpoints(NETWORK).grpc);

