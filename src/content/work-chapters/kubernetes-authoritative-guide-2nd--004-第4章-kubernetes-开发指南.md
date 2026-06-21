---
title: "第4章 Kubernetes 开发指南"
description: "第4章 Kubernetes 开发指南 本章将引入 REST 的概念，详细说明 Kubernetes API，并举例说明如何基于 Jersey 和 Fabric8 框架访问 Kubernetes API，深入分析基于这两个框架访问 Kubernetes API 的优缺点。下面从 REST 开始说起。 4.1 REST 简述 REST （Representat"
sourceUrl: "授权 PDF：Kubernetes权威指南：从Docker到Kubernetes实践全接触（第2版).pdf，页 260-304"
workSlug: "kubernetes-authoritative-guide-2nd"
workTitle: "Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第 2 版）"
chapterSlug: "004-第4章-kubernetes-开发指南"
order: 4
categories: ["云原生", "Kubernetes"]
tags: ["Kubernetes", "Docker", "容器", "集群管理"]
---
<div class="imported-document imported-pdf-document">
<h2>第4章 Kubernetes 开发指南</h2>
<h2>第 260 页</h2>
<h3>第4章</h3>
<p>Kubernetes 开发指南</p>
<p>本章将引入 REST 的概念，详细说明 Kubernetes API，并举例说明如何基于 Jersey 和 Fabric8 框架访问 Kubernetes API，深入分析基于这两个框架访问 Kubernetes API 的优缺点。下面从 REST 开始说起。</p>
<p>4.1</p>
<p>REST 简述</p>
<p>REST （Representational State Transfer） 是由Roy Thomas Fielding 博士在他的论文 Architectural Styles and the Design of Network-based Software Architectures 中提出的一个术语。REST 本身只是 为分布式超媒体系统设计的一种架构风格，而不是标准。</p>
<p>基于 Web 的架构实际上就是各种规范的集合，这些规范共同组成了 Web 架构，比如HTTP、 客户端服务器模式都是规范。每当我们在原有规范的基础上增加新的规范时，就会形成新的 架构。而 REST 正是这样一种架构，它结合了一系列规范，形成了一种新的基于 web 的架构 风格。</p>
<p>传统的 Web 应用大多是B/S架构，涉及如下规范。</p>
<p>（1）客户-服务器：这种规范的提出，改善了用户接口跨多个平台的可移植性，并且通过简 化服务器组件，改善了系统的可伸缩性。最为关键的是通过分离用户接口和数据存储，使得不 同的用户终端共享相同的数据成为可能。</p>
<p>（2）无状态性：无状态性是在客户-服务器约束的基础上添加的又一层规范，它要求通信必 须在本质上是无状态的，即从客户端到服务器的每个 request 都必须包含理解该 request 所必需</p>
<h2>第 261 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 的所有信息。这个规范改善了系统的可见性（无状态性使得客户端和服务器端不必保存对方的 详细信息，服务器只需要处理当前的 request，而不必了解所有 request 的历史）、可靠性（无状 态性减少了服务器从局部错误中恢复的任务量）、可伸缩性（无状态性使得服务器端可以很容易 地释放资源，因为服务器端不必在多个 request 中保存状态）。同时，这种规范的缺点也是显而 易见的，由于不能将状态数据保存在服务器上，因此增加了在一系列 request 中发送重复数据的 开销，严重降低了效率。</p>
<p>（3）缓存：为了改善无状态性带来的网络的低效性，我们添加了缓存约束。缓存约束允 许隐式或显式地标记一个 response 中的数据，赋予了客户端缓存 response 数据的功能，这样 就可以为以后的 request 共用缓存的数据，部分或全部地消除一部分交互，提高了网络效率。</p>
<p>但是由于客户端缓存了信息，所以增加了客户端与服务器数据不一致的可能性，从而降低了 可靠性。</p>
<p>B/S 架构的优点是部署非常方便，在用户体验方面却不很理想。为了改善这种情况，我们 引入了 REST。REST 在原有架构上增加了三个新规范：统一接口、分层系统和按需代码。</p>
<p>（1）统一接口：REST 架构风格的核心特征就是强调组件之间有一个统一的接口，表现为 在 REST 世界里，网络上的所有事物都被抽象为资源，REST 通过通用的链接器接口对资源进 行操作。这样设计的好处是保证系统提供的服务都是解耦的，极大地简化了系统，从而改善了 系统的交互性和可重用性。</p>
<p>（2）分层系统：分层系统规则的加入提高了各种层次之间的独立性，为整个系统的复杂性 设置了边界，通过封装遗留的服务，使新的服务器免受遗留客户端的影响，也提高了系统的可 伸缩性。</p>
<p>（3）按需代码：REST 允许对客户端功能进行扩展。比如，通过下载并执行 applet 或脚本 形式的代码来扩展客户端的功能。但这在改善系统可扩展性的同时降低了可见性，所以它只是 REST 的一个可选约束。</p>
<p>REST 架构是针对web 应用而设计的，其目的是为了降低开发的复杂性，提高系统的可伸 缩性。REST 提出了如下设计准则。</p>
<p>（1） 网络上的所有事物都被抽象为资源（Resource）。</p>
<p>（2）每个资源对应一个唯一的资源标识符（Resource Identifier）。</p>
<p>（3）通过通用的连接器接口（Generic Connector Interface）对资源进行操作。</p>
<p>（4）对资源的各种操作不会改变资源标识符。</p>
<p>（5） 所有的操作都是无状态的（Stateless）。</p>
<p>• 248</p>
<h2>第 262 页</h2>
<h3>第4章 Kubernetes 开发指南</h3>
<p>REST 中的资源所指的不是数据，而是数据和表现形式的组合，比如“最新访问的10位 会员”和“最活跃的10位会员”在数据上可能有重叠或者完全相同，而由于它们的表现形式 不同，所以被归为不同的资源，这也就是为什么 REST 的全名是 Representational State Transfer。</p>
<p>资源标识符就是 URI（Uniform Resource Identifier），不管是图片、Word 还是视频文件，甚至 只是一种虚拟的服务，也不管是xml、txt还是其他文件格式，全部通过 URI 对资源进行唯一 标识。</p>
<p>REST 是基HTTP 的，任何对资源的操作行为都通过HTTP 来实现。以往的 Web 开发大 多数用的是HTTP 中的GET 和POST方法，很少使用其他方法，这实际上是因为对HTTP的片 面理解造成的。HTTP 不仅仅是一个简单的运载数据的协议，而且是一个具有丰富内涵的网络 软件的协议，它不仅能对互联网资源进行唯一定位，还能告诉我们如何对该资源进行操作。HTTP 把对一个资源的操作限制在4种方法内：GET、POST、PUT 和 DELETE，这正是对资源 CRUD 操作的实现。由于资源和URI是一一对应的，在执行这些操作时 URI没有变化，和以往的Web 开发有很大的区别，所以极大地简化了 web 开发，也使得URI 可以被设计成更为直观地反映资 源的结构。这种 URI 的设计被称作 RESTful 的URI，为开发人员引入了一种新的思维方式：通 过 URL 来设计系统结构。当然了，这种设计方式对于一些特定情况也是不适用的，也就是说不 是所有 URI 都适用于 RESTful。</p>
<p>REST之所以可以提高系统的可伸缩性，就是因为它要求所有操作都是无状态的。由于没 有了上下文（Context）的约束，做分布式和集群时就更为简单，也可以让系统更为有效地利用 缓冲池（Pool），并且由于服务器端不需要记录客户端的一系列访问，也就减少了服务器端的性 能损耗。</p>
<p>Kubernetes API 也符合 RESTful 规范，下面对其进行介绍。</p>
<h3>4.2 Kubernetes API详解</h3>
<p>4.2.1</p>
<p>Kubernetes API 概述</p>
<p>Kubernetes API 是集群系统中的重要组成部分，Kubernetes 中各种资源（对象）的数据通过 该 API 接口被提交到后端的持久化存储（etcd）中，Kubernetes 集群中的各部件之间通过该API 接口实现解耦合，同时 Kubernetes 集群中一个重要且便捷的管理工具kubectl 也是通过访问该 API接口实现其强大的管理功能的。Kubernetes API 中的资源对象都拥有通用的元数据，资源对 象也可能存在嵌套现象，比如在一个 Pod 里面嵌套多个 Container。创建一个 API 对象是指通过 API 调用创建一条有意义的记录，该记录一旦被创建，Kubernetes 将确保对应的资源对象会被 • 249•</p>
<h2>第 263 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 自动创建并托管维护。</p>
<p>在 Kubernetes 系统中，大多数情况下，API定义和实现都符合标准的HTTP REST格式，比 如通过标准的 HTTP 动词 （POST、PUT、GET、DELETE）来完成对相关资源对象的查询、创 建、修改、删除等操作。但同时 Kubernetes 也为某些非标准的 REST 行实现了附加的API 接 口，例如 Watch 某个资源的变化、进入容器执行某个操作等。另外，某些API 接口可能违背严 格的 REST 模式，因为接口不是返回单一的JSON 对象，而是返回其他类型的数据，比如 JSON 对象流（Stream）或非结构化的文本日志数据等。</p>
<p>Kubernetes 开发人员认为，任何成功的系统都会经历一个不断成长和不断适应各种变更的 过程。因此，他们期望 Kubernetes API 是不断变更和增长的。同时，他们在设计和开发时，有 意识地兼容了已存在的客户需求。通常，新的 API 资源（Resource）和新的资源域不希望被频 繁地加入系统。资源或域的删除需要一个严格的审核流程。</p>
<p>为了方便查阅 API接口的详细定义，Kubernetes 使用了swagger-ui 提供API 在线查询功能， 其官网为 htp://kubernetes.io/third_party/swagger-ui/，Kubernetes 开发团队会定期更新、生成UI 及文档。Swagger UI 是一款 REST API 文档在线自动生成和功能测试软件，关于 Swagger 的内 容请访问官网 http://swagger.io。</p>
<p>运行在 Master 节点上的API Server 进程同时提供了swagger-ui 的访问地址：http://&lt;master-ip&gt;：</p>
<p>&lt;master-port&gt;/swaggerui/。假设我们的API Server 安装在 192.168.1.128 服务器上，绑定了8080端口， 则可以通过访问 http://192.168.1.128:8080/swagger-ui/来查看API信息，如图4.1所示。</p>
<p>Swagger U</p>
<p>口</p>
<p>×</p>
<p>｛｝</p>
<p>swagger</p>
<p>http://kubemeles.ionhird_party/swagger-uil.J./swagger-spec api_key</p>
<p>Explore</p>
<p>api:get available APi versions api/：APi at /api/vi version 1 version : git code version from which this is built 【 BASE URL:/］</p>
<p>Show/Hide| List Operations / Expand Operations Show/Hide / uist Operations : Expand Operations Show/Hide | List Operations Expand Operations 图 4.1 swagger-ui</p>
<p>单击 api/v1 可以查看所有API 的列表，如图4.2所示。</p>
<p>• 250•</p>
<h2>第 264 页</h2>
<h3>第4章</h3>
<p>Kubernetes 开发指南</p>
<p>Siaggerw</p>
<p>•100E</p>
<p>：&#x27;swagger</p>
<p>htp:Matben</p>
<p>aplLkay</p>
<p>api: get available API versions api/v1 :API at /api/v1 version vi /apinn./namespeces/（namespaceWblndings aput/bindings</p>
<p>aoincs</p>
<p>Hst oe watch oejects of kind 图4.2 查看API列表</p>
<p>以 create a Pod 为例，找到 Rest API 的访问路径为：/api/v1/namespaces/ ｛namespace｝/pods， 如图4.3所示。</p>
<p>/api/v1/namespaces/｛namespace｝/pods create a Pod</p>
<p>图 4.3 Create a Pod API 单击链接展开，即可查看详细的API 接口说明，如图4.4所示。</p>
<p>•</p>
<p>oger U</p>
<p>Response Class （Status 200） onent Jype！</p>
<p>mtt</p>
<p>Detcriptor</p>
<p>Ntrue, tente</p>
<p>outuK prety</p>
<p>wrequired</p>
<p>booy</p>
<p>Detn Tpe</p>
<p>wm</p>
<p>Motef/Modef Sthemn 图 4.4</p>
<p>Create a Pod API 详细说明 • 251•</p>
<h2>第 265 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） 单击Model 链接，则可以查看文本格式显示的API 接口描述，如图4.5所示。</p>
<p>Swagger UI</p>
<p>c</p>
<p>×</p>
<p>Qht=</p>
<p>个</p>
<p>C kubemetes.io/third.party/swagger-ui/w/apis2Fv1/createNamespacedPod /api/v1/namespaces/inamespaceM/pods create a Pod</p>
<p>Response Class （Status 200） Mode Model Schema</p>
<p>M1.Pod｛</p>
<p>kind （string, optionaf: kind of object, in CamelCase; cannot be updated; see htp:lreleazes.k8s.io/HEAD/docs/api-conventons.mdftypes-kinds.</p>
<p>aplversion （String, optionaf: version of the schema the object shoutd have; see http://releases.KBs.io/HEAD/docs/apl-conventions.mdiresources， metadata （V1.ObjecMeta, optiona）， spec （V1.PodSpec, optionah.</p>
<p>status （v1.PodStatus, optionan v1.ObjectMeta｛</p>
<p>name （string, opt/ona） string that identifies an object. Must be unique within a namespace; cannot be updated; see hup:lceleases.k&amp;s.io/HEAD/docs/identifiers.md#nanes， generateName （string, optional:an optionai prefix to use to generate a unique name; has thie same validation rules as name: optional, and is applied only name if is not specified: see http:/reieases.k8s.io/HEAD/docslapl-conventions.md#idempoteng， namespace （string, optionaf: namespace of the object; must be a DNS_LABEL cannor be updared see htup:llreleases.k&amp;s.jO/HEAD/doss/namespaces.ind， selfLink （string, optionat: URL for the object; populated by the system, read-only， uid （string, optionaf: unique UUID across space and time: populated by the system; read-only, see hrtp:/ireleases.kBs.io/HEAD/dess/identifiers.md#wids， resourceVersion （string, optionah: string that identifies the internal version of this object that can be used by Clients to derermine when objecis have changed；</p>
<p>populated by the system, read-only: vatue must be treaced as opaque by clients and passed unmodifed back to the server：</p>
<p>http://releases.kes.jo/HEAD/docs/api-conventions.md#soncurrency-sontcol-and-consistency neration （integer, optionan: a sequence number representing, a specific generation of the desired state: populared by the system; read-on ationTimestamp （string. optionaf: RFC 3339 date and time at which the object was created: populated by the system, read-onty, null for Hists：</p>
<p>hstp://releases.kBs.io/HEAD/docs/apl-conventions.mdimetadata， HletionTimestamp （string, optlonaN: RFC 3339 dace and ume at which the object will be deleted; populated by the system when a graceful deletion quested, read-only: if not sei. graceful deletion of the object has not been requested; see hItp://releases.kBs.io/HfAD/docs/api.conventions.md#metad） Iabels （undefined, optionah.</p>
<p>annotations （undefined, optiona） v1.PodSpec｛</p>
<p>volumes （Airaytv1.Volumel, optianan: list of volumes that can be mounted by containers belonging to the pod; see http://releases.k&amp;s.io/HEAD/docs/volumes.md， containers （Arraylvi.Containerl list of containers belonging to the pod; cannot be updated; containers cannot currentty be added or removed; there musz be at least one container in a Pod: see http://releases. k8s. io/HFAD/docs/containers.ond.</p>
<p>restartPolicy （string, optiona）： restart policy for all containers within the pod; one of Always, OnFailure, Never; defaults to Always; see htwp:/ireleases.k8s.io/HEAD/docs/pod-states.md#testartpoliscy， terminationGracePeriodSeconds （integer, optionah: optional duration in seconds the pod needs to terminate gracefuily; may be decreased in delete request value must be non-negative integer; the value zero indicates delete immediatcly: if this value is not set, the default grace period will be used instead; the grace period is.the duraton in seconds afrer the orocesses runningin.the .ood are.sent a sermination signal and. the. sme when.the.processes are forcibly.halted with 图 4.5 Create a Pod API 文本格式详细说明 我们看到，在 Kubernetes API 中，一个 API 的顶层（Top Level）元素由 kind、apiVersion、 metadata、spec 和 status 等几个部分组成，接下来，我们分别对这几个部分进行说明。</p>
<p>kind 表明对象有以下三大类别。</p>
<p>（1）对象 （objects）：代表在系统中的一个永久资源（实体），例如 Pod、RC、Service、 Namespace 及 Node 等。通过操作这些资源的属性，客户端可以对该对象进行创建、修改、删 除和获取操作。</p>
<p>（2）列表（list）：一个或多个资源类别的集合。列表有一个通用元数据的有限集合。所有 列表 （lists）通过“items”域获得对象数组，例如 PodLists、ServiceLists、NodeL.ists。大部分定 义在系统中的对象都有一个返回所有资源（resource）集合的端点，以及零到多个返回所有资源 集合的子集的端点。某些对象有可能是单例对象（singletons），例如当前用户、系统默认用户等， • 252•</p>
<h2>第 266 页</h2>
<h3>第4 章 Kubernetes 开发指南</h3>
<p>这些对象没有列表。</p>
<p>（3）简单类别（simple）：该类别包含作用在对象上的特殊行为和非持久实体。该类别限制 了使用范围，它有一个通用元数据的有限集合，例如 Binding、Status。</p>
<p>apiVersion 表明API 的版本号，当前版本默认只支持vI。</p>
<p>Metadata 是资源对象的元数据定义，是集合类的元素类型，包含一组由不同名称定义的属 性。在 Kubernetes 中每个资源对象都必须包含以下3种 Metadata。</p>
<p>（1） namespace：对象所属的命名空间，如果不指定，系统则会将对象置于名为 “default” 的系统命名空间中。</p>
<p>（2） name：对象的名字，在一个命名空间中名字应具备唯一性。</p>
<p>（3）uid：系统为每个对象生成的唯一ID，符合 RFC 4122规范的定义。</p>
<p>此外，每种对象还应该包含以下几个重要元数据。</p>
<p>（1） labels：用户可定义的“标签”，键和值都为字符串的 map，是对象进行组织和分类的 一种手段，通常用于标签选择器（Label Selector），用来匹配目标对象。</p>
<p>（2） annotations：用户可定义的“注解”，键和值都为字符串的 map，被 Kuberetes 内部进 程或者某些外部工具使用，用于存储和获取关于该对象的特定元数据。</p>
<p>（3） resourceVersion：用于识别该资源内部版本号的字符串，在用于 Watch 操作时，可以避 免在 GET 操作和下一次 Watch 操作之间造成的信息不一致，客户端可以用它来判断资源是否改 变。该值应该被客户端看作不透明，且不做任何修改就返回给服务端。客户端不应该假定版本 信息具有跨命名空间、跨不同资源类别、跨不同服务器的含义。</p>
<p>（4） creationTimestamp：系统记录创建对象时的时间戳，符合 RFC 3339 规范。</p>
<p>（5） deletionTimestamp：系统记录删除对象时的时间戳，符合 RFC 3339规范。</p>
<p>（6） selfLink：通过 API 访问资源自身的 URL，例如一个 Pod 的 link 可能是/api/v1/namespaces/ default/pods/frontend-o8bg4。</p>
<p>spec 是集合类的元素类型，用户对需要管理的对象进行详细描述的主体部分都在 spec 里给 出，它会被 Kubernetes 持久化到 etcd 中保存，系统通过spec 的描述来创建或更新对象，以达到 用户期望的对象运行状态。spec 的内容既包括用户提供的配置设置、默认值、属性的初始化值， 也包括在对象创建过程中由其他相关组件（例如 schedulers、auto-scalers）创建或修改的对象属 性，比如 Pod 的Service IP 地址。如果 spec 被删除，那么该对象将会从系统中被删除。</p>
<p>Status 用于记录对象在系统中的当前状态信息，它也是集合类元素类型，status 在一个自动 处理的进程中被持久化，可以在流转的过程中生成。如果观察到一个资源丢失了它的状态 • 253</p>
<h2>第 267 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） （Status），则该丢失的状态可能被重新构造。以Pod 为例，Pod 的 status 信息主要包括 conditions、 containerStatuses、hostlP、phase、podIP、startTime 等。其中比较重要的两个状态属性如下。</p>
<p>（1） phase：描述对象所处的生命周期阶段，phase 的典型值是“Pending（创建中）“Running” “Active（正在运行中）”或“Terminated（已终结）”，这几种状态对于不同的对象可能有轻微的 差别，此外，关于当前 phase 附加的详细说明可能包含在其他域中。</p>
<p>（2）condition：表示条件，由条件类型和状态值组成，目前仅有一种条件类型 Ready，对应 的状态值可以为 True、False 或Unknown。一个对象可以具备多种 condition，而 condition 的状态 值也可能不断发生变化，condition 可能附带一些信息，例如最后的探测时间或最后的转变时间。</p>
<h3>4.2.2 API版本</h3>
<p>为了在兼容旧版本的同时不断升级新的 API,Kubernetes 提供了多版本API 的支持能力，每个 版本的 API通过一个版本号路径前缀进行区分，例如/api/vlbeta3。通常情况下，新旧几个不同的 API 版本都能涵盖所有的Kubernetes 资源对象，在不同的版本之间这些API接口存在一些细微差别。</p>
<p>Kubernetes 开发团队基于 API 级别选择版本而不是基于资源和域级别，是为了确保 API 能够描述一 个清晰的连续的系统资源和行为的视图，能够控制访问的整个过程和控制实验性 API 的访问。</p>
<p>API 及版本发布建议描述了版本升级的当前思路。版本 vIbetal、vIbeta2 和 v1beta3 为不 建议使用（Deprecated）的版本，请尽快转到v1 版本。在2015年6月4日，Kubernetes V1 版本 API 正式发布。版本 vIbetal 和v1beta2 API 在2015年6月1 日被删除，版本 vIbeta3 API 在 2015 年7月6日被删除。</p>
<h3>4.2.3 API 详细说明</h3>
<p>API 资源使用 REST 模式，具体说明如下。</p>
<p>（1）GET/资源名的复数格式&gt;：获得某一类型的资源列表，例如 GET/pods 返回一个 Pod 资源列表。</p>
<p>（2） POST/资源名的复数格式&gt;：创建一个资源，该资源来自用户提供的JSON对象。</p>
<p>（3）GET/&lt;资源名复数格式&gt;/名字&gt;：通过给出的名称（Name）获得单个资源，例如 GET Ipods/first 返回一个名称为 “first” 的Pod。</p>
<p>（4） DELETE /资源名复数格式&gt;/名字&gt;：通过给出的名字删除单个资源，在删除选项 （DeleteOptions）中可以指定优雅删除（Grace Deletion）的时间（GracePeriodSeconds），该可选 项表明了从服务端接收到删除请求到资源被删除的时间间隔（单位为秒）。不同的类别（Kind） • 254•</p>
<h2>第 268 页</h2>
<h3>第4章 Kubernetes 开发指南</h3>
<p>可能为优雅删除时间 （Grace Period）申明默认值。用户提交的优雅删除时间将覆盖该默认值， 包括值为0的优雅删除时间。</p>
<p>（5） PUT /资源名复数格式＞/名字&gt;：通过给出的资源名和客户端提供的JSON 对象来更 新或创建资源。</p>
<p>（6） PATCH /资源名复数格式＞/名字&gt;：选择修改资源详细指定的域。</p>
<p>对于PATCH 操作，目前 Kubernetes APT 通过相应的HTTP 首部“Content-Iype”对其进行识别。</p>
<p>目前支持以下三种类型的 PATCH操作。</p>
<p>（1） JSON Patch, Content-Type: application/json-patchtjson。在 RFC6902 的定义中，JSON Patch 是执行在资源对象上的一系列操作，例如｛op”： &quot;add&quot;，&quot;path”&quot;： &quot;/a/b/c&quot;， &quot;value&quot;： ［&quot;foo&quot;， &quot;bar&quot;］｝。</p>
<p>详情请查看 RFC6902 说明，网址 HTTPs://tools.ietf.org/html/rfc6902。</p>
<p>（2） Merge Patch, Content-Type: application/merge-json-patchtjson。在 RFC7386 的定义中， Merge Patch 必须包含对一个资源对象的部分描述，这个资源对象的部分描述就是一个 JSON 对 象。该 JSON 对象被提交到服务端，并和服务端的当前对象合并，从而创建一个新的对象。详 情请查看 RFC73862 说明，网址为 HTTPs://tools.ietf.org/html/rfc7386。</p>
<p>（3） Strategic Merge Patch, Content-Type: application/strategic-merge-patchtjson。 Strategic Merge Patch 是一个定制化的 Merge Patch 实现。接下来将详细讲解 Strategic Merge Patch。</p>
<p>在标准的 JSON Merge Patch 中，JSON 对象总是被合并（merge）的，但是资源对象中的列表 域总是被替换的。通常这不是用户所希望的。例如，我们通过下列定义创建一个 Pod 资源对象：</p>
<p>spec：</p>
<p>containers：</p>
<p>- name: nginx</p>
<p>image: nginx-1.0</p>
<p>接着我们希望添加一个容器到这个 Pod 中，代码和上传的JSON 对象如下所示：</p>
<p>PATCH /api/v1/namespaces/default/pods/pod-name spec：</p>
<p>containers：</p>
<p>- name: log-tailer image: log-tailer-1.0 如果我们使用标准的 Merge Patch，则其中的整个容器列表将被单个的“log-tailer”容器所 替换。然而我们的目的是两个容器列表能够合并。</p>
<p>为了解决这个问题，Strategic Merge Patch 通过添加元数据到 API 对象中，并通过这些新元 数据来决定哪个列表被合并，哪个列表不被合并。当前这些元数据作为结构标签，对于 API 对 象自身来说是合法的。对于客户端来说，这些元数据作为 Swagger anotations 也是合法的。在 • 255•</p>
<h2>第 269 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 上述例子中，向“containers”中添加“patchStrategy”域，且它的值为“merge”，通过添加 “patchMergeKey”，它的值为“name”。也就是说，“containers”中的列表将会被合并而不是替 换，合并的依据为“name”域的值。</p>
<p>此外，Kubernetes API 添加了资源变动的“观察者”模式的API接口。</p>
<p>◎</p>
<p>GET/watch/&lt;资源名复数格式&gt;：随时间变化，不断接收一连串的JSON 对象，这些JSON 对象记录了给定资源类别内所有资源对象的变化情况。</p>
<p>GET/watch/&lt;资源名复数格式&gt;/&lt;name&gt;：随时间变化，不断接收一连串的JSON 对象， 这些 JSON 对象记录了某个给定资源对象的变化情况。</p>
<p>上述接口改变了返回数据的基本类别，watch 动词返回的是一连串的JSON 对象，而不是单 个的JSON 对象。并不是所有的对象类别都支持“观察者”模式的API 接口，在后续的章节中 将会说明哪些资源对象支持这种接口。</p>
<p>另外，Kubernetes 还增加了 HTTP Redirect 与HTTP Proxy这两种特殊的API接口，前者实 现资源重定向访问，后者则实现 HTTP 请求的代理。</p>
<h3>4.2.4 API 响应说明</h3>
<p>API Server 响应用户请求时附带一个状态码，该状态码符合 HTTP 规范。表4.1 列出了 API Server 可能返回的状态码。</p>
<p>表4.1 API Server 可能返回的状态码 状态码</p>
<p>200</p>
<p>201</p>
<p>204</p>
<p>307</p>
<p>400</p>
<p>401</p>
<p>编</p>
<p>码</p>
<p>OK</p>
<p>Created</p>
<p>NoContent</p>
<p>TemporaryRedirect</p>
<p>BadRequest</p>
<p>Unauthorized</p>
<p>描述</p>
<p>403</p>
<p>404</p>
<p>405</p>
<p>Forbidden</p>
<p>NotFound</p>
<p>MethodNotAllowed</p>
<p>表明请求完全成功</p>
<p>表明创建类的请求完全成功</p>
<p>表明请求完全成功，同时 HTTP 响应不包含响应体。</p>
<p>在响应 OPTIONS 方法的 HTTP 请求时返回 表明请求资源的地址被改变，建议客户端使用 Location 首部给出的临时 URL 来定位资源 表明请求是非法的，建议客户不要重试，修改该请求 表明请求能够到达服务端，且服务端能够理解用户请求，但是拒绝做更多的事情， 因为客户端必须提供认证信息。如果客户端提供了认证信息，则返回该状态码，表 明服务端指出所提供的认证信息不合适或非法 表明请求能够到达服务端，且服务端能够理解用户请求，但是拒绝做更多的事情， 因为该请求被设置成拒绝访问。建议客户不要重试，修改该请求 表明所请求的资源不存在。建议客户不要重试，修改该请求 表明请求中带有该资源不支持的方法。建议客户不要重试，修改该请求 • 256•</p>
<h2>第 270 页</h2>
<h3>第4章</h3>
<p>Kubernetes 开发指南</p>
<p>续表</p>
<p>状态码</p>
<p>409</p>
<p>422</p>
<p>429</p>
<p>编</p>
<p>码</p>
<p>Conflict</p>
<p>UnprocessableEntity TooManyRequests</p>
<p>500</p>
<p>InternalServerError 503</p>
<p>504</p>
<p>ServiceUnavailable ServerTimeout</p>
<p>描述</p>
<p>表明客户端尝试创建的资源已经存在，或者由于冲突请求的更新操作不能被完成 表明由于所提供的作为请求部分的数据非法，创建或修改操作不能被完成 表明超出了客户端访问频率的限制或者服务端接收到多于它能处理的请求。建议客 户端读取相应的 Retry-After 首部，然后等待该首部指出的时间后再重试 表明服务端能被请求访问到，但是不能理解用户的请求；或者服务端内产生非预期 中的一个错误，而且该错误无法被认知；或者服务端不能在一个合理的时间内完成 处理（这可能由于服务器临时负载过重造成或者由于和其他服务器通信时的一个临 时通信故障造成）</p>
<p>表明被请求的服务无效。建议客户不要重试修改该请求 表明请求在给定的时间内无法完成。客户端仅在为请求指定超时（Timeout）参数时 会得到该响应</p>
<p>在调用 API 接口发生错误时，Kubernetes 将会返回一个状态类别（Status Kind）。下面是两 种常见的错误场景：</p>
<p>（1） 当一个操作不成功时（例如，当服务端返回一个非2xx HTTP 状态码时）；</p>
<p>（2） 当一个 HTTP DELETE 方法调用失败时。</p>
<p>状态对象被编码成JSON 格式，同时该JSON 对象被作为请求的响应体。该状态对象包含 人和机器使用的域，这些域中包含来自 API 的关于失败原因的详细信息。状态对象中的信息补 充了对 HTTP 状态码的说明。例如：</p>
<p>s curl -v -k -H &quot;Authorization: Bearer WhCDvq4VPpYhrcfmE6ei7V9qlbqTubuc&quot; HTTPs://10.240.122.184:443/api/v1/namespaces/default/pods/grafana &gt; GET /api/v1/namespaces/default/pods/grafana HTTP/1.1 &gt; User-Agent: cur1/7.26.0 &gt;Host: 10.240.122.184 &gt; Accept： */*</p>
<p>&gt; Authorization: Bearer WhCDvq4VPpYhrcfmF6ei7V9qlbqTubUc &gt;</p>
<p>&lt; HTTP/1.1 404 Not Found &lt; Content-Type: application/json &lt; Date: Wed, 20 May 2015 18:10:42 GMT &lt; Content-Length: 232 &quot;kind&quot;：&quot;Status&quot;，</p>
<p>&quot;apiVersion&quot; ： &quot;vl&quot;， &quot;metadata&quot;：｛｝，</p>
<p>&quot;status&quot; ： &quot;Failure&quot;， &quot;message&quot;：&quot;pods \&quot;grafana \&#x27;not. found&quot;， • 257•</p>
<h2>第 271 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） ｝</p>
<p>&quot;reason&quot;： &quot;NotFound&quot;， &quot;details&quot;：｛</p>
<p>&quot;name&quot;：&quot;grafana&quot;，</p>
<p>&quot;kind&quot;：&quot;pods&quot;</p>
<p>｝</p>
<p>&quot;code&quot;：404</p>
<p>“status”域包含两个可能的值：Success 和 Failure。</p>
<p>“message”域包含对错误的可读描述。</p>
<p>“reason”域包含说明该操作失败原因的可读描述。如果该域的值为空，则表示该域内 没有任何说明信息。“reason”域澄清 HTTP 状态码，但没有覆盖该状态码。</p>
<p>“details”可能包含和 “reason”域相关的扩展数据。每个“reason”域可以定义它的扩 展的“details”域。该域是可选的，返回数据的格式是不确定的，不同的reason 类型返 回的“details” 域的内容不一样。</p>
<p>4.3</p>
<p>使用Java 程序访问 Kubernetes API 本节介绍如何使用 Java 程序访问 Kuberetes API。在 Kubernetes 的官网上列出了多个访问 Kubernetes API 的开源项目，其中有两个是用Java 语言开发工具的开源项目，一个是OSGI，另一 个是 Fabric8。在本节所列的两个 Java 开发例子中，一个是基于 Jersey 的，另一个是基于 Fabric8 的。</p>
<h3>4.3.1 Jersey</h3>
<p>Jersey 是一个 RESTful 请求服务 JAVA 框架。与 Struts 类似，它可以和 Hibernate、Spring 框架整合。通过它不仅方便开发 RESTful Web Service，而且可以将它作为客户端方便地访问 RESTful Web Service 服务端。</p>
<p>如果没有一个好的工具包，则开发一个能够用不同的媒介（Media）类型无缝地暴露你的数 据，以及很好地抽象客户、服务端通信的底层通信的 RESTful Web Services，会很不容易。为了 能够简化用 Java开发 RESTful Web Service 及其客户端的流程，业界设计了 JAX-RS API。Jersey RESTful Web Services 框架是一个开源的高质量的框架，它为用JAVA 语言开发 RESTful Web Service 及其客户端而生，支持 JAX-RS APIs。Jersey 不仅支持JAX-RS APIs，而且在此基础上 扩展了 API 接口，这些扩展更加方便和简化了 RESTful Web Services 及其客户端的开发。</p>
<p>由于 Kuberetes API Server 是 RESTful Web Service，因此此处选用 Jersey 框架开发 RESTful • 258•</p>
<h2>第 272 页</h2>
<h3>第4章 Kubernetes 开发指南</h3>
<p>2015/9/13 11:10</p>
<p>2015/9/13 11:09</p>
<p>2015/9/13 11:10</p>
<p>2015/2/11 5:41</p>
<p>2015/2/11 5:41</p>
<p>2015/2/11 5:41</p>
<p>2015/2/11 5:41</p>
<p>2015/2/11 5:41</p>
<p>2015/2/11 5:41</p>
<p>2015/2/11 5:41</p>
<p>Web Service 客户端，用来访问 Kubernetes API。在本例中选用的 Jersey 框架的版本为1.19，所 涉及的Jar 包如图4.6所示。</p>
<p>細commons-codec-1.2jar commons-httpchient-3.1.jar commons-logging-1.0.4.jar Ljackson-core-asl-1.9.2.jar 區 jackson-jaxrs-1.9.2.jar 函 jackson-mapper-asl-1.9.2.jar jackson-XC-1.9.2jar jersey-apache-cient-1.19.jar jersey-atom-abdera-1.19.jar 通 jersey-client-1.19jar jersey-core-1.19.jar 圖 jersey-guice-1.19.jar L jersey-json-1.19.jar 區jersey-mutipart-1.19jar jersey-server-1.19jar 圖jersey-servlet-1.19.jar jersey-simple-server-1.19.jar 通 jersey-spring-1.19jar Ljettison-1.1.jar</p>
<p>L jst311-api-1.1.1jar 绝 oauth-chient-1.19.jar 圖 oauth-server-1.19.jar 通 oauth-signature-1.19jar 2015/2/11 5:41</p>
<p>2015/2/11 5:41</p>
<p>2015/2/11 5:41</p>
<p>2015/2/11 5:41</p>
<p>2015/2/11 5:41</p>
<p>2015/2/11 5:41</p>
<p>2015/2/11 5:41</p>
<p>2015/2/11 5:41</p>
<p>2015/2/11 5:41</p>
<p>2015/2/11 5:41</p>
<p>2015/2/11 5:41</p>
<p>2015/2/11 5:41</p>
<p>2015/2/11 5:41</p>
<p>Executable Jar File Executable Jar File Executable Jar File Executable Jar File Executabie Jar File Executable Jar File Executable Jar File Executable Jar File Executable Jar File Executable Jar File Executable Jar File Executable Jar File Executable Jar File Executable Jar File Executable Jar File Executable Jar File Executable Jar File Executable Jar File Executable Jar File Executable Jar Fitle Executable Jar File Executable Jar File Executable Jar File 30 KB</p>
<p>298 KB</p>
<p>38 KB</p>
<p>223 KB</p>
<p>18 KB</p>
<p>748 KB</p>
<p>27 KB</p>
<p>22 K8</p>
<p>20 KB</p>
<p>131 KB</p>
<p>427 KB</p>
<p>16 KB</p>
<p>162 KB</p>
<p>53 KB</p>
<p>687 KB</p>
<p>126 KB</p>
<p>12 KB</p>
<p>18 KB</p>
<p>67 KB</p>
<p>46 KB</p>
<p>15 KB</p>
<p>30 KB</p>
<p>24 KB</p>
<p>图4.6 本例所涉及的Jar 包</p>
<p>对 Kubernetes API 的访问包含如下三个方面。</p>
<p>（1）指明访问资源的类型。</p>
<p>（2）访问时的一些选项（参数），比如命名空间、对象的名称、过滤方式（标签和域）、子 目录、访问的目标是否是代理和是否用watch 方式访问等。</p>
<p>（3）访问的方法，比如增、删、改、查。</p>
<p>在使用 Jersey 框架访问 Kubernetes API 之前，为这三个方面定义了三个对象。第1个定义 的对象 ResourceType，它定义了访问资源的类型；第2个定义的对象是Params，它定义了访 问 API 时的一些选项，以及通过这些选项如何生成完整的 URI；第3个定义的对象是 RestfulClient，它是一个接口，该接口定义了访问API 的方法（Method）。</p>
<p>ResourceType 是一个 ENUM 类型的对象，定义了16种资源，代码如下：</p>
<p>package com.hp.k8s.apiclient.imp；</p>
<p>• 259•</p>
<h2>第 273 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） public enum ResourceType｛ NODES （&quot;nodes&quot;&#x27;），</p>
<p>NAMESPACES（&quot;namespaces&quot;！）， SERVICES（&quot;services&quot;）， REPLICATIONCONTROLLERS （&quot;replicationcontrollers&quot;）， PODS（&quot;pods&quot;），</p>
<p>BINDINGS （&quot;bindings&quot;）， ENDPOINTS（&quot;endpoints&quot;）， SERVICEACCOUNTS （&quot;serviceaccounts&quot;）， SECRETS（&quot;&#x27;secrets&quot;）， EVENTS （&quot;events&quot;）， COMPOMENTSTATUSES（&quot;&#x27;componentstatuses&quot;）， LIMITRANGES（&quot;1imitranges&quot;）， RESOURCEQUOTAS（&quot;resourcequotas&quot;）， PODTEMPLATES（&quot;podtemplates&quot;）， PERSISTENTVOLUMECLAIMS （&quot;persistentvolumeclaims&quot;）； PERSISTENTVOLUMES （&quot;persistentvolumes&quot;）；</p>
<p>private String</p>
<p>type；</p>
<p>private ResourceType （String type） ｛</p>
<p>this.type = type；</p>
<p>｝</p>
<p>public String getrype （）｛ return type：</p>
<p>｝</p>
<p>｝</p>
<p>Params 对象的代码如下：</p>
<p>package com.hp.k8s.apiclient.imp；</p>
<p>import java.io.UnsupportedEncodingException；</p>
<p>import java.net.URLEncoderi import java.util.List；</p>
<p>import java .util .Map；</p>
<p>import org.apache.logging.log4j.LogManager：</p>
<p>import org.apache.logging.log4j.Logger；</p>
<p>public class Params ｛ private static final Logger LOG = LogManager.getLogger（Params.class.getName （））；</p>
<p>private String namespace = nulli private String name = null；</p>
<p>private MapsString, String&gt; fields = null；</p>
<p>private MapsString, String&gt; labels = null；</p>
<p>private Map&lt;String, String&gt; notLabels = null；</p>
<p>private Map&lt;String, List&lt;String&gt;&gt; inLabels = null；</p>
<p>• 260</p>
<h2>第 274 页</h2>
<h3>第4 章 Kubernetes 开发指南</h3>
<p>private Map&lt;String, List&lt;String&gt;&gt; notInLabels = null；</p>
<p>private String json = null；</p>
<p>private ResourceType resourceType = null；</p>
<p>private String subPath = null；</p>
<p>private boolean isVisitProxy = false：</p>
<p>private boolean isSetWatcher = false；</p>
<p>public String buildPath（）｛ StringBuilder result = （isVisitProxy ? new StringBuilder（&quot;/proxy&quot;） ：（isSetWatcher ?new StringBuilder（&quot;/watch&quot;）：new StringBuilder （&quot;&quot;）））；</p>
<p>if （nul1 ！= namespace） result.append（&quot;/namespaces/&quot;）.append （namespace）；</p>
<p>result.append（&quot;/&quot;）.append （resourceType.getType （））；</p>
<p>if （null ！= name）</p>
<p>result.append （&quot;/&quot;）.append （name）；</p>
<p>if（nul1！=subPath）</p>
<p>result.append （&quot;/&quot;）.append （subPath）；</p>
<p>if （nul1！= labels &amp;&amp;！labels.isEmpty（） 11 null ！= notLabels &amp;&amp; ！notLabels.</p>
<p>isEmpty （）</p>
<p>11 nul1！= inlabels &amp;&amp; inlabels.size（）&gt;0 || null ！= notInLabels &amp;&amp; notInLabels.size（）&gt;0 I| nul1 ！= fields &amp;&amp; fields.size（）&gt;0）｛ StringBuilder labelSelectorStr = null；</p>
<p>StringBuilder fieldSelectorStr = null；</p>
<p>try｛</p>
<p>labelSelectorStr = builderLabelSelector （）；</p>
<p>fieldSelectorStr = builderFiledSelector （）；</p>
<p>｝ catch（UnsupportedEncodingException el）｛ LOG.error （e1）；</p>
<p>｝</p>
<p>if （labelSelectorStr.length（）+ fieldSelectorstr.length（）&gt;0） result.append （&quot;？&quot;）；</p>
<p>（labelSelectorStr. length （）&gt;0）｛ result.append（&quot;labelSelector=&quot;）. append（labelSelectorStr.</p>
<p>toString （））；</p>
<p>if（fieldSelectorStr.length（）&gt;0）｛ result.append（&quot;， &quot;）；</p>
<p>｝</p>
<p>｝</p>
<p>if （fieldSelectorstr.length（）&gt;0）｛ result.append （&quot;fieldSelector=&quot;）.append （fieldSelectorStr.</p>
<p>toString （））；</p>
<p>• 261•</p>
<h2>第 275 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 买践全接触（第2版） ｝</p>
<p>｝</p>
<p>return result.toString（）；</p>
<p>｝</p>
<p>private StringBuilder builderLabelSelector （） throws UnsupportedEncoding Exception ｛</p>
<p>StringBuilder result = new StringBuilder （）；</p>
<p>if （nul1 ！= labels） ｛</p>
<p>for（String key : labels.keySet （））｛ if （result.length（）&gt;0）｛ result.append（&quot;， &quot;）；</p>
<p>｝</p>
<p>result.append （URLEncoder.encode （key + &quot;=&quot; + labels.get （key）， &quot;GBK&quot;））；</p>
<p>｝</p>
<p>｝</p>
<p>if（nul1 ！= notLabels）｛ for （String key :labels.keySet （））｛ if （result.length（）&gt;0）｛ result.append （&quot;， &quot;）；</p>
<p>｝</p>
<p>result.append （URLEncoder.encode （key + &quot;！=&quot; + labels.get （key）， &quot;GBK&quot;））；</p>
<p>｝</p>
<p>｝</p>
<p>i£ （nul1 ！= inLabels）｛ （String key ： inlabels.keySet （））｛ if （result.length （）&gt; 0） result.append （URLEncoder.encode （&quot;， &quot; ，&quot;GBK&quot;））；</p>
<p>result.append（URLEncoder.encode（key + &quot; in （&quot; + listToString （inLabels.get（key），&quot;， &quot;）+ &quot;）&quot;、&quot;GBK&quot;））；</p>
<p>if（null ！= notInLabels）｛ for</p>
<p>（String key : inLabels.keySet （））｛ if （result.length （）&gt;0） result.append（URLEncoder.encode （&quot;， &quot;， &quot;GBK&quot;））；</p>
<p>｝</p>
<p>• 262•</p>
<h2>第 276 页</h2>
<h3>第4章 Kubernetes 开发指南</h3>
<p>（inlabels.get （key）、&quot;， &quot;） ｝</p>
<p>result.append（URLEncoder.encode （key + &quot; notin （&quot; + listroString +&quot;）”、&quot;GBK&quot;））；</p>
<p>｝</p>
<p>LOG.info （&quot;label result：</p>
<p>&quot;+ result）；</p>
<p>return result；</p>
<p>｝</p>
<p>private StringBuilder builderFiledSelector（）throws UnsupportedEncoding Exception｛</p>
<p>StringBuilder result = new StringBuilder （）；</p>
<p>if （null！= fields） for（String key :fields.keySet （））｛ if （result.length（）&gt;0）｛ result.append（&quot;， &quot;） ；</p>
<p>｝</p>
<p>result.append （URLEncoder.encode （key + &quot;=&quot; + fields.get （key）， &quot;GBK&quot;））；</p>
<p>｝</p>
<p>｝</p>
<p>return result；</p>
<p>｝</p>
<p>private String listToString（List&lt;String&gt; list,String delim） ｛ boolean isFirst = true：</p>
<p>StringBuilder result StringBuilder （）；</p>
<p>for（String str :list）｛ if （isFirst）</p>
<p>result.append （str）；</p>
<p>isFirst = false：</p>
<p>result.append （delim）.append （str）；</p>
<p>｝</p>
<p>｝</p>
<p>return result.toString（）；</p>
<p>public String getNamespace （）｛ return namespace；</p>
<p>｝</p>
<p>｝</p>
<p>public void setNamespace （String namespace）｛</p>
<p>this.namespace = namespace；</p>
<p>• 263•</p>
<h2>第 277 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） public String getName （）｛ return name；</p>
<p>public void setName （String name） this.name = name；</p>
<p>public Map&lt;string,String&gt; getFields（）｛ return fields；</p>
<p>public void setFields （Map&lt;string,String&gt; fields） this.fields = fields；</p>
<p>Public Map&lt;string,string&gt; getLabels（）｛ return labels；</p>
<p>public void setLabels （Map&lt;String,String&gt; labels） this.labels = labels；</p>
<p>Public String getJson（）｛ return jsoni</p>
<p>public void setJson （String json）1 this.json = jsoni</p>
<p>public Resourcerype getResourcerype （） return resourceTypei •</p>
<p>public String getsubPath（） return subPath；</p>
<p>｝</p>
<p>｝</p>
<p>｝</p>
<p>｝</p>
<p>｝</p>
<p>｝</p>
<p>｝</p>
<p>｝</p>
<p>｝</p>
<p>｝</p>
<p>｝</p>
<p>｝</p>
<p>public void setResourceType （ResourceType resourceType）｛</p>
<p>this.resourceType = resourceType；</p>
<p>public void setSubPath （String subPath）</p>
<p>｛</p>
<p>• 264</p>
<h2>第 278 页</h2>
<h3>第4章 Kubernetes 开发指南</h3>
<p>this.subPath = subPath；</p>
<p>public boolean isSetWatcher（）｛ return isSetWatcher；</p>
<p>public void setsetWatcher （boolean isSetwatcher） this.isSetWatcher</p>
<p>= isSetWatcher；</p>
<p>public Map&lt;String,List&lt;String&gt;&gt; getNotInlabels（）｛ return notInLabels；</p>
<p>｝</p>
<p>｝</p>
<p>｝</p>
<p>｝</p>
<p>｝</p>
<p>｝</p>
<p>｝</p>
<p>｝</p>
<p>｝</p>
<p>｝</p>
<p>｝</p>
<p>public boolean</p>
<p>isVisitProxy（）｛</p>
<p>return isVisitProxy；</p>
<p>public void setVisitProxy（boolean isVisitProxy） this.isVisitProxy = isVisitProxy；</p>
<p>public Map&lt;String, String&gt; getNotLabels（）｛ return notLabels；</p>
<p>public void setNotLabels （Map&lt;String, String&gt; notLabels） ｛ this.notLabels = notLabels；</p>
<p>public Map&lt;String, List&lt;String&gt;&gt; getInLabels（）｛ return inLabels；</p>
<p>public void setInLabels （Map&lt;String, List&lt;String&gt;&gt; inLabels）｛ this.inLabels = inLabels；</p>
<p>public void setNotInLabels （Map&lt;String, List&lt;String&gt;&gt; notInLabels） this.not InLabels = notInLabels；</p>
<p>｝</p>
<p>Params 对象包含的属性说明如表4.2所示。</p>
<p>• 265</p>
<h2>第 279 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 表4.2 Params 对象包含的属性列表 属</p>
<p>性</p>
<p>namespace</p>
<p>name</p>
<p>fields</p>
<p>labels</p>
<p>说</p>
<p>明</p>
<p>String 类型属性，指明资源所在的命名空间，如果没有指定该值，则表明访问所有命名空间下的资源对象 String 类型属性，在访问单个资源对象时使用，如果没有指定该值，则表明访问该类资源列表 Map&lt;String, String&gt;类型属性，通过资源对象的域值过滤访问结果 Map&lt;String,String&gt;类型属性，通过指定的标签选择器列表来选择资源对象。选择出的资源对象包含标签列表中 所列的标签（即 Map 的key），且所选资源的标签的value 和标签列表中的value 值（即 Map 的value）相等 notLabels</p>
<p>Map&lt;String,String&gt;类型属性，通过指定的标签选择器列表来选择资源对象。选择出的资源对象包含标签列表中 所列的标签（即Map 的key），且所选资源的标签的 value 和标签列表中的value 值（即 Map 的 value）不相等 inLabels</p>
<p>Map&lt;String, List&lt;String&gt;&gt;类型属性，通过指定的标签选择器列表来选择资源对象。Map 对象的key 值为标 签名称，Map 对象的value 值为该标签可能包含的值 notlnLabels</p>
<p>Map&lt;String, List&lt;String&gt;&gt;类型属性，通过指定的标签选择器列表来选择资源对象。Map 对象的 key 值为标签 名称，Map 对象的value 值为列表，表明资源对象包含和key 值同名的标签，且这些标签的值不在该列表中 JSOn</p>
<p>resourceType</p>
<p>subPath</p>
<p>is VisitProxy</p>
<p>isSet Watcher</p>
<p>String 类型属性，在创建或修改资源对象时使用，用于向 API Server 提供资源对象的定义 ResourceType 类型属性，用于指明访问资源对象的类型 String 类型属性，用于指明访问资源的子目录 Boolean 类型属性，用于指明是否通过 Proxy 的方式访问资源对象 Boolean 类型属性，表明是否通过Watcher 方式访问资源对象 Params 的 buildPath 方法用于构建访问 URL 的完整路径。</p>
<p>接口对象 RestfulClient 定义了访问 API 接口的所有方法（Method），其代码列表如下：</p>
<p>package com.hp.k8s.apiclient；</p>
<p>import com.hp.k8s.apiclient.imp.Params；</p>
<p>public interface RestfulClient｛ Public String get （Params params）；//获得单个资源对象 public String</p>
<p>list （Params params）； //获得资源对象列表 public String create （Params params）；1/创建资源对象 public String delete （Params params）； //删除某个资源对象 public String update （Params params）；//部分更新某个资源对象 public String updatewithMediarype （Params params, String mediarype）；//通过 mediaType，实现 Merge public String replace （Params params）；</p>
<p>// 替换某个资源对象</p>
<p>public String options （Params params）；</p>
<p>public String head （Params params）；</p>
<p>｝</p>
<p>｝</p>
<p>其中 get 和 list 方法对应 Kubemnetes API 的GET 方法；create 方法对应 API 中的POST 方法；</p>
<p>delete 方法对应 API 中的 DELETE 方法：update 方法对应 API 中的 PATCH 方法；replace 方法 对应 API 中的 PUT 方法；options 方法对应 API 中的 OPTIONS 方法：head 方法对应 API 中的 • 266•</p>
<h2>第 280 页</h2>
<h3>第4章</h3>
<p>Kubernetes 开发指南</p>
<p>HEAD方法。</p>
<p>该接口的基于 Jersey 框架的实现类如下所示：</p>
<p>package com.hp.k8s.apiclient.imp；</p>
<p>import javax.ws.rs.core.MediaType；</p>
<p>import org.apache.logging.log4j.LogManager；</p>
<p>import org.apache.logging.log4j.Logger：</p>
<p>import com.hp.k8s.apiclient.RestfulClient；</p>
<p>import com.sun.jersey.api.client.Clienti import com.sun.jersey.api.client.WebResource；</p>
<p>import com.sun.jersey.api.client.config.DefaultClientConfig；</p>
<p>import com.sun.jersey.client.urlconnection.URLConnectionClientHandler；</p>
<p>public class JerseyRestfulClient implements RestfulClient｛ private static final Logger LOG = LogManager.getLogger （RestfulClient.</p>
<p>Class.getName （） ）；</p>
<p>private static final String METHOD_PATCH = &quot;PATCH&quot; ；</p>
<p>private String baseUrl = null；</p>
<p>Client _client = null；</p>
<p>public JerseyRestfulClient（String baseUrl）｛ DefaultClientConfig config = new DefaultClientConfig （）；</p>
<p>config.getProperties （）.put （URLConnectionClientHandler.PROPERTY_HTTP_ URL_CONNECTION</p>
<p>_SET_NETHOD_WORKAROUND,true）；</p>
<p>_client = Client.create （config）；</p>
<p>this._baseUrl = baseUrl；</p>
<p>Coverride</p>
<p>public String get （Params params）｛ WebResource resource = _client.resource （_baseurl + params.buildPath （））；</p>
<p>String response = resource.accept （Mediarype.APPLICATTON_JSON_TYPE）• get （String.class）i LOG.info（&quot;Get one resource： \n&quot; + response）；</p>
<p>return</p>
<p>response：</p>
<p>｝</p>
<p>COverride</p>
<p>public String list （Params params）｛ WebResource resource = _client.resource （_baseUrl + params.buildPath （））；</p>
<p>• 267</p>
<h2>第 281 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） LOG.info （&quot;URL： &quot;</p>
<p>baseUrl + params.buildPath （））；</p>
<p>String</p>
<p>response = resource.accept （MediaType.APPLICATTON_ JSON_TYPE）• get （String.class）；</p>
<p>return response；</p>
<p>｝</p>
<p>@Override</p>
<p>public String create（Params params）｛ WebResource resource = -client.resource （_baseUrl + params.buildPath（））；</p>
<p>LOG.info （&quot;URL： &quot;+ _baseUrl + params.buildPath （））；</p>
<p>LOG.info （&quot;Create resource： &quot; + params.getJson （））；</p>
<p>String response = （null == params .getJson （） ） ？ resource.accept （MediaType. APPLICATION_JSON） .post （String.class） ：resource.type （MediaType.APPLICATION_ JSON）.accept （Mediarype.</p>
<p>APPLICATION_JSON）•Post （String.class， params .getJson （））；</p>
<p>return response；</p>
<p>｝</p>
<p>@Override</p>
<p>public String delete （Params params）｛ WebResource resource _client.resource （_baseUrl + params.buildPath （））；</p>
<p>String response = resource.accept （MediaType.APPLICATTON_JSON_TYPE）• delete （String.class）i LOG.info（&quot;Detelet resource &quot;+ params.getResourceType（）.getType（）+ &quot;/&quot; + params.getName （）+ &quot; result：\n&quot;</p>
<p>+ response）i</p>
<p>return response；</p>
<p>｝</p>
<p>COverride</p>
<p>public String update （Params params）｛ return updatewithMediaType （params, MediaType.APPLICATTON_JSON）：</p>
<p>COverride</p>
<p>public String updateWithMediarype （Params params, String mediarype）｛ WebResource resource = -client.resource （_baseUrl + params.buildPath（））；</p>
<p>LOG.info （&quot;URL： &quot; + _baseUrl + params.buildPath（））；</p>
<p>LOG.info（&quot;Patch resource： &quot; + params.getJson （））；</p>
<p>String response = resource.type （mediaType）.accept （MediaType.APPLICATION_ JSON_TYPE）.method （METHOD_PATCH, String.class， params.getJson（））；</p>
<p>LOG.info （&quot;Update resource &quot;+ params.buildPath（）+ &quot;result：\n&quot; + • 268 •</p>
<h2>第 282 页</h2>
<h3>第4章</h3>
<p>Kubernetes 开发指南</p>
<p>response）；</p>
<p>return response；</p>
<p>cOverride</p>
<p>public String replace （Params params） WebResource resource = _client.resource （_baseUrl + params.buildPath（））；</p>
<p>LOG.info（&quot;URL：&quot; + _baseUrl + params.buildPath （））；</p>
<p>LOG.info （&quot;Replace resource： &quot; + params.getJson （））；</p>
<p>String response = resource.type （Mediarype. APPLICATION_ JSON_TYPE）.accept （MediaType.APPLICATION_JSONLTYPE） •put （String.class,params.getJson （））；</p>
<p>LOG.info（&quot;Replace resource &quot; + params.buildPath（）+ &quot;result：\n&quot; + response）；</p>
<p>return responsei</p>
<p>｝</p>
<p>eOverride</p>
<p>public String options （Params params）｛ WebResource resource =_client.resource （_baseUrl + params.buildPath（））；</p>
<p>String response = resource.type （MediaType.APPLICATION_ JSON_TYPE）.accept （Mediarype.TEXT_PLAIN_TYPE） •options （String.class）；</p>
<p>LOG.info （&quot;Get options for resource &quot; + params.getResourceType （）. getType （） + &quot;/&quot;+ params.getName （） + &quot; result：\n&quot; + response）；</p>
<p>return response；</p>
<p>｝</p>
<p>eOverride</p>
<p>public String head （Params params） WebResource resource = -client.resource （_baseUrl + params.buildPath（））；</p>
<p>String response = resource.accept （Mediarype.TEXT_PLAIN_TYPE）.head（）.</p>
<p>getResponseStatus （）.toString （）；</p>
<p>LOG.into（&quot;Get head for resource + params.getResourceType（）.getType（）+ &quot;/&quot;+ params.getName（）+ &quot;result：\n&quot; + response）；</p>
<p>return</p>
<p>response：</p>
<p>eoverride</p>
<p>public void close （）｛ _client.destroy （）i • 269•</p>
<h2>第 283 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） ｝</p>
<p>｝</p>
<p>该对象中包含如下代码：</p>
<p>contig.getProperties（）.Put （URLConnectionClientHandler. PROPERTY_HTTP_ URL_CONN ECTION_SET_ METHOD_WORKAROUND, true）；</p>
<p>该段代码的作用是使Jersey 客户端能够支持除标准 REST方法外的方法，比如PATCH方法。</p>
<p>该段代码能访问除watcher 外的所有 Kubernetes API 接口，在后续的章节中我们会举例说明如何 访问 Kubernetes API.</p>
<h3>4.3.2 Fabric8</h3>
<p>Fabric8 包含多款工具包，Kubernetes Client 只是其中之一，也是Kubernetes 官网中提到的 Java Client API 之一。本例子代码涉及的 Jar 包如图4.7 所示。</p>
<p>Ldnsjava-2.1.7jer</p>
<p>2015/8/31 14:23</p>
<p>Executable Jar File 通fabric8-utils-2222jar 2015/8/31 14:23</p>
<p>Executable Jar File L jackson-annotations-2.6.0.jar 2015/8/31 16:27</p>
<p>Executable Jar File 送 jackson-core-2.6.1.jar 2015/8/31 16:28</p>
<p>Executable Jar File L jackson-databind-2.6.1.jar 2015/8/31 15:56</p>
<p>Executable Jar File 圖 jackson-dataformat yaml-26.1jar 2015/8/31 15:56</p>
<p>Executable Jar File ii jackson-module jaxb-annotations-2.6.0jar 2015/8/31 16:24</p>
<p>Executable Jar File Liison-20141113.jar 2015/8/31 14:23</p>
<p>Executable Jar File Lj kubernetes-api-2.2.22jar 2015/8/31 14:22</p>
<p>Executable Jar File Lkubernetes-dlient-1.3.8jar 2015/8/31 15:37</p>
<p>Executable Jar File Likubernetes-mode -1.0.12jar 2015/8/31 15:56</p>
<p>Executable Jar File Lilog4j-api-2.3jar 2015/8/31 16:18</p>
<p>Executable Jar File 送log4icore-2.3jer</p>
<p>圖log4i-sli4- impi-2.3jar 2015/8/31 15:56</p>
<p>Executable Jar File 2015/8/31 15:56</p>
<p>Executable Jar File 送 oauth-20100527.jar 2015/8/31 15:56</p>
<p>Executable Jar File L） openshift-client-1.3.2jar 2015/8/31 14:23</p>
<p>Executable Jar File Lst4j-api-1.7.12jar 2015/8/31 15:56</p>
<p>Executable Jar File 上j sundr-annotations-0.0.25,jar 2015/8/31 15:56</p>
<p>Executable Jar File validation-api-1.1.0.Final.jar 2015/8/31 14:23</p>
<p>Executable Jar File 301 KB</p>
<p>134 KB</p>
<p>46 KB</p>
<p>253 KB</p>
<p>1,140 K8</p>
<p>313KB</p>
<p>32 KB</p>
<p>64 KB</p>
<p>72 KB</p>
<h3>2.262 KB</h3>
<p>2,308 KB</p>
<p>133 KB</p>
<p>808 KB</p>
<p>23 KB</p>
<p>44 KB</p>
<p>24 KB</p>
<p>32 KB</p>
<p>146 KB</p>
<p>63KB</p>
<p>图4.7 例子代码涉及的 Jar包</p>
<p>因为该工具包已经对访问 Kubernetes API 客户端做了较好的封装，因此其访问代码比较简 单，其具体的访问过程会在后续的章节举例说明。</p>
<p>Fabric 8 的 Kubernetes API 客户端工具包只能访问 Node、Service、Pod、Endpoints、Events、 Namespace、Persistenet Volumeclaims、Persistenet Volume、ReplicationController、ResourceQuota、 Secret 和 ServiceAccount 这几个资源类型，不能使用 OPTIONS 和 HEAD 方法访问资源，且不 能以代理方式访问资源，但其对以 watcher 方式访问资源做了很好的支持。</p>
<p>•270．</p>
<h2>第 284 页</h2>
<h3>第4章</h3>
<p>Kubernetes 开发指南</p>
<h3>4.3.3 使用说明</h3>
<p>首先，举例说明对API 资源的基本访问，也就是对资源的增、删、改、查，以及替换资源的 status。</p>
<p>其中会单独对 Node 和 Pod 的特殊接口做举例说明。表4.3列出了各资源对象的基本 API接口。</p>
<p>表4.3 各资源对象的基本 API接口 资源类型</p>
<p>/api/vl/nodes</p>
<p>获取 Node 列表</p>
<p>|/api/vl/nodes</p>
<p>创建一个 Node 对象</p>
<p>/api/vl/nodes/ fname｝ 删除一个 Node 对象</p>
<p>NODES</p>
<p>方</p>
<p>GET</p>
<p>POST</p>
<p>DELETE</p>
<p>GET</p>
<p>PATCH</p>
<p>PUT</p>
<p>法</p>
<p>URL Path</p>
<p>说</p>
<p>明</p>
<p>备</p>
<p>注</p>
<p>/api/vl/nodes/ fname｝ 获取一个 Node 对象</p>
<p>/api/vl/nodes/ ｛namne｝ 部分更新一个 Node 对象</p>
<p>/api/vl/nodes/｛name｝ 替换一个 Node 对象</p>
<p>NAMESPACES</p>
<p>SERVICES</p>
<p>GET</p>
<p>POsT</p>
<p>DELETE</p>
<p>GET</p>
<p>PATCH</p>
<p>PUT</p>
<p>PUT</p>
<p>PUT</p>
<p>GET</p>
<p>POST</p>
<p>GET</p>
<p>POST</p>
<p>DELETE</p>
<p>GET</p>
<p>PATCH</p>
<p>PUT</p>
<p>/api/Wl/namespaces /api/vl/namespaces /api/vl/namespaces/ ｛name｝ /epi/v J/namespaces/ （name） /api/vI/namespaces/｛name｝ /api/vl/namespaces/fname；</p>
<p>/api/v1/namespaces/｛name｝/finalize /api/v1/namespaces/ ｛name｝ /status 获取 Namespace 列表</p>
<p>创建一个 Namespace 对象</p>
<p>删除一个 Namespace 对象</p>
<p>获取一个 Namespace 对象</p>
<p>部分更新一个 Namespace 对象 替换一个 Namespace 对象</p>
<p>替换一个 Namespace 对象的最终方 在Fabric8 中没有</p>
<p>案对象</p>
<p>实现</p>
<p>在Fabric8 中没有</p>
<p>替换一个 Namespace 对象的状态 实现</p>
<p>lapi/vl/services</p>
<p>//api/vl/services</p>
<p>/api/vI/namespaces/ ｛namespace;/se rvices</p>
<p>获取 Service 列表</p>
<p>创建一个 Service 对象</p>
<p>获取某个 Namespace 下的 Service 列 表</p>
<p>/api/v1/namespaces/ inamespacey/se rvices</p>
<p>在某个 Namespace 下创建列表 /api/vl/namespaces/ fnamespace//se 删除某个 Namespace 下的一个 rvices/｛name｝</p>
<p>Service 对象</p>
<p>/api/vi/namespaces/｛mamespacey/se 获取某个 Namespace 下的一个 rvices/iname）</p>
<p>Service 对象</p>
<p>|/api/v1/namespaces/｛namespace｝/se 部分更新某个 Namespace 下的一个 rvices/｛name｝</p>
<p>Service 对象</p>
<p>/api/vlmnamespaccs/ ｛namespace/se 替换某个 Namespace 下的一个 rvices/｛mame｝</p>
<p>Service 对象</p>
<p>• 271•</p>
<h2>第 285 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 资源类型</p>
<p>续表</p>
<p>注</p>
<p>REPLICATIONC</p>
<p>ONTROLLERS</p>
<p>方</p>
<p>GET</p>
<p>POST</p>
<p>法</p>
<p>GET</p>
<p>POST</p>
<p>DELETE</p>
<p>GET</p>
<p>PATCH</p>
<p>PUT</p>
<p>PODS</p>
<p>GET</p>
<p>POST</p>
<p>GET</p>
<p>POST</p>
<p>DELETE</p>
<p>GET</p>
<p>PATCH</p>
<p>PUT</p>
<p>PUT</p>
<p>POST</p>
<p>GET</p>
<p>POST</p>
<p>URL Path</p>
<p>说</p>
<p>明</p>
<p>/api/vl/replicationcontrollers /api/v1/replicationcontrollers 获取 RC列表</p>
<p>创建一个 RC对象</p>
<p>/api/v1/namespaces/｛mamespace｝/re 获取某个 Namespace 下的RC列表 plicationcontrollers /api/v1/namespaces/｛namespace｝/re 在某个 Namespace 下创建一个 RC plicationcontrollers 对象</p>
<p>/api/wl/namespaces/fmamespace;/re 删除某个 Namespace 下的RC 对象 plicationcontrollers/｛name｝ /api/vl/namespaces/｛namespace;/re plicationcontrollers/（name：</p>
<p>/api/v1/namespaces/｛namespace｝/re plicationcontrollers/（name） 获取某个 Namespace 下的RC对象 部分更新某个 Namespace 下的 RC 对象</p>
<p>/api/vi/namespaces/｛namespace｝/re 替换某个 Namespace 下的RC对象 plicationcontrollers/｛name｝ 备</p>
<p>/api/vI/pods</p>
<p>/api/vl/pods</p>
<p>/api/v1l/namespaces/ ｛namespace;/pods 获取一个 Pod列表</p>
<p>创建一个 Pod 对象</p>
<p>获取某个 Namespace 下的Pod 列表 在某个 Namespace 下创建一个 Pod /api/v1/namespaces/ ｛mamespace;/pods 对象</p>
<p>|/api/1/namespaces/ ｛namespace｝/po 删除某个 Namespace 下的一个 Pod ds/ fname｝</p>
<p>对象</p>
<p>/api/vl/namespaces/｛namespace｝/po 获取某个 Namespace 下的一个 Pod ds/ fname｝</p>
<p>对象</p>
<p>/api/v1/namespaces/ fnamespace｝/po 部分更新某个 Namespace 下的一个 ds/｛name｝</p>
<p>Pod 对象</p>
<p>/api/vl/namespaces/｛mamespace;/po 替换某个 Namespace 下的一个Pod 对 ds/ ｛name｝</p>
<p>象</p>
<p>/api/v1/namespaces/｛namespace｝/po 替换某个 Namespace 下的一个Pod 对 在Fabric8 中没有</p>
<p>ds/ fname｝/status</p>
<p>象状态</p>
<p>实现</p>
<p>/api/vI/namespaces/ ｛mamespace｝/po创建某个 Namespace 下的一个Pod对 在Fabric8 中没有</p>
<p>ds/ fname｝/binding 象的 Binding</p>
<p>实现</p>
<p>/api/vl/namespaces/｛namespace:/po 连接到某个 Namespace 下的一个Pod 在Fabric8 中没有 ds/fname｝/exec</p>
<p>对象，并执行 exec</p>
<p>实现</p>
<p>/api/v1/namespaces/ ｛namespace｝/po 连接到某个 Namespace 下的一个 Pod 在Fabric8 中没有 ds/｛name｝/exec</p>
<p>对象，并执行 exec</p>
<p>实现</p>
<p>• 272•</p>
<h2>第 286 页</h2>
<h3>第4章 Kubernetes 开发指南</h3>
<p>资源类型</p>
<p>BINDINGS</p>
<p>ENDPOINTS</p>
<p>SERVICEACCOU</p>
<p>NTS</p>
<p>方</p>
<p>GET</p>
<p>法</p>
<p>GET</p>
<p>POST</p>
<p>POST</p>
<p>POST</p>
<p>GET</p>
<p>POST</p>
<p>GET</p>
<p>POST</p>
<p>DELETE</p>
<p>GET</p>
<p>PATCH</p>
<p>PUT</p>
<p>TGET</p>
<p>POST</p>
<p>GET</p>
<p>POST</p>
<p>DELETE</p>
<p>GET</p>
<p>续表</p>
<p>注</p>
<p>URL Path</p>
<p>说明</p>
<p>备</p>
<p>/api/v1/namespaces/｛namespace｝/po 连接到某个 Namespace 下的一个 Pod 在Fabric8 中没有 ds/ ｛name｝/og</p>
<p>对象，并获取10g 日志信息</p>
<p>实现</p>
<p>/api/v1/namespaces/ ｛namespace｝/po ，连接到某个 Namespace 下的一个Pod在Fabric8 中没有 ds/ fname//portforward 对象，并实现端口转发</p>
<p>实现</p>
<p>/api/vl/namespaces/ ｛namespace｝/po 连接到某个 Namespace 下的一个 Pod 在Fabric8 中没有 ds/ ｛name｝/portforward 对象，并实现端口转发</p>
<p>实现</p>
<p>/api/v1/bindings</p>
<p>创建一个 Binding 对象</p>
<p>/api/vl/namespaccs/ fnamespace:/bi 在某个 Namespace</p>
<p>下创建一个</p>
<p>ndings</p>
<p>Binding 对象</p>
<p>/api/vl/endpoints</p>
<p>获取 Endpoint 列表</p>
<p>/api/vl/endpoints</p>
<p>创建一个 Endpoint 对象</p>
<p>/api/l/namespaces/ ｛mamespace:/en 获取某个 Namespace 下的 Endpoint dpoints</p>
<p>对象列表</p>
<p>/api/vl/namespaces/｛namespace｝/en 在某个 Namespace 下创建一个 dpoints</p>
<p>Endpoint 对象</p>
<p>/api/vl/namespaces/｛namespace）/en 删除某个 Namespace 下的 Endpoint dpoints/fname｝</p>
<p>对象</p>
<p>/api/v1/namespaces/ ｛namespace｝/en 获取某个 Namespace 下的 Endpoint dpoints/｛name｝</p>
<p>对象</p>
<p>/api/v1/namespaces/（mamespace;/en 部分更新某个 Namespace 下的 dpoints/｛name｝</p>
<p>Endpoint对象</p>
<p>/api/vl/namespaces/｛namespace!/en 替换某个 Namespace 下的 Endpoint dpoints/ fname｝</p>
<p>对象</p>
<p>/api/vl/serviceaccounts 获取 Serviceaccount 列表 api/vl/serviceaccounts 创建一个 Serviceaccount 对象 /api/vl/namespaces/｛namespacey/se 获取某个 Namespace 下的</p>
<p>riceaccounts</p>
<p>Serviceaccount 对象列表 /api/vl/mnamespaces/ ｛namespace;/se 在某个 Namespace 下创建一个 rviceaccounts</p>
<p>Serviceaccount 对象</p>
<p>|/api/v1/namespaces/｛namespace｝/se删除某个 Namespace 下的一个 rviceaccounts/fname｝ Serviceaccount 对象</p>
<p>/api/vl/namespaces/ inamespacey/se 获取某个 Namespace 下的一个 rviceaccounts/｛name｝ Serviceaccount 对象</p>
<p>• 273•</p>
<h2>第 287 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 资源类型</p>
<p>SECRETS</p>
<p>EVENTS.</p>
<p>COMPONENTST</p>
<p>ATUSES</p>
<p>方</p>
<p>PATCH</p>
<p>法</p>
<p>PUT</p>
<p>GET</p>
<p>POST</p>
<p>GET</p>
<p>POST</p>
<p>DELETE</p>
<p>GET</p>
<p>PATCH</p>
<p>PUT</p>
<p>GET</p>
<p>POST</p>
<p>GET</p>
<p>POST</p>
<p>DELETE</p>
<p>GET</p>
<p>PATCH</p>
<p>PUT</p>
<p>GET</p>
<p>GET</p>
<p>URL Path</p>
<p>说明</p>
<p>/api/vl/mnamespaces/ fnamespace）/se 部分更新某个 Namespace 下的一个 rviceaccounts/ fname｝ Serviceaccount 对象</p>
<p>/api/vl/namespaces/｛namespace｝/se 替换某个 Namespace 下的一个 rviceaccounts/｛name｝ Serviceaccount 对象</p>
<p>/api/vl/secrets</p>
<p>/api/wl/secrets</p>
<p>/api/v1/namespaces/ ｛namespace;/se crets</p>
<p>crets</p>
<p>|/api/vl/namespaces/｛namespace｝/se crets/｛name｝</p>
<p>/api/v1/namespaces/｛namespace｝/se crets/ ｛name｝</p>
<p>/api/vl/namespaces/｛namespace）/se crets/ ｛name｝</p>
<p>|/api/v1/namespaces/｛namespace｝/se crets/｛name｝</p>
<p>获取 Secret 列表</p>
<p>创建一个 Secret 对象</p>
<p>获取某个 Namespace 下的Secret 列表 /api/vl/namespaces/｛namespace｝/se 在某个 Namespace 下创建一个 Secret 对象</p>
<p>删除某个 Namespace 下的一个 Secret 对象</p>
<p>获取某个 Namespace 下的一个 Secret 对象</p>
<p>部分更新某个 Namespace 下的一个 Secret对象</p>
<p>替换某个 Namespace 下的一个 Secret 对象</p>
<p>/api/vl/events</p>
<p>获取 Event 列表</p>
<p>/api/v1/events</p>
<p>创建一个 Event 对象</p>
<p>/api/v1/namespaces/｛namespace｝/ev 获取某个 Namespace 下的 Event 列表 ents</p>
<p>/api/v1/namespaces/ ｛namespace｝/ev 在某个 Namespace 下创建一个 Event ents</p>
<p>对象</p>
<p>/api/wl/namespaces/ ｛namespace｝/ev 删除某个 Namespace 下的一个 Event ents/｛name｝</p>
<p>对象</p>
<p>/api/v1/namespaces/｛namespace｝/ev 获取某个 Namespace 下的一个 Event ents/｛name｝</p>
<p>对象</p>
<p>/api/v1/namespaces/ ｛namespace｝/ev 部分更新某个 Namespace 下的一个 ents/fname｝</p>
<p>Event 对象</p>
<p>/api/v1/namespaces/ ｛namespace｝/ev 替换某个 Namespace 下的一个 Event ents/｛name｝</p>
<p>对象</p>
<p>/api/w/componentstatuses 获取 ComponentStatus 列表 /api/vl/namespaces/ ｛namespace）/co 获取某个 Namespace 下的 Component mponentstatuses</p>
<p>Status 列表</p>
<p>备</p>
<p>续表</p>
<p>注</p>
<p>• 274•</p>
<h2>第 288 页</h2>
<p>资源类型</p>
<p>LIMITRANGES</p>
<p>RESOURCEQUO</p>
<p>TAS</p>
<p>方</p>
<p>GET</p>
<p>法</p>
<p>GET</p>
<p>POST</p>
<p>GET</p>
<p>POST</p>
<p>DELETE</p>
<p>GET</p>
<p>PATCH</p>
<p>PUT</p>
<p>GET</p>
<p>POST</p>
<p>GET</p>
<p>POST</p>
<p>DELETE</p>
<p>GET</p>
<p>PATCH</p>
<p>PUT</p>
<p>PUT</p>
<h3>第4章</h3>
<p>Kubernetes 开发指南</p>
<p>续表</p>
<p>注</p>
<p>URL Path</p>
<p>说明</p>
<p>/api/vl/mnamespaces/ ｛namespace;/00 获取某个 Namespace 下的一个 mponentstafuses/｛mame｝ ComponentStatus 对象 备</p>
<p>api/vi/imitranges</p>
<p>/api/1/imitranges</p>
<p>/api/v1/namespaces/｛namespace）/i mitranges.</p>
<p>/api/vl/mnamespaces/ ｛namespace;/i mitranges</p>
<p>/api/vl/namespaces/ ｛mamespace;/i mitranges/ ｛name）</p>
<p>/api/vl/mnamespaces/ ｛namespacey/i mitranges/｛mame）</p>
<p>api/vl/namespaces/｛mamespace;/i mitranges/｛name）</p>
<p>/api/vl/namespaces/ ｛namespace/i mitranges/ fname｝</p>
<p>获取 LimitRange 列表</p>
<p>创建一个 LimitRange 对象 获取某个 Namespace 下的 LimitRange 列表</p>
<p>在某个 Namespace 下创建一个 LimitRange 对象</p>
<p>删除某个 Namespace 下的一个 LimitRange 对象</p>
<p>获取某个 Namespace 下的一个 LimitRange 对象</p>
<p>部分更新某个 Namespace 下的一个 LimiRange 对象</p>
<p>替换某个 Namespace 下的一个 LimitRange 对象</p>
<p>/api/wl/resourcequotas 获取 ResourceQuota 列表 /api/wl/resourcequotas 创建一个 ResourceQuota 对象 /api/v/namespaces/｛namespace｝/re 获取某个 Namespace 下的 Resource sourceguotas</p>
<p>Quota 列表</p>
<p>/api/vl/mnamespaces/ ｛namespace/re 在某个 Namespace 下创建一个 sourcequotas</p>
<p>Resource Quota 对象</p>
<p>/api/vl/namespaces/ ｛namespace;/re 删除某个 Namespace 下的一个 sourcequotas/ fname｝ Resource Quota 对象</p>
<p>api/v l/namespaces/ fnamespace）/re获取某个 Namespace 下的一个 sourceguotas/ fname Resource Quota 对象</p>
<p>/api/vl/inamespaces/ fnamespace;/re 部分更新某个 Namespace 下的一个 sourcequotas/ fname｝ Resource Quota 对象</p>
<p>/api/Wl/namespaces/｛namespace｝/re 替换某个 Namespace 下的一个 sourceguotas/ ｛name；</p>
<p>Resource Quota 对象</p>
<p>/api/v1/namespaccs/（namespace;/re 替换某个 Namespace 下的一个在 Fabric8 中没有 sourcequotas/ fname;/status Resource Quota 对象状态 • 275•</p>
<h2>第 289 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 资源类型</p>
<p>方</p>
<p>GET</p>
<p>POST</p>
<p>GET</p>
<p>POST</p>
<p>PODTEMPLATES</p>
<p>DELETE</p>
<p>GET</p>
<p>PATCH</p>
<p>PUT</p>
<p>PERSISTENTVO</p>
<p>LUMES</p>
<p>GET</p>
<p>POST</p>
<p>DELETE</p>
<p>GET</p>
<p>PATCH</p>
<p>PUT</p>
<p>PUT</p>
<p>GET</p>
<p>POST</p>
<p>GET</p>
<p>POST</p>
<p>PERSISTENTVO</p>
<p>LUMECLAIMS</p>
<p>DELETE</p>
<p>GET</p>
<p>PATCH</p>
<p>法</p>
<p>URL Path</p>
<p>说明</p>
<p>/api/vl/podtemplates 获取 PodTemplate 列表</p>
<p>/apivl/podtemplates 创建一个 PodTemplate 对象 /api/Vl/namespaces/ ｛namespace｝/po 获取某个 Namespace 下的 dtemplates</p>
<p>PodTemplate 列表</p>
<p>/api/vl/namespaces/｛namespace｝/po 在某个 Namespace 下创建一个 dtemplates</p>
<p>PodTemplate对象</p>
<p>/api/vl/namespaces/ fnamespace;/po 删除某个 Namespace 下的一个 dtemplates/｛name｝</p>
<p>PodTemplate 对象</p>
<p>/api/vl/namespaces/ ｛mamespace;/po 获取某个 Namespace 下的一个 dtemplates/（name｝</p>
<p>PodTemplate 对象</p>
<p>/api/1/namespaces/｛namespace｝/po 部分更新某个 Namespace 下的一个 dtemplates/｛name）</p>
<p>PodTemplate 对象</p>
<p>/api/v1/namespaces/｛namespace｝/po 替换某个 Namespace 下的一个 dtemplates/｛name｝</p>
<p>PodTemplate 对象</p>
<p>/api/vl/persistentvolumes /api/vl/persistentvolumes /api/vl/persistentvolumes/｛name｝ /api/wl/persistentvolumes/｛name｝ /api/vl/persistentvolumes/｛name｝ /api/vl/persistentvolumes/ fname｝ /api/vl/persistentvolumes/｛mame;/st atus</p>
<p>获取 PersistentVolue 列表 创建一个 PersistentVolume 对象 删除一个 PersistentVolume 对象 获取一个 PersistentVolume 对象 部分更新一个 Persistent Volume 对象 替换一个 Persistent Volume 对象 替換一个 PersistentVolume 对象状态 /apivl/persistentvolumedlaims 获取 PersistentVolumeClaim 列表 lapi/vl/persistentvolumeclaims 创建一个 PersistentVolumeClaim 对象 /api/vl/namespaces/ ｛namespace｝/pe 获取某个 Namespace 下的 Persistent rsistentvolumeclaims VolumeClaim 列表</p>
<p>/api/vI/namespaces/｛namespace｝/pe 在某个 Namespace 下创建一个 rsistentvolumeclaims Persistent VolumeClaim 对象 /api/v1/namespaces/｛namespace｝/pe 刪除某个 Namespace 下的一个 rsistentvolumeclaims/｛name） Persistent VolumeClaim 对象 /api/vl/namespaces/ ｛namespace｝/pe 获取某个 Namespace 下的一个 rsistentvolumeclaims/｛name｝ Persistent VolumeClaim 对象 /apivl/namespaces/ ｛namespace;/pe 部分更新某个 Namespace 下的一 rsistentvolumeclaims/｛name｝ 个 Persistent VolumeClaim 对象 • 276•</p>
<p>备</p>
<p>续表</p>
<p>注</p>
<p>在 Fabric8 中没有</p>
<p>实现</p>
<h2>第 290 页</h2>
<h3>第4章</h3>
<p>Kubernetes 开发指南</p>
<p>续表</p>
<p>备</p>
<p>注</p>
<p>资源类型</p>
<p>方</p>
<p>PUT</p>
<p>法</p>
<p>URL Path</p>
<p>说</p>
<p>明</p>
<p>/api/vl/namespaces/ fnamespace;/pe 替换某个 Namespace 下的一个 rsistentvolumeclaims/｛name｝ Persistent VolumeClaim 对象 /api/vl/namespaces/ ｛namespace;/pe 替换某个 Namespace 下的一个 PUT</p>
<p>rsistentvolumeclaims/｛name｝/status Persistent VolumeClaim 对象状态 在 Fabric8 中没有</p>
<p>实现</p>
<p>首先，举例说明如何通过 API 接口来创建资源对象。我们需要创建访问 API Server 的客户 端，基于 Jersey 框架的代码如下：</p>
<p>RestfulClient _restfulClient = new JerseyRestfulClient （&quot;http://192.168.1.128：</p>
<p>8080/api/v1&quot;）；</p>
<p>其中，http:/192.168.1.128:8080为 API Server 的地址。基于 Fabric8 框架的代码如下：</p>
<p>Config _conf = new Config（）：</p>
<p>KubernetesClient</p>
<p>kube = new DefaultKubernetesClient （&quot;http: //192.168.1.128: 8080&quot;）；</p>
<p>分别通过上面的两个客户端创建 Namespace 资源对象，基于 Jersey 框架的代码如下：</p>
<p>private void testCreateNamespace （）｛ Params params = new Params（）；</p>
<p>params.setResourceType （ResourceTyPe. NAMESPACES）；</p>
<p>params.setJson （Utils.getJson（&quot;namespace.json&quot;））；</p>
<p>LOG.info （&quot;Result：</p>
<p>&quot;+</p>
<p>_restfulClient .create （params））；</p>
<p>其中，</p>
<p>“namespace.json”为创建 Namespace 资源对象的JSON 定义，代码如下：</p>
<p>&quot;kind&quot;：&quot;Namespace&quot;， &quot;apiVersion&quot;： &quot;v1&quot;， &quot;metadata&quot; ：｛</p>
<p>&quot;name&quot;：&quot;ns-sample&quot; ｝</p>
<p>｝</p>
<p>基于 Fabric8 框架的代码如下：</p>
<p>private void testCreateNamespace （）｛ Namespace ns = new Namespace （）；</p>
<p>ns.setApiVersion （ApiVersion.V_1）；</p>
<p>ns.setKind （&quot;Namespace&quot;）；</p>
<p>ObjectMeta om = new ObjectMeta （）；</p>
<p>om.setName （&quot;ns-fabric8&quot;）；</p>
<p>ns.setMetadata （om）：</p>
<p>_kube.namespaces （）.create （ns）；</p>
<p>• 277•</p>
<h2>第 291 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） LOG.info（_kube.namespaces （）.1ist （）.getItems （）.size（））；</p>
<p>｝</p>
<p>由于 Fabric8 框架对 Kubernetes API 对象做了很好的封装，对其中的大量对象都做了定义， 所以用户可以通过其提供的资源对象去定义 Kubernetes API 对象，例如上面例子中的 Namespace 对象。Fabric8 框架中的 kubernetes-model 工具包用于API 对象的封装。在上面的例子中，通过 Fabric8 框架提供的类创建了一个名为“ns-fabric8” 的命名空间对象。</p>
<p>接下来我们会通过基于 Jeysey 框架的代码去创建两个Pod 资源对象。在两个例子中，一个是 在上面创建的“ns-sample ” Namespace 中创建 Pod 资源对象，另一个是为后续创建“cluster service” 而创建的 Pod 资源对象。由于基于 Fabric&amp; 框架创建 Pod 资源对象的方法很简单，因此不再用 Fabric8 框架对上述两个例子做说明。通过基于 Jersey 框架创建这两个 Pod 资源对象的代码如下：</p>
<p>private void testCreatePod （）｛ params = new Params （）；</p>
<p>params.setResourceType （ResourceType : PODS）；</p>
<p>params.setJson （Utils.getJson（&quot;podInNs.json&quot;））；</p>
<p>params.setNamespace （&quot;ns-sample&quot;）；</p>
<p>LOG.info（&quot;Result： &quot; + _restfulClient .create （params））；</p>
<p>params.setJson （Utils.getJson（&quot;pod4ClusterService.json&quot;））；</p>
<p>LOG.info （&quot;Result： &quot; + _restfulClient.create （params））；</p>
<p>｝</p>
<p>文件的内容如下：</p>
<p>其中，podlnNs.json 和 pod4ClusterService.json 是创建两个 Pod 资源对象的定义opodInNs.json ｛</p>
<p>&quot;kind&quot; ：&quot;Pod&quot;，</p>
<p>&quot;apiVersion&quot;： &quot;v1&quot;， &quot;metadata&quot;：｛</p>
<p>&quot;name&quot;：&quot;pod-sample-in-namespace&quot;， &quot;&#x27;namespace&quot; ：</p>
<p>&quot;ns-sample&quot;</p>
<p>&quot;spec&quot; ：｛</p>
<p>&quot;containers&quot;： ［｛</p>
<p>&quot;name&quot;：&quot;mycontainer&quot;， &quot;image&quot;：&quot;kubeguide/redis-master&quot; ｝］</p>
<p>｝</p>
<p>｝</p>
<p>pod4ClusterService.json 文件的内容如下：</p>
<p>｛</p>
<p>&quot;kind&quot;：&quot;Pod&quot;，</p>
<p>• 278</p>
<h2>第 292 页</h2>
<h3>第4章 Kubernetes 开发指南</h3>
<p>&quot;apiVersion&quot;： &quot;v1&quot;， &quot;metadata&quot;：｛</p>
<p>&quot;name&quot; ：&#x27;pod-sample-4-cluster-service&quot;， &quot;namespace&quot;：&quot;ns-sample&quot;， &quot;1abels&quot;：｛</p>
<p>&quot;k8s-cs&quot;：&quot;kube-cluster-service&quot;， &quot;k8s-test&quot;：&quot;kube-cluster-test&quot;， &quot;k8s-sample-app&quot;：&quot;kube-service-sample&quot;， &quot;kkk&quot;：</p>
<p>&quot;bbb&quot;</p>
<p>｝，</p>
<p>&quot;spec&quot;：｛</p>
<p>&quot;containers&quot;：［｛</p>
<p>&quot;name&quot; ：&#x27;mycontainer&quot;， &quot;image&quot; ：&quot;kubeguide/redis-master&quot; ｝J</p>
<p>下面的例子代码用于获取 Pod 资源列表，其中第1部分代码用于获取所有的Pod资源对象， 第2、3部分代码主要是列举如何使用标签选择Pod 资源对象，最后一部分代码用于举例说明如 何使用 field选择Pod 资源对象。代码如下：</p>
<p>private void testGetPodList （）｛ Params params = new Params （）；</p>
<p>params.setResourceType （ResourceType. PODS）；</p>
<p>LOG.info（&quot;Result： &quot; + _restfulClient .list （params））；</p>
<p>Map&lt;String, String&gt; labels = new HashMap&lt;String, String&gt;（）；</p>
<p>labels.put（&quot;k8s-cs&quot;，&quot;kube-cluster-service&quot;）；</p>
<p>labels.put （&quot;k8s-sample-app&quot;，&quot;kube-service-sample&quot;）；</p>
<p>params.setLabels （labels）；</p>
<p>LOG.info（&quot;Result： &quot; + | -restfulClient.list （params））：</p>
<p>params.setLabels （null）；</p>
<p>Map&lt;String, List&lt;String&gt;&gt; inlabels = new HashMap&lt;String,List&lt;String&gt;&gt;（）；</p>
<p>List list = new ArrayList&lt;String&gt;（）；</p>
<p>list.add （&quot;kube-cluster-service&quot;）；</p>
<p>list.add（&quot;kube-cluster&quot;）；</p>
<p>inLabels.put （&quot;k8s-cs&quot;， list）；</p>
<p>params.setInLabels （inLabels）；</p>
<p>LOG.info（&quot;Result： &quot; + _restfulC-ient.1ist （params））；</p>
<p>params.setInLabels （nul1）；</p>
<p>Map&lt;String, String&gt; fields = new HashMap&lt;String, String&gt;（）；</p>
<p>fields.put （&quot;metadata.name&quot;， &quot;&#x27;pod-sample-4-cluster-service&quot;）；</p>
<p>params.setNamespace （&quot;ns-sample&quot;&#x27;）；</p>
<p>• 279•</p>
<h2>第 293 页</h2>
<p>Kubernetes 权威指南：</p>
<p>从 Docker 到 Kubernetes 实践全接触（第2版） params.setFields （fields）；</p>
<p>LOG.info（&quot;Result： &quot;+_restfulClient.list （params））；</p>
<p>｝</p>
<p>接下来的例子代码用于替换一个 Pod 对象，在通过 Kubernetes API 替换一个Pod 资源对象 时需要注意两点：</p>
<p>（1）在替换该资源对象前，先从 API 中获取该资源对象的JSON 对象，然后在该 JSON 对 象的基础上修改需要替换的部分；</p>
<p>（2） 在 Kubernetes API 提供的接口中，PUT 方法 （replace）只支持替换容器的image 部分。</p>
<p>代码如下：</p>
<p>private void testReplacePod（）｛ Params params = new Params （）；</p>
<p>params.setNamespace （&quot;ns-sample&quot;）；</p>
<p>params.setName （&quot;pod-sample-in-namespace&quot;）；</p>
<p>params.setJson （Utils.getJson （&quot;pod4Replace.json&quot;））；</p>
<p>params.setResourcelype （ResourceType.PoDS）；</p>
<p>LOG.info（&quot;Result：&quot; + _restfulClient.replace （params））；</p>
<p>其中，pod4Replace.json 的内容如下；</p>
<p>&quot;kind&quot;：&quot;Pod&quot;</p>
<p>&quot;apiVersion&quot;：</p>
<p>&quot;v1&quot;，</p>
<p>&quot;metadata&quot;：｛</p>
<p>&quot;name&quot; ：&quot;pod-sample-in-namespace&quot;， &quot;namespace&quot;：&quot;ns-sample&quot;， &quot;selfLink&quot;： &quot;/api/v1/namespaces/ns-sample/pods/pod-sample-in-namespace&quot;， &quot;uid&quot;： &quot;084ff63e-59d3-11e5-8035-000c2921ba71&quot;， &quot;resourceVersion&quot;： &quot;45450&quot;， &quot;creationTimestamp&quot;：</p>
<p>&quot;2015-09-13T04:51:012&quot; ｝</p>
<p>&quot;spec&quot;：</p>
<p>｛</p>
<p>&quot;&#x27;volumes&quot;：</p>
<p>［</p>
<p>｛</p>
<p>&quot;name&quot;： &quot;default-token-szoje&quot;， &quot;secret&quot;：｛</p>
<p>&quot;secretName&quot;：</p>
<p>&quot;default-token-szoje&quot; ｝</p>
<p>】</p>
<p>&quot;containers&quot;： ［</p>
<p>&quot;name&quot; ：&quot;mycontainer&quot;， • 280</p>
<h2>第 294 页</h2>
<h3>第4章 Kubernetes 开发指南</h3>
<p>&quot;image&quot;： &quot;centos&quot;， &quot;resources&quot;： ｛｝，</p>
<p>&quot;&#x27;volumeMounts&quot;： ［ ｛</p>
<p>&quot;name&quot;：&quot;default-token-szoje&quot;， &#x27;readOnly&quot;： true，</p>
<p>&quot;mountPath&quot;： &quot;/var/run/secrets/kubernetes.io/serviceaccount&quot; &quot;terminationMessagePath&quot;： &quot;/dev/termination-log&quot;， &quot;imagePu11Policy&quot;： &quot;IfNotPresent&quot; ｝</p>
<p>］，</p>
<p>&quot;restartPolicy&quot;：&quot;Always&quot;， &quot;dnsPolicy&quot;： &quot;ClusterFirst&quot;， &quot;serviceAccountName&quot;： &quot;default&quot;， &quot;serviceAccount&quot;：&quot;default&quot;， &quot;nodeName&quot;： &quot;192.168.1.129&quot; ｝，</p>
<p>&quot;status&quot;：｛</p>
<p>&quot;phase&quot;： &quot;Running&quot;， &quot;conditions&quot;： ［</p>
<p>｛</p>
<p>&quot;type&quot;：&quot;Ready&quot;，</p>
<p>&quot;status&quot;： &quot;True&quot;</p>
<p>&quot;hostIP&quot;： &quot;192.168.1.129&quot;， &quot;podIP&quot;： &quot;10.1.10.66&quot;， &quot;startTime&quot;：&quot;2015-09-11T15:17:282&quot;， &quot;containerStatuses&quot; ： ［ ｛</p>
<p>“name&quot;：&quot;mycontainer&quot;， &quot;state&quot;：｛</p>
<p>&quot;running&quot;：｛</p>
<p>&quot;startedAt&quot;： &quot;2015-09-11T15:17:302&quot; ｝</p>
<p>&quot;lastState&quot;： ｛｝，</p>
<p>&quot;ready&quot;： truer</p>
<p>&quot;restartCount&quot;：0，</p>
<p>&quot;image&quot;：&quot;kubeguide/redis-master&quot;， &quot;imageID&quot;：</p>
<p>&quot;docker://5630952871a38cddffda9ec611f5978ab0933628fcd54cd7d7677ce6b17de33f&quot;， &quot;containerID&quot;： &quot;docker://7bf0d454c367418348711556e667fdlef6a04d7153d 24bfcac2e2e06da634a9f&quot; • 281•</p>
<h2>第 295 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） ］</p>
<p>｝</p>
<p>｝</p>
<p>Patch。</p>
<p>接下来的两个例子实现了4.2.4节中提到的两种 Merge 方式：Merge Patch 和 Strategic Merge 第1种Merge 方式的示例如下：</p>
<p>private void testUpdatePodl（）｛ Params params = new Params （）；</p>
<p>params.setNamespace （&quot;ns-sample&quot;）；</p>
<p>params.setName （&quot;pod-sample-in-namespace&quot;）；</p>
<p>params.setJson （Utils.getJson（&quot;pod4MergeJsonPatch.json&quot;））；</p>
<p>Params.setResourceTyPe （ResourceType. PODS）；</p>
<p>LOG.info（&quot;Result： &quot; + &quot;application/ merge-patch+json&quot;））；</p>
<p>_restfulClient.updateWithMediaType （params， 其中，pod4MergeJsonPatch.json 的内容如下：</p>
<p>&quot;metadata&quot;：｛</p>
<p>&quot;labels&quot;：｛</p>
<p>&quot;k8s-cs&quot;： &quot;kube-cluster-service&quot;， &quot;k8s-test&quot;：&quot;kube-cluster-test&quot;， &quot;k8s-sa5555mple-app&quot;：&quot;kube-service-sample&quot;， &quot;kkk&quot;： &quot;bbb4444&quot;</p>
<p>｝</p>
<p>｝</p>
<p>第2种 Merge 方式（Strategic Merge Patch）的示例如下：</p>
<p>private void testUpdatePod2（）｛ Params params = new Params（）；</p>
<p>params.setNamespace （&quot;ns-sample&quot;）；</p>
<p>params.setName （&quot;pod-sample-in-namespace&quot;）；</p>
<p>params.setJson （Utils.getJson（&quot;pod4StrategicMerge.json&quot;））；</p>
<p>params.setResourceType （ResourceType. PODS）；</p>
<p>LOG.info（&quot;Result： &quot; _restfulClient .updateWithMediarype （params， &quot;application/strategic-merge-patch+json&quot;））；</p>
<p>其中，pod4StrategicMerge.json 的内容如下：</p>
<p>｛</p>
<p>&quot;spec&quot;：｛</p>
<p>• 282•</p>
<h2>第 296 页</h2>
<h3>第4章</h3>
<p>Kubernetes 开发指南</p>
<p>&quot;containers&quot;： ［｛</p>
<p>&quot;name&quot;：&quot;mycontainer&quot;， &quot;image&quot;：&quot;centos&quot;，</p>
<p>&quot;patchstrategy&quot;：&quot;merge&quot;， &quot;patchMergeKey&quot; ：&quot;name&quot; ｝］</p>
<p>｝</p>
<p>｝</p>
<p>接下来实现了修改Pod 资源对象的状态，代码如下：</p>
<p>private void testStatusPod （）｛ Params params = new Params （）；</p>
<p>params.setNamespace （&quot;ns-sample&quot;）；</p>
<p>params.setName （&quot;pod-sample-in-namespace&quot;）；</p>
<p>params.setSubPath （&quot;/status&quot;&#x27;）；</p>
<p>params.setJson （Utils.getJson （&quot;pod4Status.json&quot;） ）；</p>
<p>params. setResourceType （ResourceType. PODS）；</p>
<p>_restfulClient.replace （params）；</p>
<p>其中，pod4Status.json 的内容如下：</p>
<p>&quot;kind&quot;： &quot;Pod&quot;</p>
<p>&quot;apiVersion&quot;：</p>
<p>&quot;v1&quot;，</p>
<p>&quot;metadata&quot;： ｛</p>
<p>&quot;name&quot;：&quot;pod-sample-in-namespace&quot;， &quot;namespace&quot;：&quot;ns-sample&quot;， &quot;selfLink&quot; ： &quot;/api/v1/namespaces/ns-sample/pods/pod-sample-in-namespace&quot;， &quot;uid&quot;： &quot;ad1d803f-59ec-11e5-8035-000c2921ba71&quot;， &quot;resourceVersion&quot; ： &quot;51640&quot;， &quot;creationTimestamp&quot; ： &quot;2015-09-13T07:54:352&quot; ｝</p>
<p>&quot;spec&quot;：｛</p>
<p>&quot;volumes&quot;： ［</p>
<p>｛</p>
<p>&quot;name&quot;：&quot;default-token-szoje&quot;， &quot;secret&quot;：｛</p>
<p>&quot;secretName&quot;：&quot;default-token-szoje&quot; ］，</p>
<p>&quot;containers&quot;： ［</p>
<p>&quot;name&quot;：&quot;mycontainer&quot;， &quot;image&quot;：</p>
<p>&quot;&#x27;kubeguide/redis-master&quot;， &quot;rcsources&quot;：｛｝，</p>
<p>• 283</p>
<h2>第 297 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） &quot;volumeMounts&quot;：</p>
<p>［</p>
<p>&quot;name&quot;：&quot;default-token-szoje&quot;， &quot;readOnly&quot;：true，</p>
<p>&quot;mountPath&quot;：&quot;/var/run/secrets/kubernetes.io/serviceaccount&quot; ｝</p>
<p>］</p>
<p>&quot;terminationMessagePath&quot;： &quot;/dev/termination-log&quot;， &quot;imagePul1Policy&quot;： &quot;IfNotPresent&quot; ｝</p>
<p>&#x27;restartPolicy&quot;： &quot;Always&quot;， &quot;dnsPolicy&quot;： &quot;ClusterFirst&quot;， &quot;&#x27;serviceAccountName&quot;： &quot;default&quot;， &#x27;serviceAccount&quot;： &quot;default&quot;， &#x27;nodeName&quot;：&quot;192.168.1.129&quot; ｝，</p>
<p>&quot;status&quot;：｛</p>
<p>&quot;phase&quot; ： &quot;Unknown&quot;， &quot;conditions&quot;：［</p>
<p>｛</p>
<p>&quot;type&quot; ：&quot;Ready&quot;，</p>
<p>&quot;status&quot;：&quot;false&quot;</p>
<p>&quot;hostIP&quot; ： &quot;192.168.1.129&quot;， &#x27;podIP&quot;： &quot;10.1.10.79&quot;， &quot;startTime&quot;： &quot;2015-09-11T18:21:022&quot;， &quot;containerStatuses&quot;： ［ &quot;name&quot; ：&quot;mycontainer&quot;， &quot;state&quot;：｛</p>
<p>&quot;running&quot;：｛</p>
<p>&quot;startedAt&quot;： &quot;2015-09-11T18:21:032&quot; ｝</p>
<p>&quot;&#x27;lastState&quot;： ｛｝，</p>
<p>&quot;ready&quot;： true，</p>
<p>&quot;restartCount&quot;：</p>
<p>&quot;image&quot;：&quot;kubeguide/redis-master&quot;， &quot;imageID&quot;： &quot;docker://5630952871a38cddffda9ec611f5978ab0933628fcd54cd 7d7677ce6b17de33f&quot;， &quot;containerID&quot;： &quot;docker://b0e2312643e9a4b59cflff5fb7a8468c5777180d5a 8ea5f2f0c9dfddcf3f4cd2&quot; • 284•</p>
<h2>第 298 页</h2>
<h3>第4章 Kubernetes 开发指南</h3>
<p>｝</p>
<p>接下来实现了查看Pod 的1og 日志功能，代码如下：</p>
<p>private void testLogPod（）｛ Params params = new Params （）；</p>
<p>params.setNamespace （&quot;ns-sample&quot;）；</p>
<p>params.setName （&quot;pod-sample-in-namespace&quot;）；</p>
<p>params.setSubPath（&quot;/10g&quot;）；</p>
<p>params.setResourceType （ResourceType. PODS）；</p>
<p>-restfulClient.get （params）；</p>
<p>｝</p>
<p>下面通过 API 访问 Node 的多种接口，代码如下：</p>
<p>private void testPoxyNode （）｛ Params params = new Params （）；</p>
<p>params.setName （&quot;192.168.1.129&quot;）；</p>
<p>params.setSubPath （&quot;pods&quot;）；</p>
<p>params.setVisitProxy （true）；</p>
<p>params.setResourceType （ResourceType. NODES）；</p>
<p>_restfulClient.get （params）；</p>
<p>params = new Params（）；</p>
<p>params.setName （&quot;192.168.1.129&quot;）；</p>
<p>params.setSubPath （&quot;stats&quot;）；</p>
<p>params.setVisitProxy （true）；</p>
<p>params.setResourceType （ResourceType.NODES）；</p>
<p>_restfulClient.get （params）；</p>
<p>params = new Params（）；</p>
<p>params.setName （&quot;192.168.1.129&quot;）；</p>
<p>params.setSubPath （&quot;spec&quot;）；</p>
<p>params.setVisitProxy（true）；</p>
<p>params.setResourceType （ResourceType . NODES）；</p>
<p>_restfulClient.get （params）；</p>
<p>params = new Params（）；</p>
<p>params.setName （&quot;192.168.1.129&quot;）；</p>
<p>params.setSubPath（&quot;run/ns-sample/pod/pod-sample-in-namespace&quot;）；</p>
<p>params.setVisitProxy （true）；</p>
<p>params.setResourceType （ResourceType . NODES）；</p>
<p>_restfulClient .get （params）；</p>
<p>params = new Params （）：</p>
<p>params.setName （&quot;192.168.1.129&quot;）；</p>
<p>params.setSubPath （&quot;metrics&quot;）；</p>
<p>params .setVisitProxy （true）；</p>
<p>• 285</p>
<h2>第 299 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） ｝</p>
<p>params.setResourceType （ResourceType.NODES）；</p>
<p>_restfulClient .get （params）；</p>
<p>最后，举例说明如何通过 API 删除资源对象 pod，代码如下：</p>
<p>Private void testDetetePod（）｛ Params params = new Params（）；</p>
<p>params.setNamespace （&quot;ns-sample&quot;）；</p>
<p>params.setName （&quot;pod-sample-in-namespace&quot;）；</p>
<p>params.setResourceType （ResourceType. PODS）；</p>
<p>LOG.info（&quot;Result： &quot; + _restfulClient.delete （params））；</p>
<p>｝</p>
<p>通过 API 接口除了能够对资源对象实现前面列出的基本操作外，还涉及两类特殊接口，一 类是 WATCH，一类是PROXY。这两类特殊接口所包含的接口如表4.4所示。</p>
<p>表4.4 两类特殊接口所包含的接口</p>
<p>资源类型</p>
<p>类</p>
<p>别</p>
<p>WATCH</p>
<p>方</p>
<p>GET</p>
<p>GET</p>
<p>法</p>
<p>URL Path</p>
<p>/api/v1/watch/nodes /api/v1/watch/nodes/｛name｝ DELETE</p>
<p>/api/v1/proxy/nodes/｛name｝/｛path：*｝ GET</p>
<p>/api/v1/proxy/nodes/ ｛name｝/｛path：*｝ HEAD</p>
<p>/api/v1/proxy/nodes/｛name｝/｛path：*g OPTIONS</p>
<p>/api/v1/proxy/nodes/｛name｝/｛path：*3 NODES</p>
<p>PROXY</p>
<p>POST</p>
<p>/api/vl/proxy/nodes/｛name｝/｛path：*g PUT</p>
<p>DELETE</p>
<p>GET</p>
<p>HEAD</p>
<p>OPTIONS</p>
<p>POST</p>
<p>PUT</p>
<p>/api/v1/proxy/nodes/｛name｝/｛path：*｝ /api/v1/proxy/nodes/｛name｝ /api/v1/proxy/nodes/｛name｝ /api/v1/proxy/nodes/｛name｝ /api/v1/proxy/nodes/｛name） /api/v1/proxy/nodes/ ｛name｝ /api/v1/proxy/nodes/｛name｝ 说明</p>
<p>监听所有节点的变化</p>
<p>监听单个节点的变化</p>
<p>代理 DELETE 请求到节点的某个子 目录</p>
<p>代理GET 请求到节点的某个子目录</p>
<p>代理 HEAD 请求到节点的某个子目 录</p>
<p>代理 OPTIONS 请求到节点的某个 子目录</p>
<p>代理 POST 请求到节点的某个子目 录</p>
<p>代理PUT请求到节点的某个子目录</p>
<p>代理 DELETE 请求到节点</p>
<p>代理 GET 请求到节点</p>
<p>代理 HEAD 请求到节点</p>
<p>代理 OPTIONS 请求到节点</p>
<p>代理 POST 请求到节点</p>
<p>代理 PUT 请求到节点</p>
<p>GET</p>
<p>SERVICES</p>
<p>WATCH</p>
<p>GET</p>
<p>/api/v1/watch/services /api/vl/watch/namespaces/｛namespace｝/ Services</p>
<p>监听所有 Service 的变化</p>
<p>监听某个 Namespace 下所有 Service 的变化</p>
<p>• 286•</p>
<h2>第 300 页</h2>
<p>资源类型</p>
<p>REPLICATIONC</p>
<p>ONTROLLER</p>
<p>PODS</p>
<p>类</p>
<p>别</p>
<p>PROXY</p>
<p>WATCH</p>
<p>WATCH</p>
<p>方</p>
<p>法</p>
<p>GET</p>
<p>DELETE</p>
<p>GET</p>
<p>HEAD</p>
<p>OPTIONS</p>
<p>POST</p>
<p>PUT</p>
<p>DELETE</p>
<p>GET</p>
<p>HEAD</p>
<p>OPTIONS</p>
<p>POST</p>
<p>PUT</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<h3>第4章</h3>
<p>Kubernetes 开发指南</p>
<p>续表</p>
<p>URL Path</p>
<p>/api/vl/watch/namespaces/｛namespace｝/ services/（｛name）</p>
<p>/api/v1/proxy/namespaces/ ｛namespace!/ services/ ｛name:/fpath：*） /api/v1/proxy/namespaces/｛namespace｝/ services/ ｛mame｝/fpath：*｝ /api/vl/proxy/namespaces/｛mamespace｝/ services/fnamey/fpath：*y /api/v l/proxy/namespaces/（namespacey/ services/ ｛name;/｛path：*｝ /api/vl/proxy/namespaces/ fnamespacey/ services/｛name｝/｛path：*｝ /api/v1/proxy/namespaces/ ｛namespace:/ services/ ｛name｝/ipath：*） /api/v1/proxy/namespaces/ fnamespacey/ services/｛mame｝</p>
<p>/api/l/proxy/namespaces/（fnamespacey/ service/（mame｝</p>
<p>/api/vl/proxy/namespaces/fnamespacey/ services/ fname｝</p>
<p>/api/vl/proxy/namespaces/｛namespace｝/ services/｛name｝</p>
<p>/api/v1/proxy/namespaces/｛namespace｝/ services/ ｛name｝</p>
<p>/api/v1/proxy/namespaces/ fnamespace:/ services/｛name｝</p>
<p>/api/v1/watch/replicationcontrollers /api/v1/watch/namespaces/｛namespace｝/ replicationcontrollers /api/vl/watch/mnamespaces/ ｛namespacey/ replicationcontrollers/（mame｝ /api/vl/watch/pods /api/vl/watch/namespaces/｛namespace:/ pods</p>
<p>说</p>
<p>明</p>
<p>监听某个 Service 的变化</p>
<p>代理 DELETE 请求到 Service 的某 个子目录</p>
<p>代理 GET 请求到 Service 的某个子 目录</p>
<p>代理 HEAD 请求到 Service 的某个 子目录</p>
<p>代理 OPTIONS 请求到 Service 的某 个子目录</p>
<p>代理 POST 请求到Service 的某个子 目录</p>
<p>代理 PUT 请求到 Service 的某个子 目录</p>
<p>代理 DELETE 请求到 Service 代理 GET 请求到 Service 代理 HEAD 请求到 Service 代理 OPTIONS 请求到 Service 代理 POST 请求到 Service 代理 PUT 请求到 Service 监听所有RC的变化</p>
<p>监听某个 Namespace 下所有RC 的 变化</p>
<p>监听某个RC的变化</p>
<p>监听所有 Pod 的变化</p>
<p>监听某个 Namespace 下所有 Pod 的 变化</p>
<p>• 287•</p>
<h2>第 301 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 续表</p>
<p>资源类型</p>
<p>类</p>
<p>别</p>
<p>PROXY</p>
<p>方</p>
<p>法</p>
<p>GET</p>
<p>DELETE</p>
<p>GET</p>
<p>HEAD</p>
<p>OPTIONS</p>
<p>POST</p>
<p>PUT</p>
<p>DELETE</p>
<p>GET</p>
<p>HEAD</p>
<p>OPTIONS</p>
<p>POST</p>
<p>PUT</p>
<p>DELETE</p>
<p>GET</p>
<p>HEAD</p>
<p>OPTIONS</p>
<p>POST</p>
<p>URL Path</p>
<p>/api/v1/watch/namespaces/｛namespace｝/ pods/｛name｝</p>
<p>/api/vl/namespaces/｛namespace｝/pods/｛ name/proxy/ ｛path：*3 /api/vl/namespaces/｛namespace｝/pods/｛ name｝/proxy/｛path：*y /api/v1/namespaces/｛namespace｝/pods/｛ name｝/proxy/｛path：*3 /api/vl/namespaces/ ｛mamespace;/pods/｛ name｝/proxy/｛path：*） /api/v1/namespaces/｛namespace｝/pods/｛ name;/proxy/fpath：*） /api/wl/namespaces/ ｛namespace//pods/｛ name｝/proxy/ ｛path：*｝ /api/vl/namespaces/ ｛mamespace｝/pods/｛ name｝/proxy</p>
<p>/api/v1/namespaces/｛namespace｝/pods/｛ name//proxy</p>
<p>/api/vl/namespaces/ ｛namespacey/pods/f name//proxy</p>
<p>/api/vl/namespaces/｛namespace｝/pods/｛ name;/proxy</p>
<p>/api/vl/namespaces/ ｛mamespacce:/pods/g name;/proxy</p>
<p>/api/v1/namespaces/ fnamespace;/pods/g name｝/proxy</p>
<p>/api/v1/proxy/namespaces/｛namespace｝/ pods/｛name｝/fpath：*｝ /api/vl/proxy/namespaces/｛namespace｝/ pods/ fname//｛path：*3 /api/v1/proxy/namespaces/｛namespace｝/ pods/（nanme//｛pat：*） /api/v1/proxy/namespaces/｛namespace｝/ pods/ ｛name｝/｛path：*｝ /api/v1/proxy/namespaces/｛namespace｝/ pods/｛name｝/｛path：*｝ 说明</p>
<p>监听某个 Pod 的变化</p>
<p>代理 DELETE 请求到Pod 的某个子 目录</p>
<p>代理GET 请求到Pod的某个子目录 代理HEAD 请求到Pod 的某个子目 录</p>
<p>代理 OPTIONS 请求到 Pod 的某个 子目录</p>
<p>代理 POST 请求到 Pod 的某个子目 录</p>
<p>代理PUT请求到Pod 的某个子目录 代理 DELETE 请求到 Pod</p>
<p>代理 GET 请求到 Pod</p>
<p>代理 HEAD 请求到Pod</p>
<p>代理 OPTIONS 请求到 Pod 代理 POST请求到 Pod</p>
<p>代理PUT 请求到 Pod</p>
<p>代理 DELETE 请求到Pod 的某个子 目录</p>
<p>代理GET 请求到Pod的某个子目录 代理HEAD 请求到Pod 的某个子目 录</p>
<p>代理 OPTIONS 请求到 Pod 的某个 子目录</p>
<p>代理 POST 请求到 Pod 的某个子目 录</p>
<p>• 288•</p>
<h2>第 302 页</h2>
<p>资源类型</p>
<p>ENDPOINTS</p>
<p>SERVICEACCO</p>
<p>UNT</p>
<p>SECRET</p>
<p>EVENTS</p>
<p>类</p>
<p>别</p>
<p>WATCH</p>
<p>WATCH</p>
<p>WATCH</p>
<p>WATCH</p>
<p>方</p>
<p>PUT</p>
<p>法</p>
<p>DELETE</p>
<p>GET</p>
<p>HEAD</p>
<p>OPTIONS</p>
<p>POST</p>
<p>PUT</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<p>URL Path</p>
<p>/api/v1/proxy/namespaces/（namespace｝/ pods/ ｛name;/｛path：*3 /api/vl/proxy/namespaces/ ｛namespace｝/ pods/（name）</p>
<p>/api/vl/proxy/namespaces/｛mamespace!/ pods/fname）</p>
<p>/api/l/proxy/namespaces/ fnamespace｝/ pods/fnane）</p>
<p>/api/vl/proxy/namespaces/ ｛mamespacey/ pods/｛name｝</p>
<p>/api/v1/proxy/namespaces/｛namespace｝/ pods/｛mame｝</p>
<p>/api/vl/proxy/namespaces/ ｛mamespace｝/ pods/｛mame｝</p>
<p>/api/vl/watch/endpoints /api/vl/watch/namespaces/ ｛namespace/ endpoints</p>
<p>/api/vl/watch/namespaces/｛mamespacey/ endpoints/｛name｝</p>
<p>/api/vl/watch/serviceaccounts /api/v1/watch/namespaces/ fnamespaccy/ serviceaccounts</p>
<p>/api/vl/wvatch/namespaces/ fnamespace｝/ serviceaccounts/｛name｝ /api/！/watch/secrets /api/vl/watch/namespaces/ ｛namespacey/ secrets</p>
<p>/api/l/watch/namespaces/ ｛namespacey/ secrets/fname；</p>
<p>/api/vl/watch/events /ap//watch/namespocet （name.spice）） events</p>
<h3>第4章</h3>
<p>Kubernetes 开发指南</p>
<p>续表</p>
<p>说</p>
<p>明</p>
<p>代理PUT请求到Pod 的某个子目录 代理 DELETE 请求到 Pod</p>
<p>代理 GET 请求到 Pod</p>
<p>代理 HEAD 请求到 Pod</p>
<p>代理 OPTIONS 请求到 Pod 代理 POST 请求到 Pod</p>
<p>代理 PUT 请求到 Pod</p>
<p>监听所有 Endpoint 的变化</p>
<p>监听某个 Namespace 下所有 Endpoint 的变化</p>
<p>监听某个 Endpoint的变化</p>
<p>监听所有 ServiceAccount 的变化 监听某个 Namespace 下所有 ServiceAccount 的变化 监听某个 ServiceAccount 的变化 监听所有 Secret 的变化</p>
<p>监听某个 Namespace 下所有 Secret 的变化</p>
<p>监听某个 Secret 的变化</p>
<p>监听所有 Event 的变化</p>
<p>监听某个 Namespace 下所有 Event 的变化</p>
<p>• 289•</p>
<h2>第 303 页</h2>
<p>Kubernetes 权威指南：从 Docker 到 Kubernetes 实践全接触（第2版） 续表</p>
<p>资源类型</p>
<p>LIMITRANGES</p>
<p>RESOURCEQU</p>
<p>OTAS</p>
<p>PODTEMPLATES</p>
<p>PERSISTENTV</p>
<p>OLUMES</p>
<p>类</p>
<p>别</p>
<p>方</p>
<p>法</p>
<p>WATCH</p>
<p>WATCH</p>
<p>WATCH</p>
<p>WATCH</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<p>GET</p>
<p>URL Path</p>
<p>/api/v1/watch/namespaces/ ｛mamespace｝/ events/｛name｝</p>
<p>/api/v1/watchlimitranges /api/v1/watch/mnamespaces/ ｛namespacey/ limitranges</p>
<p>/api/v1/watch/namespaces/｛namespace｝/ limitranges/｛name｝ /api/l/watch/resourceguotas /api/vl/watch/namespaces/｛namespace｝/ resourcequotas</p>
<p>/api/vl/watch/namespaces/（namespacey/ resourcequotas/｛name｝ /api/v1/watch/podtemplates /api/v1/watch/namespaces/｛mamespace｝/ podtemplates</p>
<p>/api/vl/watch/namespaces/ ｛namespace｝/ podtemplates/｛name｝ /api/Vl/watch/persistentvolumes /api/v1/watch/persistentvolumes/｛name｝ 说</p>
<p>•明</p>
<p>监听某个 Event 的变化</p>
<p>监听所有 Event 的变化</p>
<p>监听某个 Namespace 下所有 Event 的变化</p>
<p>监听某个 Event 的变化</p>
<p>监听所有 ResourceQuota 的变化 监听某个 Namespace 下所有 ResourceQuota 的变化</p>
<p>监听某个 ResourceQuota 的变化 监听所有 PodTemplate 的变化 监听某个 Namespace 下所有 PodTemplate 的变化</p>
<p>监听某个 PodTemplate 的变化 监听所有 PersistentVolume 的变化 监听某个 PersistentVolume 的变化 监听所有 PersistentVolumeClaim 的 GET</p>
<p>/api/vi/watch/persistentvolumeclaims 变化</p>
<p>PERSISTENTV</p>
<p>OLUMECLAIMS</p>
<p>/api/v1/watch/namespaces/｛namespace｝/ 监听某个 Namespace 下所有 WATCH</p>
<p>GET</p>
<p>persistentvolumeclaims PersistentVolumeClaim 的变化 /api/vl/watch/namespaces/（｛namespacey/ 监听某个 PersistentVolumeClaim 的 GET</p>
<p>persistentvolumeclaims/｛name｝ 变化</p>
<p>下面基于 Fabric8 实现对资源对象的监听（Watch），代码如下：</p>
<p>private void testWatcher （）｛ _kube.pods（） .watch（new io.fabric8.kubernetes.client.Watcher&lt;Pod&gt;（）｛ @override</p>
<p>public void eventReceived （Action action, Pod pod）｛ System.out.println（action + &quot;： &quot; + pod）；</p>
<p>｝</p>
<p>• 290•</p>
<h2>第 304 页</h2>
<h3>第4章 Kubernetes 开发指南</h3>
<p>EOverride</p>
<p>public void onclose （KubernetesClientException e） ｛ System.out.printIn（&quot;Closed： &quot; + e）；</p>
<p>｝</p>
<p>｝；</p>
<p>｝</p>
<p>接下来基于 Jersey 框架实现通过 Proxy 方式访问 Pod。由于 API Server 针对Pod 资源提供 了两种 Proxy 访问接口，所以下面分别用两段代码进行示例说明。代码如下：</p>
<p>private void testPoxyPod（）｛ //访问第1种 proxy接口</p>
<p>Params params = new Params （）；</p>
<p>params.setNamespace （&quot;ns-sample&quot;）；</p>
<p>params.setName （&quot;pod-sample-in-namespace&quot;）；</p>
<p>params.setSubPath （&quot;/proxy&quot;）；</p>
<p>params.setResourceType （ResourceType. PODS）；</p>
<p>_restfulClient.get （params）；</p>
<p>1/访问第2种 proxy 接口</p>
<p>params = new Params （）i params.setNamespace （&quot;ns-sample&quot;）；</p>
<p>params.setName （&quot;pod-sample-in-namespace&quot;）；</p>
<p>params.setVisitProxy （true）；</p>
<p>params.setResourceType （ResourceType. PODS）；</p>
<p>_restfulClient.get （params）；</p>
<p>｝</p>
<p>• 291•</p>
</div>
