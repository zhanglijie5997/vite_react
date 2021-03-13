/**
 * 获取本地存储值
 * @param k key
 */
export const getStorage = (k: string) => JSON.parse(localStorage.getItem(k) ?? "null"); 

/**
 * 存储本地
 * @param k key
 * @param v value
 */
export const setStorage = (k: string, v: any) => localStorage.setItem(k, JSON.stringify(v));

/**
 * 金钱格式化
 * @param v 
 */
export const moneyFormat = (v: number) => {
    if(v > 100000000) {
        return  "$" + (v / 100000000).toFixed(2).toLocaleString() + '亿';
    }

    if(v > 10000) {
        return  "$" + (v / 1000000).toFixed(2).toLocaleString() + '万';
    }
    return  "$" + (v).toFixed(4).toLocaleString();
}

export const throttle = function(func: Function, delay: number) {
    let time = Date.now();
    return function() {
        const ctx = throttle;
        const args = arguments;
        const now = Date.now();
        if(time - now >= delay) {
            func.apply(throttle, args);
            time = Date.now();
        }
    }
} 