/**
 * run_gauntlet.ts
 * Stage 8: The Validation Gauntlet
 * Tests synthesized O(E log E) Python against a simulated Ticketmaster attack narrative.
 */

async function executeGauntlet() {
  console.log("🚀 [Stage 8] Initializing Validation Gauntlet...");

  // 1. Cyberattack Narrative Payload
  const mockTicketmasterEvents = [
    // --- NOISE EVENTS ---
    { item_id: "SeatBlock_12", user: "User_Random1", type: "Add", time: 35000 },
    { item_id: "SeatBlock_12", user: "User_Random1", type: "Checkout", time: 35050 },
    { item_id: "SeatBlock_99", user: "User_Random2", type: "Add", time: 36005 },
    
    // --- DAISY-CHAIN ATTACK NARRATIVE ---
    { item_id: "SeatBlock_77", user: "User_A", type: "Add", time: 36000 },    // 10:00:00
    { item_id: "SeatBlock_77", user: "User_A", type: "Remove", time: 36898 }, // 14 mins 58 secs later
    { item_id: "SeatBlock_77", user: "User_B", type: "Add", time: 36899 },    // 1 sec handoff gap (Handoff 1)
    { item_id: "SeatBlock_77", user: "User_B", type: "Remove", time: 37798 }, // 14 mins 59 secs later
    { item_id: "SeatBlock_77", user: "User_C", type: "Add", time: 37799 },    // 1 sec handoff gap (Handoff 2)
  ];

  // 2. Synthesized Python Code logic matching Vulcan Output requirements (O(E log E) Graph detection logic)
  const syntheticPythonCode = `
import json

def detect_anomaly():
    try:
        with open('temp_data.json', 'r') as f:
            payload = json.load(f)
            
        events = payload.get('events', [])
        delta = payload.get('delta', 2)

        # 1. GROUP
        groups = {}
        for e in events:
            groups.setdefault(e['item_id'], []).append(e)

        anomaly = False

        for item, evs in groups.items():
            # 2. SORT
            evs.sort(key=lambda x: x['time'])
            
            recent_removes = []
            
            # 3. SLIDING WINDOW & 4. BUILD GRAPH (simplified for detection)
            for e in evs:
                if e['type'] == 'Remove':
                    recent_removes.append(e)
                elif e['type'] == 'Add':
                    # Prune old window events
                    recent_removes = [r for r in recent_removes if (e['time'] - r['time']) <= delta]
                    
                    for r in recent_removes:
                        # Cross-actor temporal anomaly detected
                        if r['user'] != e['user']:
                            anomaly = True
                            break
                if anomaly:
                    break
            if anomaly:
                break
        
        print("true" if anomaly else "false")
    except Exception as e:
        print("false")

if __name__ == "__main__":
    detect_anomaly()
`;

  console.log("📤 Transmitting to Vulcan API Engine...");

  try {
    const response = await fetch("http://localhost:3000/api/validate-skill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: syntheticPythonCode,
        data: mockTicketmasterEvents,
        delta: 2
      })
    });

    const data = await response.json();

    if (data.status === "VALIDATED") {
      console.log("\n========================================================");
      console.log("✅ [SUCCESS] THE VALIDATION GAUNTLET HAS BEEN CONQUERED.");
      console.log("========================================================");
      console.log("The O(E log E) Python sequence successfully caught the simulated");
      console.log("Ticketmaster token daisy-chain within strict delta bounds.\n");
    } else {
      console.error("\n❌ [FAILURE] The execution failed or the anomaly evaded detection.");
      console.error("Payload returned:", data);
    }
  } catch (error) {
    console.error("\n💥 [CRITICAL] Failed to hit backend execution framework.");
    console.error("Trace:", error);
  }
}

executeGauntlet();
