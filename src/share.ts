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
  
    navigator.clipboard.writeText(textToShare)
    handleShareToClipboard()
}

export function getPuzzleNumber() {
  const differenceInSeconds = (new Date()).getTime() - GAME_EPOCH.getTime();
  const differenceInDays = Math.floor(differenceInSeconds / (1000 * 3600 * 24));
  return differenceInDays
}