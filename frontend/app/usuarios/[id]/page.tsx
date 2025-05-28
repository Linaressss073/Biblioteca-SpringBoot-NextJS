// app/usuarios/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { usuariosAPI, Usuario } from '../../../lib/api';

export default function DetalleUsuario() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      cargarUsuario();
    }
  }, [id]);

  const cargarUsuario = async () => {
    try {
      setLoading(true);
      const response = await usuariosAPI.obtenerPorId(id);
      setUsuario(response.data);
    } catch (err) {
      setError('Error al cargar el usuario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    try {
      await usuariosAPI.eliminar(id);
      alert('Usuario eliminado exitosamente');
      router.push('/usuarios');
    } catch (err) {
      alert('Error al eliminar el usuario');
      console.error(err);
    }
  };

  if (loading) return <div className="text-center">Cargando usuario...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;
  if (!usuario) return <div className="text-center">Usuario no encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/usuarios" className="text-blue-500 hover:text-blue-600">
          ← Volver a la lista
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{usuario.nombre}</h1>
            <p className="text-xl text-gray-600">{usuario.email}</p>
          </div>
          <span className={`px-4 py-2 rounded-lg text-lg font-medium ${
            usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {usuario.activo ? '✅ Activo' : '❌ Inactivo'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="font-semibold text-gray-700">Email</h3>
              <p className="text-gray-600">{usuario.email}</p>
            </div>
            
            <div className="border-b pb-2">
              <h3 className="font-semibold text-gray-700">Teléfono</h3>
              <p className="text-gray-600">{usuario.telefono || 'No especificado'}</p>
            </div>
            
            <div className="border-b pb-2">
              <h3 className="font-semibold text-gray-700">Estado</h3>
              <p className="text-gray-600">{usuario.activo ? 'Usuario activo' : 'Usuario inactivo'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-b pb-2">
              <h3 className="font-semibold text-gray-700">ID del Usuario</h3>
              <p className="text-gray-600">{usuario.id}</p>
            </div>
            
            <div className="border-b pb-2">
              <h3 className="font-semibold text-gray-700">Fecha de Registro</h3>
              <p className="text-gray-600">
                {usuario.fechaCreacion ? new Date(usuario.fechaCreacion).toLocaleDateString() : 'No disponible'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            href={`/usuarios/${usuario.id}/editar`}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            ✏️ Editar Usuario
          </Link>
          
          <button
            onClick={eliminarUsuario}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            🗑️ Eliminar Usuario
          </button>
          
          {usuario.activo && (
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium">
              📚 Ver Préstamos
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
