# LiteLoaderQQNT-CheckUpdateModule

## 说明
为 LiteLoaderQQNT 插件提供一个检测更新的API

## 使用方法

请查看[API文档](./API.md)

## 注意事项
1. 使用本插件，**必须**在`manifest.json`中提供`repository`字段，并保证填写信息正确。如不想将源码开源，可以只将manifest上传github，然后在调用`downloadUpdate`时指定下载链接即可。
2. 本插件理论适配Windows、Linux、MacOS，但仅有Windows经过实机测试，Linux、MacOS如不能正常使用，请提Issue。

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