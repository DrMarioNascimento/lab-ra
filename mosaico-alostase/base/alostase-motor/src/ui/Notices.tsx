import type { Notice } from "../types";
import { cx } from "./styles";

export function Notices({ notices, className }: { notices: Notice[]; className?: string }) {
  if (notices.length === 0) return null;
  return (
    <div className={cx("grid gap-2", className)} aria-live="polite">
      {notices.map((notice) => (
        <p
          key={notice.text}
          className={cx(
            "pl-3 text-sm leading-relaxed",
            notice.kind === "info" && "border-l-2 border-accent text-fg",
            notice.kind === "previsao-certa" && "border-l-2 border-fg/50 text-fg",
            notice.kind === "previsao-errada" && "rounded-r-md border-l-2 border-accent bg-accent-dim py-2 pr-3 text-fg",
          )}
        >
          {notice.text}
        </p>
      ))}
    </div>
  );
}
