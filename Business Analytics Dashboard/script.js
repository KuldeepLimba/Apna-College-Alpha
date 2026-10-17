const services = [
  {
    name: "Private Limited Company",
    short: "Private Ltd.",
    count: 56,
    value: 654326,
    color: "#2864ee",
  },
  {
    name: "LLP Registration",
    short: "LLP",
    count: 16,
    value: 135272,
    color: "#11b7c9",
  },
  {
    name: "Trademark",
    short: "Trademark",
    count: 8,
    value: 22496,
    color: "#10b981",
  },
  {
    name: "Startup India Registration",
    short: "Startup India",
    count: 5,
    value: 22399,
    color: "#f59e0b",
  },
  {
    name: "ISO Certification",
    short: "ISO Cert.",
    count: 5,
    value: 7117,
    color: "#8b5cf6",
  },
  {
    name: "Penalty",
    short: "Penalty",
    count: 2,
    value: 27500,
    color: "#ec4899",
  },
  {
    name: "FSSAI License",
    short: "FSSAI",
    count: 4,
    value: 30000,
    color: "#0ea5e9",
  },
  {
    name: "Annual Compliance",
    short: "Compliance",
    count: 3,
    value: 27500,
    color: "#64748b",
  },
];
const leadSeed = [
  {
    name: "Nancy Singh",
    leads: 65,
    qualified: 32,
    converted: 12,
    quotes: 54,
    deals: 13,
    value: 99217,
    revenue: 52498,
    dept: "Sales",
  },
  {
    name: "Sneha Choudhary",
    leads: 4,
    qualified: 3,
    converted: 2,
    quotes: 13,
    deals: 5,
    value: 70980,
    revenue: 40000,
    dept: "Sales",
  },
  {
    name: "Tannu Kumari",
    leads: 8,
    qualified: 4,
    converted: 2,
    quotes: 22,
    deals: 4,
    value: 70430,
    revenue: 28420,
    dept: "Sales",
  },
  {
    name: "Gaurav Pant",
    leads: 7,
    qualified: 2,
    converted: 0,
    quotes: 8,
    deals: 1,
    value: 15000,
    revenue: 0,
    dept: "Operations",
  },
  {
    name: "Srishti Upadhyay",
    leads: 5,
    qualified: 1,
    converted: 0,
    quotes: 4,
    deals: 0,
    value: 0,
    revenue: 0,
    dept: "Operations",
  },
  {
    name: "Azam Afaroz",
    leads: 2,
    qualified: 0,
    converted: 0,
    quotes: 6,
    deals: 0,
    value: 0,
    revenue: 0,
    dept: "Operations",
  },
];
const paymentsSeed = [
  ["2026-10-16", "Private Limited Co.", 18400, "Collected"],
  ["2026-10-15", "LLP Registration", 12000, "Collected"],
  ["2026-10-14", "Trademark", 6500, "Pending"],
  ["2026-10-12", "Startup India Reg.", 9800, "Collected"],
  ["2026-10-10", "ISO Certification", 4200, "Pending"],
  ["2026-10-08", "Private Limited Co.", 15000, "Collected"],
  ["2026-10-05", "FSSAI License", 6000, "Failed"],
];
const activitySeed = [
  ["10:14 AM", "Nancy Singh", "Lead updated"],
  ["10:08 AM", "Nancy Singh", "Lead assigned"],
  ["09:53 AM", "Sneha Choudhary", "Payment recorded"],
  ["09:42 AM", "Sneha Choudhary", "Order created"],
  ["09:31 AM", "Tannu Kumari", "Deal created"],
  ["09:27 AM", "Sneha Choudhary", "Quotation created"],
  ["09:12 AM", "Tannu Kumari", "Quotation created"],
];
const money = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const fmt = (n) => Math.round(n).toLocaleString("en-IN");
let state = { days: 30, start: null, end: null, users: "all", dept: "all" };
function rangeFactor() {
  if (state.days === "custom") {
    let a = new Date(state.start),
      b = new Date(state.end);
    return Math.max(1, Math.min(365, Math.round((b - a) / 86400000) + 1)) / 30;
  }
  return Number(state.days) / 30;
}
function filteredUsers() {
  return leadSeed.filter(
    (x) =>
      (state.users === "all" || x.name === state.users) &&
      (state.dept === "all" || x.dept === state.dept),
  );
}
function metrics() {
  let f = rangeFactor(),
    users = filteredUsers();
  let base = users.reduce(
    (a, u) => {
      for (let k of [
        "leads",
        "qualified",
        "converted",
        "quotes",
        "deals",
        "value",
        "revenue",
      ])
        a[k] = (a[k] || 0) + u[k];
      return a;
    },
    {
      leads: 0,
      qualified: 0,
      converted: 0,
      quotes: 0,
      deals: 0,
      value: 0,
      revenue: 0,
    },
  );
  let deptScale =
    state.dept === "Operations" ? 0.23 : state.dept === "Sales" ? 0.77 : 1;
  if (state.users !== "all") deptScale = 1;
  for (let k of ["leads", "qualified", "converted", "quotes", "deals"])
    base[k] = Math.max(0, Math.round(base[k] * f));
  base.value = Math.round(base.value * f);
  base.revenue = Math.round(base.revenue * f);
  if (state.dept === "all" && state.users === "all") {
    base = {
      leads: Math.round(91 * f),
      qualified: Math.round(42 * f),
      converted: Math.round(16 * f),
      quotes: Math.round(107 * f),
      deals: Math.round(23 * f),
      value: Math.round(182627 * f),
      revenue: Math.round(120698 * f),
    };
  }
  base.unqualified = Math.max(0, base.leads - base.qualified);
  base.rate = base.leads ? (base.converted / base.leads) * 100 : 0;
  base.quoteRate = base.quotes ? (base.deals / base.quotes) * 100 : 0;
  return base;
}
function renderKpis(m) {
  let items = [
    ["New Leads", m.leads, "♙", "leads"],
    ["Qualified Leads", m.qualified, "✓", "qualified"],
    ["Converted Leads", m.converted, "◎", "converted"],
    ["Unqualified Leads", m.unqualified, "⊗", "unqualified"],
    ["Conversion Rate", m.rate.toFixed(1) + "%", "▽", "rate"],
    ["Quotations Created", m.quotes, "▤", "quotes"],
    ["Deals Created", m.deals, "▣", "deals"],
    ["Invoices Generated", Math.round(m.deals * 6.17), "＄", "invoices"],
  ];
  let comps = [
    "+57.2%",
    "+34.4%",
    "+40.7%",
    "+43.0%",
    "+61.7%",
    "+127.7%",
    "+61.7%",
    "+19.7%",
  ];
  document.getElementById("kpis").innerHTML = items
    .map(
      (x, i) =>
        `<div class="card kpi" data-detail="${x[3]}"><div class="kpi-label"><i class="icon">${x[2]}</i>${x[0]}</div><div class="kpi-value">${typeof x[1] === "number" ? fmt(x[1]) : x[1]}</div><div class="kpi-bottom"><span class="up">↗ ${state.days === 1 ? "—" : comps[i]} </span><span>vs previous period</span></div></div>`,
    )
    .join("");
  document
    .querySelectorAll(".kpi")
    .forEach((el) => (el.onclick = () => openDetail(el.dataset.detail)));
}
function renderFunnel(m) {
  let vals = [
    ["New Leads", m.leads, "100%"],
    [
      "Qualified",
      m.qualified,
      m.leads ? ((m.qualified / m.leads) * 100).toFixed(1) + "%" : "0%",
    ],
    [
      "Converted",
      m.converted,
      m.leads ? ((m.converted / m.leads) * 100).toFixed(1) + "%" : "0%",
    ],
  ];
  document.getElementById("funnel").innerHTML =
    vals
      .map(
        (v, i) =>
          `<div class="funnel-step" data-stage="${i}">${v[0]}<b>${fmt(v[1])} (${v[2]})</b></div>`,
      )
      .join("") +
    `<div style="margin-top:5px;padding:8px 13px;border:1px dashed #c9b7ff;color:#7c3aed;border-radius:7px;text-align:center;cursor:pointer" onclick="openDetail('unqualified')">Unqualified <b>${fmt(m.unqualified)}</b></div>`;
  document
    .querySelectorAll(".funnel-step")
    .forEach(
      (el) =>
        (el.onclick = () =>
          openDetail(["leads", "qualified", "converted"][+el.dataset.stage])),
    );
}
function drawLine(id, series, labels) {
  let c = document.getElementById(id);
  if (!c) return;
  let r = c.getBoundingClientRect(),
    dpr = window.devicePixelRatio || 1;
  c.width = Math.max(260, r.width) * dpr;
  c.height = Math.max(120, r.height) * dpr;
  let ctx = c.getContext("2d");
  ctx.scale(dpr, dpr);
  let w = c.width / dpr,
    h = c.height / dpr,
    p = { l: 28, r: 7, t: 10, b: 22 },
    cw = w - p.l - p.r,
    ch = h - p.t - p.b;
  ctx.font = "9px system-ui";
  ctx.strokeStyle = "#edf1f7";
  ctx.fillStyle = "#8391a7";
  ctx.lineWidth = 1;
  let max = Math.max(5, ...series.flatMap((s) => s.data)) * 1.15;
  for (let i = 0; i <= 4; i++) {
    let y = p.t + (ch * i) / 4;
    ctx.beginPath();
    ctx.moveTo(p.l, y);
    ctx.lineTo(w - p.r, y);
    ctx.stroke();
    ctx.fillText(Math.round(max * (1 - i / 4)), 2, y + 3);
  }
  series.forEach((s) => {
    ctx.beginPath();
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 2;
    s.data.forEach((v, i) => {
      let x = p.l + (cw * i) / Math.max(1, s.data.length - 1),
        y = p.t + ch * (1 - v / max);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    s.data.forEach((v, i) => {
      let x = p.l + (cw * i) / Math.max(1, s.data.length - 1),
        y = p.t + ch * (1 - v / max);
      ctx.beginPath();
      ctx.fillStyle = s.color;
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
  });
  let count = labels.length;
  labels.forEach((l, i) => {
    if (i % Math.ceil(count / 6) === 0 || i === count - 1) {
      let x = p.l + (cw * i) / Math.max(1, count - 1);
      ctx.fillStyle = "#8391a7";
      ctx.fillText(l, x - 8, h - 5);
    }
  });
}
function renderSources(m) {
  let src = [
    ["Google Ads", 0.769, "#2864ee"],
    ["Website", 0.231, "#11b981"],
    ["Other", 0, "#f59e0b"],
    ["Just Dial", 0, "#8b5cf6"],
  ];
  let a = 0,
    parts = src.map((s) => {
      let v = s[1] * 100,
        st = a;
      a += v;
      return `${s[2]} ${st}% ${a}%`;
    });
  document.getElementById("sourceDonut").style.background =
    `conic-gradient(${parts.join(",")})`;
  document.getElementById("sourceTotal").textContent = fmt(m.leads);
  document.getElementById("sourceList").innerHTML = src
    .map(
      (s) =>
        `<div class="source-item"><span><i class="dot" style="background:${s[2]}"></i>${s[0]}</span><b>${fmt(Math.round(m.leads * s[1]))} (${(s[1] * 100).toFixed(1)}%)</b></div>`,
    )
    .join("");
}
function renderBars(id, data) {
  let max = Math.max(1, ...data.map((d) => d.value));
  document.getElementById(id).innerHTML = data
    .map(
      (d) =>
        `<div class="bar-group" title="${d.name}: ${d.value}"><div class="bar-number">${d.label ?? fmt(d.value)}</div><div class="bar" style="height:${Math.max(3, (d.value / max) * 78)}%;background:${d.color || "var(--blue)"}"></div><div class="bar-label">${d.short || d.name}</div></div>`,
    )
    .join("");
}
function renderHorizontal(id, data) {
  let max = Math.max(1, ...data.map((d) => d.value));
  document.getElementById(id).innerHTML = data
    .map(
      (d) =>
        `<div class="hrow"><span title="${d.name}">${d.short || d.name}</span><div class="hbar"><i style="width:${(d.value / max) * 100}%;background:${d.color || "var(--blue)"}"></i></div><b style="text-align:right">${d.display || money(d.value)}</b></div>`,
    )
    .join("");
}
function renderTables(m) {
  let serviceData = services.map((s, i) => {
    let q = Math.round(
      s.count * rangeFactor() * (state.users === "all" ? 1 : 0.35),
    );
    let accepted = Math.round(q * (i === 0 ? 0.0 : i === 1 ? 0.0 : 0.0));
    return {
      ...s,
      q,
      value: Math.round(s.value * rangeFactor()),
      accepted,
      pending: q - accepted,
      rejected: 0,
    };
  });
  if (state.users !== "all") {
    serviceData = serviceData.map((s) => ({
      ...s,
      q: Math.round(s.q * 0.4),
      value: Math.round(s.value * 0.4),
    }));
  }
  document.getElementById("serviceTable").innerHTML = serviceData
    .map(
      (s) =>
        `<tr onclick="openService('${s.name.replace(/'/g, "\\'")}')"><td>${s.name}</td><td class="num">${s.q}</td><td class="num">${money(s.value)}</td><td class="num">${s.accepted}</td><td class="num">${s.pending}</td><td class="num">${s.rejected}</td><td class="num">${s.q ? Math.round((s.accepted / s.q) * 100) : 0}%</td></tr>`,
    )
    .join("");
  renderBars(
    "quotationBars",
    serviceData
      .slice(0, 6)
      .map((s) => ({
        name: s.name,
        short: s.short,
        value: s.q,
        label: s.q,
        color: s.color,
      })),
  );
  renderHorizontal(
    "quotationValues",
    serviceData
      .slice(0, 6)
      .map((s) => ({
        name: s.name,
        short: s.short,
        value: s.value,
        display: money(s.value),
        color: s.color,
      })),
  );
  let revCats = [
    ["General Filing", 29700],
    ["Private Limited", 26300],
    ["FSSAI License", 15000],
    ["Annual Compliance", 7900],
    ["Website development", 8600],
    ["Other", 6000],
  ].map(([name, value]) => ({
    name,
    short: name,
    value: Math.round(value * rangeFactor()),
    display: money(value * rangeFactor()),
  }));
  renderHorizontal("revenueCategories", revCats);
  let priorities = [
    ["High", Math.round(m.deals * 0.61), Math.round(m.value * 0.36), "#ef5261"],
    [
      "Medium",
      Math.round(m.deals * 0.39),
      Math.round(m.value * 0.64),
      "#f59e0b",
    ],
    ["Low", 0, 0, "#11b981"],
  ];
  document.getElementById("priorityTable").innerHTML =
    '<div class="target"><span>Priority</span><span>Deals</span><span>Revenue</span></div>' +
    priorities
      .map(
        (p) =>
          `<div class="priority-row"><i class="dot" style="background:${p[3]}"></i><span>${p[0]}</span><b>${p[1]}</b><b>${money(p[2])}</b></div>`,
      )
      .join("");
  let orderNames = [
    "Private Limited Company",
    "ISO Certification",
    "DSC & DIN Services",
    "Penalty",
    "LLP Registration",
    "Trademark",
  ];
  document.getElementById("ordersTable").innerHTML = orderNames
    .map((n, i) => {
      let total = Math.max(
          1,
          Math.round([9, 3, 3, 2, 2, 2][i] * rangeFactor()),
        ),
        progress = [88, 70, 58, 35, 45, 25][i];
      return `<tr onclick="openService('${n}')"><td>${n}</td><td><div class="progress" style="width:95px;display:flex"><i style="width:${progress}%;background:var(--orange)"></i></div></td><td class="num">${total}</td><td><span class="pill ${progress > 70 ? "green" : "orange"}">${progress > 70 ? "In progress" : "Pending"}</span></td></tr>`;
    })
    .join("");
  document.getElementById("paymentsTable").innerHTML = paymentsSeed
    .slice(0, 6)
    .map(
      (p) =>
        `<tr onclick="openPayment('${p[1]}',${p[2]},'${p[3]}')"><td>${p[0].slice(5)}</td><td>${p[1]}</td><td class="num">${money(p[2] * rangeFactor())}</td><td><span class="pill ${p[3] === "Collected" ? "green" : p[3] === "Failed" ? "red" : "orange"}">${p[3]}</span></td></tr>`,
    )
    .join("");
  document.getElementById("activityTable").innerHTML = activitySeed
    .map(
      (a) =>
        `<tr onclick="openDetail('activity')"><td>${a[0]}</td><td>${a[1]}</td><td>${a[2]}</td></tr>`,
    )
    .join("");
  document.getElementById("quoteRate").textContent =
    m.quoteRate.toFixed(1) + "%";
  document
    .getElementById("quoteRing")
    .style.setProperty("--rate", m.quoteRate + "%");
  document.getElementById("quoteSummary").textContent =
    `${m.deals} Deals / ${m.quotes} Quotations`;
}
function render() {
  let m = metrics();
  renderKpis(m);
  renderFunnel(m);
  renderSources(m);
  let target = 850000,
    ach = m.revenue;
  document.getElementById("achieved").textContent = money(ach);
  document.getElementById("targetPct").textContent =
    ((ach / target) * 100).toFixed(1) + "%";
  document.getElementById("remaining").textContent = money(
    Math.max(0, target - ach),
  );
  document.getElementById("targetBar").style.width =
    Math.min(100, (ach / target) * 100) + "%";
  document.getElementById("totalRevenue").textContent = money(m.value);
  let collected = Math.round(m.revenue);
  document.getElementById("collectedRevenue").textContent = money(collected);
  document.getElementById("outstandingRevenue").textContent = money(
    Math.max(0, m.value - collected),
  );
  renderTables(m);
  let count = Math.max(
    7,
    Math.min(
      31,
      Math.round(state.days === "custom" ? rangeFactor() * 30 : state.days),
    ),
  );
  let labels = Array.from({ length: count }, (_, i) => {
    let d = new Date();
    d.setDate(d.getDate() - count + 1 + i);
    return d.getDate() + " " + d.toLocaleString("en", { month: "short" });
  });
  let factor = rangeFactor();
  let series = (base, phase) =>
    Array.from({ length: count }, (_, i) =>
      Math.max(
        0,
        Math.round(
          base *
            (0.25 + 0.75 * Math.abs(Math.sin((i + phase) * 0.58))) *
            (i > count - 5 ? 0.25 : 1) *
            factor,
        ),
      ),
    );
  drawLine(
    "leadChart",
    [
      { data: series(20, 1), color: "#2864ee" },
      { data: series(10, 2), color: "#11b981" },
      { data: series(5, 4), color: "#f59e0b" },
    ],
    labels,
  );
  drawLine(
    "revenueChart",
    [
      { data: series(18000, 1), color: "#2864ee" },
      { data: series(12000, 2), color: "#11b981" },
    ],
    labels,
  );
  drawLine(
    "collectionChart",
    [{ data: series(15000, 2), color: "#11b981" }],
    labels,
  );
  document.getElementById("collectionSummary").textContent =
    "Collected " +
    money(collected) +
    " · Outstanding " +
    money(Math.max(0, m.value - collected));
  renderBars(
    "dealsBars",
    services
      .slice(0, 6)
      .map((s, i) => ({
        name: s.name,
        short: s.short,
        value: Math.round([6, 5, 3, 2, 2, 2][i] * factor),
        label: fmt(Math.round([6, 5, 3, 2, 2, 2][i] * factor)),
        color: s.color,
      })),
  );
}
function openDetail(type) {
  let m = metrics(),
    title =
      {
        leads: "Lead Details",
        qualified: "Qualified Leads",
        converted: "Converted Leads",
        unqualified: "Unqualified Leads",
        rate: "Lead Conversion Rate",
        quotes: "Quotation Details",
        deals: "Deal Details",
        invoices: "Invoice Summary",
        activity: "Recent CRM Activity",
      }[type] || "Analytics Details";
  let rows = filteredUsers()
    .map(
      (u) =>
        `<tr><td>${u.name}</td><td>${fmt(Math.round(u.leads * rangeFactor()))}</td><td>${fmt(Math.round(u.qualified * rangeFactor()))}</td><td>${fmt(Math.round(u.converted * rangeFactor()))}</td><td>${fmt(Math.round(u.quotes * rangeFactor()))}</td><td>${money(u.revenue * rangeFactor())}</td></tr>`,
    )
    .join("");
  let value =
    {
      leads: m.leads,
      qualified: m.qualified,
      converted: m.converted,
      unqualified: m.unqualified,
      rate: m.rate.toFixed(1) + "%",
      quotes: m.quotes,
      deals: m.deals,
      invoices: Math.round(m.deals * 6.17),
      activity: activitySeed.length,
    }[type] ?? "—";
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalBody").innerHTML =
    `<div class="detail-cards"><div><small>Selected period</small><strong>${state.days === "custom" ? state.start + " – " + state.end : state.days === "today" ? "Today" : "Last " + state.days + " days"}</strong></div><div><small>${title}</small><strong>${typeof value === "number" ? fmt(value) : value}</strong></div><div><small>Revenue</small><strong>${money(m.revenue)}</strong></div></div><h3>Breakdown by team member</h3><div class="table-wrap"><table><thead><tr><th>Employee</th><th>Leads</th><th>Qualified</th><th>Converted</th><th>Quotes</th><th>Revenue</th></tr></thead><tbody>${rows || '<tr><td colspan="6">No matching data</td></tr>'}</tbody></table></div><p class="sub">This is demonstration data. Select a service row or payment record for a more specific drill-down.</p>`;
  document.getElementById("modalBackdrop").classList.add("open");
}
function openService(name) {
  let s = services.find((x) => x.name === name) || { name, count: 0, value: 0 };
  document.getElementById("modalTitle").textContent = name + " · Drill-down";
  document.getElementById("modalBody").innerHTML =
    `<div class="detail-cards"><div><small>Quotations</small><strong>${fmt(Math.round((s.count || 3) * rangeFactor()))}</strong></div><div><small>Quoted value</small><strong>${money((s.value || 15000) * rangeFactor())}</strong></div><div><small>Order status</small><strong>In progress</strong></div></div><h3>Related records</h3><div class="table-wrap"><table><thead><tr><th>Record</th><th>Owner</th><th>Amount</th><th>Status</th></tr></thead><tbody>${["Quotation", "Deal", "Order", "Payment"].map((t, i) => `<tr><td>${t} #${String(10467 + i).padStart(5, "0")}</td><td>${leadSeed[i % 3].name}</td><td>${money((s.value || 15000) * [1, 0.8, 0.65, 0.3][i] * rangeFactor())}</td><td><span class="pill ${i === 3 ? "green" : "orange"}">${["Sent", "Created", "In progress", "Partially paid"][i]}</span></td></tr>`).join("")}</tbody></table></div>`;
  document.getElementById("modalBackdrop").classList.add("open");
}
function openPayment(name, amount, status) {
  document.getElementById("modalTitle").textContent = "Payment · " + name;
  document.getElementById("modalBody").innerHTML =
    `<div class="detail-cards"><div><small>Payment amount</small><strong>${money(amount * rangeFactor())}</strong></div><div><small>Status</small><strong>${status}</strong></div><div><small>Method</small><strong>Bank transfer</strong></div></div><h3>Payment timeline</h3><p>Invoice generated → Payment ${status === "Collected" ? "received and reconciled" : status === "Failed" ? "failed; retry required" : "awaiting confirmation"} → Ledger ${status === "Collected" ? "updated" : "pending update"}.</p>`;
  document.getElementById("modalBackdrop").classList.add("open");
}
document.getElementById("period").addEventListener("change", (e) => {
  let v = e.target.value;
  state.days = v === "custom" ? "custom" : v;
  document
    .getElementById("customDates")
    .classList.toggle("show", v === "custom");
  if (v !== "custom") render();
  else {
    let end = new Date(),
      start = new Date();
    start.setDate(end.getDate() - 29);
    document.getElementById("startDate").value = start
      .toISOString()
      .slice(0, 10);
    document.getElementById("endDate").value = end.toISOString().slice(0, 10);
    state.start = document.getElementById("startDate").value;
    state.end = document.getElementById("endDate").value;
    render();
  }
});
["startDate", "endDate"].forEach((id) =>
  document.getElementById(id).addEventListener("change", () => {
    state.start = document.getElementById("startDate").value;
    state.end = document.getElementById("endDate").value;
    if (state.start && state.end && state.start <= state.end) render();
    else toast("Choose a valid date range.");
  }),
);
document.getElementById("userFilter").addEventListener("change", (e) => {
  state.users = e.target.value;
  render();
});
document.getElementById("deptFilter").addEventListener("change", (e) => {
  state.dept = e.target.value;
  render();
});
document.getElementById("modalClose").onclick = () =>
  document.getElementById("modalBackdrop").classList.remove("open");
document.getElementById("modalBackdrop").addEventListener("click", (e) => {
  if (e.target.id === "modalBackdrop") e.currentTarget.classList.remove("open");
});
window.addEventListener("resize", () => {
  clearTimeout(window._resize);
  window._resize = setTimeout(render, 150);
});
function toast(s) {
  let t = document.getElementById("toast");
  t.textContent = s;
  t.style.display = "block";
  setTimeout(() => (t.style.display = "none"), 2600);
}
document.getElementById("exportBtn").onclick = () => {
  let m = metrics(),
    rows = [
      ["Metric", "Value"],
      [
        "Date range",
        state.days === "custom"
          ? state.start + " to " + state.end
          : state.days === "today"
            ? "Today"
            : "Last " + state.days + " days",
      ],
      ["New Leads", m.leads],
      ["Qualified Leads", m.qualified],
      ["Converted Leads", m.converted],
      ["Unqualified Leads", m.unqualified],
      ["Lead Conversion Rate", m.rate.toFixed(1) + "%"],
      ["Quotations", m.quotes],
      ["Deals", m.deals],
      ["Total Deal Value", m.value],
      ["Collected Revenue", m.revenue],
      ["Outstanding Revenue", Math.max(0, m.value - m.revenue)],
      [],
      ["Service", "Quotation Count", "Quotation Value"],
      ...services.map((s) => [
        s.name,
        Math.round(s.count * rangeFactor()),
        Math.round(s.value * rangeFactor()),
      ]),
    ];
  let csv = rows
    .map((r) =>
      r.map((v) => '"' + String(v ?? "").replace(/"/g, '""') + '"').join(","),
    )
    .join("\r\n");
  let blob = new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = "business-analytics-report.csv";
  a.click();
  URL.revokeObjectURL(url);
  toast("CSV report exported successfully.");
};
render();
