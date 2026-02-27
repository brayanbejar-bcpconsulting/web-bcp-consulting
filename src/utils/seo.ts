/**
 * Utilidades SEO: genera JSON-LD schemas.
 */
import { SITE_INFO } from './site-config';
import { NAVIGATION } from './navigation';

/**
 * Schema Organization para el sitio
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_INFO.title,
    url: SITE_INFO.url,
    logo: `${SITE_INFO.url}/favicon.svg`,
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
    name: SITE_INFO.title,
    url: SITE_INFO.url,
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
