import React from 'react';
import { BookOpen, Star, Clock, Users, ArrowRight } from 'lucide-react';
import { AppView } from '../types';
import { courses } from '../data/mockData';

interface CatalogPageProps {
    setView: (view: AppView) => void;
    setSelectedCourseId: (id: string) => void;
}

const CatalogPage: React.FC<CatalogPageProps> = ({ setView, setSelectedCourseId }) => {

    const handleCourseClick = (courseId: string) => {
        setSelectedCourseId(courseId);
        setView(AppView.COURSE);
    };

    return (
        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
            <div className="mb-12">
                <h1 className="text-4xl font-bold mb-4">Catálogo de Cursos</h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Explora nuestra selección de cursos diseñados para llevarte desde el nivel principiante hasta experto en análisis de datos y automatización.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        onClick={() => handleCourseClick(course.id)}
                        className="group relative bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/5 hover:border-green-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] cursor-pointer"
                    >
                        {/* Image Overlay */}
                        <div className="aspect-video relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10" />
                            <img
                                src={course.image}
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4 z-20">
                                <span className="bg-green-500/10 backdrop-blur-md border border-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                    {course.level}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2 group-hover:text-green-400 transition-colors">
                                {course.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                {course.shortDescription}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
                                <div className="flex items-center gap-1">
                                    <Clock size={14} className="text-green-500" />
                                    <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star size={14} className="text-yellow-500" />
                                    <span>{course.rating}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users size={14} className="text-blue-500" />
                                    <span>{course.students}</span>
                                </div>
                            </div>

                            {/* Footer / Price */}
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex flex-col">
                                    {course.originalPrice > course.price && (
                                        <span className="text-xs text-gray-600 line-through">USD ${course.originalPrice}</span>
                                    )}
                                    <span className="text-2xl font-bold text-white">USD ${course.price}</span>
                                </div>
                                <button
                                    className="bg-white/5 hover:bg-green-500 hover:text-black text-white p-2 rounded-full transition-all duration-300 transform group-hover:translate-x-1"
                                >
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CatalogPage;
