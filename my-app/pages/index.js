import { BigNumber, providers, utils } from "ethers";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import styles from "../styles/Home.module.css";
import { addLiquidity, calculateCD } from "../utils/addLiquidity";
import {
  getCDTokensBalance,
  getEtherBalance,
  getLPTokensBalance,
  getReserveOfCDTokens,
} from "../utils/getAmounts";
import {
  getTokensAfterRemove,
  removeLiquidity,
} from "../utils/removeLiquidity";
import { swapTokens, getAmountOfTokensReceivedFromSwap } from "../utils/swap";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [liquidityTab, setLiquidityTab] = useState(true);
  const zero = BigNumber.from(0);

  const [ethBalance, setEtherBalance] = useState(zero);
  const [reservedCD, setReservedCD] = useState(zero);
  const [etherBalanceContract, setEtherBalanceContract] = useState(zero);
  const [cdBalance, setCDBalance] = useState(zero);
  const [lpBalance, setLPBalance] = useState(zero);

  const [addEther, setAddEther] = useState(zero);
  const [addCDTokens, setAddCDTokens] = useState(zero);
  const [removeEther, setRemoveEther] = useState(zero);
  const [removeCD, setRemoveCD] = useState(zero);
  const [removeLPTokens, setRemoveLPTokens] = useState("0");

  const [swapAmount, setSwapAmount] = useState("");
  const [tokenToBeReceivedAfterSwap, settokenToBeReceivedAfterSwap] =
    useState(zero);
  const [ethSelected, setEthSelected] = useState(true);

  const web3ModalRef = useRef();
  const [walletConnected, setWalletConnected] = useState(false);

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // 🔥 Network check disabled for now (so it always works)

    if (needSigner) {
      return web3Provider.getSigner();
    }
    return web3Provider;
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getAmounts = async () => {
    try {
      const provider = await getProviderOrSigner(false);
      const signer = await getProviderOrSigner(true);
      const address = await signer.getAddress();

      const _ethBalance = await getEtherBalance(provider, address);
      const _cdBalance = await getCDTokensBalance(provider, address);
      const _lpBalance = await getLPTokensBalance(provider, address);
      const _reservedCD = await getReserveOfCDTokens(provider);
      const _ethBalanceContract = await getEtherBalance(provider, null, true);

      setEtherBalance(_ethBalance);
      setCDBalance(_cdBalance);
      setLPBalance(_lpBalance);
      setReservedCD(_reservedCD);
      setEtherBalanceContract(_ethBalanceContract);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "localhost",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      getAmounts();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Crypto Devs Exchange</title>
      </Head>

      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>🚀 Crypto Devs Exchange</h1>
          <p className={styles.description}>
            Swap ETH ↔ CryptoDev Tokens on Local Blockchain
          </p>

          {!walletConnected ? (
            <button onClick={connectWallet} className={styles.button}>
              Connect Wallet
            </button>
          ) : (
            
            <div>
  <p>Wallet Connected ✅</p>

  <p>
    ETH Balance:{" "}
    {ethBalance ? utils.formatEther(ethBalance) : "0"}
  </p>

  <p>
    CD Tokens:{" "}
    {cdBalance ? utils.formatEther(cdBalance) : "0"}
  </p>

  <div style={{ marginTop: "20px" }}>
    <h3>🚀 Actions</h3>

    {/* SWAP */}
    <div>
      <input
        type="text"
        placeholder="Amount to swap (ETH)"
        onChange={(e) => setSwapAmount(e.target.value)}
      />

      <button
        className={styles.button}
        onClick={async () => {
          try {
            const signer = await getProviderOrSigner(true);
            const swapAmountWei = utils.parseEther(swapAmount || "0");

            await swapTokens(signer, swapAmountWei, 0, true);

            alert("Swap Successful!");
            getAmounts();
          } catch (err) {
            console.error(err);
          }
        }}
      >
        Swap Tokens
      </button>
    </div>

    {/* ADD LIQUIDITY */}
    <div style={{ marginTop: "10px" }}>
      <input
        type="text"
        placeholder="ETH amount"
        onChange={(e) => setAddEther(e.target.value)}
      />

      <input
        type="text"
        placeholder="CD Tokens amount"
        onChange={(e) => setAddCDTokens(e.target.value)}
        style={{ marginLeft: "5px" }}
      />

      <button
        className={styles.button}
        onClick={async () => {
          try {
            const signer = await getProviderOrSigner(true);

            const addEtherWei = utils.parseEther(addEther || "0");
            const addCDWei = utils.parseEther(addCDTokens || "0");

            await addLiquidity(signer, addCDWei, addEtherWei);

            alert("Liquidity Added!");
            getAmounts();
          } catch (err) {
            console.error(err);
          }
        }}
      >
        Add Liquidity
      </button>
    </div>

    {/* REMOVE LIQUIDITY */}
    <div style={{ marginTop: "10px" }}>
      <input
        type="text"
        placeholder="LP Tokens to remove"
        onChange={(e) => setRemoveLPTokens(e.target.value)}
      />

      <button
        className={styles.button}
        onClick={async () => {
          try {
            const signer = await getProviderOrSigner(true);

            const removeLPWei = utils.parseEther(removeLPTokens || "0");

            await removeLiquidity(signer, removeLPWei);

            alert("Liquidity Removed!");
            getAmounts();
          } catch (err) {
            console.error(err);
          }
        }}
      >
        Remove Liquidity
      </button>
    </div>
  </div>
</div>
          )}
        </div>

        <div>
          <img className={styles.image} src="./cryptodev.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made by Sabari 🚀
      </footer>
    </div>
  );
}