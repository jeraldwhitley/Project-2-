//import { useState } from 'react'
import './App.css'
import ErrorBoundary from './components/errorboundary';
import SongSuggest from './components/songsuggest'; // Import the SongSuggest component


function App() {
  //const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <ErrorBoundary>
          <SongSuggest />
        </ErrorBoundary>
      </div>
    </>
  )
}

export default App
