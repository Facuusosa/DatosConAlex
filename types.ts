export enum AppView {
  LANDING = 'landing',
  PLANILLAS = 'planillas',
  PLANILLA_DETAIL = 'planilla-detail',
  CURSOS = 'cursos',
  OFERTAS = 'ofertas',
  CHECKOUT = 'checkout',
  PAYMENT_SUCCESS = 'payment-success',
  PAYMENT_FAILED = 'payment-failed',
  PAYMENT_PENDING = 'payment-pending',
}

export interface Planilla {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice: number;
  image: string;
  features: string[];
  color: 'green' | 'purple' | 'blue';
}

export interface Oferta {
  id: string;
  title: string;
  description: string;
  planillas: string[]; // IDs of included planillas
  price: number;
  originalPrice: number;
  savings: number;
  image: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice: number;
  image: string;
  instructor: string;
  duration: string;
  rating: number;
  students: number;
  lastUpdated: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  benefits: string[];
  features: string[];
}
