## Deployed Contract

Deployed on Ethereum Sepolia testnet

| contract | address |
| --- | --- |
| Test USDT | 0x58951c5b8B431f3Be1910c58e04d63951c8Bb082 |
| Test USDC | 0x3fC8A8fCA14FbC5dE3557f0afaA3CCDABd5bF21c |
| WETH | 0xf531B8F309Be94191af87605CfBf600D71C2cFe0 |
| Mocked StETH | 0xdD7f00c9Da23947B19823bA5EBe0c8a871Ee4fC3 |
| WstETH | 0x144bc8c11a91cE733C1ee0542f82db21396bc8fb |
| Mocked Restaking | 0xc890d4323f73862FD046C02B3698FBb32c8ee6d9 |
| Mocked LendingPool | 0x606CACA06Ad083650a638Bea48360261DAB8fAA8 |
| Mocked ShortMarket | 0x4f2369426432b3a2a8D2b82bA8F82Eb6E34bb9bF |
| UniswapV2Router | 0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008 |
| UniswapV2Factory | 0x7E0987E5b3a30e3f2828572Bb659A548460a3003 |
| | |
| | |
| | |
| | |

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
