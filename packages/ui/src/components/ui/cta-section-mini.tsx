import { cn } from "../../lib/utils";

export type CTASectionMiniProps = {
  heading?: string;
  body?: string;
  buttonText?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
};

/**
 * Mini-CTA для правой колонки статей — компактный жёлтый блок,
 * визуально соразмерный sidebar-айтемам (~300px ширина).
 */
export function CTASectionMini({
  heading = "Оставьте заявку",
  body = "",
  buttonText = "оставить заявку",
  href = "#contact",
  onClick,
  className,
}: CTASectionMiniProps) {
  const buttonClass =
    "w-full flex items-center justify-center bg-[#0A0A0A] text-[#F0F0F0] px-4 py-[10px] font-['Loos_Condensed',sans-serif] text-[14px] font-medium uppercase tracking-[0.04em] leading-[1.16] rounded-sm transition-opacity hover:opacity-85 active:opacity-70 cursor-pointer";

  return (
    <div
      className={cn(
        "bg-[#FFCC00] rounded-sm p-4 flex flex-col gap-3",
        className,
      )}
    >
      <h3 className="font-heading text-[18px] font-bold uppercase leading-[1.16] tracking-[-0.01em] text-[#0A0A0A]">
        {heading}
      </h3>
      {body && (
        <p className="text-[13px] leading-[1.32] text-[#0A0A0A]">{body}</p>
      )}
      {onClick ? (
        <button type="button" onClick={onClick} className={buttonClass}>
          {buttonText}
        </button>
      ) : (
        <a href={href} className={buttonClass}>
          {buttonText}
        </a>
      )}
    </div>
  );
}
