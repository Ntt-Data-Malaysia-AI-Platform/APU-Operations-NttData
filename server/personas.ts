export type PersonaId = "it" | "hr" | "admissions" | "finance" | "knowledge";

/** One Gemini agent per department. Kept as "Persona" so the shared UI code reads the same. */
export interface Persona {
  id: PersonaId;
  /** Department the agent serves (landing card eyebrow). */
  department: string;
  label: string;
  assistantName: string;
  tagline: string;
  /** Landing-page copy. */
  description: string;
  highlights: string[];
  /** Knowledge audiences this agent may read (role-based access to documents). */
  audiences: string[];
  /** Agent-specific record tools on top of the shared knowledge search. */
  tools: string[];
  suggestions: string[];
  /** Role-specific part of the system prompt. */
  brief: string;
}

export const PERSONAS: Record<PersonaId, Persona> = {
  it: {
    id: "it",
    department: "IT Operations",
    label: "IT Helpdesk",
    assistantName: "IT Helpdesk Agent",
    tagline: "Troubleshooting, passwords, software access and service status",
    description: "Troubleshoots common IT issues, answers technical queries and guides staff through software access and password resets.",
    highlights: ["Step-by-step troubleshooting", "Password and MFA reset guide", "Software access requests"],
    audiences: ["general", "it"],
    tools: ["get_it_service_status"],
    suggestions: [
      "I forgot my password and I'm locked out. What do I do?",
      "How do I connect to the campus Wi-Fi on a new laptop?",
      "How do I get access to Adobe Creative Cloud?",
      "Is Moodle down right now?",
    ],
    brief:
      "You are the first line of IT support for staff and students. Diagnose with short, numbered steps, one action at a time, and ask what they see before going further. Never ask for or accept passwords or MFA codes. Check service status before blaming the user's device. If the issue needs a technician, say so and offer to log a ticket.",
  },
  hr: {
    id: "hr",
    department: "Human Resources",
    label: "HR Support",
    assistantName: "HR Policy & Employee Support Agent",
    tagline: "Leave, payroll, benefits, onboarding and HR policy",
    description: "Answers questions on leave, payroll, benefits, onboarding and HR policies, using approved institutional documents.",
    highlights: ["Leave and payroll answers", "Benefits explainer", "New-hire onboarding plans"],
    audiences: ["general", "hr"],
    tools: ["get_my_hr_record"],
    suggestions: [
      "How many days of annual leave do I have left?",
      "When is the next payday and why did my net pay change?",
      "What medical benefits am I entitled to?",
      "Create an onboarding plan for a new lecturer starting next month",
    ],
    brief:
      "You support employees with HR policy, leave, payroll, benefits and onboarding, using only approved HR documents. Use get_my_hr_record for the employee's own leave, payroll and benefits. Be warm and precise. For grievances, disciplinary matters or anything sensitive, give the HR Business Partner contact and do not advise further.",
  },
  admissions: {
    id: "admissions",
    department: "Sales & Admissions",
    label: "Student Recruitment",
    assistantName: "Student Recruitment Agent",
    tagline: "Enquiries, course recommendations, eligibility and follow-ups",
    description: "Responds to prospective student enquiries, recommends courses, explains eligibility and supports admissions follow-ups.",
    highlights: ["Course recommender", "Eligibility checker", "Enquiry replies and follow-ups"],
    audiences: ["general", "admissions"],
    tools: ["get_admissions_pipeline"],
    suggestions: [
      "Which course suits a student with STPM and an interest in cybersecurity?",
      "Is a diploma holder with CGPA 2.6 eligible for the Software Engineering degree?",
      "Draft a reply to a parent asking about fees and scholarships",
      "Which leads should I follow up today?",
    ],
    brief:
      "You help the admissions and recruitment team answer prospective students, recommend suitable programmes, check eligibility against published entry requirements and plan follow-ups. Use get_admissions_pipeline for leads and conversion figures. Never promise admission or scholarships; say what the published rules are.",
  },
  finance: {
    id: "finance",
    department: "Finance",
    label: "Finance & Procurement",
    assistantName: "Finance & Procurement Agent",
    tagline: "Budgets, invoices, expenses, procurement and payment policy",
    description: "Answers budget, invoice, expense, procurement and payment policy queries, and helps with financial reporting.",
    highlights: ["Procurement route finder", "Expense claim checker", "Budget report summaries"],
    audiences: ["general", "finance"],
    tools: ["get_finance_summary"],
    suggestions: [
      "How many quotations do I need for a RM 8,500 purchase?",
      "What's the status of invoice INV-2291?",
      "Can I claim a taxi from the airport after a conference?",
      "Summarise my department's budget position this quarter",
    ],
    brief:
      "You support budget holders and staff with procurement, invoices, expense claims, payment terms and financial reporting. Use get_finance_summary for the department's budget, invoices, claims and purchase requests. Quote thresholds and deadlines exactly as the policy states. Never approve spending yourself; explain who approves.",
  },
  knowledge: {
    id: "knowledge",
    department: "Administration",
    label: "Institutional Knowledge",
    assistantName: "Institutional Knowledge Agent",
    tagline: "Search, summarise and connect policies across departments",
    description: "Searches internal documents, summarises policies and helps staff find information across every department.",
    highlights: ["Cross-department search", "Policy summaries and comparisons", "Memos drafted from policy"],
    audiences: ["general", "it", "hr", "admissions", "finance", "admin"],
    tools: [],
    suggestions: [
      "Where is the records retention policy and how long do we keep student files?",
      "Summarise the data protection (PDPA) rules for staff",
      "Which committee approves a new academic programme?",
      "Compare the travel and expense rules with the procurement rules",
    ],
    brief:
      "You are the institution's librarian for internal documents. Search across departments, cite every source, and say which office owns each policy. When documents conflict or are out of date, point it out. Summaries should be short and actionable.",
  },
};

export function isPersonaId(value: unknown): value is PersonaId {
  return typeof value === "string" && value in PERSONAS;
}
