import { UAParser } from 'ua-parser-js'

const webShareApiDeviceTypes: string[] = ['mobile', 'smarttv', 'wearable']
const parser = new UAParser()
const browser = parser.getBrowser()
const device = parser.getDevice()

const GAME_EPOCH = new Date('03/16/2024')

export type EmojiRepresentation = string[][]

export const shareStatus = (
  emojiRepresentation: EmojiRepresentation,
  handleShareToClipboard: () => void
) => {
  const textToShare = 
  `ConexionesArgentinas.com.ar
  
Día #${getPuzzleNumber()}
${emojiRepresentation.map(row => row.join('')).join('\n')}
  
#ConexionesArgentinas`
  
  const shareData = { text: textToShare }

  let shareSuccess = false

  try {
    if (attemptShare(shareData)) {
      navigator.share(shareData)
      shareSuccess = true
    }
  } catch (error) {
    shareSuccess = false
  }

  if (!shareSuccess) {
    navigator.clipboard.writeText(textToShare)
    handleShareToClipboard()
  }
}

export function getPuzzleNumber() {
  const differenceInSeconds = (new Date()).getTime() - GAME_EPOCH.getTime();
  const differenceInDays = Math.floor(differenceInSeconds / (1000 * 3600 * 24));
  return differenceInDays
}

const attemptShare = (shareData: object) => {
  return (
    // Deliberately exclude Firefox Mobile, because its Web Share API isn't working correctly
    browser.name?.toUpperCase().indexOf('FIREFOX') === -1 &&
    webShareApiDeviceTypes.indexOf(device.type ?? '') !== -1 &&
    navigator.canShare &&
    navigator.canShare(shareData) &&
    navigator.share
  )
}

