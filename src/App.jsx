import React from 'react'
import Header from './components/Header'
import InteractiveChat from './components/InteractiveChat'

const App = () => {
  return (
    <>
    <Header/>
    <div className=" p-10 h-[70vh] flex items-center justify-center bg-gray-50">
      <InteractiveChat/></div>
         
    </>
  )
}

export default App
