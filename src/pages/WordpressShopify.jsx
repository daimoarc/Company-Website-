import ServicePage from '../components/ServicePage'

const USE_CASES = [
  ['Custom WordPress Websites', 'Fully custom WordPress builds designed and coded around your business — not a stock theme.'],
  ['Custom Plugin Development', "Bespoke WordPress plugins built for your exact workflow, when off-the-shelf plugins don't cut it.", true],
  ['Shopify Stores', 'Complete Shopify store design, setup, and customization — from first product to checkout.'],
  ['TikTok Shop Setup & Integration', 'TikTok Shop storefront setup, product catalog & inventory sync with Shopify, order fulfillment, and shoppable video/live integration — turn your TikTok following into a sales channel.'],
  ['E-Commerce Stores, Any Platform', 'WooCommerce, Shopify, or fully custom — every type of online store, built to sell.'],
  ['Headless CMS', 'Decoupled WordPress/CMS builds for speed, flexibility, and a modern front end.'],
  ['Performance Optimization', 'Fast-loading, SEO-ready sites and stores that keep visitors and customers around.'],
]

export default function WordpressShopify() {
  return (
    <ServicePage
      heroImage="wordpress-shopify-hero.png"
      title="WordPress, Shopify & TikTok Store"
      subtitle="Custom WordPress websites with bespoke plugins, Shopify stores, and TikTok Shop integration for every kind of e-commerce business — not just templates."
      lead="Whatever you're selling or publishing, we build the store or site around it — including getting you set up to sell directly on TikTok."
      whyItMatters={['Built around your business, not a theme', 'Every type of store, one team', 'TikTok Shop setup & catalog sync', 'Fast, SEO-ready pages', 'Plugins built for your exact workflow']}
    >
      <div className="usecase-grid">
        {USE_CASES.map(([title, desc, featured]) => (
          <div className={`usecase-card${featured ? ' usecase-card--featured' : ''}`} key={title}>
            <div className="usecase-title">{title}</div>
            <div className="usecase-desc">{desc}</div>
          </div>
        ))}
      </div>
    </ServicePage>
  )
}
