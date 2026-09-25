---
title: "Kubernetes组件介绍"
description: "梳理 Kubernetes 控制平面与工作节点的核心组件，结合一个 Pod 的部署调度流程，理解各组件如何协作。"
date: "2026-09-25T20:48:05+08:00"
author: "LeoninCS"
cover: ""
categories: ["技术"]
tags: ["Kubernetes","云原生"]
---

![](/blog-assets/kubernetes-components/image-01.png)

诺兰新作《奥德赛》 值得一看。

## 前言

众所周知，Kubernetes是由好多个组件构成的，且各个组件单拉出来都可称之为一个很厉害的项目，这赋予了Kubernetes强大的能力，但也导致Kubernetes架构比较复杂，不易学习，本文将会带你捋一遍Kubernetes有哪些组件、各个组件有什么作用以及这些组件的联系，同时最后会以一个pod的调度流程来帮你熟悉Kubernetes各个组件。

## Kubernetes介绍

Kubernetes（简称 K8s）是一个用于自动部署、调度和管理容器化应用的开源容器编排平台，它将多台服务器组成统一的集群，并通过控制平面协调各个工作节点，让应用按照预期状态运行。

核心能力

- 容器编排与调度
- 服务发现和负载均衡
- 自动扩缩容
- 故障检测与自愈
- 滚动发布与版本回滚
- 配置及密钥管理

简单来说，容器解决了“如何打包应用”，而 Kubernetes 解决了“如何在大量机器上稳定、高效地运行和管理这些容器”。

Kubernetes 集群主要由两部分组成：一部分是 <strong>Master（现在通常称为 Control Plane，即控制平面）</strong>，负责集群的统一管理和决策；另一部分是 <strong>Node（工作节点）</strong>，负责真正运行容器化应用。

<strong>Master</strong>包括四个组件，即负责集群的统一管理和决策，其中包括提供集群操作入口的 <strong>API Server</strong>、保存集群数据的 <strong>etcd</strong>、负责资源调度的 <strong>Scheduler</strong>，以及维持集群期望状态的 <strong>Controller Manager</strong>；

<strong>Node</strong>包括三个组件，即管理 Pod 生命周期的 <strong>kubelet</strong>、实现网络转发和服务访问的 <strong>kube-proxy</strong>，以及负责创建和运行容器的<strong>容器运行时（container runtime）</strong>。

## 架构图

<strong>组件概括</strong>

![](/blog-assets/kubernetes-components/image-02.png)

<strong>官方架构图</strong>

![](/blog-assets/kubernetes-components/image-03.png)

<strong>民间架构图</strong>

![](/blog-assets/kubernetes-components/image-04.png)

## Master

Master（现在通常称为 <strong>Control Plane，控制平面</strong>）主要包括四个核心组件：

- <strong>API Server</strong>：集群的统一入口，接收和处理所有 Kubernetes API 请求。
- <strong>etcd</strong>：分布式键值数据库，保存集群的配置、资源状态等核心数据。
- <strong>Scheduler</strong>：调度器，为新创建且尚未分配节点的 Pod 选择合适的 Node。
- <strong>Controller Manager</strong>：运行各种控制器，持续对比实际状态与期望状态，并推动集群达到期望状态。

用人话来说：

- <strong>API Server</strong>：集群的“统一办事窗口”，所有操作都先经过它。
- <strong>etcd</strong>：集群的“数据库”，记录配置和当前状态。
- <strong>Scheduler</strong>：集群的“调度员”，决定 Pod 应该在哪台 Node 上运行。
- <strong>Controller Manager</strong>：集群的“监工”，发现实际状态与期望不一致时，负责推动修复。

## Node

Node 通常可以从四个部分介绍：

- <strong>kubelet</strong>：Node 上的管理代理，接收控制平面的指令，负责创建和管理 Pod，并上报节点与 Pod 状态。
- <strong>kube-proxy</strong>：维护节点上的网络转发规则，为 Service 提供服务发现和负载均衡能力。
- <strong>容器运行时（Container Runtime）</strong>：负责拉取镜像以及创建、启动和停止容器，例如 containerd、CRI-O。

用人话来说：

- <strong>kubelet</strong>：Node 的“管家”，负责按照要求启动和管理 Pod，并汇报运行情况。
- <strong>kube-proxy</strong>：Node 的“网络交通管理员”，负责把访问请求转发到正确的 Pod。
- <strong>容器运行时</strong>：Node 的“执行工具”，真正负责拉取镜像以及启动、停止容器。

## 一个pod的调度流程

先介绍一下pod是什么。

Pod 是 Kubernetes 中创建、调度和运行应用的最小单位。容器是应用本身，Pod 是 Kubernetes 用来装载和管理容器的“小房间”。Kubernetes 调度的不是单个容器，而是整个 Pod。

这里以一个Deployment来部署一个服务来介绍一个pod的调度流程，Deployment 用来描述应用的期望状态；如果你不知道Deployment是什么，你可以理解为你的一个部署需求，假设为“帮我运行两份这个应用”。

当你提交这个“部署需求”，首先第一步，这个请求会发送到API Server。

> API Server 是 Kubernetes 集群的统一入口，它会对请求进行身份认证、权限检查和配置校验；

请求通过后，便将“运行两份应用”这一期望状态保存到 <strong>etcd</strong> 中。

> <strong>etcd</strong> 是 Kubernetes 的数据存储中心，负责保存集群的配置和状态信息。

<strong>接下来，Controller Manager</strong> 会通过 API Server 发现这个新的 “部署需求”，并根据“运行两份应用”的要求创建一个 ReplicaSet；ReplicaSet 随后创建两个 Pod。新创建的两个 Pod 仍处于 `Pending` 状态，因为此时它们还没有被分配到具体的 Node。

> <strong>Controller Manager</strong> 负责持续检查集群的实际状态是否符合期望状态。

<strong>Scheduler</strong> 会通过 API Server 发现这两个尚未分配 Node 的 Pod，然后根据 CPU、内存、亲和性、污点与容忍度等条件筛选可用节点，并为每个 Pod 选择最合适的 Node。选择完成后，Scheduler 会将 Pod 与 Node 的绑定结果提交给 API Server，并由 API Server 保存到 etcd 中。

> <strong>Scheduler</strong> 是 Kubernetes 的“调度员”，它负责决定 Pod 应该运行在哪台 Node 上。

Pod 被分配到 Node 后，该节点上的 <strong>kubelet</strong> 会通过 API Server 发现这个 Pod，并按照 Pod 的配置开始准备运行环境，例如挂载存储、配置网络，然后调用容器运行时拉取镜像并启动容器。

> <strong>kubelet</strong> 是每台 Node 上的“管家”，负责接收分配给本节点的 Pod，并确保其中的容器按照要求运行。
> <strong>容器运行时</strong> 是真正执行容器操作的工具，负责拉取镜像以及创建、启动和停止容器，例如 containerd。

容器成功启动后，kubelet 会持续检查 Pod 的运行状态，并通过 API Server 上报。API Server 再将最新状态保存到 etcd。此时，Pod 会从 `Pending` 变为 `Running`，整个部署和调度流程基本完成。

<strong>kube-proxy 不参与 Pod 的调度和启动</strong>，它主要负责 Pod 运行后的网络访问。

> <strong>kube-proxy</strong> 是每台 Node 上的“网络交通管理员”，负责把访问流量转发到正确的 Pod，并实现简单的负载均衡。

## 通俗理解

业务部门提交“招聘两名员工”的用人申请，这相当于创建一个 <strong>Deployment</strong>。申请首先交到公司的 <strong>HR 服务台（API Server）</strong>，HR 服务台负责检查申请人身份、审批权限和申请内容是否符合要求。审核通过后，申请被录入 <strong>人事系统（etcd）</strong>。随后，<strong>编制主管（Controller Manager）</strong> 发现当前员工数量不足，于是创建两个具体的入职名额，也就是两个 <strong>Pod</strong>（投简历的100个人，2个“幸运儿”被选为了pod）。接着，<strong>岗位分配专员（Scheduler）</strong> 根据各部门的人员容量和岗位要求，为候选人选择合适的部门，也就是 <strong>Node</strong>。员工被分配到部门后，<strong>部门入职负责人（kubelet）</strong> 负责办理入职，并通知 <strong>IT 支持团队（容器运行时）</strong> 准备电脑、账号和工作环境。准备完成后，员工正式开始工作，Pod 进入 `Running` 状态。

- Master：公司管理中心
- Deployment：用人计划
- API Server：HR 服务台
- etcd：人事档案系统
- Controller Manager：编制主管
- Pod：通过面试的候选人
- Scheduler：岗位分配专员
- Node：业务部门
- kubelet：部门入职负责人
- 容器运行时：IT 支持团队
- `Running`：员工正式上岗
