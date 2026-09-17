import Link from "next/link";
import { headers } from "next/headers";
import { readBffEnvironment } from "@/config/env";
import { readPersonaTokenConfiguration } from "@/config/persona-tokens";
import { DEMO_GRADE_PERSONAS } from "@/lib/persona/persona";
import { resolveRequestPersona } from "@/lib/persona/cookies";
import { ScreenTransition } from "./_components/screen-transition";
import { TabBar } from "./_components/tab-bar";
import { DemoPersonaSelector } from "./_components/demo-persona-selector";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./globals.css";

const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  weight: "45 920",
  display: "swap",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "Crabit",
  description: "Crabit frontend",
  appleWebApp: {
    capable: true,
    title: "Crabit",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#fb75bb",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const requestHeaders = new Headers(await headers());
  const environment = readBffEnvironment();
  const demo = environment.backendProfile === "demo";
  const tokens = demo ? readPersonaTokenConfiguration("demo") : null;
  const selected = demo ? resolveRequestPersona(requestHeaders, "demo") : null;
  const available = (["owner", ...DEMO_GRADE_PERSONAS] as const).filter(
    (persona) => Boolean(tokens?.active?.[persona]),
  );
  return (
    <html lang="ko" className={`${pretendard.variable} overscroll-y-none`}>
      <body className="overscroll-y-none font-sans">
        <div className="bg-layer-default max-w-app mx-auto min-h-dvh w-full">
          {demo && (
            <DemoPersonaSelector available={available} selected={selected} />
          )}
          {demo && (!selected || !tokens?.active?.[selected]) ? (
            <main className="p-6">
              <p>대표 선택을 확인해 주세요.</p>
              <Link prefetch={false} className="underline" href="/demo">
                대표 선택으로 이동
              </Link>
            </main>
          ) : (
            <ScreenTransition>{children}</ScreenTransition>
          )}
          <TabBar />
        </div>
      </body>
    </html>
  );
}
