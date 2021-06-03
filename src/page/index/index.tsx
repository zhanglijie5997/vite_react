import React, { useEffect, lazy, Suspense, memo, useState, useMemo, ReactNode, FormEvent, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory,  } from 'react-router'
import { getBtcPrice, getBtcPriceType, getBtcPriceTypeList } from '@http/index';
import { createToken } from '@store/commit';
import { Input, Table, Tabs } from "antd";
import styles from "./index.module.scss";
import { moneyFormat, throttle } from '@utils/utils';
import { ColumnsType } from 'antd/lib/table';
import { ws } from '@utils/ws/ws';
import { SearchOutlined } from '@ant-design/icons';
import { useMount, useNetwork, useReactive, useTitle } from 'ahooks';
const { TabPane } = Tabs;
const NoData = lazy(() => import("@components/nodata/nodata"));

// import styles from "@/index.module.scss";
const Index =  (props: RouteComponentProps) => {
    const state = useSelector((state: StoreState) => state);
    const dispath = useDispatch();
    const router = useHistory()
    const list = [
        { name: "自选", id: 0 },
        { name: "币种介绍", id: 1 },
        { name: "币币", id: 2 },
    ];

    useTitle("index")

    const [getLoading, setLoading] = useState(true);

    const [getList, setList] = useState<getBtcPriceTypeList[]>([]);

    const kList = ws();

    const gopath = () => {
        router.push("/kline")
    }
    
    const [columns, setColumns] = useState([
        {   
            title: "币种",
            dataIndex: 'package',
            key: "package",
            width: 700,
            render: (text: string[]) => < div className={styles.item}>
                { text.map((_, i: number) => <div key={i} >
                   { _.includes("http") ?  <img src={_} ></img> : <span>{_}</span>}
                </div>) }
            </div>,
        },
        {   
            title: "最新价",
            dataIndex: 'last',
            className: 'column-right',
            key: "last",
            render: (text: string) => <p>${text}</p>,
        },
        {   
            className: 'column-right',
            title: "24H涨跌幅",
            sorter: (a: getBtcPriceTypeList, b: getBtcPriceTypeList) => {
                const left = +a.changePercentage.replace(/%/g, ' ');
                const right = +b.changePercentage.replace(/%/g, ' ');
                return right - left;
            },
            showSorterTooltip: false,
            dataIndex: 'changePercentage',
            key: "changePercentage",
            render: (text: string) => <p className={`${text.includes("+") ?  styles.red : styles.green }`}>{text}</p>,
        },
        {   
            className: 'column-right',
            title: "市值",
            key: "flowTotal",
            dataIndex: 'flowTotal',
            render: (text: number) => <>{moneyFormat(text) }</>,
        },
        {   
            className: 'column-right',
            title: "操作",
            key: "setting",
            dataIndex: 'setting',
            render: (text: string) => <button onClick={() => gopath()} className={styles.btn} >交易</button>,
        },
    ]);

    const _reactive = useReactive({
        a: 1
    });

    const [getDefaultColumns, setDefaultColumns] = useState<getBtcPriceTypeList[]>([]);

    useEffect(() => {
        test();
    }, [])
    const r = useNetwork();

    useMount(() => {
        console.log(`mounted`);
        console.log(r, '网络状态--');
    });

    useEffect(() => {
        const _ = JSON.parse(kList).data as TicketScoket[];
        let _list = getList;
        _list = _list.map(__ => {
            const symbol = __.symbol.replace("_", ' ');
            const find = _.find(_ => _.id.replace("-", ' ').toLocaleLowerCase() === symbol);
            
            if(find) {
                __.changePercentage = (+find?.p - +find?.o > 0 ? "+" : '')  + ((((+find?.p - +find?.o) / +find?.p) * 100).toFixed(4) + "%")
                __.last = +(find?.p || __.last);
            }
            
            return __;
        })
        setList(_list);
    }, [kList]);

    useLayoutEffect(() => {
        console.log(`重回`);
    }, [])

    const test = async () => {
        const _: getBtcPriceType = await getBtcPrice();
        console.log(_);
        setLoading(false)
        const __ = _.list.map(_ => ({..._, package: [_.icon, _.project, _.fullName], flowTotal: _.last * _.flowTotal}));
        setDefaultColumns(__);
        setList(__);
    }

    const callback = (key: string) => {
        console.log(key);
    }
    
    const [getShowWidth, setShowWidth] = useState<boolean>(false);

    const showSeach = () => setShowWidth(!getShowWidth);

    const changeText = (e: FormEvent<HTMLInputElement>) => {
        console.log(e.currentTarget.value);
        let _ = [];
        if(e.currentTarget.value.trim() === '') {
            _ = getDefaultColumns;
        }else {
             _ = getDefaultColumns.filter(_ => (_.symbol.includes(e.currentTarget.value)) || (_.symbol.includes(e.currentTarget.value.toLocaleLowerCase())));
        }
        setList(_);
    }

    const search = useMemo(() =><div className={styles.search}>
        <SearchOutlined onClick={showSeach} className={styles.active} style={{ color: '#00a94f', fontSize: '20px'}} />
        <input type="text" onInput={changeText} className={`${getShowWidth ? styles.w240 : ''} ${styles.searchInput}`}/>
        <span onClick={() => setShowWidth(false)} className={`${getShowWidth ? styles.cancelShow : ''} ${styles.cancel} ${styles.active}`}>取消</span>
    </div>, [getShowWidth])

    const tabOne = useMemo(() => <Table pagination={false} rowClassName={(r, i) => styles[`row${[i]}`]} 
                                        loading={getLoading} sticky={true} rowKey={row => row.currencyId} 
                                        columns={columns} dataSource={getList} /> , 
                    [getList])
    
    return (
        <div >
            <div className={styles.header}>
                {/* <button onClick={() => {_reactive.a++}}>{_reactive.a}</button> */}
                <Tabs defaultActiveKey="0"  onChange={callback} tabBarExtraContent={search}>
                    {
                        list.map(_ => <TabPane tab={_.name} key={_.id}>
                            { tabOne }
                        </TabPane>)
                    } 
                </Tabs>
            </div>
            {/* <Suspense fallback={<div>loading...</div>}>
                <NoData />
            </Suspense> */}
        </div>
    )
};
export default memo(Index) ;
