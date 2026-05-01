// Presentation generator for NARS project.
// Palette: Midnight Executive (navy, ice blue, white) + coral accent for highlights.

const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

const PROJECT = "/sessions/friendly-gifted-sagan/nars_project";
const OUT = "/sessions/friendly-gifted-sagan/mnt/AGI final project/NARS_Project_Slides.pptx";
const PLOT = path.join(PROJECT, "plots");

const NAVY = "1E2761";
const NAVY_DARK = "121642";
const ICE = "CADCFC";
const WHITE = "FFFFFF";
const CORAL = "F96167";
const MUTED = "7A849A";
const TEXT_DARK = "1E1E2A";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";  // 13.3 x 7.5
pres.author = "NARS AGI Project Team";
pres.title = "Handling Contradictory Knowledge in NARS";

const W = 13.3, H = 7.5;

function sidebar(slide) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.35, h: H,
    fill: { color: CORAL }, line: { color: CORAL, width: 0 },
  });
}

function footer(slide, num) {
  slide.addText("NARS · Contradiction Handling · AGI Course Project 2026", {
    x: 0.55, y: H - 0.35, w: 10, h: 0.25, fontSize: 9, fontFace: "Calibri",
    color: MUTED, margin: 0,
  });
  slide.addText(`${num}`, {
    x: W - 0.9, y: H - 0.35, w: 0.5, h: 0.25, fontSize: 9, fontFace: "Calibri",
    color: MUTED, align: "right", margin: 0,
  });
}

function slideTitle(slide, text) {
  slide.addText(text, {
    x: 0.55, y: 0.35, w: W - 1.1, h: 0.7, fontSize: 28, bold: true,
    fontFace: "Georgia", color: NAVY, margin: 0,
  });
  slide.addShape(pres.shapes.LINE, {
    x: 0.55, y: 1.05, w: 1.6, h: 0,
    line: { color: CORAL, width: 3 },
  });
}

// ---------- Slide 1: Title ----------
{
  const s = pres.addSlide();
  s.background = { color: NAVY_DARK };
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.15,
    fill: { color: CORAL }, line: { color: CORAL, width: 0 },
  });
  s.addText("HANDLING CONTRADICTORY KNOWLEDGE IN NARS", {
    x: 0.8, y: 2.4, w: W - 1.6, h: 1.0, fontSize: 44, bold: true,
    fontFace: "Georgia", color: WHITE, margin: 0, charSpacing: 2,
  });
  s.addText("An analysis of belief revision and confidence dynamics", {
    x: 0.8, y: 3.45, w: W - 1.6, h: 0.6, fontSize: 22, italic: true,
    fontFace: "Calibri", color: ICE, margin: 0,
  });
  s.addShape(pres.shapes.LINE, {
    x: 0.8, y: 4.4, w: 1.8, h: 0,
    line: { color: CORAL, width: 3 },
  });
  s.addText("Shiven Patel  ·  Omkar Brahmbhatt  ·  Varshil Patel", {
    x: 0.8, y: 5.7, w: W - 1.6, h: 0.4, fontSize: 16,
    fontFace: "Calibri", color: WHITE, margin: 0,
  });
  s.addText("AGI Course · April 2026", {
    x: 0.8, y: 6.2, w: W - 1.6, h: 0.35, fontSize: 13,
    fontFace: "Calibri", color: MUTED, margin: 0, italic: true,
  });
}

// ---------- Slide 2: The question ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  sidebar(s);
  slideTitle(s, "The question");

  s.addText([
    { text: "Classical logic:", options: { bold: true, color: NAVY, fontSize: 18 } },
    { text: " one contradiction → explosion (anything derivable).", options: { color: TEXT_DARK, fontSize: 18, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "Real intelligence:", options: { bold: true, color: NAVY, fontSize: 18 } },
    { text: " tolerates contradictions, revises gracefully, keeps inferring.", options: { color: TEXT_DARK, fontSize: 18, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "NARS claims to do this via a graded truth-value system ⟨f, c⟩ and a revision formula rooted in evidence-counting.", options: { color: TEXT_DARK, fontSize: 18, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "Does it? And how does it deviate from the theoretical ideal under AIKR?", options: { italic: true, color: CORAL, fontSize: 20, bold: true } },
  ], { x: 0.9, y: 1.6, w: 7.6, h: 5, fontFace: "Calibri", margin: 0, paraSpaceAfter: 6 });

  // Big callout card on the right
  s.addShape(pres.shapes.RECTANGLE, {
    x: 9.0, y: 1.7, w: 3.6, h: 4.4,
    fill: { color: NAVY }, line: { color: NAVY, width: 0 },
  });
  s.addText("⟨f, c⟩", {
    x: 9.0, y: 2.4, w: 3.6, h: 1.6, fontSize: 72, bold: true,
    fontFace: "Georgia", color: WHITE, align: "center", margin: 0,
  });
  s.addText([
    { text: "frequency", options: { color: ICE, fontSize: 16, bold: true, breakLine: true } },
    { text: "f = positive / total evidence", options: { color: WHITE, fontSize: 13, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "confidence", options: { color: ICE, fontSize: 16, bold: true, breakLine: true } },
    { text: "c = w / (w + 1)", options: { color: WHITE, fontSize: 13 } },
  ], { x: 9.2, y: 4.2, w: 3.2, h: 1.8, fontFace: "Calibri", align: "center", margin: 0 });

  footer(s, 2);
}

// ---------- Slide 3: NAL revision formula ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  sidebar(s);
  slideTitle(s, "How NARS combines contradictory evidence");

  // Formula card
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.9, y: 1.5, w: 11.5, h: 2.8,
    fill: { color: "F6F7FB" }, line: { color: ICE, width: 1 },
  });
  s.addText("NAL revision (Wang 2013, Ch. 4)", {
    x: 1.1, y: 1.6, w: 11, h: 0.4, fontSize: 14, bold: true,
    fontFace: "Calibri", color: NAVY, margin: 0,
  });
  s.addText([
    { text: "w", options: { fontSize: 22 } },
    { text: "+", options: { fontSize: 14, superscript: true } },
    { text: " = c₁·f₁/(1−c₁) + c₂·f₂/(1−c₂)", options: { fontSize: 22, breakLine: true } },
    { text: "w", options: { fontSize: 22 } },
    { text: "−", options: { fontSize: 14, superscript: true } },
    { text: " = c₁·(1−f₁)/(1−c₁) + c₂·(1−f₂)/(1−c₂)", options: { fontSize: 22, breakLine: true } },
    { text: "w = w", options: { fontSize: 22 } },
    { text: "+", options: { fontSize: 14, superscript: true } },
    { text: " + w", options: { fontSize: 22 } },
    { text: "−", options: { fontSize: 14, superscript: true } },
    { text: "    ·    f = w", options: { fontSize: 22 } },
    { text: "+", options: { fontSize: 14, superscript: true } },
    { text: " / w    ·    c = w / (w + 1)", options: { fontSize: 22 } },
  ], { x: 1.2, y: 2.2, w: 11, h: 2, fontFace: "Courier New", color: TEXT_DARK,
       align: "left", margin: 0, paraSpaceAfter: 4 });

  // Three property boxes
  const props = [
    ["Order-invariant", "Combining ⟨f₁, c₁⟩ then ⟨f₂, c₂⟩ gives the same result as the reverse."],
    ["Confidence non-decreasing", "Every independent observation adds evidence. c never goes down."],
    ["Preserves inconsistency", "Different beliefs with disjoint evidence can coexist in memory."],
  ];
  const bw = 3.7, bh = 2.3, gap = 0.35;
  const startX = (W - 3 * bw - 2 * gap) / 2;
  props.forEach(([h, b], i) => {
    const x = startX + i * (bw + gap);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 4.7, w: bw, h: bh, fill: { color: NAVY }, line: { color: NAVY, width: 0 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 4.7, w: 0.08, h: bh, fill: { color: CORAL }, line: { color: CORAL, width: 0 },
    });
    s.addText(h, { x: x + 0.25, y: 4.85, w: bw - 0.35, h: 0.5, fontSize: 16, bold: true,
                   fontFace: "Calibri", color: WHITE, margin: 0 });
    s.addText(b, { x: x + 0.25, y: 5.4, w: bw - 0.35, h: 1.5, fontSize: 13,
                   fontFace: "Calibri", color: ICE, margin: 0 });
  });

  footer(s, 3);
}

// ---------- Slide 4: Methodology ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  sidebar(s);
  slideTitle(s, "Experimental design");

  s.addText("10 scenarios across 3 families, all in standard Narsese (portable to Java OpenNARS and ONA)", {
    x: 0.9, y: 1.3, w: 11.8, h: 0.45, fontSize: 14, italic: true,
    fontFace: "Calibri", color: MUTED, margin: 0,
  });

  const families = [
    { t: "Simple", count: "4 scenarios", desc: "Direct contradictions on a single statement — isolate the revision formula.",
      ex: "S1: ⟨1.0, 0.9⟩ then ⟨0.0, 0.9⟩\nS3: 4 positive + 1 negative\nS4: alternating contradictions" },
    { t: "Inference chain", count: "3 scenarios", desc: "Contradiction affects a premise in a deduction chain.",
      ex: "C1: deduce, then contradict middle link\nC2: the penguin problem\nC3: 4-link chain" },
    { t: "Temporal", count: "3 scenarios", desc: "Probe order effects and recent-vs-old evidence.",
      ex: "T1 vs T2: reversed order\nT3: 8 positive then 4 negative" },
  ];
  const cw = 3.9, ch = 4.5, cgap = 0.25;
  const cstart = (W - 3 * cw - 2 * cgap) / 2;
  families.forEach((f, i) => {
    const x = cstart + i * (cw + cgap);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.95, w: cw, h: ch, fill: { color: "F6F7FB" },
      line: { color: ICE, width: 1 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.95, w: cw, h: 0.7, fill: { color: NAVY }, line: { color: NAVY, width: 0 },
    });
    s.addText(f.t, { x: x + 0.25, y: 2.05, w: cw - 0.5, h: 0.5, fontSize: 18,
                     bold: true, fontFace: "Calibri", color: WHITE, margin: 0 });
    s.addText(f.count, { x: x + 0.25, y: 2.75, w: cw - 0.5, h: 0.3, fontSize: 11,
                         italic: true, fontFace: "Calibri", color: CORAL, margin: 0 });
    s.addText(f.desc, { x: x + 0.25, y: 3.15, w: cw - 0.5, h: 1.3, fontSize: 13,
                        fontFace: "Calibri", color: TEXT_DARK, margin: 0 });
    s.addText("Examples:", { x: x + 0.25, y: 4.45, w: cw - 0.5, h: 0.3, fontSize: 12,
                             bold: true, fontFace: "Calibri", color: NAVY, margin: 0 });
    s.addText(f.ex, { x: x + 0.25, y: 4.75, w: cw - 0.5, h: 1.6, fontSize: 11,
                      fontFace: "Courier New", color: TEXT_DARK, margin: 0 });
  });

  footer(s, 4);
}

// ---------- Slide 5: Direct contradictions ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  sidebar(s);
  slideTitle(s, "Result 1 — Two-input revisions match theory exactly");

  s.addImage({
    path: path.join(PLOT, "S1_direct_negation_vs_theory.png"),
    x: 0.9, y: 1.5, w: 8.2, h: 2.9,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 9.4, y: 1.5, w: 3.3, h: 2.9, fill: { color: NAVY }, line: { color: NAVY, width: 0 },
  });
  s.addText("f → 0.500", {
    x: 9.5, y: 1.7, w: 3.2, h: 0.6, fontSize: 28, bold: true,
    fontFace: "Georgia", color: WHITE, align: "center", margin: 0,
  });
  s.addText("c → 0.947", {
    x: 9.5, y: 2.3, w: 3.2, h: 0.6, fontSize: 28, bold: true,
    fontFace: "Georgia", color: CORAL, align: "center", margin: 0,
  });
  s.addText("Match to 4 decimal places vs the closed-form formula.",
    { x: 9.5, y: 3.1, w: 3.2, h: 1.2, fontSize: 13, italic: true,
      fontFace: "Calibri", color: ICE, align: "center", margin: 0 });

  s.addText([
    { text: "Two equally-strong contradictory beliefs ", options: { fontSize: 14 } },
    { text: "⟨1.0, 0.9⟩ and ⟨0.0, 0.9⟩", options: { fontSize: 14, bold: true } },
    { text: " merge to maximum uncertainty in frequency (f=0.5) while ", options: { fontSize: 14 } },
    { text: "confidence INCREASES to 0.947", options: { fontSize: 14, bold: true, color: CORAL } },
    { text: " because the evidence base doubled. This is exactly what Wang 2013 predicts — and T1 vs T2 confirm order invariance: identical final state regardless of input order.", options: { fontSize: 14 } },
  ], { x: 0.9, y: 4.65, w: 11.8, h: 2.2, fontFace: "Calibri",
       color: TEXT_DARK, margin: 0 });

  footer(s, 5);
}

// ---------- Slide 6: Path-dependent revision (key finding) ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  sidebar(s);
  slideTitle(s, "Result 2 — Multi-input revision is path-dependent under AIKR");

  s.addImage({
    path: path.join(PLOT, "_overview_freq.png"),
    x: 0.9, y: 1.4, w: 8.5, h: 3.6,
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 9.7, y: 1.4, w: 3.1, h: 3.6, fill: { color: "FEEFEF" },
    line: { color: CORAL, width: 1 },
  });
  s.addText("Key finding", {
    x: 9.85, y: 1.55, w: 2.9, h: 0.4, fontSize: 15, bold: true,
    fontFace: "Calibri", color: CORAL, margin: 0,
  });
  s.addText("Empirical ≠ theoretical whenever 3+ revisable beliefs exist on the same term.",
    { x: 9.85, y: 2.0, w: 2.9, h: 1.3, fontSize: 12,
      fontFace: "Calibri", color: TEXT_DARK, margin: 0 });
  s.addText("Why?",
    { x: 9.85, y: 3.2, w: 2.9, h: 0.35, fontSize: 13, bold: true,
      fontFace: "Calibri", color: NAVY, margin: 0 });
  s.addText("Revision only applies to pairs the control loop picks. Under AIKR, some pairs are never selected.",
    { x: 9.85, y: 3.55, w: 2.9, h: 1.5, fontSize: 12,
      fontFace: "Calibri", color: TEXT_DARK, margin: 0 });

  s.addText("S3 evidence: 4 positive merged into Base{2014, 2020, 2026, 2038}, negative (Base{2032}) never folded in → final f = 1.0, not theoretical 0.8.", {
    x: 0.9, y: 5.25, w: 11.8, h: 1.6, fontSize: 14, italic: true,
    fontFace: "Calibri", color: TEXT_DARK, margin: 0,
  });

  footer(s, 6);
}

// ---------- Slide 7: Penguin problem ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  sidebar(s);
  slideTitle(s, "Result 3 — Graceful coexistence of general and specific");

  s.addImage({
    path: path.join(PLOT, "_overview_penguin.png"),
    x: 0.9, y: 1.4, w: 7.8, h: 3.4,
  });

  // Right column narrative
  s.addText("The penguin problem", {
    x: 9.0, y: 1.5, w: 3.8, h: 0.5, fontSize: 18, bold: true,
    fontFace: "Georgia", color: NAVY, margin: 0,
  });
  s.addText([
    { text: "<bird --> flyer>. ", options: { fontFace: "Courier New", fontSize: 12 } },
    { text: "⟨1.0, 0.9⟩", options: { fontFace: "Calibri", fontSize: 12, bold: true, color: NAVY, breakLine: true } },
    { text: "<penguin --> bird>. ", options: { fontFace: "Courier New", fontSize: 12 } },
    { text: "⟨1.0, 0.9⟩", options: { fontFace: "Calibri", fontSize: 12, bold: true, color: NAVY, breakLine: true } },
    { text: "<penguin --> flyer>. ", options: { fontFace: "Courier New", fontSize: 12 } },
    { text: "⟨0.0, 0.9⟩", options: { fontFace: "Calibri", fontSize: 12, bold: true, color: CORAL } },
  ], { x: 9.0, y: 2.1, w: 3.8, h: 1.8, color: TEXT_DARK, margin: 0,
       paraSpaceAfter: 4 });
  s.addText("Both beliefs survive. NARS resolves them at query time — specific evidence wins over generic rule.",
    { x: 9.0, y: 3.6, w: 3.8, h: 1.4, fontSize: 13, italic: true,
      fontFace: "Calibri", color: TEXT_DARK, margin: 0 });

  // Bottom strip: AGM comparison
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.9, y: 5.1, w: 11.6, h: 1.7, fill: { color: NAVY },
    line: { color: NAVY, width: 0 },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.9, y: 5.1, w: 0.12, h: 1.7, fill: { color: CORAL },
    line: { color: CORAL, width: 0 },
  });
  s.addText("vs. AGM", {
    x: 1.2, y: 5.2, w: 2.0, h: 0.5, fontSize: 16, bold: true,
    fontFace: "Calibri", color: CORAL, margin: 0,
  });
  s.addText("AGM's priority rule would force consistency by deleting one of the beliefs — usually the general rule, discarding useful information. NARS keeps both and lets inference time pick the winner per query. Major architectural advantage for agents living in noisy worlds.",
    { x: 1.2, y: 5.65, w: 11.1, h: 1.1, fontSize: 13,
      fontFace: "Calibri", color: WHITE, margin: 0 });

  footer(s, 7);
}

// ---------- Slide 8: Downstream propagation ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  sidebar(s);
  slideTitle(s, "Result 4 — Revision does not propagate down inference chains");

  s.addImage({
    path: path.join(PLOT, "C1_deduction_chain_contradicted.png"),
    x: 0.9, y: 1.4, w: 7.0, h: 5.0,
  });

  // Right narrative
  s.addText("C1 scenario", {
    x: 8.2, y: 1.5, w: 4.6, h: 0.45, fontSize: 18, bold: true,
    fontFace: "Georgia", color: NAVY, margin: 0,
  });
  s.addText("1. <robin --> bird>.", {
    x: 8.2, y: 2.05, w: 4.6, h: 0.3, fontSize: 12, fontFace: "Courier New",
    color: TEXT_DARK, margin: 0,
  });
  s.addText("2. <bird --> animal>.", {
    x: 8.2, y: 2.35, w: 4.6, h: 0.3, fontSize: 12, fontFace: "Courier New",
    color: TEXT_DARK, margin: 0,
  });
  s.addText("→ deduces <robin --> animal>",
    { x: 8.2, y: 2.65, w: 4.6, h: 0.3, fontSize: 12, italic: true,
      fontFace: "Calibri", color: MUTED, margin: 0 });
  s.addText("3. <bird --> animal>. %0.0%",
    { x: 8.2, y: 3.0, w: 4.6, h: 0.3, fontSize: 12, fontFace: "Courier New",
      color: CORAL, margin: 0 });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 8.2, y: 3.55, w: 4.6, h: 2.85, fill: { color: "F6F7FB" },
    line: { color: ICE, width: 1 },
  });
  s.addText("What happened", {
    x: 8.35, y: 3.65, w: 4.3, h: 0.4, fontSize: 14, bold: true,
    fontFace: "Calibri", color: NAVY, margin: 0,
  });
  s.addText([
    { text: "<bird --> animal>", options: { fontFace: "Courier New", fontSize: 11 } },
    { text: " was revised to ⟨0.5, 0.947⟩ ✓", options: { fontSize: 12, breakLine: true } },
    { text: "<robin --> animal>", options: { fontFace: "Courier New", fontSize: 11 } },
    { text: " stayed at ⟨1.0, 0.81⟩ ✗", options: { fontSize: 12, bold: true, color: CORAL, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "The derived conclusion is not updated when its premise is contradicted. Downstream beliefs become stale.",
      options: { fontSize: 11, italic: true, color: TEXT_DARK } },
  ], { x: 8.35, y: 4.05, w: 4.4, h: 2.3, fontFace: "Calibri",
       color: TEXT_DARK, margin: 0, paraSpaceAfter: 3 });

  footer(s, 8);
}

// ---------- Slide 9: Confidence accumulation ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  sidebar(s);
  slideTitle(s, "Result 5 — Confidence is monotonic under contradiction");

  s.addImage({
    path: path.join(PLOT, "_overview_confidence_growth.png"),
    x: 1.3, y: 1.5, w: 8.0, h: 4.5,
  });

  s.addText("Every step adds evidence, even when it makes the system LESS certain about direction (f→0.5). This is NARS's central trick: evidence accumulation ≠ agreement.",
    { x: 9.5, y: 2.8, w: 3.3, h: 2.5, fontSize: 14, italic: true,
      fontFace: "Calibri", color: NAVY, margin: 0 });

  footer(s, 9);
}

// ---------- Slide 10: Comparison table ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  sidebar(s);
  slideTitle(s, "NARS vs. AGM vs. classical logic");

  const hdr = (t) => ({ text: t, options: {
    bold: true, color: WHITE, fill: { color: NAVY },
    fontFace: "Calibri", align: "center", valign: "middle" },
  });
  const cell = (t, opts = {}) => ({ text: t, options: {
    color: TEXT_DARK, fontFace: "Calibri",
    valign: "middle", align: opts.align || "left",
    bold: opts.bold || false, fill: opts.fill || { color: WHITE } },
  });

  const data = [
    [hdr("Property"), hdr("Classical logic"), hdr("AGM"), hdr("NARS")],
    [cell("Contradiction ⇒ collapse?", { bold: true, fill: { color: "F6F7FB" } }),
     cell("Yes — explosion", { align: "center" }),
     cell("No — forced consistency", { align: "center" }),
     cell("No — graceful coexistence", { align: "center", fill: { color: "E8F5E9" } })],
    [cell("Graded belief?", { bold: true, fill: { color: "F6F7FB" } }),
     cell("No", { align: "center" }),
     cell("No", { align: "center" }),
     cell("⟨f, c⟩", { align: "center", fill: { color: "E8F5E9" } })],
    [cell("Confidence grows with evidence?", { bold: true, fill: { color: "F6F7FB" } }),
     cell("—", { align: "center" }),
     cell("No", { align: "center" }),
     cell("Monotonic ✓", { align: "center", fill: { color: "E8F5E9" } })],
    [cell("Order invariance?", { bold: true, fill: { color: "F6F7FB" } }),
     cell("Trivial (pure truth)", { align: "center" }),
     cell("Depends on iteration rule", { align: "center" }),
     cell("✓ (verified in T1 vs T2)", { align: "center", fill: { color: "E8F5E9" } })],
    [cell("Handles penguin problem?", { bold: true, fill: { color: "F6F7FB" } }),
     cell("✗", { align: "center" }),
     cell("Needs default rules", { align: "center" }),
     cell("Natively", { align: "center", fill: { color: "E8F5E9" } })],
    [cell("Propagates revision downstream?", { bold: true, fill: { color: "F6F7FB" } }),
     cell("—", { align: "center" }),
     cell("Yes (consistency)", { align: "center" }),
     cell("✗ (stale derivatives)", { align: "center", fill: { color: "FEEFEF" } })],
  ];
  s.addTable(data, {
    x: 0.9, y: 1.5, w: 11.6, colW: [3.6, 2.7, 2.7, 2.6], rowH: 0.55,
    fontSize: 12, border: { pt: 0.5, color: "DADFEA" },
  });

  footer(s, 10);
}

// ---------- Slide 11: Takeaways ----------
{
  const s = pres.addSlide();
  s.background = { color: NAVY_DARK };
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.15,
    fill: { color: CORAL }, line: { color: CORAL, width: 0 },
  });
  s.addText("Takeaways", {
    x: 0.8, y: 0.6, w: W - 1.6, h: 0.8, fontSize: 40, bold: true,
    fontFace: "Georgia", color: WHITE, margin: 0,
  });

  const items = [
    { n: "01", t: "Revision formula works as advertised",
      d: "Two-belief case: empirical matches theoretical ⟨f, c⟩ to machine precision." },
    { n: "02", t: "Confidence accumulates, order doesn't matter",
      d: "c is strictly non-decreasing. T1 and T2 (reversed order) reach identical state." },
    { n: "03", t: "AIKR makes revision path-dependent",
      d: "With 3+ inputs, final belief depends on which pairs attention selects. Not a bug — a feature of resource bounding." },
    { n: "04", t: "Coexistence > consistency",
      d: "NARS keeps contradictory general and specific beliefs side-by-side. Penguin problem has a natural solution." },
    { n: "05", t: "Revision does not propagate downstream",
      d: "Contradicting a premise does not automatically revise its descendants. Area for improvement." },
  ];
  const startY = 1.7;
  const rowH = 1.05;
  items.forEach((it, i) => {
    const y = startY + i * rowH;
    s.addText(it.n, {
      x: 0.8, y, w: 1.3, h: 0.9, fontSize: 40, bold: true,
      fontFace: "Georgia", color: CORAL, align: "left", margin: 0,
    });
    s.addText(it.t, {
      x: 2.3, y: y + 0.05, w: 10.5, h: 0.45, fontSize: 18, bold: true,
      fontFace: "Calibri", color: WHITE, margin: 0,
    });
    s.addText(it.d, {
      x: 2.3, y: y + 0.5, w: 10.5, h: 0.5, fontSize: 13,
      fontFace: "Calibri", color: ICE, margin: 0,
    });
  });
}

// ---------- Slide 12: Thanks ----------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  sidebar(s);

  s.addText("Thank you.", {
    x: 0.8, y: 2.3, w: W - 1.6, h: 1.2, fontSize: 72, bold: true,
    fontFace: "Georgia", color: NAVY, margin: 0,
  });
  s.addShape(pres.shapes.LINE, {
    x: 0.8, y: 3.6, w: 2.2, h: 0, line: { color: CORAL, width: 4 },
  });
  s.addText("Questions?", {
    x: 0.8, y: 3.9, w: W - 1.6, h: 0.6, fontSize: 24, italic: true,
    fontFace: "Calibri", color: MUTED, margin: 0,
  });
  s.addText("Full report and reproducible code: NARS_Project_Report.docx · experiments/ · analysis/", {
    x: 0.8, y: 6.4, w: W - 1.6, h: 0.4, fontSize: 12,
    fontFace: "Calibri", color: MUTED, margin: 0, italic: true,
  });
  footer(s, 12);
}

pres.writeFile({ fileName: OUT }).then(f => {
  console.log(`Slides written: ${f}`);
});
