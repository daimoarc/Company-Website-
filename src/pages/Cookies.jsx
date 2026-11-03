import { Link } from 'react-router-dom'
import LegalPage from '../components/LegalPage'
import { usePageMeta } from '../usePageMeta'

export default function Cookies() {
  usePageMeta('Cookie policy', 'The DaimoArc website uses no cookies and no tracking. Here is what it keeps in your browser and why.')

  return (
    <LegalPage
      title="Cookie policy"
      updated="3 November 2026"
      summary="This website does not use cookies or advertising trackers, which is why there is no cookie banner. While you use the project form, it keeps two small things in your browser tab: your unfinished brief, so a refresh doesn't lose it, and a scrambled code that stops the brief being sent twice. Both are deleted when you close the tab."
    >
      <h2>1. Cookies</h2>
      <p>
        Cookies are small files that websites save in your browser. This website does not set any, and it does not use cookie-based
        analytics, advertising or social media tracking tools.
      </p>

      <h2>2. What we do store on your device</h2>
      <p>
        <strong>Your unfinished brief.</strong> While you fill in the project form, your browser keeps your answers in its session
        storage, so a refresh or a look at another page doesn't lose them. They stay on your device and only reach us if you send the
        brief. They are deleted when you send it, when you choose Start over, or when you close the tab.
      </p>
      <p>
        <strong>A duplicate-send code.</strong> When you send the project form, your browser keeps a scrambled code made from your email
        address and message, plus the time you sent it. It cannot be turned back into your email address or message. Its only job is to
        stop the same brief being sent twice by accident, and it is deleted when you close the tab.
      </p>
      <p>
        Both are strictly necessary to provide the service you asked for, sending your enquiry, so the law does not require your consent
        for them (regulation 6 of the UK Privacy and Electronic Communications Regulations).
      </p>

      <h2>3. Third parties</h2>
      <p>
        Our fonts, images and code are all served from this website, so visiting it does not contact Google or any other company. When you
        start filling in the project form, your browser asks Google for a one-time security code that helps us block spam. As you finish
        each step, it also tells Google which step you reached, so we can count how many people complete the form. These counts are
        anonymous daily totals, and the requests carry no cookies, identifiers or personal details. When you send the form, your answers go
        to Google to be saved in our enquiries sheet, as explained in our <Link to="/privacy">privacy policy</Link>. No cookies are
        involved.
      </p>
      <p>If you follow a link to another website, such as LinkedIn, that website may set its own cookies under its own policy.</p>

      <h2>4. If this changes</h2>
      <p>
        If we ever add analytics or marketing tools that use cookies or similar technology, we will update this page first and ask for your
        consent before any non-essential ones are used.
      </p>

      <h2>5. Managing storage in your browser</h2>
      <p>
        You can view or clear what websites store at any time in your browser settings, usually under privacy or site data. Clearing it
        will not stop this website from working.
      </p>
    </LegalPage>
  )
}
