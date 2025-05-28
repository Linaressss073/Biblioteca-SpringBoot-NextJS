'use client';

import { useState, useEffect } from 'react';
import { librosAPI, Libro } from '../../lib/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function LibrosPage() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    cargarLibros();
  }, [filtro]);

  useEffect(() => {
    // Si viene de la URL con filtro disponibles
    if (searchParams.get('disponibles') === 'true') {
      setFiltro('disponibles');
    }
  }, [searchParams]);

  const cargarLibros = async () => {
    try {
      setLoading(true);
      let response;
      
      if (filtro === 'disponibles') {
        response = await librosAPI.obtenerDisponibles();
      } else {
        response = await librosAPI.obtenerTodos();
      }
      
      setLibros(response.data);
    } catch (err) {
      setError('Error al cargar los libros');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const buscarLibros = async () => {
    if (!busqueda.trim()) {
      cargarLibros();
      return;
    }

    try {
      setLoading(true);
      const response = await librosAPI.buscarPorTitulo(busqueda);
      setLibros(response.data);
    } catch (err) {
      setError('Error en la búsqueda');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const eliminarLibro = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este libro?')) {
      return;
    }

    try {
      await librosAPI.eliminar(id.toString());
      setLibros(libros.filter(libro => libro.id !== id));
    } catch (err) {
      alert('Error al eliminar el libro');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center">Cargando libros...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Libros</h1>
        <Link 
          href="/libros/nuevo"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          ➕ Agregar Libro
        </Link>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Filtros */}
          <div className="flex gap-2">
            <button
              onClick={() => setFiltro('todos')}
              className={`px-4 py-2 rounded ${filtro === 'todos' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltro('disponibles')}
              className={`px-4 py-2 rounded ${filtro === 'disponibles' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            >
              Disponibles
            </button>
          </div>

          {/* Búsqueda */}
          <div className="flex flex-1 gap-2">
            <input
              type="text"
              placeholder="Buscar por título..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg"
              onKeyPress={(e) => e.key === 'Enter' && buscarLibros()}
            />
            <button
              onClick={buscarLibros}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              🔍
            </button>
          </div>
        </div>
      </div>

      {/* Lista de libros */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {libros.map((libro) => (
          <div key={libro.id} className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg text-gray-800">{libro.titulo}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                libro.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {libro.disponible ? '✅' : '❌'}
              </span>
            </div>
            
            <div className="space-y-1 text-gray-600 mb-4">
              <p><strong>Autor:</strong> {libro.autor}</p>
              <p><strong>ISBN:</strong> {libro.isbn}</p>
              <p><strong>Año:</strong> {libro.añoPublicacion}</p>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/libros/${libro.id}`}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 rounded text-sm"
              >
                Ver Detalles
              </Link>
              <Link
                href={`/libros/${libro.id}/editar`}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-center py-2 rounded text-sm"
              >
                Editar
              </Link>
              <button
                onClick={() => eliminarLibro(libro.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {libros.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron libros
        </div>
      )}
    </div>
  );
}