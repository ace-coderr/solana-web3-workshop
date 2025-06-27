// import { useState } from "react";
// import * as web3 from "@solana/web3.js";
// import * as token from "@solana/spl-token";
// import { toast } from "react-toastify";
// import { useConnection, useWallet } from "@solana/wallet-adapter-react";

// interface MintTokensProps {
//     mintAddr: string;
//     accAddr: string;
// }

// export default function MintTokens({ mintAddr, accAddr }: MintTokensProps) {
//     const { publicKey, sendTransaction } = useWallet();
//     const { connection } = useConnection();

//     const [tokensToMint, setTokensToMint] = useState<number>(0);
//     const [loading, setLoading] = useState(false);

//     const handleMintTokens = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();

//         if (!connection || !publicKey) {
//             toast.error("Please connect your wallet");
//             return;
//         }

//         if (!mintAddr || !accAddr) {
//             toast.error("Missing mint or token account");
//             return;
//         }

//         try {
//             setLoading(true);
//             const tx = new web3.Transaction();

//             const mintInstruction = token.createMintToInstruction(
//                 new web3.PublicKey(mintAddr),
//                 new web3.PublicKey(accAddr),
//                 publicKey,
//                 BigInt(tokensToMint * 10 ** 6)
//             );

//             tx.add(mintInstruction);

//             const sig = await sendTransaction(tx, connection);
//             await connection.confirmTransaction(sig, "confirmed");
//             toast.success("Tokens minted!");
//         } catch (err) {
//             console.error("Mint error:", err);
//             toast.error("Failed to mint tokens");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <form onSubmit={handleMintTokens} className="bg-[#2a302f] p-6 rounded-lg shadow-lg">
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-2xl font-bold text-[#fa5ece]">Mint Tokens</h2>
//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="px-4 py-1 rounded bg-pink-600 text-white"
//                 >
//                     {loading ? "Minting..." : "Mint"}
//                 </button>
//             </div>
//             <input
//                 type="number"
//                 placeholder="Number of tokens"
//                 className="w-full mt-2 bg-transparent border-b border-white text-white outline-none"
//                 value={tokensToMint}
//                 onChange={(e) => setTokensToMint(Number(e.target.value))}
//             />
//         </form>
//     );
// }