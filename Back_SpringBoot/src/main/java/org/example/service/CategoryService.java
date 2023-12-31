package org.example.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.example.domain.Category;
import org.example.dto.CategoryDTO;
import org.example.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired // 의존성 주입을 수행
    public CategoryService(CategoryRepository categoryRepository) { // 생성자 파라미터로 주입되는 CategoryRepository의 빈(bean)
        this.categoryRepository = categoryRepository; // 주입받은 빈을 CategoryService클래스의 멤버변수인 categoryRepository에 할당
    }

    // cCode 로 카테고리 조회
    public Optional<Category> getCategoryByCode(int cCode) {
        return categoryRepository.findByCCode(cCode);
    }
    public List<Category> categoryFindAll() {
        return categoryRepository.findAll();
    }

    // 부모카테고리에 해당하는 하위 카테고리 목록 조회
    public List<Category> getSubCategoriesByUpCategory(String cCategoryName) {
        return categoryRepository.findByCCategoryName(cCategoryName);
    }

    // 부모 카테고리와 하위카테고리 둘로 조회
    public Category getCategoryByUpCategoryAndName(Category category, String cCategoryName) {
        return categoryRepository.findByCUpCategoryAndCCategoryName(category, cCategoryName);
    }

    // 모든 카테고리 조회
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }


    @PersistenceContext
    private EntityManager entityManager; //임의의 쿼리문 추가


    @Transactional
    //새로운 카테고리 저장
    public int saveNewCategory(CategoryDTO categoryDTO){
        int flag = entityManager.createNativeQuery("INSERT INTO category(c_category_name,c_up_category)VALUES (?,?)")
                .setParameter(1,categoryDTO.getC_category_name())
                .setParameter(2,categoryDTO.getC_up_category()).executeUpdate();
        return flag;
    }
    // 다른 필요한 메서드들 추가 가능
}
