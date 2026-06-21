---
title: "第1章 Kubernetes 入门"
description: "第1章 Kubernetes 入门 1.1 Kubernetes 是什么 Kubernetes 是什么？ 首先，它是一个全新的基于容器技术的分布式架构领先方案。这个方案虽然还很新，但它 是谷歌十几年以来大规模应用容器技术的经验积累和升华的一个重要成果。确切地说， Kubernetes 是谷歌严格保密十几年的秘密武器—Borg 的一个开源版本。Borg 是谷歌"
sourceUrl: "授权 PDF：Kubernetes权威指南：从Docker到Kubernetes实践全接触（第2版).pdf，页 14-55"
workSlug: "kubernetes-authoritative-guide-2nd"
workTitle: "Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第 2 版）"
chapterSlug: "001-第1章-kubernetes-入门"
order: 1
categories: ["云原生", "Kubernetes"]
tags: ["Kubernetes", "Docker", "容器", "集群管理"]
---
<div class="imported-document imported-pdf-document">
<h2>第1章 Kubernetes 入门</h2>
<h2>第 14 页</h2>
<h3>第1章</h3>
<p>Kubernetes 入门</p>
<p>1.1</p>
<p>Kubernetes 是什么</p>
<p>Kubernetes 是什么？</p>
<p>首先，它是一个全新的基于容器技术的分布式架构领先方案。这个方案虽然还很新，但它 是谷歌十几年以来大规模应用容器技术的经验积累和升华的一个重要成果。确切地说， Kubernetes 是谷歌严格保密十几年的秘密武器—Borg 的一个开源版本。Borg 是谷歌的一个久 负盛名的内部使用的大规模集群管理系统，它基于容器技术，目的是实现资源管理的自动化， 以及跨多个数据中心的资源利用率的最大化。十几年来，谷歌一直通过 Borg 系统管理着数量庞 大的应用程序集群。由于谷歌员工都签署了保密协议，即便离职也不能泄露Borg 的内部设计， 所以外界一直无法了解关于它的更多信息。直到2015年4月，传闻许久的 Borg 论文伴随 Kubernetes 的高调宣传被谷歌首次公开，大家才得以了解它的更多内幕。正是由于站在Borg这 个前辈的肩膀上，吸取了 Borg过去十年间的经验与教训，所以 Kubernetes 一经开源就一鸣惊人， 并迅速称霸了容器技术领域。</p>
<p>其次，如果我们的系统设计遵循了 Kubernetes 的设计思想，那么传统系统架构中那些和业 务没有多大关系的底层代码或功能模块，都可以立刻从我们的视线中消失，我们不必再费心于 负载均衡器的选型和部署实施问题，不必再考虑引入或自己开发一个复杂的服务治理框架，不 必再头疼于服务监控和故障处理模块的开发。总之，使用 Kuberetes 提供的解决方案，我们不 仅节省了不少于 30%的开发成本，同时可以将精力更加集中于业务本身，而且由于 Kubernetes 提供了强大的自动化机制，所以系统后期的运维难度和运维成本大幅度降低。</p>
<p>然后，Kuberetes 是一个开放的开发平台。与J2EE 不同，它不局限于任何一种语言，没有</p>
<h2>第 15 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 限定任何编程接口，所以不论是用Java、Go、C++还是用Python 编写的服务，都可以毫无困难 地映射为 Kubernetes 的 Service，并通过标准的TCP 通信协议进行交互。此外，由于 Kubernetes 平台对现有的编程语言、编程框架、中间件没有任何侵入性，因此现有的系统也很容易改造升 级并迁移到 Kubernetes 平台上。</p>
<p>最后，Kubernetes 是一个完备的分布式系统支撑平台。Kubernetes 具有完备的集群管理能力， 包括多层次的安全防护和准入机制、多租户应用支撑能力、透明的服务注册和服务发现机制、 内建智能负载均衡器、强大的故障发现和自我修复能力、服务滚动升级和在线扩容能力、可扩 展的资源自动调度机制，以及多粒度的资源配额管理能力。同时，Kubernetes 提供了完善的管 理工具，这些工具涵盖了包括开发、部署测试、运维监控在内的各个环节。因此，Kubernetes 是一个全新的基于容器技术的分布式架构解决方案，并且是一个一站式的完备的分布式系统开 发和支撑平台。</p>
<p>在正式开始本章的 Hello World 之旅之前，我们首先要学习 Kuberetes 的一些基本知识，这 样我们才能理解Kubernetes 提供的解决方案。</p>
<p>在 Kubernetes 中，Service（服务）是分布式集群架构的核心，一个 Service 对象拥有如下关 键特征。</p>
<p>3 拥有一个唯一指定的名字（比如 mysql-server）。</p>
<p>拥有一个虚拟 IP （Cluster IP、Service IP 或 VIP）和端口号。</p>
<p>能够提供某种远程服务能力。</p>
<p>e 被映射到了提供这种服务能力的一组容器应用上。</p>
<p>Service 的服务进程目前都基于 Socket 通信方式对外提供服务，比如 Redis、Memcache、 MySQL、Web Server，或者是实现了某个具体业务的一个特定的 TCP Server 进程。虽然一个 Service 通常由多个相关的服务进程来提供服务，每个服务进程都有一个独立的 Endpoint （IP+Port）访问点，但 Kubernetes 能够让我们通过 Service（虚拟 Cluster IP +Service Port）连接 到指定的 Service 上。有了 Kuberetes 内建的透明负载均衡和故障恢复机制，不管后端有多少服 务进程，也不管某个服务进程是否会由于发生故障而重新部署到其他机器，都不会影响到我们 对服务的正常调用。更重要的是这个 Service 本身一旦创建就不再变化，这意味着，在 Kubernetes 集群中，我们再也不用为了服务的IP 地址变来变去的问题而头疼了。</p>
<p>容器提供了强大的隔离功能，所以有必要把为 Service 提供服务的这组进程放入容器中进行 隔离。为此，Kubernetes 设计了 Pod 对象，将每个服务进程包装到相应的Pod中，使其成为 Pod 中运行的一个容器（Container）。为了建立 Service 和 Pod 的关联关系，Kubernetes 首先给每 个 Pod 贴上一个标签（Label），给运行 MySQL 的 Pod 贴上 name=mysql 标签，给运行PHP的 •2•</p>
<h2>第 16 页</h2>
<h3>第1章 Kubernetes 入门</h3>
<p>Pod 贴上 name=php 标签，然后给相应的 Service 定义标签选择器（Label Selector），比如MySQL Service 的标签选择器的选择条件为 name=mysql，意为该 Service 要作用于所有包含 name=mysql Label 的Pod 上。这样一来，就巧妙地解决了 Service 与 Pod 的关联问题。</p>
<p>说到 Pod，我们这里先简单介绍其概念。首先，Pod 运行在一个我们称之为节点（Node） 的环境中，这个节点既可以是物理机，也可以是私有云或者公有云中的一个虚拟机，通常在一 个节点上运行几百个 Pod；其次，每个 Pod 里运行着一个特殊的被称之为 Pause 的容器，其他 容器则为业务容器，这些业务容器共享 Pause 容器的网络栈和 Volume 挂载卷，因此它们之间的 通信和数据交换更为高效，在设计时我们可以充分利用这一特性将一组密切相关的服务进程放 入同一个Pod 中；最后，需要注意的是，并不是每个Pod 和它里面运行的容器都能“映射”到 一个 Service 上，只有那些提供服务（无论是对内还是对外）的一组Pod 才会被“映射”成一个 服务。</p>
<p>在集群管理方面，Kubernetes 将集群中的机器划分为一个 Master 节点和一群工作节点（Node）。</p>
<p>其中，在 Master 节点上运行着集群管理相关的一组进程 kube-apiserver、kube-controller-manager 和 kube-scheduler，这些进程实现了整个集群的资源管理、Pod调度、弹性伸缩、安全控制、系 统监控和纠错等管理功能，并且都是全自动完成的。Node 作集群中的工作节点，运行真正的 应用程序，在 Node 上 Kubernetes 管理的最小运行单元是 Pod。Node 上运行着 Kubernetes 的 kubelet、kube-proxy 服务进程，这些服务进程负责 Pod 的创建、启动、监控、重启、销毁，以 及实现软件模式的负载均衡器。</p>
<p>最后，我们再来看看传统的 IT 系统中服务扩容和服务升级这两个难题，以及 Kubernetes 所提供的全新解决思路。服务的扩容涉及资源分配（选择哪个节点进行扩容）、实例部署和启动 等环节，在一个复杂的业务系统中，这两个问题基本上靠人工一步步操作才得以完成，费时费 力又难以保证实施质量。</p>
<p>在 Kubernetes 集群中，你只需为需要扩容的 Service 关联的 Pod 创建一个 Replication Controller（简称 RC），则该 Service 的扩容以至于后来的 Service 升级等头疼问题都迎刃而解。</p>
<p>在一个 RC定义文件中包括以下3个关键信息。</p>
<p>◎ 目标Pod 的定义。</p>
<p>③</p>
<p>目标 Pod 需要运行的副本数量（Replicas）。</p>
<p>要监控的目标 Pod 的标签（Label）。</p>
<p>在创建好 RC（系统将自动创建好 Pod）后，Kubernetes 会通过 RC 中定义的Label 筛选出 对应的Pod 实例并实时监控其状态和数量，如果实例数量少于定义的副本数量（Replicas），则 会根据RC中定义的Pod模板来创建一个新的Pod，然后将此Pod调度到合适的Node 上启动运 行，直到Pod实例的数量达到预定目标。这个过程完全是自动化的，无须人工干预。有了RC， •3•</p>
<h2>第 17 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 服务的扩容就变成了一个纯粹的简单数字游戏了，只要修改 RC 中的副本数量即可。后续的 Service 升级也将通过修改RC来自动完成。</p>
<p>以将在第2章介绍的 PHP+Redis 留言板应用为例，只要为 PHP 留言板程序（frontend）创 建一个有3个副本的 RC+Service， Redis 读写分离集群创建两个 RC：写节点 （redis-master） 创建一个单副本的 RC+Service，读节点 （redis-slaver）创建一个有两个副本的 RC+Service，就 可以分分钟完成整个集群的搭建过程了，是不是很简单？</p>
<p>12</p>
<p>为什么要用 Kubernetes</p>
<p>使用 Kubernetes 的理由很多，最根本的一个理由就是：IT从来都是一个由新技术驱动的 行业。</p>
<p>Docker这个新兴的容器化技术当前已经被很多公司所采用，其从单机走向集群已成为必然， 而云计算的蓬勃发展正在加速这一进程。Kubernetes 作为当前唯一被业界广泛认可和看好的 Docker 分布式系统解决方案，可以预见，在未来几年内，会有大量的新系统选择它，不管这些 系统是运行在企业本地服务器上还是被托管到公有云上。</p>
<p>使用了 Kubernetes 又会收获哪些好处呢？</p>
<p>首先，最直接的感受就是我们可以“轻装上阵”地开发复杂系统了。以前动不动就需要十 几个人而且团队里需要不少技术达人一起分工协作才能设计实现和运维的分布式系统，在采用 Kubernetes 解决方案之后，只需一个精悍的小团队就能轻松应对。在这个团队里，一名架构师 专注于系统中“服务组件”的提炼，几名开发工程师专注于业务代码的开发，一名系统兼运维 工程师负责 Kubernetes 的部署和运维，从此再也不用“996”了，这并不是因为我们少做了什么， 而是因次 Kubernetes 已经帮我们做了很多。</p>
<p>其次，使用Kubernetes 就是在全面拥抱微服务架构。微服务架构的核心是将一个巨大的单 体应用分解很多小的互相连接的微服务，一个微服务背后可能有多个实例副本在支撑，副本 的数量可能会随着系统的负荷变化而进行调整，内嵌的负载均衡器在这里发挥了重要作用。微 服务架构使得每个服务都可以由专门的开发团队来开发，开发者可以自由选择开发技术，这对 于大规模团队来说很有价值，另外每个微服务独立开发、升级、扩展，因此系统具备很高的稳 定性和快速迭代进化能力。谷歌、亚马逊、eBay、NetFlix 等众多大型互联网公司都采用了微服 务架构，此次谷歌更是将微服务架构的基础设施直接打包到 Kubernetes 解决方案中，让我们有 机会直接应用微服务架构解决复杂业务系统的架构问题。</p>
<p>然后，我们的系统可以随时随地整体“搬迁”到公有云上。Kubernetes 最初的目标就是运 •4</p>
<h2>第 18 页</h2>
<h3>第1章 Kubernetes 入门</h3>
<p>行在谷歌自家的公有云GCE 中，未来会支持更多的公有云及基于 OpenStack 的私有云。同时， 在 Kubernetes 的架构方案中，底层网络的细节完全被屏蔽，基于服务的 Cluster IP 甚至都无须我 们改变运行期的配置文件，就能将系统从物理机环境中无缝迁移到公有云中，或者在服务高峰 期将部分服务对应的Pod副本放入公有云中以提升系统的吞吐量，不仅节省了公司的硬件投入， 还大大改善了客户体验。我们所熟知的铁道部的12306 购票系统，在春节高峰期就租用了阿里 云进行分流。</p>
<p>最后，Kuberetes 系统架构具备了超强的横向扩容能力。对于互联网公司来说，用户规模就 等价于资产，谁拥有更多的用户，谁就能在竞争中胜出，因此超强的横向扩容能力是互联网业 务系统的关键指标之一。不用修改代码，一个 Kubernetes 集群即可从只包含几个 Node 的小集 群平滑扩展到拥有上百个 Node 的大规模集群，我们利用 Kubernetes 提供的工具，甚至可以在 线完成集群扩容。只要我们的微服务设计得好，结合硬件或者公有云资源的线性增加，系统就 能够承受大量用户并发访问所带来的巨大压力。</p>
<p>13</p>
<p>从一个简单的例子开始</p>
<p>考虑到本书第 1 版中的 PHP+Redis 留言板的 Hello World 例子对于绝大多数刚接触 Kubernetes 的人来说比较复杂，难以顺利上手和实践，所以我们在此将这个例子替换成一个简 单得多的Java Web 应用，可以让新手快速上手和实践。</p>
<p>此Java Web 应用的结构比较简单，是一个运行在Tomcat 里的Web App，如图1.1所示，JSP 页面通过JDBC 直接访问MySQL 数据库并展示数据。为了演示和简化的目的，只要程序正确 连接到了数据库上，它就会自动完成对应的 Table 的创建与初始化数据的准备工作。所以，当 我们通过浏览器访问此应用的时候，就会显示一个表格的页面，数据则来自数据库。</p>
<p>Java Web App</p>
<p>http://xxxc:8080/demo Congratulations！！</p>
<p>HTTP</p>
<p>Idemo/index.jsp</p>
<p>JDBC</p>
<p>Database</p>
<p>Uyd!Cene</p>
<p>100</p>
<p>MysQL®</p>
<p>图1.1</p>
<p>Tomcat</p>
<p>Java Web 应用的架构组成</p>
<p>• 5•</p>
<h2>第 19 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 此应用需要启动两个容器：Web App 容器和 MySQL 容器，并且 Web App 容器需要访问 MySQL 容器。在Docker时代，假设我们在一个宿主机上启动了这两个容器，则我们需要把 MySQL 容器的IP 地址通过环境变量的方式注入Web App 容器里；同时，需要将 Web App 容器 的8080端口映射到宿主机的8080端口，以便能在外部访问。在本章的这个例子里，我们看看 在 Kubernetes 时代是如何完成这个目标的。</p>
<h3>1.3.1 环境准备</h3>
<p>首先，我们开始准备 Kubernetes 的安装和相关镜像下载，本书建议采用 VirtualBox 或者 VMware Workstation 在本机虚拟一个64位的CentOS 7虚拟机作为学习环境，虚拟机采用 NAT 的网络模式以便能够连接外网，然后按照以下步骤快速安装 Kuberetes。</p>
<p>（1） 关闭 CentOS 自带的防火墻服务：</p>
<p># systemctl disable firewalld # systemct1</p>
<p>stop firewalld</p>
<p>（2）安装 etcd 和 Kubernetes 软件（会自动安装 Docker 软件）：</p>
<p># yum install -y etcd kubernetes （3）安装好软件后，修改两个配置文件（其他配置文件使用系统默认的配置参数即可）。</p>
<p>Docker 配置文件为/etc/sysconfig/docker，其中 OPTIONS 的内容设置为：</p>
<p>OPTIONS=&#x27;--selinux-enabled=false --insecure-registry gcr.io&#x27; Kubernetes apiserver 配置文件/etc/kubernetes/apiserver，把--admission_control 参数中 的 ServiceAccount删除。</p>
<p>（4） 按顺序启动所有的服务：</p>
<p># systemctl start etcd # systemctl start docker # systemctl start kube-apiserver # systemctl start kube-controller-manager # systemctl start kube-scheduler # systemctl start kubelet start kube-proxy</p>
<p>至此，一个单机版的 Kubernetes 集群环境就安装启动完成了。</p>
<p>接下来，我们可以在这个单机版的 Kubernetes 集群中上手练习了。</p>
<p>注：本书示例中的 Docker 镜像下载地址 https://ub.docker.com/u/kubeguide/。</p>
<p>•6•</p>
<h2>第 20 页</h2>
<h3>第1章 Kubernetes 入门</h3>
<h3>1.3.2 启动 MySQL 服务</h3>
<p>首先为MySQL 服务创建一个 RC定义文件：mysql-rc.yaml，下面给出了该文件的完整内容 和解释，如图1.2所示。</p>
<p>apiversion:v1</p>
<p>kind:Replicationcontroller 副本控制器 RC</p>
<p>metadata：</p>
<p>name:mysql</p>
<p>RC 的名称，全局唯一</p>
<p>spec：</p>
<p>replicas: 1</p>
<p>Pod 副本期待数量</p>
<p>selector：</p>
<p>app:mysq2</p>
<p>template：</p>
<p>-符合目标的Pod 拥有此标签</p>
<p>•根据此模板创建 Pod 的副本（实例） metadata：</p>
<p>labels：</p>
<p>app:mysql</p>
<p>Pod 副本拥有的标签，对应 RC的 Selector spec：</p>
<p>containers：</p>
<p>- name:mysgl</p>
<p>image:mysql</p>
<p>Pod 内容器的定义部分</p>
<p>容器的名称</p>
<p>容器对应的 Docker Image ports：</p>
<p>- containerPort: 3306 env：</p>
<p>容器暴露的端口号</p>
<p>注入到容器内的环境变量</p>
<p>- name: MYSQL_ROOT_PASSWORD value：&quot;123456&quot;</p>
<p>图1.2 RC的定义和解说图</p>
<p>yaml 定义文件中的kind 属性，用来表明此资源对象的类型，比如这里的值为 “ReplicationControler”，表示这是一个RC;spec 一节中是RC 的相关属性定义，比如 spec.selector 是RC的Pod标签（Label）选择器，即监控和管理拥有这些标签的Pod 实例，确保当前集群上 始终有且仅有 replicas 个 Pod实例在运行，这里我们设置 replicas=1 表示只能运行一个 MySQL Pod 实例。当集群中运行的 Pod 数量小于 replicas 时，RC 会根据 spec.template 一节中定义的 Pod 模板来生成一个新的Pod 实例，spec.template.metadata.labels 指定了该Pod 的标签，需要特别注 意的是：这里的 labels 必须匹配之前的 spec.selector，否则此 RC 每次创建了一个无法匹配 Label 的 Pod，就会不停地尝试创建新的Pod，最终陷入“只为他人做嫁衣”的悲惨世界中，永无翻 身之时。</p>
<p>创建好 redis-master-controller.yaml 文件以后，为了将它发布到 Kubernetes 集群中，我们在 Master 节点执行命令：</p>
<p># kubectl create -f mysql-rc.yaml replicationcontroller &quot;mysql&quot; created •7•</p>
<h2>第 21 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 接下来，我们用 kubectl命令查看刚刚创建的RC：</p>
<p>#kubectl get rc</p>
<p>NAME</p>
<p>DESIRED</p>
<p>CURRENT AGE</p>
<p>mysql</p>
<p>7m</p>
<p>查看Pod 的创建情况时，可以运行下面的命令：</p>
<p># kubect1 get pods NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS AGE</p>
<p>mysql-c95jc</p>
<p>1/1</p>
<p>Running</p>
<p>9m</p>
<p>我们看到一个名为 mysql-xxxxx 的Pod 实例，这是 Kubernetes 根据 mysql这个 RC 的定义 自动创建的Pod。由于Pod 的调度和创建需要花费一定的时间，比如需要一定的时间来确定调 度到哪个节点上，以及下载Pod里容器的镜像需要一段时间，所以一开始我们看到Pod 的状态 将显示为 Pending。当Pod 成功创建完成以后，状态最终会被更新为 Running。</p>
<p>我们通过 docker ps 指令查看正在运行的容器，发现提供 MySQL 服务的Pod 容器已经创建 并正常运行了，此外，你会发现 MySQL Pod 对应的容器还多创建了一个来自谷歌的 pause 容器， 这就是Pod 的“根容器”，详见1.4.3 节的说明。</p>
<p>#docker ps I grep mysql 72ca992535b4 mysql &quot;docker-entrypoint.sh&quot; 12 minutes ago</p>
<p>Up 12 minutes</p>
<p>k8s_mysql.86dc506e_mysql-c95jc_default_511d6705-5051-11e6-a9d8-000c29ed42c1_9f89d0b4 76c1790aad27</p>
<p>gcr.io/google_containers/pause-amd64:3.0 &quot;/pause&quot;</p>
<p>12 minutes ago</p>
<p>Up 12 minutes</p>
<p>K8S_POD.16b20365</p>
<p>_mysql-c95jc_default_511d6705-5051-11e6-a9d8-000c29ed42c1_28520aba 最后，我们创建一个与之关联的 Kubernetes Service—MySQL 的定义文件（文件名 mysql-svc.yaml），完整的内容和解释如图1.3所示。</p>
<p>apiVersion: vl</p>
<p>kind: Service</p>
<p>表明是 Kubernetes Service metadata：</p>
<p>name:mysql</p>
<p>Service 的全局唯一名称</p>
<p>spec：</p>
<p>ports：</p>
<p>- port: 3306</p>
<p>selector：</p>
<p>app:mysql</p>
<p>Service 提供服务的端口号</p>
<p>Service 对应的 Pod 拥有这里定义的标签 图1.3 Service 的定义和解说图 其中，metadata.name 是 Service 的服务名（ServiceName）；port 属性则定义了 Service 的虚 端口；spec.selector 确定了哪些Pod 副本（实例）对应到本服务。类似地，我们通过 kubectl create 命令创建 Service 对象。</p>
<p>•8•</p>
<h2>第 22 页</h2>
<h3>第1章 Kubernetes 入门</h3>
<p>运行 kubectl 命令，创建 service：</p>
<p># kubectl create -f mysql-svc.yaml service &quot;mysql&quot; created 运行 kubectl 命令，可以查看到刚刚创建的 service：</p>
<p># kubectl get svc</p>
<p>NAME</p>
<p>CLUSTER-IP</p>
<p>EXTERNAL-IP</p>
<p>PORT （S）</p>
<p>AGE</p>
<p>mysgl</p>
<p>169.169.253.143</p>
<p>&lt;none〉</p>
<p>3306/TCP</p>
<p>48s</p>
<p>注意到MySQL 服务被分配了一个值169.169.253.143的 Cluster IP 地址，这是一个虚地址， 随后，Kubernetes 集群中其他新创建的Pod 就可以通过 Service 的 Cluster IP+端口号 6379 来连 接和访问它了。</p>
<p>在通常情况下，Cluster IP 是在 Service 创建后由 Kubernetes 系统自动分配的，其他Pod无 法预先知道某个 Service 的 Cluster IP 地址，因此需要一个服务发现机制来找到这个服务。为此， 最初的时候，Kubernetes 巧妙地使用了 Linux 环境变量（Environment Variable）来解决这个问题， 后面会详细说明其机制。现在我们只需知道，根据 Service 的唯一名字，容器可以从环境变量中 获取到 Service 对应的 Cluster IP 地址和端口，从而发起 TCP/IP 连接请求了。</p>
<p>1.3.3</p>
<p>启动 Tomcat 应用</p>
<p>上面我们定义和启动了MySQL 服务，接下来我们采用同样的步骤，完成 Tomcat 应用的启 动过程。首先，创建对应的 RC文件 myweb-rc.yaml，内容如下：</p>
<p>kind: ReplicationController metadata：</p>
<p>name: myweb</p>
<p>spec：</p>
<p>replicas: 5</p>
<p>selector：</p>
<p>app:myweb</p>
<p>template：</p>
<p>metadata：</p>
<p>labels：</p>
<p>app: myweb</p>
<p>SpeC：</p>
<p>containers：</p>
<p>- name：</p>
<p>myweb</p>
<p>image: kubeguide/tomcat-app:v1 portS：</p>
<p>- containerPort：</p>
<p>8080</p>
<p>enV：</p>
<p>- name: MYSQL_SERVICE_HOST • 9•</p>
<h2>第 23 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） value：&#x27;mysql&#x27;</p>
<p>- name: MYSQL_SBRVICE_PORT value:133061</p>
<p>注意到上面 RC对应的 Tomcat 容器里引用了 MYSQL_SERVICE_HOST=mysq！ 这个环境变 量，而“mysq|”恰好是我们之前定义的MySQL 服务的服务名，运行下面的命令，完成RC的 创建和验证工作：</p>
<p>#kubectl create -f myweb-rc.yaml replicationcontroller &quot;myweb&quot; created # kubect1 get pods NAME</p>
<p>READY</p>
<p>STATUS RESTARTS AGE mysgl-c95jc</p>
<p>1/1</p>
<p>Running</p>
<p>2h</p>
<p>myweb-g9pmm</p>
<p>1/1</p>
<p>Running</p>
<p>3s</p>
<p>最后，创建对应的 Service。以下是完整的yaml 定义文件（myweb-svc.yaml）：</p>
<p>apiversion:v1</p>
<p>kind: Service</p>
<p>metadata：</p>
<p>name:myweb</p>
<p>spec：</p>
<p>type: NodePort</p>
<p>ports：</p>
<p>- port:8080</p>
<p>nodePort: 30001</p>
<p>selector：</p>
<p>app:myweb</p>
<p>注意 type=NodePort 和 nodePort=30001 的两个属性，表明此 Service 开启了 NodePort 方式的 外网访问模式，在 Kubernetes 集群之外，比如在本机的浏览器里，可以通过30001这个端口访 问 myweb（对应到8080的虚端口上）。</p>
<p>运行 kubectl create 命令进行创建：</p>
<p># kubectl create -f myweb-svc.yaml You have exposed your service on an external port on all nodes in your cluster.</p>
<p>If you want to expose this service to the external internet, you may need to set up firewall rules for the service port （s）（tcp: 30001） to serve traffic.</p>
<p>See http://releases.k8s.io/release-1.3/docs/user-guide/services-firewalls.md fOr</p>
<p>more details.</p>
<p>service &quot;myweb&quot; created 我们看到上面有提示信息，意思是需要把30001这个端口在防火墙上打开，以便外部的访 问能穿过防火墙。</p>
<p>运行 kubectl 命令，查看创建的 Service：</p>
<p>• 10•</p>
<h2>第 24 页</h2>
<h3>第1章</h3>
<p>Kubernetes 入门</p>
<p># kubect1 get services NAME</p>
<p>mysql</p>
<p>myweb</p>
<p>kubernetes</p>
<p>CLUSTER-IP</p>
<p>EXTERNAL-IP</p>
<p>PORT （S）</p>
<p>169.169.253.143</p>
<p>&lt;none〉</p>
<p>3306/TCP</p>
<p>169.169.149.215</p>
<p>&lt;nodes&gt;</p>
<p>8080/TCP</p>
<p>AGE</p>
<p>44m</p>
<p>4m</p>
<p>169.169.0.1</p>
<p>&lt;none&gt;</p>
<p>443/TCP</p>
<p>16d</p>
<p>至此，我们的第1个 Kubernetes 例子搭建完成了，在下一节中我们验证结果。</p>
<p>1.3.4</p>
<p>通过浏览器访问网页</p>
<p>经过上面的几个步骤，我们终于成功实现了 Kubernetes 上第1个例子的部署搭建工作。现 在一起来见证成果吧，在你的笔记本上打开浏览器，输入 http://虚拟机 IP:30001/demo/。</p>
<p>比如虚机IP 为 192.168.18.131（可以通过#ipa 命令进行查询），在浏览器里输入地址 http:// 192.168.18.131:30001/demo/后，看到了如图1.4所示的网页界面，那么恭喜你，之前的努力没 有白费，顺利闯关成功！</p>
<p>Congratulations！！</p>
<p>Name</p>
<p>B00gle</p>
<p>docker</p>
<p>teacher</p>
<p>PE</p>
<p>our tcam</p>
<p>me</p>
<p>Level （Score）</p>
<p>100</p>
<p>100</p>
<p>100</p>
<p>100</p>
<p>100</p>
<p>100</p>
<p>图 1.4 通过浏览器访问 Tomcat 应用 如果看不到这个网页，那么可能有几个原因：比如防火墙的问题，无法访问 30001端口， 或者因为你是通过代理上网的，浏览器错把虚拟机的IP地址当成远程地址了。可以在虚拟机上 直接运行 curl localhost:30001来验证此端口是否能被访问，如果还是不能访问，那么这肯定不 是机器的问题⋯</p>
<p>接下来可以尝试单击“Add.”按钮添加一条记录并提交，如图1.5所示，提交以后，数据 就被写入 MySQL 数据库中了。</p>
<p>至此，我们终于完成了 Kuberetes 上的Tomcat 例子，这个例子并不是很复杂。我们也看 到，相对于传统的分布式应用的部署方式，在 Kubernetes 之上我们仅仅通过一些很容易理解 的配置文件和相关的简单命令就完成了对整个集群的部署，这让我们惊诧于 Kubernetes 的创 新和强大。</p>
<p>•11•</p>
<h2>第 25 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） Please input your info Your name：［el</p>
<p>Your Level:100</p>
<p>［Cance</p>
<p>Submil</p>
<p>图1.5 在留言板网页添加新的留言</p>
<p>下一节，我们将开始对 Kubernetes 中的基本概念和术语进行全面学习，在这之前，读者可 以继续研究下这个例子里的一些拓展内容，如下所述。</p>
<p>◎</p>
<p>研究 RC、Service 等文件的格式。</p>
<p>熟悉 kubectl 的子命令。</p>
<p>◎</p>
<p>手工停止某个 Service 对应的容器进程，然后观察有什么现象发生。</p>
<p>◎</p>
<p>修改RC文件，改变副本数量，重新发布，观察结果。</p>
<h3>1.4 Kubernetes 基本概念和术语</h3>
<p>Kubernetes 中的大部分概念如 Node、Pod、Replication Controller、Service 等都可以看作一 种“资源对象”，几乎所有的资源对象都可以通过 Kubernetes 提供的 kubectl 工具（或者API 编 程调用）执行增、删、改、查等操作并将其保存在etcd 中持久化存储。从这个角度来看，Kubernetes 其实是一个高度自动化的资源控制系统，它通过跟踪对比 etcd 库里保存的“资源期望状态”与 当前环境中的“实际资源状态”的差异来实现自动控制和自动纠错的高级功能。</p>
<h3>1.4.1 Master</h3>
<p>Kubernetes 里的 Master 指的是集群控制节点，每个 Kubernetes 集群里需要有一个 Master 节点来负责整个集群的管理和控制，基本上 Kuberetes 所有的控制命令都是发给它，它来负责 具体的执行过程，我们后面所有执行的命令基本都是在Master 节点上运行的。Master 节点通常 会占据一个独立的X86 服务器（或者一个虚拟机），一个主要的原因是它太重要了，它是整个 集群的“首脑”，如果它宕机或者不可用，那么我们所有的控制命令都将失效。</p>
<p>Master 节点上运行着以下一组关键进程。</p>
<p>Kubernetes API Server （kube-apiserver），提供了 HTTP Rest 接口的关键服务进程，是 Kubernetes 里所有资源的增、删、改、查等操作的唯一入口，也是集群控制的入口进程。</p>
<p>• 12</p>
<h2>第 26 页</h2>
<h3>第1章 Kubernetes 入门</h3>
<p>3 Kubemetes Controller Manager （kube-controller-manager），Kubernetes 里所有资源对象 的自动化控制中心，可以理解为资源对象的“大总管”。</p>
<p>Kuberetes Scheduler （kube-scheduler），负责资源调度（Pod 调度）的进程，相当于公 交公司的“调度室”。</p>
<p>其实 Master 节点上往往还启动了一个 etcd Server 进程，因为 Kubernetes 里的所有资源对象 的数据全部是保存在 etcd 中的。</p>
<h3>1.4.2 Node</h3>
<p>除了 Master，</p>
<p>Kubernetes 集群中的其他机器被称为 Node 节点，在较早的版本中也被称为 Minion。与 Master 一样，Node 节点可以是一台物理主机，也可以是一台虚拟机。Node 节点才 是 Kubernetes 集群中的工作负载节点，每个 Node 都会被 Master 分配一些工作负载（Docker 容 器），当某个 Node 宕机时，其上的工作负载会被 Master 自动转移到其他节点上去。</p>
<p>每个 Node 节点上都运行着以下一组关键进程。</p>
<p>kubelet：负责 Pod 对应的容器的创建、启停等任务，同时与 Master 节点密切协作，实 现集群管理的基本功能。</p>
<p>kube-proxy：实现 Kuberetes Service 的通信与负载均衡机制的重要组件。</p>
<p>Docker Engine （docker）：Docker 引擎，负责本机的容器创建和管理工作。</p>
<p>Node 节点可以在运行期间动态增加到Kubernetes 集群中，前提是这个节点上已经正确安装、 配置和启动了上述关键进程，在默认情况下 kubelet 会向 Master 注册自己，这也是 Kubernetes 推荐的 Node 管理方式。一旦 Node 被纳入集群管理范围，kubelet 进程就会定时向 Master 节点 汇报自身的情报，例如操作系统、Docker版本、机器的CPU 和内存情况，以及之前有哪些Pod 在运行等，这样 Master 可以获知每个 Node 的资源使用情况，并实现高效均衡的资源调度策略。</p>
<p>而某个 Node 超过指定时间不上报信息时，会被 Master 判定为“失联”，Node 的状态被标记为 不可用（Not Ready），随后 Master 会触发“工作负载大转移”的自动流程。</p>
<p>我们可以执行下述命令查看集群中有多少个 Node：</p>
<p># kubectl get nodes NAME</p>
<p>STATUS</p>
<p>AGE</p>
<p>kubernetes-minionl Ready</p>
<p>2d</p>
<p>然后，通过 kubectl describe node &lt;node_name&gt;来查看某个 Node 的详细信息：</p>
<p>$ kubectl describe node kubernetes-minionl Name：</p>
<p>k8s-node-1</p>
<p>• 13•</p>
<h2>第 27 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） Labels：</p>
<p>beta.kubernetes.io/arch=amd64 beta.kubernetes.io/os=linux kubernetes.io/hostname=k8s-node-1 Taints：</p>
<p>&lt;none&gt;</p>
<p>CreationTimestamp：</p>
<p>wed, 06 Jul 2016 11:46:41 +0800 Phase：</p>
<p>Conditions：</p>
<p>Type</p>
<p>status LastHeartbeatTime XXXX</p>
<p>OutofDisk</p>
<p>False Sat,09 Jul 2016 08:17:39 +0800 Wed</p>
<p>MemoryPressure</p>
<p>False Sat,09 Jul 2016 08:17:39 +0800 Wed</p>
<p>Ready</p>
<p>True Sat, 09 Ju1 2016 08:17:39 +0800 Wed</p>
<p>Addresses：</p>
<p>192.168.18.131,192.168.18.131 Capacity：</p>
<p>alpha.kubernetes.io/nvidia-gpu：</p>
<p>0</p>
<p>CPu：</p>
<p>4</p>
<p>memory：</p>
<p>1868692Ki</p>
<p>pods：</p>
<p>110</p>
<p>Allocatable：</p>
<p>alpha.kubernetes.io/nvidia-gpu：</p>
<p>0</p>
<p>CPU：</p>
<p>4</p>
<p>memorY：</p>
<p>1868692Ki</p>
<p>pods：</p>
<p>110</p>
<p>System</p>
<p>Info：</p>
<p>Machine ID：</p>
<p>6e4e2af2afeb42b9aac47d866aa56ca0 Systen UUID：</p>
<p>564D63D3-9664-3393-A3DC-9CD424ED42C1 Boot ID：</p>
<p>b0c34f9f-76ab-478e-9771-bd4fe6e98880 Kernel Version：</p>
<p>3.10.0-327.22.2.€17.×86_64 OS Image：</p>
<p>CentOS Linux 7</p>
<p>（Core）</p>
<p>Operating System：</p>
<p>linux</p>
<p>Architecture：</p>
<p>amd64</p>
<p>Container Runtime Version: docker://1.11.2 Kubelet Version：</p>
<p>V1.3.0</p>
<p>Kube-Proxy Version：</p>
<p>v1.3.0</p>
<p>ExternalID：</p>
<p>k8s-node-1</p>
<p>Non-terminated Pods：</p>
<p>（1 in total）</p>
<p>Namespace</p>
<p>Name</p>
<p>CPU Requests CPU Limits Memory xxx kube-sYstem</p>
<p>kube-dns-v11-wxdhf 310m（7%） 310m（78） 170Mi（98） Allocated resources：</p>
<p>（Total limits may be over 100 percent,i.e.，overcomitted. More info：</p>
<p>CPU Requests</p>
<p>CPU Limits Memory Requests Memory Limits</p>
<p>310m（78）</p>
<p>310m（7%）</p>
<p>No events.</p>
<p>上述命令展示了 Node 的如下关键信息。</p>
<p>170Mi （9%）</p>
<p>170Mi （98）</p>
<p>• 14•</p>
<h2>第 28 页</h2>
<h3>第1章 Kubernetes 入门</h3>
<p>Node 基本信息：名称、标签、创建时间等。</p>
<p>Node 当前的运行状态，Node 启动以后会做一系列的自检工作，比如磁盘是否满了，如 果满了就标注 OutOfDisk=True，否则继续检查内存是否不足（MemoryPressure=True）， 最后一切正常，就切换为 Ready 状态（Ready=True），这种情况表示 Node 处于健康状态， 可以在其上创建新的 Pod。</p>
<p>◎</p>
<p>Node 的主机地址与主机名。</p>
<p>Node 上的资源总量：描述 Node 可用的系统资源，包括CPU、内存数量、最大可调度Pod 数量等，注意到目前 Kuberetes 已经实验性地支持GPU 资源分配了 （alpha.kubernetes.</p>
<p>io/nvidia-gpu=0）。</p>
<p>Node 可分配资源量：描述 Node 当前可用于分配的资源量。</p>
<p>（》 主机系统信息：包括主机的唯一标识 UUID、Linux kernel 版本号、操作系统类型与版 本、Kubernetes 版本号、kubelet 与kube-proxy 的版本号等。</p>
<p>◎ 当前正在运行的Pod列表概要信息。</p>
<p>◎ 已分配的资源使用概要信息，例如资源申请的最低、最大允许使用量占系统总量的百分比。</p>
<p>Node 相关的Event 信息。</p>
<h3>1.4.3 Pod</h3>
<p>Pod 是 Kubernetes 的最重要也最基本的概念，如图1.6所示是Pod的组成示意图，我们看 到每个Pod都有一个特殊的被称“根容器”的Pause容器。Pause容器对应的镜像属于Kubernetes 平台的一部分，除了 Pause 容器，每个 Pod 还包含一个或多个紧密相关的用户业务容器。</p>
<p>Pod</p>
<p>Pause</p>
<p>gcr.iolgoogle_containers/pause-amd64 user conainter 1</p>
<p>xxximage</p>
<p>user conainter 2</p>
<p>xxxImage</p>
<p>user conainter N</p>
<p>xxximage</p>
<p>图1.6</p>
<p>Pod 的组成与容器的关系</p>
<p>• 15•</p>
<h2>第 29 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 为什么 Kubernetes 会设计出一个全新的Pod 的概念并且Pod有这样特殊的组成结构？</p>
<p>原因之一：在一组容器作为一个单元的情况下，我们难以对“整体”简单地进行判断及有 效地进行行动。比如，一个容器死亡了，此时算是整体死亡么？是N/M 的死亡率么？引入业务 无关并且不易死亡的 Pause 容器作为Pod 的根容器，以它的状态代表整个容器组的状态，就简 单、巧妙地解决了这个难题。</p>
<p>原因之二：Pod 里的多个业务容器共享 Pause 容器的 IP，共享 Pause 容器挂接的 Volume， 这样既简化了密切关联的业务容器之间的通信问题，也很好地解决了它们之间的文件共享问题。</p>
<p>Kubernetes 为每个 Pod 都分配了唯一的IP 地址，称之为 Pod IP，一个Pod 里的多个容器共 享Pod IP 地址。Kubernetes 要求底层网络支持集群内任意两个 Pod之间的TCP/IP 直接通信，这 通常采用虚拟二层网络技术来实现，例如 Flannel、Openvswitch 等，因此我们需要牢记一点：</p>
<p>在 Kubernetes 里，一个 Pod 里的容器与另外主机上的 Pod 容器能够直接通信。</p>
<p>Pod 其实有两种类型：普通的Pod 及静态 Pod （static Pod），后者比较特殊，它并不存放在 Kubernetes 的etcd 存储里，而是存放在某个具体的 Node 上的一个具体文件中，并且只在此Node 上启动运行。而普通的Pod一旦被创建，就会被放入到etcd 中存储，随后会被 Kubernetes Master 调度到某个具体的 Node 上并进行绑定（Binding），随后该 Pod 被对应的Node 上的kubelet 进程 实例化成一组相关的 Docker 容器并启动起来。在默认情况下，当Pod 里的某个容器停止时， Kubernetes 会自动检测到这个问题并且重新启动这个 Pod（重启Pod 里的所有容器），如果 Pod 所在的Node 宕机，则会将这个 Node上的所有 Pod重新调度到其他节点上。Pod、容器与 Node 的关系如图1.7所示。</p>
<p>Master</p>
<p>Pod：</p>
<p>Node 1</p>
<p>Node 2</p>
<p>/Node 3</p>
<p>Pod</p>
<p>容器</p>
<p>图1.7 Pod、容器与 Node 的关系 Kubernetes 里的所有资源对象都可以采用yaml 或者JSON格式的文件来定义或描述，下面 是我们在之前 Hello World 例子里用到的 myweb 这个Pod 的资源定义文件：</p>
<p>apiVersion: v1</p>
<p>kind: Pod</p>
<p>•16•</p>
<h2>第 30 页</h2>
<h3>第1章 Kubernetes 入门</h3>
<p>metadata：</p>
<p>name: myweb</p>
<p>Labels：</p>
<p>name:myweb</p>
<p>Spec：</p>
<p>containers：</p>
<p>-name: myweb</p>
<p>image: kubeguide/tomcat-app:vl ports：</p>
<p>- containerPort: 8080 env：</p>
<p>- name: MYSQL</p>
<p>_SERVICE_HOST</p>
<p>value：&#x27;mysql&#x27;</p>
<p>- name:MYSQL_SERVICE_PORT value:13306&quot;</p>
<p>Kind Pod 表明这是一个 Pod 的定义，metadata 里的 name 属性 Pod 的名字，metadata 里还能定义资源对象的标签（Label），这里声明 myweb 拥有一个 name=myweb 的标签 （Label）。</p>
<p>Pod 里所包含的容器组的定义则在 spec一节中声明，这里定义了一个名字为 myweb、对应镜像 为 kubeguide/tomcat-app:v1 的容器，该容器注入了名为 MYSQL_SERVICE_HOST=mysq！和 MYSQL_SERVICE_PORT=3306’的环境变量（env 关键字），并且在8080端口（containerPort） 上启动容器进程。Pod 的IP 加上这里的容器端口 （containerPort），就组成了一个新的概念 Endpoint，它代表着此Pod 里的一个服务进程的对外通信地址。一个 Pod 也存在着具有多个 Endpoint 的情况，比如当我们把 Tomcat定义为一个 Pod 的时候，可以对外暴露管理端口与服务 端口这两个 Endpoint。</p>
<p>我们所熟悉的 Docker Volume 在 Kubernetes 里也有对应的概念 -Pod Volume，后者有一</p>
<p>些扩展，比如可以用分布式文件系统 GlusterFS 实现后端存储功能；Pod Volume 是定义在Pod 之上，然后被各个容器挂载到自己的文件系统中的。</p>
<p>这里顺便提一下 Kubernetes 的Event概念，Event 是一个事件的记录，记录了事件的最早产 生时间、最后重现时间、重复次数、发起者、类型，以及导致此事件的原因等众多信息。Event 通常会关联到某个具体的资源对象上，是排查故障的重要参考信息，之前我们看到 Node 的描 述信息包括了 Event，而Pod 同样有 Event 记录，当我们发现某个 Pod迟迟无法创建时，可以用 kubectl describe pod xxxx 来查看它的描述信息，用来定位问题的原因，比如下面这个 Event 记录 信息表明Pod 里的一个容器被探针检测为失败一次：</p>
<p>Events：</p>
<p>FirstSeen</p>
<p>LastSeen|</p>
<p>Count From</p>
<p>SubobjectPath</p>
<p>Type</p>
<p>Reason</p>
<p>Message</p>
<p>10h</p>
<p>12m</p>
<p>32</p>
<p>｛kubelet k8s-node-1｝spec.containers｛kube2sky｝ • 17•</p>
<h2>第 31 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） Narning</p>
<p>Unhealthy Liveness probe failed: Get http://172.17.1.2:8080/healthz：</p>
<p>net/http: request canceled （Client.Timeout exceeded while awaiting headers） 每个 Pod都可以对其能使用的服务器上的计算资源设置限额，当前可以设置限额的计算资 源有 CPU 与 Memory 两种，其中 CPU 的资源单位为CPU （Core）的数量，是一个绝对值而非 相对值。</p>
<p>一个CPU 的配额对于绝大多数容器来说是相当大的一个资源配额了，所以，在 Kubernetes 里，通常以千分之一的CPU 配额为最小单位，用m 来表示。通常一个容器的CPU 配额被定义 为100～300m，即占用0.1~0.3个 CPU。由于 CPU 配额是一个绝对值，所以无论在拥有一个 Core 的机器上，还是在拥有48个Core 的机器上，100m这个配额所代表的CPU 的使用量都是 一样的。与CPU 配额类似，Memory 配额也是一个绝对值，它的单位是内存字节数。</p>
<p>在 Kubernetes 里，一个计算资源进行配额限定需要设定以下两个参数。</p>
<p>◎ Requests：该资源的最小申请量，系统必须满足要求。</p>
<p>© Limits：该资源最大允许使用的量，不能被突破，当容器试图使用超过这个量的资源时， 可能会被 Kubernetes Kill 并重启。</p>
<p>通常我们会把 Request 设置为一个比较小的数值，符合容器平时的工作负载情况下的资源 需求，而把 Limit 设置为峰值负载情况下资源占用的最大量。比如下面这段定义，表明MySQL 容器申请最少 0.25个 CPU 及 64MiB 内存，在运行过程中 MySQL 容器所能使用的资源配额为 0.5个 CPU 及128MiB 内存：</p>
<p>spec：</p>
<p>containers：</p>
<p>- name: db</p>
<p>image: mysql</p>
<p>resourCeS：</p>
<p>requests：</p>
<p>memory： &quot;64Mi&quot;</p>
<p>cpu： &quot;250m&quot;</p>
<p>Limits：</p>
<p>memory： &quot;128Mi&quot;</p>
<p>cpu：&quot;500m&quot;</p>
<p>本节最后，笔者给出 Pod 及 Pod 周边对象的示意图作为总结，如图1.8所示，后面部分还 会涉及这张图里的对象和概念，以进一步加强理解。</p>
<p>•18•</p>
<h2>第 32 页</h2>
<h3>第1章 Kubernetes 入门</h3>
<p>Kubernetes Pod1</p>
<p>Endpoint</p>
<p>（Pod IP+Container port） container 1</p>
<p>container 2</p>
<p>Volume</p>
<p>Event</p>
<p>图1.8</p>
<p>Pod 及周边对象</p>
<h3>1.4.4 Label（标签）</h3>
<p>Label 是 Kubernetes 系统中另外一个核心概念。一个 Label 是一个 key=value 的键值对， 其中 key 与 value 由用户自己指定。Label 可以附加到各种资源对象上，例如 Node、Pod、 Service、RC等，一个资源对象可以定义任意数量的Label，同一个 Label 也可以被添加到任 意数量的资源对象上去，Label通常在资源对象定义时确定，也可以在对象创建后动态添加 或者删除。</p>
<p>我们可以通过给指定的资源对象捆绑一个或多个不同的Label 来实现多维度的资源分组管 理功能，以便于灵活、方便地进行资源分配、调度、配置、部署等管理工作。例如：部署不同 版本的应用到不同的环境中；或者监控和分析应用（日志记录、监控、告警）等。一些常用的 Label 示例如下。</p>
<p>版本标签：&quot;release&quot;：&quot;stable&quot;， &quot;&#x27;release&quot; ： &quot;canary&quot;...</p>
<p>环境标签：</p>
<p>&quot;&#x27;environment&#x27;：&quot;dev&quot;， &quot;&#x27;environment&quot;：&quot;qa&quot;，&quot;environment&quot;：&quot;production&quot; ◎ 架构标签：&quot;tier&quot;：&quot;frontend&quot;， &quot;tier&quot;： &quot;backend”， &quot;tier&quot; ： &quot;middleware&quot; 分区标签：&quot;&#x27;partition&quot; ：&quot;customerA&quot;， &quot;partition&quot; ： &quot;customerB&quot;..</p>
<p>质量管控标签：&quot;track&quot;：&quot;daily&quot;，&quot;track&quot;：&quot;weekly&quot; Label 相当于我们熟悉的“标签”，给某个资源对象定义一个Label，就相当于给它打了一个 标签，随后可以通过 Label Selector（标签选择器）查询和筛选拥有某些 Label 的资源对象， Kubernetes 通过这种方式实现了类似 SQL 的简单又通用的对象查询机制。</p>
<p>Label Selector 可以被类比为SQL 语句中的where 查询条件，例如，name=redis-slave 这个 • 19</p>
<h2>第 33 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） Label Selector 作用于 Pod 时，可以被类比內 select * from pod where pod&#x27;s name = ‘redis-slave”这 样的语句。当前有两种 Label Selector 的表达式：基于等式的（Equality-based）和基于集合的 （Set-based），前者采用“等式类”的表达式匹配标签，下面是一些具体的例子。</p>
<p>name = redis-slave：匹配所有具有标签 name=redis-slave 的资源对象。</p>
<p>env ！= production：匹配所有不具有标签 env=production 的资源对象，比如 env=test 就是 满足此条件的标签之一。</p>
<p>而后者则使用集合操作的表达式匹配标签，下面是一些具体的例子。</p>
<p>◎</p>
<p>name in （redis-master, redis-slave）：匹配所有具有标签 name=redis-master 或者 name= redis-slave 的资源对象。</p>
<p>name not in （php-frontend）：匹配所有不具有标签 name=php-frontend 的资源对象。</p>
<p>可以通过多个 Label Selector 表达式的组合实现复杂的条件选择，多个表达式之间用“，” 进行分隔即可，几个条件之间是“AND”的关系，即同时满足多个条件，比如下面的例子：</p>
<p>name=redis-slave,env！=production name notin（php-frontend）， env！=production Label Selector 在 Kubernetes 中的重要使用场景有以下几处。</p>
<p>◎</p>
<p>kube-controller 进程通过资源对象 RC上定义的Label Selector 来筛选要监控的Pod 副本 的数量，从而实现Pod 副本的数量始终符合预期设定的全自动控制流程。</p>
<p>kube-proxy 进程通过 Service 的Label Selector 来选择对应的Pod，自动建立起每个 Service 到对应Pod的请求转发路由表，从而实现 Service 的智能负载均衡机制。</p>
<p>通过对某些 Node 定义特定的Label，并且在Pod 定义文件中使用 NodeSelector 这种标 签调度策略，kube-scheduler 进程可以实现Pod “定向调度”的特性。</p>
<p>在前面的留言板例子中，我们只使用了一个 name=XXX 的Label Selector。让我们看一个更 复杂的例子。假设Pod定义了3个 Label:release、env 和 role，不同的Pod定义了不同的 Label 值，如图 1.9 所示，如果我们设置了 “role=frontend”的 Label Selector， •则会选取到Node 1 和</p>
<p>Node 2上的 Pod。</p>
<p>而设置“release=beta” 的 Label Selector，则会选取到Node 2 和 Node 3 上的Pod，如图1.10 所示。</p>
<p>• 20•</p>
<h2>第 34 页</h2>
<h3>第1章</h3>
<p>Kubernetes 入门</p>
<p>Selector：</p>
<p>role=frontend</p>
<p>3od</p>
<p>LabelS：</p>
<p>release:alpha</p>
<p>env: development</p>
<p>role: frontend</p>
<p>Node 1</p>
<p>Pod</p>
<p>tabefs：</p>
<p>release: beta</p>
<p>env: testing</p>
<p>role: frontend</p>
<p>Node 2</p>
<p>Pod</p>
<p>Labels：</p>
<p>release: beta</p>
<p>env:production</p>
<p>role: backend</p>
<p>Node 3</p>
<p>图 1.9 Label Selector的作用范围1 Pod</p>
<p>Labels：</p>
<p>release:alpha</p>
<p>env: development</p>
<p>role: frontend</p>
<p>Node 1</p>
<p>Pod</p>
<p>Labels：</p>
<p>release:beta</p>
<p>env: testing</p>
<p>role:frontend</p>
<p>Node 2</p>
<p>Selector：</p>
<p>release=beta</p>
<p>Pod</p>
<p>Labels：-…</p>
<p>release:beta</p>
<p>env:production</p>
<p>role:backend</p>
<p>Node 3</p>
<p>图 1.10 Label Selector 的作用范围2 总结：使用Label 可以给对象创建多组标签，Label 和 Label Selector 共同构成了 Kubernetes 系统中最核心的应用模型，使得被管理对象能够被精细地分组管理，同时实现了整个集群的高 可用性。</p>
<p>• 21•</p>
<h2>第 35 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版）</p>
<h3>1.4.5 Replication Controller （RC）</h3>
<p>之前已经对 Replication Controller（以后简称RC）的定义和作用做了一些说明，本节对RC 的概念进行深入描述。</p>
<p>RC是 Kubernetes 系统中的核心概念之一，简单来说，它其实是定义了一个期望的场景， 即声明某种 Pod 的副本数量在任意时刻都符合某个预期值，所以RC的定义包括如下几个部分。</p>
<p>◎</p>
<p>Pod 期待的副本数 （replicas）。</p>
<p>◎</p>
<p>用于筛选目标 Pod 的 Label Selector。</p>
<p>当Pod 的副本数量小于预期数量的时候，用于创建新 Pod 的Pod 模板 （template）。</p>
<p>下面是一个完整的RC定义的例子，即确保拥有 tier=frontend 标签的这个 Pod（运行 Tomcat 容器）在整个Kubernetes 集群中始终只有一个副本。</p>
<p>apiVersion: v1</p>
<p>kind: ReplicationController metadata：</p>
<p>name: frontend</p>
<p>SpeC：</p>
<p>replicas: 1</p>
<p>selector：</p>
<p>tier: frontend</p>
<p>template：</p>
<p>metadata：</p>
<p>labels：</p>
<p>app: app-demo</p>
<p>tier：</p>
<p>frontend</p>
<p>speC：</p>
<p>containers：</p>
<p>-name: tomcat-demo image: tomcat</p>
<p>imagePul1Policy: IfNotPresent ehV。</p>
<p>-name: GET_HOSTS_FROM value: dns</p>
<p>ports：</p>
<p>- containerPort: 80 当我们定义了一个RC并提交到Kubernetes 集群中以后，Master 节点上的 Controller Manager 组件就得到通知，定期巡检系统中当前存活的目标 Pod，并确保目标 Pod 实例的数量刚好等于 此RC的期望值，如果有过多的Pod 副本在运行，系统就会停掉一些 Pod，否则系统就会再自 动创建一些Pod。可以说，通过RC,Kubernetes 实现了用户应用集群的高可用性，并且大大减 少了系统管理员在传统IT 环境中需要完成的许多手工运维工作（如主机监控脚本、应用监控脚 • 22•</p>
<h2>第 36 页</h2>
<h3>第1章</h3>
<p>Kubernetes 入门</p>
<p>本、故障恢复脚本等）。</p>
<p>下面我们以3个 Node 节点的集群为例，说明Kubernetes 如何通过RC来实现 Pod 副本数量 自动控制的机制。假如我们的RC里定义 redis-slave 这个 Pod 需要保持3个副本，系统将可能 在其中的两个 Node 上创建Pod。图1.11 描述了在两个 Node 上创建 redis-slave Pod 的情形。</p>
<p>Master</p>
<p>Replication.oort</p>
<p>WPod1</p>
<p>Node 1</p>
<p>Pod2</p>
<p>Node 2</p>
<p>Node 3</p>
<p>图1.11</p>
<p>在两个 Node 上创建 redis-slave Pod 假设 Node 2上的Pod2意外终止，根据RC定义的 replicas 数量2，Kubernetes 将会自动创 建并启动一个新的Pod，以保证整个集群中始终有两个 redis-slave Pod 在运行。</p>
<p>如图1.12所示，系统可能选择Node 3或者 Node 1 来创建一个新的 Pod。</p>
<p>Node 1</p>
<p>Pod3</p>
<p>Node2</p>
<p>Node 3</p>
<p>Node 1</p>
<p>Node 2</p>
<p>rodla-alevs</p>
<p>Pods</p>
<p>Node 3</p>
<p>Pod！</p>
<p>Node 1</p>
<p>Node 2</p>
<p>Node 3</p>
<p>图1.12 根据RC定义创建新的 Pod 此外，在运行时，我们可以通过修改RC的副本数量，来实现 Pod的动态缩放（Scaling） 功能，这可以通过执行 kubectl scale 命令来一键完成：</p>
<p>$ kubectl scale rc redis-slave --replicas=3 scaled</p>
<p>Scaling 的执行结果如图1.13所示。</p>
<p>• 23•</p>
<h2>第 37 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） redlis-akavg</p>
<p>Pod1</p>
<p>Node 1</p>
<p>Node 2</p>
<p>Node 3</p>
<p>Pod1</p>
<p>Node 1</p>
<p>Pod 2</p>
<p>Node 2</p>
<p>redis-slave</p>
<p>Pody</p>
<p>Node 3</p>
<p>Node 1</p>
<p>¥od</p>
<p>Pod2</p>
<p>Node 2</p>
<p>Node 3</p>
<p>图1.13 Scaling 的执行结果 需要注意的是，删除 RC并不会影响通过该RC已创建好的Pod。为了删除所有 Pod，可以 改置 replicas 的值为0，然后更新该RC。另外，kubectl 提供了 stop 和 delete 命令来一次性删除 RC 和RC控制的全部 Pod。</p>
<p>当我们的应用升级时，通常会通过Build一个新的 Docker 镜像，并用新的镜像版本来替代 旧的版本的方式达到目的。在系统升级的过程中，我们希望是平滑的方式，比如当前系统中10 个对应的旧版本的Pod，最佳的方式是旧版本的Pod每次停止一个，同时创建一个新版本的 Pod， 在整个升级过程中，此消彼长，而运行中的Pod数量始终是10个，几分钟以后，当所有的Pod 都已经是新版本的时候，升级过程完成。通过RC的机制，Kubernetes 很容易就实现了这种高 级实用的特性，被称为“滚动升级”（Rolling Update），具体的操作方法详见第4章。</p>
<p>由于 Replication Controller 与 Kubernetes 代码中的模块 Replication Controller 同名，同时这 个词也无法准确表达它的本意，所以在 Kubernetes 1.2的时候，它就升级成了另外一个新的概 念—Replica Set，官方解释“下一代的 RC”，它与RC当前存在的唯一区别是：Replica Sets 支持基于集合的 Label selector （Set-based selector），而 RC 只支持基于等式的 Label Selector （equality-based selector），这使得 Replica Set 的功能更强，下面是等价于之前 RC 例子的 Replica Set 的定义（省去了 Pod 模板部分的内容）：</p>
<p>apiVersion: extensions/v1betal kind: ReplicaSet</p>
<p>metadata：</p>
<p>name: frontend</p>
<p>speC：</p>
<p>selector：</p>
<p>matchLabels：</p>
<p>tier:frontend</p>
<p>matchExpressions：</p>
<p>-｛key: tier,operator: In, values： ［frontend］ ｝ • 24•</p>
<h2>第 38 页</h2>
<h3>第1章</h3>
<p>：Kubernetes 入门</p>
<p>template：</p>
<p>kubectl 命令行工具适用于 RC 的绝大部分命令都同样适用于 Replica Set。此外，当前我们 很少单独使用 Replica Set，它主要被 Deployment这个更高层的资源对象所使用，从而形成一整 套Pod 创建、删除、更新的编排机制。当我们使用 Deployment 时，无须关心它是如何创建和维 护 Replica Set 的，这一切都是自动发生的。</p>
<p>Replica Set 与Deployment这两个重要资源对象逐步替换了之前的RC的作用，是 Kubernetes 1.3里Pod 自动扩容（伸缩）这个告警功能实现的基础，也将继续在 Kubernetes 未来的版本中发 挥重要的作用。</p>
<p>最后我们总结一下关于 RC （Replica Set）的一些特性与作用。</p>
<p>在大多数情况下，我们通过定义一个 RC实现Pod 的创建过程及副本数量的自动控制。</p>
<p>①</p>
<p>RC里包括完整的Pod定义模板。</p>
<p>RC通过 Label Selector 机制实现对Pod 副本的自动控制。</p>
<p>通过改变RC里的Pod副本数量，可以实现 Pod 的扩容或缩容功能。</p>
<p>通过改变RC里Pod模板中的镜像版本，可以实现Pod 的滚动升级功能。</p>
<p>1.4.6</p>
<p>Deployment</p>
<p>Deployment 是 Kuberetes 1.2引入的新概念，引入的目的是为了更好地解决Pod 的编排问 题。为此，Deployment 在内部使用了 Replica Set 来实现目的，无论从 Deployment 的作用与目 的、它的YAM定义，还是从它的具体命令行操作来看，我们都可以把它看作 RC 的一次升级， 两者的相似度超过90%。</p>
<p>Deployment 相对于 RC的一个最大升级是我们可以随时知道当前Pod “部署”的进度。实 际上由于一个 Pod 的创建、调度、绑定节点及在目标 Node 上启动对应的容器这一完整过程需 要一定的时间，所以我们期待系统启动N个Pod副本的目标状态，实际上是一个连续变化的“部 署过程”导致的最终状态。</p>
<p>Deployment 的典型使用场景有以下几个。</p>
<p>创建一个 Deployment 对象来生成对应的 Replica Set 并完成Pod副本的创建过程。</p>
<p>检查 Deployment 的状态来看部署动作是否完成（Pod副本的数量是否达到预期的值）。</p>
<p>更新 Deployment 以创建新的Pod（比如镜像升级）。</p>
<p>（》</p>
<p>如果当前 Deployment 不稳定，则回滚到一个早先的 Deployment 版本。</p>
<p>•25•</p>
<h2>第 39 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） ◎</p>
<p>挂起或者恢复一个 Deployment。</p>
<p>Deployment 的定义与 Replica Set 的定义很类似，除了 API 声明与 Kind 类型等有所区别：</p>
<p>apiVersion: extensions/vlbetal apiVersion: vl</p>
<p>kind: Deployment</p>
<p>kind: ReplicaSet</p>
<p>metadata：</p>
<p>metadata：</p>
<p>name: nginx-deployment name: nginx-repset 下面我们通过运行一些例子来一起直观地感受这个新概念。首先创建一个名为 tomcat-deployment.yaml 的 Deployment 描述文件，内容如下：</p>
<p>apiVersion: extensions/vlbetal kind:Deployment</p>
<p>metadata：</p>
<p>name: frontend</p>
<p>speC：</p>
<p>replicas: 1</p>
<p>selector：</p>
<p>matchLabels：</p>
<p>tier: frontend</p>
<p>matchExpressions：</p>
<p>- ｛key: tier, Operator: In， values：［frontend］｝ template：</p>
<p>metadata：</p>
<p>labels：</p>
<p>app:app-demo</p>
<p>tier: frontend</p>
<p>speC：</p>
<p>containers：</p>
<p>- name: tomcat-demo image: tomcat</p>
<p>imagePul1Policy: IfNotPresent ports：</p>
<p>- containerPort: 8080 运行下述命令创建 Deployment：</p>
<p># kubectl create</p>
<p>-f tomcat-deployment.yaml deployment&quot;tomcat-deploy&quot; created 运行下述命令查看 Deployment 的信息：</p>
<p># kubectl get deployments NAME</p>
<p>DESIRED</p>
<p>tomcat-deploy</p>
<p>1</p>
<p>CURRENT</p>
<p>1</p>
<p>UP-TO-DATE</p>
<p>1</p>
<p>AVAILABLE</p>
<p>1</p>
<p>对上述输出中涉及的数量解释如下。</p>
<p>© DESIRED:Pod 副本数量的期望值，即 Deployment 里定义的 Replica。</p>
<p>AGE</p>
<p>4m</p>
<p>•26•</p>
<h2>第 40 页</h2>
<h3>第1章 Kubernetes 入门</h3>
<p>CURRENT： 当前 Replica 的值，实际上是 Deployment 所创建的 Replica Set 里的 Replica 值，这个值不断增加，直到达到 DESIRED 为止，表明整个部署过程完成。</p>
<p>UP-TO-DATE：最新版本的Pod 的副本数量，用于指示在滚动升级的过程中，有多少个 Pod 副本已经成功升级。</p>
<p>AVAILABLE： 当前集群中可用的Pod 副本数量，即集群中当前存活的Pod 数量。</p>
<p>运行下述命令查看对应的 Replica Set，我们看到它的命名跟 Deployment 的名字有关系：</p>
<p># kubectl get rs</p>
<p>NAME</p>
<p>DESIRED</p>
<p>CURRENT AGE</p>
<p>tomcat-deploy-1640611518 1m</p>
<p>运行下述命令查看创建的Pod，我们发现 Pod 的命名以 Deployment 对应的 Replica Set 的名 字为前缀，这种命名很清晰地表明了一个 Replica Set 创建了哪些Pod，对于Pod滚动升级这种 复杂的过程来说，很容易排查错误：</p>
<p># kubectl get pods NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS AGE</p>
<p>tomcat-deploy-1640611518-zhrsc 1/1</p>
<p>Running</p>
<p>0</p>
<p>3m</p>
<p>运行 kubectl describe deployments，可以清楚地看到 Deployment控制的Pod 的水平扩展过 程，此命令的输出比较多，这里不再赘述。</p>
<h3>1.4.7 Horizontal Pod Autoscaler （HPA）</h3>
<p>在前两节提到过，通过手工执行 kubectl scale 命令，我们可以实现Pod扩容或缩容。如果 仅仅到此为止，显然不符合谷歌对 Kuberetes 的定位目标—自动化、智能化。在谷歌看来， 分布式系统要能够根据当前负载的变化情况自动触发水平扩展或缩容的行为，因为这一过程可 能是频繁发生的、不可预料的，所以手动控制的方式是不现实的。</p>
<p>因此，Kubernetes 的1.0版本实现后，这帮大牛们就已经在默默研究 Pod 智能扩容的特性了， 并在 Kubernetes 1.1 的版本中首次发布这一重量级新特性——Horizontal Pod Autoscaling。随后 的1.2版本中 HPA 被升级稳定版本（apiVersion: autoscaling/v1），但同时仍然保留旧版本 （apiVersion: extensions/vlbetal），官方的计划是在1.3版本里先移除旧版本，并且会在1.4版本 里彻底移除旧版本的支持。</p>
<p>Horizontal Pod Autoscaling 简称HPA，意思是Pod 横向自动扩容，与之前的 RC、Deployment 一样，也属于一种 Kubernetes 资源对象。通过追踪分析 RC 控制的所有目标 Pod 的负载变化情 况，来确定是否需要针对性地调整目标 Pod 的副本数，这是 HPA 的实现原理。当前，HPA 可 以有以下两种方式作为Pod 负载的度量指标。</p>
<p>• 27•</p>
<h2>第 41 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） ◎</p>
<p>CPUUtilizationPercentage。</p>
<p>应用程序自定义的度量指标，比如服务在每秒内的相应的请求数（TPS或 QPS）。</p>
<p>CPUUtilizationPercentage 是一个算术平均值，即目标Pod所有副本自身的CPU 利用率的平 均值。一个Pod 自身的CPU 利用率是该Pod 当前CPU 的使用量除以它的 Pod Request 的值，比 如我们定义一个 Pod 的Pod Request 为 0.4，而当前Pod 的CPU 使用量0.2，则它的CPU 使用 率50%，如此一来，我们就可以就算出来一个RC控制的所有Pod副本的CPU 利用率的算术 平均值了。如果某一时刻 CPUUtilizationPercentage 的值超过80%，则意味着当前的Pod副本数 很可能不足以支撑接下来更多的请求，需要进行动态扩容，而当请求高峰时段过去后，Pod 的 CPU 利用率又会降下来，此时对应的Pod副本数应该自动减少到一个合理的水平。</p>
<p>CPUUtilizationPercentage 计算过程中使用到的Pod的CPU 使用量通常是1分钟内的平均值， 目前通过查询 Heapster 扩展组件来得到这个值，所以需要安装部署 Heapster，这样一来便增加 了系统的复杂度和实施 HPA特性的复杂度，因此，未来的计划是 Kubernetes 自身实现一个基础 性能数据采集模块，从而更好地支持HPA 和其他需要用到基础性能数据的功能模块。此外，我 们也看到，如果目标 Pod没有定义 Pod Request 的值，则无法使用 CPUUtilizationPercentage 来 实现 Pod 横向自动扩容的能力。除了使用 CPUUtilizationPercentage, Kubernetes 从 1.2版本开始， 尝试支持应用程序自定义的度量指标，目前仍然为实验特性，不建议在生产环境中使用。</p>
<p>下面是 HPA 定义的一个具体例子：</p>
<p>apiVersion: autoscaling/vl kind: HorizontalPodAutoscaler metadata：</p>
<p>name: php-apache</p>
<p>namespace: default spec：</p>
<p>maxReplicas: 10</p>
<p>minReplicas: 1</p>
<p>scaleTargetRef：</p>
<p>kind: Deployment</p>
<p>name: php-apache</p>
<p>targetCPUUtilizationPercentage: 90 根据上面的定义，我们可以知道这个HPA 控制的目标对象一个名叫 php-apache 的 Deployment 里的Pod 副本，当这些 Pod副本的CPUUtilizationPercentage 的值超过90%时会触发自动动态扩 容行为，扩容或缩容时必须满足的一个约束条件是Pod 的副本数要介于1与10之间。</p>
<p>除了可以通过直接定义yaml 文件并且调用kubectrl create 的命令来创建一个 HPA 资源对象 的方式，我们还能通过下面的简单命令行直接创建等价的HPA 对象：</p>
<p># kubectl autoscale deployment php-apache --cpu-percent=90 --min=1 --max=10 •28•</p>
<h2>第 42 页</h2>
<h3>第1章</h3>
<p>Kubernetes 入门</p>
<h3>第2章将会给出一个完整的 HPA 例子来说明其用法和功能。</h3>
<h3>1.4.8 Service（服务）</h3>
<p>1. 概述</p>
<p>Service 也是 Kubernetes 里的最核心的资源对象之一，Kubernetes 里的每个 Service 其实就是 我们经常提起的微服务架构中的一个“微服务”，之前我们所说的Pod、RC 等资源对象其实都 是这节所说的“服务”—Kubernetes Service做“嫁衣”的。图1.14显示了 Pod、RC与 Service 的逻辑关系。</p>
<p>frontend</p>
<p>pod</p>
<p>service</p>
<p>kabet: app=backend：</p>
<p>pod</p>
<p>Label</p>
<p>Selector</p>
<p>pod</p>
<p>replicationController label: app=backens pod</p>
<p>iabel: app=backend 图1.14 Pod、RC 与 Service 的关系 从图1.14中我们看到，Kubernetes 的 Service 定义了一个服务的访问入口地址，前端的应用 （Pod）通过这个入口地址访问其背后的一组由 Pod副本组成的集群实例，Service 与其后端 Pod 副本集群之间则是通过 Label Selector 来实现“无缝对接”的。而 RC 的作用实际上是保证 Service 的服务能力和服务质量始终处于预期的标准。</p>
<p>通过分析、识别并建模系统中的所有服务为微服务—Kubernetes Service，最终我们的系统 由多个提供不同业务能力而又彼此独立的微服务单元所组成，服务之间通过 TCP/IP 进行通信， 从而形成了我们强大而又灵活的弹性网格，拥有了强大的分布式能力、弹性扩展能力、容错能 力，与此同时，我们的程序架构也变得简单和直观许多，如图1.15所示。</p>
<p>既然每个 Pod 都会被分配一个单独的IP 地址，而且每个 Pod 都提供了一个独立的 Endpoint （Pod IP+ContainerPort）以被客户端访问，现在多个 Pod副本组成了一个集群来提供服务，那么 客户端如何来访问它们呢？一般的做法是部署一个负载均衡器（软件或硬件），为这组 Pod 开启 一个对外的服务端口如8000端口，并且将这些 Pod的 Endpoint 列表加入8000端口的转发列表 中，客户端就可以通过负载均衡器的对外 IP 地址+服务端口来访问此服务，而客户端的请求最 后会被转发到哪个 Pod，则由负载均衡器的算法所决定。</p>
<p>•29•</p>
<h2>第 43 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） Kubernetes</p>
<p>Service</p>
<p>H</p>
<p>Kubernetes</p>
<p>Service</p>
<p>B</p>
<p>Client</p>
<p>Kubernetes</p>
<p>Service</p>
<p>C</p>
<p>Kubernetes</p>
<p>Service</p>
<p>F</p>
<p>Kubemetes</p>
<p>Service</p>
<p>D</p>
<p>Kubernetes</p>
<p>Service</p>
<p>E</p>
<p>Kubernetes</p>
<p>Service</p>
<p>G</p>
<p>Kubernetes</p>
<p>Service</p>
<p>A</p>
<p>图 1.15 Kubernetes 所提供的微服务网格架构 Kubernetes 也遵循了上述常规做法，运行在每个 Node 上的 kube-proxy 进程其实就是一个智 能的软件负载均衡器，它负责把对 Service 的请求转发到后端的某个 Pod实例上，并在内部实现 服务的负载均衡与会话保持机制。但 Kubernetes 发明了一种很巧妙又影响深远的设计：Service 不是共用一个负载均衡器的IP 地址，而是每个 Service 分配了一个全局唯一的虚拟IP 地址，这 个虚拟 IP 被称为 Cluster IP。这样一来，每个服务就变成了具备唯一P地址的“通信节点”，服 务调用就变成了最基础的 TCP 网络通信问题。</p>
<p>我们知道，Pod的 Endpoint 地址会随着Pod 的销毁和重新创建而发生改变，因为新 Pod 的 IP 地址与之前旧Pod的不同。而 Service 一旦创建，Kubernetes 就会自动为它分配一个可用的 Cluster IP，而且在 Service 的整个生命周期内，它的Cluster IP 不会发生改变。于是，服务发现 这个棘手的问题在 Kubernetes 的架构里也得以轻松解决：只要用 Service 的 Name 与 Service 的 Cluster IP 地址做一个 DNS域名映射即可完美解决问题。现在想想，这真是一个很棒的设计。</p>
<p>说了这么久，下面我们动手创建一个 Service，来加深对它的理解。首先我们创建一个名为 tomcat-service.yaml 的定义文件，内容如下：</p>
<p>apiVersion: v1</p>
<p>kind: Service</p>
<p>metadata：</p>
<p>name: tomcat-service spec：</p>
<p>ports：</p>
<p>- port: 8080</p>
<p>selector：</p>
<p>tier: frontend</p>
<p>上述内容定义了一个名为 “tomcat-service”的 Service，它的服务端口为8080，拥有“tier= frontend”这个 Label 的所有Pod实例都属于它，运行下面的命令进行创建：</p>
<p>#kubectl create -f tomcat-server.yaml service &quot;tomcat-service&quot; created • 30•</p>
<h2>第 44 页</h2>
<h3>第1章</h3>
<p>Kubernetes 入门</p>
<p>注意到我们之前在tomcat-deployment.yaml 里定义的Tomcat 的Pod 刚好拥有这个标签，所以 我们刚才创建的 tomcat-service 已经对应到了一个 Pod 实例，运行下面的命令可以查看 tomcat- service 的 Endpoint 列表，其中172.17.1.3是Pod 的IP 地址，端口 8080 是 Container 暴簬的端口：</p>
<p># kubectl get endpoints NAME</p>
<p>ENDPOINTS</p>
<p>AGE</p>
<p>kubernetes</p>
<p>192.168.18.131:6443 15d tomcat-service</p>
<p>172.17.1.3:8080</p>
<p>1m</p>
<p>你可能有疑问：“说好的 Service 的 Cluster IP 呢？怎么没有看到？”我们运行下面的命令即 可看到 tomct-service 被分配的 Cluster IP 及更多的信息：</p>
<p># kubectl get svc tomcat-service -o yaml apiVersion: v1</p>
<p>kind: Service</p>
<p>metadata：</p>
<p>creationTimestamp: 2016-07-21T17:05:522 name: tomcat-service namespace: default resourceVersion：&quot;23964&quot; selfLink: /api/v1/namespaces/default/services/tomcat-service uid: 61987d3c-4f65-11e6-a9d8-000c29ed42c1 spec：</p>
<p>clusterIP: 169.169.65.227 ports：</p>
<p>- port: 8080</p>
<p>protocol: TCP</p>
<p>targetPort: 8080</p>
<p>selector：</p>
<p>tier: frontend</p>
<p>sessionAffinity: None type: ClusterlP</p>
<p>status：</p>
<p>loadBalancer： ｛｝</p>
<p>在 spec.ports 的定义中，targetPort 属性用来确定提供该服务的容器所暴露（EXPOSE）的端 口号，即具体业务进程在容器内的 targetPort 上提供 TCP/IP 接入；而 port 属性则定义了 Service 的虚端口。前面我们定义 Tomcat 服务的时候，没有指定 targetPort，则默认 targetPort 与 port 相同。</p>
<p>接下来，我们来看看 Service 的多端口问题。</p>
<p>很多服务都存在多个端口的问题，通常一个端口提供业务服务，另外一个端口提供管理服 务，比如Mycat、Codis 等常见中间件。Kubernetes Service 支持多个 Endpoint，在存在多个 Endpoint 的情况下，要求每个 Endpoint定义一个名字来区分。下面是 Tomcat 多端口的 Service 定义样例：</p>
<p>apiVersion: v1</p>
<p>kind: Service</p>
<p>• 31•</p>
<h2>第 45 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） metadata：</p>
<p>name: tomcat-service spec：</p>
<p>ports：</p>
<p>- port:8080</p>
<p>name:service-port</p>
<p>- port:8005</p>
<p>name:shutdown-port selector：</p>
<p>tier: frontend</p>
<p>多端口为什么需要给每个端口命名呢？这就涉及 Kubernetes 的服务发现机制了，我们接下 来进行讲解。</p>
<p>2. Kubernetes 的服务发现机制 任何分布式系统都会涉及“服务发现”这个基础问题，大部分分布式系统通过提供特定的 API 接口来实现服务发现的功能，但这样做会导致平台的侵入性比较强，也增加了开发测试的 困难。Kubernetes 则采用了直观朴素的思路去解决这个棘手的问题。</p>
<p>首先，每个 Kubernetes 中的 Service 都有一个唯一的 Cluster IP 以及唯一的名字，而名字是 由开发者自己定义的，部署的时候也没必要改变，所以完全可以固定在配置中。接下来的问题 就是如何通过 Service 的名字找到对应的 Cluster IP？</p>
<p>最早的时候 Kubernetes 采用了 Linux 环境变量的方式解决这个问题，即每个 Service 生成一 些对应的 Linux 环境变量（ENV），并在每个 Pod 的容器在启动时，自动注入这些环境变量，以 以下是 tomcat-service 产生的环境变量条目：</p>
<p>TOMCAT</p>
<p>_SERVICEL</p>
<p>_SERVICE_HOST=169.169.41.218 TOMCAT</p>
<p>SERVICE_</p>
<p>SERVICE</p>
<p>PORT</p>
<p>_SERVICE</p>
<p>PORT=8080</p>
<p>TOMCAT</p>
<p>SERVICE_</p>
<p>SERVICE_PORT</p>
<p>SHUTDONN_PORT=8005 TOMCAT_SERVICE_SERVICE_PORT=8080 TOMCAT</p>
<p>SERVICE_PORT.</p>
<p>_8005_TCP</p>
<p>_PORT=8005</p>
<p>TOMCAT</p>
<p>_SERVICE</p>
<p>_PORT=tCP://169.169.41.218:8080 TOMCAT</p>
<p>_SERVICEL</p>
<p>_PORT</p>
<p>-8080_TCP.</p>
<p>_ADDR=169.169.41.218 TOMCAT SERVICE</p>
<p>_PORT_8080_</p>
<p>_rCP=tcp://169.169.41.218:8080 TOMCAT_SERVICE_PORT_8080_TCP_PROTO=tcp TOMCAT_SERVICE_PORT」 _PORT=8080</p>
<p>_SERVICE_</p>
<p>_rCP=tcp: //169.169.41.218:8005 TOMCAT_SERVICE_</p>
<p>_PORT_8005_TCP」</p>
<p>ADDR=169.169.41.218 TOMCAT_SERVICE_PORT_8005_TCP _PROTO=tCP</p>
<p>上述环境变量中，比较重要的是前3条环境变量，我们可以看到，每个 Service 的IP地址 及端口都是有标准的命名规范的，遵循这个命名规范，就可以通过代码访问系统环境变量的方 式得到所需的信息，实现服务调用。</p>
<p>• 32•</p>
<h2>第 46 页</h2>
<h3>第1章</h3>
<p>Kubernetes 入门</p>
<p>考虑到环境变量的方式获取 Service 的 IP 与端口的方式仍然不太方便，不够直观，后来 Kubernetes 通过Add-On增值包的方式引入了DNS 系统，把服务名作 DNS域名，这样一来， 程序就可以直接使用服务名来建立通信连接了。目前 Kubernetes 上的大部分应用都已经采用了 DNS这些新兴的服务发现机制，后面的章节中我们会讲述如何部署这套 DNS 系统。</p>
<p>3. 外部系统访问 Service 的问题 为了更加深入地理解和掌握 Kubernetes，我们需要弄明白 Kubernetes 里的“三种IP”这个 关键问题，这三种IP 分别如下。</p>
<p>Node IP: Node 节点的IP地址。</p>
<p>Pod IP: Pod 的IP 地址。</p>
<p>©</p>
<p>Cluster IP: Service 的IP 地址。</p>
<p>首先，Node IP 是 Kubernetes 集群中每个节点的物理网卡的IP 地址，这是一个真实存在的 物理网络，所有属于这个网络的服务器之间都能通过这个网络直接通信，不管它们中是否有部 分节点不属于这个 Kuberetes 集群。这也表明了 Kubernetes 集群之外的节点访问 Kubernetes 集 群之内的某个节点或者 TCP/IP 服务的时候，必须要通过 Node IP 进行通信。</p>
<p>其次，Pod IP 是每个Pod 的IP 地址，它是 Docker Engine 根据 dockerO 网桥的IP 地址段进 行分配的，通常是一个虚拟的二层网络，前面我们说过，Kubernetes 要求位于不同 Node 上的 Pod能够彼此直接通信，所以 Kubernetes 里一个 Pod 里的容器访问另外一个 Pod 里的容器，就 是通过Pod IP 所在的虚拟二层网络进行通信的，而真实的 TCP/IP 流量则是通过 Node IP 所在的 物理网卡流出的。</p>
<p>敏后，我们说说 Service 的 Cluster IP，它也是一个虚拟的IP，但更像是一个“伪造”的IP 网络，原因有以下几点。</p>
<p>◎ Cluster IP 仅仅作用于 Kubernetes Service 这个对象，并由 Kubernetes 管理和分配 IP地 址（来源于 Cluster IP 地址池）。</p>
<p>Cluster IP 无法被 Ping，因为没有一个“实体网络对象”来响应。</p>
<p>Cluster IP 只能结合 Service Port 组成一个具体的通信端口，单独的 Cluster IP 不具备 TCPAIP 通信的基础，并且它们属于 Kubernetes 集群这样一个封闭的空间，集群之外的 节点如果要访问这个通信端口，则需要做一些额外的工作。</p>
<p>在 Kubernetes集群之内，Node IP 网、Pod IP 网与 Cluster IP 网之间的通信，采用的是 Kubernetes 自己设计的一种编程方式的特殊的路由规则，与我们所熟知的IP 路由有很 大的不同。</p>
<p>• 33•</p>
<h2>第 47 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 根据上面的分析和总结，我们基本明白了：Service 的 Cluster IP 属于 Kubernetes 集群内部 的地址，无法在集群外部直接使用这个地址。那么矛盾来了：实际上我们开发的业务系统中肯 定多少有一部分服务是要提供给 Kubernetes 集群外部的应用或者用户来使用的，典型的例子就 是 Web 端的服务模块，比如上面的tomcat-service，那么用户怎么访问它？</p>
<p>采用 NodePort 是解决上述问题的最直接、最有效、最常用的做法。具体做法如下，以 tomcat-service 为例，我们在 Service 的定义里做如下扩展即可（黑体字部分）：</p>
<p>apiVersion: v1</p>
<p>kind: Service</p>
<p>metadata：</p>
<p>name: tomcat-service spec：</p>
<p>type: NodePort</p>
<p>ports：</p>
<p>- port: 8080</p>
<p>nodePort: 31002</p>
<p>selector：</p>
<p>tier: frontend</p>
<p>其中，nodePort:31002 这个属性表明我们手动指定 tomcat-service 的 NodePort 为31002，否 则 Kubernetes 会自动分配一个可用的端口。接下来，我们在浏览器里访问 http://nodePort IP&gt;：31002/，就可以看到Tomat 的欢迎界面了，如图1.16所不。</p>
<p>192.168.18.131:31002 Home Documentation Configuretion Examples Wiki Mailing Lists Find Help</p>
<p>Apache Tomcat/8.0.35 ir youre seeing this, youve suc ed Tomcat Congratulations！</p>
<p>Recommended Reading：</p>
<p>Security Considerations HOW-TO Manager Application HOW-TO Clusterino/Session Replication.HOW-TO Server Stotus</p>
<p>ManagerApp</p>
<p>Host Moneger</p>
<p>Developer Quick Start Iomsat Setup</p>
<p>Eirs Web Applicetion Bealms &amp; AAA</p>
<p>JDBC DateSources</p>
<p>Serdet Specifcatlons Tomcat Versions</p>
<p>Managing Tomcat</p>
<p>For security. access to tne manager webagp is resiricied. Users are deiined in！</p>
<p>SCATALTKA JON/ con.E/tcwcat-aiert.202 In Tomcat 8.0 access to the manager appacalion is spat between diferent users.</p>
<p>Bead.moce</p>
<p>Release Notes</p>
<p>Changelog</p>
<p>Migration.Gulde</p>
<p>Security Ngtices</p>
<p>Documentation</p>
<p>Tomcat 8.0 Documentation Tomcat 8.0Configuration Tomcet Wiki</p>
<p>Fn acdkional mnportant confguraton information in：</p>
<p>SCATALTNKE/NNRLRGLrt Devekopers may be interested in JomkasQ Bua Dahbare TonsalaQjavalsss</p>
<p>Jomsat &amp;.0 S Recesitoo Getting Help</p>
<p>EAQ and Mailing.Lists Jser supoort and dtscussicn tor Aoashe Taglb Brveloomert maing Sat iriuseng commes 图1.16</p>
<p>通过 NodePort 访问 Service • 34•</p>
<h2>第 48 页</h2>
<h3>第1章</h3>
<p>Kubernetes 入门</p>
<p>NodePort的实现方式是在 Kubernetes 集群里的每个 Node 上为需要外部访问的Service 开启 一个对应的TCP 监听端口，外部系统只要用任意一个 Node 的IP 地址+具体的NodePort 端口号 即可访问此服务，在任意 Node 上运行 netstat 命令，我们就可以看到有 NodePort 端口被监听：</p>
<p># netstat -tlp I grep 31002 tcp6 0</p>
<p>0［：：1:31002</p>
<p>［：：］：*</p>
<p>LISTEN</p>
<p>1125/kube-proxy</p>
<p>但 NodePort 还没有完全解决外部访问 Service 的所有问题，比如负载均衡问题，假如我们 的集群中有10个 Node，则此时最好有一个负载均衡器，外部的请求只需访问此负载均衡器的 IP 地址，由负载均衡器负责转发流量到后面某个 Node 的 NodePort 上。如图 1.17所示。</p>
<p>客户端</p>
<p>外部网络</p>
<p>（用户网络）</p>
<p>企业内部网络</p>
<p>Load balancer</p>
<p>Kubernetes集群</p>
<p>NodePort</p>
<p>图1.17 NodePort 与 Load balancer 图1.17中的Load balancer 组件独立于 Kubernetes 集群之外，通常是一个硬件的负载均衡器， 或者是以软件方式实现的，例如 HAProxy 或者 Nginx。对于每个 Service，我们通常需要配置一 个对应的Load balancer 实例来转发流量到后端的Node 上，这的确增加了工作量及出错的概率。</p>
<p>于是Kubernetes 提供了自动化的解决方案，如果我们的集群运行在谷歌的GCE公有云上，那么 只要我们把 Service 的 type= NodePort 改力 type= LoadBalancer，此时 Kubernetes 会自动创建一 个对应的Load balancer 实例并返回它的IP 地址供外部客户端使用。其他公有云提供商只要实现 了支持此特性的驱动，则也可以达到上述目的。此外，裸机上的类似机制（Bare Metal Service Load Balancers）也正在被开发。</p>
<h3>1.4.9 Volume（存储卷）</h3>
<p>Volume 是Pod 中能够被多个容器访问的共享目录。Kubernetes 的 Volume 概念、用途和目 的与 Docker 的 Volume 比较类似，但两者不能等价。首先，Kubernetes 中的 Volume 定义在 Pod • 35•</p>
<h2>第 49 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 上，然后被一个 Pod 里的多个容器挂载到具体的文件目录下；其次，Kubernetes 中的Volume 与 Pod 的生命周期相同，但与容器的生命周期不相关，当容器终止或者重启时，Volume 中的数据 也不会丢失。最后，Kubernetes 支持多种类型的 Volume，例如 GlusterFS、Ceph 等先进的分布 式文件系统。</p>
<p>Volume 的使用也比较简单，在大多数情况下，我们先在Pod 上声明一个Volume，然后在 容器里引用该 Volume 并 Mount 到容器里的某个目录上。举例来说，我们要给之前的 Tomcat Pod 增加一个名字力 dataVol 的 Volume，并且 Mount 到容器的/mydata-data 目录上，则只要对 Pod 的定义文件做如下修正即可（注意黑体字部分）：</p>
<p>template：</p>
<p>metadata：</p>
<p>labels：</p>
<p>app: app-demo</p>
<p>tier：</p>
<p>frontend</p>
<p>spec：</p>
<p>volumes：</p>
<p>- name: datavol</p>
<p>emptyDir：0</p>
<p>containers：</p>
<p>- name: tomcat-demo image: tomcat</p>
<p>volumeMounts：</p>
<p>- mountPath:/mydata-data name: datavol</p>
<p>imagePul1Policy: IfNotPresent 除了可以让一个 Pod里的多个容器共享文件、让容器的数据写到宿主机的磁盘上或者写文 件到网络存储中，Kubernetes 的Volume 还扩展出了一种非常有实用价值的功能，即容器配置文 件集中化定义与管理，这是通过 ConfigMap 这个新的资源对象来实现的，后面我们会详细说明。</p>
<p>Kubernetes 提供了非常丰富的Volume 类型，下面逐一进行说明。</p>
<p>1.emptyDir</p>
<p>一个 emptyDir Volume 是在Pod 分配到 Node 时创建的。从它的名称就可以看出，它的初始 内容为空，并且无须指定宿主机上对应的目录文件，因为这是 Kubernetes 自动分配的一个目录， 当 Pod 从Node 上移除时，emptyDir 中的数据也会被永久删除。emptyDir 的一些用途如下。</p>
<p>◎ 临时空间，例如用于某些应用程序运行时所需的临时目录，且无须永久保留。</p>
<p>（ 长时间任务的中间过程 CheckPoint 的临时保存目录。</p>
<p>©一个容器需要从另一个容器中获取数据的目录（多容器共享目录）。</p>
<p>• 36•</p>
<h2>第 50 页</h2>
<h3>第1章 Kubernetes 入门</h3>
<p>目前，用户无法控制 emptyDir 使用的介质种类。如果 kubelet 的配置是使用硬盘，那么所 有 emptyDir 都将创建在该硬盘上。Pod 在将来可以设置 emptyDir 是位于硬盘、固态硬盘上还是 基于内存的 tmpfs 上，上面的例子便采用了 emptyDir 类的Volume。</p>
<p>2. hostPath</p>
<p>hostPath 为在Pod 上挂载宿主机上的文件或目录，它通常可以用于以下几方面。</p>
<p>◎ 容器应用程序生成的日志文件需要永久保存时，可以使用宿主机的高速文件系统进行存储。</p>
<p>需要访问宿主机上 Docker 引擎内部数据结构的容器应用时，可以通过定义hostPath 为 宿主机/var/ib/docker 目录，使容器内部应用可以直接访问 Docker 的文件系统。</p>
<p>在使用这种类型的Volume 时，需要注意以下几点。</p>
<p>◎ 在不同的Node 上具有相同配置的Pod可能会因为宿主机上的目录和文件不同而导致对 Volume 上目录和文件的访问结果不一致。</p>
<p>如果使用了资源配额管理，则 Kubernetes 无法将 hostPath 在宿主机上使用的资源纳入 管理。</p>
<p>在下面的例子中使用宿主机的/data 目录定义了一个 hostPath 类型的 Volume：</p>
<p>volumes：</p>
<p>- name：&quot;persistent-storage&quot; hostPath：</p>
<p>path： &quot;/data&quot;</p>
<p>3. gcePersistentDisk 使用这种类型的Volume 表示使用谷歌公有云提供的永久磁盘（Persistent Disk,PD）存放 Volume 的数据，它与 EmptyDir 不同，PD 上的内容会被永久保存，当Pod被删除时，PD只是 被卸载（Unmount），但不会被删除。需要注意的是，你需要先创建一个永久磁盘（PD），才能 使用 gcePersistentDisk。</p>
<p>使用 gcePersistentDisk 有以下一些限制条件。</p>
<p>Node（运行 kubelet 的节点）需要是GCE 虚拟机。</p>
<p>这些虚拟机需要与 PD 存在于相同的GCE 项目和 Zone 中。</p>
<p>通过 gcloud 命令即可创建一个 PD：</p>
<p>gcloud compute disks create --size=500GB --zone=us-centrall-a my-data-disk 定义 gcePersistentDisk 类型的 Volume 的示例如下：</p>
<p>•37•</p>
<h2>第 51 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） volumes：</p>
<p>- name: test-volume # This GCE PD must already exist.</p>
<p>gcePersistentDisk：</p>
<p>paiName:my-data-disk EsType:ext4</p>
<p>4. awsElasticBlockStore 与GCE 类似，该类型的Volume 使用亚马逊公有云提供的EBS Volume 存储数据，需要先创 建一个 EBS Volume 才能使用 awsElasticBlockStore。</p>
<p>使用 awsElasticBlockStore 的一些限制条件如下。</p>
<p>Node（运行 kubelet 的节点）需要是 AWSEC2实例。</p>
<p>这些 AWS EC2 实例需要与 EBS volume 存在于相同的 region 和 availability-zone 中。</p>
<p>EBS 只支持单个 EC2实例 mount 一个 volume。</p>
<p>通过 aws ec2 create-volume 命令可以创建一个 EBS volume：</p>
<p>aws ec2 create-volume --availability-zone eu-west-la --size 10 --volume-type gp2 定义 awsElasticBlockStore 类型的 Volume 的示例如下：</p>
<p>- name: test-volume # This AWS EBS volume must already exist.</p>
<p>awSElasticBlockStore：</p>
<p>volumeID: aws://&lt;availability-zone&gt;/&lt;volume-id&gt; fsType:ext4</p>
<p>5. NFS</p>
<p>使用 NFS 网络文件系统提供的共享目录存储数据时，我们需要在系统中部署一个 NFS Server。定义 NFS 类型的 Volume 的示例如下：</p>
<p>volumes：</p>
<p>- name:nfs</p>
<p>nfs：</p>
<p># 改为你的 NES 服务器地址</p>
<p>server: nfs-server.1ocalhost path：&quot;/&quot;</p>
<p>6. 其他类型的 Volume</p>
<p>c iscsi： 使用 iSCSI 存储设备上的目录挂载到Pod中。</p>
<p>• 38•</p>
<h2>第 52 页</h2>
<h3>第1章</h3>
<p>Kubernetes 入门</p>
<p>⑦</p>
<p>flocker：使用Flocker 来管理存储卷。</p>
<p>glusterfs：使用开源 GlusterFS 网络文件系统的目录挂载到Pod中。</p>
<p>© rbd：使用 Linux 块设备共享存储（Rados Block Device）挂载到Pod中。</p>
<p>gitRepo：通过挂载一个空目录，并从 GIT 库 clone 一个 gitrepository 以供Pod使用。</p>
<p>secret：一个 secret volume 用于为Pod提供加密的信息，你可以将定义在 Kubernetes 中 的 secret 直接挂载为文件让Pod 访问。secret volume 是通过 tmfs（内存文件系统）实现 的，所以这种类型的volume 总是不会持久化的。</p>
<h3>1.4.10 Persistent Volume</h3>
<p>之前我们提到的Volume 是定义在Pod 上的，属于“计算资源”的一部分，而实际上，“网 络存储”是相对独立于“计算资源”而存在的一种实体资源。比如在使用虚机的情况下，我们 通常会先定义一个网络存储，然后从中划出一个“网盘”并挂接到虚机上。Persistent Volume（简 称 PV）和与之相关联的 Persistent Volume Claim（简称 PVC）也起到了类似的作用。</p>
<p>PV 可以理解成 Kubernetes 集群中的某个网络存储中对应的一块存储，它与 Volume 很类似， 但有以下区别。</p>
<p>◎ PV 只能是网络存储，不属于任何 Node，但可以在每个 Node 上访问。</p>
<p>•PV 并不是定义在Pod 上的，而是独立于 Pod 之外定义。</p>
<p>PV 目前只有几种类型：GCE Persistent Disks、NFS、RBD、iSCSCI、AWS ElasticBlockStore、GlusterFS 等。</p>
<p>下面给出了 NFS类型 PV 的一个yaml定义文件，声明了需要5Gi 的存储空间：</p>
<p>apiVersion:v1</p>
<p>kind: PersistentVolume metadata：</p>
<p>name:Pv0003</p>
<p>spec：</p>
<p>capacity：</p>
<p>storage:5Gi</p>
<p>accessModes：</p>
<p>- ReadWriteOnce</p>
<p>nfs：</p>
<p>path:/somepath</p>
<p>server: 172.17.0.2 比较重要的是 PV 的 accessModes 属性，目前有以下类型。</p>
<p>• 39•</p>
<h2>第 53 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） ◎</p>
<p>ReadWriteOnce：</p>
<p>读写权限、并且只能被单个Node 挂载。</p>
<p>（）</p>
<p>ReadOnlyMany：只读权限、允许被多个 Node 挂载。</p>
<p>◎</p>
<p>ReadWriteMany：读写权限、允许被多个 Node 挂载。</p>
<p>如果某个 Pod 想申请某种条件的PV，则首先需要定义一个 PersistentVolumeClaim （PVC） 对象：</p>
<p>kind: PersistentVolumeClaim apiversion:v1</p>
<p>metadata：</p>
<p>name:myclaim</p>
<p>spec：</p>
<p>accessModes：</p>
<p>- ReadWriteOnce</p>
<p>resources：</p>
<p>requests：</p>
<p>storage: 8Gi</p>
<p>然后，在Pod 的 Volume 定义中引用上述PVC 即可：</p>
<p>volumes：</p>
<p>- name:mypd</p>
<p>persistentVolumeClaim：</p>
<p>claimName:myclaim</p>
<p>最后，我们说说PV 的状态，PV 是有状态的对象，它有以下几种状态。</p>
<p>◎ Available：空闲状态。</p>
<p>◎ Bound：已经绑定到某个 PVC 上。</p>
<p>© Released：对应的PVC 已经删除，但资源还没有被集群收回。</p>
<p>③ Failed: PV 自动回收失败。</p>
<h3>1.4.11 Namespace（命名空间）</h3>
<p>Namespace（命名空间）是 Kubernetes 系统中的另一个非常重要的概念，Namespace 在很多 情况下用于实现多租户的资源隔离。Namespace 通过将集群内部的资源对象“分配”到不同的 Namespace 中，形成逻辑上分组的不同项目、小组或用户组，便于不同的分组在共享使用整个 集群的资源的同时还能被分别管理。</p>
<p>Kubernetes 集群在启动后，会创建一个名为“default” 的 Namespace，通过 kubectl 可以查 看到：</p>
<p>s kubectl get namespaces • 40•</p>
<h2>第 54 页</h2>
<h3>第1章 Kubernetes 入门</h3>
<p>NAME</p>
<p>LABELS</p>
<p>STATUS</p>
<p>default</p>
<p>&lt;none&gt;</p>
<p>Active</p>
<p>接下来，如果不特别指明 Namespace，则用户创建的Pod、RC、Service 都将被系统创建到 这个默认的名为 default 的 Namespace 中。</p>
<p>Namespace 的定义很简单。如下所示的 yaml定义了名为 development 的 Namespace。</p>
<p>apiVersion: v1</p>
<p>kind: Namespace</p>
<p>metadata：</p>
<p>name:development</p>
<p>一旦创建了 Namespace，我们在创建资源对象时就可以指定这个资源对象属于哪个 Namespace。比如在下面的例子中，我们定义了一个名为 busybox 的Pod，放入 development这 个 Namespace 里：</p>
<p>apiversion: v1</p>
<p>kind: Pod</p>
<p>metadata：</p>
<p>name:busybox</p>
<p>namespace: development spec：</p>
<p>containers：</p>
<p>- image: busybox</p>
<p>command：</p>
<p>- sleep</p>
<p>- &quot;3600&quot;</p>
<p>name:busybox</p>
<p>此时，使用 kubectl get 命令查看将无法显示：</p>
<p>$ kubectl get pods NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS AGE</p>
<p>这是因为如果不加参数，则kubectl get 命令将仅显示属于 “defaulf” 命名空间的资源对象。</p>
<p>可以在 kubectl 命令中加入--namespace 参数来查看某个命名空间中的对象：</p>
<p># kubectl get pods --namespace=development NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS</p>
<p>AGE</p>
<p>busybox</p>
<p>1/1</p>
<p>Running</p>
<p>0</p>
<p>1m</p>
<p>当我们给每个租户创建一个 Namespace 来实现多租户的资源隔离时，还能结合 Kubernetes 的资源配额管理，限定不同租户能占用的资源，例如CPU 使用量、内存使用量等。关于资源配 额管理的问题，在后面的章节中会详细介绍。</p>
<p>• 41•</p>
<h2>第 55 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版）</p>
<h3>1.4.12 Annotation（注解）</h3>
<p>Anotation 与Label 类似，也使用key/value 键值对的形式进行定义。不同的是Label 具有 严格的命名规则，它定义的是 Kubernetes 对象的元数据（Metadata），并且用于 Label Selector。</p>
<p>而 Annotation则是用户任意定义的“附加”信息，以便于外部工具进行查找，很多时候， Kubernetes 的模块自身会通过 Annotation 的方式标记资源对象的一些特殊信息。</p>
<p>通常来说，用 Annotation 来记录的信息如下。</p>
<p>build信息、release信息、Docker 镜像信息等，例如时间戳、release id 号、PR号、镜 像 hash 值、docker registry 地址等。</p>
<p>（ 日志库、监控库、分析库等资源库的地址信息。</p>
<p>◎ 程序调试工具信息，例如工具名称、版本号等。</p>
<p>◎ 团队的联系信息，例如电话号码、负责人名称、网址等。</p>
<h3>1.4.13 小结</h3>
<p>上述这些组件是 Kubernetes 系统的核心组件，它们共同构成了 Kubernetes 系统的框架和计 算模型。通过对它们进行灵活组合，用户就可以快速、方便地对容器集群进行配置、创建和管 理。除了本章所介绍的核心组件，在 Kubernetes 系统中还有许多辅助配置的资源对象，例如 LimitRange、ResourceQuota。另外，一些系统内部使用的对象 Binding、Event 等请参考 Kubernetes 的 API文档。</p>
<p>在第2章中，我们将开始深入实践并全面掌握 Kubernetes 的各种使用技巧。</p>
<p>• 42</p>
</div>
