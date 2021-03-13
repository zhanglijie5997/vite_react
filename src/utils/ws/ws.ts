import Pako from 'pako';
import { useEffect, useState } from 'react';

export const ws = () => {
    const [getState, setState] = useState<string>(`""`);
    useEffect(() => {
        const _ = new WebSocket("wss://real.okex.com:8443/ws/v3");
        _.binaryType = "arraybuffer";
        const sendMsg = {
            args: [
                'spot/all_ticker_3s'
            ],
            op: 'subscribe'
        }
        _.onopen = () => {
            _.send(JSON.stringify(sendMsg));
        }
    
        _.onmessage = (msg) => {
            const res = Pako.inflateRaw((msg.data ) , { to: 'string' });
            setState(res)
        }
        return () => _.close();
    }, [])
    return getState;
};

/**
 * 单个币种行情
 * args: ["swap/ticker:BTC-USD-SWAP", "index/ticker:BTC-USD", "swap/mark_price:BTC-USD-SWAP", "swap/optimized_depth:BTC-USD-SWAP", "swap/trade:BTC-USD-SWAP"]
 * 0: "swap/ticker:BTC-USD-SWAP"
 * 1: "index/ticker:BTC-USD"
 * 2: "swap/mark_price:BTC-USD-SWAP"
 * 3: "swap/optimized_depth:BTC-USD-SWAP"
 * 4: "swap/trade:BTC-USD-SWAP"
 * args: ["swap/candle180s:BTC-USD-SWAP"]
 */

export const contractWs = () => {
    const [getState, setState] = useState<string>(`""`);
    useEffect(() => {
        const ws = new WebSocket("wss://real.okex.com:8443/ws/v3");
        ws.binaryType = "arraybuffer";

        const sendMsg = {
            args: ["swap/ticker:BTC-USD-SWAP", "index/ticker:BTC-USD", "swap/mark_price:BTC-USD-SWAP", "swap/optimized_depth:BTC-USD-SWAP", "swap/trade:BTC-USD-SWAP"],
            op: 'subscribe'
        }
        const sendMsg1 =  {
            args: ["swap/candle180s:BTC-USD-SWAP"],
            op: 'subscribe'
        }
        ws.onopen = () => {
            ws.send(JSON.stringify(sendMsg));
            ws.send(JSON.stringify(sendMsg1));
        }

        ws.onmessage = (msg) => {
            const res = Pako.inflateRaw((msg.data ) , { to: 'string' });
            setState(res);
        }
        return () => ws.close();
    }, [])
    return getState;
}