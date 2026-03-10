"use client"

import {
  Gift,
  Headphones,
  Code,
  Code2,
  Wrench,
  Palette,
  Truck,
  Sparkles,
  Heart,
  Cpu,
  type LucideIcon,
} from "lucide-react"

const ICON_PRESETS: { Icon: LucideIcon; color: string; label: string }[] = [
  { Icon: Gift, color: "text-primary/40 dark:text-primary/35", label: "Sovg'a" },
  { Icon: Headphones, color: "text-[#ec4899]/40 dark:text-[#f472b6]/35", label: "Xizmat" },
  { Icon: Code2, color: "text-[#9333ea]/35 dark:text-[#a78bfa]/30", label: "Koding" },
  { Icon: Code, color: "text-[#6366f1]/40 dark:text-[#818cf8]/35", label: "Coding" },
  { Icon: Wrench, color: "text-[#7c3aed]/40 dark:text-[#8b5cf6]/35", label: "Servis" },
  { Icon: Palette, color: "text-[#ec4899]/35 dark:text-[#f472b6]/30", label: "Dizayn" },
  { Icon: Truck, color: "text-primary/35 dark:text-primary/30", label: "Yetkazish" },
  { Icon: Sparkles, color: "text-[#c084fc]/40 dark:text-[#c4b5fd]/35", label: "Aksiya" },
  { Icon: Heart, color: "text-[#ec4899]/30 dark:text-[#fb7185]/30", label: "Sevimli" },
  { Icon: Cpu, color: "text-[#6d28d9]/35 dark:text-[#7c3aed]/30", label: "IT" },
]

const FLY_POSITIONS = [
  { top: "12%", left: "8%" },
  { top: "55%", left: "15%" },
  { top: "75%", right: "22%" },
  { top: "20%", right: "12%" },
  { top: "45%", left: "30%" },
  { top: "10%", right: "30%" },
  { top: "65%", left: "45%" },
  { top: "35%", right: "38%" },
  { top: "80%", left: "25%" },
  { top: "25%", left: "50%" },
  { top: "50%", right: "25%" },
  { top: "15%", left: "70%" },
]

const SIZES = ["w-3 h-3", "w-3.5 h-3.5", "w-4 h-4 sm:w-5 sm:h-5", "w-4 h-4", "w-5 h-5 sm:w-6 sm:h-6"]

interface FlyingIconsProps {
  count?: number
  variant?: "header" | "footer" | "section" | "all"
  className?: string
}

export function FlyingIcons({ count = 10, variant = "all", className = "" }: FlyingIconsProps) {
  const delays = ["-0.5s", "-1s", "-1.5s", "-2s", "-2.5s", "-3s", "-0.2s", "-1.8s", "-2.2s", "-3.5s", "-1.2s", "-0.8s"]
  const usedPositions = FLY_POSITIONS.slice(0, count)
  const icons =
    variant === "header"
      ? ICON_PRESETS.filter((p) => ["Sovg'a", "Xizmat", "Aksiya", "Yetkazish", "Koding", "Coding"].includes(p.label))
      : variant === "footer"
        ? ICON_PRESETS.filter((p) => ["Sovg'a", "Xizmat", "Yetkazish", "Sevimli", "Koding", "Coding"].includes(p.label))
        : variant === "section"
          ? ICON_PRESETS.filter((p) => ["Koding", "Coding", "Dizayn", "Servis", "IT", "Aksiya"].includes(p.label))
          : ICON_PRESETS

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {usedPositions.slice(0, count).map((pos, i) => {
        const preset = icons[i % icons.length]
        const { Icon, color } = preset
        const sizeClass = SIZES[i % SIZES.length]
        const delay = delays[i % delays.length]
        return (
          <Icon
            key={i}
            className={`absolute ${sizeClass} ${color} animate-header-fly`}
            style={{
              ...pos,
              animationDelay: delay,
            }}
          />
        )
      })}
    </div>
  )
}
