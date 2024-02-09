import { ChangeEvent, useState } from 'react'
import { toast } from 'sonner'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
interface NewNoteCardProps {
  onNoteCreated: (content: string) => void;

}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  function handleStartEditor() {
    setShouldShowOnboarding(false)
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)

    if(event.target.value === ''){
      setShouldShowOnboarding(true)
    }
  }

  function handleSaveNote(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    if(!content) return
    onNoteCreated(content)
    setContent('')
    setShouldShowOnboarding(true)
    toast.success('Nota salva com sucesso!')
  }

  function handleStartRecording() {

    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window 
      || 'webkitSpeechRecognition' in window

    if(!isSpeechRecognitionAPIAvailable) alert('Seu navegador não suporta a API de reconhecimento de voz.')

    const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionApi()

    setIsRecording(true)
    setShouldShowOnboarding(false)

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      },'')

      setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.error(event)
    }

    speechRecognition.start()
  }

  function handleStopRecording() {
    setIsRecording(false)

    if(speechRecognition){
      speechRecognition.stop()
      speechRecognition = null
    } 
  }

  return(
    <Dialog.Root>
      <Dialog.Trigger className='rounded-md outline-none flex flex-col text-left bg-slate-700 p-5 gap-3 hover:ring-2 
        hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400
      '>
        <span className='text-sm font-medium text-slate-200'>
          Adicionar nota
        </span>
        
        <p className='text-sm leading-6 text-slate-400'>
          Grave uma nota em áudio que será convertida para texto automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/50'/>
        <Dialog.Content className='
          fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 outline-none
          md:max-w-[640px] w-full bg-slate-700 md:rounded-md flex flex-col md:h-[60vh]
          overflow-hidden
        '>
          <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
            <X className='size-5'/>
          </Dialog.Close>

          <form className='flex-1 flex flex-col'>          
            <div className='flex flex-1 flex-col gap-3 p-5'>
              <span className='text-sm font-medium text-slate-300'>
                Adicionar nota
              </span>
              {
                shouldShowOnboarding ? (
                  <p className='text-sm leading-6 text-slate-400'>
                    Começe &nbsp;
                    <button type='button' className='font-medium text-lime-400 hover:underline' onClick={handleStartRecording}>
                      gravando uma nota
                    </button> 
                    &nbsp; em áudio ou se preferir &nbsp;
                    <button type='button' className='font-medium text-lime-400 hover:underline' onClick={handleStartEditor}>
                      utilize apenas texto
                    </button> .
                  </p>
                ) : (
                  <textarea 
                    value={content}
                    autoFocus
                    className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                    onChange={handleContentChange}
                  />
                )
              }

            </div>
            
            {
              isRecording ? (
                <button
                  type='button'
                  onClick={handleStopRecording}
                  className='
                    w-full bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none
                    font-medium hover:slate-100 flex items-center justify-center gap-2'
                >
                  <div className='size-3 rounded-full bg-red-500 animate-pulse'/> 
                    Gravando! (clique p/ interromper)
                </button>
              ) : (
                <button
                  type='button'
                  onClick={handleSaveNote}
                  className='
                    w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none
                    font-medium hover:bg-lime-500
                '>
                  Salvar nota
                </button>
              )
            }
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}