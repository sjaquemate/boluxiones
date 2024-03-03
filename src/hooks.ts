import { useEffect, useState } from "react"

export function useDelay<T>(value: T, timeout: number): T {
  const [delayedValue, setDelayedValue] = useState<T>(value)

  useEffect(() => {
    setTimeout(() => setDelayedValue(value), timeout)
  }, [value])

  return delayedValue
}


export function useTime(updateIntervalMS: number) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const startTime = new Date()
    const intervalId = setInterval(() => {
      const dt = (new Date()).getTime() - startTime.getTime()
      setTime(dt)
    }, updateIntervalMS);
    return () => {
      clearInterval(intervalId)
    };
  }, [])

  return time
}