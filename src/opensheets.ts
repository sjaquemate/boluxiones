import { useState } from "react"

export async function fetchWords() {

    const [words, setWords] = useState()

    try {
        const response = await fetch("https://opensheet.elk.sh/1k83cMwYA5aIOaZ54XxGh2KXbQkgwdCHRnRGjNmwp4ww/boludle+solutions", {})
        const data = response.json()
        console.log(data)
    } catch {

    }
  }
