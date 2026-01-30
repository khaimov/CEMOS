
import re
import random

input_file = "app/pulse/data.ts"
output_file = "app/pulse/data_enriched.ts"

milestones = ["Discovery", "Pilot", "Migration", "Optimization", "Expansion"]
risks = ["Low", "Low", "Low", "Medium", "Medium", "High"]
velocities = ["Increasing", "Stable", "Decreasing"]
blockers = [
    "Budget Approval Pending",
    "Security Compliance Review",
    "Technical Debt in Legacy System",
    "Lack of Trained Personnel",
    "Executive Sponsorship Gap",
    "Data Sovereignty Concerns"
]

def get_random_attrs():
    milestone = random.choice(milestones)
    risk = random.choice(risks)
    consumption = random.randint(5, 98)
    velocity = random.choice(velocities)
    
    blocker = ""
    if risk != "Low":
        blocker = random.choice(blockers)
        
    return milestone, risk, blocker, consumption, velocity

with open(input_file, "r") as f:
    content = f.read()

# Extract the array content
match = re.search(r"export const CUSTOMERS: Customer\[\] = \[(.*?)\];", content, re.DOTALL)
if not match:
    print("Could not find CUSTOMERS array")
    exit(1)

array_content = match.group(1)
# Parse individual objects (rough parsing assuming format { name: "...", id: "..." },)
# We will just traverse line by line
lines = array_content.splitlines()
new_lines = []

for line in lines:
    line = line.strip()
    if not line.startswith("{"):
        continue
        
    # Extract name and id to keep them
    # { name: "Snorkel AI", id: "0014M00001kwMVDQA2" },
    m, r, b, c, v = get_random_attrs()
    
    # Construct new line
    # Remove the trailing "},"
    clean_line = line.rstrip(",}") 
    
    enrichment = f', milestone: "{m}", risk: "{r}", consumption: {c}, velocity: "{v}"'
    if b:
        enrichment += f', blocker: "{b}"'
        
    new_line = f'  {clean_line}{enrichment} }},'
    new_lines.append(new_line)

# Reconstruct file
header = """export type RiskLevel = "Low" | "Medium" | "High";
export type Milestone = "Discovery" | "Pilot" | "Migration" | "Optimization" | "Expansion";

export interface Customer {
  id: string;
  name: string;
  milestone: Milestone;
  risk: RiskLevel;
  blocker?: string;
  consumption: number; // 0-100% of target
  velocity: "Increasing" | "Stable" | "Decreasing";
}

export const CUSTOMERS: Customer[] = [
"""

footer = "\n];\n"

with open(output_file, "w") as f:
    f.write(header + "\n".join(new_lines) + footer)

print("Enriched data written to " + output_file)
