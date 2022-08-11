// import { ChainId } from "@pancakeswap/sdk";
import BigNumber from "bignumber.js/bignumber";

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

export const BSC_BLOCK_TIME = 3;

export const BASE_BSC_SCAN_URLS = {
  // [ChainId.MAINNET]: "https://bscscan.com",
  // [ChainId.TESTNET]: "https://testnet.bscscan.com",
};

export const CAKE_PER_BLOCK = new BigNumber(40);
export const BLOCKS_PER_YEAR = new BigNumber(
  (60 / BSC_BLOCK_TIME) * 60 * 24 * 365
); // 10512000
export const CAKE_PER_YEAR = CAKE_PER_BLOCK.times(BLOCKS_PER_YEAR);
export const BASE_BSC_SCAN_URL = "https://bscscan.com";
export const DEFAULT_GAS_LIMIT = 200000;
export const AUCTION_BIDDERS_TO_FETCH = 500;
export const RECLAIM_AUCTIONS_TO_FETCH = 500;
export const AUCTION_WHITELISTED_BIDDERS_TO_FETCH = 500;
export const REACT_APP_CHAIN_ID = 56;
