// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Oracle {

    AggregatorV3Interface internal priceFeed;

    /**
     * Network: Kovan
     * Aggregator: Dai/USD
     * Address: 0x8993ED705cdf5e84D0a3B754b5Ee0e1783fcdF16
     */
    constructor() {
        priceFeed = AggregatorV3Interface(0x777A68032a88E5A84678A77Af2CD65A7b3c0775a);
    }

    /**
     * Returns the latest price
     */
    function getLatestPrice() external view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price;
    }
}