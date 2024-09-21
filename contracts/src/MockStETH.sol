// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin-contracts/token/ERC20/IERC20.sol";
import "@openzeppelin-contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin-contracts/utils/math/SafeMath.sol";

contract StETH is IERC20 {
    using SafeMath for uint256;

    event TransferShares(
        address indexed from,
        address indexed to,
        uint256 sharesValue
    );
    event SharesBurnt(
        address indexed account,
        uint256 preRebaseTokenAmount,
        uint256 postRebaseTokenAmount,
        uint256 sharesAmount
    );

    mapping(address => uint256) private shares;

    mapping(address => mapping(address => uint256)) private allowances;

    uint256 public totalShares;

    function name() external pure returns (string memory) {
        return "Liquid staked Ether 2.0";
    }

    function symbol() external pure returns (string memory) {
        return "stETH";
    }

    function decimals() external pure returns (uint8) {
        return 18;
    }

    function totalSupply() external view returns (uint256) {
        return getTotalPooledEther();
    }

    function getTotalShares() external view returns (uint256) {
        return getTotalPooledEther();
    }

    function getTotalPooledEther() public view returns (uint256) {
        return address(this).balance;
    }

    function balanceOf(address _account) external view returns (uint256) {
        return getPooledEthByShares(shares[_account]);
    }

    function getPooledEthByShares(
        uint256 _sharesAmount
    ) public view returns (uint256) {
        return _sharesAmount.mul(getTotalPooledEther()).div(totalShares);
    }

    function getSharesByPooledEth(
        uint256 _ethAmount
    ) public view returns (uint256) {
        return _ethAmount.mul(totalShares).div(getTotalPooledEther());
    }

    function transfer(
        address _recipient,
        uint256 _amount
    ) external returns (bool) {
        _transfer(msg.sender, _recipient, _amount);
        return true;
    }

    function _transfer(
        address _sender,
        address _recipient,
        uint256 _amount
    ) internal {
        uint256 _sharesToTransfer = getSharesByPooledEth(_amount);
        _transferShares(_sender, _recipient, _sharesToTransfer);
        _emitTransferEvents(_sender, _recipient, _amount, _sharesToTransfer);
    }

    function _transferShares(
        address _sender,
        address _recipient,
        uint256 _sharesAmount
    ) internal {
        require(_sender != address(0), "TRANSFER_FROM_ZERO_ADDR");
        require(_recipient != address(0), "TRANSFER_TO_ZERO_ADDR");
        require(_recipient != address(this), "TRANSFER_TO_STETH_CONTRACT");

        uint256 currentSenderShares = shares[_sender];
        require(_sharesAmount <= currentSenderShares, "BALANCE_EXCEEDED");

        shares[_sender] = currentSenderShares.sub(_sharesAmount);
        shares[_recipient] = shares[_recipient].add(_sharesAmount);
    }

    function _emitTransferEvents(
        address _from,
        address _to,
        uint256 _tokenAmount,
        uint256 _sharesAmount
    ) internal {
        emit Transfer(_from, _to, _tokenAmount);
        emit TransferShares(_from, _to, _sharesAmount);
    }

    function allowance(
        address _owner,
        address _spender
    ) external view returns (uint256) {
        return allowances[_owner][_spender];
    }

    function approve(
        address _spender,
        uint256 _amount
    ) external returns (bool) {
        _approve(msg.sender, _spender, _amount);
        return true;
    }

    function _approve(
        address _owner,
        address _spender,
        uint256 _amount
    ) internal {
        require(_owner != address(0), "APPROVE_FROM_ZERO_ADDR");
        require(_spender != address(0), "APPROVE_TO_ZERO_ADDR");

        allowances[_owner][_spender] = _amount;
        emit Approval(_owner, _spender, _amount);
    }

    function transferFrom(
        address _sender,
        address _recipient,
        uint256 _amount
    ) external returns (bool) {
        _spendAllowance(_sender, msg.sender, _amount);
        _transfer(_sender, _recipient, _amount);
        return true;
    }

    function _spendAllowance(
        address _owner,
        address _spender,
        uint256 _amount
    ) internal {
        uint256 currentAllowance = allowances[_owner][_spender];
        require(currentAllowance >= _amount, "ALLOWANCE_EXCEEDED");
        _approve(_owner, _spender, currentAllowance - _amount);
    }

    function sharesOf(address _account) external view returns (uint256) {
        return shares[_account];
    }

    function transferShares(
        address _recipient,
        uint256 _sharesAmount
    ) external returns (uint256) {
        _transferShares(msg.sender, _recipient, _sharesAmount);
        uint256 tokensAmount = getPooledEthByShares(_sharesAmount);
        _emitTransferEvents(
            msg.sender,
            _recipient,
            tokensAmount,
            _sharesAmount
        );
        return tokensAmount;
    }

    function transferSharesFrom(
        address _sender,
        address _recipient,
        uint256 _sharesAmount
    ) external returns (uint256) {
        uint256 tokensAmount = getPooledEthByShares(_sharesAmount);
        _spendAllowance(_sender, msg.sender, tokensAmount);
        _transferShares(_sender, _recipient, _sharesAmount);
        _emitTransferEvents(_sender, _recipient, tokensAmount, _sharesAmount);
        return tokensAmount;
    }

    function _mintShares(
        address _recipient,
        uint256 _sharesAmount
    ) internal returns (uint256) {
        require(_recipient != address(0), "MINT_TO_ZERO_ADDR");

        totalShares = totalShares.add(_sharesAmount);
        shares[_recipient] = shares[_recipient].add(_sharesAmount);

        return totalShares;
    }

    function _burnShares(
        address _account,
        uint256 _sharesAmount
    ) internal returns (uint256) {
        require(_account != address(0), "BURN_FROM_ZERO_ADDR");

        uint256 accountShares = shares[_account];
        require(_sharesAmount <= accountShares, "BALANCE_EXCEEDED");

        uint256 preRebaseTokenAmount = getPooledEthByShares(_sharesAmount);

        totalShares = totalShares.sub(_sharesAmount);
        shares[_account] = accountShares.sub(_sharesAmount);

        uint256 postRebaseTokenAmount = getPooledEthByShares(_sharesAmount);

        emit SharesBurnt(
            _account,
            preRebaseTokenAmount,
            postRebaseTokenAmount,
            _sharesAmount
        );

        return totalShares;
    }

    function deposit() public payable returns (uint256) {
        uint256 sharesAmount = totalShares == 0
            ? msg.value
            : msg.value.mul(totalShares).div(
                getTotalPooledEther().sub(msg.value)
            );
        _mintShares(msg.sender, sharesAmount);

        return sharesAmount;
    }

    function withdraw(uint256 shareAmount) public returns (uint256) {
        uint256 amount = getPooledEthByShares(shareAmount);

        _burnShares(msg.sender, shareAmount);

        payable(msg.sender).transfer(amount);

        return amount;
    }

    function submit(address _referral) external payable returns (uint256) {
        require(msg.value != 0, "ZERO_DEPOSIT");

        uint256 sharesAmount = totalShares == 0
            ? msg.value
            : msg.value.mul(totalShares).div(
                getTotalPooledEther().sub(msg.value)
            );
        _mintShares(msg.sender, sharesAmount);

        return sharesAmount;
    }

    fallback() external payable {}
}

interface IStETH is IERC20 {
    function getPooledEthByShares(
        uint256 _sharesAmount
    ) external view returns (uint256);

    function getSharesByPooledEth(
        uint256 _pooledEthAmount
    ) external view returns (uint256);

    function submit(address _referral) external payable returns (uint256);
}

contract WstETH is ERC20Permit {
    IStETH public stETH;

    constructor(
        IStETH _stETH
    )
        public
        ERC20Permit("Wrapped liquid staked Ether 2.0")
        ERC20("Wrapped liquid staked Ether 2.0", "wstETH")
    {
        stETH = _stETH;
    }

    function wrap(uint256 _stETHAmount) external returns (uint256) {
        require(_stETHAmount > 0, "wstETH: can't wrap zero stETH");
        uint256 wstETHAmount = stETH.getSharesByPooledEth(_stETHAmount);
        _mint(msg.sender, wstETHAmount);
        stETH.transferFrom(msg.sender, address(this), _stETHAmount);
        return wstETHAmount;
    }

    function unwrap(uint256 _wstETHAmount) external returns (uint256) {
        require(_wstETHAmount > 0, "wstETH: zero amount unwrap not allowed");
        uint256 stETHAmount = stETH.getPooledEthByShares(_wstETHAmount);
        _burn(msg.sender, _wstETHAmount);
        stETH.transfer(msg.sender, stETHAmount);
        return stETHAmount;
    }

    receive() external payable {
        uint256 shares = stETH.submit{value: msg.value}(address(0));
        _mint(msg.sender, shares);
    }

    function getWstETHByStETH(
        uint256 _stETHAmount
    ) external view returns (uint256) {
        return stETH.getSharesByPooledEth(_stETHAmount);
    }

    function getStETHByWstETH(
        uint256 _wstETHAmount
    ) external view returns (uint256) {
        return stETH.getPooledEthByShares(_wstETHAmount);
    }

    function stEthPerToken() external view returns (uint256) {
        return stETH.getPooledEthByShares(1 ether);
    }

    function tokensPerStEth() external view returns (uint256) {
        return stETH.getSharesByPooledEth(1 ether);
    }
}
