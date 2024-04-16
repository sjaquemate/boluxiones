import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

export function Button({ label, onSubmit, active, filled, timeoutAfterClick, onClickInactive }:
  { label: string, onSubmit: () => void, active: boolean, filled?: boolean, timeoutAfterClick: number, onClickInactive?: () => void }) {
  const [justClicked, setJustClicked] = useState(false)
  const disabled = !active || justClicked

  useEffect(() => {
    if (justClicked) {
      setTimeout(() => setJustClicked(false), timeoutAfterClick)
    }
  }, [justClicked])

  function onClick() {
    if (!active && onClickInactive) {
      onClickInactive()
    } 
    if(!disabled) {
      setJustClicked(true)
      onSubmit()
    }
  }

  return <button
    onClick={onClick}
    className={twMerge(
      "rounded-3xl font-bold text-center  py-2 px-4 border-solid border-2 select-none",
      "transition duration-300",
      (filled && !disabled) ? "bg-black text-white" : "bg-white/0",
      disabled ? "text-black border-black" : "border-black",
    )}>
    {label}
  </button>
}