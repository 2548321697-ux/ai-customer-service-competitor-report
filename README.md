# AI客服竞品横评网页

一个可直接发布到 GitHub Pages 的静态报告页，覆盖 5 个中外 AI 客服产品，包含：

- 竞品总览卡片
- 关键维度对比表
- 雷达图、综合评分柱状图、场景适配度图
- 结论与选型建议
- 信息来源链接

## 本地查看

由于页面通过 `fetch` 读取本地 `data/products.json`，建议用本地静态服务启动：

```bash
python -m http.server 8000
```

然后访问：`http://localhost:8000`

## 文件结构

- `index.html`：报告主页面
- `styles.css`：页面样式
- `app.js`：数据渲染与图表逻辑
- `data/products.json`：5个竞品结构化数据与来源

## GitHub Pages 发布步骤

1. 初始化仓库并提交代码

```bash
git init
git add .
git commit -m "feat: add AI customer service competitor analysis report page"
```

2. 创建 GitHub 仓库并关联远端

```bash
git remote add origin https://github.com/<your-name>/<repo-name>.git
git branch -M main
git push -u origin main
```

3. 在仓库页面开启 GitHub Pages

- 进入仓库 `Settings` -> `Pages`
- `Source` 选择 `Deploy from a branch`
- 分支选择 `main`，目录选择 `/ (root)`
- 保存后等待发布完成

4. 使用分配到的 Pages URL 验证页面内容

## 数据说明

- 数据来源于公开网页信息，已在页面末尾列出来源链接。
- 涉及不同币种报价时按原币种保留展示，不进行汇率换算。
- 评分为统一模型下的对比参考，建议在企业实际选型时结合 PoC 再决策。
