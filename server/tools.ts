import { admissionsData, DEMO_NOTE, financeData, hrData, itData, knowledgeData } from "./demo-data.js";
import { searchKnowledge, type KnowledgeChunk, type SearchHit } from "./knowledge.js";
import type { Persona } from "./personas.js";

/**
 * Agent tools. In this static demo they run in the browser; with a backend
 * they become Gemini function declarations with the same names and outputs.
 */

export const TOOL_STATUS: Record<string, string> = {
  search_apu_knowledge: "Searching approved APU documents",
  get_it_service_status: "Checking IT service status",
  get_my_hr_record: "Checking your HR record",
  get_admissions_pipeline: "Checking the admissions pipeline",
  get_finance_summary: "Checking the finance system",
};

// ---------------------------------------------------------------------------
// Sources: numbers cited as [n], stable within one chat turn
// ---------------------------------------------------------------------------

export class SourceRegistry {
  private hits = new Map<string, SearchHit>();

  add(chunk: KnowledgeChunk): SearchHit {
    const key = `${chunk.docId}#${chunk.section}`;
    let hit = this.hits.get(key);
    if (!hit) {
      hit = { ref: this.hits.size + 1, ...chunk };
      this.hits.set(key, hit);
    }
    return hit;
  }

  list(): SearchHit[] {
    return [...this.hits.values()];
  }
}

// ---------------------------------------------------------------------------
// Execution
// ---------------------------------------------------------------------------

export interface ToolOutcome {
  content: string;
  isError?: boolean;
  sources?: SearchHit[];
}

const RECORDS: Record<string, () => unknown> = {
  get_it_service_status: () => {
    const d = itData();
    return { services: d.services, stats: d.stats, topIssues: d.topIssues };
  },
  get_my_hr_record: () => {
    const d = hrData();
    return { employee: d.employee, leave: d.leave, payroll: d.payroll, benefits: d.benefits };
  },
  get_admissions_pipeline: () => {
    const d = admissionsData();
    return { today: d.today, leads: d.leads, funnel: d.funnel };
  },
  get_finance_summary: () => {
    const d = financeData();
    return { department: d.department, budget: d.budget, invoices: d.invoices, claims: d.claims };
  },
  get_knowledge_stats: () => knowledgeData(),
};

export function runTool(name: string, rawInput: unknown, persona: Persona, sources: SourceRegistry): ToolOutcome {
  // Role-based access: an agent can only run its own tools.
  if (name !== "search_apu_knowledge" && !persona.tools.includes(name)) {
    return { content: `Tool ${name} is not available to this agent.`, isError: true };
  }
  if (name === "search_apu_knowledge") {
    const query = String((rawInput as { query?: unknown })?.query ?? "").slice(0, 500);
    const chunks = searchKnowledge(query, persona.audiences);
    if (chunks.length === 0) {
      return { content: "No matching documents. Try other keywords, or say this isn't covered." };
    }
    const hits = chunks.map((c) => sources.add(c));
    const content = hits.map((h) => `[${h.ref}] ${h.title} > ${h.section} (owner: ${h.owner})\n${h.text}`).join("\n\n---\n\n");
    return { content, sources: hits };
  }
  const record = RECORDS[name];
  if (!record) return { content: `Unknown tool: ${name}`, isError: true };
  return { content: JSON.stringify({ note: DEMO_NOTE, ...(record() as object) }, null, 2) };
}
