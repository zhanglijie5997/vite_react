import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import path from 'path';
import gzip from "rollup-plugin-gzip";
import vitePLuginImp from "vite-plugin-imp";
import { getThemeVariables } from 'antd/dist/theme';
// https://vitejs.dev/config/
console.log(process.env.NODE_ENV)
export default defineConfig({
    plugins: [
        reactRefresh(),
        gzip(),
        vitePLuginImp({
            libList: [
                {
                    libName: 'antd',
                    style: (name) => `antd/es/${name}/style`
                }
            ]
        }),

    ],
    resolve: {
        alias: {
            "@page": path.resolve(__dirname, "src/page"),
            "@": path.resolve(__dirname, "src"),
            "@static": path.resolve(__dirname, "src/static"),
            "@utils": path.resolve(__dirname, "src/utils"),
            "@store": path.resolve(__dirname, "src/store"),
            "@components": path.resolve(__dirname, "src/components"),
            "@http": path.resolve(__dirname, "src/http"),

        },
    },
    css: {
        modules: {
            scopeBehaviour: "local",
            globalModulePaths: [], // 全局样式
        },
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                modifyVars: {
                    // 主题
                    // ...getThemeVariables({
                    //     dark: true
                    // })
                }
            },
            scss: {
                additionalData: `@import "./src/static/css/global.scss";`
            }
        }
    },
    server: {
        proxy: {
          // string shorthand
        //   '/foo': 'http://localhost:4567/foo',
          // with options
          '/api': {
            target: ' https://www.okexcn.com',
            changeOrigin: true,
            rewrite: (path) => { 
                console.log(path, '99999')
                return path.replace(/^\/api/g, '');
            }
          },
          // with RegEx
          '^/fallback/.*': {
            target: 'http://jsonplaceholder.typicode.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/fallback/, '')
          }
        }
      }
})
