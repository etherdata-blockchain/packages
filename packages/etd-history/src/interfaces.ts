import { Moment } from "moment";

export interface BlockTimeHistory {
  time: Moment | string;
  // Current block - prev block
  blockTime: number;
  // Current block - 100 blocks before / 100
  avgBlockTime: number;
  blockNumber: number;
}

export interface DifficultyHistory {
  time: Moment | string;
  difficulty: number;
}

export interface ETDHistoryInterface {
  blockTimeHistory: BlockTimeHistory[];
  difficultyHistory: DifficultyHistory[];
  // When is the last block
  lastBlockAt: string | undefined;
  latestBlockNumber: number;
  latestDifficulty: number;
  latestAvgBlockTime: number;
}
