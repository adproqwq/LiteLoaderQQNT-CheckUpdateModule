# LiteLoaderQQNT-CheckUpdateModule

## 说明
为 LiteLoaderQQNT 插件提供一个检测更新的API

## 使用方法
在主进程中调用`LiteLoaderQQNT.api.checkUpdate`方法，需要传入`slug`作为参数。

该方法会返回一个`boolean`类型或`null`的返回值。

该方法是一个异步函数。

举个栗子：
```js
// main.js
if(await LiteLoaderQQNT.api.checkUpdate('your_slug')) console.log('存在更新版本');
else if(await LiteLoaderQQNT.api.checkUpdate('your_slug') == null) console.log('manifest中未填写repository');
else console.log('没有更新版本');
```

## 注意事项
1. 本插件处于早期开发阶段，功能有限
2. 目前：使用本插件，需要在`manifest.json`中提供`repository`字段，并保证填写信息正确

## 安装方法
1. 下载最新 [发行版](https://github.com/adproqwq/LiteLoaderQQNT-CheckUpdateModule/releases) 并解压
2. 将文件夹移动至 `LiteLoaderQQNT数据目录/plugins/` 下面
3. 重启QQNT即可

## 鸣谢
* [LiteLoaderQQNT](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT/)
* [LiteLoaderQQNT-PluginTemplate-Vite](https://github.com/MisaLiu/LiteLoaderQQNT-PluginTemplate-Vite/)
* [LiteLoaderQQNT-lite_tools](https://github.com/xiyuesaves/LiteLoaderQQNT-lite_tools/)
* [Protocio](https://github.com/PRO-2684/protocio/)

## License
```
    LiteLoaderQQNT-CheckUpdateModule
    Copyright (C) 2024  Adpro

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
```