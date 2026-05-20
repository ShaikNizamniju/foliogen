import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  path: string; // e.g. "/contact"
  image?: string;
  type?: 'website' | 'article' | 'profile';
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE_URL = 'https://www.foliogen.in';
const DEFAULT_IMAGE = `${SITE_URL}/assets/logo-DY04JMdn.png`;

export const SEO = ({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
}: SEOProps) => {
  const url = `${SITE_URL}${path === '/' ? '' : path}`;
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
      ))}
    </Helmet>
  );
};

export default SEO;
