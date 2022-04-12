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
  /**
   * Peer's id
   */
  id: string;
  /**
   * Peer's name
   */
  name: string;
  network: {
    /**
     * Peer's local ip address
     */
    localAddress: string;
    /**
     * Peer's network ip address
     */
    remoteAddress: string;
  };
  /**
   * Peer's protocol info
   */
  protocols: any;
}

export interface Web3DataInfoInterface extends BlockTransactionString {
  systemInfo: {
    /**
     * @deprecated Use admin version in device data directly. This field will be deleted in the future.
     */
    adminVersion: string;
    /**
     * ETD Node version
     */
    nodeVersion: string;
    /**
     * Number of peers connected to the
     */
    peerCount: number;
    /**
     * Syncing status of the ETD node
     */
    isSyncing: boolean;
    /**
     * Mining status of the ETD node
     */
    isMining: boolean;
    /**
     * Coinbase of the ETD node. Might be undefined if the node doesn't have one.
     */
    coinbase: string | undefined;
    /**
     * Hashing rate of the ETD node
     */
    hashRate: number;
  };
  /**
   * Block time between this block and the previous block
   */
  blockTime: number;
  /**
   * Avg block time between this block and the x blocks before
   */
  avgBlockTime: number;
  /**
   * Peers info
   */
  peers: PeerInfo[];
}
