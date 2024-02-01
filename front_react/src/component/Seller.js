import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { dataDomain } from "./common";
import { BiMenu } from "react-icons/bi";
import { BsPerson } from "react-icons/bs";

import AWS from 'aws-sdk';
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import styles from "../public/css/Seller.module.css";
import Dropdown from 'react-bootstrap/Dropdown';


export default function Seller() {
    const [selectPage, setSelectPage] = useState("SW Shop");
    const [productOption, setProductOption] = useState([]);

    /** 판매자 상품 페이지 옮기는 기능 */
    function click_selectPage(event) {
        event.preventDefault();
        const clickedElement = event.target;
        const textContent = clickedElement.textContent;
        setSelectPage(textContent);
    }
    function click_selectPage2(event) {
        event.preventDefault();
        setSelectPage(event.target.id);
    }
    /**상품 관리 */
    const [saleProduct, setSaleProduct] = useState([]);                 // 상품 관리
    // const [orderProduct, setOrderProduct] = useState([]);               // 주문 내역
    const [orderProductDetail, setOrderProductDetail] = useState([]);   // 상세 주문 내역
    const [inputProduct, setInputProduct] = useState([]);               // 옵션
    const [optionProductList, setOptionProductList] = useState();       // 상품 옵션들

    useEffect(() => {
        /**카테고리 가져오기 */
        fetch(`${dataDomain}/category/all`)     // 모든 카테고리 가져오기
            .then(res => { return res.json() }) /* json() 괄호 붙어야함*/
            .then(data => {                     // console.log(data);
                setCategoryList(data);
            });
        /**옵션 가져오기 */
        fetch(`${dataDomain}/option/`)          // 모든 카테고리 및 상품 정보 가져오기
            .then(res => { return res.json() }) /* json() 괄호 붙어야함*/
            .then(data => {
                let productInfo = [];
                let option = [];

                data.map((data) => productInfo.push(data.productInfo));
                data.map((data) => option.push({
                    "opCode": data.opCode,
                    "opOptionName": data.opOptionName,
                    "opQuantity": data.opQuantity,
                    "pcode": data.productInfo.pcode
                }))

                //console.log(option);
                const setData = productInfo.filter((item, index, self) => index === self.findIndex((t) => t.pcode === item.pcode));
                setSaleProduct(setData);
                setOptionProductList(option);   // console.log(setData); console.log(productInfo);
            });

        fetch(`${dataDomain}/product/input`)    // 입고 내역
            .then(res => { return res.json() }) /* json() 괄호 붙어야함*/
            .then(data => {                     // console.log("op: "+data[0]);
                
                setInputProduct(data.reverse());
            });

        //상품 주문 상세정보 받아오기 
        fetch(`${dataDomain}/order/detail`)
            .then(res => { return res.json() })
            .then(data => {
                //console.log(data);
                //setOrderProduct(data.order);
                setOrderProductDetail(data.reverse());
            });
    }, []);

    /** ******************************* ******************************* 상품등록 ************************************* *******************************/
    const options = useRef(null);                           // 옵션 추가
    const [isAddOption, setIsAddOption] = useState(false);  // 옵션 추가하는 창 보여주도록

    //옵션명을 추가를 함으로 상품 옵션에 추가
    function isOptionPlus(event) {
        event.preventDefault();
        setIsAddOption(true);

        const temp = options.current.value;
        setProductOption([...productOption, temp]);
    }

    function deleteOption(event) {
        const tempOption = [...productOption];
        const optionFilter = tempOption.filter((item, index) => index != event.target.value)
        setProductOption(optionFilter);
    }

    useEffect(() => {
        if (productOption.length < 1) setIsAddOption(false); //추가할 옵션이 없다면 옵션 밑에 옵션 테이블 안보이게
    }, [productOption]);

    /** 상품 등록 */
    const highCategoryRef = useRef(null);   // 상위 카테고리 가져오기
    const lowCategoryRef = useRef(null);    // 하위 카테고리 가져오기
    const productName = useRef(null);       // 상품 이름 가져오기
    const productSalePrice = useRef(null);  // 판매가 정보 가져오기
    const productPrice = useRef(null);      // 상품 원가 가져오기
    const productContext = useRef(null);    // 상품 설명 가져오기

    /** ******************************* ******************************* 상품등록 ************************************* *******************************/
    /** ******************************* ******************************* 카테고리 ************************************* *******************************/
    const [categoryList, setCategoryList] = useState([]); // 현재 존재하는 카테고리 가져오기
    const [highCategory, setHighCategory] = useState([]); // 상위 카테고리
    const [lowCategory, setLowCategory] = useState([]);   // 하위 카테고리

    // 카테고리 추가를 누르면 카테고리를 추가할수있는 레이아웃이 나올수있게
    const [isCategoryPlus, setIsCategoryPlus] = useState(false);

    function changeCategoryState(event) {
        event.preventDefault();
        setIsCategoryPlus(!isCategoryPlus);
    }
    useEffect(() => {
        let temp = [];

        categoryList.map((category) => (
            category.cupCategory === null ?
                temp.push(category) : null
        ))
        setHighCategory(temp);

    }, [categoryList])

    /**상위 카테고리가 선택이 된다면 그 밑에 하위 카테고리가 나올수있게 설정 */
    function selectHighCategory() {
        let temp = [];

        categoryList.map((category) => (
            category.cupCategory === highCategoryRef.current.value + '' ?
                temp.push(category) : null
        ))

        setLowCategory(temp);
        setIsLowCategory(true);
    }

    const [isLowCategory, setIsLowCategory] = useState(false);  // 카테고리 추가 누를시 표시되는 window의 상태
    const newHCRef = useRef(null);                              // 상위 카테고리 추가 하는 변수
    const newCategoryRef = useRef(null);                        // 추가 카테고리 변수 

    // 카테고리 추가
    function categoryPlus() {
        
        const newCategoryParent = categoryList.find((index) => index.ccategoryName === newHCRef.current.value);
        const newCategory = {
            "c_code": parseInt(categoryList[categoryList.length - 1].ccode, 10) + 1,
            "c_category_name": newCategoryRef.current.value,
            "c_up_category": newCategoryParent.ccode
        }
        // console.log(newCategory);
        fetch(`${dataDomain}/category/newCategory`,
            {
                method: "Post",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(newCategory)
            }).then(res => {
                if (res.ok) {
                    alert("등록");
                    setCategoryList([...categoryList, newCategory]);
                    setIsCategoryPlus(false);
                }
            })
    }
    const [selectCategory, setSelectCategory] = useState(null);

    function selectCategoryName(event) {
        const selectCCategoryName = categoryList.find((category) => category.ccode === parseInt(event.target.value, 10));
        setSelectCategory(selectCCategoryName.ccategoryName);
    }
    /** ******************************* ******************************* 카테고리 *******************************************************************/

    //** ******************************* ****************************** 상품 관리 ******************************************************************/
    /**상품관리 수정 클릭시 */
    const [modifyTr, setModifyTr] = useState();                     // 수정창 표시 여부 true >> 표시 false >> X

    useEffect(() => {                                               // saleProduct의 상태값이 달라지면 해당 코드들이 실행
        const tempState = Array(saleProduct.length).fill(false);    // 이렇게 false로 채워진 상태 배열이 된다
        setModifyTr(tempState);
        setIsReceiveProduct(tempState);

        const tempState2 = Array(saleProduct.length).fill('white');
        setChangeStockState(tempState2);
        setChangeModifyState(tempState2);

        setNewStockProduct([...saleProduct]);
        setNewProdcutInformation([...saleProduct]);
    }, [saleProduct])

    // 상품 관리 창에서 상품 정보 수정할떄 사용할 창 표시하거나 끄는 역할
    function modifyInformation(event) {
        const updatedStates = [...modifyTr];

        event.target.textContent === "수정" ?
            updatedStates[event.target.value] = true
            : updatedStates[event.target.value] = false

        setModifyTr(updatedStates);
        console.log(modifyTr)
    }

    const modifyNameRef = useRef(null);      // 수정할 이름 값 가져오기
    const modifyOptionRef = useRef(null);    // 수정할 옵션값 가져오기
    const modifyPriceRef = useRef(null);     // 수정할 가격 값 가져오기
    const modifySalePriceRef = useRef(null); // 수정할 판매가 값 가져오기 
    const modifyCategoryName = useRef(null); // 수정할 카테고리값 가져오기
    const modifyOptionCurser = useRef(null); // 수정할 옵션 이름 커서

    // 상품 수정 시 수정된 값 적용하고 수정된 부분 표시
    const [changeModifyState, setChangeModifyState] = useState();           // 수정된 사항이 있음 표시
    const [newProductInformation, setNewProdcutInformation] = useState();   // 새로운 상품 정보를 저장하는 상태

    // 카테고리 상품 설정
    function updateCategory() {
        const findUpdateCategory = categoryList.find((category) => category.ccode == modifyCategoryName.current.value); // 카테고리 수정된 사항을 통해 관련 정보 추출
        const updateModifyCategory = {
            "category"     : null,
            "cupCategory"  : findUpdateCategory.cupCategory,
            "ccategoryName": findUpdateCategory.ccategoryName,
            "ccode"        : findUpdateCategory.ccode
        };
        return updateModifyCategory;
    }

    //옵션 수정사항
    function updateOptionFunction(pcode) {
        let updateOption = [...optionProductList];

        console.log("ipd:  " + updateOption);
        for (let i = 0; i < updateOption.length; i++) {
            if (updateOption[i].opCode === parseInt(modifyOptionCurser.current.value, 10)) {
                updateOption[i].opOptionName = modifyOptionRef.current.value;
            }
        }
        return updateOption;

    }
    /**상품의 변경사항 저장 -> 프론트에서만 */
    function modifyUpdate(event) {
        const updateModify = [...newProductInformation];

        console.log(updateModify[event.target.value].pcode);
        updateModify[event.target.value].pname = modifyNameRef.current.value === "" ? updateModify[event.target.value].pname : modifyNameRef.current.value;
        updateModify[event.target.value].category = modifyCategoryName.current.value === "--하위카테고리--" ? updateModify[event.target.value].category : updateCategory();
        updateModify[event.target.value].opOptionName = modifyOptionRef.current.value === null ? updateModify[event.target.value].opOptionName : modifyOptionRef.current.value;
        updateModify[event.target.value].pprice = modifyPriceRef.current.value === "" ? updateModify[event.target.value].pprice : parseInt(modifyPriceRef.current.value, 10);
        updateModify[event.target.value].psalePrice = modifySalePriceRef.current.value === "" ? updateModify[event.target.value].psalePrice : parseInt(modifySalePriceRef.current.value, 10);

       // console.log(updateOptionFunction(updateModify[event.target.value].pcode));

        modifyTr[event.target.value] = false;

        fetch(`${dataDomain}/product/modifyProduct`, {
            method: "PUT",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(updateModify)
        }).then(res => {
            if (res.ok) {
                alert("등록 완료");
                fetch(`${dataDomain}/option/modifyOption`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': "application/json",
                    },
                    body: JSON.stringify(updateOptionFunction(updateModify[event.target.value].pcode))
                }).then(res => {
                    if (res.ok) {
                        alert("등록 완료");
                        setNewProdcutInformation(updateModify);
                        setOptionProductList(updateOptionFunction(updateModify[event.target.value].pcode));
                    }
                })
            }
        })
    }

    //상품 삭제
    function deleteUpdate(event) {
        const confirmed = window.confirm("정말 삭제 하시겠습니까?");
        console.log(event.target.value);    // console.log()
        if (confirmed) {
            fetch(`${dataDomain}/product/product?pcode=${event.target.value}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': "application/json",
                },
            }).then(res => {
                if (res.ok) {
                    alert("삭제 완료");
                    window.location.reload();
                }
            })
        }
    }
    /** 장바구니에서 구매 클릭시  */
    const navigate = useNavigate();
    const [isListShow, setIsListShow] = useState(true);

    function toggleWindow() {                           // setIsListCategory 를 사용해서 isListCategory 상태를 토글
        setIsListShow(!isListShow);                     // 예상 동작 : isListCategory 값을 변경하여 카테고리 창의 보여짐/숨김을 토글하는것
        setIsSidebar(!isSidebar);
    }
    function getCookie(name) {                          // document.cookie 에서 쿠키 값을 가져오는 함수
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);        // 함수의 매개변수로 쿠키이름(name)을 전달하면 해당 쿠키의 값을 반환
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
    }
    const deleteCookie = (name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };
    function isLoginCheck() {
        if (getCookie('m_code') != null) {
            const confirmed = window.confirm("로그아웃 하시겠습니까?");
            if (confirmed) {
                deleteCookie('m_code');
                navigate('/login');
            }
        }
    }

    //** ******************************* *******************************상품 관리 /** ******************************* *******************************/
    //** ******************************* *******************************상품 입고 /** ******************************* *******************************/
    const [isReceiveProduct, setIsReceiveProduct] = useState(); // 수정창 표시 여부 true >> 표시 false >> X
    const [changeStockState, setChangeStockState] = useState(); // 수정된 사항이 있음 표시
    const stockRef = useRef(null);                              // 추가 재고량 받아오는 변수
    const [newStockProduct, setNewStockProduct] = useState();   // 입고 정보 수정 사항 저장 

    //상품 입고 클릭시
    function receiveProduct(event) {
        const updatedStates = [...isReceiveProduct];

        event.target.textContent === "입고" ?
            updatedStates[event.target.value] = true
            : updatedStates[event.target.value] = false

        console.log(event.target.value);
        setIsReceiveProduct(updatedStates);
    }
    const [productInputInfo, setProductInputInfo] = useState([]);

    /**상품 입고 개수 반영 -> 프론트에서만 */
    function stockUpdate(event) {
        const input = optionProductList.find((option) => option.opCode === parseInt(event.target.value, 10));   // 재고량 수정 하기위한 바뀐 부분 찾기
        const Iproduct = newStockProduct.find((product) => product.pcode === input.pcode);                      // 입고 기록을 남기기 위한 상품 정보 찾기

       // console.log(Iproduct);
        const saveInputInfo = {
            "i_quantity"     : parseInt(stockRef.current.value),
            "p_name"         : Iproduct.pname,
            "c_category_name": Iproduct.category.ccategoryName,
            "op_code"        : input.opCode,
            "op_option_name" : input.opOptionName
        }
        input.opQuantity = parseInt(input.opQuantity) + parseInt(stockRef.current.value);

        isReceiveProduct[event.target.value - 1] = false;
       // console.log(saveInputInfo);
        //console.log(input);

        fetch(`${dataDomain}/product/inputProduct`, {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(input)
        }).then(res => {
            if (res.ok) {
                alert("등록");
                fetch(`${dataDomain}/product/productInput `, {
                    method: "POST",
                    headers: {
                        'Content-Type': "application/json",
                    },
                    body: JSON.stringify(saveInputInfo)
                }).then(res => {
                    if (res.ok) {
                        alert("등록 완료")
                        setProductInputInfo([...productInputInfo, saveInputInfo]);
                        window.location.reload();
                    }
                })
            }
        })

    }

    const [isSidebar, setIsSidebar] = useState(true);
    const [file, setFile] = useState(null);  // 그림 파일 랜더링 함수

    function fileRender(event) {
        const selectedFile = event.target.files[0];

        setFile(selectedFile);
    }

    // ★ S3 ★
    const uploadImageToS3 = async (selectedFile) => {
        const s3 = new AWS.S3({ //IAM을 통해 권한 부여해서 접근키, 시크릿키를 얻을수 있다
            accessKeyId    : 'AKIATQGI7YZS3WYTRG5X',//aws 접근키 
            secretAccessKey: 'dwrx05diX8PJf7tsvg9CUA+mW+DHtIijcb6XcfJU',//aws 시크릿키
            region         : 'ap-northeast-2',  //서울리전
        });

        const params = {
            Bucket: 'themostfavoriteidoru',//s3 버킷 이름
            Key   : selectedFile.name, //이미지 파일 이름
            Body  : selectedFile,//이미지 파일 
        };

        try {
            const data = await s3.upload(params).promise(); //업로드를 비동기 작업, 그리고 업로드가 될때까지 기달리고  
            //console.log('Image uploaded!', data.Location);
            return data.Location; // Return the URL of the uploaded image
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };
    const handleUpload = async (event) => {
        event.preventDefault();
        try {
            if (lowCategoryRef.current.value === "--하위카테고리--") throw new Error("상품의 카테고리를 설정해주세요");
            if (productName.current.value === "") throw new Error("상품 이름을 입력해주세요");
            if (productOption.length < 1) throw new Error("상품의 옵션을 설정해주세요");
            if (productPrice.current.value === "") throw new Error("상품 정가를 입력하주세요");
            if (productSalePrice.current.value === "") throw new Error("상품의 판매가를 입력해주세요");
            if (productContext.current.value === "") throw new Error("상품의 상세설명을 입력해주세요");

            if (!file) return;

            const imageUrl = await uploadImageToS3(file);
            //console.log('Uploaded Image URL:', imageUrl);

            // Update productInformation with image URL
            const productInformation = {
                "p_name"      : productName.current.value,
                "p_price"     : parseInt(productPrice.current.value, 10),
                "p_content"   : productContext.current.value,
                "p_image_name": imageUrl,
                "p_salePrice" : parseInt(productSalePrice.current.value, 10),
                "category"    : {
                    "CCode"        : parseInt(lowCategoryRef.current.value, 10),
                    "CCategoryName": selectCategory,
                    "cupCategory"  : highCategoryRef.current.value + '',
                }
            };

            let productOptionList = [];
            productOption.map((option, index) => (
                productOptionList.push({
                    "op_option_name": option,
                    "op_quantity"   : 0,
                })
            ));
            // Send product information to the server
            const productRes = await fetch(`${dataDomain}/product/newProduct`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productInformation),
            });

            if (productRes.ok) {
                alert('상품 정보 전송 완료');
                // Handle success for product information, e.g., navigate to next step

                // Send product options to the server
                const optionRes = await fetch(`${dataDomain}/option/newProduct`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productOptionList),
                });

                if (optionRes.ok) {
                    alert('상품 등록 완료');
                    // Handle success for product options, e.g., navigate to success page
                    window.location.reload();
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
            // Handle error
        }

    };
    function reloads() {
        //window.location.reload();
    }

    const [colorBlindType, setColorBlindType] = useState("normal");
    const [buttonText, setButtonText] = useState("색약조정");

    const handleChangeColorBlindType = (selectedType) => {
        setColorBlindType(selectedType);
        setButtonText(selectedType.charAt(0).toUpperCase() + selectedType.slice(1));
    };

    return (
            <body className={isSidebar === true ? "sb-nav-fixed" : "sb-nav-fixed sb-sidenav-toggled"}>
                {/**상단 */}
                <nav className={"sb-topnav navbar navbar-expand navbar-dark bg-dark"}>

                    <button className={"btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"} onClick={toggleWindow}><BiMenu /></button>

                    <a class="navbar-brand ps-3" href="" onClick={click_selectPage}>SW Shop</a>{/* image */}

                    <Dropdown onSelect={handleChangeColorBlindType} className="ms-md-1 my-2">
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {buttonText}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="기본">기본</Dropdown.Item>
                            <Dropdown.Item eventKey="적색약">적색약</Dropdown.Item>
                            <Dropdown.Item eventKey="청색약">청색약</Dropdown.Item>
                            <Dropdown.Item eventKey="녹색약">녹색약</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <form className={"d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0"}>
                    </form>
                    {/**로그인 누르면 나오는 부분 */}
                    <Button className={"navbar-nav ms-auto ms-md-0 me-3 me-lg-4"} variant="dark" onClick={isLoginCheck}><BsPerson /></Button>
                </nav>
                <div id="layoutSidenav">
                    <div id="layoutSidenav_nav">
                        {isListShow && ( // 카테고리 상태에 의해 보여주냐 마냐
                            <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                                <div class="sb-sidenav-menu">
                                    <div className="nav">
                                        <div className="sb-sidenav-menu-heading">기능</div>
                                        <a className="nav-link" onClick={click_selectPage}>상품등록</a>
                                        <a className="nav-link" onClick={click_selectPage}>상품관리</a>
                                        <a className="nav-link" onClick={click_selectPage}>상품입고</a>
                                        <a className="nav-link" onClick={click_selectPage}>입고기록</a>
                                        <a className="nav-link" onClick={click_selectPage}>주문내역</a>
                                    </div>
                                </div>
                            </nav>
                        )}
                    </div>
                    <div id="layoutSidenav_content">
                        <main>
                        <div className={colorBlindType === "기본" ? null :
            colorBlindType === "적색약" ? "protanopeSimulation" :
                colorBlindType === "청색약" ? "deuteranopeSimulation" :
                    colorBlindType === "녹색약" ? "tritanopeSimulation" : null}>
                            <div class="container-fluid px-4">
                                {selectPage == "SW Shop" ? (
                                    <>
                                        <h1 class="mt-4">SW Shop</h1>
                                        <ol class="breadcrumb mb-4">
                                            <li class="breadcrumb-item active">Dashboard</li>
                                        </ol>
                                        <div class="row">
                                            <div class="col-xl-6">
                                                <div class="card mb-4">
                                                    <div class="card-header" id={"상품관리"} onClick={click_selectPage2}>
                                                        <i class="fas fa-table me-1"></i>
                                                        상품 목록
                                                    </div>
                                                    <div class="card-body">
                                                        <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                                            <div className="datatable-container" style={{ height: '200px', overflowY: 'auto' }}>
                                                                <table id="datatablesSimple" className={"datatable-table"} style={{ height: '200px', overflowY: 'auto' }}>
                                                                    <thead>
                                                                        <tr>
                                                                            <th colSpan={1}>상품코드</th>
                                                                            <th colSpan={3}>상품이름</th>
                                                                            <th colSpan={2}>옵션</th>
                                                                            <th>사진</th>
                                                                            <th colSpan={3}>정가</th>
                                                                            <th colSpan={3}>가격</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody >
                                                                        {
                                                                            saleProduct.map((saleProduct, index) => {
                                                                                return (
                                                                                    <>
                                                                                        <tr key={index}>
                                                                                            <td colSpan={1} style={{ backgroundColor: changeModifyState[index] }}>{saleProduct.pcode}</td>
                                                                                            <td colSpan={3} style={{ backgroundColor: changeModifyState[index] }}>{saleProduct.pname}</td>
                                                                                            <td colSpan={2} style={{ backgroundColor: changeModifyState[index] }}>
                                                                                                <ol>
                                                                                                    {
                                                                                                        optionProductList.filter((option) => {
                                                                                                            return option.pcode === saleProduct.pcode
                                                                                                        }).map((item) => {
                                                                                                            return (<li key={item.opCode}>{item.opOptionName}</li>);
                                                                                                        })
                                                                                                    }
                                                                                                </ol>
                                                                                            </td>
                                                                                            <td style={{ backgroundColor: changeModifyState[index] }}><img src={saleProduct.pimageName} style={{ width: '100px' }} /></td>
                                                                                            <td colSpan={3} style={{ backgroundColor: changeModifyState[index] }}>{saleProduct.pprice}</td>
                                                                                            <td colSpan={3} style={{ backgroundColor: changeModifyState[index] }}>{saleProduct.psalePrice}</td>
                                                                                        </tr>

                                                                                    </>
                                                                                )
                                                                            })
                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xl-6">
                                                <div class="card mb-4">
                                                    <div class="card-header" id={"입고기록"} onClick={click_selectPage2}>
                                                        <i class="fas fa-table me-1"></i>
                                                        입고 내역
                                                    </div>
                                                    <div class="card-body">
                                                        <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                                            <div className="datatable-container" style={{ height: '200px', overflowY: 'auto' }}>
                                                                <table id="datatablesSimple" className={"datatable-table"}>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td colSpan={1}>상품코드</td>
                                                                            <td colSpan={3}>상품이름</td>
                                                                            <td colSpan={2}>옵션</td>
                                                                            <td colSpan={2}>정가</td>
                                                                            <td>수량</td>
                                                                        </tr>
                                                                        {
                                                                            inputProduct.map((input, index) => ( 
                                                                                <tr key={index}>
                                                                                    <td colSpan={1}>{input.option.productInfo.pcode}</td>
                                                                                    <td colSpan={3}>{input.option.productInfo.pname}</td>
                                                                                    <td colSpan={2}>{input.option.opOptionName}</td>
                                                                                    <td colSpan={2}>{input.option.productInfo.pprice}</td>
                                                                                    <td>{input.iquantity}</td>
                                                                                </tr>
                                                                            ))
                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-xl-12">
                                            <div class="card mb-4">
                                                <div class="card-header" id={"주문내역"} onClick={click_selectPage2}>
                                                    <i class="fas fa-table me-1"></i>
                                                    주문 내역
                                                </div>
                                                <div class="card-body">
                                                    <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                                        <div className="datatable-container" style={{ height: '200px', overflowY: 'auto' }}>
                                                            <table id="datatablesSimple" className={"datatable-table"}>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>주문번호</td>
                                                                        <td>상세주문번호</td>
                                                                        <td>상품이름</td>
                                                                        <td>옵션</td>
                                                                        <td>수량</td>
                                                                        <td>배송지</td>
                                                                        <td>가격</td>
                                                                        <td>총가격</td>
                                                                        <td>주문날짜</td>
                                                                    </tr>
                                                                    {
                                                                        orderProductDetail.map((order, index) => (
                                                                            <tr key={index}>
                                                                                <td>{order.order.ocode}</td>
                                                                                <td>{order.odCode}</td>
                                                                                <td>{order.productInfo.pname}</td>
                                                                                <td>{order.option.opOptionName}</td>
                                                                                <td>{order.odCount}</td>
                                                                                <td>{order.order.oaddress}</td>
                                                                                <td>{order.productInfo.pprice}</td>
                                                                                <td>{order.order.ototalprice}</td>
                                                                                <td>{order.order.odate}</td>
                                                                            </tr>
                                                                        ))
                                                                        /**이 코드는 백에서 요청을 하면 옵션들을 끼워서 옵션 단위 별로 자세하게 나올수 있도록 표시를 해준다 */
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                                {selectPage == "상품등록" ? (
                                    <>
                                        <h1 class="mt-4">SW Shop</h1>
                                        <ol class="breadcrumb mb-4">
                                            <li class="breadcrumb-item active">상품 등록사항을 입력해주세여</li>
                                        </ol>
                                        <div class="card mb-4">
                                            <div class="card-header">
                                                <i class="fas fa-table me-1"></i>
                                                상품등록
                                            </div>
                                            <div class="card-body">
                                                <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                                    <div className="datatable-container">
                                                        <form action="#">
                                                            <table id="datatablesSimple" className={"datatable-table"}>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            <p>상품 카테고리</p>
                                                                        </td>
                                                                        <td>
                                                                            <div className="row">
                                                                                <div class="col-xl-4">
                                                                                    <Form.Select ref={highCategoryRef} onChange={selectHighCategory}>
                                                                                        <option value={null}>--상위카테고리--</option>
                                                                                        {
                                                                                            highCategory.map((category, index) => (
                                                                                                <option key={index} value={category.ccode}>{category.ccategoryName}</option>
                                                                                            ))
                                                                                        }
                                                                                    </Form.Select>
                                                                                </div>
                                                                                <div class="col-xl-4">
                                                                                    <Form.Select ref={lowCategoryRef}
                                                                                        onChange={selectCategoryName}
                                                                                    >

                                                                                        <option value={null}>--하위카테고리--</option>
                                                                                        {
                                                                                            isLowCategory && lowCategory.map((category, index) => (
                                                                                                <option key={index} value={category.ccode}>{category.ccategoryName}</option>
                                                                                            ))
                                                                                        }
                                                                                    </Form.Select>
                                                                                </div>
                                                                                <div class="col-xl-4">
                                                                                    <Button variant="primary" onClick={changeCategoryState} size="sm">신규 카테고리 추가</Button>
                                                                                </div>
                                                                            </div>
                                                                            {isCategoryPlus && (
                                                                                <>
                                                                                    <hr></hr>
                                                                                    <p>카테고리</p>
                                                                                    <Table striped bordered hover size="sm">
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th>상위 카테고리</th>
                                                                                                <th>카테고리 id</th>
                                                                                                <th>카테고리 명</th>
                                                                                                {/* <th>삭제</th> */}
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>

                                                                                            {
                                                                                                categoryList.map((category, index) => (
                                                                                                    <tr key={index}>
                                                                                                        <td>{category.cupCategory}</td>
                                                                                                        <td>{category.ccode}</td>
                                                                                                        <td>{category.ccategoryName}</td>
                                                                                                    </tr>
                                                                                                )
                                                                                                )}
                                                                                        </tbody>
                                                                                    </Table>
                                                                                    <hr></hr>
                                                                                    {/* input 클릭을 하면 카테고리리스트 나오고 리스트안에 직접 입력도 있어서 직접 입력을 하는 형식 한번 구현 트라이*/}
                                                                                    <div className="row">
                                                                                        <div class="col-xl-4">
                                                                                            <Form.Control type="text" ref={newHCRef} placeholder="상위 카테고리 입력" />
                                                                                        </div>
                                                                                        <div class="col-xl-4">
                                                                                            <Form.Control type="text" ref={newCategoryRef} placeholder="추가할 카테고리 입력" />
                                                                                        </div>
                                                                                        <div class="col-xl-4">
                                                                                            <Button onClick={categoryPlus}>추가</Button>
                                                                                        </div>
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <label>상품 이름</label>
                                                                        </td>
                                                                        <td>
                                                                            <Form.Control type="text" ref={productName} />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td >
                                                                            <label>상품 옵션</label>
                                                                        </td>
                                                                        <td>
                                                                            <div className="row">
                                                                                <div class="col-xl-6">
                                                                                    <Form.Control type="text" className={"col"} ref={options} placeholder="옵션 명을 입력후 추가 눌러주세요" />
                                                                                </div>
                                                                                <div class="col-xl-6">
                                                                                    <Button onClick={isOptionPlus} variant="primary" size="sm" >옵션 추가</Button>
                                                                                </div>
                                                                            </div>
                                                                            {isAddOption && (
                                                                                <>
                                                                                    <Table striped bordered hover size="sm">
                                                                                        <thead>
                                                                                            <tr>
                                                                                                <th colSpan={2}>상품 옵션</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td>옵션명</td>
                                                                                                <td>삭제</td>
                                                                                            </tr>
                                                                                            {
                                                                                                productOption.map((option, index) => (
                                                                                                    <tr>
                                                                                                        <td>{option}</td>
                                                                                                        <td><Button variant="danger" size="sm" value={index} onClick={deleteOption}>삭제</Button></td>
                                                                                                    </tr>
                                                                                                ))
                                                                                            }
                                                                                        </tbody>
                                                                                    </Table>
                                                                                </>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <label>상품 가격</label>
                                                                        </td>
                                                                        <td>
                                                                            <Form.Control type="text" ref={productPrice} />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <label>상품 판매가</label>
                                                                        </td>
                                                                        <td>
                                                                            <Form.Control type="text" ref={productSalePrice} />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <label>상품 설명</label>
                                                                        </td>
                                                                        <td>
                                                                            <Form.Control as="textarea" className={styles.contextBox} ref={productContext} />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <label>상품 그림</label>
                                                                        </td>
                                                                        <td>
                                                                            <Form.Control type="file" onChange={fileRender} />
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <hr></hr>
                                                            <Button variant="success" onClick={handleUpload}>등록</Button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                                {
                                    selectPage == "상품관리" ? (
                                        <>
                                            <h1 class="mt-4">SW Shop</h1>
                                            <ol class="breadcrumb mb-4">
                                                <li class="breadcrumb-item active">상품정보를 수정 할 수 있고 삭제도 가능합니당</li>
                                            </ol>
                                            <div class="card mb-4">
                                                <div class="card-header">
                                                    <i class="fas fa-table me-1"></i>
                                                    상품관리
                                                </div>

                                                <div class="card-body">
                                                    <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                                        <div className="datatable-container">
                                                            <table id="datatablesSimple" className={"datatable-table"}>
                                                                <tbody>
                                                                    <tr>
                                                                        <td colSpan={1}>상품코드</td>
                                                                        <td colSpan={3}>상품이름</td>
                                                                        <td colSpan={2}>카테고리</td>
                                                                        <td colSpan={2}>옵션</td>
                                                                        <td>그림</td>
                                                                        <td colSpan={3}>가격</td>
                                                                        <td colSpan={3}>판매가</td>
                                                                        <td colSpan={1}>수정</td>
                                                                        <td colSpan={1}>삭제</td>
                                                                    </tr>
                                                                    {
                                                                        newProductInformation.map((saleProduct, index) => {
                                                                            return (
                                                                                <>
                                                                                    <tr key={index}>
                                                                                        <td colSpan={1} style={{ backgroundColor: changeModifyState[index] }}>{saleProduct.pcode}</td>
                                                                                        <td colSpan={3} style={{ backgroundColor: changeModifyState[index] }}>{saleProduct.pname}</td>
                                                                                        <td colSpan={2} style={{ backgroundColor: changeModifyState[index] }}>{saleProduct.category.ccategoryName}</td>
                                                                                        <td colSpan={2} style={{ backgroundColor: changeModifyState[index] }}>
                                                                                            <ol>
                                                                                                {
                                                                                                    optionProductList.filter((option) => {
                                                                                                        return option.pcode === saleProduct.pcode
                                                                                                    }).map((item) => {
                                                                                                        return (<li key={item.opCode}>{item.opOptionName}</li>);
                                                                                                    }) 
                                                                                                }
                                                                                            </ol>
                                                                                        </td>
                                                                                        <td style={{ backgroundColor: changeModifyState[index] }}><img src={saleProduct.pimageName} style={{ width: '100px' }} /></td>
                                                                                        <td colSpan={3} style={{ backgroundColor: changeModifyState[index] }}>{saleProduct.pprice}</td>
                                                                                        <td colSpan={3} style={{ backgroundColor: changeModifyState[index] }}>{saleProduct.psalePrice}</td>
                                                                                        <td><Button variant="warning" size="sm" className={styles.optionBtn} onClick={modifyInformation} value={index}>수정</Button></td>
                                                                                        <td><Button variant="danger" size="sm" className={styles.optionBtn} value={saleProduct.pcode} onClick={deleteUpdate}>삭제</Button></td>
                                                                                    </tr>
                                                                                    {
                                                                                        modifyTr[index] && (
                                                                                            <>
                                                                                                <tr>
                                                                                                    <td colSpan={1}></td>
                                                                                                    <td colSpan={3}><Form.Control type="text" placeholder="수정할 이름" className={styles.inputWidth} ref={modifyNameRef} /></td>
                                                                                                    <td colSpan={2}>
                                                                                                        {/* <input type="text" placeholder="수정할 카테고리" className={styles.inputWidth} ref={modifyCategoryName}/> */}

                                                                                                        <Form.Select ref={highCategoryRef} onChange={selectHighCategory} size="sm">
                                                                                                            <option value={null}>--상위카테고리--</option>
                                                                                                            {
                                                                                                                highCategory.map((category, index) => (
                                                                                                                    <option key={index} value={category.ccode}>{category.ccategoryName}</option>
                                                                                                                ))
                                                                                                            }
                                                                                                        </Form.Select>

                                                                                                        <Form.Select ref={modifyCategoryName} onChange={selectCategoryName} size="sm">
                                                                                                            <option value={null}>--하위카테고리--</option>
                                                                                                            {
                                                                                                                isLowCategory && lowCategory.map((category, index) => (
                                                                                                                    <option key={index} value={category.ccode}>{category.ccategoryName}</option>
                                                                                                                ))
                                                                                                            }
                                                                                                        </Form.Select>
                                                                                                    </td>

                                                                                                    <td colSpan={2}>
                                                                                                        <Form.Select ref={modifyOptionCurser}>
                                                                                                            <option value={null}>--수정할옵션--</option>
                                                                                                            {
                                                                                                                optionProductList.filter((optionList) => optionList.pcode === saleProduct.pcode).map((option, index) => (
                                                                                                                    <option key={index} value={option.opCode}>{option.opOptionName}</option>
                                                                                                                ))
                                                                                                            }
                                                                                                        </Form.Select>
                                                                                                        <Form.Control type="text" placeholder="수정내용" className={styles.inputWidth} ref={modifyOptionRef} />

                                                                                                    </td>
                                                                                                    <td></td>
                                                                                                    <td colSpan={3}><Form.Control type="number" placeholder="수정할 가격" className={styles.inputWidth} ref={modifyPriceRef} /></td>
                                                                                                    <td colSpan={3}><Form.Control type="number" placeholder="수정할 판매가" className={styles.inputWidth} ref={modifySalePriceRef} /></td>
                                                                                                    <td><Button variant="success" className={styles.optionBtn} value={index} onClick={modifyUpdate}>완료</Button></td>
                                                                                                    <td><Button variant="danger" className={styles.optionBtn} value={index} onClick={modifyInformation}>취소</Button></td>
                                                                                                </tr>
                                                                                            </>
                                                                                        )}
                                                                                </>
                                                                            )
                                                                        })
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : null}
                                {selectPage == "상품입고" ? (
                                    <>
                                        <h1 class="mt-4">SW Shop</h1>
                                        <ol class="breadcrumb mb-4">
                                            <li class="breadcrumb-item active">입고 버튼을 눌러 상품의 입고 정보를 기록해주세요</li>
                                        </ol>
                                        <div class="card mb-4">
                                            <div class="card-header">
                                                <i class="fas fa-table me-1"></i>
                                                상품입고
                                            </div>

                                            <div class="card-body">
                                                <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                                    <div className="datatable-container">
                                                        <table id="datatablesSimple" className={"datatable-table"}>
                                                            <tbody>
                                                                <tr>
                                                                    <td colSpan={3}>상품코드</td>
                                                                    <td colSpan={3}>상품이름</td>
                                                                    <td colSpan={2}>옵션</td>
                                                                    <td colSpan={2}>정가</td>
                                                                    <td colSpan={2}>가격</td>
                                                                    <td>수량</td>
                                                                    <td>수량 입고</td>
                                                                </tr>
                                                                {
                                                                    newStockProduct.map((product, index) => {
                                                                        return (
                                                                            optionProductList.filter((option) => product.pcode === option.pcode).map((option) => {
                                                                                return (
                                                                                    <>
                                                                                        <tr key={optionProductList.opCode}>
                                                                                            <td colSpan={3}>{product.pcode}</td>
                                                                                            <td colSpan={3}>{product.pname}</td>
                                                                                            <td colSpan={2}>{option.opOptionName}</td>
                                                                                            <td colSpan={2}>{product.pprice}</td>
                                                                                            <td colSpan={2}>{product.psalePrice}</td>
                                                                                            <td id={index} style={{ backgroundColor: changeStockState[index] }}>{option.opQuantity}</td>
                                                                                            <td><Button value={option.opCode - 1} className={styles.optionBtn} onClick={receiveProduct}>입고</Button></td>
                                                                                        </tr>
                                                                                        {/**이 코드는 백에서요청을 하면 옵션들을 끼워서 옵션 단위 별로 자세하게 나올수 있도록 표시를 해준다 */}
                                                                                        {
                                                                                            isReceiveProduct[option.opCode - 1] && (
                                                                                                <tr>
                                                                                                    <td colSpan={7}><input type="text" placeholder="추가 수량" className={styles.inputWidth} ref={stockRef} /></td>
                                                                                                    <td colSpan={3}><Button className={styles.optionBtn} value={option.opCode} onClick={stockUpdate}>완료</Button></td>
                                                                                                    <td colSpan={2}><Button className={styles.optionBtn} value={option.opCode - 1} onClick={receiveProduct}>취소</Button></td>
                                                                                                </tr>

                                                                                            )}
                                                                                    </>
                                                                                )
                                                                            })
                                                                        )
                                                                    }
                                                                    )
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                                {selectPage == "입고기록" ? (
                                    <>
                                        <h1 class="mt-4">SW Shop</h1>
                                        <ol class="breadcrumb mb-4">
                                            <li class="breadcrumb-item active">입고 기록입니다.</li>
                                        </ol>
                                        <div class="card mb-4">
                                            <div class="card-header">
                                                <i class="fas fa-table me-1"></i>
                                                입고기록
                                            </div>

                                            <div class="card-body">
                                                <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                                    <div className="datatable-container">
                                                        <table id="datatablesSimple" className={"datatable-table"}>
                                                            <tbody>
                                                                <tr>
                                                                    <td>index</td>
                                                                    <td>상품코드</td>
                                                                    <td>상품이름</td>
                                                                    <td>옵션</td>
                                                                    <td>수량</td>
                                                                    <td>날짜</td>
                                                                    <td>정가</td>
                                                                </tr>
                                                                {/*여기에 주문 내역 가져와서 쫙 볼수있게 */}
                                                                {
                                                                    inputProduct.map((input, index) => ( 
                                                                        <tr key={index}>
                                                                            <td>{index}</td>
                                                                            <td>{input.option.productInfo.pcode}</td>
                                                                            <td>{input.option.productInfo.pname}</td>
                                                                            <td>{input.option.opOptionName}</td>
                                                                            <td>{input.iquantity}</td>
                                                                            <td>{input.ireceivedDate}</td>
                                                                            <td>{input.option.productInfo.pprice}</td>
                                                                        </tr>
                                                                    ))
                                                                    /**이 코드는 백에서 요청을 하면 옵션들을 끼워서 옵션 단위 별로 자세하게 나올수 있도록 표시를 해준다 */
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                                {selectPage == "주문내역" ? (
                                    <>
                                        <h1 class="mt-4">SW Shop</h1>
                                        <ol class="breadcrumb mb-4">
                                            <li class="breadcrumb-item active">상품 주문 내역입니다.</li>
                                        </ol>
                                        <div class="card mb-4">
                                            <div class="card-header">
                                                <i class="fas fa-table me-1"></i>
                                                주문내역
                                            </div>
                                            <div class="card-body">
                                                <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                                    <div className="datatable-container">
                                                        <table id="datatablesSimple" className={"datatable-table"}>
                                                            <tbody>
                                                                <tr>
                                                                    <td>주문번호</td>
                                                                    <td>상세주문번호</td>
                                                                    <td>상품이름</td>
                                                                    <td>옵션</td>
                                                                    <td>수량</td>
                                                                    <td>배송지</td>
                                                                    <td>가격</td>
                                                                    <td>총가격</td>
                                                                    <td>주문날짜</td>
                                                                </tr>
                                                                {/*여기에 주문 내역 가져와서 쫙 볼수있게 */}
                                                                {
                                                                    orderProductDetail.map((order, index) => (
                                                                        <tr key={index}>
                                                                            <td>{order.order.ocode}</td>
                                                                            <td>{order.odCode}</td>
                                                                            <td>{order.productInfo.pname}</td>
                                                                            <td>{order.option.opOptionName}</td>
                                                                            <td>{order.odCount}</td>
                                                                            <td>{order.order.oaddress}</td>
                                                                            <td>{order.productInfo.pprice}</td>
                                                                            <td>{order.order.ototalprice}</td>
                                                                            <td>{order.order.odate}</td>
                                                                        </tr>
                                                                    ))
                                                                    /**이 코드는 백에서 요청을 하면 옵션들을 끼워서 옵션 단위 별로 자세하게 나올수 있도록 표시를 해준다 */
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                            </div>
                            </div>
                        </main>
                    </div>
                </div>
            </body>
    );
}