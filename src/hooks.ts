import { useEffect, useRef, useState } from "react"

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

export function useContainer() {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number>()
  const [height, setHeight] = useState<number>()

  useEffect(() => {
    setWidth(ref.current?.offsetWidth)
    setHeight(ref.current?.offsetHeight)
  }, [ref, ref.current])

  return {
    ref: ref,
    width: width,
    height: height
  } as const
}

export function useAlertState() {
  const [active, setActive] = useState(false)
  const [label, setLabel] = useState("")
  const triggerAlert = (label: string, delay: number, msToDisable: number) => {
    setLabel(label)
    setTimeout(() => setActive(true), delay)
    setTimeout(() => setActive(false), msToDisable)
  }

  return { label, active, triggerAlert } as const
}
