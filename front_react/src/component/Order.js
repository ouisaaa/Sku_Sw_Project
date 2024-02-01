import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { dataDomain } from "./common";
import { BiMenu, BiCart } from "react-icons/bi";
import { BsPerson } from "react-icons/bs";

import styles from "../public/css/Order.module.css";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import DaumPostcode from "react-daum-postcode";
import Popup from "reactjs-popup";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";

export default function Order() {
    const [isListCategory, setIsListCategory] = useState(true);         // 카테고리창 보여주는 상태 관리
    const [basket, setBasket] = useState([]);                         // 장바구니 목록 관리
    const [paymentMethod, setPaymentMethod] = useState("무통장입금");
    const [openPostcode, setOpenPostcode] = useState(false);
    const [totalBuyPrice, setTotalBuyPrice] = useState(0);

    function getCookie(name) {                                  // document.cookie 에서 쿠키 값을 가져오는 함수
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);                // 함수의 매개변수로 쿠키이름(name)을 전달하면 해당 쿠키의 값을 반환
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
    }
    const [orderForBasket, setOrderForBasket] = useState([]);

    useEffect(() => {
        if (getCookie('m_code') != null) {                                               // 현재 페이지에 쿠키에 m_code 값이 있는 경우에만 아래의 fetch를 실행
            fetch(`${dataDomain}/basket/member/mCode?mCode=${getCookie('m_code')}`)     // 쿠키에서 m_code 값을 가져와서 해당 회원의 장바구니 정보 가져옴
                .then(res => { return res.json() })                                            // 응답 데이터는 json()(괄호 붙어야함) 형식으로 반환되어 data에 저장
                .then(data => {
                    console.log(data);
                    setBasket(data);
                    setOrderForBasket(data);

                    let sum = 0;
                    data.map((data) => sum = sum + (data.option.productInfo.psalePrice * data.bcount));
                    setTotalBuyPrice(sum);                                                  // basket 상태 업데이트되며 컴포넌트가 리 랜더링 됨
                })
        }
    }, []);

    function toggleWindow() {
        setIsListCategory(!isListCategory);
    }
    function tooglePaymentMethod(event) {
        event.preventDefault();
        const clickedElement = event.target;
        const textContent = clickedElement.textContent;
        setPaymentMethod(textContent);
    }

    /**다음 주소 검색 매시업 */
    function IsDaumPost() {
        setOpenPostcode(!openPostcode);
    }
    const [address1, setAddress1] = useState();
    const [address2, setAddress2] = useState();

    function SADaumPost(data) {
        console.log(`
            총: ${data},
            주소: ${data.address},
            우편번호: ${data.zonecode}
        `)
        setAddress1(data.address);
        setAddress2(data.zonecode);

        setOpenPostcode(false);
        setSearchAddress(data);
    }

    /** 상세 상세 페이지에서 받은 state 값을 토대로 주문 상품 구성 */
    const location = useLocation();
    if (location.state !== null) { console.log(location.state); }

    /** 장바구니에서 구매 클릭시  */
    const navigate = useNavigate();             // 훅을 사용하여 페이지 이동을 위한 함수 생성

    function basketBuy() {                      // 장바구니에서 구매 버튼이 클릭되었을 때의 동작 정의
        navigate(
            `/Order/${basket.m_code}`,          // navigate 함수를 사용해서 page 이동
        )
    }

    /**주문 창에서 사고싶지 않는 물품은 삭제를 눌러 삭제를 할수있게*/
    function deleteProduct(event) {
        const orderModify = orderForBasket.filter((order) => {
            return order.bcode + '' != event.target.value
        });
        if (orderModify.length < 1) {
            const confirmed = window.confirm("주문을 취소하시겠습니까?");
            if (confirmed) {
                navigate("/");
            }
        }
        setOrderForBasket(orderModify);

        let sum = 0;
        orderModify.map((data) => sum = sum + (data.option.productInfo.psalePrice * data.bcount));
        setTotalBuyPrice(sum);
    }

    function deleteLocation() {
        const confirmed = window.confirm("주문을 취소하시겠습니까?");
        if (confirmed) {
            navigate("/");
        }
    }

    const receiverNameRef = useRef(null);
    const receiverNumber1Ref = useRef(null);
    const receiverNumber2Ref = useRef(null);
    const receiverNumber3Ref = useRef(null);
    const orderRequest = useRef(null);
    const [searchAddress, setSearchAddress] = useState({});
    const addressDetail = useRef(null);

    function postOrder() {
        try {
            if (receiverNameRef.current.value === "") throw new Error("수령인을 입력해주세요");
            if (receiverNumber2Ref.current.value === "" && receiverNumber3Ref.current.value === "") throw new Error("전화번호를 입력해주세요");
            if (searchAddress.address === "" && searchAddress.zonecod && addressDetail.current.value === "") throw new Error("주소 검색을 눌러 주소를 기입해주세요");

            let buyBasket = [];
            orderForBasket.map((orderModify) => buyBasket.push({
                "p_code"        : parseInt(orderModify.option.productInfo.pcode, 10),
                "op_option_name": orderModify.option.opOptionName,
                "od_count"      : parseInt(orderModify.bcount, 10),
                "op_code"       : parseInt(orderModify.option.opCode, 10)
            }));

            const orderInfo = location.state === null ? {
                "product"      : buyBasket,
                "o_total_price": totalBuyPrice,
                "o_zip_code"   : searchAddress.zonecode,
                "o_address"    : searchAddress.address + " " + addressDetail.current.value,
                "o_phone_num"  : `${receiverNumber1Ref.current.value}-${receiverNumber2Ref.current.value}-${receiverNumber3Ref.current.value}`,
                "o_request"    : orderRequest.current.value,
                "member"       : {
                    "m_code": parseInt(getCookie('m_code', 10))
                }
            } : {
                "product": [{
                    "p_code"        : parseInt(location.state.productBuy.p_code, 10),
                    "op_option_name": location.state.productBuy.p_option,
                    "od_count"      : parseInt(location.state.productBuy.p_count, 10),
                    "op_code"       : parseInt(location.state.productBuy.op_code, 10)
                }],
                "o_total_price": parseInt(location.state.productBuy.p_salePrice * location.state.productBuy.p_count, 10),
                "o_zip_code"   : searchAddress.zonecode,
                "o_address"    : searchAddress.address + " " + addressDetail.current.value,
                "o_phone_num"  : `${receiverNumber1Ref.current.value}-${receiverNumber2Ref.current.value}-${receiverNumber3Ref.current.value}`,
                "o_request"    : orderRequest.current.value,
                "member"       : {
                    "m_code": parseInt(getCookie('m_code', 10))
                }
            }

            fetch(`${dataDomain}/order/newOrder`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(orderInfo)
            }).then(res => {
                if (res.ok) {
                    alert("상품 주문 완료");
                    if (location.state !== null) {
                        const encodedText = encodeURIComponent(`새로운 주문이 들어왔습니다:\n상품명: ${location.state.productBuy.p_name}\n옵션: ${location.state.productBuy.p_option}`);
                        fetch(`http://api.telegram.org/bot6865981909:AAGA3hXsxrcAM3jBzSaPXmufqMyW5mqOgvk/sendMessage?chat_id=-4009844123&text=${encodedText}`);
                    }
                    else {

                        const encodedText = encodeURIComponent(`새로운 주문이 들어왔습니다:\n상품명: ${orderForBasket[0].option.productInfo.pname} ${orderForBasket.length > 1 ? `외 ${orderForBasket.length - 1}` : ""}`);
                        fetch(`http://api.telegram.org/bot6865981909:AAGA3hXsxrcAM3jBzSaPXmufqMyW5mqOgvk/sendMessage?chat_id=-4009844123&text=${encodedText}`);

                        let deleteBasket = orderForBasket.map((basket) => basket.bcode);
                        //const orderModifyBasket=basket.filter((basket)=> !deleteBasket.includes(basket.bcode))//장바구니 상품 주문시 주문한 상품 장바구니에서 삭제

                        fetch(`${dataDomain}/basket/productsDelete?bcode=${deleteBasket}`, {
                            method: "Delete",
                            headers: {
                                'Content-Type': "application/json",
                            },
                        }).then(res => {
                            if (res.ok) {
                                navigate('/');
                            }
                        }
                        )
                    }
                    navigate("/");                   // 페이지 새로고침
                }
            });
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    }

    return (
        <body className={"sb-nav-fixed sb-sidenav-toggled"}>
            {/**상단 */}
            <nav className={"sb-topnav navbar navbar-expand navbar-dark bg-dark"}>
                <button className={"btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"} onClick={toggleWindow}><BiMenu /></button>
                <Link to="/"><a class="navbar-brand ps-3" href="">SW Shop</a></Link> {/* image */}

                {/**검색창 */}
                <form className={"d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0"}>
                    <div className={"input-group"}></div>
                </form>

                {/**로그인 누르면 나오는 부분 */}
                <Link to="/login"><Button className={"navbar-nav ms-auto ms-md-0 me-3 me-lg-4"} variant="dark"><BsPerson /></Button></Link>

                {/**장바구니 팝업 */}
                <Popup trigger={<Button className={"navbar-nav ms-auto ms-md-0 me-3 me-lg-4"} variant="dark"><BiCart /></Button>}
                    position={"bottom right"}
                    nested
                >
                    {/* //<div className={styles.boxSide}> */}
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
                                                        <td><button id={basket.bcode} className={`${styles.Btn}`}>삭제</button></td>
                                                        <td colSpan={3}>{basket.option.productInfo.pname}</td>
                                                        <td colSpan={2}>{basket.option.opOptionName}</td>
                                                        <td>{basket.bcount}</td>
                                                        <td colSpan={2}>{basket.option.productInfo.psalePrice}</td>
                                                        <td colSpan={2}>{basket.option.productInfo.psalePrice * basket.bcount}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    <hr></hr>
                                    <p>총 구매가: {totalBuyPrice}<button onClick={basketBuy} className={`${styles.Btn}`}>구매</button></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Popup>
            </nav>
            <div id="layoutSidenav">
                <div id="layoutSidenav_content">
                    <main>
                        <div className="container-fluid px-4">
                            <h1 className="mt-4">결제 페이지</h1>
                            <ol className="breadcrumb mb-4">
                                <li className="breadcrumb-item active">주문사항을 확인하여 결제를 눌러주세요</li>
                            </ol>
                            <div class="card mb-4">
                                <div class="card-header">
                                    <i class="fas fa-table me-1"></i>
                                    배송지
                                </div>
                                <div class="card-body">
                                    <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                        <div className="datatable-container">
                                            <table id="datatablesSimple" className={"datatable-table"}>
                                                <tbody>
                                                    <tr>
                                                        <td>수령인</td>
                                                        <td>
                                                            <FloatingLabel label="수령인"><Form.Control type="text" ref={receiverNameRef} /></FloatingLabel></td>
                                                    </tr>
                                                    <tr>
                                                        <td>연락처</td>
                                                        <td>
                                                            <div className="row">
                                                                <div class="col-xl-3">
                                                                    <Form.Select ref={receiverNumber1Ref}>
                                                                        <option>010</option>
                                                                        <option>02</option>
                                                                        <option>031</option>
                                                                        <option>032</option>
                                                                        <option>033</option>
                                                                        <option>041</option>
                                                                        <option>042</option>
                                                                        <option>043</option>
                                                                        <option>044</option>
                                                                        <option>051</option>
                                                                        <option>052</option>
                                                                        <option>053</option>
                                                                        <option>054</option>
                                                                        <option>055</option>
                                                                        <option>061</option>
                                                                        <option>062</option>
                                                                        <option>063</option>
                                                                        <option>064</option>
                                                                        <option>067</option>
                                                                    </Form.Select>
                                                                </div>
                                                                -
                                                                <div class="col-xl-3">
                                                                    <Form.Control type="text" size="4" ref={receiverNumber2Ref} />
                                                                </div>
                                                                -
                                                                <div class="col-xl-3">
                                                                    <Form.Control type="text" size="4" ref={receiverNumber3Ref} />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>주소</td>
                                                        <td>
                                                            <Accordion defaultActivceKey="0">
                                                                <Accordion.Item eventKey="0">
                                                                    <Accordion.Header onClick={IsDaumPost}>
                                                                        주소검색
                                                                    </Accordion.Header>
                                                                    <Accordion.Body>
                                                                        {/*** 다음 매쉬업 */}
                                                                        {
                                                                            openPostcode &&
                                                                            <DaumPostcode
                                                                                onComplete={SADaumPost}  // 값을 선택할 경우 실행되는 이벤트
                                                                                autoClose={false} // 값을 선택할 경우 사용되는 DOM을 제거하여 자동 닫힘 설정
                                                                            />
                                                                        }
                                                                    </Accordion.Body>
                                                                </Accordion.Item>
                                                            </Accordion>
                                                            <br></br>
                                                            <div className="row">
                                                                <div class="col-xl-4">
                                                                    <FloatingLabel label="도로명 주소">
                                                                        <Form.Control type="text" value={address1} />
                                                                    </FloatingLabel>
                                                                </div>
                                                                <div class="col-xl-4">
                                                                    <FloatingLabel label="우편번호">
                                                                        <Form.Control type="text" value={address2} size={10} />
                                                                    </FloatingLabel>
                                                                </div>
                                                                <div class="col-xl-4">
                                                                    <FloatingLabel label="상세주소">
                                                                        <Form.Control type="text" ref={addressDetail} />
                                                                    </FloatingLabel>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>배송 요청사항</td>
                                                        <td>
                                                            <FloatingLabel label="배송요청사항">
                                                                <Form.Control type="text" size={20} ref={orderRequest} />
                                                            </FloatingLabel>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/** 주문 상품 테이블 */}
                            <div className="card mb-4">
                                <div className="card-header">
                                    <i className="fas fa-table me-1"></i>
                                    주문 상품
                                </div>
                                <div className="card-body">
                                    <div className="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns">
                                        <div className="datatable-container">
                                            <table id="datatablesSimple" className={"datatable-table"}>
                                                <tbody>
                                                    <tr>
                                                        <td></td>
                                                        <td colSpan={3}>상품이름</td>
                                                        <td colSpan={2}>옵션</td>
                                                        <td>수량</td>
                                                        <td colSpan={2}>개별 가격</td>
                                                        <td colSpan={2}>총가격</td>
                                                    </tr>
                                                    {
                                                        location.state !== null ?
                                                            <tr>
                                                                <td colSpan={1}><button id={0} className={`${styles.deleteBtn}`} onClick={deleteLocation}>삭제</button></td>
                                                                <td colSpan={3}>{location.state.productBuy.p_name}</td>
                                                                <td colSpan={2}>{location.state.productBuy.p_option}</td>
                                                                <td>{location.state.productBuy.p_count}</td>
                                                                <td colSpan={2}>{location.state.productBuy.p_salePrice}</td>
                                                                <td colSpan={2}>{location.state.productBuy.p_salePrice * location.state.productBuy.p_count}</td>
                                                            </tr>
                                                            : orderForBasket.map((basket, index) => (
                                                                <tr>
                                                                    <td><button id={index} className={`${styles.deleteBtn}`} value={basket.bcode} onClick={deleteProduct}>삭제</button></td>
                                                                    <td colSpan={3}>{basket.option.productInfo.pname}</td>
                                                                    <td colSpan={2}>{basket.option.opOptionName}</td>
                                                                    <td>{basket.bcount}</td>
                                                                    <td colSpan={2}>{basket.option.productInfo.psalePrice}</td>
                                                                    <td colSpan={2}>{basket.option.productInfo.psalePrice * basket.bcount}</td>
                                                                </tr>
                                                            ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <hr></hr>

                            {/** 결제 부분(미구현) */}
                            <div>
                                <h4>결제</h4>
                                <span>
                                    <button onClick={tooglePaymentMethod}>무통장입금</button>
                                </span>
                                {paymentMethod == "무통장입금" ? (
                                    <div>
                                        <p>은행: 신한</p>
                                        <p>계좌번호: 110 - 4747 - 68267</p>
                                        <p>예금주: 우 휑</p>
                                    </div>
                                ) : null}
                            </div>
                            <hr></hr>
                            <span>
                                {
                                    location.state !== null ?
                                        <p>결제 금액: {location.state.productBuy.p_salePrice * location.state.productBuy.p_count}</p>
                                        : <p>결제 금액: {totalBuyPrice}</p>
                                }
                                <Button variant="outline-primary" onClick={postOrder}>결제</Button>
                            </span>
                        </div>
                    </main>
                </div>
            </div>
        </body>
    );
}