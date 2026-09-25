export type AnimationBudget = {
  compact: boolean;
  tablet: boolean;
  lowPower: boolean;
  dpr: number;
  frameInterval: number;
};

type NavigatorWithDeviceHints = Navigator & {
  deviceMemory?: number;
  hardwareConcurrency?: number;
  connection?: {
    saveData?: boolean;
  };
};

/**
 * Keeps canvas/WebGL work inside a predictable pixel + frame budget.
 * The visuals remain the same system, but the render cost adapts to the device.
 */
export function getAnimationBudget(width: number, height: number): AnimationBudget {
  const nav = navigator as NavigatorWithDeviceHints;
  const compact = width <= 700;
  const tablet = width <= 1100;
  const lowPower = Boolean(
    nav.connection?.saveData ||
    (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) ||
    (nav.deviceMemory && nav.deviceMemory <= 4),
  );

  const maxPixels = compact || lowPower
    ? 1_600_000
    : tablet
      ? 2_400_000
      : 4_000_000;

  const dprCap = compact || lowPower
    ? 1
    : tablet
      ? 1.15
      : 1.3;

  const nativeDpr = Math.max(1, window.devicePixelRatio || 1);
  const pixelLimitedDpr = Math.sqrt(maxPixels / Math.max(1, width * height));
  const dpr = Math.max(
    0.75,
    Math.min(nativeDpr, dprCap, pixelLimitedDpr),
  );

  return {
    compact,
    tablet,
    lowPower,
    dpr,
    frameInterval: compact || lowPower ? 33.3 : tablet ? 25 : 20,
  };
}
