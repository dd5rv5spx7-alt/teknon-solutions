import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.ateknonsolutions.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

// Central per-route head manager. index.html carries the correct defaults for
// "/" (and is what non-JS crawlers/link-preview bots see first), so this only
// needs to override those defaults on client-side navigation to every other
// route — otherwise a shared bot or a client-side nav leaves the previous
// route's title/canonical/OG tags stuck on the new page.
export default function Seo({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  imageAlt = 'A Teknon Solutions — Learn. Build. Grow. IT Internships & Training in Rajahmundry',
  ogTitle,
  ogDescription,
  noindex = false,
}) {
  const url = `${SITE_URL}${path}`;
  const isDefaultImage = image === DEFAULT_IMAGE;

  return (
    // defer={false}: commit the head synchronously instead of via
    // requestAnimationFrame. rAF-deferred commits can be starved by
    // headless/pre-render crawlers that don't run a normal paint loop —
    // exactly the audience this component exists to serve.
    <Helmet defer={false}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta
        name="robots"
        content={noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}
      />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="A Teknon Solutions" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={imageAlt} />
      {/* Width/height/type are only reliable for the site's own default image —
          a per-post featured_image has unknown dimensions, so we omit them
          rather than assert wrong hints (platforms fetch and inspect anyway). */}
      {isDefaultImage && <meta property="og:image:type" content="image/png" />}
      {isDefaultImage && <meta property="og:image:width" content="1200" />}
      {isDefaultImage && <meta property="og:image:height" content="630" />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />
    </Helmet>
  );
}
