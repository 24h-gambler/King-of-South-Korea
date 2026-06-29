# 대통령의 무게 — 대한민국 현대사 시뮬레이션 🇰🇷

> 1953년, 전쟁이 막 끝난 잿더미 위에서 한 나라의 운명을 짊어집니다.
> 당신의 선택이 대한민국의 70년을 다시 씁니다.

**클릭만으로 진행하는 무료 웹 시뮬레이션 게임입니다.** 서버도, AI 토큰도, 결제도 필요 없습니다. 정적 파일(HTML·CSS·JS)만으로 동작하므로 어디서든 무료로 호스팅할 수 있습니다.

---

## 🎮 무엇을 하는 게임인가요?

플레이어는 **대한민국 대통령**이 되어, 6·25 전쟁 이후 현대사의 굵직한 갈림길마다 결정을 내립니다.

- **전후 복구기(1953–1960)** — 폐허 위의 원조 자금, 어디에 먼저 쓸 것인가
- **개발 독재기(1961–1979)** — 성장이냐, 자유냐. 경부고속도로·새마을운동의 시대
- **민주화와 성장기(1980–1997)** — 직선제 수용, 올림픽, 그리고 외환위기(IMF)
- **현대 도약기(1998–2016)** — IT 혁명, 대북 관계, 복지와 증세
- **현재와 미래(2017–2030+)** — 저출산, 첨단산업 패권, 미·중 사이의 균형

각 결정은 **5개의 국가 지표**(경제·민주주의·민생·안보·국제위상)를 변화시키고, **국민과 국제사회가 반응**합니다. 누적된 선택의 합이 결말을 만듭니다. 후진국이 될 수도, 세계를 선도하는 나라가 될 수도 있습니다.

마지막에는 당신이 만든 대한민국과 **실제 대한민국의 궤적**을 나란히 놓고, 이 나라가 여기까지 온 것이 얼마나 비현실적으로 어려운 일이었는지를 되새깁니다.

---

## 🚀 바로 실행하기

별도 설치가 필요 없습니다.

```bash
# 방법 1: 그냥 index.html 을 브라우저로 엽니다
# 방법 2: 간단한 로컬 서버 (권장)
python3 -m http.server 8000
# → http://localhost:8000 접속
```

## 🌐 무료 배포

정적 사이트이므로 아래 어디서든 **무료**로 운영할 수 있습니다.

### GitHub Pages (가장 간단)
1. 저장소 **Settings → Pages**
2. **Source: Deploy from a branch** 선택
3. 브랜치와 `/ (root)` 폴더 지정 후 저장
4. 잠시 뒤 `https://<사용자>.github.io/<저장소>/` 에서 공개됩니다

이 저장소에는 GitHub Pages 자동 배포용 워크플로(`.github/workflows/pages.yml`)도 포함되어 있어, **Settings → Pages → Source: GitHub Actions** 로 설정하면 푸시할 때마다 자동 배포됩니다.

### 그 밖에
- **Vercel / Netlify / Cloudflare Pages** — 저장소를 연결만 하면 됩니다 (빌드 명령 없음, 출력 디렉터리 = 루트)

---

## 🗂️ 구조

```
index.html        # 화면 골격 + 폰트/스타일 연결
css/style.css     # 디자인 시스템 (시대별 색 테마, HUD, 카드, 엔딩)
js/data.js        # 게임 콘텐츠(시대·시나리오·엔딩) — 정적 데이터
js/game.js        # 게임 엔진 (상태/렌더링/점수/애니메이션)
```

### 콘텐츠를 바꾸고 싶다면
`js/data.js` 한 파일만 편집하면 됩니다. 시나리오 추가, 선택지 효과 조정, 엔딩 문구 수정 등 모든 텍스트가 이 안에 있습니다. 코드를 건드릴 필요가 없습니다.

데이터 구조:
```js
const GAME_DATA = {
  meta: { title, subtitle, tagline, introNarration, howToPlay, stats, eraThemes, endings, closingMessage, realHistoryNote },
  eras: [{ eraId, eraName, yearRange, subtitle, intro, scenarios: [
    { id, year, title, situation, history, choices: [
      { label, detail, effects:{economy,democracy,livelihood,security,standing}, outcome, citizenReaction, foreignReaction, headline, flags }
    ]}
  ]}]
};
```

---

## 📌 참고

본 게임의 시나리오는 **실존 사건을 모티브로 한 가상의 시뮬레이션**입니다. 교육·체험을 목적으로 하며, 특정 정파나 인물을 지지·비판하지 않습니다. 역사적 사실은 각 시나리오의 "📜 실제 역사" 메모로 함께 제공됩니다.

기술: 순수 HTML/CSS/JavaScript · 외부 의존성 없음 · 빌드 단계 없음
