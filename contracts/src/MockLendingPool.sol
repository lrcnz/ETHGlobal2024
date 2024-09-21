// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin-contracts/token/ERC20/IERC20.sol";
import "@openzeppelin-contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {AggregatorV3Interface} from "@chainlink/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract MockLendingPool {
    mapping(address => mapping(address => uint256)) public reserve;
    mapping(address => address[]) public reserveTokens;

    mapping(address => mapping(address => uint256)) public debt;
    mapping(address => address[]) public debtTokens;

    mapping(address => address) public dataFeeds;

    uint256 public globalDebtRate; // decimals 18, 1e18 = 100%

    function setDataFeed(address asset, address dataFeed) public {
        dataFeeds[asset] = dataFeed;
    }

    function setGlobalDebtRate(uint256 _globalDebtRate) public {
        globalDebtRate = _globalDebtRate;
    }

    function getCalculatedPrice(address token) public view returns (uint256) {
        if (dataFeeds[token] == address(0)) {
            return 0;
        } else {
            // prettier-ignore
            (
                /* uint80 roundID */,
                int256 answer,
                /*uint startedAt*/,
                /*uint timeStamp*/,
                /*uint80 answeredInRound*/
            ) = AggregatorV3Interface(dataFeeds[token]).latestRoundData();

            return
                (10 ** 18 * uint256(answer)) /
                (10 **
                    uint256(
                        AggregatorV3Interface(dataFeeds[token]).decimals()
                    ));
        }
    }

    function getValue(
        address token,
        uint256 amount
    ) public view returns (uint256) {
        return
            (amount * getCalculatedPrice(token)) /
            10 ** IERC20Metadata(token).decimals();
    }

    function _increaseReserve(
        address who,
        address token,
        uint256 amount
    ) internal {
        bool exists = false;
        for (uint256 i = 0; i < reserveTokens[who].length; i++) {
            if (reserveTokens[who][i] == token) {
                exists = true;
                break;
            }
        }

        if (!exists) {
            reserveTokens[who].push(token);
        }

        reserve[who][token] += amount;
    }

    function _decreaseReserve(
        address who,
        address token,
        uint256 amount
    ) internal {
        require(
            reserve[who][token] >= amount,
            "Not enough reserve to decrease"
        );

        reserve[who][token] -= amount;

        if (reserve[who][token] == 0) {
            for (uint256 i = 0; i < reserveTokens[who].length; i++) {
                if (reserveTokens[who][i] == token) {
                    reserveTokens[who][i] = reserveTokens[who][
                        reserveTokens[who].length - 1
                    ];
                    reserveTokens[who].pop();
                    break;
                }
            }
        }
    }

    function _increaseDebt(
        address who,
        address token,
        uint256 amount
    ) internal {
        bool exists = false;
        for (uint256 i = 0; i < debtTokens[who].length; i++) {
            if (debtTokens[who][i] == token) {
                exists = true;
                break;
            }
        }

        if (!exists) {
            debtTokens[who].push(token);
        }

        debt[who][token] += amount;
    }

    function _decreaseDebt(
        address who,
        address token,
        uint256 amount
    ) internal {
        require(debt[who][token] >= amount, "Not enough debt to decrease");

        debt[who][token] -= amount;

        if (debt[who][token] == 0) {
            for (uint256 i = 0; i < debtTokens[who].length; i++) {
                if (debtTokens[who][i] == token) {
                    debtTokens[who][i] = debtTokens[who][
                        debtTokens[who].length - 1
                    ];
                    debtTokens[who].pop();
                    break;
                }
            }
        }
    }

    function getReserveValueByAddress(
        address who
    ) public view returns (uint256) {
        uint256 totalValue = 0;

        for (uint256 i = 0; i < reserveTokens[who].length; i++) {
            address token = reserveTokens[who][i];
            uint256 amount = reserve[who][token];
            uint256 value = getValue(token, amount);
            totalValue += value;
        }

        return totalValue;
    }

    function getDebtValueByAddress(address who) public view returns (uint256) {
        uint256 totalValue = 0;

        for (uint256 i = 0; i < debtTokens[who].length; i++) {
            address token = debtTokens[who][i];
            uint256 amount = debt[who][token];
            uint256 value = getValue(token, amount);
            totalValue += value;
        }

        return totalValue;
    }

    function deposit(
        address reserveToken,
        uint256 amount,
        address onBehalfOf
    ) external {
        require(amount > 0, "Amount must be greater than 0");

        // Transfer tokens from msg.sender to this contract
        require(
            IERC20(reserveToken).transferFrom(
                msg.sender,
                address(this),
                amount
            ),
            "Transfer failed"
        );

        _increaseReserve(onBehalfOf, reserveToken, amount);
    }

    function withdraw(
        address reserveToken,
        uint256 amount,
        address onBehalfOf
    ) external {
        require(amount > 0, "Amount must be greater than 0");

        _decreaseReserve(msg.sender, reserveToken, amount);

        uint256 debtValue = getDebtValueByAddress(msg.sender);
        uint256 reserveValue = getReserveValueByAddress(msg.sender);
        require(
            debtValue * 1e18 <= reserveValue * globalDebtRate,
            "Debt to reserve ratio exceeds the global limit"
        );

        // Transfer tokens from this contract to onBehalfOf
        require(
            IERC20(reserveToken).transfer(onBehalfOf, amount),
            "Transfer failed"
        );
    }

    function borrow(
        address asset,
        uint256 amount,
        address onBehalfOf
    ) external {
        require(amount > 0, "Amount must be greater than 0");

        _increaseDebt(msg.sender, asset, amount);

        uint256 debtValue = getDebtValueByAddress(msg.sender);
        uint256 reserveValue = getReserveValueByAddress(msg.sender);
        require(
            debtValue * 1e18 <= reserveValue * globalDebtRate,
            "Debt to reserve ratio exceeds the global limit"
        );

        // Transfer tokens from this contract to onBehalfOf
        require(IERC20(asset).transfer(onBehalfOf, amount), "Transfer failed");
    }

    function repay(address asset, uint256 amount, address onBehalfOf) external {
        require(amount > 0, "Amount must be greater than 0");

        uint256 debtAmount = debt[onBehalfOf][asset];

        uint256 actualAmount = amount > debtAmount ? debtAmount : amount;

        // Transfer tokens from msg.sender to this contract
        require(
            IERC20(asset).transferFrom(msg.sender, address(this), actualAmount),
            "Transfer failed"
        );

        _decreaseDebt(onBehalfOf, asset, actualAmount);
    }
}
