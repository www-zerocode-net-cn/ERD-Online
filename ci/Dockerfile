FROM nginx:1.20.2

MAINTAINER martin114@foxmail.com

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

ADD ./ci/erd.tar.gz /usr/share/nginx/html

ADD ./ci/conf/nginx.conf /etc/nginx/nginx.conf


WORKDIR /usr/share/nginx/html

COPY ./ci/env.sh .

COPY ./ci/env .

RUN chmod +x env.sh

EXPOSE 9669

CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
