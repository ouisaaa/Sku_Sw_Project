package org.example.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.converter.json.GsonBuilderUtils;

@NoArgsConstructor
@Data
@Entity
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "c_code", insertable=false, updatable=false, columnDefinition = "integer", nullable = false)
    private int CCode; // Primary Key

    @Column(name = "c_category_name", columnDefinition = "text", nullable = false)
    private String CCategoryName; // 하위 카테고리

    @Column(name="c_up_category",columnDefinition = "text",nullable = false, insertable=false, updatable=false)
    private String CUpCategory;

    @ManyToOne
    @JoinColumn(name = "c_up_category", referencedColumnName = "c_category_name", nullable = false )
    private Category category; // self join - 컬럼 이름:cUpCategory, 참조테이블:category, 참조컬럼:cCategoryName

    @Builder
    public Category(int CCode , String CCategoryName,String CUpCategory){
        this.CCode = CCode;
        this.CCategoryName = CCategoryName;
        this.CUpCategory = CUpCategory;
    }


//    @Builder
//    public Category(int cCode, String cCategoryName, int cUpCategory) {
//        this.CCode = cCode;
//        this.CCategoryName = cCategoryName;
//        this.CUpCategory = cUpCategory;
//    }
}