import React, { useState } from 'react';
import { AppView } from '../types';
import { PlayCircle, ChevronDown, ChevronUp, Lock, CheckCircle2, Star, Users, Layout, FileText, Download, ArrowLeft } from 'lucide-react';
import { courses } from '../data/mockData';

interface CoursePageProps {
  setView: (view: AppView) => void;
  courseId: string | null;
}

const CoursePage: React.FC<CoursePageProps> = ({ setView, courseId }) => {
  const [openModule, setOpenModule] = useState<number | null>(1);

  // Find the selected course, fallback to the first one if not found
  const course = courses.find(c => c.id === courseId) || courses[0];
  const discountPercentage = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);

  // Mock modules data (could be moved to mockData later)
  const modules = [
    {
      id: 1,
      title: "Módulo 1: Fundamentos",
      lessons: ["Bienvenida y Setup", "La Interfaz: Cintas y Barras", "Navegación Inteligente", "Formateo Esencial"]
    },
    {
      id: 2,
      title: "Módulo 2: Herramientas Principales",
      lessons: ["Crear Tablas Reales", "Filtros y Segmentadores", "Ordenamiento Lógico", "Diseño de Reportes"]
    },
    {
      id: 3,
      title: "Módulo 3: Práctica Real",
      lessons: ["Lógica de Fórmulas", "Operaciones Automáticas", "Funciones SUMA y PROMEDIO", "Proyecto Final"]
    }
  ];

  return (
    <div className="animate-in slide-in-from-bottom-8 duration-700 max-w-7xl mx-auto py-8">
      {/* Back Button */}
      <button
        onClick={() => setView(AppView.CATALOG)}
        className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span>Volver al Catálogo</span>
      </button>

      {/* Header del Curso */}
      <div className="mb-12 space-y-4">
        <div className="flex items-center gap-2 text-green-500 text-sm font-bold">
          <Layout size={16} />
          <span className="uppercase">{course.level}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black">{course.title}</h1>
        <div className="flex flex-wrap gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="text-white font-bold">{course.rating}</span> ({course.students} alumnos)
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>Actualizado {course.lastUpdated}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText size={16} />
            <span>{course.features.length} Recursos incluídos</span>
          </div>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl leading-relaxed mt-4">
          {course.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Lado Izquierdo: Contenido y Syllabus */}
        <div className="lg:col-span-2 space-y-10">

          {/* Video Player Style Container */}
          <div className="group relative aspect-video rounded-[2.5rem] overflow-hidden glass border-white/10 shadow-2xl">
            <img
              src={course.image}
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              alt={course.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-24 h-24 bg-green-500 text-black rounded-full flex items-center justify-center neon-glow group-hover:scale-110 transition-all">
                <PlayCircle size={48} className="ml-1" fill="currentColor" />
              </button>
            </div>
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center">
              <span className="text-sm font-bold bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">Clase 1: Introducción Gratuita</span>
              <div className="flex gap-2">
                <button className="p-3 glass rounded-xl hover:bg-white/10 transition-colors"><Download size={18} /></button>
              </div>
            </div>
          </div>

          {/* Ruta de Aprendizaje Detallada */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">¿Qué vas a aprender?</h2>
              <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">3 Módulos • {modules.reduce((acc, mod) => acc + mod.lessons.length, 0)} Lecciones</span>
            </div>

            <div className="space-y-4">
              {modules.map((mod) => (
                <div key={mod.id} className="glass rounded-3xl border-white/5 overflow-hidden transition-all hover:border-white/10">
                  <button
                    onClick={() => setOpenModule(openModule === mod.id ? null : mod.id)}
                    className="w-full px-8 py-6 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all ${openModule === mod.id ? 'bg-green-500 text-black' : 'bg-white/5 text-gray-500'}`}>
                        {mod.id}
                      </div>
                      <span className={`text-lg font-bold text-left group-hover:text-green-400 transition-colors ${openModule === mod.id ? 'text-green-400' : ''}`}>{mod.title}</span>
                    </div>
                    {openModule === mod.id ? <ChevronUp size={20} className="text-green-500" /> : <ChevronDown size={20} className="text-gray-600" />}
                  </button>
                  {openModule === mod.id && (
                    <div className="px-8 pb-8 pt-2 space-y-2 border-t border-white/5 bg-white/[0.02] animate-in slide-in-from-top-2 duration-300">
                      {mod.lessons.map((lesson, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group">
                          <div className="flex items-center gap-4">
                            <PlayCircle size={18} className="text-gray-600 group-hover:text-green-500 transition-colors" />
                            <span className="text-gray-300 group-hover:text-white font-medium">{lesson}</span>
                          </div>
                          {idx === 0 && mod.id === 1 ? (
                            <span className="text-[10px] font-black text-green-500 uppercase tracking-tighter bg-green-500/10 px-2 py-1 rounded-md">Vista Previa</span>
                          ) : (
                            <Lock size={14} className="text-gray-700" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lado Derecho: Sidebar de Pago */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-6">
            <div className="glass p-10 rounded-[3rem] border-white/10 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700"></div>

              <div className="space-y-6 relative z-10 text-center">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Precio de Lanzamiento</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-5xl font-black">${course.price}</span>
                    <div className="text-left">
                      <p className="text-xs text-gray-500 line-through">USD ${course.originalPrice}</p>
                      <p className="text-xs text-green-500 font-bold">Ahorra {discountPercentage}%</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  {course.benefits.slice(0, 3).map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                      <CheckCircle2 size={18} className="text-green-500" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setView(AppView.CHECKOUT)}
                  className="w-full py-5 bg-green-500 text-black font-black rounded-[2rem] hover:scale-105 active:scale-95 transition-all duration-300 neon-glow text-lg uppercase tracking-wider"
                >
                  Comenzar Ahora
                </button>
                <p className="text-[10px] text-gray-500 font-medium">Garantía de devolución de 30 días</p>
              </div>
            </div>

            {/* Testimonial Pequeño */}
            <div className="glass p-6 rounded-3xl border-white/5 flex items-center gap-4">
              <img src="https://i.pravatar.cc/100?u=ju" className="w-12 h-12 rounded-full border border-green-500/30" alt="Alumna" />
              <div>
                <p className="text-xs italic text-gray-400">"El curso de {course.title.split(":")[0]} cambió mi forma de trabajar."</p>
                <p className="text-[10px] font-bold text-white mt-1">— Estudiante Verificad@</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
