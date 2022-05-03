// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Oracle {
 /**
     * Network: Kovan
     * Aggregator: Dai/USD
     * Address: 0x777A68032a88E5A84678A77Af2CD65A7b3c0775a
     * Aggregator : BNB/USD
     * Address : 0x8993ED705cdf5e84D0a3B754b5Ee0e1783fcdF16
     * Aggregator : Link/USD
     * Address : 0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0
     */

    /**
     * Returns the latest price
     */
    function getLatestPrice(address _addr) external view returns (int) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = AggregatorV3Interface(_addr).latestRoundData();
        return price;
    }
}