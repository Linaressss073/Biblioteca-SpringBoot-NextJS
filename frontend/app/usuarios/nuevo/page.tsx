// app/usuarios/nuevo/page.tsx
'use client';

import { useState } from 'react';
import { usuariosAPI, Usuario } from '../../../lib/api';
import { useRouter } from 'next/navigation';

export default function NuevoUsuario() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    telefono: '',
    activo: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUsuario(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuario.nombre || !usuario.email) {
      alert('Nombre y email son obligatorios');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(usuario.email)) {
      alert('Ingrese un email válido');
      return;
    }

    try {
      setLoading(true);
      
      const usuarioData: Omit<Usuario, 'id'> = {
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono || undefined,
        activo: usuario.activo
      };

      await usuariosAPI.crear(usuarioData);
      alert('Usuario creado exitosamente');
      router.push('/usuarios');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Agregar Nuevo Usuario</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              name="nombre"
              value={usuario.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={usuario.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={usuario.telefono}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="activo"
              checked={usuario.activo}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Usuario activo
            </label>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 px-4 rounded-lg font-medium"
          >
            {loading ? 'Guardando...' : 'Guardar Usuario'}
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/usuarios')}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}