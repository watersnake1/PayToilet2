"use client";

import React, { useState } from "react";
import { useScaffoldWatchContractEvent } from "~~/hooks/scaffold-eth";

export const BetValues = () => {
  const [lastBet, setLastBet] = useState(0);
  const [rand, setRand] = useState(0);
  const [result, setResult] = useState(0);
  const [tolerance, setTolerance] = useState(0);

  useScaffoldWatchContractEvent({
    contractName: "Wager",
    eventName: "ToleranceBetPlaced",
    onLogs: logs => {
      logs.map(log => {
        console.log(log.args[0], "is the user score");
        setLastBet(Number(log.args[0]));
        setRand(Number(log.args[1]));
        setResult(Number(log.args[2]));
        setTolerance(Number(log.args[3]));
      });
    },
  });

  return (
    <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
      <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
        <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
          <div>
            <table style={{ border: "2px solid black" }}>
              <tr style={{ border: "2px solid black" }}>
                <th>Value</th>
                <th>Data</th>
              </tr>
              <tr>
                <td>Wager Value</td>
                <td>{lastBet}</td>
              </tr>
              <tr>
                <td>Randomness</td>
                <td>{rand}</td>
              </tr>
              <tr>
                <td>Distance</td>
                <td>{result}</td>
              </tr>
              <tr>
                <td>Tolerance</td>
                <td>{tolerance}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
