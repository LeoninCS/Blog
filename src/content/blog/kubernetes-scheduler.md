---
title: "K8S-Scheduler调度机制讲解"
description: "从监听、过滤、打分到绑定，梳理 Kubernetes Scheduler 的调度流程、节点选择机制与调度器配置。"
date: "2026-10-17"
author: "LeoninCS"
cover: ""
categories: ["技术"]
tags: ["Kubernetes","云原生","调度器"]
---

声明：本次基于最新K8S版本讲解。

> 通过此文你将会掌握K8S-Scheduler的调度流程与策略。

## 阅读路线

- 01  Scheduler 概述
- 02  调度工作流程
- 03  节点选择机制
- 04  配置调度器
- 05  从选中节点到完成绑定

## 01  Scheduler 概述

### 简单介绍

K8S Scheduler（`kube-scheduler`）是 Kubernetes 控制平面中的核心组件，负责为 Pod 选择合适的工作节点（Node）。

即K8S中把Pod调度到Node的组件。

### 核心作用

K8S Scheduler 的核心作用是 <strong>为 Pod 选择合适的工作节点。</strong>

<strong>什么是合适？</strong>

#### 资源合理分配

根据 Pod 的 CPU、内存等需求和Node可用资源，选择能够承载它的节点。

#### 满足你定义的规则约束

遵循节点选择、亲和性、污点与容忍等规则。

- 节点选择（Node Selector）：根据节点标签指定运行位置。
- 亲和性与反亲和性（Affinity / Anti-Affinity）：亲和就是接近谁，反亲和就是远离谁。
- 污点与容忍（Taints / Tolerations）：可以理解为污点就是机器有黑历史，容忍就是Pod可以接受这个机器的黑历史。不接受的Pod就一定不会调度到机器上，但是接受的Pod也不代表一定会调度到机器上。

#### 优化工作负载分布

根据配置决定Pod的调度是分散部署还是集中部署。

分散部署：分散到不同机器，提高可用性，避免一个机器故障整个服务垮掉。同时可以减小负载。

集中部署：关联紧密的Pod放在一个机器，可以显著降低通信延迟和跨节点网络开销。也可以使负载更集中，最大的提高机器利用率，使其他节点可以空闲，节省成本。

## 02  调度工作流程

监听→过滤→打分→绑定（Watch→Filter→Score→Bind）

### 01  监听（收简历）

Watch API Server，将尚未分配节点的 Pod 放入调度队列。<br>（邮箱收到简历了）

### 02  过滤（初筛）

检查节点是否满足 Pod 的资源需求和部署约束，例如 CPU、内存、节点选择、亲和性、污点与容忍等，筛选出可用节点。<br>（可以理解为大厂直接把双非卡掉）

### 03  打分（横向）

根据资源分配策略、亲和性偏好、工作负载分布等，对可用节点评分，选择得分最高的节点。<br>（多个候选者，对比各个条件打个分，看看哪个好）

### 04  绑定（入职）

将 Pod 与选中的节点绑定，并通过 API Server 保存结果。<br>（恭喜，你入职了！）

## 03  节点选择机制

### 过滤｜筛出能运行的节点

过滤（Filter）负责筛选出满足 Pod 硬性要求的节点。

对每个候选节点，调度器依次执行过滤插件；只要有一项检查不通过，该节点就会被排除，停止后续检查。

检查的信息：

![Scheduler 过滤阶段的检查信息](/blog-assets/kubernetes-scheduler/image-01.png)

### 打分｜选出更合适的节点

<strong>打分（Score）负责对通过过滤的候选节点评价，选出更适合运行该 Pod 的节点。</strong>

调度器通过多个打分插件，从不同角度给节点评分。

打分规则：

![Scheduler 打分插件与评分规则](/blog-assets/kubernetes-scheduler/image-02.png)

按照不同的配置权重

```latex
节点总分 = 插件1得分 × 权重1 + 插件2得分 × 权重2 + …
```

打完分后选择分高的Node。

多个Node并列最高时，随机选择其中一个。

## 04  配置调度器

以资源分配策略为例

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration

# API Server 认证文件，按实际路径修改
clientConnection:
  kubeconfig: /etc/kubernetes/scheduler.conf

profiles:
  - schedulerName: default-scheduler
    plugins:
      score:
        enabled:
          - name: NodeResourcesFit
            weight: 3 # 资源评分 × 3

    pluginConfig:
      - name: NodeResourcesFit
        args:
          scoringStrategy:
            type: MostAllocated # 倾向集中部署
```

### 配置说明

clientConnection：连接 API Server 的认证配置，kubeconfig 路径按实际环境修改。<br>profiles：调度方案列表；Pod 的 schedulerName 对应 Profile 名称，默认是 default-scheduler。<br>plugins.score：配置打分插件；NodeResourcesFit 负责资源评分，weight: 3 表示得分乘以 3 后计入节点总分。<br>pluginConfig.args：配置插件内部参数。MostAllocated 倾向集中部署，LeastAllocated 倾向分散负载。<br>资源评分默认根据 CPU、内存的 requests 计算，两者内部权重相同。<br>其他默认评分插件也会参与打分，最终选择由综合评分决定。

默认权重如下

![Scheduler 默认评分插件权重](/blog-assets/kubernetes-scheduler/image-03.png)

## 05  从选中节点到完成绑定

Pod 通过 Filter 和 Score 选中 Node，再由 Bind 插件向 API Server 提交绑定，最终将目标节点写入 `Pod.spec.nodeName`。

以一个Pod调度到`node-b` 为例。

### 01  创建 Pod（Create）

用户或控制器向 API Server 提交 Pod。

### 02  监听并加入队列（Watch）

Scheduler 通过 Informer 的 Watch 机制发现这个 Pod，确认其 schedulerName 对应自己负责的调度方案，再将其加入调度队列。

### 03  过滤候选节点（Filter）

Scheduler 从队列取出 Pod，根据缓存中的节点和 Pod 信息，检查资源请求、亲和性、污点与容忍等硬性条件，排除不符合要求的节点。

### 04  打分并选中节点（Score）

各评分插件给候选节点打分，经过必要的归一化后，按权重求和。选择总分最高的节点，例如 node-b；并列最高时随机选择。

### 05  先在缓存中占位（Assume / Reserve）

Scheduler 在自己的缓存中暂时记录“这个 Pod 将放到 node-b”，将它的资源请求计入节点分配额度。<br>这样，后续 Pod 调度时就能看到这部分额度已经被占用。随后执行 Reserve 插件的资源预留逻辑。

### 06  完成绑定前检查（Permit / PreBind）

Permit 插件可以允许、拒绝或等待；通过后，PreBind 插件完成绑定前准备，例如等待 PVC/PV 绑定完成。

### 07  提交正式绑定（Bind）

默认的 DefaultBinder 构造 Binding 请求，将目标节点设为 node-b，提交给 API Server。
