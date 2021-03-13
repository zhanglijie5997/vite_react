import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import path from 'path';
import gzip from "rollup-plugin-gzip";
// https://vitejs.dev/config/
console.log(process.env.NODE_ENV)
export default defineConfig({
    plugins: [
        reactRefresh(),
        gzip()
    ],
    resolve: {
        alias: {
            "/@page": path.resolve(__dirname, "src/page"),
            "/@": path.resolve(__dirname, "src"),
            "/@static": path.resolve(__dirname, "src/static"),
            "/@utils": path.resolve(__dirname, "src/utils"),
            "/@store": path.resolve(__dirname, "src/store"),
            "/@components": path.resolve(__dirname, "src/components"),
            "/@http": path.resolve(__dirname, "src/http"),

        },
    },
    css: {
        modules: {
            scopeBehaviour: "local",
            globalModulePaths: [], // 全局样式
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
