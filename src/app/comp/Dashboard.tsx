/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { PublicKey } from "@solana/web3.js";
import CreateMint from "./CreateMint";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import MintTokens from "./MintTokens";


type DashboardProps = {
    mintAddr: PublicKey | null;
    setMintAddr: (mint: PublicKey | null) => void;
};

export default function Dashboard({ mintAddr, setMintAddr }: DashboardProps) {
    const [tokenAccountAddr, setTokenAccountAddr] = React.useState<PublicKey | null>(null);

    return (
        <main className="min-h-screen bg-gray-900 text-white p-4">
            {/* Top bar with Wallet Button */}

            <div className="flex justify-end mb-6">
                <WalletMultiButton className="!bg-pink-600 hover:!bg-pink-700 text-white px-4 py-2 rounded" />
            </div>

            <CreateMint onMintCreated={setMintAddr} />

            {/* <div className="mt-8"> */}
                {/* <CreateTokenAccount mintAddr={mintAddr} onAccountCreated={setTokenAccountAddr} /> */}
            {/* </div> */}

            <div className="mt-8">
                {mintAddr && tokenAccountAddr && (
                    <MintTokens
                        mintAddr={mintAddr.toBase58()}
                        accAddr={tokenAccountAddr.toBase58()}
                    />
                )}
            </div>
        </main>
    );
}