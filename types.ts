export enum AppView {
  LANDING = 'landing',
  COURSE = 'course',
  CATALOG = 'catalog',
  CHECKOUT = 'checkout',
  LOGIN = 'login',
  DASHBOARD = 'dashboard',
  ABOUT = 'about'
}

export interface User {
  name: string;
  avatar: string;
  enrolledCourses: number;
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
