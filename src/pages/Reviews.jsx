import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'

const REVIEWS = [
  { text: "DaimoArc built my WordPress website from scratch and it looks incredibly professional. They understood exactly what I needed for my business and delivered on time. Highly recommended for anyone looking for a quality website in Pakistan.", initials: 'HS', name: 'Hani Shakoor', meta: 'WordPress Website · Qatar', badge: 'WordPress' },
  { text: "The AI object detection system DaimoArc built for us exceeded all expectations. The model accuracy was impressive and the team explained every step clearly. It's rare to find a tech team that combines technical skill with such great communication.", initials: 'SA', name: 'Sadia Faisal', meta: 'AI Object Detection Project · Italy', badge: 'AI / ML' },
  { text: 'Maine apna e-commerce store DaimoArc se banwaya aur result bohat acha raha. Puri team bahut professional hai aur kaam bhi time pe deliver kiya. Website ki speed aur design dono kamaal ke hain. Zaroor recommend karunga!', initials: 'TK', name: 'Tariq Khalid', meta: 'E-Commerce Web Development · Lahore', badge: 'Web & Mobile' },
  { text: 'DaimoArc ne hamare liye ek complete business website banayi jo bilkul hamare vision ke mutabiq thi. Support bhi zyada acha mila — koi bhi issue hota tha tou foran fix kar dete thay. Bohaat khush hain hum unke kaam se.', initials: 'NR', name: 'Nadia Rehman', meta: 'Business Website · Karachi', badge: 'WordPress' },
  { text: 'We moved our entire infrastructure to the cloud with DaimoArc and the transition was seamless. Zero downtime, everything was planned perfectly. Our costs dropped and performance improved massively. These guys really know their stuff.', initials: 'OM', name: 'Omar Mirza', meta: 'Cloud Migration · Dubai', badge: 'Cloud Services' },
  { text: 'DaimoArc ne hamare Meta Ads campaigns completely transform kar diye. Pehle budget waste ho raha tha, ab har rupee count karta hai. ROAS double ho gaya pehle hi month mein. Bohaat professional team hai, results pe full trust hai.', initials: 'AQ', name: 'Asad Qureshi', meta: 'Meta Ads Campaign · Islamabad', badge: 'Meta Ads' },
]

export default function Reviews() {
  return (
    <section id="reviews" style={{ paddingTop: 150 }}>
      <Reveal className="section-header">
        <span className="section-tag">◆ Client Reviews</span>
        <h2 className="section-title">What Our <span>Clients Say</span></h2>
        <p className="section-sub">Real feedback from business owners we've worked with across Pakistan and beyond.</p>
      </Reveal>

      <div className="reviews-grid">
        {REVIEWS.map((r, i) => (
          <Reveal key={r.name} delay={(i % 3) * 0.1}>
            <TiltCard className="review-card">
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"{r.text}"</p>
              <div className="review-author">
                <div className="review-avatar">{r.initials}</div>
                <div className="review-info">
                  <strong>{r.name}</strong>
                  <span>{r.meta}</span>
                </div>
                <div className="review-badge">{r.badge}</div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <Reveal className="teaser-more">
        <Link to="/contact" className="btn-primary">Start a Project</Link>
      </Reveal>
    </section>
  )
}
