import { RouteProps } from "react-router";

import lazy from '@loadable/component'

const Index = lazy(() => import(/* webpackChunkName: "Index" */ './index'));
const Setting = lazy(() => import(/* webpackChunkName: "Setting" */ './setting/setting'));
const Kline = lazy(() => import(/* webpackChunkName: "Setting" */ './kline/kline'));


const page: RouteProps[] = [
    { path:  ["/", "/index"], component: Index, exact: true },
    { path:  ["/setting"], component: Setting, exact: true },
    { path:  ["/kline"], component: Kline, exact: true },
];

export default page;