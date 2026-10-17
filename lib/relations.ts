// 정령들의 첫인상 관계도. 각 오너가 그린 관계도 그림을 옮긴 것.
// from/to 는 lib/spirits.ts 의 id, "tree" 는 세계수.
// 오유, 이든의 관계도는 아직 받지 못했다.
export type Kind = "couple" | "crush" | "bff" | "friend" | "hate";

export const KINDS: Record<Kind, { label: string; color: string }> = {
  couple: { label: "커플", color: "#ff2f6d" },
  crush: { label: "짝사랑", color: "#ff9cc4" },
  bff: { label: "베프", color: "#3fe05a" },
  friend: { label: "친구", color: "#ffd21f" },
  hate: { label: "죽어", color: "#8d8d8d" },
};

export type Relation = {
  to: string;
  // 두 가지가 섞인 관계(선이 두 색인 경우)는 둘 다 적는다
  kinds: Kind[];
  // 선 위에 따로 적힌 짧은 말(신뢰, 호감, 무서움 등)
  tag?: string;
  text: string;
};

export type Chart = {
  from: string;
  // 그림 한쪽에 적힌 혼잣말
  note?: string;
  relations: Relation[];
};

export const PENDING = ["oyu", "iden"];

export const CHARTS: Chart[] = [
  {
    from: "magenta",
    relations: [
      { to: "iden", kinds: ["couple"], text: "♥" },
      { to: "oyu", kinds: ["bff"], text: "유일한 정상인(?)" },
      { to: "ire", kinds: ["bff"], text: "좋은 수리공" },
      { to: "gungun", kinds: ["bff"], text: "소동물" },
      { to: "cyan", kinds: ["friend"], text: "화이팅" },
      { to: "welsiet", kinds: ["friend"], text: "금쪽이" },
      { to: "jamo", kinds: ["friend"], text: "금쪽이2" },
      { to: "i", kinds: ["friend"], text: "좋은 판매러" },
      { to: "innocent", kinds: ["friend"], text: "요주의 인물" },
    ],
  },
  {
    from: "ire",
    relations: [
      { to: "tree", kinds: ["crush"], text: "사실 사랑이라기보단 싫어할 때도 있었고, 그냥 어떤 특별한 존재임" },
      { to: "i", kinds: ["bff"], text: "그닥 관심은 없었는데 필요한 걸 만들어준다는 점에서 굉장히 친하게 지내고 싶음. 이것저것 먹을 것도 사줄 수 있음" },
      { to: "oyu", kinds: ["friend"], text: "그나마 예의가 바름" },
      { to: "iden", kinds: ["friend"], text: "시도 때도 없이 욕하는 ㅁㅊ새끼. 그래도 싫진 않음" },
      { to: "magenta", kinds: ["friend"], text: "부자에 깔끔한 여자애. 까칠해 보여서 그닥 가까이하고 싶어 하진 않음" },
      { to: "gungun", kinds: ["friend"], text: "소심한 자식. 불쌍히 여김" },
      { to: "cyan", kinds: ["friend"], text: "이새끼 뭐지. 중2병이 너무 심해서 가까이하고 싶지 않음. 하지만 뭔가 부탁하면 들어줄 수 있음" },
      { to: "jamo", kinds: ["friend"], text: "자꾸만 자몽을 처먹으라고 함. 귀찮음. 하지만 분위기 메이커라고 생각함" },
      { to: "innocent", kinds: ["friend"], text: "집에 자주 없어서 말은 안 걸지만 대화해 보니 정상인이어서 나쁘진 않음. 부탁을 들어줄 수 있는 호감도" },
      { to: "welsiet", kinds: ["hate"], text: "내가 아끼는 세계수의 껍질을 자꾸 뜯어먹음. 같은 정령인지 의심됨" },
    ],
  },
  {
    from: "jamo",
    relations: [
      { to: "cyan", kinds: ["bff"], text: "웰시엣의 보호자, 철 안 든 애기" },
      { to: "welsiet", kinds: ["bff"], text: "자몽 먹는 이상한 놈" },
      { to: "oyu", kinds: ["friend"], text: "유일하게 착한 애" },
      { to: "ire", kinds: ["friend"], text: "편하다(쌍방X). 자몽을 은근 좋아하나 봐!(아님)" },
      { to: "iden", kinds: ["friend"], text: "인성 레전드 애기" },
      { to: "magenta", kinds: ["friend"], text: "농장 사줘!" },
      { to: "gungun", kinds: ["friend"], text: "나 왜 피해? 자몽 먹어" },
      { to: "i", kinds: ["friend"], text: "왜? 궁금" },
      { to: "innocent", kinds: ["friend"], text: "?뭐지. 몰라 비누" },
    ],
  },
  {
    from: "cyan",
    relations: [
      { to: "welsiet", kinds: ["couple"], text: "이상한 짓 많이 하지만 좋아. 기댈 수 있어서. 항상 너 옆에 있을게" },
      { to: "jamo", kinds: ["bff"], text: "자모는 좋은데 자몽 그만 줘라 나 안 먹는다 ㅠㅠ" },
      { to: "oyu", kinds: ["friend"], text: "유일하게 정상…" },
      { to: "ire", kinds: ["friend"], text: "세계수 집착 사랑광 새끼. 뭔가 이상하긴 한데 물건 고치기 맛집임" },
      { to: "magenta", kinds: ["friend"], text: "오.. 부잣집 분위기.. 오… 오… 오…" },
      { to: "gungun", kinds: ["friend"], text: "나 피하지 마 너랑 놀고 싶음…" },
      { to: "i", kinds: ["friend"], text: "오.. 오.. 물건 만들기 맛집!!!" },
      { to: "innocent", kinds: ["friend"], text: "선생님 같은? 같이 있으면 뭔가 편해" },
      { to: "iden", kinds: ["hate", "friend"], text: "가오 부리는 거 보면 싸움 걸고 싶은데 요리 잘해서 봐줌. 얘 밥 짱맛임ㄷㄷ" },
    ],
  },
  {
    from: "welsiet",
    relations: [
      { to: "cyan", kinds: ["couple"], text: "💩" },
      { to: "jamo", kinds: ["bff"], text: "자몽 먹어" },
      { to: "magenta", kinds: ["friend", "bff"], text: "이쁜 언니 좋아. 친해지고 싶어" },
      { to: "oyu", kinds: ["friend"], text: "신부님~ 좋아함" },
      { to: "iden", kinds: ["friend"], text: "시안이랑 싸우는 거 구경 재밌다" },
      { to: "gungun", kinds: ["friend"], text: "놀리고 반응 보기 존잼" },
      { to: "innocent", kinds: ["friend"], text: "축제 같이 가용" },
      { to: "i", kinds: ["friend"], text: "훌륭한 (똥) 물품 공급원." },
      { to: "ire", kinds: ["hate"], text: "세계수랑 결혼이나 하시지" },
    ],
  },
  {
    from: "i",
    relations: [
      { to: "ire", kinds: ["bff"], text: "가끔 먹을 걸 사줘! 고장 난 게 있으면 고쳐주고 좋은 정령이라고 생각해~ 늘 세계수에 있더라~ 혹시.. 좋아하는 걸까나?" },
      { to: "oyu", kinds: ["friend"], text: "끈기가 엄청난 것 같아~ 그 성경…이었나~ 그걸 외운 것도 대단하더라~ 늘 성당에 있는 것 같아. 다른 의미로 바쁜 걸까나~" },
      { to: "iden", kinds: ["friend"], text: "조금 까칠하긴 하지만 자기 애인을 누구보다 정말 잘 챙겨준다고 생각해~ 뭐랄까~ 표현이 서툰 정령이라고 하면 이해가 될려나~" },
      { to: "magenta", kinds: ["friend"], text: "돈이 많아서 제일 부러운 정령. 가끔 예민한 것 같지만 상관은 없어~ 나도 언젠간 저렇게 돈을 모아보고 싶네~" },
      { to: "gungun", kinds: ["friend"], text: "늘 불안해하는 정령~ 아마 여기서 가장 정상 아닐까~? 늘 어딘가에 숨어 있던 것 같아~ 언젠간 자신감을 가지면 좋겠어~" },
      { to: "cyan", kinds: ["friend"], text: "뭔가 되게 어려 보여~ 동굴에서 처음 봤었는데 강령술 하는 줄 알고 좀 무서웠단 말이지~ 웰시엣이랑 자주 붙어 다니는 것 같아~" },
      { to: "welsiet", kinds: ["friend"], text: "여기서 제일 어렸던가~? 가끔 더러운 이야기를 하긴 하지만.. 그래도 좋은 정령이라고 생각해~ 가끔은 방을 치워주고 싶단 말이지~" },
      { to: "jamo", kinds: ["friend"], text: "자몽을 정말 좋아하는 정령~ 가끔은 억지로 먹여지기도 하지만.. 누구보다 활발해서 좋아~ 먹다 보니 맛있는 것 같기도.." },
      { to: "innocent", kinds: ["friend"], text: "자주는 안 보이는 것 같지만 좋은 애 같아~ 나도 바빠서 잘 못 보는 것도 있지만" },
    ],
  },
  {
    from: "gungun",
    note: "모두와 더욱 친하게 지내고 싶어요…",
    relations: [
      { to: "oyu", kinds: ["bff"], tag: "신뢰", text: "곁에 있으면 안심이 돼요. 상냥하신 분!" },
      { to: "ire", kinds: ["friend"], tag: "호감", text: "세계수를 열심히 관리해 주시고 항상 믿음직해요." },
      { to: "innocent", kinds: ["friend"], tag: "호감", text: "모두를 아끼시는 좋은 분 같아요! 곁에 가면 좋은 향기가 나요." },
      { to: "i", kinds: ["friend"], tag: "호감!", text: "구멍? 주머니?.. 에서 칼을 꺼내주셔서 좋아요. 항상 웃고 계셔서 안심이 돼요." },
      { to: "magenta", kinds: ["friend"], tag: "호감 · 무서움", text: "상냥하시지만.. 가끔 무서우실 때가 있어요.." },
      { to: "cyan", kinds: ["friend"], tag: "호감 + 무서움", text: "흑염룡과 악마를 좋아하시는 분… 평소엔 밝으시지만 안대를 벗으시면 약간 무섭습니다…" },
      { to: "iden", kinds: ["friend"], tag: "무서움", text: "왠지 저를 싫어하시는 것 같아요.. (무서워요)" },
      { to: "welsiet", kinds: ["friend"], tag: "무서움", text: "엄청나게 활발하셔요. 웰시엣 씨 방에 들어갈 땐 항상 각오를 해야 해요…. 그리고 세계수 껍질은… 안 드시는 게… 좋을 듯해요.. ㅠ" },
      { to: "jamo", kinds: ["friend"], tag: "무서움 ㅠㅠ", text: "자꾸.. 자몽을 먹으라고 하셔요.. 좋으신 분 같긴 한데.. 아직 무서워요 ㅠㅠ" },
    ],
  },
  {
    from: "innocent",
    note: "오늘도 고마워. 내일도 함께하자.",
    relations: [
      { to: "oyu", kinds: ["friend"], text: "온화해. 언젠가 봤던 홍매화 같아. 벌들이 널 많이 아끼는 듯해." },
      { to: "ire", kinds: ["friend"], text: "세계수를 정말 아끼는 게 보여. 믿음직스러워, 무궁화 같아." },
      { to: "iden", kinds: ["friend"], text: "맛있는 걸 좋아하고, 자주 시안이랑도 싸우고.. 그치만 알고 보면 속이 깊은 것 같아. 마젠타랑 서로 아껴주는 모습이 보기 좋아" },
      { to: "magenta", kinds: ["friend"], text: "고고한 분위기가 주위를 매료시켜. 왠지 너의 말에는 따르도록 하는 힘이 실려 있어. 마치 분홍색 장미 같은 정령이야." },
      { to: "gungun", kinds: ["friend"], text: "앞으로도 천천히 다가갈게. 언젠간 너가 날 어려워하지 않는 날이 올 테니까. 라벤더 필래?" },
      { to: "cyan", kinds: ["friend"], text: "가끔 이든과 다투는데, 또 금방 푸는 것 같아. 웰시엣과도 사이가 정말 좋아 보여. 주변인들을 아끼는 게 보여." },
      { to: "welsiet", kinds: ["friend"], text: "항상 밝아서 덩달아 기분이 좋아질 때가 많아. 데이지 같아." },
      { to: "jamo", kinds: ["friend"], text: "나 자몽 좋아해! 아니, 나도 먹을 수 있는데?!… 비누치고 이상한 거 알지만!!" },
      { to: "i", kinds: ["friend"], text: "감초 같은 존재. 얕게도, 깊게도 우리에게 많은 도움을 줘서 항상 고마워. 꼭 백련을 보는 것 같아." },
    ],
  },
];
