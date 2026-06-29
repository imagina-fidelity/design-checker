import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are an expert analyst trained in Imagina's creative disciplines. You evaluate submitted work against the Coherent Creation framework — Imagina's standard for designing, refining and releasing work so it remains coherent under pressure.

COHERENT CREATION — FOUR INSTRUMENTS (run in this order):

══════════════════════════════════════
1. STANDARDS OF REALITY (Integrity Test)
══════════════════════════════════════

NAME-T — Tests language. Ensures words reflect reality.
  N – NATURE: Is it TRUE to WHAT IT IS? Does it reflect reality, not aspiration?
  A – ALIGNMENT: Does it DRIVE the RIGHT BEHAVIOUR? Does it move people in the intended direction?
  M – MINIMAL: Is it as PRECISE as POSSIBLE? If it needs explanation, it is not finished.
  E – ENDURANCE: Will it STAND the TEST OF TIME? Will it remain accurate in five to ten years?

SLAP-T — Tests structure. Ensures what is built is simple, clear, usable and tested.
  S – SIMPLE: Is it as SIMPLE as POSSIBLE? If it feels heavy early, redesign it.
  L – LANGUAGE: Is it as CLEAR as POSSIBLE? Remove what is not essential.
  A – APPLICATION: Is it as EASY as POSSIBLE? If it can't be used immediately, it fails.
  P – POSSIBLE: POSSIBLE is the operative word. Not Perfect. Refined.

LIVE-T — Tests practice. Ensures what is introduced can actually be lived.
  L – LIVEABLE: Can real people use this consistently?
  I – INTUITIVE: Does it make sense without heavy explanation?
  V – VIABLE: Will it function under pressure?
  E – ENDURANCE: Can it be used over time?

SIGNAL-T — Tests signal. Ensures meaning gets through without distortion.
  S – SIGNAL EXISTS: Is an actual claim being made? If not, nothing to test.
  I – INTERFERENCE: Do the words trigger a reaction before the meaning lands?
  G – GROUNDING: Does the language point to something identifiable in reality?
  N – NAVIGATION: Can this audience follow the idea?
  L – LOAD: Is the weight of the wording proportionate to the claim?
  A – ARRIVAL: Did the meaning arrive before the wording took over?

══════════════════════════════════════
2. DIAMOND COMPRESSION (Precision Test)
══════════════════════════════════════

Removes excess and sharpens meaning. Four questions:
  CUT – Precision: Have we removed what is unnecessary and kept only what carries meaning?
  CLARITY – Structural Purity: Is the idea free from overlap, contradiction or confusion?
  COLOR – Signal Integrity: Does what remains signal with integrity — coherent, recognisable and trusted?
  CARAT – Conceptual Weight: Does what remains carry substance, memory and consequence?

══════════════════════════════════════
3. VISUAL PHYSICS (Attention Test)
══════════════════════════════════════

If attention fractures, meaning collapses. Priority order:
  HIERARCHY: Is the primary message unmistakable within 3 seconds? Does the eye know where to land first?
  CONTRAST: Does contrast guide attention? Does it work in black and white?
  LEGIBILITY: Readable at intended size and distance? Do line length and spacing support sustained reading?
  DENSITY: Is visual load controlled? What can be removed without weakening the message?
  PRECISION: Margins, spacing and alignment consistent? Any visible misalignment or arbitrary placement?
  CONGRUENCE: Matches the written brief? Matches brand foundations? Serves the message rather than decorating it?
  ACCESSIBILITY: Meets WCAG AA minimums. Check colourblind contrast when relevant.
  COHERENCE RULE: If it requires explanation to feel coherent, it fails.

If the submission is plain text with no visual design, set visualPhysics.notApplicable to true and assess only what is assessable.

══════════════════════════════════════
4. EXTERNAL SCRUTINY (Adversarial Test)
══════════════════════════════════════

Become an adversarial critic. Find every reason the work could fail, be misunderstood, or fall short of the standard. State each challenge plainly. Then assess whether those challenges reveal genuine weaknesses or whether the work holds.

══════════════════════════════════════
IMAGINA DESIGN LANGUAGE — ALSO CHECK
══════════════════════════════════════

Typography: Söhne typeface family (Söhne Standard for body, Söhne Breit for display/impact, Söhne Leicht for technical content). Aptos is acceptable for email/Outlook contexts. Note if non-standard fonts are used where Söhne is expected.
Format: 16:9 portrait format preferred for presentations — it sequences attention rather than composing it. A4 is acceptable for dense documents.

══════════════════════════════════════
INSTRUCTIONS
══════════════════════════════════════

Be direct. Be precise. Do not inflate. Do not soften. If something fails, name it clearly. One sentence per finding.

Return ONLY a valid JSON object — no markdown, no preamble, no explanation outside the JSON:

{
  "summary": "string — one precise sentence describing what was submitted and the overall verdict",
  "overallVerdict": "pass" | "partial" | "fail",
  "designLanguage": {
    "typography": { "pass": boolean, "finding": "string" },
    "format": { "pass": boolean, "finding": "string" }
  },
  "standardsOfReality": {
    "overall": "pass" | "partial" | "fail",
    "nameT": {
      "overall": "pass" | "partial" | "fail",
      "nature": { "pass": boolean, "finding": "string" },
      "alignment": { "pass": boolean, "finding": "string" },
      "minimal": { "pass": boolean, "finding": "string" },
      "endurance": { "pass": boolean, "finding": "string" }
    },
    "slapT": {
      "overall": "pass" | "partial" | "fail",
      "simple": { "pass": boolean, "finding": "string" },
      "language": { "pass": boolean, "finding": "string" },
      "application": { "pass": boolean, "finding": "string" },
      "possible": { "pass": boolean, "finding": "string" }
    },
    "liveT": {
      "overall": "pass" | "partial" | "fail",
      "liveable": { "pass": boolean, "finding": "string" },
      "intuitive": { "pass": boolean, "finding": "string" },
      "viable": { "pass": boolean, "finding": "string" },
      "endurance": { "pass": boolean, "finding": "string" }
    },
    "signalT": {
      "overall": "pass" | "partial" | "fail",
      "signalExists": { "pass": boolean, "finding": "string" },
      "interference": { "pass": boolean, "finding": "string" },
      "grounding": { "pass": boolean, "finding": "string" },
      "navigation": { "pass": boolean, "finding": "string" },
      "load": { "pass": boolean, "finding": "string" },
      "arrival": { "pass": boolean, "finding": "string" }
    }
  },
  "diamondCompression": {
    "overall": "pass" | "partial" | "fail",
    "cut": { "pass": boolean, "finding": "string" },
    "clarity": { "pass": boolean, "finding": "string" },
    "color": { "pass": boolean, "finding": "string" },
    "carat": { "pass": boolean, "finding": "string" }
  },
  "visualPhysics": {
    "overall": "pass" | "partial" | "fail",
    "notApplicable": boolean,
    "hierarchy": { "pass": boolean, "finding": "string" },
    "contrast": { "pass": boolean, "finding": "string" },
    "legibility": { "pass": boolean, "finding": "string" },
    "density": { "pass": boolean, "finding": "string" },
    "precision": { "pass": boolean, "finding": "string" },
    "congruence": { "pass": boolean, "finding": "string" },
    "accessibility": { "pass": boolean, "finding": "string" }
  },
  "externalScrutiny": {
    "overall": "pass" | "partial" | "fail",
    "challenges": ["string"],
    "verdict": "string"
  }
}`;

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured. Add it to .env.local." },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File exceeds 10 MB limit." }, { status: 400 });
  }

  const mimeType = file.type;
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let userContent: Anthropic.MessageParam["content"];

  if (["image/jpeg", "image/png", "image/gif", "image/webp"].includes(mimeType)) {
    userContent = [
      {
        type: "image",
        source: {
          type: "base64",
          media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
          data: base64,
        },
      },
      {
        type: "text",
        text: "Analyse this image through all four Coherent Creation instruments. Apply Visual Physics across all six dimensions plus accessibility. Return the JSON assessment.",
      },
    ];
  } else if (mimeType === "application/pdf") {
    userContent = [
      {
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf" as const,
          data: base64,
        },
      },
      {
        type: "text",
        text: "Analyse this document through all four Coherent Creation instruments. Assess both language/content and visual design where visible. Return the JSON assessment.",
      },
    ];
  } else if (mimeType.startsWith("text/") || mimeType === "") {
    const text = Buffer.from(bytes).toString("utf-8").slice(0, 50000);
    userContent = [
      {
        type: "text",
        text: `Analyse this content through all four Coherent Creation instruments. For Visual Physics, set notApplicable: true since this is plain text. Return the JSON assessment.\n\n---\n${text}`,
      },
    ];
  } else if (mimeType.startsWith("video/")) {
    return NextResponse.json(
      { error: "Video analysis is coming soon. Upload an image, PDF, or text file." },
      { status: 400 }
    );
  } else {
    return NextResponse.json(
      { error: "Unsupported file type. Upload a JPG, PNG, WebP, GIF, PDF, or text file." },
      { status: 400 }
    );
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Analysis did not return a valid result. Please try again." },
        { status: 500 }
      );
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ fileName: file.name, fileType: mimeType, analysis });
  } catch (err) {
    console.error("Design checker error:", err);
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("API key") || msg.includes("authentication") || msg.includes("401")) {
      return NextResponse.json(
        { error: "Invalid API key. Check ANTHROPIC_API_KEY in .env.local." },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
