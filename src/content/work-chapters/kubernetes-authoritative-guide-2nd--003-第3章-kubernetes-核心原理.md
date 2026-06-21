---
title: "第3章 Kubernetes 核心原理"
description: "第3章 Kubernetes 核心原理 本章对 Kubernetes 的核心原理进行深入分析，首先从 API Server 的访问开始讲起，然后分 析 Master 节点上 Controller Manager 各个组件的功能实现，以及 Scheduler 预选算法和优选算法。 接下来讲解 Node 节点上的 kubelet 和 kube-proxy 组件的"
readerUrl: "/books/kubernetes-authoritative-guide-2nd/003-第3章-kubernetes-核心原理.pdf"
sourceUrl: "授权 PDF：Kubernetes权威指南：从Docker到Kubernetes实践全接触（第2版).pdf，页 178-259"
workSlug: "kubernetes-authoritative-guide-2nd"
workTitle: "Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第 2 版）"
chapterSlug: "003-第3章-kubernetes-核心原理"
order: 3
categories: ["云原生", "Kubernetes"]
tags: ["Kubernetes", "Docker", "容器", "集群管理"]
---
<div class="imported-document imported-pdf-document">
<h2>第3章 Kubernetes 核心原理</h2>
<h2>第 178 页</h2>
<h3>第3章</h3>
<p>Kubernetes 核心原理</p>
<p>本章对 Kubernetes 的核心原理进行深入分析，首先从 API Server 的访问开始讲起，然后分 析 Master 节点上 Controller Manager 各个组件的功能实现，以及 Scheduler 预选算法和优选算法。</p>
<p>接下来讲解 Node 节点上的 kubelet 和 kube-proxy 组件的运行机制。最后，深入分析安全机制和 网络原理。</p>
<p>34 Kubernetes API Server 原理分析 总体来看，Kubernetes API Server 的核心功能是提供了 Kubernetes 各类资源对象（如 Pod、 RC、Service 等）的增、删、改、查及 Watch 等HTTP Rest接口，成集群内各个功能模块之间 数据交互和通信的中心枢纽，是整个系统的数据总线和数据中心。除此之外，它还有以下一些 功能特性。</p>
<p>（1）是集群管理的API入口。</p>
<p>（2）是资源配额控制的入口。</p>
<p>（3）提供了完备的集群安全机制。</p>
<h3>3.1.1 Kubernetes API Server 概述</h3>
<p>Kubernetes API Server 通过一个名为 kube-apiserver 的进程提供服务，该进程运行在 Master 节点上。在默认情况下，kube-apiserver 进程在本机的 8080端口（对应参数--insecure-port）提 供 REST服务。我们可以同时启动 HTTPS 安全端口（--secure-port=6443）来启动安全机制，加</p>
<h2>第 179 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 强 RESTAPI 访问的安全性。</p>
<p>通常我们可以通过命令行工具 kubectl 来与 Kubernetes API Server 交互，它们之间的接口是 REST 调用。为了测试和学习 Kubernetes API Server 所提供的接口，我们也可以使用 curl 命令行 工具进行快速验证。</p>
<p>比如，我们登录 Master 节点，运行下面的 curl 命令，得到以 JSON 方式返回的 Kubernetes API 的版本信息：</p>
<p># cur1 localhost:8080/api &quot;kind&quot;：&quot;APIVersions&quot;， &quot;versions&quot;：［</p>
<p>&quot;v1&quot;</p>
<p>］，</p>
<p>&quot;serverAddressByClientCIDRs&quot;：［ &quot;clientCIDR&quot;：&quot;0.0.0.0/0&quot;， &quot;serverAddress&quot;： &quot;192.168.18.131:6443&quot; 可以运行下面的命令，来查看 Kubernetes API Server 目前所支持的资源对象的种类：</p>
<p># curl localhost:8080/api/v1 根据以上命令的输出，我们可以运行下面的 curl 命令，分别返回集群中的Pod列表、Service 列表、RC列表等：</p>
<p># curl localhost:8080/api/v1/pods # curl localhost:8080/api/v1/services # curl localhost:8080/api/v1/replicationcontrollers 如果我们只想对外暴露部分 REST 服务，则可以在 Master 或其他任何节点上通过运行 kubectl proxy 进程启动一个内部代理来实现。</p>
<p>运行下面的命令，我们在8001端口启动代理，并且拒绝客户端访问 RC的API：</p>
<p># kubectl proxy --reject-paths=&quot;^/api/v1/replicationcontrollers&quot; --port=8001 -V=2</p>
<p>Starting to serve</p>
<p>on 127.0.0.1:8001</p>
<p>运行下面的命令进行验证：</p>
<p># curl localhost:8001/api/v1/replicationcontrollers &lt;h3&gt;Unauthorized&lt;/h3&gt; kubectl proxy 具有很多特性，最实用的一个特性是提供简单有效的安全机制，比如采用白 名单来限制非法客户端访问时，只要增加下面这个参数即可：</p>
<p>• 166•</p>
<h2>第 180 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p>--accept-hosts=&quot;^1ocalhost$，^127\1.011.011.1$，^11 ：：111］$&quot; 最后一种方式是通过编程的方式调用 Kubernetes API Server。具体使用场景又细分为以下 两种。</p>
<p>第1种使用场景：运行在Pod里的用户进程调用 Kubernetes API，通常用来实现分布式集 群搭建的目标。比如下面这段来自谷歌官方的 Elastic Search 集群例子中的代码，Pod 在启动的 过程中通过访问 Endpoints 的 API，找到属于 elasticsearch-logging 这个 Service 的所有Pod 副本 的IP 地址，用来构建集群，如图3.1 所示。</p>
<p>if elasticsearch =s nil｛ 8lo8.Warningf（&quot;Failed to find the elasticsearch-logBing service： %v&quot;，err） return</p>
<p>｝</p>
<p>var endpoints rapi.Endpoints addrs:a ［Jstringt） 1/ wait for some endpoints.</p>
<p>count：=9</p>
<p>for t i= time.Now（）；time.Since（t） K S*time.Minutei time.Sleep（10 •time.Second）｛ endpoints,err = C.Endpoints （ap之.NaespaceSystem）.Get（“elasticsearch-2088ing&quot;） ifern ix nil｛</p>
<p>continue</p>
<p>等待5分钟获取集群里其他节点的地址信息 并输出到控制台，随后被写入elasticsearch的 配置文件里</p>
<p>2</p>
<p>addrs# flattensubsets（endpoints. Subsets） 8208.Infof（&quot;Found %s&quot;，addrs） if len（addrs）&gt; e &amp;&amp; len（addrs） •n count｛ break</p>
<p>｝</p>
<p>count • len（addrs） 8i0g.Infof（&quot;Endpodnts. Me™ addrs） fmt.Prsnte（rdiucovery.zem:P2ng.indcast:nosts：！（2ajing,str3ngs.3okin（edors， ） 来自镜像中的容器启动脚本</p>
<p>axpor&#x27;t NODE_MASTERIS（NOOE_MASTER： tPue） expor&#x27;t NODE_DATADS （NCOE.DATA：-tPue） ｝</p>
<p>/e1astkesearch_1ossing_otscovery 2&gt; /elesticsearch-1.5.2/config/elasticseanch.ymt export HTTP_PORT-S（HTTP PORY ： -9200） expor&#x27;t TRANSPORT._PORT S（TRASPORT.，PORT：-9300） /elasticsearch-1.5.2/bin/elaoticsearch 图3.1 应用程序编程访问 API Server 在上述使用场景中，Pod 中的进程如何知道 API Server 的访问地址呢？答案很简单，因为 Kubernetes API Server 本身也是一个 Service，它的名字就是 “kubernetes”，并且它的 Cluster IP 地址是 Cluster IP 地址池里的第1个地址！另外，它所服务的端口是HTTPS 端口 443，通过kubectl get service 命令可以确认这一点：</p>
<p># kubectl get service NAME</p>
<p>CLUSTER-IP</p>
<p>EXTERNAL-IP</p>
<p>PORT（S）</p>
<p>AGE</p>
<p>kubernetes</p>
<p>169.169.0.1</p>
<p>&lt;none&gt;</p>
<p>443/TCP</p>
<p>30d</p>
<p>第2种使用场景：开发基于 Kubernetes 的管理平台。比如调用 Kubernetes API 来完成 Pod、 Service、RC 等资源对象的图形化创建和管理界面，此时可以使用 Kubernetes 及各开源社区力 开发人员提供的各种语言版本的Client Library。我们会在后面介绍通过编程方式访问 API Server 的一些细节技术。</p>
<p>• 167•</p>
<h2>第 181 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 3.1.2</p>
<p>独特的 Kubernetes Proxy API 接口 前面我们说过，Kubernetes API Server 最主要的REST接口是资源对象的增、删、改、查， 除此之外，它还提供了一类很特殊的 REST接口一 -Kubernetes Proxy API 接口，这类接口的作 用是代理REST 请求，即 Kubernetes API Server把收到的REST请求转发到某个Node上的kubelet 守护进程的 REST 端口上，由该Kubelet 进程负责响应。</p>
<p>首先，我们来说说 Kubernetes Proxy API 里关于 Node 的相关接口，该接口的 REST 路径为 /api/v1/proxy/nodes/｛name｝，其中｛name｝为节点的名称或IP 地址，包括以下几个具体接口：</p>
<p>/api/v1/proxy/nodes/｛name｝/pods/ #列出指定节点内所有Pod 的信息</p>
<p>◎</p>
<p>/api/v1/proxy/nodes/｛name｝/stats/ #列出指定节点内物理资源的统计信息</p>
<p>/api/v1/proxy/nodes/｛name｝/spec/ #列出指定节点的概要信息</p>
<p>例如当前Node 节点的名字为k8s-node-1，用下面的命令即可获取该节点上所有运行中的Pod：</p>
<p># curl localhost:8080/api/v1/proxy/nodes/k8s-node-1/pods 需要说明的是：这里获取的Pod 的信息数据来自 Node 而非eted 数据库，所以两者可能在 某些时间点会有偏差。此外，如果 kubelet 进程在启动时包含--enable-debugging-handlers =true 参数，那么 Kubernetes Proxy API 还会增加下面的接口：</p>
<p>/api/v1/proxy/nodes/｛name｝/run #在节点上运行某个容器</p>
<p>（）</p>
<p>◎</p>
<p>/api/v1/proxy/nodes/｛name｝/exec #在节点上的某个容器中运行某条命令</p>
<p>/api/v1/proxy/nodes/｛name｝/attach #在节点上 attach 某个容器</p>
<p>/api/v1/proxy/nodes/｛name｝/portForward #实现节点上的Pod端口转发 /api/v1/proxy/nodes/｛name｝/logs #列出节点的各类日志信息，例如tallylog、 lastlog、wtmp、ppp/、rhsm/、audit/、tuned/和 anaconda/等 ◎</p>
<p>/api/v1/proxy/nodes/ ｛name｝/metrics #列出和该节点相关的Metrics 信息 /api/v1/proxy/nodes/｛name｝/runningpods #列出节点内运行中的Pod信息</p>
<p>/api/v1/proxy/nodes/｛name｝/debug/pprof #列出节点内当前 web 服务的状态，包括 CPU 占用情况和内存使用情况等</p>
<p>接下来，我们来说说 Kubernetes Proxy API 里关于Pod 的相关接口，通过这些接口，我们可 以访问 Pod 里某个容器提供的服务（如Tomcat 在8080 端口服务）：</p>
<p>/api/v1/proxy/namespaces/｛namespace｝ /pods/｛name｝/｛path： *｝#访问 Pod 的某个服 务接口</p>
<p>/api/v1/proxy/namespaces/｛namespace｝ /pods/（name｝ #访问 Pod /api/v1/namespaces/｛namespace｝ /pods/｛name｝/proxy/｛path：*｝#访问 Pod 的某个服 务接口</p>
<p>②</p>
<p>/api/v1/namespaces/｛namespace｝/pods/｛name｝/proxy #访问 Pod 在上面的4个接口里，后面两个接口的功能与前面两个完全一样，只是写法不同。下面我 们用第1章的Java Web 例子中的 Tomcat Pod 来说明上述 Proxy接口的用法。</p>
<p>• 168</p>
<h2>第 182 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p>首先，得到Pod 的名字：</p>
<p># kubectl get pods NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS AGE</p>
<p>mysql-c95jc</p>
<p>1/1</p>
<p>Running</p>
<p>0</p>
<p>8d</p>
<p>myweb-g9pmm</p>
<p>1/1</p>
<p>Running</p>
<p>0</p>
<p>8d</p>
<p>然后，运行下面的命令，会输出 Tomcat 的首页，即相当于访问 http://ocalhost:8080/：</p>
<p>#curl http://1ocalhost:8080/api/v1/proxy/namespaces/default/pods/myweb-g9pm/ 我们也可以在浏览器中访问上面的地址，比如 Master 节点的IP 地址是 192.168.18.131，我 们在浏览器中输入 http://192.168.18.131:8080/api/v1/proxy/namespaces/default/pods/myweb- g9pmm/，就能够访问 Tomcat 首页了；而如果输入/api/v1/proxy/namespaces/default/pods/myweb- g9pmm/demo，就能访问 Tomcat 中 Demo 应用的页面了。</p>
<p>看到这里，你可能明白 Pod 的 Proxy接口的作用和意义了：在 Kubernetes 集群之外访问某 个 Pod 容器的服务（HTTP 服务）时，可以用 Proxy API 实现，这种场景多用于管理目的，比如 逐一排查 Service的Pod副本，检查哪些Pod 的服务存在异常问题。</p>
<p>虽后我们说说 Service，Kubernetes Proxy API 也有 Service 的Proxy 接口，其接口定义与 Pod 的接口定义基本一样：/api/v1/proxy/namespaces/｛namespace｝/services/｛name｝。比如，我 们想访问 myweb 这个 Service，则可以在浏览器里输入 http://192.168.18.131:8080/api/v1/proxy/ namespaces/default/services/myweb/demo/。</p>
<p>3.1.3</p>
<p>集群功能模块之间的通信</p>
<p>从图3.2中可以看出，Kubernetes API Server 作集群的核心，负责集群各功能模块之间的 通信。集群内的各个功能模块通过 API Server 将信息存入etcd，当需要获取和操作这些数据时， 则通过 API Server 提供的 REST 接口（用GET、LIST 或WATCH 方法）来实现，从而实现各模 块之间的信息交互。</p>
<p>常见的一个交互场景是 kubelet 进程与 API Server 的交互。每个 Node 节点上的 kubelet 每隔 一个时间周期，就会调用一次 API Server 的 REST 接口报告自身状态，API Server 接收到这些 信息后，将节点状态信息更新到 etcd 中。此外，kubelet 也通过 API Server 的Watch 接口监听 Pod 信息，如果监听到新的Pod 副本被调度绑定到本节点，则执行 Pod 对应的容器的创建和启 动逻辑；如果监听到 Pod 对象被删除，则删除本节点上的相应的Pod 容器；如果监听到修改Pod 信息，则kubelet 监听到变化后，会相应地修改本节点的Pod 容器。</p>
<p>• 169•</p>
<h2>第 183 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） kubelet</p>
<p>Proxy</p>
<p>Master</p>
<p>Kubctl Proxy</p>
<p>kubct！</p>
<p>Authentrcat:on/Authorkzauion/Admission Controt API Server</p>
<p>Scheduler</p>
<p>Controller Manager kubelet</p>
<p>citvisor</p>
<p>Proxy</p>
<p>ZAALLZXN</p>
<p>图3.2 Kubernetes 结构图 另外一个交互场景是 kube-controller-manager 进程与 API Server 的交互。kube-controller- manager 中的 Node Controller 模块通过 API Sever 提供的Watch 接口，实时监控 Node 的信息， 并做相应处理。</p>
<p>还有一个比较重要的交互场景是 kube-scheduler 与 API Server 的交互。当 Scheduler 通过API Server 的 Watch 接口监听到新建Pod 副本的信息后，它会检索所有符合该Pod 要求的Node 列 表，开始执行 Pod调度逻辑，调度成功后将 Pod 绑定到目标节点上。</p>
<p>为了缓解集群各模块对 API Server 的访问压力，各功能模块都采用缓存机制来缓存数据。</p>
<p>各功能模块定时从 API Server 获取指定的资源对象信息（通过LIST及 WATCH 方法），然后将 这些信息保存到本地缓存，功能模块在某些情况下不直接访问 API Server，而是通过访问缓存 数据来间接访问 API Server。</p>
<h3>3.2 Controller Manager 原理分析</h3>
<p>Controller Manager 作为集群内部的管理控制中心，负责集群内的 Node、Pod 副本、服务端 点（Endpoint）、命名空间（Namespace）、服务账号（ServiceAccount）、资源定额（ResourceQuota） 等的管理，当某个 Node 意外宕机时，Controller Manager 会及时发现此故障并执行自动化修复 流程，确保集群始终处于预期的工作状态。</p>
<p>如图 3.3所示，Controller Manager 内部包含 Replication Controller、Node Controller、 ResourceQuota Controller、Namespace Controller、ServiceAccount Controller、Token Controller、 • 170•</p>
<h2>第 184 页</h2>
<h3>第3章</h3>
<p>Kubernetes 核心原理</p>
<p>Service Controller 及 Endpoint Controller 等多个 Controller，每种 Controller 都负责一种具体的控 制流程，而 Controller Manager 正是这些 Controller 的核心管理者。</p>
<p>Controller Manager Replication</p>
<p>Controlier</p>
<p>Namespace</p>
<p>Controller</p>
<p>Service</p>
<p>Controlier</p>
<p>Node Controller</p>
<p>ServiceAccount</p>
<p>Controller</p>
<p>Endpoint</p>
<p>Controller</p>
<p>ResourceQuota</p>
<p>Controller</p>
<p>Token Controlier</p>
<p>图 3.3 Controller Manager 结构图 一般来说，智能系统和自动系统通常会通过一个被称为“操纵系统”的机构来不断修正系 统的工作状态。在 Kubernetes 集群中，每个 Controller 都是这样一个“操纵系统”，它们通过 API Server 提供的接口实时监控整个集群里的每个资源对象的当前状态，当发生各种故障导致 系统状态发生变化时，会尝试着将系统状态从“现有状态”修正到“期望状态”。本节将详细分 析 Controller Manager 的这些 Controller 的原理。</p>
<p>由于 ServiceAccount Controller 与 Token Controller 是与安全相关的两个控制器，并且与 Service Account、Token 密切相关，所以我们将对它们的分析放到后面的深入集群安全的章节中 讲解。</p>
<p>在 Kubernetes 集群中与 Controller Manager 并重的另一个组件是 Kubernetes Scheduler，它的 作用是将待调度的 Pod（包括通过 API Server 新创建的 Pod及 RC 为补足副本而创建的Pod 等） 通过一些复杂的调度流程计算出最佳目标节点，然后绑定到该节点上。本章最后会介绍 Kubernetes Scheduler 调度器的基本原理。</p>
<h3>3.2.1 Replication Controller</h3>
<p>为了区分 Controller Manager 中的Replication Controller（副本控制器）和资源对象 Replication Controller，我们将资源对象 Replication Controller 简写为 RC，而本节中的 Replication Controller 是指“副本控制器”，以便于后续分析。</p>
<p>Replication Controller 的核心作用是确保在任何时候集群中一个RC所关联的Pod 副本数量 保持预设值。如果发现 Pod副本数量超过预期值，则 Replication Controller 会销毁一些Pod副本；</p>
<p>• 171•</p>
<h2>第 185 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 反之，Replication Controller 会自动创建新的Pod 副本，直到符合条件的Pod 副本数量达到预设 值。需要注意的一点是：只有当 Pod 的重启策略是 Always 的时候（RestartPolicy=Always）， Replication Controller 才会管理该Pod 的操作（例如创建、销毁、重启等）。在通常情况下，Pod 对象被成功创建后不会消失，唯一的例外是当 Pod 处于 succeeded 或 failed 状态的时间过长（超 时参数由系统设定）时，该Pod 会被系统自动回收，管理该Pod 的副本控制器将在其他工作节 点上重新创建、运行该Pod副本。</p>
<p>RC 中的Pod 模板就像一个模具，模具制作出来的东西一旦离开模具，它们之间就再也没 关系了。同样，一旦 Pod 被创建完毕，无论模板如何变化，甚至换成一个新的模板，也不会影 响到已经创建的Pod。此外，Pod 可以通过修改它的标签来实现脱离RC的管控。该方法可以用 于将 Pod从集群中迁移、数据修复等调试。对于被迁移的Pod 副本，RC会自动创建一个新的 副本替换被迁移的副本。需要注意的是，删除一个 RC 不会影响它所创建的Pod。如果想删除 一个 RC 所控制的Pod，则需要将该 RC的副本数（Replicas）属性设置为0，这样所有的Pod 副本都会被自动删除。</p>
<p>我们最好不要越过 RC而直接创建Pod，因为 Replication Controller 会通过RC管理Pod副 本，实现自动创建、补足、替换、删除Pod副本，这样能提高系统的容灾能力，减少由于节点 崩溃等意外状况造成的损失。即使你的应用程序只用到一个Pod副本，我们也强烈建议使用RC 来定义Pod。</p>
<p>我们总结一下 Replication Controller 的职责，如下所述。</p>
<p>（1）确保当前集群中有且仅有 N个 Pod实例，N是RC 中定义的Pod副本数量。</p>
<p>（2） 通过调整 RC 的 spec.replicas 属性值来实现系统扩容或者缩容。</p>
<p>（3）通过改变RC中的Pod模板（主要是镜像版本）来实现系统的滚动升级。</p>
<p>最后，我们总结一下 Replication Controller 的典型使用场景，如下所述。</p>
<p>（1）重新调度（Rescheduling）。如前面所提及的，不管你想运行1个副本还是1000个副本， 副本控制器都能确保指定数量的副本存在于集群中，即使发生节点故障或Pod 副本被终止运行 等意外状况。</p>
<p>（2） 弹性伸缩（Scaling）。手动或者通过自动扩容代理修改副本控制器的 spec.replicas 属性 值，非常容易实现扩大或缩小副本的数量。</p>
<p>（3）滚动更新（Rolling Updates）。副本控制器被设计成通过逐个替换Pod的方式来辅助服 务的滚动更新。推荐的方式是创建一个新的只有一个副本的RC，若新的RC副本数量加1，则 旧的RC的副本数量减1，直到这个旧的RC的副本数量为零，然后删除该旧的RC。通过上述 模式，即使在滚动更新的过程中发生了不可预料的错误，Pod 集合的更新也都在可控范围内。</p>
<p>• 172•</p>
<h2>第 186 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p>在理想情况下，滚动更新控制器需要将准备就绪的应用考虑在内，并保证在集群中任何时刻都 有足够数量的可用 Pod。</p>
<h3>3.2.2 Node Controller</h3>
<p>kubelet 进程在启动时通过 API Server 注册自身的节点信息，并定时向 APi Server 汇报状态 信息，API Server 接收到这些信息后，将这些信息更新到etcd 中，etcd 中存储的节点信息包括 节点健康状况、节点资源、节点名称、节点地址信息、操作系统版本、Docker 版本、kubelet 版本等。节点健康状况包含“就绪”（True）“未就绪”（False）和“未知”（Unknown）三种。</p>
<p>Node Controller 通过 API Server 实时获取 Node 的相关信息，实现管理和监控集群中的各个 Node 节点的相关控制功能，Node Controller 的核心工作流程如图3.4所示。</p>
<p>如果Controller Manager设置了 “-cluster-cidr”參数，则为每 个Node配置“Spec.PodCIDR” 没有收到节点信息或第一次收</p>
<p>到节点信息，或在该处理过程</p>
<p>中节点状态变成非“健康”</p>
<p>状态</p>
<p>用Mastcr节点的系统时间作</p>
<p>为探测时间和节点状态变化</p>
<p>时间</p>
<p>逐个读取Node信息，并和本</p>
<p>地nodeStatusMap做比较</p>
<p>在指定时间内收到新的</p>
<p>节点信息，且节点状态</p>
<p>发生变化</p>
<p>用Master节点的系统时间作</p>
<p>为探测时间和节点状态变化</p>
<p>时间</p>
<p>在指定时间内收到新的节</p>
<p>点信息，但节点状态没发</p>
<p>生变化</p>
<p>用Master节点的系统时间作为探测时 间，用上次节点信息中的节点状态变</p>
<p>化时间作为该节点的状态变化时间</p>
<p>如果在某一段时间内没有收到节点状</p>
<p>态信总，则设置节点状态为“未知”</p>
<p>删除节点或同步</p>
<p>节点信息</p>
<p>图3.4 Node Controller 流程图 对流程中关键点的解释如下。</p>
<p>• 173•</p>
<h2>第 187 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） （1） Controller Manager 在启动时如果设置了--cluster-cidr 参数，那么为每个没有设置 Spec.PodCIDR 的 Node 节点生成一个 CIDR地址，并用该 CIDR地址设置节点的 Spec.PodCIDR 属性，这样做的目的是防止不同节点的CIDR地址发生冲突。</p>
<p>（2）逐个读取节点信息，多次尝试修改 nodeStatusMap 中的节点状态信息，将该节点信息 和 Node Controller 的 nodeStatusMap 中保存的节点信息做比较。如果判断出没有收到 kubelet发 送的节点信息、第1次收到节点 kubelet发送的节点信息，或在该处理过程中节点状态变成非“健 康”状态，则在 nodeStatusMap 中保存该节点的状态信息，并用 Node Controller 所在节点的系 统时间作为探测时间和节点状态变化时间。如果判断出在指定时间内收到新的节点信息，且节 点状态发生变化，则在 nodeStatusMap 中保存该节点的状态信息，并用 Node Controller 所在节 点的系统时间作为探测时间和节点状态变化时间。如果判断出在指定时间内收到新的节点信息， 但节点状态没发生变化，则在 nodeStatusMap 中保存该节点的状态信息，并用 Node Controller 所在节点的系统时间作为探测时间，用上次节点信息中的节点状态变化时间作为该节点的状态 变化时间。如果判断出在某一段时间（gracePeriod）内没有收到节点状态信息，则设置节点状 态为“未知”（Unknown），并且通过 API Server 保存节点状态。</p>
<p>（3）逐个读取节点信息，如果节点状态变为非“就绪”状态，则将节点加入待删除队列， 否则将节点从该队列中删除。如果节点状态为非“就绪”状态，且系统指定了 Cloud Provider， 则 Node Controller 调用 Cloud Provider 查看节点，若发现节点故障，则删除etcd 中的节点信息， 并删除和该节点相关的 Pod 等资源的信息。</p>
<h3>3.2.3 ResourceQuota Controller</h3>
<p>作为完备的企业级的容器集群管理平台，Kubernetes 也提供了资源配额管理（ResourceQuota Controller）这一高级功能，资源配额管理确保了指定的资源对象在任何时候都不会超量占用系 统物理资源，避免了由于某些业务进程的设计或实现的缺陷导致整个系统运行紊乱甚至意外宕 机，对整个集群的平稳运行和稳定性有非常重要的作用。</p>
<p>目前 Kubernetes 支持如下三个层次的资源配额管理。</p>
<p>（1）容器级别，可以对CPU 和 Memory 进行限制。</p>
<p>（2）Pod级别，可以对一个 Pod 内所有容器的可用资源进行限制。</p>
<p>（3） Namespace 级别，</p>
<p>为 Namespace（多租户）级别的资源限制，包括：</p>
<p>◎ Pod数量；</p>
<p>Replication Controller 数量；</p>
<p>Service 数量；</p>
<p>• 174•</p>
<h2>第 188 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p>ResourceQuota 数量；</p>
<p>Secret 数量；</p>
<p>可持有的 PV（Persistent Volume）数量。</p>
<p>Kubernetes 的配额管理是通过 Admission Control（准入控制）来控制的，Admission Control 当前提供了两种方式的配额约束，分别是 LimitRanger 与 ResourceQuota。其中 LimitRanger 作 用于 Pod 和 Container 上，而 ResourceQuota 则作用于 Namespace 上，限定一个 Namespace 里的 各类资源的使用总额。</p>
<p>如图3.5所示，如果在Pod定义中同时声明了 LimitRanger，则用户通过 API Server 请求创 建或修改资源时，Admission Control 会计算当前配额的使用情况，如果不符合配额约束，则创 建对象失败。对于定义了 ResourceQuota 的 Namespace，ResourceQuota Controller 组件则负责定 期统计和生成该 Namespace 下的各类对象的资源使用总量，统计结果包括 Pod、Service、RC、 Secret 和 Persistent Volume 等对象实例个数，以及该 Namespace 下所有 Container 实例所使用的 资源量（目前包括 CPU 和内存），然后将这些统计结果写入 eted 的 resourceQuotaStatusStorage 目录 （resourceQuotas/status）中。写入 resourceQuotaStatusStorage 的内容包含 Resource 名称、 配额值（ResourceQuota 对象中 spec.hard 域下包含的资源的值）、当前使用值（ResourceQuota Controller 统计出来的值）。随后这些统计信息被 Admission Control 使用，以确保相关 Namespace 下的资源配额总量不会超过 ResourceQuota 中的限定值。</p>
<p>CiiCn</p>
<p>Ar server</p>
<p>KesourceQuota Controller Resource Quota、Pad、 Service、RC:Secret和 Persistent Volume</p>
<p>创建、修改、删除资源</p>
<p>信息，并同步到etcd</p>
<p>定时调用</p>
<p>保存结果</p>
<p>返问Resource</p>
<p>Ouota</p>
<p>请求创建资源</p>
<p>Admission Controller 读取Resource</p>
<p>Vuoua</p>
<p>读取各类资源信息，</p>
<p>园时统计这些资源，</p>
<p>并将结果写入etcd</p>
<p>读取Resource</p>
<p>Quota定义</p>
<p>读取统计结果</p>
<p>1</p>
<p>判断请来是否合法，</p>
<p>并返回结果</p>
<p>保行统计结果</p>
<p>返四Resource</p>
<p>Quota</p>
<p>•返回统计结果</p>
<p>图 3.5 ResourceQuota Controller 流程图 • 175•</p>
<h2>第 189 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 3.2.4</p>
<p>Namespace Controller 用户通过 API Server 可以创建新的 Namespace 并保存在 etcd 中，Namespace Controller 定时 通过 API Server 读取这些 Namespace 信息。如果 Namespace 被 API 标识为优雅删除（通过设置 删除期限，即 DeletionTimestamp 属性被设置），则将该 NameSpace 的状态设置成“Terminating” 并保存到 etcd 中。同时 Namespace Controller 删除该 Namespace 下的 ServiceAccount、RC、Pod、 Secret、PersistentVolume、ListRange、ResourceQuota 和 Event 等资源对象。</p>
<p>当Namespace 的状态被设置成 “Terminating” 后，由Admission Controller 的 NamespaceLifecycle 插件来阻止为该 Namespace 创建新的资源。同时，在 Namespace Controller 删除完该 Namespace 中的所有资源对象后，Namespace Controller 对该 Namespace 执行 finalize 操作，删除 Namespace 的 spec.finalizers 域中的信息。</p>
<p>如果 Namespace Controller 观察到 Namespace 设置了删除期限，同时 Namespace 的 spec.finalizers 域值是空的，那么 Namespace Controller 将通过 API Server 删除该Namespace 资源。</p>
<p>3.2.5</p>
<p>Service Controller 与 Endpoint Controller 我们先说说 Endpoints Controller，在这之前，让我们先看看 Service、Endpoints 与Pod 的关 系，如图 3.6所示，Endpoints 表示了一个 Service 对应的所有 Pod 副本的访问地址，而 Endpoints Controller 就是负责生成和维护所有 Endpoints 对象的控制器。</p>
<p>spec.selector:app=MyApp Endpoints（MyService） addresses：</p>
<p>DOrLS：</p>
<p>PODIP: PORT</p>
<p>Backend Pod</p>
<p>fabels:app=MyApp</p>
<p>Backend Pod</p>
<p>labels:app=MyApp</p>
<p>Backend Pod</p>
<p>labels:app=MyApp</p>
<p>图 3.6 Service、Endpoint、Pod 的关系 Backend Pod</p>
<p>labels:app=MyApP</p>
<p>• 176•</p>
<h2>第 190 页</h2>
<h3>第3章</h3>
<p>Kubernetes 核心原理</p>
<p>它负责监听 Service 和对应的Pod 副本的变化，如果监测到 Service 被删除，则删除和该 Service 同名的 Endpoints 对象；如果监测到新的 Service 被创建或者修改，则根据该 Service 信息获得相关的Pod 列表，然后创建或者更新 Service 对应的 Endpoints 对象。如果监测到 Pod 的事件，则更新它所对应的 Service 的 Endpoints 对象（增加、删除或者修改对应的 Endpoint 条目）。</p>
<p>那么，Endpoints 对象是在哪里被使用的呢？答案是每个 Node 上的 kube-proxy 进程， kube-proxy 进程获取每个 Service 的 Endpoints，实现了 Service 的负载均衡功能。在后面的章节 中我们会深入讲解这部分内容。</p>
<p>接下来我们说说 Service Controller 的作用，它其实是属于 Kubernetes 集群与外部的云平台 之间的一个接口控制器。Service Controller 监听 Service 的变化，如果是一个 LoadBalancer 类型 的 Service （exteralLoadBalancers=true），则 Service Controller 确保外部的云平台上该 Service 对 应的 LoadBalancer 实例被相应地创建、删除及更新路由转发表（根据 Endpoints 的条目）。</p>
<p>33</p>
<p>Scheduler 原理分析</p>
<p>我们在前面深入分析了 Controller Manager 及它所包含的各个组件的运行机制。本节我们将 继续对 Kubernetes 中负责Pod 调度的重要功能模块—Kubernetes Scheduler 的工作原理和运行 机制做深入分析。</p>
<p>Kubernetes Scheduler 在整个系统中承担了“承上启下”的重要功能，“承上”是指它负责接 收 Controller Manager 创建的新Pod，为其安排一个落脚的“家”—目标 Node：“启下”是指 安置工作完成后，目标 Node上的kubelet 服务进程接管后继工作，负责Pod 生命周期中的“下 半生”。</p>
<p>具体来说，Kubernetes Scheduler 的作用是将待调度的 Pod（API 新创建的 Pod、Controller Manager 为补足副本而创建的Pod 等）按照特定的调度算法和调度策略绑定（Binding）到集群 中的某个合适的 Node 上，并将绑定信息写入etcd 中。在整个调度过程中涉及三个对象，分别 是：待调度 Pod 列表、可用Node 列表，以及调度算法和策略。简单地说，就是通过调度算法 调度为待调度Pod 列表的每个 Pod 从Node 列表中选择一个最适合的 Node。</p>
<p>随后，目标节点上的 kubelet 通过 API Server 监听到 Kubernetes Scheduler 产生的 Pod 绑定 事件，然后获取对应的Pod 清单，下载Image 镜像，并启动容器。完整的流程如图3.7所示。</p>
<p>• 177</p>
<h2>第 191 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） Master</p>
<p>binding</p>
<p>API Server</p>
<p>Noae</p>
<p>kubclet</p>
<p>Node</p>
<p>kubelet</p>
<p>Node</p>
<p>Kubeiet</p>
<p>Node</p>
<p>Kubelet</p>
<p>图3.7 Scheduler 流程</p>
<p>Kubernetes Scheduler 当前提供的默认调度流程分为以下两步。</p>
<p>（1）预选调度过程，即遍历所有目标 Node，筛选出符合要求的候选节点。为此，Kubernetes 内置了多种预选策略（xxx Predicates）供用户选择。</p>
<p>（2）确定最优节点，在第1步的基础上，采用优选策略（xxx Priority）计算出每个候选节 点的积分，积分最高者胜出。</p>
<p>Kubernetes Scheduler 的调度流程是通过插件方式加载的“调度算法提供者”（AlgorithmProvider） 具体实现的。一个 AlgorithmProvider 其实就是包括了一组预选策略与一组优先选择策略的结构 体，注册 AlgorithmProvider 的函数如下：</p>
<p>func RegisterAlgorithmProvider（name string,predicateKeys,priorityKeys util.Stringset）</p>
<p>它包含三个参数：“name string”参数力算法名：“predicateKeys”参数为算法用到的预选策 略集合；“priorityKeys”为算法用到的优选策略集合。</p>
<p>Scheduler 中可用的预选策略包含：NoDiskConflict、PodFitsResources、PodSelectorMatches、 PodFitsHost、CheckNodeLabeIPresence、CheckServiceAffinity 和 PodFitsPorts 策略等。其默认的 AlgorithmProvider 加载的预选策略 Predicates 包括：PodFitsPorts （PodFitsPorts）、PodFitsResources （PodFitsResources）、NoDiskConflict （NoDiskConflict）、MatchNodeSelector （PodSelectorMatches） • 178</p>
<h2>第 192 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p>和 HostName（PodFitsHost），即每个节点只有通过前面提及的5个默认预选策略后，才能初步 被选中，进入下一个流程。</p>
<p>下面列出的是对所有预选策略的详细说明。</p>
<p>1） NoDiskConflict</p>
<p>判断备选 Pod的GCEPersistentDisk 或 AWSElasticBlockStore 和备选的节点中己存在的Pod 是否存在冲突。检测过程如下。</p>
<p>（1）首先，读取备选Pod 的所有 Volume 的信息（即 pod.Spec.Volumes），对每个 Volume 执 行以下步骤进行冲突检测。</p>
<p>（2）如果该 Volume 是 GCEPersistentDisk，则将 Volume 和备选节点上的所有 Pod 的每个 Volume 进行比较，如果发现相同的 GCEPersistentDisk，则返回 false，表明存在磁盘冲突，检查 结束，反馈给调度器该备选节点不适合作为备选Pod；如果该 Volume 是 AWSElasticBlockStore， 则将 Volume 和备选节点上的所有 Pod 的每个 Volume 进行比较，如果发现相同的 AWSElasticBlockStore，则返回 false，表明存在磁盘冲突，检查结束，反馈给调度器该备选节点 不适合备选 Pod。</p>
<p>（3）如果检查完备选Pod 的所有Volume 均未发现冲突，则返回 true，表明不存在磁盘冲突， 反馈给调度器该备选节点适合备选 Pod。</p>
<p>2） PodFitsResources 判断备选节点的资源是否满足备选Pod 的需求，检测过程如下。</p>
<p>（1）计算备选Pod 和节点中已存在 Pod 的所有容器的需求资源（内存和CPU）的总和。</p>
<p>（2）获得备选节点的状态信息，其中包含节点的资源信息。</p>
<p>（3）如果备选Pod和节点中己存在Pod 的所有容器的需求资源（内存和CPU）的总和，超 出了备选节点拥有的资源，则返回 false，表明备选节点不适合备选Pod，否则返回 true，表明 备选节点适合备选 Pod。</p>
<p>3） PodSelectorMatches 判断备选节点是否包含备选Pod 的标签选择器指定的标签。</p>
<p>（1）如果 Pod没有指定 spec.nodeSelector 标签选择器，则返回 true。</p>
<p>（2）否则，获得备选节点的标签信息，判断节点是否包含备选 Pod 的标签选择器（spec.</p>
<p>nodeSelector）所指定的标签，如果包含，则返回 true，否则返回 false。</p>
<p>4） PodFitsHost</p>
<p>判断备选 Pod 的 spec.nodeName 域所指定的节点名称和备选节点的名称是否一致，如果一 •179．</p>
<h2>第 193 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 致，则返回 true，否则返回 false。</p>
<p>5） CheckNodeLabelPresence 如果用户在配置文件中指定了该策略，则 Scheduler 会通过 RegisterCustomFitPredicate 方法 注册该策略。该策略用于判断策略列出的标签在备选节点中存在时，是否选择该备选节点。</p>
<p>（1）读取备选节点的标签列表信息。</p>
<p>（2）如果策略配置的标签列表存在于备选节点的标签列表中，且策略配置的 presence 值为 false，则返回 false，否则返回 true：如果策略配置的标签列表不存在于备选节点的标签列表中， 且策略配置的 presence 值为 true，则返回 false，否则返回 true。</p>
<p>6） CheckServiceAffinity 如果用户在配置文件中指定了该策略，则 Scheduler 会通过 RegisterCustomFitPredicate 方法 注册该策略。该策略用于判断备选节点是否包含策略指定的标签，或包含和备选 Pod 在相同 Service 和 Namespace 下的Pod 所在节点的标签列表。如果存在，则返回 true，否则返回 false。</p>
<p>7） PodFitsPorts</p>
<p>判断备选Pod所用的端口列表中的端口是否在备选节点中己被占用，如果被占用，则返回 false，否则返回 true。</p>
<p>Scheduler 中的优选策略包含：LeastRequestedPriority、CalculateNodeLabelPriority 和 BalancedResourceAllocation 等。每个节点通过优先选择策略时都会算出一个得分，计算各项得 分，最终选出得分值最大的节点作为优选的结果（也是调度算法的结果）。</p>
<p>下面是对所有优选策略的详细说明。</p>
<p>1） LeastRequestedPriority 该优选策略用于从备选节点列表中选出资源消耗最小的节点。</p>
<p>（1）计算出所有备选节点上运行的 Pod 和备选 Pod 的CPU 占用量 totalMilliCPU。</p>
<p>（2）计算出所有备选节点上运行的Pod 和备选 Pod 的内存占用量 totalMemory。</p>
<p>（3）计算每个节点的得分，计算规则大致如下。</p>
<p>NodeCpuCapacity 为节点 CPU 计算能力；NodeMemoryCapacity 为节点内存大小。</p>
<p>score=int（（ （nodeCpuCapacity-totalMi11iCPU） *10）/ nodeCpuCapacity+ （ （nodeMemory Capacity-totalMemory）*10）/ nodeCpuMemory） /2） 2） CalculateNodeLabelPriority 如果用户在配置文件中指定了该策略，则 scheduler 会通过 RegisterCustomPriorityFunction 方法注册该策略。该策略用于判断策略列出的标签在备选节点中存在时，是否选择该备选节点。</p>
<p>• 180</p>
<h2>第 194 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p>如果备选节点的标签在优选策略的标签列表中且优选策略的 presence 值为true，或者备选节点 的标签不在优选策略的标签列表中且优选策略的 presence false，则备选节点 score=10，否 则备选节点 score=0。</p>
<p>3） BalancedResourceAllocation 该优选策略用于从备选节点列表中选出各项资源使用率最均衡的节点。</p>
<p>（1）计算出所有备选节点上运行的Pod 和备选 Pod 的CPU 占用量 totalMilliCPU。</p>
<p>（2） 计算出所有备选节点上运行的Pod 和备选Pod 的內存占用量 totalMemory。</p>
<p>（3）计算每个节点的得分，计算规则大致如下。</p>
<p>NodeCpuCapacity 为节点CPU计算能力；NodeMemoryCapacity 为节点内存大小。</p>
<p>score= int（10-math.Abs （totalMi11iCPU/nodeCpuCapacity-totalMemory/ nodeMemoryCapacity）*10）</p>
<h3>3.4 kubelet 运行机制分析</h3>
<p>在 Kubernetes 集群中，在每个 Node 节点（又称 Minion）上都会启动一个 kubelet 服务进程。</p>
<p>该进程用于处理 Master 节点下发到本节点的任务，管理 Pod 及Pod 中的容器。每个 kubelet 进 程会在 API Server 上注册节点自身信息，定期向 Master 节点汇报节点资源的使用情况，并通过 cAdvisor 监控容器和节点资源。</p>
<h3>3.4.1 节点管理</h3>
<p>节点通过设置 kubelet 的启动参数 “--register-node”，来决定是否向 API Server 注册自己。</p>
<p>如果该参数的值 true，那么 kubelet 将试着通过 API Server 注册自己。在自注册时，kubelet 启动时还包含下列参数。</p>
<p>--api-servers：告诉 kubelet API Server 的位置。</p>
<p>--kubeconfig： 告诉 kubelet 在哪儿可以找到用于访问 API Server 的证书。</p>
<p>--cloud-provider： 告诉kubelet 如何从云服务商（IaaS）那里读取到和自己相关的元数据。</p>
<p>当前每个 kubelet 被授予创建和修改任何节点的权限。但是在实践中，它仅仅创建和修改自 己。将来，我们计划限制kubelet 的权限，仅允许它修改和创建其所在节点的权限。如果在集群 运行过程中遇到集群资源不足的情况，则用户很容易通过添加机器及运用 kubelet 的自注册模式 • 181•</p>
<h2>第 195 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 来实现扩容。</p>
<p>在某些情况下，Kubernetes 集群中的某些kubelet 没有选择自注册模式，用户需要自己去配 置 Node 的资源信息，同时告知 Node上的kubelet API Server 的位置。集群管理者能够创建和修 改节点信息。如果管理者希望手动创建节点信息，则通过设置 kubelet 的启动参数 “_-register- node=false”即可。</p>
<p>kubelet 在启动时通过 API Server 注册节点信息，并定时向 API Server发送节点的新消息， API Server 在接收到这些信息后，将这些信息写入eted。通过kubelet 的启动参数“--node-status- update-frequency”设置 kubelet 每隔多少时间向 API Server报告节点状态，默认为10秒。</p>
<h3>3.4.2 Pod 管理</h3>
<p>kubelet 通过以下几种方式获取自身 Node上所要运行的Pod 清单。</p>
<p>（1）文件：kubelet 启动参数“-config”指定的配置文件目录下的文件（默认目录为“/etc/ kubernetes/manifests/”）。通过--file-check-frequency 设置检查该文件目录的时间间隔，默认力 20秒。</p>
<p>（2） HTTP 端点（URL）：通过“-manifest-ur！”参数设置。通过--http-check-frequency 设置 检查该HTTP 端点数据的时间间隔，默认为20秒。</p>
<p>（3）API Server:kubelet 通过 API Server 监听 etcd 目录，同步Pod列表。</p>
<p>所有以非 API Server 方式创建的Pod 都叫作 Static Pod。kubelet 将 Static Pod 的状态汇报给 API Server,API Server 为该 Static Pod 创建一个 Mirror Pod 和其相匹配。Mirror Pod 的状态将真 实反映 Static Pod 的状态。当 Static Pod 被删除时，与之相对应的 Mirror Pod 也会被删除。在本 章中我们只讨论通过 API Server 获得 Pod 清单的方式。kubelet 通过 API Server Client 使用 Watch 加 List 的方式监听 “/registry/nodes/$当前节点的名称”和“/registry/pods” 目录，将获取的信息 同步到本地缓存中。</p>
<p>kubelet 监听 etcd，所有针对Pod 的操作将会被 kubelet 监听到。如果发现有新的绑定到本节 点的Pod，则按照Pod 清单的要求创建该 Pod。</p>
<p>如果发现本地的Pod被修改，则kubelet 会做出相应的修改，比如删除Pod 中的某个容器时， 则通过 Docker Client 删除该容器。</p>
<p>如果发现删除本节点的Pod，则删除相应的Pod，并通过 Docker Client 删除Pod 中的容器。</p>
<p>kubelet 读取监听到的信息，如果是创建和修改Pod任务，则做如下处理。</p>
<p>（1）为该Pod 创建一个数据目录。</p>
<p>• 182•</p>
<h2>第 196 页</h2>
<h3>第3章</h3>
<p>Kubernetes 核心原理</p>
<p>（2）从API Server 读取该Pod清单。</p>
<p>（3）为该 Pod 挂载外部卷（External Volume）。</p>
<p>（4） 下载 Pod 用到的 Secret。</p>
<p>（5）检查已经运行在节点中的Pod，如果该Pod没有容器或 Pause 容器（“kubernetes/pause” 镜像创建的容器）没有启动，则先停止Pod 里所有容器的进程。如果在Pod 中有需要删除的容 器，则删除这些容器。</p>
<p>（6）用“kubernetes/pause” 镜像为每个 Pod 创建一个容器。该 Pause 容器用于接管 Pod 中 所有其他容器的网络。每创建一个新的 Pod，kubelet 都会先创建一个 Pause 容器，然后创建其 他容器。“kubernetes/pause” 镜像大概 200KB，是一个非常小的容器镜像。</p>
<p>（7）为Pod 中的每个容器做如下处理。</p>
<p>为容器计算一个 hash 值，然后用容器的名字去查询对应 Docker 容器的hash 值。若查 找到容器，且两者的 hash 值不同，则停止 Docker 中容器的进程，并停止与之关联的 Pause 容器的进程；若两者相同，则不做任何处理。</p>
<p>如果容器被终止了，且容器没有指定的 restartPolicy（重启策略），则不做任何处理。</p>
<p>调用 Docker Client 下载容器镜像，调用 Docker Client 运行容器。</p>
<p>3.4.3</p>
<p>容器健康检查</p>
<p>Pod通过两类探针来检查容器的健康状态。一个是 LivenessProbe 探针，用于判断容器是否 健康，告诉 kubelet 一个容器什么时候处于不健康的状态。如果 LivenessProbe 探针探测到容器 不健康，则kubelet 将删除该容器，并根据容器的重启策略做相应的处理。如果一个容器不包含 LivenessProbe 探针，那么kubelet 认该容器的 LivenessProbe 探针返回的值永远是 “Success”；</p>
<p>另一类是 ReadinessProbe 探针，用于判断容器是否启动完成，且准备接收请求。如果 ReadinessProbe 探针检测到失败，则 Pod 的状态将被修改。Endpoint Controller 将从 Service 的 Endpoint 中删除包含该容器所在 Pod 的IP 地址的 Endpoint 条目。</p>
<p>kubelet 定期调用容器中的 LivenessProbe 探针来诊断容器的健康状况。LivenessProbe 包含 以下三种实现方式。</p>
<p>（1） ExecAction：在容器内部执行一个命令，如果该命令的退出状态码为0，则表明容器 健康。</p>
<p>（2）TCPSocketAction：通过容器的IP 地址和端口号执行TCP 检查，如果端口能被访问， 则表明容器健康。</p>
<p>• 183•</p>
<h2>第 197 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） （3）HTTPGetAction：通过容器的IP 地址和端口号及路径调用 HTTP Get 方法，如果响应 的状态码大于等于 200且小于等于 400，则认为容器状态健康。</p>
<p>LivenessProbe 探针包含在 Pod 定义的 spec.containers.｛某个容器｝中。下面的例子展示了两 种 Pod 中容器健康检查的方式：HTTP 检查和容器命令执行检查。下面所列的内容实现了通过 容器命令执行检查：</p>
<p>livenessProbe：</p>
<p>exec：</p>
<p>command：</p>
<p>- cat</p>
<p>- /tmp/health</p>
<p>initialDelaySeconds: 15 timeoutSeconds: 1</p>
<p>kubelet 在容器中执行“cat /tmp/health”命令，如果该命令返回的值为0，则表明容器处于 健康状态，否则表明容器处于不健康状态。</p>
<p>下面所列的内容实现了容器的 HTTP 检查：</p>
<p>livenessProbe：</p>
<p>httpGet：</p>
<p>path:/healthz</p>
<p>port:8080</p>
<p>initialDelaySeconds: 15 timeoutSeconds: 1</p>
<p>kubelet 发送一个HTTP 请求到本地主机和端口及指定的路径，来检查容器的健康状况。</p>
<p>3.4.4</p>
<p>cAdvisor 资源监控</p>
<p>在 Kubernetes 集群中如何监控资源的使用情况？</p>
<p>在 Kubernetes 集群中，应用程序的执行情况可以在不同的级别上监测到，这些级别包括：</p>
<p>容器、Pod、Service 和整个集群。作为 Kubernetes 集群的一部分，Kubernetes 希望提供给用户 详细的各个级别的资源使用信息，这将使用户能够深入地了解应用的执行情况，并找到应用中 可能的瓶颈。Heapster 项目次 Kubernetes 提供了一个基本的监控平台，它是集群级别的监控和 事件数据集成器（Aggregator）。Heapster Pod运行在 Kubernetes 集群中，和运行在 Kubernetes 集群中的其他应用相似。Heapster Pod 通过kubelet（运行在节点上的Kubernetes 代理）发现所 有运行在集群中的节点，并查看来自这些节点的资源使用状况信息。kubelet 通过 cAdvisor 获取 其所在节点及容器的数据，Heapster 通过带着关联标签的Pod 分组这些信息，这些数据被推到 一个可配置的后端，用于存储和可视化展示。当前支持的后端包括 InfluxDB（with Grafana for • 184•</p>
<h2>第 198 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p>Visualization）</p>
<p>和 Google Cloud Monitoring。</p>
<p>cAdvisor 是一个开源的分析容器资源使用率和性能特性的代理工具。它是因为容器而产生 的，因此自然支持 Docker 容器。在 Kuberetes 项目中，cAdvisor 被集成到 Kubernetes 代码中。</p>
<p>cAdvisor 自动查找所有在其所在节点上的容器，自动采集CPU、内存、文件系统和网络使用的 统计信息。cAdvisor 通过它所在节点机的Root容器，采集并分析该节点机的全面使用情况。</p>
<p>在大部分 Kubernetes 集群中，cAdvisor 通过它所在节点机的4194端口暴露一个简单的 UI。</p>
<p>图3.8 是cAdvisor 的一个截图。</p>
<p>Unsage</p>
<p>Toa Uwge</p>
<p>322型</p>
<p>3272限</p>
<p>ta沈附</p>
<p>uwage per Core</p>
<p>Uaae Braeksbowr</p>
<p>图3.8 cAdvisor的一个UI • 185</p>
<h2>第 199 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） kubelet 作为连接 Kubernetes Master 和各节点机之间的桥梁，管理运行在节点机上的Pod 和容器。kubelet 将每个 Pod 转换成它的成员容器，同时从cAdvisor 获取单独的容器使用统计信 息，然后通过该 RESTAPI 暴露这些聚合后的Pod资源使用的统计信息。</p>
<p>3.5</p>
<p>kube-proxy 运行机制分析</p>
<p>我们在前面已经了解到，为了支持集群的水平扩展、高可用性，Kubernetes 抽象出了 Service 的概念。Service 是对一组Pod 的抽象，它会根据访问策略（如负载均衡策略）来访问这组 Pod。</p>
<p>Kubernetes 在创建服务时会为服务分配一个虚拟的IP 地址，客户端通过访问这个虚拟的IP 地址来访问服务，而服务则负责将请求转发到后端的Pod上。这不就是一个反向代理吗？不错， 这就是一个反向代理。但是，它和普通的反向代理有一些不同：首先它的IP 地址是虚拟的，想 从外面访问还需要一些技巧；其次是它的部署和启停是 Kubernetes 统一自动管理的。</p>
<p>Service 在很多情况下只是一个概念，而真正将 Service 的作用落实的是背后的 kube-proxy 服务进程。只有理解了 kube-proxy 的原理和机制，我们才能真正理解 Service 背后的实现逻辑。</p>
<p>在 Kubernetes 集群的每个 Node 上都会运行一个 kube-proxy 服务进程，这个进程可以看作 Service 的透明代理兼负载均衡器，其核心功能是将到某个 Service 的访问请求转发到后端的多 个 Pod 实例上。对每一个 TCP 类型的 Kubernetes Service，kube-proxy 都会在本地 Node 上建立 一个 SocketServer 来负责接收请求，然后均匀发送到后端某个 Pod 的端口上，这个过程默认采 用 Round Robin 负载均衡算法。另外，Kubernetes 也提供通过修改 Service 的 service.spec.</p>
<p>sessionAffinity 参数的值来实现会话保持特性的定向转发，如果设置的值为“ClientIP”，则将来 自同一个 ClientIP 的请求都转发到同一个后端 Pod上。</p>
<p>此外，Service 的 Cluster IP 与 NodePort 等概念是 kube-proxy 服务通过Iptables 的 NAT 转换 实现的，kube-proxy 在运行过程中动态创建与 Service 相关的Iptables 规则，这些规则实现了 Cluster IP 及 NodePort 的请求流量重定向到 kube-proxy 进程上对应服务的代理端口的功能。由 于 Iptables 机制针对的是本地的kube-proxy 端口，所以每个 Node 上都要运行 kube-proxy 组件， 这样一来，在 Kubernetes 集群内部，我们可以在任意 Node 上发起对 Service 的访问请求。</p>
<p>综上所述，由于 kube-proxy 的作用，在 Service 的调用过程中客户端无须关心后端有几个 Pod，中间过程的通信、负载均衡及故障恢复都是透明的，如图3.9所示。</p>
<p>访问 Service 的请求，不论是用 Cluster IP + TargetPort 的方式，还是用节点机 IP+ NodePort 的方式，都被节点机的Iptables 规则重定向到 kube-proxy 监听 Service 服务代理端口。kube-proxy 接收到 Service 的访问请求后，会如何选择后端的Pod 呢？</p>
<p>• 186</p>
<h2>第 200 页</h2>
<h3>第3章</h3>
<p>Kubernetes 核心原理</p>
<p>外aClient</p>
<p>服务路由信息通过</p>
<p>watch API Server得到 Pod</p>
<p>Cluster IE:Poct</p>
<p>kube-proxy</p>
<p>集群自动分配服</p>
<p>务的IP</p>
<p>通过Iptables的DNAT</p>
<p>前传到kube-proxy</p>
<p>Pod</p>
<p>Pod</p>
<p>图3.9 Service 的负载均衡转发规则 首先，目前 kube-proxy 的负载均衡器只支持 Round Robin 算法。Round Robin 算法按照成员 列表逐个选取成员，如果一轮循环完，便从头开始下一轮，如此循环往复。kube-proxy 的负载 均衡器在 Round Robin 算法的基础上还支持 Session 保持。如果 Service 在定义中指定了 Session 保持，则 kube-proxy 接收请求时会从本地内存中查找是否存在来自该请求 IP 的 affinityState 对 象，如果存在该对象，且 Session 没有超时，则kube-proxy 将请求转向该 affinityState 所指向的 后端 Pod。如果本地存在没有来自该请求 IP 的affinityState 对象，则按照 Round Robin 算法为该 请求挑选一个 Endpoint，并创建一个 affinityState 对象，记录请求的 IP 和指向的 Endpoint。后 面的请求就会“黏连”到这个创建好的 affinityState 对象上，这就实现了客户端IP 会话保持的 功能。</p>
<p>接下来我们深入分析 kube-proxy 的实现细节。</p>
<p>kube-proxy 通过查询和监听 API Server 中 Service 与 Endpoints 的变化，为每个 Service 都建 立了一个“服务代理对象”，并自动同步。服务代理对象是 kube-proxy 程序内部的一种数据结构， 它包括一个用于监听此服务请求的 SocketServer，SocketServer 的端口是随机选择的一个本地空 闲端口。此外，kube-proxy 内部也创建了一个负载均衡器—LoadBalancer，LoadBalancer 上保 存了 Service 到对应的后端 Endpoint列表的动态转发路由表，而具体的路由选择则取决于 Round Robin 负载均衡算法及 Service 的 Session 会话保持（SessionAffinity）这两个特性。</p>
<p>针对发生变化的 Service 列表，kube-proxy 会逐个处理。下面是具体的处理流程。</p>
<p>（1）如果该 Service 没有设置集群 IP （ClusterIP），则不做任何处理，否则，获取该 Service 的所有端口定义列表（spec.ports 域）。</p>
<p>（2）逐个读取服务端口定义列表中的端口信息，根据端口名称、Service 名称和 Namespace 判断本地是否已经存在对应的服务代理对象，如果不存在则新建；如果存在并且 Service 端口被 修改过，则先删除Iptables 中和该 Service 端口相关的规则，关闭服务代理对象，然后走新建流 • 187 •</p>
<h2>第 201 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 程，即为该 Service 端口分配服务代理对象并为该 Service 创建相关的 Iptables 规则。</p>
<p>（3）更新负载均衡器组件中对应 Service 的转发地址列表，对于新建的 Service，确定转发 时的会话保持策略。</p>
<p>（4）对于已经删除的 Service 则进行清理。</p>
<p>而针对Endpoint 的变化，kube-proxy会自动更新负载均衡器中对应Service 的转发地址列表。</p>
<p>下面讲解 kube-proxy 针对 Iptables 所做的一些细节操作。</p>
<p>kube-proxy 在启动时和监听到 Service 或 Endpoint 的变化后，会在本机 Iptables 的NAT表 中添加4条规则链。</p>
<p>（1） KUBE-PORTALS-CONTAINER：从容器中通过 Service Cluster IP 和端口号访问 Service 的请求。</p>
<p>（2） KUBE-PORTALS-HOST：从主机中通过 Service Cluster IP 和端口号访问 Service 的请求。</p>
<p>（3） KUBE-NODEPORT-CONTAINER： 从容器中通过 Service 的 NodePort 端口号访问 Service 的请求。</p>
<p>（4） KUBE-NODEPORT-HOST： 从主机中通过 Service 的 NodePort 端口号访问 Service 的请求。</p>
<p>此外，kube-proxy 在 Iptables 中內每个 Service 创建由 Cluster IP + Service 端口到 kube-proxy 所在主机 IP + Service 代理服务所监听的端口的转发规则。转发规则的包匹配规则部分 （CRETIRIA）如下所示：</p>
<p>-m comment --comment SSERVICESTRING -P SPROTOCOL -m SPROTOCOL --dport $DESTPORT -d SDESTIP</p>
<p>其中，“-m comment --comment”表示匹配规则使用 Iptables 的显式扩展的注释功能；</p>
<p>“$SERVICESTRING” 为注释的内容；“-p SPROTOCOL -m $PROTOCOL --dport $DESTPORT-d SDESTIP”表示协议为“SPROTOCOL”且目标地址和端口为“$DESTIP” 和 “$DESTPORT” 的包，其中，“SPROTOCOL”可以为 TCP 或UDP， “$DESTIP”和 “SDESTPORT” 为 Service 的 Cluster IP 和 TargetPort。</p>
<p>对于转发规则的跳转部分（j部分），如果请求来自本地容器，且 Service 代理服务监听的 是所有的接口（例如IPv4 的地址为0.0.0.0），则跳转部分如下所示：</p>
<p>-j REDIRECT --to-ports SproxyPort 其表示该规则的功能是实现数据包的端口重定向，重定向到SproxyPort 端口（Service 代理 服务监听的端口）；否则，跳转部分如下所示：</p>
<p>-j DNAT --to-destination proxyIP:proxyPort 表示该规则的功能是实现数据包转发，数据包的目的地址变力 “proxyIP:proxyPort”（即 • 188•</p>
<h2>第 202 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p>Service 代理服务所在的IP 地址和端口，这些地址和端口都会被替换成实际的地址和端口）。</p>
<p>如果 Service 类型为 NodePort，则 kube-proxy 在Iptables 中除了添加上面提及的规则，还会 为每个 Service 创建由 NodePort 端口到 kube-proxy所在主机 IP + Service 代理服务所监听的端 口的转发规则。转发规则的包匹配规则部分（CRETIRIA）如下所示：</p>
<p>-m comment --comment $SERVICESTRING -P SPROTOCOL -m SPROTOCOL --dport SNODEPORT 上面所列的内容用于匹配目的端口为 “SNODEPORT”的包。</p>
<p>转发规则的跳转部分（j部分）和前面提及的跳转规则一致。</p>
<p>最后，我们以本书第2章的Hello World 为例，看看 kube-proxy 为 redis-master 服务所生成 的Iptables 转发规则：</p>
<p>s iptables-save | grep redis-master -A KUBE-PORTALS-CONTAINER -d 10.254.208.57/32 -p tcp -m comment --comment &quot;default/redis-master：&quot; -m tcp --dport 6379 -j REDIRECT --to-ports 42872 -A KUBE-PORTALS-HOST -d 10.254.208.57/32 -p tcp -m comment --comment &quot;default/redis-master：&quot; -m tcp --dport 6379 -j DNAT --to-destination 192.168.1.130:42872 可以看到，对 “redis-master”Service 的6379端口的访问将会被转发到物理机的42872端 口上。而42872 端口就是 kube-proxy 为这个 Service 打开的随机本地端口。</p>
<p>最后，给出本节的一个总结性的示意图，如图3.10所示。</p>
<p>Controller Manager API</p>
<p>etcd</p>
<p>Ciuster IP 和target port 到Service的映射</p>
<p>Node</p>
<p>Iplanles</p>
<p>Proxy安装Iptables规期， 这整規</p>
<p>则用于捕获通过Cluster IP和Port 访问Service的请求，</p>
<p>并重定向这</p>
<p>些请求到前面提及的随机𧖣口</p>
<p>AAA</p>
<p>Cluster IP and target port Node</p>
<p>AAA</p>
<p>Proxy</p>
<p>Kubelet</p>
<p>AAA</p>
<p>AA</p>
<p>My Servicg</p>
<p>Node</p>
<p>Mroxy</p>
<p>Kubelct</p>
<p>Iptables</p>
<p>AAA</p>
<p>AA</p>
<p>为每个Service Proxy在本地节点打开一个随机选择的 端口，Proxy决定哪个后台Pod被选定。任何访问该端 口的连接格被代理到相应的某个后端Pod。</p>
<p>图3.10 kube-proxy 工作原理示意图 • 189</p>
<h2>第 203 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 3.6</p>
<p>深入分析集群安全机制</p>
<p>Kubernetes 通过一系列机制来实现集群的安全控制，其中包括 API Server 的认证授权、准 入控制机制及保护敏感信息的 Secret 机制等。集群的安全性必须考虑如下几个目标。</p>
<p>（1）保证容器与其所在的宿主机的隔离。</p>
<p>（2）限制容器给基础设施及其他容器带来消极影响的能力。</p>
<p>（3）最小权限原则—合理限制所有组件的权限，确保组件只执行它被授权的行为，通过 限制单个组件的能力来限制它所能到达的权限范围。</p>
<p>（4）明确组件间边界的划分。</p>
<p>（5）划分普通用户和管理员的角色。</p>
<p>（6）在必要的时候允许将管理员权限赋给普通用户。</p>
<p>（7）允许拥有“Secret” 数据（Keys、Certs、Passwords）的应用在集群中运行。</p>
<p>下面分别从 Authentication、Authorization、Admission Control、Secret 和 Service Account 等 方面来说明集群的安全机制。</p>
<h3>3.6.1 API Server 认证</h3>
<p>我们知道，Kuberetes 集群中所有资源的访问和变更都是通过 Kubernetes API Server 的 REST API 来实现的，所以集群安全的关键点就在于如何识别并认证客户端身份（Authentication），以 及随后访问权限的授权（Authorization）这两个关键问题，本节我们讲解前一个问题。</p>
<p>我们知道，Kubernetes 集群提供了3种级别的客户端身份认证方式。</p>
<p>最严格的 HTTPS证书认证：基于CA 根证书签名的双向数字证书认证方式。</p>
<p>◎ HTTP Token 认证：通过一个 Token 来识别合法用户。</p>
<p>◎ HTTP Base 认证：通过用户名＋密码的方式认证。</p>
<p>首先，我们说说HTTPS 证书认证的原理。</p>
<p>这里需要有一个CA 证书，我们知道CA是PKI 系统中通信双方都信任的实体，被称为可 信第三方（Trusted Third Party,TTP）。CA 作为可信第三方的重要条件之一就是CA 的行为具 有非否认性。作为第三方而不是简单的上级，就必须能让信任者有追究自己责任的能力。CA 通过证书证实他人的公钥信息，证书上有CA 的签名。用户如果因为信任证书而有了损失，则 证书可以作为有效的证据用于追究CA 的法律责任。正是因为CA 承担责任的承诺，所以CA • 190•</p>
<h2>第 204 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p>也被称为可信第三方。在很多情况下，CA与用户是相互独立的实体，CA 作为服务提供方，有 可能因为服务质量问题（例如，发布的公钥数据有错误）而给用户带来损失。在证书中绑定了 公钥数据和相应私钥拥有者的身份信息，并带有CA 的数字签名；证书中也包含了CA 的名称， 以便于依赖方找到CA 的公钥，验证证书上的数字签名。</p>
<p>CA 认证涉及诸多概念，比如根证书、自签名证书、密钥、私钥、加密算法及 HTTPS等， 本书大致讲述 SSL 协议的流程，有助于对CA 认证和 Kubernetes CA 认证的配置过程的理解。</p>
<p>如图3.11所示，SSL 双向认证大概包含下面几个步骤。</p>
<p>（1）HTTPS通信双方的服务器端向CA机构申请证书，CA机构是可信的第三方机构，它 可以是一个公认的权威的企业，也可以是企业自身。企业内部系统一般都用企业自身的认证系 统。CA机构下发根证书、服务端证书及私钥给申请者。</p>
<p>（2）HTTPS通信双方的客户端向CA 机构申请证书，CA 机构下发根证书、客户端证书及 私钥给申请者。</p>
<p>（3）客户端向服务器端发起请求，服务端下发服务端证书给客户端。客户端接收到证书后， 通过私钥解密证书，并利用服务器端证书中的公钥认证证书信息比较证书里的消息，例如域名和 公钥与服务器刚刚发送的相关消息是否一致，如果一致，则客户端认可这个服务器的合法身份。</p>
<p>（4）客户端发送客户端证书给服务器端，服务端接收到证书后，通过私钥解密证书，获得 客户端证书公钥，并用该公钥认证证书信息，确认客户端是否合法。</p>
<p>（5）客户端通过随机密钥加密信息，并发送加密后的信息给服务端。服务器端和客户端协 商好加密方案后，客户端会产生一个随机的密钥，客户端通过协商好的加密方案，加密该随机 密钥，并发送该随机密钥到服务器端。服务器端接收这个密钥后，双方通信的所有内容都通过 该随机密钥加密。</p>
<p>CA机构</p>
<p>申请证书</p>
<p>客户端</p>
<p>图 3.11</p>
<p>下发证书 申请证书</p>
<p>身份认证（证书）</p>
<p>身份认证（证书）</p>
<p>通信（随机私钥）</p>
<p>CA 认证流程</p>
<p>下发证书</p>
<p>服务器端</p>
<p>• 191•</p>
<h2>第 205 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 如上所述是双向认证SSL 协议的具体通信过程，这种情况要求服务器和用户双方都有证书。</p>
<p>单向认证 SSL 协议不需要客户拥有CA证书，对于上面的步骤，只需将服务器端验证客户证书 的过程去掉，以及在协商对称密码方案和对称通话密钥时，服务器发送给客户的是没有加过密 的（这并不影响SSL 过程的安全性）密码方案。</p>
<p>其次，我们来看看 HTTP Token 的认证原理。</p>
<p>HTTP Token 的认证是用一个很长的特殊编码方式的并且难以被模仿的字符串—Token 来 表明客户身份的一种方式。在通常情况下，Token 是一个很复杂的字符串，比如我们用私钥签 名一个字符串后的数据就可以当作一个 Token。此外，每个 Token 对应一个用户名，存储在 API Server 能访问的一个文件中。当客户端发起 API 调用请求时，需要在 HTTP Header 里放入 Token， 这样一来，API Server 就能识别合法用户和非法用户了。</p>
<p>最后，我们说说 HTTP Base 认证。</p>
<p>我们知道，HTTP 协议是无状态的，浏览器和 Web 服务器之间可以通过Cookie 来进行身份 识别。桌面应用程序（比如新浪桌面客户端、SkyDrive 客户端、命令行程序）一般不会使用Cookie， 那么它们与 Web 服务器之间是如何进行身份识别的呢？这就用到了 HTTP Base 认证，这种认证 方式是把“用户名+冒号+密码”用 BASE64 算法进行编码后的字符串放在 HTTP Request 中的 Header Authorization 域里发送给服务端，服务端收到后进行解码，获取用户名及密码，然后进 行用户身份的鉴权过程。</p>
<h3>3.6.2 API Server 授权</h3>
<p>对合法用户进行授权（Authorization）并且随后在用户访问时进行鉴权，是权限与安全系统 的重要一环。简单地说，授权就是授予不同的用户不同的访问权限，API Server 目前支持以下 几种授权策略（通过 API Server 的启动参数“-authorization_mode”设置）。</p>
<p>AlwaysDeny。</p>
<p>◎ AlwaysAllow。</p>
<p>③ ABAC。</p>
<p>其中，AlwaysDeny 表示拒绝所有的请求，该配置一般用于测试：AlwaysAllow 表示接收所 有的请求，如果集群不需要授权流程，则可以采用该策略，这也是 Kuberetes 的默认配置；ABAC （Attribute-Based Access Control）为基于属性的访问控制，表示使用用户配置的授权规则去匹配 用户的请求。</p>
<p>为了简化授权的复杂度，对于 ABAC模式的授权策略，Kubernetes 仅有下面四个基本属性。</p>
<p>• 192•</p>
<h2>第 206 页</h2>
<h3>第3章</h3>
<p>Kubernetes 核心原理</p>
<p>用户名（代表一个已经被认证的用户的字符型用户名）。</p>
<p>是否是只读请求（REST 的GET 操作是只读的）。</p>
<p>t 被访问的是哪一类资源，例如访问 Pod 资源/api/v1/namespaces/default/pods。</p>
<p>◎ 被访问对象所属的 Namespace。</p>
<p>当我们为 API Server 启用 ABAC 模式时，需要指定授权策略文件的路径和名字 （--authorization policy_file=SOME_FILENAME），授权策略文件里的每一行都是一个Map 类型 的JSON 对象，被称为“访问策略对象”，我们可以通过设置“访问策略对象”中的如下属性来 确定具体的授权行为。</p>
<p>user（用户名）：为字符串类型，该字符串类型的用户名来源于 Token 文件或基本认证 文件中的用户名字段的值。</p>
<p>readonly（只读标识）：为布尔类型，当它的值为 true 时，表明该策略允许GET 请求通过。</p>
<p>resource（资源）：为字符串类型，来自于 URL 的资源，例如 “Pods”。</p>
<p>namespace（命名空间）：为字符串类型，表明该策略允许访问某个 Namespace 的资源。</p>
<p>例如，我们要实现如下访问控制。</p>
<p>（1）允许用户 alice 做任何事情 （2） kubelet 只能访问Pod 的只读 API。</p>
<p>（3）kubelet 能读和写 Event 对象。</p>
<p>（4）用户bob 只能访问 myNamespace 中的Pod 的只读 API。</p>
<p>则满足上述要求的授权策略文件的内容写法如下：</p>
<p>｛&quot;user&quot;：&quot;alice&quot;｝</p>
<p>｛&quot;user&quot;：&quot;kubelet&quot;，&quot;resource&quot;：&quot;pods&quot;， &quot;readonly&quot; ： true） ｛&quot;user&quot;： &quot;kubelet&quot;，&quot;resource&quot;： &quot;events&quot;｝ ｛&quot;user&quot;： &quot;bob&quot;，&quot;resource&quot;：&quot;pods&quot;，&quot;readonly&quot;： true， &quot;ns&quot;： &quot;myNamespace &quot;｝ 当客户端发起 API Server 调用时，API Server 内部要先进行用户认证，接下来执行用户鉴 权流程，鉴权流程通过之前提到的“授权策略”来决定一个 API 调用是否合法。当 API Server 接收到请求后，会读取该请求中的数据，生成一个“访问策略对象”，如果该请求中不带某些属 性（如Namespace），则这些属性的值将根据属性类型的不同，设置不同的默认值（例如为字符 串类型的属性设置一个空字符串；为布尔类型的属性设置 false；为数值类型的属性设置O）。然 后用这个“访问策略对象”和授权策略文件中的所有“访问策略对象”逐条匹配，如果至少有 一个策略对象被匹配上，则该请求将被鉴权通过，否则终止API 调用流程，并返回客户端错误 调用码。</p>
<p>• 193</p>
<h2>第 207 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版）</p>
<h3>3.6.3 Admission Control 准入控制</h3>
<p>突破了之前所说的认证和鉴权两道关口之后，客户端的调用请求就能够得到 API Server 的 真正响应了吗？答案是：不能！这个请求还需要通过 Admission Control 所控制的一个“准入控 制链”的层层考验，官方标准的“关卡”有近十个之多，而且能自定义扩展！笔者忽然在想， 如果在幼儿园的时候，老师就告诉我们长大后还要读小学，参加中考、高考、公司面试、职称 考试，等等，我们还会天天去幼儿园吗？</p>
<p>Admission Control 配备有一个“准入控制器”的列表，发送给 API Server 的任何请求都需 要通过列表中每个准入控制器的检查，检查不通过，则 API Server 拒绝此调用请求。此外，准 入控制器还能够修改请求参数以完成一些自动化的任务，比如 ServiceAccount 这个控制器。当 前可配置的准入控制器如下。</p>
<p>AlwaysAdmit：允许所有请求。</p>
<p>AlwaysPullimages：在启动容器之前总是去下载镜像，相当于在每个容器的配置项 imagePullPolicy=Always。</p>
<p>AlwaysDeny：禁止所有请求，一般用于测试。</p>
<p>DenyExecOnPrivileged：它会拦截所有想在 Privileged Container 上执行命令的请求。如 果你的集群支持 Privileged Container，你又希望限制用户在这些 Privileged Container 上执行命令，那么强烈推荐你使用它。</p>
<p>ServiceAccount：这个 plug-in 将 serviceAccounts 实现了自动化，默认启用，如果你想 要使用 ServiceAccount 对象，那么强烈推荐你使用它，后面讲述 ServiceAccount 的章 节会详细说明其作用。</p>
<p>SecurityContextDeny：这个插件将使用了 SecurityContext 的Pod 中定义的选项全部失 效。SecurityContext 在 Container 中定义了操作系统级别的安全设定（uid、gid、 capabilities、SELinux 等）。</p>
<p>ResourceQuota： 用于配额管理目的，作用于 Namespace 上，它会观察所有的请求，确 保在 namespace 上的配额不会超标。推荐在 Admission Control 参数列表中这个插件排 取后一个。</p>
<p>LimitRanger： 用于配额管理，作用于 Pod 与 Container 上，确保Pod 与 Container 上的 配额不会超标。</p>
<p>NamespaceExists（已过时）：对所有请求校验 namespace 是否已存在，如果不存在则拒 绝请求。已合并至 NamespaceLifecycle。</p>
<p>• 194•</p>
<h2>第 208 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p>NamespaceAutoProvision（已过时）：对所有请求校验 namespace，如果不存在则自动创 建该 namespace，推荐使用 NamespaceLifecycle。</p>
<p>NamespaceLifecycle：如果尝试在一个不存在的 namespace 中创建资源对象，则该创建 请求将被拒绝。当删除一个 namespace 时，系统将会删除该 namespace 中的所有对象， 包括 Pod、Service 等。</p>
<p>在 API Server 上设置--admission-control 参数，即可定制我们需要的准入控制链，如果启用 多种准入控制选项，则建议的设置（含加载顺序）如下：</p>
<p>--admission-control=Namespacelifecycle, LimitRanger, SecurityContextDeny, Servi ceAccount,ResourceQuota 大部分准入控制器都比较容易理解，我们接下来着重介绍 SecurityContextDeny、 ResourceQuota 及 LimitRanger 这三个准入控制器。</p>
<p>1） SecurityContextDeny Security Context 是运用于容器的操作系统安全设置（uid、gid、capabilities、SELinux role 等）。Admission Control 的 SecurityContextDeny 插件的作用是，禁止创建设置了 Security Context 的Pod，例如包含下面这些配置项的 Pod：</p>
<p>spec.containers.securityContext.seLinuxoptions spec.containers.securityContext.runAsUser 2） ResourceQuota</p>
<p>准入控制器 ResourceQuota 不仅能够限制某个 Namespace 中创建资源的数量，而且能够限 制某个 Namespace 中被 Pod所请求的资源总量。该准入控制器和资源对象 ResourceQuota一起 实现了资源配额管理。</p>
<p>3）LimitRanger</p>
<p>准入控制器 LimitRanger 的作用类似于上面的 ResourceQuota 控制器，针对 Namespace 资源 的每个个体（Pod 与 Container 等）的资源配额。该插件和资源对象 LimitRange一起实现资源限 制管理。</p>
<h3>3.6.4 Service Account</h3>
<p>Service Account 也是一种账号，但它并不是给 Kubernetes 的集群的用户（系统管理员、运 维人员、租户用户等）使用的，而是给运行在Pod 里的进程用的，它为Pod 里的进程提供必要 的身份证明。</p>
<p>在继续学习之前，请回忆一下本章前面所说的 API Server 的认证一节。</p>
<p>• 195．</p>
<h2>第 209 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 我们知道，正常情况下，为了确保 Kubenetes 集群的安全，API Server 都会对客户端进行身 份认证，认证失败的客户端无法进行 API 调用。此外，Pod 中访问 Kubenetes API Server 服务的 时候，是以 Service 方式访问服务名为 kubernetes 的这个服务的，而kubernetes 服务又只在HTTPS 安全端口 443上提供服务，那么如何进行身份认证呢？这的确是个谜，因力 Kubernetes 的官方 文档并没有清楚说明这个问题。</p>
<p>通过查看官方源码，我们发现这是在用一种类似 HTTP Token 的新的认证方式 -Service</p>
<p>Account Auth,Pod 中的客户端调用 kubernetes API 的时候，在 HTTP Header 中传递了一个 Token 字符串，这类似于之前提到的 HTTP Token认证方式，但又有以下几个不同点。</p>
<p>这个 Token 的内容来自 Pod 里指定路径下的一个文件（/run/secrets/kubernetes.</p>
<p>io/serviceaccount/token），这种 Token 是动态生成的，确切地说，是由 Kubernetes Controller 进程用 API Server 的私钥（--service-account-private-key-file 指定的私钥）签 名生成的一个 JWT Secret。</p>
<p>官方提供的客户端 REST 框架代码里，通过 HTTPS 方式与 API Server 建立连接后，会 用 Pod 里指定路径下的一个 CA 证书 （/run/secrets/kubernetes.io/serviceaccount/ca.crt） 验证 API Server 发来的证书，验证是否是被CA证书签名的合法证书。</p>
<p>API Server 收到这个 Token 以后，采用自己的私钥（实际是使用参数 service-account- key-file 指定的私钥，如果此参数没有设置，则默认采用 tls-private-key-file 指定的参数， 即自己的私钥）对 Token进行合法性验证。</p>
<p>明白了认证原理，我们接下来继续分析上面认证过程中所涉及的Pod 中的以下三个文件。</p>
<p>© /run/secrets/kubernetes.io/serviceaccount/token。</p>
<p>/run/secrets/kubernetes.io/serviceaccount/ca.crt。</p>
<p>/run/secrets/kubernetes.io/serviceaccount/namespace（客户端采用这里指定的 namespace 作为参数调用 Kubernetes API）。</p>
<p>这三个文件由于参与到Pod 进程与 API Server 认证的过程中，起到了类似 Secret（私密凭 据）的作用，所以它们被称为 Kubernetes Secret 对象。Secret 从属于 Service Account 资源对象， 属于 Service Account 的一部分，一个 Service Account 对象里面可以包括多个不同的 Secret 对象， 分别用于不同目的的认证活动。</p>
<p>下面我们通过运行一些命令来加深我们对 Service Account 与 Secret 的直观认识。</p>
<p>首先，查看系统中的 Service Account 对象，我们看到有一个名为 default 的 Service Account 对象，包含一个名力 default-token-77oyg 的 Secret，这个 Secret 同时是“Mountable secrets”，表 明它是需要被 Mount 到Pod上的：</p>
<p>• 196•</p>
<h2>第 210 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p># kubectl describe serviceaccounts Name：</p>
<p>default</p>
<p>Namespace: default Labels：</p>
<p>&lt;none&gt;</p>
<p>Image pull secrets：</p>
<p>Mountable</p>
<p>secrets：</p>
<p>Tokens：</p>
<p>&lt;none&gt;</p>
<p>default-token-77oyg default-token-77oyg 接下来，我们看看 default-token-77oyg 都有什么内容：</p>
<p># kubect1 describe secrets default-token-77oyg Name：</p>
<p>default-token-77oyg Namespace:default</p>
<p>Labels：</p>
<p>snone&gt;</p>
<p>Annotations: kubernetes.io/service-account.name=default kubernetes.io/service-account.uid=3e5b99c0-432c-11e6-b45c-000c29dc2102 Type: kubernetes.io/service-account-token Data</p>
<p>token：</p>
<p>eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3Mi0iJrdwJlcm51dGVzL3N1cnZpY2VhY2Nv dW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWN1YWNjb3VudC9uYw11c3BhY2Ui0iJkZWZhdWxOIiwia3Vi 2XJuZXRlcy5pby9zZXJ2aWN1YWNjb3VudC9zZWNyZXQubmFtZsI6ImR1ZmF1bHQtdG9rZW4tNzdvewci LCJrdWJlcm51dGVzLmlvL3NlcnZpY2VhY2NvdW50L3N1cnZpY2UtYWNjb3VudC5uYW11IjoiZGVmYXVs dCIsImt1YmVybmV0zXMuaW8vc2VydmljZNEjY291bnovc2Vydm1jZS1hY2NvdW50LnVpZCI6IjN1NWI5 OWMWLTQzMmMtMTF1N11iNDVjLTAwMGMyOWRjMjEwMiIsInN1YiI6InN5c3R1bTpzZXJ2aWN1YWNjb3Vu dDpKZWZhdWx0OmR12mE1bHQ1fQ.MESBrYmTLMB55X3UGfO_PADP6ESsQgHbOSxGJtTsJnY-ze2vFc8Qd O7bVdmotFbnkHgIWht1KIPR_EYVJTRP538uOvgCA_OGN9YIMEdqIEOC2wfnLFuk10a80dSH4uzayBb50 YI7gJWXwbXn6uOwAGMneiTKtCvzGtR4q-P19Jjh5qNPiUdJONhj sJJSAclhdNK4OXtOgMHdNNyPEmPgk 60w2cM7DRb6ifiSOs05cTeLYv1TpIBMvcQy4sYedCEL2cJ20BwcSo4-1Dev9rdxr5OdtgCvo6OxbPE7R CWwjjgUMLYO3YC107WmQNdmxWHJkwvBt kWZhzdvuFCpHeWANA 1115 bytes</p>
<p>namespace: 7 bytes 从上面的输出信息中我们看到，default-token-77oyg 包括三个数据项，分别是token、ca.crt、 namespace。联想到“Mountable secrets”的标记，以及之前看到的Pod中的三个文件的文件名， 你可能恍然大悟，原来是这么一回事：每个 Namespace 下有一个名为 default 的默认的 Serivce Account 对象，这个 Serivce Account 里面有一个名为 Tokens 的可以当作 Volume 一样被 Mount 到Pod里的 Secret，当 Pod 启动时，这个 Secret 会自动被 Mount 到Pod的指定目录下，用来协 助完成Pod中的进程访问 API Server 时的身份鉴权过程。</p>
<p>如图 3.12 所示，一个 Service Account 可以包括多个 Secret 对象。</p>
<p>• 197•</p>
<h2>第 211 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） sedtets</p>
<p>Secret</p>
<p>在service account中</p>
<p>用于访何API Senver</p>
<p>的Secret</p>
<p>Tmag</p>
<p>Secret</p>
<p>在service account</p>
<p>用于下教image的</p>
<p>secret</p>
<p>图 3.12 Service Account 中的 Secret （1） 名为 Tokens 的 Secret 用于访问 API Server 的 Secret，也被称內 Service Account Secret。</p>
<p>（2） 名次 Image pull secrets 的 Secret 用于下载容器镜像时的认证过程，通常镜像库运行在 Insecure 模式下，所以这个 Secret 为空。</p>
<p>（3）用户自定义的其他 Secret，用于用户的进程。</p>
<p>如果一个 Pod 在定义时没有指定 spec.serviceAccountName 属性，则系统会自动为其赋值 “default”，即大家都使用同一个 Namespace 下默认的 Service Account。如果某个 Pod 需要使用 非 default 的 Service Account，则需要在定义时指定：</p>
<p>apiVersion: v1</p>
<p>kind: Pod</p>
<p>metadata：</p>
<p>name:mypod</p>
<p>spec：</p>
<p>containers：</p>
<p>- name: mycontainter image: nginx:v1</p>
<p>serviceAccountName: myserviceaccount Kuberetes 之所以要创建两套独立的账号系统，原因如下。</p>
<p>User 账号是给人用的，Service Account 是给Pod 里的进程使用的，面向的对象不同。</p>
<p>User 账号是全局性的，Service Account 则属于某个具体的 Namespace。</p>
<p>◎ 通常来说，User 账号是与后端的用户数据库同步的，创建一个新用户通常要走一套复 杂的业务流程才能实现，Service Account 的创建则需要极轻量级的实现方式，集群管 理员可以很容易为某些特定任务创建一个 Service Account。</p>
<p>• 198</p>
<h2>第 212 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p>《》</p>
<p>对于这两种不同的账号，其审计要求通常不同。</p>
<p>对于一个复杂的系统来说，多个组件通常拥有各种账号的配置信息，Service Account 是 Namespace 隔离的，可以针对组件进行一对一的定义，同时具备很好的“便携性”。</p>
<p>接下来，我们深入分析 Service Account 与 Secret 相关的一些运行机制。</p>
<p>前面的 Controller Manager 原理分析一节中，我们知道 Controller manager 创建了 ServiceAccount Controller 与 Token Controller 两个安全相关的控制器。其中 ServiceAccount Controller 一直监听 Service Account 和 Namespace 的事件，如果一个 Namespace 中没有 default Service Account，那 么 ServiceAccount Controller 就会次该 Namespace 创建一个默认 （default） 的 Service Account， 这就是我们之前看到每个 Namespace 下都有一个名为 default 的 Service Account 的原因了。</p>
<p>如果 Controller manager 进程在启动时指定了API Server 私钥（service-account-private-key-file 参数），那么 Controller manager 会创建 Token Controller。 Token Controller 也监听 Service Account 的事件，如果发现新创建的 Service Account 里没有对应的 Service Account Secret，则会用 API Server 私钥创建一个 Token （JWT Token），并用该 Token、CA证书及 Namespace 名称等三个信 息产生一个新的 Secret 对象，然后放入刚才的 Service Account 中；如果监听到的事件是删除 Service Account 事件，则自动删除与该 Service Account 相关的所有 Secret。此外，Token Controller 对象同时监听 Secret 的创建、修改和删除事件，并根据事件的不同做不同的处理。</p>
<p>当我们在 API Server 的鉴权过程中启用了 Service Account 类型的准入控制器，即在 kube-apiserver 启动参数中包括下面的内容时：</p>
<p>--admission_control=ServiceAccount 则针对 Pod 新增或修改的请求，Service Account 准入控制器会验证 Pod 里的 Service Account是 否合法。</p>
<p>（1）如果 spec.serviceAccount 域没有被设置，则Kubernetes 默认为其指定名字力 default 的 Service accouto</p>
<p>（2） 如果 Pod 的 spec.serviceAccount 域指定了 default 以外的 Service Account，而该 Service Account 没有事先被创建，则该Pod 操作失败。</p>
<p>（3）如果在 Pod 中没有指定“ImagePullSecrets”，那么这个 spec.serviceAccount 域指定的 Service Account 的“ImagePullSecrets”会被加入该Pod 中。</p>
<p>（4）给Pod 添加一个特殊的 Volume，在该 Volume 中包含 Service Account Secret 中的 Token， 并将 Volume 挂载到Pod 中所有容器的指定目录下（/var/run/secrets/kubernetes.io/serviceaccount）。</p>
<p>综上所述，Service Account 的正常工作离不开以下几个控制器。</p>
<p>（1） Admission Controller。</p>
<p>• 199</p>
<h2>第 213 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） （2） Token Controller.</p>
<p>（3） ServiceAccount Controller。</p>
<h3>3.6.5 Secret 私密凭据</h3>
<p>上一节我们提到 Secret对象，Secret 的主要作用是保管私密数据，比如密码、OAuth Tokens、 SSH Keys 等信息。将这些私密信息放在 Secret 对象中比直接放在Pod或 Docker Image 中更安 全，也更便于使用和分发。</p>
<p>下面的例子用于创建一个 Secret：</p>
<p>secrets.yaml：</p>
<p>apiVersion: v1</p>
<p>kind: Secret</p>
<p>metadata：</p>
<p>name:mysecret</p>
<p>type: Opaque</p>
<p>data：</p>
<p>password: dmFsdWUtMgOK username: dmFsdWUtMQOK # kubectl create -f secrets.yaml 在上面的例子中，data 域的各子域的值必须为 BASE64编码值，其中 password 域和 username 域BASE64 编码前的值分别为“value-1” 和 “value-2”。</p>
<p>一旦 Secret 被创建，则可以通过下面的三种方式使用它。</p>
<p>（1）在创建Pod 时，通过为 Pod 指定 Service Account 来自动使用该 Secret。</p>
<p>（2） 通过挂载该 Secret 到 Pod 来使用它。</p>
<p>（3）Docker 镜像下载时使用，通过指定 Pod的 spc.ImagePullSecrets 来引用它。</p>
<p>第1种使用方式主要用在 API Server 鉴权方面，之前我们提到过。下面的例子展示了第2 种使用方式：将一个 Secret 通过挂载的方式添加到Pod的Volume 中。</p>
<p>apiVersion: v1</p>
<p>kind: Pod</p>
<p>metadata：</p>
<p>name:mypod</p>
<p>namespace: myns</p>
<p>spec：</p>
<p>containers：</p>
<p>- name: mycontainer image: redis</p>
<p>• 200•</p>
<h2>第 214 页</h2>
<h3>第3章</h3>
<p>Kubernetes 核心原理</p>
<p>volumeMounts：</p>
<p>- name: foo</p>
<p>mountPath：&quot;/etc/foo&quot; readOnly: true</p>
<p>volumes：</p>
<p>- name: foo</p>
<p>secret：</p>
<p>secretName: mysecret 其结果如图3.13所示。</p>
<p>volumes</p>
<p>mamefoo；</p>
<p>mysecret</p>
<p>etName：</p>
<p>图 3.13</p>
<p>桂载 Secret到 Pod</p>
<p>第3种使用方式的使用流程如下。</p>
<p>（1） 执行login 命令，登录私有 Registry：</p>
<p># docker login localhost: 5000 输入用户名和密码，如果是第1 次登录系统，则会创建新用户，相关信息会写入~/.dockercfg 文件中。</p>
<p>（2） 用BASE64 编码 dockercfg 的内容：</p>
<p># cat ~/.dockercfg | base64 （3） 将上一步命令的输出结果作为 Secret 的 “data.dockercfg” 域的内容，由此来创建一个 Secret：</p>
<p>image-Pu11-secret.yaml：</p>
<p>apiVersion: v1</p>
<p>kind: Secret</p>
<p>metadata：</p>
<p>name: myregistrykey data：</p>
<p>.dockercfg:eyAiaHROCHM6Ly9pbmRleC5kb2NrZXIuaW8vdjEvIjogeyAiYXVOaCI6ICJab UZyW1hCaGMzTjNiMOprTVRJSyIsICJ1bWEpbCI6ICJq2G91QGV4YW1wbGUuY29tIiB9IHOK type: kubernetes.io/dockercfg • 201•</p>
<h2>第 215 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） # kubect1 create -f image-pul1-secret.yaml （4） 在创建 Pod 时引用该 Secret：</p>
<p>pods.yaml：</p>
<p>apiversion:v1</p>
<p>kind:Pod</p>
<p>metadata：</p>
<p>name:mypod2</p>
<p>spec：</p>
<p>containers：</p>
<p>- name:foo</p>
<p>image: janedoe/awesomeapp:v1 imagePul1Secrets：</p>
<p>- name: myregistrykey S kubectl create -f pods.yaml 其结果如图3.14所示。</p>
<p>myregistrykey</p>
<p>imageRulecrats</p>
<p>mrregis.ke</p>
<p>图 3.14</p>
<p>imagePullSecret 引用 Secret 每个单独的 Secret 大小不能超过1MB，Kubernetes 不鼓励创建大尺寸的 Secret，因如果 使用大尺寸的 Secret，则将大量占用 API Server 和 kubelet 的内存。当然，创建许多小的 Secret 也能耗尽 API Server 和 kubelet 的内存。</p>
<p>在使用 Mount 方式挂载 Secret 时，Container 中 Secret 的“data”域的各个域的Key 值作为 目录中的文件，Vale 值被 BASE64编码后存储在相应的文件中。前面的例子中创建的 Secret， 被挂载到一个叫作 mycontainer 的 Container 中，在该 Container 中可通过相应的查询命令查看所 生成的文件和文件中的内容，如下所示：</p>
<p>$ Is /etc/foo/</p>
<p>username</p>
<p>password</p>
<p>• 202•</p>
<h2>第 216 页</h2>
<h3>第3章</h3>
<p>Kubernetes 核心原理</p>
<p>s cat /etc/foo/username value-1</p>
<p>$ cat /etc/foo/password value-2</p>
<p>通过上面的例子可以得出如下结论：我们可以通过 Secret 保管其他系统的敏感信息（比如 数据库的用户名和密码），并以 Mount 的方式将 Secret 挂载到 Container 中，然后通过访问目录 中的文件的方式获取该敏感信息。当Pod被 API Server 创建时，API Server 不会校验该 Pod 引 用的 Secret 是否存在。一旦这个 Pod被调度，则 kubelet 将试着获取 Secret 的值。如果 Secret 不存在或暂时无法连接到 API Server，则kubelet 将按一定的时间间隔定期重试获取该 Secret， 并发送一个 Event 来解释 Pod 没有启动的原因。一旦 Secret 被 Pod 获取，则 kubelet 将创建并 Mount 包含 Secret 的Volume。只有所有Volume 被 Mount后，Pod 中的 Container 才会被启动。</p>
<p>在 kubelet 启动Pod 中的 Container 后，Container 中的和 Secret 相关的 Volume 将不会被改变， 即使 Secret 本身被修改了。为了使用更新后的 Secret，必须删除旧的Pod，并重新创建一个新的 Pod，因此更新 Secret 的流程和部署一个新的Image 是一样的。</p>
<p>3.7</p>
<p>网络原理</p>
<p>关于 Kubernetes 网络，我们通常有这些问题需要回答，如图3.15所示。</p>
<p>Kubernetes 的网络模型是什么 Docker 背后的网络基础是什么</p>
<p>Docker 自身的网络模型和局限</p>
<p>Kuberetes 的网络组件之间是怎么通信的 外部如何访问 Kubernetes 的集群 有哪些开源的组件支持 Kubernetes 的网络模型 图 3.15 Kubernetes 的常见问题 在本节我们分别回答这些问题，然后通过一个具体的实验来将这些相关的知识串联成一个 整体。</p>
<h3>3.7.1 Kubernetes 网络模型</h3>
<p>Kuberetes 网络模型设计的一个基础原则是：每个Pod 都拥有一个独立的IP地址，而且假 定所有Pod都在一个可以直接连通的、扁平的网络空间中。所以不管它们是否运行在同一个Node （宿主机）中，都要求它们可以直接通过对方的IP 进行访问。设计这个原则的原因是，用户不 • 203•</p>
<h2>第 217 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 需要额外考虑如何建立Pod之间的连接，也不需要考虑将容器端口映射到主机端口等问题。</p>
<p>实际上在 Kubernetes 的世界里，IP 是以Pod 为单位进行分配的。一个 Pod 内部的所有容器 共享一个网络堆栈（实际上就是一个网络命名空间，包括它们的IP 地址、网络设备、配置等都 是共享的）。按照这个网络原则抽象出来的一个 Pod一个 IP 的设计模型也被称作 IP-per-Pod 模型。</p>
<p>由于 Kubernetes 的网络模型假设Pod之间访问时使用的是对方Pod 的实际地址，所以一个 Pod 内部的应用程序看到的自己的IP 地址和端口与集群内其他Pod 看到的一样。它们都是 Pod 实际分配的IP地址（从docker0上分配的）。将IP 地址和端口在Pod 内部和外部都保持一致， 我们可以不使用 NAT来进行转换，地址空间也自然是平的。Kubernetes 的网络之所以这么设计， 主要原因就是可以兼容过去的应用。当然，我们使用 Linux 命令 “ip addr show”也能看到这些 地址，和程序看到的没有什么区别。所以这种 IP-per-Pod 的方案很好地利用了现有的各种域名 解析和发现机制。</p>
<p>一个Pod一个 IP 的模型还有另外一层含义，那就是同一个Pod 内的不同容器将会共享一个 网络命名空间，也就是说同一个 Linux 网络协议栈。这就意味着同一个 Pod 内的容器可以通过 localhost 来连接对方的端口。这种关系和同一个VM内的进程之间的关系是一样的，看起来Pod 内的容器之间的隔离性降低了，而且Pod 内不同容器之间的端口是共享的，没有所谓的私有端 口的概念了。如果你的应用必须要使用一些特定的端口范围，那么你也可以为这些应用单独创 建一些 Pod。反之，对那些没有特需要的应用，这样做的好处是 Pod 内的容器是共享部分资 源的，通过共享资源互相通信显然更加容易和高效。针对这些应用，虽然损失了可接受范围内 的部分隔离性，但也是值得的。</p>
<p>IP-per-Pod模式和 Docker 原生的通过动态端口映射方式实现的多节点访问模式有什么区别 呢？主要区别是后者的动态端口映射会引入端口管理的复杂性，而且访问者看到的IP地址和端 口与服务提供者实际绑定的不同（因为 NAT 的缘故，它们都被映射成新的地址或端口了），这 也会引起应用配置的复杂化。同时，标准的 DNS等名字解析服务也不适用了。甚至服务注册和 发现机制都将受到挑战，因为在端口映射情况下，服务自身很难知道自己对外暴露的真实的服 务IP 和端口。而外部应用也无法通过服务所在容器的私有 IP 地址和端口来访问服务。</p>
<p>总的来说，IP-per-Pod 模型是一个简单的兼容性较好的模型。从该模型的网络的端口分配、 域名解析、服务发现、负载均衡、应用配置和迁移等角度来看，Pod 都能够被看作一台独立的“虚 拟机”或“物理机”。</p>
<p>按照这个网络抽象原则，Kubernetes 对网络有什么前提和要求呢？</p>
<p>Kubernetes 对集群的网络有如下要求：</p>
<p>（1）所有容器都可以在不用 NAT 的方式下同别的容器通信；</p>
<p>• 204•</p>
<h2>第 218 页</h2>
<h3>第3章</h3>
<p>Kubernetes 核心原理</p>
<p>（2）所有节点都可以在不用 NAT 的方式下同所有容器通信，反之亦然；</p>
<p>（3）容器的地址和别人看到的地址是同一个地址。</p>
<p>这些基本的要求意味着并不是只要两台机器运行 Docker,Kubernetes 就可以工作了。具体的 集群网络实现必须保障上述基本要求，原生的 Docker 网络目前还不能很好地支持这些要求。</p>
<p>实际上，这些对网络模型的要求并没有降低整个网络系统的复杂度。如果你的程序原来在 VM上运行，而那些VM拥有独立IP，并且它们之间可以直接透明地通信，那么 Kubernetes 的 网络模型就和VM使用的网络模型是一样的。所以使用这种模型可以很容易地将已有的应用程 序从 VM 或者物理机迁移到容器上。</p>
<p>当然，谷歌设计 Kubernetes 的一个主要运行基础就是其云环境 GCE （Google Compute Engine），在GCE 下这些网络要求都是默认支持的。另外，常见的其他公有云服务商如亚当逊 等，在它们的公有云计算环境下也是默认支持这个模型的。</p>
<p>由于部署私有云的场景会更普遍，所以在私有云中运行 Kubernetes+Docker 集群之前，就需 要自己搭建出符合 Kubernetes 要求的网络环境。现在的开源世界有很多开源组件可以帮助我们 打通 Docker 容器和容器之间的网络，实现 Kubernetes 要求的网络模型。当然每种方案都有适合 的场景，我们要根据自己的实际需要进行选择。在后面的章节中会对常见的开源方案进行介绍。</p>
<p>Kubernetes 的网络依赖于 Docker, Docker 的网络又离不开 Linux 操作系统内核特性的支持， 所以我们有必要先深入了解Docker 背后的网络原理和基础知识。接下来我们一起深入学习一些 必要的Linux 网络知识。</p>
<p>3.7.2</p>
<p>Docker 的网络基础</p>
<p>Docker 本身的技术依赖于近年Linux 内核虚拟化技术的发展，所以Docker 对 Linux 内核的 特性有很强的依赖。这里将 Docker 使用到的与Linux 网络有关的主要技术进行简要介绍，这些 技术包括如下几种，如图3.16所示。</p>
<p>Network Namespace（网络命名空间】 Yeth 改备对</p>
<p>Jptables/Netfilter 网桥</p>
<p>路由</p>
<p>图3.16 Docker 使用到的与 Linux 网络有关的主要技术 • 205</p>
<h2>第 219 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 1.网络的命名空间</p>
<p>为了支持网络协议栈的多个实例，Linux 在网络栈中引入了网络命名空间（Network Namespace），这些独立的协议栈被隔离到不同的命名空间中。处于不同命名空间的网络栈是完 全隔离的，彼此之间无法通信，就好像两个“平行宇宙”。通过这种对网络资源的隔离，就能在 一个宿主机上虚拟多个不同的网络环境。而 Docker 也正是利用了网络的命名空间特性，实现了 不同容器之间网络的隔离。</p>
<p>在Linux 的网络命名空间内可以有自己独立的路由表及独立的 Iptables/Netfilter 设置来提供 包转发、NAT及IP 包过滤等功能。</p>
<p>为了隔离出独立的协议栈，需要纳入命名空间的元素有进程、套接字、网络设备等。进程 创建的套接字必须属于某个命名空间，套接字的操作也必须在命名空间内进行。同样，网络设 备也必须属于某个命名空间。因为网络设备属于公共资源，所以可以通过修改属性实现在命名 空间之间移动。当然，是否允许移动和设备的特征有关。</p>
<p>让我们稍微深入 Linux 操作系统内部，看它是如何实现网络命名空间的，这也会对理解后 面的概念有帮助。</p>
<p>1） 网络命名空间的实现</p>
<p>Linux 的网络协议栈是十分复杂的，为了支持独立的协议栈，相关的这些全局变量都必须 修改为协议栈私有。最好的办法就是让这些全局变量成为一个 Net Namespace 变量的成员，然 后协议栈的函数调用加入一个 Namespace 参数。这就是 Linux 实现网络命名空间的核心。</p>
<p>同时，为了保证对已经开发的应用程序及内核代码的兼容性，内核代码隐式地使用了命名 空间内的变量。我们的程序如果没有对命名空间的特殊需求，那么不需要写额外的代码，网络 命名空间对应用程序而言是透明的。</p>
<p>在建立了新的网络命名空间，并将某个进程关联到这个网络命名空间后，就出现了类似于 如图3.17所示的内核数据结构，所有网站栈变量都放入了网络命名空间的数据结构中。这个网 络命名空间是属于它的进程组私有的，和其他进程组不冲突。</p>
<p>新生成的私有命名空间只有回环1o设备（而且是停止状态），其他设备默认都不存在，如 果我们需要，则要一一手工建立。Docker 容器中的各类网络栈设备都是 Docker Daemon 在启动 时自动创建和配置的。</p>
<p>所有的网络设备（物理的或虚拟接口、桥等在内核里都叫作 Net Device）都只能属于一个 命名空间。当然，通常物理的设备（连接实际硬件的设备）只能关联到 root 这个命名空间中。</p>
<p>虚拟的网络设备（虚拟的以太网接口或者虚拟网口对）则可以被创建并关联到一个给定的命名 空间中，而且可以在这些命名空间之间移动。</p>
<p>• 206•</p>
<h2>第 220 页</h2>
<h3>第3章</h3>
<p>Kubernetes 核心原理</p>
<p>网络空</p>
<p>同链者</p>
<p>名字空间</p>
<p>网络空间</p>
<p>进程</p>
<p>进程</p>
<p>进程</p>
<p>默认</p>
<p>名字空间</p>
<p>网络空间</p>
<p>翻</p>
<p>國廚國</p>
<p>图3.17 命名空间内核结构</p>
<p>前面我们提到，由于网络命名空间代表的是一个独立的协议栈，所以它们之间是相互隔离 的，彼此无法通信，在协议栈内部都看不到对方。那么有没有办法打破这种限制，让处于不同 命名空间的网络相互通信，甚至和外部的网络进行通信呢？答案就是“Veth 设备对”。“Veth设 备对”的一个重要作用就是打通互相看不到的协议栈之间的壁垒，它就像一个管子，一端连着 这个网络命名空间的协议栈，一端连着另一个网络命名空间的协议栈。所以如果想在两个命名 空间之间进行通信，就必须有一个 Veth 设备对。后面我们会介绍如何操作 Veth设备对来打通 不同命名空间之间的网络。</p>
<p>2） 网络命名空间操作</p>
<p>下面列举一些网络命名空间的操作。</p>
<p>我们可以使用 Linux iproute2 系列配置工具中的IP 命令来操作网络命名空间。注意，这个 命令需要由 root用户运行。</p>
<p>创建一个命名空间：</p>
<p>ip netns add &lt;name&gt; 在命名空间内执行命令：</p>
<p>ip netns exec &lt;name&gt; &lt;command&gt; 如果想执行多个命令，则可以先进入内部的sh，然后执行：</p>
<p>ip netns</p>
<p>exec &lt;name&gt; bash</p>
<p>之后就是在新的命名空间内进行操作了。退出到外面的命名空间时，请输入 “exit”。</p>
<p>3）网络命名空间的一些技巧</p>
<p>操作网络命名空间时的一些实用技巧如下。</p>
<p>• 207•</p>
<h2>第 221 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 我们可以在不同的网络命名空间之间转移设备，例如下面会提到的Veth设备对的转移。因 为一个设备只能属于一个命名空间，所以转移后在这个命名空间内就看不到这个设备了。具体 哪些设备能够转移到不同的命名空间呢？在设备里面有一个重要的属性：NETIF_F_ ETNS_LOCAL，如果这个属性为“on”，则不能转移到其他命名空间内。Veth 设备属于可以转 移的设备，而很多其他设备如lo设备、vxlan 设备、ppp 设备、bridge 设备等都是不可以转移的。</p>
<p>至于将无法转移的设备移动到别的命名空间的操作，则会得到无效参数的错误提示。</p>
<p># ip link set bro netns nsl RTNETLINK answers : Invalid argument 如何知道这些设备是否可以转移呢？可以使用 ethtool 工具查看：</p>
<p># ethtool -k br0</p>
<p>netns-local: on ［fixed］ netns-local 的值是on，就说明不可以转移，否则可以。</p>
<p>2. Veth 设备对</p>
<p>引入 Veth设备对是为了在不同的网络命名空间之间进行通信，利用它可以直接将两个网络 命名空间连接起来。由于要连接两个网络命名空间，所以 Veth设备都是成对出现的，很像一对以 太网卡，并且中间有一根直连的网线。既然是一对网卡，那么我们将其中一端称为另一端的 peer。</p>
<p>在Veth设备的一端发送数据时，它会将数据直接发送到另一端，并触发另一端的接收操作。</p>
<p>整个 Veth 的实现非常简单，有兴趣的读者可以参考源代码 “drivers/net/veth.c” 的实现。</p>
<p>图3.18是 Veth设备对的示意图。</p>
<p>Namespace1</p>
<p>Network Stack</p>
<p>1</p>
<p>Namespace1</p>
<p>Network Stack</p>
<p>图3.18 eth设备对示意图</p>
<p>1） Veth 设备对的操作命令</p>
<p>接下来看看如何创建Veth 设备对，如何连接到不同的命名空间，并设置它们的地址，让它 们通信。</p>
<p>创建 Veth设备对：</p>
<p>ip link add vetho type veth peer name veth1 • 208•</p>
<h2>第 222 页</h2>
<h3>第3章</h3>
<p>Kubernetes 核心原理</p>
<p>创建后，可以查看 veth 设备对的信息。使用ip link show 命令查看所有网络接口：</p>
<p>#ip link show</p>
<p>1:10：&lt;LOOPBACK, UE, LOWER_UP&gt; mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT Link/1oopback:00:00:00:00:00:00 brd 00:00:00:00:00:00 2:eno16777736：&lt;BROADCAST,MULTICAST, UE, LOWER_UP&gt; mtu 1500 qdisc pfifo_fast state UP mode DEFAULT qlen 1000 1ink/ether 00:0c:29:cf:la:2e brd ff:ff:ff:ff:ff:ff 3:dockerO：&lt;NO-CARRIER, BROADCAST, MULTICAST, UP&gt; mtu 1500 qdisc noqueue state UP mode DEFAULT</p>
<p>link/ether 56:84:7a:fe:97:99 brd ff:ff:ff:ff:ff:ff 19:veth1： &lt;BROADCAST,MULTICAST&gt; mtu 1500 qdisc noop state DOWN mode DEFAULT qlen 1000 link/ether 7e:4a:ae:41:a3:65 brd ff:ff:ff:ff:ff:ff 20:vethO： &lt;BROADCAST, MULTICAST&gt; mtu 1500 qdisc noop state DOWN mode DEEAULT qlen 1000 link/ether ea:da:85:a3:75:8a brd ff:ff:ff:ff:ff:ff 看到了吧，有两个设备生成了，一个是 vetho，它的 peer 是 vethl。</p>
<p>现在这两个设备都在自己的命名空间内，那怎么能行呢？好了，如果将 Veth 看作有两个头 的网线，那么我们将另一个头甩给另一个命名空间吧：</p>
<p>ip link set vethl netns netnsl 这时可在外面这个命名空间内看两个设备的情况：</p>
<p>#ip link show</p>
<p>1:10： &lt;LOOPBACK, UP, LOWER_ _UP&gt; mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT Link/1oopback:00:00:00:00:00:00 brd 00:00:00:00:00:00 2:eno16777736：&lt;BROADCAST,MULTICAST,UP, LONER_UP&gt; mtu 1500 qdisc pfifo_fast state UP mode DEFAULT qlen 1000 link/ether 00:0c:29:cf:la:2e brd ff:ff:ff:ff:ff:ff 3:dockerO：&lt;NO-CARRIER, BROADCAST,MULTICAST, UP&gt; mtu 1500 qdisc noqueue state UP mode DEFAULT</p>
<p>1ink/ether 56:84:7a:fe:97:99 brd ff:ff:ff:ff:ff:ff 20:vethO：&lt;BROADCAST, MULTICAST&gt; mtu 1500 qdisc noop state DOWN mode DEFAULT qlen 1000 link/ether ea:da:85:a3:75:8a brd ff:ff:ff:ff:ff:ff 只剩一个 vetho设备了，已经看不到另一个设备了，另一个设备已经转移到另一个网络命 名空间了。</p>
<p>在 netns1 网络命名空间中可以看到 vethl设备了，符合预期。</p>
<p># ip netns exec netnsl ip link show 1:10： ＜&lt;LOOPBACK, UP, LOWER_UP&gt; mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT Link/loopback: 00:00:00:00:00:00 brd 00:00:00:00:00:00 19: veth1： &lt;BROADCAST, MULTICAST&gt; mtu 1500 qdisc noop state DOWN mode DEFAULT qlen 1000 link/ether 7e:4a:ae:41:a3:65 brd ff:ff:ff:ff:ff:ff 现在看到的结果是，两个不同的命名空间各自有一个 Veth的“网线头”，各显示为一个Device （在Docker 的实现里面，它除了将 Veth 放入容器内，还将它的名字改成了 etho，简直以假乱真， • 209•</p>
<h2>第 223 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 你以为它是一个本地网卡吗）。</p>
<p>现在可以通信了吗？不行，因为它们还没有任何地址，现在我们来给它们分配 IP 地址吧：</p>
<p>ip netns exec netnsl ip addr add 10.1.1.1/24 dev veth1 ip addr add 10.1.1.2/24 dev vetho 再启动它们：</p>
<p>ip netns exec netnsl ip link set dev vethl up ip link set dev veth0 up 现在两个网络命名空间可以互相通信了：</p>
<p># ping 10.1.1.1</p>
<p>PING 10.1.1.1 （10.1.1.1） 56（84） bytes of data.</p>
<p>64 bytes from 10.1.1.1: icmp_seq=1 tt1=64 time=0.035 ms 64 bytes from 10.1.1.1: icmp_seq=2 tt1=64 time=0.096 ms ^C</p>
<p>--- 10.1.1.1 ping statistics --- 2 packets transmitted, 2 received, 0% packet loss, time 1001ms rtt min/avg/max/mdev = 0.035/0.065/0.096/0.031 ms # ip netns exec netnsl ping 10.1.1.2</p>
<p>PING 10.1.1.2 （10.1.1.2） 56（84）bytes of data.</p>
<p>64 bytes|</p>
<p>from 10.1.1.2: icmp_seq=1 tt1=64 time=0.045 ms 64 bytes from 10.1.1.2: icmp_seq=2 tt1=64 time=0.105 ms ^C</p>
<p>--- 10.1.1.2 ping statistics --- 2 packets transmitted, 2 received, 08 packet 1oss, time 1000ms rtt min/avg/max/mdev = 0.045/0.075/0.105/0.030 ms 至此，两个网络命名空间之间就完全通了。</p>
<p>至此我们就能够理解 Veth 设备对的原理和用法了。在 Docker 内部，Veth 设备对也是联系 容器到外面的重要设备，离开它是不行的。</p>
<p>2） Veth 设备对如何查看对端</p>
<p>我们在操作 Veth设备对的时候有一些实用技巧，如下所示。</p>
<p>一旦将 Veth设备对的 peer 端放入另一个命名空间，我们在本命名空间内就看不到它了。那 么我们怎么知道这个 Veth对的对端在哪里呢，也就是说它到底连接到哪个别的命名空间呢？可 以使用 ethtool 工具来查看（当网络命名空间特别多的时候，这可不是一件很容易的事情）。</p>
<p>首先我们在一个命名空间中查询 Veth 设备对端接口在设备列表中的序列号：</p>
<p>ip netns exec netnsl ethtool -S veth1 NIC statistics：</p>
<p>peer_ifindex: 5</p>
<p>• 210•</p>
<h2>第 224 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p>得知另一端的接口设备的序列号是5，我们再到另一个命名空间中查看序列号5代表什么 设备：</p>
<p>ip netns exec netns2 ip link | grep 5 ＜-- 我们只关注序列号是5的设备</p>
<p>vethO</p>
<p>好了，我们现在就找到下标为5的设备了，它是 vetho，它的另一端自然就是另一个命名空 间中的vethl 了，因为它们互为 peer。</p>
<p>3. 网桥</p>
<p>Linux 可以支持很多不同的端口，这些端口之间当然应该能够通信，如何将这些端口连接 起来并实现类似交换机那样的多对多通信呢？这就是网桥的作用了。网桥是一个二层网络设备， 可以解析收发的报文，读取目标 MAC地址的信息，和自己记录的MAC表结合，来决策报文的 转发端口。为了实现这些功能，网桥会学习源 MAC地址（二层网桥转发的依据就是 MAC地址）。</p>
<p>在转发报文的时候，网桥只需要向特定的网络接口进行转发，从而避免不必要的网络交互。如 果它遇到一个自己从未学习到的地址，就无法知道这个报文应该从哪个网口设备转发，于是只 好将报文广播给所有的网络设备端口（报文来源的那个端口除外）。</p>
<p>在实际网络中，网络拓扑不可能永久不变。如果设备移动到另一个端口上，而它没有发送 任何数据，那么网桥设备就无法感知到这个变化，结果网桥还是向原来的端口转发数据包，在 这种情况下数据就会丢失。所以网桥还要对学习到的 MAC 地址表加上超时时间（默认为5分 钟）。如果网桥收到了对应端口 MAC地址回发的包，则重置超时时间，否则过了超时时间后， 就认为那个设备已经不在那个端口上了，它就会重新广播发送。</p>
<p>在 Linux 的内部网络栈里面实现的网桥设备，作用和上面的描述相同。过去 Linux 主机一 般都只有一个网卡，现在多网卡的机器越来越多，而且还有很多虚拟的设备存在，所以 Linux 的网桥提供了这些设备之间互相转发数据的二层设备。</p>
<p>Linux 内核支持网口的桥接（目前只支持以太网接口）。但是与单纯的交换机不同，交换机 只是一个二层设备，对于接收到的报文，要么转发，要么丢弃。运行着 Linux 内核的机器本身 就是一台主机，有可能是网络报文的目的地，其收到的报文除了转发和丢弃，还可能被送到网 络协议栈的上层（网络层），从而被自己（这台主机本身的协议栈）消化，所以我们既可以把网 桥看作一个二层设备，也可以看作一个三层设备。</p>
<p>1） Linux 网桥的实现</p>
<p>Linux 内核是通过一个虚拟的网桥设备（Net Device）来实现桥接的。这个虚拟设备可以绑 定若干个以太网接口设备，从而将它们桥接起来。如图3.19所示，这种 Net Device 网桥和普通 的设备不同，最明显的一个特性是它还可以有一个IP地址。</p>
<p>• 211•</p>
<h2>第 225 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） llerecehes0</p>
<p>©n2</p>
<p>dericed</p>
<p>ACdekcedies</p>
<p>图 3.19</p>
<p>网桥的位置</p>
<p>如图3.19所示，网桥设备brO绑定了 etho和ethl。对于网络协议栈的上层来说，只看得到 bro。因为桥接是在数据链路层实现的，上层不需要关心桥接的细节，于是协议栈上层需要发送 的报文被送到brO，网桥设备的处理代码判断报文该被转发到 etho还是 ethl，或者两者皆转发：</p>
<p>反过来，从etho或从 ethl接收到的报文被提交给网桥的处理代码，在这里会判断报文应该被转 发、丢弃还是提交到协议栈上层。</p>
<p>而有时 ethO、eth1也可能会作为报文的源地址或目的地址，直接参与报文的发送与接收，从 而绕过网桥。</p>
<p>2） 网桥的常用操作命令</p>
<p>Docker 自动完成了对网桥的创建和维护。为了进一步理解网桥，下面举几个常用的网桥操 作例子，对网桥进行手工操作：</p>
<p>#brct1 addbr xxxxx 就是新增一个网桥 之后可以增加端口，在 Linux 中，一个端口其实就是一个物理网卡。将物理网卡和网桥连 接起来：</p>
<p>#brctl addif xxxxx ethx 网桥的物理网卡作为一个端口，由于在链路层工作，就不再需要IP 地址了，这样上面的IP 地址自然失效：</p>
<p>#ifconfig ethx 0.0.0.0 给网桥配置一个 IP 地址：</p>
<p>#ifconfig brxxx xxx.xxx.xxx.XXx 这样网桥就有了一个 IP地址，而连接到上面的网卡就是一个纯链路层设备了。</p>
<p>•212•</p>
<h2>第 226 页</h2>
<h3>第3章</h3>
<p>Kubernetes 核心原理</p>
<p>4. Iptables/Netfillter 我们知道，Linux 网络协议栈非常高效，同时比较复杂。如果我们希望在数据的处理过程 中对关心的数据进行一些操作该怎么做呢？Linux 提供了一套机制来为用户实现自定义的数据 包处理过程。</p>
<p>在 Linux 网络协议栈中有一组回调函数挂接点，通过这些挂接点挂接的钩子函数可以在 Linux 网络栈处理数据包的过程中对数据包进行一些操作，例如过滤、修改、丢弃等。整个挂 接点技术叫作 Netfilter 和 Iptables。</p>
<p>Netfilter 负责在内核中执行各种挂接的规则，运行在内核模式中；而 Iptables 是在用户模式 下运行的进程，负责协助维护内核中 Netfilter 的各种规则表。通过二者的配合来实现整个 Linux 网络协议栈中灵活的数据包处理机制。</p>
<p>Netfilter 可以挂接的规则点有5个，如图3.20中的深色椭圆所示。</p>
<p>上层协议处理</p>
<p>INPUT</p>
<p>路由</p>
<p>CUTPUT</p>
<p>路由</p>
<p>FORWART：</p>
<p>PREROUTING</p>
<p>POSTROLGHKS</p>
<p>接口设备</p>
<p>图 3.20 Netfilter 挂接点 1） 规则表 Table</p>
<p>这些挂接点能挂接的规则也分不同的类型（也就是规则表 Table），我们可以在不同类型的 Table 中加入我们的规则。目前主要支持的 Table 类型力：</p>
<p>②</p>
<p>RAW；</p>
<p>⑦</p>
<p>②</p>
<p>MANGLE；</p>
<p>NAT；</p>
<p>© FILTER。</p>
<p>上述4个 Table（规则链）的优先级是 RAW 最高，FILTER 最低。</p>
<p>• 213•</p>
<h2>第 227 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 在实际应用中，不同的挂接点需要的规则类型通常不同。例如，在Input 的挂接点上明 显不需要 FILTER过滤规则，因为根据目标地址，已经选择好本机的上层协议栈了，所以无 须再挂接 FILTER过滤规则。目前Linux 系统支持的不同挂接点能挂接的规则类型如图3.21 所示。</p>
<p>Taw表</p>
<p>PREROUTING链</p>
<p>...</p>
<p>OUTPUT链</p>
<p>Iptables防火墙默认的规则表、链结构 mangle表</p>
<p>mat</p>
<p>PREROUTING链</p>
<p>POSTROUTING链</p>
<p>INPUT链</p>
<p>OUTPUT链</p>
<p>FORW/ARD链</p>
<p>PREROUTING链</p>
<p>POSTROUTING链-</p>
<p>OUTPUT链</p>
<p>filter表</p>
<p>第1条規鍘</p>
<p>第2条规翅</p>
<p>第3条规翅</p>
<p>..-</p>
<p>INPUT链</p>
<p>FORWIARD链</p>
<p>OUTPUT链</p>
<p>图3.21 不同表的挂接点</p>
<p>当 Linux 协议栈的数据处理运行到挂接点时，它会依次调用挂接点上所有的挂钩函数，直 到数据包的处理结果是明确地接受或者拒绝。</p>
<p>2）处理规则</p>
<p>每个规则的特性都分为以下几部分：</p>
<p>◎ 表类型（准备干什么事情）；</p>
<p>◎ 什么挂接点（什么时候起作用）；</p>
<p>《 匹配的参数是什么（针对什么样的数据包）；</p>
<p>匹配后有什么动作（匹配后具体的操作是什么）。</p>
<p>表类型和什么挂接点在前面已经介绍了，现在我们看看匹配的参数和匹配后的动作。</p>
<p>（1）匹配的参数</p>
<p>匹配的参数用于对数据包或者TCP 数据连接的状态进行匹配。当有多个条件存在时，它们 一起起作用，来达到只针对某部分数据进行修改的目的。常见的匹配参数有：</p>
<p>◎ 流入、流出的网络接口；</p>
<p>• 214•</p>
<h2>第 228 页</h2>
<h3>第3章</h3>
<p>Kubernetes 核心原理</p>
<p>◎ 来源、目的地址；</p>
<p>》 协议类型；</p>
<p>◎来源、目的端口。</p>
<p>（2） 匹配后的动作</p>
<p>一旦有数据匹配上，就会执行相应的动作。动作类型既可以是标准的预定义的几个动作， 也可以是自定义的模块注册的动作，或者是一个新的规则链，以便更好地组织一组动作。</p>
<p>3）Iptables 命令</p>
<p>Iptables 命令用于协助用户维护各种规则。我们在使用 Kubernetes、Docker 的过程中，通常 都会去查看相关的 Netfilter 配置。这里只介绍如何查看规则表，详细的介绍请参照 Linux 的 Iptables 帮助文档。</p>
<p>查看系统中己有的规则的方法如下。</p>
<p>iptables-save：按照命令的方式打印 Iptables 的内容。</p>
<p>Iptables-vnL：以另一种格式显不 Netfiter 表的内容。</p>
<p>5. 路由</p>
<p>Linux 系统包含一个完整的路由功能。当IP 层在处理数据发送或者转发的时候，会使用路 由表来决定发往哪里。通常情况下，如果主机与目的主机直接相连，那么主机可以直接发送IP 报文到目的主机，这个过程比较简单。例如，通过点对点的链接或通过网络共享，如果主机与 目的主机没有直接相连，那么主机会将IP报文发送给默认的路由器，然后由路由器来决定往哪 发送IP 报文。</p>
<p>路由功能由IP 层维护的一张路由表来实现。当主机收到数据报文时，它用此表来决策接下 来应该做什么操作。当从网络侧接收到数据报文时，IP层首先会检查报文的IP地址是否与主机 自身的地址相同。如果数据报文中的IP地址是主机自身的地址，那么报文将被发送到传输层相 应的协议中去。如果报文中的IP地址不是主机自身的地址，并且主机配置了路由功能，那么报 文将被转发，否则，报文将被丢弃。</p>
<p>路由表中的数据一般是以条目形式存在的。一个典型的路由表条目通常包含以下主要的条 目项。</p>
<p>（1）目的IP 地址：此字段表示目标的IP地址。这个IP地址可以是某台主机的地址，也可 以是一个网络地址。如果这个条目包含的是一个主机地址，那么它的主机ID 将被标记为非零；</p>
<p>如果这个条目包含的是一个网络地址，那么它的主机 ID 将被标记为零。</p>
<p>• 215•</p>
<h2>第 229 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） （2）下一个路由器的IP地址：为什么采用“下一个”的说法，是因为下一个路由器并不总 是最终的目的路由器，它很可能是一个中间路由器。条目给出下一个路由器的地址用来转发从 相应接口接收到的IP 数据报文。</p>
<p>（3）标志：这个字段提供了另一组重要信息，例如目的IP 地址是一个主机地址还是一个网 络地址。此外，从标志中可以得知下一个路由器是一个真实路由器还是一个直接相连的接口。</p>
<p>（4）网络接口规范：为一些数据报文的网络接口规范，该规范将与报文一起被转发。</p>
<p>在通过路由表转发时，如果任何条目的第1个字段完全匹配目的IP地址（主机）或部分匹 配条目的IP地址（网络），那么它将指示下一个路由器的IP地址。这是一个重要的信息，因为 这些信息直接告诉主机（具备路由功能的）数据包应该转发到哪个“下一个路由器”去。而条 目中的所有其他字段将提供更多的辅助信息来为路由转发做决定。</p>
<p>如果没有找到一个完全匹配的IP，那么就接着搜索相匹配的网络ID。如果找到，那么该数 据报文会被转发到指定的路由器上。可以看出，网络上的所有主机都通过这个路由表中的单个 （这个）条目进行管理。</p>
<p>如果上述两个条件都不匹配，那么该数据报文将被转发到一个默认路由器上。</p>
<p>如果上述步骤失败，默认路由器也不存在，那么该数据报文最终无法被转发。任何无法投 递的数据报文都将产生一个ICMP 主机不可达或ICMP 网络不可达的错误，并将此错误返回给 生成此数据报文的应用程序。</p>
<p>1） 路由表的创建</p>
<p>Linux 的路由表至少包括两个表（当启用策略路由的时候，还会有其他表）：一个是LOCAL， 另一个是MAIN。在LOCAL 表中会包含所有的本地设备地址。LOCAL 路由表是在配置网络设 备地址时自动创建的。LOCAL 表用于供Linux 协议栈识别本地地址，以及进行本地各个不同网 络接口之间的数据转发。</p>
<p>可以通过下面的命令查看 LOCAL 表的内容：</p>
<p># ip route</p>
<p>show table local type local</p>
<h3>10.1.1.0 dev flanne10 proto kernel</h3>
<p>scope host src 10.1.1.0 127.0.0.0/8 dev 1o proto kernel scope host src 127.0.0.1</p>
<h3>127.0.0.1 dev 1o proto kernel scope host src 127.0.0.1</h3>
<h3>172.17.42.1 dev docker proto kernel scope host|</h3>
<p>SrC 172.17.42.1</p>
<h3>192.168.1.128 dev eno16777736 proto kernel scope host</h3>
<p>SIC 192.168.1.128</p>
<p>MAIN表用于各类网络IP地址的转发。它的建立既可以使用静态配置生成，也可以使用动 态路由发现协议生成。动态路由发现协议一般使用组播功能来通过发送路由发现数据，动态地 交换和获取网络的路由信息，并更新到路由表中。</p>
<p>• 216</p>
<h2>第 230 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p>Linux 下支持路由发现协议的开源软件有许多，常用的有 Quagga、Zebra 等。第4 章会介绍 使用 Quagga 动态容器路由发现的机制来实现 Kubernetes 的网络组网。</p>
<p>2）路由表的查看</p>
<p>我们可以使用 ip route list 命令查看当前的路由表。</p>
<p># ip route list</p>
<p>192.168.6.0/24 dev eno16777736 proto kernel scope link src 192.168.6.140 metric 1</p>
<p>在上面的例子代码中，只有一个子网的路由，源地址是 192.168.6.140（本机），目标地址是 192.168.6.0/24 网段的数据，都将通过ethO接口设备发送出去。</p>
<p>Netstat-m 是另一个查看路由表的工具：</p>
<p>#netstat -rn</p>
<p>Kernel IP routing table Destination</p>
<p>Gateway</p>
<p>Genmask</p>
<p>Flags</p>
<p>0.0.0.0</p>
<p>192.168.6.2</p>
<p>0.0.0.0</p>
<p>UG</p>
<p>192.168.6.0</p>
<p>0.0.0.0</p>
<h3>255.255.255.0 U</h3>
<p>MSS Window</p>
<p>0 0</p>
<p>00</p>
<p>irtt Iface</p>
<p>0 ethO</p>
<p>0 ethO</p>
<p>在它显示的信息中，如果标志是U，则说明是可达路由；如果标志是 G，则说明这个网络 接口连接的是网关，否则说明是直连主机。</p>
<h3>3.7.3 Docker 的网络实现</h3>
<p>标准的 Docker 支持以下4类网络模式。</p>
<p>◎</p>
<p>host 模式：使用--net=host 指定。</p>
<p>container 模式：使用--net-container:NAME_Or_ID 指定。</p>
<p>none 模式：使用--net=none 指定。</p>
<p>bridge 模式：使用--net=bridge指定，为默认设置。</p>
<p>在 Kubernetes 管理模式下，通常只会使用bridge 模式，所以本节只介绍 bridge模式下 Docker 是如何支持网络的。</p>
<p>在 bridge 模式下，Docker Daemon 第1 次启动时会创建一个虚拟的网桥，默认的名字是 dockerO，然后按照 RPC1918的模型，在私有网络空间中给这个网桥分配一个子网。针对由 Docker 创建出来的每一个容器，都会创建一个虚拟的以太网设备（Veth 设备对），其中一端关联到网桥 上，另一端使用 Linux的网络命名空间技术，映射到容器内的ethO设备，然后从网桥的地址段 内给 ethO 接口分配一个 IP地址。</p>
<p>• 217•</p>
<h2>第 231 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 如图3.22 所示就是 Docker 的默认桥接网络模型。</p>
<p>Nodei</p>
<p>「容器1</p>
<p>&amp;W</p>
<p>容器2</p>
<p>ethxxx</p>
<p>Dockero网桥</p>
<p>em</p>
<p>1p3</p>
<p>图 3.22，</p>
<p>默认的 Docker 网络桥接模型</p>
<p>其中 ipl 是网桥的IP 地址，Docker Daemon 会在几个备选地址段里给它选一个，通常是172 开头的一个地址。这个地址和主机的 IP地址是不重叠的。ip2是Docker 在启动容器的时候，在 这个地址段随机选择的一个没有使用的IP 地址，Docker 占用它并分配给了被启动的容器。相应 的 MAC地址也根据这个 IP 地址，在02:42:ac:11:00:00和 02:42:ac:11:ff:f的范围内生成，这样 做可以确保不会有 ARP 的冲突。</p>
<p>启动后，Docker 还将 Veth 对的名字映射到了ethO网络接口。ip3就是主机的网卡地址。</p>
<p>在一般情况下，ipl、ip2 和ip3是不同的IP段，所以在默认不做任何特殊配置的情况下， 在外部是看不到ipl 和ip2的。</p>
<p>这样做的结果就是，同一台机器内的容器之间可以相互通信。不同主机上的容器不能够相 互通信。实际上它们甚至有可能会在相同的网络地址范围内（不同的主机上的 dockero 的地址 段可能是一样的）。</p>
<p>为了让它们跨节点互相通信，就必须在主机的地址上分配端口，然后通过这个端口路由或 代理到容器上。这种做法显然意味着一定要在容器之间小心谨慎地协调好端口的分配，或者使 用动态端口的分配技术。在不同应用之间协调好端口分配是十分困难的事情，特别是集群水平 扩展的时候。而动态的端口分配也会带来高度复杂性，例如：每个应用程序都只能将端口看作 一个符号（因为是动态分配的，无法提前设置）。而且.API Server 也要在分配完后，将动态端口 插入到配置的合适位置。另外，服务也必须能互相之间找到对方等。这些都是 Docker 的网络模 • 218</p>
<h2>第 232 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p>型在跨主机访问时面临的问题。</p>
<p>1） 查看 Docker 启动后的系统情况 我们已经知道，Docker 网络在 bridge 模式下 Docker Daemon 启动时创建dockerO 网桥，并 在网桥使用的网段为容器分配IP。让我们看看实际的操作。</p>
<p>在刚刚启动Docker Daemon 并且还没有启动任何容器的时候，网络协议栈的配置情况如下：</p>
<p># systemctl start docker # ip addr</p>
<p>1:10：&lt;LOOPBACK, UP, LOWER L_UP&gt; mtu 65536 qdisc noqueue state UNKNOWN link/1oopback 00:00:00:00:00:00 brd 00:00:00:00:00:00 inet 127.0.0.1/8 scope host 10 valid_lft forever preferred_lft forever inet6 ：：1/128 scope host valid lft forever preferred lft forever 2:eno16777736：&lt;BROADCAST,MULTICAST,UP, LOWER_UP&gt; mtu 1500 qdisc pfifo_fast state UP qlen 1000 link/ether 00:0c:29:14:3d:80 brd ff:ff:ff:ff:ff:ff inet 192.168.1.133/24 brd 192.168.1.255 scope global eno16777736 valid lft forever preferred _lft forever</p>
<p>inet6 fe80：：20c:29ff:fel4:3d80/64 scope link valid_lft forever preferred_lft forever 3:docker0： &lt;NO-CARRIER, BROADCAST, MULTICAST, UP&gt; mtu 1500 qdisc noqueue state DOwN link/ether 02:42:6e:af:Oe:c3 brd ff:ff:ff:ff:ff: Ef inet 172.17.42.1/24 scope global docker0 valid_lft forever preferred_lft forever # iptables-save</p>
<p># Generated by iptables-save vl.4.21 on Thu Sep 24 17:11:04 2015 *nat</p>
<p>：PREROUTING ACCEPT ［7:878］ ：INPUT ACCEPT ［7:878］ ：OUTPUT ACCEPT ［3:536］ ：POSTROUTING ACCEPT［3:536］ ：DOCKER - ［0:0］</p>
<p>-A PREROUTING -m addrtype --dst-type LOCAL -j DOCKER -A OUTPUT ！-d 127.0.0.0/8 -m addrtype --dst-type LOCAL -j DOCKER -A POSTROUTING -s 172.17.0.0/16 ！-o docker0 -j MASQUERADE COMMIT</p>
<p># Completed on Thu Sep 24 17:11:04 2015 # Generated by iptables-save vl.4.21 on Thu Sep 24 17:11:04 2015 *filter</p>
<p>：INPUT ACCEPT［133:113621 ：FORWARD ACCEPT ［0:0］ ：OUTPUT ACCEPT［37:5000］ ：DOCKER -［0:0］</p>
<p>• 219</p>
<h2>第 233 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） -A FORWARD -O dockerO -j DOCKER -A FORWARD -0 docker0 -m conntrack --ctstate RELATED, ESTABLISHED -j ACCEPT -A FORWARD -i docker0 ！-o docker0 -j ACCEPT -A FORWARD -i docker0 -o docker0 -j ACCEPT # Completed on Thu Sep 24 17:11:04 2015 可以看到，Docker 创建了 dockerO 网桥，并添加了 Iptables 规则。docker0 网桥和 Iptables 规则都处于 root 命名空间中。通过解读这些规则，我们发现，在还没有启动任何容器时，如果 启动了 Docker Daemon，那么它就已经做好了通信的准备。对这些规则的说明如下。</p>
<p>（1）在 NAT 表中有3条记录，前两条匹配生效后，都会继续执行 DOCKER 链，而此时 DOCKER 链为空，所以前两条只是做了个框架，并没有实际效果。</p>
<p>（2） NAT 表第3条的含义是，若本地发出的数据包不是发往docker0 的，即是发往主机之 外的设备的，都需要进行动态地址修改（MASQUERADE），将源地址从容器的地址（172段） 修改为宿主机网卡的IP 地址，之后就可以发送给外面的网络了。</p>
<p>（3）在FILTER 表中，第1条也是一个框架，因为后继的DOCKER链是空的。</p>
<p>（4） 在FILTER表中，第3条是说，docker0 发出的包，如果需要 Forward 到非 docker0 的 本地IP地址的设备，则是允许的，这样，docker0 设备的包就可以根据路由规则中转到宿主机 的网卡设备，从而访问外面的网络。</p>
<p>（5） FILTER 表中，第4条是说，docker0 的包还可以中转给 dockero本身，即连接在docker0 网桥上的不同容器之间的通信也是允许的。</p>
<p>（6） FILTER 表中，第2条是说，如果接收到的数据包属于以前已经建立好的连接，那么允 许直接通过。这样接收到的数据包自然又走回 dockerO，并中转到相应的容器。</p>
<p>除了这些 Netfilter 的设置，Linux 的ip_forward 功能也被 Docker Daemon 打开了：</p>
<p># cat /proc/sys/net/ipv4/ip_forward 1</p>
<p>另外，我们还可以看到刚刚启动 Docker 后的Route 表，和启动前没有什么不同：</p>
<p># ip route</p>
<p>default via 192.168.1.2 dev eno16777736 proto static metric 100 172.17.0.0/16 dev docker proto kernel scope link src 172.17.42.1 192.168.1.0/24</p>
<p>dev eno16777736 proto kernel scope link src 192.168.1.132 192.168.1.0/24 dev eno16777736 proto kernel scope link</p>
<p>SrC 192.168.1.132</p>
<p>metric 100</p>
<p>2） 查看容器启动后的情况（容器无端口映射） 刚才我们看了 Docker 服务启动后的网络情况。现在，我们启动一个 Registry 容器后（不使 • 220•</p>
<h2>第 234 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p>用任何端口镜像参数），看一下网络堆栈部分相关的变化：</p>
<p>docker run --name register -d registry # ip addr</p>
<p>1:10：＜LOOPBACK, UP, LOWER_UP&gt; mtu 65536 qdisc noqueue state UNKNOWN link/1oopback 00:00:00:00:00:00brd 00:00:00:00:00:00 inet 127.0.0.1/8 scope host 10 valid_lft forever preferred_lft forever inet6：：1/128 scope host valid_lft forever preferred_lft forever 2:eno16777736：&lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 qdisc pfifo_fast state UP qlen 1000 1ink/ether 00:0c:29:c8:12:5f brd ff:ff:ff:ff:ff:ff inet 192.168.1.132/24 brd 192.168.1.255 scope global eno16777736 valid lft forever preferred_ lft forever inet6 fe80：：20c:29ff:fec8:125f/64 scope link valid_lft forever preferred_lft forever 3:dockerO：&lt;NO-CARRIER, BROADCAST,MULTICAST, UP&gt; mtu 1500 qdisc noqueue state DOWN link/ether 02:42:72:79:b8:88 brd ff:ff:ff:ff:ff:ff inet 172.17.42.1/24 scope global docker0 valid lft forever preferred lft forever inet6 fe80：：42:7aff:fe79:b888/64 scope link valid lft forever preferred lft forever 13:veth2dc8bbd： &lt;BROADCAST, MULTICAST, UE, LOWER_UP&gt;mtu 1500 qdisc noqueue master dockero state UP</p>
<p>link/ether be:d9:19:42:46:18 brd ff:ff:ff:ff:ff:ff inet6 fe80：：bcd9:19ff:fe42:4618/64 scope link valid_lft forever preferred_Lft forever # iptables-save</p>
<p># Generated by iptables-save v1.4.21 on Thu Sep 24 18:21:04 2015 *nat</p>
<p>：PREROUTING ACCEPT ［14:1730］ ：INPUT ACCEPT ［14:1730］ ：OUTPUT ACCEPT［59:4918］ ：POSTROUTING ACCEPT ［59:4918］ ：DOCKER - ［0:0］</p>
<p>-A PREROUTING -m addrtype --dst-type LOCAL -j DOCKER -A OUTPUT ！ -d 127.0.0.0/8 -m addrtype --dst-type LOCAL -j DOCKER -A POSTROUTING -s 172.17.0.0/16 ！-0 docker0 -j MASQUERADE # Completed on Thu Sep 24 18:21:04 2015 # Generated by iptables-save v1.4.21 on Thu Sep 24 18:21:04 2015 *filter</p>
<p>：INPUT ACCEPT［2383:211572］ ：FORWARD ACCEPT ［0:0］ ：OUTPUT ACCEPT［2004:242872］ •221•</p>
<h2>第 235 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） ：DOCKER - ［0:0］</p>
<p>-A FORWARD -O dockerO -j DOCKER -A FORWARD -O docker0 -m conntrack --ctstate RELATED, ESTABLISHED -j ACCEPI -A FORWARD -i docker0 ！ -o docker0 -j ACCEPT -A FORWARD -i docker0 -o docker0 -j ACCEPT COMMIT</p>
<p># Completed on Thu Sep 24 18:21:04 2015 # ip route</p>
<p>default via 192.168.1.2 dev eno16777736 proto static metric 100 172.17.0.0/16 dev docker proto kernel scope link src 172.17.42.1 192.168.1.0/24 dev eno16777736 proto kernel scope link src 192.168.1.132 192.168.1</p>
<p>.0124 dev eno16777736 proto kernel scope 1ink rC 192.168.1.132</p>
<p>metric 100</p>
<p>可以看到如下情况。</p>
<p>（1）宿主机器上的 Netfiter 和路由表都没有变化，说明在不进行端口映射时，Docker 的默 认网络是没有特殊处理的。相关的 NAT 和FILTER 两个 Netfiter 链还是空的。</p>
<p>（2）宿主机上的 Veth 对已经建立，并连接到了容器内。</p>
<p>我们再次进入刚刚启动的容器内，看看网络栈是什么情况。容器内部的IP 地址和路由如下：</p>
<p># docker exec -ti 24981a750ala bash ［root@24981a750ala /］# ip route default via 172.17.42.1 dev eth0 172.17.0.0/16 dev etho proto kernel scope link src 172.17.0.10 ［root@24981a750ala /］#ip addr 1:10：&lt;LOOPBACK, UP, LOWER_UP&gt; mtu 65536 qdisc noqueue state UNKNOWN 1ink/1oopback 00:00:00:00:00:00 brd 00:00:00:00:00:00 inet 127.0.0.1/8 scope host 10 valid_lft forever preferred_lft forever inet6 ：：1/128 scope host valid_lft forever preferred_lft forever 22：</p>
<p>ethO：&lt;BROADCAST,MULTICAST,UP, LOWER_UP&gt; mtu 1500 qdisc noqueue state UP link/ether 02:42:ac:11:00:0a brd ff:ff:ff:ff:ff:ff inet 172.17.0.10/16 scope global eth0 valid_ lft forever preferred_lft forever inet6 fe80：：42:acff:fe11:a/64 scope link valid</p>
<p>_1ft forever preferred_lft forever 我们可以看到，默认停止的回环设备 10 已经被启动，外面宿主机连接进来的Veth设备也 被命名成了 ethO，并且已经配置了地址 172.17.0.10。</p>
<p>路由信息表包含一条到 docker0 的子网路由和一条到 docker0 的默认路由。</p>
<p>•222．</p>
<h2>第 236 页</h2>
<h3>第3章</h3>
<p>Kubernetes 核心原理</p>
<p>3）查看容器启动后的情況（容器有端口映射） 下面，我们用带端口映射的命令启动 registry：</p>
<p>docker run --name register -d -p 1180:5000 registry 在启动后查看 Iptables 的变化。</p>
<p># iptables-save</p>
<p># Generated by iptables-save v1.4.21 on Thu Sep 24 18:45:13 2015 *nat</p>
<p>：PREROUTING ACCEPT ［2:236］ ：INPUT ACCEPT ［0:0］ ：OUTPUT ACCEPT ［0:0］ ：POSTROUTING ACCEPT ［0:01 ：DOCKER - ［0:0］</p>
<p>-A PREROUTING -m addrtype --dst-type LOCAL -j DOCKER -A OUTPUT ！-d 127.0.0.0/8 -m addrtype --dst-type LOCAL -j DOCKER -A POSTROUTING -S 172.17.0.0/16！-0 docker0 -j MASQUERADE -A POSTROUTING -s 172.17.0.19/32 -d 172.17.0.19/32 -P tcp -m tcp --dport 5000 -j MASQUERADE</p>
<p>-A DOCKER ！ -i docker0 -p top -m tcp --dport 1180 -j DNAT --to-destination 172.17.0.19:5000</p>
<p>COMMIT</p>
<p># Completed on Thu Sep 24 18:45:13 2015 # Generated by iptables-save v1.4.21 on Thu Sep 24 18:45:13 2015 *filter</p>
<p>：INPUT ACCEPT ［54:4464］ ：FORWARD ACCEPT ［O:0］ ：OUTPUT ACCEPT［41:5576］ ：DOCKER - ［0:0］</p>
<p>-A FORWARD -0 docker0 -j DOCKER -A FORWARD -O docker0 -m conntrack --ctstate RELATED, ESTABLISHED -j ACCEPT -A FORWARD -i docker0 ！-o docker0 -j ACCEPT -A FORWARD -i docker0 -0 docker0 -j ACCEPT -A DOCKER -d 172.17.0.19/32 ！-i docker0 -o docker0 -p tcp -m tcp --dport 5000 -j ACCEPT</p>
<p>COMMIT</p>
<p># Completed on Thu Sep 24 18:45:13 2015 从新增的规则可以看出，Docker 服务在 NAT 和 FILTER 两个表内添加的两个 DOCKER 子 链都是给端口映射用的。例如本例中我们需要把外面宿主机的1180端口映射到容器的5000端 口。通过前面的分析我们知道，无论是宿主机接收到的还是宿主机本地协议栈发出的，目标地 址是本地 IP 地址的包都会经过 NAT 表中的 DOCKER 子链。Docker 为每一个端口映射都在这 个链上增加了到实际容器目标地址和目标端口的转换。</p>
<p>经过这个 DNAT 的规则修改后的IP 包，会重新经过路由模块的判断进行转发。由于目标地 • 223•</p>
<h2>第 237 页</h2>
<p>Kubernetes 权威指南</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 址和端口已经是容器的地址和端口，所以数据自然就送到了 docker0 上，从而送到对应的容器 内部。</p>
<p>当然在 Forward 时，也需要在 Docker 子链中添加一条规则，如果目标端口和地址是指定容 器的数据，则允许通过。</p>
<p>在 Docker 按照端口映射的方式启动容器时，主要的不同就是上述 Iptables 部分。而容器内 部的路由和网络设备，都和不做端口映射时一样，没有任何变化。</p>
<p>4） Docker 的网络局限</p>
<p>我们从 Docker 对 Linux 网络协议栈的操作可以看到，Docker 一开始没有考虑到多主机互联 的网络解决方案。</p>
<p>Docker一直以来的理念都是“简单为美”，几乎所有尝试Docker 的人，都被它“用法简单， 功能强大”的特性所吸引，这也是Docker 迅速走红的一个原因。</p>
<p>我们都知道，虚拟化技术中最为复杂的部分就是虚拟化网络技术，即使是单纯的物理网络 部分，也是一个门槛很高的技能领域，通常只被少数网络工程师所掌握，所以我们可以理解， 结合了物理网络的虚拟网络技术会有多难了。在 Docker 之前，所有接触过 OpenStack 的人的心 里都有一个难以释怀的阴影，那就是它的网络问题，于是，Docker 明智地避开这个“雷区”， 让其他专业人员去用现有的虚拟化网络技术解决 Docker 主机的互联问题，以免让用户觉得 Docker 太难了，从而放弃学习和使用 Docker。</p>
<p>Docker 成名以后，重新开始重视网络解决方案，收购了一家 Docker 网络解决方案公司— Socketplane，原因在于这家公司的产品广受好评，但有趣的是 Socketplane 的方案就是以 Open VSwitch 为核心的，其还 Open vSwitch 提供了 Docker镜像，以方便部署程序。之后，Docker 开启了一个“宏伟”的虚拟化网络解决方案一 —Libnetwork，如图3.23所不是其概念图。</p>
<p>A Docker Contalner A Docker Container A Docker Container Network Sandbox</p>
<p>Network Sandbbox</p>
<p>Network Sandbox</p>
<p>图 3.23 Libnetwork 概念图 • 224．</p>
<h2>第 238 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p>这个概念图没有了IP，也没有了路由，已经颠覆了我们的网络常识了，对于不怎么懂网络 的大多数人来说，它的确很有诱惑力，未来是否会对虚拟化网络的模型产生深远冲击我们还不 得而知，但当前，它仅仅是 Docker 官方的一次“尝试”。</p>
<p>针对目前 Docker 的网络实现，Docker 使用的 Libnetwork 组件只是将 Docker 平台中的网络 子系统模块化为一个独立库的简单尝试，离成熟和完善还有一段距离。</p>
<p>所以，直到现在，仍然没有来自 Docker官方的可以用于生产实践中的多主机网络解决方案。</p>
<h3>3.7.4 Kubernetes 的网络实现</h3>
<p>在实际的业务场景中，业务组件之间的关系十分复杂，特别是微服务概念的推进，应用部 署的粒度更加细小和灵活。为了支持业务应用组件的通信联系，Kubernetes 网络的设计主要致 力于解决以下场景。</p>
<p>（1） 容器到容器之间的直接通信。</p>
<p>（2）抽象的Pod 到Pod 之间的通信。</p>
<p>（3） Pod 到 Service 之间的通信。</p>
<p>（4）集群外部与内部组件之间的通信。</p>
<p>其中第3条、第4条我们在之前的章节里都讲述过，本节中我们对更为基础的第1条与第 2 条进行深入分析和讲解。</p>
<p>1．容器到容器的通信</p>
<p>在同一个 Pod 内的容器（Pod 内的容器是不会跨宿主机的）共享同一个网络命名空间，共 享同一个 Linux 协议栈。所以对于网络的各类操作，就和它们在同一台机器上一样，它们甚至 可以用localhost 地址访问彼此的端口。</p>
<p>这么做的结果是简单、安全和高效，也能减少将已经存在的程序从物理机或者虚拟机移植 到容器下运行的难度。在容器技术出来之前，其实大家早就积累了如何在一台机器上运行一组 应用程序的经验，例如，如何让端口不冲突，以及如何让客户端发现它们等。</p>
<p>我们来看一下 Kubernetes 是如何利用Docker 的网络模型的。</p>
<p>图3.24中的阴影部分就是在Node 上运行着的一个 Pod 实例。在我们的例子中，容器就是 图3.24中的容器1和容器2。容器1和容器2共享了一个网络的命名空间，共享一个命名空间 的结果就是它们好像在一台机器上运行似的，它们打开的端口不会有冲突，可以直接使用 Linux 的本地IPC进行通信（例如消息队列或者管道）。其实这和传统的一组普通程序运行的环境是完 • 225•</p>
<h2>第 239 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 全一样的，传统的程序不需要针对网络做特别的修改就可以移植了。它们之间的互相访问只需 要使用localhost 就可以。例如，如果容器2运行的是 MySQL，那么容器1 使用 localhost:3306 就能直接访问这个运行在容器2上的 MySQL 了。</p>
<p>Node1</p>
<p>容器1</p>
<p>同一个POD</p>
<p>容器2</p>
<p>共享网络</p>
<p>空间</p>
<p>an</p>
<p>Dockero网桥</p>
<p>em</p>
<p>图 3.24 Kubernetes 的 Pod 网络模型 2. Pod 之间的通信</p>
<p>我们看了同一个Pod 内的容器之间的通信情况，再看看 Pod 之间的通信情况。</p>
<p>每一个 Pod 都有一个真实的全局IP 地址，同一个 Node 内的不同Pod 之间可以直接采用对 方Pod的IP地址通信，而且不需要使用其他发现机制，例如 DNS、Consul 或者 etcd。</p>
<p>Pod 容器既有可能在同一个 Node 上运行，也有可能在不同的Node 上运行，所以通信也分 为两类：同一个 Node 内的Pod 之间的通信和不同 Node 上的Pod 之间的通信。</p>
<p>1）同一个 Node 内的 Pod 之间的通信 我们看一下同一个 Node 上的两个 Pod之间的关系，如图3.25所示。</p>
<p>可以看出，Podl 和Pod2 都是通过Veth 连接在同一个 dockerO 网桥上的，它们的IP地址 IPI、 IP2 都是从 docker0 的网段上动态获取的，它们和网桥本身的IP3是同一个网段的。</p>
<p>另外，在Podl、Pod2 的Linux 协议栈上，默认路由都是docker0 的地址，也就是说所有非 本地地址的网络数据，都会被默认发送到 docker0 网桥上，由 docker0 网桥直接中转。</p>
<p>综上所述，由于它们都关联在同一个 docker0 网桥上，地址段相同，所以它们之间是能直 接通信的。</p>
<p>• 226•</p>
<h2>第 240 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p>Node1</p>
<p>容器1</p>
<p>Pod 1</p>
<p>容器2</p>
<p>容器1</p>
<p>Pod 2</p>
<p>容器2</p>
<p>共享网络</p>
<p>空间</p>
<p>共享网络</p>
<p>空间</p>
<p>IP1</p>
<p>IP2</p>
<p>Docker0网桥</p>
<p>IP3</p>
<p>dm</p>
<p>图3.25 同一个Node 内的Pod 关系 2） 不同 Node 上的Pod之间的通信 Pod 的地址是与 docker0 在同一个网段内的，我们知道dockero 网段与宿主机网卡是两个完 全不同的IP网段，并且不同 Node 之间的通信只能通过宿主机的物理网卡进行，因此要想实现 位于不同 Node上的Pod 容器之间的通信，就必须想办法通过主机的这个IP地址来进行寻址和 通信。</p>
<p>另一方面，这些动态分配且藏在 dockero 之后的所谓“私有”IP 地址也是可以找到的。</p>
<p>Kubernetes 会记录所有正在运行 Pod的IP 分配信息，并将这些信息保存在 etcd 中（作 Service 的 Endpoint）。这些私有IP 信息对于Pod 到Pod 的通信也是十分重要的，因我们的网络模型 要求 Pod到Pod 使用私有 IP 进行通信。所以首先要知道这些IP 是什么。</p>
<p>之前提到，Kuberetes 的网络对Pod 的地址是平面的和直达的，所以这些Pod的IP 规划也 很重要，不能有冲突。只要没有冲突，我们就可以想办法在整个 Kubernetes 的集群中找到它。</p>
<p>综上所述，要想支持不同 Node 上的Pod 之间的通信，就要达到两个条件：</p>
<p>（1）在整个 Kubernetes 集群中对Pod 的IP 分配进行规划，不能有冲突；</p>
<p>（2）找到一种办法，将Pod 的IP 和所在Node 的IP 关联起来，通过这个关联让Pod 可以互 相访问。</p>
<p>根据条件1的要求，我们需要在部署 Kubernetes 的时候，对 docker0 的IP 地址进行规划， •227•</p>
<h2>第 241 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 保证每一个 Node 上的 dockero 地址没有冲突。我们可以在规划后手工配置到每个 Node 上，或 者做一个分配规则，由安装的程序自己去分配占用。例如 Kubernetes 的网络增强开源软件 Flannel 就能够管理资源池的分配。</p>
<p>根据条件2的要求，Pod 中的数据在发出时，需要有一个机制能够知道对方Pod 的IP地址 挂在哪个具体的 Node 上。也就是说先要找到 Node 对应宿主机的IP 地址，将数据发送到这个 宿主机的网卡上，然后在宿主机上将相应的数据转到具体的 docker0 上。一旦数据到达宿主机 Node，则那个 Node 内部的 dockero便知道如何将数据发送到Pod。如图3.26所示。</p>
<p>Node1</p>
<p>Node2</p>
<p>容器1</p>
<p>Pod 1</p>
<p>容器2</p>
<p>pod2</p>
<p>容器1</p>
<p>容器2</p>
<p>共享网络</p>
<p>空间</p>
<p>共享网络</p>
<p>空间</p>
<p>IP1</p>
<p>IP2</p>
<p>又</p>
<p>又</p>
<p>DockerO网桥</p>
<p>中</p>
<p>Docker0网桥</p>
<p>IP3</p>
<p>#P4</p>
<p>图3.26跨Node 的 Pod通信 在图3.26中，IP1对应的是Podl，IP2对应的是Pod2。Podl 在访问 Pod2时，首先要将数 据从源 Node 的etho发送出去，找到并到达 Node2的etho。也就是说先要从IP3到IP4，之后才 是IP4到IP2的递送。</p>
<p>在谷歌的GCE 环境下，Pod 的IP 管理（类似 docker0）、分配及它们之间的路由打通都是 由GCE完成的。Kubernetes 作为主要在GCE 上面运行的框架，它的设计是假设底层已经具备 这些条件，所以它分配完地址并将地址记录下来就完成了它的工作。在实际的GCE 环境中， GCE 的网络组件会读取这些信息，实现具体的网络打通。</p>
<p>而在实际的生产中，因为安全、费用、合规等种种原因，Kubernetes 的客户不可能全部使 用谷歌的GCE 环境，所以在实际的私有云环境中，除了部署 Kuberetes 和 Docker，还需要额 • 228•</p>
<h2>第 242 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p>外的网络配置，甚至通过一些软件来实现 Kubernetes 对网络的要求。做到这些后，Pod 和 Pod 之间才能无差别地透明通信。</p>
<p>为了达到这个目的，开源界有不少应用来增强 Kubernetes、Docker 的网络，在后面的章节 里会介绍几个常用的组件和它们的组网原理。</p>
<h3>3.7.5 开源的网络组件</h3>
<p>Kubernetes 的网络模型假定了所有Pod 都在一个可以直接连通的扁平的网络空间中。这在 GCE 里面是现成的网络模型，Kuberetes 假定这个网络已经存在。而在私有云里搭建 Kubernetes 集群，就不能假定这种网络已经存在了。我们需要自己实现这个网络假设，将不同节点上的 Docker 容器之间的互相访问先打通，然后运行 Kubernetes。</p>
<p>目前已经有多个开源组件支持这个网络模型。这里介绍几个常见的模型，分别是 Flannel、 Open vSwitch 及直接路由的方式。</p>
<p>1. Flannel</p>
<p>Flannel 之所以可以搭建 Kubernetes 依赖的底层网络，是因为它能实现以下两点。</p>
<p>（1）它能协助 Kubernetes，给每一个 Node 上的 Docker 容器分配互相不冲突的IP地址。</p>
<p>（2） 它能在这些IP 地址之间建立一个覆盖网络（Overlay Network），通过这个覆盖网络， 将数据包原封不动地传递到目标容器内。</p>
<p>通过图3.27来看看 Flannel 是如何实现这两点的。</p>
<p>可以看到，Flannel 首先创建了一个名为 flanne0 的网桥，而且这个网桥的一端连接 dockero 网桥，另一端连接一个叫作 flanneld 的服务进程。</p>
<p>flanneld 进程并不简单，它首先上连etcd，利用etcd 来管理可分配的IP 地址段资源，同时 监控 etcd 中每个 Pod 的实际地址，并在内存中建立了一个 Pod 节点路由表；然后下连 docker0 和物理网络，使用内存中的 Pod 节点路由表，将 docker0 发给它的数据包包装起来，利用物理 网络的连接将数据包投递到目标 flanneld上，从而完成Pod到Pod之间的直接的地址通信。</p>
<p>Flannel 之间的底层通信协议的可选余地很多，有UDP、VxLan、AWS VPC 等多种方式， 只要能通到对端的 Flannel就可以了。源 flanneld 加包，目标 flanneld 解包，最终 docker0 看到 的就是原始的数据，非常透明，根本感觉不到中间 Flannel 的存在。常用的是 UDP。</p>
<p>• 229</p>
<h2>第 243 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） Web App Frontend</p>
<p>tachel contz</p>
<p>appicontaine</p>
<p>CoreOS Machine</p>
<p>10.1.15.2/24</p>
<p>wc</p>
<p>UDP</p>
<p>24</p>
<p>1.15</p>
<p>• fameld</p>
<p>sOurcE.182.168.2.280 dest J92.16R &amp;.200 source: J0.2.153</p>
<p>dest 10 1.20.3</p>
<p>Web App Frontend2</p>
<p>10.1.15.3/24</p>
<p>CoreOs Machine</p>
<p>Bachend Sericel</p>
<p>10.1.20.2/4</p>
<p>10.1.20.1/24</p>
<p>QM</p>
<p>Rannad1m3</p>
<p>E2</p>
<p>Backend Seps</p>
<p>10.1.20.3/24</p>
<p>图 3.27 Flannel 架构图 我们看一下 Flannel 是如何做到让为不同 Node上的Pod分配的IP 不产生冲突的。其实想 到 Flannel 使用了集中的etcd 存储就很容易理解了。它每次分配的地址段都在同一个公共区域 获取，这样大家自然能够互相协调，不产生冲突了。而且在 Flannel分配好地址段后，后面的事 情是由 Docker 完成的，Flannel 通过修改Docker 的启动参数将分配给它的地址段传递进去。</p>
<p>--bip=172.17.18.1/24 通过这些操作，Flannel 就控制了每个 Node 上的 docker0地址段的地址，也就保障了所有 Pod的IP地址在同一个水平网络中且不产生冲突了。</p>
<p>Flannel 完美地实现了对 Kubernetes 网络的支持，但是它引入了多个网络组件，在网络通信 时需要转到 flannel0 网络接口，再转到用户态的 flanneld 程序，到对端后还需要走这个过程的反 过程，所以也会引入一些网络的时延损耗。</p>
<p>另外，Flannel模型默认使用了UDP 作为底层传输协议，UDP 本身是非可靠协议，虽然两 端的 TCP 实现了可靠传输，但在大流量、高并发应用场景下还需要反复测试，确保没有问题。</p>
<p>2.Open vSwitch</p>
<p>在了解了 Flannel后，我们再看看 Open vSwitch 是怎么解决上述两个问题的。</p>
<p>Open vSwitch 是一个开源的虚拟交换机软件，有点儿像 Linux 中的 bridge，但是功能要复 • 230•</p>
<h2>第 244 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p>杂得多。Open vSwitch 的网桥可以直接建立多种通信通道（隧道），例如 Open vSwitch with GRE/VxLAN。这些通道的建立可以很容易地通过OVS 的配置命令实现。在 Kubernetes、Docker 场景下，我们主要是建立L3到L3的隧道。举一个例子来看看 Open vSwitch with GRE/VxLAN 的网络架构，如图3.28所示。</p>
<p>docker131</p>
<p>192.168.18.131</p>
<p>docker128</p>
<p>192.168.18.128</p>
<p>Docker0 172.17.42.1/24 Docker0 172.17.43.1/24 br0</p>
<p>gred</p>
<p>GRE</p>
<p>ethO</p>
<p>gred</p>
<p>bro</p>
<p>图 3.28</p>
<p>OVS with GRE 原理图</p>
<p>首先，为了避免 Docker 创建的docker0地址产生冲突（因 Docker Daemon 启动且给 docker0 选择子网地址时只有几个备选列表，很容易产生冲突），我们可以将docker0 网桥删除，手动建 立一个 Linux 网桥，然后手动给这个网桥配置IP 地址范围。</p>
<p>其次，建立 Open vSwitch 的网桥 ovs，然后使用 ovs-vsctl 命令给ovs 网桥增加 gre 端口，添 加 gre 端口时要将目标连接的 NodeIP 地址设置对端的IP地址。对每一个对端IP 地址都需要 这么操作（对于大型集群网络，这可是个体力活，要做自动化脚本来完成）。</p>
<p>最后将 ovs 的网桥作为网络接口，加入 Docker 的网桥上（docker0 或者自己手工建立的新 网桥）。</p>
<p>重启 ovs 网桥和Docker 的网桥，并添加一个 Docker 的地址段到Docker 网桥的路由规则项， 就可以将两个容器的网络连接起来了。</p>
<p>1） 网络通信过程</p>
<p>当容器内的应用访问另一个容器的地址时，数据包会通过容器内的默认路由发送给 docker0 网桥。ovs 的网桥是作为 docker0 网桥的端口存在的，它会将数据发送给 ovs 网桥。ovs网络已 经通过配置建立了和其他ovs 网桥的GRE/VxLAN隧道，自然能将数据送达对端的Node，并送 往 dockerO及Pod。</p>
<p>通过新增的路由项，使得 Node 节点本身的应用的数据也路由到 docker0网桥上，和刚才的 通信过程一样，自然也可以访问其他Node 上的Pod。</p>
<p>2） OVS with GRE/VxLAN 组网方式的特点 OVS 的优势是，作为开源虚拟交换机软件，它相对比较成熟和稳定，而且支持各类网络隧 • 231．</p>
<h2>第 245 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 道协议，经过了 OpenStack 等项目的考验。</p>
<p>另一方面，在前面介绍 Flannel 的时候可知 Flannel 除了支持建立覆盖网络（Overlay Network）， 保证 Pod 到 Pod 的无缝通信，还和 Kubernetes、Docker 架构体系结合紧密。Flannel 能够感知 Kubernetes 的 Service，动态维护自己的路由表，还通过 etcd 来协助 Docker 对整个 Kubernetes 集 群中 docker0 的子网地址分配。而我们在使用 OVS 的时候，很多事情就需要手工完成了。</p>
<p>无论是OVS 还是 Flannel，通过覆盖网络提供的 Pod 到Pod通信都会引入一些额外的通信 开销，如果是对网络依赖特别重的应用，则需要评估对业务的影响。</p>
<p>3. 直接路由</p>
<p>我们知道，docker0 网桥上的IP 地址在Node 网络上是看不到的。从一个 Node 到一个 Node 内的 docker0 是不通的。因为它不知道某个 IP 地址在哪里。如果能够让这些机器知道对端 docker0 地址在哪里，就可以让这些dockerO 互相通信了。这样所有 Node 上运行的Pod 就可 以互相通信了。</p>
<p>我们可以通过部署 Multilayer Switch（MLS）来实现这一点，在MLS 中配置每个 dockero 子网地址到 Node 地址的路由项，通过 MLS 将 docker0 的IP 寻址定向到对应的 Node 节点上。</p>
<p>另外，我们还可以将这些 dockero 和 Node 的匹配关系配置在Linux 操作系统的路由项中， 这样通信发起的 Node 能够根据这些路由信息直接找到目标Pod所在的 Node，将数据传输过去。</p>
<p>如图 3.29所示。</p>
<p>Node1</p>
<p>Node2</p>
<p>容器1</p>
<p>Pod 1</p>
<p>容器2</p>
<p>容器1</p>
<p>Pod 2</p>
<p>容器2</p>
<p>共享网络</p>
<p>空间</p>
<p>共享网络</p>
<p>空间</p>
<p>etho</p>
<p>X</p>
<p>1P1</p>
<p>IP2</p>
<p>Docker0网桥</p>
<p>Docker0网桥</p>
<p>IP3</p>
<p>1P4</p>
<p>图3.29</p>
<p>直接路由 Pod到Pod通信</p>
<p>• 232•</p>
<h2>第 246 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p>我们在每个Node 的路由表中增加对方所有 docker0 的路由项。</p>
<p>例如 Podl 所在 docker0 网桥的 IP 子网是 10.1.10.0, Node 的地址为 192.168.1.128：而 Pod2 所在 docker0 网桥的IP 子网是 10.1.20.0，Node 的地址192.168.1.129。</p>
<p>在Nodel 上用 route add 命令增加一条到Node2 上docker0 的静态路由规则：</p>
<p>route add -net 10.1.20.0 netmask 255.255.255.0 gw 192.168.1.129 同样，在 Node2 上增加一条到 Nodel 上 docker0 的静态路由规则：</p>
<p>route add -net 10.1.10.0 netmask 255.255.255.0gw 192.168.1.128 这样两个 Node 之间的Pod 就可以互相通信了，因为它们发出的数据包经过本地Linux 的 路由规则，能将数据送到对端的 Node。</p>
<p>在大规模集群中，在每个 Node 上都需要配置到其他 docker0/Node 的路由项，会带来很大 的工作量；并且在新增机器时，对所有 Node 都需要修改配置；重启机器时，如果 docker0 的地 址有变化，则也需要修改所有 Node 的配置，这显然是非常复杂的。</p>
<p>为了管理这些动态变化的 docker0 地址，动态地让其他 Node 都感知到它，还可以使用动态 路由发现协议来同步这些变化。运行动态路由发现协议代理的Node，会将本机 LOCAL 路由表 的IP 地址通过组播协议发布出去，同时监听其他Node 的组播包。通过这样的信息交换，Node 上的路由规则都能够相互学习到。当然，路由发现协议本身还是很复杂的，感兴趣的话你可以 查阅相关的规范。在实现这些动态路由发现协议的开源软件中，常用的有 Quagga、Zebra 等。</p>
<p>下面简单介绍直接路由的操作过程。</p>
<p>（1）首先手工分配 Docker bridge 的地址，保证它们在不同的网段是不重叠的。建议最好不 用 Docker Daemon 自动创建的 dockero（因为我们不需要它的自动管理功能），而是单独建立一 个 bridge，给它配置规划好的IP 地址，然后使用--bridge=XX 来指定网桥。</p>
<p>（2） 然后在每一个节点上运行 Quagga。</p>
<p>完成这些操作后，我们很快就能得到一个Pod和Pod 直接互相访问的环境了。由于路由发 现能够被网络上的所有设备接收，所以如果网络上的路由器也能打开 RIP 协议选项，则能够学 习到这些路由信息。通过这些路由器，我们甚至可以在非Node 节点上使用Pod 的IP地址直接 访问 Node 上的 Pod。</p>
<p>当然，聪明的你还会有新的疑问：这样做的话，由于每一个Pod 的地址都会被路由发现协 议广播出去，会不会存在路由表过大的情况？实际上，路由表通常都会有高速缓存，查找速度 会很快，不会对性能产生太大的影响。当然，如果你的集群容量在数千台 Node 以上，则仍然 需要测试和评估路由表的效率问题。</p>
<p>• 233</p>
<h2>第 247 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版）</p>
<h3>3.7.6 网络实战</h3>
<p>Docker 给我们带来了不同的网络模式，而 Kubernetes 也以一种不同的方式来解决这些网络 模式的挑战，但是其方式有些不太好理解，特别是对于刚开始接触 Kubernetes 的网络的开发者。</p>
<p>我们在前面学习了 Kubemetes、Docker 的理论，本节将通过一个完整的实验，从部署一个 Pod 开始，一步一步地部署那些 Kubernetes 的组件，来剖析 Kubernetes 在网络层是如何实现及如何 工作的。</p>
<p>这里使用虚拟机来完成实验。如果你要部署在物理机器上，或者部署在云服务商的环境下， 则涉及的网络模型很可能稍微有所不同。不过，从网络角度来看，Kubernetes 的机制是类似且 一致的。</p>
<p>好了，来看看我们的实验环境，如图3.30所示。</p>
<p>dockerO</p>
<p>10M10A</p>
<p>Node1</p>
<p>192.168.1.129</p>
<p>dockerd</p>
<p>10:120.</p>
<p>Node2</p>
<p>192.168.1.130</p>
<p>Node3</p>
<p>192.168.1.131</p>
<p>Kube master</p>
<p>192.168.1.129</p>
<p>dockerg</p>
<p>10.1301</p>
<p>图 3.30</p>
<p>实验环境</p>
<p>Kubemetes 的网络模型要求每一个 Node 上的容器都可以相互访问。</p>
<p>默认的 Docker 的网络模型提供了一个 IP 地址段是 172.17.0.0/16的 dockero 网桥。每一个容 器都会在这个子网内获得IP 地址，并且将 docker0 网桥的IP 地址（172.17.42.1）作为其默认网 关。需要注意的是 Docker 宿主机外面的网络不需要知道任何关于这个172.17.0.0/16 的信息或者 知道如何连接到它内部，因为 Docker 的宿主机针对容器发出的数据，在物理网卡地址后面都做 了IP 伪装 MASQUERADE（隐含 NAT）。也就是说，在网络上看到的任何容器数据流都来源于 那台 Docker 节点的物理IP 地址。这里所说的网络都是指连接这些主机的物理网络。</p>
<p>这个模型便于使用，但是并不完美，需要依赖端口映射的机制。</p>
<p>在 Kubernetes 的网络模型中，每台主机上的 docker0 网桥都是可以被路由到的。也就是说， 在部署了一个 Pod的时候，在同一个集群内，那台主机的外面可以直接访问到那个 Pod，并不 • 234•</p>
<h2>第 248 页</h2>
<h3>第3章</h3>
<p>Kubernetes 核心原理</p>
<p>需要在那台物理主机上做端口映射。综上所述，你可以在网络层将 Kubernetes 的节点看作一个 路由器。如果我们将实验环境改画成一个网络图，那么它看起来如图3.31 所示。</p>
<p>dockero</p>
<p>dockero</p>
<p>route 10.1.20.1 192.168.1.130 route 10.1.30.1 192.168.1.131 oute 10.1.10.1 192.168.1.12 oute 10.1.30.1 192.168.1.13 192.168.1.129</p>
<p>192.168.1.130</p>
<p>route 10.1.10.1 192.168.1.129 route 10.1.20.1 192.168.1.130 Kube master</p>
<p>192.168.1.129</p>
<p>192.168.1.131</p>
<p>sdockerg</p>
<p>220430.</p>
<p>图 3.31</p>
<p>实验环境网络图</p>
<p>为了支持 Kubernetes 网络模型，我们采取了直接路由的方式来实现，在每个 Node 上配置 相应的静态路由项，例如在 192.168.1.129 这个 Node 上我们配置了两个路由项：</p>
<p>#route add -net 10.1.20.0 netmask 255.255.255.0 gw 192.168.130 #route add -net 10.1.30.0 netmask 255.255.255.0 gw 192.168.131 这意味着，每一个新部署的容器都将使用这个 Node（docker0 的网桥 IP）作为它的默认网关。</p>
<p>而这些 Node 节点（类似路由器）都有其他dockero 的路由信息，这样它们就能够相互连通了。</p>
<p>接下来通过一些实际的案例，来看看 Kubernetes 在不同的场景下其网络部分到底做了什么 事情。</p>
<p>第1步：部署一个RC/Pod</p>
<p>部署的RC/Pod 描述文件如下（frontend-controller.yaml）：</p>
<p>apiVersion: v1</p>
<p>kind: ReplicationController metadata：</p>
<p>name: frontend</p>
<p>labels：</p>
<p>name: frontend</p>
<p>spec：</p>
<p>replicas: 1</p>
<p>selector：</p>
<p>name: frontend</p>
<p>template：</p>
<p>metadata：</p>
<p>•235</p>
<h2>第 249 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） labels：</p>
<p>name: frontend</p>
<p>spec：</p>
<p>containers：</p>
<p>- name:php-redis</p>
<p>image: kubeguide/guestbook-php-frontend env：</p>
<p>- name: GET_HOSTS_FROM value: env</p>
<p>ports：</p>
<p>- containerPort :80 hostPort: 80</p>
<p>为了便于观察，我们假定在一个空的 Kubernetes 集群上运行，提前清理了所有 Replication Controller、Pod 和其他 Service：</p>
<p># kubectl get rc</p>
<p>CONTROLLER</p>
<p>CONTAINER （S） IMAGE （S） SELECTOR</p>
<p>REPLICAS</p>
<p>＃</p>
<p># kubectl get services LABELS</p>
<p>NAME</p>
<p>SELECTOR</p>
<p>kubernetes component=apiserver, Provider=kubernetes &lt;none&gt; IP （S）</p>
<p>PORT（S）</p>
<h3>20.1.0.1 443/TCP</h3>
<p># kubectl get pods NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS AGE</p>
<p>让我们检查一下此时某个 Node上的网络接口都有哪些。Nodel 的状态是：</p>
<p># ifconfig</p>
<p>docker0:flags=4099&lt;UP, BROADCAST, RUNNING,MULTICAST&gt; mtu 1500 inet 10.1.10.1 netmask 255.255.255.0 broadcast 10.1.10.255 inet6 fe80：：5484:7aff:fefe: 9799 prefixlen 64 scopeid Ox20&lt;1ink&gt; ether 56:84:7a:fe:97:99 txqueuelen 0 （Ethernet） 373245 bytes 170175373 （162.2 MiB） RX errors0</p>
<p>dropped 0 overruns 0 frame 0 TX packets 353569 bytes 353948005 （337.5 MiB） TX errors 0 dropped 0 overruns 0 carrier 0 collisions 0 eno16777736:flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt; mtu 1500 inet 192.168.1.129 netmask 255.255.255.0 broadcast 192.168.1.255 inet6 fe80：：20c:29ff:fe47:6e2c prefixlen 64 scopeid 0x20&lt;link&gt; ether 00:0c:29:47:6e:2c txqueuelen 1000 （Ethernet） RX packets 326552 bytes 286033393 （272.7 MiB） RX errors 0 dropped 0 overruns 0 frame 0 TX packets 219520 bytes 31014871 （29.5 MiB） TX errors 0 dropped 0 overruns 0 carrier 0 collisions O 10:flags=73&lt;UP, LOOPBACK, RUNNING&gt; mtu 65536 • 236•</p>
<h2>第 250 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p>inet 127.0.0.1 netmask 255.0.0.0 prefixlen 128</p>
<p>scopeid Ox10&lt;host&gt; loop txqueuelen 0 （Local Loopback） RX packets 24095 bytes 2133648 （2.0 MiB） RX errors 0 dropped 0 overruns 0 frame0</p>
<p>TX packets 24095 bytes 2133648 （2.0 MiB） TX errors 0 dropped 0 overruns 0 carrier 0 collisions 0 可以看出，有一个 dockero 网桥和一个本地地址的网络端口。现在部署一下我们在前面准 备的RC/Pod 配置文件，看看发生了什么：</p>
<p># kubect1 create -f frontend-controller.yaml replicationcontrollers/frontend #</p>
<p># kubect1 get pods NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS</p>
<p>AGE</p>
<p>NODE</p>
<p>frontend-4o11g</p>
<p>1/1</p>
<p>Running 0</p>
<p>11s</p>
<p>192.168.1.130</p>
<p>可以看到一些有趣的事情。Kubernetes 为这个 Pod 找了一个主机 192.168.1.130 （Node2）来 运行它。另外，这个 Pod 还获得了一个在 Node2 的 docker0 网桥上的IP 地址。我们登录到 Node2 上看看发生了什么事情：</p>
<p># docker Ps</p>
<p>CONTAINER ID</p>
<p>NAMES</p>
<p>37b193a4c633</p>
<p>32</p>
<p>seconds ago</p>
<p>development</p>
<p>TMAGE</p>
<p>COMMAND</p>
<p>CREATED</p>
<p>STATUS</p>
<p>PORTS</p>
<p>kubeguide/example-guestbook-php-redis &quot;/bin/sh -c /run.sh&quot; Up 26 seconds</p>
<p>k8s_php-redis.6ad3289e_frontend-n9n1m 813e2dd9-8149-11e5-823b-000c2921ba71_af6dd859 google_containers/pause:latest 35 seconds ago</p>
<p>Up 28 seconds</p>
<p>0.0.0.0:80-&gt;80/top k8s_POD.855eeb3d_frontend-4t52y_development_ 813e3870-8149-11e5-823b-000c2921ba71_2b66£05e 在 Node2 上现在运行了两个容器。在我们的RC/Pod 定义文件中仅仅包含了一个，那么这 第2个是从哪里来的呢？第2个看起来运行的是一个叫作 google_containers/pause:latest 的镜像， 而且这个容器已经有端口映射到它上面了，为什么是这样呢？让我们深入容器内部去看一下具 体原因。使用 Docker 的 “inspect” 命令来查看容器的详细信息，特别要关注容器的网络模型。</p>
<p># docker inspect 6d1b99cff4ae | grep NetworkMode &quot;NetworkMode&quot; ：&quot;bridge&quot;，| # docker inspect 37b193a4c633 | grep • NetworkMode</p>
<p>&quot;NetworkMode&quot;： &quot;container: 6dlb99cff4ae537689ce87d7528f4ba9dbb40ae 711ecc0a5b3f7c39ff5e5e495&quot;， 有趣的结果是，在查看完每个容器的网络模型后，我们可以看到这样的配置：我们检查的第 1个容器是运行了 “google_containers/pause:latest” 镜像的容器，它使用了Docker 默认的网络模型 bridge：而我们检查的第2个容器，也就是在我们 RC/Pod 中定义运行的 php-redis 容器，使用了 非默认的网络配置和映射容器的模型，指定了映射目标容器为 “google _containers/ pause:latest”。</p>
<p>• 237•</p>
<h2>第 251 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 我们一起来仔细思考一下这个过程，什么 Kubernetes 要这么做呢？首先，一个 Pod 内的 所有容器都需要共用同一个 IP地址，这就意味着一定要使用网络的容器映射模式。然而，为什 么不能只启动第1个Pod 中的容器，而将第2个Pod 内的容器关联到第1个容器呢？我们认为 Kubernetes 从两个方面来考虑这个问题：首先，如果 Pod有超过两个容器的话，则连接这些容 器可能不容易；其次，后面的容器还要依赖第1个被关联的容器，如果第2个容器关联到第1 个容器，且第1个容器死掉的话，第2个也将死掉。启动一个基础容器，然后将Pod 内的所有 容器都连接到它上面会更容易一些。因为我们只需要为基础的这个 Google_containers/pause 容器 执行端口映射规则，这也简化了端口映射的过程。所以我们的Pod 的网络模型类似于图3.32。</p>
<p>Php-redis</p>
<p>80端口转发</p>
<p>C</p>
<p>pause</p>
<p>10.1.20.4</p>
<p>docKeFS</p>
<p>Node2</p>
<p>192.268%-30</p>
<p>剩分</p>
<p>图3.32 启动Pod 后网络模型</p>
<p>在这种情况下，实际 Pod 的IP 数据流的网络目标都是这个 g0ogle_containers/pause 容器。</p>
<p>图3.32 有点儿取巧地显示了是google _containers/pause 容器将端口80的流量转发给了相关的容 器。而 Pause 只是逻辑上的，并没有真的这么做。实际上另外的 Web 容器直接监听了这些端口， 和 google_containers/pause 容器共享了同一个网络堆栈。这就是为什么 Pod 内部实际容器的端口 映射都显示到g0ogle_containers/pause 容器上了。我们可以通过 docker port 命令来检验一下：</p>
<p># docker ps</p>
<p>CONTAINER ID</p>
<p>37b193a4c633</p>
<p>6d1b99cff4ae</p>
<p>IMAGE</p>
<p>kubeguide/example-guestbook-php-redis google_containers/pause:latest #</p>
<p># docker port 6dlb99cff4ae • 238</p>
<h2>第 252 页</h2>
<h3>第3章</h3>
<p>Kubernetes 核心原理</p>
<p>80/tcp -&gt; 0.0.0.0:80 综上所述，google_containers/pause 容器实际上只是负责接管这个 Pod 的 Endpoint，它实际 上并没有做更多的事情。那么 Node呢，它需要将数据流传给 google_containers/pause 容器吗？</p>
<p>我们来检查一下 Iptables 的规则，看看有什么发现：</p>
<p># iptables-save</p>
<p># Generated by iptables-save v1.4.21 on Thu Sep 24 17:15:01 2015 *nat</p>
<p>：PREROUTING ACCEPT ［0:0］</p>
<p>：INPUT ACCEPT ［0:0］ ：OUTPUT ACCEPT</p>
<p>［0:0］</p>
<p>：POSTROUTING ACCEPT ［0:0］ ：DOCKER - ［0:0］</p>
<p>：KUBE-NODEPORT-CONTAINER -［0:0］ ：KUBE-NODEPORT-HOST - ［0:0］ ：KUBE-PORTALS-CONTAINER - ［0:0］ ：KUBE-PORTALS-HOST - ［0:0］ -A PREROUTING -m comment --comment &quot;handle ClusterIPs; NOTE: this must be before the NodePort rules&quot; -j KUBE-PORTALS-CONTAINER -A PREROUTING -m addrtype --dst-type LOCAL -j DOCKER -A PREROUTING -m addrtype --dst-type LOCAL -m comment --comment &quot;handle service NodePorts; NOTE: this must be the last rule in the chain&quot; -j KUBE-NODEPORT-CONTAINER -A OUTPUT -m comment --comment &quot;handle ClusterIPs; NOTE: this must be before the NodePort rules&quot; -j KUBE-PORTALS-HOST -A OUTPUT ！ -d 127.0.0.0/8 -m addrtype --dst-type LOCAL -j DOCKER -A OUTPUT -m addrtype --dst-type LOCAL -m comment --comment &quot;handle service NodePorts; NOTE: this must be the last rule in the chain -A POSTROUTING -s 10.1.20.0/24 ！ -o docker0 -j MASQUERADE -A KUBE-PORTALS-CONTAINER -d 20.1.0.1/32 -p tcp -m comment --comment &quot;default/kubernetes：&quot; -m tcp --dport 443 -j REDIRECT --to-ports 60339 -A KUBE-PORTALS-HOST -d 20.1.0.1/32 -p tcp -m comment --comment &quot;default/kubernetes： &quot; -m tcp --dport 443 -j DNAT --to-destination 192.168.1.131:60339 COMMIT</p>
<p># Completed on Thu Sep 24 17:15:01 2015 # Generated by iptables-save v1.4.21 on Thu Sep 24 17:15:01 2015 ：INPUT ACCEPT［1131:377745］ ：FORWARD ACCEPT ［0:0］ ：OUTPUT ACCEPT［1246:209888］ ：DOCKER - ［0:0］</p>
<p>-A FORWARD -o dockerO -j DOCKER -A FORWARD -o docker0 -m conntrack --ctstate RELATED, ESTABLISHED -j ACCEPT -A FORWARD -i docker0 ！ -o docker0 -j ACCEPT -A FORWARD -i docker0 -o docker0 -j ACCEPT -A DOCKER -d 172.17.0.19/32！-i docker0 -o docker0 -p tcp -m tcp --dport 5000 -j ACCEPT</p>
<p>• 239•</p>
<h2>第 253 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） COMMIT</p>
<p># Completed on Thu Sep 24 17:15:01 2015 上面的这些规则并没有应用到我们刚刚定义的Pod。当然，Kubernetes 会给每一个Kubernetes 的节点提供一些默认的服务，上面的规则就是 Kubernetes 的默认服务需要的。关键是，我们没 有看到任何IP 伪装的规则，并且没有任何指向 Pod 10.1.20.4的内部方向的端口映射。</p>
<p>第2步：发布一个服务</p>
<p>我们已经了解了 Kubernetes 如何处理最基本的元素 Pod 的连接问题，接下来看一下它是如 何处理 Service 的。Service 允许我们在多个 Pod 之间抽象一些服务，而且，服务可以通过提供 在同一个 Service 的多个 Pod 之间的负载均衡机制来支持水平扩展。我们再次将环境初始化，删 除刚刚创建的 RC/Pod来确保集群是空的：</p>
<p># kubectl stop rc frontend replicationcontroller/frontend #</p>
<p># kubectl get rc</p>
<p>CONTROLLER</p>
<p>CONTAINER（S）</p>
<p>IMAGE （S）</p>
<p>SELECTOR REPLICAS</p>
<p>#</p>
<p>NAME</p>
<p># kubectl get services LABELS</p>
<p>kubernetes</p>
<p>component=apiserver,Provider=kubernetes SELECTOR IP （S）</p>
<p>&lt;none&gt;</p>
<p>PORT（S）</p>
<p>20.1.0.1</p>
<p>443/TCP</p>
<p># kubectl get pods NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS AGE</p>
<p>然后准备一个名称为 frontend 的 Service 配置文件：</p>
<p>apiVersion:v1</p>
<p>kind:Service</p>
<p>metadata：</p>
<p>name: frontend</p>
<p>labels：</p>
<p>name：</p>
<p>frontend</p>
<p>spec：</p>
<p>ports：</p>
<p>- port：</p>
<p>80</p>
<p>#</p>
<p>nodePort：</p>
<p>30001</p>
<p>selector：</p>
<p>name: frontend</p>
<p># type：</p>
<p>#</p>
<p>NodePort</p>
<p>然后在 Kubernetes 集群中定义这个服务：</p>
<p>• 240•</p>
<h2>第 254 页</h2>
<h3>第3章 Kubernetes 核心原理</h3>
<p># kubectl create -f services/frontend</p>
<p># kubectl get services frontend-service.yaml kubernetes</p>
<p>SELECTOR</p>
<p>name=frontend</p>
<p>component=apiserver,provider=kubernetes 20.1.244.75</p>
<p>PORT （S）</p>
<p>80/TCP</p>
<p>20.1.0.1</p>
<p>服务正确创建后，可以看到 Kubernetes 集群已经为这个服务分配了一个虚拟IP 地址 20.1.244.75，这个 IP 地址是在 Kubernetes 的 Portal Network 中分配的。而这个 Portal Network 的 地址范围则是我们在 Kubmaster 上启动 API 服务进程时，使用--service-cluster-ip-range=xx 命令 行参数指定的：</p>
<p># cat /etc/kubernetes/apiserver # Address range to use for services KUBE_SERVICE</p>
<p>_ADDRESSES=&quot;--service-cluster-ip-range=20.1.0.0/16&quot; 这个IP 段可以是任何段，只要不和dockero 或者物理网络的子网冲突就可以。选择任意其 他网段的原因是这个网段将不会在物理网络和docker0 网络上进行路由。这个 Portal Network 针 对每一个 Node 都有局部的特殊性，实际上它存在的意义是让容器的流量都指向默认网关（也 就是 dockero 网桥）。在继续实验前，先登录到 Nodel 上看一下我们定义服务后发生了什么变化。</p>
<p>首先检查一下 Iptables/Netfilter 的规则：</p>
<p># iptables-save</p>
<p>-A KUBE-PORTALS-CONTAINER -d 20.1.244.75/32 -P tcp -m comment --comment &quot;default/ frontend：&quot; -m tcp --dport 80 -j REDIRECT --to-ports 59528 -A KUBE-PORTALS-HOST -d 20.1.244.75/32 -P tcp -m comment --comment &quot;default/ kubernetes：&quot; -m tcp --dport 80 -j DNAT --to-destination 192.168.1.131:59528 第1行是挂在 PREROUTING 链上的端口重定向规则，所有的进流量如果满足 20.1.244.75:80，则都会被重定向到端口 33761。第2行是挂在 OUTPUT 链上的目标地址 NAT， 做了和上述第1行规则类似的工作，但针对的是当前主机生成的外出流量。所有主机生成的流 量都需要使用这个 DNAT 规则来处理。简而言之，这两个规则使用了不同的方式做了类似的事 情，就是将所有从节点生成的发送给20.1.244.75:80 的流量重定向到本地的33761 端口。</p>
<p>到此为止，目标为 Service IP 地址和端口的任何流量都将被重定向到本地的33761 端口。</p>
<p>这个端口连到哪里去了呢？这就到了 kube-proxy 发挥作用的地方了。这个kube-proxy 服务给每 一个新创建的服务关联了一个随机的端口号，并且监听那个特定的端口，为服务创建相关的负 载均衡对象。在我们的实验中，随机生成的端口刚好是 33761。通过监控 Nodel 上的 Kubernetes-Service 的日志，在创建服务时，我们可以看到下面的记录：</p>
<p>• 241•</p>
<h2>第 255 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 2612 proxier.go:413］ Opened iptables from-containers portal for service &quot;default/ frontend：&quot; on TCP 20.1.244.75:80 2612 proxier.go:424］ Opened iptables from-host portal for service &quot;default/ frontend：&quot; on TCP 20.1.244.75:80 现在我们知道，所有的流量都被导入 kube-proxy。现在我们需要它完成一些负载均衡的工 作。创建 Replication Controller 并观察结果，下面是 Replication Controller 的配置文件：</p>
<p>apiVersion: v1</p>
<p>kind: ReplicationController metadata：</p>
<p>name:frontend</p>
<p>labels：</p>
<p>name: frontend</p>
<p>spec：</p>
<p>replicas: 3</p>
<p>selector：</p>
<p>name: frontend</p>
<p>template：</p>
<p>metadata：</p>
<p>labels：</p>
<p>name:frontend</p>
<p>-name:php-redis</p>
<p>image: kubeguide/example-guestbook-php-redis -name: GET_HOSTS</p>
<p>#</p>
<p>- containerPort:80 hostPort: 80</p>
<p>在集群发布上述配置文件后，等待并观察，确保所有Pod都运行起来了：</p>
<p># kubectl create -f frontend-controller.yaml replicationcontrollers/frontend #</p>
<p># kubectl get pods -o wide NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS</p>
<p>AGE</p>
<p>NODE</p>
<p>frontend-64t8q</p>
<p>1/1</p>
<p>Running</p>
<p>5s</p>
<p>192.168.1.130</p>
<p>frontend-dzgve</p>
<p>1/1</p>
<p>Running</p>
<p>5s</p>
<p>192.168.1.131</p>
<p>frontend-x5dwy</p>
<p>1/1</p>
<p>Running</p>
<p>0</p>
<p>5s</p>
<p>192.168.1.129</p>
<p>现在所有的Pod都运行起来了，Service 将会对匹配到标签力“name=frontend”的所有Pod 进行负载分发。因 Service 的选择匹配所有的这些 Pod，所以我们的负载均衡将会对这3个 Pod 进行分发。现在我们做实验的环境如图 3.33所示。</p>
<p>• 242．</p>
<h2>第 256 页</h2>
<h3>第3章</h3>
<p>Kubernetes 核心原理</p>
<p>Frontend</p>
<p>10.1.10.5</p>
<p>dockerO</p>
<p>10:1.10.1</p>
<p>Kube:proxy</p>
<p>Node1</p>
<p>192.168.1.129</p>
<p>Kube master</p>
<p>192.168.1.129</p>
<p>Frontend</p>
<p>10.1.20.6</p>
<p>dockerO</p>
<p>10.1:2041</p>
<p>kube-proxy</p>
<p>Node2</p>
<p>192.168.1.130</p>
<p>Node3</p>
<p>192.168.1.131</p>
<p>［kube:proxy</p>
<p>dockerO</p>
<p>101.30.1</p>
<p>Frontend</p>
<p>10.1.30.8</p>
<p>图 3.33 启动服务后的结构</p>
<p>Kubernetes 的 kube-proxy 看起来只是一个夹层，但实际上它只是在Node上运行的一个服务。</p>
<p>上述重定向规则的结果就是针对目标地址为服务 IP 的流量，将 Kubernetes 的 kube-proxy 变成了 一个中间的夹层。</p>
<p>为了查看具体的重定向动作，我们会使用 tcpdump 来进行网络抓包操作。首先，安装 tcpdump：</p>
<p>yum -y install tcpdump 安装完成后，登录 Nodel，运行 tcpdump 命令：</p>
<p>tcpdump -nn -q -i eno16777736 port 80 需要捕获物理服务器以太网接口的数据包，Nodel 机器上的以太网接口名字叫作 eno16777736。</p>
<p>再打开第1个窗口运行第2个 tcpdump 程序，不过我们需要一些额外的信息去运行它，即 挂接在 dockero 桥上的虚拟网卡 Veth的名字。我们看到只有一个 frontend 容器在 Nodel 主机上 运行，所以可以使用简单的“ip addr”命令来查看唯一的“Veth”网络接口：</p>
<p># ip addr</p>
<p>1:1o：&lt;LOOPBACK, UP, LOWER_UP&gt; mtu 65536 qdisc noqueue state UNKNOWN link/1oopback 00:00:00:00:00:00 brd 00:00:00:00:00:00 inet 127.0.0.1/8 scope host 10 valid_lft forever preferred_lft forever inet6 ：：1/128 scope host valid_lft forever preferred_lft forever • 243•</p>
<h2>第 257 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 2:eno16777736：&lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 qdisc pfifo_fast state UP qlen 1000 link/ether 00:0c:29:47:6e:2c brd ff:ff:ff:ff:ff:ff inet 192.168.1.129/24 brd 192.168.1.255 scope global eno16777736 valid_lft forever preferred _lft forever</p>
<p>inet6 fe80：：20c:29ff:fe47:6e2c/64 scope link valid lft forever preferred lft forever</p>
<p>3:docker0：&lt;NO-CARRIER, BROADCAST,MULTICAST, UP&gt; mtu 1500 qdisc noqueue state DOWN link/ether 56:84:7a:fe:97:99 brd ff:ff:ff:ff:ff:ff inet 10.1.10.1/24 brd 10.1.10.255 scope global docker0 valid lft forever preferred _lft forever</p>
<p>inet6 fe80：：5484:7aff:fefe:9799/64 scope link valid_lft forever preferred_lft forever 12:veth0558bfa： &lt;BROADCAST,MULTICAST, UP, LOWER_UP&gt; mtu 1500 qdisc noqueue master dockerO state UP</p>
<p>1ink/ether 86:82:e5:c8:5a:9a brd ff:ff:ff:ff:ff:ff inet6 fe80：：8482:e5ff:fec8:5a9a/64 scope link</p>
<p>_lft forever</p>
<p>preferred</p>
<p>_lft forever</p>
<p>复制这个接口的名字，在第2个窗口中运行 tcpdump 命令。</p>
<p>tcpdump -nn -q -i veth0558bfa host 20.1.244.75 同时运行这两个命令，并且将窗口并排放置，以便同时看到两个窗口的输出：</p>
<p># tcpdump -nn -q -i eno16777736 port 80 tcpdump: verbose output suppressed, use -v or -vv for full protocol decode listening on eno16777736,1ink-type EN1OMB （Ethernet），capture size 65535 bytes #tcpdump -nn -q -i veth0558bfa host 20.1.244.75 tcpdump: verbose output suppressed, use -V Or</p>
<p>-v for full protocol decode 1istening on veth0558bfa,link-type EN10MB （Ethernet），capture size 65535 bytes 好了，我们已经在同时捕获两个接口的网络包了。这时再启动第3个窗口，运行一个“docker exec”命令来连接到我们的“frontend” 的容器内部（你可以先执行 docker ps 来获得这个容器的 ID）：</p>
<p>#docker ps</p>
<p>CONTAINER ID</p>
<p>268ccdfb9524</p>
<p>6a519772b27e</p>
<p>IMAGE</p>
<p>kubeguide/example-guestbook-php-redis google_containers/pause:latest 执行命令进入容器内部：</p>
<p>#docker exec -it 268ccdfb9524 bash # docker exec -it 268ccdfb9524 bash root@frontend-x5dwy: /# 一旦进入运行的容器内部，我们就可以通过Pod 的IP 地址来访问服务了。使用curl来尝试 访问服务：</p>
<p>curl</p>
<p>20.1.244.75</p>
<p>• 244•</p>
<h2>第 258 页</h2>
<h3>第3章</h3>
<p>Kubernetes 核心原理</p>
<p>在使用curl 访问服务时，将在抓包的两个窗口内看到：</p>
<p>20:19:45.208948</p>
<p>IP 192.168.1.129.57452 &gt; 10.1.30.8.8080:tcp 0 20:19:45.209005 IP 10.1.30.8.8080 &gt;192.168.1.129.57452:tcp 0 20:19:45.209013 IP 192.168.1.129.57452 &gt; 10.1.30.8.8080:tcp 0 20:19:45.209066</p>
<p>IP 10.1.30.8.8080 &gt; 192.168.1.129.57452:tcp 0 20:19:45.209227 IP 10.1.10.5.35225 &gt; 20.1.244.75.80:tcp 0 20:19:45.209234 IP 20.1.244.75.80 &gt; 10.1.10.5.35225:tcp 0 20:19:45.209280 IP 10.1.10.5.35225 &gt; 20.1.244.75.80:tcp 0 20:19:45.209336 IP 20.1.244.75.80 &gt; 10.1.10.5.35225:tcp 0 这些信息说明了什么问题呢？让我们在网络图上用实线标出第1个窗口中网络抓包信息的 含义（物理网卡上的网络流量），并用虚线标出第2个窗口中网络抓包信息的含义（docker0 网 桥上的网络流量），如图3.34所示。</p>
<p>Frontend</p>
<p>10.1.10.5</p>
<p>dockero</p>
<p>LKube-proxy」</p>
<p>Node1</p>
<p>192.168.1.129</p>
<p>Kube master</p>
<p>192.168.1.129</p>
<p>Frontend</p>
<p>10.1.20.6</p>
<p>docker0</p>
<p>40420</p>
<p>kube-proxy</p>
<p>Node2</p>
<p>192.168.1.130</p>
<p>Node3</p>
<p>492.168.1.131</p>
<p>Lkube:proxy</p>
<p>cocker.</p>
<p>Frontend</p>
<p>10.1.30.8</p>
<p>图3.34 数据流动情况图1</p>
<p>注意，图3.34中，虚线绕过了 Node3的kube-proxy，这么做是因为 Node3 上的 kube-proxy 没有参与这次网络交互。换句话说，Nodel 的 kube-proxy 服务直接和负载均衡到的Pod进行网 络交互。</p>
<p>在查看第2个捕获包的窗口时，我们能够站在容器的视角看这些流量。首先，容器尝试使 用 20.1.244.75:80 打开TCP 的 Socket 连接。同时，我们还可以看到从服务地址 20.1.244.75返回 的数据。从容器的视角来看，整个交互过程都是在服务之间进行的。但是在查看一个捕获包的 窗口时（上面的窗口），我们可以看到物理机之间的数据交互，可以看到一个 TCP 连接从Nodel 的物理地址（192.168.1.129）发出，直接连接到运行 Pod 的主机 Node3（192.168.1.131）。总而 言之，Kubernetes 的kube-proxy 作一个全功能的代理服务器管理了两个独立的TCP连接：一 • 245•</p>
<h2>第 259 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 个是从容器到 kube-proxy：另一个是从 kube-proxy 到负载均衡的目标 Pod。</p>
<p>如果我们清理一下捕获的记录，再次运行curl，则还可以看到网络流量被负载均衡转发到 另一个节点 Node2 上了。</p>
<p>20:19:45.208948 IP 192.168.1.129.57485 &gt; 10.1.20.6.8080:tcp 0 20:19:45.209005 IP 10.1.20.6.8080 &gt; 192.168.1.129.57485:tcp 0 20:19:45.209013 IP 192.168.1.129.57485 &gt;10.1.20.6.8080:tcp 0 20:19:45.209066 IP 10.1.20.6.8080 &gt;192.168.1.129.57485:tcp 0 20:19:45.209227 IP 10.1.10.5.38026 &gt;20.1.244.75.80:tcp 0 20:19:45.209234 IP 20.1.244.75.80 &gt;10.1.10.5.38026:tcp 0 20:19:45.209280 IP 10.1.10.5.38026&gt; 20.1.244.75.80: tcp 0 20:19:45.209336</p>
<p>IP 20.1.244.75.80 &gt; 10.1.10.5.38026: tcp 0 这一次，Kubernetes 的 Proxy 将选择运行在 Node2 （10.1.20.1）上面的Pod 作负载均衡的 目的。网络流动图如图3.35所示。</p>
<p>Frontend</p>
<p>10.1.10.5</p>
<p>docker0</p>
<p>10.1:4001</p>
<p>NOdei</p>
<p>192.168.1.129</p>
<p>Kube master</p>
<p>192.168.1.129</p>
<p>Frontend</p>
<p>10.1.20.6</p>
<p>Tockero</p>
<p>10:1203</p>
<p>Kube: proxy］</p>
<p>Node2</p>
<p>192.168.1.130</p>
<p>Node3</p>
<p>192.168.1.131</p>
<p>kube:proxy</p>
<p>dockere</p>
<p>101.30.</p>
<p>Frontend</p>
<p>10.1.30.8</p>
<p>图 3.35 数据流动情况图2</p>
<p>到这里，你肯定已经知道另外一个可能的负载均衡的路由结果了吧。</p>
<p>• 246•</p>
</div>
