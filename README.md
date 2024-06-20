# PayToilet - The Game

## Play
The objective is to guess a value that is as close as possible to a pseudorandom number that the smart contract has come up with.

The target number to be close to is calculated at the time of betting via the following: `target = (block_timestamp / block_number)`.

The score of the bet placed is `bet_value_wei - (target % 100)`

If `score - (target % 100) < tolerance` then the bet is a winner. `score` tokens are minted. If the balance of the bettor is less than score, then that many tokens are debited from their wallet.


