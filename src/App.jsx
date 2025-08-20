import React from 'react'
import Header from './components/Header'
import InteractiveChat from './components/InteractiveChat'

const App = () => {
  return (
    <>
    <Header/>
    <div className=" p-10 h-[90vh] flex items-center justify-center bg-gray-50 "
    style={{backgroundImage: "url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80')", backgroundSize: 'cover'}}>
      
      <InteractiveChat/></div>
         
    </>
  )
}

export default App
