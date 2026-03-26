// import Header from '../Components/Header/Header'
// import HeroSection from '../Components/HeroSection/HeroSection'
// import CategorySection from '../Components/HeroSection/CategorySection'
// import AboutSection from '../Components/HeroSection/AboutSection'
// import FreelancerSection from '../Components/HeroSection/FreelancerSection'
// import Footer from '../Components/Footer/Footer'

import Footer from "../../Components/Common/Footer/Footer"
import Header from "../../Components/Common/Header/Header"
import AboutSection from "../../Components/Common/HeroSection/AboutSection"
import CategorySection from "../../Components/Common/HeroSection/CategorySection"
import FreelancerSection from "../../Components/Common/HeroSection/FreelancerSection"
import HeroSection from "../../Components/Common/HeroSection/HeroSection"

const Home = () => {
  return (  
    <>
      <Header/> 
            {/* <Header /> */}

      <HeroSection/>
      <CategorySection/>
      <AboutSection/>
      <FreelancerSection/>
      <Footer/> 
    </>
  )
}

export default Home
