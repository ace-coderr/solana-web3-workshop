"use client";

import React, { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import Dashboard from "./Dashboard";

export default function ParentComponent() {
  const [mintAddr, setMintAddr] = useState<PublicKey | null>(null);

  return <Dashboard mintAddr={mintAddr} setMintAddr={setMintAddr} />;
}
