import { twMerge } from "tailwind-merge"
import { Solution } from "../App"
import { useDelay } from "../hooks"

export function SolutionRow({ height, solution }: { height?: number, solution?: Solution }) {

    const active = useDelay(!!solution, 1_500)
    const opacity = active ? 'opacity-100' : 'opacity-0'

    return (

        <div
            hidden={!active}
            className={twMerge(
                "w-full select-none transition rounded-md animate-bounce",
                opacity,
                active && "animate-scale-big-normal"
            )}
            style={{ height: height, zIndex: 100, backgroundColor: solution?.color }}>
            <div className="flex flex-col h-full justify-center items-center uppercase">
                <div className="font-bold">{solution?.group}</div>
                <div>{solution?.words.join(', ')}</div>
            </div>
        </div>
    )
}