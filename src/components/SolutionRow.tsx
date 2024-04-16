import { twMerge } from "tailwind-merge"
import { useDelay } from "../hooks"
import { Grouping } from "../useGameState"

export type Solution = Grouping

export function SolutionRow({ height, solution }: { height?: number, solution?: Solution }) {

  const active = useDelay(!!solution, 1_500)

  const color = difficultyToColor(solution?.difficulty ?? -1)
  return (

    <div
      hidden={!active}
      className={twMerge(
        "w-full select-none transition rounded-md animate-bounce",
        active ? 'opacity-100' : 'opacity-0',
        active && "animate-scale-big-normal"
      )}
      style={{ height: height, zIndex: 100, backgroundColor: color }}>
      <div className="flex flex-col h-full justify-center items-center uppercase">
        <div className="text-center font-bold">{solution?.group}</div>
        <div>{solution?.words.join(', ')}</div>
      </div>
    </div>
  )
}

function difficultyToColor(difficulty: number) {
  if (difficulty === 1) {
    return 'rgb(247,222,108)'
  } else if (difficulty === 2) {
    return 'rgb(160,195,90)'
  } else if (difficulty === 3) {
    return 'rgb(175,196,239)'
  } else if (difficulty === 4) {
    return 'rgb(184,130,198)'
  }

  return 'black'
}