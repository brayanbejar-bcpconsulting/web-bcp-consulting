/**
 * Testimonios de clientes.
 * Se consumen en: Inicio (sección testimonios).
 */

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'carlos-melendez',
    quote:
      'El software a medida que nos desarrolló BCP Consulting redujo en un 40% los tiempos de gestión de inventario. Ahora tenemos control en tiempo real y menos errores en las entregas.',
    name: 'Carlos Meléndez',
    role: 'Empresario',
  },
  {
    id: 'ana-rodriguez',
    quote:
      'Necesitábamos una tienda en línea profesional y segura. El equipo entendió nuestras necesidades y en pocas semanas ya estábamos vendiendo más y con pagos totalmente integrados.',
    name: 'Ana Rodríguez',
    role: 'Emprendedora',
  },
  {
    id: 'javier-lopez',
    quote:
      'Nos diseñaron una plataforma educativa con aulas virtuales. Lo mejor es que los alumnos pueden conectarse sin problemas desde cualquier dispositivo y nuestras inscripciones aumentaron un 30%.',
    name: 'Javier López',
    role: 'Director Académico',
  },
];
