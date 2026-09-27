# 카카오톡 명함 카드 연결

긴 URL을 본문으로 보내는 대신, 가로형 명함 이미지와 이름·업무 소개, **명함 보기** 버튼이 있는 카카오톡 피드 메시지를 보냅니다. 받는 사람이 이미지나 버튼을 누르면 모바일 명함이 열립니다.

## 현재 준비 상태

- 공유 이미지와 카드 메시지 코드: 준비됨
- 카카오 JavaScript SDK: 공식 2.8.3 버전, SRI 무결성 확인 포함
- 카카오 JavaScript 키: 사용자 제공 키 연결됨
- 카카오 앱의 SDK 도메인·제품 링크 웹 도메인: 두 곳 모두 `https://waffle-ens.github.io` 등록 확인(2026-09-27)
- 공개 사이트의 SDK 초기화·공유 이미지·카카오톡 버튼: 확인됨
- 실제 카카오톡 수신 확인: 계정 연결 후 사용자 확인 필요

키 연결 전에는 작동하지 않는 카카오톡 버튼을 노출하지 않습니다. 일반 링크 공유는 계속 사용할 수 있습니다.

## 처음 한 번 설정

1. [카카오디벨로퍼스](https://developers.kakao.com/console/app)에 로그인하고 `JARVIS` 앱을 만들거나 기존 앱을 선택합니다.
2. **앱 → 플랫폼 키 → JavaScript 키**에서 키를 확인합니다.
3. 해당 키의 **JavaScript SDK 도메인**에 `https://waffle-ens.github.io`를 등록합니다.
4. **앱 → 제품 링크 관리 → 웹 도메인**에도 `https://waffle-ens.github.io`를 등록합니다. 두 도메인 설정은 별개입니다.
5. `site-config.js`의 빈 `kakaoJavaScriptKey` 값에 **JavaScript 키**를 넣습니다. 브라우저용 공개 키만 사용하며 어드민 키나 클라이언트 시크릿은 사용하지 않습니다.
6. 변경 사항을 GitHub의 `main` 브랜치에 반영하고 Pages 배포가 끝나면 공개 사이트에서 **명함 공유 → 카카오톡으로 명함 보내기**를 누릅니다.
7. 카카오톡 수신 대상을 직접 선택해 전송하고, 이미지·업무 소개·‘명함 보기’ 버튼을 확인합니다.

허용 도메인에는 `/jarvis-namecard/` 경로를 붙이지 않습니다. 메시지 내부의 목적지 주소에는 전체 경로를 사용합니다. 별도의 카카오 로그인 기능, 액세스 토큰, 카카오톡 메시지 발송 권한 심사는 이 공유 기능에 필요하지 않습니다.

앱을 처음 만들 때 계정 인증이나 서비스 약관 동의가 나오면 계정 소유자가 직접 완료해야 합니다. 앱 이름은 공유 메시지에 표시될 수 있으므로 실제 서비스명인 `JARVIS`를 사용합니다.

## 동작 확인

- 일반 URL 붙여넣기는 이미지가 붙는 링크 미리보기이며, 카카오톡 전용 카드 메시지와 다른 방식입니다.
- 반드시 노란색 카카오톡 버튼을 사용해야 피드 템플릿의 ‘명함 보기’ 버튼이 포함됩니다.
- SDK를 불러오지 못하면 다시 연결할 수 있으며, 링크 복사도 계속 가능합니다.
- SDK의 선택 화면이 열린 것과 실제 전송 완료는 다릅니다. 사이트는 전송 성공으로 표시하지 않습니다.
- JavaScript 키 등록만으로 도메인 등록까지 검증되지는 않습니다. 설정 후 실제 기기에서 확인합니다.

## 공식 문서

- [카카오톡 공유 JavaScript 구현](https://developers.kakao.com/docs/ko/kakaotalk-share/js-link)
- [공유 튜토리얼과 요구 사항](https://developers.kakao.com/docs/ko/tutorial/js-share)
- [앱·키·도메인 설정](https://developers.kakao.com/docs/ko/app-setting/app)
- [SDK 다운로드와 무결성 값](https://developers.kakao.com/docs/ko/javascript/download)

## 공유 이미지

`share-card.png`는 원본 명함 `namecard.png`의 브랜드와 색상을 참고해 내장 imagegen 도구로 만든 2:1 비율의 가로형 이미지입니다. 생성 프롬프트는 [docs/share-image-prompt.md](./docs/share-image-prompt.md)에 보관합니다. 원본 명함은 수정하지 않았습니다.
