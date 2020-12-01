
# ERD-ONLINE INTRODUCTION
ERD-ONLINE is an online design software which shares collabarative data warehouse.Local apps are not needed to instal for using this online data warehouse.This is an excellent alternative to desktop data modeling tools.It has the following characteristics:
- **v1.0.0** Finished Version
	 - Online Operation
	 - Version Management
	 - Multi-database Support.(mysql、oracle、sqlserver、postgresql)
	 - Multi-database Configuration Management
	 - Database Reverse Analysis
	 - Exporting sql
	 - Online Execution of sql
	 - Exporting field Documents（word、pdf、html、markdown）
	 - Supporting Desktop Programs.(Windows，Mac，Linux).Opening up offline and online environments

- **v2.0.3** Finished Version
	 - Integrate Ant Design, add personnel, roles and permissions
	 - Add the login page
	 - Add project management, support to add, modify and delete projects
	 - Add log out
	 - Add the user system and beautify the page

## Pass by, point a star again，thank u!

## Documentation
 See the [中文文档](./README_CN.md) for document in Chinese.

## Version Planning
- **v2..0.4**
	-  User assigned roles and role configuration permissions

- **v2..0.5**
	-  Through the authority control page menu, as well as the button authority


- **v2..0.6**
	-  Operation log audit

- **v3.0.0**
	- 	Auto save

- **v3.0.1**
	- 	Online multi person collaboration
	
- **v3.0.2**
	- 	Through the authority control SQL operation authority, further realizes the SQL approval

 ## preparation

### Install Docker
[https://www.runoob.com/docker/centos-docker-install.html](https://www.runoob.com/docker/centos-docker-install.html)

### Install Docker-compose
[https://www.runoob.com/docker/docker-compose.html](https://www.runoob.com/docker/docker-compose.html)

### configure Host
```bash
127.0.0.1 erd-online
```
 **Note: write 127.0.0.1 for local deployment and remote server IP for remote deployment. If you feel troublesome, you can use the domain name instead of /src/ utils/ request.js :**
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/2020113017231535.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70)


## Start And Operation
### Start Server
- clone project
```shell script
# git clone https://github.com/whaty/MARTIN-ERD.git erd

# cd erd

```
- One click Start
```shell script
# docker-compose up -d

```

### Start UI
- Installation dependency
```shell script
# yarn install
```

- Run

```
# yarn start
```
open [http://localhost:3000](http://localhost:3000)

## Package desktop package

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

** At this point, Web, Windows, MAC, Linux can be used together!! **

## WEB Version Preview Address：

[https://www.java2e.com/](https://www.java2e.com/)

## Code Warehouse：

- Github : [https://github.com/whaty/MARTIN-ERD.git](https://github.com/whaty/MARTIN-ERD.git)
- Gitee:  [https://gitee.com/MARTIN-88/erd-online.git](https://gitee.com/MARTIN-88/erd-online.git)

## Software Description Blog

[ERD-ONLINE Free Online Database Modeling Tool](https://my.oschina.net/martin88/blog/4719346 "ERD-ONLINE Free Online Database Modeling Tool")


###  Let's Have A Look

#### Login Page
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020111611212547.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70#pic_center)
#### Workbench
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201116112149167.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70#pic_center)


#### Loading Page
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201116112328963.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70#pic_center)



#### Working Page
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




#### Documentation Generating
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201105173536907.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70#pic_center)


####  Shoulders of Giants

- React[(https://reactjs.org](https://reactjs.org))
- font-awesome([http://www.fontawesome.com.cn](http://www.fontawesome.com.cn))
- AntV-G6 ([http://antvis.github.io/g6/doc/index.html](http://antvis.github.io/g6/doc/index.html)) 
- highlightjs([https://highlightjs.org](https://highlightjs.org))
- ace editor([https://ace.c9.io](https://ace.c9.io))
- doT.js([http://olado.github.io](http://olado.github.io))

##### Gratitudes
- PDMan ([http://www.pdman.cn/](http://www.pdman.cn/))，Thanks for PDMan  working hard to open up the MIT protocol for many years.




## Information Exchange Group
***QQ Group***

Click the link to join the group chat

【ERD-ONLINE】：https://jq.qq.com/?_wv=1027&k=lnlbfelw

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020111611001565.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMwMDU0OTYx,size_16,color_FFFFFF,t_70#pic_center)



***Dingding Group***

![](https://img-blog.csdnimg.cn/img_convert/1d01b1b76d64ea8129fa4a4ac0d5e517.png)




 
