/* ============================================================
 * 대통령의 무게 — 게임 콘텐츠 (정적 · AI 토큰 불필요)
 * 실제 역사 그대로가 아니라, 시대별 갈림길에서 당신의 선택으로
 * 나라가 어떻게든 변해 가는 가상 시뮬레이션입니다.
 * 이 파일 하나만 고치면 시나리오·선택지·엔딩을 모두 바꿀 수 있습니다.
 * (effects 수치는 게임 밸런스용이며 -25~25 범위입니다.)
 * ============================================================ */
const GAME_DATA = {
  "meta": {
    "title": "대통령의 무게",
    "tagline": "잿더미에서 시작해, 당신만의 나라를 세운다.",
    "intro": "1953년. 전쟁이 끝났고, 남은 건 폐허뿐. 지금부터 모든 선택은 당신의 몫이다.",
    "defaultNation": "대한민국",
    "stats": [
      {
        "key": "economy",
        "label": "경제",
        "icon": "💰",
        "color": "#f2c14e"
      },
      {
        "key": "democracy",
        "label": "민주",
        "icon": "🏛️",
        "color": "#c77dff"
      },
      {
        "key": "welfare",
        "label": "민생",
        "icon": "🌾",
        "color": "#5cd6a0"
      },
      {
        "key": "defense",
        "label": "국방",
        "icon": "🛡️",
        "color": "#ff8a5c"
      },
      {
        "key": "diplomacy",
        "label": "외교",
        "icon": "🤝",
        "color": "#4ea1ff"
      },
      {
        "key": "tech",
        "label": "기술",
        "icon": "🔬",
        "color": "#22d3ee"
      }
    ],
    "start": {
      "economy": 10,
      "democracy": 24,
      "welfare": 12,
      "defense": 28,
      "diplomacy": 20,
      "tech": 8
    },
    "eras": [
      {
        "id": "era1",
        "name": "전후 복구",
        "years": "1953",
        "tag": "잿더미 위에서",
        "primary": "#b08d57",
        "secondary": "#6b5536",
        "bg": "#15110c"
      },
      {
        "id": "era2",
        "name": "산업화",
        "years": "1960s",
        "tag": "성장의 엔진",
        "primary": "#e08a3c",
        "secondary": "#a55a1f",
        "bg": "#1a120a"
      },
      {
        "id": "era3",
        "name": "격동의 시대",
        "years": "1980s",
        "tag": "광장의 함성",
        "primary": "#e0556b",
        "secondary": "#a52f45",
        "bg": "#180d12"
      },
      {
        "id": "era4",
        "name": "정보화",
        "years": "2000s",
        "tag": "디지털의 빛",
        "primary": "#4ea1ff",
        "secondary": "#2f5fa5",
        "bg": "#0a1322"
      },
      {
        "id": "era5",
        "name": "다음 100년",
        "years": "2025~",
        "tag": "미래로",
        "primary": "#9b7dff",
        "secondary": "#5b3fb0",
        "bg": "#0d0a1f"
      }
    ],
    "realHistory": [
      {
        "era": "전후 복구",
        "line": "실제 대한민국은 원조에 기대 겨우 버틴 세계 최빈국이었습니다. 1인당 소득은 채 70달러도 되지 않았죠."
      },
      {
        "era": "산업화",
        "line": "실제로는 수출과 중화학공업에 사활을 걸어 '한강의 기적'을 이뤘지만, 그 빛 뒤엔 억눌린 자유의 그늘이 있었습니다."
      },
      {
        "era": "격동의 시대",
        "line": "실제로는 1987년 시민의 힘으로 직선제를 쟁취하고, 외환위기마저 온 국민이 금을 모아 넘어섰습니다."
      },
      {
        "era": "정보화",
        "line": "실제로는 세계 최고의 인터넷 강국이 되었고, 반도체와 한류로 세계를 놀라게 했습니다."
      },
      {
        "era": "다음 100년",
        "line": "실제 대한민국은 지금, 세계 최저 출산율과 첨단기술 패권 사이에서 다음 100년을 고민하고 있습니다."
      }
    ],
    "closing": "단 한 사람의 영웅이 만든 나라는 없습니다. 수많은 선택과 희생이 쌓여 오늘이 되었죠. 폐허에서 여기까지 — 그 길이 얼마나 어려웠는지, 이제 조금은 느껴지시나요?",
    "endings": {
      "collapse": {
        "emoji": "🏚️",
        "title": "무너진 나라",
        "verdict": "끝내 일어서지 못했다.",
        "desc": "곳간은 비고 거리엔 굶주림이 가득하다. 당신의 나라는 역사의 뒤편으로 사라져 간다."
      },
      "poor": {
        "emoji": "🌫️",
        "title": "가난의 굴레",
        "verdict": "벗어나지 못했다.",
        "desc": "무너지진 않았지만, 가난의 사슬은 끝내 끊지 못했다. 사람들은 더 나은 내일을 꿈꾸다 지쳐 간다."
      },
      "isolated": {
        "emoji": "🚧",
        "title": "고립된 섬",
        "verdict": "세계가 등을 돌렸다.",
        "desc": "스스로 문을 닫은 나라. 안은 단단할지 몰라도, 바깥세상은 당신을 잊어 간다."
      },
      "garrison": {
        "emoji": "🪖",
        "title": "거대한 병영",
        "verdict": "총칼은 강했으나, 삶은 메말랐다.",
        "desc": "군대는 막강하다. 그러나 국민은 군화 아래 숨죽이고, 곳간은 텅 비었다."
      },
      "authoritarian": {
        "emoji": "🏯",
        "title": "부유한 철권국가",
        "verdict": "잘살게 됐지만, 자유는 없다.",
        "desc": "경제는 번영한다. 대신 광장의 목소리는 사라졌고, 권력은 누구도 견제하지 못한다."
      },
      "unequal": {
        "emoji": "💔",
        "title": "두 개의 나라",
        "verdict": "성장했지만, 둘로 갈라졌다.",
        "desc": "마천루가 하늘을 찌른다. 그 그림자 아래, 다른 절반의 국민은 점점 더 가난해진다."
      },
      "developing": {
        "emoji": "🌱",
        "title": "성장하는 나라",
        "verdict": "절반의 기적, 아직 가는 길.",
        "desc": "가난은 끊었다. 그러나 진짜 선진국의 문턱은 여전히 저 앞에 있다. 다음 세대에게 숙제를 남긴다."
      },
      "balanced": {
        "emoji": "🏙️",
        "title": "단단한 선진국",
        "verdict": "마침내, 어깨를 나란히 했다.",
        "desc": "경제도 자유도 삶도 고루 단단하다. 원조를 받던 나라가, 이제 세계와 나란히 선다."
      },
      "welfare": {
        "emoji": "🕊️",
        "title": "모두의 나라",
        "verdict": "누구도 뒤처지지 않는다.",
        "desc": "가장 약한 이도 존엄하게 사는 나라. 화려함보다 따뜻함을 택한 당신의 대한민국."
      },
      "tech": {
        "emoji": "🤖",
        "title": "기술 강국",
        "verdict": "세계가 당신의 기술에 의존한다.",
        "desc": "반도체와 AI가 나라를 먹여 살린다. 작은 반도가 거대한 기술 제국이 되었다."
      },
      "leader": {
        "emoji": "🌟",
        "title": "세계를 이끄는 나라",
        "verdict": "따라가던 나라에서, 길을 여는 나라로.",
        "desc": "경제·자유·기술·외교 — 모든 면에서 세계의 기준이 된다. 누구도 가보지 못한 길을 완주했다."
      },
      "ai_super": {
        "emoji": "🚀",
        "title": "인류의 미래를 여는 나라",
        "verdict": "미국마저 넘어섰다.",
        "desc": "AI와 첨단기술로 인류를 선도하는 초강국. 한때 쓰레기통이라 불리던 땅에서, 세계가 우러러보는 미래가 피어났다."
      },
      "unified": {
        "emoji": "🤝",
        "title": "하나가 된 한반도",
        "verdict": "분단의 시대를 끝냈다.",
        "desc": "70년의 장벽이 무너졌다. 평화 위에 선 통일 강국, 당신의 이름은 역사에 새겨진다."
      }
    }
  },
  "cards": [
    {
      "era": "era1",
      "type": "decision",
      "title": "텅 빈 국고",
      "situation": "전쟁이 끝났다. 미국이 보낸 원조 자금, 어디에 먼저 쓸까?",
      "choices": [
        {
          "label": "공장을 짓는다",
          "effects": {
            "economy": 19,
            "tech": 8,
            "welfare": -6
          },
          "result": "산업의 첫 불씨가 피어오른다. 당장의 배는 곯는다."
        },
        {
          "label": "굶주린 국민부터",
          "effects": {
            "welfare": 22,
            "democracy": 5,
            "economy": -4
          },
          "result": "오늘의 배고픔이 가신다. 미래는 잠시 미룬다."
        },
        {
          "label": "군대를 키운다",
          "effects": {
            "defense": 22,
            "economy": -6,
            "democracy": -4
          },
          "result": "총칼이 늘었다. 곳간은 더 비었다."
        }
      ]
    },
    {
      "era": "era1",
      "type": "diplomacy",
      "country": "🇺🇸 미국",
      "title": "동맹의 손길",
      "situation": "“우리 편에 서라. 원조와 보호를 주겠다.”",
      "choices": [
        {
          "label": "굳게 손잡는다",
          "effects": {
            "diplomacy": 19,
            "defense": 11,
            "democracy": -2
          },
          "result": "강대국의 우산 아래 들어간다.",
          "reaction": {
            "who": "🇺🇸 미국",
            "text": "현명한 선택이오."
          }
        },
        {
          "label": "받되, 거리를 둔다",
          "effects": {
            "diplomacy": 5,
            "economy": 8
          },
          "result": "지원은 얻고 자존심도 지킨다."
        },
        {
          "label": "자주 노선을 간다",
          "effects": {
            "diplomacy": -8,
            "defense": -4,
            "democracy": 8
          },
          "result": "홀로 서기로 한다. 길은 험하다.",
          "reaction": {
            "who": "🇺🇸 미국",
            "text": "후회하게 될 거요."
          }
        }
      ]
    },
    {
      "era": "era1",
      "type": "decision",
      "title": "땅은 누구의 것인가",
      "situation": "국민 대부분이 남의 땅을 부치는 농민이다. 지주의 땅, 어떻게 할까?",
      "choices": [
        {
          "label": "농민에게 나눠준다",
          "effects": {
            "welfare": 19,
            "democracy": 11,
            "economy": -4
          },
          "result": "수백만이 제 땅의 주인이 된다."
        },
        {
          "label": "지주 체제를 지킨다",
          "effects": {
            "economy": 8,
            "democracy": -8,
            "welfare": -6
          },
          "result": "기득권은 안도하고, 민심은 식는다."
        }
      ]
    },
    {
      "era": "era1",
      "type": "decision",
      "title": "글 모르는 나라",
      "situation": "국민 절반이 제 이름도 못 쓴다. 가난한 곳간으로 무엇을 할까?",
      "choices": [
        {
          "label": "학교를 세운다",
          "effects": {
            "tech": 11,
            "welfare": 8,
            "democracy": 5,
            "economy": -4
          },
          "result": "아이들이 글을 배운다. 미래에 투자한다."
        },
        {
          "label": "당장 먹고살기부터",
          "effects": {
            "welfare": 11,
            "economy": 3,
            "tech": -2
          },
          "result": "배움은 다음으로 미룬다."
        }
      ]
    },
    {
      "era": "era2",
      "type": "decision",
      "title": "성장의 길",
      "situation": "나라를 일으킬 전략을 정한다. 무엇에 걸까?",
      "choices": [
        {
          "label": "수출로 승부한다",
          "effects": {
            "economy": 22,
            "tech": 8,
            "diplomacy": 5,
            "welfare": -4
          },
          "result": "‘메이드 인 코리아’가 세계로 나간다."
        },
        {
          "label": "내수와 농촌을 키운다",
          "effects": {
            "welfare": 16,
            "economy": 5,
            "democracy": 5
          },
          "result": "안에서부터 천천히 단단해진다."
        }
      ]
    },
    {
      "era": "era2",
      "type": "diplomacy",
      "country": "🇰🇵 북한",
      "title": "휴전선의 긴장",
      "situation": "북에서 도발이 잇따른다. 38선이 들끓는다.",
      "choices": [
        {
          "label": "강하게 맞선다",
          "effects": {
            "defense": 19,
            "diplomacy": 3,
            "welfare": -4
          },
          "result": "한 치도 물러서지 않는다."
        },
        {
          "label": "대화를 시도한다",
          "effects": {
            "diplomacy": 11,
            "democracy": 5,
            "defense": -6
          },
          "result": "위험을 무릅쓰고 손을 내민다.",
          "reaction": {
            "who": "🇰🇵 북한",
            "text": "…두고 보겠다."
          }
        },
        {
          "label": "군비에 올인한다",
          "effects": {
            "defense": 24,
            "economy": -8,
            "welfare": -6
          },
          "result": "나라 전체가 거대한 병영이 된다."
        }
      ]
    },
    {
      "era": "era2",
      "type": "decision",
      "title": "거대한 도박",
      "situation": "고속도로와 중화학공업 — 천문학적 돈이 든다. 미래를 통째로 걸까?",
      "choices": [
        {
          "label": "전부를 건다",
          "effects": {
            "economy": 24,
            "tech": 14,
            "welfare": -8,
            "democracy": -4
          },
          "result": "성공하면 도약, 실패하면 파산. 주사위는 던져졌다."
        },
        {
          "label": "안전하게 간다",
          "effects": {
            "economy": 8,
            "welfare": 5
          },
          "result": "무리하지 않는다. 큰 도약도 없다."
        }
      ]
    },
    {
      "era": "era2",
      "type": "decision",
      "title": "성장의 그늘",
      "situation": "공장은 돌아가지만 노동자는 지쳤고, 거리엔 불만이 쌓인다.",
      "choices": [
        {
          "label": "성장 위해 억누른다",
          "effects": {
            "economy": 14,
            "defense": 5,
            "democracy": -15,
            "welfare": -4
          },
          "result": "질서는 잡혔다. 대신 자유가 사라졌다.",
          "flags": [
            "authoritarian"
          ]
        },
        {
          "label": "자유를 존중한다",
          "effects": {
            "democracy": 19,
            "welfare": 8,
            "economy": -6
          },
          "result": "더디지만, 사람이 먼저인 나라로.",
          "flags": [
            "liberal"
          ]
        }
      ]
    },
    {
      "era": "era3",
      "type": "decision",
      "title": "광장의 외침",
      "situation": "거리를 시민이 가득 메웠다. “대통령을 우리 손으로!”",
      "choices": [
        {
          "label": "직선제를 받아들인다",
          "effects": {
            "democracy": 24,
            "diplomacy": 8,
            "welfare": 5
          },
          "result": "권력을 국민의 손에 돌려준다.",
          "flags": [
            "democracy"
          ]
        },
        {
          "label": "힘으로 짓누른다",
          "effects": {
            "democracy": -19,
            "defense": 5,
            "welfare": -8
          },
          "result": "광장은 피로 물들고, 세계가 등을 돌린다.",
          "flags": [
            "authoritarian"
          ]
        }
      ]
    },
    {
      "era": "era3",
      "type": "diplomacy",
      "country": "🌍 세계",
      "title": "올림픽의 유혹",
      "situation": "“올림픽을 개최하겠는가?” 막대한 비용과 영광이 함께 온다.",
      "choices": [
        {
          "label": "개최한다",
          "effects": {
            "diplomacy": 22,
            "economy": 8,
            "welfare": -6
          },
          "result": "전 세계의 눈이 우리를 향한다.",
          "reaction": {
            "who": "🌍 세계",
            "text": "놀랍군요, 저 작은 나라가!"
          }
        },
        {
          "label": "민생을 택한다",
          "effects": {
            "welfare": 14,
            "diplomacy": -4
          },
          "result": "화려함보다 국민의 삶을 택한다."
        }
      ]
    },
    {
      "era": "era3",
      "type": "diplomacy",
      "country": "🇷🇺 🇨🇳 공산권",
      "title": "얼어붙은 장벽 너머",
      "situation": "냉전이 녹는다. 소련과 중국이 문을 두드린다.",
      "choices": [
        {
          "label": "손을 잡는다",
          "effects": {
            "diplomacy": 22,
            "economy": 11
          },
          "result": "적이었던 나라와 친구가 된다."
        },
        {
          "label": "냉전을 고수한다",
          "effects": {
            "diplomacy": -6,
            "defense": 8
          },
          "result": "경계를 늦추지 않는다."
        }
      ]
    },
    {
      "era": "era3",
      "type": "decision",
      "title": "국가 부도의 밤",
      "situation": "외환이 바닥났다. 나라가 부도 직전이다.",
      "choices": [
        {
          "label": "구제금융을 받는다",
          "effects": {
            "economy": 11,
            "welfare": -13,
            "democracy": 3,
            "diplomacy": -6
          },
          "result": "혹독한 구조조정. 살아는 남는다.",
          "flags": [
            "imf"
          ]
        },
        {
          "label": "스스로 버틴다",
          "effects": {
            "economy": -15,
            "welfare": -8,
            "democracy": 5
          },
          "result": "자존심은 지키지만, 고통은 깊고 길다."
        }
      ]
    },
    {
      "era": "era4",
      "type": "decision",
      "title": "보이지 않는 고속도로",
      "situation": "인터넷이라는 새 세상이 열린다. 여기에 나라의 미래를 걸까?",
      "choices": [
        {
          "label": "초고속망에 올인",
          "effects": {
            "tech": 24,
            "economy": 14,
            "welfare": -2
          },
          "result": "전 국민이 빛의 속도로 연결된다.",
          "flags": [
            "tech"
          ]
        },
        {
          "label": "전통 산업에 집중",
          "effects": {
            "economy": 11,
            "welfare": 5,
            "tech": -2
          },
          "result": "검증된 길을 간다."
        }
      ]
    },
    {
      "era": "era4",
      "type": "diplomacy",
      "country": "🇰🇵 북한",
      "title": "햇볕이냐, 칼이냐",
      "situation": "북이 손을 내밀듯 말듯 한다. 어떻게 대할까?",
      "choices": [
        {
          "label": "포용한다 (햇볕)",
          "effects": {
            "diplomacy": 14,
            "democracy": 5,
            "defense": -6
          },
          "result": "평화의 씨앗을 뿌린다.",
          "flags": [
            "sunshine"
          ],
          "reaction": {
            "who": "🇰🇵 북한",
            "text": "…환영하오."
          }
        },
        {
          "label": "원칙으로 압박한다",
          "effects": {
            "defense": 11,
            "diplomacy": -2
          },
          "result": "한 발도 굽히지 않는다."
        }
      ]
    },
    {
      "era": "era4",
      "type": "decision",
      "title": "복지의 약속",
      "situation": "성장했지만 격차가 벌어진다. 세금을 더 걷어 나눌까?",
      "choices": [
        {
          "label": "증세하고 복지 확대",
          "effects": {
            "welfare": 22,
            "democracy": 8,
            "economy": -6
          },
          "result": "약자를 끌어안는 나라로.",
          "flags": [
            "welfare"
          ]
        },
        {
          "label": "감세하고 성장 우선",
          "effects": {
            "economy": 16,
            "welfare": -8
          },
          "result": "파이부터 키운다.",
          "flags": [
            "growth"
          ]
        }
      ]
    },
    {
      "era": "era4",
      "type": "diplomacy",
      "country": "🇺🇸 🇨🇳 미·중",
      "title": "두 거인 사이",
      "situation": "초강대국 미국과 중국이 줄을 세운다. 어디에 설까?",
      "choices": [
        {
          "label": "균형을 잡는다",
          "effects": {
            "diplomacy": 16,
            "economy": 8
          },
          "result": "줄타기로 실리를 챙긴다."
        },
        {
          "label": "미국에 확실히 선다",
          "effects": {
            "diplomacy": 11,
            "defense": 11,
            "economy": -4
          },
          "result": "동맹은 굳고, 중국은 등을 돌린다.",
          "reaction": {
            "who": "🇨🇳 중국",
            "text": "대가를 치를 것이오."
          }
        },
        {
          "label": "독자 노선을 간다",
          "effects": {
            "diplomacy": -6,
            "tech": 8
          },
          "result": "누구에게도 기대지 않는다."
        }
      ]
    },
    {
      "era": "era5",
      "type": "decision",
      "title": "사라지는 아이들",
      "situation": "아이 울음소리가 멈췄다. 세계 최저 출산율. 나라가 늙어 간다.",
      "choices": [
        {
          "label": "이민의 문을 연다",
          "effects": {
            "economy": 14,
            "diplomacy": 8,
            "tech": 3
          },
          "result": "새로운 국민을 맞이한다.",
          "flags": [
            "open"
          ]
        },
        {
          "label": "출산·돌봄에 올인",
          "effects": {
            "welfare": 19,
            "economy": -6
          },
          "result": "아이 키우기 좋은 나라로 바꾼다."
        },
        {
          "label": "흐름에 맡긴다",
          "effects": {
            "economy": -8,
            "welfare": -8
          },
          "result": "미래를 외면한다. 나라가 조용히 저문다.",
          "flags": [
            "decline"
          ]
        }
      ]
    },
    {
      "era": "era5",
      "type": "decision",
      "title": "AI 국가 총력전",
      "situation": "AI와 반도체가 세계 패권을 가른다. 나라의 운명을 건다.",
      "choices": [
        {
          "label": "국가 총력 투자",
          "effects": {
            "tech": 24,
            "economy": 16,
            "welfare": -6
          },
          "result": "세계가 우리 기술에 의존하기 시작한다.",
          "flags": [
            "ai"
          ]
        },
        {
          "label": "균형 있게 분산한다",
          "effects": {
            "tech": 11,
            "economy": 8,
            "welfare": 5
          },
          "result": "안정적으로 한 걸음씩 나아간다."
        }
      ]
    },
    {
      "era": "era5",
      "type": "diplomacy",
      "country": "🇰🇵 한반도",
      "title": "마지막 장벽",
      "situation": "통일의 문이 열릴지도 모른다. 결단의 시간이다.",
      "choices": [
        {
          "label": "평화·통일을 추진한다",
          "effects": {
            "diplomacy": 16,
            "economy": 11,
            "welfare": 5,
            "defense": -4
          },
          "result": "한반도에 봄이 올까.",
          "flags": [
            "unify"
          ],
          "reaction": {
            "who": "🌍 세계",
            "text": "역사적인 순간이군요."
          }
        },
        {
          "label": "안정을 지킨다",
          "effects": {
            "defense": 11,
            "diplomacy": 3
          },
          "result": "위험을 떠안지 않는다."
        }
      ]
    },
    {
      "era": "era5",
      "type": "decision",
      "title": "다음 세대의 에너지",
      "situation": "기후 위기와 폭증하는 전력 수요. 어떤 길로 갈까?",
      "choices": [
        {
          "label": "원전을 늘린다",
          "effects": {
            "economy": 14,
            "tech": 8,
            "welfare": -4
          },
          "result": "값싼 전력으로 산업을 돌린다."
        },
        {
          "label": "재생에너지로 전환",
          "effects": {
            "tech": 11,
            "welfare": 8,
            "diplomacy": 8,
            "economy": -4
          },
          "result": "깨끗한 미래에 투자한다.",
          "flags": [
            "green"
          ]
        },
        {
          "label": "성장을 최우선으로",
          "effects": {
            "economy": 16,
            "welfare": -8,
            "diplomacy": -6
          },
          "result": "환경은 일단 뒤로 미룬다."
        }
      ]
    }
  ]
};
