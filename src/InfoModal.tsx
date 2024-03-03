import { Tile } from './App'
import { BaseModal } from './BaseModal'

function DemoTile({ word, selected = false }: { word: string, selected?: boolean }) {
  return <Tile setTileHeight={() => { }} tileData={{
    word: word,
    selected: selected,
    status: undefined,
    setSelected: () => { },
    dx: 0,
    dy: 0
  }}
  />
}
type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="Cómo jugar" isOpen={isOpen} handleClose={handleClose}>
      <div className='mx-4 text-sm text-gray-500 text-left'>

        <p >
          Encontrá grupos de cuatro palabras que tengan algo en común.
        </p>
        <p >
          • Selecciona cuatro elementos y tocá 'Enviar' para verificar si tu suposición es correcta.
        </p>
        <p >
          • Podés cometer cuatro errores como máximo.
        </p>

        <p >
          Insultos infantiles
        </p>
        <div className="scale-[0.9] grid grid-cols-4 gap-2 cursor-none">
          <DemoTile word="Jacarandá" />
          <DemoTile word="Bobo" selected />
          <DemoTile word="Nacional" />
          <DemoTile word="Celtán" />
          <DemoTile word="Salame" selected />
          <DemoTile word="Ceibo" />
          <DemoTile word="Pingüino" />
          <DemoTile word="Pato" />
          <DemoTile word="Leon" />
          <DemoTile word="Lenteja" selected />
          <DemoTile word="Arrayán" />
          <DemoTile word="Ley" />
          <DemoTile word="Argentino" />
          <DemoTile word="Austral" />
          <DemoTile word="Papafrita" selected />
          <DemoTile word="Gato" />
        </div>

        <p className='italic text-center'>
          ¡Ojo, tené cuidado, pueden haber palabras que parecen pertenecer a múltiples categorías!
        </p>
        <p className='mt-4'>
          Cada grupo que vas descubriendo está asociado a un color que indica su dificultad:
        </p>
        <div >
          <p>
            🟨 Dificultad Baja
          </p>
          <p>
            🟩 Dificultad Media
          </p>
          <p>
            🟦 Dificultad Alta
          </p>
          <p>
            🟪 Dificultad Muy Alta
          </p>
        </div>


        <p className="mt-6 italic text-center">
          Por los creadores de <a className='underline font-bold' href="https://www.boludle.com">Boludle.com</a>. Contactanos en <a className='underline font-bold' href="https://www.twitter.com/boludle">Twitter</a> o <a className='underline font-bold' href="mailto:mili@boludle.com">mili@boludle.com</a>. 
        </p>
      </div>
    </BaseModal>
  )
}
