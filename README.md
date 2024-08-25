# LiteLoaderQQNT-CheckUpdateModule

## 说明
为 LiteLoaderQQNT 插件提供一个检测下载更新的API。

本插件不提供任何交互式API调用方式，仅能在插件代码内调用，即本插件**不是也不会是**插件市场类插件。

**1.7.1版本是最后一个支持LL1.2.0以下版本的版本！**

## 使用方法

请查看[API文档](./API.md)

## 注意事项
1. 使用本插件，目标插件**必须**在`manifest.json`中提供`repository`字段，并保证填写信息正确。如不想将源码开源，可以只将manifest上传Github，然后在Release中手动上传插件压缩包，或者自行提供下载链接即可。
2. 本插件理论适配Windows、Linux、MacOS，但仅有Windows经过实机测试，Linux、MacOS如不能正常使用，请提Issue。
3. 使用过程中产生的一切问题，请先确认是 本插件导致的 还是 依赖本插件的插件导致的，后者需要前往对应仓库进行反馈。
4. 本插件下载Github Release使用镜像，如果出现下载失败，请提Issue反馈，并暂时换用其它镜像或关闭镜像。
5. 本插件没有针对类似源码包的文件结构（即多层文件夹嵌套）的处理逻辑，请确保压缩包的文件结构正确。

## 安装方法

### 手动安装
1. 下载最新 [发行版](https://github.com/adproqwq/LiteLoaderQQNT-CheckUpdateModule/releases) 并解压
2. 将文件夹移动至 `LiteLoaderQQNT数据目录/plugins/` 下面
3. 重启QQNT即可

### 插件商店类插件自动安装
1. 找到本插件，执行安装操作
2. 如可以选择包的来源，请选择`Release包`。若无该选择，请确保其下载的是`Release包`
3. 重启QQNT即可

## 鸣谢
* [LiteLoaderQQNT](https://github.com/LiteLoaderQQNT/LiteLoaderQQNT/) - 框架
* [LiteLoaderQQNT-PluginTemplate-Vite](https://github.com/MisaLiu/LiteLoaderQQNT-PluginTemplate-Vite/) - 模板
* [LiteLoaderQQNT-lite_tools](https://github.com/xiyuesaves/LiteLoaderQQNT-lite_tools/) - 借鉴下载插件方面代码
* [Protocio](https://github.com/PRO-2684/protocio/) - 提供部分代码思路
* [list-viewer](https://github.com/ltxhhz/LL-plugin-list-viewer/) - 提供用户镜像处理思路

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