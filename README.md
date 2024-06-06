# LiteLoaderQQNT-CheckUpdateModule

## 说明
为 LiteLoaderQQNT 插件提供一个检测更新的API

## 使用方法

请查看[API文档](./API.md)

## 注意事项
1. 使用本插件，目标插件**必须**在`manifest.json`中提供`repository`字段，并保证填写信息正确。如不想将源码开源，可以只将manifest上传github，然后自行解决下载更新包的问题即可。
2. `repository`中若存在`tag`，`tag`中不能填`latest`。
3. 本插件理论适配Windows、Linux、MacOS，但仅有Windows经过实机测试，Linux、MacOS如不能正常使用，请提Issue。
4. 使用过程中产生的一切问题，请先确认是 本插件导致的 还是 依赖本插件的插件导致的，后者需要前往对应仓库进行反馈。
5. 本插件下载Github Release或源码使用镜像，如果出现下载失败，请提Issue反馈。

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