/**
 * Datos centralizados de servicios.
 * Se consumen en: Inicio (resumen), Servicios (detalle) y subpáginas.
 */

export interface ServiceFeature {
  title: string;
  description: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  /** Nombre del símbolo en /icons/sprite.svg */
  icon: string;
  href: string;
  features: ServiceFeature[];
}

export const SERVICES: Service[] = [
  {
    id: 'software',
    title: 'Desarrollo de Software a Medida',
    slug: 'software',
    tagline: 'Sistemas que optimizan tu operación',
    description:
      'Diseñamos y desarrollamos sistemas empresariales personalizados que automatizan procesos, centralizan información y escalan con tu negocio. Desde ERPs hasta plataformas SaaS.',
    icon: 'code',
    href: '/servicios/software',
    features: [
      {
        title: 'Sistemas ERP y Gestión',
        description:
          'Centraliza finanzas, RRHH, contabilidad y operaciones en una sola plataforma segura. Toma decisiones basadas en datos en tiempo real.',
      },
      {
        title: 'CRM y Pipeline de Ventas',
        description:
          'Optimiza tu proceso comercial. Gestiona leads, automatiza el seguimiento y mejora la retención de clientes con herramientas personalizadas.',
      },
      {
        title: 'Plataformas SaaS Escalables',
        description:
          'Transformamos tu idea en un software robusto en la nube. Arquitectura multi-tenant, segura y lista para miles de usuarios.',
      },
      {
        title: 'Logística e Inventarios',
        description:
          'Software a medida para trazabilidad, control de almacenes, rutas de despacho y gestión de proveedores. Reduce mermas y optimiza tu cadena de suministro.',
      },
      {
        title: 'Automatización de Procesos',
        description:
          'Eliminamos tareas manuales repetitivas. Conectamos tus herramientas actuales (API) y creamos flujos automáticos que ahorran tiempo.',
      },
      {
        title: 'Software por Sector',
        description:
          'Soluciones especializadas para clínicas, gimnasios, restaurantes, e-commerce, academias y más. Adaptadas a las necesidades de cada industria.',
      },
    ],
  },
  {
    id: 'apps-moviles',
    title: 'Aplicaciones Móviles',
    slug: 'apps-moviles',
    tagline: 'Tu empresa en el bolsillo de tus clientes',
    description:
      'Creamos aplicaciones nativas para Android e iOS con alto rendimiento, diseño intuitivo y experiencias que fidelizan usuarios y generan nuevas oportunidades de negocio.',
    icon: 'smartphone',
    href: '/servicios/apps-moviles',
    features: [
      {
        title: 'Apps Nativas (Android & iOS)',
        description:
          'Rendimiento óptimo y acceso completo al hardware del dispositivo para experiencias fluidas.',
      },
      {
        title: 'Notificaciones Push',
        description:
          'Mantén a tus clientes informados con promociones, actualizaciones y alertas que llegan directo a su celular.',
      },
      {
        title: 'Integración con Backend',
        description:
          'Conectamos tu app con APIs, pasarelas de pago, geolocalización y servicios en la nube.',
      },
      {
        title: 'Diseño UX/UI Móvil',
        description:
          'Interfaces pensadas para el usuario móvil: navegación intuitiva, carga rápida y experiencia premium.',
      },
      {
        title: 'Publicación en Stores',
        description:
          'Gestionamos la publicación completa en Google Play Store y Apple App Store.',
      },
      {
        title: 'Mantenimiento y Actualizaciones',
        description:
          'Soporte continuo post-lanzamiento con actualizaciones, mejoras y monitoreo de rendimiento.',
      },
    ],
  },
  {
    id: 'web',
    title: 'Diseño y Desarrollo Web',
    slug: 'web',
    tagline: 'Presencia digital que convierte',
    description:
      'Construimos sitios web empresariales rápidos, seguros y optimizados para SEO. Desde landing pages hasta plataformas corporativas que posicionan tu marca y generan leads.',
    icon: 'globe',
    href: '/servicios/web',
    features: [
      {
        title: 'Páginas Web Corporativas',
        description:
          'Sitios profesionales que reflejan la identidad de tu marca y generan confianza en tus visitantes.',
      },
      {
        title: 'Landing Pages de Conversión',
        description:
          'Páginas diseñadas específicamente para captar leads y maximizar las conversiones de tus campañas.',
      },
      {
        title: 'E-commerce y Tiendas Online',
        description:
          'Catálogo digital, carrito de compras, pasarelas de pago seguras y seguimiento de pedidos. Vende 24/7.',
      },
      {
        title: 'Optimización SEO',
        description:
          'Estructura, velocidad y contenido optimizados para que Google posicione tu sitio en los primeros resultados.',
      },
      {
        title: 'Diseño Responsive',
        description:
          'Tu web se adapta perfectamente a cualquier dispositivo: móvil, tablet y escritorio.',
      },
      {
        title: 'Hosting y Mantenimiento',
        description:
          'Servidores seguros, certificados SSL, backups automáticos y soporte técnico continuo.',
      },
    ],
  },
];

/** Servicios resumidos para la home */
export const SERVICES_SUMMARY = SERVICES.map(({ id, title, tagline, icon, href }) => ({
  id,
  title,
  tagline,
  icon,
  href,
}));
