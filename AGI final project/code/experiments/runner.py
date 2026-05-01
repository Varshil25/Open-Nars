"""
Experiment runner for NARS contradiction scenarios.

Drives a NARS reasoner through each scenario, recording per-cycle snapshots of
tracked terms' belief tables. Output: one JSON log per scenario in logs/.
"""

import json
import os
import sys
import time
import warnings
from pathlib import Path

warnings.filterwarnings("ignore")

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT / "experiments"))

from scenarios import ALL_SCENARIOS, Scenario  # noqa: E402

# PyNARS / OpenNARS-4
from pynars.NARS import Reasoner  # noqa: E402
from pynars.Narsese import parser  # noqa: E402


LOG_DIR = PROJECT_ROOT / "logs"
LOG_DIR.mkdir(exist_ok=True)


def parse_term(narsese_term: str):
    """Parse a '<x --> y>' style string into a pynars Term."""
    t = parser.parse(narsese_term + ".").term
    return t


def belief_snapshot(nars: Reasoner, term_str: str):
    """Return a list of (frequency, confidence, priority) triples for the
    current beliefs on `term_str`. Empty list if the concept does not exist."""
    try:
        term = parse_term(term_str)
    except Exception as e:
        return [{"error": f"parse failed: {e}"}]

    concept = nars.memory.take_by_key(term, remove=False)
    if concept is None or concept.belief_table is None:
        return []
    beliefs = []
    for b in list(concept.belief_table):
        tv = getattr(b, "truth", None)
        stamp = getattr(b, "stamp", None)
        beliefs.append({
            "frequency": float(tv.f) if tv is not None else None,
            "confidence": float(tv.c) if tv is not None else None,
            "expectation": float(tv.e) if tv is not None else None,
            "evidential_base": str(getattr(stamp, "evidential_base", None)) if stamp is not None else None,
        })
    return beliefs


def run_scenario(scenario: Scenario, memory_cap: int = 100, buffer_cap: int = 100) -> dict:
    """Run one scenario and return a log dict."""
    nars = Reasoner(memory_cap, buffer_cap)

    log = {
        "scenario": scenario.name,
        "category": scenario.category,
        "description": scenario.description,
        "steps": [],
        "snapshots": [],
        "final": {},
        "wall_time_seconds": None,
    }

    t_start = time.perf_counter()
    cycle_counter = 0

    def snapshot():
        snap = {"cycle": cycle_counter, "terms": {}}
        for t in scenario.track_terms:
            snap["terms"][t] = belief_snapshot(nars, t)
        log["snapshots"].append(snap)

    snapshot()  # t=0 baseline

    for i, step in enumerate(scenario.steps):
        step_log = {"index": i, "kind": step.kind, "narsese": step.narsese,
                    "note": step.note, "cycle_before": cycle_counter}
        if step.kind == "input":
            try:
                nars.input_narsese(step.narsese, go_cycle=False)
            except Exception as e:
                step_log["error"] = str(e)
        log["steps"].append(step_log)

        # Cycle and sample
        for _ in range(step.cycles_after):
            try:
                nars.cycle()
            except Exception as e:
                step_log.setdefault("cycle_errors", []).append(str(e))
            cycle_counter += 1
            if cycle_counter % scenario.sample_every == 0:
                snapshot()

    # Pad to cycles_total if not yet there
    remaining = max(0, scenario.cycles_total - cycle_counter)
    for _ in range(remaining):
        try:
            nars.cycle()
        except Exception:
            pass
        cycle_counter += 1
        if cycle_counter % scenario.sample_every == 0:
            snapshot()

    # Final state
    log["final"] = {t: belief_snapshot(nars, t) for t in scenario.track_terms}
    log["wall_time_seconds"] = time.perf_counter() - t_start
    log["cycles_run"] = cycle_counter
    return log


def main(only: str = None):
    results = []
    for scen in ALL_SCENARIOS:
        if only and scen.name != only:
            continue
        print(f"Running {scen.name} ({scen.category})...", flush=True)
        log = run_scenario(scen)
        out_path = LOG_DIR / f"{scen.name}.json"
        with open(out_path, "w") as f:
            json.dump(log, f, indent=2, default=str)
        print(f"  -> {out_path.name}  cycles={log['cycles_run']}  "
              f"time={log['wall_time_seconds']:.2f}s  "
              f"snapshots={len(log['snapshots'])}", flush=True)
        results.append((scen.name, log))
    return results


if __name__ == "__main__":
    only = sys.argv[1] if len(sys.argv) > 1 else None
    main(only)
