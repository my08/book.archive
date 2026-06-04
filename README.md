# folio

모바일 웹 독서 기록 앱. 읽는 책을 추적하고, 메모를 남기고, 완독한 책을 별점과 함께 아카이빙합니다.

**→ [https://my08.github.io/archivebook/](https://my08.github.io/archivebook/)**

---

## 기능

**독서 중**
- 책 추가 (제목 입력 시 표지 자동 검색)
- 색상 커스텀
- 페이지 또는 분 단위로 독서량 기록
- 메모 작성
- 스와이프로 삭제

**활동 그래프**
- GitHub 잔디 형태로 연간 독서 활동 시각화

**캘린더**
- 날짜별 독서 기록 확인

**완독**
- 별점(1~5) 평가
- 날짜순 / 별점순 정렬
- 책별 메모 아카이브

---

## 기술 스택

- Vanilla JS / HTML / CSS — 빌드 도구 없음
- localStorage로 데이터 저장
- Google Books API + Open Library API (표지 이미지)
- PWA 지원 (홈 화면 추가 가능)

---

## 로컬 실행

```bash
npx serve .
# → http://localhost:3000
```
