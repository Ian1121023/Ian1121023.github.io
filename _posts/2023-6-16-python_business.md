---
layout: post
title: python商管
date: 2023-06-16
tags: python   
---

你好


## 第一節

### 無套利條件
![](https://github.com/Ian1121023/Ian1121023.github.io/blob/master/images/python-business/picture1.PNG?raw=true)<br>
#### 如何抓住稍縱即逝的機會?
1. 高頻交易 <br>
  - 人做不到，機器做得到 
2. 社群媒體

## 博客主要模块介绍

### _config.yml 

`_config.yml` 是博客的配置文件，整个站点的信息都在这修改，想要把我的模板改成你自己的也需要修改`_config.yml` 

**重要字段说明** 

* enableToc: 是否开启文章自动生成目录，设置为false文章不会自动生成目录
* comment/livere: livere评论系统，支持微信、qq、微博、豆瓣、twitter等登录后可以直接评论
* comment/disqus: disqus评论系统，支持facebook、twitter等登录后可以直接评论
* social/weibo、github、zhihu、jianshu等: 个人站底部展示的微博等三方社交按钮，点击后直接跳转到个人微博或其他社交主页
* baidu/id: 百度统计，用来统计你个人站点的用户访问情况
* ga/id: google统计，用来统计你个人站点的用户访问情况

_config.yml 文件除以上字段还有一些可以自行修改，例如title之类的字段

### _posts

`_posts` 目录是用来存放文章的目录，写新文章，直接放在这个目录即可

使用博客模板时，请把博客自带的文章给去掉，如果想使用博客自带的文章请 `注明出处`。


### 自定义页面

about.md、support.md 等为自定义页面，如果你想添加自动以页面可以直接复制about.md 文件修改文件名和里面的内容即可。

如果需要在导航显示你新增的页面，直接在`_config.yml` 文件的nav字段中添加你新页面配置即可

### 修改说明

如果要修改博客模板信息建议只修改`_config.yml` 文件内容和 `_posts` 里面的文章信息。因为博客模板一直在更新迭代，改动多了以免你后期更新博客模板的时候不方便。

如果你想改动模板的样式又想继续更新迭代博客模板，你可以提交在github上提交`pull request` 或者直接给我发邮件建议改成什么样，如果你的提议确实可以，我会采纳的，并且非常感谢你的建议。

博客迭代信息请看[ReleaseNode](http://leopardpan.cn/2020/07/ReleaseNode/)

遇到解决不了的问题可以找 [技术支持](http://leopardpan.cn/support/)





