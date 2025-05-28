package com.alejandro.backend.repository;

import com.alejandro.backend.entity.Libro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LibroRepository extends JpaRepository<Libro, Long> {

    // Buscar libros disponibles
    List<Libro> findByDisponibleTrue();

    // Buscar por título (ignorando mayúsculas/minúsculas)
    @Query("SELECT l FROM Libro l WHERE LOWER(l.titulo) LIKE LOWER(CONCAT('%', :titulo, '%'))")
    List<Libro> findByTituloContainingIgnoreCase(@Param("titulo") String titulo);

    // Buscar por autor
    @Query("SELECT l FROM Libro l WHERE LOWER(l.autor) LIKE LOWER(CONCAT('%', :autor, '%'))")
    List<Libro> findByAutorContainingIgnoreCase(@Param("autor") String autor);
}