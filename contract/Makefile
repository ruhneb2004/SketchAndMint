-include .env

build:
	@forge build

test:
	@forge test

deploy-sepolia:
	@forge script script/DeploySonthamNft.s.sol:DeploySonthamNft --rpc-url $(SEPOLIA_RPC_URL) --account $(ACCOUNT) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY)

deploy-base-sepolia:
	@forge script script/DeploySonthamNft.s.sol:DeploySonthamNft --rpc-url $(BASE_SEP_RPC_URL) --account $(ACCOUNT) --broadcast --verify --etherscan-api-key $(BASESCAN_API_KEY)