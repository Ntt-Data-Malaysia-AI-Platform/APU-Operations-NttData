# APU Operations AI

Gemini agents for every APU department, delivered by NTT DATA. This is a companion to the [APU GenAI Platform](https://github.com/Ntt-Data-Malaysia-AI-Platform/APU-NTTDATA), in the same style.

**Live demo:** https://ntt-data-malaysia-ai-platform.github.io/APU-Operations-NttData/

| # | Function | Agent | What it does | One-click tools |
|---|---|---|---|---|
| 1 | IT Operations | IT Helpdesk Agent | Troubleshoots common IT issues, answers technical queries, guides password resets and software access | Troubleshooter, Password and MFA reset, Request software access (logs a ticket), Wi-Fi and VPN setup |
| 2 | HR | HR Policy & Employee Support Agent | Answers leave, payroll, benefits, onboarding and HR policy questions from approved documents | Leave checker, Payslip explainer, Onboarding plan, Raise an HR case |
| 3 | Sales & Admissions | Student Recruitment Agent | Answers prospective students, recommends courses, checks eligibility, supports follow-ups | Course recommender, Eligibility checker, Enquiry reply drafter, Follow-up planner |
| 4 | Finance | Finance & Procurement Agent | Answers budget, invoice, expense, procurement and payment policy queries; helps with reporting | Procurement route finder, Expense claim checker, Invoice status, Budget report summary |
| 5 | Administration | Institutional Knowledge Agent | Searches internal documents, summarises policies, finds information across departments | Find a document, Policy summariser, Compare policies, Memo from policy |

Each agent has its own workspace: a live dashboard (service status, leave, recruitment funnel, budget, document library and more), four one-click tools, and a chat panel whose answers cite APU documents.

## What runs where

This build is a **static demo for GitHub Pages**: everything runs in the browser in demo mode.

- Agents search a sample knowledge base (`knowledge/*.md`) and read sample records (`server/demo-data.ts`). No model is called; the chat shows what the agent retrieved.
- **Role-based access:** each agent reads only its department's documents (for example, the IT agent can't read HR's leave policy). The Institutional Knowledge Agent reads everything.
- **Sign-in** is a front-end gate only (the code is public), using the same demo login as the APU GenAI Platform. Don't put confidential content behind it.

To make it production-ready, connect **Gemini on Vertex AI** through a small backend (for example, Cloud Run). The tool names in `server/tools.ts` map directly to Gemini function declarations. Then swap the sample records for the real service desk, HR, CRM, finance and document systems, and replace the sign-in with APU single sign-on.

## Run locally

```bash
npm install
```

```bash
npm run build
```

```bash
npm run preview
```

Then open http://localhost:4180.

## Deploy

Every push to `main` builds the site and publishes it via [.github/workflows/pages.yml](.github/workflows/pages.yml). One-time setup: in the repository, go to **Settings → Pages** and set **Source** to **GitHub Actions**. To change the demo login, add `APP_USERNAME` and `APP_PASSWORD` repository secrets.

All content is sample data for demonstration, not official APU information.
