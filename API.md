# API

本插件目前提供了如下的函数：
- `checkUpdate`
- `downloadUpdate`
- `registerCompFunc`
- `showRelaunchDialog`

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

`url`: `string` - 可选。使用自行提供的下载链接

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

`type`: `string` - 该种比较方式的名字。插件自带`semVer`，下方会解释。当多个插件注册同一个`type`时，后注册的将会覆盖前注册的。

`compFunc`: `(currentVersion: string, targetVersion: string) => boolean` - 比较版本号的逻辑。`currentVersion`是当前版本号，`targetVersion`是待比较版本号。注意：`compFunc`参数不能传入异步函数。

`force`: `boolean` - 当当前注册的比较方式已存在时，是否覆盖注册。`true`为覆盖原比较方式，`false`为跳过当前注册。默认为`false`。

它的返回值类型为：`void`

使用方法：
```js
// main.js
app.whenReady().then(() => {
  LiteLoader.api.registerCompFunc('type', (currentVer, targetVer): boolean => {
    if(Number(currentVer) < Number(targetVer)) return true; // 返回true，则为有更新
    else return false; // 返回false，则无更新
  }, true);
});
```

### semVer

默认的比较方式。即语义化版本比较方式。

例：
```text
"version": "1.0.0" -> "version": "1.0.1"
"version": "v1.0.0" -> "version": "v1.0.1"
```
该种情况适用此比较方式。

更多信息请见[SemVer官网](https://semver.org/lang/zh-CN/)

## showRelaunchDialog

该函数是一个`异步函数`。

该函数用于更新后弹出重启弹窗，并展示更新日志，它接受以下的参数：

`slug`: `string` - 需要展示更新日志的插件的slug

`showChangeLog`: `boolean` - 可选。是否展示更新日志，不填默认`false`

`changeLogFile`: `string` - 可选，只有在传入`showChangeLog`为`true`时有效。更新日志md文件的文件名，仅支持md格式，传入时**不需要**携带扩展名，不填默认为`changeLog`

它的返回值类型为：`void`

使用方法：
```js
// main.js
if(await LiteLoaderQQNT.api.downloadUpdate('your_slug', 'your_update_url(optional)')){
  await LiteLoaderQQNT.api.showRelaunchDialog('your_slug', true, 'your_changelog_file_name(optional)');
}
```

## useMirrors

该函数用于自定义检测、下载时使用的镜像，它接受以下的参数：

`slug`: `string` - 插件`slug`

`mirrors`: `array` - 镜像数组。具体格式及说明见[mirror.md](./mirror.md)

它的返回值类型为：`void`

使用方法：
```js
// main.js
app.whenReady().then(() => {
  LiteLoader.api.useMirrors('slug', mirrorsArray);
});
```