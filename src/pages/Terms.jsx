import { Link } from 'react-router-dom'
import LegalPage from '../components/LegalPage'
import { usePageMeta } from '../usePageMeta'

export default function Terms() {
  usePageMeta('Terms of use', 'The terms that apply when you use the DaimoArc website.')

  return (
    <LegalPage
      title="Terms of use"
      updated="3 November 2026"
      summary="Use the website lawfully, do not copy our content, and treat what you read here as general information. Any project we take on is agreed separately in writing."
    >
      <h2>1. About these terms</h2>
      <p>These terms apply to your use of this website. By using it, you accept them. If you do not agree, please do not use the website.</p>
      <p>
        The website is run by DaimoArc, a trading name that is not yet a registered company. You can contact us at{' '}
        <a href="mailto:contact@daimoarc.com">contact@daimoarc.com</a>.
      </p>

      <h2>2. Using the website</h2>
      <p>You may use the website for lawful purposes only. You must not:</p>
      <ul>
        <li>try to gain unauthorised access to the website, its servers or any connected systems</li>
        <li>introduce viruses or anything else harmful, or disrupt how the website works</li>
        <li>use automated tools to copy large amounts of the website’s content</li>
        <li>use the project form to send spam or anything unlawful, offensive or misleading</li>
      </ul>

      <h2>3. Our content</h2>
      <p>
        The text, design, graphics, illustrations, code, and the DaimoArc name and logo on this website belong to DaimoArc or to the people
        who license them to us. You are welcome to view the website and share links to it. You may not copy, reproduce or reuse its content
        for commercial purposes without our written permission.
      </p>

      <h2>4. Information on the website</h2>
      <p>
        The website gives general information about DaimoArc and our services. It is not professional advice, and it is not an offer that
        can be accepted to form a contract.
      </p>
      <p>
        Descriptions of services, timelines and figures are indicative. Any project is governed by a separate written proposal or
        agreement, which takes priority over anything on this website. Client reviews describe individual experiences, and your results
        will depend on your own project.
      </p>

      <h2>5. Enquiries</h2>
      <p>
        Sending the project form or an email does not create a contract or commit either of us to anything. How we handle the information
        you send is explained in our <Link to="/privacy">privacy policy</Link>.
      </p>

      <h2>6. Availability and changes</h2>
      <p>
        We work to keep the website available and accurate, but we cannot guarantee that it will always be available, uninterrupted or free
        of errors. We may change, suspend or remove any part of it at any time.
      </p>

      <h2>7. Links to other websites</h2>
      <p>
        Links to other websites, such as LinkedIn, are provided for convenience. We do not control those websites and are not responsible
        for their content or practices.
      </p>

      <h2>8. Our liability</h2>
      <p>
        The website is provided free of charge and “as is”. To the extent the law allows, we are not liable for any loss or damage arising
        from your use of, or reliance on, the website or its content.
      </p>
      <p>
        Nothing in these terms limits or excludes our liability where it would be unlawful to do so, including liability for death or
        personal injury caused by negligence, or for fraud. If you are a consumer, your legal rights are not affected.
      </p>

      <h2>9. Changes to these terms</h2>
      <p>We may update these terms from time to time. The date at the top shows when they last changed, and the version on this page is the one that applies.</p>

      <h2>10. Governing law</h2>
      <p>
        These terms are governed by the laws of England and Wales, and the courts of England and Wales have jurisdiction over any dispute.
        If you are a consumer living elsewhere in the UK, you may also bring proceedings in your local courts.
      </p>
    </LegalPage>
  )
}
