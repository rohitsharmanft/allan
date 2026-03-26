import React from 'react'
import Navbar from './Navbar'
import "./Header.css"
import TopBar from './TopBar'

const Header = () => {
  return (
    <section className="container__">
      <TopBar />
      <Navbar />
    </section>
  )
}

export default Header
