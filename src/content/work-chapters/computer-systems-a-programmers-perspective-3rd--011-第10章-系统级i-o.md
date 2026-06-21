---
title: "第10章 系统级I/O"
description: "第10章 HAP 系统级 1/O R 10 输入/输出（1/0）是在主存和外部设备（例如磁盘驱动器、终端和网络）之间复制数据的过 程。输入操作是从1/0设备复制数据到主存，而输出操作是从主存复制数据到1/0设备。 所有语言的运行时系统都提供执行I/0的较高级别的工具。例如，ANSI C提供标准 1/0库，包含像 printf和 scanf这样执行带缓冲区的1"
readerUrl: "/books/computer-systems-a-programmers-perspective-3rd/011-第10章-系统级i-o.pdf"
sourceUrl: "授权 PDF：深入理解计算机系统 原书第3版 ,兰德尔E.布莱恩特 ,P737 ,2016.11.pdf，页 657-676"
workSlug: "computer-systems-a-programmers-perspective-3rd"
workTitle: "深入理解计算机系统（原书第 3 版）"
chapterSlug: "011-第10章-系统级i-o"
order: 11
categories: ["计算机基础", "系统"]
tags: ["CSAPP", "计算机系统", "C", "体系结构"]
---
<div class="imported-document imported-pdf-document">
<h2>第10章 系统级I/O</h2>
<h2>第 657 页</h2>
<h3>第10章</h3>
<p>HAP</p>
<p>系统级 1/O</p>
<p>R</p>
<p>10</p>
<p>输入/输出（1/0）是在主存和外部设备（例如磁盘驱动器、终端和网络）之间复制数据的过 程。输入操作是从1/0设备复制数据到主存，而输出操作是从主存复制数据到1/0设备。</p>
<p>所有语言的运行时系统都提供执行I/0的较高级别的工具。例如，ANSI C提供标准 1/0库，包含像 printf和 scanf这样执行带缓冲区的1/0函数。C++语言用它的重载操 作符&lt;&lt;（输入）和＞&gt;（输出）提供了类似的功能。在Linux 系统中，是通过使用由内核提供的 系统级 Unix 1/O函数来实现这些较高级别的1/0函数的。大多数时候，高级别1/0函数 工作良好，没有必要直接使用Unix I/0。那么为什么还要麻烦地学习 Unix 1/0呢？</p>
<p>• 了解Unix 1/O将帮助你理解其他的系统概念。1/0是系统操作不可或缺的一部分，因 此，我们经常遇到1/O和其他系统概念之间的循环依赖。例如，1/0在进程的创建和 执行中扮演着关键的角色。反过来，进程创建又在不同进程间的文件共享中扮漬着关 键角色。因此，要真正理解1/O，你必须理解进程，反之亦然。在对存储器层次结构、 链接和加载、进程以及虚拟内存的讨论中，我们已经接触了1/0的某些方面。既然你 对这些概念有了比较好的理解，我们就能闭合这个循环，更加深人地研究1/0。</p>
<p>• 有时你除了使用Unix I/O以外别无选择。在某些重要的情况中，使用高级1/0函 数不太可能，或者不太合适。例如，标准1/O库没有提供读取文件元数据的方式， 例如文件大小或文件创建时间。另外，1/0库还存在一些问题，使得用它来进行网 络编程非常冒险。</p>
<p>这一章介绍 Unix 1/O和标准1/0的一般概念，并且向你展示在C程序中如何可靠地 使用它们。除了作为一般性的介绍之外，这一章还为我们随后学习网络编程和并发性奠定 坚实的基础。</p>
<p>10. 1 Unix 1/O</p>
<p>一个 Linux 文件就是一个 m 个字节的序列：</p>
<p>Bo,B，⋯Bk，⋯Bm-1</p>
<p>所有的1/0设备（例如网络、磁盘和终端）都被模型化文件，而所有的输人和输出都被当 作对相应文件的读和写来执行。这种将设备优雅地映射为文件的方式，允许 Linux 内核引 出一个简单、低级的应用接口，称为 Unix 1/O，这使得所有的输人和输出都能以一种统 一且一致的方式来执行：</p>
<p>• 打开文件。一个应用程序通过要求内核打开相应的文件，来宣告它想要访问一个 1/0设备。内核返回一个小的非负整数，叫做描述符，它在后续对此文件的所有操 作中标识这个文件。内核记录有关这个打开文件的所有信息。应用程序只需记住这 个描述符。</p>
<p>• Linux shell创建的每个进程开始时都有三个打开的文件：标准输入（描述符为0）、标准 输出（描述符1）和标准错误（描述符为2）。头文件&lt;unistd.h&gt;定义了常量STDIN FILENO、STDOUT_FILENO 和STDERR_FILENO，它们可用来代替显式的描述符值。</p>
<h2>第 658 页</h2>
<h3>第10章 系统级 I/O</h3>
<p>623</p>
<p>• 改变当前的文件位置。对于每个打开的文件，内核保持着一个文件位置k，初始为 0。这个文件位置是从文件开头起始的字节偏移量。应用程序能够通过执行 seek 操 作，显式地设置文件的当前位置为k。</p>
<p>• 读写文件。一个读操作就是从文件复制n＞0个字节到内存，从当前文件位置k开 始，然后将k增加到k十n。给定一个大小为 m 字节的文件，当k≥m 时执行读操作 会触发一个称为 end-of-file（EOF）的条件，应用程序能检测到这个条件。在文件结 尾处并没有明确的“EOF 符号”。</p>
<p>类似地，写操作就是从内存复制n＞0个字节到一个文件，从当前文件位置k 开始，然后更新k。</p>
<p>• 关闭文件。当应用完成了对文件的访问之后，它就通知内核关闭这个文件。作为响 应，内核释放文件打开时创建的数据结构，并将这个描述符恢复到可用的描述符池 中。无论一个进程因为何种原因终止时，内核都会关闭所有打开的文件并释放它们 的内存资源。</p>
<h3>10.2 文件</h3>
<p>每个 Linux 文件都有一个类型（type）来表明它在系统中的角色：</p>
<p>• 普通文件（regular file）包含任意数据。应用程序常常要区分文本文件（text file）和二 进制文件（binary file），文本文件是只含有 ASCII 或 Unicode 字符的普通文件；二 进制文件是所有其他的文件。对内核而言，文本文件和二进制文件没有区别。</p>
<p>Linux 文本文件包含了一个文本行（text line）序列，其中每一行都是一个字符序列， 以一个新行符（“\n”）结束。新行符与 ASCII 的换行符（LF）是一样的，其数字值为Ox0a。</p>
<p>• 目录（directory）是包含一组链接（link）的文件，其中每个链接都将一个文件名 （filename）映射到一个文件，这个文件可能是另一个目录。每个目录至少含有两个 条目：“.”是到该目录自身的链接，以及“ ”是到目录层次结构（见下文）中父目</p>
<p>录（parent directory）的链接。你可以用 mkdir 命令创建一个目录，用1s 查看其内 容，用 rmdir删除该目录。</p>
<p>• 套接字（socket）是用来与另一个进程进行跨网络通信的文件（11.4节）。</p>
<p>其他文件类型包含命名通道（named pipe）、符号链接（symbolic link），以及字符和块 设备（character and block device），这些不在本书的讨论范畴。</p>
<p>Linux 内核将所有文件都组织成一个目录层次结构（directory hierarchy），由名为/（斜 杠）的根目录确定。系统中的每个文件都是根目录的直接或间接的后代。图10-1显示了 Linux 系统的目录层次结构的一部分。</p>
<p>bin/</p>
<p>bash</p>
<p>dev/</p>
<p>home/</p>
<p>uSr/</p>
<p>tty1</p>
<p>grOuP</p>
<p>passwd/</p>
<p>droh/ bryant/</p>
<p>include/</p>
<p>hell0.c</p>
<p>stdio.h</p>
<p>sys/</p>
<p>unistd.h</p>
<p>图 10-1</p>
<p>Linux 目录层次的一部分。尾部有斜杠表示是目录 bin/</p>
<p>vim</p>
<h2>第 659 页</h2>
<p>624</p>
<p>第三部分 程序间的交互和通信</p>
<p>作为其上下文的一部分，每个进程都有一个当前工作目录（current working directory） 来确定其在目录层次结构中的当前位置。你可以用cd 命令来修改shell 中的当前工作 目录。</p>
<p>目录层次结构中的位置用路径名（pathname）来指定。路径名是一个字符串，包括一个 可选斜杠，其后紧跟一系列的文件名，文件名之间用斜杠分隔。路径名有两种形式：</p>
<p>• 绝对路径名（absolute pathname）以一个斜杠开始，表示从根节点开始的路径。例 如，在图10-1中，hello.c的绝对路径名为/home/droh/hello.c。</p>
<p>• 相对路径名（relative pathname）以文件名开始，表示从当前工作目录开始的路径。</p>
<p>例如，在图 10-1中，如果/home/droh 是当前工作目录，那么he11o.c 的相对路径 名就是./hel1o.c。反之，如果/home/bryant 是当前工作目录，那么相对路径名 就是../home/droh/hello.c.</p>
<h3>10.3 打开和关闭文件</h3>
<p>进程是通过调用open 函数来打开一个已存在的文件或者创建一个新文件的：</p>
<p>#include &lt;sys/types.h&gt; #include &lt;sys/stat.h&gt; #include &lt;fcntl.h&gt; int open（char *filename,int flags, mode_t mode）；</p>
<p>返回：若成功则为新文件描述符，若出错为一1。</p>
<p>open 函数将 filename 转换为一个文件描述符，并且返回描述符数字。返回的描述符总 是在进程中当前没有打开的最小描述符。flags 参数指明了进程打算如何访问这个文件：</p>
<p>• O_RDONLY：只读。</p>
<p>• O_WRONLY：只写。</p>
<p>• O_RDWR：可读可写。</p>
<p>例如，下面的代码说明如何以读的方式打开一个已存在的文件：</p>
<p>fd = Open（&quot;foo.txt&quot;，O_RDONLY,0）；</p>
<p>flags 参数也可以是一个或者更多位掩码的或，为写提供给一些额外的指示：</p>
<p>• O_CREAT：如果文件不存在，就创建它的一个截断的（truncated）（空）文件。</p>
<p>• O_TRUNC：如果文件已经存在，就截断它。</p>
<p>•O_APPEND：在每次写操作前，设置文件位置到文件的结尾处。</p>
<p>例如，下面的代码说明的是如何打开一个已存在文件，并在后面添加一些数据：</p>
<p>fd = Dpen（&quot;foo.txt&quot;，0_WRONLYIO_APPEND, O）；</p>
<p>mode 参数指定了新文件的访问权限位。这些位的符号名字如图10-2所示。</p>
<p>作为上下文的一部分，每个进程都有一个 umask，它是通过调用 umask 函数来设置 的。当进程通过带某个 mode 参数的open 函数调用来创建一个新文件时，文件的访问权 限位被设置为 mode &amp; ~umask。例如，假设我们给定下面的 mode 和 umask 默认值：</p>
<p>#define DEF_MODE S_IRUSRIS_IWUSRIS_IRGRPIS_IWGRPIS_IROTHIS_IWOTH #define DEF_UMASK S_IWGRPIS_IWOTH 接下来，下面的代码片段创建一个新文件，文件的拥有者有读写权限，而所有其他的</p>
<h2>第 660 页</h2>
<h3>第10章 系统级I/0</h3>
<p>625</p>
<p>用户都有读权限：</p>
<p>umask（DEF_UMASK）；</p>
<p>fd = Open（&quot;foo.txt&quot;，0_CREATIO_TRUNCIO_WRONLY, DEF_MODE）；</p>
<p>掩码</p>
<p>S_IRUSR</p>
<p>S_IWUSR</p>
<p>S_IXUSR</p>
<p>S_IRGRP</p>
<p>S_IWGRP</p>
<p>S_IXGRP</p>
<p>S_IROTH</p>
<p>S_IWOTH</p>
<p>S_IXOTH</p>
<p>描述</p>
<p>使用者（拥有者）能够读这个文件</p>
<p>使用者（拥有者）能够写这个文件</p>
<p>使用者（拥有者）能够执行这个文件</p>
<p>拥有者所在组的成员能够读这个文件</p>
<p>拥有者所在组的成员能够写这个文件</p>
<p>拥有者所在组的成员能够执行这个文件</p>
<p>其他人（任何人）能够读这个文件</p>
<p>其他人（任何人）能够写这个文件</p>
<p>其他人（任何人）能够执行这个文件</p>
<p>图10-2</p>
<p>访问权限位。在 sys/stat.h 中定义 最后，进程通过调用close 函数关闭一个打开的文件。</p>
<p>#include &lt;unistd.h&gt; int close （int fd）；</p>
<p>返回：若成功則为O，若出错则为一1。</p>
<p>关闭一个已关闭的描述符会出错。</p>
<p>练习题10.1 下面程序的输出是什么？</p>
<p>#include &quot;csapp.h&quot; 2</p>
<p>.3</p>
<p>4</p>
<p>6</p>
<p>7</p>
<p>9</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>int</p>
<p>main（）</p>
<p>｛</p>
<p>int fd1,fd2；</p>
<p>fd1 = Open（&quot;foo.txt&quot;，O_RDONLY,O）；</p>
<p>Close （fd1）；</p>
<p>fd2 = Open（&quot;baz.txt&quot;， O_RDONLY, 0）；</p>
<p>printf（&quot;fd2 = %aln&quot;，fd2）；</p>
<p>exit（O）；</p>
<p>｝</p>
<p>10.4</p>
<p>，读和写文件</p>
<p>应用程序是通过分别调用 read 和 write 函数来执行输人和输出的。</p>
<p>#include &lt;unistd.h&gt; ssize_t read（int fd, void *buf,size_t n）；</p>
<p>返回：若成功則为读的字节数，若EOF则为0，若出错为一1。</p>
<p>ssize_t write（int fd, const void *buf, size_t n）；</p>
<p>返回：若成功则为写的字节数，若出错则为一1。</p>
<h2>第 661 页</h2>
<p>626</p>
<p>第三部分 程序间的交互和通信</p>
<p>read 函数从描述符为 fd 的当前文件位置复制最多n个字节到内存位置buf。返回值一1 表示一个错误，而返回值。表示 EOF。否则，返回值表示的是实际传送的字节数量。</p>
<p>write 函数从内存位置buf复制至多n个字节到描述符Ed 的当前文件位置。图10-3展 示了一个程序使用 read 和 write 调用一次一个字节地从标准输人复制到标准输出。</p>
<p>- code/io/cpstdin.c #include &quot;csapp.h&quot; 2</p>
<p>3</p>
<p>4</p>
<p>5</p>
<p>6</p>
<p>int main（void）</p>
<p>｛</p>
<p>Char C；</p>
<p>while（Read（STDIN_FILENO， &amp;c,1） ！= 0） Write（STDOUT_FILENO，&amp;C，1）；</p>
<p>exit（O）；</p>
<p>9</p>
<p>10</p>
<p>｝</p>
<p>code/io/cpstdin.c</p>
<p>图10-3 一次一个字节地从标准输入复制到标准输出 通过调用 1seek 函数，应用程序能够显示地修改当前文件的位置，这部分内容不在我 们的讲述范围之内。</p>
<p>旁注</p>
<p>ssize_t 和size_t有些什么区别？</p>
<p>你可能已经注意到了，read函数有一个 size t的输入参数和一个ssize_t的返 回值。那么这两种类型之间有什么区别呢？在x86-64 系统中，size_t被定义为 un- signed long，而ssize_t（有符号的大小）被定义为 long。read函数返回一个有符号 的大小，而不是一个无符号大小，这是因为出错时它必须返回一1。有趣的是，返回一 个一1的可能性使得 read的最大值减小了一半。</p>
<p>在某些情况下，read 和 write 传送的字节比应用程序要求的要少。这些不足值（short count）不表示有错误。出现这样情况的原因有：</p>
<p>• 读时遇到 EOF。假设我们准备读一个文件，该文件从当前文件位置开始只含有20 多个字节，而我们以50个字节的片进行读取。这样一来，下一个 read返回的不足 值为20，此后的 read将通过返回不足值0来发出 EOF 信号。</p>
<p>• 从终端读文本行。如果打开文件是与终端相关联的（如键盘和显示器），那么每个 read 函数将一次传送一个文本行，返回的不足值等于文本行的大小。</p>
<p>• 读和写网络套接字（socket）。如果打开的文件对应于网络套接字（11.4节），那么内 部缓冲约束和较长的网络延迟会引起 read 和 write 返回不足值。对 Linux 管道 （pipe）调用 read 和write时，也有可能出现不足值，这种进程间通信机制不在我 们讨论的范围之内。</p>
<p>实际上，除了 EOF，当你在读磁盘文件时，将不会遇到不足值，而且在写磁盘文件时， 也不会遇到不足值。然而，如果你想创建健壮的（可靠的）诸如 Web 服务器这样的网络应用， 就必须通过反复调用 read 和 write 处理不足值，直到所有需要的字节都传送完毕。</p>
<h3>10.5 用RIO 包健壮地读写</h3>
<p>在这一小节里，我们会讲述一个1/0包，称 RIO（Robust 1/O，健壮的I/0）包，它</p>
<h2>第 662 页</h2>
<h3>第10章 系统级 I/O</h3>
<p>627</p>
<p>会自动为你处理上文中所述的不足值。在像网络程序这样容易出现不足值的应用中，RIO 包提供了方便、健壮和高效的1/0。RIO 提供了两类不同的函数：</p>
<p>• 无缓冲的输入输出函数。这些函数直接在内存和文件之间传送数据，没有应用级缓 冲。它们对将二进制数据读写到网络和从网络读写二进制数据尤其有用。</p>
<p>• 带缓冲的输入函数。这些函数允许你高效地从文件中读取文本行和二进制数据，这 些文件的内容缓存在应用级缓冲区内，类似于为 printf这样的标准1/0函数提供 的缓冲区。与［110］中讲述的带缓冲的1/O例程不同，带缓冲的RIO 输入函数是线 程安全的（12.7.1节），它在同一个描述符上可以被交错地调用。例如，你可以从一 个描述符中读一些文本行，然后读取一些二进制数据，接着再多读取一些文本行。</p>
<p>我们讲述 RIO例程有两个原因。第一，在接下来的两章中，我们开发的网络应用中使用 了它们；第二，通过学习这些例程的代码，你将从总体上对 Unix I/O有更深人的了解。</p>
<h3>10.5.1 RIO的无缓冲的输入输出函数</h3>
<p>通过调用 rio</p>
<p>readn 和 rio_writen 函数，应用程序可以在内存和文件之间直接传送数据。</p>
<p>#include &quot;csapp.h&quot; ssize_t rio_readn（int fd, void *usrbuf,size_t n）；</p>
<p>ssize_t rio_writen（int fd, void *usrbuf,size_t n）；</p>
<p>返回：若成功则为传送的字节数，若EOF 則为0（只对 rio_readn 而言），若出错则为一1。</p>
<p>rio_readn 函数从描述符 Ed的当前文件位置最多传送n个字节到内存位置usrbuf。</p>
<p>类似地，rio_writen 函数从位置 usrbuf 传送n个字节到描述符fd。rio_read 函数在遇 到 EOF 时只能返回一个不足值。rio_writen 函数决不会返回不足值。对同一个描述符， 可以任意交错地调用 rio_readn 和 rio_writen。</p>
<p>图10-4显示了rio_readn 和 rio_writen的代码。注意，如果 rio readn 和 rio</p>
<p>writen函数被一个从应用信号处理程序的返回中断，那么每个函数都会手动地重启 read 或 write。为了尽可能有较好的可移植性，我们允许被中断的系统调用，且在必要时重启它们。</p>
<h3>10.5.2 RIO 的带缓冲的输入函数</h3>
<p>假设我们要编写一个程序来计算文本文件中文本行的数量，该如何来实现呢？一种方 法就是用read 函数来一次一个字节地从文件传送到用户内存，检查每个字节来查找换行 符。这个方法的缺点是效率不是很高，每读取文件中的一个字节都要求陷入内核。</p>
<p>一种更好的方法是调用一个包装函数（rio_readlineb），它从一个内部读缓冲区复制一个 文本行，当缓冲区变空时，会自动地调用 read 重新填满缓冲区。对于既包含文本行也包含二 进制数据的文件（例如11.5.3 节中描述的HTTP 响应），我们也提供了一个 rio_readn 带缓冲 区的版本，叫做rio_readnb，它从和 rio_readlineb 一样的读缓冲区中传送原始字节。</p>
<p>#include &quot;csapp.h&quot; void rio_readinitb（rio_t *rp, int fd）；</p>
<p>返回：无。</p>
<p>ssize_t rio_readlineb（rio_t *rp, void *usrbuf,size_t maxlen）；</p>
<p>ssize_t rio_readnb（rio_t *rp, void *usrbuf,size_t n）；</p>
<p>返回：若成功则为读的字节数，若EOF 则为0，若出错则为一1。</p>
<h2>第 663 页</h2>
<p>628</p>
<p>第三部分 程序间的交互和通信</p>
<p>- code/src/csapp.c 3</p>
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
<p>ssize_t rio_readn（int fd, void *usrbuf,size_t n） ｛</p>
<p>size_t nleft = n；</p>
<p>ssize_t nread；</p>
<p>char *bufp = usrbuf；</p>
<p>while （nleft &gt; 0） ｛ if（（nread</p>
<p>- read（fd, bufp, nleft））&lt;O）｛ if （errno == EINTR）/* Interrupted by sig handler return */ nread = 0；</p>
<p>/* and call readl again */ else</p>
<p>return -1；</p>
<p>/* errno set by read（）*/ ｝</p>
<p>else if （nread == 0） break；</p>
<p>nleft -= nread；</p>
<p>bufp += nread；</p>
<p>/* EOF */</p>
<p>｝</p>
<p>return （n - nleft）；</p>
<p>/* Return &gt;=0*/</p>
<p>1</p>
<p>2</p>
<p>3</p>
<p>4</p>
<p>S</p>
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
<p>｝</p>
<p>code/src/csapp.c</p>
<p>code/src/csapp.c</p>
<p>ssize_t rio_writen（int fd, void *usrbuf,size_t n） ｛</p>
<p>size_t nleft = n；</p>
<p>ssize_t nwritten；</p>
<p>char *bufp = usrbuf；</p>
<p>while （nleft &gt;o）｛</p>
<p>if （（nwritten = write（fd, bufp, nleft））^= O） ｛ if （errno == EINTR） /* Interrupted by sig handler return */ nwritten = 0；</p>
<p>/* and call write（） again */ else</p>
<p>return -1；</p>
<p>/* errno set by write（） */ ｝</p>
<p>nleft -= nwritten；</p>
<p>bufp += nwritten；</p>
<p>｝</p>
<p>return n；</p>
<p>｝</p>
<p>code/src/csapp.c</p>
<p>图 10-4</p>
<p>rio_readn 和 rio_writen 函数 每打开一个描述符，都会调用一次 rio_readinitb 函数。它将描述符fd 和地址 rp 处的一个类型为 rio_t的读缓冲区联系起来。</p>
<p>rio_readlineb 函数从文件 rp 读出下一个文本行（包括结尾的换行符），将它复制到 内存位置 usrbuf，并且用NULL（零）字符来结束这个文本行。r10_readlineb 函数最多 读 maxlen-1个字节，余下的一个字符留给结尾的 NULL 字符。超过 maxlen-1字节的文</p>
<h2>第 664 页</h2>
<h3>第10章 系统级1/0</h3>
<p>629</p>
<p>本行被截断，并用一个 NULL 字符结束。</p>
<p>rio_readnb 函数从文件 rp 最多读n个字节到内存位置uszbuf。对同一描述符，对 rio_readlineb 和 rio_readnb 的调用可以任意交叉进行。然而，对这些带缓冲的函数的 调用却不应和无缓冲的 rio</p>
<p>_readn 函数交叉使用。</p>
<p>在本书剩下的部分中将给出大量的RIO 函数的示例。图10-5展示了如何使用RIO函 数来一次一行地从标准输人复制一个文本文件到标准输出。</p>
<p>• codelio/cpfile.c #include &quot;csapp.h&quot; int main（int argc, char **argv） ｛</p>
<p>6</p>
<p>7</p>
<p>8</p>
<p>9</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>int n；</p>
<p>• rio_t rio；</p>
<p>char buf ［MAXLINE］；</p>
<p>Rio_readinitb（&amp;rio, STDIN_FILENO）；</p>
<p>while（（n = Rio_readlineb（&amp;rio, buf,MAXLINE））！= O） Rio_writen（STDOUT_FILENO, buf, n）；</p>
<p>｝</p>
<p>codelio/cpfile.c</p>
<p>图10-5 从标准输入复制一个文本文件到标准输出 图10-6展示了一个读缓冲区的格式，以及初始化它的 rio_readinitb 函数的代码。</p>
<p>rio_readinitb 函数创建了一个空的读缓冲区，并且将一个打开的文件描述符和这个缓 冲区联系起来。</p>
<p>code/include/csapp.h 1</p>
<p>2</p>
<p>6</p>
<p>7</p>
<p>#define RIO_BUFSIZE 8192 •typedef struct ｛</p>
<p>int rio_fd；</p>
<p>/* Descriptor for this internal buf */ int rio_cnt；</p>
<p>/* Unread bytes in internal buf */ char *rio_bufptr；</p>
<p>/* Next unread byte in internal buf */ char rio_buf ［RIO_BUFSIZE］；/* Internal butfer */ ｝ rio_t；</p>
<p>- code/include/csapp.h code/src/csapp.c</p>
<p>void rio_readinitb（rio_t *rp,int fd） ｛</p>
<p>rp-&gt;rio_fd - fd；</p>
<p>rP-&gt;rio_cnt = 0；</p>
<p>rP-&gt;rio_bufptr = rp-&gt;rio_buf；</p>
<p>｝</p>
<p>- code/src/csapp.c 图 10-6</p>
<p>一个类型为rio_t的读缓冲区和初始化它的rio_readinitb 函数 RIO 读程序的核心是图10-7所示的rio_read 函数。rio_read 函数是 Linux read函 数的带缓冲的版本。当调用 rio_read 要求读n个字节时，读缓冲区内有 rP-&gt;rio_cnt</p>
<h2>第 665 页</h2>
<p>630</p>
<p>第三部分 程序间的交互和通信</p>
<p>个未读字节。如果缓冲区为空，那么会通过调用 read 再填满它。这个 read调用收到一 个不足值并不是错误，只不过读缓冲区是填充了一部分。一旦缓冲区非空，r1o_read就 从读缓冲区复制n 和 rp-&gt;rio_cnt 中较小值个字节到用户缓冲区，并返回复制的字节数。</p>
<p>code/src/csapp.c</p>
<p>static ssize_t rio_read（rio_t *rP, char *usrbuf,size_t n） ｛</p>
<p>int cnt；</p>
<p>7</p>
<p>while （rp-&gt;rio_cnt &lt;= 0） ｛ /* Refill if buf is empty */ rP-&gt;rio_cnt = read（rp-&gt;rio_fd, rp-&gt;rio_buf， sizeof （rP-&gt;rio_buf））；</p>
<p>if （rp-&gt;rio_cnt &lt;O）｛ if （errno ！= EINTR） /* Interrupted by sig handler return */ return -1；</p>
<p>else if （rp-&gt;rio_cnt == 0） /* EOF */ return O；</p>
<p>else</p>
<p>rp-&gt;rio_bufptr = rp-&gt;rio_buf;/* Reset buffer ptr */ 10</p>
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
<p>｝</p>
<p>/* Copy min（n,rp-&gt;rio_cnt）bytes from internal buf to user buf */ cnt = n；</p>
<p>if （rp-&gt;rio_cnt &lt; n） cnt = rp-&gt;rio_cnt；</p>
<p>memcpy （usrbuf,rp-&gt;rio_bufptr,cnt）；</p>
<p>rP-&gt;rio_bufptr += cat；</p>
<p>rp-&gt;rio_cnt -= cnt；</p>
<p>return cnt；</p>
<p>｝</p>
<p>code/src/csapp.c</p>
<p>图10-7 内部的r1o_read 函数 对于一个应用程序，rio_read 函数和 Linux read 函数有同样的语义。在出错时，它 返回值一1，并且适当地设置</p>
<p>errno。在EOF 时，它返回值0。如果要求的字节数超过了 读缓冲区内未读的字节的数量，它会返回一个不足值。两个函数的相似性使得很容易通过 用rio_read代替read 来创建不同类型的带缓冲的读函数。例如，用rio_read 代替 read，</p>
<p>图10-8中的 rio_readnb 函数和 rio_readn 有相同的结构。相似地，图10-8中的 rio_readlineb 程序最多调用maxlen-1次 rio_read。每次调用都从读缓冲区返回一个 字节，然后检查这个字节是否是结尾的换行符。</p>
<p>旁注</p>
<p>RIO 包的起源</p>
<p>RIO函数的灵感来自于 W. Richard Stevens 在他的经典网络编程作品［110］中描述 的 readline、readn 和 writen函数。rio_readn 和 rio_writen函数与 Stevens 的 readn 和 writen函数是一样的。然而，Stevens 的 readline 函数有一些局限性在 RIO 中得到了纠正。第一，因为 readline 是带缓冲的，而readn 不带，所以这两个函数不 能在同一描述符上一起使用。第二，因为它使用一个 static缓冲区，Stevens 的 readline</p>
<h2>第 666 页</h2>
<h3>第10章 系统级 I/O</h3>
<p>631</p>
<p>函数不是线程安全的，这就要求 Stevens 引入一个不同的线程安全的版本，称为 read- line_r。我们已经在rio_readlineb 和 rio_readnb 函数中修改了这两个缺陷，使得 这两个函数是相互兼容和线程安全的。</p>
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
<p>code/src/csapp.c</p>
<p>ssize_t rio_readlineb（rio_t *rp, void *usrbuf,size_t maxlen） ｛</p>
<p>int n,rC；</p>
<p>char c，*bufp = usrbuf；</p>
<p>for （n= 1;n &lt; maxlen; n++）｛ if （（rc = rio_read（rP，&amp;c,1））== 1）｛ *bufp++ = c；</p>
<p>if（c== n&#x27;）</p>
<p>n++；</p>
<p>break；</p>
<p>｝</p>
<p>｝ else if （rc == 0）｛ if （n == 1）</p>
<p>return O; /* EOF,no data read */ else</p>
<p>break；</p>
<p>/* EOF, some data was read */ ｝ else</p>
<p>return -1；</p>
<p>/* Error */</p>
<p>｝</p>
<p>*bufp = 0；</p>
<p>return n-1；</p>
<p>｝</p>
<p>code/src/csapp.c</p>
<p>- code/src/csapp.c 5</p>
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
<p>ssize_t rio_readnb（rio_t *rp, void *usrbuf,size_t n） ｛</p>
<p>size_t nleft = n；</p>
<p>ssize_t nread；</p>
<p>char *bufp = usrbuf；</p>
<p>while （nleft &gt; O） ｛ if （（nread = rio_read（rp, bufp, nleft））&lt; 0） return -1；</p>
<p>/* errno set by read（） */ else if （nread == 0） break；</p>
<p>/* EOF */</p>
<p>nleft -= nread；</p>
<p>bufp += nread；</p>
<p>｝</p>
<p>return （n - nleft）；</p>
<p>/* Return &gt;= 0*/</p>
<p>｝</p>
<p>code/src/csapp.c</p>
<p>图 10-8</p>
<p>rio_readlineb 和 rio_readnb 函数</p>
<h2>第 667 页</h2>
<p>632</p>
<p>第三部分 程序间的交互和通信</p>
<h3>10.6 读取文件元数据</h3>
<p>应用程序能够通过调用 stat 和 Estat 函数，检索到关于文件的信息（有时也称为文 件的元数据（metadata））。</p>
<p>#include &lt;unistd.h&gt; #include &lt;sys/stat.h&gt; int stat （const char *filename, struct stat *buf）；</p>
<p>int fstat （int fd, struct stat *buf）；</p>
<p>返回：若成功则为0，若出错则为一1。</p>
<p>stat 函数以一个文件名作为输人，并填写如图10-9所示的一个 stat 数据结构中的 各个成员。Estat 函数是相似的，只不过是以文件描述符而不是文件名作输人。当我们 在11.5节中讨论 Web服务器时，会需要 stat 数据结构中的 st_mode 和 st_size 成员， 其他成员则不在我们的讨论之列。</p>
<p>- statbufh （included by sys/stat.h） /* Metadata returned by the stat and fstat functions struct stat｛</p>
<p>dev_t</p>
<p>st_dev；</p>
<p>ino_t</p>
<p>st_ino；</p>
<p>mode_t</p>
<p>st_mode；</p>
<p>nlink_t</p>
<p>st_nlink；</p>
<p>uid.t</p>
<p>st_uid；</p>
<p>gid_t</p>
<p>st-gid；</p>
<p>dev_t</p>
<p>st_rdev；</p>
<p>off_t</p>
<p>st_size；</p>
<p>unsigned long st_blksize；</p>
<p>unsigned 1ong st_blocks；</p>
<p>time_t</p>
<p>st_atime；</p>
<p>time_t</p>
<p>st_mtime；</p>
<p>time_t</p>
<p>st_ctime；</p>
<p>/*Device */</p>
<p>/*inode */</p>
<p>/* Protection and file type */ /* Number of hard links */ /* User ID of owner */ /* Group ID of owner */ /* Device type （if inode device） */ /* Total size, in bytes */ /* Block size for filesystem I/o */ /* Number of blocks allocated */ /* Time of last access */ /* Time of last modification */ /* Time of last change */ ｝；</p>
<p>- statbuf h （included by sys/stat.h） 图 10-9</p>
<p>stat 数据结构</p>
<p>st_size 成员包含了文件的字节数大小。st_mode 成员则编码了文件访问许可位（图 10-2）和文件类型（10.2节）。Linux 在 sys/stat.h 中定义了宏谓词来确定 st_mode 成员 的文件类型：</p>
<p>S_ISREG（m）。这是一个普通文件吗？</p>
<p>S_ISDIR（m）。这是一个目录文件吗？</p>
<p>S_ISSOCK（m）。这是一个网络套接字吗？</p>
<p>图 10-10展示了我们会如何使用这些宏和 stat 函数来读取和解释一个文件的 st_ mode位。</p>
<h2>第 668 页</h2>
<h3>第10章 系统级I/O</h3>
<p>633</p>
<p>code/io/statcheck.c 2</p>
<p>4</p>
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
<p>#include &quot;csapp.h&quot; int main （int argc, char **argv） ｛</p>
<p>struct stat stat；</p>
<p>char *type， *readok；</p>
<p>Stat （argv ［1］，&amp;stat）；</p>
<p>if （S_ISREG （stat.st_mode）） type = &quot;regular&quot;；</p>
<p>else if （S_ISDIR（stat.st_mode）） type = &quot;directory&quot;；</p>
<p>/* Determine file type */ else</p>
<p>type = &quot;other&quot;；</p>
<p>if （（stat.st_mode &amp; S_IRUSR））/* Check read access */ readok = &quot;yes&quot;；</p>
<p>else</p>
<p>readok = &quot;no&quot;；</p>
<p>printf（&quot;type： %s,read： %sln&quot;， type, readok）；</p>
<p>exit（O）；</p>
<p>｝</p>
<p>codelio/statcheck.c 图 10-10</p>
<p>查询和处理一个文件的 st_mode位</p>
<h3>10.7 读取目录内容</h3>
<p>应用程序可以用 readdir 系列函数来读取目录的内容。</p>
<p>#include &lt;sys/types.h&gt; #include &lt;dirent.h&gt; DIR *opendir（const char *name）；</p>
<p>返回：若成功，则为处理的指针；若出错，则为 NULL。</p>
<p>函数 opendir以路径名为参数，返回指向目录流（directory stream）的指针。流是对 条目有序列表的抽象，在这里是指目录项的列表。</p>
<p>#include &lt;dirent.h&gt; struct dirent *readdir（DIR *dirp）；</p>
<p>返回：若成功，则为指向下一个目录项的指针；若没有更多的目录项或出错，則为NULL。</p>
<p>每次对 readdir的调用返回的都是指向流 dirp 中下一个目录项的指针，或者，如果 没有更多目录项则返回 NULL。每个目录项都是一个结构，其形式如下：</p>
<p>struct dirent｛</p>
<p>ino_t d_ino；</p>
<p>/* inode number */ char d_name ［256］；/* Filename */ ｝；</p>
<p>虽然有些 Linux版本包含了其他的结构成员，但是只有这两个对所有系统来说都是标</p>
<h2>第 669 页</h2>
<p>634</p>
<p>第三部分 程序间的交互和通信</p>
<p>准的。成员d</p>
<p>name 是文件名，d_ino 是文件位置。</p>
<p>如果出错，则 readdir 返回 NULL，并置 i errno。可惜的是，唯一能区分错误村 流结束情况的方法是检查自调用 readdir 以来 errno 是否被修改过。</p>
<p>#include &lt;dirent.h&gt; int closedir（DIR *dirp）；</p>
<p>返回：成功为O；错误为一1。</p>
<p>函数 closedir 关闭流并释放其所有的资源。图10-11展示了怎样用 readdir 来读取 目录的内容。</p>
<p>codelio/readdir.c</p>
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
<p>#include &quot;csapp.h&quot; int main（int argc, char **argv） ｛</p>
<p>DIR *streamp；</p>
<p>struct dirent *dep；</p>
<p>streamp = Opendir（argv［1］）；</p>
<p>errno = 0；</p>
<p>while （（dep = readdir（streamp））！= NULL）｛ printf（&quot;Found file： %sln&quot;，dep-&gt;d_name）；</p>
<p>｝</p>
<p>if （errno ！=0）</p>
<p>unix_error（&quot;readdir error&quot;）；</p>
<p>Closedir（streamp）；</p>
<p>exit（O）；</p>
<p>｝</p>
<p>codelio/readdir.c</p>
<p>图10-11</p>
<p>读取目录的内容</p>
<p>10. 8</p>
<p>共享文件</p>
<p>可以用许多不同的方式来共享 Linux 文件。除非你很清楚内核是如何表示打开的文 件，否则文件共享的概念相当难懂。内核用三个相关的数据结构来表示打开的文件：</p>
<p>• 描述符表（descriptor table）。每个进程都有它独立的描述符表，它的表项是由进程 打开的文件描述符来索引的。每个打开的描述符表项指向文件表中的一个表项。</p>
<p>• 文件表（file table）。打开文件的集合是由一张文件表来表示的，所有的进程共享这 张表。每个文件表的表项组成（针对我们的目的）包括当前的文件位置、引用计数 （reference count）（即当前指向该表项的描述符表项数），以及一个指向v-node 表中 对应表项的指针。关闭一个描述符会减少相应的文件表表项中的引用计数。内核不 会删除这个文件表表项，直到它的引用计数为零。</p>
<h2>第 670 页</h2>
<h3>第10章 系统级 I/O</h3>
<p>635</p>
<p>• v-node 表（v-node table）。同文件表一样，所有的进程共享这张v-node 表。每个表 项包含 stat 结构中的大多数信息，包括 st_mode 和 st_size 成员。</p>
<p>图10-12展示了一个示例，其中描述符1和4通过不同的打开文件表表项来引用两个 不同的文件。这是一种典型的情况，没有共享文件，并且每个描述符对应一个不同的 文件。</p>
<p>描述符表</p>
<p>（每个进程一张表）</p>
<p>stdin fdO</p>
<p>stdout</p>
<p>fd1</p>
<p>stderr</p>
<p>fd2</p>
<p>fd 3</p>
<p>fd 4</p>
<p>打开文件表</p>
<p>（所有进程共享）</p>
<p>文件 A</p>
<p>文件位置</p>
<p>refcnt=1</p>
<p>v-node表</p>
<p>（所有进程共享）</p>
<p>文件访问</p>
<p>文件大小</p>
<p>文件类型</p>
<p>文件B</p>
<p>文件位置</p>
<p>refcnt=1</p>
<p>文件访问</p>
<p>文件大小</p>
<p>文件类型</p>
<p>图 10-12</p>
<p>典型的打开文件的内核数据结构。在这个示例中， 两个描述符引用不同的文件。没有共享</p>
<p>如图10-13所示，多个描述符也可以通过不同的文件表表项来引用同一个文件。例 如，如果以同一个 filename 调用open 函数两次，就会发生这种情况。关键思想是每个 描述符都有它自己的文件位置，所以对不同描述符的读操作可以从文件的不同位置获取 数据。</p>
<p>描述符表</p>
<p>（每个进程一张表）</p>
<p>fd0</p>
<p>fd1</p>
<p>fd 2</p>
<p>fd3</p>
<p>fd 4</p>
<p>打开文件表</p>
<p>（所有进程共享）</p>
<p>文件 A</p>
<p>文件位置</p>
<p>refcnt=1</p>
<p>v-node表</p>
<p>（所有进程共享）</p>
<p>文件访问</p>
<p>文件大小</p>
<p>文件类型</p>
<p>文件B</p>
<p>文件位置</p>
<p>refcnt=1</p>
<p>图 10-13</p>
<p>文件共享。这个例子展示了两个描述符通过两个 打开文件表表项共享同一个磁盘文件</p>
<p>我们也能理解父子进程是如何共享文件的。假设在调用 fork之前，父进程有如图10-12 所示的打开文件。然后，图10-14展示了调用 fork后的情况。子进程有一个父进程描 述符表的副本。父子进程共享相同的打开文件表集合，因此共享相同的文件位置。一个 很重要的结果就是，在内核删除相应文件表表项之前，父子进程必须都关闭了它们的描 述符。</p>
<h2>第 671 页</h2>
<p>636</p>
<p>第三部分 程序间的交互和通信</p>
<p>描述符表</p>
<p>父进程的表</p>
<p>fd 0</p>
<p>fd 1</p>
<p>fd2</p>
<p>fd 3</p>
<p>fd 4</p>
<p>打开文件表</p>
<p>（所有进程共享）</p>
<p>文件A</p>
<p>v-node表</p>
<p>（所有进程共享）</p>
<p>文件位置</p>
<p>refcnt =2</p>
<p>文件访问</p>
<p>文件大小</p>
<p>文件类型</p>
<p>子进程的表</p>
<p>fd0</p>
<p>fd1</p>
<p>fd 2</p>
<p>fd3</p>
<p>fd4</p>
<p>文件B</p>
<p>文件位置</p>
<p>refcnt=2</p>
<p>文件访问</p>
<p>文件大小</p>
<p>文件类型</p>
<p>图10-14</p>
<p>子进程如何继承父进程的打开文件。初始状态如图 10-12所示 练习题 10.2</p>
<p>假设磁盘文件 foobar.txt 由6个 ASCII 码字符“foobar”组成。那 么，下列程序的输出是什么？</p>
<p>1</p>
<p>#include &quot;csapp.h&quot; 2</p>
<p>int mainO</p>
<p>｛</p>
<p>int fd1, fd2；</p>
<p>6</p>
<p>Char C；</p>
<p>7</p>
<p>8</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>fd1 = Open（&quot;foobar.txt&quot;， O_RDONLY,O）；</p>
<p>fd2 = Open（&quot;foobar.txt&quot;， O_RDONLY,O）；</p>
<p>Read （fd1，&amp;c,1）；</p>
<p>Read （fd2， &amp;c,1）；</p>
<p>printf（&quot;c = %cln&quot;，c）；</p>
<p>exit（O）；</p>
<p>｝</p>
<p>练习题 10.3</p>
<p>就像前面那样，假设磁盘文件 foobar.txt 由6个 ASCII 码字符 组成。那么下列程序的输出是什么？</p>
<p>#include &quot;csapp.h&quot; “foobar”</p>
<p>3</p>
<p>int main（）</p>
<p>｛</p>
<p>int fd；</p>
<p>char C；</p>
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
<p>fd = Open（&quot;foobar.txt&quot;，O_RDONLY, O）；</p>
<p>if（Fork（）==0）｛</p>
<p>Read（fd， &amp;c,1）；</p>
<p>exit（O）；</p>
<p>｝</p>
<p>Wait （NULL）；</p>
<p>Read（fd， &amp;c,1）；</p>
<p>printf（&quot;c = %cln&quot;，c）；</p>
<p>exit（O）；</p>
<p>｝</p>
<h2>第 672 页</h2>
<h3>第10章 系统级 I/0</h3>
<p>637</p>
<h3>10.9 1/0重定向</h3>
<p>Linux shell 提供了1/0重定向操作符，允许用户将磁盘文件和标准输人输出联系起 来。例如，键人</p>
<p>linux&gt; ls &gt; foo.txt 使得 shell 加载和执行1s程序，将标准输出重定向到磁盘文件foo.txt。就如我们将在 11.5节中看到的那样，当一个 Web 服务器代表客户端运行 CGI 程序时，它就执行一种相 似类型的重定向。那么1/0重定向是如何工作的呢？一种方式是使用dup2函数。</p>
<p>#include &lt;unistd.h&gt; int dup2（int oldfd, int newfd）；</p>
<p>返回：若成功则为非负的描述符，若出错则为一1。</p>
<p>dup2 函数复制描述符表表项 oldfd到描述符表表项 newfd，覆盖描述符表表项 new- Ed 以前的内容。如果 newfd已经打开了，dup2会在复制oldfd之前关闭 newfd。</p>
<p>假设在调用dup2（4，1）之前，我们的状态如图10-12所示，其中描述符1（标准输出） 对应于文件 A（比如一个终端），描述符4对应于文件B（比如一个磁盘文件）。A和B的引 用计数都等于1。图10-15显示了调用dup2（4，1）之后的情况。两个描述符现在都指向文 件B；文件A已经被关闭了，并且它的文件表和v-node 表表项也已经被删除了；文件B 的引用计数已经增加了。从此以后，任何写到标准输出的数据都被重定向到文件B。</p>
<p>描述符表</p>
<p>打开文件表</p>
<p>v-node表</p>
<p>（每个进程一张表）</p>
<p>（所有进程共享）</p>
<p>（所有进程共享）</p>
<p>文件A</p>
<p>fd0</p>
<p>fd1</p>
<p>fd2</p>
<p>fd3</p>
<p>fd4</p>
<p>文件位置</p>
<p>refcnt=0</p>
<p>文件访问</p>
<p>文件大小</p>
<p>文件类型</p>
<p>文件B</p>
<p>文件位置</p>
<p>refcnt=2</p>
<p>文件访问</p>
<p>文件大小</p>
<p>文件类型</p>
<p>图 10-15</p>
<p>通过调用dup2（4,1）重定向标准输出之后的内核数据结构。初始状态如图10-12 所示 旁注</p>
<p>左边和右边的 hoinkies</p>
<p>为了避免和其他括号类型操作符比如“］”和“［”相混淆，我们总是将shell的 “＞”操作符称为“右 hoinky”，而将“＜”操作符称为“左 hoinky” 练习题 10.4</p>
<p>如何用 dup2 将标准输入重定向到描述符5？</p>
<p>练习题 10.5</p>
<p>假设磁盘文件 Eoobar.txt 由6个 ASCII 码字符 “foobar”组成，那 么下列程序的输出是什么？</p>
<p>#include &quot;csapp.h&quot; 2</p>
<p>int main（）</p>
<h2>第 673 页</h2>
<p>638</p>
<p>第三部分 程序间的交互和通信</p>
<p>4</p>
<p>｛</p>
<p>int fd1, fd2；</p>
<p>Char C；</p>
<p>8</p>
<p>9</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>14</p>
<p>15</p>
<p>fd1 = Open（&quot;foobar.txt&quot;， O_RDONLY, O）；</p>
<p>fd2 = Open（&quot;foobar.txt&quot;，O_RDONLY,O）；</p>
<p>Read（fd2， &amp;c,1）；</p>
<p>Dup2（fd2, fd1）；</p>
<p>Read（fd1， &amp;c,1）；</p>
<p>printf（&quot;c= %cla&quot;， c）；</p>
<p>exit（O）；</p>
<p>｝</p>
<p>10. 10</p>
<p>标准1/0</p>
<p>C语言定义了一组高级输人输出函数，称为标准1/0库，为程序员提供了 Unix 1/0 的较高级别的替代。这个库（1ibc）提供了打开和关闭文件的函数（fopen 和 fclose）、读 和写字节的函数（fread 和 Ewrite）、读和写字符串的函数（fgets 和 Eputs），以及复杂 的格式化的1/O函数（scanf 和 printf）。</p>
<p>标准1/0库将一个打开的文件模型化为一个流。对于程序员而言，一个流就是一个指 向 FILE 类型的结构的指针。每个 ANSI C程序开始时都有三个打开的流 stdin、stdout 和 stderr，分别对应于标准输人、标准输出和标准错误：</p>
<p>#include &lt;stdio.h&gt; extern FILE *stdin；</p>
<p>extern FILE *stdout；</p>
<p>extern FILE *stderr；</p>
<p>/* Standard input （descriptor O） */ /* Standard output （descriptor 1） */ /* Standard error （descriptor 2） */ 类型为 FILE 的流是对文件描述符和流缓冲区的抽象。流缓冲区的目的和 RIO 读缓冲 区的一样：就是使开销较高的 Linux 1/O系统调用的数量尽可能得小。例如，假设我们有 一个程序，它反复调用标准1/0的getc 函数，每次调用返回文件的下一个字符。当第一 次调用 getc 时，库通过调用一次 read 函数来填充流缓冲区，然后将缓冲区中的第一个 字节返回给应用程序。只要缓冲区中还有未读的字节，接下来对 getc 的调用就能直接从 流缓冲区得到服务。</p>
<h3>10.11 综合：我该使用哪些1/0函数？</h3>
<p>图10-16总结了我们在这一章里讨论过的各种1/0包。</p>
<p>fopen</p>
<p>fread</p>
<p>fscanf</p>
<p>sscanf</p>
<p>fgets</p>
<p>fflush</p>
<p>fclose</p>
<p>fdopen</p>
<p>fwrite</p>
<p>fprintf</p>
<p>sprintf</p>
<p>fputs</p>
<p>fseek</p>
<p>C应用程序</p>
<p>标准 1/O 函数</p>
<p>RIO 函数</p>
<p>rio_readn</p>
<p>rio_writen</p>
<p>rio_readinitb</p>
<p>rio_readlineb</p>
<p>rio_readnb</p>
<p>open</p>
<p>write</p>
<p>stat</p>
<p>read</p>
<p>lseek</p>
<p>close</p>
<p>Unix 1/O 函数</p>
<p>（通过系统调用来访问）</p>
<p>图10-16</p>
<p>Unix 1/O、标准1/0和 RIO 之间的关系</p>
<h2>第 674 页</h2>
<h3>第10章 系统级I/0</h3>
<p>639</p>
<p>Unix 1/O模型是在操作系统内核中实现的。应用程序可以通过诸如 open、close、 Iseek、read、write 和 stat 这样的函数来访问 Unix I/O。较高级别的 RIO 和标准1/0 函数都是基于（使用）Unix 1/O函数来实现的。RIO 函数是专为本书开发的 read和 write 的健壮的包装函数。它们自动处理不足值，并且为读文本行提供一种高效的带缓冲的方 法。标准1/0函数提供了 Unix 1/0函数的一个更加完整的带缓冲的替代品，包括格式化 的1/0例程，如 printf 和 scanf。</p>
<p>那么，在你的程序中该使用这些函数中的哪一个呢？下面是一些基本的指导原则：</p>
<p>• GI：只要有可能就使用标准1/0。对磁盘和终端设备1/0来说，标准1/0函数是首 选方法。大多数C程序员在其整个职业生涯中只使用标准1/0，从不受较低级的 Unix I/O函数的困扰（可能stat 除外，因为在标准1/O库中没有与它对应的函 数）。只要可能，我们建议你也这样做。</p>
<p>• G2：不要使用 scanf或 rio readlineh 来读二进制文件。像 scanf或rio_read- 1ineb 这样的函数是专门设计来读取文本文件的。学生通常会犯的一个错误就是用 这些函数来读取二进制文件，这就使得他们的程序出现了诡异莫测的失败。比如， 二进制文件可能散布着很多 Oxa 字节，而这些字节又与终止文本行无关。</p>
<p>• G3：对网络套接字的1/O使用 RIO 函数。不幸的是，当我们试着将标准1/0用于 网络的输人输出时，出现了一些令人讨厌的问题。如同我们将在11.4 节所见， Linux 对网络的抽象是一种称为套接字的文件类型。就像所有的Linux 文件一样， 套接字由文件描述符来引用，在这种情况下称为套接字描述符。应用程序进程通过 读写套接字描述符来与运行在其他计算机的进程实现通信。</p>
<p>标准1/O流，从某种意义上而言是全双工的，因为程序能够在同一个流上执行输人和 输出。然而，对流的限制和对套接字的限制，有时候会互相冲突，而又极少有文档描述这 些现象：</p>
<p>• 限制一：跟在输出函数之后的输入函数。如果中间没有插入对 fflush、fseek、 Esetpos 或者 rewind 的调用，一个输人函数不能跟随在一个输出函数之后。</p>
<p>fflush 函数清空与流相关的缓冲区。后三个函数使用 Unix 1/O 1seek 函数来重置 当前的文件位置。</p>
<p>• 限制二：跟在输入函数之后的输出函数。如果中间没有插入对 fseek、fsetpos 或 者 rewind的调用，一个输出函数不能跟随在一个输人函数之后，除非该输人函数 遇到了一个文件结束。</p>
<p>这些限制给网络应用带来了一个问题，因为对套接字使用 1seek 函数是非法的。对流 1/0的第一个限制能够通过采用在每个输入操作前刷新缓冲区这样的规则来满足。然而， 要满足第二个限制的唯一办法是，对同一个打开的套接字描述符打开两个流，一个用来 读，一个用来写：</p>
<p>FILE *fpin，*fpout；</p>
<p>fpin = fdopen（sockfd， &quot;r&quot;）；</p>
<p>fpout = fdopen（sockfd， &quot;w&quot;）；</p>
<p>但是这种方法也有问题，因为它要求应用程序在两个流上都要调用 fclose，这样才 能释放与每个流相关联的内存资源，避免内存泄漏：</p>
<p>fclose （fpin）；</p>
<p>fclose （fpout）；</p>
<h2>第 675 页</h2>
<p>640</p>
<p>第三部分 程序间的交互和通信</p>
<p>这些操作中的每一个都试图关闭同一个底层的套接字描述符，所以第二个 close 操作 就会失败。对顺序的程序来说，这并不是问题，但是在一个线程化的程序中关闭一个已经 关闭了的描述符是会导致灾难的（见12.7.4节）。</p>
<p>因此，我们建议你在网络套接字上不要使用标准1/0函数来进行输人和输出，而要使 用健壮的RIO 函数。如果你需要格式化的输出，使用sprintf 函数在内存中格式化一个 字符串，然后用 rio_writen 把它发送到套接口。如果你需要格式化输入，使用rio_ readlineb 来读一个完整的文本行，然后用 sscanf从文本行提取不同的字段。</p>
<p>10. 12 小结</p>
<p>Linux 提供了少量的基于 Unix 1/O模型的系统级函数，它们允许应用程序打开、关闭、读和写文件， 提取文件的元数据，以及执行1/0重定向。Linux 的读和写操作会出现不足值，应用程序必须能正确地 预计和处理这种情况。应用程序不应直接调用Unix 1/O 函数，而应该使用 RIO包，RIO 包通过反复执行 读写操作，直到传送完所有的请求数据，自动处理不足值。</p>
<p>Linux 内核使用三个相关的数据结构来表示打开的文件。描述符表中的表项指向打开文件表中的表 项，而打开文件表中的表项又指向v-node 表中的表项。每个进程都有它自己单独的描述符表，而所有的 进程共享同一个打开文件表和v-node 表。理解这些结构的一般组成就能使我们清楚地理解文件共享和 1/0重定向。</p>
<p>标准1/0库是基于 Unix 1/O实现的，并提供了一组强大的高级1/0例程。对于大多数应用程序而 言，标准1/0更简单，是优于 Unix 1/O的选择。然而，因为对标准1/0和网络文件的一些相互不兼容的 限制，Unix 1/0 比之标准1/0更该适用于网络应用程序。</p>
<p>参考文献说明</p>
<p>Kerrisk撰写了关于 Unix I/O 和 Linux 文件系统的综述［62］。Stevens 编写了 Unix 1/O 的标准参考 文献［111］。Kernighan 和 Ritchie 对于标准 1/0函数给出了清晰而完整的讨论［61］。</p>
<p>家庭作业</p>
<p>*10.6 下面程序的输出是什么？</p>
<p>#include &quot;csapp.h&quot; 2</p>
<p>int main（</p>
<p>｛</p>
<p>int fd1,fd2；</p>
<p>fd1 - Open（&quot;too.txt&quot;，O_RDONLY,0）；</p>
<p>fd2 = Open（&quot;bar.txt&quot;， O_RDONLY, O）；</p>
<p>Close（fd2）；</p>
<p>fd2 = Open（&quot;baz.txt&quot;， O_RDONLY, O）；</p>
<p>printf（&quot;fd2 = %ala&quot;， fd2）；</p>
<p>exit （0）；</p>
<p>* 10.7</p>
<p>**10.8</p>
<p>** 10.</p>
<p>9</p>
<p>10</p>
<p>11</p>
<p>12</p>
<p>13</p>
<p>｝</p>
<p>修改图 10-5中所示的 cpfile 程序，使得它用 RIO 函数从标准输入复制到标准输出，一次 MAX- BUF 个字节。</p>
<p>编写图 10-10 中的 statcheck程序的一个版本，叫做fstatcheck，它从命令行上取得一个描述符 数字而不是文件名。</p>
<p>考虑下面对作业题10.8中的 fstatcheck 程序的调用：</p>
<p>1inux&gt; fstatcheck 3 &lt; foo.txt 你可能会预想这个对 fstatcheck 的调用将提取和显示文件 foo.txt 的元数据。然而，当我们在</p>
<h2>第 676 页</h2>
<h3>第10章 系统级I/O</h3>
<p>641</p>
<p>系统上运行它时，它将失败，返回“坏的文件描述符”。根据这种情况，填写出 shell 在 fork 和 execve 调用之间必须执行的伪代码：</p>
<p>i</p>
<p>（Fork（） == 0）｛ /* child */ /* What</p>
<p>code is the shell executing right here？ */ Execve（&quot;fstatcheck&quot;， argv,envp）；</p>
<p>｝</p>
<p>** 10.10</p>
<p>修改图10-5中的 cpfile程序，使得它有一个可选的命令行参数 infile。如果给定了 infile， 那么复制 infile 到标准输出，否则像以前那样复制标准输人到标准输出。一个要求是对于两种 情况，你的解答都必须使用原来的复制循环（第9～11行）。只允许你插人代码，而不允许更改任 何已经存在的代码。</p>
<p>练习题答案</p>
<p>10.1</p>
<p>Unix进程生命周期开始时，打开的描述符赋给了 stdin（描述符 0）、stdout（描述符 1）和 stderr （描述符2）。open 函数总是返回最低的未打开的描述符，所以第一次调用 open 会返回描述符3。</p>
<p>调用 close 函数会释放描述符3。最后对 open 的调用会返回描述符3，因此程序的输出是“Ed2=3”。</p>
<p>10.2</p>
<p>描述符fd1 和 Ed2 都有各自的打开文件表表项，所以每个描述符对于 Eoobar.txt 都有它自己的 文件位置。因此，从Ed2的读操作会读取 foobar.txt 的第一个字节，并输出 c=f</p>
<p>而不是像你开始可能想的</p>
<p>c=。</p>
<p>10.3</p>
<p>回想一下，子进程会继承父进程的描述符表，以及所有进程共享的同一个打开文件表。因此，描 述符 Ed 在父子进程中都指向同一个打开文件表表项。当子进程读取文件的第一个字节时，文件位 置加1。因此，父进程会读取第二个字节，而输出就是 c-。</p>
<p>10.4</p>
<p>重定向标准输人（描述符0）到描述符5，我们将调用dup2（5, 0）或者等价的dup2 （5,STDIN_FILE- NO）。</p>
<p>10.5</p>
<p>第一眼你可能会想输出应该是</p>
<p>c=f</p>
<p>但是因为我们将 fd1 重定向到了 Ed2，输出实际上是 c=0</p>
</div>
