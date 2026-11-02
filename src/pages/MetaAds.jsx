import ServicePage from '../components/ServicePage'

export default function MetaAds() {
  return (
    <ServicePage
      heroImage="meta-ads-hero.png"
      title="Marketing & Meta Ads"
      subtitle="We run your Meta ad campaigns and create the content behind them — Facebook & Instagram advertising plus ongoing social post creation."
      lead="Two things, done well: ads that convert, and content that keeps your audience engaged between campaigns."
      whyItMatters={['Lower cost-per-result', 'Consistent brand presence', 'Data-driven optimization', 'More qualified leads']}
    >
      <div className="pros-cons-grid">
        <div className="pros-cons-col">
          <h3>Meta Ads Management</h3>
          <ul>
            <li>Facebook & Instagram ad campaigns, built and managed end-to-end.</li>
            <li>Audience targeting & retargeting to reach the right people.</li>
            <li>A/B testing & ongoing optimization.</li>
            <li>Performance analytics & clear reporting on spend and results.</li>
          </ul>
        </div>
        <div className="pros-cons-col">
          <h3>Post Creation</h3>
          <ul>
            <li>Branded social media posts designed for your audience.</li>
            <li>Content calendars & consistent scheduling.</li>
            <li>Graphics and short-form video, ready to publish.</li>
            <li>Consistent presence across Facebook, Instagram, and beyond.</li>
          </ul>
        </div>
      </div>
    </ServicePage>
  )
}
