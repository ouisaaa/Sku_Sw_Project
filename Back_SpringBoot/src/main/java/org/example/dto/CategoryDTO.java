package org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.domain.Category;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class CategoryDTO {
    private int c_code;
    private String c_category_name;
    private String c_up_category;

    public Category toEntity(){
        return Category.builder()
                .CCode(c_code)
                .CUpCategory(c_up_category)
                .CCategoryName(c_category_name)
                .build();
    }
}
