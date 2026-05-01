"""
Contradiction scenarios for NARS belief revision experiments.

Each scenario is a sequence of Narsese inputs designed to introduce contradictions
of varying complexity and probe the system's belief revision behavior.

These scenarios are portable — they run on Java OpenNARS, OpenNARS-4 (Python),
and ONA without modification, since they use core NAL-1 through NAL-5 syntax.
"""

from dataclasses import dataclass, field
from typing import List, Tuple, Optional


@dataclass
class Step:
    """A single step in a scenario. Either an input or a query."""
    kind: str  # 'input' or 'query'
    narsese: str
    cycles_after: int = 0  # cycles to run after this step
    note: str = ""


@dataclass
class Scenario:
    name: str
    category: str  # 'simple' | 'inference_chain' | 'temporal'
    description: str
    steps: List[Step] = field(default_factory=list)
    # Terms to track in logs (their belief tables are recorded every `sample_every` cycles)
    track_terms: List[str] = field(default_factory=list)
    cycles_total: int = 100
    sample_every: int = 1


# ----------------------------------------------------------------------------
# CATEGORY 1: Simple direct contradictions (NAL-1 / NAL-2)
# ----------------------------------------------------------------------------

SIMPLE_SCENARIOS: List[Scenario] = [
    Scenario(
        name="S1_direct_negation",
        category="simple",
        description=(
            "The simplest possible contradiction: assert a belief with high "
            "frequency, then its direct negation. Tests the revision formula in "
            "isolation. Expectation (NAL): frequency collapses toward 0.5, "
            "confidence increases because evidence accumulates."
        ),
        steps=[
            Step("input", "<bird --> flyer>. %1.0;0.9%", 10, "strong positive"),
            Step("input", "<bird --> flyer>. %0.0;0.9%", 10, "strong negative"),
        ],
        track_terms=["<bird --> flyer>"],
        cycles_total=50,
    ),
    Scenario(
        name="S2_asymmetric_strength",
        category="simple",
        description=(
            "Strong evidence for, then weaker evidence against. Tests whether "
            "NARS correctly weights contradictions by confidence."
        ),
        steps=[
            Step("input", "<bird --> flyer>. %1.0;0.9%", 10, "very strong positive"),
            Step("input", "<bird --> flyer>. %0.0;0.5%", 10, "weak negative"),
        ],
        track_terms=["<bird --> flyer>"],
        cycles_total=50,
    ),
    Scenario(
        name="S3_graded_contradiction",
        category="simple",
        description=(
            "Five observations of varying frequency on the same statement. "
            "Mimics real-world noisy evidence rather than pure contradiction."
        ),
        steps=[
            Step("input", "<swan --> white>. %1.0;0.9%", 5),
            Step("input", "<swan --> white>. %1.0;0.9%", 5),
            Step("input", "<swan --> white>. %1.0;0.9%", 5),
            Step("input", "<swan --> white>. %0.0;0.9%", 5, "black swan"),
            Step("input", "<swan --> white>. %1.0;0.9%", 5),
        ],
        track_terms=["<swan --> white>"],
        cycles_total=60,
    ),
    Scenario(
        name="S4_repeated_contradiction",
        category="simple",
        description=(
            "Alternating contradictions. Each contradiction adds evidence even "
            "though frequency stays balanced. Measures confidence growth rate "
            "relative to theoretical w+ / (w+ + k) formula."
        ),
        steps=[
            Step("input", "<X --> P>. %1.0;0.9%", 3) for _ in range(1)
        ] + sum(
            [[Step("input", "<X --> P>. %0.0;0.9%", 3),
              Step("input", "<X --> P>. %1.0;0.9%", 3)] for _ in range(4)],
            []
        ),
        track_terms=["<X --> P>"],
        cycles_total=80,
    ),
]


# ----------------------------------------------------------------------------
# CATEGORY 2: Inference-chain stability (NAL-1 deduction/induction/abduction)
# ----------------------------------------------------------------------------

CHAIN_SCENARIOS: List[Scenario] = [
    Scenario(
        name="C1_deduction_chain_contradicted",
        category="inference_chain",
        description=(
            "A --> B and B --> C produce A --> C by deduction. Then contradict "
            "B --> C and watch whether the derived A --> C is revised."
        ),
        steps=[
            Step("input", "<robin --> bird>. %1.0;0.9%", 5),
            Step("input", "<bird --> animal>. %1.0;0.9%", 20, "deduction should fire"),
            Step("input", "<bird --> animal>. %0.0;0.9%", 20, "contradict the middle link"),
        ],
        track_terms=["<robin --> animal>", "<bird --> animal>"],
        cycles_total=60,
    ),
    Scenario(
        name="C2_conflicting_rules",
        category="inference_chain",
        description=(
            "Two competing general rules applied to the same subject. "
            "Tests how NARS composes contradictory general beliefs."
        ),
        steps=[
            Step("input", "<bird --> flyer>. %1.0;0.9%", 5, "birds fly"),
            Step("input", "<penguin --> bird>. %1.0;0.9%", 10, "penguins are birds"),
            Step("input", "<penguin --> flyer>. %0.0;0.9%", 20, "penguins don't fly"),
        ],
        track_terms=["<penguin --> flyer>", "<bird --> flyer>"],
        cycles_total=60,
    ),
    Scenario(
        name="C3_cascade_contradiction",
        category="inference_chain",
        description=(
            "Four-link chain then contradict an early link. "
            "Measures how far downstream the contradiction propagates."
        ),
        steps=[
            Step("input", "<a --> b>. %1.0;0.9%", 3),
            Step("input", "<b --> c>. %1.0;0.9%", 3),
            Step("input", "<c --> d>. %1.0;0.9%", 3),
            Step("input", "<d --> e>. %1.0;0.9%", 30, "deductions fire"),
            Step("input", "<b --> c>. %0.0;0.9%", 30, "contradict mid-link"),
        ],
        track_terms=[
            "<a --> c>", "<a --> d>", "<a --> e>",
            "<b --> d>", "<b --> e>", "<c --> e>",
        ],
        cycles_total=80,
    ),
]


# ----------------------------------------------------------------------------
# CATEGORY 3: Temporal / ordering effects
# ----------------------------------------------------------------------------

TEMPORAL_SCENARIOS: List[Scenario] = [
    Scenario(
        name="T1_recent_vs_old_equal",
        category="temporal",
        description=(
            "Identical strength contradictions at widely separated times. "
            "NAL revision is commutative in principle; this verifies that."
        ),
        steps=[
            Step("input", "<market --> rising>. %1.0;0.9%", 50, "early evidence, long gap"),
            Step("input", "<market --> rising>. %0.0;0.9%", 20, "recent reversal"),
        ],
        track_terms=["<market --> rising>"],
        cycles_total=80,
    ),
    Scenario(
        name="T2_reverse_order",
        category="temporal",
        description=(
            "The same two beliefs delivered in reversed order. "
            "If NAL revision is truly order-invariant, end state must match T1."
        ),
        steps=[
            Step("input", "<market --> rising>. %0.0;0.9%", 50, "early negative"),
            Step("input", "<market --> rising>. %1.0;0.9%", 20, "recent positive"),
        ],
        track_terms=["<market --> rising>"],
        cycles_total=80,
    ),
    Scenario(
        name="T3_weight_erosion",
        category="temporal",
        description=(
            "Eight positive observations then four contradictory ones. "
            "Records how quickly recent contradictions erode an entrenched belief."
        ),
        steps=[
            *[Step("input", "<coin --> fair>. %1.0;0.9%", 4) for _ in range(8)],
            *[Step("input", "<coin --> fair>. %0.0;0.9%", 4) for _ in range(4)],
        ],
        track_terms=["<coin --> fair>"],
        cycles_total=120,
    ),
]


ALL_SCENARIOS: List[Scenario] = SIMPLE_SCENARIOS + CHAIN_SCENARIOS + TEMPORAL_SCENARIOS


if __name__ == "__main__":
    for s in ALL_SCENARIOS:
        print(f"[{s.category}] {s.name}: {len(s.steps)} steps, tracking {s.track_terms}")
