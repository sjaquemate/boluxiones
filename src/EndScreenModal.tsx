import { useEffect, useState } from 'react'
import { Attempt, Tile } from './App'
import { BaseModal } from './BaseModal'
import { useTime } from './hooks'
import { shareStatus } from './share'

type Props = {
  isOpen: boolean
  handleClose: () => void
  emojiRepresentation: string[][]
}

type Time = {
  hours: number
  minutes: number
  seconds: number
}

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0')

function getTimeUntilMidnight(now: Date) {
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)

  let seconds = (midnight.getTime() - now.getTime()) / 1000
  const hours = Math.floor(seconds / 60 / 60)
  seconds -= hours * 60 * 60
  const minutes = Math.floor(seconds / 60)
  seconds -= minutes * 60
  seconds = Math.floor(seconds)
  return {
    hours,
    minutes,
    seconds
  }
}

function useTimeUntilMidnight() {
  const t = useTime(100)
  const [time, setTime] = useState<Time>()
  useEffect(() => {
    setTime(getTimeUntilMidnight(new Date()))
  }, [t])

  return time
}

function formatTime(time: Time | undefined) {
  if (!time) return ''

  return `${zeroPad(time.hours, 2)}:${zeroPad(time.minutes, 2)}:${zeroPad(time.seconds, 2)}`
  
}
export const EndScreenModal = ({ isOpen, handleClose, emojiRepresentation }: Props) => {

  const timeLeft = useTimeUntilMidnight()

  return (
    <BaseModal title="The end" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        tenés 6 intentos para adivinar la palabra del día. después de cada
        intento, el color de las teclas se modificará para mostrarte qué tan
        cerca estás de acertar.
      </p>

      <div className="flex justify-center mb-1 mt-4">
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        la palabra contiene la letra C y está en el lugar correcto.
      </p>
      <div className='flex flex-col items-center'>
        {emojiRepresentation.map(row => <div className='flex'>
          {row.map(emoji =>
            <div>
              {emoji}
            </div>
          )
          }
        </div>
        )}
      </div>
      <button
        type="button"
        className="mt-2 w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#6CACE4] text-base font-medium text-white hover:bg-[#6CACE4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6CACE4] sm:text-sm"
        onClick={() => {
          shareStatus(
            emojiRepresentation,
            () => console.log('hi')
          )
        }}
      >
        compartir
      </button>
      <div className="flex justify-center mb-1 mt-4">
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        la palabra contiene la letra R pero está en el lugar incorrecto.
      </p>

      <div className="flex justify-center mb-1 mt-4">
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        la palabra no contiene la letra I.
      </p>

      <p className='mt-4 italic'>
        next conexiones in {formatTime(timeLeft)}
      </p>
      <p className="mt-6 text-sm text-gray-500 dark:text-gray-300">
        en boludle, la palabra del día es una relacionada con Argentina. puede
        ser del lunfardo, de uso popular en distintas generaciones y lugares del
        país, e incluso ser una cosa o figura icónica!
      </p>
      <p className="mt-6 italic text-sm text-gray-500 dark:text-gray-300">
        este es un juego argentino basado en el código open-source de Wordle -{' '}
        <a
          href="https://github.com/sjaquemate/boludle"
          className="underline font-bold"
        >
          mira el código argentino acá
        </a>{' '}
        -{' '}
        <a
          href="https://github.com/cwackerfuss/react-wordle"
          className="underline font-bold"
        >
          y el código original acá
        </a>{' '}
      </p>
    </BaseModal>
  )
}
