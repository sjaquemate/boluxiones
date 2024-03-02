import { twMerge } from "tailwind-merge"
import { Solution } from "../App"
import { useDelay } from "../hooks"


function difficultyToColor(difficulty: number) {
  if (difficulty === 1) {
    return 'rgba(184,130,198,1)'
  } else if (difficulty === 2) {
    return 'rgba(160,195,90,1)'
  } else if (difficulty === 3) {
    return 'rgba(175,196,239,1)'
  } else if (difficulty === 4) {
    return 'rgba(247,222,108,1)'
  }

  return 'black'
}

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
        <div className="font-bold">{solution?.group}</div>
        <div>{solution?.words.join(', ')}</div>
      </div>
    </div>
  )
}