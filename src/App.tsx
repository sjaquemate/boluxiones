import { twMerge } from 'tailwind-merge';
import { InformationCircleIcon } from '@heroicons/react/outline';
import { useEffect, useRef, useState } from 'react';
import { shuffleSubsetInplace } from './arrayUtil';
import { SolutionRow } from './components/SolutionRow';
import Mate from './assets/mate.png'
import tango2 from './assets/tango2.jpg'
import { useDelay } from './hooks';
import { Grouping, emptyGrouping, useGroupings } from './words';

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

function Tile({ setTileWidth, tileData, containerWidth }: { setTileWidth: (width: number) => void, tileData: TileData, containerWidth?: number }) {

  const { word, status, selected, setSelected, initialPosition, position } = tileData
  const fontSize = getFontSize(Math.max(...word.split('\n').map(partial => partial.length)))

  const [tileRef, tileWidth] = useContainer()

  useEffect(() => {
    if (tileWidth) {
      setTileWidth(tileWidth)
    }
  }, [tileWidth])

  const onClick = () => {
    setSelected(!selected)
  }

  const singleTranslation = containerWidth && tileWidth ? tileWidth + (containerWidth - 4 * tileWidth) / 3 : 0
  const translateX = (position.j - initialPosition.j) * singleTranslation
  const translateY = (position.i - initialPosition.i) * singleTranslation

  const zIndex = 16 - getOrderedIndexOfPosition(position)

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
      selected ? 'bg-[#6CACE4]' : 'bg-neutral-200',
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

type TileData = {
  word: string
  selected: boolean
  status: TileTransitionStatus
  setSelected: (selected: boolean) => void
  initialPosition: Position
  position: Position
}

type Position = {
  i: number,
  j: number
}

type Attempt = {
  correct: boolean
  words: string[]
}

export type Solution = Grouping

type TileTransitionStatus = "solved" | "attempt" | "wrong" | undefined

function useTileDatas(groupings: Grouping[], shuffleInitial: boolean, oneAwayFn: () => void) {

  const [data, setData] = useState<{ word: string, status: TileTransitionStatus }[]>(() => [])
  const wordList = data.flatMap(d => d.word)
  const [gameEnded, setGameEnded] = useState(false)
  const [positions, setPositions] = useState<Position[]>(() => orderedPositions)
  const [selectedWords, setSelectedWords] = useState<string[]>(() => [])
  const [attempts, setAttempts] = useState<Attempt[]>(() => [])

  const words = data.map(d => d.word)

  const correctAttempts = attempts.filter(attempt => attempt.correct)
  const numberOfIncorrectAttempts = attempts.length - correctAttempts.length
  const noOfAttemptsRemaining = Math.max(4 - numberOfIncorrectAttempts, 0)

  const wordsOutOfPlay = correctAttempts.flatMap(attempt => attempt.words)
  const wordsInPlay = wordList.filter(word => !wordsOutOfPlay.includes(word))

  const solutions: Solution[] = correctAttempts.map(attempt => (groupings.find(grouping => grouping.group === areSameGroup(attempt.words, groupings)!)!))
  const noOfSolutions = solutions.length

  useEffect(() => {
    const words = groupings.flatMap(grouping => grouping.words)
    const shuffledWords = shuffleInitial ? shuffleSubsetInplace([...words], words.map((_, index) => index)) : [...words]
    setData( () => [...shuffledWords].map(word => ({ word: word, status: undefined })))  
  }, [groupings])

  useEffect(() => {
    if (noOfAttemptsRemaining === 0) {
      setGameEnded(true)
    }
  }, [noOfAttemptsRemaining])

  useEffect(() => {
    if (gameEnded) {
      solve()
    }
  }, [gameEnded])

  function addAttempt(attempt: Attempt) {
    setAttempts(prev => [...prev, attempt])
  }

  function setTileStatus(word: string, status: TileTransitionStatus) {
    setData(data => data.map(d => d.word === word ? { ...d, status: status } : d))
  }

  function shuffle() {
    const indicesInPlay = wordsInPlay.map(value => words.findIndex(v => v === value))
    setData((data) => shuffleSubsetInplace([...data], indicesInPlay))
  }

  function deselectAll() {
    setSelectedWords(() => [])
  }

  function submit(submittedWords: string[]) {
    if (submittedWords.length !== 4) return

    const correct = !!areSameGroup(submittedWords, groupings)
    addAttempt({ correct: correct, words: submittedWords })
  }

  useEffect(() => {
    const lastAttempt = attempts.at(-1)
    if(!lastAttempt) return
    
    if (lastAttempt.correct) {
      const rowIndex = Math.min(noOfSolutions-1, 3)
      toTop(lastAttempt.words, rowIndex)
      setTimeout(() => setTileStatus(lastAttempt.words[0], "attempt"), 0)
      setTimeout(() => setTileStatus(lastAttempt.words[1], "attempt"), 100)
      setTimeout(() => setTileStatus(lastAttempt.words[2], "attempt"), 200)
      setTimeout(() => setTileStatus(lastAttempt.words[3], "attempt"), 300)
      setTimeout(() => setTileStatus(lastAttempt.words[0], "solved"), 1_000)
      setTimeout(() => setTileStatus(lastAttempt.words[1], "solved"), 1_000)
      setTimeout(() => setTileStatus(lastAttempt.words[2], "solved"), 1_000)
      setTimeout(() => setTileStatus(lastAttempt.words[3], "solved"), 1_000)
      setTimeout(() => deselectAll(), 2_000)
    } else if (oneAway(lastAttempt.words, groupings)) {
      oneAwayFn()
      setTimeout(() => setTileStatus(lastAttempt.words[0], "attempt"), 0)
      setTimeout(() => setTileStatus(lastAttempt.words[1], "attempt"), 100)
      setTimeout(() => setTileStatus(lastAttempt.words[2], "attempt"), 200)
      setTimeout(() => setTileStatus(lastAttempt.words[3], "attempt"), 300)
      setTimeout(() => setTileStatus(lastAttempt.words[0], "wrong"), 1_000)
      setTimeout(() => setTileStatus(lastAttempt.words[1], "wrong"), 1_000)
      setTimeout(() => setTileStatus(lastAttempt.words[2], "wrong"), 1_000)
      setTimeout(() => setTileStatus(lastAttempt.words[3], "wrong"), 1_000)
    } else {
      setTimeout(() => setTileStatus(lastAttempt.words[0], "attempt"), 0)
      setTimeout(() => setTileStatus(lastAttempt.words[1], "attempt"), 100)
      setTimeout(() => setTileStatus(lastAttempt.words[2], "attempt"), 200)
      setTimeout(() => setTileStatus(lastAttempt.words[3], "attempt"), 300)
      setTimeout(() => setTileStatus(lastAttempt.words[0], "wrong"), 1_000)
      setTimeout(() => setTileStatus(lastAttempt.words[1], "wrong"), 1_000)
      setTimeout(() => setTileStatus(lastAttempt.words[2], "wrong"), 1_000)
      setTimeout(() => setTileStatus(lastAttempt.words[3], "wrong"), 1_000)
    }
  }, [attempts])

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

  function findUnsolvedGroupings() {
    return groupings.filter(grouping => !solutions.includes(grouping))
  }

  async function solve() {

    const unsolvedGroupings = findUnsolvedGroupings()

    for(const grouping of unsolvedGroupings) {
      await new Promise(resolve => setTimeout(() => {
        deselectAll()
        setSelectedWords(grouping.words)
        submit(grouping.words)
        return resolve(true)
      }, 3_000));
    }
  }

  // function setSelectedWordsIncrementalDelay(words: string[], )

  const tileDatas = data.map((d, index) => {
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
  })

  const canDeselect = !gameEnded && selectedWords.length > 0
  const canSubmit = !gameEnded && selectedWords.length === 4
  return {
    tileDatas: tileDatas,
    shuffle: shuffle,
    canDeselect: canDeselect,
    deselectAll: deselectAll,
    canSubmit: canSubmit,
    submit: () => submit(selectedWords),
    solutions,
    noOfAttemptsRemaining: noOfAttemptsRemaining,
    gameEnded
  }
}

function useContainer() {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number>()
  useEffect(() => {
    setWidth(ref.current?.offsetWidth)
  }, [ref, ref.current])

  return [ref, width] as const
}


function findGroup(word: string, groupings: Grouping[]) {
  return groupings.find(grouping => grouping.words.includes(word))!.group
}

function areSameGroup(words: string[], groupings: Grouping[]): string | undefined {
  const groups = words.map(word => findGroup(word, groupings))
  if (new Set(groups).size === 1) {
    return groups[0]
  }
  return undefined
}

function oneAway(words: string[], groupings: Grouping[]): boolean {
  const groups = words.map(word => findGroup(word, groupings))
  const groupSet = new Set(groups)
  return groupSet.size === 2 && Array.from(groupSet.values()).every(word => {
    const numMatches = groups.filter(w => w === word).length
    return numMatches === 1 || numMatches === 3
  })
}

function ButtonButton({ label, onClick, disabled, filled }: { label: string, onClick: () => void, disabled?: boolean, filled?: boolean }) {
  return <button
    onClick={() => disabled ? () => { } : onClick()}
    className={twMerge(
      "rounded-3xl font-bold text-center  py-2 px-4 border-solid border-2",
      "transition duration-300",
      (filled && !disabled) ? "bg-black text-white" : "bg-white",
      disabled ? "text-neutral-400 border-neutral-400" : "border-black",
    )}>
    {label}
  </button>
}

function RemainingDot() {
  return <div className='bg-neutral-600 w-3 h-3 rounded-full'></div>
}

function Alert({ visible }: { visible: boolean }) {
  return (
    <div className={twMerge(
      "absolute left-0 right-0 bottom-0 top-0 transition duration-500",
      visible ? "opacity-100" : "opacity-0"
    )}>
      <div className='flex flex-col items-center'>
        <div className='text-sm bg-black px-2 py-1 rounded-sm text-white font-bold'>
          Estás a una palabra...
        </div>
        {/* <div className="border-solid border-t-black border-t-4 border-x-4 border-x-transparent  border-b-0" /> */}
      </div>
    </div>
  )
}

function useEnableForMS(initial: boolean, delay: number, msToDisable: number) {
  const [value, setValue] = useState(initial)
  const triggerEnable = () => {
    setTimeout(() => setValue(true), delay)
    setTimeout(() => setValue(false), msToDisable)
  }

  return [value, triggerEnable] as const
}

function InfoModal({ open }: { open: boolean }) {

  return <div className={twMerge(
    'absolute w-full h-full px-4 py-4 bg-black/10',
    open ? 'opacity-100' : 'opacity-0'
  )} style={{ zIndex: 200 }}>
    <div className='bg-white w-full rounded-xl shadow-xl'>
      <div>hello</div>
    </div>

  </div>
}

function getDate(dayahead: boolean) {
  let date = new Date()
  if (dayahead) {
    date.setDate(date.getDate() + 1)
  }
  return date
}

export default function App() {


  const groupings = useGroupings(getDate(false))

  const [alertVisisble, triggerAlert] = useEnableForMS(false, 500, 2_000)

  const { tileDatas, shuffle, canDeselect, deselectAll, submit, canSubmit, solutions, noOfAttemptsRemaining, gameEnded } = useTileDatas(
    groupings ?? emptyGrouping, // to fill tiles and all 
    true,
    triggerAlert
  )

  const noOfAttemptsRemainingDelayed = useDelay(noOfAttemptsRemaining, 1_000)

  const [containerRef, containerWidth] = useContainer()
  const [tileWidth, setTileWidth] = useState<number>()

  const [open, setOpen] = useState(false)

  if (!groupings) {
    return <div>
      <div className="w-screen h-screen flex justify-center items-center">
        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-[#6CACE4]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
      </div>
    </div>
  }
  return (
    <div className="h-screen w-screen flex flex-col">
      {/* <InfoModal open={open}/> */}
      {/* <div className="px-5 py-2 bg-slate-200">
        <p className="text-sm italic mx-5 text-center">
          <a className="underline font-bold" href="https://www.leer.org/donar">
            apoyá
          </a>{' '}
          la lectura de los boludles más pequeños
        </p>
      </div> */}
      {/* <div className='flex w-full justify-center -translate-x-2'>
        <img src={tango2} width={300}/>
      </div> */}
      <div className="mt-10 flex items-center">
        <div className="flex-1"></div>
        <div className="text-4xl font-argentina">Conexiones</div> <div className='text-4xl font-argentina bg-[#6CACE4] px-2 pb-3 pt-2 mx-2 rounded-sm text-white'>Argentinas</div>
        <div className="flex-1">
          <div className="flex justify-end mr-6">
            <InformationCircleIcon
              className="h-6 w-6 cursor-pointer"
              onClick={() => setOpen(true)}
            />
          </div>
        </div>
      </div>
      {/* <div className="mt-0 flex justify-center items-center text-neutral-300 ">
        _____________________________________________________________-
      </div> */}
      <div className="mt-4 flex justify-center items-center ">
        <div className='relative flex items-center gap-1'>
          <span>
            Creá cuatro grupos de cuatro!
          </span>
          {/* <div className='flex w-full justify-center -translate-x-2'> */}
          <img src={Mate} className='w-6' />
          {/* </div> */}
          <Alert visible={alertVisisble} />

        </div>
      </div>
      <div className="mt-4 mx-2">
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
      <div className='mt-6 flex justify-center w-full gap-2 items-center'>
        {
          !gameEnded && <>
            <div>Intentos restantes:</div>
            <div className='flex gap-1'>
              {Array.from(Array(noOfAttemptsRemainingDelayed)).map(_ => <RemainingDot />)}
            </div>

          </>
        }
      </div>
      <div className='mt-6 gap-x-4 flex justify-center'>
        <ButtonButton label='Shuffle' onClick={shuffle} />
        <ButtonButton label='Deseleccionar' onClick={deselectAll} disabled={!canDeselect} />
        <ButtonButton label='Enviar' onClick={submit} disabled={!canSubmit} filled />
      </div>
    </div>
  )
}
