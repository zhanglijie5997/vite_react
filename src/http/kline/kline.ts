import { get } from "../http";


const http = {
    perpetualPcPublicInstruments: "/v2/perpetual/pc/public/instruments", // 合约交易对
}

/**
 * 获取交易对
 * @param url         交易对名称
 * @param granularity 交易对时间
 */
export const perpetualPcPublicInstruments = (url: string, granularity = 180 ) => get(`${http.perpetualPcPublicInstruments}/${url}/candles` , {
    granularity,
    size: 1000,
    t: Date.now()
})