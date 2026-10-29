// One-click tools for each Gemini agent. Each tool is a small form; submitting
// it sends a well-formed request to the agent (or, for `direct` tools, calls
// an API straight away). Option lists mirror the sample data in server/demo-data.ts.

const PROGRAMMES = [
  "BSc (Hons) Computer Science",
  "BSc (Hons) Software Engineering",
  "BSc (Hons) Cyber Security",
  "BSc (Hons) Data Science and Business Analytics",
  "BA (Hons) Digital Marketing",
];

export const ACTIONS = {
  it: [
    {
      id: "troubleshoot",
      icon: "bulb",
      title: "Troubleshooter",
      blurb: "Step-by-step help for any IT problem.",
      fields: [
        { name: "device", label: "Device", type: "select", options: ["University laptop", "Personal laptop", "Phone or tablet", "Lab PC", "Classroom equipment"] },
        { name: "problem", label: "What's happening?", type: "textarea", placeholder: "e.g. Wi-Fi connects but there's no internet", required: true },
        { name: "tried", label: "What have you tried already?", type: "text", placeholder: "e.g. restarted, reconnected" },
      ],
      prompt: (v) =>
        `I need IT help on my ${v.device.toLowerCase()}. Problem: ${v.problem}. Already tried: ${v.tried || "nothing yet"}. Check service status first, then give me numbered steps one at a time, and tell me when I should log a ticket instead.`,
    },
    {
      id: "password",
      icon: "lock",
      title: "Password and MFA reset",
      blurb: "Get back into your account safely.",
      fields: [
        { name: "situation", label: "Situation", type: "select", options: ["Forgot my password", "Account locked out", "New phone, MFA not working", "Lost my phone"] },
        { name: "who", label: "I am", type: "select", options: ["Staff", "Student"] },
      ],
      prompt: (v) =>
        `I'm ${v.who.toLowerCase()} and my situation is: ${v.situation.toLowerCase()}. Guide me through the official reset steps. Remind me never to share my password or MFA code.`,
    },
    {
      id: "access",
      icon: "plus",
      title: "Request software access",
      blurb: "Logged with the service desk straight away.",
      direct: "ticket",
      category: "IT",
      fields: [
        { name: "title", label: "Software or system", type: "text", placeholder: "e.g. Adobe Creative Cloud, SPSS, finance system", required: true },
        { name: "details", label: "Business reason", type: "textarea", placeholder: "What you need it for and for how long", required: true },
        { name: "priority", label: "Priority", type: "select", options: ["normal", "low", "high"] },
      ],
    },
    {
      id: "setup",
      icon: "globe",
      title: "Wi-Fi and VPN setup",
      blurb: "Connection guide for your device.",
      fields: [
        { name: "what", label: "Set up", type: "select", options: ["Campus Wi-Fi (APU-Secure)", "VPN for remote access", "Both"] },
        { name: "os", label: "Operating system", type: "select", options: ["Windows 11", "macOS", "iOS", "Android", "Linux"] },
      ],
      prompt: (v) => `Give me step-by-step instructions to set up ${v.what} on ${v.os}, including the exact settings to choose.`,
    },
  ],

  hr: [
    {
      id: "leave",
      icon: "sun",
      title: "Leave checker",
      blurb: "Your balance and how to apply.",
      fields: [
        { name: "type", label: "Leave type", type: "select", options: ["Annual leave", "Medical leave", "Compassionate leave", "Unpaid leave", "Maternity or paternity leave"] },
        { name: "days", label: "Days needed", type: "number", value: "3", min: 1, max: 98 },
        { name: "when", label: "When", type: "text", placeholder: "e.g. 18–20 December" },
      ],
      prompt: (v) =>
        `I want to take ${v.days} days of ${v.type.toLowerCase()}${v.when ? ` on ${v.when}` : ""}. Check my balance, tell me if I have enough, what the policy says, and exactly how to apply.`,
    },
    {
      id: "payslip",
      icon: "wallet",
      title: "Payslip explainer",
      blurb: "Understand your pay and deductions.",
      fields: [{ name: "question", label: "What would you like to understand?", type: "select", options: ["Why my net pay changed", "My EPF and SOCSO deductions", "My PCB tax deduction", "When I get paid"] }],
      prompt: (v) => `${v.question}. Use my payroll record and the payroll policy, and explain it in plain words.`,
    },
    {
      id: "onboarding",
      icon: "users",
      title: "Onboarding plan",
      blurb: "A first-month plan for a new hire.",
      fields: [
        { name: "role", label: "Role", type: "text", placeholder: "e.g. Lecturer, Finance executive", required: true },
        { name: "dept", label: "Department", type: "text", placeholder: "e.g. School of Computing", required: true },
        { name: "start", label: "Start date", type: "date", required: true },
      ],
      prompt: (v) =>
        `Create an onboarding plan for a new ${v.role} in ${v.dept} starting on ${v.start}: before day one, week one and the first month, with owners for each task, as a table.`,
    },
    {
      id: "case",
      icon: "doc",
      title: "Raise an HR case",
      blurb: "Sent to HR. Sensitive cases go to your HR partner.",
      direct: "ticket",
      category: "HR",
      fields: [
        { name: "title", label: "Topic", type: "text", placeholder: "e.g. Update my bank details", required: true },
        { name: "details", label: "Details", type: "textarea", placeholder: "Don't include medical or other sensitive details here" },
      ],
    },
  ],

  admissions: [
    {
      id: "recommend",
      icon: "compass",
      title: "Course recommender",
      blurb: "Best-fit programmes for an applicant.",
      fields: [
        { name: "results", label: "Applicant's results", type: "text", placeholder: "e.g. STPM CGPA 3.33, credit in Maths", required: true },
        { name: "interests", label: "Interests and goals", type: "textarea", placeholder: "e.g. ethical hacking, wants to work in a bank", required: true },
      ],
      prompt: (v) =>
        `Recommend up to two APU programmes for an applicant with ${v.results} who is interested in: ${v.interests}. Explain why, list the entry requirements and the next intake.`,
    },
    {
      id: "eligibility",
      icon: "checkCircle",
      title: "Eligibility checker",
      blurb: "Check results against entry rules.",
      fields: [
        { name: "programme", label: "Programme", type: "select", options: PROGRAMMES },
        { name: "qualification", label: "Qualification", type: "select", options: ["STPM", "A-Level", "UEC", "Diploma", "APU Foundation", "Other"] },
        { name: "results", label: "Results", type: "text", placeholder: "e.g. CGPA 2.6", required: true },
      ],
      prompt: (v) =>
        `Is an applicant with ${v.qualification} (${v.results}) eligible for ${v.programme}? Check the published entry requirements, give a clear yes, no or borderline, and the next step.`,
    },
    {
      id: "reply",
      icon: "mail",
      title: "Enquiry reply drafter",
      blurb: "A warm, accurate reply in seconds.",
      fields: [
        { name: "enquiry", label: "Paste the enquiry", type: "textarea", rows: 6, required: true },
        { name: "language", label: "Reply in", type: "select", options: ["English", "Bahasa Melayu", "Chinese"] },
      ],
      prompt: (v) =>
        `Draft a reply in ${v.language} to this prospective student enquiry. Be warm, accurate to APU policy, never promise admission or scholarships, and end with a clear next step.\n\nEnquiry:\n${v.enquiry}`,
    },
    {
      id: "followup",
      icon: "bell",
      title: "Follow-up planner",
      blurb: "Who to chase today and what to say.",
      fields: [],
      prompt: () =>
        "Check the lead pipeline and list the leads I should follow up today, with a short suggested message for each, following the enquiry handling rules.",
    },
  ],

  finance: [
    {
      id: "route",
      icon: "scale",
      title: "Procurement route finder",
      blurb: "Quotes and approvals for any amount.",
      fields: [
        { name: "item", label: "What are you buying?", type: "text", placeholder: "e.g. 20 lab monitors", required: true },
        { name: "amount", label: "Estimated amount (RM)", type: "number", min: 1, required: true },
      ],
      prompt: (v) =>
        `I want to buy ${v.item} for about RM ${Number(v.amount).toLocaleString("en-MY")}. Which procurement route applies, how many quotations do I need, who approves, and what are the steps?`,
    },
    {
      id: "claim",
      icon: "checkCircle",
      title: "Expense claim checker",
      blurb: "Is it claimable, and what do I need?",
      fields: [
        { name: "expense", label: "Expense", type: "textarea", placeholder: "e.g. Grab from KLIA to conference hotel, RM 85", required: true },
        { name: "trip", label: "Trip type", type: "select", options: ["Local", "Overseas", "Not travel"] },
      ],
      prompt: (v) =>
        `Can I claim this (${v.trip.toLowerCase()} trip): ${v.expense}? Check the expense policy, say yes or no with the reason, and list what I need to submit and by when.`,
    },
    {
      id: "invoice",
      icon: "doc",
      title: "Invoice status",
      blurb: "Where an invoice is and when it's paid.",
      fields: [{ name: "invoice", label: "Invoice or PO number", type: "text", placeholder: "e.g. INV-2291", required: true }],
      prompt: (v) => `What's the status of ${v.invoice}? When will the supplier be paid under our payment terms?`,
    },
    {
      id: "report",
      icon: "chart",
      title: "Budget report summary",
      blurb: "A one-page summary for your department.",
      fields: [{ name: "audience", label: "For", type: "select", options: ["Head of department", "Dean", "Finance committee"] }],
      prompt: (v) =>
        `Write a short budget summary for the ${v.audience.toLowerCase()}: spend to date, commitments, remaining budget, notable variances and risks for the rest of the year.`,
    },
  ],

  knowledge: [
    {
      id: "find",
      icon: "search",
      title: "Find a document",
      blurb: "The right policy, with its owner.",
      fields: [{ name: "need", label: "What are you looking for?", type: "text", placeholder: "e.g. how long we keep student files", required: true }],
      prompt: (v) => `Find the APU document that covers: ${v.need}. Quote the relevant rule, cite the source and say which office owns it.`,
    },
    {
      id: "summarise",
      icon: "list",
      title: "Policy summariser",
      blurb: "Five bullet points from any policy.",
      fields: [
        {
          name: "policy",
          label: "Policy",
          type: "select",
          options: ["Records management and data protection", "Governance and committees", "Leave policy", "Procurement and payments", "Expense claims and travel", "Accounts, passwords and MFA"],
        },
        { name: "audience", label: "For", type: "select", options: ["New staff", "Managers", "Students"] },
      ],
      prompt: (v) => `Summarise the "${v.policy}" policy in 5 bullet points for ${v.audience.toLowerCase()}, with sources and who to contact.`,
    },
    {
      id: "compare",
      icon: "scale",
      title: "Compare policies",
      blurb: "Where two policies agree or conflict.",
      fields: [
        { name: "a", label: "First topic", type: "text", placeholder: "e.g. expense claims", required: true },
        { name: "b", label: "Second topic", type: "text", placeholder: "e.g. procurement", required: true },
      ],
      prompt: (v) =>
        `Compare APU's rules on ${v.a} and ${v.b} in a table: what each covers, approval levels, deadlines, and any overlap or conflict. Cite sources.`,
    },
    {
      id: "memo",
      icon: "edit",
      title: "Memo from policy",
      blurb: "Turn a policy into a staff memo.",
      fields: [
        { name: "topic", label: "Memo topic", type: "text", placeholder: "e.g. reminder on PDPA and AI tools", required: true },
        { name: "to", label: "To", type: "text", placeholder: "e.g. all academic staff", required: true },
      ],
      prompt: (v) =>
        `Draft a short memo to ${v.to} about ${v.topic}, based only on APU policy, with the key rules as bullets, sources, and a contact for questions.`,
    },
  ],
};
