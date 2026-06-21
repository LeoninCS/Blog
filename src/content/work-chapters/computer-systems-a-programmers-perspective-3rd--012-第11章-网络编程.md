---
title: "第11章 网络编程"
description: "第11章 P TE 网络编程 R 网络应用随处可见。任何时候浏览 Web、发送email 信息或是玩在线游戏，你就正在 使用网络应用程序。有趣的是，所有的网络应用都是基于相同的基本编程模型，有着相似 的整体逻辑结构，并且依赖相同的编程接口。 网络应用依赖于很多在系统研究中已经学习过的概念。例如，进程、信号、字节顺 序、内存映射以及动态内存分配，都扮演着重要的"
readerUrl: "/books/computer-systems-a-programmers-perspective-3rd/012-第11章-网络编程.pdf"
sourceUrl: "授权 PDF：深入理解计算机系统 原书第3版 ,兰德尔E.布莱恩特 ,P737 ,2016.11.pdf，页 677-715"
workSlug: "computer-systems-a-programmers-perspective-3rd"
workTitle: "深入理解计算机系统（原书第 3 版）"
chapterSlug: "012-第11章-网络编程"
order: 12
categories: ["计算机基础", "系统"]
tags: ["CSAPP", "计算机系统", "C", "体系结构"]
---
<div class="imported-document imported-pdf-document">
<h2>第11章 网络编程</h2>
<h2>第 677 页</h2>
<h3>第11章</h3>
<p>P</p>
<p>TE</p>
<p>网络编程</p>
<p>R</p>
<p>网络应用随处可见。任何时候浏览 Web、发送email 信息或是玩在线游戏，你就正在 使用网络应用程序。有趣的是，所有的网络应用都是基于相同的基本编程模型，有着相似 的整体逻辑结构，并且依赖相同的编程接口。</p>
<p>网络应用依赖于很多在系统研究中已经学习过的概念。例如，进程、信号、字节顺 序、内存映射以及动态内存分配，都扮演着重要的角色。还有一些新概念要掌握。我们需 要理解基本的客户端-服务器编程模型，以及如何编写使用因特网提供的服务的客户端-服 务器程序。最后，我们将把所有这些概念结合起来，开发一个虽小但功能齐全的Web 服 务器，能够真实的Web 浏览器提供静态和动态的文本和图形内容。</p>
<h3>11.1 客户端-服务器编程模型</h3>
<p>每个网络应用都是基于客户端-服务器模型的。采用这个模型，一个应用是由一个服 务器进程和一个或者多个客户端进程组成。服务器管理某种资源，并且通过操作这种资源 来为它的客户端提供某种服务。例如，一个 Web 服务器管理着一组磁盘文件，它会代表 客户端进行检索和执行。一个 FTP 服务器管理着一组磁盘文件，它会为客户端进行存储 和检索。相似地，一个电子邮件服务器管理着一些文件，它为客户端进行读和更新。</p>
<p>客户端-服务器模型中的基本操作是事务（transaction）（见图11-1）。一个客户端-服务 器事务由以下四步组成。</p>
<p>1）当一个客户端需要服务时，它向服务器发送一个请求，发起一个事务。例如，当 Web 浏览器需要一个文件时，它就发送一个请求给 Web 服务器。</p>
<p>2）服务器收到请求后，解释它，并以适当的方式操作它的资源。例如，当Web 服务 器收到浏览器发出的请求后，它就读一个磁盘文件。</p>
<p>3） 服务器给客户端发送一个响应，并等待下一个请求。例如，Web 服务器将文件发 送回客户端。</p>
<p>4） 客户端收到响应并处理它。例如，当Web 浏览器收到来自服务器的一页后，就在 屏幕上显示此页。</p>
<p>1.客户端发送请求</p>
<p>4.客户端</p>
<p>处理响应</p>
<p>客户端</p>
<p>进程</p>
<p>服务器</p>
<p>进程</p>
<p>资源</p>
<p>3. 服务器发送响应</p>
<p>2.服务器</p>
<p>处理请求</p>
<p>图11-1</p>
<p>一个客户端-服务器事务</p>
<p>认识到客户端和服务器是进程，而不是常提到的机器或者主机，这是很重要的。一台 主机可以同时运行许多不同的客户端和服务器，而且一个客户端和服务器的事务可以在同 一台或是不同的主机上。无论客户端和服务器是怎样映射到主机上的，客户端-服务器模 型都是相同的。</p>
<h2>第 678 页</h2>
<h3>第11章 网络编程</h3>
<p>643</p>
<p>旁注 客户端-服务器事务与数据库事务 客户端-服务器事务不是数据库事务，没有数据库事务的任何特性，例如原子性。</p>
<p>在我们的上下文中，事务仅仅是客户端和服务器执行的一系列步骤。</p>
<h3>11.2 网络</h3>
<p>客户端和服务器通常运行在不同的主机上，并且通过计算机网络的硬件和软件资源来 通信。网络是很复杂的系统，在这里我们只想了解一点皮毛。我们的目标是从程序员的角 度给你一个切实可行的思维模型。</p>
<p>对主机而言，网络只是又一种1/O设备，是数据源和数据接收方，如图11-2所示。</p>
<p>一个插到1/0总线扩展槽的适配器提供了到网络的物理接口。从网络上接收到的数据 从适配器经过1/0和内存总线复制到内存，通常是通过DMA 传送。相似地，数据也能从 内存复制到网络。</p>
<p>CPU 芯片</p>
<p>Register file</p>
<p>ALU</p>
<p>总线接口</p>
<p>系统总线</p>
<p>1O</p>
<p>桥</p>
<p>内存总线</p>
<p>VO总线</p>
<p>主存</p>
<p>扩展槽</p>
<p>200</p>
<p>网络适配器</p>
<p>网络</p>
<p>USB</p>
<p>控制器</p>
<p>图形适配器</p>
<p>磁盘控制器</p>
<p>鼠标</p>
<p>键盘</p>
<p>监视器</p>
<p>磁盘</p>
<p>图11-2 一个网络主机的硬件组成</p>
<p>物理上而言，网络是一个按照地理远近组成的层次系统。最低层是 LAN（Local Area Network，局域网），在一个建筑或者校园范围内。迄今为止，最流行的局域网技术是以 太网（Ethernet），它是由施乐公司帕洛阿尔托研究中心（Xerox PARC）在20世纪70年代 中期提出的。以太网技术被证明是适应力极强的，从3Mb/s演变到 10Gb/s。</p>
<p>一个以太网段（Ethernet segment）包括一些电缆（通常是双绞线）和一个叫做集线器的 小盒子，如图11-3所示。以太网段通常跨越一些小的区域，例如某建筑物的一个房间 或者一个楼层。每根电缆都有相同的最大位带宽，通常是100Mb/s或者1Gb/s。一端连 接到主机的适配器，而另一端则连接到集线器的一个 端口上。集线器不加分辨地将从一个端口上收到的每 主机</p>
<p>主机</p>
<p>主机</p>
<p>个位复制到其他所有的端口上。因此，每台主机都能 100Mb/s</p>
<p>100Mb/s</p>
<p>看到每个位。</p>
<p>集线器</p>
<p>每个以太网适配器都有一个全球唯一的48位地址， 它存储在这个适配器的非易失性存储器上。一台主机可 图11-3 以太网段</p>
<h2>第 679 页</h2>
<p>644</p>
<p>第三部分 程序间的交互和通信</p>
<p>以发送一段位（称为帧（frame））到这个网段内的其他任何主机。每个顿包括一些固定数量 的头部（header）位，用来标识此帧的源和目的地址以及此帧的长度，此后紧随的就是数据 位的有效载荷（payload）。每个主机适配器都能看到这个帧，但是只有目的主机实际读 取它。</p>
<p>使用一些电缆和叫做网桥（bridge）的小盒子，多个以太网段可以连接成较大的局域网， 称为桥接以太网（bridged Ethernet），如图11-4所示。桥接以太网能够跨越整个建筑物或 者校区。在一个桥接以太网里，一些电缆连接网桥与网桥，而另外一些连接网桥和集线 器。这些电缆的带宽可以是不同的。在我们的示例中，网桥与网桥之间的电缆有1Gb/s的 带宽，而四根网桥和集线器之间电缆的带宽却是100Mb/s。</p>
<p>B</p>
<p>主机</p>
<p>主机</p>
<p>主机</p>
<p>主机</p>
<p>集线器</p>
<p>X</p>
<p>桥</p>
<p>主机</p>
<p>集线器</p>
<p>100Mb/s</p>
<p>100Mb/s</p>
<p>1Gb/s</p>
<p>100Mb/s</p>
<p>100Mb/s</p>
<p>主机</p>
<p>集线器</p>
<p>主机</p>
<p>主机</p>
<p>集线器</p>
<p>主机</p>
<p>桥</p>
<p>Y</p>
<p>主机</p>
<p>主机</p>
<p>主机</p>
<p>C</p>
<p>图 11-4 桥接以太网</p>
<p>网桥比集线器更充分地利用了电缆带宽。利用一种聪明的分配算法，它们随着时间自 动学习哪个主机可以通过哪个端口可达，然后只在有必要时，有选择地将帧从一个端口复 制到另一个端口。例如，如果主机 A 发送一个帧到同网段上的主机 B，当该帧到达网桥X 的输入端口时，X就将丢弃此帧，因而节省了其他网段上的带宽。然而，如果主机 A发送 一个帧到一个不同网段上的主机 C，那么网桥X只会把此帧复制到和网桥Y相连的端口 上，网桥Y 会只把此帧复制到与主机C的网段连接的端口。</p>
<p>为了简化局域网的表示，我们将把集线器和网桥以及连接它们的电缆画成一根水平 线，如图11-5所示。</p>
<p>在层次的更高级别中，多个不兼容的局域网可以通过叫做路由器（router）的特殊计算 机连接起来，组成一个 internet（互联网络）。每台路由器对于它所连接到的每个网络都有 一个适配器（端口）。路由器也能连接高速点到点电话连接，这是称为 WAN（Wide-Area Network，广域网）的网络示例，之所以这么叫是因为它 们覆盖的地理范围比局域网的大。一般而言，路由器可以 主机</p>
<p>主机</p>
<p>主机</p>
<p>用来由各种局域网和广域网构建互联网络。例如，图11-6 展示了一个互联网络的示例，3台路由器连接了一对局域 网和一对广域网。</p>
<p>图 11-5</p>
<p>局域网的概念视图</p>
<h2>第 680 页</h2>
<h3>第11章网络编程</h3>
<p>645</p>
<p>主机</p>
<p>主机</p>
<p>⋯••</p>
<p>主机</p>
<p>主机</p>
<p>主机</p>
<p>主机</p>
<p>LAN</p>
<p>LAN</p>
<p>路由器</p>
<p>路由器</p>
<p>路由器</p>
<p>WAN</p>
<p>WAN</p>
<p>图11-6 一个小型的互联网络。三台路由器连接起两个局域网和两个广域网 旁注</p>
<p>Internet 和 internet 我们总是用小写子母的</p>
<p>J internet 描述一般概念，而用大与子母的 Internet 米描述一 种具体的实现，也就是所谓的全球 IP 因特网。</p>
<p>互联网络至关重要的特性是，它能由采用完全不同和不兼容技术的各种局域网和广域 网组成。每台主机和其他每台主机都是物理相连的，但是如何能够让某台源主机跨过所有 这些不兼容的网络发送数据位到另一台目的主机呢？</p>
<p>解决办法是一层运行在每台主机和路由器上的协议软件，它消除了不同网络之间的差 异。这个软件实现一种协议，这种协议控制主机和路由器如何协同工作来实现数据传输。</p>
<p>这种协议必须提供两种基本能力：</p>
<p>• 命名机制。不同的局域网技术有不同和不兼容的方式来为主机分配地址。互联网络 协议通过定义一种一致的主机地址格式消除了这些差异。每台主机会被分配至少一 个这种互联网络地址（internet address），这个地址唯一地标识了这台主机。</p>
<p>• 传送机制。在电缆上编码位和将这些位封装成帧方面，不同的联网技术有不同的和 不兼容的方式。互联网络协议通过定义一种把数据位捆扎成不连续的片（称为包）的 统一方式，从而消除了这些差异。一个包是由包头和有效载荷组成的，其中包头包 括包的大小以及源主机和目的主机的地址，有效载荷包括从源主机发出的数据位。</p>
<p>.图11-7展示了主机和路由器如何使用互联网络协议在不兼容的局域网间传送数据的 一个示例。这个互联网络示例由两个局域网通过一台路由器连接而成。一个客户端运行在 主机A上，主机 A 与LAN1 相连，它发送一串数据字节到运行在主机 B 上的服务器端， 主机 B则连接在LAN2上。这个过程有8个基本步骤：</p>
<p>1）运行在主机 A上的客户端进行一个系统调用，从客户端的虚拟地址空间复制数据 到内核缓冲区中。</p>
<p>2） 主机 A上的协议软件通过在数据前附加互联网络包头和LAN1 帧头，创建了一个 LAN1的帧。互联网络包头寻址到互联网络主机 B。LAN1 帧头寻址到路由器。然后它传 送此帧到适配器。注意，LAN1帧的有效载荷是一个互联网络包，而互联网络包的有效载 荷是实际的用户数据。这种封装是基本的网络互联方法之一。</p>
<p>3） LAN1 适配器复制该帧到网络上。</p>
<p>4）当此帧到达路由器时，路由器的L.AN1适配器从电缆上读取它，并把它传送到协 议软件。</p>
<p>5）路由器从互联网络包头中提取出目的互联网络地址，并用它作为路由表的索引， 确定向哪里转发这个包，在本例中是LAN2。路由器剥落旧的LAN1 的帧头，加上寻址到 主机B的新的LAN2 帧头，并把得到的帧传送到适配器。</p>
<p>6） 路由器的LAN2适配器复制该帧到网络上。</p>
<h2>第 681 页</h2>
<p>646</p>
<p>第三部分 程序间的交互和通信</p>
<p>7）当此帧到达主机 B时，它的适配器从电缆上读到此帧，并将它传送到协议软件。</p>
<p>8）最后，主机 B上的协议软件剥落包头和帧头。当服务器进行一个读取这些数据的 系统调用时，协议软件最终将得到的数据复制到服务器的虚拟地址空间。</p>
<p>主机A</p>
<p>主机B</p>
<p>客户端</p>
<p>服务端</p>
<p>（1）</p>
<p>数据</p>
<p>（8）</p>
<p>数据</p>
<p>互联网络包</p>
<p>协议软件</p>
<p>协议软件</p>
<p>（2）</p>
<p>数据PH</p>
<p>FHI</p>
<p>（7）</p>
<p>数据</p>
<p>PH</p>
<p>FH2</p>
<p>LAN1帧</p>
<p>LAN1</p>
<p>适配器</p>
<p>LAN2</p>
<p>适配器</p>
<p>路由器</p>
<p>（3）</p>
<p>数据</p>
<p>PH|FH1</p>
<p>（6）</p>
<p>LAN2帧</p>
<p>数据</p>
<p>PH|FH2</p>
<p>LAN1</p>
<p>适配器</p>
<p>LAN2</p>
<p>适配器</p>
<p>LAN1</p>
<p>LAN2</p>
<p>（4）</p>
<p>数据</p>
<p>PH</p>
<p>FHI</p>
<p>数据</p>
<p>PH</p>
<p>FH2|</p>
<p>（5）</p>
<p>协议软件</p>
<p>图 11-7</p>
<p>在互联网络上，数据是如何从一台主机传送到另一台主机的（PH：互联网络包头；</p>
<p>FH1:LAN1 的帧头；FH2:1.AN2 的顿头） 当然，在这里我们掩盖了许多很难的问题。如果不同的网络有不同帧大小的最大值，该怎 么办呢？路由器如何知道该往哪里转发帧呢？当网络拓扑变化时，如何通知路由器？如果一个 包丢失了又会如何呢？虽然如此，我们的示例抓住了互联网络思想的精髓，封装是关键。</p>
<h3>11.3 全球 IP 因特网</h3>
<p>全球 IP 因特网是最著名和最成功的互联网络实现。从1969年起，它就以这样或那样 的形式存在了。虽然因特网的内部体系结构复杂而且不断变化，但是自从20世纪80年代 早期以来，客户端-服务器应用的组织就一直保持着相当的稳定。图11-8展示了一个因特 网客户端-服务器应用程序的基本硬件和软件组织。</p>
<p>互联网络客户端主机</p>
<p>互联网络服务器主机</p>
<p>客户端</p>
<p>：用户代码</p>
<p>服务器</p>
<p>套接字接口</p>
<p>（系统调用）</p>
<p>TCP/IP</p>
<p>：内核代码</p>
<p>TCP/IP</p>
<p>网络适配器</p>
<p>全球 IP 因特网</p>
<p>图11-8 一个因特网应用程序的硬件和软件组织 每台因特网主机都运行实现 TCP/IP 协议 （Transmission Control Protocol/Internet</p>
<h2>第 682 页</h2>
<h3>第11章 网络编程</h3>
<p>647</p>
<p>Protocol，传输控制协议/互联网络协议）的软件，几乎每个现代计算机系统都支持这个协 议。因特网的客户端和服务器混合使用套接字接口函数和 Unix 1/O 函数来进行通信（我们 将在11.4节中介绍套接字接口）。通常将套接字函数实现为系统调用，这些系统调用会陷 入内核，并调用各种内核模式的 TCP/IP 函数。</p>
<p>TCP/IP 实际是一个协议族，其中每一个都提供不同的功能。例如，IP 协议提供基本 的命名方法和递送机制，这种递送机制能够从一台因特网主机往其他主机发送包，也叫做 数据报（datagram）。IP 机制从某种意义上而言是不可靠的，因为，如果数据报在网络中丢 失或者重复，它并不会试图恢复。UDP（Unreliable Datagram Protocol，不可靠数据报协 议）稍微扩展了IP 协议，这样一来，包可以在进程间而不是在主机间传送。TCP 是一个构 建在IP 之上的复杂协议，提供了进程间可靠的全双工（双向的）连接。为了简化讨论，我 们将 TCP/IP 看做是一个单独的整体协议。我们将不讨论它的内部工作，只讨论 TCP 和 IP 为应用程序提供的某些基本功能。我们将不讨论 UDP。</p>
<p>从程序员的角度，我们可以把因特网看做一个世界范围的主机集合，满足以下特性：</p>
<p>• 主机集合被映射为一组32位的IP地址。</p>
<p>• 这组 IP 地址被映射为一组称为因特网域名（Internet domain name）的标识符。</p>
<p>• 因特网主机上的进程能够通过连接（connection）和任何其他因特网主机上的进程通信。</p>
<p>接下来三节将更详细地讨论这些基本的因特网概念。</p>
<p>旁注</p>
<p>IPv4 和 IPv6</p>
<p>最初的因特网协议，使用32位地址，称为因特网协议版本 4（Internet Protocol Version 4,IPv4）。1996年，因特网工程任务组织（Internet Engineering Task Force， IETF）提出了一个新版本的IP，称为因特网协议版本6（IPv6），它使用的是128位地址， 意在替代 IPV4。但是直到2015年，大约20年后，因特网流量的绝大部分还是由IPV4 网络承载的。例如，只有4%的访问 Google 服务的用户使用 IPv6 ［42］。</p>
<p>因为IPv6的使用率较低，本书不会讨论 IPv6的细节，而只是集中注意力于IPV4 背后的概念。当我们谈论因特网时，我们指的是基于IPv4的因特网。但是，本章后面 介绍的书写客户端和服务器的技术是基于现代接口的，与任何特殊的协议无关。</p>
<h3>11.3.1 IP地址</h3>
<p>IP 地址结构中。</p>
<p>一个 IP 地址就是一个32位无符号整数。网络程序将IP地址存放在如图11-9所示的 code/netp/netpfragments.c /* IP address structure */ struct in_addr ｛</p>
<p>uint32_t s_addr;/* Address in network byte order （big-endian）*/ ｝；</p>
<p>code/netp/netpfragments.c 图 11-9 IP 地址结构</p>
<p>把一个标量地址存放在结构中，是套接字接口早期实现的不幸产物。为IP地址定义一 个标量类型应该更有意义，但是现在更改已经太迟了，因为已经有大量应用是基于此的。</p>
<p>因为因特网主机可以有不同的主机字节顺序，TCP/IP 为任意整数数据项定义了统一的 网络字节顺序（network byte order）（大端字节顺序），例如IP地址，它放在包头中跨过网络被</p>
<h2>第 683 页</h2>
<p>648</p>
<p>第三部分 程序间的交互和通信</p>
<p>携带。在IP地址结构中存放的地址总是以（大端法）网络字节顺序存放的，即使主机字节顺序 （host byte order）是小端法。Unix 提供了下面这样的函数在网络和主机字节顺序间实现转换。</p>
<p>#include &lt;arpa/inet.h&gt; uint32_t htonl（uint32_t hostlong）；</p>
<p>uint16_t htons（uint16_t hostshort）；</p>
<p>uint32_t ntohl （uint32_t netlong）；</p>
<p>uint16_t ntohs（unit16_t netshort）；</p>
<p>返回：按照网络字节顺序的值。</p>
<p>返回：按照主机字节顺序的值。</p>
<p>hotn1 函数将32位整数由主机字节顺序转换为网络字节顺序。ntoh1 函数将32位整 数从网络字节顺序转换为主机字节。htons 和 ntohs 函数为16位无符号整数执行相应的 转换。注意，没有对应的处理64位值的函数。</p>
<p>IP 地址通常是以一种称为点分十进制表示法来表示的，这里，每个字节由它的十进 制值表示，并且用句点和其他字节间分开。例如，128.2.194.242就是地址 Ox8002c2£2 的点分十进制表示。在 Linux 系统上，你能够使用 HOSTNAME 命令来确定你自己主机 的点分十进制地址：</p>
<p>linux&gt; hostname -i 128.2.210.175</p>
<p>应用程序使用 inet_pton 和 inet_ntop 函数来实现 IP地址和点分十进制串之间的转换。</p>
<p>#include &lt;arpa/inet.h&gt; int inet_pton（AF_INET,const char *srC, void *dst）；</p>
<p>返回：若成功则为1，若 sIC 为非法点分十进制地址则为O，若出错则为一1。</p>
<p>const char *inet_ntop（AF_INET, const void *src, char *dst， socklen_t size）；</p>
<p>返回：若成功则指向点分十进制字符串的指针，若出错则为 NULL。</p>
<p>在这些函数名中，“n”代表网络，“p” 代表表示。它们可以处理32位IPv4地址（AF_IN- ET）（就像这里展示的那样），或者128位IPv6地址（AF_INET6）（这部分我们不讲）。</p>
<p>inet_pton 函数将一个点分十进制串（src）转换为一个二进制的网络字节顺序的IP地 址（dst）。如果 src没有指向一个合法的点分十进制字符串，那么该函数就返回0。任何 其他错误会返回一1，并设置errno。相似地，inet _ntop 函数将一个二进制的网络字节 顺序的IP 地址（src）转换为它所对应的点分十进制表示，并把得到的以 null 结尾的字符串 的最多 size 个字节复制到 ast。</p>
<p>练习题11.1 完成下表：</p>
<p>十六进制地址</p>
<p>0×0</p>
<p>Oxffffffff</p>
<p>0x7£000001</p>
<p>点分十进制地址</p>
<p>205.188.160.121</p>
<p>64.12.149.13</p>
<p>205.188.146.23</p>
<h2>第 684 页</h2>
<h3>第11章网络编程</h3>
<p>649</p>
<p>• 练习题 11.2</p>
<p>出结果。例如</p>
<p>1inux&gt;•/hex2dd</p>
<p>0x8002c2f2</p>
<p>128.2.194.242</p>
<p>练习题 11.3</p>
<p>出结果。例如</p>
<p>linux&gt;./dd2hex 128.2.194.242 0x8002c2f2</p>
<p>编写程序 hex2dd.c，将它的十六进制参数转换为点分十进制串并打印 编写程序 dd2hex.c，将它的点分十进制参数转换为十六进制数并打印</p>
<h3>11.3.2 因特网域名</h3>
<p>因特网客户端和服务器互相通信时使用的是IP 地址。然而，对于人们而言，大整数 是很难记住的，所以因特网也定义了一组更加人性化的域名（domain name），以及一种将 域名映射到IP地址的机制。域名是一串用句点分隔的单词（字母、数字和破折号），例如 whaleshark.ics.cs.cmu.edu.</p>
<p>域名集合形成了一个层次结构，每个域名编码了它在这个层次中的位置。通过一个示 例你将很容易理解这点。图11-10展示了域名层次结构的一部分。层次结构可以表示为一 棵树。树的节点表示域名，反向到根的路径形成了域名。子树称为子城（subdomain）。层 次结构中的第一层是一个未命名的根节点。下一层是一组一级城名（first-level domain name），由非营利组织 ICANN（Internet Corporation for Assigned Names and Numbers， 因特网分配名字数字协会）定义。常见的第一层域名包括 com、edu、gov、org 和 net。</p>
<p>未命名的根</p>
<p>mil</p>
<p>edu</p>
<p>gOV</p>
<p>Com</p>
<p>mit</p>
<p>cmu</p>
<p>berkeley</p>
<p>amazon</p>
<p>第一层城名</p>
<p>第二层域名</p>
<p>ece</p>
<p>www</p>
<p>176.32.98.166</p>
<p>第三层城名</p>
<p>ics</p>
<p>pdl</p>
<p>whaleshark</p>
<p>128.2.210.175</p>
<p>www</p>
<p>128.2.131.66</p>
<p>图11-10 因特网域名层次结构的一部分 下一层是二级（second-level）域名，例如 cmu. edu，这些域名是由ICANN 的各个授权 代理按照先到先服务的基础分配的。一旦一个组织得到了一个二级域名，那么它就可以在 这个子域中创建任何新的域名了，例如 cs.cmu.edu。</p>
<p>因特网定义了域名集合和IP 地址集合之间的映射。直到1988年，这个映射都是通过 一个叫做HOSTS.TXT的文本文件来手工维护的。从那以后，这个映射是通过分布世界范 围内的数据库（称为 DNS（Domain Name System，域名系统））来维护的。从概念上而言， DNS 数据库由上百万的主机条目结构（host entry structure）组成，其中每条定义了一组域 名和一组IP 地址之间的映射。从数学意义上讲，可以认为每条主机条目就是一个域名和</p>
<h2>第 685 页</h2>
<p>650</p>
<p>第三部分 程序间的交互和通信</p>
<p>IP 地址的等价类。我们可以用Linux 的 NSLOOKUP 程序来探究 DNS 映射的一些属性， 这个程序能展示与某个 IP 地址对应的域名。9 每台因特网主机都有本地定义的域名 1ocalhost，这个域名总是映射为回送地址 （loopback address） 127.0.0.1：</p>
<p>linux&gt; nslookup localhost Address: 127.0.0.1 localhost 名字为引用运行在同一台机器上的客户端和服务器提供了一种便利和可移植 的方式，这对调试相当有用。我们可以使用 HOSTNAME 来确定本地主机的实际域名：</p>
<p>1inux&gt; hostname</p>
<p>whaleshark.ics.cs.cmu.edu 在最简单的情况中，一个域名和一个 IP 地址之间是一一映射：</p>
<p>1inux&gt; nslookup whaleshark.ics.cs.cmu.edu Address: 128.2.210.175 然而，在某些情况下，多个域名可以映射为同一个IP地址：</p>
<p>1inux&gt; nslookup cs.mit.edu Address: 18.62.1.6 1inux&gt; nslookup eecs.mit.edu Address: 18.62.1.6 在最通常的情况下，多个域名可以映射到同一组的多个 IP 地址：</p>
<p>1inux&gt; nslookup</p>
<p>www.twitter.com</p>
<p>Address: 199.16.156.6 Address: 199.16.156.70 Address: 199.16.156.102 Address: 199.16.156.230 1inux&gt; nslookup</p>
<p>twitter.com</p>
<p>Address: 199.16.156.102 Address: 199.16.156.230 Address: 199.16.156.6 Address: 199.16.156.70 最后，我们注意到某些合法的域名没有映射到任何IP 地址：</p>
<p>1inux&gt; nslookup edu *** Can&#x27;t find edu: No answer linux&gt; nslookup ics.cs.cmu.edu *** Can&#x27;t find ics.cs.cmu.edu: No answer 旁注</p>
<p>有多少因特网主机？</p>
<p>因特网软件协会（Internet Software Consortium, www.isc. org）自从1987年以后，每年进 行两次因特网域名调查。这个调查通过计算已经分配给一个域名的IP地址的数量来估算因特 网主机的数量，展示了一种令人吃惊的趋势。自从1987年以来，当时一共大约有20000台因特 网主机，主机的数量已经在指数性增长。到2015年，已经有大约1 000 000 000台因特网主机了。</p>
<p>①</p>
<p>我们重新调整了 NSLOOKUP 的输出以提高可读性。</p>
<h2>第 686 页</h2>
<h3>第11章 网络编程</h3>
<p>651</p>
<h3>11.3.3 因特网连接</h3>
<p>因特网客户端和服务器通过在连接上发送和接收字节流来通信。从连接一对进程的意 义上而言，连接是点对点的。从数据可以同时双向流动的角度来说，它是全双工的。并且 从（除了一些如粗心的耕锄机操作员切断了电缆引起灾难性的失败以外）由源进程发出的字 节流最终被目的进程以它发出的顺序收到它的角度来说，它也是可靠的。</p>
<p>一个套接字是连接的一个端点。每个套接字都有相应的套接字地址，是由一个因特网 地址和一个16位的整数端口◎组成的，用“地址：端口”来表示。</p>
<p>当客户端发起一个连接请求时，客户端套接字地址中的端口是由内核自动分配的，称 为临时端口（ephemeral port）。然而，服务器套接字地址中的端口通常是某个知名端口， 是和这个服务相对应的。例如，Web 服务器通常使用端口80，而电子邮件服务器使用端 口25。每个具有知名端口的服务都有一个对应的知名的服务名。例如，Web 服务的知名 名字是 http，email 的知名名字是 smtp。文件/etc/services 包含一张这台机器提供的 知名名字和知名端口之间的映射。</p>
<p>一个连接是由它两端的套接字地址唯一确定的。这对套接字地址叫做套接字对（socket pair），由下列元组来表示：</p>
<p>（cliaddr:cliport, servaddr:servport） 其中 cliaddr 是客户端的IP 地址，cliport 是客户端的端口，servaddr 是服务器的IP 地址，而 servport 是服务器的端口。例如，图11-11 展示了一个 Web 客户端和一个 Web 服务器之间的连接。</p>
<p>客户端套接字地址</p>
<p>128.2.194.242:51213 服务器套接字地址</p>
<p>208.216.181.15:80</p>
<p>客户端</p>
<p>服务器</p>
<p>（port 80）</p>
<p>连接套接字对</p>
<p>（128.2.194.242:51213,208.216.181.15:80） 客户端主机地址</p>
<p>128.2.194.242</p>
<p>服务器主机地址</p>
<p>208.216.181.15</p>
<p>图 11-11</p>
<p>因特网连接分析</p>
<p>在这个示例中，Web 客户端的套接字地址是 128.2.194.242:51213 其中端口号 51213是内核分配的临时端口号。Web 服务器的套接字地址是 208.216.181.15:80</p>
<p>其中端口号80是和 Web 服务相关联的知名端口号。给定这些客户端和服务器套接字地 址，客户端和服务器之间的连接就由下列套接字对唯一确定了：</p>
<p>（128.2.194.242:51213，208.216.181.15:80） 旁注</p>
<p>因特网的起源</p>
<p>因特网是政府、学校和工业界合作的最成功的示例之一。它成功的因素很多，但是 我们认为有两点尤其重要：美国政府30年持续不变的投资，以及充满激情的研究人员 ①</p>
<p>这些软件端口与网络中交换机和路由器的硬件端口没有关系。</p>
<h2>第 687 页</h2>
<p>652</p>
<p>第三部分 程序间的交互和通信</p>
<p>对麻省理工学院的 Dave Clarke提出的“粗略一致和能用的代码”的投入。</p>
<p>因特网的种子是在1957年播下的，其时正值冷战的高峰，苏联发射 Sputnik，第一颗人 造地球卫星，震惊了世界。作为响应，美国政府创建了高级研究计划署（ARPA），其任务就 是重建美国在科学与技术上的领导地位。1967年，ARPA的 Lawrence Roberts 提出了一个计 划，建立一个叫做ARPANET 的新网络。第一个 ARPANET 节点是在1969年建立并运行的。</p>
<p>到1971年，已有13个 ARPANET 节点，而且 email 作为第一个重要的网络应用涌现出来。</p>
<p>1972年，Robert Kahn 概括了网络互联的一般原则：一组互相连接的网络，通过叫 做“路由器”的黑盒子按照“以尽力传送作为基础”在互相独立处理的网络间实现通 信。1974年，Kahn 和 Vinton Cerf 发表了TCP/IP 协议的第一本详细资料，到1982年 它成为了 ARPANET 的标准网络互联协议。1983年1月1日，ARPANET的每个节点 都切换到 TCP/IP，标志着全球 IP 因特网的诞生。</p>
<p>1985年，Paul Mockapetris 发明了 DNS，有1000多台因特网主机。1986年，国家 科学基金会（NSF）用 56KB/s的电话线连接了 13个节点，构建了 NSFNET 的骨干网。</p>
<p>其后在1988年升级到1.5MB/sT1 的连接速率，1991年为 45MB/s T3的连接速率。到 1988 年，有超过 50 000</p>
<p>台主机。1989年，原始的 ARPANET 正式退休了。1995年， 已经有几乎10000000台因特网主机了，NSF 取消了 NSFNET，并且用基于由公众网 络接入点连接的私有商业骨干网的现代因特网架构取代了它。</p>
<h3>11.4 套接字接口</h3>
<p>套接字接口（socket interface）是一组函数，它们和 Unix 1/O函数结合起来，用以创建 网络应用。大多数现代系统上都实现套接字接口，包括所有的Unix 变种、Windows 和 Macintosh 系统。图11-12给出了一个典型的客户端-服务器事务的上下文中的套接字接口 概述。当讨论各个函数时，你可以使用这张图来作为向导图。</p>
<p>客户端</p>
<p>getaddrinfo</p>
<p>服务器</p>
<p>getaddrinfo</p>
<p>socket</p>
<p>socket</p>
<p>open_listenfd</p>
<p>open_clientfd</p>
<p>bind</p>
<p>listen</p>
<p>连接请求</p>
<p>connect</p>
<p>accept</p>
<p>rio_writen</p>
<p>rio_readlineb</p>
<p>rio_readlineb</p>
<p>rio_writen</p>
<p>等待来自下一个</p>
<p>客户端的连接请求</p>
<p>EOF</p>
<p>close</p>
<p>rio_readlineb</p>
<p>close</p>
<p>图11-12</p>
<p>基于套接字接口的网络应用概述</p>
<h2>第 688 页</h2>
<h3>第11章网络编程</h3>
<p>653</p>
<p>旁注 套接字接口的起源</p>
<p>套接字接口是加州大学伯克利分校的研究人员在20世纪80年代早期提出的。因汐 这个原因，它也经常被叫做伯克利套接字。伯克利的研究者使得套接字接口适用于任何 底层的协议。第一个实现的就是针对 TCP/IP 协议的，他们把它包括在 Unix 4.2BSD的 内核里，并且分发给许多学校和实验室。这在因特网的历史上是一个重大事件。几乎一 夜之间，成千上万的人们接触到了 TCP/IP 和它的源代码。它引起了巨大的轰动，并激 发了新的网络和网络互联研究的浪潮。</p>
<p>11.4. 1 套接字地址结构</p>
<p>从Linux 内核的角度来看，一个套接字就是通信的一个端点。从 Linux 程序的角度来 看，套接字就是一个有相应描述符的打开文件。</p>
<p>因特网的套接字地址存放在如图 11-13所示的类型为 sockaddr_in 的16 字节结构中。</p>
<p>对于因特网应用，sin_family 成员是 AF_INET,sin_port 成员是一个16位的端口号， 而 sin_addr 成员就是一个32位的IP 地址。IP地址和端口号总是以网络字节顺序（大端 法）存放的。</p>
<p>code/netp/netpfragments.c /* IP socket address structure */ struct sockaddr_in｛ uint16_t</p>
<p>uint16_t</p>
<p>struct in_addr</p>
<p>unsigned char</p>
<p>sin_family; /* Protocol family （always AF_INET） */ sin_port; /* Port number in network byte order */ sin_addr; /* IP address in network byte order */ sin_zero［8］；/* Pad to sizeof （struct sockaddr） */ ｝；</p>
<p>/* Generic</p>
<p>socket address</p>
<p>structure （for connect, bind, and accept）*/ .struct sockaddr t uint16_t sa_family；</p>
<p>/* Protocol family */ char</p>
<p>sa_data［14］； /* Address data */</p>
<p>｝；</p>
<p>code/netp/netpfragments.c 图11-13</p>
<p>套接字地址结构</p>
<p>旁注</p>
<p>_in 后缀意味什么？</p>
<p>_in 后缀是互联网络（internet）的缩写，而不是输入（input）的缩写。</p>
<p>connect、bind 和 accept 函数要求一个指向与协议相关的套接字地址结构的指针。</p>
<p>套接字接口的设计者面临的问题是，如何定义这些函数，使之能接受各种类型的套接字地 址结构。今天我们可以使用通用的void* 指针，但是那时在C中并不存在这种类型的指 针。解决办法是定义套接字函数要求一个指向通用 sockaddr 结构（图11-13）的指针，然 后要求应用程序将与协议特定的结构的指针强制转换成这个通用结构。为了简化代码示 例，我们跟随 Steven 的指导，定义下面的类型：</p>
<p>typedef</p>
<p>struct sockaddr SA；</p>
<p>然后无论何时需要将 sockaddr _in 结构强制转换成通用</p>
<p>sockaddr 结构时，我们都使用 这个类型。</p>
<h2>第 689 页</h2>
<p>654</p>
<p>第三部分 程序间的交互和通信</p>
<h3>11.4.2 socket 函数</h3>
<p>客户端和服务器使用 socket 函数来创建一个套接字描述符（socket descriptor）。</p>
<p>#include &lt;sys/types.h&gt; #include &lt;sys/socket.h&gt; int</p>
<p>socket （int domain,int type, int protocol）；</p>
<p>返回：若成功则为非负描述符，若出错则为一1。</p>
<p>如果想要使套接字成为连接的一个端点，就用如下硬编码的参数来调用 socket 函数：</p>
<p>clientfd = Socket （AF_INET, SOCK_STREAM, O）；</p>
<p>其中，AF_INET 表明我们正在使用32位IP 地址，而 SOCK_STREAM 表示这个套接字 是连接的一个端点。不过最好的方法是用 getaddrinfo 函数（11.4.7节）来自动生成这些 参数，这样代码就与协议无关了。我们会在11.4.8节中向你展示如何配合 socket 函数来 使用 getaddrinfo。</p>
<p>socket 返回的clientfd描述符仅是部分打开的，还不能用于读写。如何完成打开 套接字的工作，取决于我们是客户端还是服务器。下一节描述当我们是客户端时如何完成 打开套接字的工作。</p>
<p>11.4. 3</p>
<p>connect 函数</p>
<p>客户端通过调用 connect 函数来建立和服务器的连接。</p>
<p>#include &lt;sys/socket.h&gt; int connect （int clientfd, const struct sockaddr *addr， socklen_t addrlen）；</p>
<p>返回：若成功则为0，若出错则为一1。</p>
<p>connect 函数试图与套接字地址为 addr 的服务器建立一个因特网连接，其中 addrlen 是 sizeof（sockaddr_in）。connect 函数会阻塞，一直到连接成功建立或是发生错误。如果 成功，clientfd描述符现在就准备好可以读写了，并且得到的连接是由套接字对 （x:Y，addr.sin_addr:addr.sin_port） 刻画的，其中x表示客户端的IP 地址，而y表示临时端口，它唯一地确定了客户端主机 上的客户端进程。对于 socket，最好的方法是用 getaddrinfo 来为 connect 提供参数 （见11.4.8节）。</p>
<h3>11.4.4 bind 函数</h3>
<p>剩下的套接字函数</p>
<p>-bind、1isten 和 accept，服务器用它们来和客户端建立连接。</p>
<p>#include &lt;sys/socket.h&gt; int bind（int sockfd, const struct sockaddr *addr， socklen_t addrlen）；</p>
<p>返回：若成功则为O，若出错则为一1。</p>
<h2>第 690 页</h2>
<h3>第11章网络编程</h3>
<p>655</p>
<p>bind 函数告诉内核将 addr 中的服务器套接字地址和套接字描述符 sockfd 联系起 来。参数 addrlen 就是 sizeof（sockaddr_in）。对于 socket 和 connect，最好的方法 是用 getaddrinfo来为bind 提供参数（见11.4.8节）。</p>
<p>11.4.5</p>
<p>listen 函数</p>
<p>客户端是发起连接请求的主动实体。服务器是等待来自客户端的连接请求的被动实 体。默认情况下，内核会认为 socket 函数创建的描述符对应于主动套接字（active sock- et），它存在于一个连接的客户端。服务器调用 1isten 函数告诉内核，描述符是被服务器 而不是客户端使用的。</p>
<p>#include &lt;sys/socket.h&gt; int listen（int sockfd, int backlog）；</p>
<p>返回：若成功则为O，若出错则为一1。</p>
<p>1isten 函数将 sockfd从一个主动套接字转化为一个监听套接字（listening socket）， 该套接字可以接受来自客户端的连接请求。backlog 参数暗示了内核在开始拒绝连接请求 之前，队列中要排队的未完成的连接请求的数量。backlog 参数的确切含义要求对 TCP/ IP 协议的理解，这超出了我们讨论的范围。通常我们会把它设置为一个较大的值，比 如1024。</p>
<p>11.4.6</p>
<p>accept 函数</p>
<p>服务器通过调用 accept 函数来等待来自客户端的连接请求。</p>
<p>#include &lt;sys/socket.h&gt; int</p>
<p>accept （int listenfd, struct sockaddr *addr, int *addrlen）；</p>
<p>返回：若成功则为非负连接描述符，若出错则为一1。</p>
<p>accept 函数等待来自客户端的连接请求到达侦听描述符 1istenfd，然后在 addr 中 填写客户端的套接字地址，并返回一个已连接描述符（connected descriptor），这个描述符 可被用来利用 Unix 1/O 函数与客户端通信。</p>
<p>监听描述符和已连接描述符之间的区别使很多人感到迷惑。监听描述符是作为客户端 连接请求的一个端点。它通常被创建一次，并存在于服务器的整个生命周期。已连接描述 符是客户端和服务器之间已经建立起来了的连接的一个端点。服务器每次接受连接请求时 都会创建一次，它只存在于服务器为一个客户端服务的过程中。</p>
<p>图11-14描绘了监听描述符和已连接描述符的角色。在第一步中，服务器调用 accept，等待连接请求到达监听描述符，具体地我们设定为描述符3。回忆一下，描述符 0~2是预留给了标准文件的。</p>
<p>在第二步中，客户端调用</p>
<p>connect 函数，发送一个连接请求到 1istenfd。第三步， accept 函数打开了一个新的已连接描述符connfd（我们假设是描述符4），在 clientfd 和 connfd之间建立连接，并且随后返回 connfd给应用程序。客户端也从 connect 返回， 在这一点以后，客户端和服务器就可以分别通过读和写 clientfd 和 connfd 来回传送数 据了。</p>
<h2>第 691 页</h2>
<p>656</p>
<p>第三部分 程序间的交互和通信</p>
<p>客户端</p>
<p>1istenfd （3）</p>
<p>服务器</p>
<p>1.服务器阻塞在 accept，等待监听 描述符 1istenfd上的连接请求。</p>
<p>clientfd</p>
<p>连接请求</p>
<p>客户端</p>
<p>listenfd （3）</p>
<p>服务器</p>
<p>2.客户端通过调用和阻塞在 connect， 创建连接请求。</p>
<p>clientfd</p>
<p>1istenfd （3）</p>
<p>客户端</p>
<p>clientfd</p>
<p>服务器</p>
<p>connfd（4）</p>
<p>3. 服务器从 accept 返回 connfd。客户端 从 connect 返回。现在在 clientfd 和 connfd 之间已经建立起了连接。</p>
<p>图 11-14</p>
<p>监听描述符和已连接描述符的角色</p>
<p>旁注</p>
<p>为何要有监听描述符和已连接描述符之间的区别？</p>
<p>你可能很想知道为什么套接字接口要区别监听描述符和已连接描述符。乍一看，这 像是不必要的复杂化。然而，区分这两者被证明是很有用的，因为它使得我们可以建立 并发服务器，它能够同时处理许多客户端连接。例如，每次一个连接请求到达监听描述 符时，我们可以派生（fork）一个新的进程，它通过已连接描述符与客户端通信。在第12 章中将介绍更多关于并发服务器的内容。</p>
<h3>11.4.7 主机和服务的转换</h3>
<p>Linux 提供了一些强大的函数（称 getaddrinfo 和 getnameinfo）实现二进制套接字地 址结构和主机名、主机地址、服务名和端口号的字符串表示之间的相互转化。当和套接字接 口一起使用时，这些函数能使我们编写独立于任何特定版本的IP 协议的网络程序。</p>
<p>1. getaddrinfo 函数</p>
<p>getaddrinfo 函数将主机名、主机地址、服务名和端口号的字符串表示转化成套接 字地址结构。它是已弃用的 gethostbyname 和 getservbyname 函数的新的替代品。和以 前的那些函数不同，这个函数是可重入的（见12.7.2节），适用于任何协议。</p>
<p>#include &lt;sys/types.h&gt; #include &lt;sys/socket.h&gt; #include &lt;netdb.h&gt; int getaddrinfo（const char *host， const char *service， const struct addrinfo *hints， struct addrinfo **result）；</p>
<p>返回：如果成功则为0，如果错误则为非零的错误代码。</p>
<p>void</p>
<p>freeaddrinfo（struct addrinfo *result）；</p>
<p>返回：无。</p>
<p>const char *gai_strerror（int errcode）；</p>
<p>返回：错误消息。</p>
<p>给定 host 和 service（套接字地址的两个组成部分），getaddrinfo 返回 result， result 一个指向 addrinfo结构的链表，其中每个结构指向一个对应于 host 和 service 的套接字地址结构（图11-15）。</p>
<h2>第 692 页</h2>
<h3>第11章网络编程</h3>
<p>657</p>
<p>result</p>
<p>addrinfo结构</p>
<p>ai</p>
<p>Canonname</p>
<p>ai_addr</p>
<p>ai next</p>
<p>套接字地址结构</p>
<p>NULL</p>
<p>ai_addr</p>
<p>ai_next</p>
<p>NULL</p>
<p>ai</p>
<p>_addr</p>
<p>NULL</p>
<p>图11-15</p>
<p>getaddrinfo返回的数据结构 在客户端调用了 getaddrinfo 之后，会遍历这个列表，依次尝试每个套接字地址，直到调 用socket 和 connect成功，建立起连接。类似地，服务器会尝试遍历列表中的每个套接字地 址，直到调用 socket 和 bind成功，描述符会被绑定到一个合法的套接字地址。为了避免内存 泄漏，应用程序必须在最后调用 Ereeaddrinfo，释放该链表。如果 getaddrinfo 返回非零的 错误代码，应用程序可以调用 gai_streeror，将该代码转换成消息字符串。</p>
<p>getaddrinfo 的host参数可以是域名，也可以是数字地址（如点分十进制IP地址）。</p>
<p>service 参数可以是服务名（如 http），也可以是十进制端口号。如果不想把主机名转换成地 址，可以把 host设置为NULL。对 service 来说也是一样。但是必须指定两者中至少一个。</p>
<p>可选的参数 hints 是一个 addrinfo 结构（见图 11-16），它提供对 getaddrinfo 返回 的套接字地址列表的更好的控制。如果要传递 hints 参数，只能设置下列字段：ai _fam-</p>
<p>ily、ai</p>
<p>_socktype、ai</p>
<p>_protocol 和 ai_flags 字段。其他字段必须设置为，（或 NULL）。实际中，我们用 memset 将整个结构清零，然后有选择地设置一些字段：</p>
<p>• getaddrinfo 默认可以返回IPv4和IPv6套接字地址。ai_Eamily设置次 AF_IN- ET 会将列表限制为IPv4地址；设置为AF_INET6 则限制为IPv6 地址。</p>
<p>• 对于 host 关联的每个地址，getaddrinfo 函数默认最多返回三个 addrinfo 结构， 每个的 ai</p>
<p>socktype 字段不同：一个是连接，一个是数据报（本书未讲述），一个 是原始套接字（本书未讲述）。ai」</p>
<p>_socktype 设置为 SOCK_STREAM 将列表限制为 对每个地址最多一个 addrinfo 结构，该结构的套接字地址可以作为连接的一个端 点。这是所有示例程序所期望的行为。</p>
<p>• ai</p>
<p>flags 字段是一个位掩码，可以进一步修改默认行为。可以把各种值用OR组 合起来得到该掩码。下面是一些我们认为有用的值：</p>
<p>AL_ADDRCONFIG。如果在使用连接，就推荐使用这个标志［34］。它要求只有当 本地主机被配置为IPv4 时，getaddrinfo返回IPv4地址。对 IPv6也是类似。</p>
<p>AI_CANONNAME。ai</p>
<p>-canonname 字段默认为 NULL。如果设置了该标志， 就是告诉getaddrinfo 将列表中第一个 addrinfo结构的 ai canonname 字段指向</p>
<p>host 的权威（官方）名字（见图11-15）。</p>
<h2>第 693 页</h2>
<p>658</p>
<p>第三部分 程序间的交互和通信</p>
<p>ALNUMERICSERV。参数 service 默认可以是服务名或端口号。这个标志 强制参数 service 为端口号。</p>
<p>AI_PASSIVE。 getaddrinfo 默认返回套接字地址，客户端可以在调用 connect 时用作主动套接字。这个标志告诉该函数，返回的套接字地址可能被服务器用作监 听套接字。在这种情况中，参数 host 应该为 NULL。得到的套接字地址结构中的 地址字段会是通配符地址（wildcard address），告诉内核这个服务器会接受发送到该 主机所有IP地址的请求。这是所有示例服务器所期望的行为。</p>
<p>codenetp/netpfragments.c struct addrinfo ｛</p>
<p>int</p>
<p>ai_flags；</p>
<p>/* Hints argument flags */ int</p>
<p>ai_family；</p>
<p>/* First arg to socket function */ int</p>
<p>ai_socktype；</p>
<p>/* Second arg to socket function */ int</p>
<p>ai_protocol；</p>
<p>/* Third arg to socket function */</p>
<p>Char</p>
<p>*ai_canonname;/* Canonical hostname */ size_t</p>
<p>ai_addrlen；</p>
<p>/* Size of ai_addr struct */ struct</p>
<p>sockaddr *ai_addr；</p>
<p>/* Ptr to</p>
<p>socket address structure */ struct addrinfo *ai_next；</p>
<p>/* Ptr to next item in linked list */ ｝；</p>
<p>code/netp/netpfragments.c 图11-16</p>
<p>getaddrinfo 使用的 addrinfo结构 当 getaddrinfo创建输出列表中的 addrinfo结构时，会填写每个字段，除了ai_ flags。ai_addr 字段指向一个套接字地址结构，ai.</p>
<p>_addrlen 字段给出这个套接字地址 结构的大小，而 ai_next 字段指向列表中下一个 addrinfo结构。其他字段描述这个套接 字地址的各种属性。</p>
<p>getaddrinfo一个很好的方面是 addrinfo结构中的字段是不透明的，即它们可以直 接传递给套接字接口中的函数，应用程序代码无需再做任何处理。例如，ai _fanily、ai_</p>
<p>socktype 和 ai_protocol 可以直接传递给 socket。类似地，ai_addr 和 ai_addrlen 可以直接传递给 connect 和bind。这个强大的属性使得我们编写的客户端和服务器能够 独立于某个特殊版本的IP协议。</p>
<p>2. getnameinfo 函数</p>
<p>getnameinfo 函数和 getaddrinfo 是相反的，将一个套接字地址结构转换成相应的 主机和服务名字符串。它是已弃用的 gethostbyaddr 和 getservbyport 函数的新的替代 品，和以前的那些函数不同，它是可重人和与协议无关的。</p>
<p>#include &lt;sys/socket.h&gt; #include &lt;netdb.h&gt; int getnameinfo（const struct sockaddr *sa, socklen_t salen， char *host,size_t hostlen， char *service,size_t servlen, int flags）；</p>
<p>返回：如果成功则为0，如果错误则为非零的错误代码。</p>
<p>参数 sa 指向大小为 salen 字节的套接字地址结构，host 指向大小为 hostlen字节的缓 冲区，service 指向大小为 servlen 字节的缓冲区。getnameinfo 函数将套接字地址结构 sa 转换成对应的主机和服务名字符串，并将它们复制到 host 和 servcice 缓冲区。如果 getnam-</p>
<h2>第 694 页</h2>
<h3>第11章网络编程</h3>
<p>659</p>
<p>einfo返回非零的错误代码，应用程序可以调用gai_strerror 把它转化成字符串。</p>
<p>如果不想要主机名，可以把host 设置为 NULL,hostlen设置为0。对服务字段来 说也是一样。不过，两者必须设置其中之一。</p>
<p>参数 flags 是一个位掩码，能够修改默认的行。可以把各种值用OR组合起来得到 该掩码。下面是两个有用的值：</p>
<p>• NI_NUMERICHOST。getnameinfo 默认试图返回 host 中的域名。设置该标志会 使该函数返回一个数字地址字符串。</p>
<p>• NLNUMERICSERV。 getnameinfo 默认会检查/etc/services，如果可能，会返回 服务名而不是端口号。设置该标志会使该函数跳过查找，简单地返回端口号。</p>
<p>图11-17给出了一个简单的程序，称为 HOSTINFO，它使用 getaddrinfo 和 getnameinfo 展示出域名到和它相关联的IP地址之间的映射。该程序类似于 11.3.2 节中的 NSLOOKUP 程序。</p>
<p>code/netp/hostinfo.c 1</p>
<p>#include &quot;csapp.h&quot; int main（int argc, char **argv） ｛</p>
<p>struct addrinfo *p，*listp, hints；</p>
<p>char buf ［MAXLINE］；</p>
<p>int rC,flags；</p>
<p>if （argc ！= 2）｛</p>
<p>exit （O）；</p>
<p>fprintf（stderr，&quot;usage： %s &lt;domain name&gt;\n&quot;， argv ［0］）；</p>
<p>9</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>15</p>
<p>16</p>
<p>17</p>
<p>18</p>
<p>19</p>
<p>20</p>
<p>21</p>
<p>22</p>
<p>23</p>
<p>24</p>
<p>25</p>
<p>26</p>
<p>27</p>
<p>28</p>
<p>29</p>
<p>30</p>
<p>31</p>
<p>32</p>
<p>33</p>
<p>34</p>
<p>｝</p>
<p>/* Get a list of addrinfo records */ memset （&amp;hints, 0, sizeof （struct addrinfo））；</p>
<p>hints.ai_family = AF_INET；</p>
<p>/* IPV4 only */</p>
<p>hints.ai_socktype = SOCK_STREAM;/* Connections only */ if （（rc = getaddrinfo（argv ［1］，NULL， &amp;hints， &amp;listp））！= 0）｛ fprintf（stderr，&quot;getaddrinfo error： %sln&quot;， gai_strerror（rC））；</p>
<p>exit（1）；</p>
<p>｝</p>
<p>/* Walk the 1ist and display each IP address */ flags = NI_NUMERICHOST；/* Display address string instead of domain name */ for （p = listp;p; p = p-&gt;ai_next）｛ Getnameinfo（p-&gt;ai_addr,p-&gt;ai_addrlen, buf,MAXLINE, NULL,0, flags）；</p>
<p>printf（&quot;%s\n&quot;，but）；</p>
<p>｝</p>
<p>/* Clean up */</p>
<p>Freeaddrinfo（1istp）；</p>
<p>exit（O）；</p>
<p>code/netp/hostinfo.c 图11-17</p>
<p>HOSTINFO 展示出域名到和它相关联的IP地址之间的映射</p>
<h2>第 695 页</h2>
<p>660</p>
<p>第三部分 程序间的交互和通信</p>
<p>首先，初始化 hints结构，使 getaddrinfo返回我们想要的地址。在这里，我们想 查找32位的IP地址（第16行），用作连接的端点（第17行）。因为只想getaddrinfo转换 域名，所以用 service 参数为 NULL 来调用它。</p>
<p>调用 getaddrinfo之后，会遍历 addrinfo结构，用 getnameinfo 将每个套接字地 址转换成点分十进制地址字符串。遍历完列表之后，我们调用 Ereeaddrinfo 小心地释放 这个列表（虽然对于这个简单的程序来说，并不是严格需要这样做的）。</p>
<p>运行 HOSTINFO 时，我们看到twitter.com 映射到了四个 IP 地址，和11.3.2节用 NSLOOKUP 的结果一样。</p>
<p>1inux&gt;./hostinfo twitter.com 199.16.156.102</p>
<p>199.16.156.230</p>
<p>199.16.156.6</p>
<p>199.16.156.70</p>
<p>练习题 11.4</p>
<p>函数 getaddrinfo和 getnameinfo分别包含了 inet pton 和 inet_ntop 的功能，提供了更高级别的、独立于任何特地址格式的抽象。想看看这到底有多方 便，编写 HOSTINFO（图 11-17）的一个版本，用 inet_pton 而不是 getnameinfo 将每个 套接字地址转换成点分十进制地址字符串。</p>
<h3>11.4.8 套接字接口的辅助函数</h3>
<p>初学时，getnameinfo函数和套接字接口看上去有些可怕。用高级的辅助函数包装 一下会方便很多，称为 open_clientfd 和 open_listenfd，客户端和服务器互相通信时 可以使用这些函数。</p>
<p>1.open_clientfd 函数 客户端调用 open.</p>
<p>_clientfd建立与服务器的连接。</p>
<p>#include &quot;csapp.h&quot; int open_clientfd（char *hostname,char *port）；</p>
<p>返回：若成功则为描述符，若出错则为一1。</p>
<p>_clientfd 函数建立与服务器的连接，该服务器运行在主机 hostname 上，并在 端口号 port 上监听连接请求。它返回一个打开的套接字描述符，该描述符准备好了，可 以用 Unix 1/O 函数做输人和输出。图11-18给出了 open_clientfd的代码。</p>
<p>我们调用 getaddrinfo，它返回 addrinfo结构的列表，每个结构指向一个套接字地 址结构，可用于建立与服务器的连接，该服务器运行在 hostname 上并监听 port端口。</p>
<p>然后遍历该列表，依次尝试列表中的每个条目，直到调用 socket 和 connect 成功。如果 connect 失败，在尝试下一个条目之前，要小心地关闭套接字描述符。如果 connect成 功，我们会释放列表内存，并把套接字描述符返回给客户端，客户端可以立即开始用 Unix 1/0 与服务器通信了。</p>
<p>注意，所有的代码都与任何版本的IP 无关。socket 和 connect 的参数都是用 getaddrinfo 自动产生的，这使得我们的代码干净可移植。</p>
<p>2.open_listenfd 函数 调用 open_1istenfd 函数，服务器创建一个监听描述符，准备好接收连接请求。</p>
<h2>第 696 页</h2>
<h3>第11章网络编程</h3>
<p>661</p>
<p>#include &quot;csapp.h&quot; int open_1istenfd（char *port）；</p>
<p>返回：若成功则为描述符，若出错则为一1。</p>
<p>- code/src/csapp.c 2</p>
<p>5</p>
<p>9</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>15</p>
<p>16</p>
<p>17</p>
<p>18</p>
<p>19</p>
<p>20</p>
<p>21</p>
<p>22</p>
<p>23</p>
<p>24</p>
<p>25</p>
<p>26</p>
<p>27</p>
<p>28</p>
<p>29</p>
<p>30</p>
<p>int open_clientfd（char *hostname,char *port）｛ int clientfd；</p>
<p>struct addrinfo hints，*listp，*p；</p>
<p>/* Get a list of potential server addresses */ memset （&amp;hints, 0, sizeof （struct addrinfo））；</p>
<p>hints.ai_socktype = SOCK_STREAM; /* Open a connection */ hints.ai_flags = AI_NUMERICSERV; /* •. using a numeric port arg. */ hints.ai_flags |= AI_ADDRCONFIG; /* Recommended for connections */ Getaddrinfo（hostname,Port，&amp;hints， &amp;1istp）；</p>
<p>/* Walk the list for one that we can successfully connect to */ for （p = 1istp;p; p = p-&gt;ai_next）｛ /* Create a socket descriptor */ if （（clientfd = socket（p-&gt;ai_family,p-&gt;ai_socktype,p-&gt;ai-protocol）） &lt; O） continue; /* Socket failed, try the next */ /* Connect to the server */ if （connect （clientfd, P-&gt;ai_addr,P-&gt;ai_addrlen）！= -1） break;/* Success */ Close（clientfd）；/* Connect failed, try another */ ｝</p>
<p>/* Clean up */</p>
<p>Freeaddrinfo（1istp）；</p>
<p>if （！p）/* A11 connects failed */ return -1；</p>
<p>else|</p>
<p>/* The last connect succeeded */ return clientfd；</p>
<p>｝</p>
<p>code/src/csapp.c</p>
<p>图 11-18</p>
<p>open_clientfd：和服务器建立连接的辅助函数。它是可重人和与协议无关的 open_1istenfd函数打开和返回一个监听描述符，这个描述符准备好在端口 port 上 接收连接请求。图11-19展示了 open_listenfd的代码。</p>
<p>open listenfd 的风格类似于 open clientfd。调用 getaddrinfo，然后遍历结果列 表，直到调用 socket 和 bind成功。注意，在第20行，我们使用 setsockopt 函数（本书中 没有讲述）来配置服务器，使得服务器能够被终止、重启和立即开始接收连接请求。一个重 启的服务器默认将在大约30秒内拒绝客户端的连接请求，这严重地阻碍了调试。</p>
<p>因为我们调用 getaddrinfo时，使用了 AI_PASSIVE 标志并将 host 参数设置力 NULL，每个套接字地址结构中的地址字段会被设置为通配符地址，这告诉内核这个服务 器会接收发送到本主机所有IP 地址的请求。</p>
<h2>第 697 页</h2>
<p>662</p>
<p>第三部分 程序间的交互和通信</p>
<p>•code/src/csapp.c</p>
<p>4</p>
<p>6</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>15</p>
<p>16</p>
<p>17</p>
<p>18</p>
<p>19</p>
<p>20</p>
<p>21</p>
<p>22</p>
<p>23</p>
<p>24</p>
<p>25</p>
<p>26</p>
<p>27</p>
<p>28</p>
<p>29</p>
<p>30</p>
<p>31</p>
<p>32</p>
<p>33</p>
<p>34</p>
<p>35</p>
<p>36</p>
<p>37</p>
<p>38</p>
<p>39</p>
<p>40</p>
<p>int open_listenfd（char *port） ｛</p>
<p>struct addrinfo hints，*listp， *p；</p>
<p>int 1istenfd,optval=1；</p>
<p>/* Get a list of potential server addresses */ memset （&amp;hints, 0, sizeof （struct addrinfo））；</p>
<p>hints.ai_socktype = SOCK_STREAM；</p>
<p>/* Accept connections */ hints.ai_flags = AI_PASSIVE | AI_ADDRCONFIG; /* ••on any IP address */ hints.ai_flags |= AI_NUMERICSERV；</p>
<p>/*•..using port number */ Getaddrinfo（NULL,port，&amp;hints， &amp;1istp）；</p>
<p>/* Walk the list for one that we can bind to */ for （p = 1istp; P; p =p-&gt;ai_next）｛ /* Create a socket descriptor */ if （（listenfd = socket （p-&gt;ai_family,p-&gt;ai_socktype,p-&gt;ai_protocol）） &lt; O） continue; /* Socket failed, try the next */ /* Eliminates &quot;Address already in use&quot; error from bind */ Setsockopt （Iistenfd,SOL_SOCKET, SO_REUSEADDR， （const void *）&amp;optval,sizeof （int））；</p>
<p>/* Bind the descriptor to the address */ if （bind（listenfd,P-&gt;ai_addr,P-&gt;ai_addrlen） == 0） break;/* Success */ Close （1istenfd）；/* Bind failed, try the next */ ｝</p>
<p>/* Clean up */</p>
<p>Freeaddrinfo（listp）；</p>
<p>if （！p） /* No address worked */ return -1；</p>
<p>/* Make it a listening socket ready to accept connection requests */ if （listen（1istenfd, LISTENQ）&lt;0）｛ Close （1istenfd）；</p>
<p>return -1；</p>
<p>｝</p>
<p>return listenfd；</p>
<p>｝</p>
<p>- code/src/csapp.c 图11-19</p>
<p>open_1istenfd：打开并返回监听描述符的辅助函数。它是可重入和与协议无关的 最后，我们调用1isten 函数，将1istenfd 转换为一个监听描述符，并返回给调用 者。如果 1isten 失败，我们要小心地避免内存泄漏，在返回前关闭描述符。</p>
<p>11.4.9</p>
<p>echo 客户端和服务器的示例</p>
<p>学习套接字接口的最好方法是研究示例代码。图 11-20展示了一个 echo 客户端的代</p>
<h2>第 698 页</h2>
<h3>第11章网络编程</h3>
<p>663</p>
<p>码。在和服务器建立连接之后，客户端进人一个循环，反复从标准输人读取文本行，发送 文本行给服务器，从服务器读取回送的行，并输出结果到标准输出。当 Egets 在标准输人 上遇到EOF 时，或者因为用户在键盘上键人Ctrl+D，或者因为在一个重定向的输人文件 中用尽了所有的文本行时，循环就终止。</p>
<p>• code/netp/echoclient.c #include &quot;csapp.h&quot; 2</p>
<p>3</p>
<p>int main（int argc, char **argv） ｛</p>
<p>5</p>
<p>6</p>
<p>int clientfd；</p>
<p>char *host，*port,buf ［MAXLINE］；</p>
<p>rio_t rio；</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>15</p>
<p>16</p>
<p>17</p>
<p>18</p>
<p>19</p>
<p>20</p>
<p>21</p>
<p>22</p>
<p>23</p>
<p>24</p>
<p>25</p>
<p>26</p>
<p>if （argc ！= 3）｛</p>
<p>exit（O）；</p>
<p>fprintf（stderr，&quot;usage： %s &lt;host&gt; &lt;port&gt;\n&quot;，argv ［0］）；</p>
<p>｝</p>
<p>host = argv［1］；</p>
<p>port = argv ［2］；</p>
<p>clientfd = Open_clientfd（host, port）；</p>
<p>Rio_readinitb（&amp;rio, clientfd）；</p>
<p>while （Fgets（buf,MAXLINE, stdin）！= NULL）｛ Rio_writen（clientfd, buf, strlen（buf））；</p>
<p>Rio_readlineb（&amp;rio, buf,MAXLINE）；</p>
<p>Fputs（buf,stdout）；</p>
<p>｝</p>
<p>Close （clientfd）；</p>
<p>exit（O）；</p>
<p>｝</p>
<p>code/netp/echoclient.c 图11-20</p>
<p>echo 客户端的主程序</p>
<p>循环终止之后，客户端关闭描述符。这会导致发送一个 EOF 通知到服务器，当服务 器从它的 reo_readlineb 函数收到一个为零的返回码时，就会检测到这个结果。在关闭 它的描述符后，客户端就终止了。既然客户端内核在一个进程终止时会自动关闭所有打开 的描述符，第24行的close就没有必要了。不过，显式地关闭已经打开的任何描述符是 一个良好的编程习惯。</p>
<p>图11-21展示了 echo 服务器的主程序。在打开监听描述符后，它进入一个无限循环。</p>
<p>每次循环都等待一个来自客户端的连接请求，输出已连接客户端的域名和 IP 地址，并调 用echo函数为这些客户端服务。在 echo 程序返回后，主程序关闭已连接描述符。一旦客 户端和服务器关闭了它们各自的描述符，连接也就终止了。</p>
<p>第9行的 clientaddr变量是一个套接字地址结构，被传递给 accept。在 accept 返 回之前，会在 clientaddr 中填上连接另一端客户端的套接字地址。注意，我们将c1i- entaddr 声明为 struct sockaddr storage 类型，而不是 struct sockaddr_in 类型。</p>
<p>根据定义，sockaddr</p>
<p>_storage 结构足够大能够装下任何类型的套接字地址，以保持代码 的协议无关性。</p>
<h2>第 699 页</h2>
<p>664</p>
<p>第三部分 程序间的交互和通信</p>
<p>code/netp/echoserveri.c 6</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>15</p>
<p>17</p>
<p>18</p>
<p>19</p>
<p>20</p>
<p>21</p>
<p>22</p>
<p>23</p>
<p>24</p>
<p>25</p>
<p>26</p>
<p>27</p>
<p>28</p>
<p>#include &quot;csapp.h&quot; void echo（int connfd）；</p>
<p>int main（int argc, char **argv） ｛</p>
<p>int listenfd, connfd；</p>
<p>socklen_t clientlen；</p>
<p>struct sockaddr_storage clientaddr; /* Enough space for any address */ char client_hostname ［MAXLINE］， Client_port ［MAXLINE］；</p>
<p>if （argc ！= 2）｛</p>
<p>exit （O）；</p>
<p>fprintf（stderr，&quot;usage： %s &lt;port&gt;\n&quot;，argv ［O］）；</p>
<p>｝</p>
<p>listenfd = Open_1istenfd（argv ［1］）；</p>
<p>while （1）｛</p>
<p>clientlen = sizeof（struct sockaddr_storage）；</p>
<p>connfd = Accept （listenfd， （SA *）&amp;clientaddr， &amp;clientlen）；</p>
<p>Getnameinfo（（SA *）&amp;clientaddr,clientlen, client_hostname,MAXLINE， client_port,MAXLINE, O）；</p>
<p>printf（&quot;Connected to （%s，%s）\n&quot;， client_hostname, client_port）；</p>
<p>echo （connfd）；</p>
<p>Close （connfd）；</p>
<p>｝</p>
<p>exit（O）；</p>
<p>｝</p>
<p>code/netp/echoserveri.c 图 11-21</p>
<p>迭代 echo 服务器的主程序</p>
<p>注意，简单的echo 服务器一次只能处理一个客户端。这种类型的服务器一次一个地 在客户端间迭代，称为选代服务器（iterative server）。在第12章中，我们将学习如何建立 更加复杂的并发服务器（concurrent server），它能够同时处理多个客户端。</p>
<p>最后，图11-22展示了 echo 程序的代码，该程序反复读写文本行，直到 rio_readlineb 函数在第10行遇到 EOF。</p>
<p>code/netp/echo.c</p>
<p>3</p>
<p>4</p>
<p>6</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>#include &quot;csapp.h&quot; void</p>
<p>echo（int connfd）</p>
<p>｛</p>
<p>size_t n；</p>
<p>char buf IMAXLINEJ；</p>
<p>rio_t rio；</p>
<p>Rio_readinitb（&amp;rio, connfd）；</p>
<p>while（（n = Rio_readlineb（&amp;rio, buf, MAXLINE））！= 0）｛ printf（&quot;&#x27;server received %a bytesln&quot;， （int）n）；</p>
<p>Rio_writen（connfd, buf, n）；</p>
<p>｝</p>
<p>code/netp/echo.c</p>
<p>图11-22</p>
<p>读和回送文本行的 echo 函数</p>
<h2>第 700 页</h2>
<h3>第11章 网络编程</h3>
<p>665</p>
<p>旁注 在连接中 EOF 意味什么？</p>
<p>EOF 的概念常常使人们感到迷惑，尤其是在因特网连接的上下文中。首先，我们 需要理解其实并没有像 EOF 字符这样的一个东西。进一步来说，EOF 是由内核检测到 的一种条件。应用程序在它接收到一个由read函数返回的零返回码时，它就会发现出 EOF 条件。对于磁盘文件，当前文件位置超出文件长度时，会发生EOF。对于因特网 连接，当一个进程关闭连接它的那一端时，会发生EOF。连接另一端的进程在试图读取 流中最后一个字节之后的字节时，会检测到 EOF。</p>
<h3>11.5 Web 服务器</h3>
<p>迄今为止，我们已经在一个简单的echo服务器的上下文中讨论了网络编程。在这一 节里，我们将向你展示如何利用网络编程的基本概念，来创建你自己的虽小但功能齐全的 Web 服务器。</p>
<h3>11.5.1 Web 基础</h3>
<p>Web 客户端和服务器之间的交互用的是一个基于文本的应用级协议，叫做HTTP （Hypertext Transfer Protocol，超文本传输协议）。HTTP 是一个简单的协议。一个 Web 客户端（即浏览器）打开一个到服务器的因特网连接，并且请求某些内容。服务器响应所请 求的内容，然后关闭连接。浏览器读取这些内容，并把它显示在屏幕上。</p>
<p>Web 服务和常规的文件检索服务（例如 FTP）有什么区别呢？主要的区别是 Web 内容 可以用一种叫做 HTML（Hypertext Markup Language，超文本标记语言）的语言来编写。</p>
<p>一个 HTML 程序（页）包含指令（标记），它们告诉浏览器如何显示这页中的各种文本和图 形对象。例如，代码</p>
<p>&lt;b&gt; Make me bold！ &lt;/b&gt; 告诉浏览器用粗体字类型输出&lt;b&gt;和&lt;/b&gt;标记之间的文本。然而，HTML 真正的强大 之处在于一个页面可以包含指针（超链接），这些指针可以指向存放在任何因特网主机上的 内容。例如，一个格式如下的 HTML行 &lt;a href=&quot;http://www.cmu.edu/index.htm1&quot;&gt;Carnegie Mellon&lt;/a&gt; 告诉浏览器高亮显示文本对象“Carnegie Mellon”，并且创建一个超链接，它指向存放 在 CMU Web 服务器上叫做index.htm1 的 HTML文件。如果用户单击了这个高亮文本 对象，浏览器就会从CMU 服务器中请求相应的HTML. 文件并显示它。</p>
<p>旁注</p>
<p>万维网的起源</p>
<p>万维网是 Tim Berners Lee 发明的，他是一位在瑞典物理实验室 CERN（欧洲粒子物理研 究所）工作的软件工程师。1989年，Berners- Lee 写了一个内部备忘录，提出了一个分布式超文 本系统，它能连接“用链接组成的笔记的网（web of notes with links）”。提出这个系统的目的是 帮助CERN的科学家共享和管理信息。在接下来的两年多里，Berners-Lee 实现了第一个 Web服 务器和 Web 浏览器之后，在CERN 内部以及其他一些网站中，Web 发展出了小规模的拥护者。</p>
<p>1993年一个关键事件发生了，Marc Andreesen（他后来创建了 Netscape）和他在 NCSA 的同事发布 了一种图形化的浏览器，叫做 MOSAIC，可以在三种主要的平台上所使用：Unix、Windows 和 Macintosh。在 MOSAIC 发布后，对 Web 的兴趣爆发了，Web 网站以每年10倍或更高的数量增 长。到2015年，世界上已经有超过 975 000 000个 Web 网站了（源自 Netcraft Web Survey）。</p>
<h2>第 701 页</h2>
<p>666</p>
<p>第三部分 程序间的交互和通信</p>
<p>11.5.2|</p>
<p>Web 内容</p>
<p>对于 Web 客户端和服务器而言，内容是与一个 MIME（Multipurpose Internet Mail Extensions，多用途的网际邮件扩充协议）类型相关的字节序列。图11-23展示了一些常用 的 MIME类型。</p>
<p>MIME 类型</p>
<p>描述</p>
<p>text/html</p>
<p>text/plain</p>
<p>application/postscript image/gif</p>
<p>image/png</p>
<p>image/jpeg</p>
<p>HTML 页面</p>
<p>无格式文本</p>
<p>Postscript 文档</p>
<p>GIF 格式编码的二进制图像</p>
<p>PNG 格式编码的二进制图像</p>
<p>JPEG 格式编码的二进制图像</p>
<p>图 11-23 MIME 类型示例</p>
<p>Web 服务器以两种不同的方式向客户端提供内容：</p>
<p>• 取一个磁盘文件，并将它的内容返回给客户端。磁盘文件称为静态内容（static con- tent），而返回文件给客户端的过程称为服务静态内容（serving static content）。.</p>
<p>• 运行一个可执行文件，并将它的输出返回给客户端。运行时可执行文件产生的输出 称动态内容（dynamic content），而运行程序并返回它的输出到客户端的过程称为 服务动态内容（serving dynamic content）。</p>
<p>每条由 Web 服务器返回的内容都是和它管理的某个文件相关联的。这些文件中的每一个都 有一个唯一的名字，叫做 URL（Universal Resource Locator，通用资源定位符）。例如，URL http://www.google.com:80/index.html 表示因特网主机 www.google.com 上一个称为/index.html 的HTML 文件，它是由一个 监听端口80的Web 服务器管理的。端口号是可选的，默认为知名的HTTP 端口80。可 执行文件的URL 可以在文件名后包括程序参数。“？”字符分隔文件名和参数，而且每个 参数都用“&amp;”字符分隔开。例如，URL http://bluefish.ics.cs.cmu.edu: 8000/cgi-bin/adder?15000&amp;213 标识了一个叫做/cgi- bin/adder 的可执行文件，会带两个参数字符串15000和 213来调用 它。在事务过程中，客户端和服务器使用的是URL 的不同部分。例如，客户端使用前缀 http://www.google.com:80 来决定与哪类服务器联系，服务器在哪里，以及它监听的端口号是多少。服务器使用后缀 /index.html</p>
<p>来发现在它文件系统中的文件，并确定请求的是静态内容还是动态内容。</p>
<p>关于服务器如何解释一个 URL 的后缀，有几点需要理解：</p>
<p>• 确定一个 URL 指向的是静态内容还是动态内容没有标准的规则。每个服务器对它 所管理的文件都有自己的规则。一种经典的（老式的）方法是，确定一组目录，例如 cgi-bin，所有的可执行性文件都必须存放这些目录中。</p>
<p>• 后缀中的最开始的那个“/”不表示 Linux 的根目录。相反，它表示的是被请求内容 类型的主目录。例如，可以将一个服务器配置成这样：所有的静态内容存放在目录/ usr/httpa/html 下，而所有的动态内容都存放在目录/usr/httpd/cgi-bin 下。</p>
<h2>第 702 页</h2>
<h3>第11章网络编程</h3>
<p>667</p>
<p>• 最小的URL. 后缀是“/”字符，所有服务器将其扩展为某个默认的主页，例如/index.</p>
<p>html。这解释了为什么简单地在浏览器中键入一个域名就可以取出一个网站的主 页。浏览器在 URL 后添加缺失的“/”，并将之传递给服务器，服务器又把“/”扩 展到某个默认的文件名。</p>
<h3>11.5.3 HTTP 事务</h3>
<p>因为 HTTP是基于在因特网连接上传送的文本行的，我们可以使用 Linux 的 TEL- NET 程序来和因特网上的任何Web 服务器执行事务。对于调试在连接上通过文本行来与 客户端对话的服务器来说，TELNET 程序是非常便利的。例如，图11-24 使用 TELNET 向 AOL Web 服务器请求主页。</p>
<p>2</p>
<p>3</p>
<p>linux&gt; telnet www.aol.com 80 Trying 205.188.146.23.• Connected to aol.com.</p>
<p>Escape character is &#x27;^］&#x27;.</p>
<p>GET / HTTP/1.1</p>
<p>Host: www.aol.com</p>
<p>Client：</p>
<p>open</p>
<p>connection</p>
<p>to</p>
<p>server</p>
<p>Telnet prints 3 lines to the terminal Client: request line Client: required HTTP/1.1 header Client: empty line terminates headers Server: response 1ine Server: followed by five response headers 10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>15</p>
<p>16</p>
<p>17</p>
<p>18•</p>
<p>19</p>
<p>HTTP/1.0 200 OK</p>
<p>MIME-Version: 1.0</p>
<p>Date: Mon, 8 Jan 2010 4:59:42 GMT Server: Apache-Coyote/1.1 Content-Type: text/html Content-Length: 42092 Server: expect HTML in the response body Server:expect 42,092 bytes in the response body Server: empty line terminates response headers &lt;html&gt;</p>
<p>Server: first HTML line in response body Server: 766 lines of HTML not shown &lt;/html&gt;</p>
<p>1inux&gt;</p>
<p>Server: last HTML line in response body Connection closed by foreign host. Server: closes connection Client: closes connection and terminates 图 11-24 一个服务静态内容的HTTP事务 在第1行，我们从 Linux shell 运行 TELNET，要求它打开一个到 AOL Web 服务器的连 接。TELNET 向终端打印三行输出，打开连接，然后等待我们输人文本（第5行）。每次输入 一个文本行，并键入回车键，TELNET 会读取该行，在后面加上回车和换行符号（在C的表 示中 “\r\n”），并且将这一行发送到服务器。这是和 HTTP 标准相符的，HTTP 标准要 求每个文本行都由一对回车和换行符来结束。为了发起事务，我们输人一个 HTTP 请求（第 5~7行）。服务器返回 HTTP响应（第8～17行），然后关闭连接（第18行）。</p>
<p>1. HTTP 请求</p>
<p>一个 HTTP 请求的组成是这样的：一个请求行（request line）（第5行），后面跟随零 个或更多个请求报头（request header）（第6行），再跟随一个空的文本行来终止报头列表 （第7行）。一个请求行的形式是</p>
<p>method URI version HTTP 支持许多不同的方法，包括 GET、POST、OPTIONS、HEAD、PUT、DELETE 和 TRACE。我们将只讨论广为应用的GET 方法，大多数HTTP 请求都是这种类型的。</p>
<h2>第 703 页</h2>
<p>668</p>
<p>第三部分 程序间的交互和通信</p>
<p>GET 方法指导服务器生成和返回 URI（Uniform Resource Identifier，统一资源标识符）标 识的内容。URI 是相应的URL 的后缀，包括文件名和可选的参数。日 请求行中的 version 字段表明了该请求遵循的 HTTP 版本。最新的 HTTP 版本是 HTTP/1.1［37］。HTTP/1.0是从 1996年沿用至今的老版本［6］。HTTP/1.1定义了一 些附加的报头，为诸如缓冲和安全等高级特性提供支持，它还支持一种机制，允许客户端 和服务器在同一条持久连接（persistent connection）上执行多个事务。在实际中，两个版本 是互相兼容的，因为HTTP/1.0的客户端和服务器会简单地忽略 HTTP/1.1 的报头。</p>
<p>总的来说，第5行的请求行要求服务器取出并返回HTML文件/index.html。它也 告知服务器请求剩下的部分是 HTTP/1.1格式的。</p>
<p>请求报头为服务器提供了额外的信息，例如浏览器的商标名，或者浏览器理解的 MIME 类型。请求报头的格式为</p>
<p>header-name: header-data 针对我们的目的，唯一需要关注的报头是 Host 报头（第6行），这个报头在 HTTP/1.1请 求中是需要的，而在 HTTP/1.0请求中是不需要的。代理缓存（proxy cache）会使用 Host 报头，这个代理缓存有时作为浏览器和管理被请求文件的原始服务器（origin server）的中 介。客户端和原始服务器之间，可以有多个代理，即所谓的代理链（proxy chain）。Host 报头中的数据指示了原始服务器的域名，使得代理链中的代理能够判断它是否可以在本地 缓存中拥有一个被请求内容的副本。</p>
<p>继续图 11-24中的示例，第7行的空文本行（通过在键盘上键入回车键生成的）终止了 报头，并指示服务器发送被请求的 HTML 文件。</p>
<p>2. HTTP 响应</p>
<p>HTTP 响应和 HTTP 请求是相似的。一个 HTTP 响应的组成是这样的：一个响应行 （response line）（第8行），后面跟随着零个或更多的响应报头（response header）（第9～13 行），再跟随一个终止报头的空行（第14行），再跟随一个响应主体（response body）（第15~17 行）。一个响应行的格式是</p>
<p>version status-code status-message version 字段描述的是响应所遵循的 HTTP 版本。状态码（status-code）是一个3位的正整数， 指明对请求的处理。状态消息（status message）给出与错误代码等价的英文描述。图11-25列 出了一些常见的状态码，以及它们相应的消息。</p>
<p>状态代码</p>
<p>200</p>
<p>301</p>
<p>400</p>
<p>403</p>
<p>404</p>
<p>501</p>
<p>505</p>
<p>状态消息</p>
<p>描述</p>
<p>成功</p>
<p>永久移动</p>
<p>错误请求</p>
<p>禁止</p>
<p>未发现</p>
<p>未实现</p>
<p>HTTP版本不支持</p>
<p>处理请求无误</p>
<p>内容已移动到location头中指明的主机上 服务器不能理解请求</p>
<p>服务器无权访问所请求的文件</p>
<p>服务器不能找到所请求的文件</p>
<p>服务器不支持请求的方法</p>
<p>服务器不支持请求的版本</p>
<p>图11-25</p>
<p>一些 HTTP 状态码</p>
<p>①</p>
<p>实际上，只有当浏览器请求内容时，这才是真的。如果代理服务器请求内容，那么这个 URI必须是完整的 URL。</p>
<h2>第 704 页</h2>
<h3>第11章 网络编程</h3>
<p>669</p>
<p>第9～13行的响应报头提供了关于响应的附加信息。针对我们的目的，两个最重要的 报头是 Content-Type（第12行），它告诉客户端响应主体中内容的MIME 类型；以及 Content-Length（第13行），用来指示响应主体的字节大小。</p>
<p>第14行的终止响应报头的空文本行，其后跟随着响应主体，响应主体中包含着被请 求的内容。</p>
<h3>11.5.4 服务动态内容</h3>
<p>如果我们停下来考虑一下，一个服务器是如何向客户端提供动态内容的，就会发现一 些问题。例如，客户端如何将程序参数传递给服务器？服务器如何将这些参数传递给它所 创建的子进程？服务器如何将子进程生成内容所需要的其他信息传递给子进程？子进程将 它的输出发送到哪里？一个称为 CGI（Common Gateway Interface，通用网关接口）的实际 标准的出现解决了这些问题。</p>
<p>1. 客户端如何将程序参数传递给服务器 GET 请求的参数在 URI 中传递。正如我们看到的，一个“？”字符分隔了文件名和参 数，而每个参数都用一个“&amp;”字符分隔开。参数中不允许有空格，而必须用字符串“820” 来表示。对其他特殊字符，也存在着相似的编码。</p>
<p>旁注</p>
<p>在HTTP POST 请求中传递参数 HTTP POST 请求的参数是在请求主体中而不是 URI 中传递的。</p>
<p>2. 服务器如何将参数传递给子进程</p>
<p>在服务器接收一个如下的请求后</p>
<p>GET /cgi-bin/adder?15000&amp;213 HTTP/1.1 它调用 fork来创建一个子进程，并调用 execve 在子进程的上下文中执行/cgi-bin/ad- der 程序。像 adder这样的程序，常常被称为CGI程序，因为它们遵守CGI标准的规则。</p>
<p>而且，因许多CGI程序是用 Perl脚本编写的，所以CGI 程序也常被称为CGI脚本。在 调用 execve 之前，子进程将 CGI 环境变量 QUERY_STRING设置为 “15000&amp;213”，ad- der 程序在运行时可以用 Linux getenv 函数来引用它。</p>
<p>3. 服务器如何将其他信息传递给子进程 CGI定义了大量的其他环境变量，一个 CGI程序在它运行时可以设置这些环境变量。</p>
<p>图 11-26给出了其中的一部分。</p>
<p>环境变量</p>
<p>描述</p>
<p>QUERY_STRING</p>
<p>SERVER_PORT</p>
<p>REOUEST METHOD</p>
<p>REMOTE_HOST</p>
<p>REMOTE_ADDR</p>
<p>CONTENT_TYPE</p>
<p>CONTENT_LENGTH</p>
<p>程序参数</p>
<p>父进程侦听的端口</p>
<p>GET 或 POST</p>
<p>客户端的域名</p>
<p>客户端的点分十进制IP地址</p>
<p>只对 POST 而言：请求体的 MIME 类型 只对 POST 而言：请求体的字节大小 CGI环境变量示例</p>
<p>图 11-26</p>
<p>4. 子进程将它的输出发送到哪里</p>
<p>一个 CGI 程序将它的动态内容发送到标准输出。在子进程加载并运行CGI 程序之前，</p>
<h2>第 705 页</h2>
<p>670</p>
<p>第三部分 程序间的交互和通信</p>
<p>它使用 Linux dup2函数将标准输出重定向到和客户端相关联的已连接描述符。因此，任 何 CGI 程序写到标准输出的东西都会直接到达客户端。</p>
<p>注意，因为父进程不知道子进程生成的内容的类型或大小，所以子进程就要负责生成 Content-type 和 Content-length响应报头，以及终止报头的空行。</p>
<p>图11-27展示了一个简单的CGI 程序，它对两个参数求和，并返回带结果的 HTML 文件给客户端。图11-28展示了一个 HTTP事务，它根据 adder 程序提供动态内容。</p>
<p>- code/netp/tiny/cgi-bin/adder.c 3</p>
<p>4</p>
<p>5</p>
<p>6</p>
<p>7</p>
<p>8</p>
<p>9</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>15</p>
<p>16</p>
<p>17</p>
<p>18</p>
<p>19</p>
<p>20</p>
<p>21</p>
<p>22</p>
<p>23</p>
<p>24</p>
<p>25</p>
<p>26</p>
<p>27</p>
<p>28</p>
<p>29</p>
<p>30</p>
<p>31</p>
<p>32</p>
<p>33</p>
<p>34</p>
<p>#include &quot;csapp.h&quot; int main（void）｛</p>
<p>char *buf，*p；</p>
<p>char arg1 ［MAXLINE］，arg2 LMAXLINE］，content ［MAXLINEJ；</p>
<p>int n1=0,n2=0；</p>
<p>/* Extract the two arguments */ if （（buf = getenv （&quot;QUERY_STRING&quot;））！= NULL）｛ p = strchr（buf，&#x27;&amp;&#x27;）；</p>
<p>*p =1\0&#x27;；</p>
<p>strcpy （argl, buf）；</p>
<p>strcpy （arg2, p+1）；</p>
<p>n1 = atoi （arg1）；</p>
<p>n2 = atoi（arg2）；</p>
<p>｝</p>
<p>/* Make the response body */ sprintf（content，&quot;QUERY_STRING=%s&quot;，buf）；</p>
<p>sprintf（content，&quot;Welcome to add.com： &quot;）；</p>
<p>sprintf（content，&quot;%sTHE Internet addition portal. \rlnsp&gt;&quot;， content）；</p>
<p>sprintf （content，&quot;%sThe answer is： %d + %d = %dlzln&lt;p&gt;&quot;， content,n1,n2,n1 + n2）；</p>
<p>sprintf（content，&quot;%sThanks for visiting！\r\n&quot;， content）；</p>
<p>/* Generate the HTTP response */ printf（&quot;Connection: closelr\n&quot;）；</p>
<p>printf（&quot;Content-length： %a\r\n&quot;， （int）strlen（content））；</p>
<p>printf（&quot;Content-type: text/htm1\z\nlr\n&quot;）；</p>
<p>printf（&quot;%s&quot;， content）；</p>
<p>fflush（stdout）；</p>
<p>exit （O）；</p>
<p>code/netp/tiny/cgi-bin/adder.c 图11-27 对两个整数求和的CGI 程序</p>
<h2>第 706 页</h2>
<p>第11草 网络编程</p>
<p>671</p>
<p>1inux&gt; telnet kittyhawk.cmcl.cs.cmu.edu 8000 Client: open connection Trying 128.2.194.242.• Connected to kittyhawk.cmcl.cs.cmu.edu.</p>
<p>Escape character is &#x27;^］&#x27;.</p>
<p>GET /cgi-bin/adder?15000&amp;213 HTTP/1.0 6</p>
<p>9</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>15</p>
<p>16</p>
<p>Client: request 1ine Client: empty line terminates headers HTTP/1.0 200 OK</p>
<p>Server: Tiny Web Server Content-length: 115 Content-type: text/html Server: response 1ine| Server: identiiy server Adder: expect 115 bytes in response body Adder: expect HTML in response body Adder: empty line terminates headers Welcome to add.com: THE Internet addition portal. Adder: first HTML 1ine &lt;p&gt;The answer is: 15000 + 213 = 15213 Adder: second HTML line in response body &lt;P&gt;Thanks for visiting！</p>
<p>Adder: third HTML line in response body Connection closed by foreign host.</p>
<p>Server: closes connection linux&gt;</p>
<p>Client: closes</p>
<p>connection</p>
<p>and terminates</p>
<p>图 11-28 一个提供动态 HTML 内容的 HTTP事务 旁注</p>
<p>将HTTP POST 请求中的参数传递给 CGI程序 对于POST 请求，子进程也需要重定向标准输入到已连接描述符。然后，CGI程序 会从标准输入中读取请求主体中的参数。</p>
<p>练习题 11.5</p>
<p>在10.11节中，我们警告过你关于在网络应用中使用C标准1/0函数的 危险。然而，图11-27中的CGI程序却能没有任何问题地使用标准1/0。为什么呢？</p>
<p>11.6</p>
<p>综合：TINY Web 服务器</p>
<p>我们通过开发一个虽小但功能齐全的称为 TINY的 Web 服务器来结束对网络编程的 讨论。TINY是一个有趣的程序。在短短250行代码中，它结合了许多我们已经学习到的 思想，例如进程控制、Unix I/O、套接字接口和HTTP。虽然它缺乏一个实际服务器所具 备的功能性、健壮性和安全性，但是它足够用来为实际的Web 浏览器提供静态和动态的 内容。我们鼓励你研究它，并且自己实现它。将一个实际的浏览器指向你自己的服务器， 看着它显示一个复杂的带有文本和图片的Web 页面，真是非常令人兴奋（甚至对我们这些 作者来说，也是如此！）。</p>
<p>1. TINY 的 main 程序</p>
<p>图11-29展示了 TINY的主程序。TINY 是一个迭代服务器，监听在命令行中传递来 的端口上的连接请求。在通过调用 open_1istenfd 函数打开一个监听套接字以后，TINY 执行典型的无限服务器循环，不断地接受连接请求（第32行），执行事务（第36行），并关 闭连接的它那一端（第37行）。</p>
<p>2. doit 函数</p>
<p>图11-30中的doit 函数处理一个 HTTP事务。首先，我们读和解析请求行（第11～ 14行）。注意，我们使用图11-8中的rio_readlineb 函数读取请求行。</p>
<p>TINY 只支持GET 方法。如果客户端请求其他方法（比如 POST），我们发送给它一 个错误信息，并返回到主程序（第15～19行），主程序随后关闭连接并等待下一个连接请 求。否则，我们读并且（像我们将要看到的那样）忽略任何请求报头（第20行）。</p>
<h2>第 707 页</h2>
<p>672</p>
<p>第三部分 程序间的交互和通信</p>
<p>- code/netp/tiny/tiny.c 6</p>
<p>7</p>
<p>9</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>15</p>
<p>16</p>
<p>17</p>
<p>18</p>
<p>19</p>
<p>20</p>
<p>21</p>
<p>22</p>
<p>23</p>
<p>24</p>
<p>25</p>
<p>26</p>
<p>27</p>
<p>28</p>
<p>29</p>
<p>30</p>
<p>31</p>
<p>32</p>
<p>33</p>
<p>34</p>
<p>35</p>
<p>36</p>
<p>37</p>
<p>38</p>
<p>39</p>
<p>/*</p>
<p>*</p>
<p>*/</p>
<p>* tiny.c - A simple, iterative HTTP/1.0 Web server that uses the GET method to serve static and dynamic content #include &quot;csapp.h&quot; void doit（int fd）；</p>
<p>void</p>
<p>read_requesthdrs（rio_t *rp）；</p>
<p>int parse_uri （char *uri, char *filename,char *cgiargs）；</p>
<p>void serve_static（int fd, char *filename,int filesize）；</p>
<p>void get_filetype（char *filename,char *filetype）；</p>
<p>void serve_dynamic（int fd, char *filename,char *cgiargs）；</p>
<p>void clienterror（int fd, char *cause,char *errnum， char *shortmsg, char *1ongmsg）；</p>
<p>int main（int argc, char **argv） ｛</p>
<p>int listenfd, connfd；</p>
<p>char hostname ［MAXLINE］，POrt ［MAXL.INE］；</p>
<p>socklen_t clientlen；</p>
<p>struct sockaddr_storage clientaddr；</p>
<p>/* Check command-1ine args */ if （argc ！= 2）｛</p>
<p>fprintf（stderr， &quot;usage： %s &lt;port&gt;\n&quot;，argv［O］）；</p>
<p>exit （1）；</p>
<p>｝</p>
<p>listenfd = Open_listenfd（argv ［1］）；</p>
<p>while （1）｛</p>
<p>clientlen = sizeof （clientaddr）；</p>
<p>connfd = Accept （1istenfd，（SA *） &amp;clientaddr，&amp;clientlen）；</p>
<p>Getnameinfo（（SA *） &amp;clientaddr, clientlen, hostname, MAXLINE， port，MAXLINE,O）；</p>
<p>printf（&quot;Accepted connection from （%s， %s）\n&quot;，hostname,port）；</p>
<p>doit （connfd）；</p>
<p>Close （connfd）；</p>
<p>｝</p>
<p>code/netp/tiny/tiny.c 图11-29</p>
<p>TINY Web 服务器</p>
<p>然后，我们将 URI解析为一个文件名和一个可能为空的CGI 参数字符串，并且设置 一个标志，表明请求的是静态内容还是动态内容（第23行）。如果文件在磁盘上不存在， 我们立即发送一个错误信息给客户端并返回。</p>
<p>最后，如果请求的是静态内容，我们就验证该文件是一个普通文件，而我们是有读权 限的（第31行）。如果是这样，我们就向客户端提供静态内容（第36行）。相似地，如果请 求的是动态内容，我们就验证该文件是可执行文件（第39行），如果是这样，我们就继续， 并且提供动态内容（第44行）。</p>
<h2>第 708 页</h2>
<h3>第11章网络编程</h3>
<p>673</p>
<p>code/netp/tiny/liny.c 10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>15</p>
<p>16</p>
<p>17</p>
<p>18</p>
<p>19</p>
<p>20</p>
<p>21</p>
<p>22</p>
<p>23</p>
<p>24</p>
<p>25</p>
<p>26</p>
<p>27</p>
<p>28</p>
<p>29</p>
<p>30</p>
<p>31</p>
<p>32</p>
<p>33、</p>
<p>34</p>
<p>35</p>
<p>36</p>
<p>37</p>
<p>38</p>
<p>39</p>
<p>40</p>
<p>41</p>
<p>42</p>
<p>43</p>
<p>44</p>
<p>45</p>
<p>46</p>
<p>void doit （int fd） ｛</p>
<p>int is_static；</p>
<p>struct stat</p>
<p>sbuf；</p>
<p>char buf ［MAXLINE］，method［MAXLINE］， uri ［MAXLINE］， version ［MAXLINE］；</p>
<p>char filename LMAXLINEJ，cgiargs IMAXLINEJ；</p>
<p>rio_t rio；</p>
<p>/* Read request line and headers */ Rio_readinitb（&amp;rio, fd）；</p>
<p>Rio_readlineb（&amp;rio, buf, MAXLINE） ；</p>
<p>printf（&quot;Request headers： \n&quot;）；</p>
<p>printf（&quot;%s&quot;，buf）；</p>
<p>sscanf （buf， &quot;%s %s %s&quot;， method, uri, version）；</p>
<p>if （strcasecmp（method， &quot;GET&quot;））｛</p>
<p>clienterror（fd, method，&quot;501&quot;，&quot;Not implemented&quot;， &quot;Tiny</p>
<p>does not implement this method&quot;）；</p>
<p>return；</p>
<p>｝</p>
<p>read_requesthdrs （&amp;rio）；</p>
<p>/* Parse URI from GET request */ is_static = parse_uri（uri, filename,cgiargs）；</p>
<p>if （stat （filename，&amp;sbuf）&lt;O）｛ clienterror（fd, filename，&quot;404&quot;， &quot;Not found&quot;， &quot;Tiny couldn&#x27;t find this file&quot;）；</p>
<p>return；</p>
<p>｝</p>
<p>if （is_static） ｛ /* Serve static content */ if （！（S_ISREG（sbuf.st_mode））I| ！（S_IRUSR &amp; sbuf.st_mode））｛ clienterror（fd, filename，&quot;403&quot;，&quot;Forbidden&quot;， &quot;Tiny couldn&#x27;t read the file&quot;）；</p>
<p>return；</p>
<p>｝</p>
<p>serve_static（fd, filename, sbuf.st_size）；</p>
<p>｝</p>
<p>else ｛ /* Serve dynamic content */ if （！（S_ISREG（sbuf.st_mode））II ！（S_IXUSR &amp; sbuf.st_mode））｛ clienterror（fd, filename，&quot;403&quot;，&quot;Forbidden&quot;， &quot;Tiny couldn&#x27;t run the CGI program&quot;）；</p>
<p>return；</p>
<p>serve_dynamic（fd, filename,cgiargs）；</p>
<p>code/netp/tiny/tiny.c 图11-30</p>
<p>TINY doit 处理一个 HTTP事务 3. clienterror 函数</p>
<p>TINY 缺乏一个实际服务器的许多错误处理特性。然而，它会检查一些明显的错误， 并把它们报告给客户端。图11-31 中的 clienterror 函数发送一个 HTTP 响应到客户端， 在响应行中包含相应的状态码和状态消息，响应主体中包含一个 HTML 文件，向浏览器</p>
<h2>第 709 页</h2>
<p>674</p>
<p>第三部分 程序间的交互和通信</p>
<p>的用户解释这个错误。</p>
<p>code/netp/tiny/tiny.c 2</p>
<p>7</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>15</p>
<p>16</p>
<p>17</p>
<p>18</p>
<p>19</p>
<p>20</p>
<p>21</p>
<p>void clienterror （int fd, char *cause,char *errnum， char *shortmsg,char *1ongmsg） ｛</p>
<p>char buf ［MAXLINE］，body ［MAXBUF］；</p>
<p>/* Build the HTTP response body */ sprintf（body，&quot;&lt;htm1&gt;&lt;title&gt;Tiny Error&lt;/title&gt;&quot;）；</p>
<p>sprintf （body，</p>
<p>&quot;&#x27;%s&lt;body bgcolor=&quot;ffffff&quot;&quot;&gt;\r\n&quot;，body）；</p>
<p>sprintf （body，</p>
<p>&quot;%s%s：%s\r\n&quot;，body,errnum,shortmsg）；</p>
<p>sprintf（body，</p>
<p>&quot;%s&lt;p&gt;%s：%slrln&quot;，body,1ongmsg，cause）；</p>
<p>sprintf（body，&quot;%s&lt;hr&gt;&lt;em&gt;The Tiny Web server&lt;/em&gt; \r\n&quot;，body）；</p>
<p>/* Print the HTTP response */ sprintf（buf，&quot;HTTP/1.0 %s %s\r\n&quot;， errnum, shortmsg）；</p>
<p>Rio_writen（fd, buf, strlen（buf））；</p>
<p>sprintf（buf，&quot;Content-type:text/html\r\n&quot;）；</p>
<p>Rio_writen（fd, buf, strlen（buf））；</p>
<p>sprintf（buf，&quot;Content-length： %alr\nlz\n&quot;，（int）strlen（body））；</p>
<p>Rio_writen（fd, buf, strlen（buf））；</p>
<p>Rio_writen（fd, body, strlen（body））；</p>
<p>｝</p>
<p>code/netp/tiny/tiny.c 图 11-31 TINY clienterror 向客户端发送一个出错消息 回想一下，HTML响应应该指明主体中内容的大小和类型。因此，我们选择创建 HTML 内容为一个字符串，这样一来我们可以简单地确定它的大小。还有，请注意我们 为所有的输出使用的都是图 10-4中健壮的rio_writen 函数。</p>
<p>4. read_requesthdrs 函数 TINY不使用请求报头中的任何信息。它仅仅调用图 11-32中的 read.</p>
<p>_requesthdrs</p>
<p>函数来读取并忽略这些报头。注意，终止请求报头的空文本行是由回车和换行符对组成 的，我们在第6行中检查它。</p>
<p>- code/netp/tiny/tiny.c void</p>
<p>read_requesthdrs （rio_t *rp） ｛</p>
<p>2</p>
<p>3</p>
<p>char buf ［MAXLINE］；</p>
<p>5</p>
<p>6</p>
<p>7</p>
<p>Rio_readlineb（rp, buf, MAXLINE）；</p>
<p>while（strcmp（buf，&quot;\z\n&quot;））｛ Rio_readlineb（rp,buf,MAXLINE）；</p>
<p>printf（&quot;%s&quot;，buf）；</p>
<p>｝</p>
<p>return；</p>
<p>10</p>
<p>11</p>
<p>｝</p>
<p>code/netp/tiny/tiny.c 图 11-32</p>
<p>TINY read_requesthdrs 读取并忽略请求报头</p>
<h2>第 710 页</h2>
<h3>第11章 网络编程</h3>
<p>675</p>
<p>5. parse_uri 函数</p>
<p>TINY假设静态内容的主目录就是它的当前目录，而可执行文件的主目录是•/cgi-bin。</p>
<p>任何包含字符串cgi-bin 的URI 都会被认为表示的是对动态内容的请求。默认的文件名是 ./home.html.</p>
<p>图 11-33中的 parse_uri 函数实现了这些策略。它将 URI 解析为一个文件名和一个 可选的CGI 参数字符串。如果请求的是静态内容（第5行），我们将清除CGI 参数字符串 （第6行），然后将 URI转换为一个 Linux 相对路径名，例如./index.htm1（第7～8行）。</p>
<p>如果 URI 是用“/”结尾的（第9行），我们将把默认的文件名加在后面（第10行）。另一方 面，如果请求的是动态内容（第13行），我们就会抽取出所有的CGI 参数（第14～20行）， 并将 URI 剩下的部分转换为一个 Linux 相对文件名（第21～22行）。</p>
<p>code/netp/tiny/tiny.c int parse_uri（char *uri,char *filename，char *cgiargs） ｛</p>
<p>char *ptr；</p>
<p>if （！strstr（uri，&quot;cgi-bin&quot;））｛ /* Static content */ strcpy （cgiargs，&quot;&quot;）；</p>
<p>strcpy （filename，&quot;. &quot;）；</p>
<p>strcat （filename,uri）；</p>
<p>9</p>
<p>if （uri［strlen（uri）-1］ == &quot;/&quot;） 10</p>
<p>strcat （filename，&quot;home.htm1&quot;）；</p>
<p>11</p>
<p>return 1；</p>
<p>12</p>
<p>｝</p>
<p>13</p>
<p>14</p>
<p>15</p>
<p>16</p>
<p>17</p>
<p>else ｛ /* Dynamic content */ Ptr = index（uri，&#x27;？&#x27;）；</p>
<p>if （ptr）｛</p>
<p>strcpy （cgiargs,ptr+1）；</p>
<p>*ptr = &#x27;\0&#x27;；</p>
<p>18</p>
<p>19</p>
<p>｝</p>
<p>else</p>
<p>20</p>
<p>21</p>
<p>22</p>
<p>23</p>
<p>strcpy （cgiargs，&quot;&quot;）；</p>
<p>strcpy （filename，</p>
<p>.&quot;）；</p>
<p>strcat （filename,uri）；</p>
<p>return O；</p>
<p>24</p>
<p>｝</p>
<p>25</p>
<p>｝</p>
<p>code/netp/tiny/tiny.c 图11-33</p>
<p>TINY parse_uri 解析一个 HTTP URI 6. serve_static 函数 TINY 提供五种常见类型的静态内容：HTML 文件、无格式的文本文件，以及编码 力GIF、PNG 和JPG 格式的图片。</p>
<p>图 11-34中的 serve_static 函数发送一个 HTTP 响应，其主体包含一个本地文件的 内容。首先，我们通过检查文件名的后缀来判断文件类型（第7行），并且发送响应行和响 应报头给客户端（第8～13行）。注意用一个空行终止报头。</p>
<h2>第 711 页</h2>
<p>676</p>
<p>第三部分 程序间的交互和通信</p>
<p>- code/netp/tiny/tiny.c 9</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>15</p>
<p>16</p>
<p>17</p>
<p>18</p>
<p>19</p>
<p>20</p>
<p>21</p>
<p>22</p>
<p>23</p>
<p>24</p>
<p>25</p>
<p>26</p>
<p>27</p>
<p>28</p>
<p>29</p>
<p>30</p>
<p>31</p>
<p>32</p>
<p>33</p>
<p>34</p>
<p>35</p>
<p>36</p>
<p>37</p>
<p>38</p>
<p>39</p>
<p>40</p>
<p>void</p>
<p>serve_static（int fd, char *filename,int filesize） ｛</p>
<p>int srcfd；</p>
<p>char *SrCp,filetype ［MAXLINE］，buf ［MAXBUF］；</p>
<p>/* Send response headers to client */ get_filetype（filename,filetype）；</p>
<p>sprintf （buf，&quot;HTTP/1.0 200 OK\r\n&quot;）；</p>
<p>sprintf （buf， &quot;%sServer: Tiny Web Server\r\n&quot;， buf）；</p>
<p>sprintf （buf，</p>
<p>&quot;%sConnection:closelr\n&quot;，buf）；</p>
<p>sprintf（buf， &quot;%sContent-length： %a\r\n&quot;，buf,filesize）；</p>
<p>sprintf（buf，&quot;%sContent-type： %s\r\nlr\n&quot;，buf, filetype）；</p>
<p>Rio_writen（fd, buf, strlen （buf））；</p>
<p>printf （&quot;Response headers： \n&quot;）；</p>
<p>printf（&quot;%s&quot;，buf）；</p>
<p>/* Send response body to client */ srctd = Open（tilename, O_RDONLY,O）；</p>
<p>SICP = Mmap（O, filesize, PROT_READ,MAP_PRIVATE, srcfd,O）；</p>
<p>Close （srcfd）；</p>
<p>Rio_writen（fd, srCp, filesize）；</p>
<p>Munmap（srcp,filesize）；</p>
<p>｝</p>
<p>/*</p>
<p>*/</p>
<p>void</p>
<p>｛</p>
<p>* get_filetype - Derive file type from filename get_filetype（char *filename,char *filetype） if （strstr（filename，&quot;.htm］&quot;）） strcpy （filetype， &quot;text/html&quot;）；</p>
<p>else if （strstr（filename， &quot;.gif&quot;）） strcpy（filetype，&quot;image/gif&quot;）；</p>
<p>else if （strstr（filename，&quot;.png&quot;）） strcpy （filetype，&quot;image/png&quot;）；</p>
<p>else if （strstr（filename，&quot;.jpg&quot;）） strcpy （filetype， &quot;image/jpeg&quot;）；</p>
<p>else</p>
<p>strcpy（filetype，&quot;text/plain&quot;）；</p>
<p>｝</p>
<p>code/netp/tiny/tiny.c 图 11-341</p>
<p>TINY serve_static 为客户端提供静态内容 接着，我们将被请求文件的内容复制到已连接描述符 Ed 来发送响应主体。这里的代 码是比较微妙的，需要仔细研究。第18行以读方式打开 filename，并获得它的描述符。</p>
<p>在第19行，Linux mmap 函数将被请求文件映射到一个虚拟内存空间。回想我们在第9.8 节中对 mmap 的讨论，调用 map 将文件srcfd 的前 filesize 个字节映射到一个从地址 srcP 开始的私有只读虚拟内存区域。</p>
<h2>第 712 页</h2>
<h3>第11章 网络编程</h3>
<p>677</p>
<p>一旦将文件映射到内存，就不再需要它的描述符了，所以我们关闭这个文件（第20 行）。执行这项任务失败将导致潜在的致命的内存泄漏。第21行执行的是到客户端的实际 文件传送。rio_writen 函数复制从 srcp 位置开始的 Eilesize 个字节（它们当然已经被 映射到了所请求的文件）到客户端的已连接描述符。最后，第22行释放了映射的虚拟内存 区域。这对于避免潜在的致命的内存泄漏是很重要的。</p>
<p>7. serve_dynamic 函数 TINY通过派生一个子进程并在子进程的上下文中运行一个CGI 程序，来提供各种类 型的动态内容。</p>
<p>图 11-35中的 serve_dynamic 函数一开始就向客户端发送一个表明成功的响应行， 同时还包括带有信息的 Server 报头。CGI 程序负责发送响应的剩余部分。注意，这并不 像我们可能希望的那样健壮，因为它没有考虑到 CGI 程序会遇到某些错误的可能性。</p>
<p>code/netp/tiny/tiny.c 1</p>
<p>void</p>
<p>serve_dynamic （int fd, char *filename,char *cgiargs） char buf ［MAXLINE］， *emptylistl］ = ｛ NULL ｝；</p>
<p>/* Return first part of HTTP response */ sprintf（buf，&quot;HTTP/1.0 200 OK\rln&quot;）；</p>
<p>Rio_writen（fd, buf, strlen（buf））；</p>
<p>sprintf （buf，&quot;Server: Tiny Web Server\z\n&quot;）；</p>
<p>Rio_writen（fd, buf,strlen（buf））；</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>15</p>
<p>16</p>
<p>17</p>
<p>18</p>
<p>if （Fork（）== 0）｛/*Child */ /* Real server would set all CGI vars here */ setenv（&quot;QUERY_STRING&quot;，cgiargs, 1）；</p>
<p>Dup2（fd, STDOUT_FILENO）；</p>
<p>/* Redirect stdout to client */ Execve （filename,emptylist,environ）；/* Run CGI program */ ｝</p>
<p>Wait（NULL）；/* Parent waits for and reaps child */ code/netp/tiny/tiny.c 图 11-35 TINY serve_dynamic 为客户端提供动态内容 在发送了响应的第一部分后，我们会派生一个新的子进程（第11 行）。子进程用来自 请求 URI 的CGI 参数初始化 QUERY_ STRING 环境变量（第13行）。注意，一个真正的 服务器还会在此处设置其他的CGI 环境变量。为了简短，我们省略了这一步。</p>
<p>接下来，子进程重定向它的标准输出到已连接文件描述符（第14行），然后加载并运行 CGI 程序（第15行）。因为 CGI程序运行在子进程的上下文中，它能够访问所有在调用ex- ecve 函数之前就存在的打开文件和环境变量。因此，CGI 程序写到标准输出上的任何东西都 将直接送到客户端进程，不会受到任何来自父进程的干涉。其间，父进程阻塞在对 wait 的 调用中，等待当子进程终止的时候，回收操作系统分配给子进程的资源（第17行）。</p>
<p>旁注</p>
<p>处理过早关闭的连接</p>
<p>尽管一个Web服务器的基本功能非常简单，但是我们不想给你一个假象，以为编写一个 实际的 Web 服务器是非常简单的。构造一个长时间运行而不崩溃的健壮的 Web 服务器是一 件困难的任务，比起在这里我们已经学习了的内容，它要求对Linux 系统编程有更加深入的</p>
<h2>第 713 页</h2>
<p>678</p>
<p>第三部分 程序间的交互和通信</p>
<p>理解。例如，如果一个服务器写一个已经被客户端关闭了的连接（比如，因为你在浏览器上 单击了“Stop” 按钮），那么第一次这样的写会正常返回，但是第二次写就会引起发送 SIG- PIPE 信号，这个信号的默认行为就是终止这个进程。如果捕获或者忽略 SIGPIPE 信号，那 么第二次写操作会返回值一1，并将 errno设置为 EPIPE。strerr 和 perrOr 函数将 EPIPE 错误报告为 “Broken pipe”，这是一个迷惑了很多人的不太直观的信息。总的来说，一个健壮 的服务器必须捕获这些 SIGPIPE 信号，并且检查 write 函数调用是否有 EPIPE 错误。</p>
<h3>11.7 小结</h3>
<p>每个网络应用都是基于客户端-服务器模型的。根据这个模型，一个应用是由一个服务器和一个或多 个客户端组成的。服务器管理资源，以某种方式操作资源，为它的客户端提供服务。客户端-服务器模型 中的基本操作是客户端-服务器事务，它是由客户端请求和跟随其后的服务器响应组成的。</p>
<p>客户端和服务器通过因特网这个全球网络来通信。从程序员的观点来看，我们可以把因特网看成是一个全 球范围的主机集合，具有以下几个属性：1）每个因特网主机都有一个唯一的32 位名字，称为它的IP地址。2） IP 地址的集合被映射为一个因特网域名的集合。3）不同因特网主机上的进程能够通过连接互相通信。</p>
<p>客户端和服务器通过使用套接字接口建立连接。一个套接字是连接的一个端点，连接以文件描述符 的形式提供给应用程序。套接字接口提供了打开和关闭套接字描述符的函数。客户端和服务器通过读写 这些描述符来实现彼此间的通信。</p>
<p>Web 服务器使用 HTTP 协议和它们的客户端（例如浏览器）彼此通信。浏览器向服务器请求静态或者 动态的内容。对静态内容的请求是通过从服务器磁盘取得文件并把它返回给客户端来服务的。对动态内 容的请求是通过在服务器上一个子进程的上下文中运行一个程序并将它的输出返回给客户端来服务的。</p>
<p>CGI 标准提供了一组规则，来管理客户端如何将程序参数传递给服务器，服务器如何将这些参数以及其 他信息传递给子进程，以及子进程如何将它的输出发送回客户端。只用几百行C代码就能实现一个简单 但是有功效的Web 服务器，它既可以提供静态内容，也可以提供动态内容。</p>
<p>参考文献说明</p>
<p>有关因特网的官方信息源被保存在一系列的可免费获取的带编号的文档中，称 RFC（Requests for Comments，请求注解，Internet 标准（草案））。在以下网站可获得可搜索的 RFC的索引：</p>
<p>http://rfc-editor.org RFC通常是为因特网基础设施的开发者编写的，因此，对于普通读者来说，往往过于详细了。然 而，要想获得权威信息，没有比它更好的信息来源了。HTTP/1.1协议记录在 RFC 2616 中。MIME 类 型的权威列表保存在：</p>
<p>http://www.iana.org/assignments/media-types Kerrisk 是全面 Linux 编程的圣经，提供了现代网络编程的详细讨论［62］。关于计算机网络互联有大量 很好的通用文献［65，84，114］。伟大的科技作家 W. Richard Stevens 编写了一系列相关的经典文献，如高级 Unix 编程［111］、因特网协议［109，120，107］，以及 Unix 网络编程［108，110］。认真学习 Unix 系统编程 的学生会想要研究所有这些内容。不幸的是，Stevens 在1999年9月1日逝世。我们会永远纪住他的贡献。</p>
<p>家庭作业</p>
<p>** 11.6</p>
<p>A. 修改 TINY使得它会原样返回每个请求行和请求报头。</p>
<p>B.使用你喜欢的浏览器向 TINY发送一个对静态内容的请求。把 TINY的输出记录到一个文件中。</p>
<p>C. 检查 TINY的输出，确定你的浏览器使用的 HTTP 的版本。</p>
<p>D. 参考 RFC2616中的HTTP/1.1标准，确定你的浏览器的HTTP 请求中每个报头的含义。你可 以从 www.rfc-editor.org/rfc.html 获得 RFC 2616。</p>
<p>** 11.7</p>
<p>扩展 TINY，使得它可以提供 MPG视频文件。用一个真正的浏览器来检验你的工作。</p>
<h2>第 714 页</h2>
<h3>第11章网络编程</h3>
<p>679</p>
<p>** 11.8</p>
<p>** 11.9</p>
<p>**11.10</p>
<p>** 11.11</p>
<p>梦11.12</p>
<p>*11.13</p>
<p>修改 TINY，使得它在SIGCHLD处理程序中回收操作系统分配给CGI 子进程的资源，而不是显 式地等待它们终止。</p>
<p>修改 TINY，使得当它服务静态内容时，使用malloc、rio_readn 和 rio_writen，而不是 mmap 和 rio_writen 来复制被请求文件到已连接描述符。</p>
<p>A. 写出图11-27中 CGl adder 函数的HTMI， 表单。你的表单应该包括两个文本框，用户将需要 相加的两个数字填在这两个文本框中。你的表单应该使用GET 方法请求内容。</p>
<p>B. 用这样的方法来检查你的程序：使用一个真正的浏览器向 TINY 请求表单，向 TINY 提交填 写好的表单，然后显示 adder 生成的动态内容。</p>
<p>扩展TINY，以支持 HTTP HEAD方法。使用TELNET 作为Web 客户端来验证你的工作。</p>
<p>扩展 TINY，使得它服务以 HTTP POST 方式请求的动态内容。用你喜欢的Web 浏览器来验证你 的工作。</p>
<p>修改 TINY，使得它可以干净地处理（而不是终止）在 write 函数试图写一个过早关闭的连接时发 生的 SIGPIPE 信号和 EPIPE错误。</p>
<p>练习题答案</p>
<p>11.1</p>
<p>十六进制地址</p>
<p>0x0</p>
<p>OxEEfEEEEE</p>
<p>0x7E000001</p>
<p>0xcdbca079</p>
<p>0x400c950d</p>
<p>0xcdbc9217</p>
<p>点分十进制地址</p>
<p>0.0.0.0</p>
<p>255.255.255.255</p>
<p>127.0.0.1</p>
<p>205.188.160.121</p>
<p>64.12.149.13</p>
<p>205.188.146.23</p>
<p>11.2</p>
<p>- code/netp/hex2dd.c 9</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>15</p>
<p>16</p>
<p>17</p>
<p>18</p>
<p>19</p>
<p>20</p>
<p>21</p>
<p>#include &quot;csapp.h&quot; int main（int argc, char **argv） struct in_addr inaddr；</p>
<p>/* Address in network byte order */ uint32_t addr；</p>
<p>/* Address in host byte order */ char buf ［MAXBUF］；</p>
<p>/* Buffer for dotted-decimal string */ if （argc ！= 2）｛</p>
<p>fprintf（stderr， &quot;usage： %s Shex number&gt;\n&quot;，argv［0］）；</p>
<p>exit （O）；</p>
<p>｝</p>
<p>sscanf （argv ［1］， &quot;%x&quot;， &amp;addr）；</p>
<p>inaddr.s_addr = htonl（addr）；</p>
<p>if （！inet_ntop（AF_INET， &amp;inaddr, buf, MAXBUF）） unix_error（&quot;inet_ntop&quot;）；</p>
<p>printf（&quot;%s\n&quot;，but）；</p>
<p>exit （O）；</p>
<p>｝</p>
<p>•code/netp/hex2dd.c 11.3</p>
<p>code/mnetp/dd2hex.c #include&quot;csapp.h&quot;</p>
<p>int main（int argc, char **argv）</p>
<h2>第 715 页</h2>
<p>680</p>
<p>第三部分 程序间的交互和通信</p>
<p>11.</p>
<p>4</p>
<p>struct in_addr inaddr; /* Address in network byte order */ int rc；</p>
<p>9</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>15</p>
<p>16</p>
<p>17</p>
<p>18</p>
<p>19</p>
<p>20</p>
<p>21</p>
<p>if （argc ！=2｛</p>
<p>fprintf （stderr，</p>
<p>&quot;usage： %s &lt;dotted-decimal&gt;\n&quot;，argv ［0］）；</p>
<p>exit（O）；</p>
<p>｝</p>
<p>rC = inet_pton（AF_INET, argv ［1］，&amp;inaddr）；</p>
<p>if （rc ==0）</p>
<p>app_error（&quot;inet_pton error: invalid dotted-decimal address&quot;）；</p>
<p>else if （rc &lt; O）</p>
<p>unix_error （&quot;inet_pton error &quot;）；</p>
<p>printf（&quot;Ox%xln&quot;， ntohl（inaddr.s_addr））；</p>
<p>exit（O）；</p>
<p>｝</p>
<p>- code/netp/dd2hex.c 下面是解决方案。注意，使用 inet_ntop 要困难多少，它要求很麻烦的强制类型转换和深层嵌套 结构引用。getnameinfo 函数要简单许多，因为它为我们完成了这些工作。</p>
<p>- code/netp/hostinfo-ntop.c #include &quot;csapp.h&quot; int</p>
<p>main（int argc, char **argv） struct addrinfo *p，*listp,hints；</p>
<p>struct sockaddr_in *sockp；</p>
<p>char buf ［MAXLINE］；</p>
<p>int rc；</p>
<p>if （argc ！= 2）｛</p>
<p>Eprintf（stderr，</p>
<p>exit（O）；</p>
<p>&quot;usage： %s &lt;domain name&gt;\n&quot;， argv ［0］）；</p>
<p>｝</p>
<p>/* Get a list of addrinfo records */ memset （&amp;hints, 0, sizeof （struct addrinfo））；</p>
<p>hints.ai_family = AF_INET；</p>
<p>/* IPv4 only */</p>
<p>hints.ai_socktype = SOCK_STREAM;/* Connections only */ if （（rc = getaddrinfo（argv［1］，NULL， &amp;hints， &amp;listp））！= O） ｛ fprintf（stderr， &quot;getaddrinfo error： %s\n&quot;， gai_strerror（rc））；</p>
<p>exit （1）；</p>
<p>｝</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>15</p>
<p>16</p>
<p>17</p>
<p>18</p>
<p>19</p>
<p>20</p>
<p>21</p>
<p>22</p>
<p>23</p>
<p>24</p>
<p>25</p>
<p>26</p>
<p>27</p>
<p>28</p>
<p>29</p>
<p>30</p>
<p>31</p>
<p>32</p>
<p>33</p>
<p>34</p>
<p>35</p>
<p>/* Walk the list and display each associated IP address */ for （p = listp; p; p = p-&gt;ai_next）｛ sockp = （struct sockaddr_in *）p-&gt;ai_addr；</p>
<p>Inet_ntop（AF_INET， &amp;（sockp-&gt;sin_addr），buf,MAXLINE）；</p>
<p>printf（&quot;%sln&quot;， buf）；</p>
<p>｝</p>
<p>/* Clean up */</p>
<p>Freeaddrinfo（1istp）；</p>
<p>exit （0）；</p>
<p>11.5</p>
<p>｝</p>
<p>- code/netp/hostinfo-ntop.c 标准1/0能在CGI程序里工作的原因是，在子进程中运行的CGI程序不需要显式地关闭它的输人 输出流。当子进程终止时，内核会自动关闭所有描述符。</p>
</div>
