// "use client";

// import { useEffect, useState } from "react";
// import * as web3 from "@solana/web3.js";
// import * as token from "@solana/spl-token";
// import { toast } from "react-toastify";
// import { useConnection, useWallet } from "@solana/wallet-adapter-react";
// import { ArrowTopRightOnSquareIcon as ExternalLinkIcon } from "@heroicons/react/24/outline";
// import React from "react";

// type CreateTokenAccountProps = {
//     mintAddr: web3.PublicKey;
//     onAccountCreated: (publicKey: web3.PublicKey) => void;
// };

// export default function CreateTokenAccount({ mintAddr, onAccountCreated }: CreateTokenAccountProps) {
//     const { publicKey, sendTransaction } = useWallet();
//     const { connection } = useConnection();

//     const [accTx, setAccTx] = useState("");
//     const [accAddr, setAccAddr] = useState<web3.PublicKey | null>(null);
//     const [loading, setLoading] = useState(false);

//     const connectionErr = () => {
//         if (!publicKey || !connection) {
//             toast.error("Please connect your wallet");
//             return true;
//         }
//         return false;
//     };

//     const createAccount = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (loading || connectionErr()) return;

//         if (!mintAddr) {
//             toast.error("Please create a mint first");
//             return;
//         }

//         try {
//             setLoading(true);

//             if (!publicKey) throw new Error("Wallet not connected");

//             const ata = await token.getAssociatedTokenAddress(
//                 mintAddr,
//                 publicKey,
//                 false,
//                 token.TOKEN_PROGRAM_ID,
//                 token.ASSOCIATED_TOKEN_PROGRAM_ID
//             );

//             const info = await connection.getAccountInfo(ata);
//             if (info) {
//                 toast.info("Token account already exists");
//                 setAccAddr(ata);
//                 onAccountCreated(ata);
//                 return;
//             }

//             const tx = new web3.Transaction().add(
//                 token.createAssociatedTokenAccountInstruction(
//                     publicKey,
//                     ata,
//                     publicKey,
//                     mintAddr,
//                     token.TOKEN_PROGRAM_ID,
//                     token.ASSOCIATED_TOKEN_PROGRAM_ID
//                 )
//             );

//             const signature = await sendTransaction(tx, connection);
//             await connection.confirmTransaction(signature, "confirmed");

//             setAccTx(signature);
//             setAccAddr(ata);
//             toast.success("Associated Token Account created");
//             onAccountCreated(ata);
//         } catch (e) {
//             toast.error("Error creating token account");
//             console.error("Account creation error:", e);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (mintAddr) {
//             console.log("✅ Mint Address set:", mintAddr.toBase58());
//         }
//     }, [mintAddr]);

//     type AccOutput = {
//         title: string;
//         dependency: string | web3.PublicKey | null;
//         href: string | null;
//     };

//     const accOutPuts: AccOutput[] = [
//         {
//             title: "Token Account Address",
//             dependency: accAddr,
//             href: accAddr ? `https://explorer.solana.com/address/${accAddr.toBase58()}?cluster=devnet` : null,
//         },
//         {
//             title: "Account Transaction Signature",
//             dependency: accTx,
//             href: accTx ? `https://explorer.solana.com/tx/${accTx}?cluster=devnet` : null,
//         },
//     ];

//     return (
//         <form onSubmit={createAccount} className="bg-[#2a302f] p-6 rounded-lg shadow-lg border border-blue-500">
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="font-bold text-2xl text-[#fa6ece]">Create Token Account ⚡</h2>
//                 <button disabled={loading} className={`px-4 py-1 rounded bg-pink-500 text-white ${loading ? 'opacity-50 cursor-pointer' : ''}`}
//                 >
//                     {loading ? "Creating..." : "Submit"}
//                 </button>
//             </div>
//             <div className="text-sm font-semibold bg-[#222524] border border-gray-500 rounded-lg p-2">
//                 <ul className="space-y-2">
//                     {accOutPuts.map(({ title, dependency, href }) => (
//                         <li key={title} className="flex justify-between items-center">
//                             <span className="tracking-wider">{title}</span>
//                             {dependency && (
//                                 <a
//                                     href={href ?? undefined}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-[#80efff] italic hover:text-white transition-all duration-200"
//                                     title={dependency.toString()}
//                                 >
//                                     {dependency.toString().slice(0, 8)}...{dependency.toString().slice(-8)}
//                                     <ExternalLinkIcon className="w-4 h-4 ml-1 inline-block" />
//                                 </a>
//                             )}
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </form>
//     );
// }
