# Sku_Sw_Project
## Developing on AWS
*AWS의 전반적인 이해와 활용 하여 하나의 서비스를 구현 및 베포*


# Sku_Sw_Project_FRONT
## Skills
1. HTML, CSS, JavaScript(ES6)
2. React
### React 사용 라이브러리
- 
# Sku_Sw_Project
# Sku_Sw_Project

# Sku_Sw_Project_AWS
### EC2 
t3.small
#### 인바운드 규칙(VPC)
1. 23 ssh
2. 80 http
3. 8080 springBoot
#### DNS
ec2-3-38-45-235.ap-northeast-2.compute.amazonaws.com

#### Elastic Block Store
-유형: gp3
-크기: 100gb
-IOPS: 3000
-처리량: 125

### S3
1. theidrou..
    이미지 파일 저장하는 S3 버킷
2. 20ths.skuservice.net
   정적 웹호스팅(React Build) S3 버킷

#### 버킷정책
{
  "Version": "2012-10-17",
  "Id": "Policy 1702018033240",
  "Statement": [
  {
    "Sid": "Stmt1702018024399",
    "Effect": "Allow",
    "Principal": ***,
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:themostfavoriteidoru/*'
  }
}
#### CORS 정책
{
  "AllowedHeaders": [
  "*"
  ],
  "AllowedMethods": [
    "GET",
    "PUT",
    "POST",
    "HEAD"
    ],
  "AllowedOrigins": [
    "*"
  ],
  "ExposeHeaders": [
    "x-amz-server-side-encryption",
    "x-amz-request-id",
    "x-amz-id-2"
    ],
    "MaxAgeSeconds": 3000
}
### Lambda
-언어: Python 3.11
-사용 라이브러리: request 
-작동 방식: 실행시 front, back에게 각각 request 요청, 응답을 못받을 시 텔레그램으로 문자 전송
-CloudWatch를 통해 주기적으로 실행

### CloudWatch
-이벤트 주기: 4 hour

### CloudFront
cdn
DNS: d1fyi3zkv8dc3.cloudfront.net(23년 12월 31일 부로 서비스 종료)
-가격 분류: 모든 엣지 로케이션에서 사용(최고의 성능)
-지원되는 HTТР 버전: HTTP/2, HTTP/1.1, HTTP/1.0

### Router 53
DNS
DNS Link: 20ths.skuservice.net(23년 12월 31일 부로 서비스 종료)
