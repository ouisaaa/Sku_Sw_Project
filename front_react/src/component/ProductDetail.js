import { Link, useParams, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { dataDomain } from "./common";
import { BiMenu, BiCart } from "react-icons/bi";
import { BsPerson } from "react-icons/bs";

import styles from "../public/css/ProductDetail.module.css";
import Dropdown from 'react-bootstrap/Dropdown';
import Popup from "reactjs-popup";
import Button from "react-bootstrap/Button";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

// main에서 상품 클릭하면 넘어오는데 아직 productDetailed/undefined 임 > 화면이 안뜸 > Main.js 에서 해결
export default function ProductDetail() {
    const [isListCategory, setIsListCategory] = useState(false); // 카테고리창 보여주는 상태 관리
    // const [isBasket, setIsBasket] = useState(true);             // 장바구니 상태를 관리하는 변수
    // const [categoryList, setCategoryList] = useState([]);       // 카테고리 목록을 저장하는 상태 변수
    const [details, setDetails] = useState({});                 // 상품 상세 정보를 저장하는 상태 변수
    // spring controller를 postman 돌려서 받는 값을 집어넣는다 생각해라 {}객체로 받는거 [] 배열로 받는거
    // 얘도 결국엔 상품 정보를 받아와서 해야하는 놈임 ㅇㅈ? localhost:8080/product 로 시작하는 놈들 가져와야 함 근데 얘는 상품 정보를 보여줄거니까
    // p_code 로 찾아서 가져오겠지 맞나?
    const [basket, setBasket] = useState([]);                   // 장바구니에 담긴 상품 목록을 저장하는 상태 변수
    const [productOption, setProductOption] = useState([]);     // 상품 옵션을 저장하는 상태 변수
    const { p_code } = useParams();                             // URL에서 p_code 값을 추출
    //console.log('p_code:', pcode); console.log('Before fetch - p_code:', pcode);

    function getCookie(name) {                                  // document.cookie 에서 쿠키 값을 가져오는 함수
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);                // 함수의 매개변수로 쿠키이름(name)을 전달하면 해당 쿠키의 값을 반환
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
    }
    useEffect(() => {
        /**옵션 가져오기 */
        fetch(`${dataDomain}/option/product?pCode=${p_code}`)   // 서버에서 모든 옵션 정보를 가져오는 요청
            .then(res => { return res.json() })                 /* json() 괄호 붙어야함*/
            .then(data => {                                     // console.log(data);
                const productInfo = data[0].productInfo;        // const option = data.option;
                let option = [];                                // console.log(productInfo); console.log(option);

                setDetails(productInfo);

                data.map((data) => option.push({
                    "opCode"      : data.opCode,
                    "opOptionName": data.opOptionName,
                    "opQuantity"  : data.opQuantity,
                    "pcode"       : data.productInfo.pcode
                }))

                console.log(option);                            // 가공된 데이터를 출력하여 확인
                setProductOption(option);
            });

        if (getCookie('m_code') != null) {                                          // 현재 페이지에 쿠키에 m_code 값이 있는 경우에만 아래의 fetch를 실행
            fetch(`${dataDomain}/basket/member/mCode?mCode=${getCookie('m_code')}`) // 쿠키에서 m_code 값을 가져와서 해당 회원의 장바구니 정보 가져옴
                .then(res => { return res.json() })                                 // 응답 데이터는 json()(괄호 붙어야함) 형식으로 반환되어 data에 저장
                .then(data => {                                                     // console.log(data);
                    setBasket(data);
                    let sum = 0;
                    data.map((data) => sum = sum + (data.option.productInfo.psalePrice * data.bcount));
                    setBasketTotalPrice(sum);                                       // basket 상태 업데이트되며 컴포넌트가 리 랜더링 됨
                })
        }


        // fetch(`${dataDomain}/category/all`)      // 모든 카테고리 가져오기
        //     .then(res => { return res.json() })  /* json() 괄호 붙어야함*/
        //     .then(data => {                      // console.log(data);
        //         setCategoryList(data);           // 가져온 카테고리 목록을 상태 변수에 설정
        //     });
    }, []);

    function toggleWindow() {                               // 카테고리 창을 토글하는 함수
        setIsSidebar(!isSidebar);
        setIsListCategory(!isListCategory);
    }

    function goBack(){
        const confirmed = window.confirm("뒤로가시겠습니까?");

        if(confirmed){
            navigate(-1);
        }
    }
    /**장바구니 추가 */
    function plusShopingBasket() {
        try {
            if (getCookie('m_code') == null) throw new Error("로그인이 필요한 서비스 입니다.")
            const basketForm = {
                "bcount": parseInt(productCountRef.current.value, 10), // int형 변수는 형변환을 통해서 보내줘야 상대측이 이걸보고 int로 바꿀수가 ㅇ있다
                "mcode": parseInt(getCookie('m_code'), 10),
                "opcode": parseInt(selectOption.opCode, 10)
            }

            fetch(`${dataDomain}/basket/add`,                          // 서버에 장바구니 추가 요청
                {
                    method: "Post",
                    headers: {
                        'Content-Type': "application/json",
                    },
                    body: JSON.stringify(basketForm)
                }
            )
                .then(res => {
                    if (res.ok) {
                        alert("등록");
                        window.location.reload();                       // 페이지 새로고침
                    }
                });
        } catch (error) {
            const confirmed = window.confirm(error + "\n로그인 하시겠습니까?");

            if (confirmed) {
                navigate('/login');
            }
        }
    }

    /**옵션 변경시 총 가격 변동 */
    const [selectOption, setSelectOption] = useState({});                   // 선택한 옵션의 정보를 담는 변수
    const [totalPrice, setTotalPrice] = useState(0);                        // 총 가격의 정보를 담는 변수
    const [basketTotalPrice, setBasketTotalPrice] = useState(0);

    // 수량 변경 시 호출되는 함수
    function countChange() {
        console.log(productCountRef.current.value);
        setTotalPrice(productCountRef.current.value * details.psalePrice);  // 총 가격을 계산하여 업데이트
    }

    // 상품 바로구매 클릭시 해당 상품 선택된 옵션 및 상품 정보 state 넘어가기
    const productCountRef = useRef(null);                                   // 상품 수량
    const [productBuy, setProductBuy] = useState({                          // 상품 구매 정보를 담는 상태 변수
        "p_code"        : "",                                               // 이거 안해주면 그대로 휙 넘어감
        "p_option_name" : "",
        "p_option_price": 0,
        "p_count"       : 0,
        "p_price"       : 0,
        "op_code"       : 0
    });
    const navigate = useNavigate();                         // React Router의 useNavigate 훅을 사용하여 페이지 이동을 관리하는 함수

    function isProductBuy() {
        try {
            if (getCookie('m_code') == null) throw new Error("로그인이 필요합니다.")
            if (productCountRef.current.value === null || productCountRef.current.value === 0) throw new Error("수량을 입력해주세요")
            if (selectOption.opQuantity === 0) throw new Error("품절된 상품입니다. 다른옵션을 선택해주세요")
            if (totalPrice === 0) throw new Error("옵션 또는 수량을 선택하세요")
            setProductBuy({
                "p_code"     : details.pcode,                 // 상품 코드
                "p_name"     : details.pname,                 // 상품 이름
                "p_option"   : selectOption.opOptionName,     // 선택된 옵션
                "p_count"    : productCountRef.current.value, // 상품 수량
                "p_salePrice": details.psalePrice,            // 상품 가격
                "op_code"    : selectOption.opCode
            });
        } catch (error) {
            if (error == "Error: 로그인이 필요합니다.") {
                const confirmed = window.confirm(error + "\n로그인 하시겠습니까?");
                if (confirmed) {
                    navigate('/login');
                }
            }
            else {
                alert(error);
            }
        }
    }
    const [selectOptionCode, setSelectOptionCode] = useState();
    useEffect(() => {
        const selectOptionInfo = productOption.find((option) => option.opCode + '' === selectOptionCode);

        console.log(selectOptionInfo)
        setSelectOption(selectOptionInfo); // 선택한 옵셥의 정보를 업데이트

    }, [selectOptionCode])

    /** location을 통해서 state 값을 넘겨주고 이걸제대로 되게끔 처리 */
    useEffect(() => {
        if (productBuy.p_price !== 0) {    // productBuy 상태 변수가 변경될 때 실행
            navigate(
                `/Order/${p_code}`,
                { state: { productBuy } }
            )
        }
    }, [productBuy])

    /** 장바구니에서 구매 클릭시  */
    function basketBuy() {
        navigate(`/Order/${basket.m_code}`);
    }

    /**장바구니에서 삭제하고픈 물품을 삭제를 한다면 클릭이 되게  */
    function delectProduct(event) {
        //console.log(basket);
        fetch(`${dataDomain}/basket/productDelete?bcode=${basket[event.target.id].bcode}`, // 클릭된 상품을 장바구니에서 삭제
            {
                method: "Delete",
                headers: {
                    'Content-Type': "application/json",
                },
            }
        ).then(res => {
            if (res.ok) {
                alert("삭제완료");
                window.location.reload();  // 페이지 새로고침
            }
        });
    }

    const [isSidebar, setIsSidebar] = useState(true);
    const deleteCookie = (name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };
    function isLoginCheck() {
        if (getCookie('m_code') != null) {
            const confirmed = window.confirm("로그아웃 하시겠습니까?");
            if (confirmed) {
                deleteCookie('m_code');     //window.location.reload();
            }
        } else {
            navigate('/login');
        }
    }

    // 색약 이상 적용
    const [colorBlindType, setColorBlindType] = useState("normal");
    const [buttonText, setButtonText] = useState("색약조정");

    const handleChangeColorBlindType = (selectedType) => {
        setColorBlindType(selectedType);
        setButtonText(selectedType.charAt(0).toUpperCase() + selectedType.slice(1));
    };

    const isDefaultOption = false; // 옵션 기본값 설정 (안보이게 하는거)

    return (
            <body className={isSidebar === true ? "sb-nav-fixed" : "sb-nav-fixed sb-sidenav-toggled"}>
                {/**상단 */}
                <nav className={"sb-topnav navbar navbar-expand navbar-dark bg-dark"}>
                    <button className={"btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"} onClick={toggleWindow}><BiMenu /></button>
                    <Link to="/"><a class="navbar-brand ps-3" href="">SW Shop</a></Link> {/* image */}

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

                    {/**검색창 */}
                    <form className={"d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0"}>
                        <div className={"input-group"}>
                        </div>
                    </form>
                    {/**로그인 누르면 나오는 부분 */}
                    <Button className={"navbar-nav ms-auto ms-md-0 me-3 me-lg-4"} variant="dark" onClick={isLoginCheck}><BsPerson /></Button>
                    
                    {/**장바구니 팝업 */}
                    <Popup trigger={<Button className={"navbar-nav ms-auto ms-md-0 me-3 me-lg-4"} variant="dark"><BiCart /></Button>}
                        position={"bottom right"}
                        nested
                    >
                        <div class="card mb-4">
                            <div class="card-header">
                                <i class="fas fa-table me-1"></i>
                                장바구니
                            </div>
                            <div class="card-body">
                                <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                    <div className="datatable-container">
                                        <table id="datatablesSimple" className={"datatable-table"}>
                                            <tbody>
                                                {getCookie('m_code') == null ?
                                                    <tr>
                                                        <td>로그인을 해주세요</td>
                                                    </tr>
                                                    :
                                                    <>
                                                        <tr>
                                                            <td>삭제</td>
                                                            <td colSpan={3}>상품이름</td>
                                                            <td colSpan={2}>옵션</td>
                                                            <td>수량</td>
                                                            <td colSpan={2}>판매가</td>
                                                            <td colSpan={2}>총구매가</td>
                                                        </tr>
                                                        {
                                                            basket.map((basket, index) => (
                                                                <tr key={index}>
                                                                    <td><Button variant="danger" size="sm" id={index} onClick={delectProduct}>삭제</Button></td>
                                                                    <td colSpan={3}>{basket.option.productInfo.pname}</td>
                                                                    <td colSpan={2}>{basket.option.opOptionName}</td>
                                                                    <td>{basket.bcount}</td>
                                                                    <td colSpan={2}>{basket.option.productInfo.psalePrice}</td>
                                                                    <td colSpan={2}>{basket.option.productInfo.psalePrice * basket.bcount}</td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </>
                                                }
                                            </tbody>
                                        </table>
                                        <hr></hr>
                                        <p>총 구매가: {basketTotalPrice}</p>
                                        <div className="d-grid gap-2">
                                            <Button variant="success" size="sm" onClick={basketBuy}>구매</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* </div> */}
                    </Popup>
                </nav>
                {/**상단 */}
                <div id="layoutSidenav">
                    <div id="layoutSidenav_nav">
                        {isListCategory && ( //카테고리 상태에 의해 보여주냐 마냐
                            <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                                <div class="sb-sidenav-menu">
                                    <div className="nav">
                                    <div className="sb-sidenav-menu-heading">기능</div>
                                    <a href={""}className={`${styles.aNotSelect}`} onClick={goBack}    // onMouseOver={selectHighCategory} 
                                                >
                                                뒤로가기 
                                            </a>
                                    </div>
                                </div>
                            </nav>
                        )}
                    </div>
{/**상단 */}
{/* <div id="layoutSidenav">
                    <div id="layoutSidenav_nav">
                        {isListCategory && ( //카테고리 상태에 의해 보여주냐 마냐
                            <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                                <div class="sb-sidenav-menu">
                                    <div className="nav">
                                            
                                    </div>
                                </div>
                            </nav>
                        )}
                    </div> */}
                    {/*상품 상세정보 - 상품 이미지, 상품명, 가격, 옵션, 머시기 보이는곳*/}
                    <div id="layoutSidenav_content">
                        <main>

                        <div className={colorBlindType === "기본" ? null :
            colorBlindType === "적색약" ? "protanopeSimulation" :
                colorBlindType === "청색약" ? "deuteranopeSimulation" :
                    colorBlindType === "녹색약" ? "tritanopeSimulation" : null}>
                            {<div className="container-fluid px-4">
                                <section className="py-5">
                                    <div className={`container px-4 px-lg-5 my-5`}>
                                        <div className={"row gx-4 gx-lg-5 align-items-center"}>
                                            <div className={"col-md-6"}>
                                                <img src={details.pimageName} className={"card-img-top mb-5 mb-md-0"} />
                                            </div>

                                            <div className={"col-md-6"}>
                                                <h3>{details.pname}</h3>
                                                <hr></hr>
                                                <h3>옵션</h3>
                                                <Tabs
                                                    defaultActiveKey={`default`}
                                                    activeKey={selectOptionCode}
                                                    onSelect={(k) => setSelectOptionCode(k)}
                                                    className="mb-3"
                                                    fill
                                                >
                                                    {
                                                        isDefaultOption && (
                                                            <Tab eventKey={`default`} title={`default`} disabled>
                                                                상품 옵션을 선택해주세요.
                                                            </Tab>
                                                        )
                                                    }
                                                    {
                                                        productOption.map((option, index) => (
                                                            <Tab eventKey={`${option.opCode}`} title={`${option.opOptionName}`}>
                                                                <div style={{ color: option.opQuantity === 0 ? "red" : "black" }}>
                                                                    옵션: {option.opOptionName} {option.opQuantity === 0 ? "품절" : "남은수량: " + option.opQuantity}
                                                                </div>
                                                            </Tab>
                                                        ))
                                                    }
                                                </Tabs>
                                                <hr></hr>
                                                <h3>수량</h3>
                                                <input type={"number"} min={1} max={productOption.opQuantity} ref={productCountRef} onChange={countChange} />
                                                {
                                                    totalPrice === 0 ?
                                                        <div>
                                                            <hr></hr>
                                                            <h3>가격</h3>
                                                            <p>옵션 또는 수량을 선택해주세여</p>
                                                        </div> :
                                                        <div>
                                                            <hr></hr>
                                                            <h3>가격</h3>
                                                            <p>{totalPrice} 원</p>
                                                        </div>
                                                }
                                                <hr></hr>
                                                <Button variant="outline-info" onClick={isProductBuy}>상품 구매</Button>
                                                <Button variant="outline-warning" onClick={plusShopingBasket}>장바구니 담기</Button>
                                            </div>
                                        </div>
                                        <hr></hr>
                                        <div>
                                            <p>{details.pcontent}</p>
                                        </div>
                                    </div>
                                </section>
                            </div>}
                            </div>
                        </main>
                    </div>
                </div>
            </body>
    );
}