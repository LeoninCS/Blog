---
title: "第2章 Kubernetes 实践指南"
description: "第2章 Kubernetes 实践指南 本章将从 Kubernetes 的系统安装开始，逐步介绍 Kuberetes 的服务相关配置、命令行工具 kubectl 的使用详解，然后通过大量案例实践对 Kubernetes 最核心的容器和微服务架构的概念和 用法进行详细说明。 2.1 Kubernetes 安装与配置 2.1.1 安装 Kubernetes Ku"
readerUrl: "/books/kubernetes-authoritative-guide-2nd/002-第2章-kubernetes-实践指南.pdf"
sourceUrl: "授权 PDF：Kubernetes权威指南：从Docker到Kubernetes实践全接触（第2版).pdf，页 56-177"
workSlug: "kubernetes-authoritative-guide-2nd"
workTitle: "Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第 2 版）"
chapterSlug: "002-第2章-kubernetes-实践指南"
order: 2
categories: ["云原生", "Kubernetes"]
tags: ["Kubernetes", "Docker", "容器", "集群管理"]
---
<div class="imported-document imported-pdf-document">
<h2>第2章 Kubernetes 实践指南</h2>
<h2>第 56 页</h2>
<h3>第2章</h3>
<p>Kubernetes 实践指南</p>
<p>本章将从 Kubernetes 的系统安装开始，逐步介绍 Kuberetes 的服务相关配置、命令行工具 kubectl 的使用详解，然后通过大量案例实践对 Kubernetes 最核心的容器和微服务架构的概念和 用法进行详细说明。</p>
<h3>2.1 Kubernetes 安装与配置</h3>
<p>2.1.1</p>
<p>安装 Kubernetes</p>
<p>Kubernetes 系统由一组可执行程序组成，用户可以通过GitHiub 上的 Kubernetes 项目页下载 编译好的二进制包，或者下载源代码并编译后进行安装。</p>
<p>安装 Kubernetes 对软件和硬件的系统要求如表2.1 所示。</p>
<p>表2.1 安装 Kubernetes 对软件和硬件的系统要求 软硬件</p>
<p>CPU和内存</p>
<p>最低配置</p>
<p>Master： 至少 1 core 和2GB 内存 Node：至少 1 core 和 2GB 内存 Linux 操作</p>
<p>系统</p>
<p>推荐配置</p>
<p>Master: 2 core 和4GB 内存 Node：由于要运行 Docker，所以应根 据需要运行的容器数量进行调整</p>
<p>基于 x8664 架构的各种 Linux 发行版本，包括 Red Hat Linux、 Red Hat Linux 7</p>
<p>CentOS、Fedora、Ubuntu 等，Kernel 版本要求在3.10及以上。</p>
<p>CentOS 7</p>
<p>也可以在谷歌的GCE（Google Compute Engine）或者 Amazon的AWS （Amazon Web Service）云平台上进行安装</p>
<h2>第 57 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 续表</p>
<p>软硬件</p>
<p>Docker</p>
<p>最低配置</p>
<p>推荐配置</p>
<p>1.9版本及以上</p>
<h3>1.12 版本</h3>
<p>下载和安装说明见 https://www.docker.com etcd</p>
<p>2.0版本及以上</p>
<p>3.0版本</p>
<p>下载和安装说明见 https://github.com/coreos/etcd/releases 最简单的安装方法是使用 yum install kubernetes 命令完成 Kubernetes 集群的安装，但仍需修 改各组件的启动参数，才能完成 Kubernetes 集群的配置。</p>
<p>本章以二进制文件和手工配置启动参数的形式进行安装，对每个组件的配置进行详细说明。</p>
<p>从 Kubernetes 官网下载编译好的二进制包，如图2.1所示，下载地址 https://github.com/ kubernetes/kubernetes/releases。本书基于 Kubernetes 1.3版本进行说明。</p>
<p>0M.30</p>
<p>92831379</p>
<p>V1.3.0</p>
<p>david-mcmahon releaseci this on 2 Jut. 179 commits to release-1.3 since this release See kubernetes-announce@ and CHANGELOG for details.</p>
<p>Downloads</p>
<p>⑦ kubernetes.tar.gz 山 Source code （zip） 因 Source code （tar.gz）</p>
<h3>1.38 G8</h3>
<p>图 2.1 GitHub 上 Kubernetes 的下载页面 在压缩包 kubernetes.tar:gz 内包含了 Kubernetes 的服务程序文件、文档和示例。</p>
<p>解压缩后，server 子目录中的 kubernetes-server-linux-amd64.tar.gz 文件包含了 Kubernetes 需 要运行的全部服务程序文件。服务程序文件列表如表2.2所示。</p>
<p>表2.2 服务程序文件列表</p>
<p>文件名</p>
<p>hyperkube</p>
<p>Kube-apiserver</p>
<p>kube-apiserver.docker. 1ag kube-apiserver.tar kube-controller-manager kube-controller-manager:docker_tag kube-controller-manager.tar kubectl</p>
<p>说明</p>
<p>总控程序，用于运行其他 Kubemnetes 程序 apiserver 主程序</p>
<p>apiserver docker 镜像的 tag apiserver docker 镜像文件 controller-manager 主程序 controller-manager docker 镜像的1ag controller-manager docker 镜像文件 客户端命令行工具</p>
<p>• 44•</p>
<h2>第 58 页</h2>
<h3>第2章</h3>
<p>Kubernetes 实践指南</p>
<p>续表</p>
<p>文件名</p>
<p>说</p>
<p>明</p>
<p>kubelet</p>
<p>kubelet 主程序</p>
<p>kube-proxy</p>
<p>proxy 主程序</p>
<p>kube-scheduler</p>
<p>scheduler 主程序</p>
<p>kube-scheduler.docker._tag.</p>
<p>scheduler docker 镜像的 tag kube-scheduler.tar scheduler docker 镜像文件 Kubernetes Master 节点安装部署 etcd、kube-apiserver、kube-controller-manager、kube-scheduler 服务进程。我们使用 kubectl作客户端与 Master 进行交互操作，在工作Node 上仅需部署 kubelet 和 kube-proxy 服务进程。Kubernetes 还提供了一个 “all-in-one” 的 hyperkube 程序来完成对以上 服务程序的启动。</p>
<p>2.1.2</p>
<p>配置和启动 Kubernetes 服务 Kubernetes 的服务都可以通过直接运行二进制文件加上启动参数完成。为了便于管理，常 见的做法是将 Kubernetes 服务程序配置为 Linux 的系统开机自动启动的服务。</p>
<p>本节以 CentOS Linux 7为例，使用 Systemd 系统完成 Kubernetes 服务的配置。其他 Linux 发行版的服务配置请参考相关的系统管理手册。</p>
<p>需要注意的是，CentOS Linux 7 默认启动了 firewalld——防火墻服务，而 Kubernetes 的 Master 与工作 Node 之间会有大量的网络通信，安全的做法是在防火墙上配置各组件需要相互 通信的端口号，具体要配置的端口号详见2.1.6 节中各服务监听的端口号说明。在一个安全的内 部网络环境中可以关闭防火墙服务：</p>
<p># systemctl disable firewalld # systemctl stop firewalld 将 Kubernetes 的可执行文件复制到/usr/bin（如果复制到其他目录，则将 systemd 服务文件 中的文件路径修改正确即可），然后对服务进行配置。</p>
<p>在下面的服务启动参数说明中主要介绍最重要的启动参数，每个服务的启动参数还有很多， 详见2.1.6节的完整说明。有兴趣的读者可以尝试修改它们，以观察服务运行的不同效果。</p>
<p>1. Master 上的etcd、kube-apiserver、kube-controller-manager、kube-scheduler 服务 1） etcd服务</p>
<p>启动。</p>
<p>etcd 服务作为 Kubernetes 集群的主数据库，在安装 Kubernetes 各服务之前需要首先安装和 •45•</p>
<h2>第 59 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 从 GitHub 官网下载 etcd 发布的二进制文件，将 etcd 和 etcdctl 文件复制到/ust/bin 目录。</p>
<p>设置 systemd 服务文件/ust/lib/systemd/system/etcd.service：</p>
<p>［Unit］</p>
<p>Description=Etcd Server After=network.target ［Servicel</p>
<p>Type=simple</p>
<p>WorkingDirectory=/var/1ib/etcd/ EnvironmentFile=-/etc/etcd/etcd.conf ExecStart=/usr/bin/etcd ［Instal1］</p>
<p>WantedBy=multi-user.target 其中 WorkingDirectory （/var/ib/etcd/） 表示 etcd 数据保存的目录，需要在启动 etcd 服务之 前进行创建。</p>
<p>配置文件/etc/etcd/etcd.conf 通常不需要特别的参数设置（详细的参数配置内容参见官方文 档），etcd 默认将监昕在 http://127.0.0.1:2379地址供客户端连接。</p>
<p>配置完成后，通过 systemctl start 命令启动 etcd 服务。同时，使用 systemctl enable 命令将服 务加入开机启动列表中：</p>
<p># systemctl daemon-reload # systemctl enable etcd.service # systemctl start etcd.service 通过执行 etcdctl cluster-health，可以验证 etcd 是否正确启动：</p>
<p># etcdctl cluster-health member ce2a822cea30bfca is healthy : got healthy result from http://127.0.0.1:2379 cluster is healthy 2） kube-apiserver 服务 将 kube-apiserver 的可执行文件复制到/ust/bin 目录。</p>
<p>编辑 systemd 服务文件/usr/ib/systemd/system/kube-apiserver.service，内容如下：</p>
<p>［Unit］</p>
<p>Description=Kubernetes API Server Documentation=https://github.com/GoogleCloudPlatform/kubernetes Aftez=etcd.service Wants=etcd.service ［Service］</p>
<p>EnvironmentFile=/etc/kubernetes/apiserver •46•</p>
<h2>第 60 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>ExecStart=/USr/bin/kube-apiserver $KUBE_ ARI_ARGS Restart=on-failure Iype=notify</p>
<p>LimitNOFILE=65536</p>
<p>［Instal1］</p>
<p>WantedBy=multi-user.target 配置文件/etc/kubernetes/apiserver 的内容包括了 kube-apiserver 的全部启动参数，主要的配 置参数在变量 KUBE_APL_ARGS 中指定。</p>
<p># cat /etc/kubernetes/apiserver KUBE</p>
<p>_API_ARGS=&quot;--etcd</p>
<p>-servers=http://127.0.0.1:2379 --insecure-bind-address=0.0.0.0 --insecure-Port=8080 --service-cluster-ip-range=169.169.0.0/16 --service-node-port-range=1-65535 --admission</p>
<p>_control=Namespacelifecycle,LimitRanger, SecurityContextDeny, ServiceAc count,ResourceQuota --logtostderr=false --log-dir=/var/log/kubernetes --v=2&quot; 对启动参数的说明如下。</p>
<p>--etcd_servers： 指定 etcd 服务的 URL。</p>
<p>-insecure-bind-address: apiserver 绑定主机的非安全IP地址，设置0.0.0.0表示绑定所 有IP地址。</p>
<p>-insecure-port: apiserver 绑定主机的非安全端口号，默认为 8080。</p>
<p>--service-cluster-ip-range: Kubernetes 集群中 Service 的虚拟IP 地址段范围，以CIDR 格 式表示，例如 169.169.0.0/16，该IP 范围不能与物理机的真实 IP段有重合。</p>
<p>--service-node-port-range:Kubernetes 集群中 Service 可映射的物理机端口号范围，默认 为 30000～32767。</p>
<p>-admission_control: Kubemnetes 集群的准入控制设置，各控制模块以插件的形式依次生效。</p>
<p>--logtostderr：设置为 false 表示将日志写入文件，不写入stderr。</p>
<p>--log-dir：日志目录。</p>
<p>--V：日志级别。</p>
<p>3） kube-controller-manager 服务 kube-controller-manager 服务依赖于 kube-apiserver 服务。</p>
<p># cat /usr/lib/systemd/system/kube-controller-manager.service ［Unit］</p>
<p>Description=Kubernetes Controller Manager Documentation=https://github.com/GoogleCloudPlatform/kubernetes After=kube-apiserver.service Requires=kube-apiserver.service •47•</p>
<h2>第 61 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） ［Service］</p>
<p>EnvironmentFile=/etc/kubernetes/contro1ler-manager ExecStart=/uSr/bin/kube-controller-manager $KUBE_CONTROLLER_MANAGER_ARGS Restart=on-failure LimitNOFILE=65536</p>
<p>［Instal1］</p>
<p>WantedBy=multi-user.target 配置文件/etc/kubernetes/controller-manager 的内容包括了 kube-controller-manager 的全部启 动参数，主要的配置参数在变量 KUBE_CONTROLLER_MANAGER_ARGS 中指定。</p>
<p># cat /etc/kubernetes/controller-manager KUBE_CONTROLLER_MANAGER」 _ARGS=&quot;--master=http://192.168.18.3:8080 --logtostderr=false --log-dir=/var/1og/kubernetes --v=2&quot; 对启动参数的说明如下。</p>
<p>-master：指定 apiserver 的 URL 地址。</p>
<p>--logtostderr：设置为 false 表示将日志写入文件，不写入 stderr。</p>
<p>--log-dir：日志目录。</p>
<p>-V：日志级别。</p>
<p>4） kube-scheduler 服务 kube-scheduler 服务也依赖于 kube-apiserver 服务。</p>
<p># cat /usr/lib/systemd/system/kube-controller-manager.service ［Unit］</p>
<p>Description=Kubernetes Controller Manager Documentation=https://github.com/GoogleCloudPlatform/kubernetes After=kube-apiserver.service Requires=kube-apiserver.service ［Service］</p>
<p>EnvironmentFile=/etc/kubernetes/scheduler ExecStart=/usz/bin/kube-scheduler $KUBE_SCHEDULER_ARGS Restart=on-failure LimitNORILE=65536</p>
<p>［Instal1］</p>
<p>WantedBy=multi-user.target 配置文件/etc/kubernetes/scheduler 的内容包括了 kube-scheduler 的全部启动参数，主要的配 置参数在变量 KUBE_SCHEDULER _ARGS 中指定。</p>
<p># cat /etc/kubernetes/scheduler •48•</p>
<h2>第 62 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>KUBE</p>
<p>_SCHEDULER_ARGS=&quot;--master=http://192.168.18.3:8080 --logtostderr=false --1og-dir=/var/log/kubernetes --v=2&quot; 对启动参数的说明如下。</p>
<p>© -master： 指定 apiserver 的URL 地址。</p>
<p>s -logtostderr：设置 false 表示将日志写入文件，不写入 stderr。</p>
<p>◎-log-dir： 日志目录。</p>
<p>◎ -v：日志级别。</p>
<p>配置完成后，执行 systemctl start 命令按顺序启动这3个服务。同时，使用 systemctl enable 命令将服务加入开机启动列表中。</p>
<p># systemctl daemon-reload # systemct1 enable kube-apiserver.service # systemct1</p>
<p>start kube-apiserver.service # sYstemct1</p>
<p>enable kube-controller-manager # systemct1</p>
<p>start kube-controller-manager systemctl</p>
<p>enable kube-scheduler # systemct1</p>
<p>start kube-scheduler 通过 systemctl status &lt;service_name&gt;来验证服务的启动状态，“running” 表示启动成功。</p>
<p>到此，Master 上所需的服务就全部启动完成了。</p>
<p>2. Node 上的 kubelet、kube-proxy 服务 在工作 Node 节点上需要预先安装好 Docker Daemon 并且正常启动。Docker 的安装详见 http://www.docker.com 的说明。</p>
<p>1） kubelet 服务</p>
<p>kubelet 服务依赖于 Docker 服务。</p>
<p># cat /usr/lib/systemd/system/kubelet.service Description=Kubernetes Kubelet Server Documentation=https://github.com/GoogleCloudPlatform/kubernetes After=docker.service Requires=docker.service ［Service］</p>
<p>WorkingDirectory=/var/lib/kubelet EnvironmentFile=/etc/kubernetes/kubelet ExecStart=/usr/bin/ kubelet SKUBELET_ARGS Restart=on-failure • 49</p>
<h2>第 63 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） ［Instal1］</p>
<p>WantedBy=multi-user.target 其中 WorkingDirectory 表示 kubelet 保存数据的目录，需要在启动 kubelet 服务之前进行 创建。</p>
<p>配置文件/etc/kubernetes/kubelet 的内容包括了kubelet 的全部启动参数，主要的配置参数在 变量 KUBELET</p>
<p>_ARGS 中指定。</p>
<p># cat /etc/kubernetes/kubelet KUBELET_ARGS=&quot;--api-servers=http://192.168.18.3:8080 --hostname-override=192.168.18.3 --logtostderr=false --log-dir=/var/log/kubernetes --v=2&quot; 对启动参数的说明如下。</p>
<p>◎</p>
<p>-api-servers：指定 apiserver 的URL 地址，可以指定多个。</p>
<p>◎</p>
<p>--hostname-override：</p>
<p>设置本 Node 的名称。</p>
<p>◎</p>
<p>--logtostderr：设置 false 表示将日志写入文件，不写入 stderr。</p>
<p>◎</p>
<p>-log-dir：日志目录。</p>
<p>◎</p>
<p>-V：日志级别。</p>
<p>2） kube-proxy 服务</p>
<p>kube-proxy 服务依赖于 network 服务。</p>
<p>［Unit］</p>
<p>Description=Kubernetes Kube-Proxy Server Documentation=https://github.com/GoogleCloudPlatform/kubernetes After=network.target Requires=network .service ［Service］</p>
<p>EnvironmentFile=/etc/kubernetes/proxy ExecStart=/uSr/bin/kube-Proxy $KUBE_PROXY_ ARGS Restart=on-failure LimitNOFILE=65536</p>
<p>［Install］</p>
<p>WantedBy=multi-user.target 配置文件/etc/kubernetes/proxy 的内容包括了 kube-proxy 的全部启动参数，主要的配置参数 在变量 KUBE_PROXY _ARGS 中指定。</p>
<p># cat /etc/kubernetes/proxy KUBE_PROXY_ARGS=&quot;--master=http://192.168.18.3:8080--1ogtostderr=false --log-dir=/var/log/kubernetes --v=2&quot; • 50•</p>
<h2>第 64 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>对启动参数的说明如下。</p>
<p>-master：指定 apiserver 的URL地址。</p>
<p>◎</p>
<p>--logtostderr：设置次 false 表示将日志写入文件，不写入 stderr。</p>
<p>◎</p>
<p>-log-dir：日志目录。</p>
<p>（）</p>
<p>-v：日志级别。</p>
<p>配置完成后，通过 systemctl 启动 kubelet 和 kube-proxy 服务：</p>
<p># systemct1 daemon-reload # systemctl enable kubelet.service # systemctl start kubelet.service #systemct1 enable kube-proxy # systemctl start kube-proxy kubelet 默认采用向 Master 自动注册本 Node 的机制，在Master 上查看各 Node 的状态，状 态为 Ready 表示 Node 已经成功注册并且状态可用。</p>
<p># kubectl get nodes NAME</p>
<p>STATUS</p>
<p>AGE</p>
<p>192.168.18.3</p>
<p>Ready</p>
<p>1m</p>
<p>等所有 Node 的状态都为Ready 之后，一个 Kubernetes 集群就启动完成了。接下来就可以 创建 Pod、RC、Service 等资源对象来部署 Docker 容器应用了。</p>
<p>2.1.3</p>
<p>Kubernetes 集群的安全设置 1. 基于 CA签名的双向数字证书认证方式 在一个安全的内网环境中，Kubernetes 的各个组件与 Master 之间可以通过 apiserver 的非安 全端口 http://apiserver:8080 进行访问。但如果 apiserver 需要对外提供服务，或者集群中的某些 容器也需要访问 apiserver 以获取集群中的某些信息，则更安全的做法是启用 HTTPS 安全机制。</p>
<p>Kubernetes 提供了基于CA 签名的双向数字证书认证方式和简单的基于 HTTP BASE 或 TOKEN 的认证方式，其中 CA 证书方式的安全性最高。本节先介绍以 CA 证书的方式配置 Kubernetes 集群，要求 Master 上的 kube-apiserver、kube-controller-manager、kube-scheduler 进程及各 Node 上的kubelet、kube-proxy 进程进行CA签名双向数字证书安全设置。</p>
<p>基于 CA签名的双向数字证书的生成过程如下。</p>
<p>（1） 为 kube-apiserver 生成一个数字证书，并用CA证书进行签名。</p>
<p>（2）为kube-apiserver 进程配置证书相关的启动参数，包括CA 证书（用于验证客户端证书 • 51</p>
<h2>第 65 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 的签名真伪）、自己的经过CA签名后的证书及私钥。</p>
<p>（3）为每个访问 Kubernetes API Server 的客户端（如 kube-controller-manager、kube-scheduler、 kubelet、kube-proxy 及调用 API Server 的客户端程序 kubectl 等）进程生成自己的数字证书，也 都用CA 证书进行签名，在相关程序的启动参数里增加CA证书、自己的证书等相关参数。</p>
<p>1）设置 kube-apiserver 的CA证书相关的文件和启动参数 使用 OpenSSL 工具在 Master 服务器上创建CA证书和私钥相关的文件：</p>
<p># openssl genrsa -out ca.key 2048 # openss1 req -x509 -new -nodes -key ca.key -subj&quot;/CN=Yourcompany.com&quot;-days 5000 -out ca.czt</p>
<p># openssl genrsa -out server.key 2048 注意：生成 ca.crt 时，-subj参数中“/CN”的值通常为域名。</p>
<p>准备 master_ssl.cnf文件，该文件用于x509v3版本的证书。在该文件中主要需要设置 Master 服务器的 hostname （k8s-master）、IP 地址 （192.168.18.3），以及 Kubernetes Master Service 的虚 拟服务名称（kubernetes.default 等）和该虚拟服务的 ClusterIP 地址（169.169.0.1）。</p>
<p>master_ssl.cnf文件的示例如下：</p>
<p>［req］</p>
<p>req_extensions = v3 -Fe9</p>
<p>distinguished</p>
<p>_name = req_distingu1Shed_name ［req_distinguished _name］</p>
<p>［ v3</p>
<p>-reg ］</p>
<p>basicConstraints = CA:FALSE keyUsage = nonRepudiation,digitalSignature, keyEncipherment subjectAltName = @alt， _names</p>
<p>［alt_names］</p>
<p>DNS.1 = kubernetes DNS.2 = kubernetes.default DNS.3 = kubernetes.default.svc DNS.4 = kubernetes.default.svc.cluster.local DNS.5 = k8s-master IP.1 = 169.169.0.1 IP.2 = 192.168.18.3 基于 master_ssl.cnf 创建 server.cst 和 server.crt 文件。在生成 server.csr 时，-subj参数中“/CN” 指定的名字需为 Master 所在的主机名。</p>
<p># openssl req -new -key server.key -subj&quot;/CN=k8s-master&quot; -config master_ssl.cnf -out server.Csr</p>
<p># openssl x509 -reg -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -days 5000 -extensions v3_req -extfile master_ssl.cnf -out server.crt 全部执行完后会生成6个文件：ca.crt、ca.key、ca.stl、server.crt、server.csr、server.key。</p>
<p>• 52•</p>
<h2>第 66 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>将这些文件复制到一个目录中（例如/var/run/kubernetes/），然后设置 kube-apiserver 的三个 启动参数“--client-ca-file”“_-tls-cert-file” 和“_-tls-private-key-file”，分别代表CA 根证书文件、 服务端证书文件和服务端私钥文件：</p>
<p>--client_ca_file=/var/run/kubernetes/ca.crt --tls-private-key-file=/var/run/kubernetes/server.key --tls-cert-file=/var/run/kubernetes/server.crt 同时，可以关掉非安全端口 8080，设置安全端口为443（默认 6443）：</p>
<p>--insecure-port=0</p>
<p>--secure-Port=443</p>
<p>最后重启 kube-apiserver 服务。</p>
<p>2）设置 kube-controller-manager 的客户端证书、私钥和启动参数 $ openssl genrsa -out cs_client.key 2048 $ openssl reg -new -key cs_client .key -subj&quot;/CN=k8s-node-1&quot; -out cs_client.csr $ openssl x509 -reg -in cs_client.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out cs_client.crt -days 5000 其中，在生成 cs_client.crt 时，-CA 参数和-CAkey 参数使用的是 apiserver 的ca.crt 和 ca.key 文件。然后将这些文件复制到一个目录中（例如/vat/run/kubernetes/）。</p>
<p>接下来创建/etc/kubernetes/kubeconfig 文件（kube-controller-manager 与kube-scheduler 共用）， 配置客户端证书等相关参数，内容如下：</p>
<p>apiVersion: v1</p>
<p>kind: Contig</p>
<p>userS：</p>
<p>-name: controllermanager user：</p>
<p>Client-certificate: /var/run/kubernetes/cs_client.crt client-key:/var/run/kubernetes/cs_client.key certificate-authority: /var/run/kubernetes/ca.crt contexts ：</p>
<p>user: controllermanager name: my-context</p>
<p>current-context : my-context 然后，设置 kube-controller-manager 服务的启动参数，注意，--master 的地址为 HTTPS 安全 服务地址，不使用非安全地址 http://192.168.18.3:8080。</p>
<p>•53•</p>
<h2>第 67 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） --master=https://192.168.18.3:443 --service_account_private_key_file=/var/run/kubernetes/server.key --root-ca-file=/var/run/kubernetes/ca.crt --kubeconfig=/etc/kubernetes/kubeconfig 重启 kube-controller-manager 服务。</p>
<p>3）设置 kube-scheduler 启动参数 kube-scheduler 复用上一步 kube-controller-manager 创建的客户端证书，配置启动参数：</p>
<p>--master=https://192.168.18.3:443 --kubeconfig=/etc/kubernetes/kubeconfig 重启 kube-scheduler 服务。</p>
<p>4）设置每台 Node 上kubelet 的客户端证书、私钥和启动参数 首先复制 kube-apiserver 的ca.crt 和 ca.key 文件到Node上，在生成 kubelet_client.crt 时-CA 参数和-CAkey 参数使用的是 apiserver 的ca.crt 和 ca.key 文件。在生成 kubelet_client.csr 时-subj 参数中的“/CN” 设置为本Node 的IP地址。</p>
<p>$ openssl，</p>
<p>genrsa -out kubelet_client.key 2048 s openssl reg -new -key kubelet_Client.key -subj&quot;/CN=192.168.18.4&quot;-out kubelet_client.csr § openssl x509 -req -in kubelet_client.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out kubelet_client.crt -days 5000 将这些文件复制到一个目录中（例如/var/run/kubernetes/）。</p>
<p>接下来创建/etc/kubernetes/kubeconfig 文件（kubelet 和 kube-proxy 进程共用），配置客户端 证书等相关参数，内容如下：</p>
<p>apiVersion: v1</p>
<p>kind: Config</p>
<p>users：</p>
<p>- name: kubelet</p>
<p>uSer：</p>
<p>client-certificate: /etc/kubeznetes/ss1_keys/kubelet_client.crt client-key:/etc/kubeznetes/ss1_keys/kubelet_client.key clusters：</p>
<p>- name：</p>
<p>local</p>
<p>cluster：</p>
<p>certificate-authority:/etc/kubernetes/ss1_keys/ca.czt contexts：</p>
<p>- context：</p>
<p>cluster: 1ocal</p>
<p>user: kubelet</p>
<p>name:my-context</p>
<p>current-context : my-context • 54•</p>
<h2>第 68 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>然后，设置 kubelet 服务的启动参数：</p>
<p>--api_servers=https://192.168.18.3:443 --kubeconfig=/etc/kubelet/kubeconfig 最后重启 kubelet 服务。</p>
<p>5）设置 kube-proxy 的启动参数 kube-proxy 复用上一步kubelet 创建的客户端证书，配置启动参数：</p>
<p>--master=https://192.168.18.3:443 --kubeconfig=/etc/kubernetes/kubeconfig 重启 kube-proxy 服务。</p>
<p>至此，一个基于CA 的双向数字证书认证的 Kubernetes 集群环境就搭建完成了。</p>
<p>6） 设置 kubectl 客户端使用安全方式访问 apiserver 在使用 kubectl 对 Kubernetes 集群进行操作时，默认使用非安全端口 8080 对 apiserver 进行 访问，也可以设置为安全访问 apiserver 的模式，需要设置 3 个证书相关的参数“—certificate -authority” “--client-certificate”和“--client-key”，分别表示用于 CA 授权的证书、客户端证书 和客户端密钥。</p>
<p>--certificate-authority：使用为 kube-apiserver 生成的ca.crt 文件。</p>
<p>--client-certificate：使用为 kube-controller-manager 生成的cs_client.crt 文件。</p>
<p>--client-key：使用为 kube-controller-manager 生成的cs_client.key 文件。</p>
<p>同时，指定 apiserver 的 URL 地址为 HTTPS 安全地址（例如 https://k8s-master:443），最后 输入需要执行的子命令，即可对 apiserver 进行安全访问了：</p>
<p># kubectl --server=https://k8s-master: 443 --certificate-authority=/etc/kubernetes/ss1_keys/ca.crt --client-certificate=/etc/kubernetes/ss1_keys/cs_client.crt --client-key=/etc/kubernetes/ssl _keys/cs_client.key get nodes NAME</p>
<p>STATUS</p>
<p>AGE</p>
<p>k8s-node-1</p>
<p>Ready</p>
<p>1h</p>
<p>2. 基于 HTTP BASE 或TOKEN 的简单认证方式 除了基于CA的双向数字证书认证方式，Kubernetes 也提供了基于 HTTP BASE 或TOKEN 的简单认证方式。各组件与 apiserver 之间的通信方式仍然采用 HTTPS，但不使用CA 数字证书。</p>
<p>采用基于 HTTP BASE 或TOKEN 的简单认证方式时，API Server 对外暴露HTTPS 端口， 客户端提供用户名、密码或 Token 来完成认证过程。需要说明的是，kubectl 命令行工具比较特 ，它同时支持CA双向认证与简单认证两种模式与 apiscrver 通信，其他客户端组件只能配置 • 55</p>
<h2>第 69 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 为双向安全认证或非安全模式与 apiserver 通信。</p>
<p>基于 HTTP BASE 认证的配置过程如下。</p>
<p>（1）创建包括用户名、密码和 UID 的文件 basic_auth_file，放置在合适的目录中，例如 /etc/kuberntes 目录。需要注意的是，这是一个纯文本文件，用户名、密码都是明文。</p>
<p>#vi /etc/kubernetes/basic_auth_file admin,admin, 1</p>
<p>system,system,2</p>
<p>（2）设置 kube-apiserver 的启动参数“--basic_auth_file”，使用上述文件提供安全认证：</p>
<p>--secure-port=443</p>
<p>--basic_auth_file=/etc/kubernetes/basic_auth_file 然后，重启 API Server 服务。</p>
<p>（3）使用kubectl 通过指定的用户名和密码来访问 API Server：</p>
<p># kubect1--server=https://192.168.18.3:443 --username=admin --password=admin --insecure-skip-tls-verify=true get nodes 基于 TOKEN 认证的配置过程如下。</p>
<p>（1）创建包括用户名、密码和 UID 的文件 token_auth file，放置在合适的目录中，例如 /etc/kuberntes目录。需要注意的是，这是一个纯文本文件，用户名、密码都是明文。</p>
<p>s cat /etc/kubernetes/token_auth_file admin,admin, 1</p>
<p>system,system,2</p>
<p>（2）设置 kube-apiserver 的启动参数“-token_auth file”，使用上述文件提供安全认证：</p>
<p>--secure-port=443</p>
<p>--token_auth.</p>
<p>Eile=/etc/kubeznetes/token_auth_file 然后，重启 API Server 服务。</p>
<p>（3）用curl 验证和访问 API Server：</p>
<p>$ curl -k--header &quot;Authorization: Bearer admin&quot; https: //192.168.18.3:443/version &quot;major&quot;： &quot;1&quot;，</p>
<p>&quot;minor&quot;： &quot;3&quot;</p>
<p>&quot;gitVersion&quot;：</p>
<p>&quot;v1.3.3&quot;，</p>
<p>&quot;gitCommit&quot;： &quot;c6411395e09da356c608896d3d9725acab821418&quot;， &quot;qitTreeState&quot;： &quot;clean&quot;， &quot;buildDate&quot;： &quot;2016-07-22T20:22:252&quot;， &quot;goversion&quot;： &quot;go1.6.2&quot;， &quot;compiler&quot; ： &quot;gc&quot;， &quot;&#x27;platform&quot;：</p>
<p>&quot;linux/amd64&quot;</p>
<p>｝</p>
<p>• 56</p>
<h2>第 70 页</h2>
<h3>第2章</h3>
<p>Kubernetes 买践指南</p>
<h3>2.1.4 Kubernetes 的版本升级</h3>
<p>Kubernetes 的版本升级需要考虑到当前集群中正在运行的容器不受影响。应对集群中的各 Node 逐个进行隔离，然后等待在其上运行的容器全部执行完成，再更新该 Node 上的 kubelet 和 kube-proxy 服务，将全部 Node 都更新完成后，最后更新 Master 的服务。</p>
<p>通过官网获取最新版本的二进制包 kubernetes.tar.gz，解压缩后提取服务二进制文件。</p>
<p>逐个隔离 Node，等待在其上运行的全部容器工作完成，更新 kubelet 和 kube-proxy 服 务文件，然后重启这两个服务。</p>
<p>更新 Master 的 kube-apiserver、kube-controller-manager、kube-scheduler 服务文件并重启。</p>
<p>2.1.5</p>
<p>内网中的 Kubernetes 相关配置 Kubernetes 在能够访问 Interet 网络的环境中使用起来非常方便，一方面在 docker.io 和gcr.io 网站中已经存在了大量官方制作的 Docker 镜像，另一方面GCE、AWS 提供的云平台已经很成 熟了，用户通过租用一定的空间来部署 Kubernetes 集群也很简便。</p>
<p>但是，许多企业内部由于安全性的原因无法访问 Internet。对于这些企业就需要通过创建一个 内部的私有 Docker Registry，并修改一些 Kubernetes 的配置，来启动内网中的 Kubernetes 集群。</p>
<p>1. Docker Private Registry（私有 Docker 镜像库） 使用 Docker 提供的 Registry 镜像创建一个私有镜像仓库。</p>
<p>详细的安装步骤请参考 Docker 的官方文档 https://docs.docker.com/registry/deploying/。</p>
<p>2. kubelet 配置</p>
<p>由于在 Kubernetes 中是以 Pod而不是 Docker 容器为管理单元的，在 kubelet 创建 Pod 时， 还通过启动一个名为 google_containers/pause 的镜像来实现 Pod 的概念。</p>
<p>该镜像存在于谷歌镜像库 http://gcr.io 中，需要通过一台能够连上Internet 的服务器将其下 载，导出文件，再 push 到私有 Docker Registry 中去。</p>
<p>之后，可以给每台 Node 的kubelet 服务的启动参数加上--pod_infra_container_image 参数， 指定为私有 Docker Registry 中 pause 镜像的地址。例如：</p>
<p># cat /etc/kubernetes/kubelet KUBELET_ARGS=&quot;--api-servers=http://192.168.18.3:8080 --hostname-override=192.168.18.3 --1og-dir=/var/1og/kubernetes --v=2 • 57•</p>
<h2>第 71 页</h2>
<p>Kubernetes 权威指南</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） --Pod_infra_container_image=gcr.io/google_containers/pause-and64:3.0&quot; 如果该镜像无法下载，则也可以从 Docker Hub 上进行下载：</p>
<p># docker Pull kubeguide/google_containers/pause-amd64:3.0 修改 kubelet 配置文件中的 —pod_infra_container_image 参数如下：</p>
<p>--Pod</p>
<p>Linfra_container_image=kubeguide/google_containers/pause-amd64:3.0 然后重启 kubelet 服务：</p>
<p># systemctl restart kubelet 通过以上设置就在内网环境中搭建了一个企业内部的私有容器云平台。</p>
<h3>2.1.6 Kubernetes 核心服务配置详解</h3>
<p>我们在 2.1.2 节对 Kubernetes 各服务启动进程的关键配置参数进行了简要说明，实际上 Kubernetes 的每个服务都提供了许多可配置的参数。这些参数涉及安全性、性能优化及功能扩 展（Plugin）等方方面面。全面理解和掌握这些参数的含义和配置，无论对于 Kubernetes 的生 产部署还是日常运维都有很好的帮助。</p>
<p>每个服务的可用参数都可以通过运行“cmd--help” 命令进行查看，其中cmd 为具体的服务 启动命令，例如 kube-apiserver、kube-controller-manager、kube-scheduler、kubelet、kube-proxy 等。另外，也可以通过在命令的配置文件（例如/etc/kubernetes/kubelet 等）中添加 “—-参数名= 参数取值”的语句来完成对某个参数的配置。</p>
<p>本节将对 Kubernetes 所有服务的参数进行全面介绍，为了方便学习和查阅，对每个服务的 参数用一个小节进行详细说明。</p>
<p>1. 公共配置参数</p>
<p>公共配置参数适用于所有服务，如表2.3所示的参数可用于 kube-apiserver、kube-controller- manager、kube-scheduler、kubelet、kube-proxy。本节对这些参数进行统一说明，不再在每个服 务的参数列表中列出。</p>
<p>表2.3 公共配置参数表</p>
<p>参数名和取值示例</p>
<p>--log-backtrace-at=：0 -log-dir</p>
<p>--log-fush-frequency=5s -logtostderr-tnue</p>
<p>说明</p>
<p>记录日志每到“file：行号”时打印一次stack trace 日志文件路径</p>
<p>设置 flush 日志文件的时间间隔 设置为 true 则表示将日志输出到 stderr，不输出到日志文件 • 58•</p>
<h2>第 72 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>续表</p>
<p>参数名和取值示例</p>
<p>--alsologtostderr-false --stderrthreshold=2 --V=0</p>
<p>--vmodule=</p>
<p>--version=［false］</p>
<p>说明</p>
<p>设置为 true 则表示将日志输出到文件的同时输出到 stderr 将该 threshold 级别之上的日志输出到 stderr 8log日志级别</p>
<p>glog 基于模块的详细日志级别</p>
<p>设置为 true 则将打印版本信息然后退出 2. kube-apiserver 启动参数 对kube-apiserver 启动参数的详细说明如表2.4所示。</p>
<p>表2.4 对kube-apiserver 启动参数的详细说明 参数名和取值示例</p>
<p>--admission-control=&quot;AlwaysAdmit&quot; 说明</p>
<p>对发送给 API Server 的任何请求进行准入控制，配置为一个“准入控制器”的列 表，多个准入控制器时以逗号分隔。多个准入控制器将按顺序对发送给 API Server 的请求进行拦截和过滤，若某个准入控制器不允许该请求通过，则 API Server 拒 绝此调用请求。可配置的准入控制器如下。</p>
<p>t3 AlwaysAdmit：允许所有请求。</p>
<p>© AlwaysPullmages：在启动容器之前总是去下载镜像，相当于在每个容器的配 置项 imagePullPolicy=Always。</p>
<p>C AlwaysDeny：禁止所有请求，一般用于测试。</p>
<p>• DenyExecOnPrivileged：它会拦截所有想在 privileged container 上执行命令的 请求。如果你的集群支持 privileged container，你又希望限制用户在这些 privileged container 上执行命令，那么强烈推荐你使用它。</p>
<p>ServiceAccount：这个 plug-in 将 serviceAccounts 实现了自动化，如果你想要 使用 ServiceAccount 对象，那么强烈推荐你使用它。</p>
<p>SecurityContextDeny：这个插件将使用了 SecurityContext 的Pod 中定义的选 项全部失效。SecurityContext 在 container 中定义了操作系统级别的安全设定 （uid、gid、capabilities、SELinux 等）。</p>
<p>ResourceQuota：用于配额管理目的，作用于 Namespace 上，它会观察所有的 请求，确保在 namespace 上的配额不会超标。推荐在 admission control 参数列 表中这个插件排最后一个。</p>
<p>LimitRanger：用于配额管理，作用于 Pod 与 Container 上，确保 Pod 与 Container 上的配额不会超标。</p>
<p>NamespaceExists （已过时）：对所有请求校验 namespace 是否己存在，如果不 存在则拒绝请求。已合并至 NamespaceLifecycle。</p>
<p>NamespaceAutoProvision（已过时）：对所有请求校验 namespace，如果不存 在则自动创建该 namespace，推荐使用 NamespaceLifecycle。</p>
<p>• 59•</p>
<h2>第 73 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 参数名和取值示例</p>
<p>--admission-control=&quot;AlwaysAdmit&quot; --admission-control-config-file-™ --advertise-address=&lt;nil&gt; -allow-privileged=false -apiserver-count=1 --authentication-token-webhook-cache- ttl=2m0s</p>
<p>--authentication-token-webhook-config- file=&quot;&quot;</p>
<p>--authorization-mode=&quot;AlwaysAllow&quot; --authorization-policy-file=&quot;&quot; --authorization-rbac-super-user=&quot;&quot; -authorization-webhook-cache-authorized -ttl=5mOs</p>
<p>--authorization-webhook-cache-unauthor ized-tl=30s</p>
<p>--authorization-webhook-config-file=&quot;&quot; --basic-auth-file=&quot;&quot; --bind-address=0.0.0.0 --cert-dir=&quot;/var/run/kubernetes&quot; --client-ca-file=&quot;&quot; --cloud-config=&quot;&quot;</p>
<p>-cloud-provider=&quot;</p>
<p>--cors-allowed-origins=0］ --delete-collection-workers=1 --deserialization-cache-size=50000 续表</p>
<p>说</p>
<p>明</p>
<p>NamespaceLifecycle：如果尝试在一个不存在的 namespace 中创建资源对象， 则该创建请求将被拒绝。当删除一个 namespace 时，系统将会删除该 namespace 中的所有对象，包括 Pod、Service 等。</p>
<p>如果启用多种准入选项，则建议加载的顺序是：</p>
<p>--admission-control=NamespaceLifecycle, LimitRanger,SecurityContextDeny,ServiceA ccount,ResourceQuota 与准入控制规则相关的配置文件</p>
<p>用于广播给集群的所有成员自己的IP地址，不指定该地址将使用“—bind-address” 定义的IP地址</p>
<p>如果设置为 true，则 Kuberetes 将允许在 Pod 中运行拥有系统特权的容器应用， 与 docker run --privileged 的功效相同 集群中运行的 API Server 数量 将 webhook token authenticator 返回的响应保存在缓存内的时间，默认为两分钟 Webhook 相关的配置文件，将用于 token authentication 到API Server 的安全访问的认证模式列表，以逗号分隔，可选值包括：</p>
<p>AlwaysAllow、AlwaysDeny、ABAC、Webhook、 RBAC 当-authorization-mode 设置为 ABAC时使用的csv 格式的授权配置文件 当--authorization-mode 设置为RBAC 时使用的超级用户名，使用该用户名可以不 进行 RBAC 认证</p>
<p>将 webhook authorizer 返回的“已授权”响应保存在缓存内的时间，默认为5分钟。</p>
<p>将 webhook authorizer 返回的“未授权”响应保存在缓存内的时间，默认为30秒 当-authorization-mode 设置为webhook 时使用的授权配置文件 设置该文件用于通过 HTTP 基本认证的方式访问 API Server 的安全端口 Kubemetes API Server 在本地址的6443端口开启安全的 HTIPS服务，默认为 0.0.0.0 TLS 证书所在的目录，默认为/var/run/kubernetes。如果设置了--tls-cert-file 和 --tls-private-key-file，则该设置将被忽略 如果指定，则该客户端证书将被用于认证过程 云服务商的配置文件路径，不配置则表示不使用云服务商的配置文件 云服务商的名称，不配置则表示不使用云服务商 CORS（跨域资源共享）设置允许访问的源域列表，用逗号分隔，并可使用正则 表达式匹配子网。如果不指定，则表示不启用CORS 启动 DeleteCollection 的工作线程数，用于提高清理 namespace 的效率 设置内存中缓存的 JSON 对象的个数 • 60•</p>
<h2>第 74 页</h2>
<p>参数名和取值示例</p>
<p>--enable-garbage-collector｛=false］ -enable-swagger-uil=false］ --etcd-cafile=&quot;</p>
<p>--etcd-certfile=&quot;</p>
<p>-etcd-keyfile-&quot;&quot;</p>
<p>-etcd-prefix=&quot;/registry”&quot; --etcd-quorum-read［=false］ --etcd-servers=［］</p>
<p>--etcd-servers-overrides=0］ --event-ttl=1h0mOs --experimental-keystone-url=&quot;&quot; --external-hostname=&quot;&quot; --insecure-bind-address=127.0.0.1 -insecure-port=8080 -ir-data-source=&quot;influxdb&quot; -ir-dbname=&quot;k8s&quot;</p>
<p>--ir-hawkular=&quot;&quot;</p>
<p>-ir-influxdb-host=&quot;localhost:8080/api/v 1/proxy/namespaces/kube-system/servic es/monitoring-influxdb:api&quot; --ir-namespace-only［=false］ --ir-password=&quot;root&quot; -ir-percentile=90</p>
<p>--ir-user=&quot;root&quot;</p>
<p>--kubelet-certificate-authority=&quot;&quot; --kubelet-client-certificate=&quot;&quot; --kubelet-client-key=&quot;&quot; --kubelet-https［=true］ --kubelet-timeout=5s --kubernetes-service-node-port=0</p>
<h3>第2章</h3>
<p>：Kubernetes 实践指南</p>
<p>续表</p>
<p>说明</p>
<p>设置为 true 表示启用垃圾回收器。必须与 kube-controller-manager 的该参数设置为 相同的值</p>
<p>设置为 true 表示启用swagger ui 网页，可通过 API Server 的 URL/swagger-ui 访问 到etcd安全连接使用的SSL CA 文件 到etcd 安全连接使用的SSL 证书文件 到 etcd 安全连接使用的SSL key 文件 在 etcd 中保存 Kubemetes 集群数据的根目录名，默认为/registry 设置为 true 表示启用 quorum read 机制 以逗号分隔的 etcd 服务 URL 列表，etcd 服务以 http:/ip:port 格式表示 按资源覆盖 etcd 服务的设置，以逗号分隔。单个覆盖格式为：group/resource #servers，其中 servers格式为 http://ip:port，以分号分隔 Kubernetes API Server 中各种事件（通常用于审计和追踪）在系统中保存的时间， 默认为1小时</p>
<p>设置 keystone 鉴权插件地址，实验用 用于生成该 Master 的对外 URL 地址，例如用于 swagger api 文档中的URL 地址。</p>
<p>绑定的不安全IP 地址，与--insecure-port 共同使用，默认为localhost。设置力 0.0.0.0 表示使用全部网络接口</p>
<p>提供非安全认证访问的监听端口，默认为8080。应在防火墙中进行配置，以使得 外部客户端不可以通过非安全端口访问 API Server 设置 InitialResources 使用的数据源，可配置项包括 influxdb、gcm InitialResources 所需指标保存在 influxdb 中的数据库名称，默认为k8s 设置 Hawkular 的 URL 地址 InitialResources 所需指标所在 infuxdb 的 URL 地址，默认为 localhost:8080/ apiv1/proxy/namespaces/kube-system/services/monitoring-influxdb:api 设置为 true 表示从相同的 namespace 内的数据进行估算 连接 influxdb 数据库的密码 InitialResources 进行资源估算时的采样百分比，实验用 连接 influxdb 数据库的用户名 用于 CA授权的 cert 文件路径 用于 TLS 的客户端证书文件路径</p>
<p>用于 TLS 的客户端key 文件路径 指定 kubelet 是否使用 HTTPS连接 kubelet 执行操作的超时时间</p>
<p>设置 Master 服务是否使用 NodePort 模式，如果设置，则 Master 服务将映射到物 理机的端口号；设置为0表示以 ClusterIP 的形式启动 Master 服务 • 61•</p>
<h2>第 75 页</h2>
<p>Kubernetes 权威指南：从 Docker到 Kubernetes 实践全接触（第2版） 续表</p>
<p>参数名和取值示例</p>
<p>--long-running-request-regexp=&quot;（）（（w atchiproxy）（I$）（（logs?portforvardlexeca ttach）/？$）&quot;</p>
<p>--master-service-namespace=&quot;default&quot; -max-connection-bytes-per-sec=0 --max-requests-inflight-400 --min-request-timeout=1800 -oidc-ca-file=&quot;&quot;</p>
<p>--oidc-client-id=&quot;&quot; --oidc-groups-claim=&quot;&quot;&quot; --oidc-issuer-url=&quot;&quot; --oidc-username-claim=&quot;sub&quot; --profiling=true</p>
<p>-repair-malformed-updates［=tnue］ -runtime-config=</p>
<p>说明</p>
<p>以正则表达式配置哪些需要长时间执行的请求不会被系统进行超时处理 --secure-port=6443 --service-account-key-file=&quot; --service-account-lookup［=false］ --service-cluster-ip-range=&lt;nil&gt; --service-node-port-range= --ssh-keyfile=™</p>
<p>--ssh-user=””</p>
<p>--storage-backend=” --storage-media-type=&quot;application/json&quot; 设置 Master 服务所在的 namespace，默认为 default 设置为非0的值表示限制每个客户端连接的带宽为xx字节/秒，目前仅用于需要 长时间执行的请求</p>
<p>同时处理的最大请求数量，默认为400，超过该数量的请求将被拒绝。设置为0 表示无限制</p>
<p>最小请求处理超时时间，单位为秒，默认为 1800 秒，目前仅用于 watch request handler，其将会在该时间值上加一个随机时间作为请求的超时时间 该文件内设置鉴权机构，OpenID Server 的证书将被其中一个机构进行验证。如果 不设置，则将使用主机的 root CA 证书 OpenID Connect 的客户端 ID，在 oidc-issuer-url 设置时必须设置 定制的 OpenlD Connect 用户组声明的设置，以字符串数组的形式表示，实验用 OpenlD 发行者的URL 地址，仅支持 HTTPS scheme，用于验证 OIDC JSON Web Token （JWT）</p>
<p>OpenID claim 的用户名，默认为“sub”，实验用 打开性能分析，可以通过＜host&gt;：&lt;port/debug/ pprof/地址查看程序栈、线程等系 统信息</p>
<p>设置为 true 表示服务器将尽可能修复无效或格式错误的 update request，以通过正 确性校验，例如在一个 update request 中将一个已存在的UID 值设置为空 一组 key=value 用于运行时的配置信息。apis/&lt;group Version&gt;/&lt;resource&gt; 可用于打 开或关闭对某个 API 版本的支持。api/all 和 api/legacy 特别用于支持所有版本的 API 或支持旧版本的 API</p>
<p>设置 API Server 使用的HTTPS 安全模式端口号，设置为0表示不启用 HTTPS 包含 PEM-encoded x509 RSA 公钥和私钥的文件路径，用于验证 Service Account 的token。不指定则使用-tls-private-key-fle 指定的文件 设置为 true 时，系统会到 etcd 验证 ServiceAccount token 是否存在 Service 的 Cluster IP（虚拟 IP）池，例如 169.169.0.0/16，这个 IP 地址池不能与物 理机所在的网络重合</p>
<p>Service 的 NodePort 能使用的主机端口号范围，默认为 30000～32767，包括30000 和 32767</p>
<p>如果指定，则通过 SSH 使用指定的秘钥文件对 Node进行访问 如果指定，则通过SSH 使用指定的用户名对 Node进行访问 设置持久化存储类型，可选项为 etcd2（默认）、etcd3 持久化存储中的保存格式，默认为 applicationjson。某些资源类型只能使用 applicationjson 格式进行保存，将忽略这个参数的设置 • 62•</p>
<h2>第 76 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>续表</p>
<p>参数名和取值示例</p>
<p>--storage-versions=&quot;apps/vlalphal,authe ntication.k8s.io/vlbetal,authorization.k8 s.io/vlbetal,autoscaling/vl,batch/vl.，co mponentconfig/vlalphal,extensions/vlb etal,policy/vlalphal,rbac.authorization.</p>
<p>k8s.io/vlalphal,vI” --tls-cert-file=&quot;</p>
<p>--tls-private-key-file=™ --token-auth-file=&quot; --watch-cache［=true］ --watch-cache-sizes=［］ 持久化存储的资源版本号，以分组形式标记，例 如&quot;groupl/versionl,group2/version2，.” 包含x509证书的文件路径，用于 HTTPS 认证 包含x509与tls-cert-file 对应的私钥文件路径 用于访问 API Server 安全端口的 token 认证文件路径 设置为 true 表示将 watch 进行缓存 设置各资源对象 watch 缓存大小的列表，以逗号分隔，每个资源对象的设置格式 为 resource#size，当 watch-cache 设置力 true 时生效 3. kube-controller-manager 启动参数 对 kube-controller-manager 启动参数的详细说明如表2.5所示。</p>
<p>表2.5 对kube-controller-manager 启动参数的详细说明 参数名和取值示例</p>
<p>--address=0.0.0.0</p>
<p>--allocate-node-cidrs=false -cloud-config-™</p>
<p>-cloud-provider=”” --cluster-cidr=&lt;nil&gt; --cluster-name=&quot;kubernetes” --concurrent-deployment-syncs=5 说明</p>
<p>监听的主机IP地址，默认为 0.0.0.0表示使用全部网络接口 设置为 true 表示使用云服务商为Pod分配的CIDRs，仅用于公有云 云服务商的配置文件路径，仅用于公有云 云服务商的名称，仅用于公有云</p>
<p>集群中 Pod 的可用CIDR 范围 集群的名称，默认为kubemetes 设置允许的并发同步 deployment 对象的数量，值越大表示同步操作越快，但将会 消耗更多的CPU 和网络资源</p>
<p>--concurrent-endpoint-syncs=5 设置并发执行 Endpoint 同步操作的数量，值越大表示同步操作越快，但将会消耗 更多的CPU 和网络资源</p>
<p>--concurrent-rc-syncs=5 并发执行 RC同步操作的协程数，值越大表示同步操作越快，但将会消耗更多的 CPU 和网络资源</p>
<p>--concurrent-namespace-syncs=2 设置允许的并发同步 namespace 对象的数量，值越大表示同步操作越快，但将会 消耗更多的CPU 和网络资源</p>
<p>--concurrent-rc-syncs=5 设置允许的并发同步 replication controller 对象的数量，值越大表示同步操作越快， 但将会消耗更多的 CPU 和网络资源 --concurrent-replicaset-syncs=5 设置允许的并发同步 replica set 对象的数量，值越大表示同步操作越快，但将会消 耗更多的 CPU 和网络资源</p>
<p>• 63•</p>
<h2>第 77 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 参数名和取值示例</p>
<p>--concurrent-resource-quota-syncs=5 --configure-cloud-routes［-true］ --controller-start-interval=0 --daemonset-lookup-cache-size=1024 -deleting-pods-burst=10 --deleting-pods-qps=0.1 --deployment-controller-sync-period=30s -enable-dynamic-provisioning［=true］ -enable-garbage-collector［=false］ --enable-hostpath-provisioner［=false］ -flex-volume-plugin-dir-&quot;/ust/ibexec/ku bernetes/kubelet-plugins/volume/exec/” --horizontal-pod-autoscaler-sync-period =30s</p>
<p>--kube-api-burst=30 --kube-api-content-type=&quot;application/wn d.kubemnetes.protobuf” --kube-api-gps=20</p>
<p>-kubeconfig-&quot;</p>
<p>--leader-clect［=false］ --leader-elect-lease-duration=15s --leader-elect-renew-deadline=10s --leader-elect-retry-period=2s --master=”</p>
<p>--min-resync-period=12h0mOs --namespace-sync-period=5mOs --node-cidr-mask-size=24 续表</p>
<p>说明</p>
<p>设置允许的并发同步 resource quota 对象的数量，值越大表示更快地进行同步操作， 但将会消耗更多的CPU 和网络资源</p>
<p>设置为 true 表示使用 allocate-node-cidrs 进行CIDRs 的分配，仅用于公有云 启动各个 controller manager 的时间间隔，默认为0秒 DaemonSet 的查询缓存大小，默认为 1024。值越大表示 DaemonSet 响应越快，内 存消耗也越大</p>
<p>如果一个 Node 节点失败，则会批量删除在上面运行的 Pod 实例的信息，此值定义 了突发最大刪除的 Pod 的数量，与deleting pods-aps一起作为调度中的限流因子 当 Node 失效时，每秒删除其上的多少个 Pod 实例 同步 deployments 的时间间隔，默认为30秒 设置 true 表示启用动态 provisioning（需环境支持） 设置为 true 表示启用垃圾回收机制，必须与 kube-apiserver 的该参数设置为相同的值 设置为 true 表示启用 hostPath PV provisioning 机制，仅用于测试，不可用于多 Node 的集群环境</p>
<p>设置 flex volume 插件应搜索其他第三方 volume 插件的全路径 Pod 自动扩容器的Pod 数量的同步时间间隔，默认为30秒 发送到 API Server 的每秒的请求数量，默认为30 发送到 API Server 的请求内容类型 与 API Server 通信的QPS 值，默认为20 kubeconfig 配置文件路径，在配置文件中包括 Master 地址信息及必要的认证信息 设置为 true 表示进行leader 选举，用于多个 Master 组件的高可用部署 leader 选举过程中非leader 等待选举的时间间隔，默认为15秒，当leader-elect-true 时生效</p>
<p>leader 选举过程中在停止leading角色之前再次 renew 的时间间隔，应小于或等于 leader-elect-lease-duration，默认为10秒，当leader-elect-true 时生效 leader 选举过程中在获取 leader 角色和 renew 之间的等待时间，默认为两秒，当 leader-elect=true 时生效 API Server 的URL 地址，设置后不再使用 kubeconfig 中设置的值 最小重新同步的时间间隔，实际重新同步的时间为 MinResyncPeriod（默认为12 小时）到2×MinResyncPeriod（默认24小时）之间的一个随机数 namespace 生命周期更新的同步时间间隔，默认为5分钟 Node CIDR 的子网掩码设置，默认为24 • 64•</p>
<h2>第 78 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>参数名和取值示例</p>
<p>--node-monitor-grace-period=40s -node-monitor-period=5s --node-startup-grace-period=Imos --node-sync-period=10s -pod-eviction-timeout=5mOs --port-10252</p>
<p>--profiling=true</p>
<p>--pv-recycler-increment-timcout-nfs=30 --pv-recycler-minimum-timcout-hostpath =60</p>
<p>--pv-recycler-minimum-timeout-nfs=300 --pv-recycler-pod-template-filepath-host path-&quot;</p>
<p>--pv-recycler-pod-template-filepath-nfs-&quot;&quot; --pv-recycler-timeout-increment-hostpath =30</p>
<p>--pvclaimbinder-sync-period=15s --replicaset-lookup-cache-size=4096 --replication-controller-lookup-cache-siz e=4096</p>
<p>--resource-quota-sync-period=5m0s --root-ca-file=&quot;&quot;</p>
<p>--service-account-private-key-file=&quot;&quot; --service-cluster-ip-range=&quot;&quot;！</p>
<p>--service-sync-period=5mOs --terminated-pod-gc-threshold=12500 续表</p>
<p>说明</p>
<p>监控 Node 状态的时间间隔，默认为40秒，超过该设置时间后，controller-manager 会把Node标记为不可用状态。此值的设置有如下要求：</p>
<p>它应该被设置为 kubelet 汇报的 Node 状态时间间隔（参数—node-status-update- frequency=10s）的N倍，N为kubelet 状态汇报的重试次数 同步 NodeStatus 的时间间隔，默认为5秒 Node 启动的最大允许时间，超过此时间无响应则会标记 Node 为不可用状态（启 动失败），默认为1分钟</p>
<p>Node 信息发生变化时（例如新 Node 加入集群）controller-manager 同步各 Node 信息的时间间隔，默认为10秒</p>
<p>在发现一个 Node 失效以后，延迟一段时间，在超过这个参数指定的时间后，删除 此Node 上的Pod，默认为5分钟 controller-manager 监听的主机端口号，默认为10252 打开性能分析，可以通过&lt;host&gt;：&lt;port&gt;/debug/pprof/地址查看程序栈、线程等系统 运行信息</p>
<p>使用 nfs scrubber 的 Pod 每增加1Gi空间在 ActiveDeadlineSeconds 上增加的时间， 默认为30秒</p>
<p>使用 hostPath recycler 的 Pod 的最小 ActiveDeadlineSeconds 秒数，默认为60秒。</p>
<p>实验用</p>
<p>使用 nfs recycler 的 Pod 的最小 ActiveDeadlineSeconds 秒数，默认为300秒 使用 hostPath recycler 的Pod 的模板文件全路径，仅用于实验 使用 nfs recycler 的Pod 的模板文件全路径 使用 hostPath scrubber 的 Pod 每增加1Gi 空间在 ActiveDeadlineSeconds 上增加的 时间，默认为30秒。实验用</p>
<p>同步PV 和 PVC（容器声明的PV）的时间间隔 设置 replica sets 查询缓存的大小，默认为4096，值越大表示查询操作越快，但将 会消耗更多的内存</p>
<p>设置 replication controller 查询缓存的大小，默认为4096，值越大表示查询操作越 快，但将会消耗更多的内存</p>
<p>resource quota 使用信息同步的时间间隔，默认为5分钟 根CA 证书文件路径，将被用于 Service Account 的 token secret 中 用于给 Service Account token 签名的 PEM-encoded RSA 私钥文件路径 Servicc的 IP 范围</p>
<p>同步 service 与外部load balancer 的时间间隔，默认为5分钟 设置可保存的终止Pod 的数量，超过该数量，垃圾回收器将开始进行删除操作。</p>
<p>设置为不大于0的值表示不启用该功能</p>
<p>• 65</p>
<h2>第 79 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 4. kube-scheduler 启动参数 对 kube-scheduler 启动参数的详细说明如表2.6所示。</p>
<p>表2.6 对kube-scheduler 启动参数的详细说明 参数名和取值示例</p>
<p>说明</p>
<p>--address=0.0.0.0</p>
<p>监听的主机 IP 地址，默认 0.0.0.0表示使用全部网络接口 --algorithm-provider-&quot;DefaultProvider&quot; 设置调度算法，默认为 DefaultProvider --failure-domains=&quot;kuberetes.io/hostnam 表示 Pod 调度时的亲和力参数。在调度 Pod 时，如果两个 Pod 有相同的亲和力参 e,failure-domain.beta.kubernetes.io/zone,f 数，那么这两个 Pod 会被调度到相同的 Node 上；如果两个 Pod 有不同的亲和力参 ailure-domain.beta.kubernetes.io/region&quot; 数，那么这两个 Pod 不会被调度到相同的 Node上 -hard-pod-affinity-symmetric-weight=1 表示Pod调度规则亲和力的权重值，取值范围为0~100。RequiredDuringScheduling 亲和性是非对称的，但对每一个 RequiredDuringScheduling 亲和性都存在一个对应的隐 式 PreferredDuringScheduling 亲和性规则。该设置表示隐式 PreferredDuringScheduling 亲和性规则的权重值，默认为1</p>
<p>-kube-api-burst=100 发送到 API Server 的每秒请求数量，默认为100 --kube-api-content-type=&quot;application/vnd.</p>
<p>发送到 API Server 的请求内容类型 kubernetes.protobuf” --kube-api-gps=50</p>
<p>--kubeconfig=”</p>
<p>-leader-elect［=false］ --leader-elect-lease-duration=15s --leader-elect-renew-deadline=10s --leader-elect-retry-period=2s --master=””</p>
<p>-policy-config-file=”” --port-=10251</p>
<p>-profiling=true</p>
<p>-scheduler-name=&quot;default-scheduler&quot; 与 API Server 通信的QPS 值，默认为50 kubeconfig 配置文件路径，在配置文件中包括 Master 的地址信息及必要的认证信息 设置为 true 表示进行leader 选举，用于多个 Master 组件的高可用部酱 leader 选举过程中非leader 等待选举的时间间隔，默认为15秒，当 leader-elect-true 时生效</p>
<p>leader 选举过程中在停止leading 角色之前再次 renew 的时间间隔，应小于或等于 leader-elect-lease-duration，默认为10秒，当 leader-elect=true 时生效 leader 选举过程中获取 leader 角色和 renew 之间的等待时间，默认为两秒，当 leader-elect=true 时生效 API Server 的URL. 地址，设置后不再使用kubeconfig 中设置的值 调度策略（scheduler policy）配置文件的路径 scheduler 监听的主机端口号，默认为10251 打开性能分析，可以通过&lt;host&gt;：&lt;port/debug/pprof/地址查看栈、线程等系统运行 信息</p>
<p>调度器名称，用于选择哪些 Pod 将被该调度器进行处理，选择的依据是 Pod 的 annotation 设置，包含 key=&#x27;scheduler.alpha. kubernetes.io/name”的 annotation 5. kubelet 启动参数</p>
<p>对kubelet 启动参数的详细说明如表2.7 所示。</p>
<p>• 66•</p>
<h2>第 80 页</h2>
<h3>第2章</h3>
<p>Kubernetes 实践指南</p>
<p>参数名和取值示例</p>
<p>--address=0.0.0.0</p>
<p>--allow-privileged［=false］ --api-servers=［］</p>
<p>--application-metrics-count-limit-100 --boot-id-file=&quot;/proc/sys/keme//random/ boot_id&quot;</p>
<p>-cadvisor-port=4194.</p>
<p>--cert-dir=&quot;/var/run/kubernetes&quot; --cgroup-root=&quot;&quot;</p>
<p>--chaos-chance=0</p>
<p>-cloud-config=&quot;&quot;|</p>
<p>--cloud-provider=&quot;auto-detect&quot; --cluster-dns=&quot;</p>
<p>--cluster-domain=&quot; --config=&quot;&quot;</p>
<p>--configure-cbrO［=false］ --container-hints=&quot;/etc/cadvisor/container hints.json&quot;</p>
<p>--container-runtime=&quot;docker&quot; --containerized［=false］ --cpu-cfs-quota［=true］ --docker-endpoint= &quot;unix:///var/run/docker.sock&quot; --docker-env-metadata-whitelist=&quot;&quot; --docker-exec-handler=&quot;native&quot; --docker-only［=false］ --docker-root=&quot;/var/lib/docker&quot; --enable-controller-attach-detach［=true］ --enable-custom-metrics［=false］ --enable-debugging-handlers=false --enable-load-reader［=false］ --enable-server［=true］ 表2.7 对kubelet 启动参数的详细说明 说明</p>
<p>绑定主机 IP 地址，默认为0.0.0.0表示使用全部网络接口 是否允许以特权模式启动容器，默认为 false API Server 地址列表，以ip:port格式表示，以逗号分隔 为每个容器保存的性能指标的最大数量，默认为100 以逗号分隔的文件列表，使用第1个存在book-id 的文件 本地 cAdvisor 监听的端口号，默认为 4194 TLS 证书所在的目录，默认为/var/run/kubernetes。如果设置了--tls-cert-file 和 --tls-private-key-file，则该设置将被忽略 为pods 设置的 root cgroup，如果不设置，则将使用容器运行时的默认设置 随机产生客户端错误的概率，仅用于测试，默认为O，即不产生 云服务商的配置文件路径</p>
<p>云服务商的名称，默认将自动检测，设置为空表示无云服务商 集群内 DNS 服务的IP地址</p>
<p>集群内 DNS 服务所用域名</p>
<p>kubelet 配置文件的路径或目录名 设置为 true 表示 kubelet 将会根据 Node.Spec.PodCIDR 的值来配置 cbrO 容器 hints 文件所在的全路径</p>
<p>容器类型，目前支持 Docker、rkt，默认为 docker 将kubelet运行在容器中，仅供测试使用，默认为 false 设置为 true 表示启用 CPU CFS quota，用于设置容器的CPU 限制 Docker 服务的 Endpoint 地址，默认为 unix://var/run/docker.sock Docker 容器需要使用的环境变量key 列表，以逗号分隔 进入Docker 容器中执行命令的方式，支持 native、nsenter，默认为 native 设置为true，表示仅报告 Docker 容器的统计信息而不再报告其他统计信息 Docker 根目录的全路径，不再使用，将通过docker info 获取该信息 设置 true 表示启用 Attach/Detach Controller 进行调度到该 Node 的 volume 的 attach 与 detach操作，同时禁用 kubelet 执行 atach、detach 的操作 设置为 true 表示启用采集自定义性能指标 设置为true 表示提供远程访问本节点容器的日志、进入容器执行命令等相关 Rest 服务</p>
<p>设置为 true 表示启用CPU 负载的 reader 启动 kubelet 上的 http rest server，此 server 提供了获取本节点上运行的Pod列表、 Pod 状态和其他管理监控相关的 Rest 接口 • 67•</p>
<h2>第 81 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 续表</p>
<p>参数名和取值示例</p>
<p>--event-burst=10</p>
<p>--event-qps=5</p>
<p>--event-storage-age-limit=&quot;default=0&quot; -event-storage-event-limit=&quot;default-0&quot; --eviction-hard=&quot;</p>
<p>--eviction-max-pod-grace-period=0 --eviction-pressure-transition-period=5mOs -eviction-soft=&quot;</p>
<p>--eviction-sofi-grace-period=&quot;&quot; -exit-on-lock-contention［=false］ --experimental-flanncl-overlay［=false］ --expcrimental-nvidia-gpus=0 -file-check-frequency=20s -global-housekeeping-interval=1m0s --google-json-key=&quot; -hairpin-mode=&quot;promiscuous-bridge&quot; --healthz-bind-address=127.0.0.1 -healthz-port=10248 --host-ipc-sources=”*” --host-network-sources=”*” --host-pid-sources=”* --hostname-override=” --housekeeping-interval=10s --http-check-frequency=20s -image-gc-high-threshold=90 -image-gc-low-threshold=80 --kube-api-burst=10 说明</p>
<p>临时允许的 Event 记录突发的最大数量，默认为10，当 event-qps&gt;0 时生效 设置大于。的值表示限制每秒能创建出的Event 数量，设置为0表示不限制 保存 Event 的最大时间。按事件类型以 key=value 的格式表示，以逗号分隔，事 件类型包括 creation、oom 等，“default”表示所有事件的类型 保存 Event 的最大数量。按事件类型以 key=value 格式表示，以逗号分隔，事件 类型包括 creation、oom 等，“default”表示所有事件的类型 触发 Pod Eviction 操作的一组硬门限设置，例如可用内存&lt;IGi 终止Pod操作给Pod 自行停止预留的时间，单位为秒。时间到达时，将触发Pod Eviction 操作。默认值为0，设置为负数表示使用Pod 中指定的值 kubelet 在触发 Pod Eviction 操作之前等待的最长时间，默认为5分钟 触发 Pod Eviction 操作的一组软门限设置，例如可用内存&lt;1.5Gi，与 grace-period 一起生效，当 Pod 的响应时间超过 grace-period 后进行触发 触发Pod Eviction 操作的一组软门限等待时间设置，例如 memory.available=1m30s 设置为 true 表示当有文件锁存在时 kubelet 也可以退出 实验性功能，用于 kubelet 启动时自动支持 flannel覆盖网络，默认值为 false 本节点上 NVIDIA GPU 的数量，目前仅支持0或1，默认为0 在 File Source 作为Pod 源的情况下，kubelet 定期重新检查文件变化的时间间隔， 文件发生变化后，kubelet 重新加载更新的文件内容 全局 housekeeping 的时间间隔，默认为1分钟 用于谷歌的云平台 Service Account 进行用于鉴权的 JSON key 设置hairpin 模式，表示kubelet设置 hairpin NAT的方式。该模式允许后端Endpoint 在访问其本身 Service 时能够再次loadbalance 回自身。可选项包括 promiscuous- bridge、hairpin-veth 和 none healthz 服务监听的IP 地址，默认为 127.0.0.1，设置为 0.0.0.0表示监听全部 IP 地址</p>
<p>本地 healthz服务监听的端口号，默认为10248 kubelet 允许Pod使用宿主机 ipc namespace 的列表，以逗号分隔，默认为“*” kubelet 允许Pod使用宿主机 network 的列表，以逗号分隔，默认为“*” kubelet 允许Pod 使用宿主机 pid namespace 的列表，以逗号分隔，默认为“*” 设置本 Node 在集群中的主机名，不设置将使用本机 hostanme 对容器做 housekeeping 操作的时间间隔，默认为10秒 HTTP URL Source 作为Pod 源的情况下，kubelet 定期检查 URL 返回的内容是否 发生变化的时间周期，作用同 file-check-frequency 参数 镜像垃圾回收上限，磁盘使用空间达到该百分比时，镜像垃圾回收将持续工作 镜像垃圾回收下限，磁盘使用空间在达到该百分比之前，镜像垃圾回收将不启用 发送到 API Server 的每秒请求数量，默认为10 • 68•</p>
<h2>第 82 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>续表</p>
<p>参数名和取值示例</p>
<p>-kube-api-content-type=&quot;application/vnd kubernetes protobuf&quot; -kube-api-gps=5</p>
<p>--kube-reserved=</p>
<p>说</p>
<p>明</p>
<p>发送到 API Server 的请求内容类型 与 API Server 通信的QPS 值，默认为5 kuberetes 系统预留的资源配置，以一组 ResourceName-ResourceQuantity 格式表 示，例如 cpu=200m,memory=150G。目前仅支持CPU 和内存的设置，详见 http:// releases.k8s:io/HEAD/docs/user-guide/compute-resources.md，默认为空 --kubeconfig=&quot;/var/lib/kubelet/kubeconfig&quot; kubeconfig 配置文件路径，在配置文件中包括 Master地址信息及必要的认证信息 --kubelet-cgroups=&quot;！</p>
<p>kubelet 运行所需的 cgroups 名称 --lock-file=&quot;&quot;</p>
<p>kubelet 使用的lock 文件，Alpha 版本 --log-cadvisor-usage［=false］ 设置次 true 表示将 cAdvisor 容器的使用情况进行日志记录 --low-diskspace-threshold-mb=256 本 Node 最低磁盘可用空间，单位 MB。当磁盘空间低于该阈值，kubelet 将拒绝 创建新的 Pod，默认值为256MB -machine-id-file=&quot;/etc/machine-id,/var/li b/dbus/machine-id&quot; -manifest-url=””</p>
<p>用于查找 machine-id 的文件列表，使用找到的第1个值，默认从/etc/machine-id， /var/lib/dbus/machine-id 文件中去查找 为HTTP URL Source 源类型时，kubelet 用来获取Pod定义的URL地址，此URL 返回一组 Pod定义</p>
<p>-manifest-url-header=””” --master-service-namespace=&quot;default” --max-open-files=1000000 --max-pods=110</p>
<p>--maximum-dead-containers=240 访问 menifest URL 地址时使用的HTTP 头信息，以key:value 格式表示 Master 服务的命名空间，默认为 default kubelet 打开的最大文件数量，默认为 1000 000 kubelet 能运行的最大Pod数量，默认为110个 Pod 在本 Node上保留的已停止容器的最大数量，由于停止的容器也会消耗磁盘空间，所 以超过该上限以后，kubelet 会自动清理已停止的容器以释放磁盘空间，默认为240 --maximum-dead-containers-per-container-2 --minimum-container-ttl-duration=1mOs 以Pod为单位可以保留的已停止的（属于同一Pod 的）容器集的最大数量 已停止的容器在被清理之前的最小存活时间，例如 300ms、10s或2h45m，超过 此存活时间的容器将被标记为可被GC清理，默认值为1分钟 --minimum-image-ttl-duration=2mOs 不再使用的镜像在被清理之前的最小存活时间，例如 300ms、10s或 2h45m，超 过此存活时间的镜像被标记为可被GC清理，默认值为两分钟 --network-plugin=&quot; 自定义的网络插件的名字，Pod的生命周期中相关的一些事件会调用此网络插件 进行处理，为 Alpha 测试版功能 扫描网络插件的目录，为 Alpha测试版功能 --network-plugin-dir-”/ust/libexec/kuber netes/kubelet-plugins/net/exec/” --node-ip=”</p>
<p>--node-labels=</p>
<p>--node-status-update-freguency=10s --non-masquerade-cid-&quot;10.0.0.0/8&quot; 设置本 Node 的IP 地址</p>
<p>kubelet 注册本 Node 时设置的 Labels，label 以 key=value 的格式表示，多个 label 以逗号分隔，为 Alpha 测试版功能 kubelet 向 Master 汇报 Node 状态的时间间隔，默认值为10秒。与 controller- manager 的—node-monitor-grace-period 参数共同起作用 kubelet 向该IP 段之外的IP 地址发送的流量将使用 IP Masquerade 技术 • 69•</p>
<h2>第 83 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 续表</p>
<p>参数名和取值示例</p>
<p>--0om-score-adj=-999 --outofdisk-transition-frequency=5m0s --pod-cidr&quot;&quot;</p>
<p>-pod-infra-container-image=&quot;gcr.io/ google_containers/pause-amd64:3.0” --pods-per-core=0</p>
<p>--port=10250</p>
<p>--read-only-port=10255 --really-crash-for-testing-false --reconcile-cidr［=true］ --register-nodef-true］ --register-schedulable［=true］ --registry-burst=10 -registry-qps=5</p>
<p>--resolv-conf-&quot;/etc/resolv.conf” --rkt-api-endpoint=&quot;localhost:1544］” -rkt-path=”</p>
<p>--root-dir=&quot;/var/lib/kubelet&quot; --runonce=false</p>
<p>-runtime-cgroups=™ --runtime-request-timeout-2m0s --seccomp-profile-root=&quot;/var/ib/kubelet/s eccomp”</p>
<p>--serialize-image-pulls｛=true］ --storage-driver-bouffer-duration-Im0s 说</p>
<p>明</p>
<p>Kubelet 进程的oom_score_adj 参数值，有效范围为（-1000,1000］ 触发磁盘空间耗尽操作之前的等待时间，默认为5分钟 用于给Pod分配IP地址的CIDR地址池，仅在单机模式中使用。在一个集群中， kubelet 会从 API Server 中荻取 CIDR设置 用于 Pod 内网络命名空间共享的基础 pause 镜像 该 kubelet 上每个 core 可运行的Pod 数量。最大值将被 max-pods 参数限制。默 认值为0表示不做限制</p>
<p>kubelet 服务监听的本机端口号，默认为 10250 kubelet 服务监听的“只读”端口号，默认为10255，设置为0表示不启用 设置 true 表示发生 panics 情况时崩溃，仅用于测试 根据 API Server 指定的 CIDR 重排 Node 的 CIDR 地址，如果 register-node 或 configure-cbrO设置为 false，则表示不启用。默认值为 true 将本 Node 注册到 API Server，默认值为 true 将本 Node 状态标记为 schedulable，设置为 false 表不通知 Master 本 Node 不可进 行调度。默认值为 true</p>
<p>最多同时拉取镜像的数量，默认值为10 在Pod 创建过程中容器的镜像可能需要从 Registry 中拉取，由于拉取镜像的过程中 会消耗大量带宽，因此可能需要限速，此参数与 registry-burst 一起用来限制每秒拉 取多少个镜像，默认不限速，如果设置为5，则表示平均每秒允许拉取5个镜像 命名服务配置文件，用于容器内应用的 DNS 解析，默认为/etc/resolv.conf rkt API 服务的 URL 地址，--container-runtime=&quot;rkt”时生效 rkt二进制文件的路径，不指定的话从环境变量$PATH 中查找，--container-runtime rkt’时生效</p>
<p>kubelet 运行根目录，将保持Pod 和volume 的相关文件，默认/var/lib/kubelet。</p>
<p>设置力 true 表示创建完 Pod 之后立即退出 kubelet 进程，与--api-servers 和 --enable-server 参数互斥 为容器 runtime设置的cgroup 除了长时间运行的 request，对其他 request 的超时时间设置，包括 pull、logs、exec、 attach 等操作。当超时时间到达时，请求会被杀掉，抛出一个错误并会重试。默 认值为两分钟</p>
<p>seccomp 配置文件目录，默认为/var/lib/kubelet/seccomp 按顺序挨个 pull镜像。建议 Docker 低于&lt;1.9版本或使用 Aufs storage backend 时 设置为 true，详见 issue #10959 将缓存数据写入后端存储的时间间隔，默认为1分钟 • 70•</p>
<h2>第 84 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>续表</p>
<p>参数名和取值示例</p>
<p>--storage-driver-db=&quot;cadvisor&quot; --storage-driver-host=&quot;localhost:8086&quot; --storage-driver-password=&quot;root&quot; --storage-driver-secure［=false］ --storage-driver-table=&quot;stats&quot; --storage-driver-user=&quot;root&quot; --streaming-connection-idle-timeout- 4h0mOs</p>
<p>-sync-frequency=Im0s --system-cgroups=&quot;&quot; --system-reserved= --tls-cert-file=&quot;&quot; --tls-private-key-file=&quot;&quot; --volume-plugin-dir-&quot;/usr/libexec/kubern etes/kubelet-.plugins/volume/exec/&quot; --volume-stats-agg-period=lm0s 说明</p>
<p>后端存储的数据库名称，默认为 cadvisor 后端存储的数据库连接URL.地址，默认为 localhost:8086 后端存储的数据库密码，默认为 root 后端存储的数据库是否用安全连接，默认为 false 后端存储的数据库表名，默认为 stats 后端存储的数据库用户名，默认为 root 在容器中执行命令或者进行端口转发的过程中会产生输入、输出流，这个参数用 来控制连接空闲超时而关闭的时间，如果设置为“Sm”，则表示连接超过5分钟 没有输入、输出的情况下就被认为是空闲的，而会被自动关闭。默认为4小时 同步运行中容器的配置的频率，默认为1分钟 kubelet 为运行非kernel 进程设置的 cgroups 名称 系统预留的资源配置，以一组 ResourceName=ResourceQuantity 格式表示，例如 cpu=200m,memory=150G。目前仅支持CPU 和内存的设置，详见 http://releases.k8s.</p>
<p>io/HEAD/docs/user-guide/compute-resources.md，默认为空 包含x509证书的文件路径，用于 HTTPS 认证 包含 x509与 tls-cert-file 对应的私钥文件路径 搜索第三方 volume 插件的目录，为Alpha 测试版功能 kubelet 计算所有 Pod 和 volume 的磁盘使用情况聚合值的时间间隔，默认为1分 钟。设置为0表示不启用该计算功能</p>
<p>6. kube-proxy 启动参数 kube-proxy 的启动参数详细说明见表2.8。</p>
<p>表2.8 kube-proxy的参数表 参数名和取值示例</p>
<p>--bind-address=0.0.0.0 --cleanup-iptables［=false］ --cluster-cidr=&quot;&quot;</p>
<p>--config-sync-period=15mOs --conntrack-max=0</p>
<p>--conntrack-max-per-core=32768 --conntrack-tcp-timeout-established=24homOs kube-proxy 绑定主机的IP地址，默认为 0.0.0.0表示绑定所有IP地址 设置为 true 表示清除 iptables 规则后退出 集群中 Pod 的CIDR地址范围，用于桥接集群外部流量到内部。用于公有云 环境</p>
<p>从 API Server 更新配置的时间间隔，默认为15分钟，必须大于0 跟踪 NAT 连接的最大数量，默认值0表示不限制 跟踪每个 CPU core 的NAT 连接的最大数量，默认值为32768，仅当 conntrack- max 设置为0时生效</p>
<p>建立 TCP 连接的超时时间，默认为24小时，设置为0表示无限制 • 71•</p>
<h2>第 85 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 续表</p>
<p>参数名和取值示例</p>
<p>-healthz-bind-address=127.0.0.1 --healthz-port-10249 -hostmame-override=&quot; -jptables-masquerade-bit=14 --jptables-sync-period=30s -kube-api-burst=10 -kube-api-content-type-&quot;application/vnd.kub ernetes.protobuf&quot;</p>
<p>-kube-api-gps=5</p>
<p>--kubeconfig=&quot;</p>
<p>--masquerade-all ［=false］ -master=&quot;</p>
<p>--0om-score-adj=-999 --proxy-mode=</p>
<p>-proxy-port-range= --udp-timeout=250ms 说明</p>
<p>healthz服务绑定主机IP 地址，默认为127.0.0.1，设置为 0.0.0.0表示使用所 有IP地址</p>
<p>healthz 服务监听的主机端口号，默认为10249 设置本Node 在集群中的主机名，不设置将使用本机 hostanme iptables masquerade 的fwmark 位设置，有效范围为［0，31］ 刷新 iptables 规则的时间间隔，例如SS、1m、2h22m，默认为30秒，必须大 于0</p>
<p>发送到 API Server 的每秒发请求数量，默认为10 发送到 API Server 的请求内容类型 与 API Server 通信的QPS值，默认为5 kubeconfig 配置文件路径，在配置文件中包括 Master 地址信息及必要的认证 信息</p>
<p>设置为 true 表示使用纯 iptables 代理，所有网络包都将做 SNAT转换 API Server 的地址</p>
<p>kube-proxy 进程的oom_score_adj参数值，有效范围为［-1000,1000］ 代理模式，可选项为 iptables 或 userspace，默认为 iptables，转发速度更快。当 操作系统kerel 版本或 iptables 版本不够新时，将自动降级为 userspace 模式 进行 Service 代理的本地端口号范围，格式为 begin-end，含两端，未指定则 采用随机选择的系统可用的端口号</p>
<p>保持空闲 UDP 连接的时间，例如 250ms、2s，默认值250ms，必须大于0， 仅当 proxy-mode=userspace 时生效</p>
<h3>2.1.7 Kubernetes 集群网络配置方案</h3>
<p>在多个 Node 组成的 Kubernetes 集群内，跨主机的容器间网络互通是 Kubernetes 集群能够 正常工作的前提条件。Kubernetes 本身并不会对跨主机容器网络进行设置，这需要额外的工具 来实现。除了谷歌公有云GCE平台提供的网络设置，一些开源的工具包括 flannel、Open VSwitch、 Weave、Calico 等都能够实现跨主机的容器间网络互通。本节将对常用的 flannel、Open vSwitch 和直接路由三种配置进行详细说明。</p>
<p>1. flannel（覆盖网络）</p>
<p>flannel 采用覆盖网络（Overlay Network）模型来完成对网络的打通，本节对 flannel 的安装 和配置进行详细说明。</p>
<p>• 72•</p>
<h2>第 86 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>1） 安装etcd</p>
<p>由于 flannel 使用etcd 作数据库，所以需要预先安装好 etcd，详见2.1.2节的说明。</p>
<p>2） 安装 flannel</p>
<p>需要在每台 Node 上都安装 flannel。flannel 软件的下载地址为 https:/github.com/coreos/ flannel/releases。将下载的压缩包 flannel-&lt;version&gt;-linux-amd64.tar.gz 解压，把二进制文件 flanneld 和 mk-docker-opts.sh 复制到/usr/bin（或其他 PATH 环境变量中的目录），即可完成对 flannel 的 安装。</p>
<p>3） 配置 flannel</p>
<p>此处以使用 systemd 系统为例对 flanneld 服务进行配置。编辑服务配置文件/usr/tib/systemd/ system/flanneld.service：</p>
<p>［Unit］</p>
<p>Description=flanneld overlay address etcd agent After=network.target Before=docker.service ［Service］</p>
<p>Type=notify</p>
<p>EnvironmentFile=/etc/sysconfig/flanneld ExecStart=/usr/bin/flanneld -etcd-endpoints=$（FLANNEL_ETCD） SFLANNEL_OPTIONS ［Instal1］</p>
<p>RequiredBy=docker.service WantedBy=multi-user.target 编辑配置文件/etc/sysconfig/flannel，设置 etcd 的 URL 地址：</p>
<p># flanneld configuration options # etcd url location. Point this to the server where etcd runs FLANNEL_ErCD=&quot;http://192.168.18.3:2379&quot; # etcd config key.</p>
<p>This is the configuration key that flannel queries # For address range assignment FLANNEL_ETCD_KEY=&quot;/coreos.com/netwozk&quot; 在启动 flanneld 服务之前，需要在 etcd 中添加一条网络配置记录，这个配置将用于 flanneld 分配给每个 Docker 的虚拟IP 地址段。</p>
<p># etcdct1</p>
<p>set /coreos.com/network/config &#x27;｛ &quot;Network&quot; ：&quot;10.1.0.0/16&quot; ）&#x27; 4） 由于 flannel 将覆盖 docker0 网桥，所以如果 Docker 服务已启动，则停止 Docker 服务。</p>
<p>5） 启动 flanneld 服务：</p>
<p>•73•</p>
<h2>第 87 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） # systemctl restart flanneld 6）设置 docker0 网桥的IP 地址：</p>
<p>#mk-docker-opts.sh -i # source /run/flannel/subnet.env # ifconfig dockerO S｛FLANNEL_SUBNET） 完成后确认网络接口 docker0 的IP 地址属于 flannel0 的子网：</p>
<p>#ip addr</p>
<p>flanne10:flags=4305&lt;UP, POINTOPOINT, RUNNING, NOARP, MULTICAST&gt; mtu 1472 netmask 255.255.0.0 destination 10.1.10.0 docker0:flags=4163&lt;UP, BROADCAST, RUNNING, MULTICAST&gt; mtu 1500 inet 10.1.10.1</p>
<p>netmask 255.255.255.0 broadcast 10.1.10.255 7） 重新启动 Docker 服务：</p>
<p># systemct1 restart docker 到此就完成了 flannel 覆盖网络的设置。</p>
<p>使用 ping 命令验证各 Node 上docker0之间的相互访问。例如在Nodel（docker0 IP=10.1.10.1） 机器上 ping Node2 的 dockero （dockerO&#x27;s IP=10.1.30.1），通过flannel 能够成功连接到其他物理 机的 Docker 网络：</p>
<p>PING 10.1.30.1 （10.1.30.1） 56（84） bytes of data.</p>
<p>64 bytes from 10.1.30.1: icmp_seq=1 tt1=62 time=1.15 ms 64 bytes</p>
<p>10.1.30.1:icmp_seg=2 tt1=62 time=1.16 ms 64 bytes from</p>
<p>10.1.30.1:icmp_seq=3 tt1=62 time=1.57 ms 我们也可以在 etcd 中查看到 flannel 设置的 flanne10 地址与物理机IP 地址的对应规则：</p>
<p># etcdctl ls /coreos.com/network/subnets /coreos.com/network/subnets/10.1.10.0-24 /coreos.com/network/subnets/10.1.20.0-24 /coreos.com/network/subnets/10.1.30.0-24 # etcdctl get /coreos.com/network/subnets/10.1.10.0-24 ｛&quot;PublicIP&quot;： &quot;192.168.1.129&quot;｝ # etcdctl get /coreos.com/network/subnets/10.1.20.0-24 ｛&quot;PubliciP&quot;： &quot;192.168.1.130&quot;｝ # etcdctl get /coreos.com/network/subnets/10.1.30.0-24 ｛&quot;PublicIP&quot; ： &quot;192.168.1.131&quot;｝ 2. Open vSwitch（虚拟交换机） 以两个 Node 为例，目标网络拓扑如图2.2所示。</p>
<p>•74•</p>
<h2>第 88 页</h2>
<h3>第2章</h3>
<p>Kubernetes 实践指南</p>
<p>Node1</p>
<p>Node2</p>
<p>容器1</p>
<p>172 17 42.50</p>
<p>容器2</p>
<p>容器1</p>
<p>容器2</p>
<p>OVS</p>
<p>etho</p>
<h3>192.168 18 128</h3>
<h3>192.168.18 131</h3>
<p>ping 172.17.43.71</p>
<p>图 2.2 通过 Open vSwitch 打通网络 首先，确保节点 192.168.18.128 的 Docker0 采用172.17.43.0/24 网段，而192.168.18.131 的 Docker0采用 172.17.42.0/24 网段，对应参数为 docker daemon 的启动参数--bip 设置的值。</p>
<p>Open vSwitch 的安装和配置方法如下。</p>
<p>1） 在两个 Node 上安装 ovs # yum install openvswitch-2.4.0-1.x86_64.rpm 禁止 selinux，配置后重启 Linux：</p>
<p># vi /etc/selinux/config SELINUX=disabled</p>
<p>查看 Open vSwitch 的服务状态，应该启动两个进程：ovsdb-server 与 ovs-vswitchd。</p>
<p># service openvswitch status ovsdb-server</p>
<p>is running with</p>
<p>pid 2429</p>
<p>ovs-vswitchd is running with pid 2439 查看 Open vSwitch 的相关日志，确认没有异常：</p>
<p># more /var/log/messages Igrep openv Nov 2 03:12:52 docker128 openvswitch: Starting ovsdb-server ［ OK ］ 2 03:12:52 docker128 openvswitch: Configuring Open vSwitch system IDs OK ］</p>
<p>NOV</p>
<p>2 03:12:52 docker128 kernel: openvswitch: Open vSwitch switching datapath Nov 2 03:12:52 docker128 openvswitch: Inserting openvswitch module ［ OK ］ 注意上述操作需要在两个节点机器上分别执行完成。</p>
<p>2）创建网桥和 GRE 隧道</p>
<p>接下来需要在每个 Node 上建立 ovs 的网桥 brO，然后在网桥上创建一个GRE 隧道连接对 端网桥，最后把 ovs 的网桥 brO 作为一个端口连接到docker0这个 Linux 网桥上（可以认为是交 • 75•</p>
<h2>第 89 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 换机互联），这样一来，两个节点机器上的 docker0 网段就能互通了。</p>
<p>下面以节点机器 192.168.18.131 例，具体的操作步骤如下。</p>
<p>（1）创建 ovs 网桥：</p>
<p># ovs-vsctl add-br bro （2）创建 GRE 隧道连接对端，remote_ip 为对端 etho 的网卡地址：</p>
<p># ovs-vsct1 add-port br0 grel -- set interface grel type=gre option:remote_ip=192.168.18.128 （3）添加 brO 到本地 dockerO，使得容器流量通过 OVS 流经 tunnel：</p>
<p># brctl addif docker0 bro （4）启动 br0 与 docker0 网桥：</p>
<p># ip link set dev br0 up # ip link set dev docker0 up （5）添加路由规则。由于 192.168.18.128 与192.168.18.131 的 docker0网段分别为 172.17.43.0/24 与 172.17.42.0/24，这两个网段的路由都需要经过本机的 dockero 网桥路由，其中一个24网段是 通过 OVS的GRE 隧道到达对端的，因此需要在每个 Node 上添加通过 dockero 网桥转发的 172.17.0.0/16 段的路由规则：</p>
<p># ip route</p>
<p>add 172.17.0.0/16 dev docker0 （6） 清空 Docker 自带的Iptables 规则及 Linux 的规则，后者存在拒绝icmp 报文通过防火墙 的规则：</p>
<p># iptables -t nat -F; iptables -F 在 192.168.18.131上完成上述步骤后，在 192.168.18.128 节点执行同样的操作，注意，GRE 隧道里的IP 地址要改为对端节点（192.168.18.131）的IP地址。</p>
<p>配置完成后，192.168.18.131 的IP 地址、docker0 的IP 地址及路由等重要信息显示如下：</p>
<p># ip addr</p>
<p>1:10：&lt;LOOPBACK, UP, LOWER_UP&gt; mtu 65536 qdisc noqueue state UNKNOWN link/10opback 00:00:00:00:00:00brd 00:00:00:00:00:00 inet 127.0.0.1/8 scope host 10 valid_lft forever preferred_lft forever 2:ethO：&lt;BROADCAST,MULTICAST,UE, LOWER_UP&gt; mtu 1500 qdisc pfifo_fast state UR qlen 1000</p>
<p>link/ether 00:0c:29:55:5e:c3 brd ff:ff:ff:ff:ff:ff inet 192.168.18.131/24 brd 192.168.18.255 scope global dynamic eth0 valid_lft 1369sec preferred_lft 1369sec 3:ovs-system：&lt;BROADCAST,MULTICAST&gt; mtu 1500 qdisc noop state DOwNi link/ether a6:15:c3:25:cf:33 brd ff:ff:ff:ff:ff:ff 4:br0： &lt;BROADCAST, MULTICAST, UP, LOWER」 _UP&gt; mtu 1500 qdisc noqueue master docker0 • 76</p>
<h2>第 90 页</h2>
<h3>第2 章 Kubernetes 实践指南</h3>
<p>state UNKNOWN</p>
<p>link/ether 92:8d:d0:a4:ca:45 brd ff:ff:ff:ff:ff:ff 5:docker0：&lt;BROADCAST,MULTICAST, UP, LOWER_UP&gt; mtu 1500 qdisc noqueue state UP link/ether 02:42:44:8d:62:11 brd ff:ff:ff:ff:ff:ff inet 172.17.42.1/24 scope global docker0 valid_lft forever preferred_lft forever 同样，192.168.18.128 节点的重要信息如下：</p>
<p># ip addr</p>
<p>1:10：&lt;LOOPBACK, UP,LOWER_ LUP&gt; mtu 65536 qdisc noqueue state UNKNOWN link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00 inet 127.0.0.1/8 scope host 10 valid lft forever preferred lft forever 2:ethO：&lt;BROADCAST,MULTICAST, UP, LOWER_UP&gt; mtu 1500 qdisc pfifo_fast state UP qlen 1000</p>
<p>link/ether 00:0c:29:e8:02:c7 brd ff:ff:ff:ff:ff:ff inet 192.168.18.128/24 brd 192.168.18.255 scope global dynamic eth0 valid_lft 1356sec preferred_lft 1356sec 3:ovs-system：&lt;BROADCAST,MULTICAST&gt; mtu 1500 qdisc noop state DOWN link/ether fa:6c:89:a2:f2:01 brd ff:ff:ff:ff:ff:ff 4:brO： &lt;BROADCAST,MULTICAST,UP, LOWER_UP&gt; mtu 1500 qdisc noqueue master dockero state UNKNOWN</p>
<p>link/ether ba:89:14:e0:7f:43 brd ff:ff:ff:ff:ff:ff 5:docker0：&lt;BROADCAST,MULTICAST,UP, LOWER_UP&gt; mtu 1500 qdisc noqueue state UP link/ether 02:42:63:a8:14:d5 brd ff:ff:ff:ff:ff:ff inet 172.17.43.1/24 scope global docker0 valid</p>
<p>lft forever preferred_lft forever 3）两个 Node 上容器之间的互通测试 首先，在192.168.18.128 节点上 ping 192.168.18.131上的docker0地址：172.17.42.1，验证 网络互通性：</p>
<p># ping 172.17.42.1 PING 172.17.42.1 （172.17.42.1） 56（84）bytes of data.</p>
<p>64 bytes from 172.17.42.1:icmp_seq=1 tt1=64 time=1.57 ms 64 bytes from 172.17.42.1:icmp_seq=2 tt1=64 time=0.966 ms 64 bytes from 172.17.42.1:icmp_seq=3 tt1=64 time=1.01 ms 64 bytes from 172.17.42.1: icmp_seq=4 tt1=64 time=1.00 ms 64 bytes from 172.17.42.1:icmp_seq=5 tt1=64 time=1.22 ms 64 bytes from 172.17.42.1: icmp_seq=6 tt1=64 time=0.996 ms 下面我们通过 tshark 抓包工具来分析流量走向。首先，在 192.168.18.128 节点上监听 bro 上是否有GRE 报文，执行下面的命令，我们发现brO 上并没有GRE 报文：</p>
<p># tshark -i br0 -R ip proto GRE -R without -2 is deprecated. For single-pass filtering use -Y.</p>
<p>Running as user &quot;root&quot; and group &quot;root&quot; . This could be dangerous.</p>
<p>• 77•</p>
<h2>第 91 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） Capturing on &#x27;bro&#x27; ^C</p>
<p>而在 etho上抓包，则发现了 GRE封装的 ping 包报文通过，说明GRE 是在承载网的物理网 上完成的封包过程：</p>
<p># tshark -i etho -R ip proto GRE tshark：-R without -2 is deprecated. For single-pass filtering use -Y.</p>
<p>Running as user &quot;root&quot; and group &quot;root&quot;. rhis could be dangerous.</p>
<p>Capturing on &#x27;etho&#x27; 1</p>
<h3>0.000000 172.17.43.1 -&gt; 172.17.42.1 ICMP 136 Echo（ping） request</h3>
<p>id-0x0970，seg=180/46080,tt1=64 2</p>
<p>0.000892</p>
<h3>172.17.42.1 -&gt; 172.17.43.1 ICMP 136 Echo（ping） reply</h3>
<p>id=0×0970,3€9=180/46080，tt1=64 （request in 1）</p>
<p>2</p>
<p>3</p>
<h3>1.002014 172.17.43.1 -&gt; 172.17.42.1 ICMP 136 Echo（ping） request</h3>
<p>id=0x0970，seq=181/46336，tt1=64 4</p>
<h3>1.002916 172.17.42.1 -&gt; 172.17.43.1</h3>
<p>ICMP 136 Echo（ping） reply id=0x0970,seq=181/46336,tt1=64 （request in 3）</p>
<p>4</p>
<p>5</p>
<h3>2.004101 172.17.43.1 -&gt; 172.17.42.1 ICMP 136 Echo（ping） request</h3>
<p>id=0x0970,seq=182/46592，tt1=64 至此，基于 OVS 的网络搭建成功，由于GRE 是点对点隧道通信方式，所以如果有多个Node， 则需要建立 Nx（N-1）条GRE 隧道，即所有 Node 组成一个网状的网络，实现全网互通。</p>
<p>3. 直接路由</p>
<p>通过在每个 Node 上添加到其他Node 上 docker0 的静态路由规则，就可以将不同物理机的 docker0 网桥互联互通。图2.3描述了在两个 Node 之间打通网络的情况。</p>
<p>Node1</p>
<p>Node2</p>
<p>Pod 1</p>
<p>容器2</p>
<p>Pod 2</p>
<p>「容器2</p>
<p>容器1</p>
<p>共享网络</p>
<p>空间</p>
<p>容器1</p>
<p>共享网络</p>
<p>空间</p>
<p>IP2</p>
<p>mm</p>
<p>Docker0网桥</p>
<p>Docker0阿析</p>
<p>am</p>
<p>iP4</p>
<p>图 2.3</p>
<p>以直接路由方式实现 Pod 到 Pod的通信 • 78•</p>
<h2>第 92 页</h2>
<h3>第2章 Kubernetes 买践指南</h3>
<p>使用这种方案，只需要在每个 Node 的路由表中增加到对方 docker0 的静态路由转发规则。</p>
<p>例如 Pod1 所在 dockero 网桥的IP 子网是 10.1.10.0， Node 地址为 192.168.1.128：而 Pod2 所在 dockero 网桥的IP 子网是 10.1.20.0，Node地址为 192.168.1.129。</p>
<p>在Nodel 上用route add 命令增加一条到 Node2上 docker0 的静态路由规则：</p>
<p>route add -net 10.1.20.0 netmask 255.255.255.0 gw 192.168.1.129 同样，在 Node2 上增加一条到 Nodel 上 docker0 的静态路由规则：</p>
<p>route add -net 10.1.10.0 netmask 255.255.255.0 gw 192.168.1.128 在 Nodel 上通过 ping 命令验证到 Node2上 docker0 的网络连通性。这里 10.1.20.1 为 Node2 上 dockerO 网桥自身的IP地址。</p>
<p>s ping 10.1.20.1</p>
<p>PING 10.1.20.1</p>
<p>（10.1.20.1） 56（84） bytes of data.</p>
<p>64 bytes from 10.1.20.1: icmp_seq=1 tt1=62 time=1.15 ms 64 bytes from</p>
<p>10.1.20.1:icmp_seg=2 ttl=62 time=1.16 ms 64 bytes from 10.1.20.1: icmp_seq=3 tt1=62 time=1.57 ms 可以看到，路由转发规则生效，Nodel 可以直接访问到 Node2上的 docker0 网桥，进一步 也可以访问到属于 docker0 网段的容器应用了。</p>
<p>不过，集群中机器的数量通常可能很多。假设有100台服务器，那么就需要在每台服务器 上手工添加到另外 99 台服务器 docker0的路由规则。为了减少手工操作，可以使用 Quagga 软 件来实现路由规则的动态添加。Quagga 软件的主页 http://www.quagga.net。</p>
<p>除了在每台服务器上安装 Quagga 软件并启动，还可以使用 Quagga 容器来运行（例如 index.alauda.cn/georce/router）。在每台 Node 上下载该 Docker 镜像：</p>
<p>$ docker pull index.alauda.cn/georce/router 在运行 Quagga 容器之前，需要确保每个 Node 上 docker0 网桥的子网地址不能重叠，也不 能与物理机所在的网络重叠，这需要网络管理员的仔细规划。</p>
<p>下面以3个 Node 为例，每台Node 的 dockero 网桥的地址如下（前提是 Node 物理机的IP 地址不是10.1.X.X地址段）：</p>
<p>Node 1： # ifconfig docker0 10.1.10.1/24 Node 2： # ifconfig docker0 10.1.20.1/24 Node 3： #ifconfig docker0 10.1.30.1/24 然后在每个 Node 上启动 Quagga 容器。需要说明的是，Quagga 需要以--privileged 特权模式 运行，并且指定--net=host，表示直接使用物理机的网络：</p>
<p>s docker run -itd --name=router --privileged --net=host index.alauda.cn/georce/router •79•</p>
<h2>第 93 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 启动成功后，Quagga 会相互学习来完成到其他机器的 dockero 路由规则的添加。</p>
<p>一段时间后，在Nodel 上使用 route-n 命令来查看路由表，可以看到 Quagga 自动添加了两 条到 Node2 和到 Node3上 dockero 的路由规则。</p>
<p># route -n</p>
<p>Kernel IP routing table Destination</p>
<p>Gateway</p>
<p>Genmask</p>
<p>Flags Metric Ref</p>
<p>Use Iface</p>
<p>0.0.0.0</p>
<p>192.168.1.128</p>
<p>：0.0.0.0</p>
<p>UG</p>
<p>0</p>
<p>0</p>
<p>0</p>
<p>ethO</p>
<p>10.1.10.0</p>
<p>0.0.0.0</p>
<p>255.255.255.0</p>
<p>0</p>
<p>0 docker0</p>
<p>10.1.20.0</p>
<p>192.168.1.129</p>
<p>U</p>
<p>0</p>
<p>255.255.255.0</p>
<p>UG</p>
<p>20</p>
<p>0</p>
<p>ethO</p>
<p>10.1.30.0</p>
<p>192.168.1.130</p>
<p>255.255.255.0</p>
<p>UG</p>
<p>20</p>
<p>0</p>
<p>0</p>
<p>ethO</p>
<p>在Node2 上查看路由表，可以看到自动添加了两条到Nodel 和 Node3 上 docker0 的路由规则。</p>
<p># route -n</p>
<p>Kernel IP routing table Destination</p>
<p>Gateway</p>
<p>Genmask</p>
<p>Flags Metric Ref</p>
<p>Use Iface</p>
<p>0.0.0.0</p>
<p>192.168.1.129</p>
<p>0.0.0.0</p>
<p>UG</p>
<p>0</p>
<p>0</p>
<p>0 ethO</p>
<p>10.1.20.0</p>
<p>0.0.0.0</p>
<h3>255.255.255.0 U</h3>
<p>0</p>
<p>0</p>
<p>0 docker0</p>
<p>10.1.10.0</p>
<p>192.168.1.128</p>
<h3>255.255.255.0 UG</h3>
<p>20</p>
<p>0 etho</p>
<p>10.1.30.0</p>
<p>192.168.1.130</p>
<h3>255.255.255.0 UG</h3>
<p>20</p>
<p>0</p>
<p>0 etho</p>
<p>至此，所有Node上的docker0 都可以互联互通了。</p>
<p>2.2</p>
<p>kubectl 命令行工具用法详解</p>
<p>kubectl 作为客户端 CLI 工具，可以让用户通过命令行的方式对 Kubernetes 集群进行操作。</p>
<p>本节对 kubectl 的子命令和用法进行详细说明。</p>
<h3>2.2.1 kubectl 用法概述</h3>
<p>kubectl 命令行的语法如下：</p>
<p>s kubectl ［command］ ［TYPE］ ［NAME］ ［flags］ 其中，command、TYPE、NAME、flags 的含义如下。</p>
<p>（1） command：子命令，用于操作 Kubernetes 集群资源对象的命令，例如 create、delete、 describe、get、apply 等。</p>
<p>（2） TYPE：资源对象的类型，区分大小写，能以单数形式、复数形式或者简写形式表示。</p>
<p>例如以下3种 TYPE 是等价的。</p>
<p>$ kubectl get pod podl • 80•</p>
<h2>第 94 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>$ kubectl get pods podl $ kubectl get po podl （3） NAME：资源对象的名称，区分大小写。如果不指定名称，则系统将返回属于 TYPE 的全部对象的列表，例如＄ kubectl get pods 将返回所有 Pod 的列表。</p>
<p>（4） flags: kubectl 子命令的可选参数，例如使用“-s” 指定 apiserver 的 URL 地址而不用默 认值。</p>
<p>kubectl 可操作的资源对象类型如表2.9所示。</p>
<p>表2.9 kubectl 可操作的资源对象类型 资源对象的名称</p>
<p>缩写</p>
<p>componentstatuses</p>
<p>daemonsets</p>
<p>cs</p>
<p>ds</p>
<p>deployments</p>
<p>events</p>
<p>endpoints</p>
<p>horizontalpodautoscalers ingresses</p>
<p>ev</p>
<p>ep</p>
<p>hpa</p>
<p>ing</p>
<p>jobs</p>
<p>limitranges</p>
<p>nodes</p>
<p>namespaces</p>
<p>pods</p>
<p>persistentvolumes</p>
<p>persistentvolumeclaims resourcequotas</p>
<p>replicationcontrollers limits</p>
<p>nO</p>
<p>nS</p>
<p>PO</p>
<p>PY</p>
<p>pvc</p>
<p>quota</p>
<p>TC</p>
<p>secrets</p>
<p>serviceaccounts</p>
<p>services</p>
<p>svC</p>
<p>在一个命令行中也可以同时对多个资源对象进行操作，以多个 TYPE和NAME的组合表示， 示例如下。</p>
<p>◎ 获取多个 Pod的信息：</p>
<p>$ kubectl get pods podl pod2 获取多种对象的信息：</p>
<p>$ kubectl get pod/podl rc/rcl ◎ 同时应用多个 yaml 文件，以多个-ffile 参数表示：</p>
<p>•81•</p>
<h2>第 95 页</h2>
<p>Kubernetes 权威指南：从 Docker到 Kubernetes 实践全接触（第2版） $ kubectl get pod -f podl.yaml -f pod2.yaml § kubectl create -f podl.yaml -f rcl.yaml -f servicel.yaml</p>
<h3>2.2.2 kubectl 子命令详解</h3>
<p>kubectl 的子命令非常丰富，涵盖了对 Kubernetes 集群的主要操作，包括资源对象的创建、 删除、查看、修改、配置、运行等。详细的子命令如表2.10所示。</p>
<p>表2.10 kubectl 子命令详解 子命令</p>
<p>annotate</p>
<p>语法</p>
<p>kubectl annotate ［-overwrite］ （-f FIL.ENAME ITYPE NAME） 说明</p>
<p>添加或更新资源对象的 annotation KEY_I=VAL_I. KEY _N=VAL_N ［-resource-version=version］ ［flags］ api-versions</p>
<p>kubectl api-versions ［flags］ apply</p>
<p>attach</p>
<p>autoscale</p>
<p>cluster-info</p>
<p>completion</p>
<p>config</p>
<p>convert</p>
<p>cordon</p>
<p>create</p>
<p>delete</p>
<p>describe</p>
<p>drain</p>
<p>edit</p>
<p>kubectl apply -f FILENAME ［flags］ kubectl attach POD -C CONTAINER ［flags］ kubectl autoscale （-f FILENAME | TYPE NAME | TYPE/NAME） ［--min=MINPODS］--max=MAXPODS ［-cpu-percent-CPU］ ［fags］ 信息</p>
<p>列出当前系统支持的API版本列表，</p>
<p>格式为 “group/version” 从配置文件或 stdin 中对资源对象进 行配置更新</p>
<p>附着到一个正在运行的容器上</p>
<p>对 Deployment、ReplicaSet 或 ReplicationController 进行水平自动 扩缩容的设置</p>
<p>显示集群信息</p>
<p>kubectl cluster-info ［flags］ kubectl cluster-info ［command］ kubectl completion SHELL ［flags］ 输出 shell 命令的执行结果码（bash 或zsh）</p>
<p>修改kubeconfig文件</p>
<p>kubectl config SUBCOMIMAND ［flags］ kubectl config ［command］ kubectl convert-fFILENAME ［flags］ kubectl cordon NODE ［flags］ 转换配置文件为不同的API 版本</p>
<p>将Node标记为 unschedulable，即“隔 离”出集群调度范围</p>
<p>kubectl create-fFILENAME ［fags］ 从配置文件或 stdin 中创建资源对象 kubectl create ［command］ kubectl delete （I-f FILENAME］ | TYPE ［（INAME | -1 label | --all）］） ［hags］</p>
<p>kubectl describe （-f FILENAME | TYPE INAME_PREFIX | /NAME | -IIabell） ［fags］</p>
<p>kubectl drain NODE ［flags］ kubectl edit （RESOURCE/NAME |-fFILENAME） ［flags］ 根据配置文件、stdin、资源名称或 label selector 删除资源对象 描述一个或多个资源对象的详细信</p>
<p>息</p>
<p>首先将 Node 设置为 unschedulable， 然后删除该 Node上运行的所有Pod， 但不会删除不由 apiserver 管理的Pod 编辑资源对象的属性，在线更新</p>
<p>•82•</p>
<h2>第 96 页</h2>
<p>子命令</p>
<p>exec</p>
<p>explain</p>
<p>expose</p>
<p>get</p>
<p>label</p>
<p>logs</p>
<p>namespace</p>
<p>patch</p>
<p>port-forward</p>
<p>Proxy</p>
<p>replace</p>
<p>rolling-update</p>
<p>rollout</p>
<p>run</p>
<p>scale</p>
<p>set</p>
<p>taint</p>
<p>uncordon</p>
<p>version</p>
<h3>第2章 Kubernetes 实践指南</h3>
<p>续表</p>
<p>语法</p>
<p>kubectl exec POD ［-C CONTAINER］ --COMMAND ［args..］［flags］ kubectl explain RESOURCE ［flags］ kubectl expose （f FILENAME | TYPE NAME）［-port-port］ ［-protocol=TCP|UDP］ ［--target-port=number-or-name］［--name=name］ ［-exteral-ip=external-ip-of-service］ ［--type=type］ ［flags］ kubectl get ［（-o--output=）isonlyaml/wide|go-template=.|go-template- file=..jisonpath=..jisonpath-file=..］ （TYPE ［NAME |-1 label］ | TYPE/ NAME ...）［flags］</p>
<p>kubectl label ［--overwrite］ （-fFILENAME | TYPE NAME） KEY_I=VAL_I.. KEY_N=VAL_N ［-resource-version=version］ ［fags］ kubectl logs ［-f L-pJ POD I-C CONTAINER］ ［flags］ kubectl namespace ［namespace］ ［flags］ kubectl patch （-f FILENAME |TYPE NAME） -P PATCH ［flags］ kubectl</p>
<p>port-forvard POD ［LOCAL_PORT:JREMOTE _PORT L［LOCAL_PORT_N:JREMOTE_PORT.N］ ［flags］ kubectl</p>
<p>Proxy</p>
<p>【-port-=PORT］</p>
<p>［--www=static-dir］ 【-www-prefix=prefix］ ［-api-prefix=prefix］ ［flags］ kubectl replace -f FILENAME ［flags kubectl</p>
<p>rolling-update OLD.CONTROLLER_NAME （INEW- CONTROLLER_NAME］ -image=NEW_CONTAINER_IMAGE I -fNEW_CONTROLLER_SPEC） ［flags］ kubectl rollout SUBCOMMAND ［flags］ kubectl rollout ［command］ kubectl run,NAME -image=image［-env=&quot;key=value&quot;］ ［-port-port］ ［-replicas=replicas］ ［--dry-run=bool］ ［--overrides=inline-json］ 【--command］ --［COMMAND］［args..］［flags］ kubectl scale ［-resource-version=version］ ［--current-replicas=count］ --replicas=COUNT （-f FILENAME | TYPE NAME） ［flags］ kubectl set SUBCOMMAND ［fags］ kubectl set ［command］ kubectl taint NODE NAME KEY_I=VAL_1:TAINT_EFFECT_1 • KEY_N=VAL_N:TAINT_EFFECT_N ［fags］ kubectl uncordon NODE ［flags］ kubectl version ［flags］ 说明</p>
<p>执行一个容器中的命令</p>
<p>对资源对象属性的详细说明</p>
<p>将已经存在的一个 RC、Service、 Deployment 或 Pod 暴露为一个新的 Service</p>
<p>显示一个或多个资源对象的概要信</p>
<p>息</p>
<p>设置或更新资源对象的 labels</p>
<p>屏幕打印一个容器的日志</p>
<p>已被 kubectl config set-context 替代 以 merge 形式对资源对象的部分字 段的值进行修改</p>
<p>将本机的某个端口号映射到 Pod 的 端口号，通常用于测试工作</p>
<p>将本机某个端口号映射到 apiserver 从配置文件或 stdin 替换资源对象 对RC 进行滚动升级</p>
<p>对 Deployment进行管理，可用操作 包括：history、pause、resume、undo、 status</p>
<p>基于一个镜在 Kubernetes 集群上启 动一个 Deployment</p>
<p>扩容、缩容一个 Deployment、 ReplicaSet、RC 或Job 中 Pod 的数量 设置资源对象的某个特定信息，目</p>
<p>前仅支持修改容器的镜像</p>
<p>设置 Node 的taint 信息，用于将特 定的 Pod 调度到特定的 Node 的操 作，为Alpha 版本功能</p>
<p>将 Node设置为 schedulable 打印系统的版本信息</p>
<p>• 83•</p>
<h2>第 97 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版）</p>
<h3>2.2.3 kubectl 参数列表</h3>
<p>kubectl 命令行的公共启动参数如表2.11 所示。</p>
<p>表2.11 kubectl命令行公共参数 参数名和取值示例</p>
<p>--alsologtostderrf=false］ --as=&quot;&quot;</p>
<p>-certificate-authority=&quot; -client-certificate=&quot; -client-key=&quot;&quot;</p>
<p>--cluster=&quot;&quot;</p>
<p>--context=&quot;</p>
<p>-insecure-skip-tls-verify［=false］ --kubeconfig=&quot;&quot;</p>
<p>--log-backtrace-at=：0 -log-dir=&quot;</p>
<p>--log-flush-frequency=5s --logtostderr［=true］ --match-server-version［=false］ -namespace=&quot;</p>
<p>--password=&quot;</p>
<p>-S，--scrver=&quot;</p>
<p>--stderrthreshold=2 --token=&quot;&quot;</p>
<p>-user=&quot;&quot;</p>
<p>--username=&quot;&quot;</p>
<p>-V=0</p>
<p>--vmodule=</p>
<p>--help 命令进行查看。</p>
<p>说明</p>
<p>设置为 true 表示将日志输出到文件的同时输出到 stderr 设置本次操作的用户名</p>
<p>用于 CA 授权的 cert 文件路径 用于 TLS的客户端证书文件路径</p>
<p>用于 TLS的客户端 key 文件路径 设置要使用的 kubeconfig 中的 cluster 名 设置要使用的 kubeconfig 中的 context 名 设置为 true 表示跳过 TLS 安全验证模式，将使得 HTTPS 连接不安全 kubeconfig 配置文件路径，在配置文件中包括 Master 地址信息及必要的认证信息 记录日志每到“file：行号”时打印一次 stack trace 日志文件路径</p>
<p>设置 flush 日志文件的时间间隔 设置为 true 表示将日志输出到 stderr，不输出到日志文件 设置为 true 表示客户端版本号需要与服务端一致 设置本次操作所在的 namespace 设置 apiserver 的 basic authentication 的密码 设置 apiserver 的 URL 地址，默认为 localhost:8080 在该 threshold 级别之上的日志将输出到 stderr 设置访问 apiserver 的安全 token 指定 kubeconfig 用户名</p>
<p>设置 apiserver 的 basic authentication 的用户名 glog 日志级别</p>
<p>glog 基于模块的详细日志级别</p>
<p>每个子命令（如 create、delete、get 等）还有特定的 flags 参数，可以通过＄ kubectl ［command］</p>
<h3>2.2.4 kubectl 输出格式</h3>
<p>kubectl 命令可以用多种格式对结果进行显示，输出的格式通过-0参数指定：</p>
<p>•84．</p>
<h2>第 98 页</h2>
<h3>第2章</h3>
<p>Kubernetes 实践指南</p>
<p>$ kubectl ［command］ ［TYPE］［NAME］ -o=&lt;output_format&gt; 根据不同子命令的输出结果，可选的输出格式如表2.12所示。</p>
<p>表2.12 kubectl 命令输出格式列表 输出格式</p>
<p>说明</p>
<p>-0=custom-columns=&lt;spec&gt; -o=custom-columns-file=&lt;filename〉 -0=json</p>
<p>-o=jsonpath=&lt;template&gt; -o=jsonpath-file=&lt;filename -o=name</p>
<p>-0=wide</p>
<p>-0=yaml</p>
<p>根据自定义列名进行输出，以逗号分隔</p>
<p>从文件中获取自定义列名进行输出</p>
<p>以JSON 格式显示结果</p>
<p>输出jsonpath 表达式定义的字段信息 输出 jsonpath 表达式定义的字段信息，来源于文件 仅输出资源对象的名称</p>
<p>输出额外信息。对于 Pod，将输出 Pod 所在的Node 名 以 yaml 格式显示结果</p>
<p>常用的输出格式示例如下。</p>
<p>（1） 显示 Pod 的更多信息：</p>
<p>$ kubectl get pod &lt;pod-name&gt; -0 wide （2）以yaml 格式显示 Pod 的详细信息：</p>
<p>$ kubectl get pod &lt;pod-name&gt; -0 yaml （3）以自定义列名显示 Pod 的信息：</p>
<p>s kubectl get pod &lt;pod-name〉 -o=custom-columns=NAME：.metadata.name,RSRC：.metadata.resourceVersion （4）基于文件的自定义列名输出：</p>
<p>$ kubectl get pods &lt;pod-name&gt; -o=custom-columns-file=template.txt template.txt 文件的内容为：</p>
<p>NAME</p>
<p>RSRC</p>
<p>metadata.name</p>
<p>metadata.resourceVersion 输出结果为：</p>
<p>NAME</p>
<p>RSRC</p>
<p>pod-name</p>
<p>52305</p>
<p>另外，还可以将输出结果按某个字段排序，通过--sort-by 参数以jsonpath 表达式进行指定：</p>
<p>$ kubect1 ［command］ ［TYPE］［NAME］--sort-by=&lt;jsonpath_exp&gt; 例如，按照名字进行排序：</p>
<p>$ kubectl get pods --sort-by=.metadata.name • 85•</p>
<h2>第 99 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版）</p>
<h3>2.2.5 kubectl 操作示例</h3>
<p>本节对一些常用的kubectl操作进行示例。</p>
<p>1. 创建资源对象</p>
<p>根据 yaml 配置文件一次性创建 service 和 rc：</p>
<p>$ kubectl create -f my-service.yaml -f my-rc.yaml 根据&lt;directory&gt;目录下所有.yaml、•yml、json 文件的定义进行创建操作：</p>
<p>$ kubectl create -f &lt;directory&gt; 2. 查看资源对象</p>
<p>查看所有 Pod 列表：</p>
<p>$ kubectl get pods 查看 rc 和 service 列表：</p>
<p>$ kubectl get rc,service 3. 描述资源对象</p>
<p>显示 Node 的详细信息：</p>
<p>$ kubectl describe nodes &lt;node-name〉 显示 Pod 的详细信息：</p>
<p>$ kubectl describe pods/&lt;pod-name&gt; 显示由 RC管理的Pod 的信息：</p>
<p>$ kubectl describe pods &lt;rc-name〉 4. 删除资源对象</p>
<p>基于 pod.yaml定义的名称删除 Pod：</p>
<p>$ kubectl delete -f pod.yaml 删除所有包含某个 label 的 Pod 和 service：</p>
<p>$ kubectl delete pods,services -1 name=&lt;label-name&gt; 删除所有 Pod：</p>
<p>$ kubectl delete pods --al1 • 86•</p>
<h2>第 100 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>5. 执行容器的命令</p>
<p>执行Pod 的date 命令，默认使用Pod 中的第1个容器执行：</p>
<p>$ kubectl exec &lt;pod-name&gt; date 指定 Pod 中某个容器执行 date 命令：</p>
<p>s kubectl exec &lt;pod-name&gt;-c &lt;container-name&gt; date 通过bash 获得Pod 中某个容器的 TTY，相当于登录容器：</p>
<p>$ kubectl exec -ti &lt;pod-name&gt; -c &lt;container-name&gt; /bin/bash 6. 查看容器的日志</p>
<p>查看容器输出到 stdout 的日志：</p>
<p>s kubectl logs &lt;pod-name&gt; 跟踪查看容器的日志，相当于 tail-f命令的结果：</p>
<p>s kubectl logs -f &lt;pod-name&gt; -c &lt;container-name&gt; 2.3</p>
<p>Guestbook 示例：Hello World 在对Kuberetes 的容器应用进行详细说明之前，让我们先通过一个由3个微服务组成的留 言板（Guestbook）系统的搭建，对 Kubernetes 对容器应用的基本操作和用法进行初步介绍。本 章后面的章节将基于该案例和其他示例，进一步深入Pod、RC、Service 等核心对象的用法和技 巧，对 Kubemetes 的应用管理进行全面讲解。</p>
<p>Guestbook 留言板系统将通过 Pod、RC、Service 等资源对象搭建完成，成功启动后在网页 中显示一条“Hello World”留言。其系统架构是一个基于 PHP+Redis 的分布式Web 应用，前端 PHP web 网站通过访问后端的 Redis 来完成用户留言的查询和添加等功能。同时 Redis 以 Master+Slave 的模式进行部署，实现数据的读写分离能力。</p>
<p>留言板系统的部署架构如图2.4所示。Web 层是一个基于 PHP 页面的Apache 服务，启动3 个实例组成集群，为客户端（例如浏览器）对网站的访问提供负载均衡。Redis Master 启动1 个实例用于写操作（添加留言），Redis Slave 启动两个实例用于读操作（读取留言）。Redis Master 与 Slave 的数据同步由 Redis 具备的数据同步机制完成。</p>
<p>• 87</p>
<h2>第 101 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） php-frontend</p>
<p>写</p>
<p>诶</p>
<p>同步</p>
<p>redis-master</p>
<p>redis-slave</p>
<p>图2.4 留言板的系统部署架构图</p>
<p>在本例中将要用到3个 Docker 镜像，下载地址为 https://hub.docker.com/w/kubeguide/。</p>
<p>redis-master：用于前端web 应用进行“写”留言操作的Redis 服务，其中己经保存了 一条内容为“Hello World！”的留言。</p>
<p>guestbook-redis-slave：用于前端 Web 应用进行“读”留言操作的 Redis 服务，并与 Redis-Master 的数据保持同步。</p>
<p>◎</p>
<p>gguestbook-php-frontend:PHPWeb 服务，在网页上展示留言的内容，也提供一个文本 输入框供访客添加留言。</p>
<p>如图2.5所示为Hello Worid 案例所采用的 Kubernetes 部署架构，这里 Master 与Node 的服 务处于同一个虚拟机中。通过创建 redis-master 服务、redis-slave 服务和 php-frontend 服务来实 现整个系统的搭建。</p>
<p>浏览𨫥访问</p>
<p>php-frontend</p>
<p>redis-master</p>
<p>frontend Service</p>
<p>php-frontend</p>
<p>php-trontend</p>
<p>Node</p>
<p>wbe-prox©</p>
<p>redis-master Service redis-slave Service 虛拟机</p>
<p>图2.5</p>
<p>Kubernetes 部署架构图</p>
<p>•88</p>
<h2>第 102 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>2.3.1</p>
<p>创建 redis-master RC和Service 我们可以先定义 Service，然后定义一个 RC来创建和控制相关联的Pod，或者先定义RC 来创建 Pod，然后定义与之关联的 Service，这里我们采用后一种方法。</p>
<p>首先 redis-master 创建一个名 redis-master 的RC定义文件 redis-master-controller.yaml。</p>
<p>yaml 的语法类似于 PHP 的语法，对于空格的个数有严格的要求，详见 http://yaml.org。</p>
<p>apiVersion: v1</p>
<p>kind:ReplicationController metadata：</p>
<p>name:redis-master</p>
<p>labels：</p>
<p>name: redis-master spec：</p>
<p>replicas: 1</p>
<p>selector：</p>
<p>name:redis-master</p>
<p>template：</p>
<p>metadata：</p>
<p>labels：</p>
<p>name: redis-master spec：</p>
<p>containers：</p>
<p>- name:master</p>
<p>image: kubeguide/redis-master ports：</p>
<p>- containerPort: 6379 其中，kind 字段的值为 “ReplicationController”，表示这是一个 RC；spec.selector 是RC的 Pod选择器，即监控和管理拥有这些标签（Label）的Pod 实例，确保当前集群上始终有且仅有 replicas 个 Pod 实例在运行，这里我们设置 replicas=1 表示只运行一个（名次 redis-master 的）Pod 实例，当集群中运行的 Pod 数量小于 replicas 时，RC 会根据 spec.template 段定义的Pod 模板来 生成一个新的Pod 实例，labels 属性指定了该Pod 的标签，注意，这里的 labels 必须匹配RC的 spec.selector，否则此RC就会陷入“只为他人做嫁衣”的悲惨世界中，永无翻身之时。</p>
<p>创建好 redis-master-controller.yaml 文件以后，我们在 Master 节点执行命令：kubectl create -f &lt;config_file&gt;，将它发布到 Kubernetes 集群中，就完成了 redis-master 的创建过程：</p>
<p>s kubectl create -f redis-master-controller.yaml replicationcontroller &quot;redis-master&quot; created 系统提示 “redis-master”表示创建成功。然后我们用 kubectl 命令查看刚刚创建的 redis-master：</p>
<p>s kubectl get rc</p>
<p>• 89•</p>
<h2>第 103 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） NAME</p>
<p>DESIRED</p>
<p>CURRENT AGE</p>
<p>redis-master</p>
<p>1</p>
<p>1</p>
<p>5m</p>
<p>接下来运行 kubectl get pods 命令来查看当前系统中的Pod 列表信息，我们看到一个名为 redis-master-xxxxx 的Pod 实例，这是 Kubernetes 根据 redis-master 这个 RC 的定义自动创建的 Pod。RC 会给每个 Pod 实例在用户设置的 name 后补充一段 UUID，以区分不同的实例。由于 Pod 的调度和创建需要花费一定的时间，比如需要一定的时间来确定调度到哪个节点上，以及 下载Pod的相关镜像，所以一开始我们看到Pod 的状态将显示为Pending。当Pod 成功创建完 成以后，状态会被更新为 Running。如果Pod 一直处于 Pending 状态，则请参看第5章的查错 说明。</p>
<p>$ kubectl get pods NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>redis-master-b03io 1/1</p>
<p>Running</p>
<p>RESTARTS</p>
<p>AGE</p>
<p>1h</p>
<p>redis-master Pod 已经创建并正常运行了，接下来我们就创建一个与之关联的 Service（服务） 定义文件（文件名为 redis-master-service.yaml），完整的内容如下：</p>
<p>apiversion:v1</p>
<p>kind:Service</p>
<p>metadata：</p>
<p>name: redis-master labels：</p>
<p>name:redis-master</p>
<p>spec：</p>
<p>ports：</p>
<p>- port:6379</p>
<p>targetPort:6379</p>
<p>selector：</p>
<p>name:redis-master</p>
<p>其中 metadata.name 是 Service 的服务名（ServiceName），spec.selector 确定了选择哪些Pod， 本例中的定义表明将选择设置过 name=redis-master 标签的Pod。 port 属性定义的是 Service 的虚 拟端口号，targetPort 属性指定后端Pod 内容器应用监听的端口号。</p>
<p>运行 kubectl create 命令创建该 service：</p>
<p>$ kubectl create -f redis-master-service.yaml service &quot;redis-master&quot; created 系统提示 “service &quot;redis-master&quot; created” 表示创建成功。然后运行 kubectl get 命令可以查 看到刚刚创建的 service：</p>
<p>$ kubectl get services NAME</p>
<p>CLUSTER-IP</p>
<p>redis-master</p>
<p>169.169.208.57</p>
<p>EXTERNAL-IP</p>
<p>PORT （S）</p>
<p>&lt;none&gt;</p>
<p>6379/TCP</p>
<p>AGE</p>
<p>13m</p>
<p>•90•</p>
<h2>第 104 页</h2>
<h3>第2章</h3>
<p>Kubernetes 实践指南</p>
<p>注意到 redis-master 服务被分配了一个值为 169.169.208.57的虚拟 IP 地址，随后，Kubernetes 集群中其他新创建的Pod就可以通过这个虚拟IP 地址+端口 6379来访问这个服务了。在本例 中将要创建的redis-slave 和 frontend两组Pod都将通过169.169.208.57:6379来访问 redis-master 服务。</p>
<p>但由于 IP 地址是在服务创建后由 Kubernetes 系统自动分配的，在其他Pod 中无法预先知道 某个 Service 的虚拟 IP 地址，因此需要一个机制来找到这个服务。为此，Kubernetes 巧妙地使 用了 Linux 环境变量（Environment Variable），在每个 Pod 的容器里都增加了一组 Service 相关 的环境变量，用来记录从服务名到虚拟 IP 地址的映射关系。以 redis-master 服务为例，在容器 的环境变量中会增加下面两条记录：</p>
<p>REDIS_MASTER_SERVICE_HOST=169.169.144.74 REDIS</p>
<p>，_MASTER_SERVICE</p>
<p>_PORT=6379</p>
<p>于是，redis-slave 和 frontend 等Pod 中的应用程序就可以通过环境变量 REDIS_MASTER_ SERVICE_HOST 得到 redis-master 服务的虚拟IP 地址，通过环境变量 REDIS_MASTER_ SERVICE_PORT 得到 redis-master 服务的端口号，这样就完成了对服务地址的查询功能。</p>
<p>2.3.2</p>
<p>创建 redis-slave RC 和 Service 现在我们已经成功启动了 redis-master 服务，接下来我们继续完成 redis-slave 服务的创建过 程。在本案例中会启动 redis-slave 服务的两个副本，每个副本上的 Redis 进程都与 redis-master 进行数据同步，与 redis-master 共同组成了一个具备读写分离能力的Redis 集群。留言板的PHP 网页将通过访问 redis-slave 服务来读取留言数据。与之前的 redis-master 服务的创建过程一样，首 先创建一个名为 redis-slave 的RC定义文件 redis-slave-controller. yaml，完整内容如下：</p>
<p>apiVersion: vl</p>
<p>kind: ReplicationController metadata：</p>
<p>name: redis-slave</p>
<p>labels：</p>
<p>name: redis-slave</p>
<p>speC：</p>
<p>replicas: 2</p>
<p>selector：</p>
<p>name: redis-slave</p>
<p>template：</p>
<p>metadata：</p>
<p>1abels：</p>
<p>name: redis-slave</p>
<p>speC：</p>
<p>containere：</p>
<p>• 91•</p>
<h2>第 105 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） - name: slave</p>
<p>image: kubeguide/guestbook-redis-slave env：</p>
<p>- name:GET_HOSTS_FROM value: env</p>
<p>ports：</p>
<p>- containerPort: 6379 在容器的配置部分设置了一个环境变量 GET_HOSTS_FROM=env，意思是从环境变量中获 取 redis-master 服务的IP 地址信息。</p>
<p>redis-slave 镜像中的启动脚本/run.sh 的内容为：</p>
<p>iE IL SIGET_HOSTS_FROM：-dns｝== &quot;env&quot; ］］；then redis-server --slaveof S｛REDIS_MASTER_SERVICE_HOST） 6379 else</p>
<p>redis-server</p>
<p>--slaveof redis-master 6379 fi</p>
<p>在创建 redis-slave Pod 时，系统将自动在容器内部生成之前已经创建好的 redis-master service 相关的环境变量，所以 redis-slave 应用程序 redis-server 可以直接使用环境变量 REDIS_ MASTER_SERVICE，_HOST 来获取 redis-master 服务的IP地址。</p>
<p>如果在容器配置部分不设置该 env，则将使用 redis-master 服务的名称 “redis-master”来访 问它，这将使用 DNS 方式的服务发现，需要预先启动 Kubernetes 集群的 skydns 服务，详见 2.5.4 节的说明。</p>
<p>运行 kubectl create 命令：</p>
<p>$ kubectl create -f redis-slave-controller.yaml Replicationcontrollers &quot;redis-slave&quot; created 运行 kubectl get 命令查看 RC：</p>
<p>$ kubectl get rc</p>
<p>NAME</p>
<p>DESIRED</p>
<p>CURRENT</p>
<p>AGE</p>
<p>redis-master</p>
<p>redis-slave</p>
<p>查看RC创建的Pod，可以看到有两个 redis-slave Pod 在运行：</p>
<p>$ kubectl get pods NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS</p>
<p>redis-master-b03io 1/1</p>
<p>Running</p>
<p>0</p>
<p>redis-slave-10ah1</p>
<p>1/1</p>
<p>Running</p>
<p>redis-slave-c5y10</p>
<p>1/1</p>
<p>Running</p>
<p>AGE</p>
<p>1h</p>
<p>lh</p>
<p>1h</p>
<p>然后创建 redis-slave 服务。类似于 redis-master 服务，与redis-slave 相关的一组环境变量也 将在后续新建的 frontend Pod 中由系统自动生成。</p>
<p>•92•</p>
<h2>第 106 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>配置文件 redis-slave-service.yaml 的内容如下：</p>
<p>apiVersion: v1</p>
<p>kind:Service</p>
<p>metadata：</p>
<p>name: redis-slave</p>
<p>labels：</p>
<p>name: redis-slave</p>
<p>spec：</p>
<p>ports：</p>
<p>- port:6379</p>
<p>selector：</p>
<p>name: redis-slave</p>
<p>运行 kubectl 创建 Service：</p>
<p>$ kubectl create -f redis-slave-service.yaml services/redis-slave 通过kubectl 查看创建的 Service：</p>
<p>$ kubectl get services CLUSTER-IP</p>
<p>169.169.167.153</p>
<p>redis-master</p>
<p>redis-slave</p>
<p>169.169.208.57</p>
<p>169.169.78.102</p>
<p>2:33 创建 fontend RC 和 Service 类似地，定义 frontend 的 RC 配置文件一 apiVersion:V1</p>
<p>kind:Replicationcontroller metadata：</p>
<p>name: frontend</p>
<p>labels：</p>
<p>name: frontend</p>
<p>spec：</p>
<p>replicas：</p>
<p>3</p>
<p>selector：</p>
<p>name: frontend</p>
<p>template：</p>
<p>metadata：</p>
<p>1abels：</p>
<p>name：</p>
<p>frontend</p>
<p>speC：</p>
<p>containers：</p>
<p>- name: frontend</p>
<p>EXTERNAL-IP PORT （S） &lt;none&gt;</p>
<p>&lt;none&gt;</p>
<p>6379/TCP</p>
<p>6379/TCP</p>
<p>AGE</p>
<p>25m</p>
<p>25m</p>
<p>25m</p>
<p>-frontend-controller.yaml，内容如下：</p>
<p>• 93•</p>
<h2>第 107 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） image:kubeguide/guestbook-php-frontend env：</p>
<p>- name:GET_HOSTS_FROM value:env</p>
<p>ports：</p>
<p>- containerPort: 80 在容器的配置部分设置了一个环境变量 GET_HOSTS_FROM=env，意思是从环境变量中获 取 redis-master 和 redis-slave 服务的IP地址信息。</p>
<p>容器镜像名为 kubeguide/guestbook-php-frontend，该镜像中所包含的 PHP 的留言板源码 （guestbook.php）如下：</p>
<p>&lt;？</p>
<p>set_include_path（&#x27;.：/usr/1oca1/1ib/php&#x27;）；</p>
<p>error_reporting（E_ALL）：</p>
<p>ini_set （&#x27;display_errors&#x27;，1）；</p>
<p>require&#x27;Predis/Autoloader.php&#x27;；</p>
<p>Predis\Autoloader：：register （）；</p>
<p>if （isset （S_GET［&#x27;cmd&#x27;］）=== true）| Shost = &#x27;redis-master&#x27;；</p>
<p>if （getenv （&#x27;GET_HOSTS_FROM&#x27;）== &#x27;env&#x27;） Shost = getenv （&#x27;REDIS_MASTER_SERVICE_HOST&#x27;）；</p>
<p>header（&#x27;Content-Type: application/json&#x27;）；</p>
<p>if（S_GET［&#x27;cnd&#x27;］ == &#x27;set&#x27;）｛ Sclient = new Predis\Client （［ &#x27;scheme&#x27;=&gt;&#x27;tcp&#x27;，</p>
<p>&#x27;host&#x27;</p>
<p>=&gt; Shost，</p>
<p>&#x27;port&#x27; =&gt; 6379，</p>
<p>］）；</p>
<p>Sclient-&gt;set （$_GET ［&#x27;key&#x27;］，S_GET［&#x27;value&#x27;］）；</p>
<p>print（&#x27;｛&quot;message&quot; ： &quot;Updated&quot;｝&#x27;）；</p>
<p>else一</p>
<p>Shost = &#x27;redis-slave&#x27;：；</p>
<p>if （getenv （&#x27;GET_HOSTS FROM&#x27;）== &#x27;env&#x27;）｛</p>
<p>Shost = getenv （&#x27;REDIS_SLAVE_SERVICE.</p>
<p>LHOST&#x27;）；</p>
<p>Sclient = new Predis\Client （［ &#x27;scheme&#x27;=&gt;&#x27;tcp&#x27;，</p>
<p>&#x27;host&quot;</p>
<p>=&gt; Shost，</p>
<p>&#x27;port&#x27; =&gt; 6379，</p>
<p>］）；</p>
<p>Svalue = Sclient-&gt;get （S _GET［&#x27;key&#x27;］）；</p>
<p>• 94</p>
<h2>第 108 页</h2>
<h3>第2章</h3>
<p>Kubernetes 买践指南</p>
<p>print （&#x27;｛&quot;data&quot; ： &quot;&#x27; • Svalue•&#x27;&quot;｝&#x27;）；</p>
<p>｝ else｛</p>
<p>Phpinfo（）；</p>
<p>｝？&gt;</p>
<p>这段 PHP 代码的意思是，如果是一个 set 请求（提交留言），则会连接到 redis-master 服务 进行写数据操作，其中 redis-master 服务的虚拟IP 地址是用之前提过的从环境变量中获取的方 式得到的，端口使用默认的 6379端口号（当然，也可以使用环境变量“REDIS_MASTER_ SERVICE_PORT”的值）；如果是 get 请求，则会连接到 redis-slave 服务进行读数据操作。</p>
<p>可以看到，如果在容器配置部分不设置 env “GET_HOSTS_FROM”，则将使用 redis-master 或 redis-slave 服务名来访问这两个服务，这将使用 DNS 方式的服务发现，需要预先启动 Kubernetes 集群的 skydns 服务，详见 2.5.4节的说明。</p>
<p>运行 kubectl create 命令创建 RC：</p>
<p>$ kubectl create -f frontend-controller.yaml replicationcontrollers &quot;frontend&quot; created 查看已创建的 RC：</p>
<p>$ kubectl get rc</p>
<p>NAME</p>
<p>frontend</p>
<p>redis-master</p>
<p>redis-slave</p>
<p>DESIRED</p>
<p>3</p>
<p>1</p>
<p>2</p>
<p>3</p>
<p>1</p>
<p>CURRENT AGE</p>
<p>1h</p>
<p>1h</p>
<p>1h</p>
<p>再查看生成的 Pod：</p>
<p>s kubectl get pods NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>redis-master-b03io 1/1</p>
<p>Running</p>
<p>redis-slave-10ahl</p>
<p>1/1</p>
<p>Running</p>
<p>redis-slave-c5y10</p>
<p>1/1</p>
<p>Running</p>
<p>frontend-4011g</p>
<p>1/1</p>
<p>Running</p>
<p>Erontend-u9ag6</p>
<p>1/1</p>
<p>Running</p>
<p>frontend-yga11</p>
<p>1/1</p>
<p>Running</p>
<p>RESTARTS</p>
<p>0</p>
<p>0</p>
<p>0</p>
<p>0</p>
<p>O</p>
<p>0</p>
<p>AGE</p>
<p>1h</p>
<p>lh</p>
<p>1h</p>
<p>1h</p>
<p>1h</p>
<p>1h</p>
<p>最后创建 frontend Service，主要目的是使用 Service 的 NodePort 给 Kubernetes 集群中的 Service 映射一个外网可以访问的端口，这样一来，外部网络就可以通过 NodelP+NodePort 的方 式访问集群中的服务了。</p>
<p>服务定义文件 frontend-service.yaml 的內容如下：</p>
<p>apiVersion:v1</p>
<p>kind:Service</p>
<p>metadata：</p>
<p>name:frontend</p>
<p>•95•</p>
<h2>第 109 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） labels：</p>
<p>name: frontend</p>
<p>spec：</p>
<p>type: NodePort</p>
<p>ports：</p>
<p>- port:80</p>
<p>nodePort:30001</p>
<p>selector：</p>
<p>name:frontend</p>
<p>这里的关键点是设置 type=NodePort 并指定一个 NodePort 的值，表示使用 Node 上的物理 机端口提供对外访问的能力。需要注意的是，spec.ports.NodePort 的端口号范围可以进行限制（通 过 kube-apiserver 的启动参数--service-node-port-range 指定），默认为30000～32767，如果指定 为可用IP 范围之外的其他端口号，则Service 的创建将会失败。</p>
<p>运行 kubectl create 命令创建 Service：</p>
<p>$ kubectl create -f frontend-service.yaml Services &quot;frontend&quot; created 通过 kubectl 查看创建的 Service：</p>
<p>$ kubectl get services NAME</p>
<p>CLUSTER-IP</p>
<p>frontend</p>
<p>169.169.167.153</p>
<p>redis-master</p>
<p>169.169.208.57</p>
<p>redis-slave</p>
<p>169.169.78.102</p>
<p>EXTERNAL-IP</p>
<p>&lt;nodes&gt;</p>
<p>&lt;none〉</p>
<p>&lt;none&gt;</p>
<p>PORT（S）</p>
<p>AGE</p>
<p>80/TCP</p>
<p>25m</p>
<p>6379/TCP 25m</p>
<p>6379/TCP 25m</p>
<p>2.3.4</p>
<p>通过浏览器访问 frontend 页面 经过上面的三个步骤就搭建好了 Guestbook 留言板系统，总共包括3个应用的6个实例， 都运行在 Kubernetes 集群中。打开浏览器，在地址栏输入 http://虚拟机 IP:30001/，将看到如 图2.6所示的网页，并且看到网页上有一条留言一 - “Hello World！”。</p>
<p>C Guestbook</p>
<p>• +C 192168 1.130:30001 Guestbook</p>
<p>Messages</p>
<p>Submit</p>
<p>Hello Wortd！</p>
<p>图2.6 通过浏览器访问留言板网页</p>
<p>• 96•</p>
<h2>第 110 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>尝试输入一条新的留言“Hi Kubernetes！”，单击Submit 按钮，网页将会在原留言的下方显 示新的留言，说明这条留言已经被成功加入 Redis 数据库中了，如图2.7所示。</p>
<p>C Guestbook</p>
<p>CD192.168.1.130:30001 Guestbook</p>
<p>Messages</p>
<p>Submit</p>
<p>Hello Worlid！</p>
<p>Hi Kubemnetes！</p>
<p>图2.7 在留言板网页添加新的留言</p>
<p>通过 Guestbook 示例，可以看到 Kubernetes 强大的应用管理功能，用户仅需通过几个简 单的 YAML 配置就能完成复杂系统的搭建，并能够通过 Kubernetes 自动实现服务发现和负载 均衡。接下来，让我们深入Pod 的应用、配置、调度管理及服务的应用，开始 Kubernetes 应 用管理之旅。</p>
<p>2.4</p>
<p>深入掌握 Pod</p>
<p>本节将对 Kuberetes 如何发布和管理应用进行详细说明和示例，主要包括Pod 和容器的使 用、Pod 的控制和调度管理、应用配置管理等内容。</p>
<h3>2.4.1 Pod 定义详解</h3>
<p>yaml 格式的 Pod 定义文件的完整内容如下：</p>
<p>apiVersion: v1</p>
<p>kind: Pod</p>
<p>metadata：</p>
<p>name:string</p>
<p>namespace:string</p>
<p>labels：</p>
<p>- name:string</p>
<p>annotations：</p>
<p>- name: string</p>
<p>spec：</p>
<p>• 97•</p>
<h2>第 111 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） containers：</p>
<p>- name: string</p>
<p>image: string</p>
<p>imagePullPolicy：［Always | Never | IfNotPresent］ command： ［string］</p>
<p>args： ［string］</p>
<p>workingDir: string volumeMounts：</p>
<p>-name: string</p>
<p>mountPath:string</p>
<p>readonly: boolean</p>
<p>ports：</p>
<p>- name：</p>
<p>string</p>
<p>containerPort: int hostPort: int</p>
<p>protocol: string</p>
<p>enV：</p>
<p>- name：</p>
<p>string</p>
<p>value: string</p>
<p>resourCeS：</p>
<p>1imits：</p>
<p>cpu: string</p>
<p>memory: string</p>
<p>requests：</p>
<p>Cpu: String</p>
<p>memory: string</p>
<p>livenessProbe：</p>
<p>exec：</p>
<p>command： ［string］</p>
<p>httpGet：</p>
<p>path:string</p>
<p>port:number</p>
<p>host: string</p>
<p>scheme: string</p>
<p>httpHeaders：</p>
<p>- name: string</p>
<p>value: string</p>
<p>tcpSocket：</p>
<p>port:number</p>
<p>initialDelaySeconds：：0 timeoutSeconds: 0</p>
<p>periodSeconds:0</p>
<p>successThreshold: 0 failureThreshold: 0 • 98•</p>
<h2>第 112 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>securityContext：</p>
<p>privileged: false</p>
<p>restartPolicy：［Always | Never I OnFailure］ nodeSelector: object imagePullSecrets：</p>
<p>- name: string</p>
<p>hostNetwork: false vOlumeS：</p>
<p>-name: string</p>
<p>emptyDir： ｛｝</p>
<p>hostPath：</p>
<p>path:string</p>
<p>secret：</p>
<p>secretName:string</p>
<p>items：</p>
<p>- key:string</p>
<p>path:string</p>
<p>configMap：</p>
<p>name: string</p>
<p>items：</p>
<p>- key:string</p>
<p>path:string</p>
<p>对各属性的详细说明如表2.13所示。</p>
<p>表2.13 对Pod 定义文件模板中各属性的详细说明 属性名称</p>
<p>取值类型</p>
<p>是否必选</p>
<p>version</p>
<p>kind</p>
<p>metadata</p>
<p>metadata.name</p>
<p>metadata.namespace metadata.labels］</p>
<p>metadata.annotation|］ Spec</p>
<p>spec.containers］</p>
<p>spec.containers|｝.name spec.containersllimage String</p>
<p>Required</p>
<p>String</p>
<p>Required</p>
<p>Object</p>
<p>Required</p>
<p>String</p>
<p>Required</p>
<p>String</p>
<p>Required</p>
<p>List</p>
<p>List</p>
<p>Object</p>
<p>List</p>
<p>String</p>
<p>String</p>
<p>Required</p>
<p>Required</p>
<p>Required</p>
<p>Required</p>
<p>取值说明</p>
<p>版本号，例如vI</p>
<p>Pod</p>
<p>元数据</p>
<p>Pod 的名称，命名规范需符合 RFC 1035 规范 Pod所属的命名空间，默认为 “default” 自定义标签列表</p>
<p>自定义注解列表</p>
<p>Pod 中容器的详细定义</p>
<p>Pod 中的容器列表</p>
<p>容器的名称，需符合 RFC 1035 规范 容器的镜像名称</p>
<p>•99•</p>
<h2>第 113 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 属性名称</p>
<p>spec.containersl.imagePullPolicy 取值类型</p>
<p>String</p>
<p>是否必选</p>
<p>spec.containers|.command|］ List</p>
<p>spec.containers |］.args［］ spec.containers|.workingDir spec.containers ］volumeMounts| spec.containersl］.volumeMounts|l.name List</p>
<p>String</p>
<p>List</p>
<p>String</p>
<p>spec.containersl］.volumeMountsl］mountPath String spec.containers［｝.volumeMounts|］.readOnly spec.containers［l.ports［］ spec.containersl.portsll.name spec.containers|.ports］.containerPort spec.containersl.ports［］.hostPort Boolean</p>
<p>List</p>
<p>String</p>
<p>Int</p>
<p>Int</p>
<p>spec.containers［］.ports［］.protocol spec.containersl.env］ spec.containers|.envl］.name spec.containers|］.envl］-value spec.containers l.resources spec.containers ［.resources limits spec.containers|］.resources.limits.cpu spec.containers［］.resources.limits.memory spec.containers［］.resources.requests String</p>
<p>List</p>
<p>String</p>
<p>String</p>
<p>Object</p>
<p>Object</p>
<p>String</p>
<p>String</p>
<p>Object</p>
<p>续表</p>
<p>取值说明</p>
<p>获取镜像的策略，可选值包括：Always、Never、 INotPresent，默认值为 Always。</p>
<p>Always：表示每次都尝试重新下载镜像。</p>
<p>IfNotPresent：表示如果本地有该镜像，则使用本 地的镜像，本地不存在时下载镜像。</p>
<p>Never： 表示仅使用本地镜像</p>
<p>容器的启动命令列表，如果不指定，则使用镜像 打包时使用的启动命令</p>
<p>容器的启动命令参数列表</p>
<p>容器的工作目录</p>
<p>挂载到容器内部的存储卷配置</p>
<p>引用 Pod 定义的共享存储卷的名称，需使用 volumes［］部分定义的共享存储卷名称 存储卷在容器内 Mount 的绝对路径，应少于512 个字符</p>
<p>是否为只读模式，默认为读写模式</p>
<p>容器需要暴露的端口号列表</p>
<p>端口的名称</p>
<p>容器需要监听的端口号</p>
<p>容器所在主机需要监听的端口号，默认与 containerPort 相同。设置 hostPort 时，同一台宿主 机将无法启动该容器的第2份副本</p>
<p>端口协议，支持TCP和 UDP，默认为 TCP 容器运行前需设置的环境变量列表</p>
<p>环境变量的名称</p>
<p>环境变量的值</p>
<p>资源限制和资源请求的设置，详见第5章的说明 资源限制的设置</p>
<p>CPU 限制，单位为 core 数，将用于 docker run --cpu-shares 参数</p>
<p>内存限制，单位可以为 MiB/GiB 等，将用于 docker run --memory 参数</p>
<p>资源限制的设置</p>
<p>• 100•</p>
<h2>第 114 页</h2>
<p>属性名称</p>
<p>spec.containers［l.resources.requests.cpu 取值类型</p>
<p>String</p>
<p>spec.containers［］.resources.requests.memory String</p>
<p>spec.volumesl］</p>
<p>spec.volumes［］.name List</p>
<p>String</p>
<p>是否必选</p>
<p>spec.volumesl.emptyDir spec.volumesll.hostPath spec.volumes［］.hostPath.path spec.volumes［］ secret spec.volumesll.configMap spec.volumes［］.livenessProbe Object</p>
<p>Object</p>
<p>String</p>
<p>Object</p>
<p>Object</p>
<p>Object</p>
<p>spec.volumesll livenessProbe.exec spec.volumes D livenessProbe.exec.commandl spec. volumes［l.livenessProbe.httpGet Object</p>
<p>String</p>
<p>Object</p>
<p>• 101•</p>
<h3>第2章 Kubernetes 实践指南</h3>
<p>续表</p>
<p>取值说明</p>
<p>CPU 请求，单位为 core 数，容器启动的初始可用 数量</p>
<p>内存请求，单位可以为 MiB、GiB 等，容器启动 的初始可用数量</p>
<p>在该Pod 上定义的共享存储卷列表</p>
<p>共享存储卷的名称，在一个 Pod 中每个存储卷定 义一个名称，应符合RFC 1035 规范。容器定义部 分的 containers|.volumeMounts|.name 将引用该 共享存储卷的名称。</p>
<p>volume 的类型包括：emptyDir、hostPath、 gcePersistentDisk、awsElasticBlockStore、gitRepo、 secret、nfs、iscsi、glusterfs、persistentVolumeClaim.</p>
<p>rbd、flexVolume、cinder、cephfs、flocker、 downwardAPI、fc、 azureFile、 configMap、 vsphere Volume，可以定义多个 volume，每个 volume 的name 保持唯一。本节讲解 emptyDir、 hostPath、secret、configMap 这4种 volume，其他 类型 volume 的设置方式详见第1章的说明 类型为 cmptyDir 的存储卷，表示与Pod 同生命周期 的一个临时目录，其值为一个空对象：emptyDir:0｝ 类型为 hostPath 的存储卷，表示挂载 Pod 所在宿 主机的目录，通过 volumesl］.hostPath.path 指定 Pod 所在主机的目录，将被用于容器中 mount 的 目录</p>
<p>类型为 secret 的存储卷，表示挂载集群预定义的 secret 对象到容器内部</p>
<p>类型为 configMap 的存储卷，表示挂载集群预定 义的 configMap 对象到容器内部 对 Pod 内各容器健康检查的设置，当探测无响应 几次之后，系统将自动重启该容器。可以设置的 方法包括：exec、httpGet 和 tcpSocket。对一个容 器仅需设置一种健康检查方法</p>
<p>对Pod 内各容器健康检查的设置，exec 方式 exec 方式需要指定的命令或者脚本 对Pod 内各容器健康检查的设置，HTTPGet 方式。</p>
<p>需指定 path、port</p>
<h2>第 115 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 属性名称</p>
<p>取值类型</p>
<p>spec.volumesl］.livenessProbe.tcpSocket Object</p>
<p>spec.volumes livenes Probe.initallelay Seconds Number</p>
<p>spec.volumesl］ livenessProbe.timeoutSeconds Number</p>
<p>是否必选</p>
<p>spec.volumes［］.livenessProbe.periodSeconds Number</p>
<p>spec.restartPolicy String</p>
<p>spec.nodeSelector</p>
<p>spec.imagePullSecrets spec.hostNetwork</p>
<p>Object</p>
<p>Object</p>
<p>Boolean</p>
<p>续表</p>
<p>取值说明</p>
<p>对Pod 内各容器健康检查的设置，tcpSocket 方式 容器启动完成后进行首次探测的时间，单位为秒 对容器健康检查的探测等待响应的超时时间设 置，单位为秒，默认为1 秒。超过该超时时间设 置，将认为该容器不健康，将重启该容器 对容器健康检查的定期探测时间设置，单位为秒， 默认为10 秒探测一次</p>
<p>Pod 的重启策略，可选值为 Always、OnFailure， 默认值为 Always。</p>
<p>Always:Pod 一旦终止运行，则无论容器是如何终 止的，kubelet 都将重启它。</p>
<p>OnFailure：只有Pod 以非零退出码终止时，kubelet 才会重启该容器。如果容器正常结束（退出码为 02，则kubelet 将不会重启它。</p>
<p>Never:Pod 终止后，kubelet 将退出码报告给 Master，不会再重启该Pod</p>
<p>设置 NodeSelector 表示将该 Pod 调度到包含这些 label 的 Node 上，以 key:value 格式指定 Pull 镜像时使用的 secret 名称，以 name:secretkey 格式指定</p>
<p>是否使用主机网络模式，默认为 false。如果设置 为 true，则表示容器使用宿主机网络，不再使用 Docker 网桥，该Pod 将无法在同一台宿主机上启 动第2个副本</p>
<h3>2.4.2 Pod 的基本用法</h3>
<p>在对Pod的用法进行说明之前，有必要先对 Docker 容器中应用的运行要求进行说明。</p>
<p>在使用 Docker 时，可以使用 docker run 命令创建并启动一个容器。而在 Kubernetes 系统中 对长时间运行容器的要求是：其主程序需要一直在前台执行。如果我们创建的 Docker 镜像的启 动命令是后台执行程序，例如 Linux脚本：</p>
<p>nohup./start.sh &amp;</p>
<p>则在kubelet 创建包含这个容器的Pod之后运行完该命令，即认为Pod 执行结束，将立刻销毁该 Pod。如果为该Pod 定义了 ReplicationController，则系统将会监控到该Pod 已经终止，之后根 • 102•</p>
<h2>第 116 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>据RC定义中 Pod 的replicas 副本数量生成一个新的Pod。而一旦创建出新的Pod，就将在执行 完启动命令后，陷入无限循环的过程中。这就是 Kubernetes 需要我们自己创建的 Docker 镜像以 一个前台命令作为启动命令的原因。</p>
<p>对于无法改造为前台执行的应用，也可以使用开源工具 Supervisor 辅助进行前台运行的功 能。Supervisor 提供了一种可以同时启动多个后台应用，并保持 Supervisor 自身在前台执行的机 制，可以满足 Kubernetes 对容器的启动要求。关于 Supervisor 的安装和使用，请参考官网 http://supervisord.org 的文档说明。</p>
<p>接下来对 Pod 对容器的封装和应用进行说明，Pod的基本用法为：Pod 可以由1个或多个 容器组合而成。</p>
<p>在上一节 Guestbook 的例子中，名为 frontend 的Pod 只由一个容器组成：</p>
<p>apiVersion:v1</p>
<p>kind: Pod</p>
<p>metadata：</p>
<p>name: frontend</p>
<p>labels：</p>
<p>name: frontend</p>
<p>spec：</p>
<p>containers：</p>
<p>- name: frontend</p>
<p>image: kubeguide/guestbook-php-frontend env：</p>
<p>- name:GET_HOSTS_FROM 最新网络工程师资料</p>
<p>www.wlgcs.cn</p>
<p>value: env</p>
<p>ports：</p>
<p>- containerPort: 80 这个 frontend Pod 在成功启动之后，将启动1个 Docker 容器。</p>
<p>另一种场景是，当 frontend 和 redis两个容器应用为紧耦合的关系，应该组合成一个整体对 外提供服务时，则应将这两个容器打包为一个 Pod，如图2.8所示。</p>
<p>Pod</p>
<p>容器</p>
<p>frontend</p>
<p>：80</p>
<p>图2.8</p>
<p>pedle-master</p>
<p>localhost:6379</p>
<p>localhost</p>
<p>包含两个容器的 Pod</p>
<p>• 103•</p>
<h2>第 117 页</h2>
<p>Kubernetes 权威指南：从 Docker到 Kubernetes 实践全接触（第2版） 配置文件 frontend-localredis-pod.yaml 如下：</p>
<p>apiVersion: v1</p>
<p>kind: Pod</p>
<p>metadata：</p>
<p>name: redis-php</p>
<p>labels：</p>
<p>•</p>
<p>name:redis-php</p>
<p>spec：</p>
<p>containers：</p>
<p>- name: frontend</p>
<p>image:kubeguide/guestbook-php-fzontend:localredis ports：</p>
<p>- containerPort: 80 - name: redis</p>
<p>image:kubeguide/redis-master portS：</p>
<p>- containerPort: 6379 属于一个 Pod 的多个容器应用之间相互访问时仅需要通过localhost 就可以通信，使得这一 组容器被“绑定”在了一个环境中。</p>
<p>在 Docker 容器 kubeguide/guestbook-php-frontend:localredis 的PHP 网页中，直接通过 URL 地址“localhost:6379”对同属于一个 Pod 内的 redis-master 进行访问。guestbook.php 的内容如下：</p>
<p>&lt;？</p>
<p>set_include_path（&#x27;.：/usr/1oca1/1ib/php&#x27;）；</p>
<p>_reporting（E</p>
<p>_set （&#x27;display_errors&#x27;，1）；</p>
<p>require&#x27;Predis/Autoloader.php&#x27;；</p>
<p>Predis\Autoloader：：register （） ；</p>
<p>if （isset （S</p>
<p>._GET［&#x27;cmd&#x27;］）=== true）｛ Shost = &#x27;1ocalhost&#x27;；</p>
<p>if （getenv （&#x27;REDIS_HOST&#x27;） &amp;&amp; strlen（getenv（&#x27;REDIS_HOST&#x27;））&gt;0） Shost = getenv （&#x27;REDIS_HOST&#x27;）；</p>
<p>header（&#x27;Content-Type: application/json&#x27;）；</p>
<p>if （$ GET［&#x27;cmd&#x27;］ == &#x27;set&#x27;）｛ Sclient = new Predis\Client （［ &#x27;scheme&#x27;=&gt;&#x27;tcp&quot;，</p>
<p>&#x27;host&#x27; =&gt; Shost，</p>
<p>&#x27;port&#x27; =&gt; 6379，</p>
<p>sclient-&gt;set （$_GET［&#x27;key&#x27;］，S_GET［&#x27;value&#x27;］）；</p>
<p>print（&#x27;｛&quot;message&quot;： &quot;Updated&quot;｝&#x27;）：</p>
<p>｝ else｛</p>
<p>• 104</p>
<h2>第 118 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>$host = &#x27;localhost&#x27;；</p>
<p>if （getenv （&#x27;REDIS_HOST&#x27;） &amp;&amp; strlen （getenv（&#x27;REDIS_HOST&#x27;））&gt;0）｛ Shost = getenv （&#x27;REDIS_HOST&#x27;）；</p>
<p>Sclient = new Predis \Client （［ &#x27;scheme&#x27;=&gt;&#x27;tcp&#x27;，</p>
<p>&#x27;host&#x27;</p>
<p>=&gt; shost，</p>
<p>&#x27;port&#x27;</p>
<p>=&gt; 6379，</p>
<p>］）；</p>
<p>Svalue = Sclient-&gt;get （$_GET ［&#x27;key&#x27;］）；</p>
<p>print（&#x27;｛&quot;data&quot;：</p>
<p>• Svalue</p>
<p>&#x27;&quot;｝&#x27;）；</p>
<p>｝else｛</p>
<p>phpinfo（）：</p>
<p>｝？&gt;</p>
<p>运行 kubectl create 命令创建该Pod：</p>
<p>$ kubectl create -f frontend-localredis-pod.yaml pod &quot;redis-php&quot; created 查看已创建的 Pod：</p>
<p># kubectl get pods NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS AGE</p>
<p>redis-php</p>
<p>2/2</p>
<p>Running</p>
<p>0</p>
<p>10m</p>
<p>可以看到 READY 信息为2/2，表示Pod 中的两个容器都成功运行了。</p>
<p>查看这个 Pod 的详细信息，可以看到两个容器的定义及创建的过程（Event 事件信息）：</p>
<p># kubectl describe pod redis-php redis-php</p>
<p>Namespace：</p>
<p>default</p>
<p>k8s/192.168.18.3</p>
<p>Start Time：</p>
<p>Thu,28 Jul 2016 12:28:21 +0800 name=redis-php</p>
<p>172.17.1.4</p>
<p>Controllers：</p>
<p>Containers：</p>
<p>frontend：</p>
<p>Container ID：</p>
<p>docker://ccc8616f8df1fb19abbd0ab189a36e6f6628b78ba7b97b1077d86e7fc224ee08 kubeguide/guestbook-php-frontend:localredis Image ID：</p>
<p>docker://sha256:d014f67384a11186e135b95a7ed0d794674f7ce258f0dce47267c3052a0d0fa9 Port：</p>
<p>80/TCP</p>
<p>State：</p>
<p>Running</p>
<p>• 105•</p>
<h2>第 119 页</h2>
<p>Kubernetes 权威指南：从 Docker到 Kubernetes 实践全接触（第2版） Started：</p>
<p>Ready：</p>
<p>Thu,28 Jul 2016 12:28:22 +0800 True</p>
<p>Restart count：</p>
<p>Environment Variables：</p>
<p>&lt;none〉</p>
<p>redis：</p>
<p>Container ID：</p>
<p>docker://c0b19362097cda6dd5b8ed7d8eaaaf43aeeb969ee023ef255604bde089808075 Image：</p>
<p>kubeguide/redis-master Image ID：</p>
<p>docker://sha256:405a0b586f7ebeb545ec65be0e914311159d1baedccd3a93e9d3e3b249ec5cbd Port：</p>
<p>6379/TCP</p>
<p>State：</p>
<p>Running</p>
<p>Started：</p>
<p>Thu,28 Ju1 2016 12:28:23 +0800 Ready：</p>
<p>True</p>
<p>Restart Count：</p>
<p>Environment Variables：</p>
<p>&lt;none&gt;</p>
<p>Conditions：</p>
<p>Type</p>
<p>Status</p>
<p>Initialized</p>
<p>True</p>
<p>Ready</p>
<p>True</p>
<p>PodScheduled True</p>
<p>Volumes：</p>
<p>default-token-97j21：</p>
<p>TYPe：</p>
<p>Secret （a volume populated by a Secret） SecretName:default-token-97j21 Qos Tier：</p>
<p>BestEffort</p>
<p>Events：</p>
<p>FirstSeen</p>
<p>LastSeen</p>
<p>Count From</p>
<p>一一</p>
<p>SubobjectPath Type Reason</p>
<p>Message</p>
<p>18m</p>
<p>18m</p>
<p>1</p>
<p>｛default-scheduler ｝ Normal</p>
<p>Scheduled</p>
<p>Successfully assigned redis-php to k8s-node-1 18m</p>
<p>18m</p>
<p>1</p>
<p>｛kubelet k8s-node-1｝ spec.containers｛frontend｝ Normal</p>
<p>Pulled</p>
<p>container image</p>
<p>&quot;kubeguide/guestbook-php-frontend:localredis&quot; already present on machine 18m</p>
<p>18m</p>
<p>1</p>
<p>｛kubelet k8s-node-1｝ spec.containers ｛frontend｝ Normal</p>
<p>created</p>
<p>Created container</p>
<p>with</p>
<p>docker id ccc8616f8df1 18m</p>
<p>18m</p>
<p>spec.containers ｛frontend｝ 1</p>
<p>Normal</p>
<p>｛kubelet k8s-node-1｝ Started</p>
<p>Started container</p>
<p>with docker id ccc8616f8dfl 18m</p>
<p>18m</p>
<p>1</p>
<p>｛kubelet k8s-node-1｝ spec.containers｛redis｝ Normal</p>
<p>Pulled</p>
<p>Container image</p>
<p>&quot;kubeguide/redis-master&quot; already present on machine 18m</p>
<p>18m</p>
<p>1</p>
<p>｛kubelet k8s-node-1｝ spec.containers｛redis｝ Normal</p>
<p>created</p>
<p>Created container</p>
<p>with</p>
<p>docker id cob19362097c 18m</p>
<p>18m</p>
<p>1</p>
<p>｛kubelet k8s-node-1｝ • 106•</p>
<h2>第 120 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>spec.containers｛redis｝ with docker id c0b19362097c Normal</p>
<p>Started</p>
<p>Started container</p>
<p>2.4.3</p>
<p>静态 Pod</p>
<p>静态 Pod 是由kubelet 进行管理的仅存在于特定 Node 上的Pod。它们不能通过 API Server 进行管理，无法与 ReplicationController、Deployment 或者 DaemonSet 进行关联，并且 kubelet 也无法对它们进行健康检查。静态Pod 总是由kubelet 进行创建，并且总是在 kubelet 所在的Node 上运行。</p>
<p>创建静态Pod 有两种方式：配置文件或者HTTP 方式。</p>
<p>1）配置文件方式</p>
<p>首先，需要设置kubelet 的启动参数“_-config”，指定 kubelet 需要监控的配置文件所在的目 录，kubelet 会定期扫描该目录，并根据该目录中的.yaml 或json 文件进行创建操作。</p>
<p>假设配置目录/etc/kubelet.d/，配置启动参数：--config=/etc/kubelet.d/，然后重启 kubelet 服务。</p>
<p>在目录/etc/kubelet.d 中放入 static-web.yaml 文件，内容如下：</p>
<p>apiVersion: v1</p>
<p>kind: Pod</p>
<p>metadata：</p>
<p>name: static-web</p>
<p>labels：</p>
<p>name:static-web</p>
<p>spec：</p>
<p>containers：</p>
<p>- name:static-web</p>
<p>image:nginx</p>
<p>ports：</p>
<p>- name: web</p>
<p>containerPort: 80</p>
<p>等待一会儿，查看本机中己经启动的容器：</p>
<p># docker ps</p>
<p>CONTAINER ID</p>
<p>COMMAND CREATED STATUS 2292ea231ab1</p>
<p>&quot;nginx -g &#x27;daemon off&quot; 1 minute ago k8s_static-web.68ee0075_static-web-k8s-node-1_default_78c7efddebf191c949cbb7aa22 a927c8_401b96d0</p>
<p>可以看到一个 Nginx 容器已经被kubelet 成功创建了出来。</p>
<p>到 Master 节点查看Pod 列表，可以看到这个 static pod：</p>
<p>• 107•</p>
<h2>第 121 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） # kubectl get pods NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>static-web-nodel 1/1 Running</p>
<p>RESTARTS AGE</p>
<p>5m</p>
<p>0</p>
<p>由于静态 Pod 无法通过 API Server 直接管理，所以在 Master 节点尝试删除这个 Pod，将会 使其变成Pending 状态，且不会被删除。</p>
<p># kubectl delete pod static-web-nodel pod &quot;static-web-nodel&quot;deleted # kubectl get pods NAME</p>
<p>static-web-node1</p>
<p>READY</p>
<p>0/1</p>
<p>STATUS</p>
<p>Pending</p>
<p>RESTARTS AGE</p>
<p>0</p>
<p>1s</p>
<p>删除该 Pod 的操作只能是到其所在 Node 上，将其定义文件 static-web.yaml 从/etc/kubelet.d 目录下删除。</p>
<p># rm /etc/kubelet.d/static-web.yaml # docker Ps</p>
<p>11 无容器正在运行。</p>
<h3>2.4.4 Pod 容器共享 Volume</h3>
<p>在同一个 Pod 中的多个容器能够共享 Pod 级别的存储卷 Volume。Volume 可以定义为各种 类型，多个容器各自进行挂载操作，将一个 Volume 挂载为容器内部需要的目录，如图2.9所示。</p>
<p>Pod</p>
<p>容器</p>
<p>tomcat</p>
<p>容器</p>
<p>busubor</p>
<p>volume</p>
<p>图2.9 Pod 中多个容器共享 volume 在下面的例子中，Pod 内包含两个容器：</p>
<p>tomcat 和 busybox，在 Pod 级别设置 Volume “app-logs”，用于 tomcat 向其中写日志文件，busybox 读日志文件。</p>
<p>配置文件 pod-volume-applogs.yaml 的内容如下：</p>
<p>apiVersion: v1</p>
<p>•kind： Pod</p>
<p>metadata：</p>
<p>• 108•</p>
<h2>第 122 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>name: volume-pod</p>
<p>spec：</p>
<p>containers：</p>
<p>-name: tomcat</p>
<p>image: tomcat</p>
<p>ports：</p>
<p>- containerPort: 8080 volumeMounts：</p>
<p>- name: app-logs</p>
<p>mountPath: /usr/loca1/tomcat/logs -name:busybox</p>
<p>image: busybox</p>
<p>command： ［&quot;sh&quot;，</p>
<p>&quot;-C&quot;，</p>
<p>&quot;tail -f /logs/catalina*.log&quot;］ volumeMounts：</p>
<p>- name:app-logs</p>
<p>mountPath:/1ogs</p>
<p>volumes：</p>
<p>- name: app-1ogs</p>
<p>emptyDir：｛｝</p>
<p>这里设置的Volume 名为 app-logs，类型为 emptyDir（也可以设置其他类型，详见第1章 对 Volume 概念的说明），挂载到tomcat 容器内的/ust/local/tomcat/logs 目录，同时挂载到logreader 容器内的/logs 目录。tomcat 容器在启动后会向/usr/local/tomcat/logs 目录中写文件，logreader 容 器就可以读取其中的文件了。</p>
<p>logreader 容器的启动命令为 tail -f /logs/catalina*log，我们可以通过kubectl logs 命令查看 logreader 容器的输出内容：</p>
<p># kubectl logs volume-pod -c busybox 29-Ju1-2016 12:55:59.626 INFO ［localhost-startStop-1］ org.apache.catalina.startup.HostConfig.deployDirectory Deploying web application directory /usr/1ocal/tomcat/webapps/manager 29-Ju1-2016 12:55:59.722 INFO ［localhost-startStop-1］ org.apache.catalina.startup.HostConfig.deployDirectory Deployment of web application directory /usr/local/tomcat/webapps/manager has finished in 96 ms 29-Ju1-2016 12:55:59.740 INFO［main］ org.apache.coyote.AbstractProtocol.start Starting ProtocolHandler ［&quot;http-apr-8080&quot;］ 29-Ju1-2016 12:55:59.794 INFO［main］ org.apache.coyote.AbstractProtocol.start Starting ProtocolHandler ［&quot;ajp-apr-8009&quot;］ 29-Ju1-201612:56:00.604 INFO ［main］ org.apache.catalina.startup.Catalina.start Server startup in 4052 ms 这个文件即为 tomcat 生成的日志文件/ust/local/tomcat/logs/catalina.&lt;date&gt;.log 的内容。登录 tomcat 容器进行查看：</p>
<p># kubect1 exec -ti volume-pod -c tomcat -- 1s /usr/loca1/tomcat/logs • 109•</p>
<h2>第 123 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） catalina.2016-07-29.10g localhost_access_1og.2016-07-29.txt host-manager.2016-07-29.log manager.2016-07-29.1og # kubectl exec -ti volume-pod -c tomcat -- tail /usr/loca1/tomcat/1ogs/catalina.2016-07-29.10g 29-J01-2016 12:55:59.722 INFO ［1ocalhost-staztstop-工］ org.apache.catalina.startup.HostConfig.deployDirectory Deployment of web application directory /usr/1ocal/tomcat/webapps/manager has finished in 96 ms 29-Ju1-2016 12:55:59.740 INFO［main］ org.apache.coyote.AbstractProtocol.start Starting ProtocolHandler ［&quot;http-apr-8080&quot;］ 29-Ju1-2016 12:55:59.794 INFO［main］ org.apache.coyote.AbstractProtocol.start Starting ProtocolHandler ［&quot;ajp-apr-8009&quot;］ 29-Ju1-2016 12:56:00.604 INFO ［mainl org.apache.catalina.startup.Catalina.start Server startup in 4052 ms 2.4.5</p>
<p>Pod 的配置管理</p>
<p>应用部署的一个最佳实践是将应用所需的配置信息与程序进行分离，这样可以使得应用程 序被更好地复用，通过不同的配置也能实现更灵活的功能。将应用打包为容器镜像后，可以通 过环境变量或者外挂文件的方式在创建容器时进行配置注入，但在大规模容器集群的环境中， 对多个容器进行不同的配置将变得非常复杂。Kuberetes v1.2版本提供了一种统一的集群配置 管理方案</p>
<p>-ConfigMap。本节对 ConfigMap 的概念和用法进行详细描述。</p>
<p>1. ConfigMap：容器应用的配置管理 ConfigMap 供容器使用的典型用法如下。</p>
<p>（1） 生成为容器内的环境变量。</p>
<p>（2）设置容器启动命令的启动参数（需设置环境变量）。</p>
<p>（3）以 Volume 的形式挂载为容器内部的文件或目录。</p>
<p>ConfigMap 以一个或多个 key:value 的形式保存在 Kubernetes 系统中供应用使用，既可以用 于表示一个变量的值（例如 apploglevel=info），也可以用于表示一个完整配置文件的内容（例如 server.xml=&lt;？xml..&gt;..） 可以通过 yaml 配置文件或者直接使用 kubectl create configmap 命令行的方式来创建 ConfigMap。</p>
<p>• 110•</p>
<h2>第 124 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>2. ConfigMap 的创建：yaml文件方式 下面的例子 cm-appvars.yaml 描述了将几个应用所需的变量定义为 ConfigMap 的用法：</p>
<p>cm-appvars.yaml</p>
<p>apiVersion: vl</p>
<p>kind:ConfigMap</p>
<p>metadata：</p>
<p>name:cm-appvars</p>
<p>data：</p>
<p>apploglevel:info</p>
<p>appdatadir:/var/data 执行 kubectl create 命令创建该 ConfigMap：</p>
<p>$kubectl create -f cm-appvars.yaml confiqmap &quot;cn-appvars&quot;created 查看创建好的 ConfigMap：</p>
<p># kubectl get configmap NAME</p>
<p>DATA</p>
<p>AGE</p>
<p>cm-appvars</p>
<p>2</p>
<p>3s</p>
<p># kubect1 describe configmap cm-appvars Name：</p>
<p>Namespace：</p>
<p>Labels：</p>
<p>Annotations：</p>
<p>cm-appvars</p>
<p>default</p>
<p>&lt;none&gt;</p>
<p>&lt;none&gt;</p>
<p>Data</p>
<p>appdatadir：</p>
<p>apploglevel：</p>
<p>9 bytes</p>
<p>4 bytes</p>
<p># kubectl get configmap cm-appvars -o yaml apiVersion: v1</p>
<p>appdatadir: /var/data kind: ConfigMap</p>
<p>metadata：</p>
<p>creationTimestamp: 2016-07-28T19:57:162 name: cm-appvars</p>
<p>namespace: default resourceVersion：&quot;78709&quot; selfLink: /api/v1/namespaces/default/configmaps/cm-appvars uid: 7bb2e9c0-54fd-11e6-9dcd-000c29dc2102 • 111•</p>
<h2>第 125 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 下面的例子 cm-appconfigfiles.yaml 描述了将两个配置文件 server.xml 和 logging.properties 定义为 ConfigMap 的用法，设置key 为配置文件的别名，value 则是配置文件的全部文本内容：</p>
<p>cm-appconfigfiles.yaml apiVersion:v1</p>
<p>kind:ConfigMap</p>
<p>metadata：</p>
<p>name:cm-appconfigfiles data：</p>
<p>key-serverxml:1</p>
<p>&lt;？xml version=&#x27;1.0&#x27;encoding=&#x27;utf-81？&gt; &lt;Server port=&quot;8005&quot; shutdown=&quot;SHUTDOWN&quot;&gt; &lt;Listener className=&quot;org.apache.catalina.startup.VersionLoggerListener&quot; /&gt; &lt;Listener className=&quot;org.apache.catalina.core.AprLifecycleListener&quot; SSLEngine=&quot;on&quot; /&gt;</p>
<p>&lt;Listener className= &quot;org.apache.catalina.core.JreMemoryLeakPreventionListener&quot; /&gt; &lt;Listener className= &quot;org.apache.catalina.mbeans.GlobalResourcesLifecycleListener&quot; /&gt; &lt;Listener className= &quot;org.apache.catalina.core.ThreadLocalLeakPreventionListener&quot; /&gt; &lt;GlobalNamingResources&gt; &lt;Resource name=&quot;UserDatabase&quot; auth=&quot;Container&quot; type=&quot;org.apache.catalina.UserDatabase&quot; description=&quot;User database that can be updated and saved&quot; factory=&quot;org.apache.catalina.users.MemoryUserDatabaseFactory&quot; pathname=&quot;conf/tomcat-users.xml&quot; /&gt; &lt;/GlobalNamingResources&gt; &lt;Service name=&quot;Catalina&quot;&gt; &lt;Connector port=&quot;8080&quot;protocol=&quot;HTTP/1.1&quot; connectionTimeout=&quot;20000&quot; redirectPort=&quot;8443&quot;/&gt; &lt;Connector port=&quot;8009&quot;protocol=&quot;AJP/1.3&quot;redirectPort=&quot;8443&quot; /&gt; &lt;Engine name=&quot;Catalina&quot; defaultHost=&quot;localhost&quot;&gt; &lt;Realm</p>
<p>className=&quot;org.apache.catalina.realm.LockOutRealm&quot;&gt; &lt;Realm className=&quot;&#x27;org.apache.catalina.realm.UserDatabaseRealm&quot; resourceName=&quot;UserDatabase&quot;/&gt; &lt;/Realm&gt;</p>
<p>&lt;Host name=&quot;localhost&quot; appBase=&quot;webapps&quot; unpackWARs=&quot;true&quot; autoDeploy=&quot;true&quot;&gt; &lt;Valve className=&quot;org.apache.catalina.valves.AccessLogValve&quot; directory=&quot;logs&quot;</p>
<p>prefix=&quot;localhost</p>
<p>_access_log&quot; suffix=&quot;.txt&quot; pattern=&quot;%h 8l eu et &amp;quot;ar&amp;quot; 8s sb&quot; /&gt; &lt;/Host&gt;</p>
<p>• 112</p>
<h2>第 126 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>&lt;/Engine&gt;</p>
<p>&lt;/Service&gt;</p>
<p>&lt;/Server&gt;</p>
<p>key-loggingproperties： &quot;handlers =1catalina.org.apache.juli.FileHandler, 21ocalhost.org.apache.juli.</p>
<p>FileHandler，</p>
<p>3manager.org.apache.juli.FileHandler,4host-manager.org.apache.juli.</p>
<p>FileHandler，</p>
<p>java.util.logging.ConsoleHandler\r\nlr\n.handlers= 1catalina.org.apache.</p>
<p>juli.FileHandler，</p>
<p>java.util.logging.ConsoleHandler\r\nlr\nlcatalina.org.apache.juli.FileHandler.level FINE\r\nlcatalina.org.apache.juli.FileHandler.directory = stcatalina.base｝/1ogs\r\n1catalina.org.apache.juli.FileHandler.prefix = catalina.\r\nlr\n2localhost.org.apache.juli.FileHandler.level = FINE\r\n2localhost.org.apache.juli.FileHandler.directory = S｛catalina.base｝/logs\rln2localhost.org.apache.juli.FileHandler.prefix = localhost.\rlnlr\n3manager.org.apache.juli.FileHandler.level = FINE\r\n3manager.org.apache.juli.FileHandler.directory = $｛catalina.base｝/logs\r\n3manager.org.apache.juli.FileHandler.prefix = manager. \rln\rln4host-manager.org.apache.juli.FileHandler.level = FINE\r\n4host-manager.org.apache.juli.FileHandler.directory = $｛catalina.base｝/logs\r\n4host-manager.org.apache.juli.FileHandler.</p>
<p>prefix =</p>
<p>host-manager.\r\n\r\njava.util.logging.ConsoleHandler.level = FINE\r\ njava.util.logging.ConsoleHandler.formatter = java.util.logging.SimpleFormatter\r\n\r\nlr\norg.apache.catalina.core.</p>
<p>ContainerBase.［Catalina］.［localhost］.level = INFOlr \norg.apache.catalina.core.ContainerBase.［Catalina］. ［localhost］.</p>
<p>handlers</p>
<p>= 2localhost.org.apache.juli.FileHandler\r\nlrlnorg.apache.catalina.core.</p>
<p>ContainerBase.［Catalina］.［localhost］.［/manager］.level = INFOlr\norg.apache.catalina.core.ContainerBase.［Catalina］.［localhost〕.</p>
<p>［/manager］.handlers = 3manager.org.apache.juli.FileHandler\r\n\r\norg.apache.catalina.core.</p>
<p>ContainerBase.［Catalina］. ［localhost］. ［/host-manager］.level = INFO\r\norg.apache.catalina.core.ContainerBase.［Catalina］. ［localhost］.</p>
<p>［/host-manager］.handlers = 4host-manager.org.apache.juli.FileHandler\r\n\r\n&quot; 执行 kubectl create 命令创建该 ConfigMap：</p>
<p>$kubectl create -f cm-appconfigfiles.yaml configmap &quot;cm-appconfigfiles&quot;created 查看创建好的 ConfigMap：</p>
<p># kubectl get configmap cm-appconfigfiles NAME</p>
<p>AGE</p>
<p>• 113•</p>
<h2>第 127 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） cm-appconfigfiles 2 14s</p>
<p># kubectl describe configmap cm-appconfigfiles Name：</p>
<p>cm-appconfigfiles</p>
<p>Namespace：</p>
<p>default</p>
<p>Labels：</p>
<p>&lt;none&gt;</p>
<p>Annotations：</p>
<p>&lt;none〉</p>
<p>Data</p>
<p>91=</p>
<p>key-loggingproperties: 1809 bytes key-serverxml：</p>
<p>1686 bytes</p>
<p>查看已创建的 ConfigMap 的详细内容，可以看到两个配置文件的全文：</p>
<p># kubectl get configmap cm-appconfigfiles -o yaml apiVersion: v1</p>
<p>data：</p>
<p>key-loggingproperties：</p>
<p>&quot;handlers = 1catalina.org.apache.juli.FileHandler， 2localhost.org.apache.juli.FileHandler， 3manager.org.apache.juli.FileHandler, 4host-manager.org.apache.juli.</p>
<p>FileHandler，</p>
<p>java.util.logging.ConsoleHandler\r\n\r\n.handlers = lcatalina.org.apache.</p>
<p>juli.FileHandler，</p>
<p>java.util.logging.ConsoleHandler\r\n\r\nlcatalina.org.apache.juli.</p>
<p>FileHandler.level</p>
<p>= FINE\r\nlcatalina.org.apache.juli.FileHandler.directory = $｛catalina.base｝/logs\r\nlcatalina.org.apache.juli.FileHandler.prefix catalina.\r\nlr\n2localhost.org.apache.juli.FileHandler.level = FINE\r\n2localhost.org.apache.juli.FileHandler.directory =$｛catalina.base｝/logs\rln2localhost.org.apache.juli.FileHandler.prefix = localhost.\r\nlr\n3manager.org.apache.juli.FileHandler.level = FINE\r\n3manager.org.apache.juli.FileHandler.directory = $｛catalina.base｝/logs\r\n3manager.org.apache.juli.FileHandler.prefix = manager.\rln\r\n4host-manager.org.apache.juli.FileHandler.level = FINE\r\n4host-manager.org.apache.juli.FileHandler.directory = $｛catalina.base｝/logs\r\n4host-manager.org.apache.juli.FileHandler.</p>
<p>prefix =</p>
<p>host-manager. \rlnlrlnjava.util.logging.ConsoleHandler.level = FINE\rlnjava.</p>
<p>util.logging.ConsoleHandler.formatter = java.util.logging.simpleFormatter\r\n\r\nlrlnorg.apache.catalina.core.</p>
<p>ContainerBase.［Catalinal.［localhost］.level = INFOlr\norg.apache.catalina.core.ContainerBase.［Catalina］. ［localhost］.</p>
<p>handlers</p>
<p>= 2localhost.org.apache.juli.FileHandlerlr\nlr\norg.apache.catalina.core.</p>
<p>ContainerBase.［Catalina］. ［localhost］. ［/manager］.level = INFOlrlnorg.apache.catalina.core.ContainerBase.［Catalina］. ［localhost］.</p>
<p>［/manager］.handlers • 114•</p>
<h2>第 128 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>= 3manager.org.apache.juli.FileHandler\r\nlr\norg.apache.catalina.core.</p>
<p>ContainerBase.［Catalina］.［localhost］.［/host-manager］.level = INFO\r\norg.apache.catalina.core.ContainerBase.［Catalina］. ［localhost］.</p>
<p>［/host-manager］.handlers = 4host-manager.org.apache.juli.FileHandler\r\nlr\n&quot; key-serverxml： |</p>
<p>&lt;？xml version=&#x27;1.0&#x27;encoding=&#x27;utf-81？&gt; &lt;Server port=&quot;8005&quot; shutdown=&quot;SHUTDOWN&quot;&gt; &lt;Listener className=&quot;org.apache.catalina.startup.VersionLoggerListener&quot; /&gt; &lt;Listener className=&quot;org.apache.catalina.core.AprLifecyclelistener&quot; SSLEngine=&quot;on&quot;/&gt;</p>
<p>&lt;Listener className=&quot;org.apache.catalina.core.</p>
<p>JreMemoryLeakPreventionListener&quot; /&gt; &lt;Listener className=&quot;org.apache.catalina.mbeans.</p>
<p>GlobalResourcesLifecycleListener&quot; /&gt; &lt;Listener className=&quot;org.apache.catalina.core.</p>
<p>ThreadLocalLeakPreventionListener&quot; /&gt; &lt;GlobalNamingResources&gt; &lt;Resource name=&quot;UserDatabase&quot; auth=&quot;Container&quot; type=&quot;org.apache.catalina.UserDatabase&quot; description=&quot;User database that can be updated and saved&quot; factory=&quot;org.apache.catalina.users.MemoryUserDatabaseFactory&quot; pathname=&quot;conf/tomcat-users.xml&quot; /&gt; &lt;/GlobalNamingResources&gt; &lt;Service name=&quot;Catalina&quot;&gt; &lt;Connector port=&quot;8080&quot;protoco1=&quot;HTTP/1.1&quot; connectionTimeout=&quot;20000&quot; redirectPort=&quot;8443&quot; /&gt; &lt;Connector port=&quot;8009&quot;protocol=&quot;AJP/1.3&quot; redirectPort=&quot;8443&quot; /&gt; &lt;Engine name=&quot;Catalina&quot; defaultHost=&quot;localhost&quot;&gt; &lt;Realm className=&quot;org.apache.catalina.realm.LockOutRealm&quot;&gt; &lt;Realm className=&quot;org.apache.catalina.realm.UserDatabaseRealm&quot; resourceName=&quot;UserDatabase&quot; /&gt; &lt;/Realm&gt;</p>
<p>&lt;Host name=&quot;1ocalhost&quot; appBase=&quot;webapps&quot; unpackWARs=&quot;true&quot; autoDeploy=&quot;true&quot;&gt; &lt;Valve className=&quot;org.apache.catalina.valves.AccessLogValve&quot; directory=&quot;logs&quot;</p>
<p>Prefix=&quot;1ocalhost_access_log&quot;suffix=&quot;.txt&quot; pattern=&quot;gh el gu et &amp;quot；&amp;r&amp;quot; ss sb&quot; 1&gt; &lt;/Host&gt;</p>
<p>&lt;/Engine&gt;</p>
<p>&lt;/Service&gt;</p>
<p>&lt;/Server&gt;</p>
<p>kind: ConfigMap</p>
<p>• 115</p>
<h2>第 129 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） metadata：</p>
<p>creationTimestamp: 2016-07-29T00:52:182 name:cm-appconfigfiles namespace: default resourceVersion： &quot;85054&quot; selfLink: /api/v1/namespaces/default/configmaps/cm-appconfigfiles uid:b30d5019-5526-11e6-9dcd-000c29dc2102 3. ConfigMap 的创建：kubectl 命令行方式 不使用yaml 文件，直接通过 kubectl create configmap 也可以创建 ConfigMap，可以使用参 数--from-file 或--from-literal 指定内容，并且可以在一行命令中指定多个参数。</p>
<p>（1）通过-from-file 参数从文件中进行创建，可以指定key 的名称，也可以在一个命令行中 创建包含多个 key 的 ConfigMap，语法为：</p>
<p># kubect1 create configmap NAME --from-file=［key=］source --from-file=［key=］source （2）通过-from-file 参数从目录中进行创建，该目录下的每个配置文件名都被设置为key， 文件的内容被设置为 value，语法为：</p>
<p># kubect1</p>
<p>create configmap NAME --from-file=config-files-dir （3）--from-literal 从文本中进行创建，直接将指定的key#=value#创建为 ConfigMap 的内容， 语法为：</p>
<p># kubect1 create configmap NAME --from-literal=keyl=valuel --from-literal= key2=value2</p>
<p>下面对这几种用法举例说明。</p>
<p>例如，当前目录下含有配置文件 server.xml，可以创建一个包含该文件内容的 ConfigMap：</p>
<p># kubectl create configmap cn-server.xml--from-file=server.xml configmap &quot;cm-server.xml&quot; created # kubectl describe configmap cm-server.xml Name：</p>
<p>Namespace：</p>
<p>Labels：</p>
<p>Annotations：</p>
<p>cm-server.xml</p>
<p>default</p>
<p>&lt;none&gt;</p>
<p>＜none&gt;</p>
<p>Data</p>
<p>====</p>
<p>server.xml：</p>
<p>6458 bytes</p>
<p>假设 configfiles 目录下包含两个配置文件 server.xml 和 logging properties，创建一个包含这 两个文件内容的 ConfigMap：</p>
<p>• 116•</p>
<h2>第 130 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p># kubect1 create configmap cm-appconf --from-file=configfiles configmap &quot;cm-appconf&quot; created # kubect1 describe configmap cm-appconf Name：</p>
<p>Namespace：</p>
<p>Labels：</p>
<p>Annotations：</p>
<p>cm-appconf</p>
<p>default</p>
<p>&lt;none&gt;</p>
<p>&lt;none〉</p>
<p>Data</p>
<p>11==</p>
<p>logging.properties：</p>
<p>3354 bytes</p>
<p>server.xml：</p>
<p>6458 bytes</p>
<p>使用--from-literal 参数进行创建的示例如下：</p>
<p># kubectl create configmap cn-appenv--from-1iteral=loglevel=info --from-literal =appdatadir=/var/data configmap &quot;cm-appenv&quot; created # kubectl</p>
<p>Name：</p>
<p>Namespace：</p>
<p>Labels：</p>
<p>Annotations：</p>
<p>describe configmap cm-appenv cm-appenv</p>
<p>default</p>
<p>&lt;none&gt;</p>
<p>&lt;none&gt;</p>
<p>Data</p>
<p>====</p>
<p>appdatadir：</p>
<p>9 bytes</p>
<p>1oglevel：</p>
<p>4 bytes</p>
<p>容器应用对 ConfigMap 的使用有以下两种方法。</p>
<p>（1） 通过环境变量获取 ConfigMap 中的内容。</p>
<p>（2）通过Volume 挂载的方式将 ConfigMap 中的内容挂载为容器内部的文件或目录。</p>
<p>4. ConfigMap 的使用：环境变量方式 以 cm-appvars.yaml 为例：</p>
<p>apiversion:v1</p>
<p>kind:ConfigMap</p>
<p>metadata：</p>
<p>name:cm-appvars</p>
<p>data：</p>
<p>apPloglevel:info</p>
<p>appdatadir: /var/data • 117•</p>
<h2>第 131 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 在 Pod “cm-test.pod”的定义中，将 ConfigMap “cm-appvars”中的内容以环境变量 （APPLOGLEVEL 和 APPDATADIR）设置容器内部的环境变量，容器的启动命令将显示这两 个环境变量的值（&quot;envIgrep APP&quot;）：</p>
<p>apiVersion:V1</p>
<p>kind:Pod</p>
<p>metadata：</p>
<p>name:cm-test-pod</p>
<p>spec：</p>
<p>containers：</p>
<p>- name:cm-test</p>
<p>image: busybox</p>
<p>comnand：［ &quot;/bin/sh&quot;， &quot;-c&quot;， &quot;env I grep ARE&quot; ］ env：</p>
<p>-name:APPLOGLEVEL</p>
<p># 定义环境变量名称</p>
<p>valueFrom：</p>
<p># key “applogleve1”对应的值 configMapKeyRef：</p>
<p>name:cm-appvars</p>
<p>key:apploglevel</p>
<p>- name: APPDATADIR valueFrom：</p>
<p># 环境变量的值取自 cm-appvars 中：</p>
<p># key 为“applogleve1” ＃定义环境变量名称</p>
<p>#key “appdatadir”对应的值 configMapKeyRef：</p>
<p>name:cm-appvars</p>
<p>key:appdatadir</p>
<p># 环境变量的值取自 cm-appvars 中：</p>
<p># key 为 “appdatadir&quot; restartPolicy: Never 使用 kubectl create -f命令创建该Pod，由于是测试Pod，所以该Pod 在执行完启动命令后 将会退出，并且不会被系统自动重启 （restartPolicy=Never）：</p>
<p># kubectl create -f cm-test-pod.yaml pod &quot;cm-test-pod&quot; created 使用 kubectl get pods --show-all 查看已经停止的Pod：</p>
<p># kubectl get pods --show-al1 NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS</p>
<p>AGE</p>
<p>cm-test-pod</p>
<p>0/1</p>
<p>Completed</p>
<p>0</p>
<p>8s</p>
<p>查看该Pod的日志，可以看到启动命令“envl grep APP”的执行结果如下：</p>
<p># kubect1 logs cm-test-pod APPDATADIR=/var/data APPLOGLEVEL=info</p>
<p>说明容器内部的环境变量使用 ConfigMap cm-appvars 中的值进行了正确的设置。</p>
<p>• 118•</p>
<h2>第 132 页</h2>
<h3>第2章</h3>
<p>Kubernetes 实践指南</p>
<p>5. ConfigMap 的使用：volumeMount 模式 下面cm-appconfigfiles.yaml 的例子中包含两个配置文件的定义：server.xml 和 logging. properties。</p>
<p>cm-appconfigfiles.yaml apiVersion: v1</p>
<p>kind:ConfigMap</p>
<p>metadata：</p>
<p>name：</p>
<p>cm-serverxml</p>
<p>key-servezxl：！</p>
<p>&lt;？xml version=&#x27;1.0&#x27;encoding=&#x27;utf-81？&gt; &lt;Server port=&quot;8005&quot;shutdown=&quot;SHUTDOWN&quot;&gt; &lt;Listener className=&quot;org.apache.catalina.startup.VersionloggerListener&quot; /&gt; &lt;Listener className=&quot;org.apache.catalina.core.AprLifecycleListener&quot; SSLEngine=&quot;on&quot;/&gt;</p>
<p>&lt;Listener className=&quot;org.apache.catalina.core.</p>
<p>JreMemoryLeakPreventionListener&quot; /&gt; &lt;Listener className=&quot;org.apache.catalina.mbeans.</p>
<p>GlobalResourcesLifecycleListener&quot; /&gt; &lt;Listener className=&quot;org.apache.catalina.core.</p>
<p>ThreadLocalLeakPreventionListener&quot; /&gt; &lt;GlobalNamingResources&gt; &lt;Resource name=&quot;UserDatabase&quot; auth=&quot;Container&quot; type=&quot;org.apache.catalina.UserDatabase&quot; description=&quot;User database that can be updated and saved&quot; factory=&quot;org.apache.catalina.users.MemoryUserDatabaseFactory&quot; pathname=&quot;conf/tomcat-users.xml&quot; /&gt; &lt;/GlobalNamingResources&gt; &lt;Service name=&quot;Catalina&quot;&gt; &lt;Connector port=&quot;8080&quot;protoco1=&quot;HTTP/1.1&quot; connectionTimeout=&quot;20000&quot; redirectPort=&quot;8443&quot; /&gt; &lt;Connector port=&quot;8009&quot;protocol=&quot;AJP/1.3&quot; redirectPort=&quot;8443&quot; /&gt; &lt;Engine name=&quot;Catalina&quot; defaultHost=&quot;localhost&quot;&gt; &lt;Realm className=&quot;org.apache.catalina.realm.LockOutRealm&quot;&gt; &lt;Realm className=&quot;org.apache.catalina.realm.UserDatabaseRealm&quot; resourceName=&quot;UserDatabase&quot; /&gt; &lt;Host name=&quot;localhost&quot; appBase=&quot;webapps&quot; unpackWARs=&quot;true&quot; autoDeploy=&quot;true&quot;&gt; &lt;Valve className=&quot;org.apache.catalina.valves.AccessLogValve&quot; directory=&quot;logs&quot;</p>
<p>prefix=&quot;localhost_access_log&quot;suffix=&quot; .txt&quot; pattern=&quot;gh 8l gu et &amp;quoti8r&amp;quoti es 8b&quot; /&gt; • 119</p>
<h2>第 133 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） &lt;/Host&gt;</p>
<p>&lt;/Engine&gt;</p>
<p>&lt;/Server&gt;</p>
<p>key-loggingproperties： &quot;handlers = 1catalina.org.apache.juli.FileHandler， 2localhost.org.apache.juli.FileHandler， 3manager.org.apache.juli.FileHandler， 4host-manager.org.apache.juli.FileHandler， java.util.logging.ConsoleHandler\r\nlr\n.handlers = 1catalina.org.apache.juli.FileHandler， java.util.logging.ConsoleHandler\r\nlr\nlcatalina.org.apache.juli.FileHandler.level = FINE\r\nlcatalina.org.apache.juli.FileHandler.directory = $｛catalina.base｝/logs\r\nlcatalina.org.apache.juli.FileHandler.prefix = catalina.\r\nlr\n2localhost.org.apache.juli.FileHandler.level = FINE\r\n2localhost.org.apache.juli.FileHandler.directory =$｛catalina.base｝/logs\r\n2localhost.org.apache.juli.FileHandler.prefix = localhost.\r\nlr\n3manager.org.apache.juli.FileHandler.level = FINE\rn3manager.org.apache.juli.FileHandler.directory = $｛catalina.base｝/logs\r\n3manager.org.apache.juli.FileHandler.prefix = manager.\rlnlrln4host-manager.org.apache.juli.FileHandler.level = FINE\r\n4host-manager.org.apache.juli.FileHandler.directory = $｛catalina.base｝/logs\r\n4host-manager.org.apache.juli.FileHandler.</p>
<p>prefix =</p>
<p>host-manager. \rlnlr\njava.util.logging.ConsoleHandler.level = FINE\r\njava.util.logging.ConsoleHandler.formatter = java.util.logging.simpleFormatterlrlnlr\nlrlnorg.apache.catalina.core.</p>
<p>ContainerBase.［Catalina］.［localhost］. level = INFOlr\norg.apache.catalina.core.ContainerBase.［Catalina］. ［localhost］.</p>
<p>handlers</p>
<p>= 21ocalhost.org.apache.juli.FileHandlerlr\nlrlnorg.apache.catalina.core.</p>
<p>ContainerBase.［Catalina］.［localhost］.［/manager］ .level = INFO\r\norg.apache.catalina.core.ContainerBase.［Catalina］. ［localhost］.</p>
<p>［/manager］.handlers 3manager.org.apache.juli.FileHandlerlr\n\rlnorg.apache.catalina.core.</p>
<p>ContainerBase.［Catalina］.［localhost］.［/host-manager］.level = INFO\r\norg.apache.catalina.core.ContainerBase.［Catalina］.［localhost］.</p>
<p>［/host-managerl.handlers = 4host-manager.org.apache.juli.FileHandler\r\n\r\n&quot; 在 Pod “cm-test-app”的定义中，将 ConfigMap “cm-appconfigfiles” 中的内容以文件的形 式 mount 到容器内部的/configfiles 目录中去。Pod 配置文件 cm-test-app.yaml 的内容如下：</p>
<p>apiVersion: v1</p>
<p>Kind: Pod</p>
<p>metadata：</p>
<p>• 120•</p>
<h2>第 134 页</h2>
<h3>第2章</h3>
<p>Kubernetes 实践指南</p>
<p>name: cm-test-app</p>
<p>spec：</p>
<p>containers：</p>
<p>- name: cm-test-app image: kubeguide/tomcat-app:V1 ports：</p>
<p>- containerPort：</p>
<p>8080</p>
<p>volumeMounts：</p>
<p>-name: serverxml</p>
<p>mountPath:/configfiles # 引用volume 名</p>
<p># 挂载到容器内的目录</p>
<p>volumes：</p>
<p>- name: serverxml</p>
<p>#定义volume 名</p>
<p>configMap：</p>
<p>name:cm-appconfigfiles # 使用 ConfigMap “cm-appconfigfiles” items：</p>
<p>- key: key-serverxml path:server.xml</p>
<p>- key:key-1oggingproperties Path:1ogging.properties # key=key-serverxl # value 将 server.xm1 文件名进行挂载 # key=key-1oggingproperties # value 将 1ogging.properties 文件名进行挂载 创建该 Pod：</p>
<p># kubectl create -f cm-test-app.yaml pod &quot;cm-test-app&quot; created 登录容器，查看到/configfiles 目录下存在 server.xml 和 logging.properties 文件，它们的内容 就是 ConfigMap “cm-appconfigfiles” 中两个 key 定义的内容。</p>
<p># kubectl exec -ti cm-test-app -- bash root@cm-test-app:/# cat /configfiles/server.xml &lt;？xml version=&#x27;1.0&#x27;encoding=&#x27;utf-8&#x27;？&gt; &lt;Server port=&quot;8005&quot;shutdown=&quot;SHUTDOWN&quot;&gt; ••••••</p>
<p>root@cm-test-app:/# cat /configfiles/1ogging.properties handlers = 1catalina.org.apache.juli.AsyncFileHandler， 21ocalhost.org.apache.juli.AsyncFileHandler， 3manager.org.apache.juli.AsyncFileHandler， 4host-manager.org.apache.juli.AsyncFileHandler, java.util.logging.ConsoleHandler 如果在引用 ConfigMap 时不指定 items，则使用 volumeMount 方式在容器内的目录中每 个item 生成一个文件名为key 的文件。</p>
<p>Pod 配置文件 cm-test-app.yaml 的内容如下：</p>
<p>apiVersion: v1</p>
<p>kind: Pod</p>
<p>metadata：</p>
<p>• 121•</p>
<h2>第 135 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） name：</p>
<p>cm-test-app</p>
<p>spec：</p>
<p>containers：</p>
<p>- name: cm-test-app image: kubeguide/tomcat-app:V1 imagePullPolicy: Never ports：</p>
<p>- containerPort：</p>
<p>8080</p>
<p>volumeMounts：</p>
<p>-name: serverxml</p>
<p>mountPath: /configfiles # 引用volume 名</p>
<p>＃ 挂载到容器内的目录</p>
<p>volumes：</p>
<p>-name: serverxml</p>
<p># 定义volume 名</p>
<p>configMap：</p>
<p>name:cm-appconfigfiles # 使用 ConfigMap “cm-appconfigfiles” 创建该 Pod：</p>
<p># kubect1 create -f cm-test-app.yaml pod &quot;cm-test-app&quot; created 登录容器，查看到/configfiles 目录下存在 key-loggingproperties 和 key-serverxml 文件，文 件的名称来自 ConfigMap cm-appconfigfiles 中定义的两个key的名称，文件的内容则为 value 的内容：</p>
<p># 18 /configfiles</p>
<p>key-loggingproperties key-serverxm1 6. 使用 ConfigMap 的限制条件 使用 ConfigMap 的限制条件如下。</p>
<p>◎ ConfigMap 必须在 Pod 之前创建。</p>
<p>◎ ConfigMap 也可以定义为属于某个 Namespace。只有处于相同 Namespaces 中的Pod 可 以引用 。</p>
<p>ConfigMap 中的配额管理还未能实现。</p>
<p>kubelet 只支持可以被 API Server 管理的Pod使用 ConfigMap。kubelet 在本Node上通 过 --manifest-url 或--config 自动创建的静态 Pod 将无法引用 ConfigMap。</p>
<p>在Pod 对 ConfigMap 进行挂载（volumeMount）操作时，容器内部只能挂载力“目录”， 无法挂载为“文件”。在挂载到容器内部后，目录中将包含 ConfigMap 定义的每个 item， 如果该目录下原先还有其他文件，则容器内的该目录将会被挂载的 ConfigMap 进行覆 盖。如果应用程序需要保留原来的其他文件，则需要进行额外的处理。可以通过将 • 122•</p>
<h2>第 136 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>ConfigMap 挂载到容器内部的临时目录，再通过启动脚本将配置文件复制或者链接（cp 或link 操作）到应用所用的实际配置目录下。</p>
<h3>2.4.6 Pod 生命周期和重启策略</h3>
<p>Pod 在整个生命周期过程中被系统定义为各种状态，熟悉Pod 的各种状态对于我们理解如 何设置 Pod 的调度策略、重启策略是很有必要的。</p>
<p>Pod的状态包括以下几种，如表2.14所示。</p>
<p>表2.14 Pod的状态</p>
<p>状态值</p>
<p>描述</p>
<p>Pending</p>
<p>API Server 已经创建该Pod，但Pod 内还有一个或多个容器的镜像没有创建，包括正在下载镜像的过程 Running</p>
<p>Pod 内所有容器均已创建，且至少有一个容器处于运行状态、正在启动状态或正在重启状态 Succeeded</p>
<p>Pod 内所有容器均成功执行退出，且不会再重肩 Failed</p>
<p>Pod 内所有容器均已退出，但至少有一个容器退出为失败状态 Unknown</p>
<p>由于某种原因无法获取该Pod 的状态，可能由于网络通信不畅导致 Pod 的重启策略（RestartPolicy）应用于Pod 内的所有容器，并且仅在Pod所处的 Node上 由kubelet 进行判断和重启操作。当某个容器异常退出或者健康检查（详见下节）失败时，kubelet 将根据 RestartPolicy 的设置来进行相应的操作。</p>
<p>Pod 的重启策略包括 Always、OnFailure 和 Never，默认值为 Always。</p>
<p>Always：当容器失效时，由kubelet 自动重启该容器。</p>
<p>OnFailure：当容器终止运行且退出码不为0时，由kubelet 自动重启该容器。</p>
<p>Never：不论容器运行状态如何，kubelet 都不会重启该容器。</p>
<p>kubelet 重启失效容器的时间间隔以 sync-frequency 乘以2n来计算，例如1、2、4、8倍等， 最长延时5分钟，并且在成功重启后的10分钟后重置该时间。</p>
<p>Pod 的重启策略与控制方式息息相关，当前可用于管理 Pod 的控制器包括 ReplicationController、Job、DaemonSet 及直接通过 kubelet 管理（静态 Pod）。每种控制器对 Pod 的重启策略要求如下。</p>
<p>RC和DaemonSet：必须设置 Always，需要保证该容器持续运行。</p>
<p>◎</p>
<p>Job:OnFailure 或 Never，确保容器执行完成后不再重启。</p>
<p>kubelet：在 Pod 失效时自动重启它，不论 RestartPolicy 设置为什么值，并且也不会对 Pod进行健康检查。</p>
<p>• 123•</p>
<h2>第 137 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 结合 Pod 的状态和重启策略，表2.15列出一些常见的状态转换场景。</p>
<p>表2.15 一些常见的状态转换场景</p>
<p>Pod 包含的容器数</p>
<p>包含1个容器</p>
<p>包含1个容器</p>
<p>包含两个容器</p>
<p>包含两个容器</p>
<p>Pod 当前的状态</p>
<p>发生事件</p>
<p>Running</p>
<p>Running</p>
<p>Running</p>
<p>Running</p>
<p>容器成功退出</p>
<p>容器失败退出</p>
<p>1个容器失败退出</p>
<p>容器被 OOM 杀掉</p>
<p>RestartPolicy=</p>
<p>Always</p>
<p>Running</p>
<p>Running</p>
<p>Ruming.</p>
<p>Running</p>
<p>Pod 的结果状态</p>
<p>RestartPolicy=</p>
<p>OnFailure</p>
<p>Succeeded</p>
<p>Running</p>
<p>Running</p>
<p>Running</p>
<p>RestartPolicy=</p>
<p>Never</p>
<p>Succeeded</p>
<p>Failed</p>
<p>Running</p>
<p>Failed</p>
<h3>2.4.7 Pod 健康检查</h3>
<p>对Pod的健康状态检查可以通过两类探针来检查：LivenessProbe 和 ReadinessProbe。</p>
<p>LivenessProbe 探针：用于判断容器是否存活（running 状态），如果 LivenessProbe 探针 探测到容器不健康，则kubelet 将杀掉该容器，并根据容器的重启策略做相应的处理。</p>
<p>如果一个容器不包含 LivenessProbe 探针，那么 kubelet 认该容器的 LivenessProbe 探 针返回的值永远是“Success”。</p>
<p>ReadinessProbe：用于判断容器是否启动完成（ready 状态），可以接收请求。如果 ReadinessProbe 探针检测到失败，则 Pod 的状态将被修改。Endpoint Controller 将从 Service 的 Endpoint 中删除包含该容器所在 Pod 的 Endpoint。</p>
<p>kubelet 定期执行 LivenessProbe 探针来诊断容器的健康状况。LivenessProbe 有以下三种实 现方式。</p>
<p>（1） ExecAction：在容器内部执行一个命令，如果该命令的返回码O，则表明容器健康。</p>
<p>在下面的例子中，通过执行“cat/tmp/health”命令来判断一个容器运行是否正常。而该Pod 运行之后，在创建/mp/health 文件的10秒之后将删除该文件，而 LivenessProbe 健康检查的初始探 测时间（initialDelaySeconds）为15秒，探测结果将是Fail，将导致 kubelet 杀掉该容器并重启它。</p>
<p>apiVersion: v1</p>
<p>kind: Pod</p>
<p>metadata：</p>
<p>labels：</p>
<p>test: liveness</p>
<p>name: liveness-exec spec：</p>
<p>containers：</p>
<p>- name: liveness</p>
<p>• 124</p>
<h2>第 138 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>image:gcr.io/google_containers/busybox args：</p>
<p>- /bin/sh</p>
<p>--c</p>
<p>- echo ok &gt; /tmp/health;sleep 10;rm -rf /tmp/health; sleep 600 1ivenessProbe：</p>
<p>exec：</p>
<p>command：</p>
<p>- cat</p>
<p>- /tmp/health</p>
<p>initialDelaySeconds: 15 timeoutSeconds: 1</p>
<p>（2） TCPSocketAction：通过容器的IP 地址和端口号执行 TCP检查，如果能够建立TCP连 接，则表明容器健康。</p>
<p>在下面的例子中，通过与容器内的 localhost:80 建立TCP 连接进行健康检查。</p>
<p>apiversion:v1</p>
<p>kind:Pod</p>
<p>metadata：</p>
<p>name:pod-with-healthcheck spec：</p>
<p>containers：</p>
<p>- name: nginx</p>
<p>image: nginx</p>
<p>ports：</p>
<p>- containerPort:80 livenessProbe：</p>
<p>tcpSocket：</p>
<p>port:80</p>
<p>initialDelayseconds: 30 timeoutSeconds: 1</p>
<p>（3）HTTPGetAction：通过容器的IP 地址、端口号及路径调用 HTTP Get 方法，如果响应 的状态码大于等于200且小于等于400，则认为容器状态健康。</p>
<p>在下面的例子中，kubelet 定时发送 HTTP 请求到 localhost:80/_status/healthz 来进行容器应 用的健康检查。</p>
<p>apiVersion: v1</p>
<p>kind:Pod</p>
<p>metadata：</p>
<p>name:pod-with-healthcheck spec：</p>
<p>containers：</p>
<p>- name:nginx</p>
<p>image:nginx</p>
<p>• 125•</p>
<h2>第 139 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） ports：</p>
<p>- containerPort:80 1ivenessProbe：</p>
<p>httpGet：</p>
<p>Path:/_status/healthz port:80</p>
<p>initialDelaySeconds: 30 timeoutSeconds: 1</p>
<p>对于每种探测方式，都需要设置 initialDelaySeconds 和 timeoutSeconds 两个参数，它们的含 义分别如下。</p>
<p>initialDelaySeconds： 启动容器后进行首次健康检查的等待时间，单位为秒。</p>
<p>timeoutSeconds：健康检查发送请求后等待响应的超时时间，单位为秒。当超时发生时， kubelet 会认为容器已经无法提供服务，将会重启该容器。</p>
<h3>2.4.8 玩转 Pod 调度</h3>
<p>在 Kubernetes 系统中，Pod 在大部分场景下都只是容器的载体而已，通常需要通过RC、 Deployment、DaemonSet、Job 等对象来完成Pod 的调度与自动控制功能。</p>
<p>1.RC、Deployment：全自动调度 RC 的主要功能之一就是自动部署一个容器应用的多份副本，以及持续监控副本的数量，在 集群内始终维持用户指定的副本数量。</p>
<p>根据 frontend-controller:yaml 配置，用户需要创建3个 kubeguide/guestbook-php-frontend 应 用的副本，在将该定义发送给 Kuberetes 之后，系统将在集群中合适的Node 上创建3个 Pod， 并始终维持3个副本的数量。</p>
<p>apiVersion:v1</p>
<p>kind:ReplicationController metadata：</p>
<p>name: frontend</p>
<p>labels：</p>
<p>name: frontend</p>
<p>spec：</p>
<p>replicas: 3</p>
<p>selector：</p>
<p>name: frontend</p>
<p>template：</p>
<p>metadata：</p>
<p>labels：</p>
<p>• 126•</p>
<h2>第 140 页</h2>
<h3>第2章</h3>
<p>Kubernetes 实践指南</p>
<p>name: frontend</p>
<p>spec：</p>
<p>containers：</p>
<p>- name: frontend</p>
<p>image: kubeguide/guestbook-php-frontend env：</p>
<p>- name: GET_HOSTS_FROM value: env</p>
<p>ports：</p>
<p>- containerPort:80 在调度策略上，除了使用系统内置的调度算法选择合适的 Node 进行调度，也可以在Pod 的定义中使用 NodeSelector 或 NodeA ffinity 来指定满足条件的Node 进行调度，下面我们分别进 行说明。</p>
<p>1） NodeSelector：定向调度 Kubernetes Master 上的 Scheduler 服务（kube-scheduler 进程）负责实现Pod 的调度，整个 调度过程通过执行一系列复杂的算法，最终每个 Pod计算出一个最佳的目标节点，这一过程 是自动完成的，通常我们无法知道Pod最终会被调度到哪个节点上。在实际情况中，也可能需 要将 Pod 调度到指定的一些 Node 上，可以通过Node 的标签（Label） 和 Pod 的 nodeSelector 属性相匹配，来达到上述目的。</p>
<p>（1） 首先通过 kubectl label 命令给目标 Node 打上一些标签：</p>
<p>kubectl label nodes &lt;node-name&gt; &lt;label-key&gt;=&lt;label-value&gt; 这里，我们为k8s-node-1 节点打上一个 zone=north 的标签，表明它是“北方”的一个节点：</p>
<p>s kubect1 label nodes k8s-node-1 zone=north NAME</p>
<p>LABELS</p>
<p>STATUS</p>
<p>k8s-node-1</p>
<p>kubernetes.io/hostname=k8s-node-1,zone=north Ready</p>
<p>上述命令行操作也可以通过修改资源定义文件的方式，并执行 kubectl replace -f xxx.yaml 命令来完成。</p>
<p>（2） 然后，在Pod 的定义中加上 nodeSelector 的设置， 以 redis-master-controller.yaml 为例：</p>
<p>apiVersion:v1</p>
<p>kind:ReplicationController metadata：</p>
<p>name:redis-master</p>
<p>labels：</p>
<p>name:redis-master</p>
<p>spec：</p>
<p>replicas: 1</p>
<p>selector：</p>
<p>name:redis-master</p>
<p>• 127•</p>
<h2>第 141 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） template：</p>
<p>metadata：</p>
<p>labels：</p>
<p>name: redis-master spec：</p>
<p>containers：</p>
<p>- name:master</p>
<p>image:kubeguide/redis-master ports：</p>
<p>- containerPort: 6379 nodeSelector：</p>
<p>zone: north</p>
<p>运行 kubectl create -f 命令创建 Pod， scheduler 就会将该Pod 调度到拥有 zone=north 标签的 Node 上。</p>
<p>使用 kubectl get pods -o wide 命令可以验证Pod 所在的 Node：</p>
<p># kubectl get pods -o wide NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS AGE</p>
<p>NODE</p>
<p>redis-master-fOrqj 1/1</p>
<p>Running 0</p>
<p>19s</p>
<p>k8s-node-1</p>
<p>如果我们给多个 Node 都定义了相同的标签（例如 zone=north），则 scheduler 将会根据调度 算法从这组 Node 中挑选一个可用的 Node 进行Pod 调度。</p>
<p>通过基于Node 标签的调度方式，我们可以把集群中具有不同特点的Node 贴上不同的标签， 例如 “role=frontend”“role=backend” “role=database” 等标签，在部署应用时就可以根据应用的 需求设置 NodeSelector 来进行指定 Node 范围的调度。</p>
<p>需要注意的是，如果我们指定了 Pod 的 nodeSelector 条件，且集群中不存在包含相应标签 的Node，则即使集群中还有其他可供使用的 Node，这个Pod 也无法被成功调度。</p>
<p>2） NodeAffinity： 亲和性调度 NodeA ffinity 意为Node 亲和性的调度策略，是将来替换 NodeSelector 的下一代调度策略。</p>
<p>由于 NodeSelector 通过 Node 的Label 进行精确匹配，所以 NodeAffinity 增加了 In、Notln、Exists、 DoesNotExist、Gt、Lt 等操作符来选择Node，能够使调度策略更加灵活。同时，在 NodeAffinity 中将增加一些信息来设置亲和性调度策略。</p>
<p>RequiredDuringSchedulingRequiredDuringExecution： 类似于 NodeSelector，但在 Node 不满足条件时，系统将从该 Node 上移除之前调度上的 Pod。</p>
<p>RequiredDuringSchedulinglgnoredDuringExecution： 与第 1 个 RequiredDuringScheduling RequiredDuringExecution 的作用相似，区别是在Node 不满足条件时，系统不一定从该 Node 上移除之前调度上的 Pod。</p>
<p>• 128•</p>
<h2>第 142 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>PreferredDuringSchedulinglgnoredDuringExecution：指定在满足调度条件的Node 中，哪 些 Node 应更优先地进行调度。同时在 Node 不满足条件时，系统不一定从该 Node 上 移除之前调度上的 Pod。</p>
<p>在当前的 Alpha 版本中，需要在 Pod 的 metadata.annotations 中设置 NodeAffinity 的内容：</p>
<p>apiVersion:v1</p>
<p>kind: Pod</p>
<p>metadata：</p>
<p>name: with-labels</p>
<p>annotations：</p>
<p>scheduler .alpha.kubernetes.io/affinity： &gt; ｛</p>
<p>&quot;nodeAffinity&quot;： ｛</p>
<p>&quot;requiredDuringSchedulingIgnoredDuringExecution&quot;： ｛ &quot;nodeSelectorTerms&quot;：</p>
<p>【</p>
<p>｛</p>
<p>&quot;matchExpressions&quot;：［ &quot;key&quot;：</p>
<p>&quot;kubernetes.io/e2e-az-name&quot;， &quot;operator&quot;：</p>
<p>&quot;In&quot;，</p>
<p>&quot;values&quot;：</p>
<p>［&quot;e2e-az1&quot;，</p>
<p>&quot;e2e-az2&quot;］</p>
<p>｝</p>
<p>｝</p>
<p>｝</p>
<p>another-annotation-key: another-annotation-value spec：</p>
<p>containers：</p>
<p>- name: with-labels image:gcr.io/google_containers/pause:2.0 这里 NodeAffinity 的设置说明只有 Node 的 Label 中包含key= kubernetes.io/e2e-az-name，并 且其 value 力“e2e-azl”或“e2e-az2”时，才能成为该Pod 的调度目标。其中操作符为In，代 表“或”运算，其他操作符包括 Notln（不属于）、Exists（存在一个条件）、DoesNotExist（不 存在）、Gt（大于）、Lt（小于）。</p>
<p>如果同时设置了 NodeSelector 和 NodeAffinity，则系统将需要同时满足两者的设置才能进行 调度。</p>
<p>在未来的 Kubernetes 版本中，还将加入 Pod Affinity 的设置，用于控制当调度Pod 到某个特 定的 Node 上时，判断是否有其他Pod正在该Node 上运行，即通过其他的相关Pod 进行调度， • 129•</p>
<h2>第 143 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 而不仅仅通过 Node 本身的标签进行调度。</p>
<p>2.DaemonSet：特定场景调度 DaemonSet 是 Kubernetes 1.2版本新增的一种资源对象，用于管理在集群中每个 Node 上仅 运行一份Pod 的副本实例，如图2.10所示。</p>
<p>在每个Node上运</p>
<p>行一个monitor</p>
<p>Kubemnetes Master</p>
<p>monitor</p>
<p>Pod</p>
<p>Node 1</p>
<p>monitor</p>
<p>Pod</p>
<p>Node 2</p>
<p>monitor</p>
<p>Pod</p>
<p>Node 3</p>
<p>图 2.10 DaemonSet 示例 这种用法适合一些有这种需求的应用。</p>
<p>◎ 在每个 Node 上运行一个 GlusterFS 存储或者 Ceph 存储的daemon 进程。</p>
<p>3在每个 Node 上运行一个日志采集程序，例如 fluentd 或者 logstach。</p>
<p>◎</p>
<p>在每个Node上运行一个健康程序，采集该 Node 的运行性能数据，例如 Prometheus Node Exporter、collectd、New Relic agent 或者 Ganglia gmond 等。</p>
<p>DaemonSet 的Pod调度策略与RC类似，除了使用系统内置的算法在每台Node上进行调度， 也可以在Pod的定义中使用NodeSelector 或NodeAffinity 来指定满足条件的Node范围进行调度。</p>
<p>下面的例子定义为在每台 Node 上启动一个 fluentd 容器，配置文件 fluentd-ds.yaml 的内容 如下，其中挂载了物理机的两个目录“/var/log” 和 “/var/ib/docker/containers”；</p>
<p>apiVersion : extensions/v1beta1 kind: DaemonSet</p>
<p>metadata：</p>
<p>name: fluentd-cloud-logging namespace: kube-system labels：</p>
<p>k8s-app: fluentd-cloud-logging spec：</p>
<p>template：</p>
<p>• 130•</p>
<h2>第 144 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>metadata：</p>
<p>namespace: kube-system Labels：</p>
<p>k8s-app: fluentd-cloud-logging spec：</p>
<p>containers：</p>
<p>- name: fluentd-cloud-logging image:gcr.io/google_containers/fluentd-elasticsearch:1.17 resources：</p>
<p>limits：</p>
<p>cpu:100m</p>
<p>memory: 200Mi</p>
<p>env：</p>
<p>- name: FLUENTD_ARGS value：</p>
<p>-9</p>
<p>volumeMounts：</p>
<p>- name: varlog</p>
<p>mountPath: /var/1og readOnly: false</p>
<p>- name: containers mountPath: /var/1ib/docker/containers readOnly:false</p>
<p>volumes：</p>
<p>- name：</p>
<p>containers</p>
<p>hostPath：</p>
<p>path:/var/1ib/docker/containers - name: varlog</p>
<p>hostPath：</p>
<p>path:/var/1og</p>
<p>使用 kubectl create 命令创建该 DaemonSet：</p>
<p># kubectl create -f fluentd-ds.yaml daemonset&quot;fluentd-cloud-loqginq&quot; created 查看创建好的 DaemonSet 和 Pod，可以看到在每个 Node 上都创建了一个 Pod：</p>
<p># kubectl get daemonset --namespace=kube-system NAME</p>
<p>DESIRED CURRENT</p>
<p>NODE-SELECTOR</p>
<p>AGE</p>
<p>fluentd-cloud-logging 2</p>
<p>2</p>
<p>&lt;none&gt;</p>
<p>3s</p>
<p># kubectl get pods --namespace=kube-system NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS</p>
<p>fluentd-cloud-logging-7tw9z fluentd-cloud-logging-aqdn1 1/1</p>
<p>Running</p>
<p>0</p>
<p>1/1</p>
<p>Running|</p>
<p>。</p>
<p>AGE</p>
<p>1h</p>
<p>lh</p>
<p>• 131•</p>
<h2>第 145 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 3. Job：批处理调度</p>
<p>Kubernetes 从1.2版本开始支持批处理类型的应用，我们可以通过 Kubernetes Job 资源对象 来定义并启动一个批处理任务。批处理任务通常并行（或者串行）启动多个计算进程去处理一 批工作项（work item），处理完成后，整个批处理任务结束。按照批处理任务实现方式的不同， 批处理任务可以分为如图 2.11 所示的几种模式。</p>
<p>Work</p>
<p>item</p>
<p>Work</p>
<p>ntem</p>
<p>Work</p>
<p>item</p>
<p>Work</p>
<p>item</p>
<p>Work</p>
<p>item</p>
<p>Jot Template Expansion Wirk</p>
<p>Wor</p>
<p>Queue with Pod Per Work item Queue with Variable Pod Count Job</p>
<p>Job</p>
<p>Job</p>
<p>pod1</p>
<p>Work Queue</p>
<p>Job</p>
<p>pod2</p>
<p>pod3</p>
<p>pod1</p>
<p>Work Queue</p>
<p>Job</p>
<p>pod2</p>
<p>建议</p>
<p>建议</p>
<p>图2.11 批处理任务的几种模式</p>
<p>Job Template Expansion 模式：一个 Job 对象对应一个待处理的Work item，有几个 Work item 就产生几个独立的 Job，通常适合 Work item 数量少、每个 Work item 要处理的数 据量比较大的场景，比如有一个 100GB 的文件作为一个 Work item，总共10个文件需 要处理。</p>
<p>Queue with Pod Per Work Item 模式：采用一个任务队列存放 Work item， 一个 Job 对象</p>
<p>作为消费者去完成这些 Work item，在这种模式下，Job 会启动 N个 Pod，每个Pod对 应一个 Work item。</p>
<p>Queue with Variable Pod Count 模式：也是采用一个任务队列存放 Work item，一个 Job 对象作为消费者去完成这些 Work item，但与上面的模式不同，Job 启动的Pod 数量是 可变的。</p>
<p>还有一种被称为 Single Job with Static Work Assignment 的模式，也是一个 Job 产生多个 Pod 的模式，但它采用程序静态方式分配任务项，而不是采用队列模式进行动态分配。</p>
<p>如表2.16所示是这几种模式的一个对比。</p>
<p>• 132•</p>
<h2>第 146 页</h2>
<h3>第2章</h3>
<p>Kubernetes 实践指南</p>
<p>模式名称</p>
<p>是否是一个</p>
<p>Job</p>
<p>Pod 的数量少于</p>
<p>Work item</p>
<p>用户程序是否要做</p>
<p>相应的修改</p>
<p>Kubernetes 是</p>
<p>否支持</p>
<p>Job Template Expansion Queue with Pod Per Work Item 是</p>
<p>Queue with Variable Pod Count 是</p>
<p>Single Job with Static Work Assignment 是</p>
<p>/</p>
<p>/</p>
<p>1</p>
<p>/</p>
<p>是</p>
<p>有时候需要</p>
<p>/</p>
<p>是</p>
<p>是</p>
<p>是</p>
<p>是</p>
<p>/</p>
<p>考虑到批处理的并行问题，Kubernetes 将 Job 分以下三种类型。</p>
<p>1） Non-parallel Jobs 通常一个Job 只启动一个 Pod，则除非Pod异常，才会重启该Pod，一旦此Pod 正常结束， Job 将结束。</p>
<p>2） Parallel Jobs with a fixed completion count 并行Job 会启动多个 Pod，此时需要设定 Job 的.spec.completions 参数为一个正数，当正常 结束的Pod 数量达到此参数设定的值后，Job 结束。此外，Job 的.spec.，parallelism 参数用来控制 并行度，即同时启动几个 Job 来处理 Work Item。</p>
<p>3） Parallel Jobs with a work queue 任务队列方式的并行 Job 需要一个独立的 Queue,Work item 都在一个 Queue 中存放，不能 设置 Job 的.spec.completions 参数，此时 Job 有以下一些特性。</p>
<p>每个 Pod 能独立判断和决定是否还有任务项需要处理。</p>
<p>如果某个 Pod 正常结束，则Job 不会再启动新的Pod。</p>
<p>如果一个 Pod 成功结束，则此时应该不存在其他Pod还在干活的情况，它们应该都处 于即将结束、退出的状态。</p>
<p>◎ 如果所有 Pod 都结束了，且至少有一个 Pod成功结束，则整个Job 算是成功结束。</p>
<p>下面我们分别说说常见的三种批处理模型在 Kubernetes 中的例子。</p>
<p>首先是 Job Template Expansion 模式，由于这种模式下每个 Work item 对应一个Job 实例， 所以这种模式首先定义一个 Job 模板，模板里主要的参数是 Work item 的标识，因为每个 Job 处理不同的Work item。如下所示的 Job 模板（文件名为 job.yaml.txt）中的$ITEM 可以作任 务项的标识：</p>
<p>apiVersion: batch/v1 kind: Job</p>
<p>metadata：</p>
<p>name: process-item-$ITEM labels：</p>
<p>jobgroup: jobexample • 133•</p>
<h2>第 147 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） spec：</p>
<p>template：</p>
<p>metadata：</p>
<p>name:jobexample</p>
<p>labels：</p>
<p>jobgroup：jobexample speC：</p>
<p>containers：</p>
<p>- name:c</p>
<p>image:busybox</p>
<p>command：［&quot;sh&quot;，&quot;-c&quot;，&quot;echo Processing item $ITEM &amp;&amp; sleep 5&quot;］ restartPolicy: Never 通过下面的操作，生成3个对应的Job 定义文件并创建Job：</p>
<p># for i in apple banana cherry &gt; do</p>
<p>cat job.yaml.txt | sed &quot;s/\$ITEM/$i/&quot;&gt;./jobs/job-$i.yaml &gt; done</p>
<p># ls jobs</p>
<p>job-apple.yaml job-banana.yaml job-cherry.yaml # kubectl create -f jobs job &quot;process-item-apple&quot; created job &quot;process-item-banana&quot;created job &quot;process-item-cherry&quot; created 观察 Job 的运行情况：</p>
<p># kubect1 get jobs -1 jobgroup=jobexample NAME</p>
<p>DESIRED</p>
<p>SUCCESSFUL</p>
<p>AGE</p>
<p>process-item-apple 1</p>
<p>1</p>
<p>4m</p>
<p>process-item-banana 1</p>
<p>1</p>
<p>4m</p>
<p>process-item-cherry 1</p>
<p>1</p>
<p>4m</p>
<p>其次，我们看看 Queue with Pod Per Work Item 模式，在这种模式下需要一个任务队列存放 Work item，比如RabbitMQ，客户端程序先把要处理的任务变成 Work item 放入到任务队列，然 后编写 Worker 程序并打包镜像并定义成为 Job 中的 Work Pod, Worker 程序的实现逻辑是从任 务队列中拉取一个 Work item 并处理，处理完成后即结束进程，图2.12给出了并行度为2的一 个Demo 示意图。</p>
<p>最后，我们再看看 Queue with Variable Pod Count 模式，如图2.13所示，由于这种模式下， Worker 程序需要知道队列中是否还有等待处理的 Work item，如果有就取出来并处理，否则就 认为所有工作完成并结束进程，所以任务队列通常要采用 Redis 或者数据库来实现。</p>
<p>• 134</p>
<h2>第 148 页</h2>
<h3>第2章</h3>
<p>Kubernetes 买践指南</p>
<p>RabbitMQ</p>
<p>K8s Job</p>
<p>Cient</p>
<p>任意时刻，最多只有2个Pod存在</p>
<p>产生8个工作项</p>
<p>Worker Pod</p>
<p>Worker Pod</p>
<p>Worker Pod</p>
<p>Worker Pod</p>
<p>Worker Pod</p>
<p>Worker Pod</p>
<p>Worker Pod</p>
<p>每个Pod对应一个工作项，即处理完一个，Pod就结束了 Worker Pod</p>
<p>图 2.12 Queue with Pod Per Work Item 示例 RabbitMQ并不能让客户端知道是否 没有数据了（客户端只能傻等），因</p>
<p>*此这里采用了Redis队列</p>
<p>Redis</p>
<p>K8s Job</p>
<p>产生8个工作项</p>
<p>Client</p>
<p>Worker Pod</p>
<p>Worker Pod</p>
<p>Worker Pod</p>
<p>每个Pod都不断地从队列中拉取工作项并处理，直到队列为空，Pod退出执行，因此，这 种情况下，只要有一个Pod成功结束，就意味着整个Job进入“终止”状态。</p>
<p>图 2.13 Queue with Variable Pod Count 示例 Kubernetes 对Job 的支持还处于初级阶段，类似 Linux Cron 的定时任务也还没时间，计划 在 Kubernetes 1.4中实现。此外，更为复杂的流程类的批处理框架也还没有考虑，但随着 Kubernetes 生态圈的不断发展和壮大，相信 Kuberetes 在批处理方面也会有更多的规划。</p>
<h3>2.4.9 Pod 的扩容和缩容</h3>
<p>在实际生产系统中，我们经常会遇到某个服务需要扩容的场景，也可能会遇到由于资源紧 张或者工作负载降低而需要减少服务实例数量的场景。此时我们可以利用RC 的Scale 机制来完 • 135•</p>
<h2>第 149 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 成这些工作。以 redis-slave RC 为例，已定义的最初副本数量为2，通过kubectl scale 命令可以 将 redis-slave RC控制的Pod副本数量从初始的2更新为3：</p>
<p>$ kubect1 scale rc redis-slave --replicas=3 replicationcontroller &quot;redis-slave&quot; scaled 执行 kubectl get pods 命令来验证 Pod 的副本数量增加到3：</p>
<p>$ kubectl get pods NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS AGE</p>
<p>redis-slave-4na2n</p>
<p>1/1</p>
<p>Running</p>
<p>0</p>
<p>1h</p>
<p>redis-slave-92u3k</p>
<p>1/1</p>
<p>Running</p>
<p>0</p>
<p>1h</p>
<p>redis-slave-palab</p>
<p>1/1</p>
<p>Running</p>
<p>0</p>
<p>2m</p>
<p>将-replicas 设置为比当前 Pod 副本数量更小的数字，系统将会“杀掉”一些运行中的Pod， 以实现应用集群缩容：</p>
<p>s kubectl</p>
<p>scale rc redis-slave --replicas=1 replicationcontroller &quot;redis-slave&quot; scaled s kubect1</p>
<p>NAME</p>
<p>redis-slave-4na2n</p>
<p>get pods</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS</p>
<p>AGE</p>
<p>1/1</p>
<p>Running</p>
<p>0</p>
<p>1h</p>
<p>除了可以手工通过kubectl scale 命令完成 Pod 的扩容和缩容操作，Kubernetes v1.1版本新增 了名次 Horizontal Pod Autoscaler （HPA）的控制器，用于实现基于 CPU 使用率进行自动Pod扩 缩容的功能。HPA 控制器基于 Master 的 kube-controller-manager 服务启动参数--horizontal- pod-autoscaler-sync-period 定义的时长（默认为30秒），周期性地监测目标Pod 的CPU 使用率， 并在满足条件时对 ReplicationController 或 Deployment 中的Pod 副本数量进行调整，以符合用 户定义的平均 Pod CPU 使用率。Pod CPU 使用率来源于 heapster 组件，所以需要预先安装好 heapster。</p>
<p>创建HPA 时可以使用kubectl autoscale 命令进行快速创建或者使用yaml配置文件进行创建。</p>
<p>在创建 HPA之前，需要已经存在一个 RC或 Deployment 对象，并且该 RC或 Deployment 中的 Pod 必须定义 resources.requests.cpu 的资源请求值，如果不设置该值，则heapster 将无法采集到 该Pod 的CPU 使用情况，会导致HPA 无法正常工作。</p>
<p>下面通过给一个 RC设置 HPA，然后使用一个客户端对其进行压力测试，对HPA的用法进 行示例。</p>
<p>以 php-apache 的RC 为例，设置 cpu request 为200m，未设置 limit 上限的值：</p>
<p>Php-apache-rc.yaml apiVersion: v1</p>
<p>kind: ReplicationController metadata：</p>
<p>• 136</p>
<h2>第 150 页</h2>
<h3>第2章</h3>
<p>Kubernetes 实践指南</p>
<p>name:php-apache</p>
<p>spec：</p>
<p>replicas: 1</p>
<p>template：</p>
<p>metadata：</p>
<p>name:php-apache</p>
<p>labels：</p>
<p>app: Php-apache</p>
<p>SpeC：</p>
<p>- name: php-apache image: gcr.io/google_containers/hpa-example resources：</p>
<p>requests：</p>
<p>cpu:200m</p>
<p>ports：</p>
<p>- containerPort: 80 # kubect1 create -f php-apache-rc.yaml replicationcontroller &quot;php-apache&quot;created 再创建一个 php-apache 的 Service，供客户端访问：</p>
<p>Php-apache-svc.yaml apiVersion:v1</p>
<p>kind:Service</p>
<p>metadata：</p>
<p>name:php-apache</p>
<p>spec：</p>
<p>ports：</p>
<p>- port: 80</p>
<p>selector：</p>
<p>app: php-apache</p>
<p># kubectl create -f php-apache-svc.yaml service &quot;php-apache&quot; created 接下来为 RC “php-apache” 创建一个 HPA 控制器，在1和10之间调整Pod 的副本数量， 以使得平均Pod CPU 使用率维持在50%。</p>
<p>使用 kubectl autoscale 命令进行创建：</p>
<p># kubectl autoscale ro php-apache --min=1 --max=10 --cpu-percent=50 或者通过 yaml 配置文件来创建 HPA，需要在 scaleTargetRef 字段指定需要管理的RC或 Deployment 的名字，然后设置 minReplicas、maxReplicas 和 targetCPUUtilizationPercentage 参数：</p>
<p>hpa-php-apache.yaml apiVersion: autoscaling/vl •137．</p>
<h2>第 151 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） kind:HorizontalPodAutoscaler metadata：</p>
<p>name:php-apache</p>
<p>spec：</p>
<p>scalerargetRef：</p>
<p>apiVersion: vl</p>
<p>kind:ReplicationController name:php-apache</p>
<p>minReplicas: 1</p>
<p>maxReplicas: 10</p>
<p>targetCPUUtilizationPercentage: 50 # kubectl create -f hpa-php-apache.yaml horizontalpodautoscaler &quot;php-apache&quot; created 查看已创建的HPA：</p>
<p># kubectl get hpa</p>
<p>NAME</p>
<p>REFERENCE</p>
<p>TARGET</p>
<p>CURRENT MINPODS</p>
<p>MAXPODS AGE</p>
<p>php-apache ReplicationController/php-apache 50% 0%</p>
<p>1</p>
<p>10</p>
<p>然后，我们创建一个 busybox Pod，用于对 php-apache 服务发起压力测试的请求：</p>
<p>busybox-pod.yaml</p>
<p>apiversion:v1</p>
<p>kind:Pod</p>
<p>metadata：</p>
<p>name:busybox</p>
<p>spec：</p>
<p>containers：</p>
<p>- name:busybox</p>
<p>image: busybox</p>
<p>command：［ &quot;sleep&quot;， &quot;3600&quot;］</p>
<p>1m</p>
<p># kubect1 create -f busybox-pod.yaml pod &quot;busybox&quot;created 登录 busybox 容器，执行一个无限循环的wget 命令来访问 php-apache 服务：</p>
<p># while true; do wget -9 -0- http: //php-apache &gt; /dev/nul1; done 注意这里 wget 的目的地URL 地址是 Service 的名称“php-apache”，这要求 DNS 服务正常 工作，也可以使用 Service 的虚拟 ClusterIP 地址对其进行访问，例如 http://169.169.122.145：</p>
<p># kubectl exec -ti busybox -- sh / # while true; do wget -q -0- http://php-apache &gt; /dev/nu11；</p>
<p>done</p>
<p>等待一段时间后，观察 HPA 控制器搜集到的 Pod CPU 使用率：</p>
<p># kubectl get hpa</p>
<p>• 138•</p>
<h2>第 152 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>NAME</p>
<p>REFERENCE</p>
<p>TARGET</p>
<p>CURRENT</p>
<p>MINPODS MAXPODS AGE php-apache</p>
<p>ReplicationController/php-apache 50% 3068号</p>
<p>1</p>
<p>10</p>
<p>3m</p>
<p>再过一会儿，查看 RC php-apache 副本数量的变化：</p>
<p># kubectl get rc</p>
<p>NAME</p>
<p>DESIRED</p>
<p>CURRENT</p>
<p>AGE</p>
<p>php-apache 10</p>
<p>10</p>
<p>23m</p>
<p>可以看到HPA已经根据Pod 的CPU 使用率的提高对RC进行了自动扩容，Pod副本数量变 成了10个。这个过程如图2.14所示。</p>
<p>HPA</p>
<p>HPA</p>
<p>heapster</p>
<p>heapster</p>
<p>Royae</p>
<p>自动</p>
<p>扩容</p>
<p>RC/Daploynent</p>
<p>Pod</p>
<p>图 2.14</p>
<p>HPA 自动扩容</p>
<p>最后，我们停止压力测试，在busybox 的控制台输入Ctrl+C，停止无限循环操作。</p>
<p>等待一段时间，观察 HPA 的变化：</p>
<p># kubectl get hpa</p>
<p>NAME</p>
<p>REFERENCE</p>
<p>TARGET</p>
<p>php-apache</p>
<p>ReplicationController/php-apache CURRENT</p>
<p>508</p>
<p>MINPODS</p>
<p>30</p>
<p>1</p>
<p>MAXPODS</p>
<p>10</p>
<p>再次查看RC的副本数量：</p>
<p>AGE</p>
<p>20m</p>
<p>NAME</p>
<p>php-apache</p>
<p>了1个。</p>
<p>DESIRED CURRENT</p>
<p>1</p>
<p>AGE</p>
<p>1</p>
<p>26m</p>
<p>可以看到 HPA根据Pod CPU 使用率的降低对副本数量进行了缩容操作，Pod副本数量变成 当前 HPA 还只支持将 CPU 使用率作为Pod 副本扩容缩容的触发条件，在将来的版本中， 将会支持应用相关的指标例如 QPS （queries per second）或平均响应时间作为触发条件。</p>
<h3>2.4.10 Pod 的滚动升级</h3>
<p>下面我们说说Pod的升级问题。</p>
<p>当集群中的某个服务需要升级时，我们需要停止目前与该服务相关的所有Pod，然后重新 • 139•</p>
<h2>第 153 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 拉取镜像并启动。如果集群规模比较大，则这个工作就变成了一个挑战，而且先全部停止然后 逐步升级的方式会导致较长时间的服务不可用。Kubernetes 提供了 rolling-update（滚动升级） 功能来解决上述问题。</p>
<p>滚动升级通过执行 kubectl rolling-update 命令一键完成，该命令创建了一个新的RC，然后 自动控制旧的RC中的Pod副本的数量逐渐减少到0，同时新的RC中的Pod副本的数量从0 逐步增加到目标值，最终实现了Pod 的升级。需要注意的是，系统要求新的 RC 需要与旧的 RC 在相同的命名空间（Namespace）内，即不能把别人的资产偷偷转移到自家名下。滚动升级的过 程如图2.15所示。</p>
<p>2国国@</p>
<p>图2.15 Pod 的滚动升级</p>
<p>以 redis-master 力例，假设当前运行的 redis-master Pod 是1.0版本，则现在需要升级到2.0 版本。</p>
<p>创建 redis-master-controller-v2.yaml 的配置文件如下：</p>
<p>apiversion:v1</p>
<p>kind:ReplicationController metadata：</p>
<p>name: redis-master-v2 labels：</p>
<p>name: redis-master version: v2</p>
<p>speC：</p>
<p>replicas: 1</p>
<p>selector：</p>
<p>name: redis-master version: v2</p>
<p>template：</p>
<p>metadata：</p>
<p>labels：</p>
<p>name: redis-master version: v2</p>
<p>speC：</p>
<p>containers：</p>
<p>• 140</p>
<h2>第 154 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>- name: master</p>
<p>image:kubeguide/redis-master:2.0 ports：</p>
<p>- containerPort: 6379 在配置文件中需要注意以下几点。</p>
<p>（1） RC的名字（name）不能与旧的RC 的名字相同。</p>
<p>（2）在 selector 中应至少有一个Label与旧的RC的Label 不同，以标识其为新的RC。本例 中新增了一个名为version 的Label，以与旧的RC进行区分。</p>
<p>运行 kubectl rolling-update 命令完成 Pod 的滚动升级：</p>
<p>kubectl rolling-update redis-master -f redis-master-controller-v2.yaml kubectl 的执行过程如下：</p>
<p>Creating</p>
<p>redis-master-v2</p>
<p>At beginning of loop: redis-master replicas: 2, redis-master-v2 replicas: 1 Updating redis-master replicas: 2, redis-master-v2 replicas: 1 At end of loop:redis-master replicas: 2, redis-master-v2 replicas: 1 At beginning of loop: redis-master replicas: 1,redis-master-v2 replicas: 2 Updating redis-master replicas: 1, redis-master-v2 replicas: 2 At end of loop: redis-master replicas: 1, redis-master-v2 replicas: 2 At beginning of loop: redis-master replicas: 0, redis-master-v2 replicas: 3 Updating redis-master replicas: 0, redis-master-v2 replicas: 3 At end of loop:redis-master replicas: 0, redis-master-v2 replicas: 3 Update|</p>
<p>succeeded. Deleting redis-master redis-master-v2</p>
<p>等所有新的Pod启动完成后，旧的Pod 也被全部销毁，这样就完成了容器集群的更新工作。</p>
<p>另一种方法是不使用配置文件，直接用 kubectl rolling-update 命令，加上-image 参数指定 新版镜像名称来完成 Pod 的滚动升级：</p>
<p>kubectl rolling-update redis-master --image=redis-master:2.0 与使用配置文件的方式不同，执行的结果是旧的RC被删除，新的RC仍将使用旧的RC的 名字。</p>
<p>kubectl 的执行过程如下：</p>
<p>Creating redis-master-ea866a5d2c08588c3375b86fb253db75 At beginning of loop: redis-master replicas: 2, redis-master-ea866a5d2c08588c 3375b86fb253db75 replicas: 1 Updating redis-master replicas: 2,redis-master-ea866a5d2c08588c3375b86fb253db 75</p>
<p>replicas: 1</p>
<p>At end of 100p: redis-master replicas: 2, redis-master-ea866a5d2c08588c3375b86fb 253db15 replicas: 1 At beginning of loop: redis-master replicas: 1, redis-master-ea866a5d2c08588c • 141•</p>
<h2>第 155 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 3375b86fb253db75 replicas： 2 Updating redis-master replicas: 1, redis-master-ea866a5d2c08588c3375b86fb 253db75 replicas: 2 At end of 100p:redis-master replicas: 1,redis-master-ea866a5d2c08588c3375b86fb 253db75 replicas: 2 At beginning of loop: redis-master replicas: 0, redis-master-ea866a5d2c08588c 3375b86fb253db75 replicas: 3 Updating redis-master replicas: 0,redis-master-ea866a5d2c08588c3375b86fb253db 75 replicas: 3</p>
<p>At end of 1oop: redis-master replicas: 0,redis-master-ea866a5d2c08588c3375b86fb 253db75 replicas: 3 Update succeeded. Deleting old controller: redis-master Renaming redis-master-ea866a5d2c08588c3375b86fb253db75 to redis-master redis-master</p>
<p>可以看到，kubectl通过新建一个新版本Pod，停掉一个旧版本Pod，逐步迭代来完成整个 RC 的更新。</p>
<p>更新完成后，查看 RC：</p>
<p>s kubectl get rc</p>
<p>CONTROLLER</p>
<p>CONTAINER （S） IMAGE （S） SELECTOR</p>
<p>redis-master</p>
<p>master</p>
<p>kubeguide/redis-master:2.0 REPLICAS</p>
<p>deployment=</p>
<p>ea866a5d2c08588c3375b86fb253db75,name=redis-master,version=v1 3 可以看到，kubectl 给RC增加了一个key 为“deployment” 的Label（这个key 的名字可通 过--deployment-label-key 参数进行修改），Label 的值是RC的内容进行Hash 计算后的值，相当 于签名，这样就能很方便地比较 RC里的 Image 名字及其他信息是否发生了变化，它的具体作 用可以参见第6章的源码分析。</p>
<p>如果在更新过程中发现配置有误，则用户可以中断更新操作，并通过执行 kubectl rolling- update-rollback 完成 Pod 版本的回滚：</p>
<p>$ kubectl rolling-update redis-master --image=kubeguide/redis-master:2.0 --ro11back Found existing update in progress （redis-master-fefd9752aa5883ca4d53013a7b 583967），resuming.</p>
<p>Found desired replicas.Continuing update with existing controller redis-master.</p>
<p>At beginning of loop: redis-master-fefd9752aa5883ca4d53013a7b583967 replicas：</p>
<p>0， redis-master replicas: 3 Updating redis-master-fefd9752aa5883ca4d53013a7b583967 replicas: 0, redis-master At end of loop: redis-master-fefd9752aa5883ca4d53013a7b583967 replicas: 0， redis-master replicas: 3 Update succeeded. Deleting •redis-master-fefd9752aa5883ca4d53013a7b583967 redis-master</p>
<p>到此，可以看到 Pod 恢复到更新前的版本了。</p>
<p>• 142•</p>
<h2>第 156 页</h2>
<h3>第2章</h3>
<p>Kubernetes 实践指南</p>
<p>25</p>
<p>深入掌握 Service</p>
<p>Service 是 Kubernetes 最核心的概念，通过创建 Service，可以为一组具有相同功能的容器应 用提供一个统一的入口地址，并且将请求进行负载分发到后端的各个容器应用上。本节对 Service 的使用进行详细说明，包括 Service 的负载均衡、外网访问、DNS 服务的搭建、Ingress 7 层路由机制等。</p>
<h3>2.5.1 Service 定义详解</h3>
<p>yaml 格式的 Service 定义文件的完整内容如下：</p>
<p>apiVersion:v1</p>
<p>1/ Required</p>
<p>kind:Service</p>
<p>11 Required</p>
<p>metadata：</p>
<p>1/ Required</p>
<p>name:string</p>
<p>// Required</p>
<p>namespace:string</p>
<p>// Required</p>
<p>labels：</p>
<p>- name: string</p>
<p>annotations：</p>
<p>- name:string</p>
<p>spec：</p>
<p>selector：［］</p>
<p>type:string</p>
<p>1/ Required</p>
<p>1/ Required</p>
<p>11 Required</p>
<p>clusterIP: string</p>
<p>sessionAffinity: string ports：</p>
<p>- name:string</p>
<p>protocol:string</p>
<p>port:int</p>
<p>targetPort: int</p>
<p>nodePort: int</p>
<p>status：</p>
<p>loadBalancer：</p>
<p>ingress：</p>
<p>ip:string</p>
<p>hostname: string</p>
<p>对各属性的说明如表2.17所示。</p>
<p>• 143•</p>
<h2>第 157 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 属性名称</p>
<p>version</p>
<p>kind</p>
<p>metadata</p>
<p>metadata.name</p>
<p>metadata.namespace metadata.labels［］</p>
<p>metadata.annotationl］ spec</p>
<p>spec.selectorl</p>
<p>spec.type</p>
<p>表2.17 对Service 的定义文件模板的各属性的说明 取值类型是否必选</p>
<p>string</p>
<p>Required</p>
<p>string</p>
<p>Required</p>
<p>object</p>
<p>Reguired</p>
<p>string</p>
<p>Required</p>
<p>string</p>
<p>Required</p>
<p>list</p>
<p>list</p>
<p>object</p>
<p>list</p>
<p>Required</p>
<p>Required</p>
<p>string</p>
<p>Required</p>
<p>取值说明</p>
<p>spec.clusterIP</p>
<p>string</p>
<p>spec.sessionAffinity string</p>
<p>spec.portsl</p>
<p>spec.portsl.name</p>
<p>spec.portsl.protocol spec.portsl.port</p>
<p>spec.，ports|l.targetPort spec.portsl］.nodePort Status</p>
<p>list</p>
<p>string</p>
<p>string</p>
<p>int</p>
<p>int</p>
<p>int</p>
<p>object</p>
<p>status.loadBalancer status.loadBalanceringress status.load Balancer.ingress.ip object</p>
<p>object</p>
<p>string</p>
<p>status loadBalanceringress hostuame string v1</p>
<p>Service</p>
<p>元数据</p>
<p>Service 名称，需符合 RFC1035 规范 命名空间，不指定系统时将使用名为“default”的命名空间 自定义标签属性列表</p>
<p>自定义注解属性列表</p>
<p>详细描述</p>
<p>Label Selector 配置，将选择具有指定 Label 标签的Pod 作为 管理范围</p>
<p>Service 的类型，指定 Service 的访问方式，默认为 ClusterlP。</p>
<p>ClusterlP：虚拟的服务 IP 地址，该地址用于 Kubernetes 集群 内部的Pod 访问，在Node 上kube-proxy 通过设置的 iptables 规则进行转发。</p>
<p>NodePort：使用宿主机的端口，使能够访问各 Node 的外部客 户端通过 Node 的IP 地址和端口号就能访问服务。</p>
<p>LoadBalancer：使用外接负载均衡器完成到服务的负载分发， 需要在 spec.status.loadBalancer 字段指定外部负载均衡器的 IP 地址，并同时定义 nodePort 和 clusterIP，用于公有云环境 虚拟服务 IP 地址，当 type=ClusterlP 时，如果不指定，则系 统进行自动分配，也可以手工指定；当 type=LoadBalancer 时，则需要指定</p>
<p>是否支持 Session，可选值为 ClientIP，默认为空。</p>
<p>ClientIP：表示将同一个客户端（根据客户端的IP 地址决定） 的访问请求都转发到同一个后端Pod</p>
<p>Service 需要暴露的端口列表</p>
<p>端口名称</p>
<p>端口协议，支持TCP和UDP，默认为TCP 服务监听的端口号</p>
<p>需要转发到后端 Pod 的端口号</p>
<p>当 spec.type=NodePort 时，指定映射到物理机的端口号 当 spec.type=LoadBalancer 时，设置外部负载均衡器的地址， 用于公有云环境</p>
<p>外部负载均衡器</p>
<p>外部负载均衡器</p>
<p>外部负载均衡器的IP地址</p>
<p>外部负载均衡器的主机名</p>
<p>• 144•</p>
<h2>第 158 页</h2>
<h3>第2章</h3>
<p>Kubernetes 实践指南</p>
<h3>2.5.2 Service 基本用法</h3>
<p>一般来说，对外提供服务的应用程序需要通过某种机制来实现，对于容器应用最简便的方 式就是通过 TCP/P 机制及监听 IP 和端口号来实现。例如，我们定义一个提供 Web 服务的 RC， 由两个 tomcat 容器副本组成，每个容器通过 containerPort 设置提供服务的端口号为 8080：</p>
<p>webapp-rc.yaml</p>
<p>apiversion:v1</p>
<p>kind:ReplicationController metadata：</p>
<p>name:webapp</p>
<p>spec：</p>
<p>replicas:2</p>
<p>template：</p>
<p>metadata：</p>
<p>name:webapp</p>
<p>labels：</p>
<p>app:webapp</p>
<p>spec：</p>
<p>containers：</p>
<p>-name:webapp</p>
<p>image: tomcat</p>
<p>ports：</p>
<p>-containerPort:80</p>
<p>创建该RC：</p>
<p># kubect1 create -f webapp-rc.yaml replicationcontroller &quot;webapp&quot; created 获取Pod 的IP 地址：</p>
<p># kubectl get pods -1 app=webapp -o yaml grep podlP</p>
<p>podIP:172.17.1.4</p>
<p>podIP: 172.17.1.3</p>
<p>访问这两个 Pod 提供的 Tomcat 服务：</p>
<p># curl 172.17.1.3:8080 &lt;！DOCTYPE html&gt;</p>
<p>&lt;html lang=&quot;en&quot;&gt;</p>
<p>&lt;head&gt;</p>
<p>&lt;meta charset=&quot;UTF-8&quot; /&gt; &lt;title&gt;Apache Tomcat/8.0.35&lt;/title&gt; # curi 172.17.1.4:8080 &lt;！DOCTYPE html&gt;</p>
<p>&lt;html lang=&quot;en&quot;&gt;</p>
<p>&lt;head&gt;</p>
<p>• 145</p>
<h2>第 159 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） &lt;meta charset=&quot;UTF-8&quot; /&gt; &lt;title&gt;Apache Tomcat/8.0.35&lt;/title&gt; ••••••</p>
<p>直接通过Pod 的IP 地址和端口号可以访问容器应用，但是Pod 的IP地址是不可靠的，例 如当Pod 所在的Node发生故障时，Pod 将被 Kubernetes 重新调度到另一台Node进行启动，Pod 的IP 地址将发生变化。更重要的是，如果容器应用本身是分布式的部署方式，通过多个实例共 同提供服务，就需要在这些实例的前端设置一个负载均衡器来实现请求的分发。Kubernetes 中 的 Service 就是设计出来用于解决这些问题的核心组件。</p>
<p>以前面创建的webapp 应用为例，为了让客户端应用能够访问到两个 Tomcat Pod 实例，需 要创建一个 Service 来提供服务。Kubernetes 提供了一种快速的方法，即通过 kubectl expose 命 令来创建 Service：</p>
<p># kubectl expose rC webapp service&quot;webapp&quot; exposed 查看新创建的 Service，可以看到系统它分配了一个虚拟的 IP 地址（ClusterIP），而 Service 所需的端口号则从 Pod 中的 containerPort 复制而来：</p>
<p># kubectl get svc</p>
<p>NAME</p>
<p>CLUSTER-IP</p>
<p>EXTERNAL-IP</p>
<p>webapp</p>
<p>169.169.235.79</p>
<p>&lt;none&gt;</p>
<p>PORT （S）</p>
<p>8080/TCP</p>
<p>AGE</p>
<p>3s</p>
<p>接下来，我们就可以通过Service 的IP 地址和 Service 的端口号访问该 Service 了：</p>
<p># cur1 169.169.235.79:8080 &lt;！DOCTYPE html&gt;</p>
<p>&lt;html lang=&quot;en&quot;&gt;</p>
<p>&lt;head&gt;</p>
<p>&lt;meta charset=&quot;UTE-8&quot; /&gt; &lt;title&gt;Apache Tomcat/8.0.35&lt;/title&gt; ⋯••</p>
<p>这里，对 Service 地址 169.169.235.79:8080 的访问被自动负载分发到了后端两个 Pod 之一：</p>
<p>172.17.1.3:8080或 172.17.1.4:8080。</p>
<p>除了使用 kubectl expose 命令创建 Service，我们也可以通过配置文件定义 Service，再通过 kubectl create 命令进行创建。例如对于前面的 webapp 应用，我们可以设置一个 Service，代码 如下：</p>
<p>apiversion: v1</p>
<p>kind: Service</p>
<p>metadata：</p>
<p>name:webapp</p>
<p>spec：</p>
<p>ports：</p>
<p>• 146•</p>
<h2>第 160 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>- port:8081</p>
<p>targetPort:8080</p>
<p>selector：</p>
<p>app:webapp</p>
<p>Service 定义中的关键字段是 ports 和 selector。本例中 ports 定义部分指定了 Service 所需的 虚拟端口号为 8081，由于与Pod 容器端口号 8080 不一样，所以需要再通过 targetPort 来指定后 端 Pod 的端口号。selector 定义部分设置的是后端Pod 所拥有的 label:app=webapp。</p>
<p>创建该 Service 并查看其 ClusterIP 地址：</p>
<p># kubectl create -f webapp-svC.yaml service &quot;webapp&quot; created # kubectl get svc</p>
<p>NAME</p>
<p>CLUSTER-IP</p>
<p>webapp</p>
<p>169.169.28.190</p>
<p>EXTERNAL-IP</p>
<p>&lt;none〉</p>
<p>通过 Service 的IP 地址和 Service 的端口号进行访问：</p>
<p># cur1 169.169.28.190:8081 &lt;！DOCTYPE html&gt;</p>
<p>&lt;html lang=&quot;en&quot;&gt;</p>
<p>&lt;head&gt;</p>
<p>PORT （S）</p>
<p>8081/TCP</p>
<p>AGE</p>
<p>3s</p>
<p>&lt;meta charset=&quot;UTF-8&quot; /&gt; &lt;title&gt;Apache Tomcat/8.0.35&lt;/title&gt; ⋯•••</p>
<p>同样，对 Service 地址 169.169.28.190:8081 的访问被自动负载分发到了后端两个 Pod 之一：</p>
<p>172.17.1.3:8080 或 172.17.1.4:8080。目前 Kubernetes 提供了两种负载分发策略：RoundRobin 和 SessionAffinity，具体说明如下。</p>
<p>RoundRobin：轮询模式，即轮询将请求转发到后端的各个 Pod上。</p>
<p>SessionA ffinity：基于客户端IP 地址进行会话保持的模式，即第1次将某个客户端发起 的请求转发到后端的某个 Pod 上，之后从相同的客户端发起的请求都将被转发到后端 相同的Pod 上。</p>
<p>在默认情况下，Kubernetes 采用 RoundRobin 模式进行路由选择，但我们也可以通过将 service.spec.sessionA ffinity 设置为“ClientIP”来启用 SessionA ffinity 策略，这样，同一个客户 端发来的请求就会建立一个 Session，并且对应到后端固定的某个 Pod上了。</p>
<p>在某些应用场景中，开发人员希望自己控制负载均衡的策略，不使用 Service 提供的默认负 载均衡的功能，Kubernetes 通过Headless Service 的概念来实现这种功能，即不给 Service 设置 ClusterIP（无入口 IP 地址），而仅通过Label Selector 将后端的Pod列表返回给调用的客户端。</p>
<p>例如：</p>
<p>• 147•</p>
<h2>第 161 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） apiVersion:v1</p>
<p>kind:Service</p>
<p>metadata：</p>
<p>name:nginx</p>
<p>labels：</p>
<p>app:nginx</p>
<p>spec：</p>
<p>ports：</p>
<p>- port:80</p>
<p>clusterIP:None</p>
<p>selector：</p>
<p>app:nginx</p>
<p>该 Service没有虚拟的 ClusterIP 地址，对其进行访问将获得具有Label “app=nginx”的全部 Pod 列表，然后客户端程序需要实现自己的负载分发策略，再确定访问具体哪一个后端的 Pod。</p>
<p>在某些环境中，应用系统需要将一个外部数据库作为后端服务进行连接，或将另一个集群 或 Namespace 中的服务作为服务的后端，这时可以通过创建一个无 Label Selector 的 Service 来 实现：</p>
<p>kind: Service</p>
<p>apiVersion: v1</p>
<p>metadata：</p>
<p>name: my-service</p>
<p>speC：</p>
<p>ports：</p>
<p>- protocol:TCP</p>
<p>port: 80</p>
<p>targetPort: 80</p>
<p>通过该定义创建的是一个不带标签选择器的 Service，即无法选择后端的Pod，系统不会自 动创建 Endpoint，因此需要手动创建一个和该 Service 同名的 Endpoint，用于指向实际的后端访 问地址。创建 Endpoint 的配置文件内容如下：</p>
<p>kind: Endpoints</p>
<p>apiVersion:v1</p>
<p>metadata：</p>
<p>name:my-service</p>
<p>subsets：</p>
<p>- addresses：</p>
<p>- IP:1.2.3.4</p>
<p>Ports：</p>
<p>- port:80</p>
<p>如图2.16所示，访问没有标签选择器的 Service 和带有标签选择器的 Service 一样，请求将 会被路由到由用户手动定义的后端 Endpoint 上。</p>
<p>• 148•</p>
<h2>第 162 页</h2>
<h3>第2章</h3>
<p>Kubernetes 实践指南</p>
<p>ClusterA</p>
<p>ClusterB</p>
<p>图2.16 Service 指向外部服务 有时，一个容器应用也可能提供多个端口的服务，所以在 Service 的定义中也可以相应地设 置为多个端口。在下面的例子中，Service 设置了两个端口号，并且为每个端口号进行了命名：</p>
<p>apiversion:v1</p>
<p>kind:Service</p>
<p>metadata：</p>
<p>name:webapp</p>
<p>spec：</p>
<p>ports：</p>
<p>- port:8080</p>
<p>targetPort:8080</p>
<p>name:web</p>
<p>- port:8005</p>
<p>targetPort:8005</p>
<p>name:management</p>
<p>selector：</p>
<p>app:webapp</p>
<p>另一个例子是两个端口号使用了不同的4层协议，即 TCP或 UDP：</p>
<p>apiversion:v1</p>
<p>kind:Service</p>
<p>metadata：</p>
<p>name: kube-dns</p>
<p>namespace: kube-system labels：</p>
<p>k8s-app: kube-dns</p>
<p>kubernetes.io/cluster-service： &quot;true&quot; kubernetes.io/name：&quot;KubeDNS&quot; speC：</p>
<p>selector：</p>
<p>k8s-app: kube-dns</p>
<p>clusterIP: 169.169.0.100 ports：</p>
<p>- name: dns</p>
<p>port: 53</p>
<p>• 149•</p>
<h2>第 163 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） protocol:UDP</p>
<p>- name:dns-tcp</p>
<p>port:53</p>
<p>protocol: TCP</p>
<h3>2.5.3 集群外部访问 Pod 或 Service</h3>
<p>由于 Pod 和 Service 是 Kubernetes 集群范围内的虚拟概念，所以集群外的客户端系统无法通 过Pod 的IP 地址或者 Service 的虚拟IP 地址和虚拟端口号访问到它们。为了让外部客户端可以 访问这些服务，可以将Pod 或 Service 的端口号映射到宿主机，以使得客户端应用能够通过物理 机访问容器应用。</p>
<p>1. 将容器应用的端口号映射到物理机 （1）通过设置容器级别的 hostPort，将容器应用的端口号映射到物理机上：</p>
<p>pod-hostport.yaml</p>
<p>apiversion:v1</p>
<p>kind: Pod</p>
<p>metadata：</p>
<p>name:webapp</p>
<p>labels：</p>
<p>app:webapp</p>
<p>spec：</p>
<p>containers：</p>
<p>- name:webapp</p>
<p>image: tomcat</p>
<p>ports：</p>
<p>- containerPort: 8080 hostPort:8081</p>
<p>通过 kubectl create 命令创建这个 Pod：</p>
<p># kubectl create -f pod-hostport.yaml pod &quot;webapp&quot; created 通过物理机的 IP地址和8081端口号访问 Pod 内的容器服务：</p>
<p># cur1 192.168.18.3:8081 &lt;！DOCTYPE html&gt;</p>
<p>&lt;html lang=&quot;en&quot;&gt;</p>
<p>&lt;head&gt;</p>
<p>&lt;meta charset=&quot;UTF-8&quot; /&gt; &lt;title&gt;Apache Tomcat/8.0.35&lt;/title&gt; • 150•</p>
<h2>第 164 页</h2>
<h3>第2章</h3>
<p>Kubernetes 买践指南</p>
<p>（2）通过设置 Pod 级别的 hostNetwork=true，该Pod 中所有容器的端口号都将被直接映射 到物理机上。设置 hostNetwork=true 时需要注意，在容器的 ports 定义部分如果不指定 hostPort， 则默认 hostPort 等于 containerPort，如果指定了 hostPort，则 hostPort 必须等于 containerPort 的值。</p>
<p>pod-hostnetwork.yaml apiVersion:v1</p>
<p>kind:Pod</p>
<p>metadata：</p>
<p>name: webapp</p>
<p>labels：</p>
<p>app:webapp</p>
<p>spec：</p>
<p>hostNetwozk:true</p>
<p>containers：</p>
<p>- name:webapp</p>
<p>image:tomcat</p>
<p>imagePul1Policy: Never ports：</p>
<p>- containerPort: 8080 创建这个 Pod：</p>
<p># kubect1 create -f pod-hostnetwork.yaml pod &quot;webapp&quot; created 通过物理机的IP 地址和8080端口号访问Pod 内的容器服务：</p>
<p># cur1 192.168.18.4:8080 &lt;！DOCTYPE html&gt;</p>
<p>&lt;html lang=&quot;en&quot;&gt;</p>
<p>&lt;head&gt;</p>
<p>&lt;meta charset=&quot;UTF-8&quot; /&gt; &lt;title&gt;Apache Tomcat/8.0.35&lt;/title&gt; 2. 将 Service 的端口号映射到物理机 （1）通过设置 nodePort 映射到物理机，同时设置 Service 的类型 NodePort：</p>
<p>apiVersion:v1</p>
<p>kind:Service</p>
<p>metadata：</p>
<p>name:webapp</p>
<p>spec：</p>
<p>type: NodePort</p>
<p>ports：</p>
<p>- port:8080</p>
<p>targetPort:8080</p>
<p>• 151</p>
<h2>第 165 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） nodePort:8081</p>
<p>selector：</p>
<p>app:webapp</p>
<p>创建这个Service：</p>
<p># kubectl create -f webapp-svc-nodeport.yaml You have exposed your service on an external port on all nodes in your cluster.</p>
<p>If you want to expose this service to the external internet, you may need to set up firewall rules for the service port （s） （tcp:8081） to serve traffic.</p>
<p>See http://releases.k8s.io/release-1.3/docs/user-guide/services-firewalls.md for more details.</p>
<p>service &quot;webapp&quot; created 系统提示信息说明：由于要使用物理机的端口号，所以需要在防火墙上做好相应的配置， 以使得外部客户端能够访问到该端口。</p>
<p>通过物理机的 IP地址和 nodePort 8081 端口号访问服务：</p>
<p># curl 192.168.18.3:8081 &lt;！DOCTYPE html&gt;</p>
<p>&lt;html lang=&quot;en&quot;&gt;</p>
<p>&lt;head&gt;</p>
<p>&lt;meta charset=&quot;UTF-8&quot; /&gt; &lt;title&gt;Apache Tomcat/8.0.35&lt;/title&gt; •••••</p>
<p>同样，对该 Service 的访问也将被负载分发到后端的多个 Pod上。</p>
<p>（2）通过设置LoadBalancer 映射到云服务商提供的LoadBalancer 地址。这种用法仅用于在 公有云服务提供商的云平台上设置 Service 的场景。在下面的例子中，status.loadBalancer.</p>
<p>ingress.ip 设置的 146.148.47.155 为云服务商提供的负载均衡器的IP 地址。对该 Service 的访问 请求将会通过 LoadBalancer 转发到后端Pod上，负载分发的实现方式则依赖于云服务商提供的 LoadBalancer 的实现机制。</p>
<p>kind:Service</p>
<p>apiVersion: v1</p>
<p>metadata：</p>
<p>name:my-service</p>
<p>spec：</p>
<p>selector：</p>
<p>app: MyApp</p>
<p>ports：</p>
<p>- protocol:TCP</p>
<p>port:80</p>
<p>targetPort:9376</p>
<p>nodePort: 30061</p>
<p>• 152</p>
<h2>第 166 页</h2>
<h3>第2章</h3>
<p>Kubernetes 实践指南</p>
<p>clusterIP:10.0.171.239 loadBalancerIP: 78.11.24.19 type: LoadBalancer status：</p>
<p>1oadBalancer：</p>
<p>ingress：</p>
<p>- ip：146.148.47.155</p>
<h3>2.5.4 DNS 服务搭建指南</h3>
<p>根据第1章对 Service 概念的说明，为了能够通过服务的名字在集群内部进行服务的相互访 问，需要创建一个虚拟的 DNS服务来完成服务名到 ClusterIP 的解析。本节将对如何搭建 DNS 服务进行详细说明。</p>
<p>Kubernetes 提供的虚拟 DNS 服务名 skydns，由四个组件组成。</p>
<p>（1） etcd: DNS 存储。</p>
<p>（2） kube2sky：将 Kubernetes Master 中的 Service（服务）注册到 etcd。</p>
<p>（3） skyDNS：提供 DNS 域名解析服务。</p>
<p>（4） healthz：提供对 skydns 服务的健康检查功能。</p>
<p>图 2.17描述了 Kuberetes DNS 服务的总体架构。</p>
<p>Kubernetes</p>
<p>Master</p>
<p>获取Service</p>
<p>信息</p>
<p>（00823k</p>
<p>DNS查询</p>
<p>Service-&gt;IP</p>
<p>Pod</p>
<p>Node1</p>
<p>•访问Service</p>
<p>Kupe-PrONg</p>
<p>转发到Pod</p>
<p>Node 2</p>
<p>图 2.17</p>
<p>Kubernetes DNS 服务的总体架构 • 153•</p>
<h2>第 167 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 1. skydns 配置文件说明</p>
<p>skydns 服务由一个 RC 和一个 Service 的定义组成，分别由配置文件skydns-rc.yaml 和 skydns-svc.yaml 定义。</p>
<p>skydns 的RC 配置文件 skydns-rc.yaml 的内容如下，包含了4个容器的定义：</p>
<p>kydns-rc.yam</p>
<p>piversion: v.</p>
<p>kind:ReplicationController metadata：</p>
<p>name:kube-dns-v11</p>
<p>namespace: kube-system labels：</p>
<p>k8s-app: kube-dns</p>
<p>kubernetes.io/cluster-service： &quot;true&quot; replicas: 1</p>
<p>selector：</p>
<p>k8s-app: kube-dns</p>
<p>version: v11</p>
<p>template：</p>
<p>metadata：</p>
<p>labels：</p>
<p>k8s-app: kube-dns</p>
<p>version: v11</p>
<p>kubernetes.io/cluster-service：&quot;true&quot; spec：</p>
<p>limits：</p>
<p>Cpu:100m</p>
<p>memory: 50Mi</p>
<p>requests：</p>
<p>cpu:100m</p>
<p>memory: 50Mi</p>
<p>command：</p>
<p>- /usr/local/bin/etcd - -data-dir</p>
<p>- /tmp/data</p>
<p>- -listen-client-urls - http://127.0.0.1:2379,http://127.0.0.1:4001 - -advertise-client-urls - http://127.0.0.1:2379,http://127.0.0.1:4001 • 154</p>
<h2>第 168 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>- -initial-cluster-token - skydns-etcd</p>
<p>volumeMounts：</p>
<p>- name: etcd-storage mountPath: /tmp/data - name:kube2sky</p>
<p>image:gcr.io/google_containers/kube2sky-amd64:1.15 resourceS：</p>
<p>1imits：</p>
<p>cpu: 100m</p>
<p># Kube2sky</p>
<p>watches all pods.</p>
<p>memory: 50Mi</p>
<p>requests：</p>
<p>cpu: 100m</p>
<p>memory: 50Mi</p>
<p>1ivenessProbe：</p>
<p>httpGet：</p>
<p>path: /healthz</p>
<p>port: 8080</p>
<p>scheme: HTTP</p>
<p>initialDelaySeconds: 60 timeoutSeconds: 5</p>
<p>successThreshold: 1 failureThreshold：</p>
<p>5</p>
<p>readinessProbe：</p>
<p>httpGet：</p>
<p>path: /readiness</p>
<p>port:8081</p>
<p>scheme: HTTP</p>
<p># we poll on pod startup for the Kubernetes master service and</p>
<p># only</p>
<p>setup the /readiness HTTP server once that&#x27;s available.</p>
<p>initialDelaySeconds: 30 timeoutSeconds: 5</p>
<p># command = &quot;/kube2sky&quot; - --kube-master-ur1=http://192.168.18.3:8080 ---domain=cluster.local - name: skydns</p>
<p>image:gcr.io/google_containers/skydns:2015-10-13-8c72£8c resources：</p>
<p>1imits：</p>
<p>Cpu: 100m</p>
<p>memory:50Mi</p>
<p>requests：</p>
<p>cpu:100m</p>
<p>memory：</p>
<p>50Mi</p>
<p>args：</p>
<p>• 155•</p>
<h2>第 169 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） # command = &quot;/skydns&quot; - -machines=http://127.0.0.1:4001 - -addr=0.0.0.0:53 - -ns-rotate=false - -domain=cluster.1ocal ports：</p>
<p>- containerPort: 53 name:dns</p>
<p>protocol:UDP</p>
<p>- containerPort: 53 name:dns-tcp</p>
<p>protocol:TCP</p>
<p>- name: healthz</p>
<p>image:ger.io/google_containers/exechealthz:1.0 resources：</p>
<p># keep request = limit to keep this container in guaranteed class limits：</p>
<p>cpu:10m</p>
<p>memory: 20Mi</p>
<p>requests：</p>
<p>cpu:10m</p>
<p>memory:20Mi</p>
<p>args：</p>
<p>- -cnd=nslookup kubernetes.default.svc.cluster.local 127.0.0.1 &gt;/dev/nul1 - -port=8080</p>
<p>ports：</p>
<p>- containerPort: 8080 protocol:TCP</p>
<p>volumes：</p>
<p>- name: etcd-storage emptyDir:0｝</p>
<p>dnsPolicy: Default # Don&#x27;t use cluster DNS.</p>
<p>需要修改的几个配置参数如下。</p>
<p>（1） kube2sky 容器需要访问 Kubernetes Master，需要配置 Master 所在物理主机的IP 地址和 端口号，本例中设置参数--kube_master_url 的值为 http://192.168.18.3:8080。</p>
<p>（2） kube2sky 容器和 skydns 容器的启动参数--domain，设置 Kubernetes 集群中 Service 所属 的域名，本例中为“cluster.local”。启动后，kube2sky 会通过 API Server 监控集群中全部 Service 的定义，生成相应的记录并保存到 etcd 中。kube2sky 为每个 Service 生成以下两条记录。</p>
<p>&lt;service_name&gt;.&lt;namespace_name&gt;.&lt;domain&gt;。</p>
<p>&lt;service_name&gt;.&lt;namespace_name&gt;.svc.&lt;domain&gt;。</p>
<p>（3） skydns 的启动参数-addr=0.0.0.0:53表示使用本机 TCP 和UDP 的53端口提供服务。</p>
<p>• 156•</p>
<h2>第 170 页</h2>
<h3>第2章</h3>
<p>Kubernetes 实践指南</p>
<p>skydns 的 Service 配置文件 skydns-svc.yaml 的内容如下：</p>
<p>skydns-svC.yaml</p>
<p>apiVersion:v1</p>
<p>kind:Service</p>
<p>metadata：</p>
<p>name:kube-dns</p>
<p>namespace: kube-system labels：</p>
<p>k8s-app:kube-dns</p>
<p>kubernetes.io/cluster-service：&quot;true&quot; kubernetes.io/name：</p>
<p>&quot;KubeDNS&quot;</p>
<p>spec：</p>
<p>selector：</p>
<p>k8s-app:kube-dns</p>
<p>clusterIP:169.169.0.100 ports：</p>
<p>-name:dns</p>
<p>Port : 53</p>
<p>protocol:UDP</p>
<p>- name:dns-tcp</p>
<p>port:53</p>
<p>ProtoCol:TCP</p>
<p>注意，skydns 服务使用的 clusterIP 需要我们指定一个固定的IP 地址，每个 Node 的kubelet 进程都将使用这个 IP 地址，不能通过 Kubernetes 自动分配。</p>
<p>另外，这个 IP 地址需要在 kube-apiserver 启动参数--service-cluster-ip-range 指定的IP地址 范围内。</p>
<p>在创建 skydns 容器之前，先修改每个 Node 上kubelet 的启动参数。</p>
<p>2. 修改每台 Node上的 kubelet 启动参数 修改每台 Node 上 kubelet 的启动参数，加上以下两个参数。</p>
<p>--cluster_dns=169.169.0.100：为 DNS 服务的 ClusterIP 地址。</p>
<p>--cluster_domain=cluster.local： 为 DNS 服务中设置的域名。</p>
<p>然后重启 kubelet 服务。</p>
<p>3. 创建 skydns RC 和 Service 通过 kubectl create 完成 skydns 的RC 和 Service 的创建：</p>
<p># kubectl create -f skydns-rc.yaml • 157•</p>
<h2>第 171 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） # kubectl create -f skydns-svc.yaml 查看 RC、Pod 和 Service，确保容器成功启动：</p>
<p># kubect1 get rc --namespace=kube-system NAME</p>
<p>DESIRED</p>
<p>kube-dns-v11</p>
<p>1</p>
<p>CURRENT</p>
<p>1</p>
<p>AGE</p>
<p>1d</p>
<p># kubectl get pods --namespace=kube-system NAME</p>
<p>READY</p>
<p>kube-dns-v11-6d1wu 4/4</p>
<p>STATUS</p>
<p>Running</p>
<p>RESTARTS</p>
<p>AGE</p>
<p>1d</p>
<p># kubect1 get services --namespace=kube-system NAME</p>
<p>CLUSTER-IP</p>
<p>EXTERNAL-IP</p>
<p>kube-dns</p>
<p>169.169.0.100</p>
<p>&lt;none&gt;</p>
<p>PORT （S）</p>
<p>53/UDP, 53/TCP</p>
<p>AGE</p>
<p>1d</p>
<p>然后，我们为 redis-master 应用创建一个 Service：</p>
<p>redis-master-service.yaml apiversion:v1</p>
<p>kind:Service</p>
<p>metadata：</p>
<p>name:redis-master</p>
<p>labels：</p>
<p>name:redis-master</p>
<p>spec：</p>
<p>ports：</p>
<p>- port:6379</p>
<p>targetPort:6379</p>
<p>selector：</p>
<p>name: redis-master 查看创建好的 redis-master service：</p>
<p># kubect1 get services NAME</p>
<p>CLUSTER-IP</p>
<p>EXTERNAL-IP</p>
<p>PORT （S）</p>
<p>redis-master</p>
<p>169.169.8.10</p>
<p>&lt;none〉</p>
<p>6379/TCP</p>
<p>AGE</p>
<p>1h</p>
<p>可以看到，系统为 redis-master 服务分配了一个虚拟 IP 地址：169.169.8.10。</p>
<p>到此，在 Kubernetes 集群内的虚拟 DNS 服务就搭建好了。在需要访问 redis-master 的应用 中，仅需要配置上 redis-master Service 的名称和服务的端口号，就能够访问到 redis-master 应用 了，让我们回顾一下 redis-slave 应用需要访问 redis-master 的配置内容：</p>
<p>redis-slave 镜像的启动脚本/run.sh 的内容为：</p>
<p>i£ II S｛GET</p>
<p>HOSTS_FROM：-dns｝== &quot;env&quot; ］］；then redis-server --sLaveof S｛RBDIS_MASTER_SERVICE_HOST） 6379 redis-server --slaveof redis-master 6379 • 158•</p>
<h2>第 172 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>£i</p>
<p>在使用 DNS 模式的情况下，redis-slave 配置的Master 地址为：redis-master:6379。通过服务 名进行配置，能够极大地简化客户端应用对后端服务变化的感知，包括服务虚拟IP 地址的变化、 服务后端Pod 的变化等，对应用程序的微服务架构实现提供了强有力的支撑。</p>
<p>4. 通过 DNS 查找 Service 接下来使用一个带有 nslookup 工具的Pod来验证 DNS 服务是否能够正常工作：</p>
<p>busybox.yaml</p>
<p>apiversion:v1</p>
<p>kind: Pod</p>
<p>metadata：</p>
<p>name:busybox</p>
<p>namespace:default</p>
<p>containers：</p>
<p>- name: busybox</p>
<p>image: gcr.io/google_containers/busybox command：</p>
<p>运行 kubectl create -fbusybox.yaml 完成创建。</p>
<p>在该容器成功启动后，通过 kubectl exec &lt;container_id&gt; nslookup 进行测试：</p>
<p># kubectl exec busybox -- nslookup redis-master Server：</p>
<p>169.169.0.100</p>
<p>Address 1: 169.169.0.100 Name：</p>
<p>redis-master</p>
<p>Address</p>
<p>1:169.169.8.10</p>
<p>可以看到，通过 DNS服务器169.169.0.100成功找到了名为 “redis-master”服务的IP 地址：</p>
<p>169.169.8.10。</p>
<p>如果某个 Service 属于不同的命名空间，那么在进行 Service 查找时，需要带上 namespace 的名字。下面以查找kube-dns 服务为例：</p>
<p># kubectl exec busybox -- nslookup kube-dns.kube-system Server：</p>
<p>169.169.0.100</p>
<p>Address</p>
<p>1: 169.169.0.100</p>
<p>Name：</p>
<p>kube-dns.kube-system Address 1: 169.169.0.100 • 159•</p>
<h2>第 173 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 如果仅使用 “kube-dns” 来进行查找，则将会失败：</p>
<p>nslookup: can&#x27;t resolve &#x27;kube-dns&#x27; 5. DNS 服务的工作原理解析</p>
<p>让我们看看 DNS 服务背后的工作原理。</p>
<p>（1） kube2sky 容器应用通过调用 Kubernetes Master 的API 获得集群中所有 Service 的信息， 并持续监控新 Service 的生成，然后写入 etcd 中。</p>
<p>查看 etcd 中存储的 Service 信息：</p>
<p># kubectl exec kube-dns-v8-5tpm2 -c etcd --namespace=kube-system etcdctl 1s /skydns/local/cluster /skydns/1ocal/cluster/default /skydns/1ocal/cluster/svc /skydns/1oca1/cluster/kube-system 可以看到在 skydns 键下面，根据我们配置的域名（cluster.local）生成了 local/cluster 子键， 接下来是 namespace （default 和 kube-system）和 svc（下面也按 namespace 生成子键）。</p>
<p>查看 redis-master 服务对应的键值：</p>
<p># kubect1 exec kube-dns-v8-5tpm2 -c etcd --namespace=kube-system etcdctl get / skydns/1oca1/cluster/default/redis-master ｛&quot;host&quot;：&quot;169.169.8.10&quot;，&quot;priority&quot;：10，&quot;weight&quot;：10， &quot;ttI&quot;：30，&quot;targetstrip&quot;：0｝ 可以看到，redis-master 服务对应的完整域名 redis-master.default.cluster.local，并且其IP 地址为 169.169.8.10。</p>
<p>（2） 根据 kubelet 启动参数的设置（-cluster_dns），kubelet 会在每个新创建的Pod 中设置 DNS 域名解析配置文件/etc/resolv.conf 文件，在其中增加了一条 nameserver 配置和一条 search 配置：</p>
<p>nameserver 169.169.0.100 search default.svc.cluster.local svc.cluster.local cluster.local localdomain 通过名字服务器169.169.0.100访问的实际上就是skydns 在53端口上提供的DNS解析服务。</p>
<p>（3）最后，应用程序就能够像访问网站域名一样，仅仅通过服务的名字就能访问到服务了。</p>
<p>仍然以 redis-slave 为例，假设已经启动了 redis-slave Pod，登录 redis-slave 容器进行查 看，可以看到其通过 DNS域名服务找到了 redis-master 的IP 地址 169.169.8.10，并成功建立 了连接。</p>
<p>•^&gt;</p>
<h2>第 174 页</h2>
<h3>第2章</h3>
<p>Kubernetes 实践指南</p>
<h3>2.5.5 Ingress: HTTP 7 层路由机制</h3>
<p>根据前面对 Service 的使用说明，我们知道 Service 的表现形式为 IP:Port，即工作在 TCP/IP 层。而对于基于 HTTP的服务来说，不同的URL 地址经常对应到不同的后端服务或者虚拟服务 器 （Virtual Host），这些应用层的转发机制仅通过 Kubernetes 的 Service 机制是无法实现的。</p>
<p>Kubernetes v1.1版本中新增的 Ingress 将不同 URL 的访问请求转发到后端不同的 Service，实现 HTTP 层的业务路由机制。在 Kubernetes 集群中，Ingress 的实现需要通过 Ingress 的定义与 Ingress Controller 的定义结合起来，才能形成完整的HTTP 负载分发功能。</p>
<p>图 2.18显示了一个典型 HTTP 层路由的例子。</p>
<p>◎ 对http://mywebsite.com/api 的访问将被路由到后端名为“api” 的 Service。</p>
<p>◎ 对http:/mywebsite.com/web 的访问将被路由到后端名为“web” 的 Service。</p>
<p>对http:/mywebsite.com/doc 的访问将被路由到后端名为“doc” 的Service。</p>
<p>Internet</p>
<p>/api</p>
<p>mywebsite.com （Ingress Controller） /web</p>
<p>/docs</p>
<p>service：</p>
<p>http://api:80</p>
<p>api</p>
<p>service：</p>
<p>http://web:80</p>
<p>web</p>
<p>图 2.18 Ingress 示例</p>
<p>service：</p>
<p>http://docs:80</p>
<p>docs</p>
<p>1. 创建 Ingress Controller 在定义 Ingress 之前，需要先部署 Ingress Controller，以实现为所有后端 Service 提供一个统 一的入口。Ingress Controller 需要实现基于不同 HTTP URL 向后转发的负载分发规则，通常应 该根据应用系统的需求进行个性化实现。如果公有云服务商能够提供该类型的 HTTP 路由 LoadBalancer，则也可设置其为 Ingress Controller。</p>
<p>在 Kubernetes 中，Ingress Controller 将以 Pod的形式运行，监控 apiserver 的/ingress 接口（在</p>
<h3>1.3 版本中为/apis/extensions/vIbetal/namespaces/&lt;namespace_name&gt;/ingresses 接口）后端的</h3>
<p>backend services，如果 service 发生变化，则 Ingress Controller 应自动更新其转发规则。</p>
<p>在下面的例子中，我们使用 Nginx 来实现一个 Ingress Controller，需要实现的基本逻辑如下。</p>
<p>• 161</p>
<h2>第 175 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） （1） 监听 apiserver，</p>
<p>获取全部 ingress 的定义。</p>
<p>（2） 基于 ingress 的定义，生成 Nginx 所需的配置文件/etc/nginx/nginx.conf。</p>
<p>（3） 执行 nginx -s reload 命令，重新加载 nginx.conf配置文件的内容， 基于 Go 语言的代码实现如下：</p>
<p>for ｛</p>
<p>ratelimiter.Accept （） ingresses,err ：= ingclient.List （labels.Everything（），fields.Everything （）） if err ！= nil I| reflect.DeepEqual （ingresses.Items,known.Items）｛ continue</p>
<p>｝</p>
<p>if w,err ：= os.Create（&quot;/etc/nginx/nginx.conf&quot;）；err ！= nil ｛ log.Fatalf（&quot;Failed to open ev: ev&quot;，nginxConf,err） ｝ else if err ：= tmpl.Execute（w, ingresses）；err！= nil log.Fatalf（&quot;Failed to write template &amp;v&quot;，err） ｝</p>
<p>shel10ut （&quot;nginx -s reload&quot;） ｝</p>
<p>我们可以通过直接下载谷歌提供的 nginx-ingress 镜像来创建 Ingress Controller：</p>
<p>nginx-ingress-rc.yaml apiVersion:v1</p>
<p>kind: ReplicationController metadata：</p>
<p>name: nginx-ingress labels：</p>
<p>app: nginx-ingress spec：</p>
<p>replicas: 1</p>
<p>selector：</p>
<p>app:nginx-ingress</p>
<p>template：</p>
<p>metadata：</p>
<p>labels：</p>
<p>app:nginx-ingress</p>
<p>spec：</p>
<p>containers：</p>
<p>- image: gcr.io/google_containers/nginx-ingress: 0.1 name:nginx</p>
<p>ports：</p>
<p>- containerPort:80 hostPort:80</p>
<p>这里，该Nginx 应用设置了 hostPort，即它将容器应用监听的80端口号映射到物理机，以 使得客户端应用可以通过 URL 地址 “http:/物理机 IP:80” 来访问该 Ingress Controller。</p>
<p>• 162•</p>
<h2>第 176 页</h2>
<h3>第2章 Kubernetes 实践指南</h3>
<p>通过 kubectl create 命令创建该RC：</p>
<p># kubect1 create -f nginx-ingress-rc.yaml replicationcontroller &quot;nginx-ingress&quot; created # kubectl get pods NAME</p>
<p>READY</p>
<p>nginx-ingress-mrvtz 1/1 STATUS RESTARTS</p>
<p>AGE</p>
<p>Running</p>
<p>2s</p>
<p>2. 定义Ingress</p>
<p>为 mywebsite.com 定义 Ingress，设置到后端 Service 的转发规则：</p>
<p>apiversion:extensions/v1betal kind: Ingress</p>
<p>metadata：</p>
<p>name: mywebsite-ingress spec：</p>
<p>rules：</p>
<p>- host：</p>
<p>mywebsite.com</p>
<p>http：</p>
<p>paths：</p>
<p>- path: /web</p>
<p>backend：</p>
<p>serviceName: webapp servicePort: 80</p>
<p>这个 Ingress 的定义说明对目标 URL http://mywebsite.com/web 的访问将被转发到 Kuberetes 的一个 Service 上：webapp:80。</p>
<p>创建该 Ingress：</p>
<p># kubect1 create -f ingress.yaml ingress &quot;mywebsite-ingress&quot; created # kubectl get ingress NAME</p>
<p>HOSTS</p>
<p>ADDRESS</p>
<p>mywebsite-ingress mywebsite.com PORTS</p>
<p>80</p>
<p>AGE</p>
<p>17s</p>
<p>在该 Ingress 成功创建后，登录 nginx-ingress Pod，查看其自动生成的 nginx.conf 配置文件 内容：</p>
<p>events｛</p>
<p>worker_connections 1024；</p>
<p>｝</p>
<p>http｛</p>
<p>server｛</p>
<p>listen 80；</p>
<p>server_name mywebsite.com；</p>
<p># Ingress 中定义的虚拟host名 • 163•</p>
<h2>第 177 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） resolver 127.0.0.1；</p>
<p>location /web ｛</p>
<p>proxy_pass http://webapp；</p>
<p>｝</p>
<p># Ingress 中定义的路径 /web # service 名</p>
<p>｝</p>
<p>｝</p>
<p>3. 访问 http://mywebsite.com/web 由于 Ingress Controller 设置了 hostPort，所以我们可以通过其所在的物理机对其进行访问。</p>
<p>可以在物理机上设置 mywebsite.com对应的IP 地址，也可以通过 curl --resolve 进行指定：</p>
<p>$ curl --resolve mywebsite.com: 80:192.168.18.3 mywebsite.com/f00 将获得 Kubernetes Service “webapp:80”提供的主页。</p>
<p>4. Ingress 的发展路线</p>
<p>当前的 Ingress 还是beta 版本，在 Kubernetes 的后续版本中将增加至少以下功能。</p>
<p>◎ 支持更多 TLS 选项，例如 SNI、重加密等。</p>
<p>支持L4和L7负载均衡策略（目前只支持HTTP 层的规则）。</p>
<p>◎ 支持更多的转发规则（目前仅支持基于 URL 路径的），例如重定向规则、会话保持规 则等。</p>
<p>• 164</p>
</div>
