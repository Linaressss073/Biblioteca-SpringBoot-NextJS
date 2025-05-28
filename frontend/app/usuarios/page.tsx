'use client';

import { useState, useEffect } from 'react';
import { usuariosAPI, Usuario } from '../../lib/api';
import Link from 'next/link';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, [filtro]);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      let response;
      
      if (filtro === 'activos') {
        response = await usuariosAPI.obtenerActivos();
      } else {
        response = await usuariosAPI.obtenerTodos();
      }
      
      setUsuarios(response.data);
    } catch (err) {
      setError('Error al cargar los usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const buscarUsuarios = async () => {
    if (!busqueda.trim()) {
      cargarUsuarios();
      return;
    }

    try {
      setLoading(true);
      const response = await usuariosAPI.buscarPorNombre(busqueda);
      setUsuarios(response.data);
    } catch (err) {
      setError('Error en la búsqueda');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    try {
      await usuariosAPI.eliminar(id.toString());
      setUsuarios(usuarios.filter(usuario => usuario.id !== id));
      alert('Usuario eliminado exitosamente');
    } catch (err) {
      alert('Error al eliminar el usuario');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center">Cargando usuarios...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <Link 
          href="/usuarios/nuevo"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          ➕ Agregar Usuario
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
              onClick={() => setFiltro('activos')}
              className={`px-4 py-2 rounded ${filtro === 'activos' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
            >
              Activos
            </button>
          </div>

          {/* Búsqueda */}
          <div className="flex flex-1 gap-2">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg"
              onKeyPress={(e) => e.key === 'Enter' && buscarUsuarios()}
            />
            <button
              onClick={buscarUsuarios}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              🔍
            </button>
          </div>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {usuarios.map((usuario) => (
          <div key={usuario.id} className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg text-gray-800">{usuario.nombre}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {usuario.activo ? '✅' : '❌'}
              </span>
            </div>
            
            <div className="space-y-1 text-gray-600 mb-4">
              <p><strong>Email:</strong> {usuario.email}</p>
              <p><strong>Teléfono:</strong> {usuario.telefono || 'No especificado'}</p>
              <p><strong>ID:</strong> {usuario.id}</p>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/usuarios/${usuario.id}`}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 rounded text-sm"
              >
                Ver Detalles
              </Link>
              <Link
                href={`/usuarios/${usuario.id}/editar`}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-center py-2 rounded text-sm"
              >
                Editar
              </Link>
              <button
                onClick={() => eliminarUsuario(usuario.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {usuarios.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron usuarios
        </div>
      )}
    </div>
  );
}