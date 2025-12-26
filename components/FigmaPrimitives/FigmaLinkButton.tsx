"use client";
import { useRouter } from "next/navigation";
import React from "react";

export type FigmaLinkButtonState = "default" | "hover" | "disabled";
export type FigmaLinkButtonSize = "sm" | "xs";

export type FigmaLinkButtonProps = {
  label?: string;
  href?: string; 
  target?: "_self" | "_blank" | "_parent" | "_top";
  state?: FigmaLinkButtonState;
  size?: FigmaLinkButtonSize;
  className?: string;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Figma-derived Link Button text component with variants for size and state.
 * Visuals mirror the design node (underline via 0.5px bottom border).
 */
export default function FigmaLinkButton({
  label = "Shop Now",
  href,
  target,
  state = "default",
  size = "sm",
  className = "",
  disabled: disabledProp,
  ...rest
}: FigmaLinkButtonProps) {
  const router = useRouter();
  const isSm = size === "sm";
  const isDisabled = state === "disabled";
  const isHover = state === "hover";

  const baseWrap =
    "inline-flex items-center justify-center px-0 py-px relative enabled:cursor-pointer disabled:cursor-default";

  const visuallyDisabled = isDisabled || !!disabledProp;

  const underlineClass = visuallyDisabled
    ? "border-ui-grey-500 border-b-[0.5px] border-l-0 border-r-0 border-t-0 border-solid"
    : isHover
    ? "" // Hover variant in design shows no underline
    : "border-black border-b-[0.5px] enabled:hover:border-b-0 border-l-0 border-r-0 border-t-0 border-solid"; // Default with hover removal

  const textClass = visuallyDisabled
    ? `${isSm ? "text-[14px]" : "text-[12px]"} text-ui-grey-500`
    : `${isSm ? "text-[14px]" : "text-[12px]"} text-black`;

  const ariaDisabled = visuallyDisabled ? true : undefined;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Allow consumer to intercept first
    rest.onClick?.(e);
    if (e.defaultPrevented) return;
    if (visuallyDisabled) return;
    if (!href) return;

    // External vs internal navigation
    const isInternal = href.startsWith("/");
    if (!isInternal) {
      const navTarget = target || "_self";
      window.open(href, navTarget, "noopener,noreferrer");
      return;
    }
    // Internal route: SPA navigate
    router.push(href);
  };

  // No keydown handler needed; native button handles keyboard activation.

  return (
    <button
      type="button"
      disabled={visuallyDisabled}
      aria-disabled={ariaDisabled}
      className={`${baseWrap} ${underlineClass} font-bold ${textClass} ${className}`}
      onClick={handleClick}
      {...rest}>
      {label}
    </button>
  );
}
