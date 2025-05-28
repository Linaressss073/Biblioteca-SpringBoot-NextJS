package com.alejandro.backend.controller;

import com.alejandro.backend.entity.Libro;
import com.alejandro.backend.repository.LibroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/libros")
@CrossOrigin(origins = "http://localhost:3000")
public class LibroController {

    @Autowired
    private LibroRepository libroRepository;

    // Obtener todos los libros
    @GetMapping
    public List<Libro> obtenerTodosLosLibros() {
        return libroRepository.findAll();
    }

    // Obtener libros disponibles
    @GetMapping("/disponibles")
    public List<Libro> obtenerLibrosDisponibles() {
        return libroRepository.findByDisponibleTrue();
    }

    // Obtener libro por ID
    @GetMapping("/{id}")
    public ResponseEntity<Libro> obtenerLibroPorId(@PathVariable Long id) {
        Optional<Libro> libro = libroRepository.findById(id);
        if (libro.isPresent()) {
            return ResponseEntity.ok(libro.get());
        }
        return ResponseEntity.notFound().build();
    }

    // Crear nuevo libro
    @PostMapping
    public Libro crearLibro(@RequestBody Libro libro) {
        return libroRepository.save(libro);
    }

    // Actualizar libro
    @PutMapping("/{id}")
    public ResponseEntity<Libro> actualizarLibro(@PathVariable Long id, @RequestBody Libro libroActualizado) {
        Optional<Libro> libroExistente = libroRepository.findById(id);
        if (libroExistente.isPresent()) {
            Libro libro = libroExistente.get();
            libro.setTitulo(libroActualizado.getTitulo());
            libro.setAutor(libroActualizado.getAutor());
            libro.setIsbn(libroActualizado.getIsbn());
            libro.setAñoPublicacion(libroActualizado.getAñoPublicacion());
            libro.setDisponible(libroActualizado.getDisponible());
            return ResponseEntity.ok(libroRepository.save(libro));
        }
        return ResponseEntity.notFound().build();
    }

    // Eliminar libro
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarLibro(@PathVariable Long id) {
        if (libroRepository.existsById(id)) {
            libroRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Buscar libros por título
    @GetMapping("/buscar/titulo/{titulo}")
    public List<Libro> buscarPorTitulo(@PathVariable String titulo) {
        return libroRepository.findByTituloContainingIgnoreCase(titulo);
    }

    // Buscar libros por autor
    @GetMapping("/buscar/autor/{autor}")
    public List<Libro> buscarPorAutor(@PathVariable String autor) {
        return libroRepository.findByAutorContainingIgnoreCase(autor);
    }
}