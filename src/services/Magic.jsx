import { Magic } from "magic-sdk";
import { FlowExtension } from "@magic-ext/flow";

let magic;

if (typeof window !== "undefined") {
  magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY, {
    extensions: [
      new FlowExtension({
        rpcUrl: "https://rest-testnet.onflow.org",
        network: "testnet",
      }),
    ],
  });
}

export default magic;
