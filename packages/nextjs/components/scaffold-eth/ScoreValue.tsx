"use client";

import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const ScoreValue = () => {
  const { address: connectedAddress } = useAccount();
  const { data: score } = useScaffoldReadContract({
    contractName: "FooToken",
    functionName: "balanceOf",
    args: [connectedAddress],
  });
  return (
    <div>
      <h2 className="font-bold m-0">Your Score: {score ? score.toString() : 0}</h2>
    </div>
  );
};
