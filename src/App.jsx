import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import Header from './header'
import Navigation from './navi_bar'
import Banner from './banner'
import About from './about'
import Work from './work'
import Gallery from './gallery'
import ArticleCard from './ArticleCard'
import TutorialCard from './TutorialCard'
import Contact from './contact'
import Footer from './footer'
import Login from './pages/login'
import Signup from './pages/signup'
import Post from "./pages/post"
import Pricing from './pages/pricing.jsx'
// import ResetPassword from './pages/resetpass'

function App() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash)  // checks if there is a hash in the URL
    {
      const sectionId = location.hash.substring(1)  // removes the '#' from the hash to get the id of the section
      document.getElementById(sectionId)?.scrollIntoView  // scrolls to the section with the corresponding id
      ({
        behavior: 'smooth'  // smooth scrolling
      })
    }
    else 
    {
      window.scrollTo(0, 0)  // if there is no hash, scroll to the top of the page
    }
  }, [location])  // this effect runs every time the location changes

  return (
    <>
      <Header />

      <Routes>

        <Route path="/" element={
          <>
            <Navigation />
            <Banner />
            <About />
            <Work />
            <Gallery />
            <ArticleCard />
            <TutorialCard />
            <Contact />
          </>
        } />

        <Route path="/post" element={<Post />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/pricing" element={<Pricing />} />

        <Route path ="*" element ={<h1>404 Not Found</h1>} />

      </Routes>

      <Footer />
    </>
  )
}

export default App

// npm install firebase

