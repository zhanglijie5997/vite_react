import React, { memo, useEffect, useMemo, useRef, useState } from 'react'
import { Chart, init, } from "klinecharts";
import styles from "./kline.module.scss";
import { contractWs } from '/@utils/ws/ws';
import { perpetualPcPublicInstruments } from '/@http/kline/kline';

function getTooltipOptions (candleShowType: string, candleShowRule: string, technicalIndicatorShowRule: string) {
    return {
      candle: {
        tooltip: {
          showType: candleShowType,
          showRule: candleShowRule,
          labels: ['开盘价', '收盘价', '涨跌幅'],
          values: (kLineData: any) => {
            const change = (kLineData.close - kLineData.open) / kLineData.open * 100
            return [
              { value: kLineData.open.toFixed(2) },
              { value: kLineData.close.toFixed(2) },
              {
                value: `${change.toFixed(2)}%`,
                color: change < 0 ? '#EF5350' : '#26A69A'
              }
            ]
          }
        }
      },
      technicalIndicator: {
        tooltip: {
          showRule: technicalIndicatorShowRule
        }
      }
    }
}

interface GetDefaultDataType {
    close: number
    high: number
    low: number
    open: number
    timestamp: number
    volume: number
}
function Kline() {
    const klineRef = useRef<HTMLDivElement>(null);
    const klineState = JSON.parse(contractWs()) ;
    const [getDefaultData, setDefaultData] = useState<Array<GetDefaultDataType>>([]);
    const state = {
        candleShowType: 'standard',
        candleShowRule: 'always',
        technicalIndicatorShowRule: 'always'
    };
    const [getChart, setChart] = useState<Chart>();
    useEffect(() => {
        perpetualPcPublicInstruments("BTC-USD-SWAP").then((r: string[]) => {
            console.log(r, '888');
            const res = r.map(_ => {
                return { close: +_[1], 
                    high: +_[2], low: +_[4], 
                    open: +_[3], timestamp: new Date(_[0]).getTime() , 
                    volume: +_[6] }
            });
            setDefaultData(res);
        })
    }, [])
    useEffect(() => {
        // console.log(klineState)
        if(klineState.table === "swap/ticker" && getChart) {
            console.log(`222`);
            const _ = klineState.data[0];
            const res = { close: +_.last, 
                high: +_.high_24h, low: +_.low_24h, 
                open: +_.open_utc0, timestamp: new Date(_[0]).getTime() , 
                volume: 300 };

            getChart.updateData(res);
        }
    }, [klineState, getChart] )
    useEffect(() => {
        if (klineRef.current) {
            const chart = init(klineRef.current, {
                // 网格线
                grid: {
                    show: true,
                    // 网格水平线
                    horizontal: {
                        show: true,
                        size: 1,
                        color: '#393939',
                        // 'solid'|'dash'
                        style: 'dash',
                        dashValue: [2, 2]
                    },
                    // 网格垂直线 
                    vertical: {
                        show: false,
                        size: 1,
                        color: '#393939',
                        // 'solid'|'dash'
                        style: 'dash',
                        dashValue: [2, 2]
                    }
                },
                // 蜡烛图  
                candle: {
                    // 蜡烛图上下间距，大于1为绝对值，大于0小余1则为比例
                    margin: {
                        top: 0.2,
                        bottom: 0.1
                    },
                    // 蜡烛图类型 'candle_solid'|'candle_stroke'|'candle_up_stroke'|'candle_down_stroke'|'ohlc'|'area'
                    type: 'candle_solid',
                    // 蜡烛柱
                    bar: {
                        upColor: '#26A69A',
                        downColor: '#EF5350',
                        noChangeColor: '#888888'
                    },
                    // 面积图
                    area: {
                        lineSize: 2,
                        lineColor: '#2196F3',
                        value: 'close',
                        fillColor: [{
                            offset: 0,
                            color: 'rgba(33, 150, 243, 0.01)'
                        }, {
                            offset: 1,
                            color: 'rgba(33, 150, 243, 0.2)'
                        }]
                    },
                    priceMark: {
                        show: true,
                        // 最高价标记  
                        high: {
                            show: true,
                            color: '#D9D9D9',
                            textMargin: 5,
                            textSize: 10,
                            textFamily: 'Helvetica Neue',
                            textWeight: 'normal'
                        },
                        // 最低价标记  
                        low: {
                            show: true,
                            color: '#D9D9D9',
                            textMargin: 5,
                            textSize: 10,
                            textFamily: 'Helvetica Neue',
                            textWeight: 'normal',
                        },
                        // 最新价标记    
                        last: {
                            show: true,
                            upColor: '#26A69A',
                            downColor: '#EF5350',
                            noChangeColor: '#888888',
                            line: {
                                show: true,
                                // 'solid'|'dash'
                                style: 'dash',
                                dashValue: [4, 4],
                                size: 1
                            },
                            text: {
                                show: true,
                                size: 12,
                                paddingLeft: 2,
                                paddingTop: 2,
                                paddingRight: 2,
                                paddingBottom: 2,
                                color: '#FFFFFF',
                                family: 'Helvetica Neue',
                                weight: 'normal'
                            }
                        }
                    },
                    // 提示  
                    tooltip: {
                        showRule: 'always',
                        showType: 'standard',
                        labels: ['时间', '开', '收', '高', '低', '成交量'],
                        // 可以是数组，也可以是方法，如果是方法则需要返回一个数组
                        // 数组和方法返回的数组格式为:
                        // [xxx, xxx, ......]或者[{ color: '#fff', value: xxx }, { color: '#000', value: xxx }, .......]
                        values: null,
                        defaultValue: 'n/a',
                        rect: {
                            paddingLeft: 0,
                            paddingRight: 0,
                            paddingTop: 0,
                            paddingBottom: 6,
                            offsetLeft: 8,
                            offsetTop: 8,
                            offsetRight: 8,
                            borderRadius: 4,
                            borderSize: 1,
                            borderColor: '#3f4254',
                            fillColor: 'rgba(17, 17, 17, .3)'
                        },
                        text: {
                            size: 12,
                            family: 'Helvetica Neue',
                            weight: 'normal',
                            color: '#D9D9D9',
                            marginLeft: 8,
                            marginTop: 6,
                            marginRight: 8,
                            marginBottom: 0
                        }
                    }
                },
                // 技术指标  
                technicalIndicator: {
                    margin: {
                        top: 0.2,
                        bottom: 0.1
                    },
                    bar: {
                        upColor: '#26A69A',
                        downColor: '#EF5350',
                        noChangeColor: '#888888'
                    },
                    line: {
                        size: 1,
                        colors: ['#FF9600', '#9D65C9', '#2196F3', '#E11D74', '#01C5C4']
                    },
                    circle: {
                        upColor: '#26A69A',
                        downColor: '#EF5350',
                        noChangeColor: '#888888'
                    },
                    // 最新值标记  
                    lastValueMark: {
                        show: false,
                        text: {
                            show: false,
                            color: '#ffffff',
                            size: 12,
                            family: 'Helvetica Neue',
                            weight: 'normal',
                            paddingLeft: 3,
                            paddingTop: 2,
                            paddingRight: 3,
                            paddingBottom: 2
                        }
                    },
                    // 提示  
                    tooltip: {
                        showRule: 'always',
                        showName: true,
                        showParams: true,
                        defaultValue: 'n/a',
                        text: {
                            size: 12,
                            family: 'Helvetica Neue',
                            weight: 'normal',
                            color: '#D9D9D9',
                            marginTop: 6,
                            marginRight: 8,
                            marginBottom: 0,
                            marginLeft: 8
                        }
                    }
                },
                // x轴
                xAxis: {
                    show: true,
                    height: null,
                    // x轴线
                    axisLine: {
                        show: true,
                        color: '#888888',
                        size: 1
                    },
                    // x轴分割文字
                    tickText: {
                        show: true,
                        color: '#D9D9D9',
                        family: 'Helvetica Neue',
                        weight: 'normal',
                        size: 12,
                        paddingTop: 3,
                        paddingBottom: 6
                    },
                    // x轴分割线  
                    tickLine: {
                        show: true,
                        size: 1,
                        length: 3,
                        color: '#888888'
                    }
                },
                // y轴  
                yAxis: {
                    show: true,
                    width: null,
                    // 'left' | 'right'
                    position: 'right',
                    // 'normal' | 'percentage'
                    type: 'normal',
                    inside: false,
                    // y轴线  
                    axisLine: {
                        show: true,
                        color: '#888888',
                        size: 1
                    },
                    // x轴分割文字  
                    tickText: {
                        show: true,
                        color: '#D9D9D9',
                        family: 'Helvetica Neue',
                        weight: 'normal',
                        size: 12,
                        paddingLeft: 3,
                        paddingRight: 6
                    },
                    // x轴分割线
                    tickLine: {
                        show: true,
                        size: 1,
                        length: 3,
                        color: '#888888'
                    }
                },
                // 图表之间的分割线  
                separator: {
                    size: 1,
                    color: '#888888',
                    fill: true,
                    activeBackgroundColor: 'rgba(230, 230, 230, .15)'
                },
                // 十字光标  
                crosshair: {
                    show: true,
                    // 十字光标水平线及文字
                    horizontal: {
                        show: true,
                        line: {
                            show: true,
                            // 'solid'|'dash'
                            style: 'dash',
                            dashValue: [4, 2],
                            size: 1,
                            color: '#888888'
                        },
                        text: {
                            show: true,
                            color: '#D9D9D9',
                            size: 12,
                            family: 'Helvetica Neue',
                            weight: 'normal',
                            paddingLeft: 2,
                            paddingRight: 2,
                            paddingTop: 2,
                            paddingBottom: 2,
                            borderSize: 1,
                            borderColor: '#505050',
                            backgroundColor: '#505050'
                        }
                    },
                    // 十字光标垂直线及文字  
                    vertical: {
                        show: true,
                        line: {
                            show: true,
                            // 'solid'|'dash'
                            style: 'dash',
                            dashValue: [4, 2],
                            size: 1,
                            color: '#888888'
                        },
                        text: {
                            show: true,
                            color: '#D9D9D9',
                            size: 12,
                            family: 'Helvetica Neue',
                            weight: 'normal',
                            paddingLeft: 2,
                            paddingRight: 2,
                            paddingTop: 2,
                            paddingBottom: 2,
                            borderSize: 1,
                            borderColor: '#505050',
                            backgroundColor: '#505050'
                        }
                    }
                },
                // 图形标记  
                graphicMark: {
                    line: {
                        color: '#2196F3',
                        size: 1
                    },
                    point: {
                        backgroundColor: 'red',
                        borderColor: '#2196F3',
                        borderSize: 1,
                        radius: 4,
                        activeBackgroundColor: '#2196F3',
                        activeBorderColor: '#2196F3',
                        activeBorderSize: 1,
                        activeRadius: 6
                    },
                    polygon: {
                        stroke: {
                            size: 1,
                            color: '#2196F3'
                        },
                        fill: {
                            color: 'rgba(33, 150, 243, 0.1)'
                        }
                    },
                    arc: {
                        stroke: {
                            size: 1,
                            color: '#2196F3'
                        },
                        fill: {
                            color: 'rgba(33, 150, 243, 0.1)'
                        }
                    },
                    text: {
                        color: '#2196F3',
                        size: 12,
                        family: 'Helvetica Neue',
                        weight: 'normal',
                        marginLeft: 2,
                        marginRight: 2,
                        marginTop: 2,
                        marginBottom: 6
                    },

                }
            }) as Chart;
            setChart(chart)

            chart.setZoomEnabled(true);
            // console.log(chart.getStyleOptions())
            chart.createTechnicalIndicator('KDJ', false, {
                id: 'pane_1',
                height: 80,
                dragEnabled: true
            })
            chart.createTechnicalIndicator('MA', false, {
                id: 'pane_1',
                height: 80,
                dragEnabled: true
            });
            chart.createGraphicMark(
                'segment',
                {
                    points: [
                        { timestamp: 1614171282000, price: 18987 },
                        { timestamp: 1614171202000, price: 16098 },
                    ],
                    styles: {
                        line: {
                            color: '#f00',
                            size: 2
                        }
                    },
                    onDrawStart: function ({ id }) { console.log(id) },
                    onDrawing: function ({ id, step, points }) { console.log(id, step, points) },
                    onDrawEnd: function ({ id }) { console.log(id) },
                    onClick: function ({ id, event }) { console.log(id, event) },
                    onRightClick: function ({ id, event }) {
                        console.log(id, event)
                        return false
                    },
                    onPressedMove: function ({ id, event }) { console.log(id, event) },
                    onRemove: function ({ id }) { console.log(id) }
                }
            );
            const { candleShowType, candleShowRule, technicalIndicatorShowRule } = state;
            chart.setStyleOptions(getTooltipOptions(candleShowType, candleShowRule, technicalIndicatorShowRule))
            chart.applyNewData(getDefaultData);
        }
        
    }, [klineRef.current, getDefaultData, getChart]);



    return (
        <div>
            <div ref={klineRef} className={styles.kline}></div>
            <div id="pane_1"></div>
            <div id="segment"></div>
            {/* {} */}
        </div>
    )
}

export default memo(Kline);
