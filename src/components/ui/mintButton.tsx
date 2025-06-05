import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "./label";
import { Input } from "./input";
import { usePublicClient, useWalletClient } from "wagmi";
import { AnimatePresence, motion } from "framer-motion";
import { abi, contractAddr } from "@/library/contractConfig";

export const MintButton = ({
  className,
  exportToSvgRaw,
  exportToSvg,
}: {
  className: string;
  exportToSvgRaw: () => Promise<string>;
  exportToSvg: () => Promise<string>;
}) => {
  const [svgName, setSvgName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [svgDescription, setSvgDescription] = useState<string>("");
  const [svg, setSvg] = useState<string | null>(null);
  const [compressedSvgData, setCompressedSvgData] = useState<string | null>(
    null
  );

  const mintSvg = async (svgData: string) => {
    setLoading(true);
    //Have to implement the minting logic here
    console.log("svgName", svgName);
    console.log("svgDescription", svgDescription);
    const encoded = btoa(svgData);
    console.log("encoded", encoded);

    try {
      const scoreStringArr = await aiScore(svgData);
      const scoreArr = JSON.parse(scoreStringArr);

      const tokenData = {
        name: svgName,
        description: svgDescription,
        image: `data:image/svg+xml;base64,${encoded}`,
        attributes: [
          { trait_type: "Sketch Score", value: scoreArr[0], max_value: 100 },
          { trait_type: "Creativity", value: scoreArr[1], max_value: 100 },
          { trait_type: "Complexity", value: scoreArr[2], max_value: 100 },
        ],
      };
      //now I need to call the smart contract to mint the token!
      console.log("tokenData", JSON.stringify(tokenData));

      // mint req
      const txn = await walletClient?.writeContract({
        abi,
        address: contractAddr,
        functionName: "mintNFT",
        args: [JSON.stringify(tokenData)],
      });

      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: txn as `0x${string}`,
      });

      console.log("Transaction receipt:", receipt);
      //mint req ends

      setLoading(false);
    } catch (error) {
      console.error("Error minting SVG:", error);
      setLoading(false);
    }
  };

  const aiScore = async (svgData: string) => {
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: svgData }),
      });
      const data = await res.json();
      const scoreArr = data.parts[0].text;
      if (!res.ok) {
        throw new Error("Failed to get score!");
      }
      return scoreArr;
    } catch (error) {
      console.error("Error fetching AI score:", error);
    }
  };
  return (
    <div>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <div
              className={className}
              onClick={async () => {
                const svg = await exportToSvgRaw();
                const compressedSvgData = await exportToSvg();
                setCompressedSvgData(compressedSvgData);
                setSvg(svg);
              }}
            >
              Mint
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Minting Factory 🛠️</DialogTitle>
              <DialogDescription>
                The SVG will be minted and stored on-chain. Use{" "}
                <b>compressed SVG</b> for lower gas fees if it doesn’t need
                fills or fine textures. Choose <b>normal SVG</b> to preserve all
                details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Svg Name</Label>
                <Input
                  id="name-1"
                  name="name"
                  placeholder="Coconut Pizza 🍕"
                  onChange={(e) => setSvgName(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">Svg Desctiption</Label>
                <Input
                  id="username-1"
                  name="username"
                  placeholder="5 year old kid's drawing by a 20 year old 👶"
                  onChange={(e) => setSvgDescription(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <AnimatePresence mode="wait">
                {!loading ? (
                  <motion.div
                    key="buttons"
                    layoutId="morph"
                    className="flex gap-3"
                    transition={{
                      layout: { duration: 1, ease: [0.4, 0, 0.2, 1] },
                    }}
                  >
                    <button
                      className="text-sm text-sky-900 py-2 px-4 rounded-md shadow-gray-400 shadow-sm bg-sky-200 focus:outline-none active:bg-sky-100 active:shadow-none transition-all"
                      onClick={() => mintSvg(compressedSvgData || "")}
                    >
                      MintCompressedSvg
                    </button>
                    <button
                      className="text-sm text-sky-900 py-2 px-4 rounded-md shadow-gray-400 shadow-sm bg-sky-200 focus:outline-none active:bg-sky-100 active:shadow-none transition-all"
                      onClick={() => mintSvg(svg || "")}
                    >
                      MintSvg
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    className="text-sm text-sky-800 py-2 px-4 rounded-md shadow-gray-400 shadow-sm bg-sky-100 focus:outline-none  transition-all h-9 w-64 text-center"
                    key="placeholder"
                    layoutId="morph"
                    transition={{
                      layout: { duration: 1, ease: [0.4, 0, 0.2, 1] },
                    }}
                  >
                    minting...
                  </motion.div>
                )}
              </AnimatePresence>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};
