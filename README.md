BlockDAG Client APIs
EVM RPC
In order for a software application to interact with the Ethereum blockchain - either by reading blockchain data or sending transactions to the network - it must connect to an Ethereum node.

For this purpose, every Ethereum client implements a JSON-RPC specification, so there is a uniform set of methods that applications can rely on regardless of the specific node or client implementation.

JSON-RPC is a stateless, lightweight remote procedure call (RPC) protocol. It defines several data structures and the rules around their processing. It is transport agnostic in that the concepts can be used within the same process, over sockets, over HTTP, or in many various message-passing environments. It uses JSON (RFC 4627) as data format.

Client implementations
Ethereum clients may utilize different programming languages when implementing the JSON-RPC specification. See individual client documentation for further details related to specific programming languages. We recommend checking the documentation of each client for the latest API support information.

Convenience Libraries
While you may choose to interact directly with Ethereum clients via the JSON-RPC API, there are often easier options for dApp developers. Many JavaScript and backend API libraries exist to provide wrappers on top of the JSON-RPC API. With these libraries, developers can write intuitive, one-line methods in the programming language of their choice to initialize JSON-RPC requests (under the hood) that interact with Ethereum.

Consensus client APIs
This page deals mainly with the JSON-RPC API used by Ethereum execution clients. However, consensus clients also have an RPC API that allows users to query information about the node, and request Beacon blocks, Beacon state, and other consensus-related information directly from a node. This API is documented on the Beacon API webpage.

An internal API is also used for inter-client communication within a node - that is, it enables the consensus client and execution client to swap data. This is called the 'Engine API' and the specs are available on GitHub.

Execution client spec
Read the full JSON-RPC API spec on GitHub. This API is documented on the Execution API webpage and includes an Inspector to try out all the available methods.

Conventions
Hex value encoding
Two key data types get passed over JSON: unformatted byte arrays and quantities. Both are passed with a hex encoding but with different requirements for formatting.

Quantities

When encoding quantities (integers, numbers): encode as hex, prefix with "0x", the most compact representation (slight exception: zero should be represented as "0x0").

Here are some examples:

0x41 (65 in decimal)

0x400 (1024 in decimal)

WRONG: 0x (should always have at least one digit - zero is "0x0")

WRONG: 0x0400 (no leading zeroes allowed)

WRONG: ff (must be prefixed 0x)

Unformatted data
When encoding unformatted data (byte arrays, account addresses, hashes, bytecode arrays): encode as hex, prefix with "0x", two hex digits per byte.

Here are some examples:

0x41 (size 1, "A")

0x004200 (size 3, "0B0")

0x (size 0, "")

WRONG: 0xf0f0f (must be even number of digits)

WRONG: 004200 (must be prefixed 0x)

The default block parameter
The following methods have an extra default block parameter:

eth_getBalance

eth_getCode

eth_getTransactionCount

eth_getStorageAt

eth_call

When requests are made that act on the state of Ethereum, the last default block parameter determines the height of the block.

The following options are possible for the defaultBlock parameter:

HEX String - an integer block number

String "earliest" for the earliest/genesis block

String "latest" - for the latest proposed block

String "safe" - for the latest safe head block

String "finalized" - for the latest finalized block

String "pending" - for the pending state/transactions

Examples
On this page, we provide examples of how to use individual JSON_RPC API endpoints using the command line tool, curl. These individual endpoint examples are found below in the Curl examples section. Further down the page, we also provide an end-to-end example for compiling and deploying a smart contract using a Geth node, the JSON_RPC API, and curl.

Curl examples
Examples of using the JSON_RPC API by making curl requests to an Ethereum node are provided below. Each example includes a description of the specific endpoint, its parameters, return type, and a worked example of how it should be used.

The curl requests might return an error message relating to the content type. This is because the --data option sets the content type to application/x-www-form-urlencoded. If your node does complain about this, manually set the header by placing -H "Content-Type: application/json" it at the start of the call. The examples also do not include the URL/IP & port combination which must be the last argument given to curl (e.g. 127.0.0.1:18545). A complete curl request including these additional data takes the following form:


Copy
curl -H "Content-Type: application/json" -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}' 127.0.0.1:18545
Gossip, State, History
A handful of core JSON-RPC methods require data from the Ethereum network and fall neatly into three main categories: Gossip, State, and History. Use the links in these sections to jump to each method, or use the table of contents to explore the whole list of methods.

Gossip Methods
These methods track the head of the chain. This is how transactions make their way around the network, find their way into blocks, and how clients find out about new blocks.

eth_blockNumber

eth_sendRawTransaction

State Methods
Methods that report the current state of all the data stored. The "state" is like one big shared piece of RAM, and includes account balances, contract data, and gas estimations.

eth_getBalance

eth_getStorageAt

eth_getTransactionCount

eth_getCode

eth_call

eth_estimateGas

History Methods
Fetches historical records of every block back to genesis. This is like one large append-only file, and includes all block headers, block bodies, uncle blocks, and transaction receipts.

eth_getBlockTransactionCountByHash

eth_getBlockTransactionCountByNumber

eth_getUncleCountByBlockHash

eth_getUncleCountByBlockNumber

eth_getBlockByHash

eth_getBlockByNumber

eth_getTransactionByHash

eth_getTransactionByBlockHashAndIndex

eth_getTransactionByBlockNumberAndIndex

eth_getTransactionReceipt

eth_getUncleByBlockHashAndIndex

eth_getUncleByBlockNumberAndIndex

JSON-RPC API Playground
You can use the playground tool to discover and try out the API methods. It also shows you which methods and networks are supported by various node providers.

JSON-RPC API Methods
web3_clientVersion
Returns the current client version.

Parameters

None

Returns

String - The current client version

Example


Copy
// // Request
curl -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}'
// Result
{
  "id":67,
  "jsonrpc":"2.0",
  "result": "Geth/v1.12.1-stable/linux-amd64/go1.19.1"
}
Returns Keccak-256 (not the standardized SHA3-256) of the given data.

Parameters

DATA - The data to convert into a SHA3 hash


Copy
// params: ["0x68656c6c6f20776f726c64"]
Returns

DATA - The SHA3 result of the given string.

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"web3_sha3","params":["0x68656c6c6f20776f726c64"],"id":64}'
// Result
{
  "id":64,
  "jsonrpc": "2.0",
  "result": "0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad"
}
net_version
Returns the current network id.

Parameters

None

Returns

String - The current network id.

The full list of current network IDs is available at chainlist.org(opens in a new tab). Some common ones are:

1043 :  Awakening Network 

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"net_version","params":[],"id":67}'
// Result
{
  "id":67,
  "jsonrpc": "2.0",
  "result": "3"
}
net_listening
Returns true if client is actively listening for network connections.

Parameters

None

Returns

Boolean - true when listening, otherwise false.

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"net_listening","params":[],"id":67}'
// Result
{
  "id":67,
  "jsonrpc":"2.0",
  "result":true
}
net_peerCount
Returns number of peers currently connected to the client.

Parameters

None

Returns

QUANTITY - integer of the number of connected peers.

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":74}'
// Result
{
  "id":74,
  "jsonrpc": "2.0",
  "result": "0x2" // 2
}
eth_syncing
Returns an object with data about the sync status or false.

Parameters

None

Returns

The precise return data varies between client implementations. All clients return False when the node is not syncing, and all clients return the following fields.

Object|Boolean, An object with sync status data or FALSE, when not syncing:

startingBlock: QUANTITY - The block at which the import started (will only be reset, after the sync reached his head)

currentBlock: QUANTITY - The current block, same as eth_blockNumber

highestBlock: QUANTITY - The estimated highest block

However, the individual clients may also provide additional data. For example Geth returns the following:


Copy
// {
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "currentBlock": "0x3cf522",
    "healedBytecodeBytes": "0x0",
    "healedBytecodes": "0x0",
    "healedTrienodes": "0x0",
    "healingBytecode": "0x0",
    "healingTrienodes": "0x0",
    "highestBlock": "0x3e0e41",
    "startingBlock": "0x3cbed5",
    "syncedAccountBytes": "0x0",
    "syncedAccounts": "0x0",
    "syncedBytecodeBytes": "0x0",
    "syncedBytecodes": "0x0",
    "syncedStorage": "0x0",
    "syncedStorageBytes": "0x0"
  }
}
Whereas Besu returns:


Copy
// {
  "jsonrpc": "2.0",
  "id": 51,
  "result": {
    "startingBlock": "0x0",
    "currentBlock": "0x1518",
    "highestBlock": "0x9567a3",
    "pulledStates": "0x203ca",
    "knownStates": "0x200636"
  }
}
Refer to the documentation for your specific client for more details.

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": {
    startingBlock: '0x384',
    currentBlock: '0x386',
    highestBlock: '0x454'
  }
}
// Or when not syncing
{
  "id":1,
  "jsonrpc": "2.0",
  "result": false
}
eth_chainId
Returns the chain ID used for signing replay-protected transactions.

Parameters

None

Returns

chainId, hexadecimal value as a string representing the integer of the current chain id.

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":67}'
// Result
{
  "id":67,
  "jsonrpc": "2.0",
  "result": "0x1"
}
eth_gasPrice
Returns an estimate of the current price per gas in wei. For example, the Besu client examines the last 100 blocks and returns the median gas unit price by default.

Parameters

None

Returns

QUANTITY - integer of the current gas price in wei.

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":73}'
// Result
{
  "id":73,
  "jsonrpc": "2.0",
  "result": "0x1dfd14000" // 8049999872 Wei
}
eth_accounts
Returns a list of addresses owned by client.

Parameters

None

Returns

Array of DATA, 20 Bytes - addresses owned by the client.

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_accounts","params":[],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": ["0x407d73d8a49eeb85d32cf465507dd71d507100c1"]
}
eth_blockNumber
Returns the number of most recent block.

Parameters

None

Returns

QUANTITY - integer of the current block number the client is on.

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":83}'
// Result
{
  "id":83,
  "jsonrpc": "2.0",
  "result": "0x4b7" // 1207
}
eth_getBalance
Returns the balance of the account of given address.

Parameters

DATA, 20 Bytes - address to check for balance.

QUANTITY|TAG - integer block number, or the string "latest", "earliest", "pending", "safe", or "finalized", see the default block parameter


Copy
// params: ["0x407d73d8a49eeb85d32cf465507dd71d507100c1", "latest"]
Returns

QUANTITY - integer of the current balance in wei.

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x407d73d8a49eeb85d32cf465507dd71d507100c1", "latest"],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0x0234c8a3397aab58" // 158972490234375000
}
eth_getStorageAt
Returns the value from a storage position at a given address.

Parameters

DATA, 20 Bytes - address of the storage.

QUANTITY - integer of the position in the storage.

QUANTITY|TAG - integer block number, or the string "latest", "earliest", "pending", "safe", "finalized", see the default block parameter

Returns

DATA - the value at this storage position.

Example Calculating the correct position depends on the storage to retrieve. Consider the following contract deployed at 0x295a70b2de5e3953354a6a8344e616ed314d7251 by address 0x391694e7e0b0cce554cb130d723a9d27458f9298.


Copy
// contract Storage {
    uint pos0;
    mapping(address => uint) pos1;
    function Storage() {
        pos0 = 1234;
        pos1[msg.sender] = 5678;
    }
}
Retrieving the value of pos0 is straight forward:


Copy
// curl -X POST --data '{
"jsonrpc":"2.0", "method": "eth_getStorageAt", "params": ["0x295a70b2de5e3953354a6a8344e616ed314d7251", "0x0", "latest"], "id": 1
}
' localhost:8545
{
"jsonrpc":"2.0","id":1,"result":"0x00000000000000000000000000000000000000000000000000000000000004d2"
}
Retrieving an element of the map is harder. The position of an element in the map is calculated with:


Copy
// keccak(LeftPad32(key, 0), LeftPad32(map position, 0))
This means to retrieve the storage on pos1["0x391694e7e0b0cce554cb130d723a9d27458f9298"] we need to calculate the position with:


Copy
// keccak(
  decodeHex(
    "000000000000000000000000391694e7e0b0cce554cb130d723a9d27458f9298" +
      "0000000000000000000000000000000000000000000000000000000000000001"
  )
)
The geth console which comes with the web3 library can be used to make the calculation:


Copy
// > var key = "000000000000000000000000391694e7e0b0cce554cb130d723a9d27458f9298" + "0000000000000000000000000000000000000000000000000000000000000001"
undefined
> web3.sha3(key, {"encoding": "hex"})
"0x6661e9d6d8b923d5bbaab1b96e1dd51ff6ea2a93520fdc9eb75d059238b8c5e9"
Now to fetch the storage:


Copy
// curl -X POST --data '{"jsonrpc":"2.0", "method": "eth_getStorageAt", "params": ["0x295a70b2de5e3953354a6a8344e616ed314d7251", "0x6661e9d6d8b923d5bbaab1b96e1dd51ff6ea2a93520fdc9eb75d059238b8c5e9", "latest"], "id": 1}' localhost:8545
{"jsonrpc":"2.0","id":1,"result":"0x000000000000000000000000000000000000000000000000000000000000162e"}
eth_getTransactionCount
Returns the number of transactions sent from an address.

Parameters

DATA, 20 Bytes - address.

QUANTITY|TAG - integer block number, or the string "latest", "earliest", "pending", "safe" or "finalized", see the default block parameter


Copy
params: [
  "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
  "latest", // state at the latest block
]
Returns

QUANTITY - integer of the number of transactions send from this address.

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionCount","params":["0x407d73d8a49eeb85d32cf465507dd71d507100c1","latest"],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0x1" // 1
}
eth_getBlockTransactionCountByHash
Returns the number of transactions in a block from a block matching the given block hash.

Parameters

DATA, 32 Bytes - hash of a block


Copy
// params: ["0xd03ededb7415d22ae8bac30f96b2d1de83119632693b963642318d87d1bece5b"]
Returns

QUANTITY - integer of the number of transactions in this block.

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBlockTransactionCountByHash","params":["0xd03ededb7415d22ae8bac30f96b2d1de83119632693b963642318d87d1bece5b"],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0x8b" // 139
}
eth_getBlockTransactionCountByNumber
Returns the number of transactions in a block matching the given block number.

Parameters

QUANTITY|TAG - integer of a block number, or the string "earliest", "latest", "pending", "safe" or "finalized", as in the default block parameter.


Copy
// params: [
  "0x13738ca", // 20396234
]
Returns

QUANTITY - integer of the number of transactions in this block.

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBlockTransactionCountByNumber","params":["0x13738ca"],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0x8b" // 139
}
eth_getUncleCountByBlockHash
Returns the number of uncles in a block from a block matching the given block hash.

Parameters

DATA, 32 Bytes - hash of a block


Copy
// params: ["0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2"]
Returns

QUANTITY - integer of the number of uncles in this block.

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getUncleCountByBlockHash","params":["0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2"],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0x1" // 1
}
eth_getUncleCountByBlockNumber
Returns the number of uncles in a block from a block matching the given block number.

Parameters

QUANTITY|TAG - integer of a block number, or the string "latest", "earliest", "pending", "safe" or "finalized", see the default block parameter


Copy
// params: [
  "0xe8", // 232
]
Returns

QUANTITY - integer of the number of uncles in this block.

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getUncleCountByBlockNumber","params":["0xe8"],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0x0" // 0
}
eth_getCode
Returns code at a given address.

Parameters

DATA, 20 Bytes - address

QUANTITY|TAG - integer block number, or the string "latest", "earliest", "pending", "safe" or "finalized", see the default block parameter


Copy
// params: [
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  "0x5daf3b", // 6139707
]
Returns

DATA - the code from the given address.

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getCode","params":["0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "0x5daf3b"],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0x6060604052600436106100af576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100b9578063095ea7b31461014757806318160ddd146101a157806323b872dd146101ca5780632e1a7d4d14610243578063313ce5671461026657806370a082311461029557806395d89b41146102e2578063a9059cbb14610370578063d0e30db0146103ca578063dd62ed3e146103d4575b6100b7610440565b005b34156100c457600080fd5b6100cc6104dd565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561010c5780820151818401526020810190506100f1565b50505050905090810190601f1680156101395780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561015257600080fd5b610187600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190505061057b565b604051808215151515815260200191505060405180910390f35b34156101ac57600080fd5b6101b461066d565b6040518082815260200191505060405180910390f35b34156101d557600080fd5b610229600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190505061068c565b604051808215151515815260200191505060405180910390f35b341561024e57600080fd5b61026460048080359060200190919050506109d9565b005b341561027157600080fd5b610279610b05565b604051808260ff1660ff16815260200191505060405180910390f35b34156102a057600080fd5b6102cc600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610b18565b6040518082815260200191505060405180910390f35b34156102ed57600080fd5b6102f5610b30565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561033557808201518184015260208101905061031a565b50505050905090810190601f1680156103625780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561037b57600080fd5b6103b0600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610bce565b604051808215151515815260200191505060405180910390f35b6103d2610440565b005b34156103df57600080fd5b61042a600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610be3565b6040518082815260200191505060405180910390f35b34600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055503373ffffffffffffffffffffffffffffffffffffffff167fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c346040518082815260200191505060405180910390a2565b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105735780601f1061054857610100808354040283529160200191610573565b820191906000526020600020905b81548152906001019060200180831161055657829003601f168201915b505050505081565b600081600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b60003073ffffffffffffffffffffffffffffffffffffffff1631905090565b600081600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101515156106dc57600080fd5b3373ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16141580156107b457507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205414155b156108cf5781600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015151561084457600080fd5b81600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055505b81600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190509392505050565b80600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410151515610a2757600080fd5b80600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501515610ab457600080fd5b3373ffffffffffffffffffffffffffffffffffffffff167f7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65826040518082815260200191505060405180910390a250565b600260009054906101000a900460ff1681565b60036020528060005260406000206000915090505481565b60018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610bc65780601f10610b9b57610100808354040283529160200191610bc6565b820191906000526020600020905b815481529060010190602001808311610ba957829003601f168201915b505050505081565b6000610bdb33848461068c565b905092915050565b60046020528160005260406000206020528060005260406000206000915091505054815600a165627a7a72305820deb4c2ccab3c2fdca32ab3f46728389c2fe2c165d5fafa07661e4e004f6c344a0029"
}
eth_sign
The sign method calculates an Ethereum specific signature with: sign(keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))).

By adding a prefix to the message makes the calculated signature recognizable as an Ethereum specific signature. This prevents misuse where a malicious dapp can sign arbitrary data (e.g. transaction) and use the signature to impersonate the victim.

Note: the address to sign with must be unlocked.

Parameters

DATA, 20 Bytes - address

DATA, N Bytes - message to sign

Returns

DATA: Signature

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_sign","params":["0x9b2055d370f73ec7d8a03e965129118dc8f5bf83", "0xdeadbeaf"],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0xa3f20717a250c2b0b729b7e5becbff67fdaef7e0699da4de7ca5895b02a170a12d887fd3b17bfdce3481f10bea41f45ba9f709d39ce8325427b57afcfc994cee1b"
}
eth_signTransaction
Signs a transaction that can be submitted to the network at a later time using with eth_sendRawTransaction.

Parameters

Object - The transaction object

type:

from: DATA, 20 Bytes - The address the transaction is sent from.

to: DATA, 20 Bytes - (optional when creating new contract) The address the transaction is directed to.

gas: QUANTITY - (optional, default: 90000) Integer of the gas provided for the transaction execution. It will return unused gas.

gasPrice: QUANTITY - (optional, default: To-Be-Determined) Integer of the gasPrice used for each paid gas, in Wei.

value: QUANTITY - (optional) Integer of the value sent with this transaction, in Wei.

data: DATA - The compiled code of a contract OR the hash of the invoked method signature and encoded parameters.

nonce: QUANTITY - (optional) Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.

Returns

DATA, The RLP-encoded transaction object signed by the specified account.

Example


Copy
// Request
curl -X POST --data '{"id": 1,"jsonrpc": "2.0","method": "eth_signTransaction","params": [{"data":"0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675","from": "0xb60e8dd61c5d32be8058bb8eb970870f07233155","gas": "0x76c0","gasPrice": "0x9184e72a000","to": "0xd46e8dd67c5d32be8058bb8eb970870f07244567","value": "0x9184e72a"}]}'
// Result
{
    "id": 1,
    "jsonrpc": "2.0",
    "result": "0xa3f20717a250c2b0b729b7e5becbff67fdaef7e0699da4de7ca5895b02a170a12d887fd3b17bfdce3481f10bea41f45ba9f709d39ce8325427b57afcfc994cee1b"
}
eth_sendTransaction
Creates new message call transaction or a contract creation, if the data field contains code, and signs it using the account specified in from.

Parameters

Object - The transaction object

from: DATA, 20 Bytes - The address the transaction is sent from.

to: DATA, 20 Bytes - (optional when creating new contract) The address the transaction is directed to.

gas: QUANTITY - (optional, default: 90000) Integer of the gas provided for the transaction execution. It will return unused gas.

gasPrice: QUANTITY - (optional, default: To-Be-Determined) Integer of the gasPrice used for each paid gas.

value: QUANTITY - (optional) Integer of the value sent with this transaction.

input: DATA - The compiled code of a contract OR the hash of the invoked method signature and encoded parameters.

nonce: QUANTITY - (optional) Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.


Copy
// params: [
  {
    from: "0xb60e8dd61c5d32be8058bb8eb970870f07233155",
    to: "0xd46e8dd67c5d32be8058bb8eb970870f07244567",
    gas: "0x76c0", // 30400
    gasPrice: "0x9184e72a000", // 10000000000000
    value: "0x9184e72a", // 2441406250
    input:
      "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
  },
]
Returns

DATA, 32 Bytes - the transaction hash, or the zero hash if the transaction is not yet available.

Use eth_getTransactionReceipt to get the contract address, after the transaction was proposed in a block, when you created a contract.

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{see above}],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331"
}
eth_sendRawTransaction
Creates new message call transaction or a contract creation for signed transactions.

Parameters

DATA, The signed transaction data.


Copy
// params: [
  "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
]
Returns

DATA, 32 Bytes - the transaction hash, or the zero hash if the transaction is not yet available.

Use eth_getTransactionReceipt to get the contract address, after the transaction was proposed in a block, when you created a contract.

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":[{see above}],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0xe670ec64341771606e55d6b4ca35a1a6b75ee3d5145a99d05921026d1527331"
}
eth_call
Executes a new message call immediately without creating a transaction on the blockchain. Often used for executing read-only smart contract functions, for example the balanceOf for an ERC-20 contract.

Parameters

Object - The transaction call object

from: DATA, 20 Bytes - (optional) The address the transaction is sent from.

to: DATA, 20 Bytes - The address the transaction is directed to.

gas: QUANTITY - (optional) Integer of the gas provided for the transaction execution. eth_call consumes zero gas, but this parameter may be needed by some executions.

gasPrice: QUANTITY - (optional) Integer of the gasPrice used for each paid gas

value: QUANTITY - (optional) Integer of the value sent with this transaction

input: DATA - (optional) Hash of the method signature and encoded parameters. For details see Ethereum Contract ABI in the Solidity documentation.

QUANTITY|TAG - integer block number, or the string "latest", "earliest", "pending", "safe" or "finalized", see the default block parameter

Returns

DATA - the return value of executed contract.

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_call","params":[{see above}],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0x"
}
eth_estimateGas
Generates and returns an estimate of how much gas is necessary to allow the transaction to complete. The transaction will not be added to the blockchain. Note that the estimate may be significantly more than the amount of gas actually used by the transaction, for a variety of reasons including EVM mechanics and node performance.

Parameters

See eth_call parameters, except that all properties are optional. If no gas limit is specified geth uses the block gas limit from the pending block as an upper bound. As a result the returned estimate might not be enough to executed the call/transaction when the amount of gas is higher than the pending block gas limit.

Returns

QUANTITY - the amount of gas used.

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_estimateGas","params":[{see above}],"id":1}'
// Result
{
  "id":1,
  "jsonrpc": "2.0",
  "result": "0x5208" // 21000
}
eth_getBlockByHash
Returns information about a block by hash.

Parameters

DATA, 32 Bytes - Hash of a block.

Boolean - If true it returns the full transaction objects, if false only the hashes of the transactions.


Copy
// params: [
  "0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae",
  false,
]
Returns

Object - A block object, or null when no block was found:

number: QUANTITY - the block number. null when its pending block.

hash: DATA, 32 Bytes - hash of the block. null when its pending block.

parentHash: DATA, 32 Bytes - hash of the parent block.

nonce: DATA, 8 Bytes - hash of the generated proof-of-work. null when its pending block.

sha3Uncles: DATA, 32 Bytes - SHA3 of the uncles data in the block.

logsBloom: DATA, 256 Bytes - the bloom filter for the logs of the block. null when its pending block.

transactionsRoot: DATA, 32 Bytes - the root of the transaction trie of the block.

stateRoot: DATA, 32 Bytes - the root of the final state trie of the block.

receiptsRoot: DATA, 32 Bytes - the root of the receipts trie of the block.

miner: DATA, 20 Bytes - the address of the beneficiary to whom the mining rewards were given.

difficulty: QUANTITY - integer of the difficulty for this block.

totalDifficulty: QUANTITY - integer of the total difficulty of the chain until this block.

extraData: DATA - the "extra data" field of this block.

size: QUANTITY - integer the size of this block in bytes.

gasLimit: QUANTITY - the maximum gas allowed in this block.

gasUsed: QUANTITY - the total used gas by all transactions in this block.

timestamp: QUANTITY - the unix timestamp for when the block was collated.

transactions: Array - Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.

uncles: Array - Array of uncle hashes.

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBlockByHash","params":["0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae", false],"id":1}'
// Result
{
{
"jsonrpc": "2.0",
"id": 1,
"result": {
    "difficulty": "0x4ea3f27bc",
    "extraData": "0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32",
    "gasLimit": "0x1388",
    "gasUsed": "0x0",
    "hash": "0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae",
    "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    "miner": "0xbb7b8287f3f0a933474a79eae42cbca977791171",
    "mixHash": "0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843",
    "nonce": "0x689056015818adbe",
    "number": "0x1b4",
    "parentHash": "0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54",
    "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
    "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
    "size": "0x220",
    "stateRoot": "0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d",
    "timestamp": "0x55ba467c",
    "totalDifficulty": "0x78ed983323d",
    "transactions": [
    ],
    "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
    "uncles": [
    ]
}
}
eth_getBlockByNumber
Returns information about a block by block number.

Parameters

QUANTITY|TAG - integer of a block number, or the string "earliest", "latest", "pending", "safe" or "finalized", as in the default block parameter.

Boolean - If true it returns the full transaction objects, if false only the hashes of the transactions.


Copy
// params: [
  "0x1b4", // 436
  true,
]
Returns See eth_getBlockByHash

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["0x1b4", true],"id":1}'
Result see eth_getBlockByHash

eth_getTransactionByHash
Returns the information about a transaction requested by transaction hash.

Parameters

DATA, 32 Bytes - hash of a transaction


Copy
// params: ["0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b"]
Returns

Object - A transaction object, or null when no transaction was found:

blockHash: DATA, 32 Bytes - hash of the block where this transaction was in. null when its pending.

blockNumber: QUANTITY - block number where this transaction was in. null when its pending.

from: DATA, 20 Bytes - address of the sender.

gas: QUANTITY - gas provided by the sender.

gasPrice: QUANTITY - gas price provided by the sender in Wei.

hash: DATA, 32 Bytes - hash of the transaction.

input: DATA - the data send along with the transaction.

nonce: QUANTITY - the number of transactions made by the sender prior to this one.

to: DATA, 20 Bytes - address of the receiver. null when its a contract creation transaction.

transactionIndex: QUANTITY - integer of the transactions index position in the block. null when its pending.

value: QUANTITY - value transferred in Wei.

v: QUANTITY - ECDSA recovery id

r: QUANTITY - ECDSA signature r

s: QUANTITY - ECDSA signature s

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionByHash","params":["0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b"],"id":1}'
// Result
{
  "jsonrpc":"2.0",
  "id":1,
  "result":{
    "blockHash":"0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2",
    "blockNumber":"0x5daf3b", // 6139707
    "from":"0xa7d9ddbe1f17865597fbd27ec712455208b6b76d",
    "gas":"0xc350", // 50000
    "gasPrice":"0x4a817c800", // 20000000000
    "hash":"0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b",
    "input":"0x68656c6c6f21",
    "nonce":"0x15", // 21
    "to":"0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb",
    "transactionIndex":"0x41", // 65
    "value":"0xf3dbb76162000", // 4290000000000000
    "v":"0x25", // 37
    "r":"0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea",
    "s":"0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c"
  }
}
eth_getTransactionByBlockHashAndIndex
Returns information about a transaction by block hash and transaction index position.

Parameters

DATA, 32 Bytes - hash of a block.

QUANTITY - integer of the transaction index position.


Copy
// params: [
  "0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2",
  "0x0", // 0
]
Returns See eth_getTransactionByHash

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionByBlockHashAndIndex","params":["0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2", "0x0"],"id":1}'
Result see eth_getTransactionByHash

eth_getTransactionByBlockNumberAndIndex
Returns information about a transaction by block number and transaction index position.

Parameters

QUANTITY|TAG - a block number, or the string "earliest", "latest", "pending", "safe" or "finalized", as in the default block parameter.

QUANTITY - the transaction index position.


Copy
// params: [
  "0x9c47cf", // 10241999
  "0x24", // 36
]
Returns See eth_getTransactionByHash

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionByBlockNumberAndIndex","params":["0x9c47cf", "0x24"],"id":1}'
Result see eth_getTransactionByHash

eth_getTransactionReceipt
Returns the receipt of a transaction by transaction hash.

Note That the receipt is not available for pending transactions.

Parameters

DATA, 32 Bytes - hash of a transaction


Copy
// params: ["0x85d995eba9763907fdf35cd2034144dd9d53ce32cbec21349d4b12823c6860c5"]
Returns Object - A transaction receipt object, or null when no receipt was found:

transactionHash : DATA, 32 Bytes - hash of the transaction.

transactionIndex: QUANTITY - integer of the transactions index position in the block.

blockHash: DATA, 32 Bytes - hash of the block where this transaction was in.

blockNumber: QUANTITY - block number where this transaction was in.

from: DATA, 20 Bytes - address of the sender.

to: DATA, 20 Bytes - address of the receiver. null when its a contract creation transaction.

cumulativeGasUsed : QUANTITY - The total amount of gas used when this transaction was executed in the block.

effectiveGasPrice : QUANTITY - The sum of the base fee and tip paid per unit of gas.

gasUsed : QUANTITY - The amount of gas used by this specific transaction alone.

contractAddress : DATA, 20 Bytes - The contract address created, if the transaction was a contract creation, otherwise null.

logs: Array - Array of log objects, which this transaction generated.

logsBloom: DATA, 256 Bytes - Bloom filter for light clients to quickly retrieve related logs.

type: QUANTITY - integer of the transaction type, 0x0 for legacy transactions, 0x1 for access list types, 0x2 for dynamic fees.

It also returns either :

root : DATA 32 bytes of post-transaction stateroot (pre Byzantium)

status: QUANTITY either 1 (success) or 0 (failure)

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getTransactionReceipt","params":["0x85d995eba9763907fdf35cd2034144dd9d53ce32cbec21349d4b12823c6860c5"],"id":1}'
// Result
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "blockHash":
      "0xa957d47df264a31badc3ae823e10ac1d444b098d9b73d204c40426e57f47e8c3",
    "blockNumber": "0xeff35f",
    "contractAddress": null, // string of the address if it was created
    "cumulativeGasUsed": "0xa12515",
    "effectiveGasPrice": "0x5a9c688d4",
    "from": "0x6221a9c005f6e47eb398fd867784cacfdcfff4e7",
    "gasUsed": "0xb4c8",
    "logs": [{
      // logs as returned by getFilterLogs, etc.
    }],
    "logsBloom": "0x00...0", // 256 byte bloom filter
    "status": "0x1",
    "to": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    "transactionHash":
      "0x85d995eba9763907fdf35cd2034144dd9d53ce32cbec21349d4b12823c6860c5",
    "transactionIndex": "0x66",
    "type": "0x2"
  }
}
eth_getUncleByBlockHashAndIndex
Returns information about a uncle of a block by hash and uncle index position.

Parameters

DATA, 32 Bytes - The hash of a block.

QUANTITY - The uncle's index position.


Copy
// params: [
  "0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2",
  "0x0", // 0
]
Returns See eth_getBlockByHash

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getUncleByBlockHashAndIndex","params":["0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2", "0x0"],"id":1}'
Result see eth_getBlockByHash

Note: An uncle doesn't contain individual transactions.

eth_getUncleByBlockNumberAndIndex
Returns information about a uncle of a block by number and uncle index position.

Parameters

QUANTITY|TAG - a block number, or the string "earliest", "latest", "pending", "safe", "finalized", as in the default block parameter.

QUANTITY - the uncle's index position.


Copy
// params: [
  "0x29c", // 668
  "0x0", // 0
]
Returns See eth_getBlockByHash

Note: An uncle doesn't contain individual transactions.

Example


Copy
// Request
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getUncleByBlockNumberAndIndex","params":["0x29c", "0x0"],"id":1}'
Result see eth_getBlockByHash

Usage Example
Deploying a contract using JSON_RPC
This section includes a demonstration of how to deploy a contract using only the RPC interface. There are alternative routes to deploying contracts where this complexity is abstracted away—for example, using libraries built on top of the RPC interface such as web3.js and web3.py. These abstractions are generally easier to understand and less error-prone, but it is still helpful to understand what is happening under the hood.

The following is a straightforward smart contract called Multiply7 that will be deployed using the JSON-RPC interface to an Ethereum node. This tutorial assumes the reader is already running a Geth node. More information on nodes and clients is available here. Please refer to individual client documentation to see how to start the HTTP JSON-RPC for non-Geth clients. Most clients default to serving on localhost:8545.


Copy
// contract Multiply7 {
    event Print(uint);
    function multiply(uint input) returns (uint) {
        Print(input * 7);
        return input * 7;
    }
}
The first thing to do is make sure the HTTP RPC interface is enabled. This means we supply Geth with the --http flag on startup. In this example we use the Geth node on a private development chain. Using this approach we don't need ether on the real network.


Copy
// geth --http --dev console 2>>geth.log
This will start the HTTP RPC interface on http://localhost:8545.

We can verify that the interface is running by retrieving the coinbase address (by obtaining the first address from the array of accounts) and balance using curl. Please note that data in these examples will differ on your local node. If you want to try these commands, replace the request params in the second curl request with the result returned from the first.


Copy
// curl --data '{"jsonrpc":"2.0","method":"eth_accounts","params":[]", "id":1}' -H "Content-Type: application/json" localhost:8545
{"id":1,"jsonrpc":"2.0","result":["0x9b1d35635cc34752ca54713bb99d38614f63c955"]}
curl --data '{"jsonrpc":"2.0","method":"eth_getBalance", "params": ["0x9b1d35635cc34752ca54713bb99d38614f63c955", "latest"], "id":2}' -H "Content-Type: application/json" localhost:8545
{"id":2,"jsonrpc":"2.0","result":"0x1639e49bba16280000"}
Because numbers are hex encoded, the balance is returned in wei as a hex string. If we want to have the balance in ether as a number we can use web3 from the Geth console.


Copy
// web3.fromWei("0x1639e49bba16280000", "ether")
// "410"
Now that there is some ether on our private development chain, we can deploy the contract. The first step is to compile the Multiply7 contract to byte code that can be sent to the EVM. To install solc, the Solidity compiler, follow the Solidity documentation. (You might want to use an older solc release to match the version of compiler used for our example).

The next step is to compile the Multiply7 contract to byte code that can be send to the EVM.


Copy
// echo 'pragma solidity ^0.4.16; contract Multiply7 { event Print(uint); function multiply(uint input) public returns (uint) { Print(input * 7); return input * 7; } }' | solc --bin
======= <stdin>:Multiply7 =======
Binary:
6060604052341561000f57600080fd5b60eb8061001d6000396000f300606060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063c6888fa1146044575b600080fd5b3415604e57600080fd5b606260048080359060200190919050506078565b6040518082815260200191505060405180910390f35b60007f24abdb5865df5079dcc5ac590ff6f01d5c16edbc5fab4e195d9febd1114503da600783026040518082815260200191505060405180910390a16007820290509190505600a165627a7a7230582040383f19d9f65246752244189b02f56e8d0980ed44e7a56c0b200458caad20bb0029
Now that we have the compiled code we need to determine how much gas it costs to deploy it. The RPC interface has an eth_estimateGas method that will give us an estimate.


Copy
// curl --data '{"jsonrpc":"2.0","method": "eth_estimateGas", "params": [{"from": "0x9b1d35635cc34752ca54713bb99d38614f63c955", "data": "0x6060604052341561000f57600080fd5b60eb8061001d6000396000f300606060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063c6888fa1146044575b600080fd5b3415604e57600080fd5b606260048080359060200190919050506078565b6040518082815260200191505060405180910390f35b60007f24abdb5865df5079dcc5ac590ff6f01d5c16edbc5fab4e195d9febd1114503da600783026040518082815260200191505060405180910390a16007820290509190505600a165627a7a7230582040383f19d9f65246752244189b02f56e8d0980ed44e7a56c0b200458caad20bb0029"}], "id": 5}' -H "Content-Type: application/json" localhost:8545
{"jsonrpc":"2.0","id":5,"result":"0x1c31e"}
And finally deploy the contract.


Copy
// curl --data '{"jsonrpc":"2.0","method": "eth_sendTransaction", "params": [{"from": "0x9b1d35635cc34752ca54713bb99d38614f63c955", "gas": "0x1c31e", "data": "0x6060604052341561000f57600080fd5b60eb8061001d6000396000f300606060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063c6888fa1146044575b600080fd5b3415604e57600080fd5b606260048080359060200190919050506078565b6040518082815260200191505060405180910390f35b60007f24abdb5865df5079dcc5ac590ff6f01d5c16edbc5fab4e195d9febd1114503da600783026040518082815260200191505060405180910390a16007820290509190505600a165627a7a7230582040383f19d9f65246752244189b02f56e8d0980ed44e7a56c0b200458caad20bb0029"}], "id": 6}' -H "Content-Type: application/json" localhost:8545
{"id":6,"jsonrpc":"2.0","result":"0xe1f3095770633ab2b18081658bad475439f6a08c902d0915903bafff06e6febf"}
The transaction is accepted by the node and a transaction hash is returned. This hash can be used to track the transaction. The next step is to determine the address where our contract is deployed. Each executed transaction will create a receipt. This receipt contains various information about the transaction such as in which block the transaction was included and how much gas was used by the EVM. If a transaction creates a contract it will also contain the contract address. We can retrieve the receipt with the eth_getTransactionReceipt RPC method.


Copy
// curl --data '{"jsonrpc":"2.0","method": "eth_getTransactionReceipt", "params": ["0xe1f3095770633ab2b18081658bad475439f6a08c902d0915903bafff06e6febf"], "id": 7}' -H "Content-Type: application/json" localhost:8545
{"jsonrpc":"2.0","id":7,"result":{"blockHash":"0x77b1a4f6872b9066312de3744f60020cbd8102af68b1f6512a05b7619d527a4f","blockNumber":"0x1","contractAddress":"0x4d03d617d700cf81935d7f797f4e2ae719648262","cumulativeGasUsed":"0x1c31e","from":"0x9b1d35635cc34752ca54713bb99d38614f63c955","gasUsed":"0x1c31e","logs":[],"logsBloom":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","status":"0x1","to":null,"transactionHash":"0xe1f3095770633ab2b18081658bad475439f6a08c902d0915903bafff06e6febf","transactionIndex":"0x0"}}
Our contract was created on 0x4d03d617d700cf81935d7f797f4e2ae719648262. A null result instead of a receipt means the transaction has not been included in a block yet. Wait for a moment and check if your consensus client is running and retry it.

Interacting with smart contracts

In this example we will be sending a transaction using eth_sendTransaction to the multiply method of the contract.

eth_sendTransaction requires several arguments, specifically from, to and data. From is the public address of our account, and to is the contract address. The data argument contains a payload that defines which method must be called and with which arguments. This is where the ABI (application binary interface) comes into play. The ABI is a JSON file that defines how to define and encode data for the EVM.

The bytes of the payload defines which method in the contract is called. This is the first 4 bytes from the Keccak hash over the function name and its argument types, hex encoded. The multiply function accepts an uint which is an alias for uint256. This leaves us with:


Copy
// web3.sha3("multiply(uint256)").substring(0, 10)
// "0xc6888fa1"
The next step is to encode the arguments. There is only one uint256, say, the value 6. The ABI has a section which specifies how to encode uint256 types.

int<M>: enc(X) is the big-endian two’s complement encoding of X, padded on the higher-order (left) side with 0xff for negative X and with zero > bytes for positive X such that the length is a multiple of 32 bytes.

This encodes to 0000000000000000000000000000000000000000000000000000000000000006.

Combining the function selector and the encoded argument our data will be 0xc6888fa10000000000000000000000000000000000000000000000000000000000000006.

This can now be sent to the node:


Copy
// curl --data '{"jsonrpc":"2.0","method": "eth_sendTransaction", "params": [{"from": "0xeb85a5557e5bdc18ee1934a89d8bb402398ee26a", "to": "0x6ff93b4b46b41c0c3c9baee01c255d3b4675963d", "data": "0xc6888fa10000000000000000000000000000000000000000000000000000000000000006"}], "id": 8}' -H "Content-Type: application/json" localhost:8545
{"id":8,"jsonrpc":"2.0","result":"0x759cf065cbc22e9d779748dc53763854e5376eea07409e590c990eafc0869d74"}
Since a transaction was sent, a transaction hash was returned. Retrieving the receipt gives:


Copy
// {
   blockHash: "0xbf0a347307b8c63dd8c1d3d7cbdc0b463e6e7c9bf0a35be40393588242f01d55",
   blockNumber: 268,
   contractAddress: null,
   cumulativeGasUsed: 22631,
   gasUsed: 22631,
   logs: [{
      address: "0x6ff93b4b46b41c0c3c9baee01c255d3b4675963d",
      blockHash: "0xbf0a347307b8c63dd8c1d3d7cbdc0b463e6e7c9bf0a35be40393588242f01d55",
      blockNumber: 268,
      data: "0x000000000000000000000000000000000000000000000000000000000000002a",
      logIndex: 0,
      topics: ["0x24abdb5865df5079dcc5ac590ff6f01d5c16edbc5fab4e195d9febd1114503da"],
      transactionHash: "0x759cf065cbc22e9d779748dc53763854e5376eea07409e590c990eafc0869d74",
      transactionIndex: 0
  }],
  transactionHash: "0x759cf065cbc22e9d779748dc53763854e5376eea07409e590c990eafc0869d74",
  transactionIndex: 0
}
The receipt contains a log. This log was generated by the EVM on transaction execution and included in the receipt. The multiply function shows that the Print event was raised with the input times 7. Since the argument for the Print event was a uint256 we can decode it according to the ABI rules which will leave us with the expected decimal 42. Apart from the data it is worth noting that topics can be used to determine which event created the log:


Copy
// web3.sha3("Print(uint256)")
// "24abdb5865df5079dcc5ac590ff6f01d5c16edbc5fab4e195d9febd1114503da"
This was just a brief introduction into some of the most common tasks, demonstrating direct usage of the JSON-RPC.


Contracts Wizard
Introduction
This guide provides step-by-step instructions to deploy any smart contract on the BlockDAG blockchain. You’ll learn how to set up your development environment, write and compile the contract, and deploy it using the BlockDAG IDE Pro.

Wizard Link:  https://wizard.awakening.bdagscan.com/

Prerequisites
Before you start, ensure you have:

Basic knowledge of Solidity and smart contracts.

An EVM-compatible wallet such as metamask with the BlockDAG network.

Steps to add BlockDAG Network in Metamask Wallet
Open Metamask: Launch the Metamask extension


Access Network Settings

Click on the Network Selector dropdown at the top of the Metamask interface (usually showing "Ethereum Mainnet" by default).

Select "Add Network" or "Add a Network Manually".



Add a Custom RPC Network: In the "Add a network" screen, click "Add a network manually" to input the custom details.

Fill in Network Details
Enter the required blockchain network information:

Network Name: BlockDag.

RPC URL: The endpoint URL for the blockchain for Testnet: "https://relay.awakening.bdagscan.com"  

Chain ID: The unique ID for the BlockDAG blockchain (1043).

Currency Symbol: The native coin symbol (BDAG).

Tools: BlockDAG IDE Pro.


Part 1: Connecting to the BlockDAG Network
To add the BlockDAG network to the metamask, there are 2 options:

Method 1: To add the network with a single click

Connect MetaMask to BlockDAG Network

Open the BlockDAG Explorer.

Click on "Add BlockDAG Network" to automatically connect your wallet to the BlockDAG blockchain.


Method 2: Manually Adding Network

Alternatively, if you want to add the network manually, ensure your MetaMask is upgraded to version 12.9.2 or higher. Enter the following details in MetaMask:

Network Name: BlockDag

Default RPC URL:  https://relay.awakening.bdagscan.com

Chain ID: 1043

Currency Symbol: BDAG


Confirm Connection: Once the network is added, your MetaMask wallet will connect to the BlockDAG blockchain. Ensure you can see your wallet address and balance.

Part 2: Deploying Contracts Using BlockDAG IDE Pro
Open BlockDAG IDE Pro

Visit BlockDAG IDE Pro, link:

To open the File Explorer module, click on the Workspace option in the left-side menu. The File Explorer helps you manage your workspaces and files easily. 

You can also right-click on any file or folder to see a menu with quick options for different actions.

Ready to compile
Overview of the Ready to Compile Interface

Select Contract Navigation Panel

Located on the left-hand side, this panel provides quick navigation between the following key actions:

ERC20: For creating fungible tokens.

ERC721: For creating non-fungible tokens (NFTs).

ERC1155: For multi-token standards.

Stablecoin: For creating pegged assets.

Real-World Asset: For tokenizing tangible assets.

Governor: For building governance contracts.

Settings Panel

Located on the left side of the workspace, this section allows you to customize your smart contract with various options:

Name and Symbol: Specify the token's name and symbol (e.g., "My Token," "MTK").

Pre-mint: Define the initial supply of tokens to be minted upon contract creation.

Features:

Mintable: Enables token minting after deployment.

Burnable: Allows token holders to burn (destroy) tokens.

Pausable: Adds the ability to pause contract functionality in certain scenarios.

Permit: Enables gasless approvals using EIP-2612.

Flash Minting: Supports flash loans with immediate repayment.

Voting Options:

Block Number: Voting based on blockchain block numbers.

Timestamp: Voting based on timestamps.

Access Control:

Ownable: Grants ownership-based access control.

Roles: Enables role-based permissions for contract management.

Managed: Allows for advanced management of contract functionalities.

Upgradeability: Adds support for upgradable contracts.

 

Code Editor

The central area displays the generated Solidity code based on the selected options in the settings panel.

Users can preview, edit, or copy the code for further modifications.

The editor includes comments and import statements for necessary libraries like ERC20 and ERC20Permit.

Download Button

Located in the top-right corner, the "Download" button lets you export the generated Solidity code file for external use.

Copy Button

Located in the top-right corner, the "Copy" button lets you copy the code easily. 

Step-by-Step Instructions
Choose a Contract Type

Select the desired contract type (e.g., ERC20) from the tabs at the top.

 

Configure Contract Settings

Enter the Name and Symbol for your token.

Adjust additional settings like pre-minting, mintability, burnability, and more, depending on your use case.

 

Customize Access Control

Enable access control mechanisms such as ownership or roles.

Configure voting mechanisms based on block numbers or timestamps if applicable.

 

Preview and Edit the Code

Review the generated Solidity code in the editor.

Make manual changes if necessary to meet advanced or unique requirements.

 

Download the Code

Once satisfied with the contract, click the "Download" button to save the Solidity file for further compilation or deployment.

Compile
The Compile Tab is designed to simplify the compilation process for smart contracts. It ensures compatibility with different Solidity versions and EVM configurations, giving developers flexibility and control.


Step-by-Step Instructions
Select Contract Type

At the top, you will find options for different contract types such as ERC20, ERC721, ERC1155, Stablecoin, Real-World Asset, Governor, and Custom.

Click on the desired contract type to load the associated code template.

 

Configure Solidity Compiler

Compiler Dropdown:

Choose the Solidity compiler version compatible with your contract requirements (e.g., 0.8.22 or 0.8.19).

The dropdown allows you to select the compiler version for compatibility with various blockchain networks.

EVM Version Dropdown:

Select the EVM version (e.g., London, Istanbul) to ensure the contract complies with the target blockchain specifications.

 

View and Edit Code

The main editor displays the Solidity code for your selected contract template.

You can modify the code directly in the editor to customize parameters such as:

Token Name

Symbol

Premint Amount

 

Compile the Contract

Once you have configured the settings and edited the code:

Click the Compile button to generate the bytecode and ABI (Application Binary Interface).

Comment

A progress indicator will show the compilation status.

Successful Compilation:

If the contract compiles successfully, the interface will display the output.

Comment

Errors or warnings will be highlighted in the editor for easy debugging. 

Deploy
The Deploy Tab simplifies the deployment process for smart contracts, making it user-friendly and efficient. Here's how to navigate and use this section:


Step-by-Step Instructions
Step 1: Connect MetaMask 
Establishes a secure connection between your MetaMask wallet and BlockDAG IDE Pro for seamless deployment. Click the "Connect With MetaMask" button to link your wallet. Ensure that MetaMask is installed in your browser and you are logged in.

Step 2: Compile Your Contract

Ensure your contract is error-free and compiled successfully in the Compile Tab before proceeding to deployment.

Step 3: Deploy the Contract

Once connected to MetaMask, click the "Deploy" button. Confirm the transaction in MetaMask to initiate deployment.

Wait for the deployment process to complete. A transaction hash will be generated, and the Contract Address field will populate with the address.

Note: Ensure that your MetaMask wallet has sufficient funds for gas fees.

Tips for Using the Deploying Contract:

Check Gas Fees: Always ensure your wallet has enough funds to cover gas fees for deployment.

Comment

Network Selection: Double-check that the selected network in MetaMask matches the intended deployment network.

Comment

Save the Address: After deployment, save your contract address for future reference or integration.

Deployed
The "Deployed" screen confirms that the contract has been successfully deployed. Once deployment is complete, the contract address will appear in the left-side contract address field, where you can easily copy it for future use.


Step 1: Verify & Publish

Click the Verify & Publish button after deployment. This action validates your contract’s source code and publishes it within BlockDAG IDE Pro, and users don't need to verify the contract on BlockDAG Explorer, allowing users to interact with and review the contract within BlockDAG IDE Pro.

Step 2: Verified

Once the contract is successfully verified and published, the status will update to "Verified". Users can then copy the contract address and search for it on BDAG Scan to check its status in the Contract List screen.


Additionally, users can verify the contract directly on BDAG Scan by clicking the block icon next to the copy button. This will take them to a page where they can generate a flattened file, copy the contract code, and proceed with verification on the BDAG Scan Contract Verification screen.