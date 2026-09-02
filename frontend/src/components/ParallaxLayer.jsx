import useParallax from "../hooks/useParallax";

/**
 * Wraps its children in a div that drifts slightly on scroll. Kept as a
 * separate wrapper (rather than transforming children directly) so a
 * child can still own its own CSS transforms — e.g. a hover scale on an
 * <img> — without the two fighting over the `transform` property.
 * `scale` gives the wrapper bleed room so the drift never reveals an
 * edge inside a clipped (overflow-hidden) parent.
 */
export default function ParallaxLayer({ children, className = "", speed = 0.1, scale = 1.12 }) {
  const ref = useParallax({ speed, scale });

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
