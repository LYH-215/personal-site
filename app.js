/* =========================================================================
 *  app.js —— 网站通用渲染引擎
 *  作用：把 content.js 里的数据自动填充到页面中
 *  一般情况下你不需要修改本文件，改 content.js 就够了
 * ========================================================================= */
(function () {
  "use strict";

  /* ------------------------- 工具函数 ------------------------- */
  const get = (path) =>
    path.split(".").reduce((obj, key) => (obj == null ? undefined : obj[key]), window.SITE);

  const set = (path, value) => {
    const keys = path.split(".");
    const last = keys.pop();
    const target = keys.reduce((obj, key) => {
      if (obj[key] == null) obj[key] = {};
      return obj[key];
    }, window.SITE);
    target[last] = value;
  };

  const esc = (str) =>
    String(str == null ? "" : str).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  /* ------------------------- 图标库 ------------------------- */
  const ICONS = {
    "arrow-right": '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
    "external-link": '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    phone: '<path d="M6 3h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 4 5a2 2 0 0 1 2-2z"/>',
    "map-pin": '<path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 5.2a3.5 3.5 0 0 1 0 6.6"/><path d="M18 20a6 6 0 0 0-2-4.5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    award: '<circle cx="12" cy="9" r="5.5"/><path d="M8.5 14L7 21l5-3 5 3-1.5-7"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2z"/><path d="M8 3v18"/>',
    code: '<path d="M9 7l-5 5 5 5"/><path d="M15 7l5 5-5 5"/>',
    rocket: '<path d="M12 2l3 6 6 3-6 3-3 6-3-6-6-3 6-3z"/><circle cx="12" cy="11" r="2"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 17.5l9 5 9-5"/>',
    chart: '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-4M12.5 16V8M17 16v-7"/>',
    shield: '<path d="M12 3l8 3v5.5c0 5-4 7.5-8 9.5-4-2-8-4.5-8-9.5V6z"/>',
    puzzle: '<path d="M4 4h6v2a2 2 0 1 0 4 0V4h6v6h-2a2 2 0 1 0 0 4h2v6h-6v-2a2 2 0 1 0-4 0v2H4v-6h2a2 2 0 1 0 0-4H4z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z"/>',
    message: '<path d="M4 5h16v11H8l-4 4z"/>',
    github: '<circle cx="12" cy="12" r="9"/><path d="M9 20c-1-2-1-5 0-6"/>',
    star: '<path d="M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.4l6-.8z"/>',
    check: '<path d="M5 13l4 4L19 7"/>',
    pencil: '<path d="M4 20h4L20 8l-4-4L4 16z"/><path d="M14 6l4 4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 1 1 11 3.5a7 7 0 0 0 9 11z"/>',
    download: '<path d="M12 4v12"/><path d="M7 12l5 5 5-5"/><path d="M5 20h14"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.5-5.8"/><path d="M20 4v5h-5"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.5"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
    lightbulb: '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.8V18h7v-4.2A6 6 0 0 0 12 3z"/>'
  };

  const icon = (name, cls) =>
    `<svg class="icon ${cls || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.star}</svg>`;

  /* ------------------------- 模板 ------------------------- */
  const templates = {
    infoRow: (it, path) => it.hrefKey
      ? `<div class="info-row" data-hide-if-empty="${it.hrefKey}">
           <dt data-key="${path}.label"></dt>
           <dd><a data-key-href="${it.hrefKey}" data-href-prefix="${it.prefix || ""}" href="#"><em data-key="${path}.value"></em></a></dd>
         </div>`
      : `<div class="info-row" data-hide-if-empty="${path}.value">
           <dt data-key="${path}.label"></dt>
           <dd data-key="${path}.value"></dd>
         </div>`,

    highlight: (it, path) => `
      <div class="card stat-card">
        <div class="stat-num" data-key="${path}.num"></div>
        <div class="stat-label" data-key="${path}.label"></div>
        <div class="stat-desc" data-key="${path}.desc"></div>
      </div>`,

    education: (it, path) => `
      <div class="card edu-card">
        <div class="edu-head">
          <div>
            <h3 data-key="${path}.school"></h3>
            <p class="muted" data-key="${path}.major"></p>
          </div>
          <span class="tag" data-key="${path}.degree"></span>
        </div>
        <div class="edu-meta">
          <span>${icon("calendar")}<em data-key="${path}.period"></em></span>
          <span class="tag tag-accent" data-key="${path}.status"></span>
        </div>
        <ul class="dot-list" data-list="${path}.detail" data-item="chipList"></ul>
      </div>`,

    skillGroup: (group, path) => `
      <div class="card skill-group">
        <h3 class="group-title" data-key="${path}.title"></h3>
        <div class="skill-list">
          ${(group.skills || []).map((s, j) => `
            <div class="skill">
              <div class="skill-top">
                <span data-key="${path}.skills.${j}.name"></span>
                <b data-key="${path}.skills.${j}.level" data-format="percent"></b>
              </div>
              <div class="skill-bar"><i style="width:${Number(s.level) || 0}%" data-bar="${path}.skills.${j}.level"></i></div>
            </div>`).join("")}
        </div>
      </div>`,

    chip: (it, path) => `<span class="tag" data-key="${path}"></span>`,

    chipList: (it, path) => `<li data-key="${path}"></li>`,

    timeline: (it, path) => `
      <div class="tl-item">
        <span class="tl-dot"></span>
        <span class="tl-date" data-key="${path}.date"></span>
        <div class="tl-body">
          <h4 data-key="${path}.title"></h4>
          <p class="muted" data-key="${path}.desc"></p>
        </div>
      </div>`,

    award: (it, path) => `
      <div class="card award-card">
        ${icon("award")}
        <div>
          <h4 data-key="${path}.title"></h4>
          <p class="muted"><em data-key="${path}.issuer"></em> · <em data-key="${path}.date"></em></p>
        </div>
      </div>`,

    feature: (it, path) => `
      <div class="card feature-card">
        <span class="feature-icon">${icon(it.icon)}</span>
        <h4 data-key="${path}.title"></h4>
        <p class="muted" data-key="${path}.desc"></p>
      </div>`,

    milestone: (it, path) => `
      <div class="tl-item">
        <span class="tl-dot"></span>
        <span class="tl-date" data-key="${path}.date"></span>
        <div class="tl-body">
          <h4 data-key="${path}.title"></h4>
          <p class="muted" data-key="${path}.desc"></p>
        </div>
      </div>`,

    qa: (it, path) => `
      <div class="card qa-card">
        <h4 class="qa-q">${icon("message")}<span data-key="${path}.q"></span></h4>
        <p class="qa-a" data-key="${path}.a"></p>
      </div>`,

    secondaryUrl: (it, path) => `
      <div class="url-bar secondary">
        <span class="ub-label" data-key="${path}.name"></span>
        <code data-key="${path}.url"></code>
        <a class="btn btn-light btn-sm" data-key-href="${path}.url" href="#" target="_blank" rel="noopener">打开 ↗</a>
      </div>
      <p class="ub-desc" data-key="${path}.desc"></p>`,

    link: (it, path) => `
      <a class="card link-card ${it.primary ? "primary" : ""}" data-key-href="${path}.url" href="#" target="_blank" rel="noopener">
        <div class="link-text">
          <h4 data-key="${path}.title"></h4>
          <p class="muted" data-key="${path}.desc"></p>
        </div>
        ${icon("external-link")}
      </a>`,

    project: (it, path) => `
      <a class="card project-card" data-key-href="${path}.url" href="#" target="_blank" rel="noopener">
        <h4 data-key="${path}.name"></h4>
        <p class="muted" data-key="${path}.desc"></p>
        <span class="project-link">查看详情 ${icon("arrow-right")}</span>
      </a>`
  };

  /* ------------------------- 渲染核心 ------------------------- */
  function bindAll(root) {
    root = root || document;

    // 文本
    root.querySelectorAll("[data-key]").forEach((el) => {
      if (el.hasAttribute("data-key-href") || el.hasAttribute("data-key-src")) return;
      const path = el.getAttribute("data-key");
      let val = get(path);
      if (val === undefined || val === null) val = "";
      if (Array.isArray(val)) {
        el.innerHTML = val.map((v) => `<p>${esc(v)}</p>`).join("");
      } else if (el.hasAttribute("data-format") && el.getAttribute("data-format") === "percent") {
        el.textContent = `${val}%`;
      } else {
        el.textContent = val;
      }
      if (el.hasAttribute("data-hide-empty") && (!val || (Array.isArray(val) && !val.length))) {
        el.classList.add("is-empty");
      }
    });

    // 链接
    root.querySelectorAll("[data-key-href]").forEach((el) => {
      const url = get(el.getAttribute("data-key-href")) || "";
      const prefix = el.getAttribute("data-href-prefix") || "";
      el.setAttribute("href", url ? prefix + url : "#");
      if (!url) el.classList.add("is-empty");
    });

    // 某字段为空时，整块内容隐藏
    root.querySelectorAll("[data-hide-if-empty]").forEach((el) => {
      const val = get(el.getAttribute("data-hide-if-empty"));
      if (!val) el.classList.add("is-empty");
    });

    // 图片
    root.querySelectorAll("[data-key-src]").forEach((el) => {
      const src = get(el.getAttribute("data-key-src")) || "";
      if (src) el.setAttribute("src", src);
      else el.classList.add("is-empty");
    });

    // 头像占位
    root.querySelectorAll("[data-avatar]").forEach((el) => {
      const src = get("profile.avatar") || "";
      if (src) {
        el.innerHTML = `<img src="${esc(src)}" alt="${esc(get("profile.name"))}">`;
      } else {
        el.innerHTML = `<span>${esc(get("profile.initials") || "我")}</span>`;
      }
    });
  }

  function renderLists() {
    document.querySelectorAll("[data-list]").forEach((box) => {
      const path = box.getAttribute("data-list");
      const tplName = box.getAttribute("data-item");
      const items = get(path) || [];
      const tpl = templates[tplName];
      if (!tpl) return;
      const limit = parseInt(box.getAttribute("data-limit"), 10);
      const shown = limit > 0 ? items.slice(0, limit) : items;
      box.innerHTML = shown.map((it, i) => tpl(it, `${path}.${i}`)).join("");
      if (box.hasAttribute("data-hide-empty") && !items.length) box.classList.add("is-empty");
    });
  }

  /* ------------------------- 主题 / 导航 ------------------------- */
  function initTheme() {
    const saved = localStorage.getItem("site-theme");
    const theme = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    const btn = document.getElementById("themeToggle");
    if (btn) btn.innerHTML = icon(theme === "dark" ? "sun" : "moon");
    document.querySelectorAll("#themeToggle").forEach((b) =>
      b.addEventListener("click", () => {
        const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("site-theme", next);
        b.innerHTML = icon(next === "dark" ? "sun" : "moon");
      })
    );
  }

  function initNav() {
    const btn = document.getElementById("navToggle");
    const menu = document.getElementById("navMenu");
    if (btn && menu) {
      btn.addEventListener("click", () => {
        menu.classList.toggle("open");
        btn.classList.toggle("active");
      });
      menu.addEventListener("click", (e) => {
        if (e.target.closest("a")) menu.classList.remove("open");
      });
    }
    const page = document.body.getAttribute("data-page");
    document.querySelectorAll("#navMenu a[data-nav]").forEach((a) => {
      if (a.getAttribute("data-nav") === page) a.classList.add("active");
    });
  }

  /* ------------------------- 网站实时预览 ------------------------- */
  function initPreview() {
    const frame = document.getElementById("siteFrame");
    const box = document.getElementById("previewBox");
    if (!frame || !box) return;
    const site = get("myWebsite") || {};
    if (!site.showPreview || !site.url) {
      box.classList.add("is-empty");
      return;
    }
    frame.setAttribute("src", site.url);
    let loaded = false;
    frame.addEventListener("load", () => {
      loaded = true;
      box.classList.add("loaded");
    });
    setTimeout(() => {
      if (!loaded) box.classList.add("blocked");
    }, 6000);
  }

  /* ------------------------- 滚动出现动画 ------------------------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ------------------------- 编辑模式 ------------------------- */
  const STORE_KEY = "site-content-overrides";

  function loadOverrides() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return;
      const map = JSON.parse(raw);
      Object.keys(map).forEach((p) => set(p, map[p]));
    } catch (e) {
      /* 忽略异常 */
    }
  }

  function markEditable() {
    document.querySelectorAll("[data-key]").forEach((el) => {
      if (el.hasAttribute("data-key-href") || el.hasAttribute("data-key-src") || el.hasAttribute("data-format")) return;
      const val = get(el.getAttribute("data-key"));
      if (typeof val === "string") el.setAttribute("contenteditable", "true");
    });
  }

  function createEditorBar() {
    const bar = document.createElement("div");
    bar.className = "editor-bar";
    bar.innerHTML = `
      <span class="editor-tip">${icon("pencil")} 编辑模式：直接点击文字修改，失焦自动保存</span>
      <div class="editor-actions">
        <button type="button" data-act="export">${icon("download")} 导出修改</button>
        <button type="button" data-act="reset">${icon("refresh")} 恢复默认</button>
        <button type="button" data-act="exit">退出编辑</button>
      </div>`;
    document.body.appendChild(bar);

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const act = btn.getAttribute("data-act");
      if (act === "export") exportOverrides();
      if (act === "reset") {
        if (confirm("确定清除所有本地修改，恢复 content.js 的原始内容？")) {
          localStorage.removeItem(STORE_KEY);
          location.reload();
        }
      }
      if (act === "exit") {
        localStorage.removeItem("site-editing");
        location.reload();
      }
    });
  }

  function exportOverrides() {
    const raw = localStorage.getItem(STORE_KEY) || "{}";
    const blob = new Blob([raw], { type: "application/json;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "content-overrides.json";
    a.click();
    URL.revokeObjectURL(a.href);
    alert("已导出 content-overrides.json。\n把里面的字段按同样路径改写到 content.js 中，即可永久保存。");
  }

  function initEditing() {
    const editable = localStorage.getItem("site-editing") === "1";
    if (!editable) return;
    document.body.classList.add("editing");
    markEditable();
    createEditorBar();

    document.addEventListener(
      "blur",
      (e) => {
        const el = e.target.closest && e.target.closest('[contenteditable="true"][data-key]');
        if (!el) return;
        const path = el.getAttribute("data-key");
        const val = get(path);
        const text = (el.innerText || "").trim();
        const next = Array.isArray(val) ? text.split(/\n+/).filter(Boolean) : text;
        if (JSON.stringify(next) === JSON.stringify(val)) return;
        set(path, next);
        const map = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
        map[path] = next;
        localStorage.setItem(STORE_KEY, JSON.stringify(map));
        if (!Array.isArray(next)) el.classList.add("saved-flash"), setTimeout(() => el.classList.remove("saved-flash"), 700);
      },
      true
    );
  }

  function initEditToggle() {
    const btn = document.getElementById("editToggle");
    if (!btn) return;
    if (localStorage.getItem("site-editing") === "1") btn.classList.add("on");
    btn.addEventListener("click", () => {
      const on = localStorage.getItem("site-editing") === "1";
      if (on) {
        localStorage.removeItem("site-editing");
        location.reload();
      } else {
        localStorage.setItem("site-editing", "1");
        location.reload();
      }
    });
  }

  /* ------------------------- 启动 ------------------------- */
  function boot() {
    if (!window.SITE) {
      console.error("未找到 content.js 或 SITE 数据对象");
      return;
    }
    loadOverrides();
    renderLists();
    bindAll();
    document.querySelectorAll("[data-bar]").forEach((bar) => {
      bar.style.width = `${Number(get(bar.getAttribute("data-bar"))) || 0}%`;
    });
    initPreview();
    initNav();
    initTheme();
    initEditToggle();
    initEditing();
    initReveal();
    document.title = `${get("profile.name")} · ${get("profile.title")}`;
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
