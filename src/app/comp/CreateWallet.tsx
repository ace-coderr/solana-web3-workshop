import { Keypair } from "@solana/web3.js"


const CreateWallet = () => {

    const create = Keypair.generate();

    return create
}