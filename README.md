# 个人介绍网站 · 使用说明

纯静态网站，**无需安装任何依赖**，双击 `index.html` 即可打开。

## 页面结构（两大部分）

| 页面 | 内容 |
| --- | --- |
| `index.html` | **第一部分：姓名与基本信息** —— 姓名、院校、专业、城市、电话、邮箱、网址等明细；下方依次为个人简介、教育背景、能力结构、成长经历、荣誉奖项、联系方式 |
| `website.html` | **第二部分：我的网站介绍** —— 作品横幅、网址、实时预览、功能亮点、技术栈、开发历程、挑战与收获、截图、相关链接 |

顶部导航可在「基本信息 / 我的网站」两个部分之间切换。

## 其它文件

```
content.js   ★ 全部网站内容都在这里，改这一个文件就够
app.js       渲染引擎（把 content.js 填进页面，一般不需要改）
style.css    样式文件（正式简约风格）
```

## 如何修改内容

### 方式一：直接编辑 `content.js`（推荐，永久生效）

用记事本 / VS Code 打开 `content.js`，改完保存、刷新浏览器即可生效。

| 我想改什么 | 修改这里 |
| --- | --- |
| 首页左侧那张信息表（姓名、院校、电话、邮箱、网址…） | `basic`（可自由增删行，留空自动隐藏） |
| 姓名、学校、专业、一句话简介、座右铭 | `profile` |
| 教育背景 | `education` |
| 技能与熟练度百分比 | `skillGroups` |
| 主修课程标签 | `courses` |
| 成长时间线 | `timeline` |
| 荣誉奖项 | `awards` |
| **第二部分：作品网站的名称、网址、介绍、功能、技术栈、历程、FAQ、截图** | `myWebsite` |
| 邮箱 / 微信 / QQ / GitHub | `contact` |
| 页脚文字 | `footer` |

### 方式二：在网页上直接改（所见即所得）

点击右上角「铅笔」图标进入编辑模式 → 直接点击页面文字修改 → 失焦自动保存（存在浏览器本地）→
点「导出修改」下载 `content-overrides.json`，把字段按同样路径写回 `content.js` 即可永久保存；
点「恢复默认」可撤销本地改动。

## 关于第二部分（`website.html`）

- 网址写在 `content.js` 的 `myWebsite.url`，已填入 `https://lyh18328594590.pythonanywhere.com/`。
- 页面会以 iframe 形式**实时嵌入预览**；若目标站禁止被嵌入，会自动显示「在新窗口打开」的兜底提示。
- 关闭预览：把 `myWebsite.showPreview` 改为 `false`。
- 个人照片：放进 `assets/img/`，在 `profile.avatar` 里写路径即可。

## 本地预览

在项目文件夹打开终端执行：

```bash
python -m http.server 8000
```

然后访问 http://localhost:8000 。

> 提示：`content.js` 中的文字不要出现英文引号 `"`（如需引号请用中文引号 “ ”）。

## 部署到公网（GitHub Pages，免费、长期可用）

本机当前未安装 git / GitHub CLI，且部署需要**你的** GitHub 账号登录态（无法由我代为推送）。
项目已配置好可直接上线：纯静态、全部使用相对路径，并已添加 `.nojekyll`。

### 方式 A：用命令（需先装好 Git）

1. 在 GitHub 上新建一个**公开仓库**（仓库名随意，例如 `my-profile`）。
2. 在本项目文件夹打开终端，依次执行（把 `你的用户名` 和 `仓库名` 替换成实际的）：

```bash
git init
git add .
git commit -m "个人介绍网站"
git branch -M main
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

3. 进入仓库 **Settings → Pages → Build and deployment**：
   - Source 选 **Deploy from a branch**
   - Branch 选 **main** / 目录 **/(root)**
   - 点击 Save
4. 等待 1–2 分钟，访问 `https://你的用户名.github.io/仓库名/` 即可。

> 这个 `*.github.io` 网址**长期免费有效**，只要仓库不删除就一直能用。
> 若想用自己申请的域名（如 `www.xxx.com`），在 Pages 设置里填 Custom domain 并按提示加一条 CNAME 解析即可。

### 方式 B：不想敲命令 —— 用 GitHub Desktop

1. 下载安装 GitHub Desktop 并登录账号。
2. File → Add Local Repository，选择本项目文件夹，发布（Publish）为一个公开仓库。
3. 之后在仓库 **Settings → Pages** 按方式 A 第 3 步开启即可。

### 以后怎么更新内容

改完 `content.js`（或网页内编辑后导出写回）后，重新执行：

```bash
git add .
git commit -m "更新内容"
git push
```

GitHub Pages 会自动重新发布，通常几十秒后生效。

---
<details><summary>我可以帮你做这一步吗？（需要你提供 GitHub 访问令牌）</summary>

如果你愿意，可以生成一个 **GitHub Personal Access Token（classic，勾选 repo 权限）** 发给我，我就用 Git/API 帮你建仓库、推送并开启 Pages。
⚠️ 令牌等同于账号密码，请仅在可信环境使用，用后及时撤销（Settings → Developer settings → Personal access tokens）。
另一种更安全的做法：由你在自己电脑上按上面的命令执行，我把每条命令都给你准备好。

</details>

