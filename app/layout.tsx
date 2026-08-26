import type { Metadata } from "next";
import { Fraunces, Archivo } from "next/font/google";
import "./globals.css";
import { SessionBridge } from "@/components/SessionBridge";

// `opsz` has to be requested explicitly. Without it next/font instances
// Fraunces at the default optical size (14 — the *text* cut), which is much
// wider than the display cut the canvas is drawn in: the hero headline came
// out 929px against a 760px box and wrapped to three lines instead of two.
// With the axis present the browser applies optical sizing automatically.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SHATS",
  description:
    "Connecting rural Nigerian communities to real doctors by video, voice, or a basic phone — with a trained health worker in the village.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The font variables belong on <html>, not <body>: Tailwind v4 emits its
    // @theme tokens on :root, so --font-display resolves there. Declared any
    // lower and var(--font-fraunces) is undefined at resolution time, the whole
    // chain collapses, and every display heading silently falls back to sans.
    <html lang="en" className={`${fraunces.variable} ${archivo.variable}`}>
      <body>
        <SessionBridge />
        {children}
      </body>
    </html>
  );
}
