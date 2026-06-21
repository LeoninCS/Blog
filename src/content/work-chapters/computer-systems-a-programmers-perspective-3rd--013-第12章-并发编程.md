---
title: "第12章 并发编程"
description: "第12章 P 并发编程 R 12 正如我们在第8章学到的，如果逻辑控制流在时间上重叠，那么它们就是并发的 （concurrent）。这种常见的现象称并发（concurrency），出现在计算机系统的许多不同层 面上。硬件异常处理程序、进程和 Linux 信号处理程序都是大家很熟悉的例子。 到目前为止，我们主要将并发看做是一种操作系统内核用来运行多个应用程序的"
readerUrl: "/books/computer-systems-a-programmers-perspective-3rd/013-第12章-并发编程.pdf"
sourceUrl: "授权 PDF：深入理解计算机系统 原书第3版 ,兰德尔E.布莱恩特 ,P737 ,2016.11.pdf，页 716-773"
workSlug: "computer-systems-a-programmers-perspective-3rd"
workTitle: "深入理解计算机系统（原书第 3 版）"
chapterSlug: "013-第12章-并发编程"
order: 13
categories: ["计算机基础", "系统"]
tags: ["CSAPP", "计算机系统", "C", "体系结构"]
---
<div class="imported-document imported-pdf-document">
<h2>第12章 并发编程</h2>
<h2>第 716 页</h2>
<h3>第12章</h3>
<p>P</p>
<p>并发编程</p>
<p>R</p>
<p>12</p>
<p>正如我们在第8章学到的，如果逻辑控制流在时间上重叠，那么它们就是并发的 （concurrent）。这种常见的现象称并发（concurrency），出现在计算机系统的许多不同层 面上。硬件异常处理程序、进程和 Linux 信号处理程序都是大家很熟悉的例子。</p>
<p>到目前为止，我们主要将并发看做是一种操作系统内核用来运行多个应用程序的机 制。但是，并发不仅仅局限于内核。它也可以在应用程序中扮演重要角色。例如，我们已 经看到 Linux 信号处理程序如何允许应用响应异步事件，例如用户键入Ctrl+C，或者程 序访问虚拟内存的一个未定义的区域。应用级并发在其他情况下也是很有用的：</p>
<p>•访问慢速 1/0设备。当一个应用正在等待来自慢速1/0设备（例如磁盘）的数据到达 时，内核会运行其他进程，使CPU 保持繁忙。每个应用都可以按照类似的方式， 通过交替执行1/0请求和其他有用的工作来利用并发。</p>
<p>• 与人交互。和计算机交互的人要求计算机有同时执行多个任务的能力。例如，他们 在打印一个文档时，可能想要调整一个窗口的大小。现代视窗系统利用并发来提供 这种能力。每次用户请求某种操作（比如通过单击鼠标）时，一个独立的并发逻辑流 被创建来执行这个操作。</p>
<p>• 通过推迟工作以降低延迟。有时，应用程序能够通过推迟其他操作和并发地执行它 们，利用并发来降低某些操作的延迟。比如，一个动态内存分配器可以通过推迟合 并，把它放到一个运行在较低优先级上的并发“合并”流中，在有空闲的CPU 周 期时充分利用这些空闲周期，从而降低单个 free 操作的延迟。</p>
<p>• 服务多个网络客户端。我们在第11章中学习的迭代网络服务器是不现实的，因为它 们一次只能为一个客户端提供服务。因此，一个慢速的客户端可能会导致服务器拒绝 为所有其他客户端服务。对于一个真正的服务器来说，可能期望它每秒为成百上千的 客户端提供服务，由于一个慢速客户端导致拒绝为其他客户端服务，这是不能接受 的。一个更好的方法是创建一个并发服务器，它为每个客户端创建一个单独的逻辑 流。这就允许服务器同时为多个客户端服务，并且也避免了慢速客户端独占服务器。</p>
<p>• 在多核机器上进行并行计算。许多现代系统都配备多核处理器，多核处理器中包含 有多个 CPU。被划分成并发流的应用程序通常在多核机器上比在单处理器机器上运 行得快，因为这些流会并行执行，而不是交错执行。</p>
<p>使用应用级并发的应用程序称为并发程序（concurrent program）。现代操作系统提供 了三种基本的构造并发程序的方法：</p>
<p>• 进程。用这种方法，每个逻辑控制流都是一个进程，由内核来调度和维护。因为进 程有独立的虚拟地址空间，想要和其他流通信，控制流必须使用某种显式的进程间 通信（interprocess communication,IPC）机制。</p>
<p>• 1/O多路复用。在这种形式的并发编程中，应用程序在一个进程的上下文中显式地 调度它们自己的逻辑流。逻辑流被模型化为状态机，数据到达文件描述符后，主程 序显式地从一个状态转换到另一个状态。因为程序是一个单独的进程，所以所有的 流都共享同一个地址空间。</p>
<h2>第 717 页</h2>
<p>682</p>
<p>第三部分 程序间的交互和通信</p>
<p>• 线程。线程是运行在一个单一进程上下文中的逻辑流，由内核进行调度。你可以把 线程看成是其他两种方式的混合体，像进程流一样由内核进行调度，而像I/O多路 复用流一样共享同一个虚拟地址空间。</p>
<p>本章研究这三种不同的并发编程技术。为了使我们的讨论比较具体，我们始终以同一 个应用为例——11.4.9节中的迭代 echo 服务器的并发版本。</p>
<p>12. 1 基于进程的并发编程</p>
<p>构造并发程序最简单的方法就是用进程，使用那些大家都很熟悉的函数，像 EOrk、 exec 和 waitpid。例如，一个构造并发服务器的自然方法就是，在父进程中接受客户端 连接请求，然后创建一个新的子进程来为每个新客户端提供服务。</p>
<p>为了了解这是如何工作的，假设我们有两个客户端和一个服务器，服务器正在监听一 个监听描述符（比如指述符3）上的连接请求。现在假设服务器接受了客户端1的连接请求， 并返回一个已连接描述符（比如指述符4），如图12-1所示。在接受连接请求之后，服务器 派生一个子进程，这个子进程获得服务器描述符表的完整副本。子进程关闭它的副本中的 监听描述符3，而父进程关闭它的已连接描述符4的副本，因为不再需要这些描述符了。</p>
<p>这就得到了图12-2中的状态，其中子进程正忙于为客户端提供服务。</p>
<p>子进程1</p>
<p>数据传送</p>
<p>connfd （4）</p>
<p>客户端1</p>
<p>连接请求</p>
<p>客户端1</p>
<p>clientfd</p>
<p>listenfd （3）</p>
<p>Ad</p>
<p>clientfd</p>
<p>服务器</p>
<p>connfd （4）</p>
<p>listenfd（3）</p>
<p>服务器</p>
<p>客户端2</p>
<p>客户端2</p>
<p>clientfd</p>
<p>clientfd</p>
<p>图 12-1</p>
<p>第一步：服务器接受客户端的连接请求</p>
<p>图12-2 第二步：服务器派生一个子进程为这个客户端服务 因为父、子进程中的已连接描述符都指向同一个文件表表项，所以父进程关闭它的已 连接描述符的副本是至关重要的。否则，将永不会释放已连接描述符4的文件表条目，而 且由此引起的内存泄漏将最终消耗光可用的内存，使系统崩溃。</p>
<p>现在，假设在父进程为客户端1创建了子进程之后，它接受一个新的客户端2的连接请 求，并返回一个新的已连接描述符（比如描述符 5），如图12-3所示。然后，父进程又派生另 一个子进程，这个子进程用已连接描述符5为它的客户端提供服务，如图12-4所示。此时， 父进程正在等待下一个连接请求，而两个子进程正在并发地为它们各自的客户端提供服务。</p>
<p>数据传送</p>
<p>子进程1</p>
<p>connfd （4）</p>
<p>数据传送</p>
<p>子进程1</p>
<p>connfd （4）</p>
<p>客户端1</p>
<p>clientfd</p>
<p>客户端1</p>
<p>listenfd （3）</p>
<p>服务器</p>
<p>clientfd</p>
<p>listenfd （3）</p>
<p>服务器</p>
<p>connfd （5）</p>
<p>客户端2</p>
<p>连接请求</p>
<p>数据传送</p>
<p>clientfd</p>
<p>客户端2</p>
<p>图 12-3</p>
<p>clientfd</p>
<p>第三步：服务器接受另一个连接请求</p>
<p>图 12-4</p>
<p>子进程2</p>
<p>connfd （5）</p>
<p>第四步：服务器派生另一个子进程为新的客户端服务</p>
<h2>第 718 页</h2>
<h3>第12章 并发编程</h3>
<p>683</p>
<p>12. 1.1 基于进程的并发服务器 图12-5展示了一个基于进程的并发 echo 服务器的代码。第29行调用的echo 函数来 自于图11-21。关于这个服务器，有几点重要内容需要说明：</p>
<p>• 首先，通常服务器会运行很长的时间，所以我们必须要包括一个 SIGCHLD 处理程 序，来回收僵死（z0mbie）子进程的资源（第4～9行）。因为当 SIGCHLD 处理程序 执行时，SIGCHLD 信号是阻塞的，而Linux 信号是不排队的，所以 SIGCHLD处 理程序必须准备好回收多个僵死子进程的资源。</p>
<p>• 其次，父子进程必须关闭它们各自的connfd（分别第33行和第30行）副本。就 像我们已经提到过的，这对父进程而言尤为重要，它必须关闭它的已连接描述符， 以避免内存泄漏。</p>
<p>• 最后，因为套接字的文件表表项中的引用计数，直到父子进程的connfd 都关闭了， 到客户端的连接才会终止。</p>
<p>code/conc/echoserverp.c 2</p>
<p>3</p>
<p>#include &quot;csapp.h&quot; void</p>
<p>echo （int connfd）；</p>
<p>void</p>
<p>sigchld_handler （int sig） ｛</p>
<p>while （waitpid（-1, 0, WNOHANG）&gt;0） return；</p>
<p>9</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>15.</p>
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
<p>｝</p>
<p>int</p>
<p>｛</p>
<p>main （int argc, char **argv） int 1istenfd, connfd；</p>
<p>socklen_t clientlen；</p>
<p>struct sockaddr_storage clientaddr；</p>
<p>if （argc ！= 2）｛</p>
<p>exit（O）；</p>
<p>fprintf（stderr，&quot;usage： %s &lt;port&gt;\n&quot;， argv ［0］）；</p>
<p>｝</p>
<p>Signal （SIGCHLD, sigchld_handler）；</p>
<p>1istenfd = Open_listenfd（argv［1］）；</p>
<p>while （1）｛</p>
<p>clientlen = sizeof （struct sockaddr_storage）；</p>
<p>connfd = Accept （1istenfd，（SA *） &amp;clientaddr，&amp;clientlen）；</p>
<p>if （Fork（）==0）｛</p>
<p>Close（listenfd）；/* Child closes its listening socket */ echo（connfd）；</p>
<p>/* Child</p>
<p>services client */ Close （connfd）； /* Child closes connection with client */ exit （O）；</p>
<p>/* Child exits */</p>
<p>｝</p>
<p>Close （connfd）；/* Parent closes connected socket （important！）*/ ｝</p>
<p>图 12-5</p>
<p>- code/conc/echoserverp.c 基于进程的并发 echo服务器。父进程派生一个子进程来处理每个新的连接请求</p>
<h2>第 719 页</h2>
<p>684</p>
<p>第三部分 程序间的交互和通信</p>
<h3>12.1.2 进程的优劣</h3>
<p>对于在父、子进程间共享状态信息，进程有一个非常清晰的模型：共享文件表，但是不共 享用户地址空间。进程有独立的地址空间既是优点也是缺点。这样一来，一个进程不可能不小 心覆盖另一个进程的虚拟内存，这就消除了许多令人迷惑的错误—这是一个明显的优点。</p>
<p>另一方面，独立的地址空间使得进程共享状态信息变得更加困难。为了共享信息，它 们必须使用显式的IPC（进程间通信）机制。（参见下面的旁注。）基于进程的设计的另一个 缺点是，它们往往比较慢，因为进程控制和IPC 的开销很高。</p>
<p>旁注</p>
<p>Unix IPC</p>
<p>在本书中，你已经遇到好几个 IPC的例子了。第8章中的waitpid函数和信号是 基本的IPC机制，它们允许进程发送小消息到同一主机上的其他进程。第11 章的套接 宇接口是IPC的一种重要形式，它允许不同主机上的进程交换任意的字节流。然而，术 语 Unix IPC 通常指的是所有允许进程和同一台主机上其他进程进行通信的技术。其中 包括管道、先进先出（FIFO）、系统 V 共享内存，以及系统V信号量（semaphore）。这 些机制超出了我们的讨论范围。Kerrisk的著作［62］是很好的参考资料。</p>
<p>C 练习题12.1 在图12-5中，并发服务器的第33行上，父进程关闭了已连接描述符 后，子进程仍然能够使用该描述符和客户端通信。为什么？</p>
<p>练习题 12.2 如果我们要删除图12-5中关闭已连接描述符的第30行，从没有内存泄 漏的角度来说，代码将仍然是正确的。为什么？</p>
<h3>12.2 基于1/0多路复用的并发编程</h3>
<p>假设要求你编写一个 echo 服务器，它也能对用户从标准输人键人的交互命令做出响 应。在这种情况下，服务器必须响应两个互相独立的1/0事件：1）网络客户端发起连接请 求，2）用户在键盘上键入命令行。我们先等待哪个事件呢？没有哪个选择是理想的。如果 在 accept 中等待一个连接请求，我们就不能响应输人的命令。类似地，如果在 read 中 等待一个输人命令，我们就不能响应任何连接请求。</p>
<p>针对这种困境的一个解决办法就是1/O多路复用（I/O multiplexing）技术。基本的思 路就是使用 select 函数，要求内核挂起进程，只有在一个或多个1/0事件发生后，才将 控制返回给应用程序，就像在下面的示例中一样：</p>
<p>• 当集合｛0，4｝中任意描述符准备好读时返回。</p>
<p>• 当集合｛1，2，7｝中任意描述符准备好写时返回。</p>
<p>• 如果在等待一个1/0事件发生时过了152.13秒，就超时。</p>
<p>select 是一个复杂的函数，有许多不同的使用场景。我们将只讨论第一种场景：等 待一组描述符准备好读。全面的讨论请参考［62，110］。</p>
<p>#include &lt;sys/select.h&gt; int select （int n, fd_set *fdset,NULL,NULL, NULL）；</p>
<p>返回已准备好的描述符的非零的个数，若出错则为一1。</p>
<p>FD_ZERO （fd_set *fdset）；</p>
<p>/* Clear all bits in fdset */ FD_CLRCint fd, fd_set *fdset）；</p>
<p>/* Clear bit fd</p>
<p>FD_SET （int fd, fd_set *fdset）；</p>
<p>Turn on bit fd in fdset */ FD_ISSET （int fd, fd_set *fdset）；</p>
<p>/* Is bit fd in fdset on？ */ 处理描述符集合的宏。</p>
<h2>第 720 页</h2>
<h3>第12章 并发编程</h3>
<p>685</p>
<p>select 函数处理类型力 fd</p>
<p>Lset 的集合，也叫做描述符集合。逻辑上，我们将描述符 集合看成一个大小为n的位向量（在2.1节中介绍过）：</p>
<p>0.-1，⋯，61,60</p>
<p>每个位6对应于描述符k。当且仅当6=1，描述符k才表明是描述符集合的一个元素。只 允许你对描述符集合做三件事：1）分配它们，2）将一个此种类型的变量赋值给另一个变 量，3）用 FD_ZERO、FD_SET、FD_CLR 和 FD_ISSET 宏来修改和检查它们。</p>
<p>针对我们的目的，select 函数有两个输入：一个称为读集合的描述符集合（Edset） 和该读集合的基数（n）（实际上是任何描述符集合的最大基数）。select 函数会一直阻塞， 直到读集合中至少有一个描述符准备好可以读。当且仅当一个从该描述符读取一个字节的 请求不会阻塞时，描述符k 就表示准备好可以读了。select 有一个副作用，它修改参数 Edset 指向的 Ed</p>
<p>L_set，指明读集合的一个子集，称为准备好集合（ready set），这个集合 是由读集合中准备好可以读了的描述符组成的。该函数返回的值指明了准备好集合的基 数。注意，由于这个副作用，我们必须在每次调用 select 时都更新读集合。</p>
<p>理解 select 的最好办法是研究一个具体例子。图 12-6展示了可以如何利用 select 来实现一个迭代 echo 服务器，它也可以接受标准输入上的用户命令。一开始，我们用 图11-19中的 open</p>
<p>_1istenfd 函数打开一个监听描述符（第16行），然后使用 FD_ZERO 创建一个空的读集合（第18行）：</p>
<p>listenfd</p>
<p>3</p>
<p>2</p>
<p>1</p>
<p>stdin</p>
<p>0</p>
<p>read_set （0）：</p>
<p>接下来，在第19和20行中，我们定义由描述符0（标准输入）和描述符3（监听描述 符）组成的读集合：</p>
<p>listenfd</p>
<p>3</p>
<p>2</p>
<p>1</p>
<p>stdin</p>
<p>0</p>
<p>read_set （｛0, 3））：</p>
<p>在这里，我们开始典型的服务器循环。但是我们不调用 accept 函数来等待一个连接 请求，而是调用 select 函数，这个函数会一直阻塞，直到监听描述符或者标准输入准备 好可以读（第24行）。例如，下面是当用户按回车键，因此使得标准输人描述符变为可读 时，select 会返回的 ready_set 的值：</p>
<p>listenfd</p>
<p>3</p>
<p>2</p>
<p>1</p>
<p>stdin</p>
<p>0</p>
<p>ready-set （｛Oj）：</p>
<p>一旦 select 返回，我们就用FD_ISSET 宏指令来确定哪个描述符准备好可以读了。</p>
<p>如果是标准输入准备好了（第25行），我们就调用comand 函数，该函数在返回到主程序 前，会读、解析和响应命令。如果是监听描述符准备好了（第27行），我们就调用 accept 来得到一个已连接描述符，然后调用图11-22 中的 echo 函数，它会将来自客户端的每一 行又回送回去，直到客户端关闭这个连接中它的那一端。</p>
<p>虽然这个程序是使用 select 的一个很好示例，但是它仍然留下了一些问题待解决。问 题是一旦它连接到某个客户端，就会连续回送输人行，直到客户端关闭这个连接中它的那一 端。因此，如果键人一个命令到标准输人，你将不会得到响应，直到服务器和客户端之间结</p>
<h2>第 721 页</h2>
<p>686</p>
<p>第三部分 程序间的交互和通信</p>
<p>束。一个更好的方法是更细粒度的多路复用，服务器每次循环（至多）回送一个文本行。</p>
<p>- codelconc/select.c 4</p>
<p>6</p>
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
<p>41</p>
<p>#include &quot;csapp.h&quot; void</p>
<p>echo（int connfd）；</p>
<p>void command （void）；</p>
<p>int main（int argc, char **argv） ｛</p>
<p>int 1istenfd, connfd；</p>
<p>socklen_t clientlen；</p>
<p>struct</p>
<p>sockaddr_storage clientaddr；</p>
<p>fd_set</p>
<p>read_set,ready_set；</p>
<p>if （argc ！=2）｛</p>
<p>exit（O）；</p>
<p>fprintf（stderr， &quot;usage： %s &lt;port&gt;\n&quot;，argv ［O］）；</p>
<p>｝</p>
<p>1istenfd = Open_1istenfd（argv ［1］）；</p>
<p>FD_ZERO （&amp;read_set）；</p>
<p>/* Clear read set */ FD_SET（STDIN_FILENO， &amp;read_set）；/* Add stdin to read set */ FD_SET（1istenfd， &amp;read_set）；</p>
<p>/* Add listenfd to read set */ while （1） ｛</p>
<p>ready_set = read_set；</p>
<p>Select （1istenfd+1，&amp;ready_set,NULL,NULL,NULL）；</p>
<p>i （FD_ISSET（STDIN_FILENO， &amp;ready_set）） command （）；/* Read command line from stdin */ if （FD_ISSET（1istenfd， &amp;ready_set））｛ clientlen = sizeof（struct sockaddr_storage）；</p>
<p>connfd = Accept （1istenfd， （SA *） &amp;clientaddr，&amp;clientlen）；</p>
<p>echo （connfd）；/* Echo client input until EOF */ Close （connfd）；</p>
<p>void command（void）｛ char buf ［MAXLINE］；</p>
<p>if （！Fgets（buf,MAXLINE, stdin）） exit （O）；/* EOF */ printf（&quot;%s&quot;， buf）； /* Process the input command */ ｝</p>
<p>code/conc/select.c 图 12-6</p>
<p>使用1/0多路复用的迭代 echo服务器。服务器使用 select 等待监听描述符上的连接请求和标准输入上的命令 练习题 12.3</p>
<p>在Linux 系统里，在标准输入上键入Ctrl+D表示 EOF。</p>
<p>图 12-6 中的</p>
<p>程序阻塞在对 select 的调用上时，如果你键入Ctrl+D会发生什么？</p>
<p>12.2. 1 基于1/0多路复用的并发事件驱动服务器 1/0多路复用可以用做并发事件驱动（event-driven）程序的基础，在事件驱动程序中， 某些事件会导致流向前推进。一般的思路是将逻辑流模型化为状态机。不严格地说，一个</p>
<h2>第 722 页</h2>
<h3>第12章 并发编程</h3>
<p>687</p>
<p>状态机（state machine）就是一组状态（state）、输入事件（input event）和转移（transition）， 其中转移是将状态和输人事件映射到状态。每个转移是将一个（输人状态，输人事件）对映 射到一个输出状态。自循环（self-loop）是同一输人和输出状态之间的转移。通常把状态机 画成有向图，其中节点表示状态，有向弧表示转移，而弧上的标号表示输入事件。一个状 态机从某种初始状态开始执行。每个输入事件都会引发一个从当前状态到下一状态的 转移。</p>
<p>对于每个新的客户端k，基于1/0多路 复用的并发服务器会创建一个新的状态机 输人事件：“描述符</p>
<p>d.准备好可以读了”</p>
<p>转移：“从描述符</p>
<p>d读一个文本行”</p>
<p>Sk，并将它和已连接描述符d联系起来。如 图12-7所示，每个状态机S、都有一个状态 状态：“等待描述符</p>
<p>d，准备好可读”</p>
<p>（“等待描述符 dk准备好可读”）、一个输人事 件（“描述符 d、准备好可以读了”）和一个转移 （“从描述符dx读一个文本行”）。</p>
<p>图12-7 并发事件驱动 echo 服务器中逻辑流的状态机 服务器使用1/0多路复用，借助 select 函数检测输人事件的发生。当每个已连接描 述符准备好可读时，服务器就为相应的状态机执行转移，在这里就是从描述符读和写回一 个文本行。</p>
<p>图12-8展示了一个基于1/0多路复用的并发事件驱动服务器的完整示例代码。一个 poo1结构里维护着活动客户端的集合（第3～11行）。在调用 init_poo1 初始化池（第27 行）之后，服务器进人一个无限循环。在循环的每次迭代中，服务器调用 select 函数来 检测两种不同类型的输人事件：a）来自一个新客户端的连接请求到达，b）一个已存在的客 户端的已连接描述符准备好可以读了。当一个连接请求到达时（第35行），服务器打开连 接（第37行），并调用 add</p>
<p>_client 函数，将该客户端添加到池里（第38行）。最后，服务 器调用 check_clients 函数，把来自每个准备好的已连接描述符的一个文本行回送回去 （第42行）。</p>
<p>code/conc/echoservers.c #include &quot;csapp.h&quot; typedef struct ｛ /* Represents a pool of connected descriptors */</p>
<p>4</p>
<p>5</p>
<p>int maxfd；</p>
<p>/* Largest descriptor in read_set */</p>
<p>fd_set read_set；</p>
<p>/* Set of all active descriptors */ fd_set ready_set;/* Subset of descriptors ready for reading */</p>
<p>int nready；</p>
<p>/* Number of ready descriptors from select */ 8</p>
<p>int maxi；</p>
<p>/*High water index into client array */ 9</p>
<p>int clientfd［FD_SETSIZE］；</p>
<p>/* Set of active descriptors */ 10</p>
<p>rio_t clientrio［FD_SETSIZE］；/* Set of active read buffers */ 11</p>
<p>｝ pool；</p>
<p>12</p>
<p>13</p>
<p>int byte_cnt = 0; /* Counts total bytes received by server */ 14</p>
<p>15</p>
<p>int main（int argc, char **argv） 16</p>
<p>｛</p>
<p>17</p>
<p>18</p>
<p>19</p>
<p>int listenfd, connfd；</p>
<p>socklen_t clientlen；</p>
<p>struct sockaddr_storage clientaddr；</p>
<p>图12-8</p>
<p>基于1/0多路复用的并发 echo服务器。每次服务器迭代 都回送来自每个准备好的描述符的文本行</p>
<h2>第 723 页</h2>
<p>688</p>
<p>第三部分 程序间的交互和通信</p>
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
<p>41</p>
<p>42</p>
<p>43</p>
<p>44</p>
<p>static</p>
<p>Pool pool；</p>
<p>if （argc ！= 2）｛</p>
<p>exit （O）；</p>
<p>Eprintf（stderr，&quot;usage： %s &lt;port&gt;\n&quot;，argv［0］）；</p>
<p>｝</p>
<p>1istentd = Open_1istenfd（argv［1］）；</p>
<p>init_pool（1istenfd， &amp;pool）；</p>
<p>while （1） ｛</p>
<p>/* Wait for 1istening/connected descriptor（s） to become ready */ pool.ready_set = pool.read_set；</p>
<p>pool.nready = Select（pool.maxfd+1，&amp;pool.ready_set, NULL, NULL,NULL） ；</p>
<p>/* If listening descriptor ready, add new client to pool */ if （FD_ISSET（listenfd， &amp;pool.ready_set））｛ Clientlen = sizeof （struct sockaddr_storage）；</p>
<p>conntd = Accept （1istenfd，（SA *）&amp;clientaddr，&amp;clientlen）；</p>
<p>add_client （connfd， &amp;pool）；</p>
<p>｝</p>
<p>/* Echo a text line from each ready connected descriptor */ check_clients （&amp;poo1）；</p>
<p>｝</p>
<p>code/conc/echoservers.c 图12-8（续）</p>
<p>init_pool 函数（图12-9）初始化客户端池。clientfd 数组表示已连接描述符的集 合，其中整数一1表示一个可用的槽位。初始时，已连接描述符集合是空的（第5～7行）， 而且监听描述符是 select 读集合中唯一的描述符（第10～12行）。</p>
<p>code/conc/echoservers.c 2</p>
<p>4</p>
<p>5</p>
<p>6</p>
<p>9</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>void</p>
<p>｛</p>
<p>init-pool（int 1istenfd, pool *p） /* Initially,there are no connected descriptors */ int i；</p>
<p>P-&gt;maxi = -1；</p>
<p>for （i=0；i&lt; FD_SETSIZE;i++） p-&gt;clientfd［i］ = -1；</p>
<p>/* Initially,listenfd is only member of select read set */ p-&gt;maxfd = 1istenfd；</p>
<p>FD_ZERO （&amp;p-&gt;read_set）；</p>
<p>FD_SET（1istenfd， &amp;p-&gt;read_set）；</p>
<p>｝</p>
<p>code/conc/echoservers.c 图12-9</p>
<p>init_pool 初始化活动客户端池 add_client 函数（图12-10）添加一个新的客户端到活动客户端池中。在 clientfd 数组中找到一个空槽位后，服务器将这个已连接描述符添加到数组中，并初始化相应的 RIO 读缓冲区，这样一来我们就能够对这个描述符调用rio_readlineb（第8～9行）。然</p>
<h2>第 724 页</h2>
<h3>第12章 并发编程</h3>
<p>689</p>
<p>后，我们将这个已连接描述符添加到 select 读集合（第12行），并更新该池的一些全局属 性。maxfd变量（第15～16行）记录了 select 的最大文件描述符。maxi 变量（第17~18 行）记录的是到 clientfd 数组的最大索引，这样 check_clients 函数就无需搜索整个数 组了。</p>
<p>code/conc/echoservers.c void add_client （int connfd, pool *p） 2</p>
<p>｛</p>
<p>int i；</p>
<p>p-&gt;nready--；</p>
<p>for （i = 0;i &lt; FD_SETSIZE; i++）/* Find an available slot */ if（p-&gt;clientfdli］ &lt;O） ｛ /* Add connected descriptor to the pool */ 8</p>
<p>p-&gt;clientfd［i］ = connfd；</p>
<p>9</p>
<p>Rio_readinitb（&amp;p-&gt;clientrio［i］， connfd）；</p>
<p>10</p>
<p>11</p>
<p>/* Add the descriptor to descriptor set */ 12</p>
<p>FD_SET （connfd，&amp;p-&gt;read_set）；</p>
<p>13</p>
<p>14</p>
<p>15</p>
<p>16</p>
<p>17</p>
<p>18</p>
<p>19</p>
<p>/* Update max</p>
<p>descriptor and pool high water mark */ if （connfd &gt; p-&gt;maxfd） p-&gt;maxfd = connfd；</p>
<p>i（i&gt;p-&gt;maxi）</p>
<p>p-&gt;maxi = i；</p>
<p>break；</p>
<p>20</p>
<p>｝</p>
<p>21</p>
<p>22</p>
<p>if（i == FD_SETSIZE）/* Couldn&#x27;t find an empty slot */ app_error（&quot;add_client error: Too many clients&quot;）；</p>
<p>23</p>
<p>code/conc/echoservers.c 图12-10</p>
<p>add_client 向池中添加一个新的客户端连接 图12-11 中的 check_clients 函数回送来自每个准备好的已连接描述符的一个文本行。</p>
<p>如果成功地从描述符读取了一个文本行，那么就将该文本行回送到客户端（第15～18行）。</p>
<p>注意，在第15行我们维护着一个从所有客户端接收到的全部字节的累计值。如果因为客 户端关闭这个连接中它的那一端，检测到 EOF，那么将关闭这边的连接端（第23行），并 从池中清除掉这个描述符（第24～25行）。</p>
<p>根据图 12-7中的有限状态模型，select 函数检测到输入事件，而 add_client 函数 创建一个新的逻辑流（状态机）。check_ clients 函数回送输入行，从而执行状态转移， 而且当客户端完成文本行发送时，它还要删除这个状态机。</p>
<p>国练习题 12.4 图12-8所示的服务器中，我们在每次调用 select 之前都立即小心地 重新初始化 pool.ready_set 变量。为什么？</p>
<p>旁注</p>
<p>事件驱动的 Web 服务器</p>
<p>尽管有12.2.2节中说明的缺点，现代高性能服务器（例如 Node. js、nginx 和 Tor- nado）使用的都是基于1/O多路复用的事件驱动的编程方式，主要是因为相比于进程和 线程的方式，它有明显的性能优势。</p>
<h2>第 725 页</h2>
<p>690</p>
<p>第三部分 程序间的交互和通信</p>
<p>code/conc/echoservers.c 2</p>
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
<p>void check_clients（pool *p） ｛</p>
<p>int i,connfd,n；</p>
<p>char buf IMAXLINEJ；</p>
<p>rio_t rio；</p>
<p>for （i= 0；（i &lt;= p-&gt;maxi）&amp;&amp; （p-&gt;nready &gt; 0）；i++）｛ connfd = p-&gt;clientfd［i］；</p>
<p>rio = p-&gt;clientrio［i］；</p>
<p>/* If the descriptor is ready,echo a text line from it */ if（（connfd &gt; 0） &amp;&amp; （FD_ISSET （connfd， &amp;p-&gt;ready_set）））｛ P-&gt;nready--；</p>
<p>if （（n = Rio_readlineb（&amp;rio, buf,MAXLINE））！= 0）｛ byte_cnt += n；</p>
<p>printf（&quot;Server received %d （%d total） bytes on fd %dln&quot;， n，byte_cnt, connfd）；</p>
<p>Rio_writen（connfd, but, n）；</p>
<p>｝</p>
<p>/* EOF detected, remove descriptor from pool */ else ｛</p>
<p>Close （connfd）；</p>
<p>FD_CLR（connfd，&amp;p-&gt;read_set）；</p>
<p>p-&gt;clientfd［i］ = -1；</p>
<p>｝</p>
<p>code/conc/echoservers.c 图 12-11</p>
<p>check_clients 服务准备好的客户端连接 12.2.2</p>
<p>1/O</p>
<p>多路复用技术的优劣</p>
<p>图12-8中的服务器提供了一个很好的基于1/0多路复用的事件驱动编程的优缺点示 例。事件驱动设计的一个优点是，它比基于进程的设计给了程序员更多的对程序行为的控 制。例如，我们可以设想编写一个事件驱动的并发服务器，为某些客户端提供它们需要的 服务，而这对于基于进程的并发服务器来说，是很困难的。</p>
<p>另一个优点是，一个基于1/0多路复用的事件驱动服务器是运行在单一进程上下文中 的，因此每个逻辑流都能访问该进程的全部地址空间。这使得在流之间共享数据变得很容 易。一个与作为单个进程运行相关的优点是，你可以利用熟悉的调试工具，例如GDB， 来调试你的并发服务器，就像对顺序程序那样。最后，事件驱动设计常常比基于进程的设 计要高效得多，因为它们不需要进程上下文切换来调度新的流。</p>
<p>事件驱动设计一个明显的缺点就是编码复杂。我们的事件驱动的并发 echo 服务器需要的 代码比基于进程的服务器多三倍，并且很不幸，随着并发粒度的减小，复杂性还会上升。这 里的粒度是指每个逻辑流每个时间片执行的指令数量。例如，在示例并发服务器中，并发粒 度就是读一个完整的文本行所需要的指令数量。只要某个逻辑流正忙于读一个文本行，其他 逻辑流就不可能有进展。对我们的例子来说这没有问题，但是它使得在“故意只发送部分文</p>
<h2>第 726 页</h2>
<h3>第12章并发编程</h3>
<p>691</p>
<p>本行然后就停止”的恶意客户端的攻击面前，我们的事件驱动服务器显得很脆弱。修改事件 驱动服务器来处理部分文本行不是一个简单的任务，但是基于进程的设计却能处理得很好， 而且是自动处理的。基于事件的设计另一个重要的缺点是它们不能充分利用多核处理器。</p>
<h3>12.3 基于线程的并发编程</h3>
<p>到目前为止，我们已经看到了两种创建并发逻辑流的方法。在第一种方法中，我们为 每个流使用了单独的进程。内核会自动调度每个进程，而每个进程有它自己的私有地址空 间，这使得流共享数据很困难。在第二种方法中，我们创建自己的逻辑流，并利用1/0多 路复用来显式地调度流。因为只有一个进程，所有的流共享整个地址空间。本节介绍第三 种方法—基于线程，它是这两种方法的混合。</p>
<p>线程（thread）就是运行在进程上下文中的逻辑流。在本书里迄今为止，程序都是由每 个进程中一个线程组成的。但是现代系统也允许我们编写一个进程里同时运行多个线程的 程序。线程由内核自动调度。每个线程都有它自己的线程上下文（thread context），包括一 个唯一的整数线程 ID（Thread ID，TID）、栈、栈指针、程序计数器、通用目的寄存器和 条件码。所有的运行在一个进程里的线程共享该进程的整个虚拟地址空间。</p>
<p>基于线程的逻辑流结合了基于进程和基于1/0多路复用的流的特性。同进程一样，线 程由内核自动调度，并且内核通过一个整数ID 来识别线程。同基于1/0多路复用的流一 样，多个线程运行在单一进程的上下文中，因此共享这个进程虚拟地址空间的所有内容， 包括它的代码、数据、堆、共享库和打开的文件。</p>
<p>时间</p>
<h3>12.3.1 线程执行模型</h3>
<p>线程1</p>
<p>（主线程）</p>
<p>线程2</p>
<p>（对等线程）</p>
<p>多线程的执行模型在某些方面和多进</p>
<p>程的执行模型是相似的。思考图12-12中的 ｝线程上下文切换</p>
<p>示例。每个进程开始生命周期时都是单一 线程，这个线程称为主线程（main thread）。</p>
<p>｝线程上下文切换</p>
<p>在某一时刻，主线程创建一个对等线程</p>
<p>（peer thread），从这个时间点开始，两个线 ｝线程上下文切换</p>
<p>程就并发地运行。最后，因为主线程执行 一个慢速系统调用，例如 read 或者 sleep，或者因为被系统的间隔计时器中 断，控制就会通过上下文切换传递到对等 12-12</p>
<p>并发线程执行</p>
<p>线程。对等线程会执行一段时间，然后控制传递回主线程，依次类推。</p>
<p>在一些重要的方面，线程执行是不同于进程的。因为一个线程的上下文要比一个进程 的上下文小得多，线程的上下文切换要比进程的上下文切换快得多。另一个不同就是线程 不像进程那样，不是按照严格的父子层次来组织的。和一个进程相关的线程组成一个对等 （线程）池，独立于其他线程创建的线程。主线程和其他线程的区别仅在于它总是进程中第 一个运行的线程。对等（线程）池概念的主要影响是，一个线程可以杀死它的任何对等线 程，或者等待它的任意对等线程终止。另外，每个对等线程都能读写相同的共享数据。</p>
<p>12.3.2</p>
<p>Posix 线程</p>
<p>Posix 线程（Pthreads）是在C程序中处理线程的一个标准接口。它最早出现在1995</p>
<h2>第 727 页</h2>
<p>692</p>
<p>第三部分 程序间的交互和通信</p>
<p>年，而且在所有的Linux 系统上都可用。Pthreads 定义了大约60个函数，允许程序创建、 杀死和回收线程，与对等线程安全地共享数据，还可以通知对等线程系统状态的变化。</p>
<p>图12-13展示了一个简单的 Pthreads 程序。主线程创建一个对等线程，然后等待它的 终止。对等线程输出“He110，wor1d！\n”并且终止。当主线程检测到对等线程终止后， 它就通过调用exit 终止该进程。这是我们看到的第一个线程化的程序，所以让我们仔细 地解析它。线程的代码和本地数据被封装在一个线程例程（thread routine）中。正如第二行 里的原型所示，每个线程例程都以一个通用指针作为输入，并返回一个通用指针。如果想 传递多个参数给线程例程，那么你应该将参数放到一个结构中，并传递一个指向该结构的 指针。相似地，如果想要线程例程返回多个参数，你可以返回一个指向一个结构的指针。</p>
<p>• code/conc/hello.c #include &quot;csapp.h&quot; 2</p>
<p>void *thread（void *vargp）；</p>
<p>3</p>
<p>4</p>
<p>5</p>
<p>int</p>
<p>main（）</p>
<p>｛</p>
<p>6</p>
<p>7</p>
<p>8</p>
<p>9</p>
<p>pthread_t tid；</p>
<p>Pthread_create（&amp;tid, NULL, thread, NULL）；</p>
<p>Pthread_join（tid, NULL）；</p>
<p>exit（O）；</p>
<p>10</p>
<p>｝</p>
<p>11</p>
<p>12</p>
<p>void *thread（void *vargp） /* Thread routine */ 13</p>
<p>｛</p>
<p>14</p>
<p>15</p>
<p>printf（&quot;Hello, world！\n&quot;）；</p>
<p>return NULL；</p>
<p>16</p>
<p>｝</p>
<p>code/conc/hello.c</p>
<p>图 12-13 hello.c：使用 Pthreads的“Hello,world！” 程序</p>
<p>第4行标出了主线程代码的开始。主线程声明了一个本地变量tid，可以用来存放对 等线程的ID（第6行）。主线程通过调用 pthread.</p>
<p>Lcreate 函数创建一个新的对等线程（第 7行）。当对 pthread_create 的调用返回时，主线程和新创建的对等线程同时运行，并 且tid包含新线程的ID。通过在第8行调用 pthread_join，主线程等待对等线程终止。</p>
<p>最后，主线程调用 exit（第9行），终止当时运行在这个进程中的所有线程（在这个示例中 就只有主线程）。</p>
<p>第12～16行定义了对等线程的例程。它只打印一个字符串，然后就通过执行第15行 中的 return 语句来终止对等线程。</p>
<h3>12.3.3 创建线程</h3>
<p>线程通过调用 pthread_create 函数来创建其他线程。</p>
<p>#include &lt;pthread.h&gt; typedef void *（func） （void *）；</p>
<p>int pthread_create（pthread_t *tid, pthread_attr_t *attr， func *，void *arg）；</p>
<p>若成功则返回0，若出错则为非零。</p>
<h2>第 728 页</h2>
<h3>第12章 并发编程</h3>
<p>693</p>
<p>pthread_create 函数创建一个新的线程，并带着一个输人变量 arg，在新线程的上 下文中运行线程例程f。能用 attr 参数来改变新创建线程的默认属性。改变这些属性已 超出我们学习的范围，在我们的示例中，总是用一个为 NULL 的 attr 参数来调用</p>
<p>pthread_create 函数。</p>
<p>当 pthread</p>
<p>Lcreate 返回时，参数tid 包含新创建线程的ID。新线程可以通过调用 pthread</p>
<p>Lself函数来获得它自己的线程 ID。</p>
<p>#include &lt;pthread.h&gt; pthread_t pthread_self （void）；</p>
<p>返回调用者的线程 ID。</p>
<h3>12.3.4 终止线程</h3>
<p>一个线程是以下列方式之一来终止的：</p>
<p>• 当顶层的线程例程返回时，线程会隐式地终止。</p>
<p>• 通过调用 pthread_exit 函数，线程会显式地终止。如果主线程调用 pthread_ex- it，它会等待所有其他对等线程终止，然后再终止主线程和整个进程，返回值为 thread</p>
<p>_return。</p>
<p>#include &lt;pthread.h&gt; void</p>
<p>pthread_exit （void *thread_return）；</p>
<p>从不返回。</p>
<p>• 某个对等线程调用 Linux 的exit 函数，该函数终止进程以及所有与该进程相关的 线程。</p>
<p>• 另一个对等线程通过以当前线程 ID 作参数调用 pthread_cance］ 函数来终止当 前线程。</p>
<p>#include &lt;pthread.h&gt; int pthread_cancel （pthread_t tid）；</p>
<p>若成功则返回0，若出错则为非零。</p>
<p>12.3.5</p>
<p>回收已终止线程的资源</p>
<p>线程通过调用 pthread_join 函数等待其他线程终止。</p>
<p>#include &lt;pthread.h&gt; int pthread_join（pthread_t tid, void **thread_return）；</p>
<p>若成功则返回0，若出错则为非零。</p>
<p>pthread_join 函数会阻塞，直到线程tid终止，将线程例程返回的通用（void*）指 针赋值沩thread</p>
<p>Lreturn指向的位置，然后回收已终止线程占用的所有内存资源。</p>
<p>注意，和 Linux 的wait 函数不同，pthread_join 函数只能等待一个指定的线程终 止。没有办法让 pthread</p>
<p>L_wait 等待任意一个线程终止。这使得代码更加复杂，因为它迫</p>
<h2>第 729 页</h2>
<p>694</p>
<p>第三部分 程序间的交互和通信</p>
<p>使我们去使用其他一些不那么直观的机制来检测进程的终止。实际上，Stevens 在［110］中 就很有说服力地论证了这是规范中的一个错误。</p>
<h3>12.3.6 分离线程</h3>
<p>在任何一个时间点上，线程是可结合的（joinable）或者是分离的（detached）。一个可结 合的线程能够被其他线程收回和杀死。在被其他线程回收之前，它的内存资源（例如栈）是 不释放的。相反，一个分离的线程是不能被其他线程回收或杀死的。它的内存资源在它终 止时由系统自动释放。</p>
<p>默认情况下，线程被创建成可结合的。为了避免内存泄漏，每个可结合线程都应该要 么被其他线程显式地收回，要么通过调用 pthread_detach 函数被分离。</p>
<p>#include &lt;pthread.h&gt; int pthread_detach（pthread_t tid）；</p>
<p>若成功则返回0，若出错则为非容。</p>
<p>pthread</p>
<p>L_detach函数分离可结合线程tid。线程能够通过以 pthread L_self（）为参</p>
<p>数的 pthread</p>
<p>detach 调用来分离它们自己。</p>
<p>尽管我们的一些例子会使用可结合线程，但是在现实程序中，有很好的理由要使用分 离的线程。例如，一个高性能 Web 服务器可能在每次收到 Web 浏览器的连接请求时都创 建一个新的对等线程。因为每个连接都是由一个单独的线程独立处理的，所以对于服务器 而言，就很没有必要（实际上也不愿意）显式地等待每个对等线程终止。在这种情况下，每 个对等线程都应该在它开始处理请求之前分离它自身，这样就能在它终止后回收它的内存 资源了。</p>
<h3>12.3.7 初始化线程</h3>
<p>pthread</p>
<p>Lonce 函数允许你初始化与线程例程相关的状态。</p>
<p>#include &lt;pthread.h&gt; pthread_once_t once_control = PTHREAD_ONCE_INIT；</p>
<p>int pthread_once （pthread_once_t *once_control， void （*init_routine） （void））；</p>
<p>总是返回0。</p>
<p>once_contro1 变量是一个全局或者静态变量，总是被初始化为 PTHREAD_ONCE_ INIT。当你第一次用参数 once_control 调用 pthread_once 时，它调用 init_rou- tine，这是一个没有输人参数、也不返回什么的函数。接下来的以 once_contro1为参数 的 pthread_once 调用不做任何事情。无论何时，当你需要动态初始化多个线程共享的全 局变量时，Pthread_once 函数是很有用的。我们将在12.5.5 节里看到一个示例。</p>
<p>12.</p>
<p>3.8</p>
<p>基于线程的并发服务器</p>
<p>图12-14展示了基于线程的并发echo服务器的代码。整体结构类似于基于进程的设 计。主线程不断地等待连接请求，然后创建一个对等线程处理该请求。虽然代码看似简</p>
<h2>第 730 页</h2>
<h3>第12章 并发编程</h3>
<p>695</p>
<p>单，但是有几个普遍而且有些微妙的问题需要我们更仔细地看一看。第一个问题是当我们 调用 pthread_create 时，如何将已连接描述符传递给对等线程。最明显的方法就是传递 一个指向这个描述符的指针，就像下面这样 connfd = Accept （1istenfd，（SA *） &amp;clientaddr，&amp;clientlen）；</p>
<p>Pthread_create（&amp;tid, NULL, thread， &amp;connfd）；</p>
<p>然后，我们让对等线程间接引用这个指针，并将它赋值给一个局部变量，如下所示 void *thread（void *vargp）｛ int connfd = *（（int *）vargp）；</p>
<p>｝</p>
<p>- code/conc/echoservert.c 10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>15</p>
<p>16</p>
<p>17</p>
<p>18&#x27;</p>
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
<p>#include &quot;csapp.h&quot; void echo（int connfd）；</p>
<p>void *thread（void *vargp）；</p>
<p>int main（int argc,char **argv） ｛</p>
<p>int 1istenfd， *connfdp；</p>
<p>socklen_t Clientlen；</p>
<p>struct sockaddr_storage clientaddr；</p>
<p>pthread_t tid；</p>
<p>if （argc ！= 2）｛</p>
<p>exit（O）；</p>
<p>fprintf（stderr，&quot;usage： %s &lt;port&gt;\n&quot;，argv［0］）；</p>
<p>｝</p>
<p>1istenfd = Open_1istenfd（argv［1］）；</p>
<p>while （1）｛</p>
<p>clientlen=sizeof （struct sockaddr_storage）；</p>
<p>connfdp = Malloc （sizeof （int））；</p>
<p>*connfdp = Accept （1istenfd， （SA *） &amp;clientaddr， &amp;clientlen）；</p>
<p>Pthread_create（&amp;tid, NULL, thread, connfdp）；</p>
<p>｝</p>
<p>/* Thread routine */ void *thread （void *vargp）</p>
<p>｛</p>
<p>int connfd = *（（int *）vargp）；</p>
<p>Pthread_detach（pthread_self（））；</p>
<p>Free（vargp）；</p>
<p>echo （connfd） ；</p>
<p>Close （connfd）；</p>
<p>return NULL；</p>
<p>｝</p>
<p>code/conc/echoservert.c 图12-14</p>
<p>基于线程的并发 echo 服务器</p>
<h2>第 731 页</h2>
<p>696</p>
<p>第三部分 程序间的交互和通信</p>
<p>然而，这样可能会出错，因为它在对等线程的赋值语句和主线程的 accept 语句间引人了 竞争（race）。如果赋值语句在下一个 accept 之前完成，那么对等线程中的局部变量 connfd就得到正确的描述符值。然而，如果赋值语句是在 accept 之后才完成的，那么对 等线程中的局部变量 connfd 就得到下一次连接的描述符值。那么不幸的结果就是，现在 两个线程在同一个描述符上执行输入和输出。为了避免这种潜在的致命竞争，我们必须将 accept 返回的每个已连接描述符分配到它自己的动态分配的内存块，如第20～21 行所 示。我们会在12.7.4节中回过来讨论竞争的问题。</p>
<p>另一个问题是在线程例程中避免内存泄漏。既然不显式地收回线程，就必须分离每个 线程，使得在它终止时它的内存资源能够被收回（第31行）。更进一步，我们必须小心释 放主线程分配的内存块（第32行）。</p>
<p>练习题12.5 在图12-5中基于进程的服务器中，我们在两个位置小心地关闭了已连 接描述符：父进程和子进程。然而，在图12-14 中基于线程的服务器中，我们只在一 个位置关闭了已连接描述符：对等线程。为什么？</p>
<h3>12.4 多线程程序中的共享变量</h3>
<p>从程序员的角度来看，线程很有吸引力的一个方面是多个线程很容易共享相同的程序 变量。然而，这种共享也是很棘手的。为了编写正确的多线程程序，我们必须对所谓的共 享以及它是如何工作的有很清楚的了解。</p>
<p>为了理解C程序中的一个变量是否是共享的，有一些基本的问题要解答：1）线程的基 础内存模型是什么？2）根据这个模型，变量实例是如何映射到内存的？3）最后，有多少线 程引用这些实例？一个变量是共享的，当且仅当多个线程引用这个变量的某个实例。</p>
<p>为了让我们对共享的讨论具体化，我们将使用图12-15中的程序作为运行示例。尽管 有些人为的痕迹，但是它仍然值得研究，因为它说明了关于共享的许多细微之处。示例程 序由一个创建了两个对等线程的主线程组成。主线程传递一个唯一的ID给每个对等线程， 每个对等线程利用这个 ID 输出一条个性化的信息，以及调用该线程例程的总次数。</p>
<p>12.4. 1 线程内存模型</p>
<p>一组并发线程运行在一个进程的上下文中。每个线程都有它自己独立的线程上下文， 包括线程 ID、栈、栈指针、程序计数器、条件码和通用目的寄存器值。每个线程和其他 线程一起共享进程上下文的剩余部分。这包括整个用户虚拟地址空间，它是由只读文本 （代码）、读/写数据、堆以及所有的共享库代码和数据区域组成的。线程也享相同的打 开文件的集合。</p>
<p>从实际操作的角度来说，让一个线程去读或写另一个线程的寄存器值是不可能的。另 一方面，任何线程都可以访问共享虚拟内存的任意位置。如果某个线程修改了一个内存位 置，那么其他每个线程最终都能在它读这个位置时发现这个变化。因此，寄存器是从不共 享的，而虚拟内存总是共享的。</p>
<p>各自独立的线程栈的内存模型不是那么整齐清楚的。这些栈被保存在虚拟地址空间的 栈区域中，并且通常是被相应的线程独立地访问的。我们说通常而不是总是，是因为不同 的线程栈是不对其他线程设防的。所以，如果一个线程以某种方式得到一个指向其他线程 栈的指针，那么它就可以读写这个栈的任何部分。示例程序在第26行展示了这一点，其 中对等线程直接通过全局变量 ptr 间接引用主线程的栈的内容。</p>
<h2>第 732 页</h2>
<h3>第12章 并发编程</h3>
<p>697</p>
<p>code/conc/sharing.c 2</p>
<p>3</p>
<p>6</p>
<p>7</p>
<p>8</p>
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
<p>#include &quot;csapp.b&quot; #define N 2</p>
<p>void *thread（void *vargp）；</p>
<p>char **ptr; /* Global variable */ int</p>
<p>main（）</p>
<p>｛</p>
<p>int i；</p>
<p>pthread_t tid；</p>
<p>char *msgs ［N］= ｛</p>
<p>&quot;Hello from foo&quot;，</p>
<p>&quot;Hello from bar&quot;</p>
<p>｝；</p>
<p>ptr = msgs；</p>
<p>for （i=0;i&lt;N;i++）</p>
<p>Pthread_create（&amp;tid, NULL, thread， （void *）i）；</p>
<p>Pthread_exit （NULL）；</p>
<p>｝</p>
<p>｛</p>
<p>void *thread（void *vargp） int myid = （int）vargp；</p>
<p>static int cnt = 0；</p>
<p>printf（&quot;［%d］：%s （cnt=%d）\n&quot;，myid, ptr［myid］，++cnt）；</p>
<p>return NULL；</p>
<p>｝</p>
<p>code/conc/sharing.c 图12-15</p>
<p>说明共享不同方面的示例程序</p>
<h3>12.4.2 将变量映射到内存</h3>
<p>多线程的C程序中变量根据它们的存储类型被映射到虚拟内存：</p>
<p>• 全局变量。全局变量是定义在函数之外的变量。在运行时，虚拟内存的读/写区域 只包含每个全局变量的一个实例，任何线程都可以引用。例如，第5行声明的全局 变量 ptr 在虚拟内存的读/写区域中有一个运行时实例。当一个变量只有一个实例 时，我们只用变量名（在这里就是 ptr）来表示这个实例。</p>
<p>• 本地自动变量。本地自动变量就是定义在函数内部但是没有static 属性的变量。</p>
<p>在运行时，每个线程的栈都包含它自己的所有本地自动变量的实例。即使多个线程 执行同一个线程例程时也是如此。例如，有一个本地变量tid 的实例，它保存在主 线程的栈中。我们用tid.m 来表示这个实例。再来看一个例子，本地变量 myid 有 两个实例，一个在对等线程。的栈内，另一个在对等线程1的栈内。我们将这两个 实例分别表示力 myid.pO 和 myid.p1。</p>
<p>• 本地静态变量。本地静态变量是定义在函数内部并有 static 属性的变量。和全局 变量一样，虚拟内存的读/写区域只包含在程序中声明的每个本地静态变量的一个 实例。例如，即使示例程序中的每个对等线程都在第25行声明了cnt，在运行时， 虚拟内存的读/写区域中也只有一个 cnt 的实例。每个对等线程都读和写这个实例。</p>
<h2>第 733 页</h2>
<p>698</p>
<p>第三部分 程序间的交互和通信</p>
<p>12.4.3</p>
<p>共享变量</p>
<p>我们说一个变量w是共享的，当且仅当它的一个实例被一个以上的线程引用。例如， 示例程序中的变量cnt 就是共享的，因为它只有一个运行时实例，并且这个实例被两个对 等线程引用。在另一方面，myid 不是共享的，因为它的两个实例中每一个都只被一个线 程引用。然而，认识到像 msgs 这样的本地自动变量也能被共享是很重要的。</p>
<p>9练习题 12.6</p>
<p>A. 利用12.4节中的分析，为图12-15 中的示例程序在下表的每个条目中填写“是” 或者“否”。在第一列中，符号v.t表示变量w的一个实例，它驻留在线程t的本 地栈中，其中t要么是m（主线程），要么是 PO（对等线程 O）或者 P1（对等线程 1）。</p>
<p>变量实例</p>
<p>主线程引用的？</p>
<p>对等线程0引用的？</p>
<p>对等线程1引用的？</p>
<p>ptr</p>
<p>cnt</p>
<p>i.m</p>
<p>msgs.m</p>
<p>myid.po</p>
<p>myid.p1</p>
<p>B. 根据 A部分的分析，变量 ptr、cnt、i、msgs 和 myid哪些是共享的？</p>
<h3>12.5 用信号量同步线程</h3>
<p>共享变量是十分方便，但是它们也引入了同步错误（synchronization error）的可能性。考 虑图 12-16 中的程序 badcnt.c，它创建了两个线程，每个线程都对共享计数变量 cnt 加1。</p>
<p>- code/conc/badcnt.c 2</p>
<p>3</p>
<p>4</p>
<p>5</p>
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
<p>/* WARNING: This code is buggy！ */ #include &quot;csapp.h&quot; void *thread（void *vargp）；/* Thread routine prototype */ /* Global shared variable */ volatile long cnt = 0; /* Counter */ int main（int argc, char **argv） ｛</p>
<p>long niters；</p>
<p>pthread_t tid1， tid2；</p>
<p>/* Check input argument */ if （argc ！= 2）｛</p>
<p>printf（&quot;usage： %s &lt;niters&gt;\n&quot;， argv［o］）；</p>
<p>exit （0）；</p>
<p>｝</p>
<p>niters = atoi（argv ［1］）；</p>
<p>/* Create threads and wait for them to finish */ Pthread_create（&amp;tid1, NULL, thread， &amp;niters）；</p>
<p>图 12-16</p>
<p>badcnt. c：一个同步不正确的计数器程序</p>
<h2>第 734 页</h2>
<h3>第12章 并发编程</h3>
<p>699</p>
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
<p>41</p>
<p>42</p>
<p>43</p>
<p>44</p>
<p>Pthread_create （&amp;tid2, NULL, thread， &amp;niters）；</p>
<p>Pthread_join（tid1, NULL）；</p>
<p>Pthread_join（tid2, NULL）；</p>
<p>/* Check result */ if （cnt ！= （2 * niters）） printf（&quot;BOOM! cnt=%1d\n&quot;，cnt）；</p>
<p>else</p>
<p>printf（&quot;OK cnt=%ld\n&quot;， cnt）；</p>
<p>exit（O）；</p>
<p>｝</p>
<p>/* Thread routine */ void *thread（void *vargp） ｛</p>
<p>long i，niters = *（（1ong *）vargp）；</p>
<p>for （i= 0;i &lt; niters; i++） cnt++；</p>
<p>return NULL；</p>
<p>｝</p>
<p>code/conc/badcnt.c 图12-16</p>
<p>（续）</p>
<p>因为每个线程都对计数器增加了 niters 次，我们预计它的最终值是2Xniters。这 看上去简单而直接。然而，当在 Linux 系统上运行 badcnt.c 时，我们不仅得到错误的答 案，而且每次得到的答案都还不相同！</p>
<p>1inux&gt;./badcnt 1000000 BOOM! cnt=1445085</p>
<p>• 1inux&gt;</p>
<p>•/badcnt 1000000</p>
<p>BOOM! cnt=1915220</p>
<p>linux&gt;./badcnt 1000000 BOOM! cnt=1404746</p>
<p>那么哪里出错了呢？为了清晰地理解这个问题，我们需要研究计数器循环（第40~41 行）的汇编代码，如图12-17所示。我们发现，将线程；的循环代码分解成五个部分是很有 帮助的：</p>
<p>• H.：在循环头部的指令块。</p>
<p>• L：：加载共享变量cnt 到累加寄存器%rdx：的指令，这里8rdx；表示线程i中的寄存 器grdx的值。</p>
<p>•U：更新（增加） rdx：的指令。</p>
<p>•Si：将grdx；的更新值存回到共享变量 cnt 的指令。</p>
<p>• T：循环尾部的指令块。</p>
<p>注意头和尾只操作本地栈变量，而L、U；和S：操作共享计数器变量的内容。</p>
<p>当badcnt.c 中的两个对等线程在一个单处理器上并发运行时，机器指令以某种顺序 一个接一个地完成。因此，每个并发执行定义了两个线程中的指令的某种全序（或者交 叉）。不幸的是，这些顺序中的一些将会产生正确结果，但是其他的则不会。</p>
<h2>第 735 页</h2>
<p>700</p>
<p>第三部分 程序间的交互和通信</p>
<p>mOvq</p>
<p>testg</p>
<p>jle</p>
<p>movl</p>
<p>线程的汇编代码</p>
<p>（ordi），orcx</p>
<p>grCX,8rCX</p>
<p>.L2</p>
<p>$O，%eax</p>
<p>及：头</p>
<p>线程iC代码</p>
<p>for（i=0;i &lt; niters：</p>
<p>cnt++；</p>
<p>L3</p>
<p>i++）</p>
<p>mov9</p>
<p>addq</p>
<p>movg</p>
<p>addq</p>
<p>cmpq</p>
<p>jne</p>
<p>cnt （%rip），&amp;rdx</p>
<p>geax</p>
<p>geax, Cnt （8rip）</p>
<p>$1，&amp;rax</p>
<p>orCX，ora×</p>
<p>.L3</p>
<p>L：加载cnt</p>
<p>U.：更新cnt</p>
<p>S：存储cnt</p>
<p>T：尾</p>
<p>L2：</p>
<p>图12-17</p>
<p>badcnt.c 中计数器循环（第40～41 行）的汇编代码 这里有个关键点：一般而言，你没有办法预测操作系统是否将为你的线程选择一个正 确的顺序。例如，图12-18a 展示了一个正确的指令顺序的分步操作。在每个线程更新了 共享变量 cnt 之后，它在内存中的值就是2，这正是期望的值。</p>
<p>另一方面，图12-18b的顺序产生一个不正确的cnt 的值。会发生这样的问题是因为， 线程2在第5步加载 cnt，是在第2步线程1加载 cnt 之后，而在第6步线程1存储它的 更新值之前。因此，每个线程最终都会存储一个值为1的更新后的计数器值。我们能够借 助于一种叫做进度图（progress graph）的方法来阐明这些正确的和不正确的指令顺序的概 念，这个图我们将在下一节中介绍。</p>
<p>步骤</p>
<p>线程</p>
<p>1</p>
<p>指令</p>
<p>%ax1 %rdx</p>
<p>cnt</p>
<p>0</p>
<p>2</p>
<p>1</p>
<p>步骤</p>
<p>1</p>
<p>2</p>
<p>3</p>
<p>线程</p>
<p>指令</p>
<p>%rdxi</p>
<p>%rdxz</p>
<p>cnt</p>
<p>4</p>
<p>2</p>
<p>2</p>
<p>1z</p>
<p>U</p>
<p>Fg</p>
<p>H</p>
<p>L2</p>
<p>0</p>
<p>1</p>
<p>1</p>
<p>L1</p>
<p>0</p>
<p>0</p>
<p>0</p>
<p>0</p>
<p>0</p>
<p>2</p>
<p>1</p>
<p>10</p>
<p>Sz</p>
<p>T</p>
<p>Ti</p>
<p>1</p>
<p>a） 正确的顺序</p>
<p>8</p>
<p>2</p>
<p>10</p>
<p>L2</p>
<p>Si</p>
<p>1</p>
<p>Ti</p>
<p>U</p>
<p>Sz</p>
<p>T2</p>
<p>b）不正确的顺序</p>
<p>0</p>
<p>1</p>
<p>1</p>
<p>1</p>
<p>1</p>
<p>1</p>
<p>图12-18</p>
<p>badcnt.c 中第一次循环迭代的指令顺序 练习题 12.7</p>
<p>根据 badcnt.c 的指令顺序完成下表：</p>
<p>步骤</p>
<p>1</p>
<p>线程</p>
<p>指令</p>
<p>8rdx」</p>
<p>8rax2</p>
<p>cnt</p>
<p>L，</p>
<p>L2</p>
<p>2</p>
<p>2</p>
<p>Sa</p>
<p>U.</p>
<p>S，</p>
<p>10</p>
<p>2</p>
<p>这种顺序会产生一个正确的 cnt 值吗？</p>
<h2>第 736 页</h2>
<p>第12草并发编程</p>
<p>701</p>
<h3>12.5.1 进度图</h3>
<p>进度图（progress graph）将n个并发线程的执行模型化为一条n维笛卡儿空间中的轨 迹线。每条轴k对应于线程k的进度。每个点（I，I2，⋯，I。）代表线程k（k=1，⋯，n.） 已经完成了指令Ix这一状态。图的原点对应于没有任何线程完成一条指令的初始状态。</p>
<p>图12-19展示了 badcnt.c 程序第一次循环迭代的二维进度图。水平轴对应于线程1， 垂直轴对应于线程2。点（L」，S：）对应于线程1完成了L，而线程2完成了S的状态。</p>
<p>进度图将指令执行模型化为从一种状态到另一种状态的转换（transition）。转换被表示 为一条从一点到相邻点的有向边。合法的转换是向右（线程1中的一条指令完成）或者向上 （线程2中的一条指令完成）的。两条指令不能在同一时刻完成—对角线转换是不允许 的。程序决不会反向运行，所以向下或者向左移动的转换也是不合法的。</p>
<p>一个程序的执行历史被模型化为状态空间中的一条轨迹线。图 12-20展示了下面指令 顺序对应的轨迹线：</p>
<p>线程2</p>
<p>H，Li，U，Hz,Le,SI,TI,Ua,Sz,T2 线程2</p>
<p>T，</p>
<p>T</p>
<p>S2</p>
<p>S：</p>
<p>U</p>
<p>U</p>
<p>H</p>
<p>线程1</p>
<p>H</p>
<p>U</p>
<p>一线程1</p>
<p>S.</p>
<p>T.</p>
<p>L</p>
<p>U</p>
<p>S.</p>
<p>T！</p>
<p>图 12-19</p>
<p>badcnt.c 第一次循环迭代的进度图 图 12-20</p>
<p>一个轨迹线示例</p>
<p>对于线程i，操作共享变量cnt 内容的指令（L，Ui，S；）构成了一个（关于共享变量 cnt 的）临界区（critical section），这个临界区不应该和其他进程的临界区交替执行。换句 话说，我们想要确保每个线程在执行它的临界区中的指令时，拥有对共享变量的互斥的访 问（mutually exclusive access）。通常这种现象称为互斥（mutual exclusion）。</p>
<p>在进度图中，两个临界区的交集形成的状态空间区域称为不安全区（unsafe region）。</p>
<p>图12-21展示了变量 cnt 的不安全区。注意，不安全区和与它交界的状态相毗邻，但并不 包括这些状态。例如，状态（H」，H2）和（SI，U2）毗邻不安全区，但是它们并不是不安全 区的一部分。绕开不安全区的轨迹线叫做安全轨迹线（safe trajectory）。相反，接触到任何 不安全区的轨迹线就叫做不安全轨迹线（unsafe trajectory）。图 12-21给出了示例程序 badcnt.c 的状态空间中的安全和不安全轨迹线。上面的轨迹线绕开了不安全区域的左边 和上边，所以是安全的。下面的轨迹线穿越不安全区，因此是不安全的。</p>
<p>任何安全轨迹线都将正确地更新共享计数器。为了保证线程化程序示例的正确执行（实 际上任何共享全局数据结构的并发程序的正确执行）我们必须以某种方式同步线程，使它们 总是有一条安全轨迹线。一个经典的方法是基于信号量的思想，接下来我们就介绍它。</p>
<p>练习题12.8 使用图12-21 中的进度图，将下列轨迹线划分为安全的或者不安全的。</p>
<p>A. H」，LI,U.，SI,Hz,L2,Uz,Sz, T2,T，</p>
<h2>第 737 页</h2>
<p>702</p>
<p>第三部分 程序间的交互和通信</p>
<p>B. Hz,L2,H,Li,U,Si,TI,U2,S2,T2 C. H,H,L,U2,Sa,Li,Ui,Si,Ti,T2 线程2</p>
<p>写cnt 的</p>
<p>临界区</p>
<p>•</p>
<p>安全轨迹线</p>
<p>不安全区</p>
<p>••</p>
<p>•</p>
<p>•不安全轨迹线</p>
<p>Lz</p>
<p>•线程1</p>
<p>图 12-21</p>
<p>S.</p>
<p>写 cnt 的临界区</p>
<p>安全和不安全轨迹线。临界区的交集形成了不安全区。</p>
<p>绕开不安全区的轨迹线能够正确更新计数器变量</p>
<h3>12.5.2 信号量</h3>
<p>Edsger Dijkstra，并发编程领域的先锋人物，提出了一种经典的解决同步不同执行线 程问题的方法，这种方法是基于一种叫做信号量（semaphore）的特殊类型变量的。信号量s 是具有非负整数值的全局变量，只能由两种特殊的操作来处理，这两种操作称P和V：</p>
<p>• P（s）：如果；是非零的，那么P将s减1，并且立即返回。如果；为零，那么就挂 起这个线程，直到；变为非零，而一个V操作会重启这个线程。在重启之后，P操 作将s减1，并将控制返回给调用者。</p>
<p>• V（s）：V操作将s加1。如果有任何线程阻塞在 P 操作等待s变成非零，那么V操 作会重启这些线程中的一个，然后该线程将s减1，完成它的P操作。</p>
<p>P中的测试和减1操作是不可分割的，也就是说，一旦预测信号量s变非零，就会 将s减1，不能有中断。V中的加1操作也是不可分割的，也就是加载、加1和存储信号 量的过程中没有中断。注意，V的定义中没有定义等待线程被重启动的顺序。唯一的要求 是V必须只能重启一个正在等待的线程。因此，当有多个线程在等待同一个信号量时，你 不能预测V操作要重启哪一个线程。</p>
<p>P和V的定义确保了一个正在运行的程序绝不可能进入这样一种状态，也就是一个正 确初始化了的信号量有一个负值。这个属性称为信号量不变性（semaphore invariant），力 控制并发程序的轨迹线提供了强有力的工具，在下一节中我们将看到。</p>
<p>Posix 标准定义了许多操作信号量的函数。</p>
<p>#include &lt;semaphore.h&gt; int</p>
<p>sem_init （sem_t *sem,0, unsigned int value）；</p>
<p>int sem_wait （sem_t *s）；</p>
<p>/*P（s）*/</p>
<p>int sem_post （sem_t *s）；</p>
<p>/* V（s）*/</p>
<p>返回：若成功则为0，若出错则为一1。</p>
<h2>第 738 页</h2>
<h3>第12章 并发编程</h3>
<p>703</p>
<p>_init 函数将信号量 sem 初始化value。每个信号量在使用前必须初始化。针 对我们的目的，中间的参数总是零。程序分别通过调用 sem_wait 和 sem_post 函数来执 行P和V操作。为了简明，我们更喜欢使用下面这些等价的P和V的包装函数：</p>
<p>#include &quot;csapp.h&quot; void P（sem_t *s）；</p>
<p>void V（sem_t *s）；</p>
<p>/* Wrapper function for sem_wait */ /* Wrapper function for sem_post */</p>
<p>返回：无。</p>
<p>旁注</p>
<p>P和V名字的起源</p>
<p>Edsger Dijkstra（1930—2002）出生于荷兰。名字P和V来源于荷兰语单词 Proberen （测试）和Verhogen（增加）。</p>
<h3>12.5.3 使用信号量来实现互斥</h3>
<p>信号量提供了一种很方便的方法来确保对共享变量的互斥访问。基本思想是将每个共 享变量（或者一组相关的共享变量）与一个信号量s（初始为1）联系起来，然后用 P（s）和V （s）操作将相应的临界区包围起来。</p>
<p>以这种方式来保护共享变量的信号量叫做二元信号量（binary semaphore），因为它的 值总是0或者1。以提供互斥为目的的二元信号量常常也称为互斥锁（mutex）。在一个互 斥锁上执行 P操作称为对互斥锁加锁。类似地，执行V 操作称为对互斥锁解锁。对一个 互斥锁加了锁但是还没有解锁的线程称为占用这个互斥锁。一个被用作一组可用资源的计 数器的信号量被称为计数信号量。</p>
<p>图12-22中的进度图展示了我们如何利用二元信号量来正确地同步计数器程序示例。</p>
<p>每个状态都标出了该状态中信号量s的值。关键思想是这种 P和V操作的结合创建了一组 线程2</p>
<p>。</p>
<p>.。</p>
<p>.&#x27;</p>
<p>.。</p>
<p>Y（s）</p>
<p>.。</p>
<p>禁止区</p>
<p>。。</p>
<p>•。</p>
<p>不安全区</p>
<p>初始</p>
<p>S=1</p>
<p>Lz</p>
<p>P（s）</p>
<p>H</p>
<p>线程1</p>
<p>图12-22</p>
<p>P（s）</p>
<p>Li</p>
<p>U</p>
<p>Si</p>
<p>V（s）</p>
<p>T.</p>
<p>使用信号量来互斥。s&lt;0的不可行状态定义了一个禁止区，禁止区 完全包括了不安全区，阻止了实际可行的轨迹线接触到不安全区</p>
<h2>第 739 页</h2>
<p>704</p>
<p>第三部分 程序间的交互和通信</p>
<p>状态，叫做禁止区（forbidden region），其中＜0。因为信号量的不变性，没有实际可行的 轨迹线能够包含禁止区中的状态。而且，因为禁止区完全包括了不安全区，所以没有实际 可行的轨迹线能够接触不安全区的任何部分。因此，每条实际可行的轨迹线都是安全的， 而且不管运行时指令顺序是怎样的，程序都会正确地增加计数器值。</p>
<p>从可操作的意义上来说，由P和V操作创建的禁止区使得在任何时间点上，在被包 围的临界区中，不可能有多个线程在执行指令。换句话说，信号量操作确保了对临界区的 互斥访问。</p>
<p>总的来说，为了用信号量正确同步图12-16中的计数器程序示例，我们首先声明一个 信号量 mutex：</p>
<p>volatile long cnt = 0;/* Counter */ sem_t mutex；</p>
<p>/* Semaphore that protects counter */ 然后在主例程中将 mutex 初始化为 1：</p>
<p>Sem_init （&amp;mutex, 0,1）； /* mutex = 1*/ 最后，我们通过把在线程例程中对共享变量cnt 的更新包围P和V操作，从而保护 它们：</p>
<p>for （i = 0;i &lt; niters; i++）｛ P（&amp;mutex）；</p>
<p>cnt++；</p>
<p>V（&amp;mutex）；</p>
<p>｝</p>
<p>当我们运行这个正确同步的程序时，现在它每次都能产生正确的结果了。</p>
<p>1inux&gt;•/goodcnt 1000000 OK cnt=2000000</p>
<p>linux&gt;</p>
<p>•/goodcnt 1000000</p>
<p>OK</p>
<p>cnt=2000000</p>
<p>旁注</p>
<p>进度图的局限性</p>
<p>进度图给了我们一种较好的方法，将在单处理器上的并发程序执行可视化，也帮助 我们理解为什么需要同步。然而，它们确实也有局限性，特别是对于在多处理器上的并 发执行，在多处理器上一组CPU/高速缓存对共享同一个主存。多处理器的工作方式是 进度图不能解释的。特别是，一个多处理器内存系统可以处于一种状态，不对应于进度 图中任何轨迹线。不管如何，结论总是一样的：无论是在单处理器还是多处理器上运行 程序，都要同步你对共享变量的访问。</p>
<h3>12.5.4 利用信号量来调度共享资源</h3>
<p>除了提供互斥之外，信号量的另一个重要作用是调度对共享资源的访问。在这种场景 中，一个线程用信号量操作来通知另一个线程，程序状态中的某个条件已经为真了。两个 经典而有用的例子是生产者-消费者和读者-写者问题。</p>
<p>1. 生产者-消费者问题</p>
<p>图12-23给出了生产者-消费者问题。生产者和消费者线程共享一个有n 个槽的有限缓冲 区。生产者线程反复地生成新的项目（item），并把它们插人到缓冲区中。消费者线程不断地</p>
<h2>第 740 页</h2>
<h3>第12章 并发编程</h3>
<p>705</p>
<p>从缓冲区中取出这些项目，然后消费（使用）它们。也可能有多个生产者和消费者的变种。</p>
<p>生产者线程</p>
<p>有限的缓冲区</p>
<p>消费者线程</p>
<p>图12-23</p>
<p>生产者-消费者问题。生产者产生项目并把它们插人到一个有限的缓冲区中。</p>
<p>消费者从缓冲区中取出这些项目，然后消费它们 因为插人和取出项目都涉及更新共享变量，所以我们必须保证对缓冲区的访问是互斥 的。但是只保证互斥访问是不够的，我们还需要调度对缓冲区的访问。如果缓冲区是满的 （没有空的槽位），那么生产者必须等待直到有一个槽位变为可用。与之相似，如果缓冲区 是空的（没有可取用的项目），那么消费者必须等待直到有一个项目变为可用。</p>
<p>生产者-消费者的相互作用在现实系统中是很普遍的。例如，在一个多媒体系统中， 生产者编码视频帧，而消费者解码并在屏幕上呈现出来。缓冲区的目的是为了减少视频流 的抖动，而这种抖动是由各个帧的编码和解码时与数据相关的差异引起的。缓冲区为生产 者提供了一个槽位池，而为消费者提供一个已编码的帧池。另一个常见的示例是图形用户 接口设计。生产者检测到鼠标和键盘事件，并将它们插人到缓冲区中。消费者以某种基于 优先级的方式从缓冲区取出这些事件，并显示在屏幕上。</p>
<p>在本节中，我们将开发一个简单的包，叫做SBUF，用来构造生产者-消费者程序。</p>
<p>在下一节里，我们会看到如何用它来构造一个基于预线程化（prethreading）的有趣的并发 服务器。SBUF操作类型为 sbuf_t 的有限缓冲区（图12-24）。项目存放在一个动态分配的 n项整数数组（buf）中。front 和 rear 索引值记录该数组中的第一项和最后一项。三个信 号量同步对缓冲区的访问。mutex 信号量提供互斥的缓冲区访问。slots 和 items 信号量 分别记录空槽位和可用项目的数量。</p>
<p>code/conc/sbufh</p>
<p>1</p>
<p>2</p>
<p>3</p>
<p>4</p>
<p>5</p>
<p>6</p>
<p>7</p>
<p>8</p>
<p>9</p>
<p>typedef struct ｛</p>
<p>int *buf；</p>
<p>int n；</p>
<p>int front；</p>
<p>int rear；</p>
<p>sem_t mutex；</p>
<p>sem_t slots；</p>
<p>sem_t items；</p>
<p>｝ sbuf_t；</p>
<p>/* Buffer array */ /* Maximum number of slots */ /* buf ［（front+1）%n］ is first item */ /* buf ［rear%n］ is last item */ /* Protects</p>
<p>accesses to buf */ /* Counts available slots */ /* Counts available items */ codelconc/sbufh</p>
<p>图12-24</p>
<p>sbuf_t: SBUF 包使用的有限缓冲区 图 12-25 给出了 SBUF 函数的实现。sbuf_init 函数为缓冲区分配堆内存，设置 front 和 rear 表示一个空的缓冲区，并为三个信号量赋初始值。这个函数在调用其他三 个函数中的任何一个之前调用一次。sbuf_deinit 函数是当应用程序使用完缓冲区时，释 放缓冲区存储的。sbuf_insert 函数等待一个可用的槽位，对互斥锁加锁，添加项目，对 互斥锁解锁，然后宣布有一个新项目可用。sbuf_remove 函数是与 sbuf_insert 函数对 称的。在等待一个可用的缓冲区项目之后，对互斥锁加锁，从缓冲区的前面取出该项目， 对互斥锁解锁，然后发信号通知一个新的槽位可供使用。</p>
<h2>第 741 页</h2>
<p>706</p>
<p>第三部分 程序间的交互和通信</p>
<p>code/conc/sbuf.c</p>
<p>#include &quot;csapp.h&quot; #include &quot;sbuf.h&quot;</p>
<p>/* Create an empty, bounded,shared FIFO buffer with n slots */ void</p>
<p>sbuf_init （sbuf_t *sp, int n） ｛</p>
<p>sP-&gt;buf = Calloc（n, sizeof （int））；</p>
<p>sp-&gt;n = n；</p>
<p>sp-&gt;front = sp-&gt;rear = 0；</p>
<p>Sem_init（&amp;sp-&gt;mutex, O, 1）；</p>
<p>Sem_init （&amp;sp-&gt;slots, 0, n）；</p>
<p>Sem_init （&amp;sp-&gt;items,0,O）；</p>
<p>/* Buffer holds max of n items */ /* Empty buffer iff front == rear */ /* Binary semaphore for locking */ /* Initially, buf has n empty slots */ /* Initially, buf has zero data items */ 10</p>
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
<p>41</p>
<p>｝</p>
<p>/* Clean up buffer sp */ void sbut_deinit（sbut_t *sp） Free（sp-&gt;buf）；</p>
<p>｝</p>
<p>/* Insert item onto the rear of shared buffer sp */ void sbuf_insert （sbuf_t *sp, int item） ｛</p>
<p>P（&amp;sp-&gt;slots）；</p>
<p>P（&amp;sp-&gt;mutex）；</p>
<p>sp-&gt;buf ［（++sp-&gt;rear）%（sp-&gt;n）］= item；</p>
<p>V（&amp;sp-&gt;mutex）；</p>
<p>V（&amp;sp-&gt;items）；</p>
<p>/* Wait for available slot */ /* Lock the buffer */ /* Insert the item */ /* Unlock the buffer */ /* Announce available item */ ｝</p>
<p>/* Remove and return the first item from buffer sp */ int sbuf_remove （sbuf_t *sp） ｛</p>
<p>int item；</p>
<p>P（&amp;sp-&gt;items）；</p>
<p>/* Wait for available item */ P（&amp;sp-&gt;mutex）；</p>
<p>/* Lock the buffer */ item = sp-&gt;buf ［（++sp-&gt;front）% （sp-&gt;n）］； /* Remove the item */ V（&amp;sp-&gt;mutex）；</p>
<p>/* Unlock the buffer */ V（&amp;sp-&gt;slots）；</p>
<p>/* Announce available slot */ return item；</p>
<p>｝</p>
<p>code/concsbufic</p>
<p>图 12-25</p>
<p>SBUF：同步对有限缓冲区并发访问的包 练习题 12.9</p>
<p>设p表示生产者数量，C表示消费者数量，而n表示以项目单元为单位 的缓冲区大小。对于下面的每个场景，指出 sbuf _insert和sbuf_remove中的互斥 锁信号量是否是必需的。</p>
<p>A. p=1,c=1,n&gt;1</p>
<p>B. p=1,c=1,n=1</p>
<p>C.p&gt;1,c&gt;1,n=1</p>
<p>2. 读者-写者问题</p>
<p>读者-写者问题是互斥问题的一个概括。一组并发的线程要访问一个共享对象，例如</p>
<h2>第 742 页</h2>
<h3>第12章 并发编程</h3>
<p>707</p>
<p>一个主存中的数据结构，或者一个磁盘上的数据库。有些线程只读对象，而其他的线程只 修改对象。修改对象的线程叫做写者。只读对象的线程叫做读者。写者必须拥有对对象的 独占的访问，而读者可以和无限多个其他的读者共享对象。一般来说，有无限多个并发的 读者和写者。</p>
<p>读者-写者交互在现实系统中很常见。例如，一个在线航空预定系统中，允许有 无限多个客户同时查看座位分配，但是正在预订座位的客户必须拥有对数据库的独占 的访问。再来看另一个例子，在一个多线程缓存Web 代理中，无限多个线程可以从 共享页面缓存中取出已有的页面，但是任何向缓存中写人一个新页面的线程必须拥有 独占的访问。</p>
<p>读者-写者问题有几个变种，分别基于读者和写者的优先级。第一类读者-写者问题，读 者优先，要求不要让读者等待，除非已经 把使用对象的权限赋予了一个写者。换句 话说，读者不会因为有一个写者在等待而 /* Global variables */ int readcnt; /* Initially = 0 */ sem_t mutex,w; /* Both initially = 1 */ 等待。第二类读者-写者问题，写者优先， 要求一旦一个写者准备好可以写，它就会 void reader （void） 尽可能快地完成它的写操作。同第一类问 ｛</p>
<p>题不同，在一个写者后到达的读者必须等 待，即使这个写者也是在等待。</p>
<p>图12-26 给出了一个对第一类读者- 写者问题的解答。同许多同步问题的解</p>
<p>答一样，这个解答很微妙，极具欺骗性</p>
<p>while （1）｛</p>
<p>P（&amp;mutex）；</p>
<p>readcnt++；</p>
<p>if （readcnt == 1） /* First in */ P（&amp;w）；</p>
<p>V（&amp;mutex）；</p>
<p>地简单。信号量w 控制对访问共享对象 的临界区的访问。信号量 mutex 保护对 /* Critical section */ /* Reading happens */</p>
<p>共享变量 readcnt 的访问，readcnt 统 计当前在临界区中的读者数量。每当一</p>
<p>个写者进入临界区时，它对互斥锁w加</p>
<p>锁，每当它离开临界区时，对w解锁。</p>
<p>这就保证了任意时刻临界区中最多只有</p>
<p>P（&amp;mutex）；</p>
<p>readcnt--；</p>
<p>if （readcnt == 0） /* Last out */ V（&amp;w）；</p>
<p>V（&amp;mutex）；</p>
<p>｝</p>
<p>一个写者。另一方面，只有第一个进人</p>
<p>临界区的读者对w加锁，而只有最后一</p>
<p>void writer（void）</p>
<p>个离开临界区的读者对w解锁。当一个</p>
<p>｛</p>
<p>读者进入和离开临界区时，如果还有其</p>
<p>他读者在临界区中，那么这个读者会忍</p>
<p>while （1） ｛</p>
<p>P（&amp;w）；</p>
<p>略互斥锁w。这就意味着只要还有一个读 者占用互斥锁 w，无限多数量的读者可以 /* Critical section */ /* Writing happens */</p>
<p>没有障碍地进入临界区。</p>
<p>对这两种读者-写者问题的正确解答</p>
<p>V（&amp;w）；</p>
<p>｝</p>
<p>可能导致饥饿（starvation），饥饿就是一 个线程无限期地阻塞，无法进展。例如， 图12-26所示的解答中，如果有读者不断 图12-26</p>
<p>地到达，写者就可能无限期地等待。</p>
<p>对第一类读者-写者问题的解答。</p>
<p>读者优先级高于写者</p>
<h2>第 743 页</h2>
<p>708</p>
<p>第三部分 程序间的交互和通信</p>
<p>练习题 12.10</p>
<p>图12-26所示的对第一类读者-写者问题的解答给予读者较高的优先 级，但是从某种意义上说，这种优先级是很弱的，因为一个离开临界区的写者可能重 启一个在等待的写者，而不是一个在等待的读者。描述出一个场景，其中这种弱优先 级会导致一群写者使得一个读者饥饿。</p>
<p>旁注</p>
<p>其他同步机制</p>
<p>我们已经向你展示了如何利用信号量来同步线程，主要是因为它们简单、经典，并且 有一个清晰的语义模型。但是你应该知道还是存在着其他同步技术的。例如，Java 线程是 用一种叫做Java 监控器（Java Monitor）［48］的机制来同步的，它提供了对信号量互斥和调 度能力的更高级别的抽象；实际上，监控器可以用信号量来实现。再来看一个例子， Pthreads 接口定义了一组对互斥锁和条件变量的同步操作。Pthreads 互斥锁被用来实现互 斥。条件变量用来调度对共享资源的访问，例如在一个生产者-消费者程序中的有限缓冲区。</p>
<h3>12.5.5 综合：基于预线程化的并发服务器</h3>
<p>我们已经知道了如何使用信号量来访问共享变量和调度对共享资源的访问。为了帮助 你更清晰地理解这些思想，让我们把它们应用到一个基于称为预线程化（prethreading）技 术的并发服务器上。</p>
<p>在图12-14所示的并发服务器中，我们为每一个新客户端创建了一个新线程。这种方 法的缺点是我们为每一个新客户端创建一个新线程，导致不小的代价。一个基于预线程化 的服务器试图通过使用如图12-27所示的生产者-消费者模型来降低这种开销。服务器是 由一个主线程和一组工作者线程构成的。主线程不断地接受来自客户端的连接请求，并将 得到的连接描述符放在一个有限缓冲区中。每一个工作者线程反复地从共享缓冲区中取出 描述符，为客户端服务，然后等待下一个描述符。</p>
<p>服务客户端</p>
<p>工作者线程池</p>
<p>客户端</p>
<p>工作者线程</p>
<p>插入描述符</p>
<p>接受连接</p>
<p>主线程</p>
<p>缓冲区</p>
<p>客户端</p>
<p>工作者线程</p>
<p>服务客户端</p>
<p>图 12-27</p>
<p>预线程化的并发服务器的组织结构。一组现有的线程不断地取出 和处理来自有限缓冲区的已连接描述符</p>
<p>图12-28显示了我们怎样用 SBUF 包来实现一个预线程化的并发 echo服务器。在初始 化了缓冲区 sbuf（第24行）后，主线程创建了一组工作者线程（第25～26行）。然后它进 人了无限的服务器循环，接受连接请求，并将得到的已连接描述符插入到缓冲区 sbuf中。</p>
<p>每个工作者线程的行为都非常简单。它等待直到它能从缓冲区中取出一个已连接描述符 （第39行），然后调用 echo_cnt 函数回送客户端的输人。</p>
<p>图12-29 所示的函数 echo</p>
<p>_cnt 是图11-22中的echo 函数的一个版本，它在全局变量 byte_cnt 中记录了从所有客户端接收到的累计字节数。这是一段值得研究的有趣代码， 因为它向你展示了一个从线程例程调用的初始化程序包的一般技术。在这种情况中，我们</p>
<h2>第 744 页</h2>
<h3>第12章 并发编程</h3>
<p>709</p>
<p>需要初始化 byte_cnt 计数器和 mutex 信号量。一个方法是我们为 SBUF 和 RIO 程序包 使用过的，它要求主线程显式地调用一个初始化函数。另外一个方法，在此显示的，是当 第一次有某个线程调用echo_ont 函数时，使用 pthread.</p>
<p>Lonce 函数（第19行）去调用初始化 函数。这个方法的优点是它使程序包的使用更加容易。这种方法的缺点是每一次调用 echo_ cnt 都会导致调用 pthread_once 函数，而在大多数时候它没有做什么有用的事。</p>
<p>code/conc/echoservert-pre.c 5</p>
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
<p>26‘</p>
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
<p>41</p>
<p>42</p>
<p>43</p>
<p>#include &quot;csapp.h&quot; #include &quot;sbuf.h&quot;</p>
<p>#define NTHREADS</p>
<p>#define SBUFSIZE</p>
<p>4</p>
<p>16</p>
<p>void echo_cnt （int connfd）；</p>
<p>void *thread （void *vargp）；</p>
<p>sbuf_t sbuf;/* Shared buffer of connected descriptors */ int main（int argc, char **argv） ｛</p>
<p>int i, listenfd, connfd；</p>
<p>socklen_t clientlen；</p>
<p>struct sockaddr_storage clientaddr；</p>
<p>pthread_t tid；</p>
<p>if （argc ！= 2）｛</p>
<p>exit（O）；</p>
<p>fprintf（stderr，&quot;usage： %s &lt;port&gt;\n&quot;，argv［0］）；</p>
<p>｝</p>
<p>1istenfd = Open_1istenfd（argv ［1］）；</p>
<p>sbuf_init （&amp;sbuf,SBUFSIZE）；</p>
<p>for （i= 0；i &lt; NTHREADS； i++） /* Create worker threads */ Pthread_create（&amp;tid, NULL, thread, NULL）；</p>
<p>while （1）｛</p>
<p>clientlen = sizeof （struct sockaddr_storage）；</p>
<p>connfd = Accept （Iistenfd， （SA *） &amp;clientaddr， &amp;clientlen）；</p>
<p>sbuf_insert （&amp;sbuf, connfd）；/* Insert connfd in buffer */ ｝</p>
<p>｛</p>
<p>void *thread（void *vargp） Pthread_detach（pthread_self（））；</p>
<p>while （1）｛</p>
<p>int connfd = sbuf_remove （&amp;sbuf）；/* Remove connfd from buffer */ echo_cnt （connfd）；</p>
<p>/* Service client */ Close （connfd）；</p>
<p>｝</p>
<p>code/concechoservert-pre.c 图12-28</p>
<p>一个预线程化的并发echo服务器。这个服务器使用的是 有一个生产者和多个消费者的生产者-消费者模型</p>
<h2>第 745 页</h2>
<p>710</p>
<p>第三部分 程序间的交互和通信</p>
<p>code/conc/echo-cnt.c 1</p>
<p>2</p>
<p>3</p>
<p>5</p>
<p>6</p>
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
<p>#include &quot;csapp.h&quot; static int byte_cnt；</p>
<p>/* Byte counter */ static sem_t mutex；</p>
<p>/* and the mutex that protects it*/</p>
<p>static void init_echo_cnt （void） ｛</p>
<p>Sem_init （&amp;mutex, 0, 1）；</p>
<p>byte_cnt = 0；</p>
<p>｝</p>
<p>｛</p>
<p>void echo_cnt （int connfd） int n；</p>
<p>char buf ［MAXLINE］；</p>
<p>rio_t rio；</p>
<p>static pthread_once_t once = PTHREAD_ONCE_INIT；</p>
<p>Pthread_once （&amp;once,init_echo_cnt）；</p>
<p>Rio_readinitb（&amp;rio, connfd）；</p>
<p>while（（n = Rio_readlineb（&amp;rio, buf,MAXLINE））！= 0） ｛ P（&amp;mutex）；</p>
<p>byte_cnt += n；</p>
<p>printf（&quot;server received %d （%d total） bytes on Ed %aln&quot;， n,byte_cnt, connfd）；</p>
<p>V（&amp;mutex）；</p>
<p>Rio_writen（connfd, buf, n）；</p>
<p>code/conc/echo-cnt.c 图12-29</p>
<p>echo_cnt:echo 的一个版本，它对从客户端接收的所有字节计数 一旦程序包被初始化，echo_cnt 函数会初始化 RIO 带缓冲区的1/0包（第20行）， 然后回送从客户端接收到的每一个文本行。注意，在第23~25 行中对共享变量 byte cnt</p>
<p>的访问是被P和V 操作保护的。</p>
<p>旁注 基于线程的事件驱动程序</p>
<p>1/0多路复用不是编写事件驱动程序的唯一方法。例如，你可能已经注意到我们刚 才开发的并发的预线程化的服务器实际上是一个事件驱动服务器，带有主线程和工作者 线程的简单状态机。主线程有两种状态（“等待连接请求”和“等待可用的缓冲区槽 位”）、两个1/0事件（“连接请求到达”和“缓冲区槽位变为可用”）和两个转换（“接受连 接请求”和“插入缓冲区项目”）。类似地，每个工作者线程有一个状态（“等待可用的缓 冲项目”）、一个1/0事件（“缓冲区项目变为可用”）和一个转换（“取出缓冲区项目”）。</p>
<h3>12.6 使用线程提高并行性</h3>
<p>到目前为止，在对并发的研究中，我们都假设并发线程是在单处理器系统上执行的。</p>
<h2>第 746 页</h2>
<h3>第12章并发编程</h3>
<p>711</p>
<p>然而，大多数现代机器具有多核处理器。并发程序通常在这样的机器上运行得更快，因为 操作系统内核在多个核上并行地调度这些并发线程，而不是在单个核上顺序地调度。在像 繁忙的 Web 服务器、数据库服务器和大型科学计算代码这样的应用中利用这样的并行性 是至关重要的，而且在像 Web 浏览器、电子表格处理程序和文档处理程序这样的主流应 用中，并行性也变得越来越有用。</p>
<p>所有的程序</p>
<p>图12-30给出了顺序、并发和并行程序之间的 并发程序</p>
<p>集合关系。所有程序的集合能够被划分成不相交 的顺序程序集合和并发程序的集合。写顺序程序 顺序程序</p>
<p>并行程序</p>
<p>只有一条逻辑流。写并发程序有多条并发流。并 行程序是一个运行在多个处理器上的并发程序。</p>
<p>因此，并行程序的集合是并发程序集合的真子集。</p>
<p>图12-30</p>
<p>顺序、并发和并行程序</p>
<p>并行程序的详细处理超出了本书讲述的范围， 集合之间的关系</p>
<p>但是研究一个非常简单的示例程序能够帮助你理解并行编程的一些重要的方面。例如，考 虑我们如何并行地对一列整数0，⋯， 一1求和。当然，对于这个特的问题，有闭合形 式表达式的解答（译者注：即有现成的公式来计算它，即和等于n（n-1）/2），但是尽管如 此，它是一个简洁和易于理解的示例，能让我们对并行程序做一些有趣的说明。</p>
<p>将任务分配到不同线程的最直接方法是将序列划分成t个不相交的区域，然后给t个 不同的线程每个分配一个区域。为了简单，假设n是的倍数，这样每个区域有n./1个元 素。让我们来看看多个线程并行处理分配给它们的区域的不同方法。</p>
<p>最简单也最直接的选择是将线程的和放人一个共享全局变量中，用互斥锁保护这个变 量。图 12-31给出了我们会如何实现这种方法。在第28～33行，主线程创建对等线程，然后 等待它们结束。注意，主线程传递给每个对等线程一个小整数，作为唯一的线程ID。每个对 等线程会用它的线程ID 来决定它应该计算序列的哪一部分。这个向对等线程传递一个小的 唯一的线程ID 的思想是一项通用技术，许多并行应用中都用到了它。在对等线程终止后， 全局变量 gsum 包含着最终的和。然后主线程用闭合形式解答来验证结果（第36～37行）。</p>
<p>• code/conc/psum-mutex.c #include &quot;csapp.h&quot; #define MAXTHREADS 32 void *sum_mutex （void *vargp）；/* Thread routine */ 6</p>
<p>/* Global shared variables */ long gsum = 0；</p>
<p>/* Global sum */</p>
<p>100g</p>
<p>nelems_per_thread；</p>
<p>/* Number of elements to sum */ 9</p>
<p>sem_t mutex；</p>
<p>/* Mutex to protect global sum */ 10</p>
<p>11</p>
<p>int main（int argc, char **argv） 12</p>
<p>｛</p>
<p>13</p>
<p>14</p>
<p>1ong i,nelems,10g-nelems， nthreads，myid［MAXTHREADS］；</p>
<p>pthread_t tid［MAXTHREADS］；</p>
<p>15</p>
<p>16</p>
<p>/* Get input arguments */ 图12-31</p>
<p>psum-mutex 的主程序，使用多个线程将一个序列元素的和放入 一个用互斥锁保护的共享全局变量中</p>
<h2>第 747 页</h2>
<p>712</p>
<p>第三部分 程序间的交互和通信</p>
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
<p>if （argc！= 3）｛</p>
<p>exit（O）；</p>
<p>printf（&quot;Usage： %s &lt;nthreads&gt;&lt;1og_nelems&gt;\n&quot;，argv ［0］）；</p>
<p>｝</p>
<p>nthreads = atoi （argv ［1］）；</p>
<p>10g_nelems = atoi （argv ［2J）；</p>
<p>nelems = （1L &lt;&lt; 1og_nelems）；</p>
<p>nelems_per_thread = nelems / nthreads；</p>
<p>sem_init （&amp;mutex, O, 1）；</p>
<p>/* Create peer threads and wait for them to finish */ for （i = 0;i &lt; nthreads; i++）｛ myidli］ = i；</p>
<p>Pthread_create（&amp;tidli］，NULL, sum_mutex，&amp;myid［i］）；</p>
<p>｝</p>
<p>for （i= 0；i &lt; nthreads; i++） Pthread_join（tidLi］，NULL）；</p>
<p>/* Check final answer */ if （gsum</p>
<p>！= （nelems * （nelems-1））/2） printf（&quot;Error: result=%ld\n&quot;，gsum）；</p>
<p>exit（O）；</p>
<p>｝</p>
<p>code/conc/psum-mutex.C 图12-31（续）</p>
<p>图12-32给出了每个对等线程执行的函数。在第4行中，线程从线程参数中提取出线 程ID，然后用这个 ID 来决定它要计算的序列区域（第5～6行）。在第9～13行中，线程在 它的那部分序列上迭代操作，每次迭代都更新共享全局变量 gsum。</p>
<p>注意，我们很小心地</p>
<p>用P和V互斥操作来保护每次更新。</p>
<p>code/conc/psum-mutex.C 1</p>
<p>2</p>
<p>9</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>15</p>
<p>/* Thread routine for psum-mutex.c */ void *sum_mutex（void *vargp） ｛</p>
<p>long myid = *（（long *）vargp）；</p>
<p>/* Extract the thread ID */ long start = myid * nelems_per_thread; /* Start element index */ long end = start + nelems_per_thread; /* End element index */ 1ong i；</p>
<p>for （i = start;i &lt;end; i++）｛ P（&amp;mutex）；</p>
<p>gsum += i；</p>
<p>V（&amp;mutex）；</p>
<p>｝</p>
<p>return NULL；</p>
<p>code/conc/psum-mutex.c 图12-32</p>
<p>psum-mutex 的线程例程。每个对等线程将各自的和累加进 一个用互斥锁保护的共享全局变量中</p>
<h2>第 748 页</h2>
<h3>第12章 并发编程</h3>
<p>713</p>
<p>我们在一个四核系统上，对一个大小为n=2”的序列运行 psum- mutex，测量它的运 行时间（以秒为单位），作为线程数的函数，得到的结果难懂又令人奇怪：</p>
<p>线程数</p>
<p>1</p>
<p>4</p>
<p>8</p>
<p>16</p>
<p>版本</p>
<p>psum-mutex</p>
<p>68</p>
<p>2</p>
<p>432</p>
<p>719</p>
<p>552</p>
<p>599</p>
<p>程序单线程顺序运行时非常慢，几乎比多线程并行运行时慢了一个数量级。不仅如 此，使用的核数越多，性能越差。造成性能差的原因是相对于内存更新操作的开销，同步 操作（P和V）代价太大。这突显了并行编程的一项重要教训：同步开销巨大，要尽可能避 免。如果无可避免，必须要用尽可能多的有用计算弥补这个开销。</p>
<p>在我们的例子中，一种避免同步的方法是让每个对等线程在一个私有变量中计算它自 己的部分和，这个私有变量不与其他任何线程共享，如图 12-33所示。主线程（图中未显 示）定义一个全局数组 psum，每个对等线程i把它的部分和累积在 psum ［i］中。因为小心 地给了每个对等线程一个不同的内存位置来更新，所以不需要用互斥锁来保护这些更新。</p>
<p>唯一需要同步的地方是主线程必须等待所有的子线程完成。在对等线程结束后，主线程把 psum 向量的元素加起来，得到最终的结果。</p>
<p>code/conc/psum-array.c 2</p>
<p>4</p>
<p>5</p>
<p>7</p>
<p>8</p>
<p>9</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>/* Thread routine for psum-array.c */ void *sum_array （void *vargp） ｛</p>
<p>1ong</p>
<p>myid = *（（1ong *）vargp）；</p>
<p>/* Extract the thread ID */ long start = myid * nelems_per_thread; /* Start element index */ 1ong</p>
<p>end = start + nelems-per_thread; /* End element index */ 1ong i；</p>
<p>for （i = start;i &lt; end; i++）｛ psum ［myid］ += i；</p>
<p>｝</p>
<p>return NULL；</p>
<p>｝</p>
<p>- code/conc/psum-array.c 图12-33</p>
<p>psum-array 的线程例程。每个对等线程把它的部分和 累积在一个私有数组元素中，不与其他任何对等线程共享该元素 在四核系统上运行 psum-array 时，我们看到它比 psum-mutex 运行得快好几个数 量级：</p>
<p>版本</p>
<p>1</p>
<p>2</p>
<p>线程数</p>
<p>4</p>
<p>8</p>
<p>16</p>
<p>psum-mutex</p>
<p>psum-array</p>
<p>68.00</p>
<p>7.26</p>
<p>432.00</p>
<p>3.64</p>
<p>719.00</p>
<p>1.91</p>
<p>552.00</p>
<p>1.85</p>
<p>599.00</p>
<p>1.84</p>
<p>在第5章中，我们学习到了如何使用局部变量来消除不必要的内存引用。图12-34展 示了如何应用这项原则，让每个对等线程把它的部分和累积在一个局部变量而不是全局变 量中。当在四核机器上运行 psum-1ocal 时，得到一组新的递减的运行时间：</p>
<h2>第 749 页</h2>
<p>714</p>
<p>第三部分 程序间的交互和通信</p>
<p>版本</p>
<p>psum-mutex</p>
<p>Psum-array</p>
<p>psum-local</p>
<p>68.00</p>
<p>7.26</p>
<p>1.06</p>
<p>2</p>
<p>432.00</p>
<p>3.64</p>
<p>0.54</p>
<p>线程数</p>
<p>4</p>
<p>719.00</p>
<p>1.91</p>
<p>0.28</p>
<p>8</p>
<p>552.00</p>
<p>1.85</p>
<p>0.29</p>
<p>16</p>
<p>599.00</p>
<p>1.84</p>
<p>0.30</p>
<p>- code/conc/psum-local.c 2</p>
<p>3</p>
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
<p>/* Thread routine for psum-local.c */ void</p>
<p>*sum_1ocal （void *vargp） ｛</p>
<p>long myid = *（（1ong *）vargp）；</p>
<p>/* Extract the thread ID */ long start = myid * nelems_per_thread; /* Start element index */ long</p>
<p>end = start + nelems_per_thread; /* End element index */ long i,sum = 0；</p>
<p>for （i = start; i &lt; end; i++）｛ sum += i；</p>
<p>｝</p>
<p>psum ［myid］ = sum；</p>
<p>return NULL；</p>
<p>｝</p>
<p>- code/conc/psum-local.c 图12-34</p>
<p>psum-1ocal 的线程例程。每个对等线程把它的部分和累积在一个局部变量中 从这个练习可以学习到一个重要的经验，那就是写并行程序相当棘手。对代码看上去 很小的改动可能会对性能有极大的影响。</p>
<p>1.2</p>
<p>刻画并行程序的性能</p>
<p>1.06</p>
<p>1.0</p>
<p>图12-35 给出了图12-34 中程序 0.8</p>
<p>psum-1oca1 的运行时间，它是线程数 的函数。在每个情况下，程序运行在一</p>
<p>0.6</p>
<p>个有四个处理器核的系统上，对一个纂</p>
<p>0.54</p>
<p>0.4</p>
<p>0.29</p>
<p>0.3</p>
<p>n=23个元素的序列求和。我们看到， 0.28</p>
<p>0.2</p>
<p>随着线程数的增加，运行时间下降，直</p>
<p>到增加到四个线程，此时，运行时间趋</p>
<p>0</p>
<p>i</p>
<p>2</p>
<p>4</p>
<p>8</p>
<p>16</p>
<p>于平稳，甚至开始有点增加。</p>
<p>线程</p>
<p>在理想的情况中，我们会期望运行时</p>
<p>图 12-35</p>
<p>psum-1ocal 的性能（图12-34）。用四个 间随着核数的增加线性下降。也就是说， 处理器核对一个 231个元素序列求和 我们会期望线程数每增加一倍，运行时间就下降一半。确实是这样，直到到达t＞4的时候， 此时四个核中的每一个都忙于运行至少一个线程。随着线程数量的增加，运行时间实际上增 加了一点儿，这是由于在一个核上多个线程上下文切换的开销。由于这个原因，并行程序常 常被写为每个核上只运行一个线程。</p>
<p>虽然绝对运行时间是衡量程序性能的终极标准，但是还是有一些有用的相对衡量标准能 够说明并行程序有多好地利用了潜在的并行性。并行程序的加速比（speedup）通常定义为</p>
<h2>第 750 页</h2>
<h3>第12章 并发编程</h3>
<p>715</p>
<p>这里 是处理器核的数量，Tx是在k个核上的运行时间。这个公式有时被称为强扩展 （strong scaling）。当T，是程序顺序执行版本的执行时间时，S，称为绝对加速比（absolute speedup）。当T是程序并行版本在一个核上的执行时间时，S，称为相对加速比（relative speedup）。绝对加速比比相对加速比能更真实地衡量并行的好处。即使是当并行程序在一 个处理器上运行时，也常常会受到同步开销的影响，而这些开销会人为地增加相对加速比 的数值，因为它们增加了分子的大小。另一方面，绝对加速比比相对加速比更难以测量， 因为测量绝对加速比需要程序的两种不同的版本。对于复杂的并行代码，创建一个独立的 顺序版本可能不太实际，或者因为代码太复杂，或者因为源代码不可得。</p>
<p>一种相关的测量量称为效率（efficiency），定义为 E- 一</p>
<p>通常表示为范围在（0，100］之间的百分比。效率是对由于并行化造成的开销的衡量。具有 高效率的程序比效率低的程序在有用的工作上花费更多的时间，在同步和通信上花费更少 的时间。</p>
<p>图12-36给出了我们并行求和示</p>
<p>例程序的各个加速比和效率测量值。</p>
<p>像这样超过90%的效率是非常好的，</p>
<p>但是不要被欺骗了。能取得这么高的</p>
<p>效率是因为我们的问题非常容易并行</p>
<p>线程（t）</p>
<p>核 （p）</p>
<p>运行时间（T，）</p>
<p>加速比（S，）</p>
<p>效率（E，）</p>
<p>图 12-36</p>
<p>1</p>
<p>1</p>
<p>1.06</p>
<p>1</p>
<p>100%</p>
<p>2</p>
<p>2</p>
<p>0.54</p>
<p>1.9</p>
<p>98%</p>
<p>4</p>
<p>0.28</p>
<p>3.8</p>
<p>95%</p>
<p>0.29</p>
<p>3.7</p>
<p>91%</p>
<p>16</p>
<p>4</p>
<p>0.30</p>
<p>3.5</p>
<p>88%</p>
<p>图12-35中执行时间的加速比和并行效率 化。在实际中，很少会这样。数十年</p>
<p>来，并行编程一直是一个很活跃的研究领域。随着商用多核机器的出现，这些机器的核数 每几年就翻一番，并行编程会继续是一个深入，困难而活跃的研究领域。</p>
<p>加速比还有另外一面，称为弱扩展（weak scaling），在增加处理器数量的同时，增加 问题的规模，这样随着处理器数量的增加，每个处理器执行的工作量保持不变。在这种描 述中，加速比和效率被表达为单位时间完成的工作总量。例如，如果将处理器数量翻倍， 同时每个小时也做了两倍的工作量，那么我们就有线性的加速比和100%的效率。</p>
<p>弱扩展常常是比强扩展更真实的衡量值，因为它更准确地反映了我们用更大的机器做 更多的工作的愿望。对于科学计算程序来说尤其如此，科学计算问题的规模很容易增加， 更大的问题规模直接就意味着更好地预测。不过，还是有一些应用的规模不那么容易增 加，对于这样的应用，强扩展是更合适的。例如，实时信号处理应用所执行的工作量常常 是由产生信号的物理传感器的属性决定的。改变工作总量需要用不同的物理传感器，这不 太实际或者不太必要。对于这类应用，我们通常想要用并行来尽可能快地完成定量的 工作。</p>
<p>练习题 12.11</p>
<p>对于下表中的并行程序，填写空白处。假设使用强扩展。</p>
<p>线程（t）</p>
<p>核 （p）</p>
<p>运行时间（T，）</p>
<p>加速比（S，）</p>
<p>效率（E，）</p>
<p>1</p>
<p>1</p>
<p>12</p>
<p>2</p>
<p>2</p>
<p>8</p>
<p>1.5</p>
<p>4</p>
<p>4</p>
<p>6</p>
<p>100%</p>
<p>50%</p>
<h2>第 751 页</h2>
<p>716</p>
<p>第三部分 程序间的交互和通信</p>
<h3>12.7 其他并发问题</h3>
<p>你可能已经注意到了，一旦我们要求同步对共享数据的访问，那么事情就变得复杂得 多了。迄今为止，我们已经看到了用于互斥和生产者-消费者同步的技术，但这仅仅是冰 山一角。同步从根本上说是很难的问题，它引出了在普通的顺序程序中不会出现的问题。</p>
<p>这一小节是关于你在写并发程序时需要注意的一些问题的（非常不完整的）综述。为了让事 情具体化，我们将以线程为例描述讨论。不过要记住，这些典型问题是任何类型的并发流 操作共享资源时都会出现的。</p>
<h3>12.7.1 线程安全</h3>
<p>当用线程编写程序时，必须小心地编写那些具有称为线程安全性（thread safety）属性 的函数。一个函数被称为线程安全的（thread-safe），当且仅当被多个并发线程反复地调用 时，它会一直产生正确的结果。如果一个函数不是线程安全的，我们就说它是线程不安全 的（thread-unsafe）。</p>
<p>我们能够定义出四个（不相交的）线程不安全函数类：</p>
<p>第1类：不保护共享变量的函数。我们在图 12-16 的 thread 函数中就已经遇到了这样 的问题，该函数对一个未受保护的全局计数器变量加1。将这类线程不安全函数变成线程安 全的，相对而言比较容易：利用像P和V操作这样的同步操作来保护共享的变量。这个方法 的优点是在调用程序中不需要做任何修改。缺点是同步操作将减慢程序的执行时间。</p>
<p>第2类：保持跨越多个调用的状态的函数。一个伪随机数生成器是这类线程不安全的 数的简单例子。请参考图12-37中的伪随机数生成器程序包。rand 函数是线程不安全的， 因为当前调用的结果依赖于前次调用的中间结果。当调用 srand 为 rand设置了一个种子 后，我们从一个单线程中反复地调用rand，能够预期得到一个可重复的随机数字序列。</p>
<p>然而，如果多线程调用 rand 函数，这种假设就不再成立了。</p>
<p>code/conc/rand.c</p>
<p>1</p>
<p>3</p>
<p>4</p>
<p>5</p>
<p>6</p>
<p>8</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>unsigned next_seed = 1；</p>
<p>/* rand - return pseudorandom integer in the range 0..32767 */ unsigned rand（void） ｛</p>
<p>next_seed = next_seed*1103515245 + 12543；</p>
<p>return （unsigned） （next_seed&gt;&gt;16） % 32768；</p>
<p>｝</p>
<p>/* srand - set the initial seed for rand（）*/</p>
<p>void</p>
<p>srand（unsigned new_seed） ｛</p>
<p>next_seed = new_seed；</p>
<p>｝</p>
<p>code/conc/rand.c</p>
<p>图12-37</p>
<p>一个线程不安全的伪随机数生成器（基于［61］） 使得像 rand这样的函数线程安全的唯一方式是重写它，使得它不再使用任何 static 数据，而是依靠调用者在参数中传递状态信息。这样做的缺点是，程序员现在还要被迫修</p>
<h2>第 752 页</h2>
<h3>第12章 并发编程</h3>
<p>717</p>
<p>改调用程序中的代码。在一个大的程序中，可能有成百上千个不同的调用位置，做这样的 修改将是非常麻烦的，而且容易出错。</p>
<p>第3类：返回指向静态变量的指针的函数。某些函数，例如 ctime 和 gethost- byname，将计算结果放在一个 static 变量中，然后返回一个指向这个变量的指针。如果我 们从并发线程中调用这些函数，那么将可能发生灾难，因为正在被一个线程使用的结果会 被另一个线程悄悄地覆盖了。</p>
<p>有两种方法来处理这类线程不安全函数。一种选择是重写函数，使得调用者传递存放结 果的变量的地址。这就消除了所有共享数据，但是它要求程序员能够修改函数的源代码。</p>
<p>如果线程不安全函数是难以修改或不可能修改的（例如，代码非常复杂或是没有源代 码可用），那么另外一种选择就是使用加锁-复制（lock-and-copy）技术。基本思想是将线程 不安全函数与互斥锁联系起来。在每一个调用位置，对互斥锁加锁，调用线程不安全函 数，将函数返回的结果复制到一个私有的内存位置，然后对互斥锁解锁。为了尽可能地减 少对调用者的修改，你应该定义一个线程安全的包装函数，它执行加锁-复制，然后通过 调用这个包装函数来取代所有对线程不安全函数的调用。例如，图12-38给出了 ctime 的 一个线程安全的版本，利用的就是加锁-复制技术。</p>
<p>code/conc/ctime-ts.c char *ctime_ts （const time_t *timep, char *privatep） 2</p>
<p>｛</p>
<p>char *sharedp；</p>
<p>4</p>
<p>5</p>
<p>7</p>
<p>8</p>
<p>9</p>
<p>10</p>
<p>P（&amp;mutex）；</p>
<p>sharedp = ctime （timep）；</p>
<p>strcpy （privatep,sharedp）；/* Copy string from shared to private */ V （&amp;mutex）；</p>
<p>return privatep；</p>
<p>｝</p>
<p>- code/conc/ctime-ts.c 图12-38</p>
<p>C标准库函数 ctime 的线程安全的包装函数。使用加锁-复制技术 调用一个第3类线程不安全函数</p>
<p>第4类：调用线程不安全函数的函数。如果函数f调用线程不安全函数g，那么f就 是线程不安全的吗？不一定。如果g是第2类函数，即依赖于跨越多次调用的状态，那么 f也是线程不安全的，而且除了重写g以外，没有什么办法。然而，如果g是第1类或者 第3类函数，那么只要你用一个互斥锁保护调用位置和任何得到的共享数据，「仍然可能 是线程安全的。在图 12-38中我们看到了一个这种情况很好的示例，其中我们使用加锁- 复制编写了一个线程安全函数，它调用了一个线程不安全的函数。</p>
<p>所有的函数</p>
<h3>12.7.2 可重入性</h3>
<p>有一类重要的线程安全函数，叫做可重入函 数（reentrant function），其特点在于它们具有这 样一种属性：当它们被多个线程调用时，不会引 用任何共享数据。尽管线程安全和可重入有时会 （不正确地）被用做同义词，但是它们之间还是有 清晰的技术差别，值得留意。图12-39展示了可 线程安全函数</p>
<p>线程不安全函数</p>
<p>可重人函数</p>
<p>图12-39</p>
<p>可重人函数、线程安全函数和线程</p>
<p>不安全函数之间的集合关系</p>
<h2>第 753 页</h2>
<p>718</p>
<p>第三部分 程序间的交互和通信</p>
<p>重人函数、线程安全函数和线程不安全函数之同的集合关系。所有函数的集合被划分成不 相交的线程安全和线程不安全函数集合。可重人函数集合是线程安全函数的一个真子集。</p>
<p>可重人函数通常要比不可重人的线程安全的函数高效一些，因为它们不需要同步操 作。更进一步来说，将第2类线程不安全函数转化为线程安全函数的唯一方法就是重写 它，使之变为可重人的。例如，图12-40展示了图12-37中 rand 函数的一个可重人的版 本。关键思想是我们用一个调用者传递进来的指针取代了静态的 next 变量。</p>
<p>- code/conc/rand-r.c 1</p>
<p>/* rand_r - return a pseudorandom integer on 0..32767 */ int rand_r（unsigned int *nextp）</p>
<p>｛</p>
<p>5</p>
<p>*nextp = *nextp * 1103515245 + 12345；</p>
<p>return （unsigned int） （*nextp / 65536） % 32768；</p>
<p>｝</p>
<p>code/conc/rand-r.c 图 12-40</p>
<p>rand</p>
<p>Lr：图 12-37中的 rand 函数的可重入版本 检查某个函数的代码并先验地断定它是可重人的，这可能吗？不幸的是，不一定能这 样。如果所有的函数参数都是传值传递的（即没有指针），并且所有的数据引用都是本地的 自动栈变量（即没有引用静态或全局变量），那么函数就是显式可重入的（explicitly reen- trant），也就是说，无论它是被如何调用的，都可以断言它是可重人的。</p>
<p>然而，如果把假设放宽松一点，允许显式可重人函数中一些参数是引用传递的（即允 许它们传递指针），那么我们就得到了一个隐式可重入的（implicitly reentrant）函数，也就 是说，如果调用线程小心地传递指向非共享数据的指针，那么它是可重人的。例如，图 12-40 中的 rand</p>
<p>_r函数就是隐式可重人的。</p>
<p>我们总是使用术语可重入的（reentrant）既包括显式可重人函数也包括隐式可重入函 数。然而，认识到可重人性有时既是调用者也是被调用者的属性，并不只是被调用者单独 的属性是非常重要的。</p>
<p>练习题 12.12</p>
<p>图12-38中的 ctime_ts 函数是线程安全的，但不是可重入的。请解释说明。</p>
<h3>12.7.3 在线程化的程序中使用已存在的库函数</h3>
<p>大多数 Linux 函数，包括定义在标准C库中的函数（例如 malloc、Eree、real1oc、 printf和 scanf）都是线程安全的，只有一小部分是例外。图12-41列出了常见的例外。</p>
<p>（参考［110］可以得到一个完整的列表。strtok 函数是一个已弃用的（不推荐使用）函数。</p>
<p>asctime、ctime 和 localtime 函数是在不同时间和数据格式间相互来回转换时经常使用 的函数。gethostbyname、gethostbyaddr 和 inet_ntoa 函数是已弃用的网络编程函 数，已经分别被可重人的 getaddrinfo、getnameinfo 和 inet_ntop 函数取代（见第11 章）。除了 rand 和 strtok 以外，所有这些线程不安全函数都是第3类的，它们返回一个 指向静态变量的指针。如果我们需要在一个线程化的程序中调用这些函数中的某一个，对 调用者来说最不惹麻烦的方法是加锁-复制。然而，加锁-复制方法有许多缺点。首先，额 外的同步降低了程序的速度。第二，像 gethostbyname 这样的函数返回指向复杂结构的 结构的指针，要复制整个结构层次，需要深层复制（deep copy）结构。第三，加锁-复制方 法对像rand这样依赖跨越调用的静态状态的第2类函数并不有效。</p>
<h2>第 754 页</h2>
<h3>第12章 并发编程</h3>
<p>719</p>
<p>线程不安全函数</p>
<p>rand</p>
<p>strtok</p>
<p>asctime</p>
<p>ctime</p>
<p>gethostbyaddr</p>
<p>gethostbyname</p>
<p>inet_ntoa</p>
<p>localtime</p>
<p>线程不安全类</p>
<p>2</p>
<p>2</p>
<p>3</p>
<p>Linux 线程安全版本</p>
<p>rand_r</p>
<p>strtok_r</p>
<p>asctime_r</p>
<p>ctime_r</p>
<p>gethostbyaddr_r</p>
<p>gethostbyname_r</p>
<p>（无）</p>
<p>localtime_r</p>
<p>图 12-41</p>
<p>常见的线程不安全的库函数</p>
<p>因此，Linux 系统提供大多数线程不安全函数的可重人版本。可重人版本的名字总是 以“_z”后缀结尾。例如，asctime 的可重人版本就叫做 asctime_r。我们建议尽可能地 使用这些函数。</p>
<h3>12.7.4 竞争</h3>
<p>当一个程序的正确性依赖于一个线程要在另一个线程到达y点之前到达它的控制流中的z点 时，就会发生竞争（race）。通常发生竞争是因为程序员假定线程将按照某种特殊的轨迹线穿过执行 状态空间，而忘记了另一条准则规定：多线程的程序必须对任何可行的轨迹线都正确工作。</p>
<p>例子是理解竞争本质的最简单的方法。让我们来看看图 12-42中的简单程序。主线程创 建了四个对等线程，并传递一个指向一个唯一的整数ID 的指针到每个线程。每个对等线程 复制它的参数中传递的ID 到一个局部变量中（第22行），然后输出一个包含这个ID 的信息。</p>
<p>它看上去足够简单，但是当我们在系统上运行这个程序时，我们得到以下不正确的结果；</p>
<p>1inux&gt;./race</p>
<p>Hello from thread</p>
<p>1</p>
<p>Hello from thread 3 Hello from|</p>
<p>thread</p>
<p>2</p>
<p>Hello from thread</p>
<p>3</p>
<p>code/conc/race.c</p>
<p>1</p>
<p>2</p>
<p>3</p>
<p>/* WARNING: This code is buggy！*/ #include &quot;csapp.h&quot; #define N 4</p>
<p>5</p>
<p>void *thread（void *vargp）；</p>
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
<p>int mainO</p>
<p>｛</p>
<p>pthread_t tid［N］；</p>
<p>int i；</p>
<p>for （i=0; i &lt;N; i++） Pthread_create （&amp;tid［i］，NULL, thread， &amp;i）；</p>
<p>for （i= 0;i&lt;N;i++） Pthread_join（tid［i］，NULL）；</p>
<p>exit（O）；</p>
<p>｝</p>
<p>图12-42 一个具有竞争的程序</p>
<h2>第 755 页</h2>
<p>720</p>
<p>第三部分 程序间的交互和通信</p>
<p>18</p>
<p>19</p>
<p>20</p>
<p>21</p>
<p>22</p>
<p>23</p>
<p>24</p>
<p>25</p>
<p>/* Thread routine */ void *thread（void *vargp） ｛</p>
<p>int myid = *（（int *）vargp）；</p>
<p>printf（&quot;Hello from thread %d\n&quot;，myid）；</p>
<p>return NULL；</p>
<p>｝</p>
<p>code/conc/race.c</p>
<p>图12-42（续）</p>
<p>问题是由每个对等线程和主线程之间的竞争引起的。你能发现这个竞争吗？下面是发 生的情况。当主线程在第13行创建了一个对等线程，它传递了一个指向本地找变量i的 指针。在此时，竞争出现在下一次在第12行对之加1和第22 行参数的间接引用和赋值之 间。如果对等线程在主线程执行第12行对i加1之前就执行了第22行，那么myid变量 就得到正确的ID。否则，它包含的就会是其他线程的ID。令人惊慌的是，我们是否得到 正确的答案依赖于内核是如何调度线程的执行的。在我们的系统中它失败了，但是在其他 系统中，它可能就能正确工作，让程序员“幸福地”察觉不到程序的严重错误。</p>
<p>为了消除竞争，我们可以动态地为每个整数ID 分配一个独立的块，并且传递给线程 例程一个指向这个块的指针，如图12-43所示（第12～14行）。请注意线程例程必须释放 这些块以避免内存泄漏。</p>
<p>- code/conc/norace.c #include &quot;csapp.h&quot; #define N</p>
<p>4</p>
<p>2</p>
<p>3</p>
<p>void *thread（void *vargp）；</p>
<p>int mainO</p>
<p>7</p>
<p>｛</p>
<p>pthread_t tid［N］；</p>
<p>9</p>
<p>int i，*ptr；</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>for （i= 0;i&lt;N;i++）｛ Ptr = Malloc（sizeof （int））；</p>
<p>*ptr = i；</p>
<p>Pthread_create （&amp;tid［i］，NULL, thread, ptr）；</p>
<p>15</p>
<p>16</p>
<p>｝</p>
<p>for</p>
<p>17</p>
<p>18</p>
<p>（i=0;i&lt;N;i++）</p>
<p>Pthread_join（tid［i］，NULL）；</p>
<p>exit（O）；</p>
<p>19</p>
<p>｝</p>
<p>20</p>
<p>21</p>
<p>22</p>
<p>23</p>
<p>/* Thread routine */ void *thread（void *vargp） ｛</p>
<p>24</p>
<p>25</p>
<p>26</p>
<p>27</p>
<p>int myid = *（（int *vargp）；</p>
<p>Free （vargp）；</p>
<p>printf（&quot;Hello from thread %aln&quot;， myid）；</p>
<p>return NULL；</p>
<p>28</p>
<p>｝</p>
<p>code/conc/norace.c 图12-43</p>
<p>图12-42中程序的一个没有竞争的正确版本</p>
<h2>第 756 页</h2>
<h3>第12章 并发编程</h3>
<p>721</p>
<p>当我们在系统上运行这个程序时，现在得到了正确的结果：</p>
<p>1inux&gt;./norace</p>
<p>Hello from thread</p>
<p>Hello from thread</p>
<p>1</p>
<p>Hello from thread 2 Hello</p>
<p>from thread</p>
<p>3</p>
<p>练习题12.13 在图12-43中，我们可能想要在主线程中的第14行后立即释放已分配 的内存块，而不是在对等线程中释放它。但是这会是个坏注意。为什么？</p>
<p>练习题 12.14</p>
<p>A. 在图12-43中，我们通过为每个整数ID 分配一个独立的块来消除竞争。给出一个 不调用malloc或者 Eree 函数的不同的方法。</p>
<p>B. 这种方法的利弊是什么？</p>
<p>12.7.5</p>
<p>死锁</p>
<p>信号量引入了一种潜在的令人厌恶的运行时错误，叫做死锁（deadlock），它指的是一 组线程被阻塞了，等待一个永远也不会为真的条件。进度图对于理解死锁是一个无价的工 具。例如，图12-44展示了一对用两个信号量来实现互斥的线程的进程图。从这幅图中， 我们能够得到一些关于死锁的重要知识：</p>
<p>线程2</p>
<p>无死锁的轨迹</p>
<p>KS）</p>
<p>s的禁止区</p>
<p>P（s）</p>
<p>死锁状态d</p>
<p>4</p>
<p>t的禁止区</p>
<p>死锁区</p>
<p>P（）</p>
<p>初始</p>
<p>s=1</p>
<p>1=1</p>
<p>有死锁的轨迹线</p>
<p>-线程1</p>
<p>P（s）</p>
<p>P（t）</p>
<p>T（s）</p>
<p>图 12-44 一个会死锁的程序的进度图 • 程序员使用P和V操作顺序不当，以至于两个信号量的禁止区域重叠。如果某个执 行轨迹线碰巧到达了死锁状态 d，那么就不可能有进一步的进展了，因为重叠的禁 止区域阻塞了每个合法方向上的进展。换句话说，程序死锁是因为每个线程都在等 待其他线程执行一个根不可能发生的V操作。</p>
<p>• 重叠的禁止区域引起了一组称为死锁区域（deadlock region）的状态。如果一个轨迹 线碰巧到达了一个死锁区域中的状态，那么死锁就是不可避免的了。轨迹线可以进 人死锁区域，但是它们不可能离开。</p>
<h2>第 757 页</h2>
<p>722</p>
<p>第三部分 程序间的交互和通信</p>
<p>• 死锁是一个相当困难的问题，因为它不总是可预测的。一些幸运的执行轨迹线将绕开死 锁区域，而其他的将会陷人这个区域。图12-44展示了每种情况的一个示例。对于程序 员来说，这其中隐含的着实令人惊慌。你可以运行一个程序1000次不出任何问题，但是 下一次它就死锁了。或者程序在一台机器上可能运行得很好，但是在另外的机器上就会 死锁。最糟糕的是，错误常常是不可重复的，因为不同的执行有不同的轨迹线。</p>
<p>程序死锁有很多原因，要避免死锁一般而言是很困难的。然而，当使用二元信号量来 实现互斥时，如图12-44所示，你可以应用下面的简单而有效的规则来避免死锁：</p>
<p>互斥锁加锁顺序规则：给定所有互斥操作的一个全序，如果每个线程都是以一种顺序 获得互斥锁并以相反的顺序释放，那么这个程序就是无死锁的。</p>
<p>例如，我们可以通过这样的方法来解决图 12-44中的死锁问题：在每个线程中先对s 加锁，然后再对t加锁。图12-45展示了得到的进度图。</p>
<p>线程2</p>
<p>KS）</p>
<p>s的禁止区</p>
<p>7t）</p>
<p>1的禁止区</p>
<p>P（）</p>
<p>P（s）</p>
<p>初始</p>
<p>s=1</p>
<p>1=1</p>
<p>-线程1</p>
<p>P（s）</p>
<p>图12-45</p>
<p>P（）</p>
<p>Ys）</p>
<p>一个无死锁程序的进度图</p>
<p>练习题 12.15</p>
<p>思考下面的程序，它试图使用一对信号量来实现互斥。</p>
<p>初始时：</p>
<p>s= 1,t=0.</p>
<p>线程1：</p>
<p>线程2：</p>
<p>P（s）；</p>
<p>P（s）；</p>
<p>V（s）；</p>
<p>V（s）；</p>
<p>P（t）；</p>
<p>P（t）；</p>
<p>V（t）；</p>
<p>V（t）；</p>
<p>A. 画出这个程序的进度图。</p>
<p>B. 它总是会死锁吗？</p>
<p>C. 如果是，那么对初始信号量的值做哪些简单的改变就能消除这种潜在的死锁呢？</p>
<p>D. 画出得到的无死锁程序的进度图。</p>
<h3>12.8 小结</h3>
<p>一个并发程序是由在时间上重叠的一组逻辑流组成的。在这一章中，我们学习了三种不同的构建并 发程序的机制：进程、1/0多路复用和线程。我们以一个并发网络服务器作为贯穿全章的应用程序。</p>
<h2>第 758 页</h2>
<h3>第12章 并发编程</h3>
<p>723</p>
<p>进程是由内核自动调度的，而且因为它们有各自独立的虚拟地址空间，所以要实现共享数据，必须 要有显式的IPC机制。事件驱动程序创建它们自己的并发逻辑流，这些逻辑流被模型化为状态机，用 1/0多路复用来显式地调度这些流。因为程序运行在一个单一进程中，所以在流之间共享数据速度很快而 且很容易。线程是这些方法的混合。同基于进程的流一样，线程也是由内核自动调度的。同基于1/0多 路复用的流一样，线程是运行在一个单一进程的上下文中的，因此可以快速而方便地共享数据。</p>
<p>无论哪种并发机制，同步对共享数据的并发访问都是一个困难的问题。提出对信号量的P和V操作 就是为了帮助解决这个问题。信号量操作可以用来提供对共享数据的互斥访问，也对诸如生产者-消费者 程序中有限缓冲区和读者-写者系统中的共享对象这样的资源访问进行调度。一个并发预线程化的 echo 服务器提供了信号量使用场景的很好的例子。</p>
<p>并发也引入了其他一些困难的问题。被线程调用的函数必须具有一种称为线程安全的属性。我们定 义了四类线程不安全的函数，以及一些将它们变为线程安全的建议。可重人函数是线程安全函数的一个 真子集，它不访问任何共享数据。可重入函数通常比不可重人函数更为有效，因为它们不需要任何同步 原语。竞争和死锁是并发程序中出现的另一些困难的问题。当程序员错误地假设逻辑流该如何调度时， 就会发生竞争。当一个流等待一个永远不会发生的事件时，就会产生死锁。</p>
<p>参考文献说明</p>
<p>信号量操作是 Dijkstra 提出的［31］。进度图的概念是 Coffman ［23］提出的，后来由 Carson 和 Reyn- olds ［16］形式化的。Courtois 等人［25］提出了读者-写者问题。操作系统教科书更详细地描述了经典的同 步问题，例如哲学家进餐问题、打瞌睡的理发师问题和吸烟者问题［102，106，113］。Butenhof 的书 ［15］对 Posix线程接口有全面的描述。Birrell ［7］的论文对线程编程以及线程编程中容易遇到的问题做了 很好的介绍。Reinders 的书［90］描述了 C/C++库，简化了线程化程序的设计和实现。有一些课本讲述了 多核系统上并行编程的基础知识［47，71］。Pugh 描述了Java 线程通过内存进行交互的方式的缺陷，并 提出了替代的内存模型 ［88］。Gustafson 提出了替代强扩展的弱扩展加速模型［43］。</p>
<p>家庭作业</p>
<p>• 12.16</p>
<p>；编写 hello.c（图 12-13）的一个版本，它创建和回收n个可结合的对等线程，其中n是一个命令 行参数。</p>
<p>* 12.17</p>
<p>A. 图12-46中的程序有一个 bug。要求线程睡眠一秒钟，然后输出一个字符串。然而，当在我们 的系统上运行它时，却没有任何输出。为什么？</p>
<p>• code/conc/hellobug.c 2</p>
<p>/* WARNING: This code is buggy！ */ #include &quot;csapp.h&quot; void *thread（void *vargp）；</p>
<p>int main（）</p>
<p>pthread_t tid；</p>
<p>Pthread_create（&amp;tid, NULL, thread, NULL）；</p>
<p>exit（0）；</p>
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
<p>｝</p>
<p>/* Thread routine */ void *thread （void *vargp） ｛</p>
<p>Sleep （1）；</p>
<p>printf（&quot;Hello, world！\n&quot;）；</p>
<p>return NULL；</p>
<p>｝</p>
<p>code/conc/hellobug.c 图 12-46</p>
<p>练习题 12.17的有bug 的程序</p>
<h2>第 759 页</h2>
<p>724</p>
<p>第三部分 程序间的交互和通信</p>
<p>* 12.18</p>
<p>** 12.19</p>
<p>梦12.20</p>
<p>#12.21</p>
<p>12.22</p>
<p>12.23</p>
<p>* 12.24</p>
<p>* 12.25</p>
<p>*12.26</p>
<p>** 12.27</p>
<p>* 12.28</p>
<p>* 12.29</p>
<p>B.你可以通过用两个不同的 Pthreads 函数调用中的一个替代第10行中的 exit 函数来改正这个 错误。选哪一个呢？</p>
<p>用图 12-21 中的进度图，将下面的轨迹线分类为安全或者不安全的。</p>
<p>A. Hz,L2,U2,H,L,Se,U,Si,T,T2 B. H,H,LI,U），Si,Le,T,U,S2,Ta C. Hi,Li,He,Le, Ue,Se,Ui,Si,Ti,T2 图 12-26中第一类读者-写者问题的解答给予读者的是有些弱的优先级，因为读者在离开它的临 界区时，可能会重启一个正在等待的写者，而不是一个正在等待的读者。推导出一个解答，它给 予读者更强的优先级，当写者离开它的临界区的时候，如果有读者正在等待的话，就总是重启一 个正在等待的读者。</p>
<p>考虑读者-写者问题的一个更简单的变种，即最多只有 N个读者。推导出一个解答，给予读者和 写者同等的优先级，即等待中的读者和写者被赋予对资源访问的同等的机会。提示：你可以用一 个计数信号量和一个互斥锁来解决这个问题。</p>
<p>推导出第二类读者-写者问题的一个解答，在此写者的优先级高于读者。</p>
<p>检查一下你对 select 函数的理解，请修改图12-6中的服务器，使得它在主服务器的每次迭代中 最多只回送一个文本行。</p>
<p>图12-8中的事件驱动并发echo 服务器是有缺陷的，因为一个恶意的客户端能够通过发送部分的 文本行，使服务器拒绝为其他客户端服务。编写一个改进的服务器版本，使之能够非阻塞地处理 这些部分文本行。</p>
<p>RIO 1/O 包中的函数（10.5节）都是线程安全的。它们也都是可重入函数吗？</p>
<p>在图 12-28 中的预线程化的并发 echo服务器中，每个线程都调用 echo_cnt 兩数（图 12-29）。</p>
<p>echo_cnt 是线程安全的吗？它是可重入的吗？为什么是或为什么不是呢？</p>
<p>用加锁-复制技术来实现 gethostbyname 的一个线程安全而又不可重人的版本，称为 gethost- byname_ts。一个正确的解答是使用由互斥锁保护的 hostent结构的深层副本。</p>
<p>一些网络编程的教科书建议用以下的方法来读和写套接字：和客户端交互之前，在同一个打开的 已连接套接字描述符上，打开两个标准1/0流，一个用来读，一个用来写：</p>
<p>FILE *fpin，*fpout；</p>
<p>fpin = fdopen（sockfd， &quot;r&quot;）；</p>
<p>Epout = fdopen（sockfd， &quot;w&quot;）；</p>
<p>当服务器完成和客户端的交互之后，像下面这样关闭两个流：</p>
<p>fclose（fpin）；</p>
<p>fclose （fpout）；</p>
<p>然而，如果你试图在基于线程的并发服务器上尝试这种方式，将制造一个致命的竞争条件。</p>
<p>请解释。</p>
<p>在图12-45 中，将两个 V操作的顺序交换，对程序死锁是否有影响？通过画出四种可能情况的进 度图来证明你的答案：</p>
<p>情况 1</p>
<p>情况2</p>
<p>情况3</p>
<p>情况4</p>
<p>线程 1</p>
<p>P（s）</p>
<p>P（t）</p>
<p>V（s）</p>
<p>V（t）</p>
<p>线程 2</p>
<p>P（s）</p>
<p>P（t）</p>
<p>V（s）</p>
<p>V（t）</p>
<p>线程 1</p>
<p>P（s）</p>
<p>P（t）</p>
<p>V（s）</p>
<p>V（t）</p>
<p>线程2</p>
<p>P（s）</p>
<p>P（t）</p>
<p>V（t）</p>
<p>V（s）</p>
<p>线程1</p>
<p>P（s）</p>
<p>P（t）</p>
<p>V（t）</p>
<p>V（s）</p>
<p>线程2</p>
<p>P（s）</p>
<p>P（t）</p>
<p>V（s）</p>
<p>V（t）</p>
<p>线程1</p>
<p>P（s）</p>
<p>P（t）</p>
<p>V（t）</p>
<p>V（s）</p>
<p>线程2</p>
<p>P（s）</p>
<p>P（t）</p>
<p>V（t）</p>
<p>V（s）</p>
<p>下面的程序会死锁吗？为什么会或者为什么不会？</p>
<h2>第 760 页</h2>
<p>• 12.30</p>
<p>*12.31</p>
<p>**12.32</p>
<p>梦12.33</p>
<p>**12.34</p>
<p>梦12.35</p>
<p>梦12.36</p>
<h3>第12章 并发编程</h3>
<p>725</p>
<p>初始时：</p>
<p>- 1,b=1,c=1</p>
<p>线程1：</p>
<p>P（a）；</p>
<p>P（b）；</p>
<p>V（b）；</p>
<p>P（c）；</p>
<p>线程2：</p>
<p>P（c）；</p>
<p>P（b）；</p>
<p>V（b）；</p>
<p>V（c）；</p>
<p>V（c）；</p>
<p>V（a）；</p>
<p>考虑下面这个会死锁的程序。</p>
<p>初始时：</p>
<p>a=1,b=1,c=1</p>
<p>线程1：</p>
<p>线程2：</p>
<p>线程3：</p>
<p>P（a）；</p>
<p>P（c）；</p>
<p>P（c）；</p>
<p>P（b）；</p>
<p>P（b）；</p>
<p>V（c）；</p>
<p>VCb）；</p>
<p>VCb）；</p>
<p>P（b）；</p>
<p>P（c）；</p>
<p>V（c）；</p>
<p>P（a）；</p>
<p>V（c）；</p>
<p>P（a）；</p>
<p>V（a）；</p>
<p>V（a）；</p>
<p>V（a）；</p>
<p>V（b）；</p>
<p>A. 列出每个线程同时占用的一对互斥锁。</p>
<p>B.如果a&lt;b&lt;c，那么哪个线程违背了互斥锁加锁顺序规则？</p>
<p>C.对于这些线程，指出一个新的保证不会发生死锁的加锁顺序。</p>
<p>实现标准1/0函数 Egets 的一个版本，叫做 tfgets，假如它在5秒之内没有从标准输入上接收到 一个输人行，那么就超时，并返回一个 NULL 指针。你的函数应该实现在一个叫做 tfgets-proc.c 的包中，使用进程、信号和非本地跳转。它不应该使用Linux 的 alarm 函数。使用图 12-47中的驱 动程序测试你的结果。</p>
<p>code/conc/tfgets-main.c #include &quot;csapp.h&quot; char *tfgets（char *s, int size, FILE *stream）；</p>
<p>int</p>
<p>main（）</p>
<p>｛</p>
<p>char buf ［MAXLINE］；</p>
<p>if （tfgets（buf,MAXLINE, stdin） == NULL） 10</p>
<p>printf（&quot;BOOM！\n&quot;）；</p>
<p>11</p>
<p>else</p>
<p>12</p>
<p>printf（&quot;%s&quot;， buf）；</p>
<p>13</p>
<p>14</p>
<p>exit （O）；</p>
<p>15</p>
<p>｝</p>
<p>- code/conc/tfgets-main.c 图 12-47</p>
<p>家庭作业题12.31～12.33的驱动程序 使用 select 函数来实现练习题 12.31中 tfgets 函数的一个版本。你的函数应该在一个叫做tf- gets-select.c的包中实现。用练习题 12.31 中的驱动程序测试你的结果。你可以假定标准输入 被赋值为描述符0。</p>
<p>实现练习题 12.31 中 tfgets 函数的一个线程化的版本。你的函数应该在一个叫做 tfgets- thread.c的包中实现。用练习题12.31 中的驱动程序测试你的结果。</p>
<p>编写一个 NXM矩阵乘法核心函数的并行线程化版本。比较它的性能与顺序的版本的性能。</p>
<p>实现一个基于进程的 TINY Web 服务器的并发版本。你的解答应该为每一个新的连接请求创建一 个新的子进程。使用一个实际的 Web 浏览器来测试你的解答。</p>
<p>实现一个基于1/O多路复用的 TINY Web 服务器的并发版本。使用一个实际的 Web 浏览器来测 试你的解答。</p>
<h2>第 761 页</h2>
<p>726</p>
<p>第三部分 程序间的交互和通信</p>
<p>梦12.37</p>
<p>#12.38</p>
<p>#12.39</p>
<p>实现一个基于线程的 TINY web 服务器的并发版本。你的解答应该为每一个新的连接请求创建一 个新的线程。使用一个实际的 Web 浏览器来测试你的解答。</p>
<p>实现一个 TINY Web 服务器的并发预线程化的版本。你的解答应该根据当前的负载，动态地增加 或减少线程的数目。一个策略是当缓冲区变满时，将线程数量翻倍，而当缓冲区变空时，将线 程数目减半。使用一个实际的Web 浏览器来测试你的解答。</p>
<p>Web 代理是一个在Web 服务器和浏览器之间扮演中间角色的程序。浏览器不是直接连接服务器 以获取网页，而是与代理连接，代理再将请求转发给服务器。当服务器响应代理时，代理将响应 发送给浏览器。为了这个试验，请你编写一个简单的可以过滤和记录请求的Web 代理：</p>
<p>A.试验的第一部分中，你要建立以接收请求的代理，分析 HTTP，转发请求给服务器，并且返 回结果给浏览器。你的代理将所有请求的 URL 记录在磁盘上一个日志文件中，同时它还要阻 塞所有对包含在磁盘上一个过滤文件中的 URL 的请求。</p>
<p>B.试验的第二部分中，你要升级代理，它通过派生一个独立的线程来处理每一个请求，使得代 理能够一次处理多个打开的连接。当你的代理在等待远程服务器响应一个请求使它能服务于 一个浏览器时，它应该可以处理来自另一个浏览器未完成的请求。</p>
<p>使用一个实际的Web 浏览器来检验你的解答。</p>
<p>练习题答案</p>
<h3>12.1 当父进程派生子进程时，它得到一个已连接描述符的副本，并将相关文件表中的引用计数从1增</h3>
<p>加到2。当父进程关闭它的描述符副本时，引用计数就从2减少到1。因为内核不会关闭一个文 件，直到文件表中它的引用计数值变为零，所以子进程这边的连接端将保持打开。</p>
<p>12.2</p>
<p>当一个进程因为某种原因终止时，内核将关闭所有打开的描述符。因此，当子进程退出时，它的 已连接文件描述符的副本也将被自动关闭。</p>
<p>12.3</p>
<p>回想一下，如果一个从描述符中读一个字节的请求不会阻塞，那么这个描述符就准备好可以读了。</p>
<p>假如 EOF 在一个描述符上为真，那么描述符也准备好可读了，因为读操作将立即返回一个零返回 码，表示 EOF。因此，键入 Ctrl+D会导致 select 函数返回，准备好的集合中有描述符0。</p>
<p>12.4</p>
<p>因为变量 pool.read_set 既作为输人参数也作为输出参数，所以我们在每一次调用 select之前 都重新初始化它。在输入时，它包含读集合。在输出，它包含准备好的集合。</p>
<p>12.5</p>
<p>因为线程运行在同一个进程中，它们都共享相同的描述符表。无论有多少线程使用这个已连接描 述符，这个已连接描述符的文件表的引用计数都等于1。因此，当我们用完它时，一个close 操 作就足以释放与这个已连接描述符相关的内存资源了。</p>
<p>12.6</p>
<p>这里的主要的思想是，栈变量是私有的，而全局和静态变量是共享的。诸如 cnt 这样的静态变量 有点小麻烦，因为共享是限制在它们的函数范围内的——在这个例子中，就是线程例程。</p>
<p>A. 下面就是这张表：</p>
<p>变量实例</p>
<p>ptr</p>
<p>cnt</p>
<p>i.m</p>
<p>msgs.m</p>
<p>myid.po</p>
<p>myid.p1</p>
<p>被主线程引用？</p>
<p>是</p>
<p>否</p>
<p>是</p>
<p>被对等线程0引用？</p>
<p>是</p>
<p>是</p>
<p>被对等线程1引用？</p>
<p>是</p>
<p>是</p>
<p>否</p>
<p>否</p>
<p>否</p>
<p>否是是否</p>
<p>否</p>
<p>是</p>
<p>说明：</p>
<p>• ptr：一个被主线程写和被对等线程读的全局变量。</p>
<p>• cnt：一个静态变量，在内存中只有一个实例，被两个对等线程读和写。</p>
<p>• i.m：一个存储在主线程栈中的本地自动变量。虽然它的值被传递给对等线程，但是对等线 程也绝不会在栈中引用它，因此它不是共享的。</p>
<h2>第 762 页</h2>
<h3>第12章 并发编程</h3>
<p>727</p>
<p>12.7</p>
<p>12.8</p>
<p>12.9</p>
<p>12.11</p>
<p>12.12</p>
<p>12.13</p>
<p>12.14</p>
<p>• msgs.m：一个存储在主线程栈中的本地自动变量，被两个对等线程通过 ptr 间接地引用。</p>
<p>• myid.0和myid.1：一个本地自动变量的实例，分别驻留在对等线程。和线程1的栈中。</p>
<p>B.变量 ptr、cnt 和 msgs 被多于，一个线程引用，因此它们是共享的。</p>
<p>这里的重要思想是，你不能假设当内核调度你的线程时会如何选择顺序。</p>
<p>步骤</p>
<p>线程</p>
<p>指令</p>
<p>Weak：</p>
<p>12</p>
<p>3</p>
<p>4</p>
<p>5</p>
<p>1</p>
<p>2</p>
<p>2</p>
<p>2</p>
<p>0</p>
<p>cnt</p>
<p>0</p>
<p>0</p>
<p>6</p>
<p>L2</p>
<p>Uz</p>
<p>Sz</p>
<p>7</p>
<p>8</p>
<p>S：</p>
<p>9</p>
<p>10</p>
<p>1</p>
<p>2</p>
<p>1</p>
<p>1</p>
<p>变量 cnt 最终有一个不正确的值1。</p>
<p>这道题简单地测试你对进度图中安全和不安全轨迹线的理解。像A和C这样的轨迹线绕开了临界 区，是安全的，会产生正确的结果。</p>
<p>A. H」，LI,U,SI,Ha,L2,U2,S2,Ta,T」 ：安全的 B. H2,Le,H,LI,U.，S,T,Uz,S2，T2： 不安全的 C.HI,Hz,L,Uz,Sz,Li,UI,SI,T,T：安全的 A. p=1，c=1，n＞1：是，互斥锁是需要的，因为生产者和消费者会并发地访问缓冲区。</p>
<p>B. p=1，c=1，n=1：不是，在这种情况中不需要互斥锁信号量，因为一个非空的缓冲区就等于 满的缓冲区。当缓冲区包含一个项目时，生产者就被阻塞了。当缓冲区为空时，消费者就被阻 塞了。所以在任意时刻，只有一个线程可以访问缓冲区，因此不用互斥锁也能保证互斥。</p>
<p>C. p&gt;1，c＞1，n=1：不是，在这种情况中，也不需要互斥锁，原因与前面一种情况相同。</p>
<p>假设一个特殊的信号量实现为每一个信号量使用了一个 LIFO 的线程栈。当一个线程在P操作中 阻塞在一个信号量上，它的ID 就被压人栈中。类似地，V操作从栈中弹出栈顶的线程ID，并重 启这个线程。根据这个栈的实现，一个在它的临界区中的竞争的写者会简单地等待，直到在它释 放这个信号量之前另一个写者阻塞在这个信号量上。在这种场景中，当两个写者来回地传递控制 权时，正在等待的读者可能会永远地等待下去。</p>
<p>注意，虽然用 FIFO队列而不是用LIFO 更符合直觉，但是使用LIFO 的栈也是对的，而且也没 有违反P和V操作的语义。</p>
<p>这道题简单地检查你对加速比和并行效率的理解：</p>
<p>线程（t）</p>
<p>核 （p）</p>
<p>运行时间（Z，）</p>
<p>加速比（S，）</p>
<p>效率（E，）</p>
<p>12</p>
<p>1</p>
<p>100%</p>
<p>1.5</p>
<p>75%</p>
<p>2</p>
<p>50%</p>
<p>ctime_ts 函数不是可重人函数，因为每次调用都共享相同的由 gethostbyname 函数返回的static变 量。然而，它是线程安全的，因为对共享变量的访问是被P和V操作保护的，因此是互斥的。</p>
<p>如果在第14 行调用了 pthread_create 之后，我们立即释放块，那么将引人一个新的竞争，这 次竞争发生在主线程对free 的调用和线程例程中第24行的赋值语句之间。</p>
<p>A. 另一种方法是直接传递整数i，而不是传递一个指向i的指针：</p>
<p>for （i= 0；</p>
<p>i&lt;N；</p>
<p>i++）</p>
<p>Pthread_create（&amp;tid［i］， NULL, thread， （void *）i）；</p>
<h2>第 763 页</h2>
<p>728</p>
<p>第三部分 程序间的交互和通信</p>
<p>12.15</p>
<p>在线程例程中，我们将参数强制转换成一个 int 类型，并将它赋值给 myid：</p>
<p>int myid = （int） vargp；</p>
<p>B. 优点是它通过消除对 malloc 和 Eree 的调用降低了开销。一个明显的缺点是，它假设指针至 少和int一样大。即便这种假设对于所有的现代系统来说都真，但是它对于那些过去遗留 下来的或今后的系统来说可能就不为真了。</p>
<p>A. 原始的程序的进度图如图 12-48所示。</p>
<p>线程2</p>
<p>Y（t）</p>
<p>t的禁止区</p>
<p>P（t）</p>
<p>KS）</p>
<p>s的禁止区</p>
<p>t的禁止区</p>
<p>P（s）</p>
<p>初始</p>
<p>S=1</p>
<p>1=0</p>
<p>线程1</p>
<p>P（s）</p>
<p>Ys）</p>
<p>P（）</p>
<p>图12-48 一个有死锁的程序的进度图 B.因为任何可行的轨迹最终都陷入死锁状态中，所以这个程序总是会死锁。</p>
<p>C. 为了消除潜在的死锁，将二元信号量t初始化为1而不是0。</p>
<p>D. 改成后的程序的进度图如图 12-49所示。</p>
<p>线程2</p>
<p>（）</p>
<p>t的禁止区</p>
<p>P（t）</p>
<p>Vs）</p>
<p>s的禁止区</p>
<p>P（s）</p>
<p>初始</p>
<p>S=1</p>
<p>1=1</p>
<p>-</p>
<p>一线程1</p>
<p>P（s）</p>
<p>Y（S）</p>
<p>P（）</p>
<p>•••</p>
<p>7（）</p>
<p>图12-49</p>
<p>改正后的无死锁的程序的进度图</p>
<h2>第 764 页</h2>
<p>P</p>
<p>附录A</p>
<p>EN</p>
<p>D</p>
<p>错误处理</p>
<p>程序员应该总是检查系统级函数返回的错误代码。有许多细微的方式会导致出现错 误，只有使用内核能够提供给我们的状态信息才能理解为什么有这样的错误。不幸的是， 程序员往往不愿意进行错误检查，因为这使他们的代码变得很庞大，将一行代码变成一个 多行的条件语句。错误检查也是很令人迷惑的，因为不同的函数以不同的方式表示错误。</p>
<p>在编写本书时，我们面临类似的问题。一方面，我们希望代码示例阅读起来简洁简 单；另一方面，我们又不希望给学生们一个错误的印象，以为可以省略错误检查。为了解 决这些问题，我们采用了一种基于错误处理包装函数（error-handling wrapper）的方法，这 是由 W. Richard Stevens 在他的网络编程教材［110］中最先提出的。</p>
<p>其思想是，给定某个基本的系统级函数E00，我们定义一个有相同参数、只不过开头 字母大写了的包装函数 Foo。包装函数调用基本函数并检查错误。如果包装函数发现了错 误，那么它就打印一条信息并终止进程。否则，它返回到调用者。注意，如果没有错误， 包装函数的行为与基本函数完全一样。换句话说，如果程序使用包装函数运行正确，那么 我们把每个包装函数的第一个字母小写并重新编译，也能正确运行。</p>
<p>包装函数被封装在一个源文件（csapp.c）中，这个文件被编译和链接到每个程序中。</p>
<p>一个独立的头文件（csapp.h）中包含这些包装函数的函数原型。</p>
<p>本附录给出了一个关于 Unix 系统中不同种类的错误处理的教程，还给出了不同风格 的错误处理包装函数的示例。</p>
<p>csapp.h 和 csapp.c 文件可以从 CS:APP 网站上获得。</p>
<p>.A. 1 Unix 系统中的错误处理 本书中我们遇到的系统级函数调用使用三种不同风格的返回错误：Unix 风格的、 Posix 风格的和 GAI风格的。</p>
<p>1. Unix 风格的错误处理</p>
<p>像 fork 和 wait 这样 Unix 早期开发出来的函数（以及一些较老的 Posix 函数）的函数 返回值既包括错误代码，也包括有用的结果。例如，当Unix 风格的 wait 函数遇到一个 错误（例如没有子进程要回收），它就返回一1，并将全局变量errno 设置为指明错误原因 的错误代码。如果 wait 成功完成，那么它就返回有用的结果，也就是回收的子进程的 PID。Unix 风格的错误处理代码通常具有以下形式：</p>
<p>1</p>
<p>if （（pid = wait （NULL））&lt; O） ｛ fprintf（stderr，&quot;wait error： %sln&quot;， strerror（errno））；</p>
<p>exit （O）；</p>
<p>4</p>
<p>｝</p>
<p>strerror 函数返回某个 errno 值的文本描述。</p>
<p>2. Posix 风格的错误处理</p>
<p>许多较新的 Posix 函数，例如 Pthread 函数，只用返回值来表明成功（0）或者失败（非 0）。任何有用的结果都返回在通过引用传递进来的函数参数中。我们称这种方法为 Posix</p>
<h2>第 765 页</h2>
<p>730</p>
<p>附录A 错误处理</p>
<p>风格的错误处理。例如，Posix 风格的 pthread Lcreate 函效用它的返回值来表明成功或 者失败，而通过引用将新创建的线程的ID（有用的结果）返回放在它的第一个参数中。Pos- ix风格的错误处理代码通常具有以下形式：</p>
<p>if（（retcode = pthread_create（&amp;tid, NULL, thread, NULL））！= 0）｛ 2</p>
<p>fprintf（stderr，&quot;pthread_create error： %s\n&quot;， strerror （retcode））；</p>
<p>exit（O）；</p>
<p>4</p>
<p>｝</p>
<p>strerror 函数返回 retcode 某个值对应的文本描述。</p>
<p>3. GAI 风格的错误处理</p>
<p>getaddrinfo（GAl）和 getnameinfo 函数成功时返回零，失败时返回非零值。GAI 错误处理代码通常具有以下形式：</p>
<p>1</p>
<p>if（（retcode = getaddrinfo（host,service，&amp;hints，&amp;result））！= 0）｛ fprintf（stderr，&quot;getaddrinfo error： %s\n&quot;， gai_strerror（retcode））；</p>
<p>exit（O）；</p>
<p>4</p>
<p>｝</p>
<p>9ai</p>
<p>_strerror 函数返回 retcode 某个值对应的文本描述。</p>
<p>4. 错误报告函数小结</p>
<p>贯穿本书，我们使用下列错误报告函数来包容不同的错误处理风格：</p>
<p>#include &quot;csapp.h&quot; void</p>
<p>unix_error （char *msg）；</p>
<p>void</p>
<p>posix_error （int code, char *msg）；</p>
<p>void</p>
<p>gai_error（int code, char *msg）；</p>
<p>void</p>
<p>app-error （char *msg）；</p>
<p>返回：无。</p>
<p>正如它们的名字表明的那样，unix_error、posix_error 和 gai_error函数报告 Unix 风格的错误、Posix 风格的错误和GAI风格的错误，然后终止。包括 app_error兩 数是为了方便报告应用错误。它只是简单地打印它的输人，然后终止。图A-1展示了这些 错误报告函数的代码。</p>
<p>code/src/csapp.c</p>
<p>void</p>
<p>unix_error （char *msg）/* Unix-style error */ 3</p>
<p>fprintf（stderr， &quot;%s： %sln&quot;， msg, strerror（errno））；</p>
<p>exit（O）；</p>
<p>6</p>
<p>｝</p>
<p>void</p>
<p>｛</p>
<p>posix_error（int code, char *msg）/* Posix-style error */ fprintf（stderr， &quot;%s： %sln&quot;， msg, strerror（code））；</p>
<p>exit （O）；</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>｝</p>
<p>void gai_error（int code, char *msg）/* Getaddrinfo-style error */ 图A-1 错误报告函数</p>
<h2>第 766 页</h2>
<p>附录A 错误处理</p>
<p>731</p>
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
<p>｛</p>
<p>｝</p>
<p>｛</p>
<p>｝</p>
<p>Eprintf（stderr， &quot;%s： %sln&quot;， msg,gai_strerror （code））；</p>
<p>exit（O）；</p>
<p>void app_error（char *msg）/* Application error */ fprintf（stderr，</p>
<p>&quot;&#x27;%s\n&quot;，msg）；</p>
<p>exit（O）；</p>
<p>code/src/csapp.c</p>
<p>图A-1（续）</p>
<p>A. 2 错误处理包装函数</p>
<p>下面是一些不同错误处理包装函数的示例：</p>
<p>• Unix风格的错误处理包装函数。图A-2展示了 Unix 风格的wait 函数的包装函数。</p>
<p>如果 wait 返回一个错误，包装函数打印一条消息，然后退出。否则，它向调用者 返回一个 PID。图A-3展示了 Unix 风格的ki11函数的包装函数。注意，这个函数 和 wait 不同，成功时返回 void。</p>
<p>code/src/csapp.c</p>
<p>2</p>
<p>3</p>
<p>5</p>
<p>6</p>
<p>8</p>
<p>pid_t Wait（int *status） ｛</p>
<p>Pid_t Pid；</p>
<p>if （（pid = wait（status））&lt; O） unix_error（&quot;Wait error&quot;）；</p>
<p>return pid；</p>
<p>｝</p>
<p>code/src/csapp.c</p>
<p>图 A-2 Unix 风格的 wait 函数的包装函数 code/src/csapp.c</p>
<p>4</p>
<p>5</p>
<p>7</p>
<p>void Kill（pid_t pid, int signum） ｛</p>
<p>int rc；</p>
<p>if （（rc = kil1（pid, signum））&lt; 0） unix_error（&quot;Kill error&quot;）；</p>
<p>｝</p>
<p>code/src/csapp.c</p>
<p>图 A-3 Unix 风格的ki11函数的包装函数 • Posix风格的错误处理包装函数。图 A-4展示了 Posix 风格的 pthread_detach函 数的包装函数。同大多数 Posix 风格的函数一样，它的错误返回码中不会包含有用 的结果，所以成功时，包装函数返回 void。</p>
<h2>第 767 页</h2>
<p>732</p>
<p>附录 A</p>
<p>错误处理</p>
<p>code/src/csapp.c</p>
<p>void Pthread_detach（pthread_t tid） ｛ int rC；</p>
<p>if （（rc = pthread_detach（tid）） ！= 0） posix_error（rC， &quot;Pthread_detach error&quot;）；</p>
<p>｝</p>
<p>code/src/csapp.c</p>
<p>图 A-4 Posix 风格的 pthread_detach 函数的包装函数 • GAI 风格的错误处理包装函数。图 A-5展示了GAI 风格的 &#x27; getaddrinfo 函数的包 装函数。</p>
<p>-code/src/csapp.c</p>
<p>void Getaddrinfo（const char *node, const char *service， const struct addrinfo *hints, struct addrinfo **res） ｛</p>
<p>2</p>
<p>4</p>
<p>5</p>
<p>7</p>
<p>int rC；</p>
<p>if （（rc = getaddrinfo（node,service, hints, res））！= 0） gai_error （rC，&quot;Getaddrinfo error&quot;）；</p>
<p>｝</p>
<p>code/src/csapp.c</p>
<p>图 A-5 GAI 风格的 getaddrinfo 函数的包装函数</p>
<h2>第 768 页</h2>
<p>参考文献</p>
<p>［］</p>
<p>Advanced Micro Devices, Inc. Software Proceedings ofthe 4th Symposium on Operating Optimization Guide for AMD64 Processors， Systems Design and Implementation （OSDI） 2005.Publication Number 25112.</p>
<p>pages 31-44. Usenix, October 2000.</p>
<p>［2］</p>
<p>Advanced Micro Devices, Inc. AMD64 ［13］</p>
<p>R. E. Bryant. Term-level verification of a Architecture Programmer&#x27;s Manual, Volume pipelined CISC microprocessor. Technical 1: Application Programming,2013.Publication Report CMU-CS-05-195, Carnegie Mellon Number 24592.</p>
<p>University, School of Computer Science, 2005.</p>
<p>［3］</p>
<p>Advanced Micro Devices, Inc. AMD64 ［14］</p>
<p>R. E. Bryant and D. R. O&#x27;Hallaron.Introducing Architecture Programmer&#x27;s Manual, Volume computer systems from a programmer&#x27;s 3:General-Purpose and System Instructions， perspective. In Proceedings of the Technical 2013. Publication Number 24594.</p>
<p>Symposium on Computer Science Education 14］</p>
<p>Advanced Micro Devices, Inc.AMD64 （SIGCSE）， pages 90-94. ACM, February 2001.</p>
<p>Architecture Programmer&#x27;s Manual, Volume ［15］ D. Butenhof. Programming with Posix Threads 4: 128-Bit and 256-Bit Media Instructions, 2013.</p>
<p>Addison-Wesley, 1997.</p>
<p>Publication Number 26568.</p>
<p>［16］ S. Carson and P. Reynolds. The geometry of ［5］</p>
<p>K. Arnold, J. Gosling, and D. Holmes. The semaphore programs. ACM Transactions on Java Programming Language, Fourth Edition.</p>
<p>Programming Languages and Systems9（1）：25- Prentice Hall, 2005.</p>
<p>53,1987.</p>
<p>［］</p>
<p>T. Berners-Lee, R. Fielding, and H. Frystyk.</p>
<p>［17］ J. B. Carter, W. C. Hsieh, L. B. Stoller, M. R.</p>
<p>Hypertext transfer protocol-HTTP/1.0. RFC Swanson, L. Zhang, E. L. Brunvand, A. Davis， 1945, 1996.</p>
<p>C.-C. Kuo, R. Kuramkote, M. A. Parker， ［7］ A. Birrell. An introduction to programming L. Schaelicke, and T. Tateyama. Impulse：</p>
<p>Building a smarter memory controller. In with threads. Technical Report 35, Digital Proceedings ofthe Sth International Symposium Systems Research Center, 1989.</p>
<p>on High Performance Computer Architecture ［8］</p>
<p>A. Birrell, M.Isard, C. Thacker, and T. Wobber.</p>
<p>（HPCA）， pages 70-79. ACM, January 1999.</p>
<p>A design for high-performance flash disks.</p>
<p>［18］</p>
<p>K. Chang, D. Lee, Z. Chishti, A. Alameldeen， SIGOPS Operating Systems Review 41（2）：88- 93,2007.</p>
<p>C. Wilkerson, Y. Kim, and O.Mutlu. Improving DRAM performance by parallelizing refreshes G. E. Blelloch, J. T. Fineman, P. B. Gibbons， with accesses. In Proceedings of the 20th and H. V. Simhadri. Scheduling irregular International Symposium on High-Performance parallel computations on hierarchical caches.</p>
<p>Computer Architecture （HPCA）. ACM， In Proceedings of the 23rd Symposium on February 2014.</p>
<p>Parallelism in Algorithms and Architectures （SPAA）， pages 355-366.ACM, June 2011.</p>
<p>［19］</p>
<p>S. Chellappa, F. Franchetti, and M. Piischel.</p>
<p>How to write fast numerical code: A small in- ［10］</p>
<p>S. Borkar. Thousand core chips: A technology troduction. In Generative and Transformational perspective. In Proceedings of the 44th Design Techniques in Sofiware Engineering 11, volume Automation Conference, pages 746-749. ACM， 5235 of Lecture Notes in Computer Science， 2007.</p>
<p>pages 196-259. Springer-Verlag, 2008.</p>
<p>［11］</p>
<p>D. Bovet and M. Cesati. Understanding the ［20］</p>
<p>P. Chen, E. Lee, G. Gibson, R. Katz, and Linux Kernel, Third Edition. O&#x27;Reilly Media， D. Patterson. RAID: High-performance， Inc.， 2005.</p>
<p>reliable secondary storage. ACM Computing Surveys 26（2）：145-185, June 1994.</p>
<p>［12］ A. Demke Brown and T. Mowry. Taming the memory hogs: Using compiler-inserted releases ［21］ S. Chen, P. Gibbons, and T. Mowry. Improving to manage physical memory intelligently. In index performance through prefetching. In</p>
<h2>第 769 页</h2>
<p>734</p>
<p>参考文献</p>
<p>Proceedings of the 2001 ACM SIGMOD International Conference on Management of Data, pages 235-246. ACM, May 2001.</p>
<p>［22］</p>
<p>T. Chilimbi, M. Hill, and J. Larus. Cache- conscious structure layout. In Proceedings of the 1999 ACM Conference on Programming Language Design and Implementation （PLDI）， pages 1-12. ACM, May 1999.</p>
<p>［23］</p>
<p>E. Coffman, M. Elphick, and A. Shoshani.</p>
<p>System deadlocks. ACM Computing Surveys 3（2）：67-78, June 1971.</p>
<p>［24］</p>
<p>D. Cohen. On holy wars and a plea for peace.</p>
<p>IEEE Computer 14（10）：48-54, October 1981.</p>
<p>P. J. Courtois, F. Heymans, and D. L. Parnas.</p>
<p>Concurrent control with “readers” and “writers.&quot;Commnications of the ACM 14（10）：667-068,1971.</p>
<p>［26］</p>
<p>C. Cowan, P. Wagle, C. Pu, S. Beattie, and J. Walpole. Buffer overflows: Attacks and defenses for the vulnerability of the decade. In DARPA Information Survivability Conference and Expo （DISCEX）， volume 2, pages 119-129， March 2000.</p>
<p>［27］ J. H. Crawford. The i486 CPU: Executing instructions in one clock cycle. IEEE Micro 10（1）：27-36, February 1990.</p>
<p>［28］ V. Cuppu, B. Jacob, B. Davis, and T. Mudge.</p>
<p>A performance comparison of contemporary DRAM architectures. In Proceedings of the 2oth International Symposium on Computer Architecture （ISCA）， pages 222-233, ACM， 1999.</p>
<p>［29］</p>
<p>B. Davis, B. Jacob, and T. Mudge. The new DRAM interfaces: SDRAM, RDRAM, and variants. In Proceedings ofthe 3rd International Symposium on High Performance Computing （ISHPC）， volume 1940 of Lecture Notes in Computer Science, pages 26-31. Springer- Verlag, October 2000.</p>
<p>［30］</p>
<p>E. Demaine. Cache-oblivious algorithms and data structures. In Lecture Notes from the EEF Summer School on Massive Data Sets. BRICS， University of Aarhus, Denmark,2002.</p>
<p>［31］</p>
<p>E. W. Dijkstra. Cooperating sequential processes. Technical Report EWD-123， Technological University, Eindhoven, the Netherlands, 1965.</p>
<p>［32］ C. Ding and K. Kennedy. Improving cache performance of dynamic applications through data and computation reorganizations at run time. In Proceedings of the 1999 ACM Conference on Programming Language Design and Implementation （PL DI）， pages 229-241.</p>
<p>ACM, May 1999.</p>
<p>［33］</p>
<p>M. Dowson. The Ariane S software failure.</p>
<p>SIGSOFT Sofrare Engineering Notes 22（2）：84， 1997.</p>
<p>［34］ U. Drepper. User-level IPv6 programming introduction. Available at http://www.akkadia .org/drepper/userapi-ipv6.html, 2008.</p>
<p>［35］</p>
<p>M. W. Eichen and J. A. Rochlis. With micro- scope and tweezers: An analysis of the Internet virus of November, 1988. In Proceedings of the IEEE Symposium on Research in Security and Privacy, pages 326-343.IEEE, 1989.</p>
<p>［36］</p>
<p>ELF-64 Object File Format, Version 1.5 Draft 2， 1998. Available at http://www.uclibc.org/docs/ elf-64-gen.pdf.</p>
<p>［37］ R. Fielding, J. Gettys, J. Mogul, H. Frystyk， L. Masinter, P. Leach, and T. Berners-Lee.</p>
<p>Hypertext transfer protocol- HTTP/1.1. RFC 2616, 1999.</p>
<p>［38］</p>
<p>M. Frigo, C. E. Leiserson, H. Prokop, and S. Ramachandran. Cache-oblivious algorithms.</p>
<p>In Proceedings of the 40th IEEE Symposium on Foundations of Computer Science （FOCS）， pages 285-297. IEEE, August 1999.</p>
<p>［39］</p>
<p>M. Frigo and V. Strumpen. The cache complex- ity of multithreaded cache oblivious algorithms， In Proceedings ofthe 18th Symposium on Paral- lelism in Algorithms and Architectures （SPAA）， Pages 271-280. ACM, 2006.</p>
<p>［40］ G. Gibson, D. Nagle, K. Amiri, J. Butler， F. Chang, H. Gobioff, C. Hardin, E. Riedel， D. Rochberg, and J. Zelenka. A cost-effective， high-bandwidth storage architecture. In Proceedings ofthe 8th International Conference on Architectural Support for Programming Languages and Operating Systems （ASPLOS）， pages 92-103. ACM, October 1998.</p>
<p>［41］ G. Gibson and R. Van Meter. Network attached storage architecture. Communications of the ACM 43（11）：37-45, November 2000.</p>
<p>［42］</p>
<p>Google. IPv6 Adoption. Available at http:// www.google.com/intl/en/ipv6/statistics.html.</p>
<p>［43］ J. Gustafson. Reevaluating Amdahl&#x27;s law.</p>
<p>Communications of the ACM 31（5）：532-533， August 1988.</p>
<p>［44］ L. Gwennap. New algorithm improves branch prediction. Microprocessor Report 9（4）， March 1995.</p>
<p>［45］ S. P. Harbison and G. L. Steele, Jr. C, A Reference Manual, Fifh Edition. Prentice Hall， 2002.</p>
<p>［46］ J. L. Hennessy and D. A. Patterson. Computer</p>
<h2>第 770 页</h2>
<p>Architecture: A Quantitative Approach, Fifth Edition. Morgan Kaufmann, 2011.</p>
<p>［47］ M. Herlihy and N. Shavit. The Art of Multi- processor Programming. Morgan Kaufmann， 2008.</p>
<p>［48］</p>
<p>C.A. R. Hoare. Monitors: An operating system structuring concept. Communications of the ACM 17（10）：549-557, October 1974.</p>
<p>［49］</p>
<p>Intel Corporation. Intel 64 and IA-32 Ar- Chitectures Optimization Reference Manual.</p>
<p>Available at http://www.intel.com/content/ www/us/en/processors/architectures-software- developer-manuals.html.</p>
<p>［50］</p>
<p>Intel Corporation. Intel 64 and 14-32 Ar- chirectures Softare Developer&#x27;s Manual， Volume 1: Basic Architecture. Available at http://www.intel.com/content/www/us/en/ processors/architectures-software-developer- manuals.html.</p>
<p>［51］</p>
<p>Intel Corporation. Intel 64 and IA-32 Ar- Chitectures Software Developer&#x27;s Manual， Volume 2: Instruction Set Reference. Available at http://www.intel.com/content/www/us/en/ processors/architectures-software-developer- manuals.html.</p>
<p>［S2］</p>
<p>Intel Corporation. Intel 64 and 1A-32 Architec- tures Sofiware Developer&#x27;s Manual, Volume 3a：</p>
<p>System Programming Guide, Part 1. Available at http://www.intel.com/content/www/us/en/ processors/architectures-software-developer- manuals.html.</p>
<p>&#x27;S3］</p>
<p>Intel Corporation. Intel Solid-State Drive 730 Series: Product Specification. Available at http://www.intel.com/content/www/us/en/solid- state-drives/ssd-730-series-spec.html.</p>
<p>［54］</p>
<p>Intel Corporation. Tool Interface Standards Portable Formats Specification, Version 1.1， 1993. Order number 241597.</p>
<p>［55］</p>
<p>F. Jones, B. Prince, R. Norwood, J. Hartigan， W. Vogley, C. Hart, and D. Bondurant.</p>
<p>Memory—a new era of fast dynamic RAMs （for video applications）. IEEE Spectrum, pages 43-45, October 1992.</p>
<p>［56］</p>
<p>R. Jones and R. Lins. Garbage Collection：</p>
<p>Algorithms for Automatic Dynamic Memory Management. Wiley, 1996.</p>
<p>［57］</p>
<p>M. Kaashoek, D. Engler, G. Ganger, H. Briceo， R. Hunt, D. Maziers, T. Pinckney, R. Grimm， J. Jannotti, and K. MacKenzie. Application performance and flexibility on Exokernel systems. In Proceedings of the I6th ACM Symposium on Operating System Principles （SOSP）. pages 52-65. ACM, October 1997.</p>
<p>参考文献</p>
<p>735</p>
<p>［58］</p>
<p>R. Katz and G. Borriello. Contemporary Logic Design, Second Edition. Prentice Hall, 2005.</p>
<p>［59］</p>
<p>B. W. Kernighan and R. Pike. The Practice of Programming. Addison-Wesley, 1999.</p>
<p>［60］</p>
<p>B. Kernighan and D. Ritchie. The C Program- ming Language, First Edition. Prentice Hall， 1978，</p>
<p>［61］</p>
<p>B. Kernighan and D. Ritchie. The C Program- ming Language, Second Edition. Prentice Hall， 1988.</p>
<p>［02］</p>
<p>Michael Kerrisk. The Linux Programming Interface. No Starch Press,2010.</p>
<p>［63］</p>
<p>T. Kilburn, B. Edwards, M. Lanigan, and F. Sumner. One-level storage system. IRE Transactions on Electronic Computers EC- 11:223-235, April 1962.</p>
<p>［64］</p>
<p>D. Knuth. The Art of Computer Programming， Volume 1: Fundamental Algorithms, Third Edition. Addison-Wesley, 1997.</p>
<p>［65］</p>
<p>J. Kurose and K. Ross. Computer Networking: A Top-Down Approach, Sixth Edition. Addison- Wesley, 2012.</p>
<p>［66］ M. Lam, E. Rothberg, and M. Wolf. The cache performance and optimizations of blocked algorithms. In Proceedings of the 4th International Conference on Architectural Support for Programming Languages and Operating Systems （ASPLOS）， pages 63-74.</p>
<p>ACM, April 1991.</p>
<p>［67］ D. Lea. A memory allocator. Available at http://gee.cs.oswego.edu/dl/html/malloc.html， 1996.</p>
<p>［68］ C. E. Leiserson and J. B. Saxe. Retiming synchronous circuitry. Algorithmica 6（1-6）， June 1991.</p>
<p>［69］ J. R. Levine. Linkers and Loaders. Morgan Kaufmann, 1999.</p>
<p>［70］</p>
<p>David Levinthal. Performance Analysis Guide for Intel Core i7 Processor and Intel Xeon 5500 Processors. Available at https://software .intel.com/sites/products/collateral/hpc/vtune/ performance_analysis_guide.pdf.</p>
<p>［71］ C. Lin and L. Snyder. Principles of Parallel Programming. Addison Wesley, 2008.</p>
<p>［72］ Y. Lin and D. Padua. Compiler analysis of irregular memory accesses. In Proceedings of the 2000 ACM Conference on Programming Language Design and Implementation （PLDI）， pages 157-168. ACM, June 2000.</p>
<p>［73］ J.L. Lions. Ariane 5 Flight 501 failure. Technical Report, European Space Agency, July 1996.</p>
<h2>第 771 页</h2>
<p>736</p>
<p>参考文献</p>
<p>［74］ S. Macguire. Writing Solid Code. Microsoft ［87］ W. Pugh. The Omega test: A fast and practical Press, 1993.</p>
<p>integer programming algorithm for depen- ［75］</p>
<p>S. A. Mahlke, W. Y. Chen, J. C. Gyllenhal, and dence analysis. Communications of the ACM W. W. Hwu. Compiler code transformations for 35（8）：102-114, August 1992.</p>
<p>superscalar-based high-performance systems.</p>
<p>［88］</p>
<p>W. Pugh. Fixing the Java memory model. In In Proceedings of the 1992 ACM/IEEE Proceedings of the ACM Conference on Java Conference on Supercomputing, pages 808-817.</p>
<p>Grande, pages 89-98. ACM, June 1999.</p>
<p>ACM, 1992.</p>
<p>［89］</p>
<p>J. Rabaey, A. Chandrakasan, and B. Nikolic.</p>
<p>［76］</p>
<p>E. Marshall. Fatal error: How Patriot over- Digital Integrated Circuits: A Design Perspec- looked a Scud. Science, page 1347, March 13， tive, Second Edirion. Prentice Hall, 2003.</p>
<p>1992</p>
<p>［90］</p>
<p>J. Reinders. Intel Threading Building Blocks.</p>
<p>［77］ M. Matz, J. Hubitka, A.Jaeger, and M.Mitchell.</p>
<p>O&#x27;Reilly, 2007.</p>
<p>System V application binary interface AMD64 architecture processor supplement. Technical ［91］ D. Ritchie. The evolution of the Unix time- Report, x86-64.org, 2013. Available at http:// sharing system. AT&amp;T Bell Laboratories www.x86-64.org/documentation_folder/abi-0 Technical Journal 63（6 Part 2）：1577-1593， .99.pdf.</p>
<p>October 1984.</p>
<p>［78］ J. Morris, M. Satyanarayanan, M. Conner， ［92］ D. Ritchie. The development of the Clanguage.</p>
<p>J. Howard, D. Rosenthal, and F. Smith. Andrew：</p>
<p>In Proceedings of the 2nd ACM SIGPLAN A distributed personal computing environment.</p>
<p>Conference on History of Programming Communications of the ACM, pages 184-201， Languages, pages 201-208. ACM, April 1993.</p>
<p>March 1986.</p>
<p>［79］ T. Mowry, M. Lam, and A. Gupta. Design ［93］</p>
<p>D. Ritchie and K. Thompson. The Unix time- and evaluation of a compiler algorithm sharing system. Communications of the ACM for prefetching. In Proceedings of the 5th 17（7）：365-367, July 1974.</p>
<p>International Conference on Architectural ［94］</p>
<p>M. Satyanarayanan, J. Kistler, P. Kumar， Support for Programming Languages and M. Okasaki, E. Siegel, and D. Steere. Coda：</p>
<p>Operating Systems （ASPLOS）， pages 62-73.</p>
<p>A highly available file system for a distributed ACM, October 1992.</p>
<p>workstation environment. IEEE Transactions ［80］ S. S. Muchnick. Advanced Compiler Design and on Computers 39（4）：447-459, April 1990.</p>
<p>Implementation. Morgan Kaufmann, 1997.</p>
<p>［95］</p>
<p>J. Schindler and G. Ganger. Automated disk ［81］ S. Nath and P. Gibbons. Online maintenance of drive characterization. Technical Report CMU- very large random samples on flash storage. In CS-99-176, School of Computer Science， Proceedings of VLDB, pages 970-983. VLDB Carnegie Mellon University, 1999.</p>
<p>Endowment, August 2008.</p>
<p>［90］ F. B. Schneider and K. P. Birman. The ［82］ M. Overton. Numerical Computing with IEEE monoculture risk put into context. IEEE Floating Point Arithmetic. SIAM, 2001.</p>
<p>Security and Privacy 7（1）：14-17, January 2009.</p>
<p>［83］ D. Patterson, G. Gibson, and R. Katz. A case for ［97］ R. C. Seacord. Secure Coding in C and C++， redundant arrays of inexpensive disks （RAID）.</p>
<p>Second Edition. Addison-Wesley, 2013.</p>
<p>In Proceedings of the 1998 ACM SIGMOD International Conference on Management of ［98］</p>
<p>R. Sedgewick and K. Wayne.Algorithms, Fourth Data, pages 109-116. ACM, June 1988.</p>
<p>Edition. Addison-Wesley, 2011.</p>
<p>［84］ L. Peterson and B. Davie. Computer Networks：</p>
<p>［99］</p>
<p>H. Shacham, M. Page, B. Pfaff, E.-J. Goh， A Systems Approach, Fifth Edition. Morgan N. Modadugu, and D. Boneh. On the effec- Kaufmann, 2011.</p>
<p>tiveness of address-space randomization.In ［85］</p>
<p>J. Pincus and B. Baker. Beyond stack smashing：</p>
<p>Proceedings of the 1lth ACM Conference on Recent advances in exploiting buffer overruns， Computer and Communications Security （CCS）， IEEE Security and Privacy 2（4）：20-27,2004.</p>
<p>pages 298-307.ACM,2004.</p>
<p>［86］ S. Przybylski. Cache and Memory Hierarchy ［100］ J. P. Shen and M. Lipasti. Modern Processor De- Design: A Performance-Directed Approach.</p>
<p>sign: Fundamentals of Superscalar Processors.</p>
<p>Morgan Kaufmann, 1990.</p>
<p>McGraw Hill,2005.</p>
<h2>第 772 页</h2>
<p>［101］ B. Shriver and B. Smith. The Anatomy of a High-Performance Microprocessor: A Systems Perspective. IEEE Computer Society, 1998.</p>
<p>［102］ A. Silberschatz, P. Galvin, and G. Gagne.</p>
<p>Operating Systems Concepts, Ninth Edition.</p>
<p>Wiley, 2014.</p>
<p>［103］ R. Skeel. Roundoff error and the Patriot missile.</p>
<p>SIAM News 25（4）：11, July 1992.</p>
<p>［104］ A. Smith. Cache memories. ACM Computing Surveys 14（3）， September 1982.</p>
<p>［105］ E. H. Spafford. The Internet worm program：</p>
<p>An analysis. Technical Report CSD-TR-823， Department of Computer Science, Purdue University, 1988.</p>
<p>［106］ W. Stallings. Operating Systems: Internals and Design Principles, Eighth Edition. Prentice Hall,2014.</p>
<p>［107］ W. R. Stevens. TCP/IP Illustrated, Volume 3：</p>
<p>TCP for Transactions, HTTP, NNTP and the Unix Domain Protocols. Addison-Wesley, 1996.</p>
<p>［108］ W. R. Stevens. Unix Network Programming：</p>
<p>Interprocess Communications, Second Edition， volume 2. Prentice Hall, 1998.</p>
<p>［109］ W. R. Stevens and K. R. Fall. TCP/IP Mllustrated， Volume 1: The Protocols, Second Edition.</p>
<p>Addison-Wesley, 2011.</p>
<p>［110］ w. R. Stevens, B. Fenner, and A. M. Rudoftf.</p>
<p>Unix Network Programming: The Sockets Networking API, Third Edition, volume 1.</p>
<p>Prentice Hall, 2003.</p>
<p>［111］ W. R. Stevens and S. A. Rago. Advanced Programming in the Unix Environment, Third Edition. Addison-Wesley, 2013.</p>
<p>［112］ T. Stricker and T. Gross. Global address space, non-uniform bandwidth: A memory system performance characterization of parallel systems. In Proceedings ofthe 3rd International Symposium on High Performance Computer 参考文献</p>
<p>737</p>
<p>Architecture （HPCA）， pages 168-179. IEEE， February 1997.</p>
<p>［113］ A. S. Tanenbaum and H. Bos. Modern Operating Systems, Fourth Edition. Prentice Hall,2015.</p>
<p>［114］ A. S. Tanenbaum and D. Wetherall. Computer Networks, Fifth Edition. Prentice Hall, 2010.</p>
<p>［115］ K. P. Wadleigh and L. L. Crawford. Softvare Optimization for High-Performance Comput- ing: Creating Faster Applications. Prentice Hall， 2000.</p>
<p>［116］ J. F. Wakerly. Digital Design Principles and Practices, Fourth Edition. Prentice Hall, 2005.</p>
<p>［117］ M. V. Wilkes. Slave memories and dynamic storage allocation. IEEE Transactions on Electronic Computers, EC-14（2）， April 1965.</p>
<p>［118］ P. Wilson, M. Johnstone, M. Neely, and D. Boles.</p>
<p>Dynamic storage allocation: A survey and critical review. In International Workshop on Memory Management, volume 986 of Lecture Notes in Computer Science, pages 1-116.</p>
<p>Springer-Verlag, 1995.</p>
<p>［119］ M. Wolf and M. Lam. A data locality algorithm.</p>
<p>In Proceedings of the 1991 ACM Conference on Programming Language Design and Implementation （PLDI）， pages 30-44, June 1991.</p>
<p>［120］ G. R. Wright and W. R. Stevens. TCP/IP Illustrated, Volume 2: The Implementation.</p>
<p>Addison-Wesley, 1995.</p>
<p>［121］ J. Wylie, M. Bigrigg, J. Strunk, G. Ganger， H. Kiliccote, and P. Khosla. Survivable information storage systems. IEEE Computer 33:61-68, August 2000.</p>
<p>［122］ T.-Y. Yeh and Y.N. Patt. Alternative implemen- tation of two-level adaptive branch prediction.</p>
<p>In Proceedings ofthe 19th Annual International Symposium on Computer Architecture （ISCA）， pages 451-461. ACM, 1998.</p>
<h2>第 773 页</h2>
<p>深入理解计算机系统 原书第3版</p>
<p>Computer Systems A Programmer&#x27;s Perspective Third Edition 基于该教材的北大“计算机系统导论”课程实施已有五年，得到了学生的广泛赞誉，学生们通过 这门课程的学习建立了完整的计算机系统的知识体系和整体知识框架，养成了良好的编程习惯并获得 了编写高性能、可移植和健壮的程序的能力，奠定了后续学习操作系统、编译、计算机体系结构等专 业课程的基础。北大的教学实践表明，这是一本值得推荐采用的好教材。本书第3版采用最新x86-04架 构来贯穿各部分知识。我相信，该书的出版将有助于国内计算机系统教学的进一步改进，为培养从事 系统级创新的计算机人才奠定很好的基础。</p>
<p>梅么 中国科学院院士/发展中国家科学院院士 以低年级开设“深入理解计算机系统”课程沩基础，我先后在复旦大学和上海交通大学软件学院 主导了激进的教学改革现在我课题组的青年教师全部是首批经历此教学改革的学生。本科的扎实 基础为他们从事系统软件的研究打下了良好的基础……师资力堂的补充又为推进更加激进的教学改革 创造了条件。</p>
<p>-减斌宁 上海交通大学软件学院院长</p>
<p>本书是一本将计算机软件和硬件理论结合讲述的经典教程，内容覆盖计算机导论、体系结构和处理器 设计等多门课程。本书的最大优点是从程序员的角度描述计算机系统的实现细节，通过描述程序是如何映 射到系统上，以及程序是如何执行的，使读者更好地理解程序的行为，以及程序效率低下的原因。</p>
<p>和第2版相比，本版内容上最大的变化是，从以IA32和x86-64为基础转变为完全以x86-64为基础。主 要更新如下：</p>
<p>• 基于x86-64，大量地重写代码，首次介绍对处理浮点数据的程序的机器级支持。</p>
<p>• 处理器体系结构修改为支持64位字和操作的设计。</p>
<p>• 引入更多的功能单元和更复杂的控制逻辑，使基于程序数据流表示的程序性能模型预测更加可靠。</p>
<p>• 扩充关于用GOT和PLT创建与位置无关代码的讨论，描述了更加强大的链接技术（比如库打桩）。</p>
<p>• 增加了对信号处理程序更细致的描述，包括异步信号安全的函数等。</p>
<p>• 采用最新函数，更新了与协议无关和线程安全的网络编程。</p>
<p>1eaESOn</p>
<p>NIWAYS LERNING LIWAYTLEARNINGTAIWAYS LENRL 本书将陆续为读者提供丰富的学习资源， 扫描二维码加入本书社区，获得相关学习资源， 了解活动信息。</p>
<p>上架指导：计算机\基础</p>
<p>ISBN 978-7-111-54493-7 Pearson</p>
<p>www.pearson.com</p>
<p>投稿热线：（010）88379604 客服热线：</p>
<p>（010） 88378991</p>
<p>88361066</p>
<p>购书热线：（010） 68326294 88379649</p>
<p>68995259</p>
<p>华章网站：www.hzbook.com 网上购书：www.china-pub.com 数字阅读：www.hzmedia.com.cn wwnyonw</p>
<p>9 787111 544937</p>
<p>定价：139.00元</p>
</div>
