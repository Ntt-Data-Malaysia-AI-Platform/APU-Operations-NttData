import { icon, PERSONA_ICONS } from "./icons.js";
import { escapeHtml as e } from "./markdown.js";

const PILLARS = [
  { icon: "doc", title: "Grounded in approved documents", text: "Every answer comes from APU's own policies, with sources you can open." },
  { icon: "lock", title: "Role-based access", text: "Each agent reads only the documents and systems its department allows." },
  { icon: "gemini", title: "Gemini on Google Cloud", text: "Built for Gemini on Vertex AI, running in APU's own cloud project." },
  { icon: "users", title: "Hands off to people", text: "Agents log tickets and cases, and escalate sensitive matters to staff." },
];

export function renderLanding(root, cfg, { lastPersona }) {
  const last = cfg.personas.find((p) => p.id === lastPersona);

  root.innerHTML = `
    <section class="hero">
      <div class="hero-copy">
        <span class="kicker">${icon("gemini", "spark-icon")} NTT DATA × APU · Powered by Gemini</span>
        <h1>Gemini agents for <span class="grad-text rainbow">every APU department</span></h1>
        <p class="lead">Five AI agents for IT, HR, admissions, finance and administration. Each has a live dashboard, one-click tools, and answers grounded in APU's approved documents.</p>
        <div class="hero-cta">
          <a class="btn btn-primary" href="#personas">Choose an agent ${icon("arrow")}</a>
          ${last ? `<a class="btn btn-ghost" href="#/${e(last.id)}" data-persona="${e(last.id)}"><span class="dot"></span>Back to ${e(last.label)}</a>` : ""}
        </div>
        <dl class="hero-stats">
          <div><dt>${cfg.personas.length}</dt><dd>department agents</dd></div>
          <div><dt>${cfg.knowledge.documents}</dt><dd>approved documents</dd></div>
          <div><dt>24/7</dt><dd>always on</dd></div>
        </dl>
      </div>

      <div class="hero-visual" aria-hidden="true">
        <div class="float-card fc-1" data-persona="it">
          <span class="fc-icon">${icon("lock")}</span>
          <div><small>IT Helpdesk</small><strong>Password reset</strong><em>solved in 2 minutes</em></div>
        </div>
        <div class="float-card fc-2" data-persona="hr">
          <span class="fc-icon">${icon("sun")}</span>
          <div><small>HR Support</small><strong>11 days of leave left</strong><em>carry forward until 31 March</em></div>
        </div>
        <div class="float-card fc-3" data-persona="admissions">
          <span class="fc-icon">${icon("megaphone")}</span>
          <div><small>Student Recruitment</small><strong>38 new enquiries</strong><em>92% replied within SLA</em></div>
        </div>
        <div class="float-card fc-4" data-persona="finance">
          <span class="fc-icon">${icon("doc")}</span>
          <div><small>Finance</small><strong>INV-2291 approved</strong><em>paid within 30 days</em></div>
        </div>
        <div class="orb"></div>
      </div>
    </section>

    <section class="personas-section" id="personas">
      <div class="section-head">
        <h2>Which agent do you need?</h2>
        <p>Pick a department agent to open its workspace. You can switch any time from the top-right menu.</p>
      </div>
      <div class="persona-grid">
        ${cfg.personas
          .map(
            (p) => `
          <a class="persona-card" href="#/${e(p.id)}" data-persona="${e(p.id)}">
            <span class="pc-glow"></span>
            <span class="pc-icon">${icon(PERSONA_ICONS[p.id])}</span>
            <span class="pc-dept">${e(p.department)}</span>
            <h3>${e(p.assistantName)}</h3>
            <p>${e(p.description)}</p>
            <ul>${p.highlights.map((h) => `<li>${icon("check")}${e(h)}</li>`).join("")}</ul>
            <span class="pc-cta">Open agent ${icon("arrow")}</span>
          </a>`,
          )
          .join("")}
      </div>
    </section>

    <section class="pillars">
      ${PILLARS.map(
        (p) => `
        <div class="pillar">
          <span class="pillar-icon">${icon(p.icon)}</span>
          <h3>${p.title}</h3>
          <p>${p.text}</p>
        </div>`,
      ).join("")}
    </section>

    <footer class="site-footer">
      <span>Delivered by</span>
      <img src="brand/ntt-data-logo.png" alt="NTT DATA" />
      <span class="sep">·</span>
      <span>Demonstration build with sample data. Not official APU information.</span>
    </footer>`;

  // Smooth-scroll the in-page link without changing the route.
  root.querySelector('a[href="#personas"]').addEventListener("click", (ev) => {
    ev.preventDefault();
    root.querySelector("#personas").scrollIntoView({ behavior: "smooth" });
  });
}
