# SoulSync (소울싱크)

> 신앙과 마음, 그리고 일상의 리듬을 하나로 연결하는 AI 라이프 케어 앱
> — Pi Next 해커톤 출품용 1단계 MVP 웹 프로토타입

묵주기도와 신앙 루틴을 "해야 하는 일"이 아니라 "나를 돌보는 시간"으로 바꾸는 앱입니다.
오늘의 마음을 고르면 그 마음에 맞는 말씀과 1분 기도, 묵주기도의 신비를 제안하고,
10알(1단)을 마치면 조용히 기록으로 남겨 줍니다.

- **빌드 없음 · 의존성 없음**: 순수 HTML/CSS/JS. 파일을 열면 바로 동작합니다.
- **한국어 / English 실시간 전환**: 상단 `EN` 버튼 하나로 전체 화면·기도문·AI 답변이 함께 바뀝니다.
- **Pi 연동 레이어 내장**: Pi Browser에서는 실제 `Pi.authenticate` / `Pi.createPayment`,
  일반 브라우저에서는 안전한 데모 시뮬레이션으로 동일한 흐름을 체험할 수 있습니다.

---

## 1. 바로 실행하기

### 가장 간단한 방법
`index.html` 파일을 브라우저로 열면 끝입니다. (Chrome/Edge/Safari 최신 버전 권장)

### 로컬 서버로 확인 (권장 — localStorage·음성 동작이 더 안정적)
```bash
cd projects/soulsync
python3 -m http.server 4300
# 브라우저에서 http://localhost:4300
```

### 정적 호스팅
`projects/soulsync/` 폴더를 그대로 올리면 됩니다. 빌드 단계가 없습니다.

| 호스팅 | 방법 |
| --- | --- |
| GitHub Pages | 저장소에 폴더를 올리고 Settings → Pages → Branch/root 지정 |
| Vercel | 프로젝트 루트를 `projects/soulsync`로 설정, 프레임워크 "Other" |
| Netlify | 폴더 드래그 앤 드롭 |
| PiNet / Pi 앱 호스팅 | Pi 생태계용 정적 호스팅에 동일 폴더 업로드 (HTTPS 필수) |

> Pi Browser에서 실제 로그인·결제를 시험하려면 **공개 HTTPS 주소**가 필요합니다.
> `http://localhost`는 데모 모드로만 동작합니다.

---

## 2. 화면 구성 (하단 4개 탭)

### 🏠 홈
- 오늘의 감정 선택 칩 6종 (지침 · 불안 · 평온 · 감사 · 외로움 · 기쁨) — 고른 칩은 2px 진한 보라 테두리와 3px 연보라 링, 연보라 채움으로 한눈에 구분됩니다
- 선택한 마음에 맞춘 AI의 한마디 + 오늘의 말씀
- 오늘의 작은 루틴 3개 체크: 짧은 기도 1회 · 묵주기도 1단 · 말씀 1개
- `▶ 기도 시작하기` → 1분 기도 시트 / `묵주기도로 이어가기` → 묵주기도 탭
- `1분 기도` 시트는 고른 마음에 맞는 **4단계 × 15초** 기도문을 보여 줍니다(6종 × KR/EN, 아직 마음을 고르지 않았으면 공통 4단계).

### 🙏 묵주기도
- 5단 진행 표시(● ○ ○ ○ ○)와 10알 카운터
- 실제 가톨릭 기도문 수록: 성호경 · 사도신경 · 주님의 기도 · 성모송 · 영광송 · 구원의 기도 (KR/EN)
- 오늘의 마음에 맞춘 신비 추천 + 신비 5개 목록(현재 위치 강조)
- `한 알 바치기` 수동 진행 · `자동 진행/일시정지` · `음성 안내`(한국어는 여성·남성 모두 녹음 음성, 영어는 Web Speech API) · `🌙 집중 모드`(어두운 명상 UI)
- 음성 안내를 켜면 **목소리(여성 · 남성)** 와 **속도(천천히 · 보통 · 빠르게)** 선택이 카드 안에서 부드럽게 펼쳐집니다 — 평소에는 접혀 있어 기도 카드가 복잡해지지 않고, 기본값은 남성 목소리·천천히이고, 고른 목소리·속도는 저장되어 다음 방문에도 유지되며 자동 진행 간격도 함께 조정됩니다. **한국어**는 기기 음성 대신 녹음된 기도 음성(`audio/ko-male/` 남성 · `audio/ko-female/` 여성, 각각 ko-KR 성우, 천천히·낮게)으로 읽고 재생 속도만 0.95 / 1.08 / 1.25로 조절합니다 — 삼성 인터넷·카톡 인앱처럼 음성 하나만 있는 안드로이드에서도 고른 성별의 기도 톤이 유지되고, 녹음이 재생되지 않으면 기기 음성으로 되돌아갑니다(영어는 기기 음성, 성별 음성이 없으면 여성 0.90 / 남성 0.70 피치).
- 10알을 마치면 오늘의 "묵주기도 1단"이 자동 기록됩니다. 5단 완료 시 마무리 카드.

### 🧠 AI 코치
- 안내 문구 바로 아래 빠른 예시 칩 7개(지침 · 불안 · 감사 · **가족** · 외로움 · 미안 · 방향) — 잘리지 않고 두세 줄로 펼쳐져 대화를 시작하기 전에 한눈에 고를 수 있습니다
- 고민 입력창은 대화 목록 아래에 고정
- 키워드/감정을 읽어 **공감 → 오늘의 1분 행동 → 성경 구절 → 추천 신비**를 카드로 제시
- 테마 8종: 지침 · 불안 · 미안 · 외로움 · **가족** · 감사 · 방향 · 슬픔 (가족·사랑·평화·건강·중보는 한국어·영어 모두 인식)
- 가족 이야기에는 민수기 6,24-26 축복 기도와 **환희의 신비**를 연결
- `추천 기도 시작` → 해당 신비로 묵주기도 화면 연결
- 답변은 언어를 바꾸면 함께 번역됩니다(테마 + 원문을 저장하고 다시 렌더링).

### 📊 루틴 · Pi
- 연속 달성 Streak, 최고 기록, 최근 7일 기록(기도·묵주·말씀 3색 점)
- 오늘 체크 상태 + 흐름 피드백(3일 이상 쉬면 "1분 기도부터" 제안)
- **Pi 연동 카드**: Pi 로그인(또는 데모), 감사 봉헌(0.1 / 1 / 3.14 π), 최근 봉헌 내역
- **글로벌 묵주기도 연대 카운터**: 오늘 함께 기도한 파이오니어 수(데모에서는 예시 숫자 + 내 기도 횟수)
- 내 기록 초기화

---

## 3. Pi 연동 가이드

### 3.1 동작 방식
`pi-adapter.js` 하나로 두 환경을 모두 처리합니다.

| 환경 | 감지 | 동작 |
| --- | --- | --- |
| Pi Browser + 승인 서버 있음 | `SS_PI.mode === "pi"`, `paymentMode === "pi"` | `Pi.init` → `Pi.authenticate` → `Pi.createPayment` (서버 승인) |
| Pi Browser + 승인 서버 없음(정적 호스팅, `/api/pi/approve` 404·405·501, 또는 `PI_API_KEY` 미설정) | `SS_PI.mode === "pi"`, `paymentMode === "demo"` | 로그인은 실제 Pi로 시도하고, 봉헌은 결제창 없이 데모로 기록(`mode: "demo"`, 실제 차감 없음) |
| 일반 브라우저 | `SS_PI.mode === "demo"` | 0.65초 지연 후 데모 로그인 / 0.9초 후 데모 봉헌 기록. 모든 결과에 `mode: "demo"` 표시 |

- **Pi SDK는 `index.html`이 모든 브라우저에서 불러옵니다**(`<script src="https://sdk.minepi.com/pi-sdk.js" async>`). 그래서 Pi Browser의 사용자 에이전트가 `PiBrowser`를 달고 있지 않아도 `window.Pi`가 있고, SDK가 늦게 도착해도 어댑터가 알아서 붙잡습니다(최대 8초 기다림). `async`라서 느린 회선·오프라인에서도 페이지를 붙잡지 않습니다.
- **대신 `window.Pi`의 존재만으로 Pi Browser라고 단정하지 않습니다.** SDK를 모든 브라우저에서 불러오므로 그렇게 하면 PC 크롬 사용자가 12초 로그인 대기와 열리지 않는 결제창을 만나게 됩니다. `pi-adapter.js`는 Pi Browser의 흔적(`PiBrowser` UA · Pi가 주입한 SDK · Pi 호스트가 띄운 프레임/리퍼러) 중 하나가 있을 때만 실결제 모드로 들어갑니다. 흔적을 알아보지 못하는 Pi Browser 빌드라면 주소 끝에 **`?pi=1`**을 붙이면 강제로 실결제 모드가 됩니다(예: `https://soulsync-sandy.vercel.app/?pi=1`).
- **승인 서버 확인이 먼저입니다.** `Pi.createPayment`를 열기 전에 `POST <approve endpoint>`를 `{ probe: "soulsync-capability-check" }`로 한 번 두드려 봅니다(POST만이 진짜 라우트와 정적 호스팅의 405를 구분합니다). 404·405·501, HTML 응답, 네트워크 실패면 결제창을 열지 않고 데모로 기록합니다. 그래서 GitHub Pages 같은 정적 호스팅에서도 결제 도중 405가 뜨지 않습니다.
- 확인 결과는 `SS_PI.backend`(`"live" | "missing"`)와 `SS_PI.paymentMode`에 남고, 화면 배지는 `Pi Browser · 실결제` / `Pi Browser · 데모` / `데모 모드`로 구분됩니다.
- `Pi.authenticate`가 실패하거나 **12초** 안에 응답하지 않으면(도메인 미등록, 사용자 취소, 오프라인) 그 세션은 데모 파이오니어로 이어지고 토스트로 알려 줍니다. 연결 버튼이 30초씩 돌지 않도록 12초로 줄였습니다.
- 승인 서버가 항상 있는 배포라면 `CONFIG.demoFallback = false`로 두면 됩니다(이때는 항상 실결제 경로).

- Pi Browser인데 SDK 태그가 없는 페이지(예: 단일 파일 미리보기)에서 열리면, 어댑터가 `https://sdk.minepi.com/pi-sdk.js`를 한 번만 동적으로 불러옵니다.
- 데모 모드에서는 **실제 결제가 일어나지 않으며**, UI에도 "데모 모드 / 실제 결제 없음"이라고 표시됩니다.
- `Pi.init`의 `sandbox` 값은 `pi-adapter.js` 상단 `CONFIG.sandbox`에서 바꿉니다(테스트: `true`, 실결제: `false`).

### 3.2 Pi Developer Portal 등록
1. **Pi Browser**를 열고 Pi 계정으로 로그인합니다.
2. Pi 개발자 포털(`developers.minepi.com`)에 접속해 **Sign in with Pi**로 로그인합니다.
3. **New App** 생성 후 아래를 입력합니다.
   - App Name: `SoulSync`
   - Description: `Faith, heart and daily rhythm — a Catholic prayer & routine companion for Pioneers`
   - App URL: 앱을 여는 주소(루트 도메인. Pi 포털은 하위 경로가 붙은 주소를 받지 않습니다). 승인 서버가 있는 `https://soulsync-sandy.vercel.app/` 가 지금의 실결제 대상 주소입니다.
   - Category: `Lifestyle` / `Health & Wellness`
   - Logo, 스크린샷 업로드
4. 앱 상세 화면에서 **API Key**(서버 승인용)를 발급받아 서버 환경변수에 넣습니다. 이 키는 절대 프론트엔드에 넣지 마세요.
5. Pi Browser 주소창에 등록한 App URL을 열어 실제 로그인/결제를 확인합니다.
6. 메인넷 노출을 원하면 포털의 체크리스트(작동하는 앱, 개인정보처리방침, 결제 완결성 등)를 채우고 심사를 요청합니다.

### 3.3 결제 승인 서버 (포함되어 있음 — Vercel)
Pi 결제는 브라우저에서 끝나지 않습니다. 결제 ID를 서버에서 승인(approve)하고 완료(complete)해야 합니다.
그 서버를 이 폴더 안에 Vercel Serverless Functions로 넣어 두었습니다(빌드·의존성 없음, `fetch`만 사용).

```
api/_lib/pi.js           # Pi API 호출·응답 공통부 (Vercel 라우트가 아니라 import 전용)
api/pi/approve.js        # POST { paymentId }            → Pi 승인
api/pi/complete.js       # POST { paymentId, txid }      → Pi 완료
api/pi/incomplete.js     # POST { paymentId }            → 중단된 결제 기록(200)
```

`pi-adapter.js`는 이 세 경로를 같은 도메인 기준으로 호출합니다.

**API 키 넣기 (한 번만)**
1. Pi 개발자 포털 앱 상세에서 **API Key**를 복사합니다.
2. Vercel 프로젝트 → Settings → Environment Variables → `PI_API_KEY` 추가(Production·Preview·Development 모두) → Save.
3. Deployments → 최신 배포 → Redeploy(환경변수는 새 배포부터 적용됩니다).

키를 넣기 전에는 `/api/pi/approve`가 **404 `{"ok":false,"error":"PI_API_KEY_NOT_CONFIGURED"}`**로 답합니다.
이 상태가 정상이고, 그동안 앱은 결제창을 열지 않고 데모로 기록합니다. 키를 넣고 나면 같은 주소가
`{"ok":true,"configured":true}`로 답하고, 배지가 `Pi Browser · 실결제`로 바뀝니다.

**확인 방법**

```bash
curl -s -X POST https://soulsync-sandy.vercel.app/api/pi/approve \
  -H 'Content-Type: application/json' -d '{"probe":"soulsync-capability-check"}'
# 키 없음 → {"ok":false,"error":"PI_API_KEY_NOT_CONFIGURED"} (404)
# 키 있음 → {"ok":true,"configured":true,"route":"/api/pi/approve"} (200)
```

**응답 규칙** (앱이 안전하게 데모로 남도록)
- 키 미설정: approve `404`, complete·incomplete `501` — 어댑터는 이 셋을 "승인 서버 없음"으로 읽습니다.
- Pi API가 거절(400 등): `502` + `{ ok:false, error:"PI_API_APPROVE_FAILED", upstreamStatus }` — 404로 바꾸지 않습니다(데모로 새지 않도록).
- 네트워크 실패·8초 타임아웃: `502 PI_API_UNREACHABLE`.
- POST가 아닌 요청: `405` + `Allow: POST`.
- 키는 응답·프론트엔드에 절대 나오지 않습니다.

다른 호스팅(Netlify·Express·PiNet 등)에 올린다면 같은 계약을 그대로 옮기면 됩니다.
프론트엔드를 다른 도메인에 두었다면 `pi-adapter.js`의 `CONFIG.apiBase`에 승인 서버 주소를 넣고 CORS를 허용하세요.
(같은 도메인에 두는 구성이 가장 간단합니다.)

### 3.4 해커톤 관점의 Pi 활용 포인트
- **Pi 로그인 = 기도 기록의 연속성**: 기기 없이도 내 루틴이 이어집니다.
- **감사 봉헌(1 π 등)**: 감사의 크기를 작은 금액으로 표현하고, 내역을 투명하게 남깁니다. 향후 성당·자선단체로 확장.
- **글로벌 묵주기도 연대**: 전 세계 파이오니어가 같은 시각에 같은 신비를 기도하는 경험 → 매일 재방문 이유.
- **왜 Pi여야 하는가**: 국경 없는 결제 + 이미 형성된 글로벌 공동체(파이오니어) + 낮은 수수료로 소액 봉헌이 가능.

---

## 4. 데이터와 개인정보

- 모든 기록(감정, 루틴, 코치 대화, 봉헌 내역)은 **브라우저 localStorage**(키 `soulsync.v1`)에만 저장됩니다.
- 서버로 전송되는 개인정보는 없습니다. Pi 로그인 시 Pi SDK가 반환하는 `username`만 화면에 표시합니다.
- 앱 안의 `내 기록 초기화`로 언제든 전부 삭제할 수 있습니다.
- 공개 개인정보처리방침(한국어·영어): <https://zaezal74-sketch.github.io/privacy.html> — 앱 하단의 `개인정보처리방침` 링크로도 열립니다.
- 배포: 앱은 `zaezal74-sketch/zaezal74-sketch.github.io` 저장소(사용자 페이지) 루트에 올라가 `https://zaezal74-sketch.github.io/` 로 열립니다. 소스 저장소 `zaezal74-sketch/soulsync` 와 같은 커밋을 유지합니다(하위 경로 `https://zaezal74-sketch.github.io/soulsync/` 도 계속 열립니다).
- 프로토타입 단계에서는 실제 결제·정산이 발생하지 않습니다(데모 모드 명시).

---

## 5. 파일 구조

```
projects/soulsync/
├── index.html          # 4개 화면 + 1분 기도 시트 + 하단 탭
├── privacy.html        # 공개 개인정보처리방침 (한국어·영어, 자체 완결 페이지)
├── assets/             # 앱 아이콘·로고 (icon-1024 · icon-192 · favicon · logo) + 홈 히어로 사진(hero-dawn.webp, 1150×920)
├── styles.css          # 모바일 430px 프레임, 데스크톱 폰 프레임, 집중 모드(다크)
├── app.js              # 렌더링·이벤트·localStorage·묵주 세션·음성/차임
├── audio/ko-male/      # 녹음된 한국어 남성 기도 음성 54개(mp3): 기도 6 · 신비 묵상 20 · 1분 기도 28
├── audio/ko-female/    # 녹음된 한국어 여성 기도 음성 54개(mp3): 같은 54개 문장, 같은 파일 이름
├── tools/              # 음성 재생성 스크립트(export-voices.js → make-voice-audio.py)
├── data.js             # KR/EN UI 문구, 기도문, 신비, 성경 구절, 코치 테마
├── rosary.js           # 묵주기도 진행 엔진(순수 로직, Node로 단위 테스트 가능)
├── coach.js            # 키워드 기반 코치 엔진(추후 LLM으로 교체 가능한 응답 형태)
├── pi-adapter.js       # Pi Browser / 데모 모드 어댑터
├── api/pi/             # Vercel 결제 승인 서버 (approve·complete·incomplete)
├── tests/smoke.test.js # jsdom 기반 스모크 테스트 (선택)
├── tests/pi-browser.test.js # Pi Browser + 정적 호스팅 폴백 시나리오 테스트 (선택)
├── tests/api-pi.test.js # api/pi 핸들러 단위 테스트(가짜 req/res·fetch, 선택)
├── README.md
└── SUBMISSION_EN.md    # Pi Next 제출용 영문 소개 + 개인정보처리방침 초안
```

---

## 6. 검증 결과 (2026-11-22 기준)

```bash
for f in data.js rosary.js coach.js pi-adapter.js app.js; do node --check "$f"; done   # 문법 검사
node tests/smoke.test.js                                                               # 61개 항목 통과
node tests/pi-browser.test.js                                                          # Pi Browser 4개 시나리오 9개 항목 통과
```

- `node --check`: 5개 JS 파일 모두 통과
- `tests/pi-browser.test.js`: Pi Browser 스텁 + 네트워크 스텁으로 ① 정적 호스팅(405)에서 결제창 없이 데모 기록 ② 승인 서버가 있으면 실제 `createPayment` 경로 ③ `Pi.authenticate` 거부 시 데모 파이오니어 폴백 ④ 네트워크 실패 시 데모 — 를 확인
- HTML 구조 검사: 미닫힘 태그 0, 중복 id 0 (72개 id)
- CSS: 중괄호 균형 통과, 외부 폰트·CDN 의존 없음(오프라인 동작)
- 스모크 테스트 61개 통과 항목: 묵주 엔진(기도 순서·10알·5단·진행 표시), 코치 분류(지침/불안/감사/외로움/가족/미분류),
  홈 렌더링(감정 6종·루틴 3개·말씀), 1단 기록·연속 달성 표시, 집중 모드 토글, 신비 전환,
  KR↔EN 전환(기도문·동적 문구 포함), 코치 응답 렌더링·번역, 가족 칩 응답(민수기 축복·환희의 신비), Pi 데모 로그인·3.14 π 봉헌 기록,
  1분 기도 완료 기록, 마음별 1분 기도 4단계(6종 × KR/EN)와 시트의 감정 연동,
  음성 성별·속도 선택과 저장, 한국어 남성·여성 기도=각 성별 녹음 파일 선택 및 재생 속도(0.95/1.08/1.25), 정지 시 녹음 중단,
  영어는 녹음 대신 기기 음성, 기도 6 · 신비 묵상 20 · 1분 기도 28개 녹음 파일이 남성·여성 두 세트 모두 존재·크기(>5KB),
  모바일 레이아웃 가드(코치 자체 스크롤·상단 칩 순서와 줄바꿈·시트 88dvh·`[hidden]`), 선택한 감정 칩의 강조(2px 테두리·3px 링),
  localStorage 저장/복원, 초기화

테스트는 앱 실행에 필요하지 않습니다. 돌려 보려면:

```bash
cd projects/soulsync
npm install --no-save jsdom
node tests/smoke.test.js
node tests/pi-browser.test.js
```

---

## 7. 알려진 한계와 다음 단계

| 항목 | 현재 | 다음 단계 |
| --- | --- | --- |
| AI 코치 | 기기 안에서 도는 키워드·감정 규칙 엔진 (네트워크 없음) | 서버 LLM 연결. `coach.js`의 응답 형태(공감/행동/구절/신비)를 그대로 유지 |
| Pi 결제 | 데모 시뮬레이션 / 실결제는 승인 서버 필요 | 승인·완료 서버 + 봉헌 내역 원장(공개 대시보드) |
| 연대 카운터 | 데모용 예시 숫자 + 내 기도 횟수 | 서버 집계(오늘 함께 기도한 파이오니어 수) |
| 음성 안내 | 한국어 여성·남성은 녹음 음성, 영어는 Web Speech API(기기 음성) | 영어 녹음 음성과 여러 속도의 프리미엄 음성 팩 |
| 데이터 | localStorage | Pi 계정 기반 동기화, 성당/본당 연동 |
| 다국어 | KR / EN | 스페인어·포르투갈어·필리핀어 등 가톨릭 신자가 많은 지역으로 확장 |
| 2단계 | — | 개인화 통계, 성경/교리 해설, 기도 요청 커뮤니티 |

---

## 8. 만든 사람

재잘베니 — 기획 및 방향 · Pi Next Hackathon 2027
문의: 이 프로토타입을 전달받은 담당자를 통해 연락 주세요.
