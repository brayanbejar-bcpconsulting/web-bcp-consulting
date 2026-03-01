/**
 * Interface para definir la estructura de un enlace individual
 */
export interface NavLink {
  title: string;
  path: string;
  icon?: string;
  external?: boolean; // Para identificar si abre en pestaña nueva
}

/**
 * Interface para menús con subelementos (Dropdowns)
 */
export interface NavMenu extends NavLink {
  children?: NavLink[];
}

/**
 * Configuración centralizada de navegación
 */
export const NAVIGATION = {
  // Enlaces principales del Header
  main: [
    { title: 'Inicio', path: '/', icon: 'home' },
    { 
      title: 'Servicios', 
      path: '/servicios',
      icon: 'layers',
      children: [
        { title: 'Diseño Web', path: '/servicios/web', icon: 'monitor' },
        { title: 'Software a Medida', path: '/servicios/software', icon: 'code' },
        { title: 'Aplicaciones Móviles', path: '/servicios/apps-moviles', icon: 'smartphone' },
        { title: 'Consultoría', path: '/servicios/apps-consultoria', icon: 'lightbulb' },
      ]
    },
    { title: 'Portafolio', path: '/portafolio', icon: 'folder-open' },
    { title: 'Nosotros', path: '/nosotros', icon: 'users' },
    { title: 'Blog', path: '/blog', icon: 'newspaper' },
    { title: 'Contacto', path: '/contacto', icon: 'mail' },
  ] as NavMenu[],

  // Enlaces secundarios o legales (útil para el Footer)
  footer: [
    { title: 'Políticas de Privacidad', path: '/legal/politicas-privacidad' },
    { title: 'Términos y Condiciones', path: '/legal/terminos-condiciones' },
  ] as NavLink[],

  // Información de contacto y redes sociales
  contact: {
    ruc: '20612012475',
    email: 'soporte@bcpconsulting.pe',
    phone: '+51 929 772 711',
  },
};