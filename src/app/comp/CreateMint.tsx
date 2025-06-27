"use client";

import { useState } from "react";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import { toast } from "react-toastify";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ArrowTopRightOnSquareIcon as ExternalLinkIcon } from "@heroicons/react/24/outline";
import React from "react";

interface CreateMintProps {
    onMintCreated: (mint: web3.PublicKey) => void;
}

export default function CreateMint({ onMintCreated }: CreateMintProps) {
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();

    const [tokensToMint, setTokensToMint] = useState<number>(0);

    const [mintTx, setMintTx] = useState("");
    const [mintAddress, setMintAddress] = useState<web3.PublicKey | null>(null);

    const connectionErr = () => {
        if (!publicKey || !connection) {
            toast.error("Please connect your wallet");
            return true;
        }
        return false;
    };

    const createMint = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (connectionErr()) return;

        try {
            if (!publicKey) {
                console.error("Public Key is null, Ensure wallet is connected");
                return;
            }
            const tokenMint = web3.Keypair.generate();
            const lamports = await token.getMinimumBalanceForRentExemptAccount(connection);
            const transaction = new web3.Transaction()

            transaction.add(
                web3.SystemProgram.createAccount({
                    fromPubkey: publicKey,
                    newAccountPubkey: tokenMint.publicKey,
                    space: token.MINT_SIZE,
                    lamports,
                    programId: token.TOKEN_PROGRAM_ID,
                }),
                token.createInitializeMintInstruction(
                    tokenMint.publicKey,
                    6,
                    publicKey,
                    null,
                    token.TOKEN_PROGRAM_ID)
            );

            const ata = await token.getAssociatedTokenAddress(
                tokenMint.publicKey,
                publicKey,
                false,
                token.TOKEN_PROGRAM_ID,
                token.ASSOCIATED_TOKEN_PROGRAM_ID
            );

            transaction.add(
                token.createAssociatedTokenAccountInstruction(
                    publicKey,
                    ata,
                    publicKey,
                    tokenMint.publicKey,
                    token.TOKEN_PROGRAM_ID,
                    token.ASSOCIATED_TOKEN_PROGRAM_ID
                )
            );
            transaction.add(token.createMintToInstruction(
                tokenMint.publicKey,
                ata,
                publicKey,
                BigInt(tokensToMint * 10 ** 6)
            ))
            const signature = await sendTransaction(transaction, connection, {
                signers: [tokenMint],
            });
            setMintTx(signature);
            setMintAddress(tokenMint.publicKey);
            onMintCreated(tokenMint.publicKey);
            toast.success("Mint created successfully!");
            console.log("✅ Mint Created:", tokenMint.publicKey.toBase58());
        } catch (error) {
            toast.error(`Error creating Token Mint`);
            console.error("Mint Error", error);
        }
    };

    const mintOutput = [{
        title: "Token Mint Address:",
        dependency: mintAddress,
        href: mintAddress ? `https://explorer.solana.com/address/${mintAddress.toBase58()}?cluster=devnet` : "",
    },
    {
        title: "Transaction Signature:",
        dependency: mintTx,
        href: mintTx ? `https://explorer.solana.com/tx/${mintTx}?cluster=devnet` : "",
    },
    ];

    return (
        <form onSubmit={createMint} className="bg-[#2a302f] p-6 rounded-lg border border-red-500">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-2xl text-[#fa6ece]">Create Token Mint</h2>
                <button className={`px-4 py-1 rounded bg-pink-500 text-white cursor-pointer`}
                >
                    Submit
                </button>
            </div>
            <input
                type="number"
                placeholder="Number of tokens"
                className="w-full mt-2 bg-transparent border-b border-white text-white outline-none"
                value={tokensToMint}
                onChange={(e) => setTokensToMint(Number(e.target.value))}
            />
            <div className="text-sm font-semibold bg-[#222524] border-gray-500 rounded-lg p-2">
                <ul className="space-y-2">
                    {mintOutput.map(({ title, dependency, href }) => (
                        <li key={title} className="flex-justify-between items-center">
                            <span className="tracking-wider" >{title}</span>
                            {dependency && (
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#80efff] italic hover:text-white transition-all duration-200"
                                >
                                    {dependency.toString().slice(0, 25)}...
                                    <ExternalLinkIcon className="w-4 h-4 ml-1" />
                                </a>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </form>
    )
}