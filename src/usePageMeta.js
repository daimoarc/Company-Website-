import { useEffect } from 'react'

const DEFAULT_TITLE = 'DaimoArc | AI systems, apps and cloud for business owners'
const DEFAULT_DESCRIPTION = 'DaimoArc builds and runs the AI systems, web and mobile apps, cloud infrastructure and DevOps behind your business.'

// Sets the browser tab title and the meta description (what Google shows under the link)
// for the current page. Updates the existing tags instead of adding duplicates.
export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | DaimoArc` : DEFAULT_TITLE
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', description || DEFAULT_DESCRIPTION)
  }, [title, description])
}
