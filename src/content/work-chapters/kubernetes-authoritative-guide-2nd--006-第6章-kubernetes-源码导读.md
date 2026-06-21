---
title: "第6章 Kubernetes 源码导读"
description: "第6章 Kubernetes 源码导读 6.1 Kubernetes 源码结构和编译步骤 Kubernetes 的源码现在托管在 GitHub 上，地址为 https://github.com/googlecloudplatform/ kubernetes。 编译脚本存放在build 子目录下，在 Linux 环境（可以是虚拟机）中执行如下命令即可完成 代码"
sourceUrl: "授权 PDF：Kubernetes权威指南：从Docker到Kubernetes实践全接触（第2版).pdf，页 409-519"
workSlug: "kubernetes-authoritative-guide-2nd"
workTitle: "Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第 2 版）"
chapterSlug: "006-第6章-kubernetes-源码导读"
order: 6
categories: ["云原生", "Kubernetes"]
tags: ["Kubernetes", "Docker", "容器", "集群管理"]
---
<div class="imported-document imported-pdf-document">
<h2>第6章 Kubernetes 源码导读</h2>
<h2>第 409 页</h2>
<h3>第6章</h3>
<p>Kubernetes 源码导读</p>
<p>6.1</p>
<p>Kubernetes 源码结构和编译步骤 Kubernetes 的源码现在托管在 GitHub 上，地址为 https://github.com/googlecloudplatform/ kubernetes。</p>
<p>编译脚本存放在build 子目录下，在 Linux 环境（可以是虚拟机）中执行如下命令即可完成 代码的编译过程：</p>
<p>git clone https://github.com/GoogleCloudPlatform/kubernetes.git cd kubernetes/build ./release.sh</p>
<p>制作 release 的过程其实有不少有意思的事情发生，包括启动 Docker 容器来安装Go语言环 境、etcd 等，读者若有兴趣则可以查看 release.sh 脚本。另外，如果编译环境是通过HTTP 代理 上网的，则需要设置好 Git 与 Docker 相关的 HTTP 代理参数，同时在文件kubernetes/build/ build-image/Dockerfile 中增加如下 HTTP 代理参数。</p>
<p>◎</p>
<p>ENV http_proxy=http://username;password@proxyaddr proxyport。</p>
<p>ENV https_proxy=http://userame:password@proxyaddr:proxyport。</p>
<p>在编译过程中产生的与 Docker 相关的docker image、dockerfile 及编译好的二进制文件包， 则存放在 kubernetes/</p>
<p>Loutput 目录下，这个目录总共有4个子目录：dockerized、images、 release-stage、release-tars，我们关心后两个目录，其中 release-stage 目录下存放的是支持 linux-amd64 架构的 Server 端的二进制可执行文件（放在 server 子目录下），以及支持不同平台 的 Client端的二进制可执行文件（放在 client 子目录下），release-tars 则存放的是 release-stage 目录下各级子目录的压缩包，与从官方网站下载的完全一样。</p>
<h2>第 410 页</h2>
<h3>第6章</h3>
<p>Kubernetes 源码导读</p>
<p>考虑到学习和调试 Kubernetes 代码的便利性，我们接下来介绍如何在 Windows 的 LiteIDE 开发环境中完成 Kubernetes 代码的编译和调试。本文假设 Windows 上的 GO 运行时框架和 LiteIDE 开发环境已经建立好，并通过 git clone 命令已经将 https://github.com/ GoogleCloudPlatform/kubernetes.git 下载到本地 C:kubernetes 目录中。通过分析 Kubernetes 的目 录结构，我们发现 Kubernetes 的源码都在pkg 子目录下。接下来建立k8s 工程目录，目录位置 为 C:projectgo k8s，并在里面建立 stc、pkg 两个子目录，然后把 C:kuberneteslGodeps_ workspace lsrc 全部转移到 C:projectlgo lk8slisrc 目录下，因为这里是 Kubernetes 源码的所有依赖 包，所以如果手动一个一个地下载，则恐怕以国内的网速一天也搞不定。转移完成后， C:project go lk8sIsrc 的目录结构包括如下内容：</p>
<p>C:lproject \golk8s|src&gt;dir 2015-07-14</p>
<p>11:56</p>
<p>&lt;DIR&gt;</p>
<p>2015-07-14</p>
<p>11:56</p>
<p>&lt;DIR&gt;</p>
<p>2015-07-17</p>
<p>12:30</p>
<p>&lt;DIR&gt;</p>
<p>2015-07-14</p>
<p>11:56</p>
<p>&lt;DIR&gt;</p>
<p>2015-07-14</p>
<p>11:56</p>
<p>&lt;DIR&gt;</p>
<p>2015-07-14</p>
<p>11:56</p>
<p>＜DIR&gt;</p>
<p>2015-07-14</p>
<p>11:56</p>
<p>&lt;DIR&gt;</p>
<p>bitbucket.org</p>
<p>code.google.com</p>
<p>github.com</p>
<p>golang.org</p>
<p>google.golang.org</p>
<p>gopkg.in</p>
<p>speter.net</p>
<p>接下来把 C:kubernetes 的整个目录移动到 C：\projectlgo k8slsrc github.comlGoogleCloudPlatforml 下，因为 Kubernetes 的源码包的完整名字为 “github.com/GoogleCloudPlatform/kubernetes/pkg”。</p>
<p>上述工作完成以后，所有的源码都在 C:project go k8sisre 目录下了，我们用 LiteIDE 打开 C:/projectgo k8s，单击菜单“查看” “管理Gopath” 一添加目录“C:projectgo lk8s”，然后可 以进入目录 github.com/ GoogleCloudPlatform/kubernetes/pkg 下，逐一编译每个 package 目录了， 如图6.1所示。</p>
<p>Edit Find，</p>
<p>yiew</p>
<p>Build Dehug tlelo</p>
<p>s:oume2:Coryen</p>
<p>heapste</p>
<p>api</p>
<p>apIs</p>
<p>apisk</p>
<p>auth</p>
<p>cloue</p>
<p>&gt; bitbucket.org/berti gittub.com/Sinups</p>
<p>&gt; qithub.com/Sinups 图 6.1</p>
<p>Go.8und</p>
<p>Go Instail</p>
<p>Go Test</p>
<p>Go Qean</p>
<p>New File.</p>
<p>New File Wizard.</p>
<p>Rename Folder.</p>
<p>Delete Fokder</p>
<p>/kubernetes/pka/clent/unwersioned/remotecomman M/kubernetes/pkg/client/unversioned/auth Use godec Vew：</p>
<p>rc/k8s.io/kubernetes/pkg/kubecti/resource ykubernetes/pkg/cfient/unversioned/clientcmd Doen Teminal Hece</p>
<p>Open Expiorer Here J: Soorch Resuk f: HTiLmenel Si Debing Output o: orode 7: Gdong Oox Seech LiteIDE 编译 Kubernetes 的 package • 397•</p>
<h2>第 411 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 在每个 package 都编译完成以后，我们可以尝试启动 kube-scheduler 进程：在 LiteIDE 里打 开 github.com/GoogleCloudPlatform/kubernetes/pkg/plugin/cmd/kube-scheduler/scheduler.go，并且 按快捷键 Ctrl+R，你会惊奇地发现这个 Kubernetes 服务器端进程竟然也能在 Windows 下运行起 来。以下是 LiteIDE 输出的控制台日志：</p>
<p>c:/go/bin/go.exe build -i ［C:/project/go/k8s/src/github.com/GoogleCloudPlatform/ kubernetes/plugin/cmd/kube-scheduler］ 成功：进程退出代码0。</p>
<p>C:/project/go/k8s/src/github.com/GoogleCloudPlatform/kubernetes/plugin/cmd/ kube-scheduler/kube-scheduler.exe ［C:/project/go/k8s/src/github.com/GoogleCloud Platform/kubernetes/plugin/cmd/kube-scheduler］ W0717 16:05:26.742413 11344 server.go: 83］ Neither --kubeconfig nor --master was specified. Using default API client. This might not work.</p>
<p>E0717 16:05:27.747413 11344 reflector.go:136］ Failed to list *api.Node: Get http://1ocalhost:8080/api/v1/nodes?fieldSelector=spec.unschedulablee3Dfalse: dial tcp 127.0.0.1:8080:ConnectEx tcp: No connection could be made because| the target</p>
<p>actively refused it.</p>
<p>E0717 16:05:27.748413 11344 reflector.go:136］ Failed to list *api.Pod: Get http://localhost:8080/api/v1/pods?fieldSelector=spec.nodeNamee21e3D: dial tcp 127.0.0.1:8080:ConnectEx tcp: No connection could be made because the target machine actively refused it.</p>
<p>在 Kubernetes 的源码里包括不少单元测试，你可以在LiteIDE 里运行通过，但有部分测试 代码目前在 Windows 上无法通过，毕竟 Kubernetes 是为 Linux 打造的。接下来我们分析下 Kubernetes 源码的整体结构，Kubernetes 的源码总体分为 pkg、cmd、plugin、test 等顶级 package， 其中 pkg为 Kubernetes 的主体代码，cmd 为 Kubernetes 所有后台进程的代码（如 kube-apiserver 进程、kube-controller-manager 进程、kube-proxy 进程、kubelet 进程等），plugin 则包括一些插件 及 kuber-scheduler 的代码，test 包是 Kubernetes 的一些测试代码。</p>
<p>从总体来看，Kubernetes 1.0的当前包结构还是有点乱，开源团队还在继续优化中，可以从 源码的 TODO 注释中看出这一点。表6.1 给出了 Kubernetes 当前主要 package 的源码分析结果。</p>
<p>表 6.1 Kubernetes 主要 package 的源码分析结果 package</p>
<p>admission</p>
<p>api</p>
<p>模块用途</p>
<p>权限控制框架，采用了责任链模式、插件机制 Kubernetes 所提供的 Rest API 接口的相关类，例如接口数据结构相关的 MetaData 结构、 类数量</p>
<p>少</p>
<p>中</p>
<p>Volume 结构、Pod 结构、Service 结构等，以及数据格式验证转换工具类等，由于 API是分 版本的，所以这里是每个版本一个子 Package，例如 vIbeta、VI 及 latest apiserver</p>
<p>实现了 HTTP Rest 服务的一个基础性框架，用于 Kubemnetes 的各种 Rest API 的实现，在 中</p>
<p>apiserver 包里也实现了 HTTP Proxy，用于转发请求（到其他组件，比如 Minion 节点上） auth</p>
<p>3A 认证模块，包括用户认证、鉴权的相关组件 少</p>
<p>• 398•</p>
<h2>第 412 页</h2>
<p>package</p>
<p>client</p>
<p>cloudprovider</p>
<p>controller</p>
<p>kubectl</p>
<p>kubelet</p>
<p>master</p>
<p>proxy</p>
<p>reglstry</p>
<p>runtime</p>
<p>volume</p>
<p>cmd</p>
<p>plugin</p>
<h3>第6章</h3>
<p>Kubernetes 源码导读</p>
<p>模块用途</p>
<p>是Kubernetes 中公用的客户端部分的相关代码，实现协议为 HTTP Rest，用于提供一个具 体的操作，例如对 Pod、Service 等的增删改查，这个模块也定义了 kubeletClient，同时为 了高效地进行对象查询，此模块也实现了一个带缓存功能的存储接口 Store 定义了云服提供商运行 Kubernetes 所需的接口，包括 TCPLoadBalancer的获取和创建：获中 取当前环境中的节点列表（节点是一个云主机）和节点的具体信息；获取 Zone 信息；获 取和管理路由的接口等，默认实现了 AWS、GCE、Mesos、OpenStack、RackSpace 等云服 务供应商的接口</p>
<p>这部分提供了资源控制器的简单框架，用于处理资源的添加、变更、删除等事件的派发和 少</p>
<p>执行，同时实现了 Kubernetes 的 ReplicationController 的具体逻辑 Kubernetes 的命令行工具kubectl 的代码模块，包括创建 Pod、服务、Pod扩容、Pod滚动 多 升级等各种命令的具体实现代码</p>
<p>Kubernetes 的 kubelet 的代码模块，是 Kubemetes 的核心模块之一，定义了Pod 容器的接多 口，提供了 Docker 与 Rkt两种容器实现类，完成了容器及 Pod 的创建，以及容器状态的 监控、销毁、垃圾回收等功能</p>
<p>Kubernetes 的 Master 节点代码模块，创建 NodeRegistry、PodRegistry、ServiceRegistry、 少</p>
<p>EndpointRegistry 等组件，并且启动 Kuberetes 自身的相关服务，服务的 ClusterIP地址分 配及服务的 NodePort 端口分配，也是在这里完成的 Kubernetes 的服务代理和负载均衡相关功能的模块代码，目前实现了 round-robin 的负载均 少</p>
<p>衡算法</p>
<p>Kubernetes 的 NodeRegistry、PodeRegistry、ReplicationControllerRegistry、ServiceRegistry、 多</p>
<p>EndpointRegistry、Persistent VolumeRegisty 等注册表服务的接口及对应 Rest 服务的相关代 码</p>
<p>为了让多个 API 版本共存，需要采用一些设计来完成不同API 版本的数据结构的转换，API少 中数据对象的 Encode/Decode 逻辑也最好集中化，Runtime 包就是为了这个目的而设计的 实现了 Kuberetes 的各种 Volume 类型，分别对应亚马逊 ESB 存储、谷歌 GCE 的存储、 多</p>
<p>Linux Host 目录存储、GlusterFS 存储、iSCSI 存储、NFS 存储、RBD 存储等，volume 包 同时实现了 Kubernetes 容器的Volume 卷的挂载、卸载功能 包括了 Kuberetes 所有后台进程的代码（如 kube-apiserver 进程、kube-controller-manager 进程、kube-proxy 进程、kubelet 进程等），而这些进程具体的业务逻辑代码则都在pkg中 实现了</p>
<p>子包 cmd/kuber-scheduler 实现了 Schedule Server 的框架，用于执行具体的 Scheduler 的调 中</p>
<p>度，pkg/admission 子包则实现了 Admission 权限框架的一些默认实现类，例如alwaysAdmit、 alwaysDeny 等：pkg/auth 子包实现了权限认证框架（auth 包的）里定义的认证接口类，例 如HTTP BasicAuth、X509证书认证：pkg/scheduler 子包则定义了一些具体的Pod 调度器 （Scheduler）</p>
<p>续表</p>
<p>类数量</p>
<p>多</p>
<p>• 399•</p>
<h2>第 413 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 52 kube-apiserver进程源码分析 Kubernetes API Server 是由 kube-apiserver 进程实现的，它运行在 Kuberetes 的管理节点一 —Master 上并对外提供 Kubernetes Restful API 服务，它提供的主要是与集群管理相关的API服 务，例如校验 pod、service、replication controller 的配置并存储到后端的 etcd Server 上。下面我 们分别对其启动过程、关键代码分析及设计总结等进行深入讲解。</p>
<h3>6.2.1 进程启动过程</h3>
<p>kube-apiserver 进程的入口类源码位置如下：</p>
<p>github/com/GooglecloudPlatform/kubernetes/cmd/kube-apiserver/apiserver.go 入口 mainO函数的逻辑如下：</p>
<p>func main（）｛</p>
<p>runtime.GOMAXPROCS （runtime .NumCPU （）） rand. Seed （time.Now （）.UTC （）.UnixNano （）） s：= app.NewAPIServer （） s.AddFlags （pflag.CommandLine） util.InitFlags （）</p>
<p>util.InitLogs （）</p>
<p>defer util.FlushLogs （） verflag.PrintAndExitlfRequested （） if err ：= s.Run（pflag.CommandLine.Args（））；err！= nil ｛ Emt.Fprintf （os.Stderr，&quot;%v\n&quot;，err） os.Exit （1）</p>
<p>｝</p>
<p>｝</p>
<p>启动监听：</p>
<p>上述代码的核心为下面三行，创建一个 APIServer 结构体并将命令行启动参数传入，最后 s：- app.NewAPIServer（） .AddFlags （pflag.CommandLine） s.Run （pflag.CommandLine.Args （）） 我们先来看看都有哪些常用的命令行参数被传递给了 APIServer 对象，下面是运行在 Master • 400•</p>
<h2>第 414 页</h2>
<h3>第6章</h3>
<p>Kubernetes 源码导读</p>
<p>节点的 kube-apiserver 进程的命令行信息：</p>
<p>/usr/bin/kube-apiserver --logtostderr=true --etcd_servers=http://127.0.0.1：</p>
<p>--address=0.0.0.0--port=8080 --kubelet_port=10250 --a11ow_privileged=false --service-cluster-ip-range=10.254.0.0/16 可以看到关键的几个参数有 etcd_ Lservers 的地址、APIServer 绑定和监听的本地地址、kubelet 的运行端口及 Kubernetes 服务的 clusterIP 地址。</p>
<p>下面是 app.NewAPIServer（）的代码，我们看到这里的控制还是很全面的，包括安全控制 （CertDirectory、HTTPS 默认启动）、权限控制（AuthorizationMode、AdmissionControl）、服 务限流控制（APIRate、APIBurst）等，这些逻辑说明了 APIServer 是按照企业级平台的标准所 设计和实现的。</p>
<p>func NewAPIServer（） *APIServer｛ s：= APIServer｛</p>
<p>InsecurePort：</p>
<p>8080，</p>
<p>InsecureBindAddress：</p>
<p>util.IP （net.ParselP （&quot;127.0.0.1&quot;））， BindAddress：</p>
<p>util.IP （net.ParseIP（&quot;0.0.0.0&quot;））， SecurePort：</p>
<p>6443，</p>
<p>APIRate：</p>
<p>10.0，</p>
<p>APIBurst：</p>
<p>200，</p>
<p>APIPrefix：</p>
<p>&quot;/api&quot;，</p>
<p>EventTTL：</p>
<p>1 * time.Hour，</p>
<p>AuthorizationMode：</p>
<p>&quot;AlwaysA11ow&quot;，</p>
<p>AdmissionControl：</p>
<p>&quot;AlwaysAdmit&quot;，</p>
<p>EtcdPathPrefix：</p>
<p>master.DefaultEtcdPathPrefix， EnableLogsSupport：</p>
<p>ue，</p>
<p>MasterServiceNamespace: api.NamespaceDefault， ClusterName：</p>
<p>&quot;kubernetes&quot;，</p>
<p>CertDirectory：</p>
<p>&quot;/var/run/kubernetes&quot;， RuntimeConfig: make （util.ConfigurationMap）， KubeletConfig: client.KubeletConfig｛ Port：</p>
<p>ports.KubeletPort， EnableHttps:true，</p>
<p>HTTPTimeout: time.Duration（5）* time.Second， ｝</p>
<p>return</p>
<p>＆S</p>
<p>｝</p>
<p>创建了 APIServer 结构体实例后，apiserver.go 将此实例传入子包 app/server.g0 的 func（s *APIServer） Run（_ ［］string）方法里，最终绑定本地端口并创建一个 HTTP Server 与一个 HTTPS Server，从而完成整个进程的启动过程。</p>
<p>• 401•</p>
<h2>第 415 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） Run 方法的代码有很多，这里就不再列出源码，对该方法的源码解读如下。</p>
<p>（1）调用 verifyClusterIPFlags 方法，验证 ClusterIP 参数是否已设置及是否有效。</p>
<p>（2）验证 etcd-servers 的参数是否己设置。</p>
<p>（3）如果初始化 CloudProvider，且没有 CloudProvider 的参数，则日志告警并继续。</p>
<p>（4）根据 KubeletConfig 的配置参数，调用 pkg/Client/kubeclient.go 中的方法 NewKubeletClient（） 创建一个 kubelet Client 对象，这其实是一个 HTTPKubeletClient 实例，目前只用于kubelet 的健 康检查（KubeletHealthChecker）。</p>
<p>（5）判断哪些 API Version 需要关闭，目前在1.0代码中默认关闭了 vlbeta3 的API 版本。</p>
<p>（6） 创建一个 Kubernetes 的 RestClient 对象，具体的代码在 pkg/client/helper.go 的 TransportFor0 方法里完成，通过它完成 Pod、Replication Controller 及 Kubernetes Service 等对象的 CRUD 操作。</p>
<p>（7）创建用于访问 etcd Server 的客户端，具体代码在 newEtd0方法里实现，从代码调用中 可以看出，Kubernetes 采用的是 github.com/coreos/go-etcd/client.go这个客户端实现。</p>
<p>（8） 建立鉴权 （Authenticator）、授权（Authorizer）、服务许可框架和插件（AdmissionControl） 的相关代码逻辑。</p>
<p>（9）获取和设置 APIServer 的 ExternalHost 的名称，如果没有提供 ExternalHost 参数，且 Kubernetes 运行在谷歌的GCE 云平台上，则尝试通过 CloudProvider 接口获取本机节点的外部 IP 地址。</p>
<p>（10）如果运行在云平台中，则安装本机的SSH Key 到 Kubernetes 集群中的所有虚拟机上。</p>
<p>（11）用 APIServer 的数据及上述过程中创建的一些对象（KubeletClient、etcdClient、 authenticator、admissionController 等）作参数，构造 Kubernetes Master 的 Config 结构（pkg/ master/master.go），以此生成一个 Master 实例，具体代码在 master.go 中的New （c *Config）方 法里。</p>
<p>（12） 用上述创建的 Master 实例，分别创建 HTTP Server 及安全的 HTTPS Server 来开始监 听客户端的请求，至此整个进程启动完毕。</p>
<h3>6.2.2 关键代码分析</h3>
<p>在 6.2.1 节里对 kube-apiserver 进程的启动过程进行了详细分析，我们发现 Kubernetes API Service 的关键代码就隐藏在 pkg/master/master.go 里，APIServer 这个结构体只不过是一个参数传 递通道而已，它的数据最终传给了 pkg/master/master.go 里的 Master 结构体，下面是它的完整定义：</p>
<p>// Master contains state for a Kubernetes cluster master/api server.</p>
<p>• 402．</p>
<h2>第 416 页</h2>
<h3>第6章</h3>
<p>Kubernetes 源码导读</p>
<p>type Master struct｛ // &quot;Inputs&quot;，Copied from Config serviceClusterIPRange *net.IPNet serviceNodePortRange util.PortRange cacheTimeout</p>
<p>time.Duration</p>
<p>minRequestTimeout</p>
<p>time.Duration</p>
<p>mUX</p>
<p>apiserver.Mux</p>
<p>muxHelper</p>
<p>*apiserver.MuxHelper handlerContainer</p>
<p>*restful.Container rootWebService</p>
<p>*restful.WebService enableCoreControllers bool enablelogsSupport</p>
<p>bool</p>
<p>enableUISupport</p>
<p>bool</p>
<p>enableSwaggerSupport boo1</p>
<p>enableProfiling</p>
<p>bool</p>
<p>apiPrefix</p>
<p>string</p>
<p>corsA1lowedOriginList| util.StringList</p>
<p>authenticator</p>
<p>authenticator.Request authorizer</p>
<p>authorizer.Authorizer admissionControl</p>
<p>admission.Interface masterCount</p>
<p>int</p>
<p>vlbeta3</p>
<p>bool</p>
<p>v1</p>
<p>bool</p>
<p>requestContextMapper api.RequestContextMapper 1/ External host is the name that should be used in external （public internet） URLS</p>
<p>for this master</p>
<p>externalHost</p>
<p>string</p>
<p>// clusterIP</p>
<p>is the IP address of the master within the cluster.</p>
<p>clusterIP</p>
<p>net.IP</p>
<p>publicReadWritePort int serviceReadWriteIP net.IP</p>
<p>serviceReadWritePort int masterServices</p>
<p>*util.Runner</p>
<p>// storage contains the RESTful endpoints exposed by this master storage map［string］rest.Storage // registries are internal client APIs for accessing the storage layer // TODO:define the internal typed interface in a way that clients can // also be replaced nodeRegistry</p>
<p>namespaceRegistry</p>
<p>serviceRegistry</p>
<p>endpointRegistry</p>
<p>minion.Registry</p>
<p>namespace.Registry service.Registry</p>
<p>endpoint.Registry</p>
<p>• 403•</p>
<h2>第 417 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） serviceClusterIPAllocator service.RangeRegistry serviceNodePortAllocator| service.RangeRegistry // &quot;Outputs&quot;</p>
<p>Handler</p>
<p>http.Handler</p>
<p>InsecureHandler http.Handler // Used</p>
<p>for secure proxy</p>
<p>dialer</p>
<p>apiserver.ProxyDialerFunc tunnels</p>
<p>*util.SSHTunnelList tunnelsLock</p>
<p>sync.Mutex</p>
<p>instal1SSHKey Instal1SSHKey lastSync</p>
<p>int64 // Seconds since Epoch lastSyncMetric prometheus .GaugeFunc clock</p>
<p>util.Clock</p>
<p>｝</p>
<p>在这段代码里，除了之前我们熟悉的那些变量，又多了几个陌生的重要变量，接下来我们 逐一对其进行分析讲解。</p>
<p>首先是类型为 apiserver.Mux（来自文件 pkg/apiserver/apiserver.go）的mux 变量，下面是对 它的定义：</p>
<p>// mux is an object that can register http handlers.</p>
<p>type Mux interface Handle （pattern string, handler http.Handler） HandleFunc （pattern string, handler func （http.ResponseWriter，*http.Request） ） 如果你熟悉 Socket 编程，特别使用过或者研究过 HTTP Rest 的一些框架，那么对于这个 Mux 接口就再熟悉不过了，它是一个 HTTP 的多分器（Multiplexer），其实它也是Golang HTTP 基础包里的 http.ServeMux 的一个接口子集，用于派发（Dispatch） 某个 Request 路径（这里用 pattern 变量表示）到对应的 http.Handler 进行处理。实际上在 master.go 代码中是生成一个 http.ServeMux 对象并赋值给 apiserver.Mux 变量，在代码中还有强制类型转换的语句。从上述分 析来看，apiserver.Mux 的引入是设计的一个败笔，并没有增加什么价值，反而增加了理解代码 的难度。此外，为了更好地实现 Rest 服务，Kubernetes 在这里引入了一个第三方的 REST 框架：</p>
<p>github.com/emicklei/go-restful.</p>
<p>go-restful 在GitHub 上有36个贡献者，采用了“路由”映射的设计思想，并且在API设计 中使用了流行的 Fluent Style 风格，使用起来酣畅淋漓，也难怪 Kubernetes 选择了它。下面是 go-restful 的优良特性。</p>
<p>Ruby on Rails 风格的 Rest路由映射，例如/people/｛person_id｝/groups/｛group_id｝。</p>
<p>大大简化了 RestAPI 的开发工作。</p>
<p>• 404•</p>
<h2>第 418 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>底层实现采用 Golang 的HTTP 协议栈，几乎没有限制。</p>
<p>◎ 拥有完整的单元包代码，很容易开发一个可测试的 RestAPI。</p>
<p>Google AppEngine ready。</p>
<p>go-restful 框架中的核心对象如下。</p>
<p>restful.Container：代表一个 HTTP Rest 服务器，包括一组 restful.Web Service 对象和一 个 http.ServeMux 对象，使用RouteSelector 进行请求派发。</p>
<p>restful.WebService： 表示一个 Rest 服务，由多个 Rest 路由 （restful.Route） 组成，这一 组 Rest 路由共享同一个 Root Path。</p>
<p>restful.Route： 表示一个 Rest 路由，Rest 路由主要由 Rest Path、HTTP Method、输入输 出类型（HTML/JSON）及对应的回调函数 restful. RouteFunction 组成。</p>
<p>restful.RouteFunction：一个用于处理具体的 REST 调用的函数接口定义，具体定义为 type RouteFunction func（*Request， *Response）。</p>
<p>Master 结构体里包含了对 restful.Container 与 restful.Web Service 这两个 go-restful 核心对象 的引用，在接下来的 Master 对象的构造方法中（对应代码为 master.go 的 func New（c *Config） *Master）被初始化。那么，问题又来了，Kubernetes 的这么一堆 Rest API 又是在哪里定义的， 是如何被绑定到 restful.Route 里的呢？</p>
<p>要理解这个问题，我们要首先弄清楚 Master 结构体中的变量：</p>
<p>storage map［string］rest.Storage storage 变量是一个 Map,Key 为 Rest API 的path,Value 內 rest.Storage 接口，此接口是一 个通用的符合 Restful 要求的资源存储服务接口，每个服务接口负责处理一类（Kind） Kubernetes Rest API 中的数据对象——资源数据，只有一个接口方法：New（），New0方法返回该 Storage 服务所能识别和管理的某种具体的资源数据的一个空实例。</p>
<p>type Storage interface｛ New （） runtime.Object ｝</p>
<p>在运行期间，Kubernetes API Runtime 运行时框架会把 New0方法返回的空对象的指针传入 Codec.DecodeInto（［］byte, runtime.Object）方法中，从而完成 HTTP Rest 请求中的Byte 数组反序列 化逻辑。Kubernetes API Server 中所有对外提供服务的 Restful 资源都实现了此接口，这些资源 包括 pods、bindings、podTemplates、replicationControllers、services 等，完整的列表就在 master.g0 的 func （m *Master） init（c *Config）中，下面是相关代码片段（截取部分代码）。</p>
<p>m.storage = maplstring］rest.Storage｛ &quot;pods&quot;：</p>
<p>podStorage . Pod，</p>
<p>• 405•</p>
<h2>第 419 页</h2>
<p>Kubernetes 权威指南：/</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） &quot;pods/status&quot; ：</p>
<p>podStorage.Status， &quot;pods/log&quot;：</p>
<p>podStorage.Log，</p>
<p>&quot;pods/exec&quot;：</p>
<p>podStorage.Exec，</p>
<p>&quot;pods/portforward&quot; ： podStorage.PortForward， &quot;pods/proxy&quot;：</p>
<p>podStorage.Proxy，</p>
<p>&quot;pods/binding&quot;：</p>
<p>podStorage.Binding， &quot;bindings&quot;：</p>
<p>podStorage.Binding， &quot;&#x27;podTemplates&quot; ： podTemplateStorage， &quot;replicationControllers&quot; ： controllerStorage， service.NewStorage （m.serviceRegistry， m.nodeRegistry,m.endpointRegistry, serviceClusterIPAllocator, serviceNodePort Allocator, C.ClusterName）， &quot;endpoints&quot;：</p>
<p>&quot;minions&quot;：</p>
<p>endpointsStorage，</p>
<p>nodeStorage，</p>
<p>看到上面这段代码，你在潜意识里已经明白，这其实就是似曾相识的 Kubernetes Rest API 列表，storage 这个 Map 的Key 就是 Rest API 的访问路径，Value 却不是之前说好的 restful.Route。</p>
<p>聪明的你一定想到了答案：必然存在一个“转换适配”的方法来实现上述转换！这段不难理解 但源码超长的方法就在 pkg/apiserver/api_installer.go 的下述方法里：</p>
<p>func （a *APIInstaller） registerResourceHandlers （path string,storage rest.</p>
<p>Storage,ws *restful.webService,proxyHandler http.Handler） 上述方法把一个 path 对应的 rest.Storage 转换成一系列的restful.Route 并添加到指针 restful.</p>
<p>WebService 中。这个函数的代码之所以很长，是因为有各种情况要考虑，比如 pods/portforward 这种路径要处理 child，还要判断每种的 Storage 资源类型所支持的操作类型；比如是否支持 create、delete、update 及是否支持 list、watch、patcher 操作等，对各种情况都考虑以后，这个 函数的代码量已接近500行！估计 Kubernetes 这段代码的作者也不大好意思，于是外面封装了 简单函数：func（a *APIInstaller）Install，内部循环调用 registerResourceHandlers，返回最终的 restful.WebService 对象，此方法的主要代码如下：</p>
<p>// Installs handlers for API resources.</p>
<p>func （a *APIInstaller）Instal1（）（ws *restful.WebService,errors ［lerror）｛ // Register the paths in a deterministic （sorted） order to get a deterministic swagger spec.</p>
<p>paths ：= make （［］string, len （a.group. Storage）） var iint=0</p>
<p>for path：= range a.group.Storage｛ paths li］ = path</p>
<p>i++</p>
<p>｝</p>
<p>sort.Strings （paths） Eor _，path ：= range paths ｛ • 406•</p>
<h2>第 420 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>if err ：= a.registerResourceHandlers （path, a.group.storage ［path］，ws， proxyHandler）；err ！= nil ｛ errors = append（errors,err） ｝</p>
<p>｝</p>
<p>return ws,errors</p>
<p>｝</p>
<p>为了区分API 的版本，在 apiserver.go 里定义了一个结构体：APIGroupVersion。以下是其代码：</p>
<p>type APIGroupVersion struct ｛ storage map［string］rest.storage string</p>
<p>Version string</p>
<p>// ServerVersion controls the Kubernetes APIVersion used for common objects in the apiserver</p>
<p>// schema like api.Status, api.DeleteOptions， and api.ListOptions. Other implementors may</p>
<p>// define a version&quot;vlbetal&quot; but want to use the Kubernetes &quot;vlbeta3&quot; internal objects. If</p>
<p>// empty，</p>
<p>defaults to Version.</p>
<p>ServerVersion string Mapper meta.RESTMapper Codec</p>
<p>runtime .Codec</p>
<p>Typer</p>
<p>runtime.ObjectTyper Creater</p>
<p>runtime.ObjectCreater Convertor runtime.ObjectConvertor Linker</p>
<p>runtime.SelfLinker Admit</p>
<p>admission.Interface Context api.RequestContextMapper ProxyDialerFn</p>
<p>ProxyDialerFunc</p>
<p>MinRequestTimeout time.Duration ｝</p>
<p>我们注意到 APIGroupVersion 是与 rest.Storage Map 捆绑的，并且绑定了相应版本的 Codec、 Convertor 用于版本转换，这样就很容易理解 Kubernetes 是怎样区分多版本 API 的 Rest 服务的。</p>
<p>以下是过程详解。</p>
<p>首先，在 APIGroupVersion 的 InstalREST（container *restful.Container）方法里，用 Version 变量来构造一个 Rest API Path 前缀并赋值给 APIINstaller 的prefix 变量，并调用它的Install（）方 法完成 Rest API 的转换，代码如下：</p>
<p>func （g *APIGroupVersion） InstallREST （container *restful.Container） error ｛ • 407•</p>
<h2>第 421 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） info ：= &amp;APIRequestInfoResolver｛util.NewStringSet （strings.TrimPrefix（g.Root， &quot;/&quot;）），g.Mapper｝</p>
<p>prefix ：= path.Join （g.Root, g.Version） installer ：= &amp;APIInstaller｛ group：</p>
<p>9，</p>
<p>info：</p>
<p>info，</p>
<p>prefix：</p>
<p>prefix，</p>
<p>minRequestTimeout:g.MinRequestTimeout， proxyDialerFn：</p>
<p>g.ProxYDialerFn，</p>
<p>｝</p>
<p>ws, registrationErrors ：= installer.Instal1 （） container .Add （ws） 接着，在 APlInstaller 的 InstallO方法里用 prefix （API 版本）前缀生成 WebService 的相对 根路径：</p>
<p>func （a *APIInstaller） newWebService（）*restful.WebService ｛ ws ：= new （restful.WebService） ws.Path （a.prefix） ws.Doc （&quot;API at&quot;+ a.prefix +&quot;version&quot;+ a.group.Version） 11 TODO:change to restful.MIME_JSON when we set content type in client ws.Consumes （&quot;*/*&quot;） ws.Produces （restfuL.MIME_JSON） ws.ApiVersion （a.group.Version） return ws</p>
<p>｝</p>
<p>最后，在 Kubernetes 的 Master 初始化方法 func （m *Master） init（c *Config）里生成不同的 APIGroup Version 对象，并调用 InstallRest0方法，完成最终的多版本 API 的 Rest 服务装配流程：</p>
<p>if m.vlbeta3｛</p>
<p>if err ：= m.api</p>
<p>-V1beta3 （）.InstalIREST （m.handlerContainer）；err！= nil ｛ glog.Fatalf（&quot;Unable to setup API vlbeta3: 8v&quot;，err） ｝</p>
<p>apiVersions = append （apiVersions，&quot;vlbeta3&quot;） ｝</p>
<p>ifm.vl｛</p>
<p>if err：= m.api_V1（）.InstallREST（m.handlerContainer）；err ！= nil glog.Fatalf（&quot;Unable to setup API V1： &amp;v&quot;，err） ｝</p>
<p>apiVersions = append （apiVersions， &quot;v1&quot;） ｝</p>
<p>至此，Rest API 的多版本问题还有最后一个需要澄清，即在不同的版本中接口的输入输出 • 408•</p>
<h2>第 422 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>参数的格式是有差别的，Kubernetes 是怎么处理这个问题的？</p>
<p>要弄明白这一点，我们首先要研究 Kubernetes API 里的数据对象的序列化、反序列化的实 现机制。为了同时解决数据对象的序列化、反序列化与多版本数据对象的兼容和转换问题， Kubernetes 设计了一套复杂的机制，首先，它设计了 conversion.Scheme 这个结构体（pkg/ conversion/schema.go 里），以下是对它的定义：</p>
<p>// Scheme defines an entire encoding and decoding scheme.</p>
<p>type</p>
<p>Scheme struct|</p>
<p>// versionMap allows one to figure out the go type of an object //with</p>
<p>the given version and name.</p>
<p>versionMap map［string］map［string］reflect.rype 1/ typeroversion allows one to figure out the version for a given //go object The reflect.rype we index by should *not* be a pointer. If the same type // is registered for multiple versions, the last one wins.</p>
<p>typeToVersion map ［reflect.Type］string // typeToKind allows one to figure out the desired &quot;kind&quot; field //for a given go object. Requirements and caveats are the same as typeToVersion.</p>
<p>typeToKind map［reflect.Typel ［］string // converter stores all registered conversion functions. It also //has default coverting behavior.</p>
<p>converter *Converter // cloner stores all registered copy functions. It also has default // deep copy behavior.</p>
<p>cloner *Cloner</p>
<p>// Indent wil1 cause the JSON output from Encode to be indented, iff it is true.</p>
<p>Indent bool</p>
<p>// InternalVersion is the default internal version. It is recommended that // you use &quot;&quot; for the internal version.</p>
<p>InternalVersion string // MetaInsertionFactory is used to create an object to store and retrieve // the version and kind information for all objects. The default // uses the</p>
<p>keys &quot;apiVersion&quot; and &quot;kind&quot; respectively.</p>
<p>MetaFactory MetaFactory ｝</p>
<p>在上述代码中可以看到，typeToVersion 与 versionMap 属性是为了解决数据对象的序列化与 反序列化问题，converter 属性则负责不同版本的数据对象转换问题，Kubernetes 这个设计思路 简单方便地解决了多版本的序列化和数据转换问题，不得不赞！下面是 conversion.Scheme 里序 列化、反序列化的核心方法 NewObject（）的代码：通过查找 versionMap 里匹配的注册类型，以 反射方式生成一个空的数据对象：</p>
<p>func（s *Scheme）NewObject （versionName,kind string） （interface｛｝，error） ｛</p>
<p>if types,ok</p>
<p>：= s.versionMap［versionName］；ok｛ if t,ok：= types［kind］；ok｛ return reflect.New （t）.Interface （），nil • 409•</p>
<h2>第 423 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） ｝</p>
<p>return nil， &amp;notRegisteredErr｛kind: kind, version: versionName｝ ｝</p>
<p>return nil， &amp;notRegisteredErr｛kind: kind, version: versionName｝ ｝</p>
<p>而 pkg/conversion/encode.go 与 decode.go则在 conversion.Scheme 提供的基础功能之上，完 成了最终的序列化、反序列化功能。下面是 encode.go 里的主方法 EncodeToVersion（.）的关键代 码片段：</p>
<p>//确定要转换的源对象的版本号和类别 objVersion,objKind,err ：= s.ObjectVersionAndKind（obj）象 //生成目标版本的空对象</p>
<p>objOut,err ：= s.NewObject （destVersion,objKind） //生成转换过程中所需的Metadata 信息 flags,meta ：= s.generateConvertMeta （objVersion, destVersion,obj） //调用 converter 的方法将源对象的数据填充到目标对象 objout err = s.converter.Convert （obj,objOut, flags, meta） /1用JSON 将目标对象转换成byte［］数组，完成序列化过程 data, err = json.Marshal （obj） 再进一步，Kubernetes 在 conversion.Scheme 的基础上又做了一个封装工具类 runtime.Scheme， 可以看作前者的代理类，主要增加了 fieldLabelConversionFuncs 这个 Map 属性，用于解决数据对象 的属性名称的兼容性转换和校验，比如将需要兼容 Pod 的 spec.host 属性改次spec.nodeName 的情况。</p>
<p>注意到 conversion.Scheme 只是实现了一个序列化与类型转换的框架 API，提供了注册资源 数据类型与转换函数的功能，那么具体的资源数据对象类型、转换函数又是在哪个包里实现的 呢？答案是 pkg/api。Kubernetes 为不同的API 版本提供了独立的数据类型和相关的转换函数并 按照版本号命名 Package，如 pkg/api/vl、pkg/api/vlbeta3 等，而当前默认版本（内部版本）则 存在于pkg/api目录下。</p>
<p>以pkg/api/v1 例，在每个目录里都包括如下关键源码：</p>
<p>c types.go 定义了 Rest API 接口里所涉及的所有数据类型，v1 版本有2000行代码；</p>
<p>（3</p>
<p>在 conversion.go 与 conversion_generated.go 里定义了 conversion.Scheme 所需的从内部 版本到v1 版本的类型转换函数，其中 conversion_generated.go 中的代码有5000行之多， 当然这是通过工具自动生成的代码；</p>
<p>register.go负责将 types.go 里定义的数据类型与 conversion.go里定义的数据转换函数注 册到 runtime.Schema 里。</p>
<p>pkg/api 里的 register.go 初始化生成并持有一个全局的 runtime.Scheme 对象，并将当前默认 版本的数据类型 （pkg/api/types.go）注册进去，相关代码如下：</p>
<p>• 410•</p>
<h2>第 424 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>var Scheme = runtime . NewScheme （） func init （）</p>
<p>｛</p>
<p>Scheme.AddKnownTypes（&quot;&quot;， &amp;Podl｝，</p>
<p>&amp;PodListi｝，</p>
<p>&amp;PodStatusResultl）， &amp;PodTemplatef｝，</p>
<p>&amp;PodremplateList｛｝， &amp;ReplicationControllerListf｝， //此次省略30多个数据类型</p>
<p>&amp;Servicelist｛｝，</p>
<p>&amp;Servicel｝，</p>
<p>&amp;NodeList｛｝，</p>
<p>&amp;Node｛｝，</p>
<p>1/省略</p>
<p>而 pkg/api/v1/register.go 与 vIbeta3 下的 register.go 在初始化过程中分别把与版本相关的数 据类型和转换函数注册到全局的 runtime.Scheme 中：</p>
<p>func init（）｛</p>
<p>11 Check if vl is in the list of supported API versions.</p>
<p>i£ ！registered.IsRegisteredAPIVersion （&quot;v1&quot;） ｛ return</p>
<p>｝</p>
<p>// Register the API.</p>
<p>addKnown Types （）</p>
<p>addConversionFuncs （） addDefaultingFuncs （） ｝</p>
<p>这样一来，其他地方都可以通过 runtime.Scheme 这个全局变量来完成 Kubernetes API 中的 数据对象的序列化和反序列化逻辑了，比如 Kubernetes API Client 包就大量使用了它，下面是 pkg/client/pods.go 里Pod 删除的 Delete（）方法的代码：</p>
<p>// Delete takes the name of the pod, and returns an error if one occurs func （c *pods） Delete（name string, options *api.DeleteOptions）error｛ // TODO: to make this reusable in other client libraries if options == nil｛ return c.r.Delete （）.Namespace （c.ns）.Resource （&quot;&#x27;pods&quot;）.Name （name）.</p>
<p>Do （）.Error （）</p>
<p>｝</p>
<p>body, err ：= api.Scheme.EncodeToVersion （options, C.r.APIVersion （）） if err！=nil｛</p>
<p>return err</p>
<p>｝</p>
<p>Body （body）.Do （）.ErrOr（） return c.r.Delete （）.Namespace （c.ns）.Resource （&quot;pods&quot;）.Name （name）.</p>
<p>• 411•</p>
<h2>第 425 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） ｝</p>
<p>清楚了 Kubernetes Rest API 中的数据对象的序列化机制及多版本的实现原理之后，我们接 着分析下面这个重要流程的实现细节。</p>
<p>Kubernetes 中实现了 rest.Storage 接口的服务在转换成 restful.RouteFunction 以后，是怎样处 理一个 Rest 请求并最终完成基于后端存储服务 etcd上的具体操作过程的？</p>
<p>首先，Kubernetes 设计了一个名为“注册表”的 Package （pkg/registry），这个 Package 按照 rest.Storage 服务所管理的资源数据的类型而划分为不同的子包，每个子包都由相同命名的一组 Golang 代码来完成具体的 Rest 接口的实现逻辑。</p>
<p>下面我们以 Pod 的 Rest服务实现次例，其与“注册表”相关的代码位于 pkg/registry/pod 中， 在 registry.go 里定义了Pod 注册表服务的接口：</p>
<p>type Registry interface ｛ // ListPods obtains a list of pods having labels which match selector.</p>
<p>ListPods （ctx api.Context,label labels.Selector） （*api.PodList, error） // Watch for new/changed/deleted pods WatchPods （ctx api.Context,label labels.Selector,field fields.Selector， resourceVersion string） （watch.Interface,error） // Get a specific pod GetPod（ctx api.Context,podID string） （*api.Pod, error） // Create</p>
<p>a pod based on a specification.</p>
<p>CreatePod（ctx api.Context,pod *api.Pod） eYYOE</p>
<p>// Update|</p>
<p>an existing pod</p>
<p>UpdatePod（ctx api.Context,pod *api.Pod）error // Delete an existing pod DeletePod（ctx api.Context,podID string） error 我们看到这个Pod注册表服务是针对Pod 的CRUD 的操作接口的一个定义，在入口参数中 除了调用的上下文环境api.Context，就是我们之前分析过的pkg/api 包中的Pod这个资源数据对 象。为了实现强类型的方法调用，在registry.go 里定义了一个名为 storage 的结构体，storage 实 现 Registry接口，可以看作一种代理设计模式，因为具体的操作都是通过内部rest. StandardStorage 来实现的。下面是截取的 registry.go 中的 create、update、delete 的源码：</p>
<p>func （s *storage） CreatePod（ctx api.Context,pod *api.Pod） error ｛ _n err ：= s.Create （ctx, pod） return err</p>
<p>｝</p>
<p>func（s *storage） UpdatePod（ctx api.Context,pod *api.Pod） error ｛ 、_ err ：= s.Update （ctx,pod） return ern</p>
<p>•412•</p>
<h2>第 426 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>func （s *storage）</p>
<p>DeletePod（ctx api.Context,podID string） error ｛ err</p>
<p>：= .Delete （ctx,PodID,nil） return</p>
<p>｝</p>
<p>那么，这个实现了 rest.StandardStorage 通用接口的真正 Storage 又是什么？从 Master 对象的 初始化函数中，我们发现了下面的相关代码：</p>
<p>*Master）init （c *Config）｛ healthzChecks ：= ［Jhealthz.HealthzChecker｛｝ m.clock = util.RealClock｛｝ podstorage ：= podetcd.NewStorage （c.EtcdHelper, c.KubeletClient） podRegistry ：= pod.NewRegistry（podStorage.Pod） Master 对象创建了一个私有变量 podStorage，其类型 PodStorage （pkg/registry/pod/ etcd/etcd.go），Pod 注册表服务实例 （podRegistry）里真正的 Storage 是podStorage.Pod。下面是 podetcd 的函数 NewStorage 中的关键代码：</p>
<p>func NewStorage （h tools.EtcdHelper,k client.ConnectionInfoGetter） PodStorage ｛ store：= &amp;etcdgeneric.Etcd｛ NewFunc：</p>
<p>func（）runtime.Object ｛ return &amp;api.Podl））， NewListFunc: func（）runtime.Object ｛ return &amp;api.PodListl｝ ｝， return PodStoragel Pod：</p>
<p>Binding：</p>
<p>Status：</p>
<p>Log：</p>
<p>PrOXY：</p>
<p>Exec：</p>
<p>&amp;REST｛*store｝，</p>
<p>&amp;BindingREST｛store: store｝， &amp;StatusREST｛store： &amp;statusStore）， &amp;LOgREST ｛store:store,kubeletConn:k｝， &amp;PrOXYREST｛store: store｝， &amp;EXeCRESTIstore: store, kubeletConn: kJ， PortForward：&amp;PortForwardREST｛store: store,kubeletConn:k｝， ｝</p>
<p>在上述代码中我们看到：位于 pkg/registry/generic/etcd/etcd.go里的etcd 才是真正的Storage 实现。而具体操作 etcd 的代码是靠 tools.EtcdHelper 这个类完成的，通过分析 etcd.go 里的 func （e *Etcd）Create（ctx api.Context, obj runtime.Object）方法，我们知道创建一个 etcd 里的键值对的关键 逻辑如下。</p>
<p>◎ 获取对象的名字：name, err ：= e.ObjectNameFunc（obj）。</p>
<p>》 获取 Key: key, err ==e.KeyFunc（ctx, name）。</p>
<p>◎ 生成一个空的 Object 对象：out：=e.NewFuncl）。</p>
<p>将键值对写入 etcd：在 e.Helper.CreateObj（key, obj, out, ttl）方法中通过调用 runtime.</p>
<p>Codec 完成从对象到字符串的转换，最终保存到 etcd 中。</p>
<p>• 413•</p>
<h2>第 427 页</h2>
<p>Kubernetes 权威指南</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） ◎ 回调创建完成后的处理逻辑：e.AfterCreate（out）。</p>
<p>注意到之前 PodStorage 创建 store 时重载了 ObjectNameFunc（、KeyFuncO、NewFuncO等函 数，于是完成了针对Pod 的创建过程，Kubernetes API 服务中的其他数据对象也都遵循同样的 设计模式。</p>
<p>进一步研究代码，我们发现 PodStorage 中的Pod、Binding、Status 等属性是 pkg/api/rest/rest.go 中几个不同的Rest接口的实现，并且通过 etcdgeneric.Etcd 这个实例来完成Pod 的一些具体操作， 比如这里的 StatusREST。下面是其相关代码片段：</p>
<p>// StatusREST implements the REST endpoint for changing the status of a pod.</p>
<p>type StatusREST struct ｛ store *etcdgeneric.Etcd ｝</p>
<p>// New creates a new pod resource Eunc （r *StatusREST） New（）runtime.Object ｛ return &amp;api.Podl｝</p>
<p>｝</p>
<p>11 Update alters the status subset of an object.</p>
<p>func （r *StatusREST） Update （ctx api.Context, obj runtime.object）（runtime.Object， bool,errOr）｛</p>
<p>return r.store.Update （ctx, obj） ｝</p>
<p>表6.2展现了 PodStorage 中的各个 XXXREST 接口与 pkg/api/rest/rest.go 里的相关 Rest 接口 的一一对应关系。</p>
<p>表 6.2 PodStorage 中的各个 XXXREST 接口与 pkg/api/restrest.go 里的相关 Rest接口的一一对应关系 PodStorage Rest 接口 对应 API Rest 框架的接口</p>
<p>接口功能</p>
<p>REST</p>
<p>rest.Redirector</p>
<p>重定向资源的路径</p>
<p>rest.CreaterUpdater 资源创建、更新接口</p>
<p>rest. Lister</p>
<p>资源列表 询接口</p>
<p>rest.Watcher</p>
<p>Watcher 资源变化接口</p>
<p>rest. GracefulDeleter 支持延迟的资源删除接口</p>
<p>rest.Getter</p>
<p>获取具体资源的信息接口</p>
<p>BindingREST</p>
<p>rest.Creater</p>
<p>创建资源的接口</p>
<p>StatusREST</p>
<p>Rest.Updater</p>
<p>更新资源的接口</p>
<p>LogREST</p>
<p>rest.GetterWithOptions 获取资源的接口</p>
<p>ExecREST\ProxyREST\ PortForwardREST rest.Connecter</p>
<p>连接资源的接口</p>
<p>其中 PodStorage. REST 接口究竞实现了哪些 API Rest接口，这个比较隐晦，笔者也花费了 一些时间来研究这个问题，这涉及Go 语言的一个特殊特性：结构体内嵌一个其他类型的结构 体指针，就可以使用内嵌结构体的方法，相当于面向对象语言中的“继承”。而 PodStorage.REST •414•</p>
<h2>第 428 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>恰恰嵌套了 etcdgeneric.Etcd 类型的匿名指针：&amp;REST ｛*store｝，而 etcdgeneric.Etcd 则实现了 rest.Creater、rest.Lister、rest.Watcher 等资源管理接口的所有方法，PodStorage.REST 也 “继承” 了这些接口。</p>
<p>我们回头看看下面这段来自 api_installer.go 的 registerResourceHandlers 函数中的片段：</p>
<p>creater,isCreater ：= storage. （rest.Creater） namedCreater, isNamedCreater ：= storage.（rest.NamedCreater） lister, isLister ：= storage. （rest.Lister） getter，</p>
<p>isGetter ：=</p>
<p>storage. （rest.Getter） getterWithOptions,isGetterwithOptions ：= storage.（rest.GetterWithOptions） deleter, isDeleter ：= storage. （rest.Deleter） gracefulDeleter,isGracefulDeleter ：= storage. （rest.GracefulDeleter） updater, isUpdater ：= storage. （rest.Updater） patcher,isPatcher ：= storage. （rest.Patcher） watcher, isWatcher ：= storage. （rest.Watcher） _、 isRedirector ：= storage. （rest.Redirector） connecter, isConnecter ：= storage. （rest.Connecter） storageMeta,isMetadata ：= storage. （rest.StorageMetadata） 上述代码对 storage 对象进行判断，以确定并标记它所满足的 API Rest 接口类型，而接下来 的这段代码在此基础上确定此接口所包含的 actions，后者则对应到某种 HTTP 请求方法 （GET/POST/PUT/DELETE）或者 HTTP PROXY、WATCH、CONNECT 等动作：</p>
<p>ctions = appendIf（actions, action｛&quot;GET&quot;， itemPath, nameParams,namer｝， isGetter） actions = appendIf（actions,action｛&quot;PATCH&quot;，itemPath, nameParams,namer）， isPatcher）</p>
<p>actions = appendIf（actions,action｛&quot;DELETE&quot;，itemPath,nameParams, namer｝， isDeleter）</p>
<p>actions = appendIf （actions， action｛&quot;WATCH&quot;，&quot;watch/&quot;+ itemPath,nameParams， namer｝，isWatcher）</p>
<p>actions = appendIf（actions,action｛&quot;PROXY&quot;，&quot;proxy/&quot; + itemPath + &quot;/｛path：*｝&quot;.</p>
<p>proxyParams, namer｝， isRedirector） actions = appendIf （actions， action｛&quot;CONNECT&quot;，itemPath,nameParams,namer｝， isConnecter）</p>
<p>我们注意到rest.Redirector 类型的storage被当作PROXY进行处理，由apiserver.ProxyHandler 进行拦截，并调用 rest.Redirector 的 ResourceLocation 方法获取到资源的处理路径（可能包括一 个非空的 http.RoundTripper，用于处理执行 Redirector 返回的URL 请求）。Kubernetes API Server 中 PROXY 请求存在的意义在于透明地访问其他某个节点（比如某个 Minion）上的 API。</p>
<p>最后，我们来分析下 registerResourceHandlers 中完成从 rest.Storage 到 restful.Route 映射的 最后一段关键代码。下面是 rest.Getter 接口的 Storage 的映射代码：</p>
<p>case &quot;GET&quot;： // Get a resource.</p>
<p>• 415</p>
<h2>第 429 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） var handler restful.RouteFunction handler = GetResource （getter, reqScope） doc：= &quot;read the specified &quot; + kind route ：= WS.GET （action.Path）.To （handler）.Filter （m） .Doc （doc）.</p>
<p>Param（ws.QueryParameter （&quot;pretty&quot;， &quot;If &#x27;true&#x27;， then the output is pretty printed.</p>
<p>&quot;））.</p>
<p>Operation（&quot;read&quot;+namespaced+kind+strings.Title（subresource））.</p>
<p>Produces （append （storageMeta. ProducesMIMETyPes （action.Verb），&quot;application/ json&quot;）...）.</p>
<p>Returns （http.StatusOK， &quot;OK&quot;， versionedObject）.Writes （versionedObject） addParams （route, action. Params） ws.Route （route）</p>
<p>上述代码首先通过函数 GetResource（）创建了一个 restful.RouteFunction，然后生成一个 restful.route 对象，最后注册到 restful.WebService 中，从而完成了 rest.Storage 到 Rest 服务的“最 后一公里”通车。GetResource（函数存在于 pkg/apiserver/resthandler.go 里，resthandler.g0 提供 了各种具体的 restful.RouteFunction 的实现函数，是真正触发 rest.Storage 调用的地方。下面是 GetResource（方法的主要代码，可以看出这里是调用 rest.Getter 接口的Get0方法以返回某个资 源对象：</p>
<p>error）｛</p>
<p>func GetResource （r rest.Getter, scope RequestScope） restful.RouteFunction ｛ return</p>
<p>getResourceHandler （scope， func （ctx api.Context,name string,req *restful.Request）（runtime.Object， return r.Get （ctx, name） ｝</p>
<p>看了上面的代码，你可能会有一个疑问：“说好的权限控制呢？”别急，看看下面的资源创 建的 createHandler（）代码：</p>
<p>if admit.Handles （admission.Create）｛ userInfo，</p>
<p>_： api.UserFrom（ctx） err = admit.Admit （admission.NewAttributesRecord（obj,scope.Kind， namespace,name, scope.Resource,scope.Subresource, admission.Create, userInfo） ） if err ！=nil｛</p>
<p>errOrJSON （err，</p>
<p>scope.Codec,w）</p>
<p>return</p>
<p>｝</p>
<p>资源的 Update、Delete、Connect、Patch 等操作都有类似的权限控制，从 Admit 的参数 admission.</p>
<p>Attributes 的属性来看，第三方系统可以开发细粒度的权限控制插件，针对任意资源的任意属性 进行细粒度的权限控制，因为资源对象本身都传递到参数中了。</p>
<p>•416•</p>
<h2>第 430 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>对 Kubernetes Rest API Server 的复杂实现机制和调用流程的总结如下。</p>
<p>在 pkg/api 包里定义了 Rest API 中涉及的资源对象、提供的Rest 接口、类型转换框架 和具体转换函数、序列化反序列化等代码。其中，资源对象和转换函数按照版本分包， 形成了 Kubernetes API Server 基础的框架，其中核心是各类资源（如 Node、Pod、 PodTemplate、Service 等）及这些资源对应的 rest.Storage （Rest API 接口）。</p>
<p>在 pkg/runtime 包里最重要的对象是 Schema，它保存了 Kubernetes API Service 中注册 的资源对象类型、转换函数等重要基础数据。另外，runtime 包也提供了获取 json/yaml 序列化、反序列化的Codec 结构体，runtime 总体上与 pkg/api 密切关联，分离出来的 目的是供其他模块方便使用。</p>
<p>pkg/registry 包其实是把 pkg/api 中定义的各种资源对象所提供的 Rest 接口进一步规范 定义并且实现对应的接口，其中 generate/etcd/etcd.go里的 etcd 对象是一个真正实现了 rest.Storage 接口的基于 etcd 后端存储的服务框架，并且 Kuberetes 中的各种资源对象 的具体 Storage 实现也是通过它来完成真正的“后端存储操作”。</p>
<p>Kubernetes 米用了 go-restful 这个第三方的 Rest 框架，大大简化了 Rest 服务的开发， 主要代码在 pkg/apiserver 源码包里。通过 APIGroupVersion 这个结构体可完成不同API 版本的 Rest 路径映射，而 api_installer.go 则实现了从 Kubernetes Rest.Storage 接口到 go-restful 的映射连接逻辑，对应 rest.Storage 的具体 restful.RouteFunction 则在</p>
<p>resthandler.go 里实现。</p>
<p>6.2.3</p>
<p>设计总结</p>
<p>如果你耐心看完了上面的每一段文字和代码，而且尝试追踪源码来加深对6.2.1 节内容的理 解，那么笔者相信你对于 Kubernetes API Server 的设计的第一个评价就是：“太复杂、太反常了！</p>
<p>不就是一个 Rest Server 么，如果用 Java语言，我可以分分钟搞定一个！”当然，你肯定有以下 或者更多的假设。</p>
<p>放弃多版本 API 的兼容需求。</p>
<p>只采用一个特定的后端存储实现。</p>
<p>2 API 只接收一种输入输出格式，比如 JSON 或者 YANL，而不是两种或更多。</p>
<p>放奔 Watch这种高难度的 API。</p>
<p>◎ 不实现 Proxy代理。</p>
<p>不做可拔插的权限控制设计（或者根本没有）。</p>
<p>•417•</p>
<h2>第 431 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） © 每新增一种资源类型，就从头写很多代码来实现该资源的 Rest 服务。</p>
<p>虽然代码很复杂，但我们不得不承认，Kubernetes API Server 是一个精心“设计”的系统。</p>
<p>什么样的设计是一个好的设计？这个问题没有标准答案，但有一点是大家都认可的：好的 设计要尽量提供一种好的框架机制，方便未来增加新功能或者自定义扩展某些特性。我们以这 个标准对 Kubernetes API Server 的设计进行评价，就会发现：它的设计真的很好。</p>
<p>我们先分析一下 Kubernetes API Server 的“领域模型”。API Server 里的 Rest 服务都是针 对某个“资源对象”的操作，这些操作可以分为新增、修改、列表输出、删除、Watch变化、 代理请求及连接资源等基础操作，大多数操作都是与后端存储的交互。因为只是基本的资源数 据对象的增、删、改、查，所以主体逻辑是通用的，比如序列化、反序列化、基于 Key-Value 的存储，以及这个过程中的数据校验和权限控制等问题。</p>
<p>通过以上分析，我们发现这个系统的核心对象只有两个：资源对象与操作资源对象的 Storage 服务。虽然各个资源的 Storage 服务的主体功能相同，都是将资源存储到 etcd 这个 Key-Value 后 端存储系统上并提供相关操作，但不同类型资源的 Storage 服务的接口和具体逻辑还是有差 别的，比如某类资源是不允许更新的，有些资源则允许“Connect”，所以这里的设计是 Kubernetes API Server 的最有代表性的经典设计——资源服务接口的细分与组合设计。</p>
<p>如图6.2所不是此设计的全景图（以Pod 资源对象为例）。资源服务接口被拆分为 rest. Create、 rest.Updater、rest. CreateUpdate（组合了 Create 与 Updater 接口）、rest.GracefulDelete（支持延 迟删除资源的接口）、rest.Patcher（组合更新与 Get 接口）、rest.Connect（开启 HTTP 连接到 该资源进行操作，比如连接到一个 Pod 中执行某个 bash 命令）等10个细分接口。</p>
<p>考虑到大多数资源对象都需要基本的 CRUD 接口，这就是 rest.StandardStorage 这个聚合型 “标准存储服务”接口出现的原因。而作为 StandardStorage 的默认实现，pkg/registry/generic/ etcd/etcd.go 里 etcd 这个对象实现了基于 etcd 后端存储的所有具体操作，而各种资源的 Storage 服务则通过将请求代理到etcd 对象上来完成具体的功能。</p>
<p>这里有点让人难以理解的是 PodStorage 与它的属性Pod 的关系，其实 PodStorage这个对象 是一个聚合了与Pod相关的各个资源的存储服务，多看一下它的定义就能立刻明白了：</p>
<p>// PodStorage includes storage for pods and all sub resources type PodStorage struct｛ Pod</p>
<p>*REST</p>
<p>Binding</p>
<p>*BindingREST</p>
<p>Status</p>
<p>*StatusREST</p>
<p>Log</p>
<p>*LOgREST</p>
<p>ProxY</p>
<p>*PIOXYREST</p>
<p>Exec</p>
<p>*ExeCREST</p>
<p>PortForward *PortForwardREST ｝</p>
<p>• 418•</p>
<h2>第 432 页</h2>
<h3>第6章</h3>
<p>Kubernetes 源码导读</p>
<p>rest.Updater</p>
<p>肥</p>
<p>rest.Getter</p>
<p>rest. Lister</p>
<p>rest.Watcher</p>
<p>rest.Deleter</p>
<p>rest.Patcher</p>
<p>rest.Redirector</p>
<p>rest.Connecter</p>
<p>pod.PodStorage</p>
<p>pod.PodStorage-&gt;Pod pod.PodRcgistry</p>
<p>图6.2 API Server 的 Storage 设计全景图 所以，这里的 PodStorage 应该重命名为 AllPodResStorage，而真正的 PodStorage 上就是里面 的那个 Pod变量，这个变量是对etcd 实例的一个引用，然后又实现了 rest.Redirector 接口。现在 你终于能理解 PodRegistry 引用Pod变量而不是PodStorage 来实现Pod 操作的真正原因了吧？</p>
<p>最后，我们来说说 PodRegistry 存在的目的。从之前的代码分析来看，一个来自外部的针对 某个资源的 Rest API 发起的请求最后落到对应资源的 rest.Storage 对象上，由 restful.</p>
<p>RouteFunction 调用此对象的相关方法完成资源的操作并生成应答返回给客户端，这个过程并没 有涉及对应资源的 Registry 服务。那么问题来了，资源的 Registry 接口存在的理由是什么呢？</p>
<p>答案很简单，对比 Storage 接口与 Registry 中的资源创建方法的签名，下面是二者的源码对比， 后者更符合“手工调用”：</p>
<p>Storage 中创建通用的资源对象的接口 Create（ctx api.Context, obj runtime.Object）（runtime.Object, error） PodRegistry 中创建 Pod 资源的接口 CreatePod（ctx api.Context, pod *api.Pod） error 在Kubernetes API Server 中內每类资源都创建并提供了一个 Registry接口服务的目的是供内 部模块的编程使用，而非对外提供服务，很多文档都错误理解了这个问题。</p>
<p>• 419•</p>
<h2>第 433 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 本节最后给出了如图6.3所示的经典的 Kubernetes 的Master 节点数据流图，此刻这个图在 你眼里可能已经什么都不算了，因为你已经洞穿了幕后的一切。</p>
<p>MasterWorkFlow</p>
<p>Kubecfg</p>
<p>Kubelet Client</p>
<p>APi Serer</p>
<p>Scheduler</p>
<p>Q</p>
<p>Minion Reqistry</p>
<p>Storage</p>
<p>REST Storage</p>
<p>API</p>
<p>Controller</p>
<p>Registry Storage</p>
<p>Pod Registry</p>
<p>Storage</p>
<p>Semice Registry</p>
<p>Storage</p>
<p>Endpoints</p>
<p>Registry Storage</p>
<p>Binding</p>
<p>Registry Storage</p>
<p>Elcd Registry</p>
<p>Storage</p>
<p>Registry Storage</p>
<p>图 6.3 Master 节点数据流图 63</p>
<p>kube-controller-manager 进程源码分析 运行在 Master 节点上的第2个进程就是 kube-controller-manager 进程，即 Controller Manager Server,Kubernetes 的核心进程之一，其主要目的是实现 Kubernetes 集群的故障检测和恢复的自 动化工作，比如内部组件 EndpointController 控制器负责 Endpoints 对象的创建和更新；</p>
<p>ReplicationManager 根据注册表中的 ReplicationController 的定义，完成 Pod 的复制或者移除， 以确保复制数量的一致性；NodeController 负责 Minion 节点的发现、管理和监控。</p>
<p>6.3.1</p>
<p>进程启动过程</p>
<p>kube-controller-manager 进程的入口源码位置如下：</p>
<p>•420•</p>
<h2>第 434 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>github/com/GoogleCloudPlatform/kubernetes/cmd/kube-controller-manager/ controller- manager.go</p>
<p>入口 main（函数的逻辑如下：</p>
<p>Func main（）｛</p>
<p>runtime.GOMAXPROCS （runtime.NumCPU（）） s ：= app.NewCMServer（） s.AddFlags （pflag.CommandLine） util.InitFlags （）</p>
<p>util.InitLogs（）</p>
<p>defer util.FlushLogs （） verflag.PrintAndExitIfRequested （） if err ：= s.Run （pflag.CommandLine.Args（））；err ！= nil ｛ Emt.Fprintf（os.Stderr，&quot;&amp;v\n&quot;，err） os.Exit （1）</p>
<p>｝</p>
<p>从源码可以看出，关键代码只有两行，创建一个 CMServer 并调用Run 方法启动服务。下 面我们分析 CMServer 这个结构体，它是 Controller Manager Server 进程的主要上下文数据结构， 存放一些关键参数，表6.3 是对CMServer 里的关键参数的解释。</p>
<p>表6.3</p>
<p>CMServer 的重要属性</p>
<p>属性名</p>
<p>默认</p>
<p>含义</p>
<p>ConcurrentEndpointSyncs 5秒：</p>
<p>并发执行的 Endpoint 的同步任务的数量 ConcurrentRCSyncs</p>
<p>5秒</p>
<p>并发执行的Replication Controller 的同步任务的数量 NodeSyncPeriod</p>
<p>5秒</p>
<p>从 CloudProvider处同步Node 节点的周期 NodeMonitorPeriod</p>
<p>5秒</p>
<p>Node 节点监控的周期</p>
<p>ResourceQuotaSyncPeriod 10秒</p>
<p>对资源的配额使用情况进行同步的周期</p>
<p>NamespaceSyncPeriod 5分钟</p>
<p>Namespace 同步的周期</p>
<p>PVClaimBinderSyncPeriod 10秒</p>
<p>对PV（持久存储）和PV的申请进行同步的周期 PodEvictionTimeout 5分钟</p>
<p>在 Node 失败的情况下，其上的Pod 多久后才被删除 master</p>
<p>Kubernetes API Server 的访问地址 从上述这些变量来看，</p>
<p>Controller Manager Server 其实就是一个“超级调度中心”，它负责 定期同步 Node 节点状态、资源使用配额信息、Replication Conctroller、Namespace、Pod 的 PV 绑定等信息，也包括执行诸如监控 Node 节点状态、清除失败的Pod 容器记录等一系列定 时任务。</p>
<p>在 controller-manager.go 里创建 CMServer 实例并把参数从命令行中传递到 CMServer 后， 就调用它的 func （s *CMServer） Run （_［］string）方法进入关键流程，这里首先创建一个 Rest Client 对象用于访问 Kubernetes API Server 提供的API服务：</p>
<p>• 421•</p>
<h2>第 435 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） kubeClient,err ：= client.New （kubeconfig） if err ！= nil｛</p>
<p>glog.Fatalf（&quot;Invalid API configuration: av&quot; 、Orr）</p>
<p>｝</p>
<p>随后，创建一个 HTTP Server 以提供必要的性能分析（Performance Profile）和性能指标度 量（Metrics）的 Rest 服务：</p>
<p>go func（）｛</p>
<p>mux ：= http.NewServeMux （） healthz.InstallHandler （mux） if s.EnableProfiling｛ mux.Handlerunc （&quot;/debug/PProf/&quot;，PProf.Index） mux.HandleFunc （&quot;/debug/pprof/profile&quot;，pprof.Profile） mux.HandleFunc（&quot;/debug/pprof/symbo1&quot;，Pprof.Symbol） ｝</p>
<p>mux.Handle （&quot;/metrics&quot;，prometheus.Handler（）） server ：= &amp;http. Server｛ Addr：</p>
<p>strconv.Itoa （s.Port））， Handler: mux，</p>
<p>net. JoinHostPort （s.Address. String （）， ｝</p>
<p>glog.Fatal （server.ListenAndServe （）） ｝（）</p>
<p>我们注意到性能分析的Rest 路径是以/debug 开头的，表明是为了程序调试所用，事实上的 确如此，这里的几个 Profile 选项都是针对当前Go 进程的 Profile 数据，比如我们在 Master 节点 上执行 curl 命令（地址为 http://127.0.0.1:10252/debug/pprof/heap）可以获取进程的当前堆栈信息， 会输出如下信息：</p>
<p>heap profile: 4: 78112 ［1109: 824584］ e heap/1048576</p>
<p>1:32768 ［1:32768］@0x402612 0x75ab95 0x771419 0x771379 0x565E08 0x46133f 0x400d10 0x4155a3 0x43e711 1:32768［1:327681@ 0x408806 0x407968 0x97e591 0x9895aa 0x76099b 0xa2f400 0xa4e887 0x765dc4 0x557fbc 0x782fac Ox5fe5db 0x602ca7 0x462c92 0x400f06 0x415594 0x43e711</p>
<p>1:12288 ［1:12288］ @ 0x4199fc 0x7df75d 0x5b585c 0x5b4947 0x5b405a 0x5aa472 0x5aa2b7 0x5aa188 0x5ad0d3 0x4629le 0x43e711 1:288 ［1:288］ @0x415d6a 0x43276f 0x43510f 0x42fd37 0x4311f9 0x430ef5 0x43c136 其他还有GC 回收、Symbol 查看、进程30秒内的CPU 利用率、协程的阻塞状态等 Profile 功能，输出的数据格式符合 google-perftools 这个工具的要求，因此可以做运行期的可视化 Profile，以便排查当前进程潜在的问题或性能瓶颈。</p>
<p>性能指标度量目前主要收集和统计 Kubernetes API Server 的 Rest API 的调用情况，执行 curl •422•</p>
<h2>第 436 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>（http://127.0.0.1:10252/metrics），可以看到输出中包括大量类似下面的内容：</p>
<p>rest_client_request.</p>
<p>_latency_microseconds｛url=&quot;http://centos-master:8080/api/ v1/namespaces/default/endpoints/e3Cname%3E&quot;，verb=&quot;GET&quot;， quantile=&quot;0.5&quot;｝ 1448 rest</p>
<p>_client_request.</p>
<p>_latency_microseconds｛url=&quot;http://centos-master:8080/api/ V1/namespaces/default/endpoints/3Cname83E&quot;，verb=&quot;GET&quot;， quantile=&quot;0.9&quot;｝ 1699 rest</p>
<p>_client</p>
<p>_request.</p>
<p>_latency_microseconds｛url=&quot;http://centos-master:8080/api/ V1/namespaces/default/endpoints/83Cname83E&quot;，verb=&quot;GET&quot;，quantile=&quot;0.99&quot;｝ 2093 这些指标有助于协助发现 Controller Manager Server 在调度方面的性能瓶颈，因此可以理解 为什么会被包括到进程代码中去。</p>
<p>接下来，启动流程进入到关键代码部分。在这里，启动进程分别创建如下控制器，这些控 制器的主要目的是实现资源在 Kubernetes API Server 的注册表中的周期性同步工作：</p>
<p>EndointController 负责对注册表中的 Kubernetes Service 的Endpoints 信息的同步工作；</p>
<p>ReplicationManager 根据注册表中对 ReplicationController 的定义，完成 Pod 的复制或 者移除，以确保复制数量的一致性；</p>
<p>NodeController 则通过 CloudProvider 的接口完成Node 实例的同步工作；</p>
<p>servicecontroller 通过 CloudProvider 的接口完成云平台中的服务的同步工作，这些服务 目前主要是外部的负载均衡服务；</p>
<p>ResourceQuotaManager 负责资源配额使用情况的同步工作；</p>
<p>NamespaceManager 负责 Namespace 的同步工作；</p>
<p>Persistent VolumeClaimBinder 与 PersistentVolumeRecycler 分别完成 PersistentVolume 的 绑定和回收工作；</p>
<p>TokensController、ServiceAccountsController 分别完成 Kubernetes 服务的 Token、Account 的同步工作。</p>
<p>创建并启动完成上述的控制器以后，各个控制器就开始独立工作，Controller Manager Server 启动完毕。</p>
<h3>6.3.2 关键代码分析</h3>
<p>在6.3.1 节对kube-controller-manager 进程的启动过程进行了详细分析，我们发现这个进程 的主要逻辑就是启动一系列的“控制器”。这里以 Kubernetes 里比较关键的 Pod 副本（Pod Replica）数量的控制实现过程为例，来分析完成这个任务的“控制器”—ReplicationManager 具体是如何工作的。</p>
<p>•423•</p>
<h2>第 437 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 首先，我们来看看 ReplicationManager 结构体的定义：</p>
<p>type ReplicationManager struct ｛ kubeClient client. Interface podControl PodControlInterface // An rc is temporarily suspended after creating/deleting these many replicas.</p>
<p>// It</p>
<p>resumeS</p>
<p>normal action after observing the watch events for them.</p>
<p>burstReplicas</p>
<p>// To allow injection of syncReplicationController for testing.</p>
<p>syncHandler func（rcKey string） error 1/ podStoreSynced returns true if the pod store has been synced at least once.</p>
<p>// Added as a member to the struct to allow injection for testing.</p>
<p>podStoreSynced func （） bool // A TTLCache of pod creates/deletes each rc expects to see expectations RCExpectationsManager // A store of controllers,populated by the rcController controllerstore cache.StoreToControllerLister // A store of pods,populated by the podController podStore cache.StoreToPodLister // Watches changes to all replication controllers rcController *framework.Controller // Watches changes to all pods podController *framework.Controller // Controllers</p>
<p>that need to be updated queue *workqueue.Type ｝</p>
<p>在上述结构体里，比较关键的几个属性如下。</p>
<p>kubeClient：用来访问 Kubernetes API Server 的Rest客户端，这里用来访问注册表中定 义的 ReplicationController 对象并操作 Pod。</p>
<p>◎</p>
<p>podControl：实现了 Pod 副本创建的函数，其实现类 RealPodControl（位于 kubernetes/pkg/controller/controller_utils.go）。</p>
<p>©</p>
<p>syncHandler： 是 RC （ReplicationController）的同步实现方法，完成具体的RC 同步逻辑 （创建Pod副本时调用PodControl 的相关方法），在代码中其被赋值为 ReplicationManager.</p>
<p>syncReplicationController 方法。</p>
<p>expectations：是Pod 副本在创建、删除过程中的流控机制的重要组成部分。</p>
<p>©</p>
<p>controllerStore：是一个具备本地缓存功能的通用的资源存储服务，这里存放 framework.</p>
<p>Controller 运行过程中从 Kubernetes API Server 同步过来的资源数据，目的是减轻资源 同步过程中对 Kubernetes API Server 造成的访问压力并提高资源同步的效率。</p>
<p>• 424•</p>
<h2>第 438 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>rCController: framework.Controller 的一个实例，用来实现 RC同步的任务调度逻辑。</p>
<p>framework.Controller：是kube-controller-manager 里设计的用于资源对象同步逻辑的专 用任务调度框架。</p>
<p>podStore：类似于 controllerStore 的作用，用来存取和获取Pod 资源对象。</p>
<p>podController：类似于 rcController 的作用，用来实现Pod 同步的任务调度逻辑。</p>
<p>理解了 ReplicationManager 结构体的重要参数及其作用之后，我们来看 controller.</p>
<p>NewReplicationManager （kubeClient client.Interface, burstReplicas int） *ReplicationManager 这 个构造函数中的关键代码，注意到这里通过调用 framework.NewInformer（）方法先后创建了用 于RC 同步及 Pod 同步的 framework.Controller。 下面是 framework.NewInformer（）方法的源码：</p>
<p>func NewInformer（</p>
<p>lw cache.ListerWatcher， objrype runtime.Object， resyncPeriod time.Duration， h ResourceEventHandler， ）（cache. Store， *Controller） ｛</p>
<p>clientState ：= cache.NewStore （DeletionHandlingMetaNamespaceKeyFunc） fifo ：= cache.NewDeltaFIFO （cache.MetaNamespaceKeyFunc, nil, clientState） cfg：= &amp;Config｛</p>
<p>Queue：</p>
<p>fifo，</p>
<p>ListerWatcher：</p>
<p>Iw，</p>
<p>ObjectType：</p>
<p>objrype，</p>
<p>FullResyncPeriod: resyncPeriod， RetryOnError：</p>
<p>false，</p>
<p>Process: func （obj interface｛｝） error｛ // from oldest to newest for</p>
<p>d：= range obj.（cache.Deltas） switch d.Type ｛</p>
<p>case cache.Sync, cache.Added, cache.Updated：</p>
<p>if old,exists,err ：= clientState.Get （d.Object）； err == nil &amp;&amp; exists｛</p>
<p>if err ：= clientState.Update （d.Object）；err ！= nil｛ return err</p>
<p>｝</p>
<p>｝ else｛</p>
<p>h.OnUpdate （old,d.Object） err：= clientState.Add（d.Object）；err ！= nil ｛ ｝</p>
<p>h.OnAdd （d.Object） ｝</p>
<p>case cache.Deleted：</p>
<p>i£ er工</p>
<p>：- clientState.Delete （d.Object）；err ！= mil ｛ • 425•</p>
<h2>第 439 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） return err</p>
<p>｝</p>
<p>h.OnDelete （d.Object） ｝</p>
<p>return nil</p>
<p>｝</p>
<p>｝</p>
<p>return clientState,New （cfg） ｝</p>
<p>在上述代码中，Iw（ListerWatcher）用来获取和监测资源对象的变化，而 fifo 则是一个 DeltaFIFO 的 Queue，用来存放变化的资源（需要同步的资源）。当 Controller 框架发现有变化 的资源需要处理时，就会将新资源与本地缓存 clientState 中的资源进行对比，然后调用相应的 资源处理函数 ResourceEventHandler 的方法，完成具体的处理逻辑。下面是针对 RC 的 ResourceEventHandler 的具体实现：</p>
<p>framework.ResourceEventHandlerFuncs｛ AddFunc: rm.enqueueController， UpdateFunc: func（old, cur interface｛｝）｛ oldRC ：= old. （*api.ReplicationController） curRC ：= cur. （*api.ReplicationController） if oldRC.Status.Replicas ！= curRC.Status.Replicas ｛ glog.V （4）.Infof （&quot;Observed updated replica count for rc： &amp;v， 8d-&gt;8d&quot;，CurRC.Name， oldRC.Status.Replicas, curRC.Status.Replicas） rm.enqueueController （cur） ｝，</p>
<p>DeleteFunc: rm.enqueueController， ｝</p>
<p>在上述源码中，我们看到当 RC里 Pod 的副本数量属性发生变化以后，ResourceEventHandler 就将此 RC放入 ReplicationManager 的 queue 队列中等待处理，为什么没有在这个 handler 函数 中直接处理而是先放入队列再异步处理呢？最主要的一个原因是 Pod 副本创建的过程比较耗 时。Controller 框架把需要同步的RC对象放入queue 以后，接下来是谁在“消费”这个队列呢？</p>
<p>答案就在 ReplicationManager 的 Run（方法中：</p>
<p>func （rm *ReplicationManager） Run （workers int, stopCh &lt;-chan struct（｝）｛ defer util.HandleCrash （） go rm.rcController.Run （stopCh） go rm.podController.Run （stopCh） for i：=0;i&lt; workers; i++ ｛ go util.Until （rm.worker, time.Second, stopCh） ｝</p>
<p>&lt;-stopCh</p>
<p>glog. Infof（&quot;Shutting down RC Manager&quot;） •426•</p>
<h2>第 440 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>rm.queue.ShutDown（） 上述代码首先启动 rcController 与 podController 这两个 Controller，启动之后，这两个 Controller 就分别开始拉取RC与Pod 的变动信息，随后又启动N个协程并发处理 RC的队列， 其中 func Until （f funcO, period time.Duration, stopCh &lt;-chan struct｛｝）方法的逻辑是按照指定的 周期period 执行方法f。下面是 ReplicationManager 的worker 方法的源码，负责从 RC 队列中拉 取RC并调用 rm 的 syncHandler 方法完成具体处理：</p>
<p>func （rm *ReplicationManager） worker（）｛ for｛</p>
<p>func（）｛</p>
<p>key, quit ：= rm.queue.Get （） if quit｛</p>
<p>return</p>
<p>defer rm.queue. Done （key） err：= rm. syncHandler （key. （string）） if err ！= nil｛</p>
<p>glog.Errorf（&quot;Error syncing replication controller： &amp;v&quot;，err） ｝</p>
<p>）（）</p>
<p>｝</p>
<p>｝</p>
<p>从 ReplicationManager 的构造函数中我们得知：syncHandler 在这里其实是 func （mm *ReplicationManager） syncReplicationController（key string）方法。下面是该方法的源码：</p>
<p>func （rm *ReplicationManager） syncReplicationController （key string）error ｛ startTime ：= time .Now （） defer func（）｛</p>
<p>glog.V（4）.Infof（&quot;Finished syncing controller 8q （8v）&quot;，key, time.</p>
<p>Now （）. Sub （startTime）） ｝（）</p>
<p>obj，exists, err ：= rm.controllerStore.Store.GetByKey （key） ！exists</p>
<p>glog.Infof （&quot;Replication Controller has been deleted &amp;v&quot;，key） rm.expectations.DeleteExpectations （key） return nil</p>
<p>｝</p>
<p>if err ！= nil</p>
<p>亻</p>
<p>glog.Infof（&quot;Unable to retrieve rc ev from store: av&quot;， key, err） rm.queue.Add （key） return err</p>
<p>｝</p>
<p>controller</p>
<p>：= *obj.（*api.ReplicationController） • 427•</p>
<h2>第 441 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） if !rm.podStoreSynced （）｛ // Sleep so we give the pod reflector goroutine a chance to run.</p>
<p>time.Sleep （PodStoreSyncedPol1Period） glog.Infof （&quot;Waiting for pods controller to sync, requeuing rc ov&quot;， controller . Name） rm.enqueueController （&amp;controller） return nil</p>
<p>rCNeedsSync：= rm.expectations.SatisfiedExpectations （&amp;controller） podList, err ：= rm.podStore.Pods （controller. Namespace）. List （labels. Set （controller.Spec.Selector）.AsSelector （）） if err！=nil｛</p>
<p>glog.Errorf（&quot;Error getting pods for rc &amp;q： &amp;v&quot;，key,err） rm.queue.Add（key）</p>
<p>return err</p>
<p>｝</p>
<p>filteredPods ：= filterActivePods （podList .Items） if rcNeedsSync｛</p>
<p>rm.manageReplicas （filteredPods， &amp;controller） ｝</p>
<p>if err ：= updateReplicaCount （rm.kubeClient.ReplicationControllers （controller.</p>
<p>Namespace），controller,len （filteredPods））；err ！= nil｛ rm.enqueueController （&amp;controller） ｝</p>
<p>return nil</p>
<p>｝</p>
<p>在上述代码里有一个重要的流控变量 rcNeedsSync。为了限流，在 RC 同步逻辑的过程中， 一个RC 每次最多执行 N个Pod 的创建、删除，如果某个 RC 的同步过程涉及的Pod 副本数量 超过 burstReplicas 这个阈值，就会采用 RCExpectations 机制进行限流。RCExpectations 对象可 以理解为一个简单的规则：即在限定的时间内执行 N次操作，每次操作都使计数器减一，计数 器为零表示 N个操作已经完成，可以进行下一批次的操作了。</p>
<p>Kubernetes 为什么会设计这样一个流程控制机制？其实答案很简单——为了公平。因为谷 歌的开发 Kubernetes 的资深大牛们早已预见到某个 RC 的Pod 副本一次扩容至100倍的极端情 况可能真实发生，如果没有流控机制，则这个巨无霸的RC 同步操作会导致其他众多“散户” 崩溃！这绝对不是谷歌的理念。</p>
<p>接着看上述代码里所调用的 ReplicationManager 的 manageReplicas 方法，这是RC 同步的具 体逻辑实现，此方法采用了并发调用的方式执行批量的Pod 副本操作任务，相关代码如下；</p>
<p>wait ：= sync.WaitGroup｛｝ • 428</p>
<h2>第 442 页</h2>
<h3>第6章</h3>
<p>Kubernetes 源码导读</p>
<p>wait.Add （diff）</p>
<p>glog.V（2）.Infof（&quot;Too few 8q/8q replicas,need ed, creating gd&quot;， controller.Namespace,controller.Name,controller.Spec.Replicas, diff） for i：=0;i &lt; diff; i++ ｛ go func（）｛</p>
<p>defer wait.Done （） if err ：= rm.podControl.createReplica （controller.Namespace， controller）；err ！= nil｛ glog.V （2）.Infof（&quot;Failed creation,decrementing expectations for controller 8q/8q&quot;，controller. Namespace,controller. Name） rm.expectations.Creationobserved （controller） util.HandleBrror （err） 〕（）</p>
<p>wait.Wait （）</p>
<p>追踪至此，我们才看到创建Pod副本的真正代码在 PodControl.createReplica（）方法里，而此 方法的具体实现方法则是 RealPodControl.createReplica（），位于 controller_utils.go 里。通过分析 该方法，我们可以知道创建Pod 副本的过程就是创建一个 Pod 资源对象，并把 RC中定义的 Pod 模板赋值给该Pod 对象，并且Pod 的名字用 RC 的名字做前缀，最后调用 Kubernetes Client 将 Pod 对象通过 Kubernetes API Server 写入后端的 etcd 存储中。</p>
<p>在本节最后，我们来分析一下 Controller 框架中如何实现资源对象的查询和监听逻辑并且 在资源发生变动时回调 Controller.Config 对象中的 Process 方法：func（obj interface ｛｝），最终完 成整个 Controller 框架的闭环过程。</p>
<p>首先，在 Controller 框架中构建了 Reflector 对象以实现资源对象的查询和监听逻辑，它的 源码位于 pkg/client/cache/reflector.go 中，我们看一下这个对象的数据结构就基本明白了其工作 原理：</p>
<p>// Reflector watches a specified resource and causes all changes to be reflected in the given store.</p>
<p>type Reflector struct ｛ // The type of object we expect to Place in the store.</p>
<p>expectedType reflect.Type // The destination to sync up with the watch source store Store</p>
<p>// 1isterWatcher is used to perform lists and watches.</p>
<p>listerWatcher ListerWatcher // period controls timing between one watch ending and // the beginning of the next one.</p>
<p>period</p>
<p>time.Duration</p>
<p>resyncPeriod time.Duration // lastSyncResourceVersion is the resource version token last • 429•</p>
<h2>第 443 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 1/ observed when doing a sync with the underlying store 11 it is thread safe, but not synchronized with the underlying store lastSyncResourceVersion string 1/ lastSyncResourceVersionMutex guards read/write access to lastSyncResourceVersion lastSyncResourceVersionMutex sync.RWMutex ｝</p>
<p>核心思路就是通过 listerWatcher 去获取资源列表并监听资源的变化，然后存储到 store 中。</p>
<p>这里你可能有个疑问，这个 store 究竟是哪个对象？是 ReplicationManager 里的 controllerStore 还是framework.NewInformer（）方法里创建的 fifo 队列？</p>
<p>下面的两段来自 pkg/controller/framework/controller.go 的代码会告诉我们答案。</p>
<p>首先是来自 Controller 的 run 方法 func （c *Controller） Run（stopCh &lt;-chan struct｛｝） 的代码 片段：</p>
<p>r ：= cache. NewReflector （ c.config.ListerWatcher， c.config.ObjectType， c.config.Queue，</p>
<p>c.config.FullResyncPeriod， ）</p>
<p>然后是来自 Controller 的 NewInformer 方法 func NewInformer（lw cache. Lister Watcher， objType runtime.Object， resyncPeriod time.Duration, h ResourceEventHandler，） （cache.Store，</p>
<p>*Controller）中的代码片段：</p>
<p>cfg：= &amp;Configl</p>
<p>Queue：</p>
<p>fifo，</p>
<p>ListerWatcher：</p>
<p>Iw，</p>
<p>ObjectType：</p>
<p>objType，</p>
<p>FullResyncPeriod: resyncPeriod， RetryOnError：</p>
<p>false，</p>
<p>分析上述代码，我们发现 Reflector 中的 store 其实是引用 Controller.Config 里的 Queue 属性， 即 fifo 队列，而非 ReplicationManager 里的 controllerStore。我们费了这么大的劲，才弄明白这 个简单的问题，这告诉我们一个事实：编程中有良好的命名规则很重要。</p>
<p>下面这段代码是 Controller 从队列 Queue 中拉取资源对象并且交给 Controller.Config 对象 中的 Process 方法 func（obj interface ｛｝）进行处理，从而最终完成了整个 Controller 框架的闭环 过程。</p>
<p>func （c *Controller） processLoop （） ｛</p>
<p>for</p>
<p>｛</p>
<p>obj ：= C.config.Queue.Pop （） • 430•</p>
<h2>第 444 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>err ：= c.config. Process （obj） if err ！= nil｛</p>
<p>if c.config.RetryOnError ｛ 11 This is the safe way to re-enqueue.</p>
<p>c.config.Queue.AddIfNotPresent （obj） ｝</p>
<p>｝</p>
<p>｝</p>
<p>｝</p>
<p>至于上述过程的调用则是在 Controller 启动（Run 方法）的最后一步里，Controller 框架定 时每秒调用一次上述函数，代码如下：</p>
<p>uti1.0nti1（c.processLoop,time.Second,stopCh） 最后，给读者留一个源码解读的问题，即 ReplicationManager 里除了 RC Controller，又构 造了一个用于Pod的 Controller，它的逻辑具体是怎样实现的？它与 RC Controller 是怎样交互 的？</p>
<h3>6.3.3 设计总结</h3>
<p>相对于之前的 Kubernetes API Server 设计来说，Kubernetes Controller Server 的设计没有那 么复杂，而且精彩依旧。不愧是大师的作品，Controller Framework 精巧细致的设计使得整个进 程中各种资源对象的同步逻辑在代码实现方面保持了高度一致性与简捷性。此外，在关键资源 RC（Replication Controller）的同步逻辑中所采用的流控机制也简单、高效。</p>
<p>本节我们针对 Kubernetes Controller Server 中的精华部分- -Controller Framework 的设计 做一个整理分析。首先，framework.Controller 内部维护一个 Config 对象，保留了一个标准的消 息、事件分发系统的三要素。</p>
<p>生产者：cache.ListerWatch。</p>
<p>｛</p>
<p>队列：cache.cacheStore（Queue）。</p>
<p>消费者：用回调函数来模拟（framework.ResourcceEventHandlerFuncs）。</p>
<p>由于生产者的逻辑比较复杂，在这个系统中也有其特殊性，即拉取资源并监控资源的变化， 由此产生了真正的待处理任务，所以又设计了一个 ListerWatcher 接口，将底层的复杂逻辑“框 架化”，放入 cache.Reflector 中，使用者只要简单地实现 ListerWatcher 接口的 ListFunc 与 WatchFunc 即可。另外，cache.Reflector 也是独立于 Controller Framework 的一个组件，隶属于 cache 包，它的功能是将任意资源对象拉取到本地缓存中并监控资源的变化，保持本地缓存的同 步，其目标是减轻对 Kubernetes API Server 的请求压力。</p>
<p>• 431 •</p>
<h2>第 445 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 图6.4给出了 Controller Framework 的整体架构设计图。</p>
<p>通过 Kubemetes Rest Client 拉取并监控 资源的变化，已发生改变的资源放入</p>
<p>FIFO 队列中等待处理</p>
<p>cache.Lister Watcher cache.Reflector</p>
<p>创建 Refelctor 并周期性调用 ListAndWNatch 方法</p>
<p>framework.Controller client.Client</p>
<p>cache.Store</p>
<p>周期性调用 Handler</p>
<p>方法处理队列</p>
<p>framework.ResourceEventHandlerfuncs 图 6.4 Controller Framework 的整体架构设计图 Kubernetes Controller Server 中所有涉及同步的资源都采用了 Controller Framework 框架来 进行驱动，图 6.5 给出了整体设计示意图。</p>
<p>从图 6.5可以看出，除了 Node、Route、Cloud Service 这三个资源依赖于 Kubernetes 所处的 云计算环境，只能通过 CloudProvider 接口所提供的 API 来完成资源同步，其他资源都采用了 Controller Framework 框架来进行资源同步。图中的虚线箭头表示针对目标资源创建了一个 framework.Controller 对象，其中的某些资源如 RC、PV、Tokens 的同步过程需要获取并监听其 他与之相关联的资源对象。这里只有 ResourceQuota 资源比较另类，它没有采用 Controller Framework，一个原因是 ResourceQuota 涉及很多资源对象，不大好应用 framework.Controller， 另外一个原因可能是写 ResourceQuotaManager 的大牛拥有比较浪漫的情怀，看看下面这段 Kubernetes 中最优美的代码吧：</p>
<p>func （rm *ResourceQuotaManager）Run（period time.Duration）｛ rm.syncTime = time.Tick （period） go util.Forever（func （）｛ rm.synchronize （）｝，period） ｝</p>
<p>核心代码翻译过来就是这个意思：从此他们过上了幸福的生活，一去不复返了！</p>
<p>• 432•</p>
<h2>第 446 页</h2>
<h3>第6章</h3>
<p>Kubernetes 源码导读</p>
<p>Controller</p>
<p>Framework</p>
<p>EndpointController ReplicationManager NamespaceManager</p>
<p>Persistent VolumeClaimBinder Persistent VolumeRecycler app.CMServer</p>
<p>TokensController</p>
<p>Pod</p>
<p>Service</p>
<p>ReplicationCo</p>
<p>ntroller</p>
<p>Namespace</p>
<p>Pvalins</p>
<p>PV</p>
<p>ServiceAccount</p>
<p>ResourceQuotaManager Secret</p>
<p>CloudProvider 接口</p>
<p>RouteController</p>
<p>图 6.5</p>
<p>ServiceController</p>
<p>Kubernetes Controller Server 整体设计示意图 6.4</p>
<p>kube-scheduler 进程源码分析 Kubernetes Scheduler Server 是由 kube-scheduler 进程实现的，它运行在 Kubernetes 的管理节 点—Master 上并主要负责完成从 Pod到 Node 的调度过程。Kubernetes Scheduler Server 跟踪 Kubernetes 集群中所有Node 的资源利用情况，并采取合适的调度策略，确保调度的均衡性，避 免集群中的某些节点 “过载”。从某种意义上来说，Kubernetes Scheduler Server 也是 Kuberetes 集群的“大脑”。</p>
<p>谷歌作为公有云的重要供应商，积累了很多经验并且了解客户的需求。在谷歌看来，客户 • 433•</p>
<h2>第 447 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 并不真正关心他们的服务究竟运行在哪台机器上，他们最关心服务的可靠性，希望发生故障后 能自动恢复。遵循这一指导思想，Kubernetes Scheduler Server 实现了“完全市场经济”的调度 原则并彻底抛弃了传统意义上的“计划经济”。</p>
<p>下面我们分别对其启动过程、关键代码分析及设计总结等方面进行深入分析和讲解。</p>
<h3>6.4.1 进程启动过程</h3>
<p>kube-scheduler 进程的入口类源码位置如下：</p>
<p>github/com/GoogleCloudPlatform/kubernetes/plugin/cnd/kube-scheduler/scheduler.go。</p>
<p>入口 main（函数的逻辑如下：</p>
<p>func main（）</p>
<p>｛</p>
<p>runtime.GOMAXPROCS （runtime .NumCPU （） ） s ：= app.NewSchedulerServer（） s.AddFlags （pflag.CommandLine） util.InitFlags （）</p>
<p>util.InitLogs（）</p>
<p>defer util.Flushlogs （） verflag.PrintAndExitIfRequested （） s.Run （pflag.CommandLine.Args （）） 对上述代码的风格和逻辑我们再熟悉不过了：创建一个 SchedulerServer 对象，将命令行参 数传入，并且进入 SchedulerServer 的Run 方法，无限循环下去。</p>
<p>按照惯例，我们首先看看 SchedulerServer 的数据结构（app/server.go），下面是其定义：</p>
<p>type SchedulerServer struct Port</p>
<p>int</p>
<p>Address</p>
<p>util.IP</p>
<p>AlgorithmProvider string PolicyConfigFile</p>
<p>string</p>
<p>EnableProfiling</p>
<p>bool</p>
<p>Master</p>
<p>string</p>
<p>Kubeconfig</p>
<p>string</p>
<p>｝</p>
<p>这里的关键属性有以下两个。</p>
<p>AlgorithmProvider： 对应参数 algorithm-provider，是 AlgorithmProviderConfig 的名称。</p>
<p>◎</p>
<p>PolicyConfigFile： 用来加载调度策略文件。</p>
<p>从代码上来看这两个参数的作用其实是一样的，都是加载一组调度规则，这组调度规则要 • 434•</p>
<h2>第 448 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>么在程序里定义为一个 AlgorithmProviderConfig，要么保存到文件中。下面的源码清楚地解释 了这个过程：</p>
<p>* SchedulerServer） createConfig（configFactory *factory.ConfigFactory） （*scheduler.Config, error） var policy schedulerapi.Policy var configData ［lbyte &#x27; err ：= os.Stat （s.PolicyConfigFile）；err == nil ｛ configData,err</p>
<p>= ioutil.ReadFile（s.PolicyConfigFile） if err！=nil｛</p>
<p>return nil，</p>
<p>fmt.Errorf（&quot;Unable to read policy config： %v&quot;，err） ｝</p>
<p>err = latestschedulerapi.Codec.DecodeInto （configData， &amp;policy） if err ！= nil ｛</p>
<p>return nil,fmt.Errorf（&quot;Invalid configuration： &amp;v&quot;，err） ｝</p>
<p>return configFactory .CreateFromConfig （policy） ｝</p>
<p>/1 if the config file isn&#x27;t provided, use the specified （or default） provider 11 check of algorithm provider is registered and fail fast _err ：= factory.GetAlgorithmProvider （s.AlgorithmProvider） if err ！= nil｛</p>
<p>return nil,err</p>
<p>｝</p>
<p>return configFactory.CreateFromProvider （s.AlgorithmProvider） ｝</p>
<p>创建了 SchedulerServer 结构体实例后，调用此实例的方法 func （s *APIServer） Run（_I］string），进 入关键流程。首先，创建一个 Rest Client 对象用于访问 Kubernetes API Server 提供的API 服务：</p>
<p>kubeClient,err ：= client.New （kubeconfig） if err ！= nil｛</p>
<p>glog.Fatalf（&quot;Invalid API configuration: eev&quot;，err） ｝</p>
<p>随后，创建一个 HTTP Server 以提供必要的性能分析（Performance Profile）和性能指标度 量（Metrics）的 Rest 服务：</p>
<p>go func（）f</p>
<p>mux ：= http.NewServeMux（） healthz.InstallHandler （mux） if s.EnableProfiling ｛ mux.HandleFunc（&quot;/debug/pprof/&quot;，pprof.Index） mux.HandleFunc （&quot;/debug/pprof/profile&quot;，pprof.Profile） •435•</p>
<h2>第 449 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 属性。</p>
<p>mux.HandleFunc（&quot;/debug/pprof/symbol&quot;，Pprof .Symbol） ｝</p>
<p>mux.Handle （&quot;/metrics&quot;，prometheus.Handler（）） server ：= &amp;http.Server｛ Addr: net.JoinHostPort （s.Address.String（），strconv.Itoa （s.Port））， Handler:mux，</p>
<p>｝</p>
<p>glog.Fatal （server.ListenAndServe （） ） ｝（）</p>
<p>接下来，启动程序构造了 ConfigFactory，这个结构体包括了创建一个 Scheduler 所需的必要 PodQueue：需要调度的 Pod 队列。</p>
<p>BindPodsRateLimiter：调度过程中限制Pod 绑定速度的限速器。</p>
<p>modeler：这是用于优化 Pod 调度过程而设计的一个特殊对象，用于“预测未来”。一 个Pod被计划调度到机器 A的事实被称为 assumed 调度，即假定调度，这些调度安排 被保存到特定队列里，此时调度过程是能看到这个预安排的，因而会影响到其他 Pod 的调度。</p>
<p>PodLister：负责拉取已经调度过的，以及被假定调度过的 Pod列表。</p>
<p>NodeLister：负责拉取 Node 节点（Minion）列表。</p>
<p>ServiceLister：负责拉取 Kubernetes 服务列表。</p>
<p>ScheduledPodLister、scheduledPodPopulator: Controller 框架创建过程中返回的 Store 对 象与 controller 对象，负责定期从 Kubernetes API Server 上拉取已经调度好的Pod 列表， 并将这些 Pod 从 modeler 的假定调度过的队列中删除。</p>
<p>在构造 ConfigFactory 的方法 factory.NewConfigFactory（kubeClient）中，我们看到下面这段代码：</p>
<p>c.ScheduledPodLister.Store, c.scheduledPodPopulator = framework.NewInformer （ c.createAssignedPodLW（）， &amp;api.Podl｝，</p>
<p>0，</p>
<p>framework.ResourceEventHandlerFuncs｛ AddFunc: func（obj interface｛｝）｛ if pod, ok ：= obj. （*api.Pod）；ok｛ c.modeler.LockedAction （func （）｛ c.modeler .ForgetPod （pod） ｝）</p>
<p>｝</p>
<p>• 436•</p>
<h2>第 450 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>DeleteFunc: func（obj interface｛｝）｛ c.modeler.LockedAction （func （）｛ switch t ：= obj. （type） case *api.Pod：</p>
<p>c.modeler.ForgetPod （t） case cache.DeletedFinalStateUnknown：</p>
<p>c.modeler.ForgetPodByKey （t.Key） ｝</p>
<p>｝）</p>
<p>｝</p>
<p>｝，</p>
<p>）</p>
<p>这里沿用了之前看到的 controller framework 的身影，上述Controller 实例所做的事情是获 取并监听已经调度的Pod列表，并将这些 Pod 列表从 modeler 中的“assumed”队列中删除。</p>
<p>接下来，启动进程用上述创建好的 ConfigFactory 对象作为参数来调用 SchdulerServer 的 createConfig 方法，创建一个 Scheduler.Config 对象，而此段代码的关键逻辑则集中在 ConfigFactory 的 CreateFromKeys这个函数里，其主要步骤如下。</p>
<p>（1）创建一个与 Pod 相关的 Reflector 对象并定期执行，该 Reflector 负责查询并监测等待调 度的Pod 列表，即还没有分配主机的 Pod （Unsigned Pod），然后把它们放入 ConfigFactory 的 PodQueue 中等待调度。相关代码为：cache.NewReflector（f.createUnassignedPodLWO， &amp;api.Pod仔｝， f.PodQueue, O）.RunUntil（f.StopEverything）。</p>
<p>（2）启动 ConfigFactory 的 scheduledPodPopulator Controller 对象，负责定期从 Kubernetes API Server 上拉取已经调度好的Pod列表，并将这些 Pod 从 modeler 中的假定（assumed）调度过的 队列中删除。相关代码为：go f.scheduledPodPopulator. Run（f.StopEverything）。</p>
<p>（3）创建一个 Node 相关的 Reflector 对象并定期执行，该 Reflector 负责查询并监测可用的 Node列表（可用意味着 Node 的 spec.unschedulable 属性 false），这些 Node 被放入 ConfigFactory 的 NodeLister.Store 里。相关代码为：cache.NewReflector（f.createMinionLWO， &amp;api.Node仔｝， f.NodeLister. Store, O）.RunUntil（f.StopEverything）。</p>
<p>（4） 创建一个 Service 相关的 Reflector 对象并定期执行，该 Reflector 负责查询并监测已 定义的 Service 列表，并放入 ConfigFactory 的 ServiceLister.Store 里。这个过的目的是 Scheduler 需要知道一个 Service 当前所创建的所有Pod，以便能正确地进行调度。相关代 码为：cache.NewReflector（f.createServiceLWO， &amp;api.Service f｝，f.ServiceLister.Store, 0）.RunUntil （f.StopEverything）。</p>
<p>（5）创建一个实现了 algorithm.ScheduleAlgorithm 接口的对象 genericScheduler，它负责完 成从Pod到 Node 的具体调度工作，调度完成的 Pod放入ConfigFactory 的 PodLister 里。相关代 • 437．</p>
<h2>第 451 页</h2>
<p>Kubernetes 权威指南：从 Docker到 Kubernetes 实践全接触（第2版） 码为 algo：= scheduler.NewGenericScheduler（predicateFuncs, priorityConfigs, f.PodLister, r）。</p>
<p>（6）最后一步，使用之前的这些信息创建 Scheduler. Config 对象并返回。</p>
<p>从上面的分析我们看出，其实在创建 Scheduler.Config 的过程中已经完成了 Kubemnetes Scheduler Server 进程中的很多启动工作，于是整个进程的启动过程的最后一步简单明了：使用 刚刚创建好的 Config 对象来构造一个 Scheduler 对象并启动运行。即下面的两行代码：</p>
<p>sched：= scheduler.New （contig） sched.Run （）</p>
<p>而 Scheduler 的 Run 方法就是不停地执行 scheduleOne 方法：</p>
<p>go util.Until （s.scheduleone,0,s.config.StopEverything） scheduleOne 方法的逻辑也比较清晰，即获取下一个待调度的Pod，然后交给genericScheduler 进行调度（完成Pod 到某个 Node 的绑定过程），调度成功以后通知 Modeler。这个过程同时增 加了限流和性能指标的逻辑。</p>
<p>6.4.2</p>
<p>关键代码分析</p>
<p>在 6.4.1 节对 kube-scheduler 进程的启动过程进行详细分析后，我们大致明白了 Kubernetes Scheduler Server 的工作流程，但由于代码中涉及多个 Pod 队列和 Pod状态切换逻辑，因此这里 有必要对这个问题进行详细分析，以弄清在整个调度过程中Pod的“来龙去脉”。首先，我们知 道 ConfigFactory里的 PodQueue 是“待调度的Pod 队列”，这个过程是通过无限循环执行一个 Reflector 来从 Kubernetes API Server 上获取待调度的Pod 列表并填充到队列中实现的，因为 Reflector 框架已经实现了通用的代码，所以到了 Kubernetes Scheduler Server 这里，通过一行代 码就能完成这个复杂的过程：</p>
<p>cache.NewReflector（f.createUnassignedPodLW（），&amp;api.Podl｝， f.PodQueue,0）.</p>
<p>RunUntil （f.StopEverything） 上述代码中的 createUnassignedPodLW 是查询和监测 spec.nodeName 为空的Pod列表，此外， 我们注意到 scheduler.Config 里提供了 NextPod 这个函数指针来从上述队列中消费一个元素，下 面是相关代码片段（来自 ConfigFactory 的 CreateFromKeys 方法中创建 scheduler.Config 的代码）：</p>
<p>NextPod: func（） *api.Pod ｛ pod ：= f.PodQueue.Pop （）. （*api.Pod） glog.V （2）.Infof （&quot;About to try and schedule pod &amp;v&quot;，pod.Name） return pod</p>
<p>然后，这个PodQueue 是怎样被消费的呢？就在之前提到的Scheduler.scheduleOne 的方法里， 每次调用 NextPod 方法会获取一个可用的Pod，然后交给 genericScheduler 进行调度，下面是相 •438•</p>
<h2>第 452 页</h2>
<h3>第6章</h3>
<p>Kubernetes 源码导读</p>
<p>关代码片段（省略了其他代码）：</p>
<p>pod：= s.config.NextPod （） if s.config.BindPodsRatelimiter ：= nil / s.confiq.BindPodsRateLimiter.Accept （） ｝</p>
<p>dest, err</p>
<p>：= s.config.Algorithm.Schedule （pod, s.config.MinionLister） genericScheduler.Schedule 方法只是给出该Pod 调度到的目标 Node，如果调度成功，则设置该 Pod 的 spec.nodeName 为目标 Node，然后通过HTTP Rest 调用写入 Kubernetes API Server 里完成 Pod 的 Binding 操作，最后通知 ConfigFactory 的 modeler（具体实例对应 scheduler.SimpleModeler），将 此Pod 放入 Assumed Pod 队列，下面是相关代码片段：</p>
<p>s.config.Modeler.LockedAction （func （）｛ bindingStart ：= time.Now （） err ：= s.config.Binder.Bind （b） metrics.BindingLatency.Observe（metrics.SinceInMicroseconds （bindingstart）） s.config.Recorder.Eventf（pod， &quot;scheduled&quot;， &quot;successfully assigned &amp;v to &amp;v&quot;，pod. Name,dest） // tell the model to assume that this binding took effect.</p>
<p>assumed：= *pod</p>
<p>assumed. Spec.NodeName = dest s.config.Modeler.AssumePod （&amp;assumed） ｝</p>
<p>当Pod 执行 Bind 操作成功以后，Kubernetes API Server 上Pod 已经满足“已调度”的条件， 因为 spec.nodeName 已经被设置为目标 Node地址，此时 ConfigFactory 的 scheduledPodPopulator 这个 Controller 就会监听到此变化，将此 Pod 从 modeler 中的 Assumed 队列中删除，下面是相 关代码片段：</p>
<p>framework.ResourceEventHandlerFuncs｛ AddFunc: func （obj interface（｝）｛ if pod,ok：= obj.（*api.Pod）；ok｛ c.modeler.LockedAction （func （）｛ c.modeler.ForgetPod （pod） ｝</p>
<p>｝</p>
<p>｝</p>
<p>谷歌的大神在源码中说明 Modeler 的存在是为了调度的优化，那么这个优化具体体现在哪 里呢？由于 Rest Watch API 存在延时，当前已经调度好的Pod 很可能还未被通知给 Scheduler， 于是大神灵光一闪：为每个刚刚调度完成的Pod发放一个“暂住证”，安排“暂住”到“Assumed” 队列里，然后设计一个获取当前“已调度”的Pod 队列的新方法，该方法合并 Assumed 队列与 • 439•</p>
<h2>第 453 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） Watch缓存队列，这样一来，就得到了最佳答案。如果你打算看看这段代码，那么它就在 SimpleModeler 的 listPods 方法里，至此，你若也完全明白了 c.PodLister = modeler.PodLister（）这 句简单却又深奥的代码，那么恭喜你，你离大神的距离又缩短了一个厘米。</p>
<p>接下来，我们深入分析Pod调度中所用到的流控技术，缘起于下面这段代码：</p>
<p>if s.config.BindPodsRateLimiter ！= nil ｛ s.config.BindPodsRateLimiter.Accept （） ｝</p>
<p>上述代码中的 BindPodsRateLimiter 采用了开源项目 juju 的一个子项目 ratelimit，项目地址 https://github.com/juju/ratelimit，它实现了一个高效的基于经典令牌桶（Token Bucket）的流 控算法。如图 6.6所示是经典令牌桶流控算法的原理示意图。</p>
<p>r tokens/sec，</p>
<p>生产者线程</p>
<p>bucket holds up to b tokens</p>
<p>packets</p>
<p>酒费者线程</p>
<p>token</p>
<p>wait</p>
<p>remove</p>
<p>token</p>
<p>do work</p>
<p>图6.6 令牌桶流控算法示意图</p>
<p>简单地说，控制线程以固定速率向一个固定容量的桶（Bucket）中投放令牌（Token），消 费者线程则等待并获取到一个令牌后才能继续接下来的任务，否则需要等待可用令牌的到来。</p>
<p>具体说来，假如用户配置的平均限流速率为r，则每隔1/秒就会有一个令牌被加入桶中，而令 牌桶最多可以存储B个令牌，如果令牌到达时令牌桶己经满了，那么这个令牌会被丢弃。从长 期运行结果来看，消费者的处理速率被限制成常量r。令牌桶流控算法除了能够限制平均处理 速度，还允许某种程度的突发速率。</p>
<p>juju 的ratelimit 模块通过下面的API 提供了构造一个令牌桶的简单做法，其中，rate 参数表 示每秒填充到桶里的令牌数量，capacity 则是桶的容量：</p>
<p>func NewBucketWithRate （rate float64,capacity int64） *Bucket</p>
<p>我们回头再看看 Kubemnetes Scheduler Server 中 BindPodsRateLimiter 的赋值代码：</p>
<p>c.BindPodsRateLimiter= util.NewTokenBucketRateLimiter（BindPodsQps, BindPodsBurst），跟踪进 去，发现它就是调用了刚才所提到的juju 函数 limiter ：= ratelimit.NewBucket WithRate（float64（qps）， int64（burst）），其中 qps 目前为常量15，而burst 为20，目前在 Kubernetes 1.0版本中还没有提供 命令行参数来配置此变量，会在未来的版木中实现。</p>
<p>• 440•</p>
<h2>第 454 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>最后，我们一起深入分析 Kubernetes Scheduer Server 中关于Pod 调度的细节。首先，我们 需要理解启动过程中 SchedulerServer 加载调度策略相关配置的这段代码：</p>
<p>predicateFuncs，</p>
<p>err ：= getFitPredicateFunctions （PredicateKeys, PluginArgs） priorityConfigs,err ：= getPriorityFunctionConfigs （priorityKeys, PluginArgs） ：= scheduler.NewGenericscheduler （predicateFuncs, PriorityConfigs, f.</p>
<p>PodLister,r）</p>
<p>这里加载了两组策略，其中 predicateFuncs 是一个 Map,key 为 FitPredicate 的名称，value 为对应的 algorithm.FitPredicate 函数，它表明一个候选的 Node 是否满足当前 Pod 的调度要求， FitPredicate 函数的具体定义如下：</p>
<p>type FitPredicate func （pod *api.Pod, existingPods ［］ *api.Pod, node string） （bool， erTOr）</p>
<p>FitPredicate 是Pod 调度过程中必须满足的规则，只有顺利通过由所有 FitPredicate 组成的这 道封锁线，一个 Node 才能拿到主会场的“入场券”，成为一个合格的“候选人”，等待下一步 “评审”。目前系统提供的具体的 FitPredicate 实现都在 predicates.go 里，系统默认加载注册 FitPredicate 的地方在 defaultPredicates 方法里。</p>
<p>当有一组 Node 通过筛查成为“候选人”之后，需要有一种办法来选择“最优”的 Node， 这就是接下来我们要介绍的 priorityConfigs 所要做的事情了。priorityConfigs 是一个数组，类型 为algorithm.PriorityConfig,PriorityConfig 包括一个 PriorityFunction 函数，用来计算并给出一组 Node 的优先级，下面是相关代码：</p>
<p>type PriorityConfig struct｛ Function PriorityFunction Weight|</p>
<p>int</p>
<p>type PriorityFunction func（pod *api.Pod, podLister PodLister, minionLister MinionLister）（HostPriorityList, error） type HostPriorityList ［］HostPriority func（h HostPriorityList）Len（） int ｛ return len （h）</p>
<p>｝</p>
<p>func （h HostPriorityList） Less （i,j int）bool ｛ if hlil.Score == hljl.Score｛ return h［il.Host &lt; hljl.Host ｝</p>
<p>return hlil.Score &lt; hljl.Score ｝</p>
<p>如果看到这里还是不太明白它的用途，那么认真读一读下面这段来自 genericScheduler 的计 算候选节点优先级的 PrioritizeNodes 方法，你就能顿悟了：一个候选节点的优先级总分是所有 评委老师（PriorityConfig）一起给出的“加权总分”，评委老师越是德高望重（PriorityConfig.Weight • 441•</p>
<h2>第 455 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 越大），他的评分影响力就越大：</p>
<p>combinedScores ：= map［stringlint｛｝ for _，priorityConfig：= range priorityConfigs ｛ weight：= priorityConfig.Weight 11 skip the priority function if the weight is specified as 0 continue</p>
<p>｝</p>
<p>priorityFunc：= priorityConfig.Function PrioritizedList,err ：= priorityFunc（pod, podlister,minionLister） if err ！= nil ｛</p>
<p>return algorithm.HostPriorityListl｝，err _、hostEntry ：= range prioritizedlist ｛ combinedScores ［hostEntry.Host］ += hostEntry.Score * weight ｝</p>
<p>for host,score ：= range combinedScores ｛ glog.V（10） .Infof （&quot;Host 8s Score &amp;d&quot;，host,score） result = append （result,algorithm.HostPriority｛Host : host, Score: score｝） ｝</p>
<p>return result,nil</p>
<p>接下来，我们看看系统初始化加载的默认的Predicate 与Priorities 有哪些，通过追踪代码，我 们发现默认加载的代码位于 plugin/pkg/scheduler/algorithmprovider/defaultdefault.go 的 init 函数里：</p>
<p>func init（）｛</p>
<p>factory.RegisterAlgorithmProvider （factory.DefaultProvider, defaultPredicates （）， defaultPriorities （）） // EqualPriority is a prioritizer function that gives an equal weight of one to all minions</p>
<p>1/ Register the priority function so that its available / but do not include it as part of the default priorities factory.RegisterPriorityFunction（&quot;EqualPriority&quot;，scheduler. BqualPriority,1） ｝</p>
<p>跟踪进去后，我们看到系统默认加载的 predicates 有如下几种：</p>
<p>◎ PodFitsResources；</p>
<p>③</p>
<p>MatchNodeSelector；</p>
<p>HostName。</p>
<p>而默认加载的 priorities 则有如下几种：</p>
<p>◎ LeastRequestedPriority；</p>
<p>◎</p>
<p>BalancedResourceAllocation：</p>
<p>•442•</p>
<h2>第 456 页</h2>
<h3>第6章</h3>
<p>Kubernetes 源码导读</p>
<p>◎</p>
<p>ServiceSpreadingPriority。</p>
<p>从上述这些信息来看，Kubernetes 默认的调度指导原则是尽量均匀分布 Node 到不同的Node 上，并且确保各个 Node 上的资源利用率基本保持一致，也就是说如果你有100台机器，则可 能每个机器都被调度到，而不是只有其中的20%被调度到，哪怕每台机器都只利用了不到10% 的资源，这不正是所谓的“韩信点兵，多多益善”么？</p>
<p>接下来我们以服务亲和性这个默认没有加载的 Predicate 为例，看看 Kubernetes 是如何通过 Policy 文件注册加载它的。下面是我们定义的一个 Policy 文件：</p>
<p>｛</p>
<p>&quot;kind&quot;：&quot;Policy&quot;，</p>
<p>&quot;version&quot; ：&quot;vl&quot;，</p>
<p>&quot;predicates&quot;</p>
<p>：［</p>
<p>｛&quot;name&quot;：&quot;RegionzoneAffinity&quot;，&quot;argument&quot;：｛&quot;serviceAffinity&quot; ：</p>
<p>｛&quot;labels&quot;：［&quot;region&quot;，&quot;zone&quot;］｝｝｝ &quot;priorities&quot;： ［</p>
<p>｛&#x27;name&quot;：&quot;RackSpread&quot;， &quot;weight&quot;：1，&quot;argument&quot; ：｛&quot;serviceAnti Affinity&quot;：｛&quot;label&quot;：&quot;rack&quot;｝｝｝ ］</p>
<p>｝</p>
<p>首先，这个文件被映射成 api.Policy 对象 （plugin/pkg/scheduler/api/types.go）。下面是其结构 体定义：</p>
<p>type Policy struct ｛ api.TypeMeta&quot;json：&quot;，inline&quot;、 11 Holds the information to configure the fit predicate functions Predicates ［］PredicatePolicy json：&quot;predicates&quot;&#x27; 1/ Holds the information to configure the priority functions Priorities ［］PriorityPolicy json：&quot;priorities&quot;、 我们看到 policy 文件中的predicates 部分被映射 PredicatePolicy 数组：</p>
<p>type PredicatePolicy struct ｛ Name string</p>
<p>json：&quot;name&quot;、</p>
<p>Argument *PredicateArgument &#x27;json：&quot;argument&quot;&#x27; ｝</p>
<p>而 PredicateArgument 的定义如下，包括服务亲和性的相关属性 ServiceA ffinity：</p>
<p>type PredicateArgument struct / ServiceAffinity *ServiceAffinity json：&quot;serviceAffinity&quot;、 LabelsPresence *LabelsPresence &quot;json：&quot;labelsPresence&quot;、 ｝</p>
<p>• 443．</p>
<h2>第 457 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 策略文件被映射为 api.Policy 对象后，PredicatePolicy 部分的处理逻辑则交给下面的函数进 行处理（plugin/pkg/scheduler/factory/plugin.go）：</p>
<p>func RegisterCustomFitPredicate（policy schedulerapi.PredicatePolicy）string ｛ var predicateFactory FitPredicateFactory ar</p>
<p>ok bool</p>
<p>validatePredicateOrDie （policy） // generate the predicate function,if a custom type is requested if policy.Argument ！= nil ｛ if policy.Argument.ServiceAffinity ！= nil ｛ predicateFactory = func （args PluginFactoryArgs） algorithm.</p>
<p>FitPredicate｛</p>
<p>return predicates.NewServiceAffinityPredicate （ args.PodLister，</p>
<p>args.Servicelister， args.NodeInfo，</p>
<p>policy.Argument.ServiceAffinity.Labels， ｝</p>
<p>｝ else if policy.Argument.LabelsPresence ！= nil ｛ predicateFactory = func （args PluginFactoryArgs） algorithm.</p>
<p>FitPredicate ｛</p>
<p>return predicates.NewNodeLabelPredicate （ args.NodeInfo，</p>
<p>policy.Argument.LabelsPresence.Labels， policy.Argument.LabelsPresence. Presence， ｝</p>
<p>在上面的代码中，当 ServiceAffinity 属性不空时，就会调用 predicates.NewServiceA ffinityPredicate 方法来创建一个处理服务亲和性的 FitPredicate，随后被加载到全局的 predicateFactory 中生效。</p>
<p>最后，genericScheduler.Schedule 方法才是真正实现Pod 调度的方法，我们看看这段完整代码：</p>
<p>func （g *genericScheduler） Schedule （pod *api.Pod, minionLister algorithm.</p>
<p>MinionLister）（string, error）｛ minions, err ：= minionLister.List （） if err！= nil｛</p>
<p>return</p>
<p>&quot;&quot;，err</p>
<p>if len （minions. Items） ==0｛</p>
<p>return &quot;&quot;，ErrNoNodesAvailable ｝</p>
<p>filteredNodes，</p>
<p>failedPredicateMap,err ：= findNodesThatFit（pod,g.pods， g.predicates, minions） if err！=nil｛</p>
<p>• 444•</p>
<h2>第 458 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>return</p>
<p>&quot;”，</p>
<p>eF以</p>
<p>｝</p>
<p>priorityList,err ：= PrioritizeNodes（pod, g.pods,g.prioritizers,algorithm.</p>
<p>FakeMinionLister （filteredNodes）） if err ！= nil</p>
<p>｛</p>
<p>return</p>
<p>&quot;&quot;，</p>
<p>err</p>
<p>if len （priorityList） return</p>
<p>&quot;&quot;，&amp;FitError｛</p>
<p>Pod：</p>
<p>==10｛</p>
<p>pod，</p>
<p>FailedPredicates: failedPredicateMap， ｝</p>
<p>｝</p>
<p>return g.selectHost （priorityList） ｝</p>
<p>这段代码已经简单得不能再简单了，因为该干的活都已经被 predicates 与 priorities 干完了！</p>
<p>架构之美，就在于程序逻辑分解得恰到好处，每个组件各司其职，从而化繁为简，使得主体流 程清晰直观，犹如行云流水，一气呵成。</p>
<p>向谷歌大神们致敬！</p>
<p>6.4.3</p>
<p>设计总结</p>
<p>与之前的 Kubernetes API Server 和 Kubernetes Controller Mangager 对比，Kubernetes Scheduler Server 的设计和代码显得更为“精妙”。项目中引入 ratelimit 组件来解决Pod 调度的流 控问题的做法，既大大简化了代码量，又体现了大神们的气度。</p>
<p>Kuberetes Scheduler Server 的一个关键设计目标是“插件化”，以方便 Cloud Provider 或者 个人用户根据自己的需求进行定制，本节我们围绕其中最为关键的“FitPredicate 与 PriorityFunction”对其设计做一个总结。如图6.7所示，在plugin.go 中采用了全局变量的 Map 变量 记录了系统当前注册的 FitPredicate 与 PriorityFunction，其中 fitPredicateMap 和 priorityFunctionMap 分别存放 FitPredicateFactory 与 PriorityConfigFactory（包含了 PriorityFunctionFactory 的一个引 用）中。可以看出，这里的设计采用了标准的工厂模式，factory.PluginFactoryArgs 这个数据结 构可以认为是一个上下文环境变量，它提供给 PluginFactory 必要的数据访问接口，比如获取一 个 Node 的详细信息并获取一个 Pod 上的所有 Service 信息等，这些接口可以被某些具体的 FitPredicate 或 PriorityFunction 使用，以实现特定的功能，如图6.7所示的 predicates.PodFitsPods 和 priorities.LeastRequestedPriority 就分别使用了上述接口。</p>
<p>• 445•</p>
<h2>第 459 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） ftPredicateMap</p>
<p>priorityFunctionMap algorithmProviderMap plugin.go （factory pkg） Refer</p>
<p>Refer</p>
<p>factory FitPredicateFactory Use</p>
<p>Create</p>
<p>factory.PluginFactoryArgs GetNodeInfo</p>
<p>algonthm.FitPredicate Realize</p>
<p>factory.PriorityConfigFactory Contains</p>
<p>Use</p>
<p>factory.PrortyFunctionFactory 4 GetPodServices</p>
<p>Create</p>
<p>PodFitsPorts</p>
<p>PodFitsHost</p>
<p>algorithm.PriorityFunction Realize</p>
<p>BalancedResourceAllocation LeastRequestedPriority 图 6.7</p>
<p>Kubernetes Scheduler Server 调度策略相关设计示意图 我们注意到 PluginFactoryArgs 的接口都是 Kubernetes 的资源访问接口，那么问题就来了， 为何不直接用 Kubernetes RestClient API 访问呢？一个主要的原因是如果这样做，则增加了插件 开发者开发和调测的难度，因为开发者需要再去学习和掌握 RestClient；另外一个原因是效率的 问题，如果大家都采用框架提供的“标准方法”查询资源，那么框架可以实现很多优化，比较容 易缓存：最后一个原因则与之前我们分析的“Assumed Pod” 有关，即查询当前已经调度过的Pod 列表是有其特性的，PluginFactoryArgs 中的PodLister 方法就是引用了 ConfigFactory 的PodLister。</p>
<p>algorithmProviderMap 这个全局变量则保存了一组命名的调度策略配置文件（Algorithm ProviderConfig），其实就是一组 FitPredicate 与 PriorityFunction 的集合，其定义如下：</p>
<p>type AlgorithmProviderConfig struct｛ FitPredicateKeys</p>
<p>util.StringSet</p>
<p>PriorityFunctionKeys util.StringSet 它的作用是预配置和自定义调度规则，Kubernetes Scheduler Server 默认加载了一个名为 “DefaultProvider”的调度策略配置，通过定义和加载不同的调度规则配置文件，我们可以改变 默认的调度策略，比如我们可以定义两组规则文件：其中一个命名为“function_test_cfg”，面向 • 446•</p>
<h2>第 460 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>功能测试，调度原则是尽量在最少的机器上调度 Pod 以节省资源；另外一个则命名为 pertormance</p>
<p>_test_cfg”，面向性能测试，调度原则是尽可能使用更多的机器，以测试系统性能。</p>
<p>顺便提一下，笔者认为在 Kubernetes Scheduler Server 中关于 PredicateArgument/Priority Argument 的设计并不好，这里没有将 Predicate 的属性通用化，比如采用key-value 这种模式， 因此导致 Policy 文件格式与 Predicate/Priority 关联之间的强耦合性，增加了代码理解的困难性， 之前分析的Policy 文件中服务亲和性的 Predicate 的加载逻辑即反映了这个问题，笔者深信，未 来版本中大神们会认真考虑重构问题。</p>
<p>至此，Master 节点上的进程的源码都已经分析完毕，我们发现这些进程所做的事情，归根 到底就是两件事：Pod 调度＋智能纠错，这也是为什么这些进程所在的节点被称力 “Master”， 因为它们高高在上，运筹帷幄。虽然“Master” 从不深入底层微服私访，但也的确鞠躬尽瘁、 日理万机，计算机的世界果然比我们人类的世界要单纯、高效很多，真心希望人工智能的发展 不会让它们的世界也变得扑朔迷离。</p>
<p>6.5</p>
<p>kubelet 进程源码分析</p>
<p>kubelet 是运行在 Minion 节点上的重要守护进程，是工作在一线的重要“工人”，它才是负 责“实例化”和“启动”一个具体的Pod 的幕后主导，并且掌管着本节点上的Pod 和容器的全 生命周期过程，定时向 Master 汇报工作情况。此外，kubelet 进程也是一个“Server” 进程，它 默认监听 10250端口，接收并执行远程（Master） 发来的指令。</p>
<p>下面我们分别对其启动过程、关键代码分析及设计总结等方面进行深入分析和讲解。</p>
<h3>6.5.1 进程启动过程</h3>
<p>kubelet 进程的入口类源码位置如下：</p>
<p>github/com/GoogleCloudPlatform/kubernetes/cmd/kubelet/kubelet.go 入口 main（函数的逻辑如下：</p>
<p>func main（）｛</p>
<p>runtime.GOMAXPROCS （runtime.NumCPU （）） S</p>
<p>：= app.NewKubeletServer （） s .AddFlags （pflag.CommandLine） util.InitFlags （）</p>
<p>util.InitLogs （）</p>
<p>defer util.FlushLogs （） • 447•</p>
<h2>第 461 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） verflag.PrintAndExitIfRequested（） if err ：= s.Run（pflag.Commandline.Args（））；err！= nil ｛ fmt.Fprintf （os.Stderr， &quot;avln&quot;， os.Exit （1）</p>
<p>｝</p>
<p>｝</p>
<p>我们已经是第4次“遇见”这样的代码风格了，代码的颜值匹配度高达99%，这至少说明 一点：谷歌在源码一致性方面做得很好，N 多人写的代码看起来就好像出自一个人之手。我们 先来看看 KubeletServer 这个结构体所包括的属性吧，这些属性可以分为以下几组。</p>
<p>1）基本配置</p>
<p>KubeConfig: kubelet 默认配置文件路径。</p>
<p>Address、 Port、 ReadOnlyPort、 CadvisorPort、 HealthzPort、 HealthzBindAddress： 为 kubelet 绑定监听的地址，包括自身 Server 的地址，Cadvisor 绑定的地址，以及自身健康检查 服务的绑定地址等。</p>
<p>RootDirectory、CertDirectory: kubelet 默认的工作目录（/var/ib/kubelet），用于存放配 置及 VM 卷等数据，CertDirectory 用于存放证书目录。</p>
<p>2）管理 Pod 和容器相关的参数</p>
<p>PodInfraContainerlmage: Pod 的 infra 容器的镜像名称，谷歌被屏蔽的时候可以换成自 己的私有仓库的镜像名。</p>
<p>CgroupRoot：可选项，创建Pod 的时候所使用的顶层的 cgroop 名字（Root Cgroup）。</p>
<p>ContainerRuntime、DockerDaemonContainer、SystemContainer：这三个参数分别表示选 择什么容器技术（Docker 或者 RKT）、Docker Daemon 容器的名字及可选的系统资源 容器名称，用来将所有非kerel 的、不在容器中的进程放入此容器中。</p>
<p>3）同步和自动运维相关的参数</p>
<p>SyncFrequency、FileCheckFrequency、HTTPCheckFrequency: Pod 容器同步周期、当前 运行的容器实例分别与 Kubernetes 注册表中的信息、本地的Pod 定义文件及以 HTTP 方式提供信息的数据源进行对比同步。</p>
<p>RegistryPullQPS、RegistryBurst： 从注册表拉取待创建的 Pod 列表时的流控参数。</p>
<p>NodeStatusUpdateFrequency: kubelet 多久汇报一次当前 Node 的状态。</p>
<p>ImageGCHighThresholdPercent、ImageGCLowThresholdPercent、LowDiskSpace ThresholdMB：</p>
<p>分别是Image 镜像占用磁盘空间的高低水位阈值及本机磁盘最小空闲容量，当可用 容量低于这个容量时，所有新Pod 的创建请求会被拒绝。</p>
<p>• 448•</p>
<h2>第 462 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>MaxContainerCount、MaxPerPodContainerCount：分别是 maximum-dead-containers 与 maximum-dead-containers-per-container，表示保留多少个死亡容器的实例在磁盘上，因 为每个实例都会占用一定的磁盘，所以需要控制，默认是 MaxContainerCount 为 100， MaxPerPodContainerCount 为2，即每个容器保留最多两个死亡实例，每个 Node 保留 最多100个死亡实例。</p>
<p>只要分析一下上述 KubeletServer 结构体的关键属性，我们就可以得到这样一个推论：</p>
<p>kubelet 进程的“工作量”还是很饱满的，一点都不比 Master 上的 API Server、Controll Manager、 Scheduer 做得少。</p>
<p>在继续下面的代码分析之前，我们先要理解这里的一个重要概念“Pod Source”，它是 kubelet 用于获取 Pod 定义和描述信息的一个“数据源”，kubelet 进程查询并监听 Pod Source 来获取属 于自己所在节点的 Pod列表，当前支持三种 Pod Source 类型。</p>
<p>Config File： 本地配置文件作为 Pod 数据源。</p>
<p>Http URL:Pod 数据源的内容通过一个 HTTP URL 方式获取。</p>
<p>Kubernetes API Server：默认方式，从 API Server 获取 Pod 数据源。</p>
<p>进程根据启动参数创建了 KubeletServer 以后，调用 KubeletServer 的run 方法，进入启动流 程，在流程的一开始首先设置了自身进程的0om_adj参数（默认为-900），这是利用了 Linux 的 0OM 机制，当系统发生0OM 时，oom_adj 的值越小，越不容易被系统Kil掉。</p>
<p>if err：= util.ApplyoomScoreAdj （0,s.0OMScoreAdj）；err ！= nil ｛ glog.Warning （err） ｝</p>
<p>为什么在之前的 Master 节点进程上都没有见到这个调用，而在 kubelet 进程上却看到这段 逻辑？答案很简单，因为 Master 节点不运行Pod 和容器，主机资源通常是稳定和宽裕的，而 Minion 节点由于需要运行大量的Pod 和容器，因此容易产生0OM 问题，所以这里要确保“守 护者”不会因此而被系统Kill掉。</p>
<p>由于 kubelet 会跟 API Server 打交道，所以接下来创建了一个 Rest Client 对象来访问 API Server。随后，启动进程构造了 cAdvisor 来监控本地的 Docker 容器，cAdvisor 具体的创建代码 则位于 pkg/kubelet/cadvisor/cadvisor_linux.go 里，引用了 github.com/g0ogle/cadvisor 这个同样属 于谷歌开源的项目。</p>
<p>接着，初始化 CloudProvider，这是因为如果 Kubernetes 运行在某个运营商的Cloud 环境中， 则很多环境和资源都需要从 CloudProvider 中获取，比如在创建Pod 的过程中可能需要知道某个 Node 的真实主机名。</p>
<p>虽然容器可以绑定宿主机的网络空间，但若不当使用会导致系统安全漏洞，所以 • 449•</p>
<h2>第 463 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） KubeletServer 中的 HostNetworkSources 的属性用来控制哪些Pod 允许绑定宿主机的网络空间， 默认是都禁止绑定。举例说明，比如设置 HostNetworkSources=api,http，则表明当一个 Pod 的定 义源来自 Kuberetes API Server 或者某个 HTTP URL 时，则允许此Pod绑定到宿主机的网络空 间。下面这行代码即上述处理逻辑中的一小部分：</p>
<p>hostNetworkSources,err：= kubelet.GetValidatedSources （strings.Split （s.HostNetworkSources， &quot;， &quot;） ） 接下来加载数字证书，如果没有提供证书和私钥，则默认创建一个自签名的X509 证书并 保存到本地。下一步，创建一个 Mounter 对象，用来实现容器的文件系统挂载功能。</p>
<p>接下来的这段代码根据指定了 DockerExecHandlerName 参数的值，确定 dockerExecHandler 是采用Docker的exec 命令还是nsenter来实现，默认采用了 Docker 的 exec这种本地方式，Docker 从1.3版本开始提供了 exec 指令，为进入容器内部提供了更好的手段。</p>
<p>var dockerExecHandler dockertools.ExecHandler switch s.DockerExecHandlerName ｛ case &quot;native&quot;：</p>
<p>dockerExecHandler = &amp;dockertools.NativeExecHandler｛｝ case &quot;nsenter&quot;：</p>
<p>dockerExecHandler = &amp;dockertools.NsenterExecHandler｛｝ default：</p>
<p>log.Warningf （&quot;Unknown Docker exec handler &amp;qi defaulting to native&quot;， S.DockerExecHandlerName） dockerExecHandler = &amp;dockertools.NativeExecHandler｛｝ 运行至此，程序构造了一个 KubeletConfig 结构体，90%的变量与之前的 KubeletServer 一样， 这让代码长度增加了 20 多行！定睛一看，源码上有 TODO 注释：“它应该可能被合并到 KubeletServer 里•••••”，目测注释是另外一个大神添加的，这让笔者陷入了深深的思考：难道谷 歌的绩效考评系统中也有恶俗的代码行数考核指标？</p>
<p>KubeletConfig 创建好以后作为参数调用 RunKubelet（&amp;kcfg, nil）方法，程序运行到这里，才 真正进入流程的核心步骤。下面这段代码表明 kubelet 会把自己的事件通知 API Server：</p>
<p>eventBroadcaster ：= record.NewBroadcaster （） kcfg.Recorder</p>
<p>= eventBroadcaster.NewRecorder （api.EventSource ｛Component ：</p>
<p>&quot;kubelet&quot;，Host : kcfg. NodeName｝） eventBroadcaster. StartLogging （glog .V （3）. Infof） if kcfg.KubeClient ！= nil ｛</p>
<p>glog.V （4）.Infof （&quot;Sending events to api server. &quot;） eventBroadcaster.StartRecordingToSink （kcfg.KubeClient.Events （&quot;&quot;） ） ｝ else｛</p>
<p>glog.Warning （&quot;No api server defined - no events will be sent to API server.</p>
<p>｝</p>
<p>•450•</p>
<h2>第 464 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>接下来，启动进程进入关键函数 createAndInitKubelet 中，这里首先创建一个 PodConfig 对 象，并根据启动参数中 Pod Source 参数是否提供，来创建相应类型的 Pod Source 对象，这些 PodSource 在各种协程中运行，拉取 Pod 信息并汇总输出到同一个 Pod Channel 中等待 kubelet 处理。创建 PodConfig 的具体代码如下：</p>
<p>func makePodSourceConfig （kc *KubeletConfig）*config.PodConfig ｛ // source of all configuration cfg ：= config.NewPodConfig （config.PodConfigNotificationSnapshotAndUpdates， kc.Recorder）</p>
<p>// define file config sourCe</p>
<p>if kc.ConfigFile！= &quot;&#x27;｛</p>
<p>glog.Infof （&quot;Adding manifest file: 8v&quot;，kc.ConfigFile） config.NewSourceFile（kc.ConfigFile, kc.NodeName,kc.FilecheckFrequency， cfg.Channel （kubelet .FileSource）） ｝</p>
<p>// define url config source if kc.ManifestURL ！= &quot;&quot; ｛ glog.Infof （&quot;Adding manifest url： &amp;v&quot;，kc.ManifestURL） config.NewSourceURL （kc.ManifestURL, kc.NodeName,kC.HTTPCheckFrequency， cfg.Channel （kubelet.HTTPSource）） ｝</p>
<p>if kc.KubeClient！= nil ｛ glog.Infof（&quot;Watching apiserver&quot;） config.NewSourceApiserver（kc.KubeClient,kc.NodeName, cfg.Channel （kubelet .ApiserverSource）） return cfg</p>
<p>｝</p>
<p>然后，创建一个 kubelet 并宣告它的诞生：</p>
<p>k,err = kubelet .NewMainKubelet （...） k.BirthCry（）</p>
<p>代码片段：</p>
<p>接着，触发 kubelet 开启垃圾回收协程以清理无用的容器和镜像，释放磁盘空间，下面是其 // Starts garbage collection threads.</p>
<p>func（kl *Kubelet） StartGarbageCollection（）｛ go util.Forever （func （） ｛</p>
<p>if err ：= kl.containerGC.GarbageCollect （）：err ！= nil ｛ glog.Errorf （&quot;Container garbage collection failed： &amp;v&quot;，err） ｝</p>
<p>｝</p>
<p>time.Minute）</p>
<p>go ut.il.Forever （func（） ｛</p>
<p>• 451•</p>
<h2>第 465 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） if err ：= kl.imageManager.GarbageCollect （）；err ！= nil ｛ glog.Errorf（&quot;Image garbage collection failed: 8v&quot;，err） ｝</p>
<p>｝，5*time.Minute）</p>
<p>｝</p>
<p>createAndInitKubelet 方法创建 kubelet 实例以后，返回到 RunKubelet 方法里，接下来调用 startKubelet 方法，此方法首先启动一个协程，让 kubelet 处理来自 PodSource 的 Pod Update 消息， 然后启动 Kubelet Server，下面是具体代码：</p>
<p>func startKubelet （k KubeletBootstrap,podCfg *config.PodConfig,kc *KubeletConfig） ｛ // start the kubelet go util.Forever（func （）｛ k.Run （podcfg.Updates （））｝，0） // start the kubelet server if kc.EnableServer ｛ go util.Forever （func （）｛ k.ListenAndServe （net.IP （kc.Address），kc.Port,kC.TLSOptions,kc.</p>
<p>EnableDebuggingHandlers） ｝，0）</p>
<p>｝</p>
<p>if kc.ReadonlyPort&gt;0｛ go util.Forever （func（）｛ k.ListenAndServeReadOnly （net.IP （kc.Address），kc.ReadOnlyPort） ｝，0）</p>
<p>｝</p>
<p>｝</p>
<p>至此，kubelet 进程启动完毕。</p>
<h3>6.5.2 关键代码分析</h3>
<h3>6.5.1 节里，我们分析了 kubelet 进程的启动流程，大致明白了 kubelet 的核心工作流程就是</h3>
<p>不断从 Pod Source 中获取与本节点相关的Pod，然后开始“加工处理”，所以，我们先来分析 Pod Source 部分的代码。前面我们提到，kubelet 可以同时支持三类 Pod Source，为了能够将不 同的 Pod Source “汇聚”到一起统一处理，谷歌特地设计了 PodConfig这个对象，其代码如下；</p>
<p>type PodConfig struct ｛ pods *podStorage</p>
<p>mUX</p>
<p>*config.Mux</p>
<p>// the channel of denormalized changes passed to listeners updates</p>
<p>chan kubelet.PodUpdate // contains the list of all configured sources • 452•</p>
<h2>第 466 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>sourceslock sync.Mutex sourCeS</p>
<p>util.StringSet</p>
<p>｝</p>
<p>其中，sources 属性包括了当前加载的所有 Pod Source 类型，sourcesLock 是 source 的排他 锁，在新增 Pod Source 的方法里使用它来避免共享冲突。</p>
<p>当 Pod 发生变动时，例如 Pod 创建、删除或者更新，相关的 Pod Source 就会产生对应的 PodUpdate 事件并推送到 Channel上。为了能够统一处理来自多个 Source 的Channel，谷歌设计 了 config.Mux 这个“聚合器”，它负责监听多路 Channel，当接收到 Channel发来的事件以后， 交给 Merger 对象进行统一处理，Merger 对象最终把多路 Channel 发来的事件合并写入 updates 这个汇聚Channel 里等待处理。</p>
<p>下面是 config.Mux 的结构体定义，其属性 sources 为一个 Channel Map，key 是对应的Pod Source 的类型：</p>
<p>type Mux struct ｛</p>
<p>// Invoked when</p>
<p>an update</p>
<p>is sent to a source.</p>
<p>merger Merger</p>
<p>// Sources</p>
<p>and their lock.</p>
<p>sourceLock</p>
<p>synC.RWMutex</p>
<p>// Maps source names to channels sources map［stringlchan interface｛｝ 我们继续深入分析 config.Mux 的工作过程，前面提到，kubelet 在启动过程中在 makePod SourceConfig 方法里创建了一个 PodConfig 对象，并且根据启动参数来决定要加载哪些类型的 Pod Source，在这个过程中调用了下述方法来创建一个对应的Channel：</p>
<p>func （c *PodConfig） Channel （source string） chan&lt;- interface｛｝｛ c.sourcesLock. Lock （） defer c.sourcesLock.Unlock （） c.sources. Insert （source） return c.mux.Channel （source） ｝</p>
<p>而 Channel 具体的创建过程则在 config.Mux 里，Channel 创建完成后被加入 config.Mux 的 sources 里并且启动一个协程开始监听消息，代码如下：</p>
<p>func（m *Mux） Channel （source string） chan interface｛｝｛ if len （source）</p>
<p>==l 0｛</p>
<p>panic（&quot;Channel given an empty name&quot;） ｝</p>
<p>m. sourceLock. Lock （） defer m.sourceLock.Unlock （） channel,exists ：= m.sources ［source］ if exists|</p>
<p>｛</p>
<p>•453•</p>
<h2>第 467 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） return channel</p>
<p>｝</p>
<p>newChannel ：= make （chan interface｛｝） m.sources ［source］ = newChannel go util.Forever （func （） ｛ m.listen （source,newChannel）｝，0） return newChannel</p>
<p>｝</p>
<p>config.Mux 的上述 listen 方法很简单，就是监听新创建的 Channel，一旦发现 Channel 上有 数据就交给 Merger 进行处理：</p>
<p>func （m *Mux） listen （source string, listenChannel &lt;-chan interface｛｝） ｛ for update ：= range listenchannel ｛ m.merger.Merge （source,update） ｝</p>
<p>｝</p>
<p>我们先来看看 Pod Source 是如何发送 PodUpdate 事件到自己所在的 Channel 上的，在6.5.1 节中我们所见到的下面这段代码创建了一个 Config File 类型的 Pod Source：</p>
<p>// define file config source if kc.ConfigFile ！= &quot;&quot; ｛ glog.Infof（&quot;Adding manifest file: 8v&quot;，kc.ConfigFile） config.NewSourceFile（kc.ConfigFile,kc.NodeName,kc.FileCheckFrequency， cfg.Channel （kubelet.FileSource）） ｝</p>
<p>在 NewSourceFile 方法里启动了一个协程，每隔指定的时间（kc.FileCheckFrequency）就执 行一次 SourceFile 的run 方法，在run 方法里所调用的主体逻辑是下面的函数：</p>
<p>func （s *sourceFile） extractFromPath（）error ｛ path</p>
<p>：= s.path</p>
<p>statInfo,err：=</p>
<p>os.Stat （path）</p>
<p>if err ！=nil ｛</p>
<p>if !os.IsNotExist （err） ｛ return err</p>
<p>// Emit an update with an empty PodList to allow FileSource to be marked as seen</p>
<p>s.updates &lt;- kubelet.PodUpdate｛［］ *api.Pod｛｝，kubelet.SET,kubelet.</p>
<p>FileSource｝</p>
<p>return fmt.Errorf（&quot;path does not exist, ignoring&quot;） ｝</p>
<p>switch｛</p>
<p>case statInfo.Mode （）.IsDir（）：</p>
<p>pods,err ：= s.extractFromDir （path） if err！=nil｛</p>
<p>return</p>
<p>• 454•</p>
<h2>第 468 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>s.updates &lt;- kubelet.PodUpdate｛pods,kubelet.SET, kubelet .FileSource｝ case statInfo.Mode （）.IsRegular（）：</p>
<p>pod,err ：= s.extractFromFile （path） if err！=</p>
<p>nil｛</p>
<p>return</p>
<p>eK工</p>
<p>｝</p>
<p>s.updates &lt;-kubelet.PodUpdate｛ ［］ *api.Pod｛pod｝， kubelet.SET, kubelet.</p>
<p>default：</p>
<p>return</p>
<p>Emt.Errorf（&quot;path is not a directory or file&quot;） FileSource｝</p>
<p>｝</p>
<p>return nil</p>
<p>｝</p>
<p>看一眼上面的代码，我们就大致明白了 Config File 类型的Pod Source 是如何工作的：它从 指定的目录中加载多个Pod 定义文件并转换为Pod 列表或者加载单个Pod定义文件并转换为单 个Pod，然后生成对应的全量类型的PodUpdate 事件并写入 Channel 中去。这里笔者也发现了代 码命名的一个疏漏之处，SourceFile 的 updates 属性其实应该被命名为 update。其他两种 Pod Source 类型的代码解析就不在这里提及了。</p>
<p>接下来我们分析 Merger 对象，PodConfig 里的 Merger 对象其实是一个 config.podStorage 实 例，它同时是 PodConfig 的 pods 属性的一个引用。podStorage 的源码位于 pkg/kubelet/config/ config.go 里，其定义如下：</p>
<p>type podStorage struct ｛ podlock sync.RWMutex // map of source name to pod name to pod reference pods map ［string］map［string］ *api.Pod mode PodConfigNotificationMode // ensures that updates are delivered in strict order // on the updates channel updatelock sync.Mutex updates</p>
<p>chan&lt;- kubelet.PodUpdate 1/ contains the set of all sources that have sent at least one SET sourcesSeenLock sync.Mutex sourcesSeen</p>
<p>util.StringSet</p>
<p>// the EventRecorder to use recorder record.EventRecorder 我们看到 podStorage 的关键属性解释如下。</p>
<p>• 455•</p>
<h2>第 469 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） （1） pods：类型是Map，存放每个 Pod Source 上拉过来的Pod 数据，是podStorage 当前保 存“全量Pod”的地方。</p>
<p>（2） updates：它就是 PodConfig 里的updates 属性的一个引用。</p>
<p>（3）mode：表明podStorage 的Pod 事件通知模式，有以下几种。</p>
<p>PodConfigNotificationSnapshot： 全量快照通知模式。</p>
<p>PodConfigNotificationSnapshotAndUpdates： 全量快照+更新Pod 通知模式（代码中创建 podStorage 实例时采用的模式）。</p>
<p>◎</p>
<p>PodConfigNotificationlncremental：增量通知模式。</p>
<p>podStorage 实现的 Merge 接口的源码如下：</p>
<p>func （s *podStorage）Merge（source string, change interface｛｝）error ｛ s.updatelock.Lock （） defer s.updatelock.Unlock （） adds,updates,deletes ：= s.merge （source, change） // deliver update notifications switch s.mode ｛</p>
<p>case PodConfigNotificationSnapshotAndUpdates ：</p>
<p>if len（updates.Pods）&gt;0｛ s.updates &lt;- *updates ｝</p>
<p>if len （deletes.Pods）&gt;o |l len（adds.Pods）&gt;0｛ s.updates&lt;- kubelet.PodUpdate｛s.MergedState （）.（［］ *api.Pod）， kubelet.</p>
<p>SET, source｝</p>
<p>｝</p>
<p>//省略无关的 Case 逻辑</p>
<p>｝</p>
<p>return nil</p>
<p>｝</p>
<p>在上述 Merge过程中，先调用内部函数 merge，将 Pod Soucre 的Channel 上发来的 PodUpdate 事件分解对应的新增、更新及删除等三类 PodUpdate 事件，然后判断是否有更新事件，如果 有，则直接写入汇总的 Channel 中 （podStorage.updates），然后调用 MergedState 函数复制一份 podStorage 的当前全量 Pod 列表，以此产生一个全量的 PodUpdate 事件并写入汇总的 Channel 中，从而实现了多 Pod Source Channel 的“汇聚”逻辑。</p>
<p>分析完 Merger 过程以后，我们接下来看看是什么对象，以及如何消费这个汇总的Channel。</p>
<p>在上一节提到，在 kubelet 进程启动的过程中调用了 startKubelet 方法，此方法首先启动一个协 程，让 kubelet 处理来自 PodSource 的 Pod Update 消息，即下面这行代码：</p>
<p>go util.Forever（func（）｛ k.Run（podCfg.Updates （））｝，0） • 456</p>
<h2>第 470 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>其中，PodConfig的 Updates0方法返回了前面我们所说的汇总 Channel 变量的一个引用，下 面是 kubelet 的 Run （updates &lt;-chan PodUpdate）方法的代码：</p>
<p>func （kl *Kubelet）Run（updates &lt;-chan PodUpdate）｛ if kl.logServer == nil ｛ kl.logServer = http.stripPrefix（&quot;/1ogs/&quot;， http.FileServer （http.Dir（&quot;/var/log/&quot;））） ｝</p>
<p>if kl.kubeclient == nil ｛ glog.Narning （&quot;No api server defined - no node status update will be sent. &quot;） ｝</p>
<p>// Move Kubelet to a container.</p>
<p>if kl.resourceContainer ！= &quot;&quot; ｛ err ：= util.RunInResourceContainer （kl.resourceContainer） if err！=nil！</p>
<p>glog.Warningf （&quot;Failed to move Kubelet to container 8g： &amp;v&quot;， kl.</p>
<p>resourceContainer, err） glog.Infof （&quot;Running in container sq&quot;，kl.resourceContainer） if err：= kl.imageManager.Start （）；err ！= nil ｛ kl.recorder.Eventf（kl.nodeRef，&quot;kubeletSetupFailed&quot;，&quot;Failed to start ImageManager sv&quot;，err） glog.Errorf（&quot;Failed to start ImageManager, images may not be garbage collected: 8v&quot;， err） if err：= kl.cadvisor.Start（）；err ！= nil ｛ kl.recorder.Eventf（kl.nodeRef，&quot;kubeletSetupFailed&quot;， &quot;Failed to start CAdvisor ev&quot;，err）</p>
<p>glog.Errorf （&quot;Failed to start CAdvisor,system may not be properly monitored：</p>
<p>&quot;，err）</p>
<p>｝</p>
<p>if err ：= kl.containerManager.Start （）；err ！= nil ｛ kl.recorder.Eventf（kl.nodeRef，&quot;kubeletSetupFailed&quot;， &quot;Failed to start ContainerManager ev&quot;，err） glog.Errorf （&quot;Failed to start ContainerManager,system may not be properly isolated： ev&quot;， err） ｝</p>
<p>if err ：= kl.oomWatcher.Start （kl.nodeRef）；err ！= nil｛ kl.recorder.Eventf（kl.nodeRef，&quot;kubeletSetupFailed&quot;，&quot;Failed to start OOM watcher sv&quot;，err） glog.Errorf（&quot;Failed to start 0OM watching： ov&quot;， erI）</p>
<p>• 457•</p>
<h2>第 471 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） go util.Until （kl.updateRuntimeUp, 5*time.Second, util.NeverStop） // Run the system oom watcher forever.</p>
<p>kl.statusManager.Start（） kl.syncLoop （updates, k1） ｝</p>
<p>上述代码首先启动了一个 HTTP File Server 来远程获取本节点的系统日志，接下来根据启 动参数的设置来决定是否在指定的 Docker 容器中启动 kubelet 进程（如果成功，则将本进程转 移到指定的容器中），然后分别启动 Image Manager（负责 Image GC）、cAdvisor （Docker 性能 监控）、Container Manager （Container GC）、0OM Watcher （0OM 监测）、Status Manager（负 责同步本节点上Pod 的状态到 API Server上）等组件，最后进入syncLoop 方法中，无限循环调 用下面的 syncLoopIteration 方法：</p>
<p>func（kl *Kubelet）syncLoopIteration （updates &lt;-chan PodUpdate,handler SyncHandler）｛</p>
<p>kl.syncLoopMonitor.Store （time.Now （））| if!kl.containerRuntimeUp （）｛ time.Sleep （5 * time.Second） glog.Infof （&quot;Skipping pod synchronization, container runtime is not up. &quot;） return</p>
<p>｝</p>
<p>if !kl.doneNetworkConfigure （）｛ time.Sleep （5 * time.Second） glog.Infof（&quot;Skipping pod synchronization,network is not configured&quot;） return</p>
<p>｝</p>
<p>unsyncedPod：= false podSyncTypes ：= make （map ［types.UID］ SyncPodType） select｛</p>
<p>case u, ok</p>
<p>：= &lt;-updates：</p>
<p>if!ok｛</p>
<p>glog.Errorf（&quot;Update channel is closed. Exiting the sync 1oop. &quot;） return</p>
<p>Kl.podManager.UpdatePods （u, podSyncTypes） unsyncedPod = true k1.syncLoopMonitor.Store （time.Now （）） case &lt;-time.After （kl.resyncInterval）：</p>
<p>glog.V（4）.Infof （&quot;Periodic sync&quot;） start ：= time .Now （） 1/ If we already caught some update, try to wait for some short time 1/ to possibly batch it with other incoming updates.</p>
<p>for unsyncedPod ｛</p>
<p>case u：= &lt;-updates：</p>
<p>• 458•</p>
<h2>第 472 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>k1.podManager.UpdatePods （u,podSyncTypes） kl.syncLoopMonitor . Store （time .Now （） ） case &lt;-time.After（5 * time.Millisecond）：</p>
<p>// Break the for 1oop.</p>
<p>unsyncedPod = false pods, mirrorPods ：= kl.podManager. GetPodsAndMirrorMap （） kl.syncLoopMonitor .Store （time .Now （） ） if err ：= handler.SyncPods （pods,podSyncTypes,mirrorPods,start）；err ！= nil｛</p>
<p>glog.Errorf （&quot;Couldn&#x27;t sync containers: oev&quot; • err）</p>
<p>k1.syncLoopMonitor.Store （time .Now （）） 在上述代码中，如果从 Channel 中拉取到了 PodUpdate 事件，则先调用 podManager 的 UpdatePods 方法来确定此 PodUpdate 的同步类型，并将结果放入 podSyncTypes 这个 Map 中， 同时为了提升处理效率，在代码中增加了持续循环拉取 PodUpdate 数据直到Channel 为空为止 （超时判断）的一段逻辑。在方法的最后，调用 SyncHandler 接口来完成 Pod 同步的具体逻辑， 从而实现了 PodUpdate 事件的高效批处理模式。</p>
<p>SyncHandler 在这里就是 kubelet 实例本身，它的SyncPods 方法比较长，其主要逻辑如下。</p>
<p>将传入的全量 Pod，与 statusManager 中当前保存的 Pod 集合进行对比，删除 statusManager 中当前已经不存在的Pod（孤儿 Pod）。</p>
<p>调用 kubelet 的admitPods 方法以过滤掉不适合本节点创建的Pod。此方法首先过滤掉 状态为 Failed 或者 Succeeded 的Pod；接着过滤掉不适合本节点的 Pod，比如 Host Port 冲笑、Node Label 的约束不匹配及 Node 的可用资源不足等情况；最后检查磁盘的使用 情况，如果磁盘的可用空间不足，则过滤掉所有Pod。</p>
<p>◎ 对上述过滤后的Pod集合中的每一个 Pod 调用 podWorkers 的UpdatePod 方法，而此方 法内部创建了一个 Pod 的workUpdate 事件并发布到该 Pod 对应的一个 Work Channel 上 （podWorkers.podWorkers）。</p>
<p>对于已经删除或不存在的Pod，通知 podWorkers 删除相关联的 Work Channel （workUpdate）。</p>
<p>对比Node当前运行中的Pod及目标Pod列表，“杀掉”多余的Pod，并且调用 Docker Runtime（Docker Deamon 进程）API，重新获取当前运行中的Pod列表信息。</p>
<p>清理“孤儿”Pod所遗留的PV和磁盘目录。</p>
<p>要真正理解Pod是怎么在 Node 上“落地”的，还要继续深入分析上述第3步的代码。首 先我们看看对 workUpdatc 这个结构体的定义：</p>
<p>•459•</p>
<h2>第 473 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） type workUpdate struct ｛ pod *api.Pod</p>
<p>1/ The mirror pod of pod; nil if it does not exist.</p>
<p>mirrorPod *api.Pod // Function to call when the update is complete.</p>
<p>updateCompleteFn func（） updateType SyncPodType ｝</p>
<p>解释：</p>
<p>其中的属性pod是当前要操作的Pod 对象，mirrorPod 则是对应的镜像Pod，下面是对它的 “对于每个来自非 API Server Pod Source上的Pod, kubelet 都在 API Server 上注册一个几 乎“一模一样”的Pod，这个Pod 被称为 mirrorPod，这样一来，就将不同的Pod Source 上的 Pod 都“统一” 到了 kubelet 的注册表上，从而统一了Pod 生命周期的管理流程。” workUpdate 的 updateCompleteFn 属性是一个回调函数，work 完成后会执行此回调函数，在 上述第3步中，此函数用来计算该 work 的调度时延指标。</p>
<p>对于每个要同步的 Pod，podWorkers 会用一个长度为 1 的 Channel 来存放其对应的 workUpdate，而属性 lastUndelivered WorkUpdate 则存放最近一个待安排执行的workUpdate，这 是因为一个 Pod 的前一个 workUpdate 正在执行的时候，可能会有一个新的 PodUpdate 事件需要 处理。理解了这个过程后，再来看 podWorkers 的定义，就不难了：</p>
<p>type podWorkers struct ｛ // Protects</p>
<p>all per worker fields.</p>
<p>podlock sync.Mutex podUpdates map［types.UID］chan workUpdate isWorking map［types.UID］bool lastUndeliveredWorkUpdate map ［types.UID］workUpdate runtimeCache kubecontainer.RuntimeCache syncPodFn syncPodFnType recorder record.EventRecorder ｝</p>
<p>下面这个函数就是第3步里产生 workUpdate 事件并放入到 podWorkers 的对应 Channel 的 方法的源码：</p>
<p>func（p *podWorkers） UpdatePod（pod *api.Pod,mirrorPod *api.Pod, updateComplete func（））｛</p>
<p>uid ：= pod.UID</p>
<p>var podUpdates chan workUpdate var exists bool</p>
<p>updateType：= SyncPodUpdate p.podLock.Lock （）</p>
<p>defer p.podlock.Unlock （） if podUpdates，</p>
<p>exists = p.podUpdates ［uid］；！exists ｛ •460•</p>
<h2>第 474 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>podUpdates = make （chan workUpdate, 1） p.podUpdates ［uid］ = podUpdates updateType = SyncPodCreate go func（）｛</p>
<p>defer util.HandleCrash （） p.managePodloop （podUpdates） ｝（）</p>
<p>if !p.isWorkingIpod.UID］｛ p.isWorking ［pod.UID］ = true</p>
<p>podUpdates &lt;- workUpdate｛ pod：</p>
<p>Pod，</p>
<p>mirrorPod：</p>
<p>mirrorPod，</p>
<p>updatecompletern:updateComplete， updateType：</p>
<p>updaterype，</p>
<p>｝</p>
<p>｝ else｛</p>
<p>P.lastUndeliveredWorkUpdatelpod.UID］ = workUpdate｛ Pod：</p>
<p>Pod，</p>
<p>mirrorPod：</p>
<p>mirrorPod，</p>
<p>updatecompleteFn:updateComplete， updaterype：</p>
<p>updateType，</p>
<p>｝</p>
<p>｝</p>
<p>上面的代码会调用 pod Workers 的 managePodL oop 方法来处理 podUpdates 队列，这里主要是 获取必要的参数，最终处理又转手交给 syncPodFn 方法去处理。下面是 managePodLoop 的源码：</p>
<p>func （P *podNorkers）managePodloop（podUpdates &lt;-chan workUpdate） f var minRuntimeCacheTime time.rime for newWork：= range podUpdates ｛ func（）｛</p>
<p>defer P.checkForUpdates （newWork.pod.UID, newWork.updateCompleteFn） if err ：= p.runtimeCache.ForceUpdatelfOlder（minRuntimeCacheTime）；err ！= nil ｛ glog.Errorf（&quot;Error updating the container runtime cache： &amp;v&quot;， err） return</p>
<p>｝</p>
<p>pods, err ：= p.runtimeCache. GetPods （） if err ！= nil｛</p>
<p>glog.Errorf（&quot;Error getting pods while syncing pod: 8v&quot;， err） return</p>
<p>err = P.syncPodEn（newWork.pod,newWork.mirrorPod， kubecontainer.Pods （pods）.FindPodByID（newWork.pod.UID），newWork.</p>
<p>updateType）</p>
<p>if err ！= nil</p>
<p>• 461•</p>
<h2>第 475 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） err）</p>
<p>glog.Errorf（&quot;Error syncing pod as,skipping: gv&quot;，newWork.pod.UID,err） P.recorder.Eventf（newWork.pod， &quot;failedSync&quot;，&quot;Error syncing pod,skipping: av&quot;， return</p>
<p>｝</p>
<p>minRuntimeCacherime = time.Now （） newWork.updateCompleteFn（） ｝（）</p>
<p>｝</p>
<p>｝</p>
<p>追踪podWorkers的构造函数调用过程，可以发现 syncPodFn函数其实就是kubelet的syncPod 方法，这个方法的代码量有点儿多，主要逻辑如下。</p>
<p>（1）根据系统配置中的权限控制，检查Pod是否有权在本节点运行，这些权限包括Pod是 否有权使用HostNetwork（还记得之前分析的代码么？由Pod Source 类型决定）、Pod 中的容器 是否被授权以特权模式启动（privileged mode）等，如果未被授权，则删除当前运行中的旧版本 的 Pod 实例并返回错误信息。</p>
<p>（2）创建Pod 相关的工作目录、PV 存放目录、Plugin 插件目录，这些目录都以Pod的UID 为上一级目录。</p>
<p>（3）如果Pod 有PV定义，则针对每个 PV 执行目录的 mount操作。</p>
<p>（4）如果是 SyncPodUpdate 类型的Pod，则从 Docker Runtime 的API 接口查询获取 Pod及 相关容器的最新状态信息。</p>
<p>（5）如果 Pod 有 imagePullSecrets 属性，则在 API Server 上获取对应的 Secret。</p>
<p>（6）调用 Container Runtime 的API接口方法 SyncPod，实现Pod“真正同步”的逻辑。</p>
<p>（7） 如果 Pod Source 不来自 API Server，则继续处理其关联的 mirrorPod。</p>
<p>c 如果 mirrorPod 跟当前 Pod 的定义不匹配，则它会被删除。</p>
<p>◎ 如果 mirrorPod 还不存在（比如新创建的Pod），则会在 API Server 上新建一个。</p>
<p>Kubernetes 中 Container Runtime 的默认实现是 Dockers，对应类是 dockertools.DockerManager， 其源码位于 kg/kubelet/dockertools/manager.go 里，在上述 kubelet.syncPod 方法中所调用的 DockerManager 的SyncPod 方法实现了下面的逻辑。</p>
<p>判断一个 Pod 实例的哪些组成部分需要重启：包括Pod 的infra 容器是否发生变化（如 网络模式、Pod 里运行的各个容器的端口是否发生变化）；Pod里运行的容器是否发生 变化；用Probe 检测容器的状态以确定容器是否异常等。</p>
<p>根据Pod实例重后结果的判断，如果需要重启 Pod 的 infra 容器，则先 Kill Pod然后启 • 462•</p>
<h2>第 476 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>动Pod 的 infra 容器，设定好网络，最后启动Pod 里的所有 Container；否则就先 Kill 那些需要重启的 Container，然后重新启动它们。注意，如果是新创建的Pod，则因力 找不到Node上对应的Pod 的infra 容器，所以会被当作重启Pod 的 infra 容器的逻辑来 实现创建过程。</p>
<p>DockerManager 创建Pod 的infra 容器的逻辑在 createPodlnfraContainer 方法里，大体逻辑如下。</p>
<p>如果 Pod 的网络不是 HostNetwork 模式，则搜集Pod 所有容器的Port 作为 infra 容器所 要暴露的Port列表。</p>
<p>◎ 如果 infra 容器的Image 目前不存在，则尝试拉取 Image。</p>
<p>◎ 创建 infra 的Container 对象并且启动 runContainerinPod 方法。</p>
<p>如果容器定义有 Lifecycle，并且 PostStart 回调方法被设置了，就会触发此方法的调用， 如果调用失败则Kill 容器并返回。</p>
<p>创建一个软连接文件指向容器的日志文件，此软连接文件名包括 Pod 的名称、容器的 名称及容器的ID，这样的目的是让 ElasticSearch 这样的搜索技术容易索引和定位Pod 日志。</p>
<p>◎</p>
<p>如果此容器是 Pod infra 容器，则设置其0OM 参数低于标准值，使得它比其他容器具 备更强的“抗灾”能力。</p>
<p>修改 Docker 生成的容器的 resolv.conf 文件，增加 ndots 参数并默认设置为5，这是因 为 Kubernetes 默认假设的域名分割长度是5，例如_dns._udp.kube-dns.default.svc。</p>
<p>上述逻辑中所调用的 runContainerInPod 是 DockerManager 的核心方法之一，不管是创建 Pod 的 infra 容器还是Pod里的其他容器，都会通过此方法使得容器被创建和运行。以下是其主要逻辑。</p>
<p>生成 Container 必要的环境变量和参数，比如 ENV 环境变量、Volume Mounts信息、 端口映射信息、DNS服务器信息、容器的日志目录、parent cgGroup 等。</p>
<p>调用 runContainer 方法完成 Docker Container 实例的创建过程，简单地说，就是完成 Docker create container 命令行所需的各种参数的构造过程，并通过程序来调用执行。</p>
<p>构造 HostConfig 对象，主要参数有目录映射、端口映射等、cgGroup 的设定等，简单 地说，就是完成了 Docker start container 命令行所需的必要参数的构造过程，并通过程 序来调用执行。</p>
<p>在上述逻辑中，runContainer 与 startContainer 的具体实现都是靠 DockerManager 中的 dockerClient 对象完成的，它实现了 DockerInterface 接口，dockerClient 的创建过程在 pkg/kubelet/ dockertools/docker.go 里，下面是这段代码：</p>
<p>func ConnectToDockerOrDie （dockerEndpoint string） DockerInterface ｛ • 463•</p>
<h2>第 477 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） if dockerEndpoint == &quot;fake:// &quot;｛ return &amp;FakeDockerClient｛ VersionInfo: docker.Env｛&quot;Apiversion=1.18&quot;｝， ｝</p>
<p>｝</p>
<p>client,err ：= docker.NewClient （get DockerEndpoint （dockerEndpoint）） if err ！=nil｛</p>
<p>glog.Fatalf（&quot;Couldn&#x27;t connect to docker： &amp;v&quot;，err） ｝</p>
<p>return client</p>
<p>｝</p>
<p>这里的 dockerEndpoint 是本节点上的Docker Deamon 进程的访问地址，默认是 unix://var/ run/docker.sock，在上述代码中使用了来自开源项目 https://github.com/fsouza/go-dockerclient 提 供的Docker Client，它也是Go 语言实现的一个用HTTP 访问 Docker Deamon 提供的标准 API 的客户端框架。</p>
<p>我们来看看 dockerClient 创建容器的具体代码（CreateContainer）：</p>
<p>func （c *Client）CreateContainer （opts CreateContainerOptions）（*Container,error） path ：= &quot;/containers/create？ &quot; + querystring （opts） body,status,err：= c.dol path，</p>
<p>dooptions｛</p>
<p>data: struct ｛</p>
<p>*Config</p>
<p>HostConfig</p>
<p>&quot;HostConfig,omitempty&quot;、 ｝｛</p>
<p>*HostConfig &#x27;json：</p>
<p>&quot;HostConfig,omitempty&quot; yaml：</p>
<p>opts.Config，</p>
<p>opts.HostConfig，</p>
<p>｝，</p>
<p>）</p>
<p>if status == http.StatusNotFound｛ return</p>
<p>nil,ErrNoSuchImage ｝</p>
<p>if err！=nil｛</p>
<p>return nil，</p>
<p>e工工</p>
<p>｝</p>
<p>var container Container err = json.Unmarshal （body， &amp;container） if err！=nil｛</p>
<p>return nil，</p>
<p>eK</p>
<p>｝</p>
<p>container .Name = opts .Name • 464</p>
<h2>第 478 页</h2>
<h3>第6章</h3>
<p>Kubernetes 源码导读</p>
<p>return &amp;container, nil ｝</p>
<p>上述代码其实就是通过调用标准的 Docker Rest API 来实现功能的，我们进入 docker.Client 的do 方法里可以看到更多详情，例如输入参数转换为JSON 格式的数据、DockerAPI 版本检查 及异常处理等逻辑，最有趣的是：在 dockerEndpoint 是 unix 套接字的情况下，会先建立套接字 连接，然后在这个连接上创建HTTP 连接。</p>
<p>至此，我们分析了 kubelet 创建和同步Pod 实例的整个流程，简单总结如下。</p>
<p>◎ 汇总：先将多个 Pod Source 上过来的PodUpdate 事件汇聚到一个总的Channel上去。</p>
<p>初审：分析并过滤掉不符合本节点的 PodUpdate 事件，对满足条件的 PodUpdate 则生 成一个 workUpdate 事件，交给 podWorkers处理。</p>
<p>接待：podWorkers 对每个 Pod 的workUpdate 事件排队，并且负责更新 Cache 中的Pod 状态，而把具体的任务转给 kubelet 去处理（syncPod 方法）。</p>
<p>终审：kubelet 对符合条件的Pod进一步审查，例如检查Pod 是否有权在本节点运行， 对符合审查的 Pod 开始着手准备工作，包括目录创建、PV 创建、Image 获取、处理 Mirror Pod 问题等，然后把“皮球” 踢给了 DockerManager。</p>
<p>落地：任务抵达 DockerManager 之后，DockerManager 尽心尽责地分析每个 Pod 的情 况，以决定这个 Pod 究竟是新建、完全重启还是部分更新的。给出分析结果以后，剩 下的就是 dockerClient 的工作了。</p>
<p>好复杂的设计！原来非业务流程的代码理解起来也会如此折磨人，真心不知道谷歌当初是怎 么设计和实现它的，目测国内P8水平的一帮大牛们天天加班到9点钟，也难以交付这样的 Code。</p>
<p>在继续下面的分析之前，留一个小小的思考给聪明的读者：Pod Source 上发来的 Pod删除 的事件，是在哪里处理的？</p>
<p>接下来我们继续分析 kubelet 进程的另外一个重要功能是如何实现的，即定期同步Pod 状态 信息到 API Server 上。先来看看 Pod 状态的数据结构定义：</p>
<p>type PodStatus struct｛ Phase</p>
<p>PodPhase</p>
<p>&#x27;json：&quot;phase,omitempty&quot;、 Conditions［］PodCondition &#x27;json：&quot;conditions,omitempty&quot;、 Message string json：&quot;message, omitempty&quot;、 Reason string&#x27;json：&quot;reason, omitempty&quot;、 HostIP string</p>
<p>&#x27;json：&quot;hostIP,omitempty&quot;、 PodIP string json：&quot;podIP,omitempty&quot;、 StartTime</p>
<p>*util.Time</p>
<p>&#x27;json：&quot;startrime,omitempty&quot;、 ContainerStatuses［］ContainerStatus // PodStatusResult is a wrapper for PodStatus returned by kubelet that can be • 465•</p>
<h2>第 479 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） encode/decoded</p>
<p>type PodStatusResult struct｛ TypeMeta</p>
<p>json：&quot;，inline&quot;、</p>
<p>ObjectMeta</p>
<p>&#x27;json：</p>
<p>&quot;metadata, omitempty&quot;、 Status PodStatus&#x27;json：&quot;status, omitempty&quot;、 Pod 的状态（Phase）有5种：运行中（PodRunning）、等待中（PodPending）、正常终止 （PodSucceeded）、异常停止（PodFailed）及未知状态（PodUnknown），最后一种状态很可能 是由于Pod所在主机的通信问题导致的。从上面的定义可以看到Pod 的状态同时包括它里面运 行的 Container 的状态，另外给出了导致当前状态的原因说明、Pod 的启动时间等信息。</p>
<p>PodStatusResult 则是 Kubernete API Server 提供的 Pod Status API 接口中用到的 Wrapper类。</p>
<p>通过之前的代码研读，我们发现在 Kuberetes 中大量使用了Chanel 和协程机制来完成数 据的高效传递和处理工作，在kubelet 中更是大量使用了这一机制，实现 Pod Status 上报的 kubelet.statusManager 也是如此，它用一个 Map （podStatuses）保存了当前 kubelet 中所有 Pod 实例的当前状态，并且声明了一个 Channel（podStatusChannel）来存放 Pod 状态同步的更新请 求 （podStatuses），Pod 在本地实例化和同步的过程中会引发Pod状态的变化，这些变化被封 装力 podStatusSyncRequest 放入 Channel 中，然后被异步上报到 API Server，这就是 statusManager 的运行机制。</p>
<p>下面是 statusManager 的 SetPodStatus 方法，先比较缓存的状态信息，如果状态发生变化， 则触发 Pod状态，生成 podStatusSyncRequest 并放到队列中等待上报：</p>
<p>func （s *statusManager） SetPodStatus （pod *api.Pod, status api.PodStatus）｛ podFul1Name ：= kubecontainer. GetPodFul1Name （pod） s.podStatusesLock.Lock （） defer s.podStatusesLock.Unlock （） oldStatus, found ：= s.podStatuses ［podFu11Name］ // ensure that the start time does not change across updates.</p>
<p>if found &amp;&amp; oldStatus.StartTime ！= nil ｛ status.StartTime = oldStatus.Startrime status.StartTime.IsZero（）｛ if pod.Status.StartTime. IsZero （）｛ // the pod did not have a previously recorded value so set to now now ：= util.Now （） status.StartTime = &amp;now ｝ else｛</p>
<p>status.StartTime = pod.Status.StartTime if!found II !isStatusEqual（&amp;oldStatus， &amp;status）｛ s.podStatuses ［podFul1Name］ = status • 466•</p>
<h2>第 480 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>s.podStatusChannel &lt;- podStatusSyncRequest ｛pod, status） glog.V（3）.Infof （&quot;Ignoring same status for pod &amp;q, status: eetv&quot;，kubeletUtil.</p>
<p>FormatPodName （pod）， ｝</p>
<p>下面是在Pod 实例化的过程中，kubelet过滤掉不合适本节点Pod所调用的上述方法的代码， 类似的调用还有不少：</p>
<p>func（kl *Kubelet）handleNotFittingPods（pods ［l*api.Pod） ［］*api.Pod ｛ fitting,notFitting ：= checkHost PortConflicts （pods） _、pod：= range notFitting｛ reason：= &quot;HostPortConflict&quot; kl.recorder.Eventf（pod,reason，&quot;Cannot start the pod due to host port conflict. &quot;）</p>
<p>kl.statusManager.SetPodStatus （pod, api.PodStatus｛ Phase: api.PodFailed， Reason: reason，</p>
<p>Message：&quot;Pod cannot be started due to host port conflict&quot;｝） ｝</p>
<p>fitting, notFitting = kl.checkNodeSelectorMatching （fitting） ：= range notFitting｛ reason：= &quot;NodeSelectorMismatching&quot; kl.recorder.Eventf （pod, reason，&quot;Cannot start the pod due to node selector mismatch. &quot;）</p>
<p>kl.statusManager.SetPodStatus （pod, api.PodStatus｛ Phase: api.PodFailed， Reason: reason，</p>
<p>Message：</p>
<p>&quot;&#x27;Pod cannot be started due to node selector mismatch&quot;｝） ｝</p>
<p>fitting, notFitting = kl.checkCapacityExceeded （fitting） for_pod：= range notFitting｛ reason ：= &quot;CapacityExceeded&quot; kl.recorder.Eventf（pod,reason，&quot;Cannot start the pod due to exceeded capacity.</p>
<p>K1.statusManager.SetPodStatus （pod, api.PodStatus｛ Phase: api.PodFailed， Reason：</p>
<p>reason，</p>
<p>Message：&quot;Pod cannot be started due to exceeded capacity&quot; ｝） ｝</p>
<p>return fitting</p>
<p>｝</p>
<p>最后，我们看看 statusManager 是怎么把 Channel 的数据上报到 API Server 上的，这是通过 Start 方法开启一个协程无限循环执行 syncBatch 方法来实现的，下面是 syncBatch 的代码：</p>
<p>func （s *statusManager）syncBatch（）error ｛ • 467•</p>
<h2>第 481 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） syncRequest：= &lt;-s.podStatusChannel pod ：= syncRequest.pod podFul1Name ：= kubecontainer.GetPodFul1Name （pod） status：= syncRequest.status var err errOr</p>
<p>statusPod：= &amp;api.Pod｛ ObjectMeta: pod. ObjectMeta， statusPod, err = s.kubeClient.Pods （statusPod. Namespace）. Get （statusPod.Name） statusPod.Status = status s.kubeClient.Pods （pod. Namespace）.Updatestatus （statusPod） 7i FODo: nanale conflict as A retzy,make that es iet to0.</p>
<p>if err == nil｛</p>
<p>glog.V （3）.Infof （&quot;Status for pod eq updated successfully&quot;，kubeletUtil.</p>
<p>Format PodName （pod） ） go s.DeletePodStatus （podFul1Name） Emt.Errorf （&quot;error updating status for pod eq: gv&quot;， kubeletUtil.FormatPodName （pod），err） 这段代码首先从 Channel 中拉取一个 syncRequest，然后调用 API Server 接口来获取最新的 Pod 信息，如果成功，则继续调用 API Server 的 UpdateStatus 接口更新 Pod 状态，如果调用失 败则删除缓存的Pod 状态，这将触发kubelet 重新计算Pod 状态并再次尝试更新。</p>
<p>说完了 Pod流程，我们接下来再一起深入分析 Kubernetes 中的容器探针（Probe）的实现机 制。我们知道，容器正常不代表里面运行的业务进程能正常工作，比如程序还没初始化好，或 者配置文件错误导致无法正常服务，还有诸如数据库连接爆满导致服务异常等各种意外情况都 有可能发生，面对这类问题，cAdvisor 就束手无策了，所以 kubelet 引入了容器探针技术，容器 探针按照作用划分为以下两种。</p>
<p>ReadinessProbe：用来探测容器中的用户服务进程是否处于“可服务状态”，此探针不 会导致容器被停止或重启，而是导致此容器上的服务被标识为不可用，Kubernetes 不 会发送请求到不可用的容器上，直到它们可用为止。</p>
<p>LivenessProbe：用来探测容器服务是否处于“存活状态”，如果服务当前被检测为 Dead， 则会导致容器重启事件发生。</p>
<p>下面是探针相关的结构定义：</p>
<p>type Probe struct｛ • 468</p>
<h2>第 482 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>Handler</p>
<p>InitialDelaySeconds int64 TimeoutSeconds</p>
<p>int64</p>
<p>｝</p>
<p>type Handler struct ｛ 1/ One and only one of the following should be specified.</p>
<p>Exec *ExecAction</p>
<p>HTTPGet *HTTPGetAction TCPSocket *TCPSocketAction ｝</p>
<p>从上面的定义来看，探针可以通过执行容器中的一个命令、发起一个指向容器内部的HTTP Get 请求或者 TCP 连接来确定容器内部是否正常工作。</p>
<p>上面的代码属于 API 包中的一部分，只是用来描述和存储容器上的探针定义，而真正的探 针实现代码则位于 pkg/kubelet/prober/prober.go 里，下面是对 prober.Probe 的定义：</p>
<p>type Prober interface ｛ Probe （pod *api.Pod,status api.PodStatus, container api.Container,containerID string, createdAt int64）（probe.Result, error） 上述接口方法表示对一个 Container 发起探测并返回其结果。prober.Probe 的实现类为 prober.prober，其结构定义如下：</p>
<p>type prober struct ｛ exec</p>
<p>execprobe.ExecProber http</p>
<p>httprobe.HTTPProber tCP</p>
<p>tcprobe. TCPProber runner kubecontainer.ContainerCommandRunner readinessManager *kubecontainer.ReadinessManager refManager</p>
<p>*kubecontainer.RefManager recorder</p>
<p>record.EventRecorder ｝</p>
<p>其中 exec、http、tcp 三个变量分别对应三种探测类型的“探头”，它们已经各自实现了相 应的逻辑。比如下面这段代码是 HTTP 探头的核心逻辑，即连接一个 URL 发起 GET 请求：</p>
<p>func DoHTTPProbe （url *url.URL, Client HTTPGetInterface）（probe.Result,string， ErHOr）｛</p>
<p>if</p>
<p>res, err ：= client.Get （url.String （）） err！=nil｛</p>
<p>// Convert errors into failures to catch timeouts.</p>
<p>return probe.Failure,err.Error（），nil ｝</p>
<p>defer res.Body.Close （） b,err ：= ioutil.ReadA11 （res .Body） if err！= nil｛</p>
<p>return probe.Failure，&quot;&quot;，err • 469•</p>
<h2>第 483 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） ｝</p>
<p>body ：= string （b） if res.StatusCode &gt;= http. StatusOK &amp;&amp; res.StatusCode &lt;http.statusBadRequest ｛ glog.V（4）.Infof （&quot;Probe succeeded for gs， Response：&amp;v&quot;，url.String（）， *res）</p>
<p>return probe.Success,body, nil ｝</p>
<p>glog.V（4）.Infof （&quot;Probe failed for s,Response： %v&quot;，url.String（），*res） return probe.Failure,body,nil prober.prober 中的 runner 则是 exec 探头的执行器，因为后者需要在被检测的容器中执行一 个 cmd 命令：</p>
<p>func（p *prober）newExecInContainer（pod *api.Pod, container api.Container， containerID string, cmd ［］string） exeC.Cmd｛</p>
<p>return execInContainer｛func（）（［］byte, error）｛ return p.runner.RunInContainer （containerID, cmd） ｝｝</p>
<p>｝</p>
<p>实际上 p.runner 就是之前我们分析过的 DockerManager，下面是 RunlnContainer 的源码：</p>
<p>func （dm *DockerManager）RunInContainer （containerID string,cmd ［］string） （［］byte,error）</p>
<p>// If native exec support does not exist in the local docker daemon use nsinit.</p>
<p>useNativeExec, err ：= dm.nativeExecSupportExists （） if err！=nil｛</p>
<p>return nil, err</p>
<p>｝</p>
<p>if !useNativeExec ｛ es&quot;，cmd, containerID） glog.V（2）.Infof （&quot;Using nsinit to run the command etv inside container return dm.runInContainerUsingNsinit （containerID,cmd） ｝</p>
<p>glog.V（2）.Infof（&quot;Using docker native exec to run cnd etv inside container cmd, containerID）</p>
<p>createOpts ：= docker.CreateExecOptions｛ Container：</p>
<p>containerID，</p>
<p>Cmd：</p>
<p>Attachstdin：</p>
<p>false，</p>
<p>AttachStdout: true， Attachstderr: true， Tty：</p>
<p>False，</p>
<p>｝</p>
<p>execObj,err ：= dm.client.CreateExec （createOpts） if err！=nil</p>
<p>return nil,Emt.Errorf（&quot;failed to run in container - Exec setup failed • 470•</p>
<h2>第 484 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>-av&quot;，</p>
<p>eI工）</p>
<p>var buf bytes.Buffer startOpts</p>
<p>：= docker.StartExecOptions｛ ID,err2）</p>
<p>ID, inspect）</p>
<p>OutputStream： &amp;buf， ErrorStream： &amp;buf， RawTerminal：</p>
<p>｝</p>
<p>err = dm.client.StartExec （execObj.ID, startOpts） if err ！=nil｛</p>
<p>glog.V（2）.Infof （&quot;StartExec With error: 8v&quot; return nil,err</p>
<p>｝</p>
<p>ticker ：= time.NewTicker（2 * time.Second） defer</p>
<p>ticker.Stop（）</p>
<p>for｛</p>
<p>inspect,err2 ：= dm.client.InspectExec （execObj.ID） if err2！= nil｛</p>
<p>glog.v（2）.Infof（&quot;InspectExec es failed with error: 8tv&quot;，execobj.</p>
<p>return buf.Bytes（），err2 ｝</p>
<p>if!inspect.Running｛ if inspect.ExitCode！= 0｛ glog.V （2）.Infof（&quot;InspectExec es exit with result aetv&quot;，execobj.</p>
<p>err = &amp;dockerExitError｛inspect｝ ｝</p>
<p>break</p>
<p>｝</p>
<p>&lt;-ticker.C</p>
<p>｝</p>
<p>return buf.Bytes （），err ｝</p>
<p>Docker 自1.3版本开始支持使用 Exec 指令（以及API调用）在容器内执行一个命令，我们 看看上述过程中使用的dm.client.CreateExec 方法是如何实现的：</p>
<p>func （c *Client） CreateExec （opts CreateExecOptions） ：= fmt.Sprintf（&quot;/containers/%s/exec&quot;， opts.Container） body, status,err ：= c.do（&quot;POST&quot;，path, doOptions｛data: opts｝） if status == http.StatusNotFound｛ nil，&amp;NoSuchContainer｛ID: opts.Container｝ ｝</p>
<p>• 471•</p>
<h2>第 485 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） if err ！= nil｛</p>
<p>return nil,err</p>
<p>｝</p>
<p>var exec Exec</p>
<p>err = json.Unmarshal （body， &amp;exec） if err ！= nil ｛</p>
<p>return nil,err</p>
<p>｝</p>
<p>return &amp;exec,nil</p>
<p>｝</p>
<p>我们看到，这是标准的 Docker API 的调用方式，跟之前看到的创建容器的调用代码很相似。</p>
<p>现在我们再回头看看 prober;prober 是怎么执行 ReadinessProbe/ LivenessProbe 的检测逻辑的：</p>
<p>func（pb *prober） Probe（pod *api.Pod, status api.PodStatus, container api.</p>
<p>Container, containerID string,createdAt int64）（probe.Result,error）｛ pb.probeReadiness （pod, status, container, containerID, createdAt） return pb.probeliveness （pod, status, container, containerID, createdAt） 这段代码先调用容器的 ReadinessProbe 进行检测，并且在 readinessManager 组件中记录容 器的 Readiness 状态，随后调用容器的 LivenessProbe 进行检测，并返回容器的状态，在检测过 程中如果发现状态为失败或者异常状态，则会连续检测3次：</p>
<p>func（pb *prober）runProbeWithRetries （p *api.Probe,pod *api.Pod, status api.</p>
<p>PodStatus,container api.Container,containerID string,retries int）（probe.Result， string,error）｛</p>
<p>var result probe.Result var output string</p>
<p>for i：=0;i&lt; retries; i++｛ result,output,err = pb.runProbe （p,pod, status, container, containerID） if result == probe.Success ｛ return probe.Success, output,nil ｝</p>
<p>｝</p>
<p>return result，</p>
<p>output, err</p>
<p>｝</p>
<p>比较意外的是 proberprober 探针检测容器状态的方法目前只在一处被调用到，位于方法 Docker Manager.computePodContainerChanges 里：</p>
<p>result,err</p>
<p>：= dm.prober.Probe （pod,podStatus, container, string （c.ID），c.</p>
<p>Created）</p>
<p>err ！= nil｛</p>
<p>// TODO （vmarmol）： examine this logic.</p>
<p>glog.V （2）.Infof （&quot;probe no-error: 8q&quot;， container. Name） containersToKeep ［containerID］ = index • 472．</p>
<h2>第 486 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>continue</p>
<p>｝</p>
<p>if result ==|</p>
<p>probe. Success｛</p>
<p>glog.V （4） .Infof （&quot;probe success: eg&quot;， container. Name） containersToKeep ［containerID］ = index continue</p>
<p>｝</p>
<p>glog.Infof（&quot;pod 8q container 8q is unhealthy （probe result: 8v），it will be killed and re-created. &quot;，podFullName,container.Name,result） containersToStart ［index］= emptyl｝ ｝</p>
<p>只有没有发生任何变化的Pod 才会执行一次探针检测，若检测状态为失败，则会导致重启 事件发生。</p>
<p>本节最后，我们再来简单分析下 kubelet 中的 Kubelet Server 的实现机制，下面是 kubelet 进程启动过程中启动 Kubelet Server 的源码入口：</p>
<p>// start the kubelet server if kc.EnableServer ｛ go util.Forever （func（）｛ k.ListenAndServe （net.IP （kc.Address），kc.Port,KC.TL.SOptions,kc.</p>
<p>EnableDebuggingHandlers） ｝，0）</p>
<p>｝</p>
<p>在上述代码调用的过程中，创建了一个类型为kubelet. Server 的 HTTP Server 并在本地监听：</p>
<p>handler ：= NewServer （host,enableDebuggingHandlers） s：= &amp;http.Server｛</p>
<p>net.JoinHostPort（address.String（），strconv.FormatUint （uint64 （port），10））、 &amp;handler，</p>
<p>ReadTimeout：</p>
<p>5 * time.Minute，</p>
<p>WriteTimeout：</p>
<p>5* time.Minute，</p>
<p>MaxHeaderBytes: 1 &lt;&lt; 20， if tlsOptions ！= nil｛ s.TLSConfig = tlsOptions.Config glog.Fatal （s.ListenAndServeTLS （tlsOptions.CertFile, tlsOptions. KeyFile）） glog.Fatal （s.ListenAndServe （）） ｝</p>
<p>在 kubelet.Server 的构造函数里加载如下 HTTP Handler：</p>
<p>func（s *Server）</p>
<p>InstallDefaultHandlers（）｛ healthz.InstallHandler （s.mux， healthz.PingHealthz， • 473•</p>
<h2>第 487 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） healthz.NamedCheck （&quot;docker&quot;， s.dockerHealthCheck）， healthz.NamedCheck（&quot;hostname&quot;，s.hostnameHealthCheck）， healthz.NamedCheck （&quot;syncloop&quot;，s.syncLoopHealthCheck）， s.mux.HandleFunc（&quot;/pods&quot;，s.handlePods） s.mux.HandleFunc（&quot;/stats/&quot;， s.handlestats） s.mux.HandleFunc （&quot;/spec/&quot;， s.handleSpec） 上述 Handler 分为两组：首先是健康检查，包括 kubelet 进程自身的心跳检查、Docker 进程 的健康检查、kubelet 所在主机名检测、Pod 同步的健康检查等；然后是获取当前节点上运行期 信息的接口，例如获取当前节点上的Pod 列表、统计信息等。下面是 hostnameHealthCheck 的实 现逻辑，它检查 Pod两次同步之间的时延，而这个时延则在之前提到的kubelet 的 syncLooplteration 方法中进行更新：</p>
<p>func（s *Server）</p>
<p>syncLoopHealthCheck（req *http.Request）error ｛ duration ：= s.host.ResyncInterval（）* 2 minDuration</p>
<p>：= time.Minute * 5 if duration &lt; minDuration ｛ duration = minDuration ｝</p>
<p>enterLoopTime ：= s.host.LatestLoopEntryTime （） if !enterLoopTime.IsZero（）&amp;&amp; time.Now（）.After（enterLoopTime.Add （duration））｛ return fmt.Errorf （&quot;Sync Loop took longer than expected. &quot;） return nil</p>
<p>handlePods 的API 则从kabelet 中获取当前“绑定”到本节点的所有 Pod 的信息并返回：</p>
<p>func （s *Server）handlePods（w http.ResponseWriter,req *http.Request）｛ pods ：= s.host.GetPods （） data, err ：= encodePods （pods） if err！= nil｛</p>
<p>s.error（w,err）</p>
<p>return</p>
<p>｝</p>
<p>w.Header（）.Add（&quot;Content-type&quot;，&quot;application/json&quot;） w.Write （data）</p>
<p>如果 kubelet 运行在Debug 模式，则加载更多的 HTTP Handler：</p>
<p>func（s *Server）</p>
<p>InstallDebuggingHandlers（）｛ s.mux.HandleFunc （&quot;/run/&quot;， s.handleRun） s.mux.HandleFunc （&quot;/exec/&quot;， s.handleExec） s.mux.HandleFunc（&quot;/portForward/&quot;， s.handlePortForward） • 474</p>
<h2>第 488 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>s.mux.HandleFunc （&quot;/logs/&quot;，s.handlelogs） s.mux.HandleFunc（&quot;/containerLogs/&quot;， s.handleContainerLogs） s.mux.Handle（&quot;/metrics&quot;， prometheus.Handler （） ） // The /runningpods endpoint is used for testing only.</p>
<p>s.mux.HandleFunc （&quot;/runningpods&quot;，s.handleRunningPods） s.mux.HandleFunc （&quot;/debug/pprof/&quot;，pprof.Index） s.mux.HandleFunc（&quot;/debug/pprof/profile&quot;， Pprof.Profile） s.mux.HandleFunc（&quot;/debug/pprof/symbol&quot;，Pprof.Symbol） ｝</p>
<p>这些 HTTP Handler 的实现并不复杂，所以在这里就不再一一介绍了。</p>
<h3>6.5.3 设计总结</h3>
<p>在研读 kubelet 源码的过程中，你经常会有“山穷水尽疑无路，柳暗花明又一村”的感觉， 是因为在它的设计中大量运用了 Channel 这种异步消息机制，加之为了测试的方便，又将很多 重要的处理函数做成接口类，只有找到并分析这些接口的具体实现类，才能明白整个流程。这 对于习惯了面向对象语言的程序员而言，有一种一夜回到解放前的感觉。</p>
<p>因为kubelet 的功能比较多，所以我们在此仅以Pod 同步的主流程为例，进行一个设计总结， 图 6.8 是kubelet 主流程相关的设计示意图，为了更加清晰地展示整个流程，我们特意将 kubelet Kernel、Docker System 与其他部分分离开来，并且省略了部分非核心对象和数据结构。</p>
<p>首先，config.PodConfig 创建一个或多个 Pod Source，在默认情况下创建的是 API source，它 并没有创建新的数据结构，而是使用之前介绍的 cache.Reflector 结合 cache.UndeltaStore，从 Kubernetes API Server 上拉取 Pod 数据放入内部的 Channel上，而内部的 Channel 收到Pod 数据后 会调用 podStorage 的Merge 方法实现多个 Channel 数据的合并，产生 kubelet.PodUpdate 消息并写 入 PodConfig 的汇总 Channel 上，随后 PodUpdate 消息进入 kubelet Kernel 中进行下一步处理。</p>
<p>kubelet.kubelet 的 syncLoop 方法监听 PodConfig 的汇总 Channel，过滤掉不合适的 PodUpdate 并把符合条件的放入 SyncPods 方法中，最终为每个符合条件的Pod 产生一个 kubelet.workUpdate 事 件并放入podWorkers 的内部工作队列上，随后调用 podWorkers 的 managePodLoop 方法进行处理。</p>
<p>podWorkers 在处理流程中调用了 DockerManager 的SyncPod 方法，由此 DockerManager 接班，在进 行了必要的 Pod 周边操作后，对于需要重启或者更新的容器，DockerManager 则交给 docker.Client 对象去执行具体的动作，后者通过调用 Dockers Engine 的 API Service 来实现具体功能。</p>
<p>在Pod 同步的过程中会产生Pod 状态的变更和同步问题，这些是交由 kubelet.statusManager 实现的，它在内部也采用了Channel 的设计方式。</p>
<p>• 475</p>
<h2>第 489 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） Pod Sources</p>
<p>config.PodConfig</p>
<p>Create</p>
<p>Create</p>
<p>Call</p>
<p>configpodStorage</p>
<p>Merge and Push</p>
<p>HsyncLoop</p>
<p>kubelet.Kubelet</p>
<p>HSyncPods</p>
<p>config. sourceFile cache.Retlector</p>
<p>cache. UndeltaStore &lt;config/apiserver.go&gt; config.sourceURL</p>
<p>kubelet. statusManager SetPodStatus</p>
<p>Kuberletes APl.Server Rest API</p>
<p>syncBatch</p>
<p>managePodloop</p>
<p>kubelet.pod Workers SyncPod</p>
<p>dockertools. DockerManager RestAPI</p>
<p>Docker System</p>
<p>Kubelet Kernel</p>
<p>Docker Engine</p>
<p>docker.Client</p>
<p>图 6.8</p>
<p>kubelet 主流程相关的设计示意图</p>
<h3>6.6 kube-proxy 进程源码分析</h3>
<p>kube-proxy 是运行在Minion 节点上的另外一个重要的守护进程，你可以把它当作一个 HAProxy，它充当了 Kubernetes 中 Service 的负载均衡器和服务代理的角色。下面我们分别对其 启动过程、关键代码分析及设计总结等方面进行深入分析和讲解。</p>
<h3>6.6.1 进程启动过程</h3>
<p>kube-proxy 进程的入口类源码位置如下：</p>
<p>github/com/GoogleCloudPlatform/kubernetes/cmd/kube-proxy/proxY.go •476•</p>
<h2>第 490 页</h2>
<h3>第6章</h3>
<p>Kubernetes 源码导读</p>
<p>入口 main（函数的逻辑如下：</p>
<p>func main（）｛</p>
<p>runtime.GOMAXPROCS （runtime.NumCPU （）） s ：= app.NewProxyServer （） s.AddFlags （pflag.CommandLine） util.InitFlags （）</p>
<p>util.InitLogs （）</p>
<p>defer util.FlushLogs （） verflag.PrintAndExitIfRequested （） if err ：= s.Run（pflag.CommandLine.Args（））；erz ！= nil ｛ Emt.Fprintf（os.Stderr， &quot;8v\n&quot;， err）</p>
<p>os.Exit （1）</p>
<p>｝</p>
<p>｝</p>
<p>上述代码构造了一个 ProxyServer，然后调用它的 Run 方法启动运行。首先我们看看 NewProxyServer 的代码：</p>
<p>func NewProxyServer（） *ProxyServer｛ return &amp;ProxyServer｛ BindAddress：</p>
<p>util.IP （net.ParseIP（&quot;0.0.0.0&quot;））， HealthzPort：</p>
<p>HealthzBindAddress: util.IP（net.ParseIP（&quot;127.0.0.1&quot;））、 OOMScoreAdj：</p>
<p>ResourceContainer：</p>
<p>&quot;/kube-proxy&quot;，</p>
<p>｝</p>
<p>｝</p>
<p>在上述代码中，ProxyServer 绑定本地所有IP （0.0.0.0）对外提供代理服务，而提供健康检 查的 HTTP Server 则默认绑定本地的回环IP，说明后者仅用于在本节点上访问，如果需要开发 管理系统进行远程管理，则可以设置参数 healthz-bind-address 为 0.0.0.0来达到目的。另外，从 代码中看，ProxyServer 还有一个重要属性可以调整：PortRange（对应命令行参数为 proxy- port-range），它用来限定 ProxyServer 使用哪些本地端口作为代理端口，默认是随机选择。</p>
<p>ProxyServer 的Run 方法流程如下。</p>
<p>改置本进程的OOM 参数 OOMScoreAdj，保证系统OOM 时，kube-proxy 不会首先被 系统删除，这是因为 kube-proxy 与kubelet 进程一样，比节点上的Pod 进程更重要。</p>
<p>让自己的进程运行在指定的 Linux Container 中，这个 Container 的名字来自 ProxyServer.ResourceContainer，如上所述，默认为/kube-proxy，比较重要的一点是这 个 Container 具备所有设备的访问权。</p>
<p>• 477•</p>
<h2>第 491 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 创建 ServiceConfig与 EndpointsConfig，它们与之前kubelet 中的PodConfig的作用和实 现机制有点像，分别负责监听和拉取 API Server 上 Service 与 Service Endpoints 的信息， 并通知给注册到它们上的 Listener 接口进行处理。</p>
<p>创建一个 round-robin 轮询机制的 load balancer （LoadBalancerRR），它用来实现 Service 的负载均衡转发逻辑，它也是前面创建的 EndpointsConfig 的一个 Listener。</p>
<p>◎</p>
<p>创建一个 Proxier，它负责建立和维护 Service 的本地代理 Socket，它也是前面创建的 ServiceConfig 的一个 Listener。</p>
<p>创建一个 config.SourceAPI，并启动两个协程，通过 Kubernetes Client 来拉取 Kubernetes API Server 上的 Service 与 Endpoint 数据，然后分别写入之前定义的 ServiceConfig 与 EndpointsConfig 的Channel 上，从而触发整个流程的驱动。</p>
<p>^》</p>
<p>本地绑定健康检查的HTTP Server 提供服务。</p>
<p>进入 Proxier 的 SyncLoop 方法里，该方法周期性地检查 Iptables 是否设置正常、服务 的Portal是否正常开启，以及清除load balancer 上的过期会话。</p>
<p>从启动流程看，kube-proxy 进程的参数比较少，它所做的事情也是比较单一的，没有kubelet 进程那么复杂，在下一节我们会深入分析其关键代码。</p>
<h3>6.6.2 关键代码分析</h3>
<p>从上一节 kube-proxy 的启动流程来看，它跟 kubelet 有相似的地方，即都会从 Kubernetes API Server 拉取相关的资源数据并在本地节点上完成“深加工”，其拉取资源的做法，第一眼看上 去与kubelet 相似，但实际上有稍微不同的实现思路，这说明作者另有其人。</p>
<p>由于 ServiceConfig与 EndpointsConfig实现机制是完全一样的，只不过拉取的资源不同，所 以我们这里仅对前者做深入分析。首先从 ServiceConfig 结构体开始：</p>
<p>type ServiceConfig struct ｛ muX</p>
<p>*config.Mux</p>
<p>bcaster *config.Broadcaster store</p>
<p>*serviceStore</p>
<p>｝</p>
<p>ServiceConfig 也使用了 mux（config.Mux），它是一个多 Channel 的多路合并器，之前 kubelet 的PodConfig 也用到了它。下面是 ServiceConfig 的构造函数：</p>
<p>func NewServiceConfig（）*ServiceConfig ｛ updates</p>
<p>：= make （chan struct｛｝） store ：= &amp;servicestorelupdates: updates,services：</p>
<p>make （map ［string］map ［types.NamespacedName］ api.Service）｝ •478．</p>
<h2>第 492 页</h2>
<h3>第6章</h3>
<p>Kubernetes 源码导读</p>
<p>mux ：= config.NewMux （store） bcaster ：= config.NewBroadcaster （） go watchForUpdates （bcaster, store, updates） return &amp;ServiceConfig｛mux,bcaster, store｝ 从上述代码来看，store 是 serviceStore 的一个实例。它作为 config.Mux 的Merge 接口的实 现，负责处理 config.Mux 的 Channel 上收到的 ServiceUpdate 消息并更新 store 的内部变量 services，后者是一个 Map，存放了最新同步到本地的 api. Service 资源，是 Service 的全量数据。</p>
<p>下面是 Merge 方法的逻辑：</p>
<p>func（s *serviceStore） Merge （source string, change interface｛｝）error ｛ s.serviceLock.Lock （） services ：= s.services ［source］ if services == nil ｛ services = make （map ［types.NamespacedNamelapi.Service） update ：= change. （ServiceUpdate） switch update.Op</p>
<p>case ADD：</p>
<p>glog.V （4）.Infof（&quot;Adding new service from source &amp;s: 8+v&quot;，source, update.</p>
<p>Services）</p>
<p>for _ value ：= range update.Services｛ name ：= types. NamespacedName ｛value .Namespace, value .Name｝ services ［name］ = value case REMOVE：</p>
<p>glog.V （4）.Infof（&quot;Removing a service &amp;+v&quot;， update） -&#x27; value ：= range update.Services｛ name ：= types. NamespacedName ｛value.Namespace,value.Name｝ delete （services, name） case SET：</p>
<p>glog.V （4）.Infof（&quot;Setting services &amp;+v&quot;， update） // Clear the old map entries by just creating a new map services = make （map ［types . NamespacedName］ api. Service） for _ value ：= range update.Services｛ name ：= types . NamespacedName ｛value. Namespace, value . Name｝ services ［name］ = value ｝</p>
<p>default：</p>
<p>glog.V（4）.Infof （&quot;Received invalid update type： %v&quot;， update） s.services ［source］ = services s.serviceLock.Unlock （） if s.updates ！= nil ｛ s.updates &lt;- structO｝f｝ • 479•</p>
<h2>第 493 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） ｝</p>
<p>return nil</p>
<p>｝</p>
<p>serviceStore 同时是 config.Accessor 接口的一个实现，MergedState 接口方法返回之前 Merge 最新的 Service 全量数据。</p>
<p>func （s *servicestore） MergedState （） interface｛｝｛</p>
<p>s.servicelock.RLock （） defer s.serviceLock.RUnlock（） services ：= make （［lapi.Service,0） for _，sourceServices ：= range s.services ｛ for _， value ：= range sourceServices ｛ services = append （services,value） return services</p>
<p>上述方法在哪里被用到了呢？就在之前提到的NewServiceConfig 方法里：</p>
<p>go watchForUpdates （bcaster, store, updates） 一个协程监听 serviceStore 的 updates（Channel），在收到事件以后就调用上述 MergedState 方 法，将当前最新的Service 数组通知注册到 bcaster 上的所有 Listener 进行处理。下面分别给出了 watchForUpdates 及 Broadcaster 的 Notify 方法的源码：</p>
<p>func watchForUpdates （bcaster *config.Broadcaster， accessor config.Accessor， updates &lt;-chan struct｛｝）｛ for true｛</p>
<p>&lt;-updates</p>
<p>bcaster. Notify （accessor.MergedState （） ） ｝</p>
<p>func （b *Broadcaster） Notify （instance interfacel｝）｛</p>
<p>b.listenerLock.RLock （） 1isteners ：= b.listeners b.listenerLock.RUnlock （） _、 Listener ：= range listeners ｛ listener.OnUpdate （instance） ｝</p>
<p>上述逻辑的精巧设计之处在于，当 ServiceConfig 完成 Merge 调用后，为了及时通知 Listener 进行处理，就产生一个“空事件”并写入 updates 这个 Channel 中，另外监听此 Channel 的协程 就及时得到通知，触发 Listener 的回调动作。ServiceConfig 这里注册的 Listener 是 proxy.Proxier 对象，我们以后会继续分析它的回调函数 OnUpdate 是如何使用 Service 数据的。</p>
<p>•480•</p>
<h2>第 494 页</h2>
<h3>第6章</h3>
<p>Kubernetes 源码导读</p>
<p>接下来，我们看看 ServiceUpdate 事件是怎么生成并传递到 ServiceConfig 的Channel 上的。</p>
<p>在kube-proxy 启动流程中有调用 configNewSourceAPI 函数，其内部生成了一个 servicesRefilector 对象：</p>
<p>type servicesReflector struct！</p>
<p>watcher</p>
<p>ServicesWatcher</p>
<p>services</p>
<p>chan&lt;- ServiceUpdate resourceVersion</p>
<p>string</p>
<p>waitDuration</p>
<p>time.Duration</p>
<p>reconnectDuration time.Duration ｝</p>
<p>其中 services 这个 Channel 是用来写入 ServiceUpdate 事件的，它是 ServiceConfig 的Channel （source string）方法所创建并返回的Chanel，它写入数据后就会被一个协程立即转发到 ServiceConfig 的Channel 里。下面这段代码完整地揭示了上述逻辑：</p>
<p>func （c *ServiceConfig） Channel （source string） chan ServiceUpdate｛ ch ：= c.mux.Channel （source） serviceCh ：= make （chan ServiceUpdate） go func（）｛</p>
<p>for update ：= range serviceCh｛ ch &lt;- update</p>
<p>close （ch）</p>
<p>｝（）</p>
<p>return serviceCh</p>
<p>｝</p>
<p>servicesReflector 中的watcher 用来从 API Server 上拉取 Service 数据，它是 client.Services （api.NamespaceAIl）返回的 client.ServiceInterface 实例对象的一个引用，属于标准的 Kubernetes client 包。在 config.NewSourceAPI 的方法里，启动了一个协程周期性地调用 watcher 的 list 与 Watch 方法获取数据，然后转换成 ServiceUpdate 事件，写入 Channel 中。下面是关键源码：</p>
<p>func（s *servicesReflector） run（resourceVersion *string）｛ if len （*resourceVersion） ==10｛</p>
<p>services, err ：= s.watcher.List（labels.Everything （）） if err ！= nil</p>
<p>glog.Errorf （&quot;Unable to load services: av&quot;，err） // TODO: reconcile with pkg/client/cache which doesn &#x27;t use reflector.</p>
<p>time.Sleep （wait.Jitter （s.waitDuration, 0.0）） return</p>
<p>*resourceVersion = services.ResourceVersion // TODO: replace with code to update the s.services &lt;- ServiceUpdate｛Op: SET, Services: services.Items ｝ ｝</p>
<p>• 481•</p>
<h2>第 495 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） watcher,err ：= s.watcher.Watch （labels.Everything（），fields.Everything （）， *resourceVersion）</p>
<p>if err！= nil｛</p>
<p>glog.Errorf （&quot;Unable to watch for services changes: ev&quot;， err） if !client.IsTimeout （err）｛ // Reset so that we do a fresh get request *resourceVersion = &quot;&quot; ｝</p>
<p>return</p>
<p>time.Sleep（wait.Jitter （s.waitDuration, 0.0）） ｝</p>
<p>defer watcher. Stop （） ch ：= watcher.ResultChan （） s.watchHandler （resourceVersion, ch, s.services） 在上面的代码中，初始时资源版本变量 resourceVersion 为空，于是会执行 Service 的全量拉 取动作（watcher. List），之后 Watch 资源会开始发生变化（watcher.Watch） 并将 Watch 的结果 （一个 Chanel 保持了 Service 的变动数据）也转换对应的 ServiceUpdate 事件并写入 Channel 中。另外，当拉取数据的调用发生异常时，resourceVersion 恢复为空，导致重新进行全量资源 的拉取动作。这种自修复能力的编程设计足以见证谷歌大神们的深厚编程功力；另外，笔者认 为kube-proxy 这里的 ServiceConfig 的设计实现思路和代码要比 kubelet 中的好一点，虽然两个 作者都是顶尖高手。</p>
<p>接下来才开始进入本节的重点，即服务代理的实现机制分析。首先，我们从代码中的load balance 组件说起。下面是 kube-proxy 中定义的Load Balancer 接口：</p>
<p>type LoadBalancer interface ｛ NextEndpoint （service ServicePortName,srcAddr net.Addr）（string, error） NewService （service ServicePortName,sessionAffinityType api.ServiceAffinity， stickyMaxAgeMinutes int）error</p>
<p>CleanupStaleStickySessions （service ServicePortName）</p>
<p>LoadBalancer 有3个接口，其中 NextEndpoint方法用于给访问指定 Service 的新客户端请求 分配一个可用的 Endpoint 地址；NewService 用来添加一个新服务到负载均衡器上；</p>
<p>CleanupStaleStickySessions 则用来清理过期的 Session 会话。目前kube-proxy 只实现了一个基于 round-robin 算法的负载均衡器，它就是 proxy. LoadBalancerRR 组件。</p>
<p>LoadBalancerRR 采用了 affinityState 这个结构体来保存当前客户端的会话信息，然后在 affinityPolicy 里用一个 Map 来记录（属于某个 Service 的）所有活动的客户端会话，这是它实现 Session 亲和性的负载均衡调度的基础。</p>
<p>type affinityState struct ｛ clientIP string</p>
<p>• 482</p>
<h2>第 496 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>//clientProtocol</p>
<p>//sessionCookie</p>
<p>endpoint string</p>
<p>api.Protocol //not yet used string</p>
<p>//not yet used</p>
<p>｝</p>
<p>type affinityPolicy struct ｛ affinityType api.ServiceAffinity affinityMap</p>
<p>map［string］ *affinitystate // map client IP -&gt; affinity info ttIMinutes</p>
<p>int</p>
<p>｝</p>
<p>balancerState 用来记录一个Service的所有 Endpoint（数组）、当前所使用的Endpoint 的index， 以及对应的所有活动的客户端会话（affinityPolicy）。其定义如下：</p>
<p>type balancerState struct ｛ endpoints ［］string // a list of &quot;ip:port&quot; style strings index</p>
<p>// current index into endpoints affinity affinityPolicy 有了上面的认识，再看 LoadBalancerRR 的构造函数就简单多了，它内部用一个 map 记录 每个服务的 balancerState 状态，当然初始化时还是空的：</p>
<p>func NewLoadBalancerRR （）*LoadBalancerRR｛ return &amp;LoadBalancerRR｛ services: map ［ServicePortName］*balancerState｛｝， LoadBalancerRR 的 NewService 方法代码很简单，就是在它的 services 里增加一个记录项， 用户端的会话超时时间 ttlMinutes 默认为3小时，下面是相关源码：</p>
<p>func （1b *LoadBalancerRR） NewService （svcPort ServicePortName, affinityType api.ServiceAffinity, ttlMinutes int）error ｛ 1b.lock.Lock （）</p>
<p>defer 1b.lock.Unlock （） lb.newServiceInternal（svcPort, affinityType, ttlMinutes） return nil</p>
<p>func （1b *LoadBalancerRR） newServiceInternal （svcPort ServicePortName, affinityType api.ServiceAffinity, ttlMinutes int） *balancerstate ｛ if ttlMinutes == 0｛ ttlMinutes = 180</p>
<p>_&#x27;exists ：= 1b.services［svcPortl；！exists ｛ lb.services ［svcPort］ = &amp;balancerState｛affinity：</p>
<p>*newAffinityPolicy（affinityType, ttlMinutes）｝ glog.V（4）.Infof （&quot;LoadBalancerRR service eq did not exist, created&quot;， STCPort）</p>
<p>• 483</p>
<h2>第 497 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） ｝ else if affinityrype ！= &quot;&quot; ｛ 1b.services［svcPort］.affinity.affinityrype = affinityType ｝</p>
<p>return lb.services ［svcPort］ ｝</p>
<p>我们在前面提到过 ServiceConfig 同步并监听 API Server 上的api.Service 的数据变化，然后 调用 Listener （proxy.Proxier 是 ServiceConfig 唯一注册的 Listener）的 OnUpdate 接口完成通知。</p>
<p>而上述 NewService 就是在 proxy.Proxier 的 OnUpdate 方法里被调用的，从而实现了 Service 自动 添加到 LoadBalancer 的机制。</p>
<p>我们再来看 LoadBalancerRR 的 NextEndpoint方法，它实现了经典的 round-robin 负载均衡 算法。NextEndpoint 方法首先判断当前服务是否有保持会话（sessionAffinity）的要求，如果有， 则看当前请求是否有连接可用：</p>
<p>if sessionAffinityEnabled ｛ // Caution:don&#x27;t shadow ipaddr var err error</p>
<p>ipaddr，</p>
<p>IE eT: T&#x27;nBE*net.splLtHostFozt （szChdet. str.ing（）） return &quot;&quot;，Emt.Errorf（&quot;malformed source address eq: ev&quot;，srcAddr.</p>
<p>String（），err）</p>
<p>sessionAffinity,exists ：= state.affinity.affinityMap［ipaddr］ if exists &amp;&amp; int （time.Now（）.Sub （sessionAffinity.lastUsed）.Minutes （））&lt; state.affinity.ttlMinutes｛ // Affinity</p>
<p>wins.</p>
<p>endpoint ：= sessionAffinity.endpoint sessionAffinity.lastUsed = time.Now （） glog.V（4）.Infof（&quot;NextEndpoint for service 8q from IP es with sessionAffinity &amp;tv: 8s&quot;，svcPort,ipaddr,sessionAffinity,endpoint） return endpoint,nil ｝</p>
<p>｝</p>
<p>如果服务无须会话保持、新建会话及会话过期，则采用 round-robin 算法得到下一个可用的 服务端口，如果服务有会话保持需求，则保存当前的会话状态：</p>
<p>// Take the next endpoint.</p>
<p>endpoint ：= state.endpoints ［state.index］ state.index = （state.index + 1） if sessionAffinityEnabled｛ var affinity *affinitystate affinity = state.affinity.affinityMap［ipaddr］ if affinity == nil ｛ affinity = new（affinitystate） //&amp;affinitystatelipaddr，&quot;TCP&quot;，&quot;&quot;， endpoint, time.Now （）｝ • 484•</p>
<h2>第 498 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>state.affinity.affinityMap［ipaddr］ = affinity ｝</p>
<p>affinity.lastUsed = time.Now （） affinity.endpoint = endpoint affinity.clientIP = ipaddr glog.V（4）.Infof（&quot;Updated affinity key es: stv&quot;，ipaddr,state.affinity.</p>
<p>affinityMap ［ipaddr］） return endpoint,nil 接下来我们看看 Service 的 Endpoint信息是如何添加到LoadBalancerRR上的？答案很简单， 类似之前我们分析过的 ServiceConfig。 kube-proxy 也设计了一个 EndpointsConfig 来拉取和监听 API Server 上的服务的 Endpoint信息，并调用 LoadBalancerRR的 OnUpdate接口完成通知，在 这个方法里，LoadBalancerRR 完成了服务访问端口的添加和同步逻辑。</p>
<p>我们先来看看 api.Endpoints 的定义：</p>
<p>type EndpointAddress struct｛ IP string</p>
<p>TargetRef *ObjectReference ｝</p>
<p>tyPe EndpointPort structf Name string</p>
<p>Port int</p>
<p>Protocol Protocol</p>
<p>｝</p>
<p>type EndpointSubset struct ｛ Addresses ［］EndpointAddress Ports</p>
<p>［］EndpointPort</p>
<p>｝</p>
<p>type Endpoints struct ｛ TypeMeta</p>
<p>json：&quot;，inline&quot;、</p>
<p>ObjectMeta json：&quot;metadata,omitempty&quot;、 Subsets ［］EndpointSubset ｝</p>
<p>一个 EndpointAddress 与 EndpointPort 对象可以组成一个服务访问地址，而在 EndpointSubset 对象里则定义了两个单独的 EndpointAddress 与 EndpointPort 数组而不是“服务访问地址”的一 个列表。初看这样的定义你可能会觉得很奇择，为什么没有设计一个 Endpoint 结构？这里的深 层次原因在于，Service 的 Endpoint 信息来源于两个独立的实体：Pod 与 Service，前者负责提供 IP 地址即 EndpointAddress，而后者负责提供 Port 即 EndpointPort。由于在一个 Pod 上可以运行 多个 Service，而一个 Service 也通常跨越多个 Pod，于是就产生了一个“笛卡尔乘积”的 Endpoint 列表，这就是 EndpointSubset 的设计灵感。</p>
<p>举例说明，对于如下表不的 EndpointSubset：</p>
<p>• 485•</p>
<h2>第 499 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） ｝</p>
<p>Addresses：［｛&quot;ip&quot; ： &quot;10.10.1.1&quot;），｛&quot;ip&quot;： &quot;10.10.2.2&quot;｝］， Ports：［｛&quot;name&quot;：&quot;a&quot;，&quot;port&quot;： 8675｝，｛&quot;name&quot;： &quot;b&quot;，&quot;port&quot;： 309｝］ 会产生如下 Endpoint 列表：</p>
<p>a：【 10.10.1.1:8675,10.10.2.2:8675 1， b：［10.10.1.1:309,10.10.2.2:309 ］ LoadBalancerRR 的 OnUpdate 方法里循环对每个 api.Endpoints 进行处理，先把它转化为一 个 Map,Map 的Key 是 EndpointPort 的 Name 属性（代表一个 Service 的访问端口）；而 Value 则是 hostPortPair 的一个数组，hostPortPair 其实就是之前缺失的 Endpoint 结构体，包括一个 IP 地址与端口属性，即某个服务在一个 Pod上的对应访问端口。</p>
<p>portsToEndpoints ：= map［string］ ［lhostPortPairl｝ for i：= range svcEndpoints.Subsets ｛ SS：=</p>
<p>&amp;SVCEndpoints.Subsets ［i］ for i：= range</p>
<p>sS.Ports｛</p>
<p>port ：= &amp;ss.Ports［i］ for i：= range ss.Addresses ｛ addr ：= &amp;ss.Addresses ［i］ portsToEndpoints ［port.Name］ = append （portsToEndpoints ［port.Name］，hostPortPair｛addr.IP, port.Port｝） // Ignore</p>
<p>the protocol field -we&#x27;11 get that from the Service objects.</p>
<p>下一步，针对 portsToEndpoints 进行循环处理。对于每个记录，判断是否已经在 services 中 存在，并做出相应的更新或跳过的逻辑，最后删除那些已经不在集合中的端口，完成整个同步 逻辑。下面是相关代码：</p>
<p>for portname ：= range portsToEndpoints ｛ svcPort ：= ServicePortName｛types .NamespacedName｛svCEndpoints .Namespace， svCEndpoints.Name｝，portname｝ state,exists ：= 1b.services ［svcPort］ curEndpoints ：= ［］string｛｝ if state ！= nil ｛</p>
<p>curEndpoints</p>
<p>= state.endpoints</p>
<p>newEndpoints ：= flattenValidEndpoints （portsToEndpoints ［portname］） if !exists Il state == nil il len （curEndpoints）！= len （newEndpoints） I1!slicesEquiv（slice.CopyStrings （curEndpoints），newEndpoints）｛ glog.V（1）.Infof（&quot;LoadBalancerRR: Setting endpoints for es to gtv&quot;， svcPort,newEndpoints） • 486</p>
<h2>第 500 页</h2>
<h3>第6章</h3>
<p>Kubernetes 源码导读</p>
<p>1b.updateAffinityMap （svCPort,newEndpoints） // OnUpdate can be called without NewService being called externally.</p>
<p>// To be safe we will call it here. Anew service will only be created // if one does not already exist. The affinity will be updated // later,once</p>
<p>NewService is called.</p>
<p>state = 1b.newServiceInternal （svcPort,api.ServiceAffinity（&quot;&quot;），0） state.endpoints = slice.Shufflestrings （newEndpoints） // Reset the round-robin index.</p>
<p>state.index</p>
<p>= 〇</p>
<p>registeredEndpoints ［svcPort］= true ｝</p>
<p>// Remove endpoints missing from the update.</p>
<p>for k ：= range lb.services ｛ if_，exists：= registeredEndpoints［k］；！exists ｛ gLog.V（2）.Infot（&quot;LoadBalancerRR: Removing endpoints for &amp;s&quot;，k） delete （1b.services, k） LoadBalancerRR 的代码总体来说还是比较简单的，它主要被kube-proxy 中的关键组件 proxy.</p>
<p>Proxier 所使用，后者用到的主要数据结构 proxy.serviceInfo，它定义和保存了一个 Service 的 代理过程中的必要参数和对象。下面是其定义：</p>
<p>type serviceInfo struct ｛ portal</p>
<p>portal</p>
<p>protocol</p>
<p>api.Protocol</p>
<p>proxyPort</p>
<p>int</p>
<p>socket</p>
<p>proxySocket</p>
<p>timeout</p>
<p>time.Duration</p>
<p>nodePort</p>
<p>int</p>
<p>loadBalancerStatus api.LoadBalancerstatus sessionAffinityType api.ServiceAffinity stickyMaxAgeMinutes int 1/ Deprecated,but required for back-compat （including eze） deprecatedPublicIPs ［］string ｝</p>
<p>servicelnfo 的各个属性解释如下。</p>
<p>portal：用于存放服务的 Portal 地址，即 Service 的 Cluster IP （VIP）地址与端口。</p>
<p>protcal：服务的TCP，目前是TCP 与UDP。</p>
<p>socket、proxyPort: socket 是 Proxier 在本机上为该服务打开的代理 Socket;proxyPort 则是这个代理 Socket 的监听端口。</p>
<p>• 487•</p>
<h2>第 501 页</h2>
<p>Kubernetes 权威指南</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） ◎</p>
<p>timeout：目前只用于 UDP 的 Service，表明服务“链接”的超时时间。</p>
<p>nodePort： 该服务定义的 NodePort。</p>
<p>loadBalancerStatus：在Cloud 环境下，如果存在由Cloud 服务提供者提供的负载均衡器 （软件或硬件）用作 Kubernetes Service 的负载均衡，则这里存放这些负载均衡器的IP 地址。</p>
<p>◎</p>
<p>sessionAffinityType： 该服务的负载均衡调度是否保持会话。</p>
<p>◎</p>
<p>stickyMaxAgeMinutes： 即前面说的 Session过期时间。</p>
<p>◎</p>
<p>deprecatedPublicIPs： 已过期、废弃的服务的 Public IP 地址。</p>
<p>理解了 serviceInfo，我们再来看 Proxier 的数据结构：</p>
<p>type Proxier</p>
<p>struct｛</p>
<p>loadBalancer LoadBalancer mU</p>
<p>sync.Mutex // protects serviceMap serviceMap</p>
<p>map ［ServicePortName］ *serviceInfo portMapMutex</p>
<p>sync.Mutex</p>
<p>portMap</p>
<p>map ［portMapKey］ ServicePortName numProxyLoops int32 listenIP</p>
<p>net.IP</p>
<p>iptables</p>
<p>iptables.Interface hostIP</p>
<p>net.IP</p>
<p>proxyPorts</p>
<p>PortAllocator</p>
<p>｝</p>
<p>Proxier 用一个 Map 维护了每个服务的 servicelnfo 信息，同时为了快速查询和检测服务端口 是否有冲突，比如定义了两个一样端口的服务，又设计了一个 portMap，其 Key 为服务的端口 信息（portMapKey 由 port 和 protocol 组合而成），value 为 ServicePortName。Proxier 的 listenIP 为Proxier 监听的本节点IP，它在这个IP上接收请求并做转发代理。由于每个服务的 proxySocket 在本节点监听的Port端口默认是系统随机分配的，所以使用 PortAllocator 来分配这个端口。另 外，Service 的 Portal 与 NodePort 是通过Linux 防火墙机制来实现的，因此这里引用了 Iptables 的组件完成相关操作。</p>
<p>要想理解 Proxier 中使用 Iptables 的方式，首先我们要弄明白 Kubernetes 中 Service 访问的 一些网络细节。先来看看图6.9，这是一个外部应用通过 NodePort （TCP: //NodeIP:NodePort） 来访问 Service 时的网络流量示意图。访问流量进入节点网卡 etho 后，到达 Iptables 的 PREROUTING 链，通过 KUBE-NODEPORT-CONTAINER 这个 NAT 规则被转发到 kube-proxy 进程上该 Service 对应的 Proxy 端口，然后由 kube-proxy 进程进行负载均衡并且将流量转发到 Service 所在 Container 的本地端口。</p>
<p>• 488•</p>
<h2>第 502 页</h2>
<h3>第6章</h3>
<p>Kubernetes 源码导读</p>
<p>publie Clicnt</p>
<p>TCP://NodeIP:NodePort •wucn</p>
<p>PREROUTING</p>
<p>KUBE NQDEPORT CONTAIN OUTPUT</p>
<p>KUBE-NODEPORTHOSY</p>
<p>iptables</p>
<p>Kabe-proxy</p>
<p>图 6.9</p>
<p>外部应用通过 NodePort 访问 Service 的网络流量示意图 根据Iptables 的机制，本地进程发起的流量会经过 Iptables 的 OUTPUT 链，于是 kube-proxy 在这里也增加了相同作用的 NAT 规则：KUBE-NODEPORT-HOST。这样一来，如果本地容器 内的进程以 NodePort 方式来访问 Service，则流量也会被转发到 kube-proxy 上，虽然以这种方 式访问的情况比较少见。</p>
<p>服务之间通过 Service Portal 方式访问的流量转发机制跟 NodePort 方式在本质上是一样的， 也是通过NAT，如图6.10所示。当 Service A用Service B的Portal地址去访问时，流量经过 Iptables 的 OUTPUT链经 NAT 规则KUBE-PORTALS-HOST 的转换被转发到 kube-proxy 上，然后被转 发给 Service B 所在的容器。</p>
<p>cth）</p>
<p>dockerl</p>
<p>PREROUTING</p>
<p>JE-POREALS CONEAIEY NANI</p>
<p>OUTPUT</p>
<p>NAI</p>
<p>kube-prory</p>
<p>Jptables</p>
<p>图 6.10 以 Service Portal 方式访问 Service 的流量示意图 Proxier 在创建Iptables 的 PREROUTING 链中的 NAT 转发规则时，有一些特殊性，源码作 者在代码中做了如下注释：</p>
<p>• 489•</p>
<h2>第 503 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） “这是一个复杂的问题。</p>
<p>如果Proxy的Proxier.listenIP设置为0.0.0.0，即绑定到所有端口上，那么我们采用 REDIRECT 这种方式进行流量转发，因为这种情况下，返回的流量与进入的流量使用同一个网络端口，这 就满足了 NAT的规则。其他情况则采用 DNAT 转发流量，但DNAT 到127.0.0.1时，流量会消 失，这似乎是 Iptables 的一个众所周知的问题，所以这里不允许 Proxy绑定到localhost 上。” 现在再看下面这段代码就容易理解了，用来生成KUBE-NODEPORT-CONTAINER 这条NAT 规则：</p>
<p>func（proxier *Proxier） iptablesContainerNodePortArgs （nodePort int,protocol api.Protocol,proxyIP net.IP,proxyPort int,service ServicePortName）［］string ｛ args ：= iptablesCommonPortalArgs （nil,nodePort,protocol,service） if proxyIP.Equal（zeroIPv4） |l proxyIP.Equal （zeroIPv6）｛ // TODO: Can we REDIRECT with IPv6？</p>
<p>args = append（args，&quot;-j&quot;，&quot;REDIRECT&quot;，&quot;--to-ports&quot;，fmt.Sprintf （&quot;ed&quot;， proxyPort））</p>
<p>｝ else|</p>
<p>｛</p>
<p>// TODO: Can we DNAT with IPv6？</p>
<p>args = append（args， &quot;-j&quot;，&quot;DNAT&quot;， &quot;--to-destination&quot;，net. JoinHostPort （proxyIP.String（），strconv.Itoa （proxyPort））） return</p>
<p>args</p>
<p>弄明白 Proxier 中关于 Iptables 的事情之后，我们来研究分析下 Proxier 如何在 OnUpdate 方 法里为每个 Service 建立起对应的 Proxy 并完成同步工作。首先，在 OnUpdate 方法里创建一个 map （activeServices）来标识当前所有 alive 的 Service,key 为 ServicePortName，然后对 OnUpdate 参数里的 Service 数组进行循环，判断每个 Service 是否需要进行新建、变更或者删除操作，对 于需要新建或者变更的 Service，先用 PortAllocator 获取一个新的未用的本地代理端口，然后调 用 addServiceOnPort 方法创建一个 ProxySocket 用于实现此服务的代理，接着调用 openPortal方 法添加 iptables 里的 NAT 映射规则，最后调用 LoadBalancer 的 NewService 方法把该服务添加到 负载均衡器上。OnUpdate 方法的最后一段逻辑是处理已经被删除的 Service，对于每个要被删除 的 Service，先删除 Iptables 中相关的 NAT 规则，然后关闭对应的 proxySocket，最后释放 ProxySocket 占用的监听端口并将该端口“还给”PortAllocator。</p>
<p>从上面的分析中，我们看到 addServiceOnPort 是 Proxier 的核心方法之一。下面是该方法的源码：</p>
<p>func（proxier *Proxier） addServiceOnPort （service ServicePortName,protocol api.Protocol,proxyPort int, timeout time.Duration）（*serviceInfo,error）｛ sock,err ：= newProxySocket （protocol,proxier.listenlP, proxyPort） if err！= nil｛</p>
<p>return nil, err</p>
<p>｝</p>
<p>• 490•</p>
<h2>第 504 页</h2>
<h3>第6章</h3>
<p>Kubernetes 源码导读</p>
<p>_，portStr,err ：= net.SplitHostPort （sOCk.Addr （）.String（）） if err ！= nil｛</p>
<p>sock.Close （）</p>
<p>return nil, err</p>
<p>｝</p>
<p>portNum,err ：= strconv.Atoi （portStr） if err！= nil｛</p>
<p>sock.Close （）</p>
<p>return nil,err</p>
<p>｝</p>
<p>si：= &amp;serviceInfol ProXYPort：</p>
<p>portNum，</p>
<p>protocol：</p>
<p>protocol，</p>
<p>socket：</p>
<p>SOCK，</p>
<p>timeout：</p>
<p>timeout，</p>
<p>sessionAffinityType: api.serviceAffinityNone,// default stickyMaxAgeMi nutes: 180， // TODO:paramaterize this in the API.</p>
<p>｝</p>
<p>proxier.setServiceInfo （service,si） glog.V（2）.Infof （&quot;Proxying for service 8q on ss port %d&quot;，service,Protocol， portNum）</p>
<p>go func（service ServicePortName,proxier *Proxier）｛ defer util.HandleCrash （） atomic.AddInt32 （&amp;proxier.numProxyLoops,1） sock.PrOXYLOOP （service,si,Proxier） atomic.AddInt32 （&amp;proxier.numProxyLoops，-1） ｝ （service,proxier） return si,nil</p>
<p>｝</p>
<p>在上述代码中，先创建一个 ProxySocket，然后创建一个 serviceInfo 并添加到 Proxier 的 serviceMap 中，最后启动一个协程调用 ProxySocket 的 ProxyLoop 方法，使得 ProxySocket 进入 Listen 状态，开始接收并转发客户端请求。</p>
<p>kube-proxy 中的 ProxySocket 有两个实现，其中一个是 tcpProxySocket，另外一个是 udpProxySocket，二者的工作原理都一样，它们的工作流程就是为每个客户端 Socket 请求创建一 个到 Service 的后端 Socket 连接，并且“打通”这两个 Socket，即把客户端 Socket发来的数据“复 制”到对应的后端 Socket 上，然后把后端 Socket 上服务响应的数据写入客户端 Socket 上去。</p>
<p>以 tcpProxySocket 为例，我们先看看它是如何完成 Service 后端连接创建过程的：</p>
<p>func tryConnect（service ServicePortName,srcAddr net.Addr,protocol string， proxier *Proxier） （out net.Conn,err error） ｛</p>
<p>• 491•</p>
<h2>第 505 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） for _&#x27;retryTimeout ：= range endpointDialrimeout ｛ endpoint, err ：=</p>
<p>proxier.loadBalancer.NextEndpoint （service, srcAddr） if err！=nil｛</p>
<p>glog.Errorf （&quot;Couldn&#x27;t find an endpoint for es: ev&quot;，service,err） return nil,err</p>
<p>｝</p>
<p>glog.V（3）.Infof（&quot;Mapped service 8q to endpoint &amp;s&quot;， service,endpoint） outConn,err：= net.DialTimeout （protocol, endpoint,retryTimeout*time.</p>
<p>Second）</p>
<p>if err ！=nil｛</p>
<p>if isToOManyFDSErrOr （err） panic（&quot;Dial failed： &quot; err.Error（））</p>
<p>｝</p>
<p>glog.Errorf （&quot;Dial failed: ev&quot;，err） continue</p>
<p>｝</p>
<p>return outConn，</p>
<p>nil</p>
<p>｝</p>
<p>return nil, Emt.Errorf（&quot;failed to connect to an</p>
<p>endpoint. &quot;）</p>
<p>在上述方法里，首先调用 loadBalancer.NextEndpoint 方法获取服务的下一个可用 Endpoint 地址，然后调用标准网络库中的方法建立到此地址的连接，如果连接失败，则会重新尝试，间 隔时间指数增加（参见 endpointDialTimeout 的值）。</p>
<p>在后端 Service 的连接建立以后，proxyTCP 方法就会启动两个协程，通过调用Go 标准库 io里的Copy 方法把输入流的数据写入输出流，从而完成前后端连接的数据转发功能。此外， proxyTCP 方法会阻塞，直到前后端两个连接的数据流都关闭（或结束）才会返回。下面是其 源码：</p>
<p>func proxyTCP （in， var wg sync.WaitGroup wg.Add（2）</p>
<p>glog.V（4）.Infof（&quot;Creating proxy between 8V &lt;-&gt; 8V &lt;-&gt; 8v &lt;-&gt; &amp;v&quot;， in.RemoteAddr（），in.LocalAddr（），out.LocalAddr （），out.RemoteAddr（）） go copyBytes （&quot;from backend&quot;，in,out，&amp;wg） go copyBytes （&quot;to backend&quot;，out,in， &amp;wg） wg.Wait（）</p>
<p>in.Close （）</p>
<p>｝</p>
<p>这里我们留一个问题，kube-proxy 会在当前节点上为每个 Service 都建立一个代理么？不管 本节点上是否有该 Service 对应的 Pod？</p>
<p>• 492•</p>
<h2>第 506 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<h3>6.6.3 设计总结</h3>
<p>从之前的启动流程和代码分析来看，kube-proxy 的设计和实现还是比较精巧和紧凑的，它 的流程只有一个：从 Kubernetes API Server 上同步 Service 及其 Endpoint 信息，为每个 Service 建立一个本地代理以完成具备负载均衡能力的服务转发功能。图6.11 给出了 kube-proxy 的总体 设计示意图，为了清晰地表明整个业务流程和数据传递方向，这里省去了一些非关键的结构体 和对象。app.ProxyServer 创建了一个 config.SourceAPI 的结构体，用于拉取 Kubernetes API Server 上的 Service 与 Endpoint 配置信息，分别由 config.servicesReflector 与 config.endpointsReflector 这两个对象来实现，它们各自通过相应的 Kubernetes Client API 来拉取数据并且生成对应的 Update 信息放入 Channel 中，最终 Channel 中的 Service 数据到达 proxy.Proxier 上，proxy.Proxier 为每个 Service 建立一个 proxySocket 实现服务代理并且在 iptables 上创建相关的 NAT规则，然 后在 LoadBalancer 组件上开通该服务的负载均衡功能：而Channel 中的 Endpoints 数据则被发送 Create</p>
<p>app.ProxyServer</p>
<p>config SouceAPI</p>
<p>Create</p>
<p>config.endpointsReflector config.services Reflector listand Watch</p>
<p>client.endpoints</p>
<p>client.services</p>
<p>listand Watch</p>
<p>config.Broadcaster Merge</p>
<p>config.endpointsStore Map［api.Endpoints］ Onlpdale</p>
<p>Merge</p>
<p>config.serviceStore Maplapi.Service］</p>
<p>NewService</p>
<p>proxy.affinityPolicy 图 6.11</p>
<p>proxy.LoadBalancerRR Map</p>
<p>proxy.banlancerState Map</p>
<p>proxy.afhinityState 与kubelet 总体相关的设计示意图 config.Broadcaster ，OnUpdate</p>
<p>proxy.Proxier</p>
<p>Map</p>
<p>proxy.servicelnfo</p>
<p>proxy.proxySocket</p>
<p>• 493•</p>
<h2>第 507 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 到 proxy.LoadBalancerRR 组件，用于给每个服务建立一个负载均衡的状态机，每个服务用 banlancerState 结构体来保存该服务可用的Endpoint 地址及当前的会话状态 afinityPolicy，对于 需要保存会话状态的服务，affinityPolicy 用一个 Map 来存储每个客户的会话状态 affinityState。</p>
<p>67</p>
<p>kubectl 进程源码分析</p>
<p>kubectl 与之前的 Kubernetes 进程不同，它不是一个后台运行的守护进程，而是 Kubernetes 提供的一个命令行工具（CLI），它提供了一组命令来操作 Kubernetes 集群。</p>
<p>kubectl进程的入口类源码位置如下：</p>
<p>github/com/GoogleCloudPlatform/kubernetes/cmd/kubect1/kubect1.go 入口 mainO函数的逻辑很简单：</p>
<p>func</p>
<p>main（）｛</p>
<p>runtime .GOMAXPROCS （runtime .NumCPU （） ） ：= cmd.NewKubect1Command（cmdutil.NewFactory（nil），os.Stdin,os.Stdout， os.Stderr）</p>
<p>if</p>
<p>e工工</p>
<p>：= cmd.Execute （）；err ！= nil ｛ OS.Exit （1）</p>
<p>上述代码通过 NewKubectiCommand 方法创建了一个具体的 Command 命令并调用它的 Execute 方法执行，这是工厂模式结合命令模式的一个经典设计案例。从NewKubectlCommand 的源码中可以看到，kubectl 的CLI 命令框架使用了 GitHub 开源项目（https://github.com/spf13/ cobra），下面是该框架中对 Command 的定义：</p>
<p>type Command struct｛ Use string // The one-line usage message.</p>
<p>short string // The short description shown in the &#x27;help&#x27;output.</p>
<p>Long string // The long message shown in the &#x27;help &lt;this-command&gt;&#x27;output.</p>
<p>Run func（cmd *Command,args ［］string）// Run runs the command.</p>
<p>｝</p>
<p>实现一个具体Command 就只要实现Command 的 Run函数即可，下面是其官方网页给出的 一个 Echo 命令的例子：</p>
<p>var cmdEcho = &amp;cobra.Command｛ Use：</p>
<p>&quot;echo ［string to echo］ &quot;， Short ： &quot;Echo anything to the screen&quot;， Long：</p>
<p>&#x27;echo is for echoing anything back.</p>
<p>Echo works a lot like print,except it has a child command.</p>
<p>&#x27;</p>
<p>• 494•</p>
<h2>第 508 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>Run:func （omd *cobra.Conmand,args ［］string） ｛</p>
<p>Emt.Println（&quot;Print： &quot;+ strings.Join （args， &quot;&quot;））</p>
<p>｝，</p>
<p>｝</p>
<p>由于大多数kubectl的命令都需要访问 Kubernetes API Server，所以kubectl设计了一个类似 命令的上下文环境的对象一</p>
<p>-util.Factory 供Command 对象使用。</p>
<p>在接下来的几个章节中，我们对kubectl 中的几个典型Command 的源码逐一解读。</p>
<h3>6.7.1 kubectl create 命令</h3>
<p>kubectl create 命令通过调用 Kubernetes API Server 提供的 Rest API 来创建 Kubernetes 资源 对象，例如 Pod、Service、RC等，资源的描述信息来自-f指定的文件或者来自命令行的输入流。</p>
<p>下面是创建 create 命令的相关源码：</p>
<p>func NewCmdCreate（f *cmdutil.Factory,out io.Writer）*cobra.Command｛ var filenames util.StringList cmd|</p>
<p>：= &amp;cobra.Command｛ Use：</p>
<p>&quot;create -f FILENAME&quot;， Short： &quot;Create a resource by filename or stdin&quot;， Long：</p>
<p>create</p>
<p>-</p>
<p>10ng，</p>
<p>Example: create_example， Run:func（cmd *cobra.Command,args ［］string）｛ cmdutil.CheckErr （ValidateArgs （cmd,args）） cmdutil.CheckErr（RunCreate （f, out,filenames）） ｝，</p>
<p>usage ：= &quot;Filename,directory,or URL to file to use to create the resource&quot; kubectl.AddJsonFilenameFlag （cmd， &amp;filenames,usage） cmd.MarkFlagRequired（&quot;filename&quot;） return cmd</p>
<p>AddisonFilenameFlag 方法限制 filename 参数（-f）的文件名后缀只能是json、yaml 或者 yml 中的一种，并且将参数值填充到 filenames 这个 Set 集合中，随后被Command 的Run函数中的 RunCreate 方法所引用，后者就是 kubectl create 命令的核心逻辑所在。</p>
<p>RunCreate 方法使用到了 resource.Builder 对象，它是 kubectl 中的一处复杂设计，采用了 Visitor 的设计模式，kubectl 的很多命令都用到了它。Builder 的目标是根据命令行输入的资源相 关的参数，创建针对性的 Visitor 对象来获取对应的资源，最后遍历相关的所有 Visitor 对象，触 发用户指定的 VisitorFun 回调函数来处理每个具体的资源，最终完成资源对象的业务处理逻辑。</p>
<p>由于涉及的资源参数有各种情况，所以导致 Builder 的代码很复杂。以下是 Builder 所能操作的 • 495</p>
<h2>第 509 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 各种资源参数：</p>
<p>◎ 通过输入流提供具体的资源描述；</p>
<p>c 通过本地文件内容或者 HTTP URL 的输出流来获取资源描述；</p>
<p>◎ 文件列表提供多个资源描述；</p>
<p>◎ 指定资源类型，通过查询 Kubernetes API Server 来获取相关类型的资源；</p>
<p>指定资源的 selector 条件如 cluster-service=true，查询 Kubernetes API Server 来获取相关 的资源；</p>
<p>◎</p>
<p>指定资源的 namespace 来查询符合条件的相关资源。</p>
<p>下面是 resource.Builder 的定义：</p>
<p>type Builder struct ｛ mapper *Mapper</p>
<p>errs ［lerror</p>
<p>paths ［lVisitor</p>
<p>stream bool</p>
<p>dir</p>
<p>bool</p>
<p>selector labels.Selector selectA11 boo1</p>
<p>resources ［］string namespace string</p>
<p>names</p>
<p>［］string</p>
<p>resourceTuples ［］resourceTuple defaultNamespace bool requireNamespace bool flatten boo1</p>
<p>latest bool</p>
<p>requireobject bool singleResourcerype bool continueOnError</p>
<p>bool</p>
<p>schema validation. Schema ｝</p>
<p>其实 Builder 很像一个 SQL 查询条件的生成器，里面包括了各种“查询”条件，在指定不 同的查询条件时，会生成不同的 Visitor 接口来处理这些查询条件，最后遍历所有 Visitor，就得 到最终的“查询结果”。Builder 返回的Result 对象里也包括 Visitor 对象及可能的最终资源列表 等信息，由于资源查询存在各种情况，所以 Result 也提供了多种方法，比如还包括了Watch 资 源变化的方法。</p>
<p>RunCreate 方法里先创建了一个 Builder，设置各种必要参数，然后调用 Builder 的Do 方法， 返回一个 Result，代码如下：</p>
<p>• 496•</p>
<h2>第 510 页</h2>
<h3>第6章</h3>
<p>Kubernetes 源码导读</p>
<p>schema,err ：= f.Validator （） mapper, tyPer</p>
<p>f.Object （）</p>
<p>r ：= resource.NewBuilder（mapper, typer, f.ClientMapperForCommand （））.</p>
<p>Schema（sChema）.</p>
<p>ContinueOnError（）.</p>
<p>NamespaceParam （cmdNamespace）.DefaultNamespace （）.</p>
<p>FilenameParam （enforceNamespace， filenames...）.</p>
<p>Flatten （）.</p>
<p>其中，schema 对象用来校验资源描述是否正确，比如有没有缺少字段或者属性的类型错误 等；mapper 对象用来完成从资源描述信息到资源对象的转换，用来在 REST调用过程中完成数 据转换；FilenameParam 是这里唯一指定 Builder 的资源参数的方法，即把命令行传入的 filenames 参数作为资源参数；Flatten 方法则告诉Builder，这里的资源对象其实是一个数组，需要 Builder 构造一个 FlattenListVisitor 来遍历 Visit 数组中的每个资源项目；Do方法则返回一个 Rest 对象， 里面包括与资源相关的 Visitor 对象。</p>
<p>下面是 NamespaceParam 方法的源码，主要逻辑为调用 Builder 的 Builder.Stdin、Builder.URL 或 Builder.Path 方法来处理不同类型的资源参数，这些方法会生成对应的 Visitor 对象并加入 Builder 的 Visitor 数组里（paths 属性）。</p>
<p>func （b *Builder） FilenameParam （enforceNamespace bool,paths •.string） *Builder ｛ for_s：= range paths ｛ switch｛</p>
<p>case s == &quot;-&quot;：</p>
<p>b.Stdin（）</p>
<p>case strings.Index（s， &quot;http:// &quot;）== 0 || strings.Index（s， &quot;https:// &quot;）== 0：</p>
<p>url,err ：= url.Parse （s） if err！=nil｛</p>
<p>b.errs = append （b.errs, fmt.Errorf（&quot;the URL passed to filename eq is not valid：</p>
<p>gv&quot;，s,err））</p>
<p>continue</p>
<p>｝</p>
<p>b.URL （ur1）</p>
<p>default：</p>
<p>b.Path （s）</p>
<p>｝</p>
<p>｝</p>
<p>if enforceNamespace｛ b.RequireNamespace（） ｝</p>
<p>return b</p>
<p>｝</p>
<p>不管是标准输入流、URL，还是文件目录或者文件本身，这里处理资源的 Visitor 都是 • 497•</p>
<h2>第 511 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） StreamVisitor 这个实现 （FileVisitor 与 FileVisitorForSTDIN 是 StreamVisitor 的一个 Wrapper）。下 面是 StreamVisitor 的 Visit 接口代码：</p>
<p>func（v *StreamVisitor） Visit （fn VisitorFunc）error ｛ d：= Yaml .NewYAMLOrJSONDecoder （v.Reader,4096） for</p>
<p>｛</p>
<p>ext：= runtime.RawExtension｛｝ if</p>
<p>e工工</p>
<p>：= d.Decode （&amp;ext）；err！= nil ｛ if err == io.EOF｛</p>
<p>return nil</p>
<p>｝</p>
<p>return err</p>
<p>｝</p>
<p>ext.RawJSON = bytes.TrimSpace （ext.RawJSON） if len（ext.RawJSON）== 0 I| bytes.Equal （ext.RawJSON， ［］byte（&quot;nul1&quot;））｛ continue</p>
<p>｝</p>
<p>if err：= ValidateSchema （ext.RawJSON, v.Schema）；err ！= nil ｛ return err</p>
<p>｝</p>
<p>info,err ：= v.InfoForData （ext.RawJSON, v.Source） if err！= nil｛</p>
<p>if v.IgnoreErrors｛ Emt.Fprintf （os.Stderr， &quot;error: could not read an encoded object from es：&amp;vln&quot;，v.Source,err） glog.V （4）.Infof （&quot;Unreadable: es&quot;，string （ext.RawJSON）） continue</p>
<p>return err</p>
<p>if err：= fn（info）；err ！= nil｛ return err</p>
<p>｝</p>
<p>｝</p>
<p>在上述代码中，首先从输入流中解析具体的资源对象，然后创建一个 Info结构体进行包装 （转换后的资源对象存储在 Info 的 Object 属性中），最后再用这个 Info 对象作为参数调用回调函 数 VisitorFunc，从而完成整个逻辑流程。下面是 RunCreate 方法里调用 Builder 的 Visit 方法触 发 Visitor 执行时的源码，可以看到这里的 VisitorFunc 所做的事情是通过 Rest Client 发起 Kubernetes API 调用，把资源对象写入资源注册表里：</p>
<p>err = r.Visit （func （info *resource.Info） error ｛ data,err ：= info.Mapping.Codec.Encode （info.Object） if err ！= nil｛</p>
<p>return cmdutil.AddSourceToErr （&quot;creating&quot;，info.Source， • 498•</p>
<h2>第 512 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>obj,err</p>
<p>：= resource.NewHelper （info.Client,info.Mapping）.Create （info.</p>
<p>Namespace,true, data） return cmdutil.AddSourceToErr （&quot;creating&quot;， info.Source,err） ｝</p>
<p>info.Refresh （obj,true） printobjectspecificMessage （info.Object,out） fmt.Fprintf（out，</p>
<p>&quot;%s/8s\n&quot;，info.Mapping.Resource,info.Name） return nil</p>
<p>｝）</p>
<h3>6.7.2 rolling-update 命令</h3>
<p>kubectl rolling-update 命令负责滚动更新（升级）RC （ReplicationController），下面是创建 对应 Command 的源码：</p>
<p>func NewCmdRollingUpdate （f *cmdutil.Factory, out io.Writer） *cobra.Command｛ cmd：= &amp;cobra .Command｛ Use： &quot;rolling-update OLD_CONTROLLER_NAME （INEW_CONTROLLER_NAME］-image -NEW_CONTAINER_IMAGE I -f NEW.</p>
<p>_CONTROLLER_SPEC）&quot;， // rollingupdate is deprecated.</p>
<p>Aliases： ［］string｛&quot;rollingupdate&quot;｝， &quot;Perform a rolling update of the given ReplicationController. &quot;， Long：</p>
<p>rollingUpdate_long， Example: rollingUpdate _example，</p>
<p>Run: func（cmd *cobra.Command, args ［］string）｛ err ：= RunRollingUpdate （f, out,cmd,args） cmdutil.CheckErr （err） ｝</p>
<p>cmd.Flags（）.String（&quot;update-period&quot;， updatePeriod， &#x27;Time to wait between updating pods. Valid time units are &quot;ns&quot;， &quot;us&quot; （or &quot;ps&quot;），&quot;ms&quot;，&quot;s&quot;，&quot;m&quot;， &quot;h&quot;.&#x27;） 此处省去一些命令参数添加的非关键代码：</p>
<p>cmdutil .AddPrinterFlags （cmd） return cmd</p>
<p>｝</p>
<p>从上述代码中我们看到 rolling-update 命令的执行函数 RunRollingUpdate，在分析这个函 数之前，我们先了解下 rolling-update 执行过程中的一个关键逻辑。</p>
<p>rolling update 动作可能由于网络超时或者用户等得不耐烦等原因被中断，因此我们可能会 重复执行一条 rolling-update 命令，目的只有一个，就是恢复之前的 rolling update 动作。为了实 • 499•</p>
<h2>第 513 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 现这个目的，rolling-update 程序在执行过程中会在当前 rolling-update 的 RC 上增加一个 Annotation 标签一</p>
<p>-kubectl.kuberetes.io/next-controller-id，标签的值就是下一个要执行的新 RC 的名字。此外，对于Image 升级这种更新方式，还会在 RC 的 Selector 上 （RC.Spec.Selector） 贴一个名为 deploymentKey 的Label,Label 的值是RC 的内容进行 Hash 计算后的值，相当于签 名，这样就能很方便地比较RC里的Image 名字（以及其他信息）是否发生了变化。</p>
<p>RuRollingUpdate 执行逻辑的第1步：确定 New RC对象及建立起 OId RC 到 New RC 的关 联关系。下面我们以指定的 Image 参数进行 rolling update 的方式为例，看看代码是如何实现这 段逻辑的。下面是相关源码：</p>
<p>if len （image）！= 0｛ keepOldName = len （args） == 1</p>
<p>newName ：= findNewName （args, oldRc） if newRc,err = kubectl.LoadExistingNextReplicationController （client， cmdNamespace,newName）；err ！= nil ｛ return err</p>
<p>if newRc！=nil ｛</p>
<p>Emt.Fprintf（out，&quot;Found existing update in progress （8s），resuming.\ n&quot;，newRc.Name）</p>
<p>｝ else｛</p>
<p>newRc,err = kubectl.CreateNewControllerFromCurrentController （client， cmdNamespace,oldName,newName,image,deploymentKey） if err ！= nil｛</p>
<p>return err</p>
<p>｝</p>
<p>// Update the existing replication controller with pointers to the &#x27;next&#x27; controller</p>
<p>// and adding the &lt;deploymentKey&gt; label if necessary to distinguish it from the &#x27;next&#x27;controller.</p>
<p>oldHash,err ：= api.Hashobject （oldRc,client.Codec） if err ！= nil｛</p>
<p>return err</p>
<p>｝</p>
<p>OldRC,err = kubectl.UpdateExistingReplicationController （client, OldRC， cmdNamespace,newRc.Name,deploymentKey, oldHash,out） if err ！= nil ｛</p>
<p>return err</p>
<p>｝</p>
<p>｝</p>
<p>在代码里，findNewName 方法查询新 RC 的名字，如果在命令行参数中没有提供新 RC的 名字，则从 Old RC 中根据 kubectl.kubernetes.io/next-controller-id 这个 Annotation 标签找新RC 的名字并返回，如果新 RC 存在则继续使用，否则调用 CreateNew ControllerFromCurtentController • 500•</p>
<h2>第 514 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>方法创建一个新 RC，在新RC的创建过程中设定 deploymentKey 的值为自己的 Hash 签名，方 法源码如下：</p>
<p>func CreateNewControllerFromCurrentController（c *client.Client, namespace, oldName， newName,image,deploymentKey string）（*api.ReplicationController,error）｛ // load the old RC into the &quot;new&quot; RC newRc,err ：= c.ReplicationControllers （namespace）.Get （o1dName） if err ！=nil｛</p>
<p>return nil，</p>
<p>eKr</p>
<p>｝</p>
<p>if len（newRc.Spec.remplate.spec.Containers）&gt;1｛ // TODO: support multi-container image update.</p>
<p>return nil,goerrors.New （&quot;Image update is not supported for multi-container pods&quot;）</p>
<p>if len （newRc. Spec.Template. Spec.Containers） return nil,goerrors.New （Emt.Sprintf（&quot;Pod has no containers！（%v）&quot;， newRc））</p>
<p>newRc. Spec.remplate. Spec.Containers ［0］.Image = image newHash,err ：= api.Hashobject （newRc,C.Codec） if err ！= nil｛</p>
<p>return nil, err</p>
<p>if len （newName）</p>
<p>==〇｛</p>
<p>newName = Emt.Sprintf（&quot;%s-8s&quot;，newRc.Name,newHash） ｝</p>
<p>newRc.Name = newName newRc.Spec. Selector［deploymentKey］ = newHash newRc.Spec.Template.Labels ［deploymentKey］= newHash // Clear resource version after hashing so that identical updates get di fferent hashes.</p>
<p>newRc.ResourceVersion = &quot;&quot; return</p>
<p>newRC, nil</p>
<p>在 Image rolling update 的流程中确定新的RC以后，调用 UpdateExistingReplicationController 方法，将旧 RC 的 kubectl.kubernetes.io/next-controller-id 设置新 RC 的名字，并且判断旧 RC 是否需要设置或更新 deploymentKey，具体代码如下：</p>
<p>func UpdateExistingReplicationcontroller（c client.Interface, oldRc *api.</p>
<p>ReplicationController,namespace,newName,deploymentKey,deploymentValue string， out io.Writer）（*api.ReplicationController,error）｛ SetNextControllerAnnotation （oldRC,newName） if_found ：= oldRc.Spec.Selector ［deploymentKey］；！found ｛ return AddDeploymentKeyToReplicationController （01dRC, C, deploymentKey， deploymentValue, namespace, out） • 501•</p>
<h2>第 515 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） ｝else｛</p>
<p>need to write</p>
<p>11 If we didn&#x27;t need to update the controller for the deployment key,we still // the &quot;next&quot; controller.</p>
<p>return c.ReplicationControllers （namespace）.Update （01dRc） ｝</p>
<p>｝</p>
<p>通过上面的逻辑，新RC被确定并且旧RC到新 RC的关联关系也被建立好了，接下来如果 dry-run 参数力 true，则仅仅打印新旧 RC的信息然后返回。如果是正常的 rolling update 动作， 则创建一个 kubect.RollingUpdater 对象来执行具体任务，任务的参数则放在 kubectl.Rolling UpdaterConfig 中，相关源码如下：</p>
<p>updateCleanupPolicy ：= kubectl.DeleteRo11ingUpdateCleanupPolicy if keepOldName｛</p>
<p>updateCleanupPolicy = kubectl.RenameRo11ingUpdateCleanupPolicy ｝</p>
<p>config：= &amp;kubectl.RollingUpdaterConfig｛ Out：</p>
<p>out，</p>
<p>O1dRC：</p>
<p>OldRC，</p>
<p>NewRc：</p>
<p>neWRC，</p>
<p>UpdatePeriod：</p>
<p>period，</p>
<p>Interval：</p>
<p>interval，</p>
<p>Timeout：</p>
<p>timeout，</p>
<p>CleanupPolicy: updateCleanupPolicy， 最新网络工程师资料</p>
<p>www.w.gcs.cn</p>
<p>其中 out 是输出流（屏幕输出）；UpdatePeriod 是执行 rolling update 动作的间隔时间；Interval 与 Timeout 组合使用，前者是每次拉取 polling controller 状态的间隔时间，而后者则是对应的 （HTTP REST 调用）超时时间。CleanupPolicy 确定升级结束后的善后策略，比如 DeleteRolling UpdateCleanupPolicy 表示删除旧的 RC，而 RenameRollingUpdateCleanupPolicy 则表示保持 RC 的名字不变（改变新 RC 的名字）。</p>
<p>RollingUpdater 的 Update 方法是 rolling update 的核心，它以上述 config 对象作参数，其 核心流程是每次让新 RC的Pod副本数量加1，同时旧RC的Pod副本数量减1，直到新RC的 Pod副本数量达到预期值同时旧 RC的Pod副本数量变为零为止，在这个过程中由于新旧 RC的 Pod 副本数量一直在变动，所以需要一个地方记录最初不变的那个Pod副本数量，这里就是 RC 的 Annotation 标签—kubectl.kubernetes.io/desired-replicas。</p>
<p>下面这段源码就是“贴标签”的过程：</p>
<p>fmt.Fprintf（out，&quot;Creating &amp;sln&quot;， newName） if newRc.ObjectMeta.Annotations == nil｛</p>
<p>newRc.ObjectMeta.Annotations = maplstring］string｛｝ ｝</p>
<p>• 502•</p>
<h2>第 516 页</h2>
<h3>第6章 Kubernetes 源码导读</h3>
<p>newRc.ObjectMeta.Annotations ［desiredReplicasAnnotation］ = fmt.Sprintf （&quot;ed&quot;，desired）</p>
<p>newRc.ObjectMeta.Annotations ［sourceldAnnotation］ = sourceld newRc.Spec.Replicas =0 newRc,err = r.c.CreateReplicationController （r.ns,n 下面这段源码便是“江山代有才人出，一代新人换旧人”的生动画面：</p>
<p>for newRc.Spec.Replicas &lt; desired &amp;&amp; oldRc.Spec.Replicas ！=0｛ newRc.Spec.Replicas += 1 oldRc.Spec.Replicas -= 1 fmt.Printf（&quot;At beginning of loop: 8s replicas： %d, 8s replicas: 8dln&quot;， oldName,oldRc.Spec.Replicas， newName,newRc.Spec.Replicas） Emt.Fprintf（out，&quot;Updating 8s replicas: 8d, 8s replicas: 8dln&quot;， oldName,oldRC.Spec.Replicas， newName,newRc.Spec.Replicas） newRc,err - r.scaleAndWait （newRC, retry, waitForReplicas） if err！=nil｛</p>
<p>return err</p>
<p>｝</p>
<p>time.Sleep （updatePeriod） oldRc,err = r.scaleAndWait （oldRc,retry, waitForReplicas） if err ！= nil｛</p>
<p>return err</p>
<p>｝</p>
<p>Emt.Printf（&quot;At end of loop: 8s replicas： %d, 8s replicas: 8d\n&quot;， oldName,oldRc.Spec.Replicas， newName,newRc. Spec.Replicas） // delete remaining replicas on oldRc if oldRc.Spec.Replicas ！= 0 ｛ fmt.Fprintf（out， &quot;Stopping 8s replicas: 8d -&gt; 8d\n&quot;， oldName,oldRc.Spec.Replicas,0） oldRc.Spec.Replicas = 0 oldRC, err</p>
<p>= r.scaleAndWait （oldRc,retry, waitForReplicas） if err ！=nil｛</p>
<p>return err</p>
<p>｝</p>
<p>// add remaining replicas on newRc if newRc.Spec.Replicas ！= desired｛ Emt .Fprintf （out，&quot;Scaling es replicas: ed -&gt; edln&quot;， newName,newRc. Spec.Replicas, desired） newRc.Spec.Replicas = desired</p>
<p>newRc,err = r.scaleAndWait（newRc, retry, waitForReplicas） if err ！= nil｛</p>
<p>return err</p>
<p>• 503•</p>
<h2>第 517 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） ｝</p>
<p>｝</p>
<p>上述方法里的 scaleAndWait 方法调用了 kubectl.ReplicationControllerScaler 的Scale 方法， Scale 方法先通过 Rest API 调用 Kubernetes API Server 更新 RC 的Pod 副本数量，然后循环拉取 RC信息，直到超时或者 RC同步状态完成。下面是判断 RC同步状态是否完成的函数，来自 client 包（pkg/client/conditions.go）。</p>
<p>func ControllerHasDesiredReplicas （c Interface, controller *api.ReplicationController） wait.ConditionFunc ｛</p>
<p>desiredGeneration ：= controller.Generation return func （） （bool, error） ｛</p>
<p>ctrl,err ：= c.ReplicationControllers（controller.Namespace）.Get （controller.Name）</p>
<p>if err ！=nil｛</p>
<p>return false,err</p>
<p>｝</p>
<p>return ctrl.Status.ObservedGeneration &gt;= desiredGeneration &amp;&amp; ctrl.Status.Replicas == ctrl.Spec.Replicas,nil ｝</p>
<p>｝</p>
<p>rolling-update 是kubectl 所有命令中最为复杂的一个，从它的功能和流程来看，完全可以被 当作一个 Job 并放到 kube-controller-manager 上实现，客户端仅仅发起Job的创建及 Job 状态查 看等命令即可，未来 Kubernetes 的版本是否会这样重构，我们拭目以待。</p>
<p>• 504</p>
<h2>第 518 页</h2>
<p>后记</p>
<p>Kubernetes 无疑是容器化技术时代最好的分布式系统架构，但是目前它还没有一款很好的 图形化管理工具，基本上是命令行操作，因此不容易入门。另外，在系统运行过程中，我们难 以直观了解当前服务的分布情况及资源的使用情况，日志也不完善，难以快速追踪和排查故障， 因此，我们发起了一个名为 Ku8eye 的开源项目，这是借鉴了 OpenStack Horizon、Cloudera Manager 等知名软件的设计思想的一款国产开源软件，目标是成为 Kubernetes 的姊妹开源项目。</p>
<p>Ku8eye 作为 Kubernetes 的一站式管理工具，具备如下关键特性。</p>
<p>◎</p>
<p>图形化一键安装和部署多节点 Kubernetes 集群。这是安装、部署谷歌 Kubernetes 集群 的最快、最佳方式，其安装流程会参考当前的系统环境，提供默认优化的集群安装参 数，实现最佳部署。</p>
<p>支持多角色、多租户的Portal 管理界面。通过一个集中化的Portal 界面，运营团队可以 很方便地调整集群配置及管理集群资源，实现跨部门的角色、用户及多租户管理，通 过自助服务可以很容易完成 Kubernetes 集群的运维管理工作。</p>
<p>制定了 Kuberetes 应用的程序发布包标准（ku8package），并提供了一款向导工具，使 得专门为Kubernetes 设计的应用能够很容易地从本地环境发布到公有云和其他环境中；</p>
<p>并且提供了 Kubernetes 应用的可视化构建工具，实现了 Kubernetes Service、RC、Pod 及其他资源的可视化构建和管理功能。</p>
<p>可定制化的监控和告警系统。Ku8eye 内建了很多系统健康检查工具来检测、发现异常 并触发告警事件，不仅可以监控集群中的所有节点和组件（包括 Docker 与 Kubernetes）， 还可以很容易地监控业务应用的性能；并且提供了一个强大的 Dashboard，用来生成各 种复杂的监控图表以展示历史信息，还可用来自定义相关监控指标的告警阀值。</p>
<p>具备综合的全面的故障排查能力。Ku8eye 提供了集中化的唯一日志管理工具，日志系 统从集群中的各个节点拉取日志并做聚合分析，拉取的日志包括系统日志和用户程序 日志：并且提供了全文检索能力以方便故障分析和问题排查，检索的信息包括相关告 警信息，而历史视图和相关的度量数据则告诉我们什么时候发生了什么事情，有助于 • 505•</p>
<h2>第 519 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 快速了解相关时间内系统的行为特征。</p>
<p>实现了 Docker 与 Kubemetes 项目的持续集成功能。Ku8eye 提供了一款可视化工具，用 来驱动持续集成的整个流程，包括创建新的 Docker 镜像，Push 镜像到私有仓库，创建 Kubernetes 测试环境进行测试，以及最终滚动升级到生产环境中的各个主要环节。</p>
<p>Ku8eye 的 GitHub 地址为 https://github.com/bestcloud,Ku8eye 目前所用到的技术包括 Java Web、Ansible 脚本，未来可能涉及 Python 脚本及 Android 开发等。截至本书出版时，Ku8eye 已有10多名团队成员。如果您有兴趣，可在学完本书后加入本项目QQ群（Kubernetes 中国）：</p>
<p>285431657。</p>
<p>People</p>
<p>12&gt;</p>
<p>Ku8</p>
<p>eye</p>
<p>Leader</p>
<p>US</p>
<p>Invite someone</p>
<p>请您加入我们</p>
<p>• 506•</p>
</div>
