import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import bulkJSON from "./BulkABI.json";

const App = () => {
  const [idArray, setIdArray] = useState([]);
  const [count, setCount] = useState(0);

  // goes in .env file
  const URI =
    "https://nftstorage.link/ipfs/QmeQdwMk2ZR7TeBqR1vs4sWsTq4fHJRQPhZbzjc4Dv1bQr";
  const contractAddr = "0xa47FfA594c2acAf5b2Ca64C11fC5C32FE16189F8";

  const [tokenInfo, setTokenInfo] = useState({
    tokenName: "",
    max_mint: 0,
    currentIndex: 0,
  });
  const [balanceInfo, setBalanceInfo] = useState({
    address: "",
    balance: "",
  });
  const [val, setVal] = useState(0);
  const handleConnect = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();

    const bulk = new ethers.Contract(contractAddr, bulkJSON, provider);

    //fetch data
    const tokenName = await bulk.name();
    const balance = await bulk.balanceOf(signerAddress);
    const maxMint = await bulk.MINT_LIMIT();
    const count = await bulk.currentIndex();

    //give data to state
    setTokenInfo({ tokenName, max_mint: Number(maxMint) });
    setBalanceInfo({
      address: signerAddress,
      balance: String(balance),
    });
    setCount(count);
  };

  const handleMint = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();

    const bulk = new ethers.Contract(contractAddr, bulkJSON, signer);

    //Mint NFTs
    await bulk.mintBulk(signerAddress, val, URI, {
      value: ethers.utils.parseEther(`${val}`),
    });

    // update webite state
    const tokenName = await bulk.name();
    const balance = await bulk.balanceOf(signerAddress);
    const maxMint = await bulk.MINT_LIMIT();
    const count = await bulk.currentIndex();

    setTokenInfo({ tokenName, max_mint: Number(maxMint) });
    setBalanceInfo({
      address: signerAddress,
      balance: String(balance),
    });
    setCount(count);
    setIdArray([]);
  };

  return (
    <>
      <button onClick={handleConnect}>Connect</button>
      <div>
        <span>{tokenInfo.tokenName} collection</span>
      </div>
      <div>
        <span>Your Address- {balanceInfo.address}</span>
      </div>
      <div>
        <span>Your Balance- {balanceInfo.balance}</span>
      </div>
      <div>
        <h2>Mint your NFT</h2>
        <input
          type="text"
          pattern="[0-9]*"
          value={val}
          onChange={(e) =>
            setVal((v) => (e.target.validity.valid ? e.target.value : v))
          }
        />
        <button
          onClick={() => {
            let arr = [];
            for (let i = 1; i <= val; i++) {
              arr.push(i + Number(count));
            }
            setIdArray(arr);
            console.log(idArray);
          }}
        >
          Search
        </button>
        {idArray.length != 0 &&
          idArray.map((e, i) => {
            return (
              <div key={i}>
                <img
                  alt="NFT"
                  src={`https://nftstorage.link/ipfs/QmRq47bhx4LkkwMuQskDpzeSAVbRvu6jFfcqRbAUawF1Sf/${e}.png`}
                  width="180px"
                  height="180px"
                />
                <div>ID- {e}</div>
              </div>
            );
          })}
        {idArray.length != 0 && <button onClick={handleMint}>Mint</button>}
      </div>
    </>
  );
};

export default App;
