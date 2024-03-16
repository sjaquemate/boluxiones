import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"

export function Button({ label, onClick, active, filled, timeoutAfterClick }:
  { label: string, onClick: () => void, active: boolean, filled?: boolean, timeoutAfterClick: number }) {
  const [justClicked, setJustClicked] = useState(false)
  const disabled = !active || justClicked

  useEffect(() => {
    if (justClicked) {
      setTimeout(() => setJustClicked(false), timeoutAfterClick)
    }
  }, [justClicked])

  function submit() {
    if (disabled) return
    setJustClicked(true)
    onClick()
  }

  return <button
    onClick={submit}
    className={twMerge(
      "rounded-3xl font-bold text-center  py-2 px-4 border-solid border-2",
      "transition duration-300",
      (filled && !disabled) ? "bg-black text-white" : "bg-white",
      disabled ? "text-neutral-400 border-neutral-400" : "border-black",
    )}>
    {label}
  </button>
}