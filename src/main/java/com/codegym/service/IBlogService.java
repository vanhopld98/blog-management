package com.codegym.service;

import com.codegym.model.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface IBlogService {

    Page<Blog> findAll(Pageable pageable);

    Iterable<Blog> findAll();

    Optional<Blog> findById(Long id);

    void remove(Long id);

    Blog save(Blog blog);

    Page<Blog> findAllByContentContaining(String content, Pageable pageable);
}
