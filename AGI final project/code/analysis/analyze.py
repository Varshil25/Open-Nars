"""
Analysis pipeline for NARS contradiction experiments.

Reads logs/*.json, computes per-scenario metrics, compares against the
theoretical NAL revision formula and an AGM-style baseline, emits plots and
a summary CSV.

NAL revision (Wang 2013) for two beliefs (f1, c1), (f2, c2) on the same
statement:
    w+_i = c_i * f_i / (1 - c_i)        # positive evidence count (k=1)
    w-_i = c_i * (1 - f_i) / (1 - c_i)  # negative evidence count
    w_i = w+_i + w-_i
    w+  = w+_1 + w+_2
    w-  = w-_1 + w-_2
    w   = w+ + w-
    f   = w+ / w
    c   = w / (w + 1)

This is the derivation from NAL's truth-value semantics.
"""

import json
import math
import os
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parent.parent
LOG_DIR = PROJECT_ROOT / "logs"
PLOT_DIR = PROJECT_ROOT / "plots"
ANALYSIS_DIR = PROJECT_ROOT / "analysis"
PLOT_DIR.mkdir(exist_ok=True)


# ---------- NAL truth-value helpers ---------------------------------------

def c_to_w(c: float) -> float:
    if c >= 1.0:
        return float("inf")
    return c / (1.0 - c)


def w_to_c(w: float) -> float:
    return w / (w + 1.0)


def nal_revision(tv1, tv2):
    """Classic NAL revision (Wang 2013, Ch. 4)."""
    f1, c1 = tv1; f2, c2 = tv2
    w1 = c_to_w(c1); w2 = c_to_w(c2)
    wp1 = w1 * f1; wm1 = w1 * (1 - f1)
    wp2 = w2 * f2; wm2 = w2 * (1 - f2)
    w = w1 + w2
    if w == 0:
        return (0.5, 0.0)
    f = (wp1 + wp2) / w
    return (f, w_to_c(w))


def agm_revision(tv1, tv2):
    """A crude AGM-inspired baseline: the later belief fully replaces the earlier
    one on the same sentence (priority-based revision, Levi identity simplified).
    Kept simple on purpose to contrast with NAL's graded revision."""
    return tv2


# ---------- Metrics -------------------------------------------------------

def summarize_tracked_term(snapshots, term):
    """Return a DataFrame with per-cycle highest-priority belief for `term`."""
    rows = []
    for snap in snapshots:
        beliefs = snap["terms"].get(term, [])
        if not beliefs:
            rows.append({"cycle": snap["cycle"],
                         "frequency": None, "confidence": None,
                         "expectation": None, "n_beliefs": 0})
            continue
        # pick the revised belief if one exists (highest confidence usually);
        # we sort by confidence desc for a stable ordering.
        b_sorted = sorted(
            [b for b in beliefs if b.get("frequency") is not None],
            key=lambda b: -b["confidence"],
        )
        top = b_sorted[0] if b_sorted else beliefs[0]
        rows.append({
            "cycle": snap["cycle"],
            "frequency": top.get("frequency"),
            "confidence": top.get("confidence"),
            "expectation": top.get("expectation"),
            "n_beliefs": len(beliefs),
        })
    return pd.DataFrame(rows)


def theoretical_trajectory_for_scenario(log):
    """For a scenario whose steps are only `input` on a single tracked term,
    compute the NAL-theoretical trajectory as inputs arrive in order."""
    terms = set()
    for step in log["steps"]:
        if step["kind"] == "input":
            s = step["narsese"]
            # parse frequency/confidence
            if "%" in s:
                before, _, after = s.partition("%")
                f_str, _, c_str = after.strip().strip("%").partition(";")
                try:
                    f = float(f_str); c = float(c_str.strip("%"))
                except ValueError:
                    continue
                term = before.split(".")[0].strip()
                terms.add(term)
    result = {}
    for term in terms:
        tv = None
        trajectory = []
        for step in log["steps"]:
            s = step["narsese"]
            if term not in s or "%" not in s:
                continue
            before, _, after = s.partition("%")
            f_str, _, c_str = after.strip().strip("%").partition(";")
            try:
                f = float(f_str); c = float(c_str.strip("%"))
            except ValueError:
                continue
            if tv is None:
                tv = (f, c)
            else:
                tv = nal_revision(tv, (f, c))
            trajectory.append({"step_index": step["index"], "f": tv[0], "c": tv[1]})
        result[term] = trajectory
    return result


# ---------- Plotting ------------------------------------------------------

def plot_scenario(log, out_path):
    terms = list(log["final"].keys())
    n = len(terms)
    fig, axes = plt.subplots(n, 1, figsize=(9, 3.0 * n), squeeze=False)
    for i, term in enumerate(terms):
        df = summarize_tracked_term(log["snapshots"], term)
        ax = axes[i, 0]
        ax2 = ax.twinx()
        ax.plot(df["cycle"], df["frequency"], label="frequency f",
                color="#1f77b4", linewidth=2)
        ax2.plot(df["cycle"], df["confidence"], label="confidence c",
                 color="#d62728", linewidth=2, linestyle="--")
        # Mark input steps
        cyc = 0
        for step in log["steps"]:
            cyc_after = cyc + 0  # already baked in
            if step["kind"] == "input":
                ax.axvline(step.get("cycle_before", 0), color="gray",
                           linewidth=0.6, alpha=0.6)
        ax.set_ylim(-0.05, 1.05)
        ax2.set_ylim(-0.05, 1.05)
        ax.set_xlabel("cycle")
        ax.set_ylabel("frequency f", color="#1f77b4")
        ax2.set_ylabel("confidence c", color="#d62728")
        ax.set_title(f"{log['scenario']} — {term}")
        ax.grid(True, alpha=0.25)
    plt.tight_layout()
    plt.savefig(out_path, dpi=130, bbox_inches="tight")
    plt.close()


def plot_nal_vs_empirical(log, out_path):
    """Overlay empirical trajectory with theoretical NAL revision."""
    theo = theoretical_trajectory_for_scenario(log)
    if not theo:
        return False
    term, traj = next(iter(theo.items()))
    emp_df = summarize_tracked_term(log["snapshots"], term)
    if emp_df["frequency"].dropna().empty:
        return False
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 3.5))
    ax1.plot(emp_df["cycle"], emp_df["frequency"], "-", label="empirical f",
             color="#1f77b4", linewidth=2)
    for t in traj:
        ax1.axhline(t["f"], color="black", linewidth=0.6, alpha=0.5,
                    linestyle=":")
    ax1.set_title(f"{log['scenario']} — frequency")
    ax1.set_xlabel("cycle"); ax1.set_ylabel("frequency f")
    ax1.legend()
    ax1.set_ylim(-0.05, 1.05)
    ax1.grid(True, alpha=0.25)

    ax2.plot(emp_df["cycle"], emp_df["confidence"], "-", label="empirical c",
             color="#d62728", linewidth=2)
    for t in traj:
        ax2.axhline(t["c"], color="black", linewidth=0.6, alpha=0.5,
                    linestyle=":")
    ax2.set_title(f"{log['scenario']} — confidence")
    ax2.set_xlabel("cycle"); ax2.set_ylabel("confidence c")
    ax2.legend()
    ax2.set_ylim(-0.05, 1.05)
    ax2.grid(True, alpha=0.25)
    plt.tight_layout()
    plt.savefig(out_path, dpi=130, bbox_inches="tight")
    plt.close()
    return True


# ---------- Main ----------------------------------------------------------

def main():
    summary_rows = []
    for log_path in sorted(LOG_DIR.glob("*.json")):
        with open(log_path) as f:
            log = json.load(f)

        # Per-scenario plots
        plot_scenario(log, PLOT_DIR / f"{log['scenario']}.png")
        plot_nal_vs_empirical(log, PLOT_DIR / f"{log['scenario']}_vs_theory.png")

        # Summary
        for term, beliefs in log["final"].items():
            if beliefs:
                bs = sorted([b for b in beliefs if b.get("confidence") is not None],
                            key=lambda b: -b["confidence"])
                top = bs[0] if bs else beliefs[0]
                summary_rows.append({
                    "scenario": log["scenario"],
                    "category": log["category"],
                    "term": term,
                    "final_f": top.get("frequency"),
                    "final_c": top.get("confidence"),
                    "final_e": top.get("expectation"),
                    "n_beliefs": len(beliefs),
                    "cycles": log.get("cycles_run"),
                })
            else:
                summary_rows.append({
                    "scenario": log["scenario"],
                    "category": log["category"],
                    "term": term,
                    "final_f": None, "final_c": None, "final_e": None,
                    "n_beliefs": 0,
                    "cycles": log.get("cycles_run"),
                })

        # Theoretical prediction vs empirical final
        theo = theoretical_trajectory_for_scenario(log)
        for term, traj in theo.items():
            if not traj:
                continue
            pred = traj[-1]
            emp = None
            for row in summary_rows:
                if row["scenario"] == log["scenario"] and row["term"] == term:
                    emp = row
                    break
            if emp and emp["final_f"] is not None:
                emp["theory_f"] = pred["f"]
                emp["theory_c"] = pred["c"]
                emp["df"] = emp["final_f"] - pred["f"]
                emp["dc"] = emp["final_c"] - pred["c"]

    df = pd.DataFrame(summary_rows)
    df.to_csv(ANALYSIS_DIR / "summary.csv", index=False)
    print(df.to_string(index=False))
    return df


if __name__ == "__main__":
    main()
