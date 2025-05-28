"use client"

import { useState, useEffect } from 'react';
import { librosAPI } from '../lib/api';

export default function LibrosList() {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarLibros();
  }, []);

  const cargarLibros = async () => {
    try {
      setLoading(true);
      const response = await librosAPI.obtenerTodos();
      setLibros(response.data);
    } catch (err) {
      setError('Error al cargar los libros');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando libros...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Lista de Libros</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {libros.map((libro) => (
          <div key={libro.id} className="border rounded-lg p-4 shadow">
            <h3 className="font-semibold text-lg">{libro.titulo}</h3>
            <p className="text-gray-600">Autor: {libro.autor}</p>
            <p className="text-gray-500">ISBN: {libro.isbn}</p>
            <p className="text-gray-500">Año: {libro.añoPublicacion}</p>
            <span className={`inline-block px-2 py-1 rounded text-sm ${
              libro.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {libro.disponible ? 'Disponible' : 'Prestado'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}