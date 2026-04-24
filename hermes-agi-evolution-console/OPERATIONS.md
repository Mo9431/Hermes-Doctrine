# System Operations & Expansion Guide

This document outlines the operational procedures for the Hermes Intelligence Pipeline and provides instructions on how to expand the system with new domains and structural abstractions.

## Core Operations Workflow

Operating Hermes requires thinking structurally. You are not writing code; you are defining the constraints that *generate* code.

### 1. Incident Ingestion
- Start with a natural language description of an anomaly, exploit, or fraud vector (e.g., "Users are cycling free trials using temporary emails from the same IP range").
- Ensure you have a clear grasp of the "actor," the "action," and the "sink" (target).

### 2. RE-TRAC Compression
- Submit the incident to the **RE-TRAC Engine** (`/api/synthesize`).
- Hermes will compress the narrative into strict First-Order Logic (FOL) and define a Symbol Dictionary. 
- *Operator Action:* Verify that the FOL captures the exact constraints (time bounds, identity disjointness, thresholds) without over-fitting to the specific incident.

### 3. Abstraction Routing
- The FOL payload is evaluated by the **Abstraction Router** (`/api/classify-pattern`).
- It attempts to bind the Level-2 logic (specific heuristic) to a Level-1 Parent Abstraction (e.g., `Sybil_Aggregation_Rotation`).
- If a match is found, the logic is categorized and added to the structural intelligence database (FTS5 map).

### 4. Vulcan Synthesis & Gauntlet Validation
- Vulcan compiles the FOL into target-specific code (Python, TypeScript, SQL).
- Execute the **Validation Gauntlet** against the synthesized code using chronological mock event streams. 
- *Operator Action:* If Vulcan fails or produces $O(N^2)$ brute-force logic, provide algorithmic correction prompts (e.g., "Refactor to use sliding windows and hash maps for $O(N)$").

---

## The Hermes Workshop (Domain Configuration)

The **Workshop** is the new central configuration hub for the Hermes system. It replaces manual code editing for domain expansion.

### Accessing the Workshop
Navigate to the **Workshop** tab in the sidebar ( wrench icon). This UI allows you to:
- Configure the operational domain (e.g., Healthcare, Finance, Supply Chain)
- Define the Parent Abstraction Pattern name
- Set the domain context description
- Manage the pattern clauses that define what the system looks for

### Configuring New Domains

1. **Open the Workshop** from the sidebar navigation.
2. **Update the Domain Name**: Enter your target domain (e.g., "Healthcare Fraud Detection").
3. **Define the Parent Pattern**: Name your Level-1 abstraction (e.g., "Temporal_Claim_Cluster").
4. **Write the Context**: Describe what patterns you're targeting.
5. **Add Pattern Clauses**: Define the binding criteria (e.g., "Provider Clustering", "Diagnosis Codes", "Time Window", "Billing Anomaly").
6. **Click "Apply Configuration"** to activate.

The system will dynamically update all prompts for RE-TRAC, Abstraction Router, and other subsystems.

### Quick Templates
The Workshop includes preset templates for common domains:
- **Cyber/Fraud**: Sybil_Aggregation_Rotation (default)
- **Healthcare**: Temporal_Claim_Cluster
- **Trading**: Market_Manipulation
- **Supply Chain**: Fraudulent_Chain

---

## Agent-Friendly Memory Management

Hermes provides API endpoints for external agents to manage persistent memory:

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workshop/config` | Read current workshop configuration |
| POST | `/api/workshop/config` | Update domain/pattern configuration |
| DELETE | `/api/grimoire/skills/:id` | Prune a specific skill by ID |
| POST | `/api/grimoire/organize` | Atropos Shear - LLM-powered memory organization |
| POST | `/api/grimoire/clear` | Clear all skills from memory |

### Using Endpoints (Examples)

**Update Workshop Configuration:**
```bash
curl -X POST http://localhost:3000/api/workshop/config \
  -H "Content-Type: application/json" \
  -d '{"domain": "Healthcare", "parentPattern": "Temporal_Claim_Cluster", "clauses": ["Provider Clustering", "Time Window", "Billing Anomaly"]}'
```

**Prune a Specific Skill:**
```bash
curl -X DELETE http://localhost:3000/api/grimoire/skills/sk_1
```

**Organize Memory (Atropos Shear):**
```bash
curl -X POST http://localhost:3000/api/grimoire/organize \
  -H "Content-Type: application/json" \
  -d '{"aggression": 0.3}'
```

**Clear All Memory:**
```bash
curl -X POST http://localhost:3000/api/grimoire/clear
```

---

## Grimoire UI Memory Controls

The Skill Grimoire dashboard includes built-in controls:

- **Atropos Shear Button**: Triggers the LLM-powered organization endpoint to identify and remove redundant/low-alignment skills.
- **Clear All Button**: Removes all skills from memory (with confirmation).
- **Per-Skill Prune Icons**: Each skill card has a trash icon to remove individual skills.

---

## Troubleshooting

- **LLM Cascade Failures:** Check `.env` keys. If you receive a cascade failure for structured generation (`[ZOD VALIDATION FAILED]`), the model failed to output pure JSON. The system has regex fallbacks, but ensure prompts forcefully demand valid JSON shapes without markdown framing.
- **Vulcan Overload ("raise NotImplementedError"):** Complex multi-variable calculus or ambiguous temporal logic in the FOL will cause Vulcan safety fallbacks to trigger. You must simplify the FOL or explicitly command a structural mapping (e.g., FTS5 direct map).
- **Workshop Config Not Applying:** Ensure you're calling `POST /api/workshop/config` with valid JSON. The response should include `"status": "updated"`.

---

## Legacy Expansion (Manual Code Edit)

For advanced customization beyond the Workshop UI, you can still edit `server.ts` directly:

1. **Update the router definition:** Modify the `workshopConfig` object at the top of `server.ts`.
2. **Customize system prompts:** The dynamic prompts use template literals that inject `workshopConfig.domain`, `workshopConfig.context`, etc.
3. **Restart the Server:** Run `npm run dev` to reload the intelligence baseline.

Example manual config in `server.ts`:
```typescript
let workshopConfig: WorkshopConfig = {
  domain: "Custom Domain",
  context: "Your domain context here...",
  parentPattern: "Your_Pattern_Name",
  clauses: ["Clause 1", "Clause 2", "..."],
  description: "What this pattern detects."
};
```