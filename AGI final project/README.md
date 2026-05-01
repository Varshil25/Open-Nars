# NARS Contradiction Handling — Project Code

Complete reproducible pipeline for the AGI course project
**"Handling Contradictory Knowledge in NARS: An Analysis of Belief Revision and Confidence Dynamics."**

## Quick start

```bash
# 1. Install Python dependencies
pip install matplotlib pandas
pip install git+https://github.com/opennars/OpenNARS-4.git   # NARS reference implementation

# 2. Run the full pipeline
python3 experiments/runner.py           # -> logs/*.json  (runs in ~1 second)
python3 analysis/analyze.py             # -> plots/*.png  + analysis/summary.csv
python3 analysis/overview_plot.py       # -> plots/_overview_*.png

# 3. (Re)generate the report and slides
cd report
npm install docx pptxgenjs
node build_report.js                    # -> NARS_Project_Report.docx
node build_slides.js                    # -> NARS_Project_Slides.pptx
```

## Layout

```
code/
├── experiments/
│   ├── scenarios.py                # 10 contradiction scenarios in Narsese
│   └── runner.py                   # drives OpenNARS-4, writes per-cycle logs
├── analysis/
│   ├── analyze.py                  # NAL revision theory vs empirical, per-scenario plots
│   ├── overview_plot.py            # cross-scenario summary plots
│   └── summary.csv                 # final-state table across all scenarios
├── logs/                           # raw per-cycle belief tables (10 JSON files)
├── plots/                          # 20 PNG figures referenced by the report
└── report/
    ├── build_report.js             # docx-js report generator
    └── build_slides.js             # pptxgenjs presentation generator
```

## Running on Java OpenNARS

All scenarios in `experiments/scenarios.py` are written in standard Narsese and run
unmodified against Java OpenNARS, ONA (OpenNARS for Applications), and PyNARS /
OpenNARS-4. To port:

```bash
# From the opennars repo after `mvn clean install`:
for scen in S1 S2 S3 S4 C1 C2 C3 T1 T2 T3; do
    mvn exec:java -Dexec.args="examples/${scen}.nal"
done
```

Write the `.nal` files by extracting the `narsese` field from each `Step` in
`scenarios.py`. One `.nal` per scenario, one Narsese sentence per line.

## Team roles (from project plan)

- Shiven Patel — Technical lead (OpenNARS setup, data tooling, confidence analysis)
- Omkar Brahmbhatt — Research lead (literature, inference chains, result synthesis)
- Varshil Patel — Theory lead (AGM/non-monotonic, metrics, temporal experiments)
