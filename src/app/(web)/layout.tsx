import type { ReactNode } from "react";
import { WebNav } from "@/components/web/WebNav";
import { WebFooter } from "@/components/web/WebFooter";
import "./web.css";

export default function WebLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <WebNav />
      {children}
      <WebFooter />
    </>
  );
}
