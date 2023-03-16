const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // 端口
    port: 3000,
    // 自动打开浏览器
    // open: true,

    //当前项目在开发调试阶段，
    // 会将任何未知请求 (没有匹配到静态文件的请求) 代理到本机服务器
    proxy: {
      "/planAddPage": {
        target: "http://192.168.43.145:8888", // 需要代理的域名
        ws: false, // 是否启用websockets
        changeOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求							的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {  //重写匹配的字段，如果不需要在请求路径上，重写为""
          "^/planAddPage": ""
        }
      },
      '/api': {
        target: 'http://192.168.43.145:8888',// 要跨域的域名
        changeOrigin: true, // 是否开启跨域
        pathRewrite: {  //重写匹配的字段，如果不需要在请求路径上，重写为""
          "^/api": ""
        }
      },
      "/template": {
        target: "http://192.168.43.20:80", // 需要代理的域名
        ws: false, // 是否启用websockets
        changeOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求							的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {  //重写匹配的字段，如果不需要在请求路径上，重写为""
          "^/template": ""
        }
      },
    }
  }

})
