/**
 * RIVEA 설문 v2 — 응답 읽기 API (Google Apps Script)
 *
 * 목적
 *   설문 응답을 JSON으로 내보내서, 로컬에서 바로 당겨 분석할 수 있게 합니다.
 *   연락처·이름 문항은 서버(여기)에서 잘라내고 내보냅니다. 밖으로 안 나갑니다.
 *
 * 쓰는 법
 *   1. 설문지 편집 화면 → 우상단 ⋮ → 「스크립트 편집기」
 *      (또는 script.google.com → 새 프로젝트 → 아래 FORM_ID 를 폼 주소에서 복사해 채우기)
 *   2. 이 파일 전체를 붙여넣기
 *   3. TOKEN 을 아무도 모를 긴 문자열로 바꾸기 (아래 안내 참고)
 *   4. 우상단 「배포」 → 「새 배포」 → 유형 ⚙ → 「웹 앱」
 *        - 실행 계정: 나
 *        - 액세스 권한: 「모든 사용자」   ← 토큰이 자물쇠 역할을 합니다
 *   5. 나오는 웹 앱 URL 을 복사 → 프로젝트 루트 .env.local 에 아래처럼 저장
 *        SURVEY_API_URL=https://script.google.com/macros/s/AKfy.../exec
 *        SURVEY_API_TOKEN=<3번에서 정한 문자열>
 *
 * 문항을 고치거나 페이지를 늘려도 이 파일은 그대로 둬도 됩니다.
 */

// 폼 주소 https://docs.google.com/forms/d/<이 부분>/edit 에서 복사
var FORM_ID = '';

// 아무도 못 맞출 긴 문자열로 바꾸세요. 예: 터미널에서
//   openssl rand -hex 24
var TOKEN = 'CHANGE-ME';

// 이 낱말이 문항 제목에 들어가면 답변을 내보내지 않습니다.
var 개인정보_낱말 = ['연락처', '전화', '휴대폰', '번호', '이름', '성함', '이메일', '메일'];

function 개인정보인가(제목) {
  for (var i = 0; i < 개인정보_낱말.length; i++) {
    if (제목.indexOf(개인정보_낱말[i]) !== -1) return true;
  }
  return false;
}

function doGet(e) {
  var 준 = (e && e.parameter && e.parameter.token) || '';
  if (준 !== TOKEN || TOKEN === 'CHANGE-ME') {
    return ContentService
      .createTextOutput(JSON.stringify({ error: 'unauthorized' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var form = FORM_ID ? FormApp.openById(FORM_ID) : FormApp.getActiveForm();
  var 응답들 = form.getResponses();

  // ?since=2026-08-18T00:00:00Z 를 붙이면 그 뒤 응답만 받습니다.
  var since = (e.parameter.since && new Date(e.parameter.since)) || null;

  var 결과 = [];
  for (var i = 0; i < 응답들.length; i++) {
    var r = 응답들[i];
    var 낸시각 = r.getTimestamp();
    if (since && 낸시각 <= since) continue;

    var 답 = {};
    var items = r.getItemResponses();
    for (var j = 0; j < items.length; j++) {
      var 제목 = items[j].getItem().getTitle();
      if (개인정보인가(제목)) continue;
      답[제목] = items[j].getResponse();
    }
    결과.push({
      id: r.getId(),
      낸시각: Utilities.formatDate(낸시각, 'Asia/Seoul', "yyyy-MM-dd'T'HH:mm:ss"),
      답: 답
    });
  }

  return ContentService
    .createTextOutput(JSON.stringify({
      제목: form.getTitle(),
      전체응답수: 응답들.length,
      담긴응답수: 결과.length,
      응답: 결과
    }, null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}
