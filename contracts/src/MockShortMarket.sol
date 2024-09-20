// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin-contracts/token/ERC20/IERC20.sol";
import "@openzeppelin-contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {AggregatorV3Interface} from "@chainlink/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract MockShortMarket {
    mapping(address => address) public dataFeeds;
    mapping(address => mapping(address => Position)) public positions;

    struct Position {
        uint256 depositAmount;
        uint256 openPrice;
        uint256 leverage;
        bool isOpen;
    }

    constructor() {}

    function setDataFeed(address asset, address dataFeed) public {
        dataFeeds[asset] = dataFeed;
    }

    function getPrice(address token) public view returns (uint256, uint256) {
        if (dataFeeds[token] == address(0)) {
            return (0, 0);
        } else {
            // prettier-ignore
            (
                /* uint80 roundID */,
                int256 answer,
                /*uint startedAt*/,
                /*uint timeStamp*/,
                /*uint80 answeredInRound*/
            ) = AggregatorV3Interface(dataFeeds[token]).latestRoundData();

            return (
                uint256(answer),
                uint256(AggregatorV3Interface(dataFeeds[token]).decimals())
            );
        }
    }

    function openShortPosition(
        address token,
        uint256 amount,
        uint256 leverage
    ) public returns (bool) {
        require(
            !positions[token][msg.sender].isOpen,
            "position already exists"
        );
        require(amount > 0, "invalid amount");
        require(
            leverage >= 1 && leverage <= 50,
            "leverage must be in 1X ~ 50X"
        );

        (uint256 price, ) = getPrice(token);
        require(price != 0, "invalid price");

        IERC20(token).transferFrom(msg.sender, address(this), amount);

        positions[token][msg.sender] = Position({
            depositAmount: amount,
            openPrice: price,
            leverage: leverage,
            isOpen: true
        });

        return true;
    }

    function closePosition(address token, address owner) public returns (bool) {
        require(positions[token][owner].isOpen, "position already exists");

        Position memory position = positions[token][owner];
        delete positions[token][owner];

        (uint256 price, ) = getPrice(token);
        require(price != 0, "invalid price");

        if (position.openPrice >= price) {
            require(msg.sender == owner, "alive position");

            // 有盈利
            uint256 priceDifference = position.openPrice - price;
            uint256 profit = (priceDifference *
                position.depositAmount *
                position.leverage) / price;

            uint256 totalReturn = profit + position.depositAmount;

            IERC20(token).transfer(owner, totalReturn);
        } else {
            uint256 priceDifference = price - position.openPrice;
            uint256 loss = (priceDifference *
                position.depositAmount *
                position.leverage) / price;

            if (loss < position.depositAmount) {
                require(msg.sender == owner, "alive position");
                uint256 remain = position.depositAmount - loss;
                IERC20(token).transfer(owner, remain);
            }
        }

        return true;
    }
}
