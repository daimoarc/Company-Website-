import { Link } from 'react-router-dom'
import LegalPage from '../components/LegalPage'
import { usePageMeta } from '../usePageMeta'

export default function Privacy() {
  usePageMeta('Privacy policy', 'How DaimoArc collects, uses and protects the personal information you share through this website, and the rights you have over it.')

  return (
    <LegalPage
      title="Privacy policy"
      updated="3 November 2026"
      summary="We only collect what you send us through the project form or by email, and we use it to reply to you and discuss your project. It is stored with Google, never sold, never used for marketing without your permission, and you can ask us to see or delete it at any time."
    >
      <h2>1. Who we are</h2>
      <p>
        DaimoArc (“we”, “us”, “our”) provides AI, software, cloud, DevOps and marketing services to businesses. DaimoArc is a trading
        name and is not yet a registered company. We decide how the personal information described in this policy is used, which makes
        us its “controller” under data protection law.
      </p>
      <p>For anything to do with your personal information, email <a href="mailto:contact@daimoarc.com">contact@daimoarc.com</a>.</p>

      <h2>2. What we collect</h2>
      <p><strong>When you send the project form</strong>, we collect:</p>
      <ul>
        <li>your name and email address</li>
        <li>your phone number, if you choose to give it, and how you prefer to be contacted</li>
        <li>the services you are interested in, your budget range and your timeline</li>
        <li>what you tell us about your project</li>
        <li>your confirmation that we may contact you, a reference number and the time you sent the form</li>
      </ul>
      <p><strong>When you email us</strong>, we receive your email address, your name and whatever you choose to include.</p>
      <p>
        <strong>When you browse the site</strong>, our website host’s servers automatically record standard technical information about
        each request, such as your IP address, browser type and the page requested. This is needed to deliver the website and keep it secure.
      </p>
      <p>We do not use analytics, advertising trackers or tracking cookies. See our <Link to="/cookies">cookie policy</Link>.</p>
      <p>Please do not send us sensitive information, such as health details, through the form.</p>

      <h2>3. How we use it and our legal basis</h2>
      <p>
        Under UK data protection law (the UK GDPR and the Data Protection Act 2018), and the EU GDPR where it applies, we need a legal
        basis for using your information. We rely on:
      </p>
      <ul>
        <li>
          <strong>Steps you ask us to take before a contract</strong>: replying to your enquiry, discussing your project and preparing a
          proposal (Article 6(1)(b))
        </li>
        <li>
          <strong>Our legitimate interests</strong>: keeping a record of enquiries and our correspondence, following up on an enquiry you
          started, and protecting the website and form from spam and misuse (Article 6(1)(f))
        </li>
        <li>
          <strong>Legal obligations</strong>: keeping the records the law requires if you become a client, such as accounting records
          (Article 6(1)(c))
        </li>
      </ul>
      <p>We will not add you to a mailing list or send you marketing unless you separately ask us to, and we never sell your information.</p>

      <h2>4. Who we share it with</h2>
      <ul>
        <li>
          <strong>Google</strong>: project form submissions are saved to a Google Sheet through Google Apps Script, and we use Google for
          email. Google handles this information on our behalf under its data processing terms
        </li>
        <li><strong>Our website hosting provider</strong>, which stores the website and its server logs</li>
        <li>
          <strong>Professional advisers or public authorities</strong>, only where the law requires it or to establish, exercise or defend
          legal claims
        </li>
      </ul>
      <p>If a project needs a specialist partner, we will tell you before sharing any of your details with them.</p>

      <h2>5. International transfers</h2>
      <p>
        Google may store and process information outside the UK and the European Economic Area, including in the United States. Where that
        happens, the transfer is protected by safeguards recognised under UK and EU law, such as the UK Extension to the EU–US Data Privacy
        Framework or the standard contractual clauses in Google’s data processing terms.
      </p>

      <h2>6. How long we keep it</h2>
      <ul>
        <li>Enquiries that do not lead to a project are deleted within 12 months of our last contact with you</li>
        <li>
          If you become a client, project records and correspondence are kept for as long as we work together and for up to 6 years
          afterwards, for legal, tax and accounting reasons
        </li>
        <li>Server logs are kept by our host for a limited period under its own policies</li>
      </ul>

      <h2>7. How we protect it</h2>
      <p>
        We use reputable providers, limit access to the people working on your enquiry or project, and take reasonable technical and
        organisational measures to protect your information. No way of sending or storing data online is completely secure, but we work to
        keep the risk low and will act quickly if anything goes wrong.
      </p>

      <h2>8. Your rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>ask for a copy of the information we hold about you</li>
        <li>ask us to correct anything that is wrong or incomplete</li>
        <li>ask us to delete your information</li>
        <li>ask us to restrict how we use it, or object to our use of it, including where we rely on legitimate interests</li>
        <li>ask for your information in a portable, machine-readable format</li>
      </ul>
      <p>
        To use any of these rights, email <a href="mailto:contact@daimoarc.com">contact@daimoarc.com</a>. It is free in most cases and we
        will respond within one month. We may need to confirm your identity first.
      </p>
      <p>
        If you are unhappy with how we have handled your information, please tell us so we can put it right. You can also complain to the
        UK Information Commissioner’s Office at{' '}
        <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">ico.org.uk</a> (0303 123 1113), or to the
        data protection authority where you live or work.
      </p>

      <h2>9. Children</h2>
      <p>This website and our services are for businesses. They are not aimed at children, and we do not knowingly collect information from anyone under 16.</p>

      <h2>10. Automated decisions</h2>
      <p>We do not make decisions about you by automated means, and we do not use profiling.</p>

      <h2>11. Other websites</h2>
      <p>Links to other websites, such as our LinkedIn page, are covered by those websites’ own privacy policies.</p>

      <h2>12. Changes to this policy</h2>
      <p>We will update this page if our practices change and change the date at the top. If a change is significant, we will make it clear on the website.</p>
    </LegalPage>
  )
}
