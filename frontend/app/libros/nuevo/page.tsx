'use client';

import { useState } from 'react';
import { librosAPI, Libro } from '../../../lib/api';
import { useRouter } from 'next/navigation';

export default function NuevoLibro() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [libro, setLibro] = useState({
    titulo: '',
    autor: '',
    isbn: '',
    añoPublicacion: '',
    disponible: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLibro(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!libro.titulo || !libro.autor) {
      alert('Título y autor son obligatorios');
      return;
    }

    try {
      setLoading(true);
      
      const libroData: Omit<Libro, 'id'> = {
        titulo: libro.titulo,
        autor: libro.autor,
        isbn: libro.isbn || undefined,
        añoPublicacion: libro.añoPublicacion ? parseInt(libro.añoPublicacion) : undefined,
        disponible: libro.disponible
      };

      await librosAPI.crear(libroData);
      alert('Libro creado exitosamente');
      router.push('/libros');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el libro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Agregar Nuevo Libro</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              name="titulo"
              value={libro.titulo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Autor *
            </label>
            <input
              type="text"
              name="autor"
              value={libro.autor}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN
            </label>
            <input
              type="text"
              name="isbn"
              value={libro.isbn}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Año de Publicación
            </label>
            <input
              type="number"
              name="añoPublicacion"
              value={libro.añoPublicacion}
              onChange={handleChange}
              min="1000"
              max="2025"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="disponible"
              checked={libro.disponible}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Disponible para préstamo
            </label>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 px-4 rounded-lg font-medium"
          >
            {loading ? 'Guardando...' : 'Guardar Libro'}
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/libros')}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
