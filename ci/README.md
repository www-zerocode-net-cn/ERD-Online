- 进入到本目录
- 从Dockerfile 打包镜像
```
docker build  -t erdonline/erd-ui:latest .
```
- 进入martin根目录，执行下面命令启动erd-ui
```
docker-compose up erd-ui
```