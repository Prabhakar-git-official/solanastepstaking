
import './App.css';
import { useEffect, useState } from "react";
//import idl from "./idl.json";
import idl from "./step_staking.json";
import {Token} from "@solana/spl-token";
import { TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {NATIVE_MINT, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createSyncNativeInstruction, getAccount} from "@solana/spl-token";
//import { program, stakeMintAddress,findStakeMintAuthorityPDA } from "./contractpara/config.ts";
//import { createMints } from "../../scripts/create-mints";
import { Connection, PublicKey, clusterApiUrl,SYSVAR_RENT_PUBKEY,LAMPORTS_PER_SOL ,Keypair} from "@solana/web3.js";
import {
	Program,
	AnchorProvider,
	web3,
	BN,
} from "@project-serum/anchor";

import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import step from "./keys/step.json";
import xstep from "./keys/xstep.json";


import { Buffer } from "buffer";


window.Buffer = Buffer;
const anchor = require("@project-serum/anchor");
const utils = require("./utils");
const programId = new PublicKey(idl.metadata.address);

//const pdaSeed1 = 'base_account22';
let lamports = LAMPORTS_PER_SOL;
const network = clusterApiUrl("devnet");
const opts = {
	preflightCommitment: "processed",
};
const { SystemProgram } = web3;
const connection = new Connection(network, opts.preflightCommitment);
const App =  () =>{
const [walletAddress, setWalletAddress] = useState(null);
const wallet = useWallet();
  // const [campaigns, setCampaigns] = useState([]);
  // const [beefTokenBag, setbeefTokenBag] = useState([]);
  // const [stakeTokenBag, setstakeTokenBag] = useState([]);
  // @ts-ignore
//const beefData = JSON.parse(beefseed);
const PROGRAM_ID = new anchor.web3.PublicKey(
  "AGcJCXwEgm3xX1QB66sGK7vCpZb6Hb9LkjMSzdEHk6XS"
);
// let step = new anchor.web3.PublicKey("FM1pqK1dgkFkXdzrKvokih9ysghepFGfSUisoRP9iJRP");
// let xStep = new anchor.web3.PublicKey("AAauevpr6WeFNdRtoG2JMX8czBQyKdm2N2X52CziXAoy");

const getProvider = () => {
	const connection = new Connection(network, opts.preflightCommitment);
	const provider = new AnchorProvider(
		connection,
		window.solana,
		opts.preflightCommitment
	);
	return provider;
};

  

  const checkIfWalletIsConnected = async () => {
		try {
			const { solana } = window;
			if (solana) {
				if (solana.isPhantom) {
					console.log("Phantom wallet found!");
					const response = await solana.connect({
						onlyIfTrusted: true,
					});
					console.log(
						"Connected with public key:",
						response.publicKey.toString()
					);
					setWalletAddress(response.publicKey.toString());
				}
			} else {
				alert("Solana object not found! Get a Phantom wallet");
			}
		} catch (error) {
			console.error(error);
		}
	};
  const connectWallet = async () => {
		const { solana } = window;
		if (solana) {
			const response = await solana.connect();
			console.log(
				"Connected with public key:",
				response.publicKey.toString()
			);
			setWalletAddress(response.publicKey.toString());
		}
	};


  
	
	
	const renderNotConnectedContainer = () => (
		<button onClick={connectWallet}>Connect to Wallet</button>
	);
  useEffect(() => {
		const onLoad = async () => {
			await checkIfWalletIsConnected();
		};
		window.addEventListener("load", onLoad);
		return () => window.removeEventListener("load", onLoad);
	}, []);
  
  const initilaize = async () => {
    const provider = await getProvider();
    const program = new Program(idl, programId, provider);
    
    console.log("Program Id: ", program.programId.toBase58());
    // mintObject = await createMint(provider, 9);
    // mintPubkey = mintObject.publicKey;
    let  mintPubkey = new anchor.web3.PublicKey("FM1pqK1dgkFkXdzrKvokih9ysghepFGfSUisoRP9iJRP");
    const xStep = new anchor.web3.PublicKey("AAauevpr6WeFNdRtoG2JMX8czBQyKdm2N2X52CziXAoy");
    // const [vaultPubkey, vaultBump] = await  anchor.web3.PublicKey.findProgramAddress(
    //   [step.toBuffer()],
    //   program.programId 
    // );

    console.log("addressminttoken",mintPubkey);
  const  [xMintPubkey, mintBump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("mint"), mintPubkey.toBuffer()],
      program.programId
    );
    console.log("xMintPubkey",xMintPubkey,mintBump);

 const [vaultPubkey, vaultBump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("vault"), mintPubkey.toBuffer()],
      program.programId
    );

    console.log("vaultPubkey",vaultPubkey,vaultBump);
    await program.rpc.initializeXMint(
      {
        accounts: {
          tokenMint: mintPubkey,
          xTokenMint: xMintPubkey,
          tokenVault: vaultPubkey,
          initializer: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        }
      }
    );

  console.log("Mint Success!");
  }
  let mintKey;
  let mintObject;
  let mintPubkey;
  let xMintObject;
  let xMintPubkey;
  let walletTokenAccount;
  let walletXTokenAccount;
  //the program's vault for stored collateral against xToken minting
  let vaultPubkey;
  let vaultBump;
  

 
  const stake = async () => {
    const provider = await getProvider();
    const program = new Program(idl, programId, provider);
    
    console.log("Program Id: ", program.programId.toBase58());

    const mintPubkey = new anchor.web3.PublicKey("FM1pqK1dgkFkXdzrKvokih9ysghepFGfSUisoRP9iJRP");
    //const xStep = new anchor.web3.PublicKey("AAauevpr6WeFNdRtoG2JMX8czBQyKdm2N2X52CziXAoy");
    const walletTokenAccount = "8kdtWDDr1yTGtH2NLPpGy9tEzwEBbFjxrk1DcC3oGACA";
    const walletXTokenAccount = "4hzWWiywFPu7aWRrGWowqHrg4Jfnq47vbd18rFrixSKS";
    
   
   const  [xMintPubkey, mintBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("mint"), mintPubkey.toBuffer()],
        program.programId
      );
   const [vaultPubkey, vaultBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("vault"), mintPubkey.toBuffer()],
        program.programId
      );
      // xMintObject = new Token(provider.connection, xMintPubkey, TOKEN_PROGRAM_ID, provider.wallet.payer);

      //walletTokenAccount = "8kdtWDDr1yTGtH2NLPpGy9tEzwEBbFjxrk1DcC3oGACA";
     // walletXTokenAccount = await xMintObject.createAssociatedTokenAccount(provider.wallet.publicKey);
      
    console.log("walletTokenAccount",walletTokenAccount);
    console.log("walletXTokenAccount",walletXTokenAccount);
    //  let  walletTokenAccount = await mintPubkey.Token.createAssociatedTokenAccount(provider.wallet.publicKey);
    //   let walletXTokenAccount = await xMintPubkey.Token.createAssociatedTokenAccount(provider.wallet.publicKey);
    // const [vaultPubkey, vaultBump] = await  anchor.web3.PublicKey.findProgramAddress(
    //   [step.toBuffer()],
    //   program.programId 
    // );
    console.log("vaultpub", program.programId );
    // console.log("pubval",step.toBuffer());
    
    await program.rpc.stake(
      mintBump,
      new anchor.BN(50),
      {
        accounts: {
          tokenMint: mintPubkey,
          xTokenMint: xMintPubkey,
          tokenFrom: walletTokenAccount,
          tokenFromAuthority: provider.wallet.publicKey,
          tokenVault: vaultPubkey,
          xTokenTo:xMintPubkey ,
          tokenProgram: TOKEN_PROGRAM_ID,
        }
      }
    );

  console.log("stake Success!");
  }


  return (
		<div className="App">
			{!walletAddress && renderNotConnectedContainer()}
			{/* {walletAddress && renderConnectedContainer()} */}
			<button onClick={() => stake()}>
					Click to donate!
				</button>
				<button onClick={() => initilaize()}>
					create
				</button> 
        {/* <button onClick={() => Mint()}>
					Mint
				</button>  */}
		</div>
	);
};

export default App;
