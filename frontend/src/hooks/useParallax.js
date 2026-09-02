import { useLayoutEffect, useRef } from "react";

const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Attaches a slow, bounded scroll-driven drift to the returned ref.
 * Offset is derived from the element's distance to the viewport center,
 * so it stays subtle and self-contained wherever the element sits on the
 * page (no unbounded drift on long pages). Disabled entirely when the
 * user has prefers-reduced-motion set, and re-evaluated live if that
 * setting changes mid-session.
 */
export default function useParallax({ speed = 0.1, scale = 1 } = {}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mql = window.matchMedia(REDUCE_MOTION_QUERY);
    let ticking = false;

    const applyOffset = (offset) => {
      const scalePart = scale !== 1 ? ` scale(${scale})` : "";
      el.style.transform = `translate3d(0, ${offset}px, 0)${scalePart}`;
    };

    const update = () => {
      ticking = false;

      if (mql.matches) {
        applyOffset(0);
        return;
      }

      const rect = el.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const offset = ((viewportCenter - elementCenter) * speed).toFixed(1);
      applyOffset(offset);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    mql.addEventListener?.("change", update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mql.removeEventListener?.("change", update);
    };
  }, [speed, scale]);

  return ref;
}
