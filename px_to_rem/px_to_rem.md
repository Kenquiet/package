## 简单讲解 px 转rem 的一种配置方式
1. 一般有脚手架 比较好配置一点，比如有了 webpack 配置 vue-cli3.x
2. 安装几个插件 
```bash
cnpm install postcss postcss-pxtorem --save
cnpm install postcss-loader postcss-import postcss-url --save
```
3. 在项目根新建文件夹 .postcssrc.js
    ```js
    /**
    * rootValue：根元素字体的大小（单位是px的），为什么是32呢，因为是16的两倍
    * propList ：适用所有元素
    * minPixelValue：最小的转换值 2px
    * @想了解更多就去看 postcss-pxtorem 相关的配置
    */
    module.exports = { plugins: { 'postcss-pxtorem': { rootValue: 32, propList: ['*'], minPixelValue: 2 } }};
    ```

4. 在根index.html 里面 在head中插入一段js代码
    ```js
        (function() {   
           function autoRootFontSize() {
              document.documentElement.style.fontSize = Math.min(screen.width,document.documentElement.getBoundingClientRect().width) / 750 * 32 + 'px';
           }
           window.addEventListener('resize', autoRootFontSize);
           autoRootFontSize();
        })();
    ```
5. 
