'use client';

import { useState, useEffect } from 'react';
import { librosAPI } from '../lib/api';
import Link from 'next/link';

interface Stats {
  totalLibros: number;
  librosDisponibles: number;
  librosPrestados: number;
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    totalLibros: 0,
    librosDisponibles: 0,
    librosPrestados: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const [todosResponse, disponiblesResponse] = await Promise.all([
        librosAPI.obtenerTodos(),
        librosAPI.obtenerDisponibles()
      ]);
      
      const totalLibros = todosResponse.data.length;
      const librosDisponibles = disponiblesResponse.data.length;
      const librosPrestados = totalLibros - librosDisponibles;

      setStats({
        totalLibros,
        librosDisponibles,
        librosPrestados
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          📚 Sistema de Biblioteca
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Gestiona tu colección de libros de manera eficiente
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {loading ? '...' : stats.totalLibros}
          </div>
          <div className="text-gray-600">Total de Libros</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {loading ? '...' : stats.librosDisponibles}
          </div>
          <div className="text-gray-600">Libros Disponibles</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {loading ? '...' : stats.librosPrestados}
          </div>
          <div className="text-gray-600">Libros Prestados</div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/libros" className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-center transition">
            <div className="text-2xl mb-2">📖</div>
            Ver Todos los Libros
          </Link>
          
          <Link href="/libros/nuevo" className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-center transition">
            <div className="text-2xl mb-2">➕</div>
            Agregar Libro
          </Link>
          
          <Link href="/usuarios" className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg text-center transition">
            <div className="text-2xl mb-2">👥</div>
            Gestionar Usuarios
          </Link>
          
          <Link href="/libros?disponibles=true" className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg text-center transition">
            <div className="text-2xl mb-2">✅</div>
            Libros Disponibles
          </Link>
        </div>
      </div>
    </div>
  );
}