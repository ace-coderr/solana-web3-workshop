"use client"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { useEffect, useState } from "react";

const connection = new Connection("https://api.devnet.solana.com");

export default function Home() {
  const [address, setAddress] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const { publicKey } = useWallet();
  const [solBalance, setBalance] = useState(0)

  useEffect(() => {
    const get = async () => {

      await getSolBalance();
    }
    get();

  }, [!publicKey]);



  const wallet = () => {
    const create = CreateWallet();

    const address = create.publicKey.toString();
    setAddress(create.publicKey.toString());
    const privatekey = bs58.encode(create.secretKey);
    setPrivateKey(privatekey);
  }

  const getSolBalance = async (p0?: number) => {
    if (!publicKey) return;

    const balance = await connection.getBalance(publicKey).then((info) => {
      console.log(info); if (info) {
        getSolBalance(info / LAMPORTS_PER_SOL);
      }
    });
    return balance;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <WalletMultiButton />

      {publicKey ?
        <>
          <button onClick={wallet}>Create Wallet</button>
          <p>Address: {address}</p>
          <p>Private Key: {privateKey}</p>
        </>

        : null}

    </div>
  );
}

function CreateWallet() {
  return Keypair.generate();
}
