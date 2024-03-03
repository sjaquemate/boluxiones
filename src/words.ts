import { useEffect, useState } from "react"

export type Grouping = {
  group: string
  difficulty: number
  words: string[]
}

export function useGroupings(date: Date) {

  const [groupings, setGroupings] = useState<Grouping[]>()

  useEffect(() => {
    loadWords()
  }, [])

  async function loadWords() {

    try {
      const response = await fetch("https://opensheet.elk.sh/1KWCELv96If20u8H5_3b4pR0fo4Z8Dd61uxFTCuVas48/solutions-tab")
      const data = (await response.json()) as SheetRow[]
      const dateString = date.toISOString().split('T')[0]
      const rowsForDate = data.filter(row => row.date === dateString)
      if (rowsForDate.length === 4) {
        console.log(rowsForDate)
        setGroupings(
          rowsForDate.map(row => ({
            group: row.group,
            difficulty: Number(row.difficulty),
            words: [row.word1, row.word2, row.word3, row.word4]
          }))
        )
      }
    } catch (error) {

    }
  }

  return groupings
}

type SheetRow = {
  date: string
  difficulty: string
  group: string
  word1: string
  word2: string
  word3: string
  word4: string
}

export const emptyGrouping: Grouping[] = [
  {
    group: "Equipos de futbol",
    difficulty: 1,
    words: ["1", "2", "3", "4"]
  },
  {
    group: "Sabores de alfajor",
    difficulty: 2,
    words: ["1", "2", "3", "4"]
  },
  {
    group: "Plazas y parques",
    difficulty: 3,
    words: ["1", "2", "3", "4"]
  },
  {
    group: "Radios",
    difficulty: 4,
    words: ["1", "2", "3", "4"]
  }
]

export function difficultyToEmoji(difficulty: number): string {
  if (difficulty === 1) {
    return '🟨'
  } else if (difficulty === 2) {
    return '🟩'
  } else if (difficulty === 3) {
    return '🟦'
  } else if (difficulty === 4) {
    return '🟪'
  }
  return ''
}

export function difficultyToColor(difficulty: number) {
  if (difficulty === 1) {
    return 'rgb(247,222,108)'
  } else if (difficulty === 2) {
    return 'rgb(160,195,90)'
  } else if (difficulty === 3) {
    return 'rgb(175,196,239)'
  } else if (difficulty === 4) {
    return 'rgb(184,130,198)'
  }

  return 'black'
}
