---
title: "Go语言练习&&手撕题"
description: "| 题目 | 高频度 | 难度 | 主要考点 | | --------------------- | --- | --- | ------------------------- | | LRU Cache | 高 | 中 | map + 双向链表、O(1) 查询、淘汰 | | singleflight 简化版 | 高 "
date: "2026-07-08"
author: "LeoninCS"
cover: ""
categories: []
tags: []
---

| 题目                    | 高频度 | 难度  | 主要考点                      |
| --------------------- | --- | --- | ------------------------- |
| LRU Cache             | 高   | 中   | map + 双向链表、O(1) 查询、淘汰     |
| singleflight 简化版      | 高   | 中   | 请求合并、Mutex、WaitGroup      |
| Worker Pool           | 高   | 中   | channel、任务队列、优雅关闭         |
| 交替打印奇偶数               | 高   | 低   | channel 协作、goroutine 顺序控制 |
| 三个 goroutine 顺序打印 ABC | 高   | 低   | channel 接力、循环控制           |
| 限流器 Token Bucket      | 高   | 中   | time、令牌桶、并发安全             |
| Semaphore             | 中高  | 低   | 带缓冲 channel 控制并发          |
| TTL Cache             | 中高  | 中   | 过期时间、懒删除、后台清理             |
| Retry + Backoff       | 中   | 低   | 重试、退避、错误处理                |
| errgroup 简化版          | 中   | 中   | 并发任务、错误收集、等待结束            |
| Blocking Queue        | 中   | 中   | 阻塞读写、容量控制、sync.Cond       |
| Fan-in / Fan-out      | 中   | 低   | 多 channel 合并、任务分发         |
| Pipeline              | 中   | 低   | 多阶段处理、关闭 channel          |
| Batcher               | 中   | 中   | 按数量或时间批量 flush            |
| PubSub 简化版            | 中   | 中   | 订阅、广播、取消订阅                |
| Once 简化版              | 中   | 低   | 只执行一次、锁、状态位               |
| 对象池 Object Pool       | 中   | 低   | 复用对象、获取和归还                |
| 超时任务 Runner           | 中   | 低   | context.WithTimeout、取消任务  |
| Top K 高频元素            | 高   | 中   | map + heap                |
| 环形队列 Ring Buffer      | 中   | 低   | 数组、读写指针、取模                |
