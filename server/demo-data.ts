/**
 * Sample records behind the demo. Dates are relative to today so the demo
 * always looks current. Replace each function with the real system: the IT
 * service desk, HR system, CRM, finance system and document repository.
 */

export const DEMO_NOTE = "Sample data for the demo, not a real record.";

export function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Next 25th (payday), moved back to Friday if it falls on a weekend. */
function nextPayday(): string {
  const now = new Date();
  let d = new Date(now.getFullYear(), now.getMonth(), 25);
  if (d < new Date(now.toDateString())) d = new Date(now.getFullYear(), now.getMonth() + 1, 25);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Tickets (IT and HR cases). In-memory for the demo; each page load or server
// instance keeps its own list.
// ---------------------------------------------------------------------------

export interface Ticket {
  ticketId: string;
  category: string;
  title: string;
  details?: string;
  priority: string;
  status: string;
  created: string;
}

const tickets: Ticket[] = [
  { ticketId: "INC-20418", category: "IT", title: "Projector not detected in B-07-03", priority: "high", status: "Open", created: daysFromNow(0) },
  { ticketId: "INC-20402", category: "IT", title: "Outlook keeps asking for password", priority: "normal", status: "In progress", created: daysFromNow(-1) },
  { ticketId: "REQ-11873", category: "IT", title: "Adobe Creative Cloud licence for design lab", priority: "normal", status: "Awaiting approval", created: daysFromNow(-2) },
  { ticketId: "INC-20377", category: "IT", title: "Lab PCs in Tech Lab 4-03 slow to log in", priority: "normal", status: "In progress", created: daysFromNow(-3) },
];

export function listTickets(): Ticket[] {
  return tickets;
}

export function createTicket(input: { category: string; title: string; details?: string; priority?: string }) {
  const prefix = input.category === "IT" ? "REQ" : "CASE";
  const ticket: Ticket = {
    ticketId: `${prefix}-${Math.floor(10000 + Math.random() * 90000)}`,
    category: input.category,
    title: input.title,
    details: input.details,
    priority: input.priority ?? "normal",
    status: "Open",
    created: daysFromNow(0),
  };
  tickets.unshift(ticket);
  if (tickets.length > 50) tickets.length = 50;
  return {
    note: "Demo only: this request was not sent to any real service desk.",
    ...ticket,
    expectedFirstResponse: ticket.priority === "high" ? "within 4 working hours" : "within 1 working day",
  };
}

// ---------------------------------------------------------------------------
// IT Operations
// ---------------------------------------------------------------------------

export function itData() {
  return {
    services: [
      { name: "Email and Microsoft 365", status: "Operational" },
      { name: "Moodle LMS", status: "Degraded", note: "Slow file uploads since 08:40; engineers investigating" },
      { name: "Campus Wi-Fi", status: "Operational" },
      { name: "VPN (GlobalProtect)", status: "Operational" },
      { name: "Student portal", status: "Operational" },
      { name: "Finance system", status: "Maintenance", note: `Planned maintenance ${daysFromNow(2)} 22:00–02:00` },
    ],
    stats: { openIncidents: 37, resolvedToday: 52, avgResolutionHours: 3.4, selfServiceRate: 61 },
    ticketsByCategory: [
      { label: "Passwords", value: 41 },
      { label: "Wi-Fi", value: 23 },
      { label: "Software", value: 19 },
      { label: "Hardware", value: 12 },
      { label: "Email", value: 9 },
    ],
    channels: [
      { label: "Gemini agent", value: 61 },
      { label: "Service desk portal", value: 27 },
      { label: "Phone or walk-in", value: 12 },
    ],
    topIssues: [
      { title: "Password expired after 90 days", count: 18 },
      { title: "MFA prompt not received on new phone", count: 11 },
      { title: "APU-Secure Wi-Fi says no internet", count: 9 },
    ],
  };
}

// ---------------------------------------------------------------------------
// HR
// ---------------------------------------------------------------------------

export function hrData() {
  return {
    employee: { name: "Demo Employee", staffId: "S00000", department: "School of Computing", role: "Senior Lecturer", serviceYears: 4 },
    leave: { entitled: 18, taken: 7, pending: 2, carryForward: 3, medicalTaken: 2, medicalEntitled: 18 },
    payroll: {
      nextPayday: nextPayday(),
      lastNetPay: 8420,
      previousNetPay: 8790,
      change: "Lower by RM 370: unpaid half-day leave and a PCB tax adjustment",
    },
    benefits: [
      { benefit: "Outpatient medical", limit: "RM 1,500 / year", used: "RM 420" },
      { benefit: "Dental and optical", limit: "RM 500 / year", used: "RM 180" },
      { benefit: "Tuition discount (children)", limit: "50% of tuition", used: "–" },
    ],
    queriesByTopic: [
      { label: "Leave", value: 34 },
      { label: "Payroll", value: 27 },
      { label: "Benefits", value: 18 },
      { label: "Onboarding", value: 11 },
      { label: "Policies", value: 9 },
    ],
    newHire: { name: "New lecturer (sample)", start: daysFromNow(12) },
  };
}

// ---------------------------------------------------------------------------
// Sales & Admissions
// ---------------------------------------------------------------------------

export function admissionsData() {
  return {
    today: { newEnquiries: 38, repliedWithinSla: 92, avgFirstReplyMinutes: 6 },
    funnel: [
      { label: "Enquiries", value: 1240 },
      { label: "Applications", value: 486 },
      { label: "Offers", value: 402 },
      { label: "Accepted", value: 241 },
      { label: "Enrolled", value: 198 },
    ],
    channels: [
      { label: "Website chat", value: 46 },
      { label: "WhatsApp", value: 28 },
      { label: "Education fairs", value: 15 },
      { label: "Agents", value: 11 },
    ],
    leads: [
      { name: "Lead #4821", interest: "Cyber Security", results: "STPM 3.33", stage: "New", lastContact: daysFromNow(0), source: "Website chat" },
      { name: "Lead #4807", interest: "Computer Science", results: "A-Level AAB", stage: "Contacted", lastContact: daysFromNow(-3), source: "WhatsApp" },
      { name: "Lead #4799", interest: "Data Science", results: "UEC 6B", stage: "Contacted", lastContact: daysFromNow(-7), source: "Education fair" },
      { name: "Lead #4785", interest: "Software Engineering", results: "Diploma CGPA 2.6", stage: "Applied", lastContact: daysFromNow(-2), source: "Website chat" },
      { name: "Lead #4760", interest: "Digital Marketing", results: "STPM 2.83", stage: "Offer", lastContact: daysFromNow(-1), source: "Agent" },
    ],
    events: [
      { title: "Open day: campus tour and programme talks", date: daysFromNow(9) },
      { title: "Virtual info session: computing degrees", date: daysFromNow(4) },
      { title: "Scholarship clinic", date: daysFromNow(16) },
    ],
  };
}

// ---------------------------------------------------------------------------
// Finance
// ---------------------------------------------------------------------------

export function financeData() {
  return {
    department: "School of Computing",
    budget: { annual: 1_200_000, spent: 742_000, committed: 186_000 },
    monthlySpend: [
      { label: "May", value: 88 },
      { label: "Jun", value: 96 },
      { label: "Jul", value: 81 },
      { label: "Aug", value: 104 },
      { label: "Sep", value: 92 },
      { label: "Oct", value: 117 },
    ],
    invoices: [
      { id: "INV-2291", supplier: "TechSupply Sdn Bhd", amount: 8450, status: "Approved", due: daysFromNow(6) },
      { id: "INV-2288", supplier: "LabChem Malaysia", amount: 3120, status: "Received", due: daysFromNow(14) },
      { id: "INV-2275", supplier: "CloudSoft Licensing", amount: 22800, status: "Paid", due: daysFromNow(-3) },
      { id: "INV-2270", supplier: "PrintHub KL", amount: 960, status: "Paid", due: daysFromNow(-8) },
    ],
    claims: { awaiting: 6, value: 4380 },
    requisition: { id: "PR-2041", item: "Lab consumables", amount: 3400 },
  };
}

// ---------------------------------------------------------------------------
// Institutional knowledge
// ---------------------------------------------------------------------------

export function knowledgeData() {
  return {
    searchesThisWeek: 1284,
    citedAnswers: 96,
    searchesByDepartment: [
      { label: "Academic", value: 412 },
      { label: "HR", value: 268 },
      { label: "Finance", value: 231 },
      { label: "IT", value: 197 },
      { label: "Admissions", value: 176 },
    ],
    recentlyUpdated: [
      { title: "Records management and data protection", owner: "Registrar's Office", updated: daysFromNow(-2) },
      { title: "Expense claims and travel", owner: "Finance Office", updated: daysFromNow(-6) },
      { title: "Leave policy", owner: "Human Resources", updated: daysFromNow(-11) },
    ],
    reviewsDue: [
      { title: "Governance and committees", due: daysFromNow(21) },
      { title: "Procurement and payments", due: daysFromNow(45) },
      { title: "Wi-Fi, VPN and software access", due: daysFromNow(70) },
    ],
  };
}
