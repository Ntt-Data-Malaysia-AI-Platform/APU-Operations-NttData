import {
  admissionsData,
  daysFromNow,
  financeData,
  hrData,
  itData,
  knowledgeData,
  listTickets,
} from "./demo-data.js";
import { listDocuments } from "./knowledge.js";
import { PERSONAS, type PersonaId } from "./personas.js";

/**
 * Dashboards are described as generic widgets so the browser renders every
 * persona with the same components.
 */
type Tone = "good" | "warn" | "bad" | "info";

interface Kpi {
  label: string;
  value: string;
  detail?: string;
  tone?: Tone;
  icon: string;
}

interface Item {
  title: string;
  meta?: string;
  date?: string;
  badge?: string;
  tone?: Tone;
  /** Prompt sent to the assistant when the item is clicked. */
  ask?: string;
}

/** Every widget can carry a header-level "Ask AI" prompt. */
interface WidgetBase {
  title: string;
  icon: string;
  ask?: string;
}

type Widget = WidgetBase &
  (
    | { type: "timeline"; items: Item[] }
    | { type: "list"; items: Item[] }
    | { type: "bars"; threshold?: number; items: { label: string; value: number; tone?: Tone }[] }
    | { type: "cards"; items: { title: string; subtitle?: string; tag?: string; lines: string[]; progress?: number; ask?: string }[] }
    | { type: "checklist"; items: { text: string; done: boolean }[] }
    // Mockup widgets
    | { type: "donut"; centerValue: string; centerLabel: string; segments: { label: string; value: number; display: string }[]; note?: string }
    | { type: "columns"; unit?: string; max?: number; items: { label: string; value: number; display?: string; highlight?: boolean }[]; note?: string }
    | { type: "stepper"; subtitle?: string; steps: { label: string; meta?: string; status: "done" | "current" | "todo" }[] }
    | { type: "kanban"; columns: { title: string; tone: Tone; cards: { title: string; meta?: string }[] }[] }
    | { type: "week"; events: { day: number; start: number; end: number; title: string; meta: string; tone?: Tone }[] }
  );

export interface Dashboard {
  greeting: string;
  subtitle: string;
  kpis: Kpi[];
  widgets: Widget[];
}

const rm = (n: number) => `RM ${n.toLocaleString("en-MY")}`;

function daysUntil(iso: string): number {
  const today = new Date(new Date().toISOString().slice(0, 10)).getTime();
  return Math.round((new Date(iso).getTime() - today) / 864e5);
}

function inDays(iso: string): string {
  const n = daysUntil(iso);
  if (n <= 0) return "today";
  if (n === 1) return "tomorrow";
  return `in ${n} days`;
}

function urgency(iso: string): Tone {
  const n = daysUntil(iso);
  return n <= 7 ? "bad" : n <= 21 ? "warn" : "info";
}


const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });


const statusTone = (s: string): Tone => (s === "Operational" ? "good" : s === "Degraded" ? "bad" : "warn");

export function dashboardFor(id: PersonaId): Dashboard {
  switch (id) {
    case "it": {
      const d = itData();
      const tickets = listTickets().filter((t) => t.category === "IT");
      const card = (t: (typeof tickets)[number]) => ({ title: t.title, meta: `${t.ticketId}${t.priority === "high" ? " · high priority" : ""}` });
      const issues = d.services.filter((s) => s.status !== "Operational");
      return {
        greeting: "IT Helpdesk Agent",
        subtitle: "Troubleshooting, passwords, software access and live service status for staff and students.",
        kpis: [
          { label: "Open incidents", value: String(d.stats.openIncidents), detail: `${d.stats.resolvedToday} resolved today`, icon: "ticket", tone: "warn" },
          { label: "Avg. resolution", value: `${d.stats.avgResolutionHours} h`, detail: "last 7 days", icon: "clock", tone: "info" },
          { label: "Solved by the agent", value: `${d.stats.selfServiceRate}%`, detail: "no technician needed", icon: "sparkle", tone: "good" },
          { label: "Service status", value: issues.length ? `${issues.length} alerts` : "All good", detail: issues.map((s) => s.name).join(", ") || "all systems operational", icon: "alert", tone: issues.length ? "bad" : "good" },
        ],
        widgets: [
          {
            type: "list",
            title: "Live service status",
            icon: "chart",
            ask: "Is anything down right now, and what should staff do while Moodle is degraded?",
            items: d.services.map((s) => ({ title: s.name, meta: s.note ?? "No known issues", badge: s.status, tone: statusTone(s.status) })),
          },
          {
            type: "donut",
            title: "How issues get resolved",
            icon: "pie",
            centerValue: `${d.stats.selfServiceRate}%`,
            centerLabel: "self-service",
            note: "Share of this month's IT requests by channel",
            segments: d.channels.map((c) => ({ label: c.label, value: c.value, display: `${c.value}%` })),
          },
          {
            type: "kanban",
            title: "Service desk queue",
            icon: "kanban",
            ask: "Summarise the open service desk tickets and suggest which to prioritise.",
            columns: [
              { title: "Open", tone: "warn", cards: tickets.filter((t) => t.status === "Open").map(card) },
              { title: "In progress", tone: "info", cards: tickets.filter((t) => t.status === "In progress").map(card) },
              { title: "Awaiting approval", tone: "good", cards: tickets.filter((t) => t.status === "Awaiting approval").map(card) },
            ],
          },
          {
            type: "columns",
            title: "Tickets by category this week",
            icon: "chart",
            note: "Passwords remain the top driver: a good target for self-service.",
            ask: "Passwords are our top ticket category. Suggest three ways to cut password tickets.",
            items: d.ticketsByCategory.map((c, i) => ({ ...c, highlight: i === 0 })),
          },
          {
            type: "stepper",
            title: "Software request REQ-11873",
            icon: "flag",
            subtitle: "Adobe Creative Cloud · design lab",
            ask: "What happens after a software request is approved, and how long until it's installed?",
            steps: [
              { label: "Request raised", meta: shortDate(daysFromNow(-2)), status: "done" },
              { label: "Head of department approval", meta: "Waiting", status: "current" },
              { label: "Licence assigned", status: "todo" },
              { label: "Installed and confirmed", meta: "~2 working days after approval", status: "todo" },
            ],
          },
          {
            type: "list",
            title: "Top issues the agent solved this week",
            icon: "sparkle",
            items: d.topIssues.map((t) => ({ title: t.title, meta: `${t.count} conversations`, badge: "Self-service", tone: "good" as Tone, ask: `Walk me through fixing: ${t.title.toLowerCase()}.` })),
          },
        ],
      };
    }

    case "hr": {
      const d = hrData();
      const left = d.leave.entitled - d.leave.taken;
      const available = left - d.leave.pending;
      return {
        greeting: `Hello, ${d.employee.name}`,
        subtitle: `${d.employee.role} · ${d.employee.department} · ${d.employee.serviceYears} years of service`,
        kpis: [
          { label: "Annual leave left", value: `${left} days`, detail: `${d.leave.pending} pending · ${d.leave.carryForward} carried forward`, icon: "sun", tone: "good" },
          { label: "Next payday", value: inDays(d.payroll.nextPayday), detail: shortDate(d.payroll.nextPayday), icon: "wallet", tone: "info" },
          { label: "Last net pay", value: rm(d.payroll.lastNetPay), detail: `RM ${(d.payroll.previousNetPay - d.payroll.lastNetPay).toLocaleString("en-MY")} lower than last month`, icon: "chart", tone: "warn" },
          { label: "Medical leave used", value: `${d.leave.medicalTaken} of ${d.leave.medicalEntitled}`, detail: "days this year", icon: "shield", tone: "good" },
        ],
        widgets: [
          {
            type: "donut",
            title: "Annual leave",
            icon: "sun",
            centerValue: String(left),
            centerLabel: "days left",
            note: "Up to 5 unused days carry forward to 31 March.",
            ask: "How many leave days can I carry forward, and when must I use them?",
            segments: [
              { label: "Taken", value: d.leave.taken, display: `${d.leave.taken} days` },
              { label: "Pending approval", value: d.leave.pending, display: `${d.leave.pending} days` },
              { label: "Available", value: available, display: `${available} days` },
            ],
          },
          {
            type: "list",
            title: "Why my pay changed",
            icon: "wallet",
            ask: "Explain why my net pay dropped by RM 370 this month.",
            items: [
              { title: `Net pay ${rm(d.payroll.lastNetPay)}`, meta: d.payroll.change, badge: "Explained", tone: "warn" },
              { title: `Next payslip on the HR portal`, meta: `2 days before payday (${shortDate(d.payroll.nextPayday)})`, tone: "info" },
            ],
          },
          {
            type: "stepper",
            title: "Onboarding: new lecturer",
            icon: "flag",
            subtitle: `Starts ${shortDate(d.newHire.start)} · ${inDays(d.newHire.start)}`,
            ask: "Create a first-week onboarding plan for a new lecturer joining the School of Computing.",
            steps: [
              { label: "Offer accepted", status: "done" },
              { label: "IT accounts and laptop", meta: "Requested from IT", status: "current" },
              { label: "Buddy assigned", status: "todo" },
              { label: "Induction and PDPA training", meta: "Week one", status: "todo" },
              { label: "Probation objectives", meta: "Within the first month", status: "todo" },
            ],
          },
          {
            type: "columns",
            title: "What staff ask HR about",
            icon: "chart",
            note: "Questions answered by the agent this month",
            items: d.queriesByTopic.map((q, i) => ({ ...q, highlight: i === 0 })),
          },
          {
            type: "cards",
            title: "My benefits",
            icon: "award",
            items: d.benefits.map((b) => ({
              title: b.benefit,
              subtitle: `Limit: ${b.limit}`,
              tag: b.used === "–" ? "Available" : `Used ${b.used}`,
              lines: [],
              ask: `Explain my ${b.benefit.toLowerCase()} benefit and how to claim it.`,
            })),
          },
          {
            type: "timeline",
            title: "HR dates",
            icon: "calendar",
            items: [
              { title: "Payday", date: d.payroll.nextPayday, meta: inDays(d.payroll.nextPayday), tone: "good" as Tone },
              { title: "Leave applications for December holidays close", date: daysFromNow(10), meta: inDays(daysFromNow(10)), tone: urgency(daysFromNow(10)) },
              { title: "Annual performance review window opens", date: daysFromNow(24), meta: inDays(daysFromNow(24)), tone: urgency(daysFromNow(24)) },
            ],
          },
        ],
      };
    }

    case "admissions": {
      const d = admissionsData();
      const conv = Math.round((d.funnel[4].value / d.funnel[0].value) * 1000) / 10;
      const stageCards = (stage: string) => d.leads.filter((l) => l.stage === stage).map((l) => ({ title: `${l.name} · ${l.interest}`, meta: `${l.results} · ${l.source}` }));
      return {
        greeting: "Student Recruitment Agent",
        subtitle: "Enquiries, course recommendations, eligibility checks and admissions follow-ups.",
        kpis: [
          { label: "New enquiries today", value: String(d.today.newEnquiries), detail: "all channels", icon: "chat", tone: "info" },
          { label: "Replied within SLA", value: `${d.today.repliedWithinSla}%`, detail: "target: 1 working day", icon: "clock", tone: "good" },
          { label: "Avg. first reply", value: `${d.today.avgFirstReplyMinutes} min`, detail: "with the agent drafting", icon: "sparkle", tone: "good" },
          { label: "Enquiry to enrolment", value: `${conv}%`, detail: "this intake", icon: "trend", tone: "info" },
        ],
        widgets: [
          {
            type: "columns",
            title: "Recruitment funnel: this intake",
            icon: "chart",
            note: `${d.funnel[0].value.toLocaleString("en-MY")} enquiries → ${d.funnel[4].value} enrolled`,
            ask: "Where is the biggest drop in our recruitment funnel, and what could improve it?",
            items: d.funnel.map((f, i) => ({ label: f.label, value: f.value, display: f.value.toLocaleString("en-MY"), highlight: i === 1 })),
          },
          {
            type: "donut",
            title: "Where enquiries come from",
            icon: "pie",
            centerValue: String(d.today.newEnquiries),
            centerLabel: "today",
            segments: d.channels.map((c) => ({ label: c.label, value: c.value, display: `${c.value}%` })),
          },
          {
            type: "kanban",
            title: "Lead pipeline",
            icon: "kanban",
            ask: "Which leads should I follow up today, and what should I say to each?",
            columns: [
              { title: "New", tone: "warn", cards: stageCards("New") },
              { title: "Contacted", tone: "info", cards: stageCards("Contacted") },
              { title: "Applied or offered", tone: "good", cards: [...stageCards("Applied"), ...stageCards("Offer")] },
            ],
          },
          {
            type: "list",
            title: "Follow up today",
            icon: "bell",
            items: d.leads
              .filter((l) => daysUntil(l.lastContact) <= -3)
              .map((l) => ({
                title: `${l.name}: ${l.interest}`,
                meta: `${l.results} · last contact ${Math.abs(daysUntil(l.lastContact))} days ago`,
                badge: daysUntil(l.lastContact) <= -7 ? "Final follow-up" : "Follow up",
                tone: (daysUntil(l.lastContact) <= -7 ? "bad" : "warn") as Tone,
                ask: `Draft a friendly follow-up message for a prospective student interested in ${l.interest} with ${l.results}.`,
              })),
          },
          {
            type: "timeline",
            title: "Recruitment events",
            icon: "calendar",
            items: d.events.map((e) => ({ title: e.title, date: e.date, meta: inDays(e.date), tone: "info" as Tone, ask: `Draft an invitation message for the ${e.title.toLowerCase()} on ${e.date}.` })),
          },
        ],
      };
    }

    case "finance": {
      const d = financeData();
      const { annual, spent, committed } = d.budget;
      const remaining = annual - spent - committed;
      const usedPct = Math.round(((spent + committed) / annual) * 100);
      const inv = (status: string) => d.invoices.filter((i) => i.status === status).map((i) => ({ title: `${i.id} · ${rm(i.amount)}`, meta: `${i.supplier} · due ${i.due}` }));
      return {
        greeting: "Finance & Procurement Agent",
        subtitle: `${d.department} · budgets, invoices, expenses, procurement and payment policy`,
        kpis: [
          { label: "Budget used", value: `${usedPct}%`, detail: `spent + committed of ${rm(annual)}`, icon: "wallet", tone: usedPct >= 90 ? "bad" : usedPct >= 75 ? "warn" : "good" },
          { label: "Invoices to pay", value: String(d.invoices.filter((i) => i.status !== "Paid").length), detail: "within 30-day terms", icon: "doc", tone: "info" },
          { label: "Claims awaiting approval", value: String(d.claims.awaiting), detail: `${rm(d.claims.value)} in total`, icon: "check", tone: "warn" },
          { label: "October spend", value: "RM 117k", detail: "highest this half-year", icon: "trend", tone: "warn" },
        ],
        widgets: [
          {
            type: "donut",
            title: "Annual budget",
            icon: "pie",
            centerValue: `${usedPct}%`,
            centerLabel: "used",
            note: "Spending above 90% of budget needs Finance approval.",
            ask: "Summarise our budget position and flag risks for the rest of the year.",
            segments: [
              { label: "Spent", value: spent, display: rm(spent) },
              { label: "Committed (POs)", value: committed, display: rm(committed) },
              { label: "Remaining", value: remaining, display: rm(remaining) },
            ],
          },
          {
            type: "columns",
            title: "Monthly spend (RM thousand)",
            icon: "trend",
            note: "October is up 27% on September.",
            ask: "October spend is up 27% on September. Draft a short note explaining the variance for the budget report.",
            items: d.monthlySpend.map((m, i, a) => ({ label: m.label, value: m.value, display: `${m.value}k`, highlight: i === a.length - 1 })),
          },
          {
            type: "kanban",
            title: "Supplier invoices",
            icon: "kanban",
            ask: "What's the status of invoice INV-2291, and when will the supplier be paid?",
            columns: [
              { title: "Received", tone: "warn", cards: inv("Received") },
              { title: "Approved for payment", tone: "info", cards: inv("Approved") },
              { title: "Paid", tone: "good", cards: inv("Paid") },
            ],
          },
          {
            type: "stepper",
            title: `Purchase requisition ${d.requisition.id}`,
            icon: "flag",
            subtitle: `${d.requisition.item} · ${rm(d.requisition.amount)}`,
            ask: `How many quotations does a ${rm(d.requisition.amount)} purchase need, and who approves it?`,
            steps: [
              { label: "Raised", meta: shortDate(daysFromNow(-6)), status: "done" },
              { label: "Head of department", meta: "Approved", status: "done" },
              { label: "Finance check", meta: "3 quotations attached", status: "current" },
              { label: "Purchase order issued", status: "todo" },
              { label: "Goods received", status: "todo" },
            ],
          },
          {
            type: "list",
            title: "Procurement quick guide",
            icon: "scale",
            items: [
              { title: "Up to RM 2,000", meta: "1 quotation · head of department", badge: "Simple", tone: "good", ask: "What do I need for a purchase under RM 2,000?" },
              { title: "RM 2,001 – RM 10,000", meta: "3 written quotations · HoD and Finance", badge: "Standard", tone: "info", ask: "Walk me through buying something for RM 8,500." },
              { title: "Above RM 10,000", meta: "Tender or 3 quotations + comparison · Procurement Committee", badge: "Committee", tone: "warn", ask: "What's the process for a purchase above RM 10,000?" },
            ],
          },
        ],
      };
    }

    case "knowledge": {
      const d = knowledgeData();
      const docs = listDocuments(PERSONAS.knowledge.audiences);
      return {
        greeting: "Institutional Knowledge Agent",
        subtitle: "Search, summarise and connect policies across every department, with sources.",
        kpis: [
          { label: "Documents indexed", value: String(docs.length), detail: `${new Set(docs.map((x) => x.owner)).size} owner offices`, icon: "book", tone: "info" },
          { label: "Searches this week", value: d.searchesThisWeek.toLocaleString("en-MY"), detail: "across all departments", icon: "search", tone: "info" },
          { label: "Answers with sources", value: `${d.citedAnswers}%`, detail: "every answer cites its document", icon: "check", tone: "good" },
          { label: "Policy reviews due", value: String(d.reviewsDue.length), detail: `next ${inDays(d.reviewsDue[0].due)}`, icon: "flag", tone: "warn" },
        ],
        widgets: [
          {
            type: "columns",
            title: "Searches by department",
            icon: "chart",
            note: "This week",
            items: d.searchesByDepartment.map((s, i) => ({ ...s, highlight: i === 0 })),
          },
          {
            type: "list",
            title: "Recently updated",
            icon: "bell",
            items: d.recentlyUpdated.map((u) => ({
              title: u.title,
              meta: `${u.owner} · updated ${shortDate(u.updated)}`,
              badge: "Updated",
              tone: "good" as Tone,
              ask: `What changed in the "${u.title}" document? Summarise the key rules in 5 bullet points.`,
            })),
          },
          {
            type: "cards",
            title: "Document library",
            icon: "book",
            items: docs.map((doc) => ({
              title: doc.title,
              subtitle: doc.owner,
              tag: `${doc.sections.length} sections`,
              lines: [doc.sections.slice(0, 3).join(" · ")],
              ask: `Summarise the "${doc.title}" document for a busy staff member, with the key rules and who to contact.`,
            })),
          },
          {
            type: "timeline",
            title: "Policy reviews due",
            icon: "calendar",
            items: d.reviewsDue.map((r) => ({ title: r.title, date: r.due, meta: inDays(r.due), tone: urgency(r.due), ask: `Draft a reminder to the owner of the "${r.title}" policy that its review is due on ${r.due}.` })),
          },
        ],
      };
    }
  }
}
