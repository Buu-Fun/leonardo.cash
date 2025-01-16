import { Button } from "@nextui-org/react";
import { TokenInput } from "./TokenInput";
import { useState } from "react";

interface Props { }

const ETH = {
    symbol: 'ETH',
    icon: '/eth.png',
    decimals: 18,
}

const LEONARDO = {
    symbol: 'LEONAI',
    icon: '/leonai.png',
    decimals: 18,
}

function Buy({ }: Props) {
    const [sellAmount, setSellAmount] = useState(0n);
    const [buyAmount, setBuyAmount] = useState(0n);
    return <form className="w-full">
        <TokenInput label="Sell" amount={sellAmount} setAmount={setSellAmount} token={ETH}  />
        <TokenInput label="Buy" amount={buyAmount} setAmount={setBuyAmount} token={LEONARDO} />
        <Button
            color="primary"
            style={{
                width: '100%',
            }}
        >
            Buy
        </Button>
        <a
            href="https://app.uniswap.org/swap?exactField=output&&outputCurrency=0xb933D4FF5A0e7bFE6AB7Da72b5DCE2259030252f&inputCurrency=ETH&chain=base"
            target="_blank"
            rel="noreferrer"
            style={{
                width: '100%',
                fontSize: '0.8rem',
            }}
        >
            Buy on Uniswap
        </a>
    </form>
}
export default Buy;