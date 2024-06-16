"use client";

//import Link from "next/link";
import React, { useState } from "react";
import type { NextPage } from "next";
//import { Contract } from "ethers";
import { parseEther } from "viem";
import { EtherInput } from "~~/components/scaffold-eth";
import { ScoreValue } from "~~/components/scaffold-eth/ScoreValue";
//import { useAccount } from "wagmi";
//import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
//import { Address } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  //const { address: connectedAddress } = useAccount();
  const [ethAmount, setEthAmount] = useState("");
  const { writeContractAsync, isPending } = useScaffoldWriteContract("Wager");

  //this function writes attemptBet on the contract when the flush button is clicked
  const onFlush = async () => {
    try {
      await writeContractAsync(
        {
          functionName: "attemptBet",
          value: parseEther(ethAmount),
        },
        {
          onBlockConfirmation: txnReceipt => {
            console.log(txnReceipt.blockHash);
          },
        },
      );
    } catch (e) {
      console.error("error while attempting bet");
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">PayToilet</span>
          </h1>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <EtherInput value={ethAmount} onChange={amount => setEthAmount(amount)} />
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <button id="flushButton" onClick={onFlush}>
                {isPending ? <span className="loading loading-spinner loading-sm"></span> : "Flush"}
              </button>
            </div>
          </div>

          <div className="flex-grow bg-base-300 w-full mt-16 px-6 py-12">
            <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
              <ScoreValue />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
