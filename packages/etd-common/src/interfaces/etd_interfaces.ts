import { BlockTransactionString } from "web3-eth";

export interface TransactionSummary {
  hash: string;
  from: string;
  gas: number;
  gasPrice: string;
  lowercaseFrom: string;
  lowercaseTo: string;
  time: string;
  to: string;
  value: string;
}

interface PeerInfo {
  caps: string[];
  id: string;
  name: string;
  network: {
    localAddress: string;
    remoteAddress: string;
  };
  protocols: any;
}

export interface Web3DataInfo extends BlockTransactionString {
  systemInfo: {
    adminVersion: string;
    nodeVersion: string;
    peerCount: number;
    isSyncing: boolean;
    isMining: boolean;
    coinbase: string | undefined;
    hashRate: number;
  };
  blockTime: number;
  avgBlockTime: number;
  peers: PeerInfo[];
}
