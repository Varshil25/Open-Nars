"""Overview plots that tell the full story across all scenarios."""

import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
LOG = ROOT / "logs"
PLOT = ROOT / "plots"

df = pd.read_csv(ROOT / "analysis" / "summary.csv")

# -- Bar chart: empirical vs theoretical final frequency -----------------
rows = df.dropna(subset=["theory_f"]).copy()
rows = rows.sort_values(["category", "scenario"]).reset_index(drop=True)
fig, ax = plt.subplots(figsize=(11, 4.5))
x = range(len(rows))
bw = 0.38
ax.bar([i - bw/2 for i in x], rows["final_f"], width=bw,
       label="empirical f", color="#1f77b4")
ax.bar([i + bw/2 for i in x], rows["theory_f"], width=bw,
       label="theoretical f (NAL all-evidence)", color="#ff7f0e")
ax.set_xticks(list(x))
ax.set_xticklabels([f"{r.scenario}\n{r.term}" for r in rows.itertuples()],
                   rotation=35, ha="right", fontsize=8)
ax.set_ylabel("final frequency f")
ax.set_title("Empirical vs. theoretical final frequency (NAL revision)")
ax.legend()
ax.set_ylim(0, 1.05)
ax.grid(True, axis="y", alpha=0.3)
plt.tight_layout()
plt.savefig(PLOT / "_overview_freq.png", dpi=130, bbox_inches="tight")
plt.close()

# Same for confidence
fig, ax = plt.subplots(figsize=(11, 4.5))
ax.bar([i - bw/2 for i in x], rows["final_c"], width=bw,
       label="empirical c", color="#d62728")
ax.bar([i + bw/2 for i in x], rows["theory_c"], width=bw,
       label="theoretical c (NAL all-evidence)", color="#9467bd")
ax.set_xticks(list(x))
ax.set_xticklabels([f"{r.scenario}\n{r.term}" for r in rows.itertuples()],
                   rotation=35, ha="right", fontsize=8)
ax.set_ylabel("final confidence c")
ax.set_title("Empirical vs. theoretical final confidence")
ax.legend()
ax.set_ylim(0, 1.05)
ax.grid(True, axis="y", alpha=0.3)
plt.tight_layout()
plt.savefig(PLOT / "_overview_conf.png", dpi=130, bbox_inches="tight")
plt.close()


# -- Confidence-growth curves from simple scenarios ----------------------
fig, ax = plt.subplots(figsize=(9, 4.5))
for scen_name in ["S1_direct_negation", "S2_asymmetric_strength",
                  "S3_graded_contradiction", "S4_repeated_contradiction",
                  "T3_weight_erosion"]:
    p = LOG / f"{scen_name}.json"
    if not p.exists():
        continue
    with open(p) as f:
        log = json.load(f)
    term = list(log["final"].keys())[0]
    cs = []
    for snap in log["snapshots"]:
        beliefs = snap["terms"].get(term, [])
        cs.append(max([b["confidence"] for b in beliefs] + [0.0]))
    ax.plot(range(len(cs)), cs, label=scen_name, linewidth=1.8)
ax.set_xlabel("cycle")
ax.set_ylabel("max confidence over tracked concept")
ax.set_title("Confidence accumulation under contradictory evidence")
ax.legend(fontsize=8, loc="lower right")
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig(PLOT / "_overview_confidence_growth.png", dpi=130,
            bbox_inches="tight")
plt.close()


# -- Penguin scenario: competing generic vs specific beliefs --------------
p = LOG / "C2_conflicting_rules.json"
if p.exists():
    with open(p) as f:
        log = json.load(f)
    fig, ax = plt.subplots(figsize=(9, 4))
    for term, color in [("<bird --> flyer>", "#1f77b4"),
                        ("<penguin --> flyer>", "#d62728")]:
        fs, cs, cyc = [], [], []
        for snap in log["snapshots"]:
            beliefs = snap["terms"].get(term, [])
            if beliefs:
                b = sorted(beliefs, key=lambda b: -b["confidence"])[0]
                fs.append(b["frequency"]); cs.append(b["confidence"])
                cyc.append(snap["cycle"])
        ax.plot(cyc, fs, label=f"f: {term}", color=color, linewidth=2)
        ax.plot(cyc, cs, label=f"c: {term}", color=color, linewidth=1,
                linestyle="--")
    ax.set_title("C2 — NARS keeps general and specific contradictory "
                 "beliefs side-by-side")
    ax.set_xlabel("cycle"); ax.set_ylabel("truth value")
    ax.legend(fontsize=8)
    ax.set_ylim(-0.05, 1.05); ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(PLOT / "_overview_penguin.png", dpi=130, bbox_inches="tight")
    plt.close()

print("Overview plots written.")
