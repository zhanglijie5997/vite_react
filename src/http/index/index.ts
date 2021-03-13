import { get } from "../http";


export interface getBtcPriceTypeList {
    changePercentage: string
    classification: string
    classificationId: string
    currencyId: number
    dayHigh: number
    dayLow: number
    flowTotal: number
    fullName: string
    fullNameSeo: string
    icon: string
    last: number
    open: number
    openUtc0: number
    openUtc8: number
    project: string
    symbol: string
    volume: number
    package?: string[]
}

export interface getBtcPriceType {
    list: getBtcPriceTypeList[]
    pageNum: number
    pageSize: number
    total: number
}

export const getBtcPrice = () => get(`v2/support/info/announce/listProject?t=${Date.now()}`);