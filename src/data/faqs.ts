/**
 * Preguntas frecuentes para la página de Contacto.
 * También aporta schema FAQPage para SEO.
 */

export interface Faq {
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    question: '¿Cuánto tiempo toma desarrollar un proyecto de software?',
    answer:
      'Depende de la complejidad. Un sitio web corporativo puede estar listo en 2-4 semanas. Un sistema a medida o una app móvil, entre 2 y 5 meses. En la reunión de asesoría gratuita te damos un cronograma estimado.',
  },
  {
    question: '¿Cuánto cuesta un proyecto con BCP Consulting?',
    answer:
      'Cada proyecto es único, por lo que trabajamos con presupuestos personalizados. Ofrecemos pagos fraccionados y en tu primera consulta te brindamos un estimado sin compromiso.',
  },
  {
    question: '¿Ofrecen soporte después del lanzamiento?',
    answer:
      'Sí, todos nuestros proyectos incluyen un período de soporte post-lanzamiento. También ofrecemos planes de mantenimiento mensual para actualizaciones, mejoras y monitoreo continuo.',
  },
  {
    question: '¿Trabajan con empresas fuera de Perú?',
    answer:
      'Sí, trabajamos con clientes en toda Latinoamérica y España. Nuestro equipo está preparado para trabajar de forma remota con comunicación constante.',
  },
  {
    question: '¿Qué tecnologías utilizan?',
    answer:
      'Usamos tecnologías modernas como React, Next.js, Astro, Node.js, Flutter, React Native, Python, PostgreSQL, Firebase y más. Elegimos la mejor tecnología según las necesidades de cada proyecto.',
  },
  {
    question: '¿Cómo es el proceso para iniciar un proyecto?',
    answer:
      'Es muy sencillo: 1) Agenda una asesoría gratuita por WhatsApp o formulario, 2) Analizamos tus necesidades y te enviamos una propuesta, 3) Aprobada la propuesta, comenzamos el desarrollo con entregas semanales.',
  },
];
