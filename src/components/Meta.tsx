import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

type MetaProps = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  canonical?: string;
  jsonLd?: any | any[];
};

const Meta: React.FC<MetaProps> = ({
  title = 'YoungHouse Hoà Lạc - Trọ Hoà Lạc',
  description = 'YoungHouse - Hệ thống nhà trọ tiện nghi tại Hoà Lạc, gần FPT University.',
  url = 'https://younghousehoalac.com/',
  image = '/logo.png',
  canonical,
  jsonLd
}) => {
  const pageTitle = title;
  const canonicalUrl = canonical || url;
  const ogImage = image.startsWith('http') ? image : `https://younghousehoalac.com${image}`;

  return (
    <HelmetProvider>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        {jsonLd && (
          Array.isArray(jsonLd)
            ? jsonLd.map((item, idx) => (
                <script key={idx} type="application/ld+json">{JSON.stringify(item)}</script>
              ))
            : <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        )}
      </Helmet>
    </HelmetProvider>
  );
};

export default Meta;


