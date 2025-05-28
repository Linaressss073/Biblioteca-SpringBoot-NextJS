import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaces
export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  isbn?: string;
  añoPublicacion?: number;
  disponible: boolean;
  fechaCreacion?: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  fechaCreacion?: string;
  activo: boolean;
}

// Servicios para libros
export const librosAPI = {
  obtenerTodos: () => api.get<Libro[]>('/libros'),
  obtenerDisponibles: () => api.get<Libro[]>('/libros/disponibles'),
  obtenerPorId: (id: string) => api.get<Libro>(`/libros/${id}`),
  crear: (libro: Omit<Libro, 'id'>) => api.post<Libro>('/libros', libro),
  actualizar: (id: string, libro: Partial<Libro>) => api.put<Libro>(`/libros/${id}`, libro),
  eliminar: (id: string) => api.delete(`/libros/${id}`),
  buscarPorTitulo: (titulo: string) => api.get<Libro[]>(`/libros/buscar/titulo/${titulo}`),
  buscarPorAutor: (autor: string) => api.get<Libro[]>(`/libros/buscar/autor/${autor}`),
};

// Servicios para usuarios
export const usuariosAPI = {
  obtenerTodos: () => api.get<Usuario[]>('/usuarios'),
  obtenerActivos: () => api.get<Usuario[]>('/usuarios/activos'),
  obtenerPorId: (id: string) => api.get<Usuario>(`/usuarios/${id}`),
  crear: (usuario: Omit<Usuario, 'id'>) => api.post<Usuario>('/usuarios', usuario),
  actualizar: (id: string, usuario: Partial<Usuario>) => api.put<Usuario>(`/usuarios/${id}`, usuario),
  eliminar: (id: string) => api.delete(`/usuarios/${id}`),
  buscarPorNombre: (nombre: string) => api.get<Usuario[]>(`/usuarios/buscar/nombre/${nombre}`),
  buscarPorEmail: (email: string) => api.get<Usuario[]>(`/usuarios/buscar/email/${email}`),
};


export default api;