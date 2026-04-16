function averageScore(scores) {
  const values = Object.values(scores);
  const total = values.reduce((sum, value) => sum + value, 0);
  return +(total / values.length).toFixed(2);
}

function pickRecommendations(products) {
  const sortedByAvg = [...products].sort((a, b) => b.avgScore - a.avgScore);
  const bestOverall = sortedByAvg[0];
  const bestEnterprise = [...products]
    .sort((a, b) => b.scenarioFit["企业服务"] - a.scenarioFit["企业服务"])[0];
  const bestSmb = [...products]
    .sort((a, b) => b.scenarioFit["SaaS"] - a.scenarioFit["SaaS"])[0];

  return [
    {
      title: "综合能力最佳",
      product: bestOverall.name,
      reason: `综合评分 ${bestOverall.avgScore}，在多维能力上最均衡。`
    },
    {
      title: "企业级优先",
      product: bestEnterprise.name,
      reason: `企业服务场景适配度 ${bestEnterprise.scenarioFit["企业服务"]}，适合复杂组织。`
    },
    {
      title: "快速落地优先",
      product: bestSmb.name,
      reason: `SaaS 场景适配度 ${bestSmb.scenarioFit["SaaS"]}，更适合轻量快速上线。`
    }
  ];
}

function createCharts(products, dimensions) {
  const labels = products.map((p) => p.name);
  const avgData = products.map((p) => p.avgScore);

  const palette = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#7c3aed"];

  const radarDatasets = products.map((p, idx) => ({
    label: p.name,
    data: dimensions.map((dimension) => p.scores[dimension]),
    borderColor: palette[idx % palette.length],
    backgroundColor: "rgba(0,0,0,0)",
    borderWidth: 2
  }));

  new Chart(document.getElementById("radarChart"), {
    type: "radar",
    data: { labels: dimensions, datasets: radarDatasets },
    options: {
      responsive: true,
      scales: { r: { min: 0, max: 10, ticks: { stepSize: 2 } } }
    }
  });

  new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "综合评分",
          data: avgData,
          backgroundColor: palette
        }
      ]
    },
    options: {
      responsive: true,
      scales: { y: { min: 0, max: 10 } }
    }
  });

  new Chart(document.getElementById("scenarioChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "电商",
          data: products.map((p) => p.scenarioFit["电商"]),
          backgroundColor: "#60a5fa"
        },
        {
          label: "SaaS",
          data: products.map((p) => p.scenarioFit["SaaS"]),
          backgroundColor: "#34d399"
        },
        {
          label: "企业服务",
          data: products.map((p) => p.scenarioFit["企业服务"]),
          backgroundColor: "#fbbf24"
        }
      ]
    },
    options: {
      responsive: true,
      scales: { y: { min: 0, max: 10 } }
    }
  });
}

function renderCards(products) {
  const target = document.getElementById("productCards");
  target.innerHTML = products
    .map(
      (p) => `
      <article class="card">
        <h3>${p.name}</h3>
        <p class="muted">${p.region} | <a href="${p.website}" target="_blank" rel="noreferrer">官网</a></p>
        <p>${p.positioning}</p>
        <p><strong>目标客户：</strong>${p.targetCustomers}</p>
        <p><strong>起步价格：</strong>${p.pricingStart}</p>
        <div>${p.coreFeatures.map((feature) => `<span class="pill">${feature}</span>`).join("")}</div>
      </article>
    `
    )
    .join("");
}

function renderTable(products, dimensions) {
  const thead = document.querySelector("#compareTable thead");
  const tbody = document.querySelector("#compareTable tbody");

  thead.innerHTML = `
    <tr>
      <th>产品</th>
      <th>定位</th>
      <th>主要渠道</th>
      <th>计费模式</th>
      <th>综合评分</th>
      ${dimensions.map((dimension) => `<th>${dimension}</th>`).join("")}
    </tr>
  `;

  tbody.innerHTML = products
    .map(
      (p) => `
      <tr>
        <td>${p.name}</td>
        <td>${p.positioning}</td>
        <td>${p.channels.join(" / ")}</td>
        <td>${p.billingModel}</td>
        <td>${p.avgScore}</td>
        ${dimensions.map((dimension) => `<td>${p.scores[dimension]}</td>`).join("")}
      </tr>
    `
    )
    .join("");
}

function renderConclusions(recommendations) {
  const target = document.getElementById("conclusions");
  target.innerHTML = recommendations
    .map(
      (item) => `
      <article class="conclusion-item">
        <h4>${item.title}</h4>
        <p><strong>${item.product}</strong></p>
        <p>${item.reason}</p>
      </article>
    `
    )
    .join("");
}

function renderSources(products) {
  const sourceSet = new Set();
  products.forEach((p) => p.sources.forEach((url) => sourceSet.add(url)));
  const list = document.getElementById("sourceList");
  list.innerHTML = [...sourceSet]
    .map((url) => `<li><a href="${url}" target="_blank" rel="noreferrer">${url}</a></li>`)
    .join("");
}

async function bootstrap() {
  const response = await fetch("./data/products.json");
  const data = await response.json();

  const products = data.products.map((p) => ({
    ...p,
    avgScore: averageScore(p.scores)
  }));
  const dimensions = data.dimensions;

  document.getElementById(
    "metaLine"
  ).textContent = `赛道：${data.meta.track} | 范围：${data.meta.scope} | 更新时间：${data.meta.updatedAt}`;
  document.getElementById("methodText").textContent = `${data.meta.method} ${data.meta.currencyNote}`;

  renderCards(products);
  renderTable(products, dimensions);
  createCharts(products, dimensions);
  renderConclusions(pickRecommendations(products));
  renderSources(products);
}

bootstrap().catch((error) => {
  document.body.innerHTML = `<p style="padding: 24px;">页面加载失败：${error.message}</p>`;
});
