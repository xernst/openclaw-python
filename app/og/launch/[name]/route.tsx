import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";

export const runtime = "nodejs";
export const dynamic = "force-static";

const W = 1600;
const H = 900;

// Sourced from app/globals.css to match the live site palette exactly.
const ink950 = "#0E0F12";
const ink900 = "#18181b";
const ink800 = "#27272a";
const ink700 = "#3f3f46";
const ink400 = "#a1a1aa";
const ink300 = "#d4d4d8";
const ink100 = "#f4f4f5";
const ember = "#F2683C";
const emberDim = "#e34c1c";
const red = "#ef4444";
const green = "#86efac";

export async function generateStaticParams() {
  return [
    { name: "hook" },
    { name: "wedge" },
    { name: "ide" },
    { name: "capstone" },
    { name: "price" },
  ];
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  switch (name) {
    case "hook":
      return renderHook();
    case "wedge":
      return renderWedge();
    case "ide":
      return renderIde();
    case "capstone":
      return renderCapstone();
    case "price":
      return renderPrice();
    default:
      notFound();
  }
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: W,
        height: H,
        background: ink950,
        color: ink100,
        display: "flex",
        flexDirection: "column",
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        color: ember,
        fontSize: 26,
        letterSpacing: 6,
        textTransform: "uppercase",
        fontWeight: 600,
      }}
    >
      {text}
    </div>
  );
}

function Footer({ rightText }: { rightText: string }) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: `1px solid ${ink800}`,
        paddingTop: 28,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 32,
          fontWeight: 700,
          color: ink100,
          letterSpacing: -0.5,
        }}
      >
        Pyloft
      </div>
      <div style={{ display: "flex", fontSize: 24, color: ink400 }}>
        {rightText}
      </div>
    </div>
  );
}

function renderHook() {
  return new ImageResponse(
    (
      <Frame>
        <Eyebrow text="launching now" />
        <div
          style={{
            display: "flex",
            fontSize: 220,
            fontWeight: 800,
            marginTop: 12,
            letterSpacing: -8,
            color: ink100,
            lineHeight: 0.95,
          }}
        >
          Pyloft
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 38,
            color: ink300,
            marginTop: 18,
            width: 1456,
            lineHeight: 1.3,
          }}
        >
          a python course for the people who already use cursor and claude
          code, but want to read what those tools actually wrote.
        </div>

        <div style={{ display: "flex", flex: 1 }} />

        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 22,
                color: ink400,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              the wedge
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 36,
                color: ink100,
                marginTop: 6,
                fontWeight: 600,
              }}
            >
              ch13 to 22 · ai builder skills
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 22,
                color: ink400,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              what you get
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 36,
                color: ember,
                marginTop: 6,
                fontWeight: 600,
              }}
            >
              22 chapters · 624 steps · $0
            </div>
          </div>
        </div>

        <Footer rightText="pyloft.io" />
      </Frame>
    ),
    { width: W, height: H },
  );
}

function renderWedge() {
  const codeLines: Array<{ text: string; color?: string; bug?: boolean }> = [
    { text: "def collect_errors(", color: ink100 },
    { text: "    msg: str,", color: ink300 },
    { text: "    bag: list = []", color: red, bug: true },
    { text: "):", color: ink100 },
    { text: "    bag.append(msg)", color: ink300 },
    { text: "    return bag", color: ink300 },
  ];

  return new ImageResponse(
    (
      <Frame>
        <Eyebrow text="read the trace · spot the bug" />
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            marginTop: 14,
            letterSpacing: -2,
            color: ink100,
            lineHeight: 1.05,
            width: "100%",
          }}
        >
          ai writes this. it&apos;s wrong.
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 28,
            background: ink900,
            border: `1px solid ${ink800}`,
            borderRadius: 14,
            padding: "24px 28px",
            fontFamily: "ui-monospace, monospace",
            fontSize: 28,
            lineHeight: 1.5,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              color: ink400,
              fontSize: 18,
              marginBottom: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            cursor.py
          </div>
          {codeLines.map((line, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                color: line.color ?? ink300,
                background: line.bug ? "rgba(239,68,68,0.14)" : "transparent",
                padding: line.bug ? "2px 8px" : "2px 0",
                borderRadius: line.bug ? 4 : 0,
                margin: line.bug ? "0 -8px" : 0,
                whiteSpace: "pre",
              }}
            >
              {line.text || " "}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 22,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 32,
              color: red,
              fontWeight: 700,
            }}
          >
            mutable default argument.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: ink300,
              marginTop: 8,
              lineHeight: 1.4,
            }}
          >
            python evaluates the list once when the function is defined, so
            every caller mutates the same list. ch07 fixes you.
          </div>
        </div>

        <div style={{ display: "flex", flex: 1 }} />

        <Footer rightText="ch07 · mutation and state" />
      </Frame>
    ),
    { width: W, height: H },
  );
}

function renderIde() {
  return new ImageResponse(
    (
      <Frame>
        <Eyebrow text="live python · in your browser" />
        <div
          style={{
            display: "flex",
            fontSize: 70,
            fontWeight: 700,
            marginTop: 14,
            letterSpacing: -2,
            color: ink100,
            lineHeight: 1.05,
            width: "100%",
          }}
        >
          no installs. no venv. no setup.
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 30,
            background: ink900,
            border: `1px solid ${ink800}`,
            borderRadius: 14,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "14px 18px",
              borderBottom: `1px solid ${ink800}`,
              background: ink950,
              borderRadius: "14px 14px 0 0",
            }}
          >
            <div style={{ display: "flex", width: 12, height: 12, borderRadius: 6, background: "#ef4444" }} />
            <div style={{ display: "flex", width: 12, height: 12, borderRadius: 6, background: "#eab308", marginLeft: 8 }} />
            <div style={{ display: "flex", width: 12, height: 12, borderRadius: 6, background: "#22c55e", marginLeft: 8 }} />
            <div
              style={{
                display: "flex",
                marginLeft: 22,
                color: ink400,
                fontSize: 18,
                fontFamily: "ui-monospace, monospace",
              }}
            >
              pyloft.io/learn/v2/llm-apis
            </div>
            <div style={{ display: "flex", flex: 1 }} />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: ember,
                color: ink950,
                padding: "8px 22px",
                borderRadius: 8,
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              run
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 28,
              fontFamily: "ui-monospace, monospace",
              fontSize: 26,
              lineHeight: 1.55,
            }}
          >
            <div style={{ display: "flex" }}>
              <span style={{ color: ink700, width: 36 }}>1</span>
              <span style={{ color: ember }}>import</span>
              <span style={{ color: ink300, marginLeft: 10 }}>httpx</span>
            </div>
            <div style={{ display: "flex" }}>
              <span style={{ color: ink700, width: 36 }}>2</span>
            </div>
            <div style={{ display: "flex" }}>
              <span style={{ color: ink700, width: 36 }}>3</span>
              <span style={{ color: ink300 }}>r = httpx.get(</span>
              <span style={{ color: green, marginLeft: 4 }}>
                &quot;https://api.github.com/zen&quot;
              </span>
              <span style={{ color: ink300 }}>)</span>
            </div>
            <div style={{ display: "flex" }}>
              <span style={{ color: ink700, width: 36 }}>4</span>
              <span style={{ color: ink300 }}>print(r.text)</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "20px 28px 24px 28px",
              borderTop: `1px solid ${ink800}`,
              fontFamily: "ui-monospace, monospace",
              fontSize: 24,
              lineHeight: 1.5,
              background: "rgba(245,158,11,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                color: ink400,
                fontSize: 16,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              output
            </div>
            <div style={{ display: "flex", color: ink100 }}>
              Avoid administrative distraction.
            </div>
            <div
              style={{
                display: "flex",
                color: emberDim,
                marginTop: 10,
                fontSize: 16,
              }}
            >
              ran in 187ms · pyodide wasm · client side
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flex: 1 }} />
        <Footer rightText="powered by pyodide" />
      </Frame>
    ),
    { width: W, height: H },
  );
}

function renderCapstone() {
  const traceLines = [
    { kind: "user", label: "user", text: "what's in my downloads folder?" },
    { kind: "tool", label: "tool_use", text: "list_files(path='~/Downloads')" },
    {
      kind: "result",
      label: "tool_result",
      text: "['invoice-2026.pdf', 'screenshot.png', 'agent-traces.md']",
    },
    { kind: "tool", label: "tool_use", text: "summarize(files=[…3])" },
    { kind: "stop", label: "stop_reason", text: "end_turn" },
    {
      kind: "agent",
      label: "agent",
      text: "you have an invoice, a screenshot, and a markdown note about agent traces.",
    },
  ];

  return new ImageResponse(
    (
      <Frame>
        <Eyebrow text="chapter 22 · the capstone" />
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            marginTop: 14,
            letterSpacing: -1.5,
            color: ink100,
            lineHeight: 1.05,
            width: "100%",
          }}
        >
          ship a working cli agent in 12 steps.
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 28,
            background: ink900,
            border: `1px solid ${ink800}`,
            borderRadius: 14,
            padding: "26px 30px",
            fontFamily: "ui-monospace, monospace",
            fontSize: 22,
            width: "100%",
          }}
        >
          {traceLines.map((line, i) => {
            const labelColor =
              line.kind === "user"
                ? ink400
                : line.kind === "tool"
                  ? ember
                  : line.kind === "result"
                    ? green
                    : line.kind === "stop"
                      ? "#a5b4fc"
                      : ink100;
            const textColor = line.kind === "agent" ? ink100 : ink300;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginTop: i === 0 ? 0 : 14,
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    color: labelColor,
                    fontSize: 16,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    width: 160,
                    paddingTop: 4,
                    fontWeight: 600,
                  }}
                >
                  {line.label}
                </div>
                <div
                  style={{
                    display: "flex",
                    color: textColor,
                    flex: 1,
                  }}
                >
                  {line.text}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flex: 1 }} />
        <Footer rightText="~100 lines of python" />
      </Frame>
    ),
    { width: W, height: H },
  );
}

function renderPrice() {
  return new ImageResponse(
    (
      <Frame>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              color: ember,
              fontSize: 32,
              letterSpacing: 14,
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            forever
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 360,
              fontWeight: 800,
              color: ink100,
              letterSpacing: -16,
              lineHeight: 0.9,
              marginTop: 8,
            }}
          >
            $0
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              color: ink400,
              fontSize: 28,
            }}
          >
            <span>no login</span>
            <span style={{ color: ink700, margin: "0 18px" }}>·</span>
            <span>no streaks</span>
            <span style={{ color: ink700, margin: "0 18px" }}>·</span>
            <span>no upsell</span>
            <span style={{ color: ink700, margin: "0 18px" }}>·</span>
            <span style={{ color: ember }}>open source</span>
          </div>
        </div>

        <Footer rightText="github.com/xernst/code-killa" />
      </Frame>
    ),
    { width: W, height: H },
  );
}
