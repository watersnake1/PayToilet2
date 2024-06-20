"use client";

import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export const DifferentialValue = () => {
  const { data: differential } = useScaffoldReadContract({
    contractName: "Wager",
    functionName: "getDifferential",
  });
  return (
    <div>
      <h2 className="font-bold m-0">Current Differential Value: {differential ? differential.toString() : 0}</h2>
    </div>
  );
};
