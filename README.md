# HYEIN'S PORTFOLIO

HTML · CSS · JavaScript로 구성한 포트폴리오입니다. React/JSX 없이 동작하며, 기존 애니메이션은 GSAP을 사용합니다. Vite는 로컬 서버와 배포용 파일 빌드에 사용합니다.

## 실행

```powershell
npm.cmd install
npm.cmd run dev
```

표시된 Local 주소를 브라우저에서 열어주세요. HTML 파일을 더블클릭하는 대신 로컬 서버로 실행합니다.

## 파일 구조

- `index.html`: 전체 화면의 HTML. 문구, 프로젝트 이미지, 링크를 수정합니다.
- `css/index.css`: 공통 스타일과 Fraunces 폰트.
- `css/components/`: 기존 섹션별 CSS. `work/team/`, `work/projectpreview/` 구분을 유지합니다.
- `js/main.js`: 화면 크기 조정, 프로젝트 필터/캐러셀, UX 자료 탭과 확대창.
- `js/animations/`: 비행, 타이핑, 가로 스크롤, 배경 전환, 도장 효과.
- `js/data/uxProcessData.js`: 추후 넣을 UX 자료의 제목과 이미지 경로.
- `public/assets/`: 이미지 및 폰트. HTML에서는 `/assets/…` 경로로 사용합니다.

## 확인 및 빌드

```powershell
npm.cmd run lint
npm.cmd run build
npm.cmd run preview
```

배포 파일은 `dist/`에 생성됩니다.
