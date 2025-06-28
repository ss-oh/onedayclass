# 원데이 클래스 문자 전송 시스템

## 구조
- `frontend/` — HTML, CSS, JS 프론트 코드
- `server/` — Node.js 기반 문자 전송 API (CoolSMS)

## 서버 실행 방법 (로컬)
```
cd server
cp .env.example .env
npm install
npm start
```

## Render 배포 방법
- Web Service로 `server/` 폴더 지정
- `.env` 환경 변수에 API_KEY 등 입력
- 배포 완료 후 프론트 JS에서 해당 URL로 fetch 요청