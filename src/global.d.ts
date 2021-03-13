/**
 * store state 属性
 */
declare interface StoreState {
    token: string
}

/**
 *  行情socket数据
 */ 
declare interface TicketScoket {
    cv: string
    h: string
    id: string
    l: string
    o: string
    o0: string
    o8: string
    p: string
    v: string
}

interface ContractWsData{
    instrument_id: string
    price?: string
    side?: string
    size?: string
    timestamp?: string
    trade_id?: string
}

type ContractWsTable =  'swap/ticker' | 'index/ticker' | 'swap/mark_price' | 'swap/optimized_depth' | 'swap/trade';

declare interface ContractWs {
    table: ContractWsTable 
    data: ContractWsData[]
    action: string
}