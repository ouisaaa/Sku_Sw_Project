package org.example.repository;

import org.example.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    // cCode로 조회
    Optional<Category> findByCCode(int CCode);

    // cUpCategory(부모 카테고리)에 해당하는 하위 카테고리 목록조회
    List<Category> findByCCategoryName(String CCategoryName);

    // 부모 카테고리와 카테고리명으로 카테고리 조회
    Category findByCUpCategoryAndCCategoryName(Category category, String CCategoryName);

    long count();
}
