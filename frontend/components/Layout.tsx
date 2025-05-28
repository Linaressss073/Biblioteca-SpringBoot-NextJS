'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navegación */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-xl font-bold">
              📚 Biblioteca System
            </Link>
            <div className="space-x-4">
              <Link 
                href="/" 
                className={`px-3 py-2 rounded ${isActive('/') ? 'bg-blue-800' : 'hover:bg-blue-700'}`}
              >
                Inicio
              </Link>
              <Link 
                href="/libros" 
                className={`px-3 py-2 rounded ${isActive('/libros') ? 'bg-blue-800' : 'hover:bg-blue-700'}`}
              >
                Libros
              </Link>
              <Link 
                href="/libros/nuevo" 
                className={`px-3 py-2 rounded ${isActive('/libros/nuevo') ? 'bg-blue-800' : 'hover:bg-blue-700'}`}
              >
                Agregar Libro
              </Link>
              <Link 
                href="/usuarios" 
                className={`px-3 py-2 rounded ${isActive('/usuarios') ? 'bg-blue-800' : 'hover:bg-blue-700'}`}
              >
                Usuarios
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
        <p>&copy; 2025 Sistema de Biblioteca - Hecho con Next.js + Spring Boot</p>
      </footer>
    </div>
  );
}
