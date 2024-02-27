import { useEffect, useState } from "react"

export function useDelay<T>(value: T, timeout: number): T {
  const [delayedValue, setDelayedValue] = useState<T>(value)

  useEffect(() => {
    setTimeout(() => setDelayedValue(value), timeout)
  }, [value])

  return delayedValue
}