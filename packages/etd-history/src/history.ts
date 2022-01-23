/**
 * This file contains the history object for storing the block time history
 * and block difficulty history.
 *
 * It will only store maximum number of block history,
 * and if exceed, the oldest history will be removed.
 */
import { Moment } from "moment";
import {
  BlockTimeHistory,
  DifficultyHistory,
  ETDHistoryInterface,
} from "./interfaces";

/**
 * Class which will process history info of given etd's stats
 */
export class ETDHistory {
  blockTimeHistory: BlockTimeHistory[];
  difficultyHistory: DifficultyHistory[];
  maximumHistoryNumber: number;
  // Last Block's timestamp
  lastBlockAt: string | Moment | undefined;

  /**
   * Init an etd history class
   * @param maximumHistoryNumber
   */
  constructor(maximumHistoryNumber: number) {
    this.blockTimeHistory = [];
    this.difficultyHistory = [];
    this.maximumHistoryNumber = maximumHistoryNumber;
  }

  /**
   * Add block time if the new blocktime is ahead current
   * @param blockTime Latest Block Time
   * @param peers_count Peers count. If number of peers is 0, then this block will not count
   */
  addBlockTime(blockTime: BlockTimeHistory, peers_count: number): void {
    // eslint-disable-next-line camelcase
    if (peers_count === 0) {
      return;
    }

    if (this.blockTimeHistory.length === 0) {
      this.blockTimeHistory.push(blockTime);
      this.lastBlockAt = blockTime.time as Moment;
    } else {
      const latestBlock =
        this.blockTimeHistory[this.blockTimeHistory.length - 1];
      if ((latestBlock.time as Moment).isBefore(blockTime.time)) {
        if (this.blockTimeHistory.length >= this.maximumHistoryNumber) {
          this.blockTimeHistory.splice(0, 1);
        }
        this.blockTimeHistory.push(blockTime);
        this.lastBlockAt = blockTime.time as Moment;
      }
    }
  }

  /**
   * Add new difficulty if the new difficulty is ahead current
   */
  addDifficultHistory(
    difficulty: DifficultyHistory,
    // eslint-disable-next-line camelcase
    peers_count: number
  ): void {
    // eslint-disable-next-line camelcase
    if (peers_count === 0) {
      return;
    }

    if (this.difficultyHistory.length === 0) {
      this.difficultyHistory.push(difficulty);
    } else {
      const latestBlock =
        this.difficultyHistory[this.difficultyHistory.length - 1];
      if ((latestBlock.time as Moment).isBefore(difficulty.time)) {
        if (this.difficultyHistory.length >= this.maximumHistoryNumber) {
          this.difficultyHistory.splice(0, 1);
        }
        this.difficultyHistory.push(difficulty);
      }
    }
  }

  /**
   * Get the json representation of the history
   */
  toJSON(): ETDHistoryInterface {
    const latestBlock =
      this.blockTimeHistory.length > 0
        ? this.blockTimeHistory[this.blockTimeHistory.length - 1]
        : undefined;

    const latestDifficulty =
      this.difficultyHistory.length > 0
        ? this.difficultyHistory[this.difficultyHistory.length - 1]
        : undefined;

    return {
      blockTimeHistory: this.blockTimeHistory.map((c) => {
        const time = (c.time as Moment).toISOString();
        return {
          time: time,
          blockTime: c.blockTime,
          blockNumber: c.blockNumber,
          avgBlockTime: c.avgBlockTime,
        };
      }),
      difficultyHistory: this.difficultyHistory.map((c) => {
        const time = (c.time as Moment).toISOString();
        return { time: time, difficulty: c.difficulty };
      }),
      lastBlockAt: (this.lastBlockAt as Moment)?.toISOString(),
      latestBlockNumber: latestBlock?.blockNumber ?? 0,
      latestDifficulty: latestDifficulty?.difficulty ?? 0,
      latestAvgBlockTime: latestBlock?.avgBlockTime ?? 0,
    };
  }
}
