import { ImageResponse } from "next/og";
import { getV2Chapter } from "@/lib/content-v2";

export const alt = "Pyloft chapter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ink950 = "#0a0a0c";
const ink800 = "#26262e";
const ink400 = "#9b9baa";
const ink100 = "#e8e8ee";
const ember = "#f59e0b";

export default async function ChapterOgImage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter: chapterSlug } = await params;
  const chapter = await getV2Chapter(chapterSlug);

  const number = chapter?.number ?? 0;
  const title = chapter?.title ?? "Pyloft";
  const blurb = chapter?.blurb ?? "";
  const stepCount = chapter?.lessons.reduce(
    (acc, l) => acc + l.steps.length,
    0,
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: ink950,
          color: ink100,
          display: "flex",
          flexDirection: "column",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: ember,
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Chapter {String(number).padStart(2, "0")}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 96,
            lineHeight: 1.05,
            fontWeight: 600,
            marginTop: 32,
            color: ink100,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 32,
            lineHeight: 1.35,
            color: ink400,
            marginTop: 32,
            maxWidth: 1000,
          }}
        >
          {blurb}
        </div>

        <div style={{ flex: 1 }} />

        <div
          style={{
            display: "flex",
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
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: ink400,
            }}
          >
            {stepCount ? `${stepCount} interactive steps` : "Interactive Python"}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
