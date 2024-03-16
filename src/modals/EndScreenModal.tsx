import { useEffect, useState } from 'react'
import { BaseModal } from '../BaseModal'
import { useTime } from '../hooks'
import { EmojiRepresentation, getPuzzleNumber, shareStatus } from '../share'
import { Button } from '../components/Button'

type Props = {
  isOpen: boolean
  handleClose: () => void
  emojiRepresentation: EmojiRepresentation
  gameWon: boolean,
  onShare: () => void 
}

type Time = {
  hours: number
  minutes: number
  seconds: number
}

function getTitleText(won: boolean) {
  return won ? 'Sos un verdadero argentino! 🧉' : 'Estás seguro de que sos argentino?' 
}

export const EndScreenModal = ({ isOpen, handleClose, emojiRepresentation, gameWon, onShare }: Props) => {

  const timeLeft = useTimeUntilMidnight()

  const title = getTitleText(gameWon)
  return (
    <BaseModal title={title} isOpen={isOpen} handleClose={handleClose}>

      <div className='flex flex-col gap-4'>

        <p>{`Conexiones Argentinas #${getPuzzleNumber()}`}</p>

        <EmojiGrid emojiRepresentation={emojiRepresentation} />
        <div className=''>
          <div className=''>
            Próximo Conexiones en
          </div>
          <div className='font-bold text-2xl'>
            {formatTime(timeLeft)}
          </div>
        </div>

        <Button onClick={() => {
          shareStatus(
            emojiRepresentation,
            onShare
          )
        }} label='Copiar resultado' active timeoutAfterClick={0} filled />

      </div>
    </BaseModal>
  )
}

function ShareButton({ onClick }: { onClick: () => void }) {
  return <button
    type="button"
    className="mt-2 w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#6CACE4] text-base font-medium text-white hover:bg-[#6CACE4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6CACE4] sm:text-sm"
    onClick={onClick}
  >
    compartir
  </button>
}
function EmojiGrid({ emojiRepresentation }: { emojiRepresentation: EmojiRepresentation }) {
  return <div className='flex flex-col items-center text-2xl'>
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