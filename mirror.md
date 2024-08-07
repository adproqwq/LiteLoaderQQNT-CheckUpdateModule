# mirror

v1.4.0 开放用户镜像配置，该配置为实验性，暂不支持在QQ中设置，需要在配置文件中修改。以下是简略教程。

目前（v1.6.0）支持设置多个镜像，设置镜像前请确保该镜像能**同时**代理raw和release文件，每次设置之后都需要在设置页面点击`刷新镜像配置`。

`useMirrors`函数请直接参照格式传入参数即可，无需在配置文件中配置。

## 镜像配置格式

镜像配置位于插件配置文件中`experiment`下的`mirrors`配置项

`mirrors`配置接受一个数组，数组内部可以包含多个对象，对象中应包含`type`、`domain`两个配置。

这是默认的配置：

```json
mirrors: [
  {
    type: "total",
    domain: "https://mirror.ghproxy.com"
  }
]
```

以下是每项的具体说明：

### type

`type`接受`total`或`domain`或`off`之一的值。

`total`指镜像链接的使用方式是在github源链接的基础上添加镜像域名。

举例：

源链接：https://github.com/1234/1234.md

则镜像链接为：https://mirror.example.com/https://github.com/1234/1234.md

而`domain`则指镜像链接的使用方式是替换原有github域名。

举例：

源链接：https://github.com/1234/1234.md

则镜像链接为：https://mirror.example.com/1234/1234.md

`off`则不使用镜像，直连github。请确保`off`必须放在数组中的首位，否则`off`将会失效，且该镜像会被无视。当`type`为`off`时，`domain`的设置将被无视。

### domain

`domain`接受一个`string`类型的值。

值的内容应为一个包含`协议`与`完整域名`的url。

需要注意的是：url的结尾不要带上`/`字符，否则将无法正确拼接镜像url。

当`type`为`off`时，该值将被无视，无论填写什么，都不会起效，但**必须**填写。