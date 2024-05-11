# API

本插件目前提供了如下的函数：
- `checkUpdate`
- `downloadUpdate`

如无特殊说明，本插件所有函数均暴露在主进程。

## checkUpdate

该函数是一个`异步函数`。

该函数用于检测插件是否存在更新，它接受以下的参数：
`slug`: `string` - 需要检测更新的插件的slug

它的返回值类型为：`boolean`或`null`
当返回值为:
- `true`：存在更新
- `false`：没有更新
- `null`：manifest中未填写`repository`

使用方法：
```js
// main.js
if(await LiteLoaderQQNT.api.checkUpdate('your_slug')) console.log('存在更新版本');
else if(await LiteLoaderQQNT.api.checkUpdate('your_slug') == null) console.log('manifest中未填写repository');
else console.log('没有更新版本');
```

## downloadUpdate

该函数是一个`异步函数`。

该函数用于检测插件是否存在更新，它接受以下的参数：
`slug`: `string` - 需要检测更新的插件的slug
`url`: `string` - 可选。使用自行提供的下载链接，URL结尾必须为zip包名称。

它的返回值类型为：`boolean`或`null`
当返回值为:
- `true`：更新成功
- `false`：更新失败
- `null`：manifest中未填写`repository`

使用方法：
```js
// main.js
if(await LiteLoaderQQNT.api.downloadUpdate('your_slug', 'your_update_url(optional)')) console.log('更新成功，重启QQ生效');
else if(await LiteLoaderQQNT.api.downloadUpdate('your_slug') == null) console.log('manifest中未填写repository');
else console.log('更新失败，错误信息已输出至控制台');
```