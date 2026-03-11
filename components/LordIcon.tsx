"use client";

interface LordIconProps {
  src: string;
  trigger?:
    | "hover"
    | "click"
    | "loop"
    | "loop-on-hover"
    | "boomerang"
    | "morph";
  size?: number;
  target?: string;
}

export default function LordIcon({
  src,
  trigger = "hover",
  size = 64,
  target,
}: LordIconProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LordIconElement = "lord-icon" as any;
  return (
    <LordIconElement
      src={src}
      trigger={trigger}
      target={target}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}
