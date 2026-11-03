import { Link } from 'react-router-dom'
import LegalPage from '../components/LegalPage'
import { usePageMeta } from '../usePageMeta'

export default function Cookies() {
  usePageMeta('Cookie policy', 'The DaimoArc website uses no cookies and no tracking. Here is the one small item it stores and why.')

  return (
    <LegalPage
      title="Cookie policy"
      updated="3 November 2026"
      summary="This website does not use cookies, analytics or advertising trackers, which is why there is no cookie banner. The only thing it stores is a short-lived code that stops the project form being sent twice by accident."
    >
      <h2>1. Cookies</h2>
      <p>
        Cookies are small files that websites save in your browser. This website does not set any, and it does not use analytics,
        advertising or social media tracking tools.
      </p>

      <h2>2. What we do store on your device</h2>
      <p>
        When you send the project form, your browser keeps one small item in its session storage: a scrambled code made from your email
        address and message, plus the time you sent it. It cannot be turned back into your email address or message.
      </p>
      <p>
        Its only job is to stop the same brief being sent twice by accident. It stays in the browser tab you used and is deleted
        automatically when you close that tab.
      </p>
      <p>
        Because it is strictly necessary to provide the service you asked for, sending your enquiry, the law does not require your consent
        for it (regulation 6 of the UK Privacy and Electronic Communications Regulations).
      </p>

      <h2>3. Third parties</h2>
      <p>
        Our fonts, images and code are all served from this website, so visiting it does not contact Google or any other company. When you
        send the project form, your answers go to Google to be saved in our enquiries sheet, as explained in our{' '}
        <Link to="/privacy">privacy policy</Link>. No cookies are involved.
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
