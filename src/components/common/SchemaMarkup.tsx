import React from 'react';

export const SchemaMarkup: React.FC = () => {
  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "name": "JEEV RUTHI COLLECTION",
    "image": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
    "@id": "https://jeevruthi.com",
    "url": "https://jeevruthi.com",
    "telephone": "+919876543210",
    "priceRange": "$$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Luxury Flagship Showroom",
      "addressLocality": "New Delhi",
      "addressRegion": "DL",
      "postalCode": "110057",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.5562,
      "longitude": 77.1677
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "10:00",
      "closes": "22:00"
    },
    "sameAs": [
      "https://maps.app.goo.gl/QwoTg7hgNXX9gPp96",
      "https://facebook.com/jeevruthi",
      "https://instagram.com/jeevruthi"
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://jeevruthi.com"
    },{
      "@type": "ListItem",
      "position": 2,
      "name": "Women Fashion",
      "item": "https://jeevruthi.com/shop?category=Women"
    },{
      "@type": "ListItem",
      "position": 3,
      "name": "Kids Fashion",
      "item": "https://jeevruthi.com/shop?category=Kids"
    }]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
};
