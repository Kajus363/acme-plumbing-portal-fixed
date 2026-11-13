const business = {
  "@context": "https://schema.org",
  "@type": "Plumber",
  name: "Acme Plumbing & Heating",
  telephone: "+1-555-555-0142",
  url: process.env.NEXT_PUBLIC_SITE_URL,
  areaServed: "Springfield",
  openingHours: "Mo-Fr 07:00-19:00",
};

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(business).replace(/</g, "\\u003c") }}
    />
  );
}
