// ===== TOKEN ABI (simple ERC20) =====
export const TOKEN_CONTRACT_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

// ===== TOKEN ADDRESS =====
export const TOKEN_CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// ===== EXCHANGE ABI =====
export const EXCHANGE_CONTRACT_ABI = [
  "function addLiquidity(uint256 _amount) payable returns (uint256)",
  "function removeLiquidity(uint256 _amount) returns (uint256, uint256)",
  "function getReserve() view returns (uint256)",
  "function getAmountOfTokens(uint256 inputAmount, uint256 inputReserve, uint256 outputReserve) pure returns (uint256)",
  "function ethToCryptoDevToken(uint256 _minTokens) payable",
  "function cryptoDevTokenToEth(uint256 _tokensSold, uint256 _minEth)",
  "function balanceOf(address) view returns (uint256)"
];

// ===== EXCHANGE ADDRESS =====
export const EXCHANGE_CONTRACT_ADDRESS =
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";