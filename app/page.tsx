"use client";

import { useState, useRef, useCallback } from "react";
import { signOut } from "next-auth/react";
import ImaginaLogo from "@/components/ImaginaLogo";

// ─── Types ────────────────────────────────────────────────────────────────────

type Verdict = "pass" | "partial" | "fail";

interface CriterionResult {
  pass: boolean;
  finding: string;
}

interface AnalysisResult {
  summary: string;
  overallVerdict: Verdict;
  designLanguage: {
    typography: CriterionResult;
    format: CriterionResult;
  };
  standardsOfReality: {
    overall: Verdict;
    nameT: { overall: Verdict; nature: CriterionResult; alignment: CriterionResult; minimal: CriterionResult; endurance: CriterionResult };
    slapT: { overall: Verdict; simple: CriterionResult; language: CriterionResult; application: CriterionResult; possible: CriterionResult };
    liveT: { overall: Verdict; liveable: CriterionResult; intuitive: CriterionResult; viable: CriterionResult; endurance: CriterionResult };
    signalT: { overall: Verdict; signalExists: CriterionResult; interference: CriterionResult; grounding: CriterionResult; navigation: CriterionResult; load: CriterionResult; arrival: CriterionResult };
  };
  diamondCompression: {
    overall: Verdict;
    cut: CriterionResult;
    clarity: CriterionResult;
    color: CriterionResult;
    carat: CriterionResult;
  };
  visualPhysics: {
    overall: Verdict;
    notApplicable: boolean;
    hierarchy: CriterionResult;
    contrast: CriterionResult;
    legibility: CriterionResult;
    density: CriterionResult;
    precision: CriterionResult;
    congruence: CriterionResult;
    accessibility: CriterionResult;
  };
  externalScrutiny: {
    overall: Verdict;
    challenges: string[];
    verdict: string;
  };
}

// ─── Shared primitives ────────────────────────────────────────────────────────

const VERDICT_STYLES: Record<Verdict, { bg: string; text: string; label: string }> = {
  pass:    { bg: "var(--status-active)",  text: "var(--status-active-text)",  label: "Pass"    },
  partial: { bg: "var(--status-pending)", text: "var(--status-pending-text)", label: "Partial" },
  fail:    { bg: "var(--status-error)",   text: "var(--status-error-text)",   label: "Fail"    },
};

function VerdictPill({ verdict }: { verdict: Verdict }) {
  const s = VERDICT_STYLES[verdict];
  return (
    <span
      style={{
        fontSize: "10px",
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: s.text,
        padding: "2px 8px",
        border: `1px solid ${s.bg}`,
        borderRadius: "3px",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

function Dot({ pass }: { pass: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        backgroundColor: pass ? "var(--status-active-text)" : "var(--status-error-text)",
        flexShrink: 0,
        marginTop: "5px",
      }}
    />
  );
}

function CriterionRow({ label, result }: { label: string; result: CriterionResult }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        padding: "9px 0",
        borderBottom: "1px solid var(--bg-border)",
      }}
    >
      <Dot pass={result.pass} />
      <div style={{ flex: 1 }}>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
            marginRight: "8px",
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          {result.finding}
        </span>
      </div>
    </div>
  );
}

function SubSection({
  title,
  overall,
  children,
}: {
  title: string;
  overall: Verdict;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: "4px" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          background: "none",
          border: "none",
          padding: "10px 0",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)", letterSpacing: "0.01em" }}>
          {title}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <VerdictPill verdict={overall} />
          <span style={{ fontSize: "10px", color: "var(--text-tertiary)", width: "8px" }}>
            {open ? "▲" : "▼"}
          </span>
        </div>
      </button>
      {open && <div style={{ paddingLeft: "0" }}>{children}</div>}
    </div>
  );
}

function Instrument({
  index,
  title,
  overall,
  children,
}: {
  index: number;
  title: string;
  overall: Verdict;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--bg-border)",
        borderRadius: "6px",
        marginBottom: "8px",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          width: "100%",
          background: "none",
          border: "none",
          padding: "14px 16px",
          cursor: "pointer",
          fontFamily: "inherit",
          textAlign: "left",
        }}
      >
        <span
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "3px",
            backgroundColor: "var(--bg-raised)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
            fontWeight: 600,
            color: "var(--text-tertiary)",
            flexShrink: 0,
          }}
        >
          {index}
        </span>
        <span style={{ flex: 1, fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", letterSpacing: "0.01em" }}>
          {title}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <VerdictPill verdict={overall} />
          <span style={{ fontSize: "10px", color: "var(--text-tertiary)", width: "8px" }}>
            {open ? "▲" : "▼"}
          </span>
        </div>
      </button>
      {open && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid var(--bg-border)" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Results display ──────────────────────────────────────────────────────────

function Results({ fileName, analysis }: { fileName: string; analysis: AnalysisResult }) {
  const sor = analysis.standardsOfReality;
  const dc = analysis.diamondCompression;
  const vp = analysis.visualPhysics;
  const es = analysis.externalScrutiny;

  return (
    <div>
      {/* Overall verdict banner */}
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--bg-border)",
          borderLeft: `3px solid ${VERDICT_STYLES[analysis.overallVerdict].bg}`,
          borderRadius: "6px",
          padding: "16px",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={{ fontSize: "11px", color: "var(--text-tertiary)", letterSpacing: "0.04em" }}>
            {fileName}
          </span>
          <VerdictPill verdict={analysis.overallVerdict} />
        </div>
        <p style={{ margin: 0, fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
          {analysis.summary}
        </p>
      </div>

      {/* Design Language */}
      <div
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--bg-border)",
          borderRadius: "6px",
          marginBottom: "8px",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--bg-border)" }}>
          <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
            Design Language
          </span>
        </div>
        <div style={{ padding: "0 16px" }}>
          <CriterionRow label="Typography" result={analysis.designLanguage.typography} />
          <CriterionRow label="Format" result={analysis.designLanguage.format} />
        </div>
      </div>

      {/* 1. Standards of Reality */}
      <Instrument index={1} title="Standards of Reality" overall={sor.overall}>
        <div style={{ paddingTop: "8px" }}>
          <SubSection title="NAME-T — Language" overall={sor.nameT.overall}>
            <CriterionRow label="N — Nature"    result={sor.nameT.nature}     />
            <CriterionRow label="A — Alignment" result={sor.nameT.alignment}  />
            <CriterionRow label="M — Minimal"   result={sor.nameT.minimal}    />
            <CriterionRow label="E — Endurance" result={sor.nameT.endurance}  />
          </SubSection>
          <SubSection title="SLAP-T — Structure" overall={sor.slapT.overall}>
            <CriterionRow label="S — Simple"      result={sor.slapT.simple}      />
            <CriterionRow label="L — Language"    result={sor.slapT.language}    />
            <CriterionRow label="A — Application" result={sor.slapT.application} />
            <CriterionRow label="P — Possible"    result={sor.slapT.possible}    />
          </SubSection>
          <SubSection title="LIVE-T — Practice" overall={sor.liveT.overall}>
            <CriterionRow label="L — Liveable"  result={sor.liveT.liveable}  />
            <CriterionRow label="I — Intuitive" result={sor.liveT.intuitive} />
            <CriterionRow label="V — Viable"    result={sor.liveT.viable}    />
            <CriterionRow label="E — Endurance" result={sor.liveT.endurance} />
          </SubSection>
          <SubSection title="SIGNAL-T — Transmission" overall={sor.signalT.overall}>
            <CriterionRow label="S — Signal Exists" result={sor.signalT.signalExists} />
            <CriterionRow label="I — Interference"  result={sor.signalT.interference} />
            <CriterionRow label="G — Grounding"     result={sor.signalT.grounding}    />
            <CriterionRow label="N — Navigation"    result={sor.signalT.navigation}   />
            <CriterionRow label="L — Load"          result={sor.signalT.load}         />
            <CriterionRow label="A — Arrival"       result={sor.signalT.arrival}      />
          </SubSection>
        </div>
      </Instrument>

      {/* 2. Diamond Compression */}
      <Instrument index={2} title="Diamond Compression" overall={dc.overall}>
        <div style={{ paddingTop: "8px" }}>
          <CriterionRow label="Cut — Precision"          result={dc.cut}     />
          <CriterionRow label="Clarity — Structural Purity" result={dc.clarity} />
          <CriterionRow label="Color — Signal Integrity" result={dc.color}   />
          <CriterionRow label="Carat — Conceptual Weight" result={dc.carat}  />
        </div>
      </Instrument>

      {/* 3. Visual Physics */}
      <Instrument index={3} title="Visual Physics" overall={vp.overall}>
        <div style={{ paddingTop: "8px" }}>
          {vp.notApplicable && (
            <p style={{ margin: "0 0 4px", fontSize: "12px", color: "var(--text-tertiary)", fontStyle: "italic" }}>
              No visual layout present — assessed on available signals.
            </p>
          )}
          <CriterionRow label="Hierarchy"     result={vp.hierarchy}     />
          <CriterionRow label="Contrast"      result={vp.contrast}      />
          <CriterionRow label="Legibility"    result={vp.legibility}    />
          <CriterionRow label="Density"       result={vp.density}       />
          <CriterionRow label="Precision"     result={vp.precision}     />
          <CriterionRow label="Congruence"    result={vp.congruence}    />
          <CriterionRow label="Accessibility" result={vp.accessibility} />
        </div>
      </Instrument>

      {/* 4. External Scrutiny */}
      <Instrument index={4} title="External Scrutiny" overall={es.overall}>
        <div style={{ paddingTop: "8px" }}>
          {es.challenges.length > 0 && (
            <div style={{ marginBottom: "12px" }}>
              <p style={{ margin: "0 0 8px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
                Challenges raised
              </p>
              <ul style={{ margin: 0, paddingLeft: "18px" }}>
                {es.challenges.map((c, i) => (
                  <li key={i} style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "4px" }}>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div
            style={{
              padding: "12px",
              backgroundColor: "var(--bg-raised)",
              borderRadius: "4px",
              fontSize: "13px",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
            }}
          >
            {es.verdict}
          </div>
        </div>
      </Instrument>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const ACCEPTED_MIME = "image/jpeg,image/png,image/webp,image/gif,application/pdf,text/plain,text/markdown";
const ACCEPTED_LABEL = "PDF · Image (JPG, PNG, WebP, GIF) · Plain text";

export default function DesignCheckerPage() {
  const [mode, setMode] = useState<"upload" | "text">("upload");
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ fileName: string; analysis: AnalysisResult } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pickFile = (f: File) => {
    setFile(f);
    setError(null);
    setResult(null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) pickFile(f);
  }, []);

  const canSubmit = mode === "upload" ? !!file : text.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const form = new FormData();

    if (mode === "upload" && file) {
      form.append("file", file);
    } else {
      const blob = new Blob([text], { type: "text/plain" });
      form.append("file", blob, "text-input.txt");
    }

    try {
      const res = await fetch("/api/design-checker", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Analysis failed.");
      } else {
        setResult({ fileName: data.fileName, analysis: data.analysis });
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setText("");
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const switchMode = (next: "upload" | "text") => {
    setMode(next);
    setError(null);
    setResult(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "var(--bg-base)" }}>
      {/* Header */}
      <header
        style={{
          height: "48px",
          borderBottom: "1px solid var(--bg-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          flexShrink: 0,
          backgroundColor: "var(--bg-surface)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ImaginaLogo style={{ height: "14px", width: "auto", color: "var(--text-secondary)" }} />
          <span style={{ width: "1px", height: "16px", backgroundColor: "var(--bg-border)" }} />
          <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)", letterSpacing: "0.02em" }}>
            Design Checker
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            background: "none",
            border: "none",
            fontSize: "12px",
            color: "var(--text-tertiary)",
            cursor: "pointer",
            fontFamily: "inherit",
            padding: "4px 0",
          }}
        >
          Sign out
        </button>
      </header>

      {/* Content */}
      <main style={{ flex: 1, display: "flex", justifyContent: "center", padding: "48px 24px 80px" }}>
        <div style={{ width: "100%", maxWidth: "680px" }}>

          {/* Title */}
          <div style={{ marginBottom: "32px" }}>
            <h1
              style={{
                margin: "0 0 10px",
                fontSize: "22px",
                fontWeight: 400,
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
                fontFamily: "SohneBreit, Sohne, sans-serif",
              }}
            >
              Design Checker
            </h1>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "520px" }}>
              Upload a file or paste text. Claude analyses it against Imagina&apos;s Coherent Creation framework — Standards of Reality, Diamond Compression, Visual Physics, and External Scrutiny.
            </p>
          </div>

          {/* Mode tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--bg-border)", marginBottom: "16px" }}>
            {(["upload", "text"] as const).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: mode === m ? "2px solid var(--text-primary)" : "2px solid transparent",
                  marginBottom: "-1px",
                  padding: "8px 16px 8px 0",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: mode === m ? "var(--text-primary)" : "var(--text-tertiary)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  letterSpacing: "0.01em",
                  transition: "color 150ms ease",
                }}
              >
                {m === "upload" ? "Upload file" : "Paste text"}
              </button>
            ))}
          </div>

          {/* Upload zone */}
          {mode === "upload" && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `1px dashed ${dragging ? "var(--text-secondary)" : "var(--bg-border)"}`,
              borderRadius: "6px",
              backgroundColor: dragging ? "var(--bg-raised)" : "var(--bg-surface)",
              padding: "36px 24px",
              textAlign: "center",
              cursor: "pointer",
              transition: "background-color 150ms ease, border-color 150ms ease",
              marginBottom: "12px",
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_MIME}
              style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) pickFile(f); }}
            />
            {file ? (
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "6px 14px",
                    backgroundColor: "var(--bg-raised)",
                    borderRadius: "4px",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>{file.name}</span>
                  <span style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-tertiary)" }}>
                  Click or drop to replace
                </p>
              </div>
            ) : (
              <div>
                <p style={{ margin: "0 0 6px", fontSize: "14px", color: "var(--text-secondary)" }}>
                  Drop file here or click to upload
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-tertiary)" }}>
                  {ACCEPTED_LABEL} · Max 10 MB
                </p>
              </div>
            )}
          </div>
          )}

          {/* Text input */}
          {mode === "text" && (
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setError(null); setResult(null); }}
            placeholder="Paste or type your content here — a document, slide copy, product description, email, name, or anything else you want to run through the framework…"
            style={{
              width: "100%",
              minHeight: "200px",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--bg-border)",
              borderRadius: "6px",
              padding: "14px",
              fontSize: "13px",
              color: "var(--text-primary)",
              fontFamily: "inherit",
              lineHeight: 1.6,
              resize: "vertical",
              outline: "none",
              marginBottom: "12px",
              boxSizing: "border-box",
              transition: "border-color 150ms ease",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--text-tertiary)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--bg-border)"; }}
          />
          )}

          {/* Error */}
          {error && (
            <div
              style={{
                padding: "11px 14px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--status-error)",
                borderRadius: "4px",
                fontSize: "13px",
                color: "var(--status-error-text)",
                marginBottom: "12px",
              }}
            >
              {error}
            </div>
          )}

          {/* Analyse button */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
            style={{
              width: "100%",
              padding: "11px",
              backgroundColor: canSubmit && !loading ? "var(--text-primary)" : "var(--bg-raised)",
              color: canSubmit && !loading ? "var(--bg-base)" : "var(--text-tertiary)",
              border: "none",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: canSubmit && !loading ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              letterSpacing: "0.02em",
              transition: "background-color 150ms ease, color 150ms ease",
              marginBottom: "40px",
            }}
          >
            {loading ? "Analysing…" : "Analyse"}
          </button>

          {/* Loading state */}
          {loading && (
            <div
              style={{
                padding: "40px 24px",
                textAlign: "center",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--bg-border)",
                borderRadius: "6px",
                marginBottom: "24px",
              }}
            >
              <p style={{ margin: "0 0 8px", fontSize: "14px", color: "var(--text-secondary)" }}>
                Running Coherent Creation analysis…
              </p>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--text-tertiary)", lineHeight: 1.8 }}>
                Standards of Reality · Diamond Compression<br />
                Visual Physics · External Scrutiny
              </p>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <span style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
                  Results
                </span>
                <button
                  onClick={reset}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "12px",
                    color: "var(--text-tertiary)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Clear
                </button>
              </div>
              <Results fileName={result.fileName} analysis={result.analysis} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
