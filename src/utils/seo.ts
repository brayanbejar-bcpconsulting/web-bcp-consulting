/**
 * Utilidades SEO: genera JSON-LD schemas.
 */
import { SITE_INFO } from './site-config';
import { NAVIGATION } from './navigation';

const ORG_ID = `${SITE_INFO.url}/#organization`;

/**
 * Schema Organization para el sitio
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_INFO.title,
    url: SITE_INFO.url,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_INFO.url}/favicon.svg`,
    },
    taxID: NAVIGATION.contact.ruc,
    foundingDate: '2009',
    description: SITE_INFO.description,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: NAVIGATION.contact.phone,
      contactType: 'customer service',
      areaServed: 'PE',
      availableLanguage: ['Spanish'],
    },
    sameAs: [
      'https://www.facebook.com/profile.php?id=61555629673170',
      'https://www.linkedin.com/company/bcp-consulting-sac',
    ],
  };
}

/**
 * Schema LocalBusiness para SEO local
 */
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_INFO.url}/#localbusiness`,
    name: SITE_INFO.title,
    url: SITE_INFO.url,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_INFO.url}/favicon.svg`,
    },
    taxID: NAVIGATION.contact.ruc,
    telephone: NAVIGATION.contact.phone,
    email: NAVIGATION.contact.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lima',
      addressCountry: 'PE',
    },
    description: SITE_INFO.description,
    priceRange: '$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    parentOrganization: { '@id': ORG_ID },
  };
}

/**
 * Schema BreadcrumbList
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
