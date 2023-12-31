package org.example.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.domain.Category;
import org.example.dto.CategoryDTO;
import org.example.service.CategoryService;
import org.example.telegram.Telegram;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/category")
@Slf4j
public class CategoryController {

    private final CategoryService categoryService;
    private Telegram telegram = new Telegram();

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/")
    public ResponseEntity<List<Category>> categoryProduct(){
        List<Category> categories = categoryService.categoryFindAll();

        return ResponseEntity.ok().body(categories);
    }

    @GetMapping("/cCode")
    public Optional<Category> getCategoryByCode(@RequestParam int cCode) {
        return categoryService.getCategoryByCode(cCode);
    }

    @GetMapping("/subcategories")
    public List<Category> getSubCategoriesByUpCategory(@RequestParam String cCategoryName) {
        return categoryService.getSubCategoriesByUpCategory(cCategoryName);
    }

    @GetMapping("/categoryByName")
    public Category getCategoryByUpCategoryAndName(
            @RequestParam("upCategoryCode") int upCategoryCode,
            @RequestParam("categoryName") String categoryName) {
        Category upCategory = categoryService.getCategoryByCode(upCategoryCode).orElse(null);
        return categoryService.getCategoryByUpCategoryAndName(upCategory, categoryName);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories=categoryService.getAllCategories();

        return ResponseEntity.ok().body(categories);
    }
    @PostMapping("/newCategory")
    public ResponseEntity<Category> addNewCategory(@RequestBody CategoryDTO categoryDTO){

       // System.out.println(categoryDTO.toEntity());
        int flag=categoryService.saveNewCategory(categoryDTO);
        if(flag == 0){
            log.error("category/newCategory Error");
            telegram.sendMessage("category/newCategory Error");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(null);
    }

    // 다른 필요한 엔드포인트들 추가 가능
}