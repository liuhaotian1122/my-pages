
# 浩天的个人站 2.0 🌟

一个功能丰富的个人博客网站，采用现代前端技术构建，展示个人作品、生活记录和创意项目。

## 📋 项目概览

**浩天的个人站 2.0** 是一个完全由前端技术构建的个人网站，集博客、作品展示、游戏、工具于一身。网站通过 GitHub Pages 部署，为用户提供流畅的浏览体验。

- **项目创建时间**：2025年8月1日
- **许可证**：Mulan Permissive Software License, Version 2
- **部署平台**：GitHub Pages
- **技术栈占比**：CSS (36%) | HTML (34.5%) | JavaScript (29.5%)

## ✨ 主要功能

### 核心模块

| 功能 | 文件 | 描述 |
|------|------|------|
| **首页** | `index.html` | 网站主页，展示全局导航和内容聚合 |
| **个人博客** | `boke.html` | 个人思考和技术博客分享 |
| **作品展示** | `work.html` | 项目作品和设计案例集锦 |
| **生活感悟** | `jingli.html` | 生活经历和个人成长记录 |
| **美食分享** | `food.html` | 美食攻略和餐饮推荐 |
| **热点资讯** | `hotnews.html` | 最新资讯和热点新闻 |
| **游戏体验** | `game.html` | 交互式游戏和娱乐功能 |
| **创意展示** | `Secret Base.html` | 隐藏的创意作品展示 |
| **媒体互动** | `Wechat.html` | 社交媒体分享功能 |
| **相机应用** | `camera.html` | 网页相机功能 |
| **内容管理** | `content-manager.html` | 内容管理后台 |
| **最近更新** | `最近更新.html` | 网站更新日志 |

### 特色内容

- **我的婚礼** - 婚礼相关的特殊页面
- **碎碎念** - 日常分享和碎碎念
- **PS操作教程** - 图像处理教程
- **命运探索** - 趣味性的命运相关页面
- **高贵生活** - 生活品质分享
- **实用工具** - 常用工具集合
- **H5防滑动** - 移动端技术演示

## 🏗️ 项目结构

```
my-pages/
├── index.html                    # 网站主页
├── boke.html                     # 个人博客
├── work.html                     # 作品展示
├── food.html                     # 美食分享
├── game.html                     # 游戏中心
├── camera.html                   # 相机应用
├── content-manager.html          # 内容管理
├── Wechat.html                   # 微信分享
├── Secret Base.html              # 隐藏作品
├── hotnews.html                  # 热点资讯
├── jingli.html                   # 生活经历
├── suosui.html                   # 碎碎念
├── tigoo.html                    # 特色内容
├── my wedding.html               # 婚礼页面
├── ps操作.html                   # PS教程
├── 找到自己的命运.html           # 命运页面
├── 真实的高贵.html               # 高贵生活
├── h5阻止滑动.html               # 移动端技术
├── 一些工具.html                 # 工具集合
├── 最近更新.html                 # 更新日志
├── css/                          # 样式文件目录
├── js/                           # 脚本文件目录
├── images/                       # 图片资源目录
├── assets/                       # 其他资产目录
├── Temp-images/                  # 临时图片目录
├── music/                        # 音乐资源目录
├── heart/                        # 特殊资源目录
├── LICENSE                       # 项目许可证
└── README.md                     # 项目说明文档
```

## 🛠️ 技术栈

### 前端技术

- **HTML** (34.5%) - 页面结构与语义化标签
- **CSS** (36%) - 样式设计和响应式布局
- **JavaScript** (29.5%) - 交互功能和动态效果

### 特性

- ✅ 纯前端静态网站，无需后端服务器
- ✅ 响应式设计，支持多设备访问
- ✅ 丰富的交互效果和动画
- ✅ GitHub Pages 自动部署
- ✅ 模块化的页面组织结构

## 📥 安装与部署

### 前置要求

- 现代浏览器（支持 ES6+）
- Git（用于版本控制）

### 快速开始

1. **克隆仓库**
   ```bash
   git clone https://github.com/liuhaotian1122/my-pages.git
   cd my-pages
   ```

2. **本地开发**
   - 使用任意 HTTP 服务器启动项目
   - 推荐使用 Python 简易服务器：
     ```bash
     python -m http.server 8000
     ```
   - 浏览器访问：`http://localhost:8000`

3. **部署到 GitHub Pages**
   - 推送到 `my-pages` 分支
   - GitHub 会自动部署到 Pages
   - 访问地址：`https://liuhaotian1122.github.io/my-pages`

### 独立应用安装

您也可以将网站安装为独立应用程序（PWA），获得类似原生应用的体验。

**下载链接**：[立即体验](http://liuhaotian1122.gitee.io/download/)

## 📖 使用指南

### 浏览网站

1. 访问[在线地址](https://liuhaotian1122.github.io/my-pages)或本地部署地址
2. 使用导航菜单探索不同功能模块
3. 点击各个页面查看详细内容
4. 支持分享和互动功能

### 自定义修改

1. **修改样式**
   - 编辑 `css/` 目录下的样式文件
   - 主要样式在各 HTML 文件的 `<style>` 标签中

2. **添加内容**
   - 直接编辑相应的 HTML 文件
   - 或创建新的页面文件
   - 更新 `index.html` 的导航链接

3. **添加资源**
   - 将图片放入 `images/` 目录
   - 将音乐放入 `music/` 目录
   - 其他文件放入 `assets/` 目录

## 📊 项目统计

- **总大小**：约 38 MB
- **最后更新**：2026年3月10日
- **Stars**：1
- **License**：Mulan Permissive Software License v2

## 🤝 参与贡献

欢迎提交问题、建议或改进代码！

### 贡献流程

1. **Fork 本仓库**
   ```bash
   点击 GitHub 页面的 Fork 按钮
   ```

2. **创建特性分支**
   ```bash
   git checkout -b feature/Feat_xxx
   ```

3. **提交更改**
   ```bash
   git add .
   git commit -m "Add some feature"
   git push origin feature/Feat_xxx
   ```

4. **发起 Pull Request**
   - 在 GitHub 上创建 Pull Request
   - 详细描述您的改进内容
   - 等待审核与合并

### 贡献指南

- 遵循现有代码风格
- 提供清晰的 commit 信息
- 更新相关文档
- 确保功能完整且测试无误

## ⚖️ 许可证

本项目采用 [Mulan Permissive Software License, Version 2](LICENSE) 许可证。

这意味着您可以：
- ✅ 自由使用、修改和分发
- ✅ 用于商业和个人项目
- ✅ 不需要开源衍生作品
- ⚠️ 需要保留原始许可证声明

## 📧 联系方式

- **GitHub**：[liuhaotian1122](https://github.com/liuhaotian1122)
- **项目地址**：[my-pages](https://github.com/liuhaotian1122/my-pages)
- **在线预览**：[访问网站](https://liuhaotian1122.github.io/my-pages)

## 🎯 未来计划

- [ ] 优化移动端响应式设计
- [ ] 增加暗黑主题支持
- [ ] 完善搜索功能
- [ ] 添加评论系统
- [ ] 性能优化和加载速度提升
- [ ] PWA 功能完善

## ✨ 致谢

感谢所有使用、支持和贡献此项目的人！

---

**最后更新**：2026年4月1日
