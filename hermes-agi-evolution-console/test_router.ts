async function check() {
  try {
    const res = await fetch("http://localhost:3000/api/classify-pattern", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        domain: "Ad-Tech",
        incidentReport: "Bots clicking Campaign_Alpha in 45s window from different IPs/Subnets/UAs.",
        fol: "∃C ∈ Campaigns, ∃S ⊆ Actors, ∃t_0, ∃δ (δ ≤ 45), ∀a ∈ S, ∃t_a: [∀a ∈ S: click(a,C,t_a) ∧ clicks_24h(a,C)=1 ∧ t_a ∈ [t_0, t_0+δ]] ∧ [∀a,b ∈ S (a ≠ b): ip(a) ≠ ip(b) ∧ subnet(a) ≠ subnet(b) ∧ user_agent(a) ≠ user_agent(b)] ∧ |S| ≥ 2",
        symbols: {
          "click": { "type": "predicate", "source": "input_trajectory" },
          "clicks_24h": { "type": "function", "unit": "count", "source": "input_trajectory" },
          "ip": { "type": "function", "unit": "string", "source": "actor_identity" },
          "subnet": { "type": "function", "unit": "string", "source": "actor_identity" },
          "user_agent": { "type": "function", "unit": "string", "source": "actor_identity" },
          "C": { "type": "constant", "unit": "campaign_id", "source": "incident_target", "value": "Campaign_Alpha" },
          "δ": { "type": "constant", "unit": "seconds", "source": "forensic_trace", "value": 45 },
          "S": { "type": "set", "unit": "actors", "source": "coordinated_botnet" }
        }
      })
    });
    const text = await res.text();
    console.log("RESPONSE_STATUS:", res.status);
    console.log("RESPONSE_BODY:", text);
  } catch (err) {
    console.error(err);
  }
}
check();
