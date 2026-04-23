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

## Expanding the Intelligence Matrix (Adding New Domains)

Hermes is designed to seamlessly integrate new operational domains (e.g., Healthcare Fraud, High-Frequency Trading Manipulation, Supply Chain Exploits). 

### Method 1: Dynamic Spawning (Via API)

You can dynamically inject new incidents for evaluation in a new domain without modifying core code. The system will auto-spawn Level-2 cards on the dashboard.

1. **Craft the Payload:** Describe the incident clearly and extract its FOL.
2. **Submit to Router:** Send a POST request to `/api/classify-pattern`.
   ```json
   {
     "domain": "Healthcare",
     "incidentReport": "Multiple unrelated patients claiming maximum physical therapy hours at the exact same out-of-network clinic within hours of each other.",
     "fol": "∃c ∈ Clinics, ∃S ⊆ Patients, ∃δ (δ ≤ 24hr), ∀p ∈ S: [claim(p, c, max_hrs)] ∧ |S| ≥ 5",
     "symbols": { ... }
   }
   ```
3. **Observe Grimoire:** The Skill Grimoire UI will automatically map this under its parent abstraction and bind it to the "Healthcare" domain tag.

### Method 2: Defining New Level-1 Parent Abstractions

To define entirely new core patterns (Level-1 abstractions) beyond `Sybil_Aggregation_Rotation`, you must update the foundational intelligence map.

1. **Update the router definition:** Modify the `systemPrompt` in `server.ts` (inside `/api/classify-pattern`) to recognize your new pattern constraint.
   ```typescript
   // Example inside server.ts -> /api/classify-pattern
   const systemPrompt = `You are the Hermes Abstraction Router. Evaluate if the FOL binds to:
   1. 'Sybil_Aggregation_Rotation' (Disjoint identities, shared sink, temporal clustering)
   2. 'Temporal_Arbitrage_Exploit' (Exploiting sequential execution delays)
   ...`;
   ```

2. **Update the Grimoire Database export:** Modify the `grimoireDatabase` object in `server.ts` to reflect the new parent patterns and their structural clauses.
   ```typescript
   export const grimoireDatabase = {
     parentPattern: "Temporal_Arbitrage_Exploit",
     clauses: [
       "Race Condition State",
       "Time-to-Execution Delta",
       "Optimistic Parallel Execution"
     ],
     children: [ ... ]
   };
   ```

3. **Restart the Server:** Run `npm run dev` to reload the intelligence baseline.

## Troubleshooting

- **LLM Cascade Failures:** Check `.env` keys. If you receive a cascade failure for structured generation (`[ZOD VALIDATION FAILED]`), the model failed to output pure JSON. The system has regex fallbacks, but ensure prompts forcefully demand valid JSON shapes without markdown framing.
- **Vulcan Overload ("raise NotImplementedError"):** Complex multi-variable calculus or ambiguous temporal logic in the FOL will cause Vulcan safety fallbacks to trigger. You must simplify the FOL or explicitly command a structural mapping (e.g., FTS5 direct map).
