import { Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import MainLayout from './layout/MainLayout'
import Meetings from './pages/Meetings'
import Chat from './pages/Chat'
import Sentiment from './pages/Sentiment'
import PageNotFound from './pages/PageNotFound'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<MainLayout />}>
          <Route path='/' element={<Dashboard />} />
          <Route path='/upload' element={<Upload />} />
          <Route path='/meetings' element={<Meetings />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='/sentiment' element={<Sentiment />} />
        </Route>
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default App
