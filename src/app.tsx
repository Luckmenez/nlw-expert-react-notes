import { useState } from 'react'
import logo from './assets/logo-nlw-expert.svg'
import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'

interface Note{
  id: string;
  date: Date;
  content: string;
}


export function App() {
  const [ search, setSearch ] = useState('')
  const [ notes, setNotes ]= useState<Note[]>(() => {
    const notesOnLocalStorage = localStorage.getItem('notes')
    return notesOnLocalStorage ? JSON.parse(notesOnLocalStorage) : []
  })

  function onNoteCreated(content: string){
    const newNote: Note = {
      id: crypto.randomUUID(),
      date: new Date(),
      content
    }

    setNotes((state) => [newNote, ...state])
    localStorage.setItem('notes', JSON.stringify([newNote, ...notes]))

  }

  function onNoteDeleted(id: string){
    const newNotes = notes.filter((note) => note.id !== id)
    setNotes(newNotes)
    localStorage.setItem('notes', JSON.stringify(newNotes))
  }

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>){
    const query = event.target.value;
    setSearch(query)
  }

  const filteredNotes = search ? 
    notes.filter((note) => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())) 
    : notes

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5 md:px-0'>
      <img src={logo} alt='nlw expert'/>

      <form className='w-full'>
        <input 
          value={search}
          type="text" 
          placeholder='Busque em suas notas...'
          className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500'
          onChange={handleSearch}
        />

      </form>

      <div className='h-px bg-slate-700'/>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6'>
        <NewNoteCard onNoteCreated={onNoteCreated}/>

        {
          filteredNotes.map((note) =>  <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted}/>
          )
        }
      </div>
    </div>
  )
}
