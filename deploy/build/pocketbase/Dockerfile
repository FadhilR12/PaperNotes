FROM alpine:3.24.1

RUN apk add --no-cache unzip ca-certificates

ARG PB_VERSION=0.40.4
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

WORKDIR /pb
COPY ./deploy/build/pocketbase/entrypoint.sh ./entrypoint.sh
RUN chmod a+rx ./entrypoint.sh

COPY ./pb/pb_hooks ./pb_hooks
COPY ./pb/pb_migrations ./pb_migrations

EXPOSE 8080
ENTRYPOINT ["sh", "./entrypoint.sh"]
