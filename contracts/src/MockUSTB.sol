// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin-contracts/utils/math/SafeMath.sol";
import "@openzeppelin-contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin-contracts/token/ERC20/IERC20.sol";
import "solmate/tokens/ERC20.sol";

contract MockUSTB is ERC20 {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    address public immutable baseToken;

    constructor(address _baseToken) ERC20("mock USTB", "USTB", 6) {
        baseToken = _baseToken;
    }

    function depositRate() public view returns (uint256) {
        uint256 baseAmount = IERC20(baseToken).balanceOf(address(this));
        uint256 amount = totalSupply;

        if (amount == 0 || baseAmount == 0) {
            return 1e18;
        } else {
            return amount.mul(1e18).div(baseAmount);
        }
    }

    function withdrawRate() public view returns (uint256) {
        uint256 baseAmount = IERC20(baseToken).balanceOf(address(this));
        uint256 amount = totalSupply;

        if (amount == 0) {
            return 0;
        } else {
            return baseAmount.mul(1e18).div(amount);
        }
    }

    function deposit(uint256 baseAmount) public returns (uint256) {
        uint256 amount = baseAmount.mul(depositRate()).div(1e18);
        require(amount != 0, "invalid amount");

        IERC20(baseToken).safeTransferFrom(msg.sender, address(this), baseAmount);
        _mint(msg.sender, amount);

        return amount;
    }

    function withdraw(uint256 amount) public returns (uint256) {
        require(balanceOf[msg.sender] >= amount, "Wnot enough");
        uint256 baseAmount = amount.mul(withdrawRate()).div(1e18);
        require(baseAmount != 0, "invalid base amount");

        _burn(msg.sender, amount);
        IERC20(baseToken).safeTransfer(msg.sender, baseAmount);

        return baseAmount;
    }
}
