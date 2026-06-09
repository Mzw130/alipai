# CLAUDE.md — ClipAI 项目指南

## 项目简介

ClipAI 是一个 AI 驱动的图片/视频编辑应用，React Native (Expo) + TypeScript 构建。

## 关键文档

- `docs/DEVELOPMENT.md` — **开发规范、API 设计、Prompt 工程规范**（必读）

## 快速导航

| 模块 | 路径 |
|------|------|
| 入口 | `App.tsx` |
| 导航 | `src/navigation/AppNavigator.tsx` |
| 主题 | `src/theme/index.ts` |
| API 存根 | `src/api/index.ts` |
| AI 工具栏 | `src/components/AiToolBar.tsx` |
| AI 工具页面 | `src/screens/ai-tools/*.tsx` (18 个) |
| 其他页面 | `src/screens/*.tsx` |

## 核心架构理念

18 个 AI 工具都是同一套 AI Pipeline + 不同 Prompt/参数，不是 18 个不同的 AI 实现。
详见 `docs/DEVELOPMENT.md` 中的 Tool-to-Prompt 映射表。

## 启动

```bash
npm install
npx expo start
```
