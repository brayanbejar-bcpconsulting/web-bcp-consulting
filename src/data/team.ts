/**
 * Datos de la empresa: valores, estadísticas y metodología.
 * Se consumen en: Nosotros, Inicio (stats).
 */

export interface CompanyStat {
  value: string;
  label: string;
  suffix?: string;
}

export interface CompanyValue {
  title: string;
  description: string;
  icon: string;
}

export interface MethodologyStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export const COMPANY_INFO = {
  name: 'BCP Consulting E.I.R.L.',
  ruc: '20612012475',
  founded: 2010,
  location: 'Lima, Perú',
  about:
    'Somos una empresa peruana de tecnología con más de 15 años de experiencia, especializada en el desarrollo de software a medida, aplicaciones móviles y sitios web empresariales para pymes y startups que buscan crecer con tecnología.',
  mission:
    'Impulsar el crecimiento de empresas en Perú y Latinoamérica a través de soluciones de software innovadoras, accesibles y adaptadas a las necesidades reales de cada negocio.',
  vision:
    'Ser la consultora de software de referencia para pymes y startups en Latinoamérica, reconocida por la calidad de sus soluciones, la transparencia en sus procesos y el impacto real en los negocios de sus clientes.',
};

export const COMPANY_STATS: CompanyStat[] = [
  { value: '15', label: 'Años de experiencia', suffix: '+' },
  { value: '200', label: 'Proyectos entregados', suffix: '+' },
  { value: '120', label: 'Clientes satisfechos', suffix: '+' },
  { value: '8', label: 'Sectores atendidos', suffix: '' },
];

export const COMPANY_VALUES: CompanyValue[] = [
  {
    title: 'Innovación Constante',
    description:
      'Adoptamos las últimas tecnologías y metodologías para ofrecer soluciones que marcan la diferencia.',
    icon: 'lightbulb',
  },
  {
    title: 'Compromiso con el Cliente',
    description:
      'Tu éxito es nuestro éxito. Trabajamos como un aliado estratégico que entiende tus objetivos de negocio.',
    icon: 'handshake',
  },
  {
    title: 'Transparencia Total',
    description:
      'Comunicación clara desde el primer día. Sin sorpresas, con reportes de avance y acceso directo al equipo.',
    icon: 'shield-check',
  },
  {
    title: 'Calidad Garantizada',
    description:
      'Código limpio, pruebas rigurosas y buenas prácticas. Cada proyecto pasa por control de calidad antes de la entrega.',
    icon: 'star',
  },
];

export const METHODOLOGY_STEPS: MethodologyStep[] = [
  {
    step: 1,
    title: 'Análisis y Consultoría',
    description:
      'Escuchamos tus necesidades, analizamos tus procesos y definimos los requisitos del proyecto con un plan claro.',
    icon: 'search',
  },
  {
    step: 2,
    title: 'Diseño UX/UI',
    description:
      'Diseñamos prototipos interactivos centrados en el usuario para validar la experiencia antes de desarrollar.',
    icon: 'layout',
  },
  {
    step: 3,
    title: 'Desarrollo Ágil',
    description:
      'Construimos tu solución en sprints con entregas parciales, para que veas avances reales cada semana.',
    icon: 'code',
  },
  {
    step: 4,
    title: 'Lanzamiento y Soporte',
    description:
      'Desplegamos tu proyecto, capacitamos a tu equipo y ofrecemos soporte continuo post-lanzamiento.',
    icon: 'rocket',
  },
];
