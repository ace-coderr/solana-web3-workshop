import React from "react";
import ParentComponent from "./comp/ParentComponent";

export default function Home() {
  return <ParentComponent />
}






// "use client";


// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
// import {
//   Connection,
//   PublicKey,
//   SystemProgram,
//   Transaction,
//   LAMPORTS_PER_SOL,
//   ParsedAccountData,
// } from "@solana/web3.js";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { useEffect, useState } from "react";
// import {
//   TOKEN_PROGRAM_ID,
//   getAssociatedTokenAddress,
//   createAssociatedTokenAccountInstruction,
//   createTransferInstruction,
// } from "@solana/spl-token";
// import CreateMint from "./comp/CreateMint";

// const connection = new Connection("https://api.devnet.solana.com");

// export default function Home() {
//   const { publicKey, sendTransaction } = useWallet();
//   const [recipient, setRecipient] = useState("");
//   const [amount, setAmount] = useState("");
//   const [status, setStatus] = useState("");
//   const [solBalance, setSolBalance] = useState(0);
//   const [splTokens, setSplTokens] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (publicKey) {
//       fetchBalance();
//       fetchSPLTokens();
//     }
//   }, [publicKey]);

//   const fetchBalance = async () => {
//     if (!publicKey) return;
//     const lamports = await connection.getBalance(publicKey);
//     setSolBalance(lamports / LAMPORTS_PER_SOL);
//   };

//   const fetchSPLTokens = async () => {
//     if (!publicKey) return;

//     try {
//       const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
//         publicKey,
//         { programId: TOKEN_PROGRAM_ID }
//       );

//       const tokens = tokenAccounts.value.map((accountInfo) => {
//         const info = accountInfo.account.data.parsed.info;
//         return {
//           mint: info.mint,
//           amount: info.tokenAmount.uiAmountString,
//         };
//       });

//       setSplTokens(tokens);
//     } catch (err) {
//       console.error("Failed to fetch SPL tokens:", err);
//     }
//   };

//   const sendSol = async () => {
//     if (!publicKey || !recipient || !amount) {
//       setStatus("❗ Missing recipient or amount.");
//       return;
//     }

//     try {
//       const toPubkey = new PublicKey(recipient);
//       const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

//       const transaction = new Transaction().add(
//         SystemProgram.transfer({
//           fromPubkey: publicKey,
//           toPubkey,
//           lamports,
//         })
//       );

//       const signature = await sendTransaction(transaction, connection);
//       setStatus("✅ Transaction sent! Signature: " + signature);
//       await connection.confirmTransaction(signature, "confirmed");
//       await fetchBalance();
//     } catch (err) {
//       setStatus("❌ Error: " + (err instanceof Error ? err.message : String(err)));
//     }
//   };


//   const sendSPL = async (mint: string) => {
//     if (!publicKey || !recipient || !amount) {
//       setStatus("❗ Missing recipient or amount.");
//       return;
//     }

//     try {
//       setIsLoading(true);

//       const recipientPublicKey = new PublicKey(recipient);
//       const mintPublicKey = new PublicKey(mint);

//       const senderATA = await getAssociatedTokenAddress(mintPublicKey, publicKey);
//       const recipientATA = await getAssociatedTokenAddress(mintPublicKey, recipientPublicKey, true);

//       const tx = new Transaction();
//       const checkATA = await connection.getAccountInfo(recipientATA);

//       if (!checkATA) {
//         tx.add(
//           createAssociatedTokenAccountInstruction(
//             publicKey,
//             recipientATA,
//             recipientPublicKey,
//             mintPublicKey
//           )
//         );
//       }

//       const decimals = await getTokenDecimals(mintPublicKey);
//       const amountBigInt = BigInt(Math.floor(parseFloat(amount) * 10 ** decimals));

//       tx.add(
//         createTransferInstruction(
//           senderATA,
//           recipientATA,
//           publicKey,
//           amountBigInt
//         )
//       );

//       const signature = await sendTransaction(tx, connection);
//       setStatus("✅ SPL Token sent! Signature: " + signature);
//       await connection.confirmTransaction(signature, "confirmed");
//       await fetchSPLTokens();
//       setIsLoading(false);
//     } catch (err) {
//       setStatus("❌ Error: " + (err instanceof Error ? err.message : String(err)));
//       setIsLoading(false);
//     }
//   };

//   const getTokenDecimals = async (mint: PublicKey) => {
//     const info = await connection.getParsedAccountInfo(mint);
//     if (!info.value) throw new Error("Failed to fetch token decimals");
//     return (info.value.data as ParsedAccountData).parsed.info.decimals as number;
//   };

//   const airdropSol = async () => {
//     if (!publicKey) return;
//     try {
//       setStatus("⏳ Requesting 1 SOL airdrop...");
//       const sig = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
//       await connection.confirmTransaction(sig, "confirmed");
//       setStatus("✅ Airdrop successful! Signature: " + sig);
//       await fetchBalance();
//     } catch (err) {
//       setStatus("❌ Airdrop failed: " + (err instanceof Error ? err.message : String(err)));
//     }
//   };

//   return (
//     <div className="min-h-screen p-10 flex flex-col items-center gap-6 bg-gray-100">
//       <WalletMultiButton />

//       {publicKey && (
//         <div className="bg-black p-6 rounded-md shadow-md text-center w-full max-w-md">
//           <p className="font-semibold mb-2 text-gray-700">Connected Wallet:</p>
//           <p className="text-sm break-all text-green-700 mb-4">
//             {publicKey.toBase58()}
//           </p>

//           <p className="mb-4">💰 SOL Balance: {solBalance.toFixed(4)} SOL</p>

//           <button onClick={airdropSol} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
//             🚀 Airdrop 1 SOL
//           </button>

//           <input
//             type="text"
//             placeholder="Recipient Address"
//             value={recipient}
//             onChange={(e) => setRecipient(e.target.value)}
//             className="border p-2 mb-2 w-full rounded"
//           />
//           <input
//             type="number"
//             placeholder="Amount"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//             className="border p-2 mb-4 w-full rounded"
//           />

//           <div className="flex gap-4 justify-center">
//             <button onClick={sendSol} className="bg-green-500 text-white px-4 py-2 rounded">
//               ✅ Send SOL
//             </button>
//             <button
//               onClick={() => {
//                 setRecipient("");
//                 setAmount("");
//                 setStatus("");
//               }}
//               className="bg-red-500 text-white px-4 py-2 rounded"
//             >
//               ❌ Reset
//             </button>
//           </div>

//           {status && <p className="mt-4 text-sm text-blue-700 break-all">{status}</p>}

//           <hr className="my-4 border-gray-300" />

//           <h3 className="font-bold text-lg mb-2">🪙 SPL Tokens</h3>
//           <ul className="text-left text-sm">
//             {splTokens.length === 0 && <li>No tokens found</li>}
//             {splTokens.map((token, index) => (
//               <li key={index} className="mb-2">
//                 <strong>Mint:</strong> {token.mint}
//                 <br />
//                 <strong>Balance:</strong> {token.amount}
//                 <br />
//                 <button
//                   onClick={() => sendSPL(token.mint)}
//                   className="mt-1 bg-green-500 text-white px-2 py-1 text-xs rounded"
//                 >
//                   🔄 Send SPL
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }


