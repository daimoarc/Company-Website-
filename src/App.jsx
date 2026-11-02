import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Reviews from './pages/Reviews'
import AiMl from './pages/AiMl'
import CloudServices from './pages/CloudServices'
import Devops from './pages/Devops'
import Fullstack from './pages/Fullstack'
import MetaAds from './pages/MetaAds'
import ProductEngineering from './pages/ProductEngineering'
import RequirementEngineering from './pages/RequirementEngineering'
import WordpressShopify from './pages/WordpressShopify'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="contact" element={<Contact />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="ai-ml" element={<AiMl />} />
        <Route path="cloud-services" element={<CloudServices />} />
        <Route path="devops" element={<Devops />} />
        <Route path="fullstack" element={<Fullstack />} />
        <Route path="meta-ads" element={<MetaAds />} />
        <Route path="product-engineering" element={<ProductEngineering />} />
        <Route path="requirement-engineering" element={<RequirementEngineering />} />
        <Route path="wordpress-shopify" element={<WordpressShopify />} />
      </Route>
    </Routes>
  )
}
