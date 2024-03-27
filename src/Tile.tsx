import { useEffect } from "react"
import { useContainer } from "./hooks"
import { twMerge } from "tailwind-merge"

export type TileTransitionStatus = "solved" | "attempt" | "wrong" | undefined

export type TileData = {
  word: string
  selected: boolean
  status: TileTransitionStatus
  setSelected: (selected: boolean) => void
  dx: number
  dy: number
}

export type Position = {
  i: number,
  j: number
}

function getFontSize(wordLength: number) {
  if (wordLength < 8) {
    return "text-md"
  } else if (wordLength < 11) {
    return "text-xs"
  } else if (wordLength < 14) {
    return "text-[10px]"
  } else {
    return "text-[7px]"
  }
}

export function Tile({ setTileHeight, tileData, containerWidth }: { setTileHeight: (height: number) => void, tileData: TileData, containerWidth?: number }) {

  const { word, status, selected, setSelected, dx, dy } = tileData
  const fontSize = getFontSize(Math.max(...word.split('\n').map(partial => partial.length)))

  const { ref: tileRef, height: tileHeight, width: tileWidth } = useContainer()

  useEffect(() => {
    if (tileHeight) {
      setTileHeight(tileHeight)
    }
  }, [tileHeight])

  const onClick = () => {
    setSelected(!selected)
  }

  const singleTranslation = containerWidth && tileWidth ? tileWidth + (containerWidth - 4 * tileWidth) / 3 : 0
  const translateX = (dx) * singleTranslation
  const translateY = (dy) * singleTranslation

  const zIndex = 16

  let animation = ''
  if (status === "attempt") {
    animation = 'animate-bounce-attempt'
  } else if (status === "wrong") {
    animation = 'animate-shake-wrong'
  }

  return <div ref={tileRef} key={word} onClick={onClick}
    className={twMerge("cursor-pointer aspect-square transition")}
    style={{
      transform: `translate(${translateX}px, ${translateY}px)`,
      transitionDuration: `400ms`,
      transitionDelay: `1000ms`,
      opacity: status === 'solved' ? 0 : 1,
      zIndex: zIndex
    }}
  >
    <div className={twMerge(
      "w-full h-full rounded-sm transition",
      selected ? 'bg-neutral-500' : 'bg-white',
      animation
    )}
      style={{

      }}>

      <div key={word} className={
        twMerge('flex h-full w-full items-center justify-center font-bold uppercase select-none whitespace-pre text-center',
          fontSize,
          selected ? 'text-white' : 'text-black'
        )}>{word}</div>
    </div>
  </div>
}