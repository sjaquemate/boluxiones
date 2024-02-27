import { twMerge } from 'tailwind-merge';
import { InformationCircleIcon } from '@heroicons/react/outline';
import { useEffect, useRef, useState } from 'react';
import { shuffleInPlace, shuffleSubsetInplace } from './arrayUtil';
import { SolutionRow } from './components/SolutionRow';
import logoTango from './assets/logoTango.jpg'

const orderedPositions = createOrderedPositions()

function createOrderedPositions() {
  const orderedPositions = []
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      orderedPositions.push({ i: i, j: j })
    }
  }
  return orderedPositions
}

function getOrderedIndexOfPosition(position: Position) {
  return orderedPositions.findIndex(({ i, j }) => i === position.i && j === position.j)!
}

function getFontSize(wordLength: number) {
  if (wordLength < 7) {
    return "text-md"
  } else if (wordLength < 6) {
    return "text-sm"
  } else if (wordLength < 10) {
    return "text-xs"
  } else if (wordLength < 20) {
    return "text-[10px]"
  } else {
    return "text-xs"
  }
}

function Tile({ setTileWidth, tileData, containerWidth }: { setTileWidth: (width: number) => void, tileData: TileData, containerWidth?: number }) {

  const { word, status, selected, setSelected, initialPosition, position } = tileData
  const fontSize = getFontSize(word.length)

  const [tileRef, tileWidth] = useContainer()

  useEffect(() => {
    if (tileWidth) setTileWidth(tileWidth)
  }, [tileWidth])

  const onClick = () => {
    setSelected(!selected)
  }

  const size = selected ? 'bg-neutral-600' : ''


  const singleTranslation = containerWidth && tileWidth ? tileWidth + (containerWidth - 4 * tileWidth) / 3 : 0

  const translateX = (position.j - initialPosition.j) * singleTranslation
  const translateY = (position.i - initialPosition.i) * singleTranslation

  const zIndex = 16 - getOrderedIndexOfPosition(position)

  let animation = ''
  if(status === "correct") {
    animation = 'animate-bounce-correct'
  } else if(status === "wrong") {
    animation = 'animate-bounce-wrong'
  }

  return <div ref={tileRef} key={word} onClick={onClick}
    className={twMerge("cursor-pointer aspect-square transition")}
    style={{
      transform: `translate(${translateX}px, ${translateY}px)`,
      transitionDuration: `400ms`,
      transitionDelay: `1000ms`,
      zIndex: zIndex
    }}
  >
    <div className={twMerge(
      "w-full h-full bg-neutral-200 rounded-sm transition",
      size,
      animation
    )}
      style={{

      }}>

      <div key={word} className={
        twMerge('flex h-full w-full items-center justify-center font-bold uppercase select-none',
          fontSize,
          `${selected ? 'text-white' : 'text-black'}`
        )}>{word}</div>
    </div>
  </div>
}

type TileData = {
  word: string
  selected: boolean
  status: TileStatus
  setSelected: (selected: boolean) => void
  initialPosition: Position
  position: Position
}

type Position = {
  i: number,
  j: number
}

type WordPosition = {
  word: string
  position: Position
}

type Attempt = {
  correct: boolean
  words: string[]
}

export type Solution = Grouping

type Grouping = {
  group: string
  color: string
  words: string[]
}


const groupings: Grouping[] = [
  {
    group: "Equipos de futbol",
    color: 'rgba(184,130,198,1)',
    words: ["Belgrano", "San Lorenzo", "Lanus", "Tigre"]
  },
  {
    group: "Sabores de alfajor",
    color: "rgba(160,195,90,1)",
    words: ["Blanco", "Negro", "Frutal", "Glaseado"]
  },
  {
    group: "Plazas y parques",
    color: "rgba(175,196,239,1)",
    words: ["Mayo", "Lezama", "Sarmiento", "Independencia"]
  },
  {
    group: "Radios",
    color: "rgba(247,222,108,1)",
    words: ["Aspen", "Disney", "Mitre", "Rivadavia"]
  }
]

type TileStatus = "correct" | "wrong" | undefined

function useTileDatas(wordList: string[]): [TileData[], () => void, () => void, () => void, Solution[], number] {
  const shuffledWords = shuffleSubsetInplace([...wordList], wordList.map((_,index) => index))
  const [data, setData] = useState<{ word: string, status: TileStatus }[]>(() => shuffledWords.map(word => ({word: word, status: undefined})))
  const words = data.map(d => d.word)
  

  const [positions, setPositions] = useState<Position[]>(() => orderedPositions)

  const [selectedWords, setSelectedWords] = useState<string[]>(() => [])

  const [attemps, setAttempts] = useState<Attempt[]>(() => [])
  function addAttempt(attempt: Attempt) {
    setAttempts(prev => [...prev, attempt])
  }

  const correctAttempts = attemps.filter(attempt => attempt.correct)
  const numberOfIncorrectAttempts = attemps.length - correctAttempts.length
  const triesLeft = 4 - numberOfIncorrectAttempts

  const solutions: Solution[] = correctAttempts.map(attempt => (groupings.find(grouping => grouping.group === areSameGroup(attempt.words)!)!))
  const numberOfSolutions = solutions.length

  const wordsOutOfPlay = correctAttempts.flatMap(attempt => attempt.words)
  const wordsInPlay = wordList.filter(word => !wordsOutOfPlay.includes(word))

  function setTileStatus(word: string, status: TileStatus) {
    setData(data => data.map(d => d.word === word ? { ...d, status: status } : d))
  }

  function shuffle() {
    const indicesInPlay = wordsInPlay.map(value => words.findIndex(v => v === value))
    setData((data) => shuffleSubsetInplace([...data], indicesInPlay))
  }

  function deselectAll() {
    setSelectedWords(() => [])
  }

  function submit() {
    if (selectedWords.length === 4) {
      
      const correct = !!areSameGroup(selectedWords)
      addAttempt({ correct: correct, words: selectedWords })
      setTimeout(() => setSelectedWords(() => []), 1_500)

      if (correct) {
        const row = Math.min(numberOfSolutions, 3)
        toTop(selectedWords, row)
        setTimeout(() => setTileStatus(selectedWords[0], "correct"), 0)
        setTimeout(() => setTileStatus(selectedWords[1], "correct"), 100)
        setTimeout(() => setTileStatus(selectedWords[2], "correct"), 200)
        setTimeout(() => setTileStatus(selectedWords[3], "correct"), 300)
      } else if (oneDifferent(selectedWords)) {
        setTileStatus(selectedWords[0], "wrong")
        setTileStatus(selectedWords[1], "wrong")
        setTileStatus(selectedWords[2], "wrong")
        setTileStatus(selectedWords[3], "wrong")
        setTimeout(() => setTileStatus(selectedWords[0], undefined), 1_000)
        setTimeout(() => setTileStatus(selectedWords[1], undefined), 1_000)
        setTimeout(() => setTileStatus(selectedWords[2], undefined), 1_000)
        setTimeout(() => setTileStatus(selectedWords[3], undefined), 1_000)
      } else {
        setTileStatus(selectedWords[0], "wrong")
        setTileStatus(selectedWords[1], "wrong")
        setTileStatus(selectedWords[2], "wrong")
        setTileStatus(selectedWords[3], "wrong")
        setTimeout(() => setTileStatus(selectedWords[0], undefined), 1_000)
        setTimeout(() => setTileStatus(selectedWords[1], undefined), 1_000)
        setTimeout(() => setTileStatus(selectedWords[2], undefined), 1_000)
        setTimeout(() => setTileStatus(selectedWords[3], undefined), 1_000)
      }
    }
  }

  function wordToPosition(positions: Position[], srcWord: string, dstPosition: Position): Position[] {

    const srcIndex = words.findIndex(word => word === srcWord)
    const srcPosition = positions.at(srcIndex)!

    return positions.map((position, index) => {
      if (dstPosition.i === position.i && dstPosition.j === position.j) {
        return srcPosition
      } else if (srcIndex === index) {
        return dstPosition
      } else {
        return position
      }
    })

  }

  function toTop(words: string[], row: number) {
    let currentPositions = [...positions]
    currentPositions = wordToPosition(currentPositions, words[0], { i: row, j: 0 })
    currentPositions = wordToPosition(currentPositions, words[1], { i: row, j: 1 })
    currentPositions = wordToPosition(currentPositions, words[2], { i: row, j: 2 })
    currentPositions = wordToPosition(currentPositions, words[3], { i: row, j: 3 })
    setPositions(currentPositions)
  }

  function addSelectedWord(word: string) {
    setSelectedWords(prev => {
      if (prev.length >= 4) {
        return prev
      }
      return [...prev, word]
    })
  }

  function removeSelectedWord(word: string) {
    setSelectedWords(prev => prev.filter(prev => prev !== word))
  }

  return [data.map((d, index) => {
    const word = d.word
    return {
      word: word,  // data
      status: d.status,  // data
      selected: selectedWords.includes(word),  // derived data
      setSelected: (selected: boolean) => {  // actions
        if (selected && wordsInPlay.includes(word)) {
          addSelectedWord(word)
        } else {
          removeSelectedWord(word)
        }
      },
      initialPosition: orderedPositions.at(index)!,  // position
      position: positions.at(index)!, // position
    }
  }), shuffle, deselectAll, submit, solutions, triesLeft]


}

function useContainer() {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number>()
  useEffect(() => {
    setWidth(ref.current?.offsetWidth)
  }, [ref])

  return [ref, width] as const
}



const wordList = groupings.flatMap(grouping => grouping.words)

function findGroup(word: string) {
  return groupings.find(grouping => grouping.words.includes(word))!.group
}

function areSameGroup(words: string[]): string | undefined {
  const groups = words.map(word => findGroup(word))
  if (new Set(groups).size === 1) {
    return groups[0]
  }
  return undefined
}

function oneDifferent(words: string[]): boolean {
  const groups = words.map(word => findGroup(word))
  return (new Set(groups).size === 2)
}

function ButtonButton({ label, onClick }: { label: string, onClick: () => void }) {
  return <button
    onClick={onClick}
    className="rounded-3xl font-bold text-center text-black py-2 px-4 border-solid border-2 border-black">
    {label}
  </button>
}

export default function App() {

  const [tileDatas, shuffle, deselectAll, submit, solutions, triesLeft] = useTileDatas(wordList)

  const [containerRef, containerWidth] = useContainer()
  const [tileWidth, setTileWidth] = useState<number>()

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="px-5 py-2 bg-slate-200">
        <p className="text-sm italic mx-5 text-center">
          <a className="underline font-bold" href="https://www.leer.org/donar">
            apoyá
          </a>{' '}
          la lectura de los boludles más pequeños
        </p>
      </div>
      {/* <div className='flex w-full justify-center -translate-x-2'>
        <img src={logoTango} width={300}/>
      </div> */}
      <div className="mt-6 flex items-center">
        <div className="flex-1"></div>
        <p className="text-2xl">Conexiones Argentinas</p>
        <div className="flex-1">
          <div className="flex justify-end mr-6">
            <InformationCircleIcon
              className="h-6 w-6 cursor-pointer"
              onClick={() => { }}
            />
          </div>
        </div>
      </div>
      {/* <div className="mt-0 flex justify-center items-center text-neutral-300 ">
        _____________________________________________________________-
      </div> */}
      <div className="mt-4 flex justify-center items-center ">
        Creá cuatro grupos de cuatro!
      </div>
      <div className="mt-6 mx-2">

        <div className="flex justify-center w-full ">
          <div ref={containerRef} className="relative w-full max-w-[500px]" >
            <div className="absolute w-full h-full" >
              <div className="flex flex-col gap-y-2">
                <SolutionRow solution={solutions.at(0)} height={tileWidth} />
                <SolutionRow solution={solutions.at(1)} height={tileWidth} />
                <SolutionRow solution={solutions.at(2)} height={tileWidth} />
                <SolutionRow solution={solutions.at(3)} height={tileWidth} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {tileDatas.map((tileData, index) => <Tile setTileWidth={setTileWidth} tileData={tileData} containerWidth={containerWidth} />)}
            </div>
          </div>
        </div>
      </div>
      <div>
        tries left {triesLeft}
      </div>
      <div className='mt-10 gap-x-4 flex justify-center'>
        <ButtonButton label='Shuffle' onClick={shuffle} />
        <ButtonButton label='Deseleccionar' onClick={deselectAll} />
        <ButtonButton label='Enviar' onClick={submit} />
      </div>
    </div>
  )
}
