import { Helmet } from 'react-helmet-async';

interface SeoHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}

const DEFAULT_OG_IMAGE = '/og-image.png';

export function SeoHead({ 
  title, 
  description, 
  image, 
  url,
  type = 'website'
}: SeoHeadProps) {
  const ogImage = image || DEFAULT_OG_IMAGE;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="FolioGen.in" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
}
