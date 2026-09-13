import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Placeholder from './pages/Placeholder'

const STUB_PAGES = [
  ['about', 'About Us'],
  ['services', 'Our Services'],
  ['contact', 'Contact Us'],
  ['reviews', 'Client Reviews'],
  ['ai-ml', 'AI & Machine Learning'],
  ['cloud-services', 'Cloud Services'],
  ['devops', 'DevOps'],
  ['fullstack', 'Full-Stack Development'],
  ['meta-ads', 'Marketing & Meta Ads'],
  ['product-engineering', 'Product Engineering'],
  ['requirement-engineering', 'Requirement Engineering'],
  ['wordpress-shopify', 'WordPress & Shopify'],
]

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        {STUB_PAGES.map(([path, title]) => (
          <Route key={path} path={path} element={<Placeholder title={title} />} />
        ))}
      </Route>
    </Routes>
  )
}
