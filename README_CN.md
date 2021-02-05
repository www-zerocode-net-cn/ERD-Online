# ERD-ONLINE说明

## 官方在线预览地址：
 [https://www.java2e.com/](https://www.java2e.com/)
 
## 功能特点
ERD-ONLINE是一款在线协作数据仓库设计软件，无需本地安装应用程序，在线操作数据库，是桌面数据建模工具的一个优秀的替代方案。具备以下特点:
- **v1.0.0** 完成版
	 - 在线操作
	 - 版本管理
	 - 多数据库支持，mysql、oracle、sqlserver、postgresql
	 - 多数据库配置管理
	 - 数据库逆向解析
	 - 导出sql
	 - 在线执行sql
	 - 导出字段文档（word、pdf、html、markdown）
	 - 同时支持桌面版程序，Windows，Mac，Linux三个平台均可以使用，打通线下、线上环境

- **v2.0.3** 完成版
	 - 集成and design，加入人员、角色、权限
	 - 加入登录页
	 - 加入项目管理，支持新增、修改、删除项目
	 - 加入退出登录
	 - 加入用户体系，美化页面

## 走过路过，点个Star再过,爱你哦！

## Documentation
 See the [English Documentation](./README.md) for document in English.
 

 
## 版本规划
- **v2..0.4**
	-  用户分配角色、角色配置权限

- **v2..0.5**
	-  通过权限控制页面菜单、以及按钮权限

- **v2..0.6**
	-  操作日志审计

- **v3.0.0**
	- 	自动保存

- **v3.0.1**
	- 	在线多人协作
	
- **v3.0.2**
	- 	通过权限控制sql操作权限，进一步实现sql审批
 
## 准备

### 安装 docker
[https://www.runoob.com/docker/centos-docker-install.html](https://www.runoob.com/docker/centos-docker-install.html)

### 安装 docker-compose
[https://www.runoob.com/docker/docker-compose.html](https://www.runoob.com/docker/docker-compose.html)

### 配置host
```bash
127.0.0.1 erd-online
```
 **备注：如果本地部署则写127.0.0.1，远程部署则需要写远程服务器ip。如果觉得麻烦，可使用域名，替换/src/utils/request.js中以下地方**
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/2020113017231535.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70)

 


## 安装运行
### 启动服务端
- 下载项目
```shell script
# git clone https://gitee.com/MARTIN-88/erd-online.git erd

# cd erd

```
- 一键启动
```shell script
# docker-compose up -d

```

### 启动前端
- 安装依赖
```shell script
# yarn install
```

- 运行

```
# yarn start
```
打开 [http://localhost:3000](http://localhost:3000)

## 打包桌面程序包
- Windows
```
# yarn package-win
```

- MAC
```
# yarn package-mac
```

- Linux
```
# yarn package-linux
```

**至此，web、Windows、MAC、Linux多端都可以一起用了，开心吧！！**





## 代码仓库：

- Github : [https://github.com/whaty/MARTIN-ERD.git](https://github.com/whaty/MARTIN-ERD.git)
- Gitee:  [https://gitee.com/MARTIN-88/erd-online.git](https://gitee.com/MARTIN-88/erd-online.git)

## 软件说明博客

[ERD-ONLINE 免费在线数据库建模工具](https://my.oschina.net/martin88/blog/4719346 "ERD-ONLINE 免费在线数据库建模工具")


###  先睹为快
#### 登录页
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020111611212547.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70#pic_center)
#### 工作台
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201116112149167.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70#pic_center)


#### Loading页
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201116112328963.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70#pic_center)



#### 工作页
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201116112229639.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201116112755606.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201116112815724.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201116113101826.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70#pic_center)


![在这里插入图片描述](https://img-blog.csdnimg.cn/20201116113031403.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70#pic_center)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201116113144719.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201116113205515.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201116113225911.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201116113436813.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201116113451323.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70#pic_center)






#### 生成文档
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201105173536907.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70#pic_center)


##  巨人的肩膀

- React[(https://reactjs.org](https://reactjs.org))
- font-awesome([http://www.fontawesome.com.cn](http://www.fontawesome.com.cn))
- AntV-G6 ([http://antvis.github.io/g6/doc/index.html](http://antvis.github.io/g6/doc/index.html)) 
- highlightjs([https://highlightjs.org](https://highlightjs.org))
- ace editor([https://ace.c9.io](https://ace.c9.io))
- doT.js([http://olado.github.io](http://olado.github.io))

#### 特别感谢
- PDMan ([http://www.pdman.cn/](http://www.pdman.cn/))，PDMan以MIT协议开放了多年的心血，鸣谢




## 交流群
***QQ***
点击链接加入群聊【ERD-ONLINE】：https://jq.qq.com/?_wv=1027&k=lnlbfelw

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020111611001565.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70#pic_center)


***钉钉群***

![](https://img-blog.csdnimg.cn/img_convert/1d01b1b76d64ea8129fa4a4ac0d5e517.png)




 
