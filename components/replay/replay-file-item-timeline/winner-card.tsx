import { cn } from '@nextui-org/system';
import { TimelineWinnerCardProps } from './types'
import  { DefaultLogoOnlyIconForecolor } from '@/components/logo/logo-default-only-icon';
import { logo } from '@/components/primitives';
 
export default function TimelineWinnerCard({ roundData }: TimelineWinnerCardProps) {
  const radiusTarget = roundData.winner === "ct" ? "Top" : "Bottom"
  const winnerLabel = roundData.winner?.toUpperCase()

  const borderColor = `hsl(var(--nextui-${roundData.winner === "ct" ? "primary" : "warning"}))`
  const contentColor = roundData.winner === "ct" ? "blue" : "yellow"

  // from-[#00b7fa] to-[#01cfea]
  const iconColor = roundData.winner === "ct" ? "hsl(var(--nextui-primary))" : "hsl(var(--nextui-warning))"

  const RoundIcon = () => {
    if (roundData.keyEvents.some(e => e.includes('Clutch'))) {
      return (<DefaultLogoOnlyIconForecolor fill={iconColor} />)
    }

    return (<div className={logo({ color: contentColor})}>{roundData.roundNumber}</div>)
  }

  return (
    <div 
    className={cn(
      "flex items-center justify-center",
      roundData.winner === "ct" ? "bg-primary-100" :"bg-warning-100" 
    )}

      style={{
        [`border${radiusTarget}RightRadius`]: "12px",
        [`border${radiusTarget}LeftRadius`]: "12px",
        [`border${radiusTarget}Style`]: "solid",
        [`border${radiusTarget}Width`]: "1px",
        [`border${radiusTarget}Color`]: borderColor,
      }}
  >
     <span className="h-6 text-small">

     <RoundIcon />

     </span>
  </div>
  )
}