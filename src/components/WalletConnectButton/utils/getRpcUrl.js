import sample from "lodash/sample";

// Array of available nodes to connect to
export const nodes = [
    "https://bsc-dataseed1.ninicoin.io",
    "https://bsc-dataseed1.defibit.io",
    "https://bsc-dataseed.binance.org",
];
// export const nodes = [
//     "https://data-seed-prebsc-1-s3.binance.org:8545",
//     "https://data-seed-prebsc-1-s3.binance.org:8545",
//     "https://data-seed-prebsc-1-s3.binance.org:8545",
// ];
// export const nodes = process.env.REACT_APP_NODE_1
export const getNodeUrl = () => {
    return sample(nodes);
};

export default getNodeUrl;
