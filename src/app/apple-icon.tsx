import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon for iPhone/iPad, and the square thumbnail some apps show next to links. */
export default async function AppleIcon() {
  const fraunces = await readFile(path.join(process.cwd(), "src", "assets", "og-fonts", "fraunces-latin-400-normal.woff"));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#05080b" }}>
        <div
          style={{
            width: 132,
            height: 132,
            borderRadius: 999,
            border: "4px solid #c0a06b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Fraunces",
            fontSize: 56,
            color: "#d2b884",
          }}
        >
          NP
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Fraunces", data: fraunces, weight: 400, style: "normal" }] },
  );
}
