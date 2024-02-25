import ImgMate from './assets/mate.png';
import { twMerge } from 'tailwind-merge';
import { InformationCircleIcon } from '@heroicons/react/outline';
import { useEffect, useRef, useState } from 'react';


function HorizontalLine() {
  return <div className="h-[0.01rem] w-full bg-neutral-500"></div>
}

function getFontSize(wordLength: number) {
  if (wordLength < 4) {
    return "text-md"
  } else if (wordLength < 6) {
    return "text-sm"
  } else if (wordLength < 10) {
    return "text-xs"
  } else {
    return "text-[8px]"
  }
}

function Tile({ tileData, containerWidth }: { tileData: TileData, containerWidth?: number }) {

  const { index, word, selected, setSelected, initialPosition, position } = tileData
  const fontSize = getFontSize(word.length)

  const onClick = () => {
    setSelected(!selected)
    console.log('clicked')
  }

  console.log('width', containerWidth)
  const size = selected ? 'scale-110 bg-blue-300' : ''


  const singleTranslation = 64 + 8

  const translateX = (position.j - initialPosition.j) * singleTranslation
  const translateY = (position.i - initialPosition.i) * singleTranslation
  const distance = Math.sqrt(translateX * translateX + translateY * translateY)
  console.log(word, initialPosition.j, position.j)

  return <div key={index} onClick={onClick}
    className={twMerge("cursor-pointer h-16 w-16 rounded-md bg-neutral-200 transform transition ease-in-out", size)}

    style={{ transform: `translate(${translateX}px, ${translateY}px)`, 
  transitionDuration: `${distance*3}ms`}}
  >
    <div className={
      twMerge('flex h-full w-full items-center justify-center font-bold uppercase select-none',
        fontSize
      )}>{word}</div>
  </div>
}

type TileData = {
  index: number
  word: string
  selected: boolean
  setSelected: (selected: boolean) => void
  initialPosition: Position
  position: Position
}

type Position = {
  i: number,
  j: number
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array
}

function useTileDatas(words: string[]): [TileData[], () => void] {
  const [selectedIndices, setSelectedIndices] = useState<number[]>(() => [])
  const initialPositions = words.map((_, index) => ({ i: Math.floor(index / 4), j: index % 4 }))

  const [positions, setPositions] = useState<Position[]>(initialPositions)

  function shuffle() {
    setPositions(shuffleArray([...initialPositions]))
  }

  return [words.map((word, index) => {
    return {
      index: index,
      word: word,
      selected: selectedIndices.includes(index),
      setSelected: (selected: boolean) => {
        if (selected) {
          setSelectedIndices(prev => [...prev, index])
        } else {
          setSelectedIndices(prev => prev.filter(prev => prev !== index))
        }
      },
      initialPosition: initialPositions.at(index)!,
      position: positions.at(index)!,
    }
  }), shuffle]


}

function useContainer() {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number>()
  useEffect(() => {
    console.log('hi5')
    setWidth(ref.current?.offsetWidth)
  }, [ref])

  return [ref, width] as const
}

export default function App() {

  const [tileDatas, shuffle] = useTileDatas(["choro", "panco", "hola", "chero", "medio", "pelo", "cula", "wacho", "churro", "leo", "cabra", "yo", "bobo", "leche", "maipú", "mate"])


  const [containerRef, containerWidth] = useContainer()

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
      <div className="mt-6 flex items-center">
        <div className="flex-1"></div>
        <p className="text-2xl">Boluxiones</p>
        <div className="flex-1">
          <div className="flex justify-end mr-6">
            <InformationCircleIcon
              className="h-6 w-6 cursor-pointer"
              onClick={() => { }}
            />
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-center items-center ">
        <HorizontalLine />
        <img
          className="mx-2 h-6 w-6 cursor-pointer"
          src={ImgMate}
          alt=""
        />
        <HorizontalLine />
      </div>
      <div className="mt-6 flex justify-center items-center ">
        Creá cuatro grupos de palabras!
      </div>
      <div className="mt-6 flex justify-center ">
        <div ref={containerRef} className="grid grid-cols-4 gap-2" >
            {tileDatas.map((tileData) => <Tile tileData={tileData} containerWidth={containerWidth} />)}
        </div>
        {/* <Tile word="che" />
        <Tile word="chincho" />
        <Tile word="porar" /> */}
      </div>
      {/* <div className="mt-2 flex justify-center gap-x-2">
        <Tile word="ahre" />
        <Tile word="che" />
        <Tile word="chincho" />
        <Tile word="porar" />
      </div>
      <div className="mt-2 flex justify-center gap-x-2">
        <Tile word="san dogmilio" />
        <Tile word="el c" />
        <Tile word="chincho" />
        <Tile word="parincholo" />
      </div>
      <div className="mt-2 flex justify-center gap-x-2">
        <Tile word="abcdefg" />
        <Tile word="abcdefghijk" />
        <Tile word="abcdefghijklmnop" />
        <Tile word="porar" />
      </div> */}
      <div className='mt-10 flex justify-center'>
        <button onClick={shuffle} className="rounded-md text-center text-white py-2 px-4 bg-neutral-600">
          Shuffle
        </button>

      </div>
    </div>
  )
}
