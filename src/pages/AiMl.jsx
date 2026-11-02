import ServicePage from '../components/ServicePage'

const USE_CASES = [
  ['Generative AI & LLM Integration', 'Fine-tuned language models that summarize, generate, and reason over your documents and data — embedded directly into your app.', true],
  ['Image Processing', 'Custom-trained computer vision models that analyze, classify, and extract insights from images at scale.'],
  ['Object Detection', 'Real-time detection pipelines trained on your specific use case — inventory, safety, security, and beyond.'],
  ['Augmented Reality (AR)', 'AI-powered AR experiences that recognize objects and surfaces and overlay real-time data on top of them.'],
  ['Model Fine-Tuning', 'We take proven foundation models and fine-tune them on your own data for domain-specific accuracy.'],
  ['Application Integration', "Trained models shipped as clean APIs and embedded straight into your existing product — not a bolt-on demo."],
]

export default function AiMl() {
  return (
    <ServicePage
      heroImage="ai-ml-hero.png"
      title="AI & Machine Learning"
      subtitle="We train and fine-tune AI models on your data, then integrate them directly into your applications — generative LLMs, image processing, object detection, and AR."
      lead="Custom-trained models, integrated into the product you already run — not a generic API wrapper."
      whyItMatters={['Models tuned to your data', 'Shipped inside your product', 'Faster, more accurate results', 'No generic API wrappers']}
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
