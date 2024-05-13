# API

本插件目前提供了如下的函数：
- `checkUpdate`
- `downloadUpdate`
- `registerCompFunc`
- `relaunchQQNT`

如无特殊说明，本插件所有函数均暴露在主进程。

## checkUpdate

该函数是一个`异步函数`。

该函数用于检测插件是否存在更新，它接受以下的参数：

`slug`: `string` - 需要检测更新的插件的slug

`type`: `string` - 可选，不填默认`semVer`。比较版本号的方式。若填写了不存在的`type`，`checkUpdate`永远返回`false`。

它的返回值类型为：`boolean`或`null`

当返回值为:
- `true`：存在更新
- `false`：没有更新
- `null`：manifest中未填写`repository`

使用方法：
```js
// main.js
if(await LiteLoaderQQNT.api.checkUpdate('your_slug', 'type(optional)')) console.log('存在更新版本');
else if(await LiteLoaderQQNT.api.checkUpdate('your_slug', 'type(optional)') == null) console.log('manifest中未填写repository');
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

## registerCompFunc

该函数用于自定义比较版本号的逻辑，它接受以下的参数：

`type`: `string` - 该种比较方式的名字。插件自带`semVer`和`increase`，下方会分别解释。

`compFunc`: `(currentVersion: string, targetVersion: string) => boolean` - 比较版本号的逻辑。`currentVersion`是本地版本号，`targetVersion`是远程版本号。

它的返回值类型为：`void`

使用方法：
```js
// main.js
app.whenReady().then(() => {
  LiteLoader.api.registerCompFunc('type', (currentVer, targetVer): boolean => {
    if(Number(currentVer) < Number(targetVer)) return true; // 返回true，则为有更新
    else return false; // 返回false，则无更新
  });
});
```

### semVer

默认的比较方式。即语义化版本比较方式。

详情请见[SemVer官网](https://semver.org/lang/zh-CN/)

### increase

版本号更替方式为递增方式使用。

例：
```text
"version": "0" -> "version": "1"
```
该种情况适用此比较方式。

## relaunchQQNT

该函数用于弹出消息框告知用户需要重启QQNT，并在用户给出正面反馈后，重启QQ。

它接受如下的参数：

`message`: `string` - 消息框显示的内容

`buttonText`: `[positive: string, negative: string]` - 可选，不填则插件默认。接受一个长度为2的**字符串**数组，第1项为正面选项，即重启；第2项为负面选项，即不重启。

它的返回值类型为：`void`

使用方法：
```js
// main.js
LiteLoader.api.relaunchQQNT('message', /*original*/['positive', 'negative']);
```