/* 임시 스모크 테스트용 데이터 — 워크플로 콘텐츠로 교체 예정 */
const GAME_DATA = {
  meta: {
    title: "대통령의 무게",
    subtitle: "대한민국 현대사 시뮬레이션",
    tagline: "당신의 선택이 나라의 운명을 만듭니다.",
    introNarration: "1953년, 전쟁이 막 끝났다. 당신은 폐허 위에 선 대한민국의 대통령이다.",
    howToPlay: ["선택지를 클릭해 결정한다", "지표가 변한다", "결말은 선택의 합이다"],
    stats: [
      { key: "economy", label: "경제력", icon: "📈", description: "산업·소득" },
      { key: "democracy", label: "민주주의", icon: "🕊️", description: "자유·인권" },
      { key: "livelihood", label: "민생", icon: "🍚", description: "삶과 행복" },
      { key: "security", label: "안보", icon: "🛡️", description: "국방" },
      { key: "standing", label: "국제위상", icon: "🌏", description: "세계 속 위상" }
    ],
    eraThemes: [
      { eraId: "era1", primary: "#b08d57", secondary: "#6b5536", bg: "#15110c", mood: "잿빛 폐허" },
      { eraId: "era2", primary: "#e08a3c", secondary: "#a55a1f", bg: "#1a120a", mood: "산업화의 열기" },
      { eraId: "era3", primary: "#e0556b", secondary: "#a52f45", bg: "#180d12", mood: "격동" },
      { eraId: "era4", primary: "#4ea1ff", secondary: "#2f5fa5", bg: "#0c1320", mood: "디지털의 빛" },
      { eraId: "era5", primary: "#5cd6b0", secondary: "#2f8a6f", bg: "#0c1a16", mood: "미래" }
    ],
    endings: [
      { tier: "위기의 나라", title: "흔들리는 토대", minScore: 0, verdict: "갈 길이 멀다.", narrative: "시험대.", reflection: "쉽지 않다." },
      { tier: "개발도상국", title: "느린 전진", minScore: 30, verdict: "전진했다.", narrative: "조금씩.", reflection: "노력은 계속된다." },
      { tier: "중진국", title: "도약의 문턱", minScore: 50, verdict: "성장했다.", narrative: "문턱에 섰다.", reflection: "균형이 중요하다." },
      { tier: "선진국", title: "선진국 대한민국", minScore: 70, verdict: "선진국이 되었다.", narrative: "세계가 주목한다.", reflection: "값진 성취다." },
      { tier: "선도국", title: "세계를 이끄는 나라", minScore: 88, verdict: "세계를 선도한다.", narrative: "정점에 섰다.", reflection: "기적이다." }
    ],
    closingMessage: "폐허에서 여기까지. 그 길은 결코 쉽지 않았다.\n무수한 선택과 희생이 오늘의 대한민국을 만들었다.",
    realHistoryNote: "1953년 1인당 국민소득 약 67달러의 최빈국이었던 대한민국은 원조를 받던 나라에서 주는 나라가 되었다."
  },
  eras: [
    {
      eraId: "era1", eraName: "전후 복구기", yearRange: "1953–1960",
      subtitle: "폐허에서", intro: "전쟁이 끝났다. 모든 것이 무너졌다. 당신은 시작해야 한다.",
      scenarios: [
        {
          id: "era1-1", year: "1953", title: "원조 자금을 어디에 쓸 것인가",
          situation: "당신 앞에 미국의 원조 자금이 놓였다. 군대도, 공장도, 굶주린 국민도 모두 이 돈을 기다린다.",
          history: "전후 한국은 미국 원조에 절대적으로 의존했다.",
          choices: [
            { label: "산업 재건에 투자한다", detail: "미래의 공장을 짓는다.", effects: { economy: 12, democracy: 0, livelihood: -4, security: -2, standing: 3 }, outcome: "공장이 들어서기 시작한다.", citizenReaction: "당장은 배고프다며 불평한다.", foreignReaction: "미국은 자립 의지를 환영한다.", headline: "재건의 첫 삽", flags: ["growth"] },
            { label: "식량과 민생에 쓴다", detail: "오늘의 굶주림을 먼저 해결한다.", effects: { economy: -3, democracy: 2, livelihood: 14, security: 0, standing: 0 }, outcome: "굶주림이 잦아든다.", citizenReaction: "국민이 안도한다.", foreignReaction: "인도적 조치라 평가한다.", headline: "배고픔을 먼저" }
          ]
        }
      ]
    }
  ]
};
