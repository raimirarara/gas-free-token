pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract MyERC20 is ERC20PresetMinterPauser {
    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        address[] memory _recipients, 
        uint256[] memory _amounts
    ) ERC20PresetMinterPauser(_tokenName, _tokenSymbol) {
        setupMinterRole(msg.sender);
        setupBurnerRole(msg.sender);
        _bulkMint(_recipients, _amounts);
    }

    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    function setupMinterRole(address _minter) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "must have admin role to setup minter"
        );
        _setupRole(MINTER_ROLE, _minter);
    }

    function revokeMinterRole(address _minter) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "must have admin role to setup minter"
        );
        _revokeRole(MINTER_ROLE, _minter);
    }

    function setupBurnerRole(address _burner) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "must have admin role to setup burner"
        );
        _setupRole(BURNER_ROLE, _burner);
    }

    function revokeBurnerRole(address _burner) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "must have admin role to setup burner"
        );
        _revokeRole(BURNER_ROLE, _burner);
    }

    function burn(address holder, uint256 _amount) public {
        require(
            hasRole(BURNER_ROLE, msg.sender),
            "must have burner role to burn"
        );
        _burn(holder, _amount);
    }

    function _bulkMint(address[] memory _recipients, uint256[] memory _amounts)
        internal
    {
        require(
            hasRole(MINTER_ROLE, msg.sender),
            "must have minter role to mint"
        );
        require(
            _recipients.length == _amounts.length,
            "recipients and amounts length mismatch"
        );
        for (uint256 i = 0; i < _recipients.length; i++) {
            _mint(_recipients[i], _amounts[i]);
        }
    }
}
