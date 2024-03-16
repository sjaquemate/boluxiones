import { twMerge } from 'tailwind-merge';
// import { InformationCircleIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import { SolutionRow } from './components/SolutionRow';
import Mate from './assets/mate.png'
import { useAlertState, useContainer, useDelay } from './hooks';
import { emptyGrouping, useGroupings } from './words';
import { InfoModal } from './modals/InfoModal';
import { EndScreenModal } from './modals/EndScreenModal';
import { useGameState } from './useGameState';
import { InfoIcon } from './components/InfoIcon';
import { Tile } from './Tile';
import { Button } from './components/Button';

function RemainingDot({ active }: { active?: boolean }) {
  const color = active ? 'text-yellow-400' : 'text-neutral-400'
  return <svg className={twMerge("w-4 h-4 ms-1", color)} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
  </svg>
}

function Alert({ label, visible }: { label: string, visible: boolean }) {
  return (
    <div className={twMerge(
      "absolute left-0 right-0 bottom-0 top-0 transition duration-500",
      visible ? "opacity-100" : "opacity-0"
    )}>
      <div className='flex flex-col items-center'>
        <div className='text-sm bg-black px-2 py-1 rounded-sm text-white font-bold'>
          {label}
        </div>
        {/* <div className="border-solid border-t-black border-t-4 border-x-4 border-x-transparent  border-b-0" /> */}
      </div>
    </div>
  )
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

  const { label, active, triggerAlert } = useAlertState()

  const {
    tileDatas,
    shuffle,
    canDeselect,
    deselectAll,
    submit,
    canSubmit,
    solutions,
    noOfAttemptsRemaining,
    gameEnded,
    gameWon,
    autoSolveEnded,
    emojiRepresentation
  } = useGameState({
    groupings: groupings ?? emptyGrouping,
    shuffleInitial: true,
    oneAwayFn: () => triggerAlert("Estás a una palabra...", 500, 2_000)
  })

  const noOfAttemptsRemainingDelayed = useDelay(noOfAttemptsRemaining, 1_000)

  const { ref: containerRef, width: containerWidth } = useContainer()
  const [tileHeight, setTileHeight] = useState<number>()

  const [isInfoOpen, setIsInfoOpen] = useState(true)
  const [isEndScreenOpen, setIsEndScreenOpen] = useState(false)

  useEffect(() => {
    if (autoSolveEnded) {
      setIsEndScreenOpen(true)
    }
  }, [autoSolveEnded])

  function share() {
    setIsEndScreenOpen(true)
  }

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
      <InfoModal isOpen={isInfoOpen} handleClose={() => setIsInfoOpen(false)} />
      <EndScreenModal
        isOpen={isEndScreenOpen}
        handleClose={() => setIsEndScreenOpen(false)}
        emojiRepresentation={emojiRepresentation}
        gameWon={gameWon}
        onShare={() => triggerAlert("Copiado", 0, 5_000)}
      />
      {/* <div className="px-5 py-2 bg-slate-200">
        <p className="text-sm italic mx-5 text-center">
          Envianos sugerencias o comentarios a nuestro {' '}
          <a className="underline font-bold" href="https://twitter.com/boludle">
            Twitter!
          </a>
        </p>
      </div> */}
      <div className="px-5 py-2 bg-slate-200">
        <p className="text-sm italic mx-5 text-center">
          Por los creadores de {' '}
          <a className="underline font-bold" href="https://boludle.com/">
            Boludle.com
          </a>
        </p>
      </div>
      {/* <div className='flex w-full justify-center -translate-x-2'>
        <img src={tango2} width={300}/>
      </div> */}
      <div className="mt-6 flex items-center justify-center">
        <div className="flex-1"></div>
        <div className='flex text-2xl sm:text-3xl font-montserrat select-none'>
          <div className="">Conexiones&nbsp;</div>
          <div className='  font-bold text-[#6CACE4] rounded-sm'>Argentinas</div>
        </div>
        <div className="flex-1">
          <div className="flex justify-end mr-4">
            <div className="h-6 w-6 cursor-pointer" onClick={() => setIsInfoOpen(true)}>
              <InfoIcon />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center items-center ">
        <div className='relative flex items-center gap-1'>
          <span>
            Creá cuatro grupos de cuatro palabras!
          </span>
          {/* <div className='flex w-full justify-center -translate-x-2'> */}
          <img src={Mate} className='w-6' />
          {/* </div> */}
          <Alert label={label} visible={active} />

        </div>
      </div>
      <div className="mt-4 mx-2">
        <div className="flex justify-center w-full ">
          <div ref={containerRef} className="relative w-full max-w-[500px]" >
            <div className="absolute w-full h-full" >
              <div className="flex flex-col gap-y-2">
                <SolutionRow solution={solutions.at(0)} height={tileHeight} />
                <SolutionRow solution={solutions.at(1)} height={tileHeight} />
                <SolutionRow solution={solutions.at(2)} height={tileHeight} />
                <SolutionRow solution={solutions.at(3)} height={tileHeight} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {tileDatas.map(tileData => <Tile setTileHeight={setTileHeight} tileData={tileData} containerWidth={containerWidth} />)}
            </div>
          </div>
        </div>
      </div>
      <div className='mt-6 flex justify-center w-full gap-2 items-center'>
        <div>Intentos restantes:</div>
        <div className='flex'>
          {Array.from(Array(noOfAttemptsRemainingDelayed)).map(_ => <RemainingDot active />)}
          {Array.from(Array(4 - noOfAttemptsRemainingDelayed)).map(_ => <RemainingDot />)}
        </div>
      </div>
      <div className='mt-6 gap-x-4 flex justify-center'>
        {
          autoSolveEnded ? (
            <Button label='Compartir' onClick={share} active filled timeoutAfterClick={100} />
          ) : (
            <>
              <Button label='Shuffle' onClick={shuffle} active timeoutAfterClick={100} />
              <Button label='Deseleccionar' onClick={deselectAll} active={canDeselect} timeoutAfterClick={100} />
              <Button label='Enviar' onClick={submit} active={canSubmit} filled timeoutAfterClick={2_500} />
            </>
          )
        }
      </div>
    </div>
  )
}
