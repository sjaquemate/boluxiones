import { useEffect, useState } from "react"
import { Grouping } from "./useGameState"

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
      const rowsForDate = data.filter(row => row.date.trim() === dateString)
      if (rowsForDate.length === 4) {
        setGroupings(
          rowsForDate.map(row => ({
            group: row.group,
            difficulty: Number(row.difficulty),
            words: [row.word1, row.word2, row.word3, row.word4]
          })).sort((a, b) => a.difficulty - b.difficulty)
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

