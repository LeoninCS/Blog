---
title: "第5章 Kubernetes 运维指南"
description: "第5章 Kubernetes 运维指南 为了让容器应用在 Kubernetes 集群中运行得更加有效，对 Kubernetes 集群本身也需要进 行相应的配置和管理。本章将从 Kubernetes 集群管理、高级案例及 Trouble Shooting 等方面对 Kubernetes 集群的运维和查错进行详细说明，最后对 Kubernetes 1.3版本开发"
sourceUrl: "授权 PDF：Kubernetes权威指南：从Docker到Kubernetes实践全接触（第2版).pdf，页 305-408"
workSlug: "kubernetes-authoritative-guide-2nd"
workTitle: "Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第 2 版）"
chapterSlug: "005-第5章-kubernetes-运维指南"
order: 5
categories: ["云原生", "Kubernetes"]
tags: ["Kubernetes", "Docker", "容器", "集群管理"]
---
<div class="imported-document imported-pdf-document">
<h2>第5章 Kubernetes 运维指南</h2>
<h2>第 305 页</h2>
<h3>第5章</h3>
<p>Kubernetes 运维指南</p>
<p>为了让容器应用在 Kubernetes 集群中运行得更加有效，对 Kubernetes 集群本身也需要进 行相应的配置和管理。本章将从 Kubernetes 集群管理、高级案例及 Trouble Shooting 等方面对 Kubernetes 集群的运维和查错进行详细说明，最后对 Kubernetes 1.3版本开发中的新功能进行 介绍。</p>
<p>5.1</p>
<p>Kubernetes 集群管理指南</p>
<p>本节将从 Node 的管理、Label 的管理、Namespace 资源共享、资源配额管理、集群 Master 高可用及集群监控等方面，对 Kubemetes 集群本身的运维管理进行详细说明。</p>
<h3>5.1.1 Node 的管理</h3>
<p>1. Node 的隔离与恢复</p>
<p>在硬件升级、硬件维护等情况下，我们需要将某些 Node 进行隔离，脱离 Kubernetes 集群 的调度范围。Kubemnetes 提供了一种机制，既可以将 Node 纳入调度范围，也可以将 Node 脱离 调度范围。</p>
<p>创建配置文件 unschedule _node.yaml，在 spec 部分指定 unschedulable 为 true：</p>
<p>apiVersion:v1</p>
<p>kind: Node</p>
<p>metadata：</p>
<h2>第 306 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>name:k8s-node-1</p>
<p>labels：</p>
<p>kubernetes.io/hostname: k8s-node-1 spec：</p>
<p>unschedulable: true 然后，通过 kubectl replace 命令完成对Node 状态的修改：</p>
<p>$ kubect1 replace -f unschedule_node.yaml node &quot;k8s-node-1&quot; replaced 查看 Node 的状态，可以观察到在 Node 的状态中增加了一项 SchedulingDisabled：</p>
<p># kubect1 get nodes NAME</p>
<p>STATUS</p>
<p>AGE</p>
<p>k8s-node-1</p>
<p>Ready, SchedulingDisabled 对于后续创建的Pod，系统将不会再向该Node 进行调度。</p>
<p>也可以不使用配置文件，直接使用kubectl patch 命令完成：</p>
<p>$ kubect1 patch node k8s-node-1 -P &#x27;｛&quot;spec&quot;：｛&quot;unschedulable&quot;：true｝）&#x27; 需要注意的是，将某个 Node 脱离调度范围时，在其上运行的Pod 并不会自动停止，管理 员需要手动停止在该 Node 上运行的 Pod。</p>
<p>同样，如果需要将某个 Node 重新纳入集群调度范围，则将 unschedulable设置 false，再 次执行 kubectl replace 或 kubectl patch 命令就能恢复系统对该Node 的调度。</p>
<p>在 Kubernetes 当前的版本中，kubectl 的子命令 cordon 和 uncordon 也用于实现将 Node 进行 隔离和恢复调度的操作。</p>
<p>例如，使用 kubectl cordon &lt;node_name&gt;对某个 Node 进行隔离调度操作：</p>
<p># kubectl cordon k8s-node-1 node &quot;k8s-node-1&quot; cordoned # kubect1</p>
<p>get nodes</p>
<p>NAME</p>
<p>STATUS</p>
<p>k8s-node-1</p>
<p>Ready,SchedulingDisabled AGE</p>
<p>1h</p>
<p>使用 kubectl uncordon &lt;node_name&gt;对某个 Node 进行恢复调度操作：</p>
<p># kubect1 uncordon kas-node-1 node &quot;k8s-node-1&quot; uncordoned # kubect1 get nodes NAME</p>
<p>STATUS</p>
<p>k8s-node-1</p>
<p>Ready</p>
<p>AGE</p>
<p>1h</p>
<p>• 293•</p>
<h2>第 307 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 2. Node 的扩容</p>
<p>在实际生产系统中会经常遇到服务器容量不足的情况，这时就需要购买新的服务器，然后 将应用系统进行水平扩展来完成对系统的扩容。</p>
<p>在 Kubernetes 集群中，一个新 Node 的加入是非常简单的。在新的 Node 节点上安装 Docker、 kubelet 和 kube-proxy 服务，然后配置 kubelet 和 kube-proxy 的启动参数，将 Master URL 指定》 当前 Kubernetes 集群 Master 的地址，最后启动这些服务。通过 kubelet 默认的自动注册机制， 新的Node 将会自动加入现有的 Kubernetes 集群中，如图5.1 所示。</p>
<p>Kubernetes</p>
<p>Master</p>
<p>新节点粉魚己</p>
<p>自动注册给master</p>
<p>Node</p>
<p>--epi_servers=http:// kubemaster:8080</p>
<p>Node</p>
<p>Kubernetes樂料</p>
<p>Node</p>
<p>Node</p>
<p>Node</p>
<p>图5.1 新节点自动注册完成扩容</p>
<p>Kubernetes Master 在接受了新 Node 的注册之后，会自动将其纳入当前集群的调度范围内， 在之后创建容器时，就可以向新的Node 进行调度了。</p>
<p>通过这种机制，Kubernetes 实现了集群中 Node 的扩容。</p>
<h3>5.1.2 更新资源对象的 Label</h3>
<p>—</p>
<p>Label（标签）作为用户可灵活定义的对象属性，在正在运行的资源对象上，仍然可以随时 通过 kubectl label 命令对其进行增加、修改、删除等操作。</p>
<p>例如，我们要给已创建的 Pod “redis-master-bobro”添加一个标签 role=backend：</p>
<p>$ kubectl label pod redis-master-bobr0 role=backend pod &quot;redis-master-bobro&quot; labeled 查看该Pod 的 Label：</p>
<p>f kubectl get pods -Lrole • 294•</p>
<h2>第 308 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>NAME</p>
<p>READY</p>
<p>STATUS RESTARTS AGE ROLE</p>
<p>redis-master-bobr0 1/1</p>
<p>Running0</p>
<p>3m</p>
<p>backend</p>
<p>删除一个 Label 时，只需在命令行最后指定 Label 的key 名并与一个减号相连即可：</p>
<p>$ kubect1 label pod redis-master-bobr0 role- pod &quot;redis-master-bobro&quot; labeled 修改一个 Label 的值时，需要加上-overwrite 参数：</p>
<p>s kubectl label pod redis-master-bobr0 role=master --overwrite pod &quot;redis-master-bobr0&quot;labeled</p>
<h3>5.1.3 Namespace：集群环境共享与隔离</h3>
<p>在一个组织内部，不同的工作组可以在同一个 Kubernetes 集群中工作，Kubernetes 通过命 名空间和 Context 的设置来对不同的工作组进行区分，使得它们既可以共享同一个 Kubernetes 集群的服务，也能够互不干扰，如图5.2所示。</p>
<p>Namespace: Dev</p>
<p>Namespace: Prod</p>
<p>图5.2 集群环境共享和隔离</p>
<p>假设在我们的组织中有两个工作组：开发组和生产运维组。开发组在 Kubernetes 集群中需 要不断创建、修改、删除各种 Pod、RC、Service 等资源对象，以便实现敏捷开发的过程。而生 产运维组则需要使用严格的权限设置来确保生产系统中的Pod、RC、Service 处于正常运行状态 且不会被误操作。</p>
<p>1. 创建 namespace</p>
<p>为了在 Kubernetes 集群中实现这两个分组，首先需要创建两个命名空间。</p>
<p>namespace-development.yaml：</p>
<p>apiVersion: v1</p>
<p>• 295•</p>
<h2>第 309 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） kind: Namespace</p>
<p>metadata：</p>
<p>name:development</p>
<p>namespace-production.yaml：</p>
<p>apiVersion: v1</p>
<p>kind: Namespace</p>
<p>metadata：</p>
<p>name: production</p>
<p>使用 kubectl create 命令完成命名空间的创建：</p>
<p>s kubectl create -f namespace-development.yaml namespaces/development $ kubectl create -f namespace-production.yaml namespaces/production 查看系统中的命名空间：</p>
<p>$ kubectl get namespaces NAME</p>
<p>LABELS</p>
<p>STATUS</p>
<p>default</p>
<p>&lt;none&gt;</p>
<p>Active</p>
<p>development</p>
<p>name=development</p>
<p>Active</p>
<p>production</p>
<p>name=production</p>
<p>Active</p>
<p>2. 定义 Context（运行环境） 接下来，需要这两个工作组分别定义一个 Context，即运行环境。这个运行环境将属于某 个特定的命名空间。</p>
<p>通过 kubectl config set-context 命令定义 Context，并将 Context 置于之前创建的命名空间中：</p>
<p>$ kubectl config set-cluster kubernetes-cluster --server=https://192.168.1.</p>
<p>128:8080</p>
<p>$ kubectl config set-context ctx-dev --namespace=development --cluster=kubernetes- Cluster --user=dev $ kubect1 config set-context ctx-prod --namespace=production --cluster=kubernetes- cluster --user=prod 使用 kubectl config view 命令查看已定义的 Context：</p>
<p>s kubectl config view apiVersion: v1</p>
<p>clusters：</p>
<p>server: http://192.168.1.128:8080 name: kubernetes-cluster contexts：</p>
<p>- context：</p>
<p>• 296•</p>
<h2>第 310 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>cluster: kubernetes-cluster namespace: development name:ctx-dev</p>
<p>- context：</p>
<p>cluster:kubernetes-cluster namespace:production name:ctx-prod</p>
<p>current-context: ctx-dev kind: Config</p>
<p>preferences：｛｝</p>
<p>users： ［］</p>
<p>注意，通过 kubectl config 命令在$｛HOME｝/.kube 目录下生成了一个名为 config的文件，文 件内容即以 kubectl config view 命令查看到的内容。所以，也可以通过手工编辑该文件的方式来 设置 Context。</p>
<p>3. 设置工作组在特定 Context 环境中工作 使用 kubectl config use-context &lt;context_name~命令来设置当前的运行环境。</p>
<p>下面的命令将把当前运行环境设置为 “ctx-dev”：</p>
<p>$ kubect1 config use-context ctx-dev 通过这个命令，当前的运行环境即被设置为开发组所需的环境。之后的所有操作都将在名 为“development”的命名空间中完成。</p>
<p>现在，以 redis-slave RC 为例创建两个 Pod：</p>
<p>redis-slave-controller.yaml apiVersion: vl</p>
<p>kind: ReplicationController metadata：</p>
<p>name：</p>
<p>redis-slave</p>
<p>labels：</p>
<p>name: redis-slave</p>
<p>spec：</p>
<p>replicas: 2</p>
<p>selector：</p>
<p>name: redis-slave</p>
<p>template：</p>
<p>metadata：</p>
<p>labels：</p>
<p>name: redis-slave</p>
<p>spec：</p>
<p>containers：</p>
<p>- name: slave</p>
<p>• 297•</p>
<h2>第 311 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） image: kubeguide/guestbook-redis-slave ports：</p>
<p>- containerPort:6379 $ kubectl create -f redis-slave-controller.yaml replicationcontrollers/redis-slave 查看创建好的 Pod：</p>
<p>$ kubectl get pods READY</p>
<p>STATUS RESTARTS AGE redis-slave-0feq9</p>
<p>Running</p>
<p>redis-slave-6i0g4</p>
<p>Running</p>
<p>可以看到容器被正确创建并运行起来了。而且，由于当前的运行环境是 ctx-dev，所以不会 影响到生产运维组的工作。</p>
<p>让我们切换到生产运维组的运行环境：</p>
<p>$ kubectl config use-context ctx-prod 查看RC和Pod：</p>
<p>s kubectl get rc</p>
<p>CONTROLLER</p>
<p>CONTAINER （S） IMAGE （S） SELECTOR REPLICAS</p>
<p>$ kubectl get pods READY</p>
<p>STATUS</p>
<p>RESTARTS AGE</p>
<p>结果空，说明看不到开发组创建的RC 和Pod。</p>
<p>现在我们为生产运维组也创建两个 redis-slave 的 Pod：</p>
<p>s kubectl create -f redis-slave-controller.yaml replicationcontrollers/redis-slave 查看创建好的 Pod：</p>
<p>$ kubectl get pods NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS AGE，</p>
<p>redis-slave-a4m7s</p>
<p>1/1</p>
<p>Running</p>
<p>redis-slave-xyrkk</p>
<p>1/1</p>
<p>Running</p>
<p>00</p>
<p>12s</p>
<p>12s</p>
<p>可以看到容器被正确创建并运行起来了，并且当前的运行环境是 ctx-prod，也不会影响开 发组的工作。</p>
<p>至此，我们为两个工作组分别设置了两个运行环境，在设置好当前的运行环境时，各工作 组之间的工作将不会相互干扰，并且它们都能够在同一个 Kubernetes 集群中同时工作。</p>
<p>• 298•</p>
<h2>第 312 页</h2>
<h3>第5章</h3>
<p>Kubernetes 运维指南</p>
<h3>5.1.4 Kubernetes 资源管理</h3>
<p>本章从计算资源管理 （Compute Resources）、资源配置范围管理 （LimitRange）、服务质量 管理（QoS）及资源配额管理（ResourceQuota）等方面，对 Kubernetes 集群内的资源管理进行 详细说明，结合实践操作、常见问题分析和一个完整的示例，对 Kubernetes 集群资源管理相关 的运维工作提供指导。</p>
<p>1. 计算资源管理（Compute Resources） 在配置Pod 的时候，我们可以为其中的每个容器指定需要使用的计算资源（CPU 和内存）。</p>
<p>计算资源的配置项分为两种：一种是资源请求 （Resource Requests，简称 Requests），表示 容器希望被分配到的、可完全保证的资源量，Requests 的值会提供给 Kubernetes 调度器 （Kubernetes Scheduler）以便于优化基于资源请求的容器调度；另外一种是资源限制 （Resource Limits，简称 Limits），Limits 是容器最多能使用到的资源量的上限，这个上限值会影响节点上 发生资源竞争时的解决策略。</p>
<p>当前版本的 Kubernetes 中，计算资源的资源类型分为两种：CPU 和内存（Memory）。这两 种资源类型都有一个基本单位：对于CPU 而言，基本单位是核心数（Cores）；而内存的基本单 位是字节数（Bytes）。CPU 和内存一起构成了目前Kubernetes 中的计算资源（也可简称为资源）。</p>
<p>计算资源是可计量的，能被申请、分配和使用的基础资源，这使之区别于 API 资源（API Resources，例如 Pod 和 services 等）。</p>
<p>1） Pod 和容器的 Requests 和 Limits Pod 中的每个容器都可以配置以下4个参数。</p>
<p>spec.containerll.resources.requests.cpu。</p>
<p>◎ spec.containerll.resources.limits.cpu.</p>
<p>© spec.container］.resources.requests.memory。</p>
<p>s spec.container［］.resources.limits.memory。</p>
<p>这四个参数分别对应容器的CPU 和内存的 Requests 和 Limits，它们具有以下特点。</p>
<p>Requests 和 Limits 都是可选的。在某些集群中如果在 Pod 创建或者更新的时候，没设 置资源限制或者资源请求值，那么可能会使用系统提供一个默认值，这个默认值取决 于集群的配置。</p>
<p>◎ 如果 Request 没有配置，那么默认会被设置为等于 Limits。</p>
<p>• 299•</p>
<h2>第 313 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） ◎ 而任何情况下 Limits 都应该设置大于或者等于 Requests。</p>
<p>以 CPU 为例，图5.3 显示了未设置 CPU Limits 和设置 CPU Limits 的CPU 使用率的区别。</p>
<p>未设置CPU Limits的CPU使用率 设置了CPU Requests和CPU Limits 的CPU使用率</p>
<p>CPU Limits: 0.8C</p>
<p>100%</p>
<p>8</p>
<p>80</p>
<p>70</p>
<p>60</p>
<p>40</p>
<p>30</p>
<p>100%</p>
<p>8</p>
<p>70</p>
<p>∞</p>
<p>台0</p>
<p>3</p>
<p>20m</p>
<p>PL Requeate:02c</p>
<p>图5.3 未设置和设置了CPU Limits 的CPU 使用率样例 尽管 Requests 和 Limits 只能设置到容器上，但是设置Pod级别的 Requests 和 Limits 能极大 程度上提高我们对Pod 管理的便利性和灵活性，因此 Kubernetes 中提供对 Pod 级别的 Requests 和Limits 配置。对于CPU和内存而言，Pod的Requests 或Limits 是指该Pod中所有容器的Requests 或 Limits 的总和（Pod 中没设置 Request 或 Limits 的容器，该项的值被当作0或者按照集群配 置的默认值来计算）。下面对 CPU 和内存这两种计算资源各自的特点进行说明。</p>
<p>（1） CPU</p>
<p>CPU 的 Requests 和 Limits 是通过CPU 数 （cpus）来度量的。CPU 资源值支持最多三位小 数：如果一个容器的 spec.container［］.resources.requests.cpu 设置为 0.5，那么它会获得半个 CPU；</p>
<p>同理如果设置1，就会获得1个CPU。0.ICPU等价于 100m CPU（100 millicpu），而在 Kubernetes API 中自动将这种小数0.1 转化100m，因此 CPU 的小数最多支持三位数字，而 Kubernetes 官方也更推荐直接使用形如100m的 millicpu作为计量单位。</p>
<p>CPU 资源值是绝对值，而不是相对值：比如 0.1CPU 不管是在单核或者多核机器上都是一 样的，都严格等于 0.1 CPU core。</p>
<p>（2） 内存（Memory）</p>
<p>内存的 Requests 和 Limits 计量单位是字节数（Bytes）。内存值用使用整数或者定点整数加 上国际单位制（International System of Units）来表示。国际单位制包括十进制的E、P、T、G、 M、K、m，或二进制的Ei、Pi、Ti、Gi、Mi、Ki。比如：KiB 与 MiB 是二进制表示的字节单 位，而常见的 KB与 MB 则是十进制表示的字节单位。两种方式的区别举例说明如下：</p>
<p>1 KB（kilobyte） = 1000 bytes =8000 bits 1 KiB（kibibyte） =2^10 bytes = 1024 bytes = 8192 bits • 300•</p>
<h2>第 314 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>因此，下面几种内存配置的意思是一样的：128974848、129e6、129M、123Mi Kuberetes 的计算资源单位是大小写敏感的，因为 m 可以表示千分之一单位（milli unit），而 M可以表示十进制的1000，两者的含义不同；同理可知，小写的k不是一个合法的资源单位。</p>
<p>以一个 Pod 中的资源配置例：</p>
<p>apiVersion: v1</p>
<p>kind: Pod</p>
<p>metadata：</p>
<p>name:frontend</p>
<p>spec：</p>
<p>containers：</p>
<p>- name:db</p>
<p>image: mysql</p>
<p>resources：</p>
<p>requests：</p>
<p>memory：&quot;64Mi&quot;</p>
<p>cpu：&quot;250m&quot;</p>
<p>1imits：</p>
<p>memory ：&quot;128Mi&quot;</p>
<p>cpu：&quot;500m&quot;</p>
<p>- name:wP</p>
<p>image: wordpress</p>
<p>resources：</p>
<p>requests：</p>
<p>memory：&quot;64Mi&quot;</p>
<p>最新网络工程师资料</p>
<p>www.wlgcs.cn</p>
<p>cpu： &quot;250m&quot;</p>
<p>1imits：</p>
<p>memory：&quot;128Mi&quot;</p>
<p>cpu：&quot;500m&quot;</p>
<p>该Pod 包含两个容器，每个容器配置的 Requests 都是 0.25 CPU 和 64MiB （220 bytes）内存， 而配置的Limits 都是0.5 CPU 和 128MiB （22 bytes）内存。</p>
<p>这个 Pod 的 Requests 和 Limits 等于Pod 中所有容器对应配置的总和，所以 Pod 的 Requests 是 0.5 CPU 和 128MiB（227 bytes）内存，Limits 是 1 CPU 和256MiB （228 bytes）内存。</p>
<p>2） 基于 Requests 和 Limits 的Pod 调度机制 当一个Pod 创建成功时，Kubernetes 调度器 （Scheduler） 为该Pod 选择一个节点 （Node） 来执行。对于每种计算资源（CPU 和内存）而言，每个节点都有一个能用于运行Pod 的最大容 量值。调度器在调度时，首先要确保调度后该节点上所有 Pod 的 CPU 和内存的Requests 总和 不能超过该节点能提供给Pod使用的CPU 和内存的最大容量值。</p>
<p>例如某个节点上 CPU 资源充足，而内存为4GB，其中3GB 可以运行Pod，某Pod 的内存 • 301•</p>
<h2>第 315 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） Requests 为 1GB、Limits 为2GB，那么这个节点上最多可运行3个这种Pod。</p>
<p>这里需要注意的是：可能某些节点上的实际资源使用量非常低，但是如果该节点上已运行 Pod 配置的 Requests 值的总和已经非常高，再加上需要调度的Pod 的 Requests 值会直接超过该 节点提供给Pod 的资源容量上限，Kubernetes 仍然不会将Pod 调度到这个节点上。这是因为如 果 Kubernetes 将Pod 调度到该节点上，那么如果后面该节点上运行的Pod 面临服务峰值等情况， 可能会导致Pod 资源短缺的情况发生。</p>
<p>接着上面的例子，假设该节点已经启动3个Pod 实例，而这3个Pod 的实际内存使用都不 足 500MB，那么理论上该节点的可用内存应该大于 1.5GB，但是由于该节点的 Pod Requests 总 和已经等于节点的可用内存上限，因此 Kuberetes 不会再将任何 Pod 实例调度到该节点上执行。</p>
<p>3） Requests 和 Limits 资源配置机制 当 kubelet 启动Pod 的一个容器时，它会将容器的 Requests 和 Limits 值转化为相应的容器 启动参数传递给容器执行器（Docker 或者是 rkt）。</p>
<p>如果容器的执行环境是 Docker，那么容器的4个参数是这样传递给 Docker 的。</p>
<p>（1） spec.container［］.resources.requests.cpu 这个参数会转化为 core 数（比如配置的100m会转化力 0.1），然后乘以1024，再将这个结 果作 --cpu-shares 参数的值传递给 docker run 命令。在 docker run 命令中，--cpu-share 参数是一 个相对权重值（Relative Weight），这个相对权重值会决定 Docker 在资源竞争时分配给容器的资 源比例。举例说明--cpu-shares 参数在 Docker 中的含义：比如两个容器的 CPU Requests 分别设 置为1和2，那么容器在 docker run 启动时对应的--cpu-shares 参数值分别 1024 和 2048，在主 机CPU 资源产生竞争时，Docker 会尝试按照1:2的配比将 CPU 资源分配给这两个容器使用。</p>
<p>这里需要区分清楚的是：这个参数对于 Kubernetes 而言是绝对值，主要用于 Kubernetes 调 度和管理的依据（参见下文 QoS 章节）：同时这个参数值会设置 --cpu-shares 参数传递给 Docker， --cpu-shares 参数对于 Docker 而言又是相对值，主要用于资源分配比例。这两种用途的 作用范围不同，所以并不会发生冲突。</p>
<p>（2） spec.container［］.resources.limits.cpu 这个参数会转化 millicore 数（比如配置的1会转化为1000，而配置的100m转化力100）， 将此值乘以 100000，再除以 1000，然后将结果值作为--cpu-quota 参数的值传递给 docker run 命 令。docker run 命令中另外一个参数--cpu-period 默认设置100000，表示 Docker 重新计量和分 配CPU 的使用时间间隔 100000微秒（100毫秒）。</p>
<p>Docker 的--cpu-quota 参数和--cpu-period 参数一起配合完成对容器CPU 的使用限制：比如 Kubernetes 中配置容器的 CPU Limits 为0.1，那么计算后--cpu-quota 10000，而--cpu-period • 302</p>
<h2>第 316 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>为100000，这意味着 Docker 在100毫秒内最多给该容器分配10毫秒*core 的计算资源用量， 10/100=0.1 core 的结果与 Kubernetes 配置的意义是一致的。</p>
<p>注意：如果 kubelet 启动参数--cpu-cfs-quota 设置次 true，那么 kubelet 会强制要求所有 Pod 都必须配置 CPU Limits（如果 Pod 没配置，而集群提供了默认配置也可以）。而从 Kubernetes 1.2 版本开始，这个--cpu-cfs-quota 启动参数的默认值就是 true。</p>
<p>（3） spec.container［］.resources.requests.memory 这个参数值只提供给 Kubernetes 调度器（Kubernetes Scheduler）作为调度和管理的依据， 不会作任何参数传递给 Docker。</p>
<p>（4） spec.container［］.resources.limits.memory 这个参数值会转化为单位为 bytes 的整数，数值会作 -memory 参数传递给 docker run 命令。</p>
<p>如果一个容器在运行过程中使用了超出了其内存Limits 配置的内存限制值，那么它可能会 被“杀掉”，如果这个容器是一个可重启的容器，那么之后它会被 kubelet 重新启动起来。因此 容器的Limits 配置需要进行准确的测试和评估。</p>
<p>与内存Limits 不同的是CPU 在容器技术中属于可压缩资源，因此对于 CPU 的 Limits 配置 一般不会引发因偶然超标使用而导致容器被系统“杀掉”的情况。</p>
<p>4）计算资源使用情况监控</p>
<p>Pod 的资源用量会作为Pod 的状态信息一同上报给 Master。如果集群中配置了 Heapster 来 监控集群的性能数据，那么还可以从 Heapster 中查看Pod 的资源用量信息。</p>
<p>5）计算资源相关常见问题分析</p>
<p>（1） Pod 状态力 pending，错误信息为 FailedScheduling。</p>
<p>如果 Kubernetes 调度器（Kubernetes Scheduler）在集群中找不到合适的节点来运行 Pod， 那么这个Pod 会一直处于未调度状态，直到调度器找到合适的节点为止。每次调度器尝试调度 失败，Kubernetes 都会产生一个事件（event），我们可以通过下面这种方式来查看事件的信息：</p>
<p>s kubectl describe pod frontend | grep -A 3 Events Events：</p>
<p>FirstSeen</p>
<p>LastSeen</p>
<p>Count</p>
<p>From</p>
<p>36s</p>
<p>53</p>
<p>6</p>
<p>｛scheduler ｝</p>
<p>Subobject</p>
<p>PathReason</p>
<p>FailedScheduling Failed for reason Message</p>
<p>PodExceedsFreeCPU and possibly others 在上面这个例子中，名 frontend 的 Pod 由于节点的 CPU 资源不足而调度失败 （PodExceedsFreeCPU），同样，如果内存不足也可能导致调度失败（PodExceedsFreeMemory）。</p>
<p>如果一个或者多个Pod调度失败且有这类错误，那么我们可以尝试以下几种解决方法。</p>
<p>• 303•</p>
<h2>第 317 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 添加更多的节点到集群中。</p>
<p>• 停止一些不必要的运行中的Pod，释放资源。</p>
<p>检查 Pod 的配置，错误的配置可能导致该Pod 永远都无法被调度执行。比如如果整个 集群中所有节点都只有1 CPU，而Pod 配置的 CPU Requests 为2，那么该Pod 就不会 被调度执行。</p>
<p>我们可以使用 kubectl describe nodes 命令来查看集群中节点的计算资源容量和已使用量：</p>
<p>$ kubectl describe nodes k8s-node-1 Name：</p>
<p>k8s-node-1</p>
<p>Capacity：</p>
<p>CPU：</p>
<p>1</p>
<p>memory：</p>
<p>464Mi</p>
<p>pods：</p>
<p>40</p>
<p>Allocated resources （total requests）：</p>
<p>CPu：</p>
<p>910m</p>
<p>memory：</p>
<p>2370Mi</p>
<p>pods：</p>
<p>4</p>
<p>Pods：</p>
<p>Namespace</p>
<p>（4 in total）</p>
<p>Name</p>
<p>Memory （bytes）</p>
<p>frontend</p>
<p>webserver-ffj8j</p>
<p>2097152000（50%</p>
<p>of total）</p>
<p>kube-system</p>
<p>fluentd-cloud-logging-k8s-node-1 209715200 （5% of total） kube-system</p>
<p>kube-dns-v8-gopgw</p>
<p>178257920（48 of total） TotalResourceLimits：</p>
<p>CPU （mi11iCPU）：</p>
<p>Memory （bytes）：</p>
<p>910 （91% of total） 2485125120 （598 of total） CPU（mi11iCPU）</p>
<p>500 （50% of total） 100 （108 of total） 310 （31% of total） 超过可用资源容量上限（Capacity）和已分配资源量（Allocated resources）差额的Pod 无法 运行在该 Node 上。这个例子中，如果一个 Pod 的 Requests 超过 90 millicpus 或者超过 1341MiB 内存，那么就无法运行在这个节点上。</p>
<p>在后面的资源配额（Resource Quota）章节中，我们还可以配置针对一组 Pod 的 Requests 和Limits 总量的限制，这种限制可以作用于命名空间，通过这种方式我们可以防止一个命名空 间下的用户将所有资源全部据为己有。</p>
<p>（2）容器被强行终止（Terminated） 如果容器使用的资源超过了它配置的Limits，那么该容器可能会被强制终止。我们可以通 • 304•</p>
<h2>第 318 页</h2>
<h3>第5章</h3>
<p>Kubernetes 运维指南</p>
<p>过 kubectl describe pod 命令来确认容器是否是因为这个原因被终止的：</p>
<p>$ kubectl describe pod simmemleak-hra99 Name：</p>
<p>simmemleak-hra99</p>
<p>Namespace：</p>
<p>default</p>
<p>Image （s）：</p>
<p>saadali/simmemleak Node：</p>
<p>192.168.18.3</p>
<p>Labels：</p>
<p>name=3immemleak</p>
<p>status：</p>
<p>Running</p>
<p>Reason：</p>
<p>Message：</p>
<p>IP：</p>
<p>Replication Controllers：</p>
<p>172.17.1.3</p>
<p>simmemleak （1/1 replicas created） Containers：</p>
<p>simmemleak：</p>
<p>Image: saadali/simmemleak Limits：</p>
<p>cpu：</p>
<p>memory：</p>
<p>State：</p>
<p>Started：</p>
<p>Last Termination State：</p>
<p>100m</p>
<p>50Mi</p>
<p>Running</p>
<p>Tue,07 Ju1 2015 12:54:41 -0700 Terminated</p>
<p>Exit Code：</p>
<p>Started：</p>
<p>Finished：</p>
<p>Ready：</p>
<p>Restart Count：</p>
<p>1</p>
<p>Fri，</p>
<p>07 Jul 2015 12:54:30 -0700 Fri,07 Ju1 2015 12:54:33 -0700 False</p>
<p>5</p>
<p>Conditions：</p>
<p>Type</p>
<p>Status</p>
<p>Ready</p>
<p>False</p>
<p>Events：</p>
<p>FirstSeen</p>
<p>SubobjectPath</p>
<p>LastSeen</p>
<p>Reason</p>
<p>Message</p>
<p>rue,07 Ju1 2015 12:53:51 -0700 Tue, 07 Ju1 2015 12:53:51 -0700 1 Count From</p>
<p>｛scheduler ｝</p>
<p>scheduled</p>
<p>Successfully assigned simmemleak-hra99 to kubernetes-node-tfOf Tue, 07 Ju1 2015 12:53:51 -0700 Tue, 07 Ju1 2015 12:53:51 -0700 1| kubernetes-node-tfOf｝ implicitly required container POD pulled container image &quot;gcr.io/google_containers/pause: 0.8.0&quot; already present on machine Tue, 07 Jul 2015 12:53:51 -0700 Tue, 07 Ju1 2015 12:53:51 -0700 1 ｛kubelet</p>
<p>kubernetes-node-tfOf｝ implicitly required container POD created with docker id 6a41280f516d Tue,07 Ju1 2015 12:53:51 -0700 Tue, 07 Ju1 2015 12:53:51 -0700 1 kubernetes-node-tfOf｝ implicitly required container POD started</p>
<p>｛kubelet</p>
<p>Started</p>
<p>with docker id 6a41280f516d Tue, 07 Jul 2015 12:53:51 -0700 Tue,07 Jul 2015 12:53:51-0700 1 kubernetes-node-tfOf｝ spec.containers ｛simmemleak｝ created</p>
<p>｛kubelet</p>
<p>Created</p>
<p>• 305•</p>
<h2>第 319 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） with docker id 87348f12526a Restart Count:5 说明这个名为 simmemleak 的容器被强制终止并重启了5次。</p>
<p>我们可以在使用 kubectl get pod 命令时添加-0 go-template=.格式参数来读取已终止容器之 前的状态信息：</p>
<p>s kubectl get pod -o go-template=&#x27;｛｛range.status.containerstatuses｝ ｝ ｛｛&quot;Container Name：</p>
<p>&quot;｝｝｛｛.name｝｝｛｛&quot;\r\nLastState：&quot;｝｝｛｛.lastState｝｝ ｛｛end｝｝、 simmemleak-60xbc Container Name: simmemleak LastState: map ［terminated:map ［exitCode: 137 reason:OOM Killed startedAt:2015-07-07T20:58:43Z finishedAt:2015-07-07T20:58:432 containerID:docker://0e4095bbal feccdfe7ef9fb6ebffe972b4b14285d5acdec6f0d3ae8a22f ad8b21］</p>
<p>这里我们可以看到这个容器因为 reason:0OM Killed 而被强制终止，说明这个容器的内存超 过了限制 （Out of Memory）。</p>
<p>6）计算资源管理的演进</p>
<p>当前版本的 Kubernetes 中的 Requests 和 Limits 都是作用于容器级别的，未来 Kubernetes 计 划增加对直接作用于Pod级别的资源配置的支持，这种资源配置是能被Pod 内的所有容器共享 的，包括 emptyDir 这种 Pod 级别的 Volume。</p>
<p>从资源的种类来看，目前 Kubernetes 只能支持CPU 和内存两种计算资源类型，在后续的版本 中，Kubernetes 计划支持更多的资源类型，包括节点磁盘空间资源，还将支持自定义的资源类型。</p>
<p>2. 资源的配置范围管理（LimitRange） 默认情况下，Kubernetes 的Pod会以无限制的CPU 和内存运行。这也就意味着 Kubernetes 系统中任何的Pod 都可以使用其所在节点上的所有可用的CPU 和内存。通过配置Pod的计算资 源 Requests 和 Limits，我们可以限制Pod 的资源使用，但对于 Kubernetes 集群管理员而言，配 置每一个 Pod 的 Requests和 Limits 是烦琐且限制性过强的。更多的时候，我们需要的是对集群 内 Request 和 Limits 的配置做一个全局的统一的限制。常见的配置场景如下。</p>
<p>集群中的每个节点有2GB 内存，集群管理员不希望任何Pod 申请超过2GB 的内存：因 为整个集群中没有任何节点能满足超过2GB 内存的请求。如果某个 Pod 的内存配置超 过2GB，那么该Pod 将永远都无法被调度到任何节点上执行。为了防止这种情况的发 生，集群管理员希望能在系统管理功能中设置禁止Pod 申请超过2GB 内存。</p>
<p>（》集群由同一个组织中的两个团队共享，各自分别用来运行生产环境和开发环境。生产 环境最多可以使用8GB 内存，而开发环境最多可以使用 512MB 内存。集群管理员希 望通过这两个环境创建不同的命名空间 （namespace）并为每个命名空间设置不同的 • 306•</p>
<h2>第 320 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>限制来满足这个需求。</p>
<p>◎ 用户创建 Pod 时使用的资源可能会刚好比整个机器资源的上限稍小一点，而恰好剩下 的资源大小非常尴尬：不足以运行其他任务但整个集群加起来又非常浪费。因此，集 群管理员希望设置每个 Pod必须至少使用集群平均资源值（CPU 和内存）的20%，这 样集群能够提供更好的资源一致性的调度，从而减少了资源浪费。</p>
<p>针对这些需求，Kubernetes 提供了 LimitRange 机制对 Pod 和容器的 Requests 和 Limits 配置 进一步做出限制。在下面的示例中，将说明如何将 LimitsRange 应用到一个 Kubernetes 的命名 空间 （namespace）中，然后说明 LimitRange 的几种限制方式，比如最大及最小蒞围、Requests 和 Limits 的默认值、Limits 与 Requests 最大比例上限等。</p>
<p>下面通过LimitRange 的设置和应用对其进行说明。</p>
<p>1） 创建一个 namespace</p>
<p>创建一个名为 limit-example 的 namespace：</p>
<p>$ kubect1 create namespace 1imit-example namespace &quot;1imit-example&quot; created 2） 为 namespace 设置 LimitRange 內 namespace “limit-example” 创建一个简单的 LimitRange。创建 limits.yaml 配置文件，內 容如下：</p>
<p>apiversion:v1</p>
<p>kind:LimitRange</p>
<p>metadata：</p>
<p>name:mylimits</p>
<p>spec：</p>
<p>limits：</p>
<p>- max：</p>
<p>Cpu：“4&quot;</p>
<p>memory: 2Gi</p>
<p>min：</p>
<p>cpu:200m</p>
<p>memory: 6Mi</p>
<p>maxLimitRequestRatio：</p>
<p>cpu:3</p>
<p>memory: 2</p>
<p>type: Pod</p>
<p>- default：</p>
<p>cpu: 300m</p>
<p>memory: 200Mi</p>
<p>defaultRequest：</p>
<p>cpu: 200m</p>
<p>• 307•</p>
<h2>第 321 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） memory:100Mi</p>
<p>max：</p>
<p>cpu：&quot;2&quot;</p>
<p>memory: 1Gi</p>
<p>min：</p>
<p>cpu:100m</p>
<p>memory: 3Mi</p>
<p>maxLimitRequestRatio：</p>
<p>cpu:5</p>
<p>memory:4</p>
<p>type:Container</p>
<p>创建该LimitRange：</p>
<p>$ kubect1 create -f 1imits.yaml --namespace=1imit-example 1imitrange&quot;mylimits&quot; created 查看 namespace limit-example 中的 LimitRange：</p>
<p>s kubectl describe 1imits mylimits --namespace=limit-example Name：</p>
<p>mylimits</p>
<p>Namespace: 1imit-example Type</p>
<p>Resource</p>
<p>Min</p>
<p>Max</p>
<p>Default Request</p>
<p>Max</p>
<p>Limit/Request Ratio Default Limit</p>
<p>---</p>
<p>---</p>
<p>Pod</p>
<p>CPU</p>
<p>200m</p>
<p>4</p>
<p>-</p>
<p>Pod</p>
<p>memory</p>
<p>6Mi</p>
<p>2Gi</p>
<p>-_</p>
<p>Container</p>
<p>CPU</p>
<p>100m</p>
<p>2</p>
<p>200m</p>
<p>Container</p>
<p>memory</p>
<p>3Mi</p>
<p>1Gi</p>
<p>100Mi</p>
<p>300m</p>
<p>200Mi</p>
<p>3</p>
<p>2</p>
<p>5</p>
<p>4</p>
<p>下面解释一下 LimitRange 中各项配置的意义和特点。</p>
<p>（1）不论是 CPU还是内存，在 LimitRange 中，Pod 和 Container 都可以设置 Min、Max 和 Max Limit/Requests Ratio 这三种参数。Container 还可以设置 Default Request 和 Default Limit 这 两种参数，而Pod 不能设置 Default Request 和 Default Limito （2）对Pod 和 Container 的五种参数的解释如下。</p>
<p>Container 的Min（上面的100m 和3Mi）是Pod 中所有容器的 Requests 值的下限；Container 的Max（上面的2和 1Gi）是Pod 中所有容器的Limits 值的上限；Container 的 Default Request（上面的200m和100Mi）是Pod 中所有未指定 Requests 值的容器的默认 Requests 值；Container 的 Default Limit（上面的300m 和 200Mi）是 Pod 中所有未指定 Limits 值的容器的默认 Limits 值。对于同一资源类型，这4个参数必须满足以下关系：Min≤ Default Request ^ Default Limit ≤ Maxo Pod的Min（上面的200m和6Mi）是Pod 中所有容器的 Requests 值的总和的下限；Pod •308•</p>
<h2>第 322 页</h2>
<h3>第5章</h3>
<p>Kubernetes 运维指南</p>
<p>的 Max（上面的4和2Gi）是Pod 中所有容器的Limits 值的总和的上限。当容器未指定 Requests 值或者 Limits 值时，将使用 Container 的 Default Request 值或者 Default Limit 值。</p>
<p>Container 的 Max Limit/Requests Ratio（上面的5和4）限制了Pod 中所有容器的 Limits 值与 Requests 值的比例上限；而 Pod 的 Max Limit/Requests Ratio（上面的3和2）限制 了Pod 中所有容器的 Limits 值总和与 Requests 值总和的比例上限。</p>
<p>（3）如果设置了 Container 的Max，那么对于该类资源而言，整个集群中的所有容器都必须 设置 Limits，否则将无法成功创建。Pod 内的容器未配置 Limits 时，将使用 Default Limit 的值 （本例中的300m CPU 和200Mi 内存），而如果 Default 也未配置则无法成功创建。</p>
<p>（4）如果设置了 Container 的Min，那么对于该类资源而言，整个进群中的所有容器都必须 设置 Requests。如果创建Pod 的容器时未配置该类资源的 Requests，那么创建过程会报验证错 误。Pod 里容器的 Requests 在未配置时，可以使用默认值 defaultRequest（本例中的 200m CPU 和100Mi 内存）；如果未配置而又没有 defaultRequest，那么会默认等于该容器的 Limits；如果 此时 Limits 也未定义，那么就会报错。</p>
<p>（5）对于任意一个Pod 而言，该Pod 中所有容器的 Requests 总和必须大于或等于 6Mi，而 且所有容器的 Limits 总和必须小于或等于 1Gi；同样，所有容器的 CPU Requests 总和必须大于 或等于 200m，而且所有容器的 CPU Limits 总和必须小于或等于2。</p>
<p>（6） Pod 里任何容器的 Limits 与 Requests 的比例不能超过 Container 的 Max Limit/Requests Ratio；Pod 里所有容器的 Limits 总和与 Requests 的总和的比例不能超过 Pod 的 Max Limit/Requests Ratio。</p>
<p>3）创建 Pod 时触发 LimitRange 限制 最后，让我们看看 LimitRange 生效时对容器的资源限制效果。</p>
<p>命名空间中的限制（LimitRange）只会在Pod 创建或者更新的时候执行检查。如果手动修 改限制（LimitRange）为一个新的值，那么这个新的值不会去检查或限制之前已经在该命名空 间中创建好的Pod。</p>
<p>如果用户创建Pod 时，配置的资源值（CPU 或者内存）超过了 LimitRange 的限制，那么该 创建过程会报错，在错误信息中会说明详细的错误原因。</p>
<p>下面通过创建一个单容器 Pod来展示默认限制是如何配置到Pod上的：</p>
<p>$ kubect1 run nginx --image=nginx --replicas=1 --namespace=limit-example deployment &quot;nginx&quot; created 查看已创建的 Pod：</p>
<p>$ kubectl get pods ：--namespace=1imit-example NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS</p>
<p>AGE</p>
<p>• 309•</p>
<h2>第 323 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） nginx-2040093540-s8vzu 1/1</p>
<p>Running</p>
<p>0</p>
<p>11s</p>
<p>查看该Pod的 resources 相关信息：</p>
<p>s kubectl get pods nginx-2040093540-s8vzu --namespace=limit-example -o yaml | grep resources -C8 resourceVersion： &quot;57&quot; selfLink: /api/v1/namespaces/1imit-example/pods/nginx-2040093540-ivimu uid: 67b20741-f53b-11e5-b066-64510658e388 containers：</p>
<p>- image: nginx</p>
<p>imagePul1Policy: Always name:nginx</p>
<p>resources：</p>
<p>1imits：</p>
<p>cpu:300m</p>
<p>memory:200Mi</p>
<p>requests：</p>
<p>cpu:200m</p>
<p>memory:100Mi</p>
<p>terminationMessagePath: /dev/termination-1og volumeMounts：</p>
<p>由于该 Pod 未配置资源 Requests 和 Limits，所以使用了 namespace limit-example 中的默认 CPU 和内存定义的 Requests 和 Limits 值。</p>
<p>下面创建一个超出资源限制的Pod（使用3CPU）：</p>
<p>invalid-pod.yaml：</p>
<p>apiversion:v1</p>
<p>kind:Pod</p>
<p>metadata：</p>
<p>name: invalid-pod</p>
<p>spec：</p>
<p>- name: kubernetes-serve-hostname image: gcr.io/google_containers/serve_hostname 创建该Pod，可以看到系统报错了，并且提供了错误原因为超过了限制。</p>
<p>s kubectl create -f invalid-pod.yaml --namespace=limit-example Error from server: error when creating &quot;invalid-pod.yaml&quot;： Pod &quot;invalid-pod&quot; is forbidden：［Maximum cpu usage per Pod is 2, but limit is 3.， Maximum cpu usage per is 2,but limit is 3.］ • 310•</p>
<h2>第 324 页</h2>
<h3>第5章</h3>
<p>Kubernetes 运维指南</p>
<p>接下来的例子展示了 LimitRange 对 maxLimitRequestRatio 的限制：</p>
<p>1imit-test-nginx.yaml：</p>
<p>apiVersion:v1</p>
<p>kind: Pod</p>
<p>metadata：</p>
<p>name: 1imit-test-nginx labels：</p>
<p>name: limit-test-nginx Spec：</p>
<p>containers：</p>
<p>- name: 1imit-test-nginx image: nginx</p>
<p>resources：</p>
<p>1imits：</p>
<p>cpu：&quot;1&quot;</p>
<p>memory:512Mi</p>
<p>requests：</p>
<p>cpu：&quot;0.8&quot;</p>
<p>memory:250Mi</p>
<p>由于 limit-test-nginx 这个 Pod 的全部内存 Limits 总和与 Requests 总和的比例为512:250， 大于 LimitRange 中定义的Pod 的内存 maxLimitRequestRatio 值2，因此创建会失败：</p>
<p>$ kubectl create -f 1imit-test-nginx.yaml --namespace=1imit-example Error from server: error when creating &quot;1imit-test-nginx.yam1&quot;： pods &quot;limit-test-nginx&quot; is forbidden： ［memory max limit to request ratio per Pod is 2， but provided ratio is 2.048000.］ 下面的例子为满足 LimitRange 限制的 Pod：</p>
<p>valid-pod.yaml：</p>
<p>apiversion: v1</p>
<p>kind: Pod</p>
<p>metadata：</p>
<p>name: valid-pod</p>
<p>labels：</p>
<p>name: valid-pod</p>
<p>spec：</p>
<p>containers：</p>
<p>- name: kubernetes-serve-hostname image: gcr.io/google_containers/serve.</p>
<p>_hostname</p>
<p>resources：</p>
<p>1imits：</p>
<p>cpu：&quot;1&quot;</p>
<p>memory:512Mi</p>
<p>创建 Pod 将会成功：</p>
<p>s kubectl create -f valid-pod.yaml --namespace=limit-example •311•</p>
<h2>第 325 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） pod &quot;valid-pod&quot; created 查看该Pod 的资源信息：</p>
<p>s kubectl get pods valid-pod --namespace=1imit-example -0 yaml I grep -C 6 resources</p>
<p>uid: 3b1bfd7a-f53c-11e5-b066-64510658e388 spec：</p>
<p>containers：</p>
<p>- image: gcr.io/google_containers/serve_hostname imagePul1Policy: Always name: kubernetes-serve-hostname resources：</p>
<p>1imits：</p>
<p>cpu： &quot;1&quot;</p>
<p>memory: 512Mi</p>
<p>requests：</p>
<p>Cpu： &quot;1&quot;</p>
<p>memory: 512Mi</p>
<p>可以看到该 Pod 配置了明确的 Limits 和 Requests，因此该 Pod 不会使用 namespace limit-example 中定义的 default 和 defaultRequest。</p>
<p>需要注意的是，CPU Limits 强制配置这个选项在 Kubernetes 集群中默认是开启的；除非集 群管理员在部署 kubelet 时，通过设置参数--cpu-cfs-quota=false 来关闭该限制：</p>
<p>s kubelet --help</p>
<p>Usage of kubelet</p>
<p>--cpu-cfs-guota［=true］ ：Enable CPU CFS quota enforcement for containers that specify CPU 1imits $ kubelet --cpu-cfs-quota=false •.</p>
<p>如果集群管理员希望对整个集群中容器或者 Pod 配置的 Requests 和 Limits 做限制，那么可 以通过配置 Kubernetes 的命名空间 （namespace）上的LimiRange（资源限制区间）来达到该目 的。在 Kubernetes 集群中，如果 Pod 没有显式定义 Limits 和 Requests，那么 Kubemnetes 系统会 将该 Pod所在的命名空间中定义的 LimitRange 的 default 和 defaultRequests 配置到该 Pod上。</p>
<p>3. 资源的服务质量管理（Resource QoS） 本节对 Kubernetes 如何根据Pod 的 Requests 和 Limits 配置来实现针对Pod 的不同级别的资 源服务质量控制（QoS）进行说明。</p>
<p>在 Kubernetes 的资源QoS 体系中，需要保证高可靠性的Pod 可以申请可靠资源，而一些不 需要高可靠性的Pod 可以申请可靠性较低或者不可靠的资源。在计算资源一节中，我们讲到了 容器的资源配置分为 Requests 和 Limits，其中 Requests 是 Kubernetes 调度时能容器提供的完 • 312•</p>
<h2>第 326 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>全可保障的资源量（最低保障），而 Limits 是系统允许容器运行时可能使用到的资源量的上限 （最高上限）。Pod级别的资源配置是通过计算Pod 内所有容器的资源配置的总和得出来的。</p>
<p>Kubernetes 中 Pod 的 Requests 和 Limits 资源配置有如下特点：如果 Pod 配置的 Requests 值 等于 Limits 值，那么该Pod 可以获得的资源是完全可靠的；而如果 Pod 的 Requests 值小于 Limits 值，那么该Pod 获得的资源可分成两部分：一部分是完全可靠的资源，资源量大小等于 Requests 值；另外一部分是不可靠的资源，这部分资源最大等于 Limits 与 Requests 的差额值，这份不可 靠的资源能够申请到多少，则取决于当时主机上容器可用资源的余量。</p>
<p>通过这种机制，Kubemnetes 可以实现节点资源的超售（Over Subscription），比如在 CPU完 全充足的情况下，某机器共有 32GiB 内存可提供给容器使用，容器配置为 Requests 值 IGiB， Limits 值为 2GiB，那么该机器上最多可以同时运行32个容器，每个容器最多可使用2GiB 内存， 如果这些容器的内存使用峰值错开，那么所有容器也可以一直正常运行。</p>
<p>超售机制能有效地提高资源的利用率，同时不会影响容器申请的完全可靠资源的可靠性。</p>
<p>1） Requests 和 Limits 对不同计算资源类型的限制机制 根据计算资源章节的内容我们知道，容器的资源配置满足以下两个条件。</p>
<p>Requests&lt;=节点可用资源。</p>
<p>Requests&lt;=Limits。</p>
<p>Kubernetes 根据 Pod 配置的 Requests 值来调度 Pod,Pod 在成功调度之后会得到 Requests 值定义的资源来运行；而如果Pod所在机器上的资源有空余，则Pod 可以申请更多的资源，最 多不能超过Limits 的值。我们下面看一下 Requests 和 Limits 针对不同计算资源类型的限制机制 的差异。这种差异主要取决于计算资源类型是可压缩资源还是不可压缩资源。</p>
<p>（1） 可压缩资源</p>
<p>Kubernetes 目前支持的可压缩资源是 CPU。</p>
<p>Pod 可以得到 Pod 的 Requests 配置的CPU 使用量，而是否能使用超过 Requests 值的部 分取决于系统的负载和调度。不过由于目前 Kubernetes 和 Docker 的 CPU 隔离机制都 是在容器级别隔离的，所以 Pod 级别的资源配置并不能完全得到保障；Pod 级别的 cgroups 正在紧锣密鼓地开发中，如果将来引入，就可以确保Pod级别的资源配置准确 运行。</p>
<p>2 空闲 CPU 资源按照容器 Requests 值的比例分配。举例说明：容器 A 的CPU 配置力 Requests 1 Limits 10，容器B的CPU 配置次 request 2 Limits 8， A 和B 同时运行在一个 节点上，初始状态下容器的可用 CPU 为3cores，那么A 和B 恰好得到它们的 Requests 中定义的CPU 用量，即1CPU 和2CPU。如果A和B 都需要更多的CPU 资源，而恰 • 313</p>
<h2>第 327 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 好此时系统的其他任务释放出 1.5CPU，那么这 1.5CPU 将按照A 和B 的Requests 值的 比例1：2分配给 A 和B，即最终A 可使用1.5CPU,B可使用3CPU。</p>
<p>如果Pod使用了超过 Limits 10中配置的CPU 用量，那么 cgroups 会对 Pod 中的容器的 CPU 使用进行限流 （throttled）：如果 Pod 没有配置 Limits 10，那么Pod 会尝试抢占所 有空闲的CPU 资源（Kubernetes 从1.2版本开始默认开启--cpu-cfs-quota，因此默认情 况下必须配置 Limits）。</p>
<p>（2）不可压缩资源</p>
<p>Kubernetes 目前支持的可压缩资源是内存。</p>
<p>Pod 可以得到 Requests 中配置的内存。如果Pod 使用的内存量小于它的 Requests 的配 置，那么这个 Pod 可以正常运行（除非出现操作系统级别的内存不足等严重问题）；如 果Pod 使用的内存量超过了它的 Requests 的配置，那么这个 Pod 有可能被 Kubernetes “杀掉”：比如Pod A 使用了超过 Requests 而不到 Limits 的内存量，此时同一机器上另 外一个 Pod B之前只使用了远少于自己的 Requests 值的内存，而此时程序压力增大， Pod B 向系统申请的总量不超过自己的 Requests 值的内存，那么 Kubernetes 可能会直 接杀掉 Pod A；另外一种情况是Pod A 使用了超过 Requests 而不到 Limits 的内存量， 此时 Kubernetes 将一个新的Pod 调度到这台机器上，新的Pod 需要使用内存，而只有 Pod A 使用了超过了自己的 Requests 值的内存，那么 Kubernetes 也可能会杀掉 Pod A 来释放内存资源。</p>
<p>如果Pod使用的内存量超过了它的 Limits 设置，那么操作系统内核会杀掉Pod 所有容 器的所有进程中使用内存最多的一个，直到内存不超过Limits 为止。</p>
<p>2） 对调度策略的影响</p>
<p>Kubernetes 的kubelet 通过计算Pod 中所有容器的Requests 的总和来决定对Pod的调度。</p>
<p>》 不管是CPU还是内存，Kubernetes 调度器和 kubelet 都会确保节点上所有Pod的 Requests 的总和不会超过该节点上可分配给容器使用的资源容量上限。</p>
<p>3）服务质量等级 （QoS Classes） 在一个超用（Over Committed，即容器 Limits 总和大于系统容量上限）系统中，由于容器 负载的波动可能导致操作系统的资源不足，最终可能会导致部分容器被“杀掉”。在这种情况下， 我们当然会希望优先“杀掉”那些不太重要的容器，那么如何衡量重要程度呢？Kubernetes 将 容器划分成 3个 QoS 等级：Guaranteed（完全可靠的）、Burstable（弹性波动、较可靠的）和 Best-Effort（尽力而为、不太可靠的），这三种优先级依次递减，如图5.4所示。</p>
<p>• 314•</p>
<h2>第 328 页</h2>
<h3>第5章</h3>
<p>Kubernetes 运维指南</p>
<p>---</p>
<p>QoS</p>
<p>等级</p>
<p>Guranteed</p>
<p>优</p>
<p>先</p>
<p>级</p>
<p>Burstable</p>
<p>*</p>
<p>Best Effort</p>
<p>图5.4 QoS等级和优先级的关系</p>
<p>从理论上来说，QoS级别应该作为一个单独的参数来提供 API，并由用户对Pod进行配置， 这种配置应该与 Requests 和 Limits 无关。但在当前版本的 Kubernetes 的设计中，为了简化模式 及避免引入太多的复杂性，QoS级别直接由 Requests 和 Limits 来定义。在 Kubernetes 中容器的 QoS级别等于容器所在Pod 的QoS级别，而 Kubernetes 的资源配置定义了 Pod 的三种 QoS级 别，如下所述。</p>
<p>1） Guaranteed（完全可靠的） 如果Pod中的所有容器对所有资源类型都定义了 Limits 和 Requests，并且所有容器的 Limits 值都和 Requests 值全部相等（且都不为0），那么该Pod的QoS级别就是 Guaranteed。注意：在 这种情况下，容器可以不定义 Requests，因为 Requests 值在未定义的时候默认等于 Limits。</p>
<p>下面这两个例子中定义的 Pod QoS 级别就是 Guaranteed：</p>
<p>containers：</p>
<p>name: foo</p>
<p>resources：</p>
<p>limits：</p>
<p>cpu:10m</p>
<p>memory:1Gi</p>
<p>name: bar</p>
<p>resources：</p>
<p>Limits：</p>
<p>Cpu：</p>
<p>100m</p>
<p>memory: 100Mi</p>
<p>在上面的例子中未定义 Requests 值，所以其默认等于 Limits 值。而下面这个例子中定义的 Requests 和 Limits 的值完全相同：</p>
<p>containers：</p>
<p>name: foo</p>
<p>resources：</p>
<p>limits：</p>
<p>cpu: 10m</p>
<p>memory: 1Gi</p>
<p>• 315•</p>
<h2>第 329 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） requests：</p>
<p>cpu:10m</p>
<p>memory: 1Gi</p>
<p>name:bar</p>
<p>resources：</p>
<p>1imits：</p>
<p>cpu:100m</p>
<p>memory:100Mi</p>
<p>requests：</p>
<p>cpu:10m</p>
<p>memorY:1Gi</p>
<p>2） Best-Effort（尽力而 、不太可靠的） 如果Pod 中所有容器都未定义资源配置（Requests 和 Limits 都未定义），那么该Pod的 QoS 级别就是 Best-Effort。</p>
<p>例如下面这个Pod定义：</p>
<p>containers：</p>
<p>name: foo</p>
<p>LesourCeS：</p>
<p>name:bar</p>
<p>resourCeS：</p>
<p>3） Burstable（弹性波动、较可靠的） 当一个 Pod 既不是 Guaranteed 级别的，也不是 Best-Effort 级别的时，该Pod 的QoS 级别就 是 Burstable。Burstable 级别的Pod 包括两种情况。第1 种情况是：Pod 中的一部分容器在一种 或多种资源类型的资源配置中，定义了 Requests 值和 Limits 值（都不 0），且 Requests 值小于 Limits 值；第2种情况是：Pod 中的一部分容器未定义资源配置（Requests 和 Limits 都未定义）。</p>
<p>注意：容器未定义 Limits 时，Limits 值默认等于节点资源容量上限。</p>
<p>下面几个例子中的Pod 的QoS等级都是 Burstable。</p>
<p>（1）容器 foo 的 CPU Requests 不等于 Limits：</p>
<p>containers：</p>
<p>name: foo</p>
<p>resources：</p>
<p>1imits：</p>
<p>cpu：10m</p>
<p>memory:1Gi</p>
<p>requests：</p>
<p>cpu:5m</p>
<p>memory:1Gi</p>
<p>name:bar</p>
<p>resources：</p>
<p>•316•</p>
<h2>第 330 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>limits：</p>
<p>cpu:10m</p>
<p>memory:1Gi</p>
<p>requests：</p>
<p>cpu:10m</p>
<p>memorY:1Gi</p>
<p>（2） 容器 bar 未定义资源配置而容器 foo 定义了资源配置：</p>
<p>containers：</p>
<p>name: foo</p>
<p>resources：</p>
<p>limits：</p>
<p>cpu:10m</p>
<p>memory:1Gi</p>
<p>requests：</p>
<p>cpu:10m</p>
<p>memory: 1Gi</p>
<p>name: bar</p>
<p>（3）容器 foo 未定义 CPU，而容器bar 未定义内存：</p>
<p>containers：</p>
<p>name:foo</p>
<p>resources：</p>
<p>limits：</p>
<p>memory:1Gi</p>
<p>name: bar</p>
<p>resources：</p>
<p>1imits：</p>
<p>cpu:100m</p>
<p>（4） 容器 bar 未定义资源配置，而容器 foo 未定义Limits 值：</p>
<p>containers：</p>
<p>name: foo</p>
<p>resourceS：</p>
<p>requests：</p>
<p>cpu:10m</p>
<p>memory: 1Gi</p>
<p>name: bar</p>
<p>4） Kubernetes QoS 的工作特点 Pod的 CPU Requests 无法得到满足（比如节点的系统级任务占用过多的CPU 导致无法分配 给足够的CPU 给容器使用）时，容器得到的 CPU 会被压缩限流。</p>
<p>内存由于是不可压缩资源，所以针对内存资源紧缺的情况，将按照以下逻辑进行处理。</p>
<p>（1）Best-Effort Pod 的优先级最低，这类Pod 中运行的进程会在系统内存紧缺时被第一优先 • 317</p>
<h2>第 331 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） “杀死”。当然，从另外一个角度来看，Best-Effort Pod 由于没有设置资源 Limits，所以在资源充 足的时候，它们可以充分地使用所有的闲置资源。</p>
<p>（2） Burstable Pod 的优先级居中，这类Pod 初始时会分配较少的可靠资源，但可以按需申 请更多的资源。当然，如果整个系统内存紧缺，而又没有 Best-Effort 容器可以被“杀死”以释 放资源，则这类Pod 中的进程可能会被“杀死”。</p>
<p>（3） Guaranteed Pod 的优先级最高，而且一般情况下这类Pod 只要不超过其资源 Limits 的 限制就不会被“杀死”。当然，如果整个系统内存紧缺，而又没有其他更低优先级的容器可以被 “杀死”以释放资源，这类Pod 中的进程也可能会被“杀死”。</p>
<p>5） 0OM 计分系统</p>
<p>OOM （Out Of Memory）计分规则包括如下内容。</p>
<p>00M 计分是一个进程消耗内存在系统中占的百分比中不含百分号的数字的值乘以10 的结果，这个结果是进程0OM 基础分；将进程00M 基础分的分值再加上这个进程的 0OM 分数调整值 00M</p>
<p>_SCORE_ADJ 的值作为进程0OM 最终分值（除root 启动的进 程外）。在系统发生0OM 时，0OM Killer 会优先杀掉0OM 计分更高的进程。</p>
<p>（》进程的0OM 计分的基本分数值范围是0～1000，如果 A 进程的调整值 0OM_SCORE_ADJ 减去B 进程的调整值的结果大于1000，那么A 进程的0OM计分 最终值必然大于B进程，A进程会比B进程优先被杀死。</p>
<p>•）不论调整值OOM_SCORE_ADI为多少，任何进程的最终分值范围也是0~1000。</p>
<p>在 Kubernetes，不同QoS 的0OM 计分调整值规则如表5.1所示。</p>
<p>表5.1 不同QoS的OOM计分调整值 QoS 等级</p>
<p>Guaranteed</p>
<p>BestEffort</p>
<p>Burstable</p>
<p>oom_score_adj</p>
<p>-998</p>
<p>1000</p>
<p>min（max（2, 1000 - （1000 * memoryRequestBytes） / machineMemoryCapacityBytes）， 999） Best-effort Pod 设置 0OM_SCORE_ADJ调整值次1000，因此 Best-effort Pod 中的容器 里面的所有进程的0OM 最终分肯定是 1000。</p>
<p>Guaranteed Pod 改置 OOM_SCORE _ADJ调整值为-998，因此 Guaranteed Pod 中的容器 里面的所有进程的0OM 最终分一般为0或者1（因为基础分不可能为1000）。</p>
<p>Burstable Pod规则分情况说明：如果 Burstable Pod 的内存 Requests 超过了系统可用内 存的 99.8%，那么这个 Pod 的OOM_SCORE_ADJ调整值固定为2；否则，设置 • 318•</p>
<h2>第 332 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>00M_SCORE_ADJ 调整值为1000 -10（内存 Requests 占系统可用内存的百分比的无 百分号的数字部分的值），而如果内存 Requests 为0，那么OOM_SCORE_ADJ 调整值 固定为999。这样的规则能确保OOM_SCORE_ADJ调整值的范围为2~999，而 Burstable Pod 中所有进程的0OM 最终分数范围为2~1000。Burstable Pod 进程的0OM 最终分 数始终大于 Guaranteed Pod 的进程得分，因此它们会被优先“杀死”。如果一个 Burstable Pod 使用的内存比它的内存 Requests 少，那么可以肯定的是它的所有进程的0OM 最终 分数会小于 1000，此时能确保它的优先级高于 Best-effort Pod。如果一个 Burstable Pod 的某个容器中某个进程使用的内存比容器的 request 值高，那么这个进程的00M 最终 分数会是1000，否则它的0OM 最终分会小于1000。假设下面容器中有一个占用内存 非常大的进程，那么当一个使用内存超过其 Requests 的 Burstable Pod 与另外一个使用 内存少于其 Requests 的 Burstable Pod发生内存竞争冲突时，前者的进程会被系统“杀 掉”。如果一个 Burstable Pod 内部有多个进程的多个容器发生内存竞争冲突，那么此时 00M 评分只能作为参考，不能保证完全按照资源配置的定义来执行OOM Kill。</p>
<p>0OM还有一些特的计分规则，如下所述。</p>
<p>◎ kubelet 进程和 Docker 进程的调整值 OOM_SCORE_ADI 为-998。</p>
<p>如果配置进程调整值 0OM</p>
<p>_SCORE_ADI 为-999，那么这类进程不会被OOM Killer“杀 掉”。</p>
<p>6） QoS 的 进</p>
<p>目前 Kubernetes 基于QoS 的超用机制日趋完善，但还有一些问题需要解决。</p>
<p>7） 内存 Swap 的支持</p>
<p>当前的QoS策略都是假定主机不启用内存Swap。如果主机启用了Swap，那么上面的Qos 策略可能会失效。举例说明：两个 Guaranteed Pod 都刚好达到了内存 Limits，那么由于内存Swap 机制，它们还可以继续申请使用更多的内存。如果 Swap 空间不足，那么最终这两个 Pod 中的 进程可能会被“杀掉”。由于 Kubernetes 和 Docker 尚不支持内存 Swap 空间的隔离机制，所以 这一功能暂时还未实现。</p>
<p>8） 更丰富的 QoS策略</p>
<p>当前的 QoS策略都是基于 Pod 的资源配置（Requests 和 Limits）来定义的，而资源配置本 身又承担着对Pod资源管理和限制的功能。两种不同维度的功能使用同一个参数来配置，可能 会导致某些复杂需求无法满足，比如当前 Kubernetes 无法支持弹性的、高优先级的Pod。自定 义QoS优先级能提供更大的灵活性，完美地实现各类需求，但同时会引入更高的复杂性，而且 过于灵活的设置会给予用户过高的权限，对系统管理也提出了更大的挑战。</p>
<p>• 319•</p>
<h2>第 333 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 4. 资源的配额管理（Resource Quotas） 如果一个 Kubernetes 集群被多个用户或者多个团队共享使用，那么就需要考虑共享时对资 源公平使用的问题，因为某个用户可能会使用超过基于公平原则分配给其的资源量。</p>
<p>资源配额（Resource Quotas）就是解决这个问题的工具。通过 ResourceQuota 对象，我们可 以定义一项资源配额，这个资源配额可以为每一个命名空间（namespace）提供一个总体的资源 使用的限制：它可以限制命名空间中某种类型的对象的总数目上限，也可以设置命名空间中Pod 可以使用到的计算资源的总上限。</p>
<p>典型的资源配额（Resource Quotas）使用方式如下。</p>
<p>不同的团队工作在不同的命名空间下，目前这个是非约束性的，未来版本中可能会通 过 ACLs（访问控制列表 Access Control List）的方式来实现强制性约束。</p>
<p>◎ 集群管理员为集群中的每个命名空间创建一个或者多个资源配额项。</p>
<p>◎ 当用户在命名空间中使用资源（创建 Pod 或者 Service 等）时，Kubernetes 的配额系统 会统计、监控和检查资源用量，以确保使用的资源用量没有超过资源配额的配置。</p>
<p>• 如果创建或者更新应用时，资源使用超过了某项资源配额的限制，那么创建或者更新 的请求会报错（HTTP 403 Forbidden），错误信息给出详细的出错原因说明。</p>
<p>◎ 如果命名空间中的计算资源（CPU 和内存）的资源配额启用，那么用户必须为相应的 资源类型设置 Requests 或 Limits；否则配额系统可能会直接拒绝Pod 的创建。这里可 以使用 LimitRange 机制来为没有配置资源的Pod提供默认资源配置。</p>
<p>下面的例子展示了一个非常适合使用资源配额来做资源控制管理的场景。</p>
<p>© 集群共有32GB 内存和16 CPU，两个小组，A小组使用20GB 内存和10CPU,B 小组 使用10GB 内存和2 CPU，剩下的2GB 内存和2CPU 作为预留。</p>
<p>在名 testing 的命名空间中，限制使用1 CPU 和1GB 内存；在名为 production 的命名 空间中，资源使用不受限制。</p>
<p>在使用资源配额时，需要注意以下两点。</p>
<p>如果集群中总的可用资源小于各命名空间中资源配额的总和，那么可能会导致资源竞 争。资源竞争时，Kubernetes 系统使用先到先得的原则。</p>
<p>不管是资源竞争还是配额的修改都不会影响到已经创建的资源使用对象。</p>
<p>1） 在 Master 中开启资源配额选型 资源配额可以通过在kube-apiserver 的--admission-control=参数值中添加 ResourceQuota 参数 进行开启。如果某个命名空间的定义中存在 ResourceQuota，那么对于该命名空间而言，资源配 • 320•</p>
<h2>第 334 页</h2>
<h3>第5章</h3>
<p>Kubernetes 运维指南</p>
<p>额就是开启的。一个命名空间可以有多个 ResourceQuota 配置项。</p>
<p>（1）计算资源配额（Compute Resource Quota） 资源配额可以限制一个命名空间中所有 Pod 的计算资源的总和。表5.2列出了目前 Kubernetes 资源配额支持限制的计算资源类型。</p>
<p>表5.2 ResourceQuota 的计算资源类型 资源名称</p>
<p>说明</p>
<p>cpu</p>
<p>所有非终止状态的Pod,CPU Requests 的总和不能超过该值 limits.cpu</p>
<p>所有非终止状态的 Pod，CPU Limits 的总和不能超过该值 limits.memory</p>
<p>所有非终止状态的Pod，内存 Limits 的总和不能超过该值 memory</p>
<p>所有非终止状态的Pod，内存 Requests 的总和不能超过该值 requests.cpu</p>
<p>所有非终止状态的 Pod，CPU Requests 的总和不能超过该值 requests.memory</p>
<p>所有非终止状态的Pod，內存 Requests 的总和不能超过该值 （2）对象数量配额 （Object Count Quota） 指定类型的对象数量可以被限制。表5.3 列出了 Kubernetes 资源配额支持限制对象数量的 对象类型。</p>
<p>表 5.3 ResourceQuota 的对象类型 资源名称</p>
<p>configmaps</p>
<p>persistentvolumeclaims pods</p>
<p>说明</p>
<p>在该命名空间中，能存在的 ConfigMap 的总数上限 在该命名空间中，能存在的持久卷的总数上限 在该命名空间中，能存在的非终止状态 Pod 的总数上限。Pod 终止状态等价于 Pod 的 status;phase 状态值为 Failed 或者 Succeed is true replicationcontrollers 在该命名空间中，能存在的RC 的总数上限 resourcequotas</p>
<p>在该命名空间中，能存在的资源配额项（ResourcesQuota）的总数上限 services</p>
<p>在该命名空间中，能存在的 service 的总数上限 services.loadbalancers 在该命名空间中，能存在的负载均衡（LoadBalancer）的总数上限 services.nodeports 在该命名空间中，能存在的 NodePort 的总数上限 secrets</p>
<p>在该命名空间中，能存在的 Secret 的总数上限 例如我们可以通过资源配额来限制命名空间中能创建的Pod 的最大数量。这种设置可以防 止某些用户大量创建 Pod 而迅速耗尽整个集群的 Pod IP 和计算资源。</p>
<p>2） 配额的作用域 （Quota Scopes） 每项资源配额都可以单独配置一组作用域，配置了作用域的资源配额只会对符合其作用域 的资源使用进行计量和限制，作用域范围内的且超过了资源配额的请求都会报验证错。表5.4 列出了 ResourceQuota 的4种作用域。</p>
<p>• 321•</p>
<h2>第 335 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 表5.4 ResourceQuota 的作用域 作用域</p>
<p>说明</p>
<p>Terminating</p>
<p>匹配所有 spec.activeDeadlineSeconds &gt;=0的 Pod NotTerminating</p>
<p>匹配所有 spec.activeDeadlineSeconds 是nil 的Pod BestEffort</p>
<p>匹配所有 QoS为Best-Effort 的Pod NotBestEffort</p>
<p>匹配所有 QoS 不是 Best-Effort 的Pod 其中，BestEffort 作用域可以限定资源配额来追踪 pods 资源的使用，Terminating、 NotTerminating 和 NotBestEffort 这三种作用域可以限定资源配额来追踪以下资源的使用。</p>
<p>© cpu</p>
<p>◎</p>
<p>limits.cpu</p>
<p>limits.memory</p>
<p>© memory</p>
<p>• pods</p>
<p>Tequests.Cpu</p>
<p>◎</p>
<p>requests.memory</p>
<p>3） 在资源配额（ResourceQuota）中设置 Requests 和 Limits 资源配额也可以设置 Requests 和 Limits。</p>
<p>如果资源配额中指定了 requests.cpu 或 requests.memory，那么它会强制要求每一个容器都 必须配置自己的 CPU Requests 或 CPU Limits（可使用LimitRange 提供的默认值）。</p>
<p>同理，如果资源配额中指定了 limits.cpu 或 limits.memory，那么它也会强制要求每一个容 器都必须配置自己的内存 Requests 或内存 Limits（可使用 LimitRange提供的默认值）。</p>
<p>4） 资源配额（ResourceQuota）的定义 下面通过几个例子对资源配额进行设置和应用。</p>
<p>与 LimitRange 相似，ResourceQuota 也设置在 namespace 中。创建名內 myspace 的 namespace：</p>
<p>s kubectl create</p>
<p>namespace myspace</p>
<p>namespace</p>
<p>&quot;myspace&quot;</p>
<p>created</p>
<p>创建 ResourceQuota 配置文件 compute-resources.yaml，用于设置计算资源的配额：</p>
<p>apiVersion: vl</p>
<p>kind: ResourceQuota metadata：</p>
<p>name: compute-resources spec：</p>
<p>• 322•</p>
<h2>第 336 页</h2>
<h3>第5章</h3>
<p>Kubernetes 运维指南</p>
<p>hard：</p>
<p>pods：&quot;4&quot;</p>
<p>requests.cpu：&quot;1&quot;</p>
<p>requests.memory:1Gi 1imits.cpu：&quot;2&quot;</p>
<p>1imits.memory: 2Gi 创建该项资源配额：</p>
<p>$ kubectl create -f compute-resources•yaml --namespace=myspace resourcequota &quot;compute-resources&quot; created 创建另一个名为 object-counts.yaml 的文件，用于设置对象数量的配额：</p>
<p>apiVersion:v1</p>
<p>kind: ResourceQuota metadata：</p>
<p>name: object-counts spec：</p>
<p>hard：</p>
<p>configmaps：&quot;10&quot;</p>
<p>Persistentvolumeclaims： &quot;4&quot; replicationcontrollers： &quot;20&quot; secrets：&quot;10&quot;</p>
<p>services：&quot;10&quot;</p>
<p>services.loadbalancers： &quot;2&quot; 创建该 ResourceQuota：</p>
<p>$ kubectl create -f object-counts.yaml --namespace=myspace resourcequota &quot;object-counts&quot; created 查看各 ResourceQuota 的详细信息：</p>
<p>$ kubectl describe quota compute-resources --namespace=myspace Name：</p>
<p>compute-resources</p>
<p>Namespace：</p>
<p>myspace</p>
<p>Resource</p>
<p>Used Hard</p>
<p>1imits.cpu</p>
<p>limits.memory</p>
<p>pods</p>
<p>requests.cpu</p>
<p>requests.memory</p>
<p>0</p>
<p>0</p>
<p>0</p>
<p>0</p>
<p>2</p>
<p>2Gi</p>
<p>4</p>
<p>1</p>
<p>1Gi</p>
<p>$ kubectl describe quota object-counts --namespace=myspace Name：</p>
<p>object-counts</p>
<p>Namespace：</p>
<p>myspace</p>
<p>Resource</p>
<p>Used</p>
<p>Hard</p>
<p>—-一</p>
<p>1—1-</p>
<p>configmaps</p>
<p>0</p>
<p>10</p>
<p>• 323</p>
<h2>第 337 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） persistentvolumeclaims replicationcontrollers secrets</p>
<p>0</p>
<p>0</p>
<p>1</p>
<p>4</p>
<p>20</p>
<p>10</p>
<p>services</p>
<p>10</p>
<p>services.loadbalancers 0</p>
<p>2</p>
<p>5） 资源配额与集群资源总量的关系</p>
<p>资源配额与集群资源总量是完全独立的。资源配额是通过绝对的单位来配置的：这也就意 味着如果集群中新添加了节点，那么资源配额不会自动更新，而该资源配额所对应的命名空间 下对象也不能自动地增加资源上限。</p>
<p>在某些情况下，我们可能希望资源配额能支持更复杂的策略，如下所述。</p>
<p>（2 对于不同的租户，按照比例划分整个集群的资源。</p>
<p>允许每个租户都能按照需要来提高资源用量，但是有一个较宽容的限制，以防止意外 的资源耗尽情况发生。</p>
<p>e 探测某个命名空间的需求，添加物理节点并扩大资源配额值。</p>
<p>这些策略可以通过将资源配额作为一个控制模块、手动编写一个控制器（controller）来监 控资源使用情况，并调整命名空间上的资源配额的方式来实现。</p>
<p>资源配额将整个集群中的资源总量做了一个静态的划分，但它并没有对集群中的节点 （Node）做任何限制：不同命名空间中的 Pod 仍然可以运行到同一个节点上。</p>
<p>5. ResourceQuota 和 LimitRange 买践指南 根据前面对资源管理的介绍，这里将通过一个完整的例子来说明如何通过资源配额和资源 配置范围的配合来控制一个命名空间的资源使用。</p>
<p>集群管理员根据集群用户数量来调整集群配置，以达到如下目的：能控制特定命名空间中 的资源使用量，最终实现集群的公平使用和成本的控制。</p>
<p>需要实现的功能如下。</p>
<p>》 限制运行状态的Pod 的计算资源用量。</p>
<p>◎ 限制持久存储卷的数量以控制对存储的访问。</p>
<p>◎ 限制负载均衡器的数量以控制成本。</p>
<p>防止滥用网络端口这类稀缺资源。</p>
<p>◎ 提供默认的计算资源 Requests 以便于系统做出更优化的调度。</p>
<p>• 324．</p>
<h2>第 338 页</h2>
<h3>第5章</h3>
<p>Kubernetes 运维指南</p>
<p>1）创建命名空间</p>
<p>创建名为 quota-example 的命名空间，namespace.yaml 文件的内容如下：</p>
<p>apiversion: v1</p>
<p>kind: Namespace</p>
<p>metadata：</p>
<p>name:quota-example $ kubectl create -f namespace.yaml namespace &quot;quota-example&quot; created 查看命名空间：</p>
<p>$ kubectl get namespaces NAME</p>
<p>STATUS</p>
<p>default</p>
<p>Active</p>
<p>kube-system</p>
<p>Active</p>
<p>quota-example Active 2） 设置限定对象数目的资源配额</p>
<p>通过设置限定对象的数量的资源配额，可以控制以下资源的数量：</p>
<p>◎ 持久存储卷；</p>
<p>◎ 负载均衡器；</p>
<p>© NodePort。</p>
<p>创建名为 object-counts 的 ResourceQuota：</p>
<p>object-counts.yaml：</p>
<p>apiversion:v1</p>
<p>kind:ResourceQuota metadata：</p>
<p>name:object-counts spec：</p>
<p>hard：</p>
<p>persistentvolumeclaims： &quot;2&quot; services.loadbalancers：&quot;2&quot; services.nodeports： &quot;0&quot; $ kubectl create -f object-counts.yaml --namespace=quota-example resourcequota &quot;object-counts&quot; created 配额系统会检测到资源项配额的创建，并且将会统计和限制该命名空间中的资源消耗。</p>
<p>查看该配额是否生效：</p>
<p>$ kubectl describe quota object-counts --namespace=quota-example • 325•</p>
<h2>第 339 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） Name：</p>
<p>Namespace：</p>
<p>Resource</p>
<p>object-counts</p>
<p>quota-example</p>
<p>Used</p>
<p>Hard</p>
<p>persistentvolumeclaims 0 services.loadbalancers 0 services.nodeports 2</p>
<p>2</p>
<p>0</p>
<p>至此，配额系统会自动阻止那些使资源用量超过资源配额限定值的请求。</p>
<p>3）设置限定计算资源的资源配额</p>
<p>下面我们再来创建一项限定计算资源的资源配额，以限制该命名空间中的计算资源的使用 总量。</p>
<p>创建名为 compute-resources 的 ResourceQuota：</p>
<p>apiVersion: v1</p>
<p>kind: ResourceQuota metadata：</p>
<p>name:compute-resources spec：</p>
<p>hard：</p>
<p>pods： &quot;4&quot;</p>
<p>requests.cpu： &quot;1&quot;</p>
<p>requests.memory:1G1 limits.cpu：&quot;2&quot;</p>
<p>limits.memory: 2Gi s kubectl create -f compute-resources.yaml --namespace=quota-example resourcequota &quot;compute-resources&quot; created</p>
<p>查看该配额是否生效：</p>
<p>$ kubectl describe quota compute-resources --namespace=quota-example Name：</p>
<p>compute-resources</p>
<p>Namespace：</p>
<p>quota-example</p>
<p>Resource</p>
<p>Used Hard</p>
<p>----</p>
<p>1imits.cpu</p>
<p>0</p>
<p>2</p>
<p>limits.memory</p>
<p>2Gi</p>
<p>pods</p>
<p>requests.cpu</p>
<p>0</p>
<p>0</p>
<p>4</p>
<p>1</p>
<p>requests.memory</p>
<p>1Gi</p>
<p>配额系统会自动防止该命名空间下同时拥有超过4个非“终止态”的Pod。此外，由于该 项资源配额限制了 CPU 和内存的 Limits 和 Requests 的总量，因此会强制要求该命名空间下的 所有容器都必须显示地定义CPU 和内存的 Limits 和 Requests（可使用默认值，Requests 默认等 • 326•</p>
<h2>第 340 页</h2>
<h3>第5章</h3>
<p>Kubernetes 运维指南</p>
<p>于 Limits）。</p>
<p>4） 配置默认 Requests 和 Limits 在命名空间已经配置了限定计算资源的资源配额的情况下，如果尝试在该命名空间下创建 一个不指定 Requests 和 Limits 的Pod，那么 Pod的创建可能会失败。下面是一个失败的例子。</p>
<p>创建一个 Nginx 的 Deployment：</p>
<p>s kubectl run nginx --image=nginx --replicas=1 --namespace=quota-example deployment &quot;nginx&quot; created 查看创建的Pod，会发现 Pod 没有创建成功：</p>
<p>s kubectl get pods --namespace=quota-example 再查看一下 Deployment 的详细信息：</p>
<p>s kubectl describe deployment nginx --namespace=quota-example Name：</p>
<p>nginx</p>
<p>Namespace：</p>
<p>quota-example</p>
<p>CreationTimestamp：</p>
<p>Mon,06 Jun 2016 16:11:37 -0400 Labels：</p>
<p>run=nginx</p>
<p>Selector：</p>
<p>run=nginx</p>
<p>Replicas：</p>
<p>0 updated | 1 total | 0 available | 1 unavailable</p>
<p>StrategyType：</p>
<p>RollingUpdate</p>
<p>MinReadySeconds ：</p>
<p>0</p>
<p>RollingUpdateStrategy: 1 max unavailable, 1 max surge O1dReplicaSets：</p>
<p>&lt;none&gt;</p>
<p>NewReplicaSet：</p>
<p>nginx-3137573019 （0/1 replicas created） Reason</p>
<p>本 Deployment 尝试创建一个 Pod，但是失败了，查看其中 ReplicaSet 的详细信息：</p>
<p>s kubectl describe rs nginx-3137573019 --namespace=quota-example Name：</p>
<p>nginx-3137573019</p>
<p>Namespace：</p>
<p>quota-example</p>
<p>Image （S）：</p>
<p>nginx</p>
<p>Selector：</p>
<p>pod-template-hash=3137573019,run=nginx Labels：</p>
<p>pod-template-hash=3137573019 run=nginx</p>
<p>Replicas：</p>
<p>0 current / 1 desired Pods Status：</p>
<p>0 Running / 0 Waiting / 0 succeeded / 0 Failed No volumes.</p>
<p>Events：</p>
<p>FirstSeen</p>
<p>LastSeen</p>
<p>Message</p>
<p>Count From</p>
<p>SubobjectPath Type 1---</p>
<p>｛replicaset-controller ｝ warning</p>
<p>FailedCreate Error creating: pods &quot;nginx-3137573019-&quot; is forbidden: Failed quota：</p>
<p>• 327•</p>
<h2>第 341 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） compute-resources : must specify 1imits.cpu, 1imits.memory, requests.cpu,requests.memory 可以看到Pod创建失败的原因：Master 拒绝了这个 ReplicaSet 创建Pod，因这个 Pod 中 没有指定 CPU 和内存的 Requests 和 Limits。</p>
<p>为了避免这种失败，我们可以使用 LimitRange 来为这个命名空间下的所有Pod 提供一个资 源配置的默认值。下面的例子展示了如何为这个命名空间添加一个指定默认资源配置的 LimitRange.</p>
<p>创建一个名为 limits 的 LimitRange：</p>
<p>1imits.yaml：</p>
<p>apiVersion:v1</p>
<p>kind: LimitRange</p>
<p>metadata：</p>
<p>name: 1imits</p>
<p>speC：</p>
<p>limits：</p>
<p>- default：</p>
<p>cpu: 200m</p>
<p>memory: 512Mi</p>
<p>defaultRequest：</p>
<p>cpu:100m</p>
<p>memory: 256Mi</p>
<p>type: Container</p>
<p>$ kubectl create -f limits.yaml --namespace=quota-example limitrange &quot;1imits&quot; created s kubectl describe limits limits --namespace=quota-example Name：</p>
<p>Namespace：</p>
<p>Type</p>
<p>Ratio</p>
<p>limits</p>
<p>quota-example</p>
<p>Resource Min</p>
<p>Max Default Request Default Limit</p>
<p>Max Limit/Request</p>
<p>--</p>
<p>Container memory</p>
<p>-</p>
<p>-</p>
<p>256Mi</p>
<p>512Mi</p>
<p>Container cpu</p>
<p>-</p>
<p>-</p>
<p>100m</p>
<p>200m</p>
<p>-</p>
<p>-</p>
<p>LimitRange 创建成功后，用户在该命名空间下的创建未指定资源配置的Pod 的请求时，系 统会自动为该Pod 设置默认的资源配置。</p>
<p>例如，每个新建的未指定资源配置的Pod 都等价于使用下面的资源配置：</p>
<p>$ kubectl run nginx\ --image=nginx \</p>
<p>--replicas=1\</p>
<p>•328．</p>
<h2>第 342 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>--requests=cpu=100m, memory=256Mi \ --1imits=cpu=200m, memory=512Mi\ --namespace=quota-example 至此，我们已经为该命名空间配置好了默认的计算资源，我们的 ReplicaSet 应该能够创建 Pod了。查看一下，创建 Pod成功了：</p>
<p>$ kubectl get pods --namespace=quota-example NAME</p>
<p>READY</p>
<p>STATUS RESTARTS</p>
<p>nginx-3137573019-fvrig 1/1 Running</p>
<p>0</p>
<p>AGE</p>
<p>6m</p>
<p>接下来，还可以随时查看资源配额的使用情况：</p>
<p>s kubectl describe quota . --namespace=quota-example Name：</p>
<p>compute-resources</p>
<p>Namespace：</p>
<p>quota-example</p>
<p>Resource</p>
<p>used</p>
<p>Hard</p>
<p>limits.cpu</p>
<p>1imits.memory</p>
<p>pods</p>
<p>200m</p>
<p>512Mi</p>
<p>1</p>
<p>2</p>
<p>2Gi</p>
<p>4</p>
<p>requests.cpu</p>
<p>100m</p>
<p>1</p>
<p>requests.memory 256Mi 1Gi</p>
<p>Name：</p>
<p>Namespace：</p>
<p>Resource</p>
<p>object-counts</p>
<p>quota-example</p>
<p>Used</p>
<p>Hard</p>
<p>一-一</p>
<p>persistentvolumeclaims 0 2</p>
<p>services.loadbalancers 0 2</p>
<p>services.nodeports 0</p>
<p>0</p>
<p>可以看到每个 Pod创建时都会消耗掉指定的资源量，而这些使用量都会被 Kubernetes 准确 地跟踪、监控和管理。</p>
<p>S）指定资源配额的作用域</p>
<p>假设我们并不想为某个命名空间配置默认的计算资源配额，而是希望限定在命名空间内运 行的 QoS 为 BestEffort 的Pod 总数，例如将集群中的部分资源用来运行 QoS 为非 BestEffort 的 服务，而将闲置的资源用来运行QoS 为 BestEffort 的服务，即可避免集群的所有资源仅被大量 的 BestEffort Pod 耗尽。这可以通过创建两个资源配额（ResourceQuota）来实现。</p>
<p>首先创建一个名次 quota-scopes 的命名空间：</p>
<p>s kubectl create namespace quota-scopes namespace &quot;quota-scopes&quot; created 创建一个名为 best-effort 的 ResourceQuota， 指定 Scope 为 BestEffort：</p>
<p>• 329•</p>
<h2>第 343 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） apiversion:V1</p>
<p>kind:ResourceQuota metadata：</p>
<p>name:best-effort</p>
<p>spec：</p>
<p>hard：</p>
<p>pods：&quot;10&quot;</p>
<p>scopes：</p>
<p>- BestEffort</p>
<p>$ kubect1 create -f best-effort.yaml --namespace=quota-scopes resourcequota &quot;best-effort&quot; created 再创建一个名为 not-best-effort 的 ResourceQuota，指定 Scope 为 NotBestEffort：</p>
<p>apiVersion:V1</p>
<p>kind: ResourceQuota metadata：</p>
<p>name:not-best-effort spec：</p>
<p>hard：</p>
<p>pods：&quot;4&quot;</p>
<p>requests.cpu： &quot;1&quot;</p>
<p>requests.memory :1Gi limits.cpu： &quot;2&quot;</p>
<p>1imits.memory:2Gi</p>
<p>scopes：</p>
<p>- NotBestEffort</p>
<p>s kubectl create -f not-best-effort.yaml --namespace=quota-scopes resourcequota &quot;not-best-effort&quot; created 查看创建成功的 ResourceQuota：</p>
<p>$ kubect1 describe quota --namespace=quota-scopes Name：</p>
<p>best-effort</p>
<p>Namespace: quota-scopes Scopes：</p>
<p>BestEffort</p>
<p>* Matches a11 pods that have best effort quality of service.</p>
<p>Resource</p>
<p>Used Hard</p>
<p>pods</p>
<p>10</p>
<p>Name：</p>
<p>not-best-effort</p>
<p>Namespace：</p>
<p>quota-scopes</p>
<p>scopes：</p>
<p>NotBestEffort</p>
<p>* Matches a11 pods that do not have best effort quality of service.</p>
<p>Resource</p>
<p>Used Hard</p>
<p>• 330•</p>
<h2>第 344 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>limits.cpu</p>
<p>0</p>
<p>1imits.memory</p>
<p>2</p>
<p>2Gi</p>
<p>pods</p>
<p>0</p>
<p>4</p>
<p>requests.cpu</p>
<p>0</p>
<p>1</p>
<p>requests.memory</p>
<p>0</p>
<p>1Gi</p>
<p>之后，对于没有配置 Requests 的Pod 将会被名次 best-effort 的 ResourceQuota 所限制：而配 置了 Requests 的Pod 会被名为 not-best-effort 的 ResourceQuota 所限制。</p>
<p>创建两个 Deployment：</p>
<p>$ kubectl run best-effort-nginx --image=nginx --replicas=8 --namespace=quota-scopes deployment &quot;best-effort-nginx&quot; created $ kubectl</p>
<p>run not-best-effort-nginx\ --image=nginx\</p>
<p>--replicas=2 \</p>
<p>--requests=Cpu=100m, memory=256Mi \ --1imits=cpu=200m, memory=512Mi \ --namespace=quota-scopes deployment &quot;not-best-effort-nginx&quot; created 名为 best-effort-nginx 的 Deployment 因为没有配置 Requests 和 Limits，所以它的QoS 级别 为 BestEffort，因此它的创建过程由 best-effort 资源配额项来限制，而 not-best-effort 资源配额项 不会对它进行限制。best-effort 资源配额项没有限制 Requests 和 Limits，因此 best-effort-nginx Deployment 可以成功地创建8个 Pod。</p>
<p>名內 not-best-effort-nginx 的Deployment 因为配置了 Requests 和 Limits，且二者不相等，所 以它的 QoS 级别为 Burstable ，因此它的创建过程由 not-best-effort 资源配额项来限制，而 best-effort 资源配额项不会对它进行限制。not-best-effort 资源配额项限制了 Pod 的 Requests 和 Limits 的总上限，not-best-effort-nginx Deployment 并没有超过这个上限，所以可以成功地创建 两个Pod。</p>
<p>查看已经创建的 Pod：</p>
<p>$ kubectI get pods --namespace=quota-scopes NAME</p>
<p>READY</p>
<p>best-effort-nginx-3488455095-2gb41 best-effort-nginx-3488455095-3go7n best-effort-nginx-3488455095-902xg best-effort-nginx-3488455095-eyg40 best-effort-nginx-3488455095-gcs3v best-effort-nginx-3488455095-r98p1 best-effort-nginx-3488455095-udhhd best-effort-nginx-3488455095-zmk12 not-best-effort-nginx-2204666826-7s161 1/1</p>
<p>1/1</p>
<p>1/1</p>
<p>1/1</p>
<p>1/1</p>
<p>1/1</p>
<p>1/1</p>
<p>1/1</p>
<p>1/1</p>
<p>STATUS RESTARTS</p>
<p>Running</p>
<p>0</p>
<p>Running</p>
<p>o</p>
<p>Running</p>
<p>0</p>
<p>Running</p>
<p>Running</p>
<p>0</p>
<p>Running</p>
<p>0</p>
<p>Running</p>
<p>0</p>
<p>Running</p>
<p>0</p>
<p>Running O</p>
<p>AGE</p>
<p>51s</p>
<p>51s</p>
<p>51s</p>
<p>51s</p>
<p>51s</p>
<p>51s</p>
<p>51s</p>
<p>51s</p>
<p>23s</p>
<p>• 331•</p>
<h2>第 345 页</h2>
<p>Kubernetes 权威指：/</p>
<p>从 Docker 到 Kubernetes 买践全接触（第2放） not-best-effort-nginx-2204666826-ke746 1/1 Running</p>
<p>0</p>
<p>可以看到10个 Pod都创建成功。</p>
<p>再看一下两个资源配额项的使用情况：</p>
<p>$ kubectl describe quota --namespace=quota-scopes Name：</p>
<p>best-effort</p>
<p>Namespace：</p>
<p>quota-scopes</p>
<p>Scopes：</p>
<p>BestEffort</p>
<p>* Matches all pods that have best effort quality of service.</p>
<p>Resource</p>
<p>Used Hard</p>
<p>pods</p>
<p>8</p>
<p>10</p>
<p>23s</p>
<p>Name：</p>
<p>Namespace：</p>
<p>Scopes：</p>
<p>Resource</p>
<p>not-best-effort</p>
<p>quota-scopes</p>
<p>NotBestEffort</p>
<p>* Matches all pods that do not have best effort quality of service.</p>
<p>Used</p>
<p>Hard</p>
<p>—--</p>
<p>limits.cpu</p>
<p>1imits.memory</p>
<p>Pods</p>
<p>requests.cpu</p>
<p>requests.memory</p>
<p>400m</p>
<p>2</p>
<p>1Gi</p>
<p>2Gi</p>
<p>2</p>
<p>4</p>
<p>200m</p>
<p>1</p>
<p>512Mi 1Gi</p>
<p>可以看到best-effort 资源配额项已经统计到了 best-effort-nginx Deployment中创建的8个 Pod 的资源使用信息，而 not-best-effort 资源配额项也统计到了 not-best-effort-nginx Deployment 中创 建的两个 Pod 的资源使用信息。</p>
<p>通过这个例子我们可以看到：资源配额的作用域（Scopes）提供了一种将资源集合分割的 机制，这种机制使得集群管理员可以更加方便地监控和限制不同类型对象对于各类资源的使用， 同时能为资源分配和限制提供更大的灵活度和便利性。</p>
<p>6. 资源管理总结</p>
<p>Kubernetes 中的资源管理的基础是容器和 Pod 的资源配置（Requests 和 Limits）。容器的资 源配置（Requests 和 Limits）指定了容器请求的资源和容器能使用的资源上限，而Pod 的资源 配置则是 Pod 中所有容器的资源配置总和的上限。</p>
<p>通过资源配额（Resource Quota）机制，我们可以对命名空间下所有Pod使用资源的总量进 行限制，也可以对这个命名空间中指定类型的对象的数量进行限制。使用作用域可以让资源配 额只对符合特定范围的对象加以限制，因此作用域（Scopes）机制可以使资源配额的策略更加 • 332•</p>
<h2>第 346 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>丰富灵活。</p>
<p>如果我们需要对用户的Pod或容器的资源配置做更多的限制，则我们可以使用资源配置范 围 （LimitRange）来达到这个目的。LimitRange 可以有效地限制Pod 和容器的资源配置的最大、 最小范围，也可以限制 Pod 和容器的 Limits 与 Requests 的最大比例上限，此外 LimitRange 还可 以为 Pod 中的容器提供默认的资源配置。</p>
<p>Kubernetes 基于 Pod 的资源配置 （Requests 和 Limits）实现了资源服务质量（QoS）。不同 QoS级别的Pod在系统中拥有不同的优先级：高优先级的Pod 具有更高的可靠性，可以用于运 行可靠性要求较高的服务；而低优先级的 Pod 可以实现集群资源的超售，能有效地提高集群资 源利用率。</p>
<p>上面的多种机制共同组成了当前版本 Kubernetes 的资源管理体系。这个资源管理体系已经 可以满足大部分资源管理的需求了。同时，Kubernetes 资源管理体系仍然在不停地发展和进化 中，对于一些目前无法满足的更复杂、更个性化的需求，我们可以继续关注 Kubernetes 未来的 发展和变化。</p>
<h3>5.1.5 Kubernetes 集群高可用部署方案</h3>
<p>Kubernetes 作容器应用的管理平台，通过对Pod的运行状况进行监控，并且根据主机或 容器失效的状态将新的Pod 调度到其他 Node 上，实现了应用层的高可用性。针对 Kubernetes 集群，高可用性还应包含以下两个层面的考虑：etcd 数据存储的高可用性和 Kubernetes Master 组件的高可用性。</p>
<p>1．etcd 高可用部署</p>
<p>etcd 在整个 Kuberetes 集群中处于中心数据库的地位，为保证 Kubernetes 集群的高可用性， 首先需要保证数据库不是单故障点。一方面，etcd 需要以集群的方式进行部署，以实现 etcd 数据 存储的冗余、备份与高可用性；另一方面，etcd 存储的数据本身也应考虑使用可靠的存储设备。</p>
<p>etcd集群的部署可以使用静态配置，也可以通过etcd 提供的 REST API 在运行时动态添加、 修改或删除集群中的成员。本节将对 etcd集群的静态配置进行说明。关于动态修改的操作方法 请参考 etcd 官方文档的说明。</p>
<p>首先，规划一个至少3台服务器（节点）的etcd 集群，在每台服务器上安装好 etcd。</p>
<p>部署一个由3 台服务器组成的etcd 集群，其配置如表5.5所示，其集群部署实例如图 5.5 所示。</p>
<p>• 333•</p>
<h2>第 347 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 110.0.0.1</p>
<p>etcd1</p>
<p>10.0.0.2</p>
<p>etcd</p>
<p>集群</p>
<p>etcd2</p>
<p>10.0.0.3</p>
<p>©</p>
<p>etcd3</p>
<p>表5.5 etcd 集群的配置</p>
<p>etcd 实例名称</p>
<p>etcdl</p>
<p>etcd2</p>
<p>etcd3</p>
<p>IP 地址</p>
<p>10.0.0.1</p>
<p>10.0.0.2</p>
<p>10.0.0.3</p>
<p>图 5.5</p>
<p>etcd 集群部署实例</p>
<p>然后修改每台服务器上 etcd 的配置文件/etc/etcd/etcd.conf。</p>
<p>以 etcdl 为创建集群的实例，需要将其 ETCD_INITIAL_CLUSTER_STATE 设置为“new”。</p>
<p>etcd1 的完整配置如下：</p>
<p>#［member］</p>
<p>ETCD_NAME=etcd1</p>
<p>#etcd 实例名称</p>
<p>ETCD</p>
<p>_DATA_DIR=&quot;/var/lib/etcd&quot; #etcd 数据保存目录</p>
<p>ETCD LISTEN</p>
<p>_CLIENT</p>
<p>_URLs=&quot;http://10.0.0.1:2379,http://127.0.0.1:2379&quot; #供外部</p>
<p>客户端使用的 URL</p>
<p>ETCD</p>
<p>_ADVERTISE_CLIENT_URLS=&quot;http://10.0.0.1:2379,http://127.0.0.1:2379&quot; #广</p>
<p>播给外部客户端使用的 URL</p>
<p>#［cluster］</p>
<p>ETCD LISTEN</p>
<p>PEER URLS=&quot;http://10.0.0.1:2380&quot; ETCD_INITIAL_ADVERTISE_PEER_URIS=&quot;http://10.0.0.1:2380&quot; #集群内部通信使用的 URL</p>
<p>#广播给集群内其他成员</p>
<p>访问的 URL</p>
<p>ETCD_INITIAL_CLUSTER=&quot;etcdl=http://10.0.0.1:2380,etcd2=http://10.0.0.2:2380， etcd3=http://10.0.0.3:2380&quot; #初始集群成员列表</p>
<p>ETCD</p>
<p>INITIAL_CLUSTER</p>
<p>_STATE=&quot;new&quot;</p>
<p>#初始集群状态，new 为新建集群</p>
<p>ETCD</p>
<p>_INITTAL_CLUSTER</p>
<p>_TOKEN=&quot;etcd-cluster&quot; #集群名称</p>
<p>启动 etcd1服务器上的etcd 服务：</p>
<p>s systemctl restart etcd 启动完成后，就创建了一个名为 etcd-cluster 的集群。</p>
<p>etcd2 和 etcd3 为加入 etcd-cluster 集群的实例，需要将其 ETCD_INITIAL_CLUSTER_STATE 设置为“exist”。etcd2 的完整配置如下（etcd3 的配置略）：</p>
<p>#［member］</p>
<p>ETCD_NAME=etcd2</p>
<p>#etcd 实例名称</p>
<p>ETCD_DATA_DIR=&quot;/var/1ib/etcd&quot; #etcd 数据保存目录</p>
<p>ETCD LISTEN</p>
<p>L_CLIENT_URLS=&quot;http://10.0.0.2:2379,http://127.0.0.1:2379&quot; #供外部</p>
<p>客户端使用的 URL</p>
<p>ETCD</p>
<p>_ADVERTISE_CLIENT_URLS=&quot;http://10.0.0.2:2379,http://127.0.0.1:2379&quot; #广</p>
<p>播给外部客户端使用的 URL</p>
<p>• 334•</p>
<h2>第 348 页</h2>
<h3>第5章</h3>
<p>Kubernetes 运维指南</p>
<p>#［cluster］</p>
<p>ETCD</p>
<p>_LISTEN</p>
<p>&#x27;_PEER_URLS=&quot;http://10.0.0.2:2380&quot; ETCD_INITIAL_ADVERTISE_PEER_URLS=&quot;http://10.0.0.2:2380&quot; #集群内部通信使用的 URL</p>
<p>#广播给集群内其他成员</p>
<p>使用的 URL</p>
<p>ETCD_INITIAL_CLUSTER=&quot;etcdl=http://10.0.0.1:2380,etcd2=http://10.0.0.2:2380， etcd3=http://10.0.0.3:2380&quot; #初始集群成员列表</p>
<p>ETCD_INITIAL_CLUSTER.</p>
<p>_STATE=&quot;new&quot;</p>
<p>#初始集群状态，new 为新建集群</p>
<p>ETCD</p>
<p>_INITIAL_CLUSTER</p>
<p>_TOKEN=&quot;etcd-cluster&quot; #集群名称</p>
<p>启动 etcd2 和 etcd3 服务器上的 etcd 服务：</p>
<p>s systemctl restart etcd 启动完成后，在任意 etcd 节点执行 etcdctl cluster-health 命令来查询集群的运行状态：</p>
<p>s etcdctl cluster-health cluster is healthy member ce2a822cea30bfca is healthy member acda82balcf790fc is healthy</p>
<p>member</p>
<p>eba209cd0012cd2 is healthy 在任意 etcd 节点上执行 etcdctl member list 命令来查询集群的成员列表：</p>
<p>s etcdctl member list ce2a822cea30bfca:name=default peerURLs=http://10.0.0.1:2380,http://127.0.0.1：</p>
<p>7001 clientURLs=http://10.0.0.1:2379,http://127.0.0.1:2379 acda82balcf790fc:name=default peerURLs=http://10.0.0.2:2380,http://127.0.0.1：</p>
<p>7001 clientURLs=http://10.0.0.2:2379,http://127.0.0.1:2379 eba209cd40012cd2:name=default peerURLs=http://10.0.0.3:2380,http://127.0.0.1：</p>
<p>7001 clientURLs=http://10.0.0.3:2379,http://127.0.0.1:2379 至此，一个 etcd集群就创建成功了。</p>
<p>以 kube-apiserver 为例，将访问etcd 集群的参数设置次：</p>
<p>--etcd-servers=http://10.0.0.1:2379,http://10.0.0.2:2379,http://10.0.0.3:2379 在 etcd 集群成功启动之后，如果需要对集群成员进行修改，则请参考官方文档的详细说明：</p>
<p>https://github.com/coreos/etcd/blob/master/Documentation/runtime-configurati on.md#cluster-reconfiguration-operations.</p>
<p>对于 etcd 中需要保存的数据的可靠性，可以考虑使用 RAID 磁盘阵列、高性能存储设备、 共享存储文件系统，或者使用云服务商提供的存储系统等来实现。</p>
<p>2. Master 高可用部署</p>
<p>在 Kubernetes 系统中，Master 服务扮演着总控中心的角色，主要的三个服务 kube-apiserver、 kube-controller-mansger 和 kube-scheduler 通过不断与工作节点上的 kubelet 和 kube-proxy 进行通 信来维护整个集群的健康工作状态。如果 Master 的服务无法访问到某个 Node，则会将该 Node • 335</p>
<h2>第 349 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 标记为不可用，不再向其调度新建的Pod。但对 Master 自身则需要进行额外的监控，使 Master 不成为集群的单故障点，所以对 Master 服务也需要进行高可用方式的部署。</p>
<p>以 Master 的 kube-apiserver、kube-controller-mansger 和 kube-scheduler 三个服务作为一个部 署单元，类似于 etcd 集群的典型部署配置。使用至少三台服务器安装 Master 服务，并且需要保 证任何时候总有一套 Master 能够正常工作。图5.6展示了一种典型的部署方式。</p>
<p>Master 1</p>
<p>kube-controlier</p>
<p>manster</p>
<p>kube-scheduler</p>
<p>Kube-apiserver</p>
<p>Master 2</p>
<p>Kube-controller，</p>
<p>manster</p>
<p>kube-scheduler</p>
<p>kube-apiserver</p>
<p>Master 3</p>
<p>kube-controller：</p>
<p>manster</p>
<p>kube-schedulor</p>
<p>kube-apiserver</p>
<p>etcd集群</p>
<p>10Q0.1</p>
<p>负载均衡器</p>
<p>（Master访问入口）</p>
<p>elod</p>
<p>煲群</p>
<p>Kubelet</p>
<p>Kube-prox）</p>
<p>Node</p>
<p>［NOQE</p>
<p>wode］</p>
<p>客户端程序</p>
<p>图 5.6 Kubernetes Master 高可用部署架构 Kubernetes 建议 Master 的3个组件都以容器的形式启动，启动它们的基础工具是 kubelet， 所以它们都将以 Static Pod 的形式启动并由 kubelet 进行监控和自动重启。而kubelet 本身的高可 用则通过操作系统来完成，例如使用 Linux 的 Systemd 系统进行管理。</p>
<p>注意，如果之前已运行过这3个进程，则需要先停止它们，然后启动 kubelet 服务，这3个 主进程将通过kubelet 以容器的形式启动和运行。</p>
<p>接下来分别对 kube-apiserver 和 kube-controller-manager、kube-scheduler 的高可用部署进行 说明。</p>
<p>1） kube-apiserver 的高可用部署 根据第2章的介绍，为kube-apiserver 预先创建所有需要的CA证书和基本鉴权文件等内容， 然后在每台服务器上创建其日志文件：</p>
<p># touch /var/log/kube-apiserver.1og 假设 kubelet 的启动参数指定--config=/etc/kubernetes/manifests，即 Static Pod 定义文件所在 的目录，接下来就可以创建 kube-apiserver.yaml 配置文件用于启动 kube-apiserver 了。</p>
<p>• 336•</p>
<h2>第 350 页</h2>
<h3>第5章</h3>
<p>Kubernetes 运维指南</p>
<p>kube-apiserver.yaml apiVersion: v1</p>
<p>kind: Pod</p>
<p>metadata：</p>
<p>name: kube-apiserver spec：</p>
<p>hostNetwork：</p>
<p>true</p>
<p>containers：</p>
<p>- name：</p>
<p>kube-apiserver</p>
<p>gcr.io/google_containers/kube-apiserver: 9680e782e08a1a1c94c656190011bd02 command：</p>
<p>- /bin/sh</p>
<p>- /usr/local/bin/kube-apiserver --etcd-servers=http://127.0.0.1:2379 --admission-control=NamespaceLifecycle, LimitRanger, SecurityContextDeny, Servi ceAccount,ResourceQuota --service-cluster-ip-range=169.169.0.0/16 --v=2 --allow-privileged=False 1&gt;&gt;/var/log/kube-apiserver.log 2&gt;&amp;1 ports：</p>
<p>- containerPort: 443 hostPort: 443</p>
<p>name: https</p>
<p>- containerPort: 7080 hostPort: 7080</p>
<p>name: http</p>
<p>- containerPort: 8080 hostPort: 8080</p>
<p>name: 1ocal</p>
<p>volumeMounts：</p>
<p>- mountPath: /srv/kubernetes name:srvkube</p>
<p>readonly:true</p>
<p>- mountPath: /var/log/kube-apiserver.1og name: logfile</p>
<p>- mountPath: /etc/ssl name: etcssl</p>
<p>readOnly: true</p>
<p>- mountPath: /usr/share/ss1 name: usrsharessl</p>
<p>readOnly:true</p>
<p>- mountPath: /var/ssl name: varssl</p>
<p>readOnly: true</p>
<p>- mountPath: /usr/ssl name: usrssl</p>
<p>readonly: true</p>
<p>• 337•</p>
<h2>第 351 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） - mountPath: /usr/lib/ssl name: usrlibssl</p>
<p>readOnly: true</p>
<p>- mountPath: /usr/local/openssl name: usrlocalopenssl readOnly: true</p>
<p>- mountPath: /etc/openssl name: etcopenssl</p>
<p>readonly: true</p>
<p>- mountPath: /etc/pki/tls name: etcpkitls</p>
<p>readOnly: true</p>
<p>volumes：</p>
<p>- hostPath：</p>
<p>path: /srv/kubernetes name:srvkube</p>
<p>- hostPath：</p>
<p>path: /var/log/kube-apiserver.log name: logfile</p>
<p>- hostPath：</p>
<p>path: /etc/ss1</p>
<p>name: etcssl</p>
<p>- hostPath：</p>
<p>path: /usr/share/ssl name: usrsharessl</p>
<p>- hostPath：</p>
<p>path: /var/ssl</p>
<p>name: varssl</p>
<p>- hostPath：</p>
<p>path: /usr/ssl</p>
<p>name: usrssl</p>
<p>- hostPath：</p>
<p>path: /usr/lib/ssl name: usrlibssl</p>
<p>- hostPath：</p>
<p>path: /usr/local/openssl name: usrlocalopenssl - hostPath：</p>
<p>path: /etc/openssl name: etcopenssl</p>
<p>- hostPath：</p>
<p>path:/etc/pki/tls</p>
<p>name:etcpkitls</p>
<p>其中，</p>
<p>◎ kube-apiserver 需要使用 hostNetwork 模式，即直接使用宿主机网络，以使得客户端能够 • 338</p>
<h2>第 352 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>通过物理机访问其 API。</p>
<p>镜像的 tag 来源于 kubernetes 发布包中的 kube-apiserver.docker_tag 文件：kubernetes/ server/kubernetes-server-linux-amd64/server/bin/kube-apiserver.docker_tag。</p>
<p>◎</p>
<p>--etcd-servers：指定 etcd 服务的URL 地址。</p>
<p>◎ 再加上其他必要的启动参数，包括--admission-control、--service-cluster-ip-range、CA证 书相关配置等内容。</p>
<p>◎端口号的设置都配置了 hostPort，将容器内的端口号直接映射为宿主机的端口号。</p>
<p>将 kube-apiserver.yaml 文件复制到 kubelet 监控的/etc/kubernetes/manifests 目录下，kubelet 将会自动创建 yaml 文件中定义的 kube-apiserver 的Pod。</p>
<p>接下来在另外两台服务器上重复该操作，使得每台服务器上都启动一个 kube-apiserver 的Pod。</p>
<p>2） 为kube-apiserver 配置负载均衡器 至此，我们启动了三个 kube-apiserver 实例，这三个 kube-apiserver 都可以正常工作，我们 需要一个统一的、可靠的、允许部分 Master 节点故障的方式来访问它们，可以通过部署一个负 载均衡器来实现。</p>
<p>在不同的平台下，负载均衡的实现方式不同：在一些公用云比如GCE、AWS、阿里云上都 有现成的实现方案；对于本地集群，我们可以选择硬件或者软件来实现负载均衡，比如 Kubernetes 社区推荐的方案 haproxy 和 keepalived 来实现，其中 haproxy 做负载均衡，而 keepalived 负责对 haproxy 监控和进行高可用。</p>
<p>在完成 API Server 的负载均衡配置之后，对其访问还需要注意以下内容。</p>
<p>如果 Master 开启了安全认证机制，那么需要确保证书中包含负载均衡服务节点的IP。</p>
<p>◎ 对于外部的访问，比如通过kubectl 访问 API Server，那么需要配置访问 API Server 对应的负载均衡器的IP 地址。</p>
<p>3） kube-controller-manager 和 kube-scheduler 的高可用配置 不同于 API Server,Master 中另外两个核心组件 kube-controller-manager 和 kube-scheduler 会修改集群的状态信息，因此对于 kube-controller-manager 和 kube-scheduler 而言，高可用不仅 意味着需要启动多个实例，还需要这多个实例能实现选举并选举出 leader，以保证同一时间只 有一个实例可以对集群状态信息进行读写，避免出现同步问题和一致性问题。Kubernetes 对于 这种选举机制的实现是采用租赁锁（lease-lock）来实现的，我们可以通过在kube-controller- manager 和 kube-scheduler 的每个实例的启动参数中设置--leader-elect=true，来保证同一时间只 会运行一个可修改集群信息的实例。</p>
<p>• 339</p>
<h2>第 353 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） Scheduler 和 Controller Manager 高可用的具体实现方式如下。</p>
<p>首先在每个 Master 节点上创建相应的日志文件：</p>
<p>#touch /var/1og/kube-scheduler.1og # touch /var/log/kube-controller-manager.1og 然后创建 kube-controller-manager 和 kube-scheduler 的Pod 定义文件：</p>
<p>kube-controller-manager.yaml：</p>
<p>apiVersion: V1</p>
<p>kind: Pod</p>
<p>metadata：</p>
<p>name: kube-controller-manager spec：</p>
<p>hostNetwork: true</p>
<p>containers：</p>
<p>- name: kube-controller-manager image:gcr.io/google_containers/kube-controller-manager：</p>
<p>Eda24638d51a48baa13c35337fcd4793 command：</p>
<p>- /bin/sh</p>
<p>--C</p>
<p>- /usr/local/bin/kube-controller-manager --master=127.0.0.1:8080 --V=2 --leader-elect=true 1&gt;&gt;/var/log/kube-controller-manager.log 2&gt;&amp;1 livenessProbe：</p>
<p>httpGet：</p>
<p>path:/healthz</p>
<p>Port: 10252</p>
<p>initialDelaySeconds: 15 timeoutSeconds: 1</p>
<p>volumeMounts：</p>
<p>- mountPath: /srv/kubernetes name: srvkube</p>
<p>readOnly: true</p>
<p>- mountPath: /var/log/kube-controller-manager.log name: logfile</p>
<p>- mountPath: /etc/ssl name: etcssl</p>
<p>readOnly: true</p>
<p>- mountPath: /usr/share/ssl name: usrsharessl</p>
<p>readOnly: true</p>
<p>- mountPath: /var/ssl name: varssl</p>
<p>readOnly: true</p>
<p>- mountPath: /usr/ssl name: usrssl</p>
<p>• 340•</p>
<h2>第 354 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>readOnly:true</p>
<p>- mountPath: /usr/lib/ssl name: usrlibssl</p>
<p>readOnly: true</p>
<p>- mountPath: /usr/local/openss1 name: usrlocalopenssl readOnly: true</p>
<p>- mountPath: /etc/openssl name: etcopenssl</p>
<p>readOnly:true</p>
<p>- mountPath: /etc/pki/tls name:etcpkitls</p>
<p>readOnly: true</p>
<p>volumes：</p>
<p>- hostPath：</p>
<p>path: /srv/kubernetes name: srvkube</p>
<p>- hostPath：</p>
<p>path: /var/log/kube-controller-manager.1og name: logfile</p>
<p>- hostPath：</p>
<p>path: /etc/ssl</p>
<p>name: etcssl</p>
<p>- hostPath：</p>
<p>path: /usr/share/ssl name: usrsharessl</p>
<p>- hostPath：</p>
<p>path:/var/ssl</p>
<p>name:varssl</p>
<p>- hostPath：</p>
<p>path: /usr/ssl</p>
<p>name: usrssl</p>
<p>- hostPath：</p>
<p>path: /usr/lib/ss1 name: usrlibssl</p>
<p>- hostPath：</p>
<p>path: /usr/local/openssl name: usrlocalopenss1 - hostPath：</p>
<p>path: /etc/openssl name: etcopenssl</p>
<p>- hostPath：</p>
<p>path: /etc/pki/tls name:etcpkitls</p>
<p>• 341•</p>
<h2>第 355 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 其中，</p>
<p>f kube-controller-manager 需要使用hostNetwork 模式，即直接使用宿主机网络。</p>
<p>镜像的tag来源于 kubemetes 发布包中的kube-controller-manager.docker_tag 文件：kubernetes/ server/kubernetes-server-linux-amd64/server/bin/kube-controller-manager.docker_tag。</p>
<p>--master： 指定 kube-apiserver 服务的URL地址。</p>
<p>（②</p>
<p>--leader-elect=true：使用leader 选举机制。</p>
<p>kube-scheduler.yaml：</p>
<p>apiVersion: v1</p>
<p>kind: Pod</p>
<p>metadata：</p>
<p>name: kube-scheduler SpeC：</p>
<p>hostNetwork : true containers：</p>
<p>- name: kube-scheduler image：</p>
<p>gcr.io/google_containers/kube-scheduler:34d0b8f8b31e27937327961528739bc9 command：</p>
<p>-/bin/sh</p>
<p>--C</p>
<p>- /usr/local/bin/kube-scheduler --master=127.0.0.1:8080 --v=2 --leader-elect=true 1&gt;&gt;/var/log/kube-scheduler.log 2&gt;&amp;1</p>
<p>livenessProbe：</p>
<p>httpGet：</p>
<p>path: /healthz</p>
<p>port: 10251</p>
<p>initialDelaySeconds: 15 timeoutSeconds: 1</p>
<p>volumeMounts：</p>
<p>- mountPath:/var/log/kube-scheduler.10g name: logfile</p>
<p>- mountPath: /var/run/secrets/kubernetes.io/serviceaccount name: default-token-s8ejd readonly: true</p>
<p>volumes：</p>
<p>- hostPath：</p>
<p>path: /var/log/kube-scheduler.log name: logfile</p>
<p>其中，</p>
<p>◎ kube-scheduler 需要使用 hostNetwork 模式，即直接使用宿主机网络。</p>
<p>• 342•</p>
<h2>第 356 页</h2>
<h3>第5章</h3>
<p>Kubernetes 运维指南</p>
<p>3 镜像的 tag 来源于 kubernetes 发布包中的kube-scheduler. docker_tag 文件：kubernetes/server/ kubernetes-server-linux-amd64/server/bin/kube-scheduler.docker_tago --master：指定 kube-apiserver 服务的 URL地址。</p>
<p>◎</p>
<p>--leader-elect-true：使用leader 选举机制。</p>
<p>将这两个 yaml 文件复制到 kubelet 监控的/etc/kubernetes/manifests 目录下，kubelet 将会自动 创建 yaml 文件中定义的 kube-controller-manager 和 kube-scheduler 的 Pod。</p>
<p>至此，我们完成了 Kubernetes Master 组件高可用的完整配置，配合 etcd 存储的高可用，整 个Kubernetes 集群的高可用已经全部完成。最后，只需要确认集群中所有访问 API Server 的地 方都已经将访问地址修改为负载均衡的地址，就可以保证集群高可用的正常工作了。</p>
<p>3. Master 高可用架构的演进 在当前的版本中，kubelet 可以设置“--api-servers”启动参数来指定多个 kube-apiserver，但 是当第1个 kube-apiserver 不可用之后，kubelet 无法连接到后面的 kube-apiserver，也就是说只有 第1个 kube-apiserver 起作用。如果这个问题得到解决，则 kubelet 无须通过额外的负载均衡器 就能连接到多个 API Server 了。</p>
<p>另外，除了 kubelet，其他核心组件 kube-controller-manager、kube-scheduler 和 kube-proxy 都需要配置 kube-apiserver，目前它们的启动参数“--master” 仅支持配置一个 kube-apiserver， 还无法支持多个 kube-apiserver 的配置。</p>
<p>Kubernetes 计划在后续的版本中支持多个 Master 的配置，实现不需要负载均衡器的 Master 高可用架构。</p>
<h3>5.1.6 Kubernetes 集群监控</h3>
<p>1.</p>
<p>通过 cAdvisor 页面查看容器的运行状态 开源软件 cAdvisor （Container Advisor）是用于监控容器运行状态的利器之一（cAdvisor 项 目的主页次 https://github.com/google/cadvisor），它被用于多个与 Docker 相关的开源项目中。</p>
<p>在 Kubernetes 系统中，cAdvisor 已被默认集成到了 kubelet 组件内，当kubelet 服务启动时， 它会自动启动 cAdvisor 服务，然后cAdvisor 会实时采集所在节点的性能指标及在节点上运行的 容器的性能指标。kubelet 的启动参数--cadvisor-port 可自定义cAdvisor 对外提供服务的端口号， 默认为 4194。</p>
<p>cAdvisor 提供了 Web 页面可供浏览器访问。例如 Kubernetes 集群中的一个 Node 的IP 地址 • 343•</p>
<h2>第 357 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 是 192.168.18.3，则在浏览器中输入网址 htp://192.168.18.3:4194 来访问 cAdvisor 的监控页面。</p>
<p>cAdvisor 的主页显示了主机的实时运行状态，包括CPU 使用情况、内存使用情况、网络吞吐量 及文件系统使用情况等信息。</p>
<p>图 5.7展示了cAdvisor 的几个性能监控页面。</p>
<p>Usage</p>
<p>態）</p>
<p>CAdvisor</p>
<p>1606</p>
<p>Subcortaners</p>
<p>28:6</p>
<p>：06</p>
<p>275,000</p>
<p>下午i的分</p>
<p>K午0210N</p>
<p>K年81820</p>
<p>下午11:838</p>
<p>310</p>
<p>0229</p>
<p>an。：</p>
<p>图5.7 主机的性能监控页面</p>
<p>通过 Docker Containers 链接可以查看容器列表及每个容器的性能数据，如图5.8所示。</p>
<p>Docker Containers</p>
<p>Driwe Stans</p>
<p>iw</p>
<p>图 5.8</p>
<p>容器的性能监控页面</p>
<p>• 344•</p>
<h2>第 358 页</h2>
<h3>第5章</h3>
<p>Kubernetes 运维指南</p>
<p>此外，cAdvisor 也提供了 RESTAPI 供客户端远程调用，主要是为了定制开发，API 返回的 数据格式为 JSON，可以采用如下 URL 来访问：</p>
<p>http://&lt;hostname&gt;：&lt;port&gt;/api/&lt;version&gt;/&lt;request&gt; 例如，通过 URL http://192.168.18.3:4194/api/v1.3/machine 可以获取主机的相关信息：</p>
<p>｛</p>
<p>&quot;num_cores&quot;：2，</p>
<p>&quot;cpu_frequency_khz&quot; ： 2793544， &quot;&#x27;memorY_capacity&quot;：1915408384， &quot;machine_id&quot;：&quot;0f6233d8256a4ec1a673640e04b8344a&quot;， “system_uuid&quot;：&quot;564D188F-8E82-21C0-6E89-176E2C51EBB5&quot;， &quot;boot_id&quot;：&quot;a03d00d8-ca9c-4d74-a674-ebf5dfbc69d9&quot;， &quot;filesystems&quot;：［</p>
<p>&quot;device&quot;：&quot;/dev/mapper/rhel-root&quot;， &quot;capacity&quot; ：18746441728 &quot;device&quot;： &quot;/dev/sda1&quot;， &quot;capacity&quot; ： 520794112 ｝</p>
<p>〕，</p>
<p>&quot;disk_map&quot;：｛</p>
<p>&quot;253:0&quot;：｛</p>
<p>&quot;name&quot; ：&quot; dm-0&quot;，</p>
<p>&quot;major&quot;：253，</p>
<p>&quot;minor&quot;：0，</p>
<p>&quot;&#x27;size&quot; ：2147483648， &quot;scheduler&quot;： &quot;none&quot; ｝，</p>
<p>｝</p>
<p>&quot;network_devices&quot;：［ &quot;name&quot; ：&quot;eno16777736&quot;， &quot;mac_address&quot; ： &quot;00:0c:29:51:eb:b5&quot;， &quot;&#x27;speed&quot; ： 1000，</p>
<p>&quot;mtu&quot;：1500</p>
<p>｝</p>
<p>〕，</p>
<p>&quot;topology&quot;：［</p>
<p>｛</p>
<p>&quot;node_id&quot;：0，</p>
<p>&quot;memory&quot;： 2146947072， &quot;cores&quot;：［</p>
<p>｛</p>
<p>• 345</p>
<h2>第 359 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） &quot;core_id&quot;：0，</p>
<p>&quot;thread_ids&quot;：［</p>
<p>2cachesg&quot;；noL）</p>
<p>〕，</p>
<p>&quot;caches&quot;：［</p>
<p>｛</p>
<p>&quot;&#x27;size&quot;： 6291456，</p>
<p>&quot;type&quot; ： &quot;Unified&quot;， &quot;level&quot;：3</p>
<p>｝</p>
<p>｝</p>
<p>通过下面的 URL 则可以获取节点上最新（1分钟内）的容器的性能数据：http://192.168.1.</p>
<p>129:4194/api/v1.3/subcontainers/system.slice/docker-5015dSc7ef72b98627332fabd031251cbd3f1914 18500f7aec6b995039966led.scope。</p>
<p>结果力：</p>
<p>［</p>
<p>｛</p>
<p>&quot;name&quot;：&quot;/system.slice/docker-5015d5c7ef72b98627332fabd031251cbd3f191418500f7 aec6b995039966led.scope&quot;， &quot;aliases&quot;：［</p>
<p>&quot;k8s_master.f8a6f6df_Redis-master-6okig_default_9c428d4f-4167-11e5-afe7-000c 2921ba71</p>
<p>5dce2f85&quot;，</p>
<p>&quot;5015d5c7ef72b98627332fabd031251cbd3f191418500f7aec6b995039966led&quot; ］、</p>
<p>&quot;namespace&quot;：&quot;docker&quot;， &quot;spec&quot;：｛</p>
<p>&quot;creation_time&quot; ： &quot;2015-08-17T08:44:27.4011225022&quot;， &quot;labels&quot;：｛</p>
<p>&quot;io.kubernetes.pod.name&quot; ：&quot;default/Redis-master-6okig&quot; ｝，</p>
<p>&quot;has_cpu&quot; ：true，</p>
<p>&quot;cpu&quot;：｛</p>
<p>&quot;limit&quot;：2，</p>
<p>&quot;max_</p>
<p>limit&quot;：0，</p>
<p>&quot;mask&quot;：&quot;0-1&quot;</p>
<p>｝，</p>
<p>&quot;has_memory&quot; ：true， • 346•</p>
<h2>第 360 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>&quot;memory&quot;：｛</p>
<p>&quot;1imit&quot;：18446744073709552000， &quot;swap_limit&quot;：18446744073709552000 &quot;&#x27;has_network&quot; ：true， &quot;has_filesystem&quot;：false， &quot;has_diskio&quot; ：true ｝，</p>
<p>&quot;stats&quot;：「</p>
<p>｛</p>
<p>&quot;timestamp&quot;：&quot;2015-08-18T00:54:26.167988505+08:00&quot;， &quot;cpu&quot;：｛</p>
<p>&quot;usage&quot;： ｛</p>
<p>&quot;total&quot;：43121463207， &quot;per_cpu_usage&quot; ：［ 21578091763，</p>
<p>21543371444</p>
<p>&quot;user&quot;： 410000000， &quot;system&quot;：13620000000 ｝，</p>
<p>&quot;load_average&quot;：0</p>
<p>｝，</p>
<p>&quot;diskio&quot;：｛</p>
<p>&quot;io_service_bytes&quot;：［ ｛</p>
<p>&quot;major&quot;：253，&quot;minor&quot;：14， &quot;stats&quot;：｛</p>
<p>&quot;Async&quot;：8036352， &quot;Read&quot; ：8036352， &quot;Sync&quot;：0， &quot;Total&quot; ：8036352， &quot;Write&quot;：0 ］，</p>
<p>&quot;1o_serviced&quot;：［</p>
<p>&quot;major&quot;：8，</p>
<p>&quot;minor&quot;：0，</p>
<p>&quot;stats&quot;：｛</p>
<p>&quot;Async&quot;：0，</p>
<p>&quot;memory&quot;：｛</p>
<p>&quot;usage&quot; ： 16748544， &quot;working_set&quot;： 9297920， &quot;container data&quot; ：｛ &quot;pgfault&quot;：882，</p>
<p>&quot;&#x27;pgmajfault&quot;：8</p>
<p>• 347</p>
<h2>第 361 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） ｝</p>
<p>&quot;hierarchical_data&quot;：1 &quot;pgfault&quot;：882，</p>
<p>&quot;pgmajfault&quot;：8</p>
<p>&quot;network&quot;：｛</p>
<p>&quot;name&quot;：&quot;&quot;，</p>
<p>&quot;rx_bytes&quot;：0，&quot;rx_packets&quot;：0， &quot;rx_errors&quot;：0， &quot;rx_dropped&quot;：0， &quot;tx_bytes&quot; ：0， &quot;tx_pa ckets&quot;：0，&quot;tx_errors&quot;：0，&quot;tx_dropped&quot;：0 ｝</p>
<p>&quot;task_stats&quot; ： ｛</p>
<p>&quot;nr_sleeping&quot;：0，&quot;nr_running&quot;：0，&quot;nr_stopped&quot;：0，&quot;nr_uninterruptible&quot;：0，&quot;nr_io- wait&quot;：0</p>
<p>••••••</p>
<p>］</p>
<p>容器的性能数据对于集群监控非常有用，系统管理员可以根据cAdvisor 提供的数据进行分 析和告警。不过，由于 cAdvisor 是在每台 Node 上运行的，只能采集本机的性能指标数据，所 以系统管理员需要对每台 Node 主机单独监控。</p>
<p>针对大型集群，Kubernetes 建议使用几个开源软件组成的集成解决方案来实现对整个集群 的监控。这些开源软件包括 Heapster、InfluxDB 及 Grafana 等。</p>
<p>2. Heapster+Influxdb+Grafana 集群性能监控平台搭建 根据前面的说明，cAdvisor 集成在kubelet 中，运行在每个 Node 上，所以一个 cAdvisor 仅 能对一台Node 进行监控。在大规模容器集群中，需要对所有 Node 和全部容器进行性能监控， Kubernetes 建议使用一套工具来实现集群性能数据的采集、存储和展示：Heapster、InfluxDB 和 Grafana。</p>
<p>Heapster：对集群中各 Node上 cAdvisor 的数据采集汇聚的系统，通过访问每个 Node 上 kubelet 的API，再通过kubelet 调用cAdvisor 的API 来采集该节点上所有容器的性 能数据。Heapster 对性能数据进行聚合，并将结果保存到后端存储系统中。Heaspter 支持多种后端存储系统，包括 memory（保存在内存中）、InfluxDB、BigQuery、谷歌 云平台提供的 Google Cloud Monitoring（https://cloud.google.com/monitoring/）和 Google Cloud Logging （https://cloud.google.com/logging/）等。Heapster 项目的主页为 https:// github.com/kubernetes/heapster。</p>
<p>• 348•</p>
<h2>第 362 页</h2>
<h3>第5章</h3>
<p>Kubernetes 运维指南</p>
<p>InfluxDB：是分布式时序数据库（每条记录都带有时间戳属性），主要用于实时数据采 集、事件跟踪记录、存储时间图表、原始数据等。InfluxDB 提供了 REST API 用于数 据的存储和查询。InfluxDB 的主页为 http://influxdb.com。</p>
<p>Grafana：通过 Dashboard 将InfluxDB 中的时序数据展现成图表或曲线等形式，便于运 维人员查看集群的运行状态。Grafana 的主页为 http://grafana.org。</p>
<p>基于 heapster+influxdb+grafana 的集群监控系统总体架构如图5.9所示。</p>
<p>Kubernetes</p>
<p>Master</p>
<p>使染Node烈表</p>
<p>heapster</p>
<p>grafana</p>
<p>intiuxao</p>
<p>Node</p>
<p>Kubelet</p>
<p>CAgVsot</p>
<p>Kuoeles</p>
<p>cAcvisor：</p>
<p>Node</p>
<p>Node</p>
<p>图5.9</p>
<p>Heapster 集群监控系统架构图 Heapster、InfluxDB 和 Grafana 均以 Pod 的形式启动和运行。由于 Heapster 需要与 Kubernetes Master 进行安全连接，所以需要设置Master 的CA证书安全策略（参见第2章的说明）。</p>
<p>1） 部署 Heapster、InfluxDB、Grafana 容器应用 先创建它们的 Service：</p>
<p>heapster-service.yaml apiVersion: v1</p>
<p>kind: Service</p>
<p>metadata：</p>
<p>labels：</p>
<p>kubernetes.io/cluster-service： &quot;true&quot; kubernetes.io/name: Heapster name: heapster</p>
<p>namespace: kube-system SpeC：</p>
<p>ports：</p>
<p>- port: 80</p>
<p>targetPort: 8082</p>
<p>selector：</p>
<p>k8s-app: heapster</p>
<p>• 349•</p>
<h2>第 363 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） influxdb-service.yaml apiVersion:v1</p>
<p>kind: Service</p>
<p>metadata：</p>
<p>labels: null</p>
<p>name: monitoring-InfluxDB namespace: kube-system spec：</p>
<p>type:NodePort</p>
<p>ports：</p>
<p>-name: http</p>
<p>Port：</p>
<p>8083</p>
<p>targetPort: 8083</p>
<p>nodePort: 8083</p>
<p>- name: api</p>
<p>port : 8086</p>
<p>targetPort : 8086</p>
<p>nodePort: 8086</p>
<p>selector：</p>
<p>name: influxGrafana 注意，这里使用type=NodePort 将 InfluxDB 暴簬在宿主机 Node 的端口上，以便我们使用 浏览器对其进行访问。</p>
<p>grafana-service.yaml apiVersion:v1</p>
<p>kind: Service</p>
<p>metadata：</p>
<p>Labels：</p>
<p>kubernetes.io/name: monitoring-Grafana kubernetes.io/cluster-service：&quot;true&quot; name:monitoring-Grafana namespace:kube-system spec：</p>
<p>tyPe: NodePort</p>
<p>ports：</p>
<p>- port: 80</p>
<p>targetPort: 8080</p>
<p>nodePort：</p>
<p>8085</p>
<p>selector：</p>
<p>name: influxGrafana 同样，使用 type=NodePort 将Grafana 暴露在Node 的端口上，以便客户端的浏览器对其 进行访问。</p>
<p>使用 kubectl create 命令创建 Services：</p>
<p>• 350</p>
<h2>第 364 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>$ kubectl create -f heapster-service.yaml $ kubectl</p>
<p>create -f</p>
<p>InfluxDB-service.yaml $ kubect1</p>
<p>create -f Grafana-service.yaml 在创建 heapster 容器之前，先创建 InfluxDB 和 Grafana 的RC，这两个容器将运行在同一个 Pod 中：</p>
<p>influxdb-grafana-controller-v3.yaml apiVersion: v1</p>
<p>kind:ReplicationController metadata：</p>
<p>name: monitoring-influxdb-grafana-v3 namespace: kube-system labels：</p>
<p>k8s-app: influxGrafana version: v3</p>
<p>kubernetes.io/cluster-service：</p>
<p>&quot;true&quot;</p>
<p>Sppec：</p>
<p>replicas: 1</p>
<p>selector：</p>
<p>k8s-app: influxGrafana version: v3</p>
<p>template：</p>
<p>metadata：</p>
<p>labels：</p>
<p>k8s-app: influxGrafana version: v3</p>
<p>kubernetes.io/cluster-service：&quot;true&quot; containers：</p>
<p>- image:gcr.io/google_containers/heapster_influxdb:v0.5 name: influxdb</p>
<p>resourCeS：</p>
<p># keep request = limit to keep this container in guaranteed class 1imits：</p>
<p>cpu:100m</p>
<p>memory: 500Mi</p>
<p>reguests：</p>
<p>cpu:100m</p>
<p>memory: 500Mi</p>
<p>PortS：</p>
<p>- containerPort: 8083 - containerPort: 8086 volumeMounts：</p>
<p>- name: influxdb-persistent-storage mountPath: /data</p>
<p>•</p>
<p>• 351•</p>
<h2>第 365 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） - image: gcr.io/google_containers/heapster_grafana:v2.6.0-2 name: grafana</p>
<p>limits：</p>
<p>cpu:100m</p>
<p>memory:100Mi</p>
<p>requests：</p>
<p>cpu:100m</p>
<p>memory: 100Mi</p>
<p># This variable is required to setup templates in Grafana.</p>
<p>- name: TNFLUXDB_SERVICE_URL value: http://monitoring-influxdb:8086 # The following env variables are required to make Grafana accessible via</p>
<p># the kubernetes api-server proxY. On production clusters,we recommend</p>
<p># removing these env variables, setup auth for grafana,and expose the grafana</p>
<p>#service using</p>
<p>a LoadBalancer or a public IP.</p>
<p>- name: GF</p>
<p>_AUTH_BASIC_ENABLED value：&quot;falsem</p>
<p>-name: GF_AUTH_ANONYMOUS_ENABLED value：&quot;true&quot;</p>
<p>-name:GF_AUTH</p>
<p>L_ANONYMOUS</p>
<p>_ORG_ROLE</p>
<p>value: Admin</p>
<p>-name:GF_SERVER_ROOT_URL value：</p>
<p>/api/v1/proxy/namespaces/kube-system/services/monitoring-grafana/ volumeMounts：</p>
<p>- name: grafana-persistent-storage mountPath:/var</p>
<p>vOlumes：</p>
<p>- name: influxdb-persistent-storage emptyDir:0｝</p>
<p>- name: grafana-persistent-storage emptyDir：｛｝</p>
<p>注意，Grafana 容器环境变量 INFLUXDB_SERVICE_URL 设置为 InfluxDB服务的所在地址。</p>
<p>由于 Grafana 与 InfluxDB 处于同 一个 Pod 中，所以 Grafana 使用127.0.0.1 或localhost 也可以访 问到 InfluxDB 服务。</p>
<p>使用kubectl create 命令创建该 RC：</p>
<p>s kubect1 create -f influxdb-grafana-controller-v3.yaml 通过 kubectl get pods --namespace=kube-system 确认 Pod 成功启动：</p>
<p>• 352•</p>
<h2>第 366 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p># kubectl get pods --namespace=kube-system monitoring-influxdb-grafana-v3-uu730 READY</p>
<p>2/2</p>
<p>STATUS</p>
<p>Running</p>
<p>创建 heapster 容器，v1.1.0版本的 heapster 由4个容器组合为一个 Pod：</p>
<p>RESTARTS</p>
<p>AGE</p>
<p>4m</p>
<p>heapster-controller-v1.1.0.yaml apiVersion: extensions/vlbetal kind: Deployment</p>
<p>metadata：</p>
<p>name: heapster-vl.1.0 namespace: kube-system labels：</p>
<p>k8s-app: heapster</p>
<p>kubernetes.io/cluster-service：</p>
<p>&quot;true&quot;</p>
<p>version: v1.1.0</p>
<p>Spec：</p>
<p>replicas: 1</p>
<p>selector：</p>
<p>matchLabels：</p>
<p>k8s-app: heapster</p>
<p>version: v1.1.0</p>
<p>template：</p>
<p>metadata：</p>
<p>labels：</p>
<p>k8s-app: heapster</p>
<p>version: v1.1.0</p>
<p>speC：</p>
<p># 4 containers,2 heapsters, 2 resizer</p>
<p>containers：</p>
<p>- image: gcr.io/google_containers/heapster:v1.1.0 name: heapster</p>
<p>resources：</p>
<p>#keep</p>
<p>request = limit to keep this container in guaranteed class 1imits：</p>
<p>cpu: 100m</p>
<p>memory: 200Mi</p>
<p>requests：</p>
<p>cpu: 100m</p>
<p>memory: 200Mi</p>
<p>command：</p>
<p>- /heapster</p>
<p>---source=kubernetes. sumary_api： &#x27;192.168.18.3:8080&#x27; - --sink=influxdb:http://monitoring-influxdb:8086 ---metric_resolution=60s - image: gcr.io/google_containers/heapster:V1.1.0 • 353•</p>
<h2>第 367 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） resourCes：</p>
<p># keep request = 1imit to keep this container in guaranteed class limits：</p>
<p>cpu:100m</p>
<p>memory:200Mi</p>
<p>requests：</p>
<p>cpu:100m</p>
<p>memory:200Mi</p>
<p>command：</p>
<p>- /eventer</p>
<p>- --source=kubernetes：&#x27;192.168.18.3:8080&#x27; - --sink=influxdb:http://monitoring-influxdb: 8086 - image:gcr.io/google_containers/addon-resizer:1.3 name:heapster-nanny resourceS：</p>
<p>Limits：</p>
<p>Cpu：</p>
<p>50m</p>
<p>memory: 100Mi</p>
<p>requests：</p>
<p>cpu:50m</p>
<p>memory: 100Mi</p>
<p>env：</p>
<p>- name: MY_POD_NAME valueFrom：</p>
<p>fieldRef：</p>
<p>fieldPath: metadata.name - name: MY</p>
<p>_POD_NAME SPACE</p>
<p>valueFrom：</p>
<p>fieldRef：</p>
<p>fieldPath : metadata.namespace command：</p>
<p>- /pod</p>
<p>_nanny</p>
<p>---cpu=100m</p>
<p>--extra-cpu=0m</p>
<p>---memory=200Mi</p>
<p>- --extra-memory=4Mi ---threshold=5</p>
<p>--deployment=heapster-v1.1.0 --container=heapster - --pol1-period=300000 --estimator=exponential - image: gcr.io/google_containers/addon-resizer:1.3 name: eventer-nanny resourceS：</p>
<p>limits：</p>
<p>Cpu：</p>
<p>50m</p>
<p>memory: 100Mi</p>
<p>• 354•</p>
<h2>第 368 页</h2>
<h3>第5章</h3>
<p>Kubernetes 运维指南</p>
<p>requests：</p>
<p>cpu: 50m</p>
<p>memory: 100Mi</p>
<p>env：</p>
<p>-name: MY_POD_NAME valueFrom：</p>
<p>fieldRef：</p>
<p>fieldPath: metadata.name -name: MY_POD_NAMESPACE valueFrom：</p>
<p>fieldRef：</p>
<p>fieldPath: metadata.namespace command：</p>
<p>-/pod_nanny</p>
<p>---Cpu=100m</p>
<p>- --extra-cpu=0m</p>
<p>- --memory=200Mi</p>
<p>- --extra-memorY=500Ki - --threshold=5</p>
<p>- --deployment=heapster-v1.1.0 - --container=eventer - --estimator=exponential Heapster 需要设置的启动参数如下。</p>
<p>（1） -source</p>
<p>配置采集来源， Master URL 地址：</p>
<p>--source=kubernetes.summarY_api：&#x27;192.168.18.3:8080&#x27; （2） -sink</p>
<p>配置后端存储系统，使用 InfluxDB 系统：</p>
<p>--sink=InfluxDB:http://monitoring-InfluxDB:8086 （3）--metric _resolution 性能指标的精度，60s表示将过去60秒的数据进行汇聚再进行存储。</p>
<p>其他参数可以通过进入 heapster 容器执行 #heapster--help 命令查看和设置。</p>
<p>注意，URL 中的主机名地址使用的是 InfluxDB 的 Service 名字，这需要 DNS服务正常工作， 如果没有配置 DNS 服务，则也可以使用 Service 的 ClusterIP 地址。</p>
<p>值得说明的是，InfluxDB 服务的名称没有加上命名空间，是因为 Heapster 服务与 InfluxDB 服务属于相同的命名空间 kube-system。当然，使用带上命名空间的全服务名也是可以的，例如 http://monitoring-influxdb.kube-system:8086。</p>
<p>•355•</p>
<h2>第 369 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 使用 kubectl create 命令完成创建该 RC：</p>
<p>s kubectl create -f heapster-controller-v1.1.0.yaml 通过 kubectl get pods --namespace=kube-system 确认 Pod 成功启动：</p>
<p># kubectl get deployment --namespace=kube-system NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS</p>
<p>AGE</p>
<p>heapster-v1.1.0-1895667918-guisl 4/4</p>
<p>Running 0</p>
<p>3m</p>
<p>查看 heapster 的日志，</p>
<p>确保 heapster 成功在 influxdb 数据库中创建名为k8s 的数据库：</p>
<p># kubect1 logs heapster-v1.1.0-1895667918-guisl -c heapster --namespace=kube-system I0706 09:36:15.313587 1 heapster.go: 65］ /heapster</p>
<p>--source=kubernetes.sunmary_api：&#x27;192.168.18.3:8080&#x27; --sink=influxdb:http://monitoring-influxdb:8086 --metric_resolution=60s I0706 09:36:15.313849 1 heapster.go: 66］ Heapster version 1.1.0 I0706 09:36:15.314347 1 configs.go: 60］ Using Kubernetes client with master &quot;https://169.169.0.1:443&quot; and version &quot;v1&quot; I0706 09:36:15.314371 1 configs.go: 61］ Using kubelet port 10255 I0706 09:36:15.512107 1 influxdb.go:223］ created influxdb sink with options：</p>
<p>host:monitoring-influxdb:8086 user:root db:k8s I0706 09:36:15.512154 1 heapster.go:92］ Starting with InfluxDB Sink I0706 09:36:15.512163 1 heapster.go:92］ Starting with Metric Sink I0706 09:36:16.414060 1 heapster.go:171］ Starting heapster on port 8082 2） 查询 InfluxDB 数据库中的数据 让我们先通过 InfluxDB 的管理页面查看数据。</p>
<p>由于设置 InfluxDB 服务会暴露到物理 Node 节点上，所以我们可以通过任一Node 的8083 端口访问 InfluxDB数据库提供的管理页面，如图5.10所示。通过右上角齿轮按钮可以修改连接 属性（用于 influxdb service 设置非默认端口号的时候）。单击右上角的 Database 下拉列表可 以选择数据库，heapster 创建的数据库名为k8s。</p>
<p>然Influx</p>
<p>bat3base k8s•</p>
<p>Connection Settings -intemal</p>
<p>k8s</p>
<p>Host:192.168 18.3</p>
<p>Save</p>
<p>Port: 8086</p>
<p>Userame</p>
<p>Password</p>
<p>F SSL</p>
<p>Query：</p>
<p>Query Templates -</p>
<p>图 5.10 InfluxDB 管理页面 在 Query 输入框中输入“SHOW MEASUREMENTS”，即可查看所有的 measurements（序 列表）。图5.11显示了部分 measurements。</p>
<p>• 356•</p>
<h2>第 370 页</h2>
<h3>第5章</h3>
<p>Kubernetes 运维指南</p>
<p>wInflux</p>
<p>Query-</p>
<p>SHOW MEASUREMENTS</p>
<p>Query Templates•</p>
<p>measurements</p>
<p>name</p>
<p>cpuAimit</p>
<p>cpunode_reseration cpu/node_utilization cpu/request</p>
<p>cpu/usage</p>
<p>cpu/usage_rate</p>
<p>flesystem/availabie filesystem/imit</p>
<p>filesystem/usage</p>
<p>图 5.11 show measurements 结果页面 heapster 采集的全部 metric（性能指标）如表5.6所示。</p>
<p>表 5.6 heapster 采集的 metric metric 名称</p>
<p>说</p>
<p>明</p>
<p>cpu/limit</p>
<p>cpu/node_reservation cpu/node_utilization cpu/request</p>
<p>cpu/usage</p>
<p>cpu/usage_rate</p>
<p>filesystem/usage</p>
<p>filesystem/limit</p>
<p>filesystem/available memory/limit</p>
<p>memory/major_page_faults memory/major_page_faults_rate memory/node reservation memory/node_utilization memory/page_faults memory/page_faults_rate CPU hard limit，单位为毫秒 Node 保留的 CPU Share Node 的CPU 使用时间</p>
<p>CPU request，单位为毫秒</p>
<p>全部Core 的CPU 累计使用时间 全部Core 的CPU累计使用率，单位为毫秒 文件系统已用的空间，单位为字节</p>
<p>文件系统总空间限制，单位为字节</p>
<p>文件系统可用的空间，单位为字节</p>
<p>Memory hard limit，单位为字节 major page faults 数量 每秒的 major page faults 数量 Node 保留的内存 Share</p>
<p>Node 的内存使用值</p>
<p>page faults 数量</p>
<p>每秒的 page faults 数量 • 357•</p>
<h2>第 371 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 续表</p>
<p>metric 名称</p>
<p>memory/request</p>
<p>memory/usage</p>
<p>memory/working_set network/rx</p>
<p>network/rx_errors</p>
<p>network/rx_errors_rate network/rx_rate</p>
<p>network/tx</p>
<p>network/tx_errors</p>
<p>network/tx_errors_rate network/tx_rate</p>
<p>uptime</p>
<p>表5.7所示。</p>
<p>说</p>
<p>明</p>
<p>Memory request，单位为字节 总内存使用量</p>
<p>总的 Working set usage, Working set 是指不会被 kernel 移除的内存 累计接收的网络流量字节数</p>
<p>累计接收的网络流量错误数</p>
<p>每秒接收的网络流量错误数</p>
<p>每秒接收的网络流量字节数</p>
<p>累计发送的网络流量字节数</p>
<p>累计发送的网络流量错误数</p>
<p>每秒发送的网络流量错误数</p>
<p>每秒发送的网络流量字节数</p>
<p>容器启动总时长</p>
<p>每个 metric 可以看作一张数据库表，表中每条记录由一组label组成，可以看作字段，如 Label 名称</p>
<p>表5.7 metric 的各 label 说</p>
<p>明</p>
<p>pod_id</p>
<p>系统生成的 Pod 唯一名称</p>
<p>pod_name</p>
<p>用户指定的Pod名称</p>
<p>pod_namespace</p>
<p>Pod 所属的 namespace</p>
<p>container_base_image 容器的镜像名称</p>
<p>container_name</p>
<p>用户指定的容器名称</p>
<p>host_id</p>
<p>用户指定的 Node 主机名</p>
<p>hostname</p>
<p>容器运行所在主机名</p>
<p>labels</p>
<p>逗号分隔的 Label 列表</p>
<p>namespace_jd</p>
<p>Pod 所属的 namespace 的UID resource_id</p>
<p>资源 ID</p>
<p>可以使用标准 SQL SELECT 语句对每个 metric 进行查询，例如查询CPU 的使用时间：</p>
<p>select * from &quot;cpu/usage&quot; 1imit 10 结果如图5.12所示。</p>
<p>• 358•</p>
<h2>第 372 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>cpu/usage</p>
<p>Ume</p>
<p>contamet._bose_moor 2016-08</p>
<p>2016-08</p>
<p>wakgcosle_contiesrwryans.N15-10-18 26T2132002 &amp;728C</p>
<p>201808</p>
<p>S7132.002</p>
<p>wwswy.crarewbcnrowce1.3 0T21:32002</p>
<p>201888.</p>
<p>2816-38</p>
<p>05T213202</p>
<p>&#x27;oninkoadie tonlinArhite:sh-ar:0:41 15 05121 32 02</p>
<p>comainec_name Noatk bostemne wlets verker</p>
<p>18：</p>
<p>nse ！^</p>
<p>ns1635867618.var3inv1.12 *ksanr</p>
<p>30-</p>
<p>谢M”</p>
<p>wsaokce</p>
<p>wide-r</p>
<p>201-3</p>
<p>Pnewai</p>
<p>11885807918.verikn、 s-pehoaptlcD:c-urC 23h.：189567918werzonM1！</p>
<p>w8s-apskube</p>
<p>ent. saberraks hatoe 250k</p>
<p>Pamesece camie nechrame pcdk. r nte. wrcama</p>
<p>Ponesk</p>
<p>wusesytm</p>
<p>wue srsamr</p>
<p>wse-sam</p>
<p>wbe-asen</p>
<p>ribe 55n</p>
<p>Sabe sy38n</p>
<p>240t51m</p>
<p>ped.name</p>
<p>pod.namespece wse</p>
<p>rohe</p>
<p>wte srsea</p>
<p>pod_csnianer 43040357 1895667218</p>
<p>20oca8sc2 i2Svtae</p>
<p>vabe-soken ped_ceiner 234138782161 000:24G21021</p>
<p>Jerose</p>
<p>ce78e813.</p>
<p>50021106</p>
<p>eal-</p>
<p>wee-dr.</p>
<p>woesprw</p>
<p>ped._conwiner 283245016879 wute syikeo</p>
<p>ped_contaberr 27815002 ：14110-</p>
<p>16320705</p>
<p>000c280:2102- 50030 yimoosn</p>
<p>nodr</p>
<p>Teapskr</p>
<p>ped_conther 11e65290 c08290221028086</p>
<p>bad.cordber 37674265952 S0:2-1108</p>
<p>rped_ovcbeer a1ssvt pot_coarer oi2r2：</p>
<p>图 5.12 查询 cpu/usage 结果页面 3） Grafana 页面查看和操作 访问Grafana 服务需要通过 Master 代理模式进行访问，URL 地址为 http://192.168.18.3:8080/ api/v1/proxy/namespaces/kube-system/services/monitoring-grafana/。</p>
<p>在 grafana 主页可以查看监控数据的图表展示画面。如图5.13所示 Cluster 集群的整体信 息，以折线图的形式展示了集群范围内各 Node 的CPU 使用率、内存使用情况等信息。</p>
<p>图5.13</p>
<p>Grafana Cluster 监控页面 • 359•</p>
<h2>第 373 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 图5.14显示的是所有Pod 的信息，以折线图的形式展示了集群范围内各 Pod 的CPU使用 率、内存使用情况、网络流量、文件系统使用情况等信息。</p>
<p>图 5.14 Grafana Pod 监控页面 Grafana 页面上的每个图表都可以进行编辑，在标题上单击鼠标，点击“Edit” 进入编辑页面， 可以对每个 metric 进行个性化设置，例如查询的表名、字段名、汇总计算等，如图5.15所示。</p>
<p>图5.15 编辑折线图</p>
<p>到此，基于 heapster+influxdb+grafana 的 Kuberetes 集群监控系统就搭建完成了。</p>
<p>• 360•</p>
<h2>第 374 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<h3>5.1.7 kubelet 的垃圾回收（GC）机制</h3>
<p>Kubernetes 集群中的垃圾回收（Garbage Collection，简称GC）机制由 kubelet 完成。kubelet 定期清理不再使用的容器和镜像，每分钟进行一次容器GC 操作，每5分钟进行一次镜像GC 操作。</p>
<p>1. 容器（Container）的GC设置 能够被GC清理的容器只能是仅由kubelet 管理的容器。在kubelet 所在的Node 上直接通过 docker run 创建的容器将不会被 kubelet 进行GC清理操作。</p>
<p>kubelet 的以下3个启动参数用于设置容器GC 的条件。</p>
<p>--minimum-container-ttl-duration：已停止的容器在被清理之前的最小存活时间，例如 “300ms”“10s”或“2h45m”，超过此存活时间的容器将被标记为可被GC 清理，默认 值为1分钟。</p>
<p>-maximum-dead-containers-per-container：以Pod 为单位的可以保留的已停止的（属 于同一Pod 的）容器集的最大数量。有时，Pod 中容器运行失败或者健康检查失败后， 会被 kubelet 自动重启，这将产生一些停止的容器。默认值为2。</p>
<p>--maximum-dead-containers：在本 Node上保留的已停止容器的最大数量，由于停止的 容器也会消耗磁盘空间，所以超过该上限以后，kubelet 会自动清理已停止的容器以释 放磁盘空间，默认值为 240。</p>
<p>如果需要关闭针对容器的GC操作，则可以将--minimum-container-ttl-duration 设置次0，将 --maximum-dead-containers-per-container 和--maximum-dead-containers 设置为负数。</p>
<p>2. 镜像（Image）的GC设置</p>
<p>Kubernetes 系统中通过 imageController 和 kublet 中集成的cAdvisor 共同管理镜像的生命周 期，主要根据本Node 的磁盘使用率来触发镜像的GC操作。</p>
<p>kubelet 的以下3个启动参数用于设置镜像GC 的条件。</p>
<p>--minimum-image-ttl-duration：不再使用的镜像在被清理之前的最小存活时间，例如 “300ms”“10s”或“2h45m”，超过此存活时间的镜像被标记为可被GC 清理，默认值 为两分钟。</p>
<p>-image-ge-high-threshold：当磁盘使用率达到该值时，触发镜像的GC操作，默认值为90%。</p>
<p>◎ -image-gc-low-threshold：当磁盘使用率降到该值时，GC操作结束，默认值80%。</p>
<p>• 361•</p>
<h2>第 375 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 删除镜像的机制为：当磁盘使用率达到 image-gc-high-threshold（例如 90%）时触发，GC 操作从最久未使用 （Least Recently Used）的镜像开始删除，直到磁盘使用率降为 image-gc-low- threshold（例如80%）或没有镜像可删为止。</p>
<h3>5.2 Kubernetes 高级案例</h3>
<p>本节将对 ElasticSearch 日志管理平台的部署、Cassandra 集群的部署及 Kubernetes 中容器的 高级应用进行说明。</p>
<h3>5.2.1 ElasticSearch 日志搜集查询和展现案例</h3>
<p>在 Kubernetes 集群环境中，一个完整的应用或服务都会涉及数众多的组件运行，各组件 所在的Node 及实例数量都是可变的。日志子系统如果不做集中化管理，则会给系统的运维支 撑造成很大的困难，因此有必要在集群层面对日志进行统一的收集和检索等工作。</p>
<p>容器中输出到控制台的日志，都会以*-json.log 的命名方式保存在/var/lib/docker/containers/ 目录之下，这样就给了我们进行日志采集和后续处理的基础。</p>
<p>Kubernetes 推荐采用 Fluentd+ElasticSearch+Kibana 完成对日志的采集、查询和展现工作。</p>
<p>在部署系统之前，需要以下两个前提条件。</p>
<p>◎</p>
<p>API Server 正确配置了 CA证书。</p>
<p>◎</p>
<p>DNS服务启动运行。</p>
<p>1. 系统部署架构</p>
<p>系统的逻辑架构如图5.16所示。</p>
<p>在各 Node 上运行一个 Fluentd 容器，对本节点/var/log 和/var/lib/docker/containers 两个目录 下的日志进程采集，然后汇总到 ElasticSearch 集群，最终通过Kibana完成和用户的交互工作。</p>
<p>这里有一个特殊的需求，Fluentd 必须在每个 Node 上运行一份，为了满足这一需要，我们 有以下几种不同的方式来部署 Fluentd。</p>
<p>◎ 直接在 Node 主机上部署 Fluentd。</p>
<p>◎ 利用 kubelet 的--config 参数，为每个 Node 加载 Fluentd Pod。</p>
<p>利用 DaemonSet 来让 Fluentd Pod 在每个Node 上运行。</p>
<p>• 362•</p>
<h2>第 376 页</h2>
<h3>第5章</h3>
<p>Kubernetes 运维指南</p>
<p>/var/log</p>
<p>Fuienta</p>
<p>/varflib/docker/containers 日志汇总</p>
<p>日志 总</p>
<p>Easuic 集雄</p>
<p>NodeA</p>
<p>Node B</p>
<p>案引和查询</p>
<p>Nar/log</p>
<p>Farentdr</p>
<p>：2ana</p>
<p>/var/lib/docker/containers 图 5.16</p>
<p>Fluentd+ElasticSearch+Kibana 系统逻辑架构图 目前官方推荐的包括Fluentd、Logstash 等日志或者监控类的Pod 的运行方式就是 DaemonSet 方式，因此本节我们也以这一方式进行配置。</p>
<p>2. 创建 ElasticSearch RC 和 Service ElasticSearch 的 RC 和 Service 定义：</p>
<p>elasticsearch-rc-svc.yml apiVersion: v1</p>
<p>kind:ReplicationController metadata：</p>
<p>name: elasticsearch-logging-v1 namespace: kube-system labels：</p>
<p>k8s-app: elasticsearch-logging version: vl</p>
<p>kubernetes.io/cluster-service：</p>
<p>&quot;true&quot;</p>
<p>spec：</p>
<p>replicas：</p>
<p>2</p>
<p>selector：</p>
<p>k8s-app: elasticsearch-logging version: v1</p>
<p>template：</p>
<p>metadata：</p>
<p>labels：</p>
<p>k8s-app: elasticsearch-logging version: vl</p>
<p>kubernetes.io/cluster-service： &quot;true&quot; spec：</p>
<p>containers：</p>
<p>- image:gcr.io/google_containers/elasticsearch:1.8 name: elasticsearch-logging • 363•</p>
<h2>第 377 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） resourCeS：</p>
<p>1imits：</p>
<p>cpu:100m</p>
<p>requests：</p>
<p>cpu: 100m</p>
<p>ports：</p>
<p>- containerPort：</p>
<p>9200</p>
<p>name:db</p>
<p>protocol:TCP</p>
<p>- containerPort：</p>
<p>9300</p>
<p>name:transport</p>
<p>protocol:TCP</p>
<p>volumeMounts：</p>
<p>-name:es-persistent-storage mountPath:/data</p>
<p>vOlumes：</p>
<p>- name: es-pers1stent-storage emptyDir：｛｝</p>
<p># keep request = 1imit to keep this container in guaranteed class ---</p>
<p>apiVersion: v1</p>
<p>kind: Service</p>
<p>metadata：</p>
<p>name: elasticsearch-logging namespace: Kube-system labels：</p>
<p>K8s-app: elasticsearch-logging kubernetes.io/cluster-service：&quot;true&quot; kubernetes.io/name：&quot;Elasticsearch&quot; spec：</p>
<p>ports：</p>
<p>- port: 9200</p>
<p>protocol: TCP</p>
<p>targetPort:db</p>
<p>selector：</p>
<p>k8s-app: elasticsearch-logging 执行 kubectl create -f elastic-search.yml 命令完成创建。</p>
<p>命令成功执行后，首先验证 Pod 的运行情况。通过 kubectl get pods -namespaces=kube-system 获取运行中的 Pod：</p>
<p># kubectl get pods --namespaces=kube-system kube-system</p>
<p>elasticsearch-logging-v1-59gvp kube-system</p>
<p>elasticsearch-logging-v1-xnv14 接下来通过 ElasticSearch 的页面验证其功能。</p>
<p>READY</p>
<p>1/1</p>
<p>1/1</p>
<p>STATUS RESTARTS AGE Running</p>
<p>0</p>
<p>18h</p>
<p>Running</p>
<p>0</p>
<p>18h</p>
<p>• 364•</p>
<h2>第 378 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>执行#kubectl cluster-info 命令获取 ElasticSearch 服务的地址：</p>
<p># kubectl cluster-info Elasticsearch is running at http://192.168.18.3:8080/api/v1/proxy/namespaces/kube-system/services/elasticsea rch-logging</p>
<p>接下来使用 #kubectl proxy 命令对 apiserver 进行代理，成功执行后输出如下：</p>
<p># kubectl proxy</p>
<p>Starting</p>
<p>to serve on 127.0.0.1:8001 这样我们就可以在浏览器上访问URL 地址 http://192.168.18.3:8001/api/v1/proxy/namespaces/ kube-system/services/elasticsearch-logging，来验证 ElasticSearch 的运行情况了，返回的内容是一 个JSON 文档：</p>
<p>&quot;status&quot; ： 200，</p>
<p>&quot;name&quot; ：&quot;Emplate&quot;， _name&quot;： &quot;kubernetes-logging&quot;， &quot;version&quot;：｛</p>
<p>&quot;number&quot;： &quot;1.5.2&quot;， &quot;build hash&quot;： &quot;62ff9868b4c8a0c45860bebb259e21980778ablc&quot;， &quot;build_timestamp&quot; ： &quot;2015-04-27T09:21:062&quot;， &quot;build snapshot&quot;： false， &quot;lucene_version&quot; ：</p>
<p>&quot;tagline&quot;：&quot;You Know, for Search&quot; 3. 在每个 Node 上启动 Fluentd Fluentd 的 DaemonSet 定义如下：</p>
<p>fluentd-ds.yml</p>
<p>apiVersion: extensions/v1betal kind: DaemonSet</p>
<p>metadata：</p>
<p>name: fluentd-cloud-logging namespace: kube-system labels：</p>
<p>k8s-app: fluentd-cloud-logging spec：</p>
<p>template：</p>
<p>metadata：</p>
<p>namespace: kube-system Labels：</p>
<p>• 365•</p>
<h2>第 379 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） k8s-app: fluentd-cloud-logging spec：</p>
<p>containers：</p>
<p>-.name:fluentd-cloud-1ogging image:ger.io/google_containers/f1uentd-elasticsearch:1.17 resources：</p>
<p>1imits：</p>
<p>cpu: 100m</p>
<p>memory: 200Mi</p>
<p>env：</p>
<p>- name:FLUENTD_ARGS value：-q</p>
<p>volumeMounts：</p>
<p>- name: varlog</p>
<p>mountPath: /var/10g readonly: false</p>
<p>- name: containers mountPath: /var/lib/docker/containers readonly: false</p>
<p>volumes：</p>
<p>- name: containers hostPath：</p>
<p>path: /var/1ib/docker/containers - name: varlog</p>
<p>hostPath：</p>
<p>path: /var/log</p>
<p>通过 kubectl create 命令创建 Fluentd 容器：</p>
<p># kubectl create -f fluentd-ds .yml 查看创建的结果：</p>
<p># kubectl get daemonset NAME</p>
<p>DESIRED CURRENT</p>
<p>fluentd-cloud-logging NODE-SELECTOR</p>
<p>&lt;none&gt;</p>
<p>AGE</p>
<p>1h</p>
<p># kubectl get pods NAMESPACE</p>
<p>NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS</p>
<p>AGE</p>
<p>fluentd-cloud-logging-7tw9z 1/1</p>
<p>Running</p>
<p>18h</p>
<p>fluentd-cloud-logging-agdn1 1/1</p>
<p>Running</p>
<p>fluentd-cloud-logging-o4usx 1/1</p>
<p>Running</p>
<p>0</p>
<p>0</p>
<p>18h</p>
<p>18h</p>
<p>结果显示 Fluentd DaemonSet 正常运行，启动3个 Pod，与集群中的Node 数量一致。</p>
<p>接下来，使用 ＃kubectl logs fluentd-cloud-logging-7tw9z 命令查看 Pod 的日志，在 ElasticSearch 正常工作的情况下，我们会看到类似下面这样的日志内容：</p>
<p># kubect1 logs fluentd-cloud-logging-7tw9z Connection opened to Elasticsearch cluster =&gt; • 366•</p>
<h2>第 380 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>｛：host=&gt;&quot;elasticsearch-logging&quot;，：port=&gt;9200，：scheme=&gt;&quot;http&quot;｝ 说明 Fluentd 与 ElasticSearch 已经正确建立了连接。</p>
<p>4. 运行 Kibana</p>
<p>到此我们已经运行了 ElasticSearch 和 Fluentd，数据的采集和汇聚过程已经完成，接下来就 是使用 Kibana 来展示和操作数据了。</p>
<p>Kibana 的RC 和 Service 定义如下：</p>
<p>kibana-rc-svc.yml</p>
<p>apiVersion:v1</p>
<p>kind: ReplicationController metadata：</p>
<p>name: kibana-logging-v1 namespace: kube-system k8s-app: kibana-logging version: vl</p>
<p>kubernetes.io/cluster-service：</p>
<p>&quot;true&quot;</p>
<p>speC：</p>
<p>replicas: 1</p>
<p>k8s-app: kibana-logging template：</p>
<p>metadata：</p>
<p>k8s-app: kibana-logging kubernetes.io/cluster-service：&quot;true&quot; speC：</p>
<p>containers：</p>
<p>- name: kibana-logging image:gcr.io/google_containers/kibana:1.3 # keep request = limit to keep this container in guaranteed class cpu:100m</p>
<p>reguests：</p>
<p>cpu: 100m</p>
<p>env：</p>
<p>ports：</p>
<p>- name： &quot;EIASTICSEARCH_URL&quot; value：&quot;http://elasticsearch-logging: 9200&quot; • 367•</p>
<h2>第 381 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） - containerPort: 5601 name: ui</p>
<p>protocol: TCP</p>
<p>apiVersion: v1</p>
<p>kind: Service</p>
<p>metadata：</p>
<p>name: kibana-logging namespace: kube-system k8s-app: kibana-logging kubernetes.io/cluster-service： &quot;true&quot; kubernetes.io/name：&quot;Kibana&quot; ports：</p>
<p>- port: 5601</p>
<p>protocol:TCP</p>
<p>targetPort: ui</p>
<p>selector：</p>
<p>k8s-app: kibana-logging 通过 kubectl create -f kibana-rc-svc.yml 命令创建 Kibana 的 RC 和 Service：</p>
<p># kubect1 create -f kibana-rc-svC.yml replicationcontroller &quot;kibana-logging-v1&quot; created service &quot;kibana-logging&quot; created 查看 Kibana 的运行情况：</p>
<p># kubectl get pods NAMESPACE</p>
<p>NAME</p>
<p>READY</p>
<p>default</p>
<p>kibana-logging-v1-olakg 1/1 STATUS</p>
<p>Running</p>
<p>RESTARTS</p>
<p>0</p>
<p>AGE</p>
<p>1h</p>
<p># kubectl get svc</p>
<p>NAME</p>
<p>kibana-logging</p>
<p>CLUSTER-IP</p>
<p>169.169.195.177</p>
<p>EXTERNAL-IP</p>
<p>&lt;none＞</p>
<p>PORT（S）</p>
<p>5601/TCP</p>
<p>AGE</p>
<p>1h</p>
<p># kubectl get rc</p>
<p>NAME</p>
<p>DESIRED</p>
<p>CURRENT</p>
<p>kibana-logging-v1</p>
<p>AGE</p>
<p>1h</p>
<p>结果表明运行均已成功。通过 kubectl cluster-info 命令获取 Kibana 服务的URL 地址：</p>
<p># kubectl cluster-info Kibana is running at http://127.0.0.1:8080/api/v1/proxy/namespaces/kube-system/ services/kibana-logging 同样通过 kubectl proxy 命令启动代理，在出现 Starting to serve on 127.0.0.1:8001字样之后， 用浏览器访问 URL地址即可访问 Kibana 页面了：http://192.168.18.3:8001/api/v1/proxy/namespaces/ • 368•</p>
<h2>第 382 页</h2>
<h3>第5章</h3>
<p>：Kubernetes 运维指南</p>
<p>kube-system/services/kibana-logging。</p>
<p>第1次进入页面需要进行一些设置，如图5.17所示，选择所需选项后单击 create。</p>
<p>疆settings-Kanss</p>
<p>个</p>
<p>+C</p>
<p>也 10.255.242.214:1171/#/seftings/indices /.9=0 | kibana</p>
<p>Configure an index pattern Sn order to use Kecana yo must configure at least one inder pattoo. Index poltlors are uoed to itentity the Elasfiecsear.h confgre fekss</p>
<p>E Index contains</p>
<p>Use event umes to create index name！</p>
<p>Patlerne alow you to deino dyrstk nie ssngi swekad Exangfe. logstih- 图 5.17 Kibana 创建索引页面 然后单击 discover，</p>
<p>就可以正常查询日志了，如图5.18所示。</p>
<p>•10.255.242.214:1171/#/discover？</p>
<p>Kibana</p>
<p>②中比：=</p>
<p>Mach 2340 2016, 15.58.15.811-warch 2300 2016, 16:11.15811 100</p>
<p>$0</p>
<p>翻</p>
<p>woe Wsecoaks</p>
<p>1549 00</p>
<p>16:2723</p>
<p>1€0922</p>
<p>np peI 30 seconas</p>
<p>•C 200 200-26：：9-00 w39ag</p>
<p>savent</p>
<p>souree</p>
<p>swwily E nit 7616 swure: pod.sorkers.001238 wess wp: Error syncing pod 4b3829d7-ef1c-11€5-8c00-448842254fde, ski pping: faiied to &#x27;StertContainer&quot; for -containes-O with JoegePu17Seckoff： &quot;Back-off ouiling inage \&quot;http://10.254.90.3 1:1179/toocat:5）&quot;eg: ubelet Wuimwtmes Narch 23cd 2025, 26:21:15.000 enoe （&#x27;severity&quot;：“E&#x27;，&quot;pid”：&quot;7616&quot;，&quot;sourc •&#x27;： podLwokers.go:138°，&#x27;nessage&#x27;：“Error syncing pod 4b3829d7-ef1c-1105-8cd0-448842254fde, skipoing: failed to V&#x27;Startc a77 acigFF：&quot;eork-off pniTing ingoe 11s&quot;hetn:5i0.251.9n.%-11r9soa:s sweityiE piE 41740 src: pod yorkers.go:228 essiens Errar syncing pod 4a744738-ef16-11e5-8c60-048842254fde, sk ipoing: failed to “StartCoteiner&#x27;for &quot;ectivese with InaseAT1BackOff： &quot;Beck-off paullsng image V&quot;10.255.242.213:5000/ buoybox:latest\Mei kabelet Wimustm Nerch 22rd 2016, 16:11:15.000 _oeoi f&quot;severty：&quot;E,Tpid：*42740°，&quot;sourc e:pod.workers.80:2）6,mess age：&#x27;Error syncing pod 48744738-ef16-11e5-8:00-448842254fde, skipping: failed to V&quot;Startc ~10. 255.242.389:5000 busvto :1ntext E mit 7616</p>
<p>： Erron syncing pod 4a6x2998-ef1c-L1eS-8cd0-448842254f6e, Ski 图5.18</p>
<p>Kibana 查询日志页面</p>
<p>• 369•</p>
<h2>第 383 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 在搜索栏输入“error”关键字，可以搜索出从某些 Node 上找到的日志记录，如图5.19 所示。</p>
<p>量 Discover-Kiarua：</p>
<p>：.242.214:1171/#/discover？_a=（cofumns：！Lsource）.indec&#x27;lagstash-1 &#x27;intervat:auto.querx（query.sttingfonalyze.wilcand:t.querycerron）.sortC@time&amp;公 Kibana</p>
<p>◎</p>
<p>Iegstash</p>
<p>Solec bed Fields</p>
<p>March 23~ 2016.16.03.11.101-Marcn 23r0 2018.16:18.12.101 16:07 00</p>
<p>Tme、</p>
<p>tg</p>
<p>nestg</p>
<p>even</p>
<p>ourci</p>
<p>-source</p>
<p>MI：期 syecing pod 4ab5777c-ef1C-21e5-8c80-44284225afde, skippima: failed to ~Startcontainer&quot;for swverity:E vie:15030 sice: potLrorkerS.90:138 y&#x27;：&#x27;E.Tpid&#x27;：&quot;15030&quot;，&#x27;swurce&quot;：&#x27;ped.workers.p0:138&quot;，Tnessage&quot;； &#x27;Error syncing pod sxb0777c-ef1c-110-8.d0-36884225afde,s kimping: failed to V&#x27;Star tContainer（&#x27;for V&#x27;act）iea）&quot; with JeagePu77BeckOff: 1&quot;Beck-off pu7ling ieage 11&quot;20.255.242.2 - syocing pod 4280500e-ef1C0L105-8c00-448842254fde, skipping: failed to &#x27;StartContaine&#x27;for swaitr: E vit37727 soro: pod.sorkers.so:135 ve kbelet Otimestmy: March 23rd 2828, 16:18:11.000 Jnrce: fseverit y&#x27;：E,oid&quot;：&#x27;37777&quot;，&quot;source：&#x27;p0dLworkers.20:138，&#x27;nessege&quot;：&#x27;Error syncing pod 4890500e-ef1&lt;-11€5-8cd0-64a542254fde, s kipoing: failed to V&#x27;Startcontaine！&#x27; for YaCtivead） with InagePu11eackOff: Y&quot;Beck-04f pu1110g 104ge 111~10.255.242.2 oncing pod 42.4738.cf2c22e-B0-440823-ofae, ihinping: feilet to CStr Konteiner. fo walt：</p>
<p>图5.19 Kibana 日志关键字搜索页面 同时，通过左边菜单中 Fields相关的内容对查询的内容进行限定，如图5.20所示。</p>
<p>kibana</p>
<p>Discover</p>
<p>Visvains</p>
<p>error</p>
<p>logstash*</p>
<p>Selected Fields</p>
<p>60</p>
<p>_sOurce</p>
<p>40</p>
<p>lelds.</p>
<p>20-</p>
<p>Popular felds</p>
<p>◎ @timestamp</p>
<p>。</p>
<p>16:04:00</p>
<p>_i0</p>
<p>_index</p>
<p>_type</p>
<p>1ag</p>
<p>Time、</p>
<p>• March 23rd 2026, 3 message</p>
<p>• pid</p>
<p>z severiy</p>
<p>t source</p>
<p>图 5.20 Kibana 查询日志 • 370．</p>
<h2>第 384 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>至此，Kubernetes集群范围内的统一日志收集和查询系统就搭建完成了。</p>
<h3>5.2.2 Cassandra 集群部署案例</h3>
<p>Apache Cassandra 是一套开源分布式 NoSQL 数据库系统，其主要特点就是它不是单个数据 库，而是由一组数据库节点共同构成的一个分布式的集群数据库。由于 Cassandra使用的是“去 中心化”模式，所以当集群里的一个节点启动之后需要一个途径获知集群中新节点的加入。</p>
<p>Cassandra 使用了Seed（种子）的概念来完成在集群中节点之间的相互查找和通信。</p>
<p>本例通过对Kubernetes 中 Service 概念的巧妙使用实现了各Cassandra 节点之间的相互查找。</p>
<p>1. 自定义 SeedProvider 在本例中使用了一个自定义的 SeedProvider 类来完成新节点的查询和添加，类名为 io.k8s.cassandra.KubernetesSeedProvider。</p>
<p>KubernetesSeedProviderjava 类的源代码节选如下：</p>
<p>public List&lt;InetAddress&gt; getSeeds（）｛ List&lt;InetAddress&gt; list = new ArrayList&lt;InetAddress&gt;（）；</p>
<p>String host = &quot;https://kubernetes.default.cluster.local&quot;；</p>
<p>String serviceName = getEnvOrDefault （&quot;CASSANDRA_SERVICE&quot;，&quot;cassandra&quot;）；</p>
<p>String podNamespace = getEnvOrDefault （&quot;POD_NAMESPACE&quot;，&quot;default&quot;）；</p>
<p>String path = String.format （&quot;/api/v1/namespaces/8s/endpoints/&quot;， podNamespace）；</p>
<p>public static void main（String［］ args）｛ SeedProvider provider = new KubernetesSeedProvider （new HashMap&lt;String， String&gt;（））；</p>
<p>System.out.println （provider.getSeeds （））；</p>
<p>｝</p>
<p>｝</p>
<p>完整的源代码可以从这里获取：http://kubernetes.io/v1.0/examples/cassandra/java/src/io/k8s/ cassandra/KubernetesSeedProvider.java 创建 Cassandra Pod 的配置文件如下：</p>
<p>cassandra.yaml</p>
<p>apiVersion: v1</p>
<p>kind： Pod</p>
<p>metadata：</p>
<p>labels：</p>
<p>• 371•</p>
<h2>第 385 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） name:cassandra</p>
<p>name：</p>
<p>cassandra</p>
<p>spec：</p>
<p>containers：</p>
<p>- args：</p>
<p>- /run.sh</p>
<p>resources：</p>
<p>limits：</p>
<p>cpu：&quot;0.5&quot;</p>
<p>image:gcr.io/google_containers/cassandra:v5 name: cassandra</p>
<p>- name:cql</p>
<p>containerPort: 9042 - name: thrift</p>
<p>containerPort：</p>
<p>9160</p>
<p>volumeMounts：</p>
<p>- name: data</p>
<p>mountPath:/cassandra_data env：</p>
<p>- name:MAX_HEAP_SIZE value: 512M</p>
<p>- name: HEAP</p>
<p>_NENSIZE</p>
<p>value: 100M</p>
<p>- name:POD_NAMESPACE valueFrom：</p>
<p>fieldRef：</p>
<p>fieldPath: metadata.namespace volumes：</p>
<p>- name: data</p>
<p>emptyDir:1｝</p>
<p>需要说明的是，在镜像 gcr.io/google_containers/cassandra:v5 中安装了一个标准的 Cassandra 应用程序，并将定制的 SeedProvider 类 -KubernetesSeedProvider 打包到镜像中了。</p>
<p>定制的 KubernetesSeedProvider 类将使用 REST API 来访问 Kubernetes Master，然后通过查 询 name=cassandra的服务指向的Pod 来完成对其他“节点”的查找。</p>
<p>2. 通过 Service 动态查找 Pod 在 KubernetesSeedProvider 类中，通过查询环境变量CASSANDRA_SERVICE 的值来获得服 务的名称。这样就要求 Service 需要在Pod 之前创建出来。如果我们已经创建好 DNS服务（参 见5.1节的案例介绍），那么也可以直接使用服务的名称而无须使用环境变量。</p>
<p>回顾一下 Service 的概念。Service 通常用作一个负载均衡器，供 Kubernetes 集群中其他应 • 372•</p>
<h2>第 386 页</h2>
<h3>第5章</h3>
<p>Kubernetes 运维指南</p>
<p>用（Pod）对属于该 Service 的一组Pod进行访问。由于 Pod 的创建和销毁都会实时更新 Service 的 Endpoints 数据，所以可以动态地对 Service 的后端Pod进行查询了。Cassandra的“去中心化” 设计使得Cassandra 集群中的一个 Cassandra 实例（节点）只需要查询到其他节点，即可自动组 成一个集群，正好可以使用 Service 的这个特性查询到新增的节点。图 5.21 描述了Cassandra 新 节点加入集群的过程。</p>
<p>Kubernetes</p>
<p>Master</p>
<p>2. 获取Service的</p>
<p>后端Endpoint，将</p>
<p>新Pod加入集群</p>
<p>2. 获取Service的</p>
<p>后端Endpoint，将</p>
<p>新Pod加入集群</p>
<p>Cessandre.</p>
<p>Node</p>
<p>1.新节点的出观，</p>
<p>将更新Service的</p>
<p>Endpoint</p>
<p>Cassandra</p>
<p>Node</p>
<p>Cassandra</p>
<p>Node</p>
<p>NEW</p>
<p>Cassandra</p>
<p>Node</p>
<p>图5.21 Cassandra 新节点加入集群的过程 在 Kubernetes 系统中，首先需要 Cassandra 集群定义一个 Service。</p>
<p>cassandra-service.yaml：</p>
<p>apiVersion: vl</p>
<p>kind: Service</p>
<p>metadata：</p>
<p>Labels：</p>
<p>name: Cassandra</p>
<p>name: cassandra</p>
<p>spec：</p>
<p>ports：</p>
<p>- port: 9042</p>
<p>selector：</p>
<p>name: Cassandra</p>
<p>在 Service 的定义中指定 Label Selector 內 name=cassandra。</p>
<p>（1） 创建 Service：</p>
<p>s kubectl</p>
<p>create -f cassandra-service.yaml （2）创建一个 Cassandra Pod：</p>
<p>s kubectl create -f cassandra-pod.yaml • 373•</p>
<h2>第 387 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 现在，一个名为 cassandra 的Pod 运行起来了，但还没有组成 Cassandra 集群。</p>
<p>（3）创建一个 RC来控制 Pod集群：</p>
<p>cassandra-controller.yaml apiVersion:v1</p>
<p>kind:ReplicationController metadata：</p>
<p>labels：</p>
<p>name: cassandra</p>
<p>name:cassandra</p>
<p>spec：</p>
<p>replicas: 1</p>
<p>selector：</p>
<p>name: cassandra</p>
<p>template：</p>
<p>metadata：</p>
<p>labels：</p>
<p>name: cassandra</p>
<p>spec：</p>
<p>containers：</p>
<p>- command：</p>
<p>- /run.sh</p>
<p>resources：</p>
<p>limits：</p>
<p>CPU：</p>
<p>0.5</p>
<p>env：</p>
<p>-name:MAX_HEAP_SIZE value: 512M</p>
<p>- name: HEAP_NEWSIZE value: 100M</p>
<p>- name: POD_NAME SPACE valueFrom：</p>
<p>fieldRef：</p>
<p>fieldPath: metadata.namespace image: gcr.io/google_containers/cassandra:v5 name: Cassandra</p>
<p>PortS：</p>
<p>- containerPort : 9042 name: cq-</p>
<p>- containerPort: 9160 name: thrift</p>
<p>volumeMounts：</p>
<p>- mountPath: /cassandra_data name: data</p>
<p>volumes：</p>
<p>- name: data</p>
<p>• 374</p>
<p>||</p>
<h2>第 388 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>emptyDir：｛｝</p>
<p>由于在RC定义中指定的 replicas 数量为1，所以创建RC后，仍然只有之前创建的那个名 为 cassandra 的Pod在运行。</p>
<p>3. Cassandra 集群中新节点的自动添加 现在，我们使用 Kubernetes 提供的 Scale（动态缩放）机制对 Cassandra 集群进行扩容：</p>
<p>$ kubectl scale rc cassandra --replicas=2 查看Pod，可以看到 RC创建并启动了一个新的 Pod：</p>
<p>$ kubectl get pods -1=&quot;name=cassandra&quot; NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS AGE</p>
<p>cassandra</p>
<p>1/1</p>
<p>Running</p>
<p>5m</p>
<p>cassandra-g52t3</p>
<p>1/1</p>
<p>Running</p>
<p>0</p>
<p>50s</p>
<p>使用 Cassandra 提供的 nodetool 工具对任一cassandra 实例（Pod）进行访问来验证 Cassandra 集群的状态。下面的命令将访问名为 cassandra 的Pod（访问 cassandra-g52t3 也能获得相同的结 果）：</p>
<p>$ kubectl exec -ti cassandra -- nodetool status Datacenter: datacenterl Status=Up/Down</p>
<p>I/ State=Norma1/Leaving/Joining/Moving -- Address</p>
<p>Tokens Owns （effective） Host ID Rack</p>
<p>UN 10.1.20.16</p>
<h3>51.58 KB</h3>
<p>256</p>
<p>100.08</p>
<p>1625c65d-b5b6-40f4-a794- 6f5a12322d86</p>
<p>rackl</p>
<p>UN 10.1.10.11</p>
<h3>51.51 KB</h3>
<p>256</p>
<p>100.0%</p>
<p>cdfcbfla-795c-4412-9d3f- e8fe50bb8deb rack1 可以看到 Cassandra 集群中有两个节点处于正常运行状态（Up and Normal,UN）。结果中 的两个 IP 地址为两个 Cassandra Pod 的IP 地址。</p>
<p>内部的过程为：每个 Cassandra 节点（Pod）通过 API 访问 Kubernetes Master，查询名 cassandra 的 Service 的 Endpoints（即 Cassandra 节点），若发现有新节点加入，就进行添加操作， 最后成功组成了一个 Cassandra集群。</p>
<p>我们再增加两个 Cassandra 实例：</p>
<p>s kubectl scale rc cassandra --replicas=4 用 nodetool 工具查看 Cassandra 集群状态：</p>
<p>s kubectl exec -ti cassandra -- nodetool status Datacenter: datacenterl • 375•</p>
<h2>第 389 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） Status=Up/Down</p>
<p>I/ State=Normal/Leaving/ Joining/Moving -- Address</p>
<p>Load</p>
<p>Tokens Owns （effective） Host ID Rack</p>
<p>UN 10.1.20.16 51.58 KB 256</p>
<p>50.5∞</p>
<p>1625c65d-b5b6-40f4-a794- 6f5a12322d86 rack1 UN 10.1.10.12 52.03 KB 256</p>
<p>47.08</p>
<p>8bcclc3e-44ec-46a7-b981- 4090b206f14e rack1 UN 10.1.20.17 68.05 KB 256</p>
<p>50.6号</p>
<p>579b6493-e92a-47f5-91f2- 9313198a24c9 rack1 UN 10.1.10.11 51.51 KB 256</p>
<p>51.9%</p>
<p>cdfcbfla-795c-4412-9d3f- e8fe50bb8deb rack1 可以看到4个 Cassandra 节点都加入 Cassandra 集群中了。</p>
<p>另外，可以通过查看 Cassandra Pod 的日志来看到新节点加入集群的记录：</p>
<p>$ kubect1 logs cassandra-g52t3 INEO 18:05:36 Handshaking version with /10.1.20.17 INFO 18:05:36 Node /10.1.20.17 is now part of the cluster 18:05:36 InetAddress /10.1.20.17 18:05:38 Handshaking version with 18:05:39 Node /10.1.10.12 is now part of the cluster 18:05:39 InetAddress /10.1.10.12 is now UP 本例描述了一种通过 API 查询 Service 来完成动态 Pod 发现的应用场景。对于类似于 Cassandra 集群的应用，都可以使用对 Service 进行查询后端 Endpoints 这种巧妙的方法来实现对 应用集群（属于同一Service）中新加入节点的查找。</p>
<p>5.3</p>
<p>Trouble Shooting 指导 本节将对 Kubernetes 集群中常见的问题的排查方法进行说明。</p>
<p>为了跟踪和发现 Kubernetes 集群中运行的容器应用出现的问题，常用的查错方法如下。</p>
<p>首先，查看 Kubernetes 对象的当前运行时信息，特别是与对象关联的Event 事件。这些事 件记录了相关主题、发生时间、最近发生时间、发生次数及事件原因等，对排查故障非常有价 值。此外，通过查看对象的运行时数据，我们还可以发现参数错误、关联错误、状态异常等明 显问题。由于 Kubernetes 中多种对象相互关联，因此，这一步可能会涉及多个相关对象的排查 问题。</p>
<p>其次，对于服务、容器的问题，则可能需要深入容器内部进行故障诊断，此时可以通过查 看容器的运行日志来定位具体问题。</p>
<p>• 376•</p>
<h2>第 390 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>最后，对于某些复杂问题，比如Pod调度这种全局性的问题，可能需要结合集群中每个节 点上的 Kubernetes 服务日志来排查。比如搜集 Master 上 kube-apiserver、 kube-schedule、 kube-controler-manager 服务的日志，以及各个 Node 节点上的 kubelet、kube-proxy 服务的日志， 综合判断各种信息，我们就能找到问题的原因并解决问题。</p>
<p>5.3.1</p>
<p>查看系统 Event 事件</p>
<p>在 Kubernetes 集群中创建了 Pod之后，我们可以通过kubectl get pods 命令查看Pod列表，但 该命令能够显示的信息很有限。Kubernetes 提供了 kubectl describe pod 命令来查看一个Pod 的详 细信息。</p>
<p>$ kubectl describe pod redis-master-bobr0 Name：</p>
<p>Redis-master-bobr0 Namespace：</p>
<p>default</p>
<p>Image （s）：</p>
<p>kubeguide/Redis-master Node：</p>
<p>k8s-node-1/192.168.18.3 Labels：</p>
<p>name=Redis-master, role=master status：</p>
<p>Running</p>
<p>Reason：</p>
<p>Message：</p>
<p>IP：</p>
<p>Replication Controllers：</p>
<p>172.17.0.58</p>
<p>Redis-master （1/1 replicas created） Containers：</p>
<p>master：</p>
<p>Image：</p>
<p>kubeguide/Redis-master Limits：</p>
<p>cpu：</p>
<p>memory：</p>
<p>state：</p>
<p>Started：</p>
<p>Ready：</p>
<p>250m</p>
<p>64Mi</p>
<p>Running</p>
<p>Fri,21 Aug 2015 14:45:37 +0800 True</p>
<p>Restart Count：</p>
<p>Conditions：</p>
<p>Type</p>
<p>Ready</p>
<p>Status</p>
<p>True</p>
<p>Events：</p>
<p>FirstSeen</p>
<p>LastSeen</p>
<p>Count</p>
<p>From</p>
<p>SubobjectPath</p>
<p>Reason</p>
<p>Message</p>
<p>Fri,21 Aug 2015 14:45:36 +0800 Eri,21 Aug 2015 14:45:36 +0800 1 ｛kubelet k8s-node-1｝ implicitly required container POD Pulled</p>
<p>Pod</p>
<p>container image &quot;myregistry: 5000/google_containers/pause:latest&quot; already present on machine</p>
<p>Fri, 21 Aug 2015 14:45:37 +0800 Fri,21 Aug 2015 14:45:37 +0800 1 • 377•</p>
<h2>第 391 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） ｛kubelet k8s-node-1｝ implicitly required container PoD created</p>
<p>Created</p>
<p>with docker id a4aa97813908 Fri,21 Aug 2015 14:45:37 +0800 Fri,21 Aug 2015 14:45:37 +0800 1 ｛kubelet k8s-node-1｝ implicitly required container PoD started</p>
<p>Started</p>
<p>with docker id a4aa97813908 Fri，</p>
<p>21 Aug 2015 14:45:37+0800 ｛kubelet k8s-node-1｝ spec.containers｛master｝ Fri,21 Aug 2015 14:45:37 +0800 1 created</p>
<p>Created with docker id le746245f768 Fri,21 Aug 2015 14:45:37 +0800 ｛kubelet k8s-node-1｝ spec.containers ｛master｝ Fri,21 Aug 2015 14:45:37 +0800 1 started</p>
<p>Started with docker id le746245f768 Fri, 21 Aug 2015 14:45:37 +0800 ｛scheduler ｝</p>
<p>Fri,21 Aug 2015 14:45:37 +0800 1 scheduled</p>
<p>Successfully assigned Redis-master-bobr0 to k8s-node-1 该命令除了显示Pod创建时的配置定义、状态等信息，还显示了与该Pod相关的最近的Event 事件，事件信息对于查错非常有用。如果某个 Pod一直处于 Pending 状态，则我们通过kubectl describe 命令就能了解到失败的具体原因。例如，从 Event 事件中我们可能获知 Pod 失败的原 因有以下几种。</p>
<p>◎ 没有可用的Node 以供调度。</p>
<p>◎ 开启了资源配额管理并且当前Pod 的目标节点上恰好没有可用的资源。</p>
<p>正在下载镜像。</p>
<p>kubectl describe 命令还可用于查看其他 Kubernetes 对象，包括 Node、 RC、Service、Namespace、 Secrets 等，对于每一种对象都会显示相关联的其他信息。</p>
<p>例如，查看一个服务的详细信息：</p>
<p>s kubectl describe service redis-master Name：</p>
<p>Redis-master</p>
<p>Namespace：</p>
<p>default</p>
<p>Labels：</p>
<p>name=Redis-master</p>
<p>Selector：</p>
<p>name=Redis-master</p>
<p>TyPe：</p>
<p>ClusterIP</p>
<p>IP：</p>
<p>169.169.208.57</p>
<p>Port：</p>
<p>&lt;unnamed&gt;</p>
<p>6379/TCP</p>
<p>Endpoints：</p>
<p>172.17.0.58:6379</p>
<p>Session Affinity：</p>
<p>None</p>
<p>No events.</p>
<p>如果查看的对象属于某个特定的 namespace，则需要加上 --namespace=&lt;namespace&gt;进行查 询。例如：</p>
<p>S kubectl get service kube-dns --namespace=kube-system • 378•</p>
<h2>第 392 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>5.3.2</p>
<p>查看容器日志</p>
<p>在需要排查容器内部应用程序生成的日志时，我们可以使用 kubectl logs &lt;pod_name&gt;命令：</p>
<p>s kubectl logs redis-master-bobr0 ［1］ 21 Aug 06:45:37.781 * Redis 2.8.19 （00000000/0） 64 bit, stand alone mode， port 6379,pid 1 ready to start.</p>
<p>［1］ 21 Aug 06:45:37.781 # Server started,Redis version 2.8.19 ［1］ 21 Aug 06:45:37.781 # WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add &#x27;vn.overconit_memory = 1&#x27; to /etc/sysctl.conf and then reboot or run the command &#x27;sysct1 vm.overcommit_memory=1&#x27;for this to take effect.</p>
<p>［1］ 21 Aug 06:45:37.782 # WARNING You have Transparent Huge Pages （THP）support enabled in your kernel. This will create latency and memory usage issues with Redis.</p>
<p>To fix this issue run the command &#x27;echo never &gt; /sys/kerne1/mm/transparent _hugepage/</p>
<p>enabled&#x27;as root,and add it to your /etc/ rc.local in order to retain the setting after a</p>
<p>reboot. Redis must be.restarted after THP is disabled.</p>
<p>［1］ 21 Aug 06:45:37.782 #WARNING: The TCP backlog setting of 511 cannot be enforced because /proc/sys/net/core/somaxconn is set to the lower value of 128.</p>
<p>如果在一个 Pod 中包含多个容器，则需要通过-c参数指定容器的名称来进行查看，例如：</p>
<p>kubect1 logs &lt;pod</p>
<p>_name&gt;-c &lt;container_name&gt; 这个命令与在Pod的宿主机上运行 docker logs &lt;container_id&gt;的效果是一样的。</p>
<p>容器中应用程序生成的日志与容器的生命周期是一致的，所以在容器被销毁之后，容器内 部的文件也会被丢弃，包括日志等。如果需要保留容器内应用程序生成的日志，则一方面可以 使用挂载的Volume（存储卷）将容器产生的日志保存到宿主机，另一方面也可以通过一些工具 对日志进行采集，包括 Fluentd、ElasticSearch 等开源软件。</p>
<p>5.3.3</p>
<p>查看 Kubernetes 服务日志 如果在 Linux 系统上进行安装，并且使用 systemd 系统来管理 Kubernetes 服务，那么 systemd 的journal 系统会接管服务程序的输出日志。在这种环境中，可以通过使用 systemd status 或joumalctl 工具来查看系统服务的日志。</p>
<p>例如，使用 systemctl status 命令查看 kube-controller-manager 服务的日志：</p>
<p># systemct1 status kube-controller-manager -1 kube-controller-manager.service - Kubernetes Controller Manager Loaded: loaded（/usr/1ib/systemd/system/kube-controller-manager.service；</p>
<p>enabled）</p>
<p>Active: active（running） since Fri 2015-08-21 18:36:29 CST: 5min ago Docs: https://github.com/GoogleCloudPlatform/kubernetes Main PID: 20339（kube-controller） • 379•</p>
<h2>第 393 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） CGroup: /system.slice/kube-controller-manager.service -20339 /usr/bin/kube-controller-manager --logtostderr=false --v=4 --master=http://kubernetes-master: 8080 --1og_dir=/var/1og/kubernetes Aug 21 18:36:29 kubernetes-master systemd［1］： Starting Kubernetes Controller Manager.••</p>
<p>Aug 21</p>
<p>Manager.</p>
<p>18:36:29 kubernetes-master systemd［1］： Started Kubernetes Controller 使用 journalctl 命令查看：</p>
<p># journalctl -u kube-controller-manager -- Logs begin at Mon 2015-08-17 16:43:22 CST,end at Fri 2015-08-21 18:36:29 CST.</p>
<p>Aug 17 16:44:14 kubernetes-master systemd［1］： Starting Kubernetes Controller Manager ii 16:44:14 kubernetes-master systemd ［1］：started Kubernetes contxo1ler Manager.</p>
<p>如果不使用 systemd 系统接管 Kubernetes 服务的标准输出，则也可以通过日志相关的启动 参数来指定日志的存放目录。</p>
<p>--logtostderr=false：不输出到stdert。</p>
<p>--log-dir-/var/log/kubernetes：日志的存放目录。</p>
<p>--alsologtostder=false： 设置 true 则表示将日志输出到文件时也输出到 stderr。</p>
<p>--v=0:glog 日志级别。</p>
<p>--vmodule=gfs*=2,test*=4:glog 基于模块的详细日志级别。</p>
<p>在--1og_dir 设置的目录中可以查看各服务进程生成的日志文件，日志文件的数量和大小依 赖于日志级别的设置。例如kube-controller-manager 可能生成的几个日志文件如下。</p>
<p>kube-controller-manager.ERROR。</p>
<p>kube-controller-manager.INFO.</p>
<p>kube-controller-manager.WARNING。</p>
<p>kube-controller-manager.kubernetes-master.unknownuser.log.ERROR.20150930-173939.9847。</p>
<p>kube-controller-manager.kubernetes-master.unknownuser.log.INFO.20150930-173939.9847。</p>
<p>kube-controller-manager.kubernetes-master.unknownuser.log. WARNING.20150930-173939.</p>
<p>9847</p>
<p>在大多数情况下，我们从 WARNING 和 ERROR 级别的日志中就能找到问题的原因，但有 时还是需要排查 INFO 级别的日志甚至 DEBUG 级别的详细日志。此外，etcd 服务也属于 • 380</p>
<h2>第 394 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>Kubernetes 集群中的重要组成部分，所以它的日志也不能忽略。</p>
<p>如果是某个 Kubernetes 对象存在问题，则我们可以用这个对象的名字作为关键字搜索 Kubernetes 的日志来发现和解决问题。在大多数情况下，我们平常所遇到的主要是与 Pod 对象 相关的问题，比如无法创建Pod、Pod 启动后就停止或者Pod副本无法增加等。此时，我们可 以先确定Pod 在哪个节点上，然后登录这个节点，从kubelet 的日志中查询该Pod 的完整日志， 然后进行问题排查。对于与 Pod 扩容相关或者与 RC 相关的问题，则很可能在 kube-controller- manager 及 kube-scheduler 的日志上找出问题的关键点。</p>
<p>另外，kube-proxy 经常被我们忽视，因为即使它意外地被停止，Pod 的状态也是正常的， 但会导致某些服务访问异常的情况。这些错误通常与每个节点上的 kube-proxy 服务有着密切的 关系。遇到这些问题时，首先要排查 kube-proxy服务的日志，同时排查防火墙服务，特别是要 留意防火墻中是否有人为添加的可疑规则。</p>
<h3>5.3.4 常见问题</h3>
<p>本节对 Kubernetes 系统中的一些常见问题及解决方法进行说明。</p>
<p>1. 由于无法下载pause 镜像导致Pod 一直处于 Pending的状态 以 redis-master 为例，使用如下配置文件 redis-master-controller.yaml 创建 RC 和 Pod：</p>
<p>apiVersion: v1</p>
<p>kind: ReplicationController metadata：</p>
<p>name: redis-master labels：</p>
<p>name: redis-master SpeC：</p>
<p>replicas: 1</p>
<p>selector：</p>
<p>name：</p>
<p>redis-master</p>
<p>template：</p>
<p>metadata：</p>
<p>1abels：</p>
<p>name: redis-master Spec：</p>
<p>containers：</p>
<p>- name: master</p>
<p>image: kubeguide/redis-master ports：</p>
<p>- containerPort: 6379 • 381•</p>
<h2>第 395 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 执行 kubectl create -f redis-master-controller.yaml 成功。</p>
<p>但在查看Pod 时，发现其总是无法处于 Running状态。通过 kubectl get pods 命令可以看到：</p>
<p>$ kubectl get pods NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>redis-master-6yy70 0/1 RESTARTS AGE</p>
<p>Image: kubeguide/redis-master is ready, container is creating</p>
<p>5m</p>
<p>进一步使用 kubectl describe pod redis-master-6yy7o命令查看该Pod 的详细信息：</p>
<p>$ kubectl describe pod redis-master-6yy70 Name：</p>
<p>redis-master-6yy70 Namespace：</p>
<p>default</p>
<p>Image （s）：</p>
<p>kubeguide/redis-master Node：</p>
<p>127.0.0.1/127.0.0.1 Labels：</p>
<p>name=redis-master</p>
<p>Status：</p>
<p>Pending</p>
<p>Reason：</p>
<p>Message：</p>
<p>IP：</p>
<p>Replication Controllers：</p>
<p>redis-master （1/1 replicas created） Containers：</p>
<p>master：</p>
<p>Image：</p>
<p>state：</p>
<p>Reason：</p>
<p>kubeguide/redis-master Waiting</p>
<p>Image:kubeguide/redis-master is ready,container is creating</p>
<p>Ready：</p>
<p>Restart Count：</p>
<p>False</p>
<p>0</p>
<p>Conditions：</p>
<p>ryPe</p>
<p>Ready</p>
<p>status</p>
<p>False</p>
<p>Events：</p>
<p>FirstSeen</p>
<p>LastSeen</p>
<p>Count From</p>
<p>SubobjectPath</p>
<p>Reason</p>
<p>Message</p>
<p>Thu,24 Sep 2015 19:19:25 +0800 Thu,24 Sep 2015 19:25:58 +0800 3 ｛kubelet 127.0.0.1｝ failedSync Error syncing pod, skipping: image Pull failed for gcr.io/google_containers/pause-and64:3.0, this may be because there are no credentials on this request. details：（API error（500）：invalid registry endpoint https://gcr.io/v0/： unable to ping registry endpoint https://gcr.io/v0/v2 ping attempt failed with error: Get https://gcr.io/v2/：dial tcp 173.194.196.82:443：</p>
<p>connection refused vl ping attempt failed with error : Get https://gcr.io/v1/_Ping：</p>
<p>dial tcp 173.194.79.82:443:connection refused. If this private registry supports only HTTP Or HTTPS with an unknown CA certificate, please add&#x27;--insecure-registry gcr.io&#x27;to the daemon&#x27;s arguments. In the case of HTTPS,if you have access to the registry&#x27;s CA certificate,no need for the flag; simply place the CA certificate at /etc/docker/certs.d/gcr.io/ca.crt） • 382•</p>
<h2>第 396 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>Thu,24 Sep 2015 19:19:25 +0800 Thu,24 Sep 2015 19:25:58 +0800 3 ｛kubelet 127.0.0.1｝ implicitly required container POD failed Failed to pull image &quot;gcr.io/google_containers/pause-and64:3.0&quot;： image Pull failed for gcr.io/google_ containers/pause:0.8.0, this may be because there are no credentials on this request. details： （API error（500）：invalid registry endpoint https:// gcr.io/v0/：unable to ping registry endpoint https://gcr.io/v0/v2 ping attempt failed with error: Get https://gcr.io/v2/：dial tcp 173.194.196.82:443: connection refused V1 ping attempt failed with error: Get https://gcr.io/v1/_ping: dial tcp 173.194.79.82：</p>
<p>443:connection refused. If this private registry supports only HTTP Or HTTPS with an unknown CA certificate,please add&#x27;--insecure-registry gcr.io&#x27;to the daemon&#x27;s arguments. In the case of HTTPS,if you have access to the registry&#x27;s CA certificate， no need for the flag; simply place the CA certificate at /etc/docker/certs.d/gcr.io/ca.crt 可以看到，该Pod 的状态次 Pending，从 Message部分显示的信息可以看出其原因是 image pull failed for gcr.io/google _containers/pause-amd64:3.0，说明系统在创建 Pod 时无法从 gcr.io 下载 pause 镜像，所以导致创建Pod 失败。</p>
<p>解决方法如下。</p>
<p>（1）如果服务器可以访问 Internet，并且不希望使用HTTPS 的安全机制来访问 gcr.io，则可 以在 Docker Daemon 的启动参数中加上--insecure-registry gcr.io 来表示可以进行匿名下载。</p>
<p>（2）如果 Kubernetes 集群环境在内网环境中，无法访问 ggcr.io 网站，则可以先通过一台能 够访问 gcr.io的机器将 pause 镜像下载下来，导出后，再导入内网的Docker 私有镜像库中，并 在kubelet 的启动参数中加上--pod_infra_container_image，配置为：</p>
<p>--Pod_infra_container_image=&lt;docker_registrY_ip&gt;：&lt;port&gt;/google_containers/pa use-amd64:3.0</p>
<p>之后重新创建 redis-master 即可正确启动 Pod 了。</p>
<p>注意，除了 pause镜像，其他Docker镜像也可能存在无法下载的情况，与上述情况类似， 很可能也是网络配置使得镜像无法下载，解决方法同上。</p>
<p>2. Pod创建成功，但状态始终不是 Ready，且 RESTARTS 的数量持续增加 在创建了一个 RC 之后，通过 kubectl get pods 命令查看Pod，发现如下情况：</p>
<p>$ kubectl get pods STATUS RESTARTS</p>
<p>Running</p>
<p>zk-bg-ri3ru</p>
<p>••••••</p>
<p>$ kubectl get pods NAME</p>
<p>READY</p>
<p>zk-bg-ri3r</p>
<p>011</p>
<p>STATUS RESTARTS AGE Running</p>
<p>•383•</p>
<h2>第 397 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） •••</p>
<p>kubectl get pod</p>
<p>NAME</p>
<p>READY</p>
<p>zk-bg-ri3ru 0/1</p>
<p>STATUS</p>
<p>RESTARTS</p>
<p>AGE</p>
<p>ExitCode:0 6</p>
<p>1m</p>
<p>…..</p>
<p>$ kubectl get pods NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS AGE</p>
<p>zk-bg-ri3ru 0/1</p>
<p>Running 7</p>
<p>1m</p>
<p>可以看到 Pod 已经创建成功了，但Pod 的状态一会儿是 Running，一会儿是 ExitCode:0， READY 列中始终无法变成1，而且 RESTARTS（重启的数量）的数量不断增加。</p>
<p>通常造成这种现象是因为容器的启动命令不能保持前台运行。</p>
<p>本例中的Docker 镜像的启动命令为：</p>
<p>zkServer.sh start-background 在 Kubernetes 根据 RC定义创建Pod 后启动容器，容器的启动命令执行完成时，即认为该 容器的运行已经结束，并且是成功结束（ExitCode=0）。然后，根据 Pod 的默认重启策略定义 （RestartPolicy=Always），RC 将启动这个容器。</p>
<p>新的容器执行启动命令后仍然会成功结束，然后 RC 会再次重启该容器，进入一个无限循 环的过程中。</p>
<p>解决方法为将 Docker 镜像的启动命令设置为一个前台运行的命令，例如：</p>
<p>start-foreground</p>
<p>zkServer.sh</p>
<h3>5.3.5 寻求帮助</h3>
<p>如果通过系统日志和容器日志都无法找到出现问题的原因，则还可以追踪源码进行分析， 或者通过一些在线途径寻求帮助。</p>
<p>c Kubernetes 的常见问题参见 htrps://github.com/GoogleCloudPlatform/kubemnetes/wiki/User-FAQ。</p>
<p>Debugging 的常见问题参见 https://github.com/GoogleCloudPlatform/kubernetes/wiki/ Debugging-FAQ。</p>
<p>Service 的常见问题参见 https://github.com/GoogleCloudPlatform/kubemetes/wiki/Services-FAQ。</p>
<p>StackOverflow 网站关于 Kubernetes 的主题参见 http://stackoverflow.com/questions/ tagged/ kubernetes 或 http://stackoverflow.com/questions/tagged/google-container-engine。</p>
<p>IRC 频道 （#google-containers）参见 https://botbot.me/freenode/google-containers/。</p>
<p>◎</p>
<p>Kubernetes 邮件列表 Email 参见 google-containers@googlegroups.com.</p>
<p>•384</p>
<h2>第 398 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<h3>5.4 Kubernetes V1.3 开发中的新功能</h3>
<p>本节对 Kubernetes v1.3版本的正在开发中的一些新功能进行介绍，包括 Pet Set（用于管理 有状态的容器应用）、init container（Pod 中的初始化容器）、Cluster Federation（集群联邦管理） 等内容。</p>
<h3>5.4.1 Pet Set（有状态的容器）</h3>
<p>在 Kubernetes集群中，组成一个微服务的后端Pod一般来说都是无状态的容器应用。例如 通过RC来进行管理，只需要维持 Pod 的副本数量即可，当某个 Pod失败时就直接销毁并重新 创建一个新的Pod，提供能够水平扩展的微服务。我们可以称这类应用“Cattle”（农场动物）， 即单个实例不是特别重要，可随时被替换。</p>
<p>但对于有状态的应用来说，即以集群的方式部署的大型应用软件，每个实例都需要具备唯 一的标识，并且各个实例可能还有启动顺序的要求。v1.3版本新增了一种名 PetSet 的资源对 象，用于支持有状态的容器应用。我们可以称这类应用为“Pet”（宠物），即每个实例都非常重 要，其身份不应被别的实例替换。</p>
<p>Pet Set 能够确保为每个Pet设置一个唯一的身份标识，包括如下几种。</p>
<p>唯一且不变的 hostname，并保存在 DNS中。</p>
<p>唯一的顺序编号，用于确保各实例的启动顺序。</p>
<p>◎</p>
<p>为每个容器提供永久存储，与其 hostname 和启动顺序绑定。</p>
<p>Pet Set 能够用于许多应用场景，如下所述。</p>
<p>数据库应用，例如 MySQL 或PostgreSQL，其每个实例都需要挂载一个外部的永久存储。</p>
<p>© 集群化的应用软件，例如 ZooKeeper、etcd、ElasticSearch 等需要集群中的各成员有稳 定的身份。</p>
<p>下面的例子描述了 PetSet 的创建和用法。</p>
<p>Petset.yaml</p>
<p># 使用 headless Service，以创建相应 Pod的 DNS 记录 apiVersion: v1</p>
<p>kind: Service</p>
<p>metadata：</p>
<p>name: nginx</p>
<p>labels：</p>
<p>app: nginx</p>
<p>• 385•</p>
<h2>第 399 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） - port:80</p>
<p>name: web</p>
<p>#*.nginx.default.svc.cluster.local clusterIP:None</p>
<p>selector：</p>
<p>app:nginx</p>
<p># PetSet 的定义</p>
<p>apiversion:apps/vlalphal kind:Petset</p>
<p>metadata：</p>
<p>name: web</p>
<p>speC：</p>
<p>serviceName： &quot;nginx&quot; replicas: 2</p>
<p>template：</p>
<p>metadata：</p>
<p>labels：</p>
<p>app: nginx</p>
<p>annotations：</p>
<p>pod.alpha.kubernetes.io/initialized：&quot;true&quot; spec：</p>
<p>terminationGracePeriodSeconds: 0 - name: nginx</p>
<p>image:gcr.io/google_containers/nginx-31im:0.8 - containerPort: 80 name: web</p>
<p>volumeMounts：</p>
<p>- name: www</p>
<p>mountPath: /usr/share/nginx/html volumeClaimTemplates：</p>
<p>- metadata：</p>
<p>name:www</p>
<p>annotations：</p>
<p>volume.alpha.kubernetes.io/storage-class: anything spec：</p>
<p>accessModes：</p>
<p>&quot;ReadwriteOnce&quot; ］</p>
<p>resourceS：</p>
<p>requests：</p>
<p>storage：</p>
<p>1Gi</p>
<p>在 PetSet定义中，需要设置永久存储“volumeClaimTemplates”，需要系统管理员预先创建 好外部 PV（Persistent Volume），才能给 PetSet 使用。</p>
<p>• 386•</p>
<h2>第 400 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>使用 kubectl create 命令创建该 PetSet：</p>
<p>$ kubect1 create -f petset.yaml service &quot;nginx&quot; created petset &quot;nginx&quot; created 查看创建好的Pod 的信息：</p>
<p>$ kubectl get pods NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS AGE</p>
<p>web-O</p>
<p>Running</p>
<p>web-1</p>
<p>Running</p>
<p>可以看到每个 Pod的名称不再是通过 RC 创建的带有一个 UUID 的名称，而是由 “petset name” 与一个序列号组成的特定名称：web-0和web-1。</p>
<p>而Pod 名称也就是该Pod 的 hostname，即 Pet Set 为每个 Pet 设置了稳定的主机名。</p>
<p># kubectl exec web-0 -- sh -c &#x27;hostname&#x27; # kubectl exec web-1 -- sh -c&#x27;hostname&#x27; 同时，每个Pod的网络身份也通过Service的定义被创建出来。根据Service的定义，该Service 将在 DNS中生成一条没有 ClusterIP 的记录：</p>
<p>nginx.default.svc.cluster.1ocal 该 Service 的后端为两个 Pet 的地址（可以看成是 Pet 的服务名）：</p>
<p>web-0.nginx.default.svc.cluster.1ocal web-1.nginx.default.svc.cluster.1ocal 这两个 Pet 的地址 web-0.nginx 和 web-l.nginx 将作每个 Pet 的稳定网络身份被系统保存 在DNS中，供客户端应用访问。</p>
<p>接下来通过一个 busybox 容器执行 nslookup，验证 Pet 的服务地址：</p>
<p># kubectl run -i --tty --image busybox dns-test --restart=Never /bin/sh Hit enter for command prompt 查询 web-0.nginx：</p>
<p>/ # nslookup web-0.nginx Server：</p>
<p>169.169.0.100</p>
<p>Address</p>
<p>1:169.169.0.100</p>
<p>Name：</p>
<p>web-0.nginx</p>
<p>Address 1:172.17.1.2 查询 web-1.nginx：</p>
<p>/ # nslookup web-1.nginx • 387•</p>
<h2>第 401 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） Server：</p>
<p>169.169.0.100</p>
<p>Address 1: 169.169.0.100 Name：</p>
<p>web-1.nginx</p>
<p>Address 1: 172.17.1.3 如果直接查询 Nginx 服务（headless service），则系统将返回后端两个 Pet 的IP 地址列表：</p>
<p>/ # nslookup nginx Server：</p>
<p>169.169.0.100</p>
<p>Address</p>
<p>1：</p>
<p>169.169.0.100</p>
<p>Name：</p>
<p>nginx</p>
<p>Address 1: 172.17.1.2 Address 2:172.17.1.3 借助于 headless service 的功能，可以实现各 Pet 相互之间进行发现和访问。</p>
<p>当前版本 Pet Set 的使用限制如下。</p>
<p>只有 replicas 字段可以被更新，但更新后 Pet Set 仍然是按顺序依次创建各 Pet。</p>
<p>删除 petset 时，系统不会自动删除已经运行中的Pets，需要手工删除。</p>
<p>出于数据安全的考虑，在删除 Pet 时系统不会自动删除该Pet 使用的PV 存储。</p>
<p>目前不支持 Pet 镜像的滚动升级操作，需要手工完成。</p>
<p>5.4.2</p>
<p>Init Container（初始化容器） 在很多应用场景中，应用在启动之前都需要一些初始化的操作，例如：</p>
<p>◎ 等待其他关联组件正确运行（例如数据库或某个后台服务）；</p>
<p>基于环境变量或配置模板生成配置文件；</p>
<p>》 从远程数据库获取本地所需配置，或者将自身注册到某个中央数据库；</p>
<p>◎ 下载相关依赖包，或者对系统进行一些预配置操作。</p>
<p>Kubernetes v1.3版本引入了一个Alpha 版本的新特性：init container，用于在启动普通容器 之前启动一个或多个“初始化”容器，完成普通容器所需要的预置条件，如图5.22所示。init container 与普通容器本质上是一样的，但它们是仅运行一次就结束的任务，并且必须成功执行 完成后，系统才能继续执行下一个容器。根据 Pod 的重启策略（RestartPolicy），当 init container 执行失败，在设置了 RestartPolicy=Never 时，Pod 将会启动失败；而设置 RestartPolicy=Always 时，Pod 将会被系统自动重后。</p>
<p>• 388•</p>
<h2>第 402 页</h2>
<h3>第5章</h3>
<p>Kubernetes 运维指南</p>
<p>Pod</p>
<p>init 容器！</p>
<p>init 容器2</p>
<p>Application 容器</p>
<p>图 5.22 init container 在当前的版本中要启用 init container 的配置，需要在Pod 的 annotation 字段中设置 pod.alpha.</p>
<p>kubernetes.io/init-containers 来定义需要执行的初始化容器列表。</p>
<p>下面，以 Nginx 应用为例，在启动 Nginx 之前，通过初始化容器 busybox * Nginx 创建一 个index.html 主页文件。</p>
<p>nginx-init-containers.Yaml apiversion:v1</p>
<p>kind: Pod</p>
<p>metadata：</p>
<p>name:nginx</p>
<p>annotations：</p>
<p>pod.alpha.kubernetes.io/init-containers： &#x27;［ “name&quot;：&quot;insta11&quot;，</p>
<p>&quot;image&quot;：&quot;busybox&quot;， &quot;&#x27;comand&quot;：［&quot;wget&quot;， &quot;-O&quot;，&quot;/wozk-diz/index.html&quot;， &quot;http://kubernetes.io/index.htm1&quot;］， &quot;volumeMounts&quot;：［</p>
<p>｛</p>
<p>&quot;name&quot; ：&quot;workdir&quot;， &quot;mountPath&quot;：&quot;/work-dir&quot; ｝</p>
<p>｝</p>
<p>】&#x27;</p>
<p>spec：</p>
<p>containers：</p>
<p>- name:nginx</p>
<p>image: nginx</p>
<p>ports：</p>
<p>- containerPort: 80 volumeMounts：</p>
<p>- name: workdir</p>
<p>mountPath: /usr/share/nginx/html • 389•</p>
<h2>第 403 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） ansPolicy: Default volumes：</p>
<p>- name:workdir</p>
<p>emptyDir： ｛｝</p>
<p>创建这个 Pod：</p>
<p># kubect1 create -f nginx-init-containers.yaml pod &quot;nginx&quot; created 在运行 init container 的过程中，查看Pod 的状态，可见Init过程还未完成：</p>
<p># kubectl get pods NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS AGE</p>
<p>nginx</p>
<p>0/1</p>
<p>Init:0/1</p>
<p>0</p>
<p>1m</p>
<p>当 init container 成功执行完成，系统继续启动 Nginx 容器，再次查看Pod 的状态：</p>
<p># kubectl get pods NAME</p>
<p>READY</p>
<p>STATUS</p>
<p>RESTARTS</p>
<p>nginx</p>
<p>1/1</p>
<p>Running</p>
<p>0</p>
<p>AGE</p>
<p>7s</p>
<p>查看Pod 的事件，可以看到系统按顺序运行 Pod 中的各个容器：</p>
<p># kubect1 describe pod nginx Name：</p>
<p>nginx</p>
<p>Namespace：</p>
<p>default</p>
<p>⋯（略）</p>
<p>Events：</p>
<p>FirstSeen</p>
<p>Count From</p>
<p>SubobjectPath</p>
<p>Type</p>
<p>LastSeen</p>
<p>Reason</p>
<p>Message</p>
<p>4s</p>
<p>4s</p>
<p>Normal</p>
<p>Scheduled</p>
<p>4s</p>
<p>4s</p>
<p>spec.initContainers｛instal1｝ already present on machine 4s</p>
<p>4s</p>
<p>spec.initContainers｛insta11｝ docker id 81d3ef7ade94 4s</p>
<p>4s</p>
<p>spec.initContainers｛instal1｝ docker id 81d3eflade94 3s</p>
<p>3s</p>
<p>spec.containers｛nginx｝ already present on machine 3s</p>
<p>3s</p>
<p>spec.containers｛nginx｝ docker id 5a0bc53661£6 2s</p>
<p>2s</p>
<p>1</p>
<p>｛default-scheduler ｝ Successfully assigned nginx to k8s-node-1 1</p>
<p>｛kubelet k8s-node-1｝ Normal</p>
<p>Pulled</p>
<p>Container image &quot;busybox&quot; 1</p>
<p>Normal</p>
<p>｛kubelet k8s-node-1｝ Created</p>
<p>Created container with 1</p>
<p>Norma1</p>
<p>｛kubelet k8s-node-1｝ Started</p>
<p>started container with Normal</p>
<p>｛kubelet k8s-node-1｝ Pulled</p>
<p>Container image &quot;nginx&quot; 1</p>
<p>Normal</p>
<p>｛kubelet k8s-node-1｝ Created</p>
<p>Created container with 1</p>
<p>｛kubelet k8s-node-1｝ • 390•</p>
<h2>第 404 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>spec.containers｛nginx｝ Normal</p>
<p>Started</p>
<p>Started container with docker id 5a0bc53661£6 在init container 的后续演进中，将进一步考虑Pod 的资源使用限制、健康检查、镜像更新 等问题。</p>
<h3>5.4.3 Cluster Federation（集群联邦）</h3>
<p>集群联邦是管理多个 Kubernetes 集群的集群，用于多个集群中的服务统一管理，以及当一 个集群发生故障时，能够将业务恢复到其他集群上，如图5.23所示。目前集群联邦只能在谷歌 或亚马逊的公有云上进行配置和使用。</p>
<p>Federation Control Plane 集群2</p>
<p>集群3</p>
<p>图 5.23</p>
<p>集群联邦</p>
<p>集群联邦的主要组件由 Federation Control Plane（控制平面）来完成对多个集群的管控，其 核心组件包括 federation-apiserver 和 federation-controller-manager 和 etcd，可以在已经存在的一 个 Kubernetes 集群上以 Pod的形式启动这些Federation 组件。</p>
<p>下面以在 GCE 上运行一个 Cluster Federation 为例，创建 federation-apiserver 和 federation- controller-manager 的命令为：</p>
<p>$ KUBERNETES</p>
<p>_PROVIDER=gCe FEDERATION_ _DNS_PROVIDER=google-clouddns FEDERATION_NAME=myfederation DNS_ZONE_NAME=myfederation.example FEDERATION</p>
<p>_PUSH</p>
<p>_REPO_BASE=gcr.io/google_containers ./federation/cluster/federati on-up.sh</p>
<p>各个参数的含义如下。</p>
<p>◎</p>
<p>KUBERNETES_PROVIDER：云服务商。</p>
<p>FEDERATION_DNS_PROVIDER： 可以是 google-clouddns 或者 aws-route53。如果已 经把 KUBERNETES_PROVIDER 设置gce、gke 及aws 中的一个，那么系统会自动设 置这一变量。该设置项用于为联邦服务提供域名解析能力。当联邦中的 Kubernetes 集 群上的Pod 或者 Service 发生变更的时候，会在DNS 记录上做出相应的变更。</p>
<p>• 391•</p>
<h2>第 405 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） FEDERATION_NAME：联邦的名称，这一名称也会反映在 DNS 记录之中。</p>
<p>DNS_ZONE_NAME:DNS 记录的域名。用户需要购买和使用这个域名，让 FEDERATION_DNS</p>
<p>；_PROVIDER 能够为这一域名的查询提供正确的解析结果。</p>
<p>通过上面的命令会创建一个 federation 命名空间，并创建两个 Deployment 对象：</p>
<p>federation-apiserver 及 federation-controller-manager。</p>
<p>验证创建出来的 deployment：</p>
<p>$ kubect1 get deployments --namespace=federation NAME</p>
<p>DESIRED</p>
<p>CURRENT</p>
<p>federation-apiserver 1</p>
<p>federation-controller-manager 1 1</p>
<p>1</p>
<p>UP-TO-DATE</p>
<p>1</p>
<p>1</p>
<p>AVAILABLE</p>
<p>AGE</p>
<p>1</p>
<p>1m</p>
<p>1</p>
<p>1m</p>
<p>•</p>
<p>federation-up.sh 还会在kubeconfig 中创建一个新纪录，用来和联邦 APIServer 进行通信。可 以使用 kubectl config view 来查看。</p>
<p>另外，federation-up.sh 创建的 federation-apiserver Pod 中包含的 etcd 容器使用了PV持久卷， 用来提供持久化数据存储，目前只能在 AWS、GKE 或GCE 环境中进行创建。具体的PV设置 可以通过修改 federation/manifests/federation-apiserver-deployment.yaml 来完成。</p>
<p>在联邦控制平面启动之后，就可以对现有的 Kubernetes 集群进行纳管了。</p>
<p>首先，我们需要创建一个 secret 对象，其中包含了 Kubernetes 集群的 kubeconfig，联邦将 会用这一内容和受管集群进行通信。假设 kubeconfig 文件位于/cluster!/kubeconfig，用下面的命 令来创建 secret：</p>
<p>s kubectl create</p>
<p>secret generic clusterl --namespace=federation --from-file=/ cluster1/kubeconfig 文件名kubeconfig 将用于设置 secrete 的key 名称。</p>
<p>创建好 secret 之后，就可以注册集群了，一个集群对象的yaml配置文件如下：</p>
<p>apiVersion: federation/vlbetal kind: Cluster</p>
<p>metadata：</p>
<p>name：</p>
<p>cluster1</p>
<p>spec：</p>
<p>serverAddressByClientCIDRs：</p>
<p>- clientCIDR： &lt;client-cidr&gt; serverAddress ： &lt;apiserver-address&gt; secretRef：</p>
<p>name： &lt;secret-name&gt; 需要把&lt;client-cidr&gt;、&lt;apiserver-address&gt;及&lt;secret-name&gt;替换实际内容。&lt;secret-name&gt;是 前面刚刚创建的 secret 的名称。serverAddressByClientCIDRs 包含一系列地址，符合CIDR 的客 • 392•</p>
<h2>第 406 页</h2>
<h3>第5章</h3>
<p>Kubernetes 运维指南</p>
<p>户端才能连接服务器的这一地址。我们可以设置服务器地址的CIDR为“0.0.0.0/0”，这样所有 的客户端都可以访问。另外，如果希望内部客户端使用服务器的 clusterIP，则可以把这一P设 置次 serverAddress，然后设置 clientCIDR 为集群内的Pod地址范围。</p>
<p>将该 yaml 文件保存为/cluster1/cluster.yaml，运行下面的命令来进行集群的纳管：</p>
<p>s kubectl create -f /clusterl/cluster.yaml --context=federation-cluster 设置--context=federation-cluster 意思是将请求发往联邦的 federation-apiserver。</p>
<p>查看纳管的结果：</p>
<p>s kubectl get clusters --context=federation-cluster NAME</p>
<p>STATUS</p>
<p>VERSION</p>
<p>AGE</p>
<p>clusterl</p>
<p>Ready</p>
<p>3m</p>
<p>当集群纳管之后，就可以使用集群联邦的功能了。</p>
<p>为了支持跨集群的服务发现机制，需要扩展 KubeDNS 服务，通过--federations 参数设置集 群联邦的总 DNS服务：</p>
<p>--federations=$｛FEDERATION NAME｝=S （DNS_DOMAIN_NAME） 可以通过编辑现有 KubeDNS 的RC 中所包含的Pod模板来 Pod加入这一参数，删除当 前运行的Pod之后，RC就会根据新的模板创建带有联邦 DNS信息的KubeDNS 服务了。</p>
<p>S kubectl get rc --namespace=kube-system kube-dns 的RC 名是kube-dns-［id］的形式，用 edit 进行编辑：</p>
<p>s kubectl edit rc &lt;rc-name&gt;--namespace=kube-system 在弹出的yaml 文件中加入-federation 参数，保存退出，然后查询并删除现有的 Pod。</p>
<p>s kubectl delete pods &lt;pod-name&gt; --namespace=kube-system 至此，集群联邦设置完成，接下来就可以在多个集群上部署应用了。</p>
<p>假设当前已有4个集群纳管进了集群联邦：</p>
<p>s kubectl get clusters --context=federation-cluster STATUS</p>
<p>在这4个集群上创建 Nginx 服务：</p>
<p>$ kubectl --context=federation-cluster create -f services/nginx.yaml 等待该服务在所有集群上创建完成，并且集群联邦内的服务也更新完成，通常这需要几分 钟。</p>
<p>• 393•</p>
<h2>第 407 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 查看服务的状态，可以看到在每个集群上创建的Loadbalancer 的IP 地址：</p>
<p>$ kubect1--context=federation-cluster describe services nginx Name：</p>
<p>nginx</p>
<p>Namespace：</p>
<p>default</p>
<p>Labels：</p>
<p>run=nginx</p>
<p>Selector：</p>
<p>run=nginx</p>
<p>Type：</p>
<p>LoadBalancer</p>
<p>LoadBalancer Ingress：</p>
<p>104.199.136.89</p>
<p>Port：</p>
<p>Endpoints：</p>
<p>Session Affinity：</p>
<p>No events.</p>
<p>104.197.246.190,130.211.57.243,104.196.14.231， http</p>
<p>80/TCP</p>
<p>&lt;none&gt;</p>
<p>None</p>
<p>登录其中一个集群，查看由 federation-controller-manager 创建的 Nginx 服务：</p>
<p>s kubect1 --context=clusterl get svc nginx CLUSTER-IP</p>
<p>EXTERNAL-IP</p>
<p>PORT （S）</p>
<p>nginx</p>
<p>10.63.250.98</p>
<h3>104.199.136.89 80/TCP</h3>
<p>AGE</p>
<p>9m</p>
<p>可以看到集群联邦通过在每个集群上创建一个同名的服务，但此时由于每个集群的 Service 后端还没有运行任何 Pod，所以这些联邦服务还无法正常工作。</p>
<p>接下来通过在每个集群上运行 Pod 来支撑 Service：</p>
<p>s kubectl --context=clusterl run nginx --image=nginx:1.11.1-alpine --port=80 s kubectl --context=cluster2 run nginx --image=nginx:1.11.1-alpine --port=80 s kubectl --context=cluster3 run nginx --image=nginx:1.11.1-alpine --port=80 s kubect1 --context=cluster4 run nginx --image=nginx:1.11.1-alpine --port=80 当这些Pod成功运行后，Service 将被集群联邦设置正常状态，然后集群联邦将会配置相 应的公共 DNS 记录。假设使用的是 Google Cloud DNS，并且 DNS域名內 example.com，则可 以看到每个集群上的Nginx服务都被设置好了一个 DNS 名，可供其他应用访问时使用：</p>
<p>s gcloud dns managed-zones describe example-dot-com creationTime：，2016-06-26T18:18:39.22921 description: Example domain for Kubernetes Cluster Federation dnsName: example.com.</p>
<p>id:132293321813342431211 kind: dns#managedZone name: example-dot-com nameServers：</p>
<p>- ns-cloud-al.gooqledomains.com.</p>
<p>- ns-cloud-a2.googledomains.com.</p>
<p>- ns-cloud-a3.googledomains.com.</p>
<p>- ns-cloud-a4.gooqledomains.com.</p>
<p>• 394•</p>
<h2>第 408 页</h2>
<h3>第5章 Kubernetes 运维指南</h3>
<p>$ gcloud dns record-sets list --zone example-dot-com TYPE</p>
<p>TTL</p>
<p>21600</p>
<p>DATA</p>
<p>example.com.</p>
<p>ns-cloud-el.googledomains.com.，ns-cloud-e2.googledomains.com.</p>
<p>example.com.</p>
<p>21600</p>
<p>ns-cloud-el .googledomains.com. cloud-dns-hostmaster.google.com. 1 21600 3600 1209600 300</p>
<p>nginx.mynamespace.myfederation.svc.example.com.</p>
<p>180</p>
<p>104.XXx.xxX.XXX,130.xxx.xx.XXX,104.xxx.Xx.XxX,104.Xxx.xXX.XX nginx.mynamespace.myfederation.svc.clusterl.example.com.</p>
<p>A</p>
<p>180</p>
<p>104.XXX.XXX.XXX</p>
<p>nginx.mynamespace.myfederation.svc.cluster2.example.com.</p>
<p>180</p>
<p>104.XXX.XXX.XXX,104.XXX.XXX.XXX,104.XXX.XXX.XXX nginx.mynamespace.myfederation.svc.cluster3.example.com.</p>
<p>180</p>
<p>130.XXX.X×.XX×</p>
<p>nginx.mynamespace.myfederation.svc.cluster4.example.com.</p>
<p>180</p>
<p>130.XXX.XX.XXX,130.Xxx.Xx.XXX nginx.mynamespace.myfederation.svc.cluster4.example.com.</p>
<p>180</p>
<p>nginx.mynamespace .myfederation.svc.example.com.</p>
<p>• 395•</p>
</div>
