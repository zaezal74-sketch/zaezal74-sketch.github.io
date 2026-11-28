/* =========================================================================
   SoulSync — data.js
   All user-facing copy in Korean + English lives here so the two languages
   can never drift apart. Loaded as a classic script (no build step), and also
   exported for Node-based checks.
   ========================================================================= */
(function (root) {
  "use strict";

  /* ---------------------------------------------------------------- UI copy */
  var UI = {
    "brand.tagline": { ko: "신앙과 마음, 삶의 리듬", en: "Faith, heart, and the rhythm of life" },
    "brand.tagline.mind": { ko: "마음과 호흡, 하루의 리듬", en: "Mind, breath, and the rhythm of the day" },

    /* The two ways into the app. `mind` is the default: a wide, non-religious
       mind-care mode anyone — a first-time visitor, a hackathon judge, a
       Pioneer who is not Catholic — can open without explaining themselves.
       `catholic` opens the prayer life the app was first built around. */
    "mode.label": { ko: "모드 선택", en: "Choose a mode" },
    "mode.mind": { ko: "모두를 위한 마음 돌봄", en: "Mind Care" },
    "mode.mindShort": { ko: "마음 돌봄", en: "Mind Care" },
    "mode.catholic": { ko: "천주교 신자 · 묵상·묵주기도", en: "Catholic · Rosary" },
    "mode.catholicShort": { ko: "천주교 · 묵주기도", en: "Catholic · Rosary" },
    "mode.switchedMind": { ko: "마음 돌봄 모드로 열었어요", en: "Mind Care mode" },
    "mode.switchedCatholic": { ko: "천주교 · 묵상·묵주기도 모드로 열었어요", en: "Catholic · Rosary mode" },

    "nav.home": { ko: "홈", en: "Home" },
    "nav.rosary": { ko: "묵주기도", en: "Rosary" },
    "nav.meditation": { ko: "마음 명상", en: "Meditation" },
    "nav.coach": { ko: "AI 코치", en: "AI Coach" },
    "nav.routine": { ko: "루틴·Pi", en: "Routine & Pi" },
    "nav.label": { ko: "주요 화면", en: "Main screens" },

    /* --- mind mode: home ------------------------------------------------- */
    "home.verseLabelMind": { ko: "오늘의 한 줄", en: "A line for today" },
    "home.verseTagMind": { ko: "마음챙김", en: "Mindful" },
    "home.minuteCtaMind": { ko: "1분 호흡 명상", en: "1-minute breathing" },
    "home.prayerCtaMind": { ko: "호흡 명상 시작하기", en: "Begin a breathing pause" },
    "home.rosaryCtaMind": { ko: "마음 명상으로 이어가기", en: "Continue with meditation" },
    "home.todo.breath": { ko: "1분 호흡 1회", en: "One minute of breathing" },
    "home.todo.meditation": { ko: "마음 명상 10분", en: "Ten minutes of meditation" },
    "home.todo.journal": { ko: "감사·감정 기록 1회", en: "One gratitude note" },
    "home.todo.breathMeta": { ko: "호흡", en: "breath" },
    "home.todo.meditationMeta": { ko: "명상", en: "meditation" },
    "home.todo.journalMeta": { ko: "기록", en: "note" },

    /* --- mind mode: the one-minute breathing sheet ----------------------- */
    "minute.titleMind": { ko: "1분 호흡 명상", en: "One-minute breathing" },
    "minute.startMind": { ko: "1분 시작하기", en: "Begin one minute" },
    "minute.doneTitleMind": { ko: "1분을 마쳤어요", en: "One minute, complete" },
    "minute.doneBodyMind": {
      ko: "짧아도 괜찮아요. 고른 숨 한 번이 오늘의 중심이 됩니다.",
      en: "Short is fine. One chosen breath becomes the center of the day."
    },

    /* --- mind mode: the meditation screen -------------------------------- */
    "med.title": { ko: "마음 명상", en: "Meditation" },
    "med.sub": { ko: "호흡에 머물고, 마음으로 돌아오는 시간", en: "Rest in your breath, return to your heart" },
    "med.topicLabel": { ko: "무엇에 머물까요", en: "What shall we rest on" },
    "med.topic.breath": { ko: "호흡", en: "Breath" },
    "med.topic.mindful": { ko: "마음챙김", en: "Mindfulness" },
    "med.topic.body": { ko: "바디스캔", en: "Body scan" },
    "med.topic.gratitude": { ko: "감사 묵상", en: "Gratitude" },
    "med.guide.breath": { ko: "숨이 들어오고 나가는 것을 알아차려요", en: "Notice the breath coming in and going out" },
    "med.guide.mindful": { ko: "떠오르는 생각을 밀어내지 말고 바라봐요", en: "Watch thoughts arrive without pushing them away" },
    "med.guide.body": { ko: "머리부터 발끝까지 천천히 살펴봐요", en: "Move slowly from head to toe" },
    "med.guide.gratitude": { ko: "지금 감사한 것 하나를 마음에 담아요", en: "Hold one thing you are grateful for" },
    "med.durationLabel": { ko: "시간", en: "Length" },
    "med.min3": { ko: "3분", en: "3 min" },
    "med.min5": { ko: "5분", en: "5 min" },
    "med.min10": { ko: "10분", en: "10 min" },
    "med.start": { ko: "시작하기", en: "Begin" },
    "med.pause": { ko: "일시정지", en: "Pause" },
    "med.resume": { ko: "이어서", en: "Resume" },
    "med.reset": { ko: "처음부터", en: "Start over" },
    "med.ready": { ko: "준비되면 시작해 보세요", en: "Begin whenever you are ready" },
    "med.hint": { ko: "눈을 감고 어깨의 힘을 빼 보세요", en: "Close your eyes and let your shoulders drop" },
    "med.cycle": { ko: "4초 들이쉬고 · 2초 멈추고 · 6초 내쉬어요", en: "In for 4 · hold for 2 · out for 6" },
    "med.inhale": { ko: "들이쉬세요", en: "Breathe in" },
    "med.hold": { ko: "잠시 멈추세요", en: "Hold" },
    "med.exhale": { ko: "내쉬세요", en: "Breathe out" },
    "med.barIn": { ko: "들이쉬기", en: "In" },
    "med.barHold": { ko: "멈추기", en: "Hold" },
    "med.barOut": { ko: "내쉬기", en: "Out" },
    "med.breathCount": { ko: "{n}번째 호흡", en: "Breath {n}" },
    "med.remaining": { ko: "{time} 남음", en: "{time} left" },
    "med.doneTitle": { ko: "명상을 마쳤어요", en: "Meditation complete" },
    "med.doneBody": { ko: "지금의 호흡과 마음을 그대로 안고 가요. 오늘의 명상이 기록됐어요.", en: "Carry this breath and this heart with you. Today's session is recorded." },
    "med.doneNote": { ko: "3분도 10분도 같은 마음이에요. 앉았다는 것만으로 충분해요.", en: "Three minutes or ten — the same heart. Sitting down was enough." },
    "med.again": { ko: "한 번 더", en: "Go again" },
    "med.routine": { ko: "루틴 보기", en: "See my routine" },
    "med.tapStart": { ko: "아래 시작하기를 누르면 호흡 안내가 함께 흘러요", en: "Press Begin and the breathing guide will lead" },

    "greet.morning": { ko: "좋은 아침이에요", en: "Good morning" },
    "greet.afternoon": { ko: "오후도 잘 보내고 계신가요?", en: "How is your afternoon going?" },
    "greet.evening": { ko: "오늘 하루도 수고 많으셨어요", en: "You did a lot today" },
    "greet.night": { ko: "늦은 시간, 마음을 가라앉히는 시간이에요", en: "Late night — a good time to let your heart settle" },
    "home.question": { ko: "지금 마음은 어떤가요?", en: "How is your heart right now?" },
    "home.messageTitle": { ko: "오늘의 한마디", en: "A word for today" },
    "home.verseLabel": { ko: "오늘의 말씀", en: "Today's Scripture" },
    "home.prayerCta": { ko: "기도 시작하기", en: "Start praying" },
    "home.minuteCta": { ko: "1분 기도", en: "1-minute prayer" },
    "home.rosaryCta": { ko: "묵주기도로 이어가기", en: "Continue with the Rosary" },
    "home.rosaryCtaShort": { ko: "묵주기도", en: "Rosary" },
    "home.todoTitle": { ko: "오늘의 작은 루틴", en: "Today's small routine" },
    "home.todo.prayer": { ko: "짧은 기도 1회", en: "One short prayer" },
    "home.todo.rosary": { ko: "묵주기도 1단", en: "One Rosary decade" },
    "home.todo.word": { ko: "말씀 1개", en: "One verse" },
    "home.todoHint": { ko: "하나만 해도 충분해요", en: "One is already enough" },
    "home.todoAllDone": { ko: "오늘의 루틴을 모두 채웠어요", en: "Today's routine is complete" },
    "home.todoProgress": { ko: "{done}/{total}", en: "{done}/{total}" },
    "home.moodPrompt": { ko: "지금 마음에 가까운 것을 눌러 주세요", en: "Tap what feels closest" },
    "home.pickMoodFirst": { ko: "먼저 마음을 골라 주세요. 그 마음에 맞춰 드릴게요.", en: "Pick your heart first — I'll follow it." },
    "home.weekVerse": { ko: "이번 주 묵상", en: "This week's reflection" },

    "mood.tired": { ko: "지침", en: "Tired" },
    "mood.anxious": { ko: "불안", en: "Anxious" },
    "mood.calm": { ko: "평온", en: "Calm" },
    "mood.grateful": { ko: "감사", en: "Grateful" },
    "mood.lonely": { ko: "외로움", en: "Lonely" },
    "mood.joyful": { ko: "기쁨", en: "Joyful" },

    "rosary.title": { ko: "묵주기도", en: "Rosary" },
    "rosary.sub": { ko: "한 단은 10알, 모두 5단이에요", en: "Ten beads a decade, five decades a rosary" },
    "rosary.recLabel": { ko: "오늘 마음에 맞춘 신비", en: "A mystery for your heart today" },
    "rosary.recReason.joyful": { ko: "기쁨과 감사의 날에 잘 어울려요.", en: "A good match for a day of joy and thanks." },
    "rosary.recReason.luminous": { ko: "평온한 일상의 결을 따라가기 좋아요.", en: "Good for following the grain of an ordinary day." },
    "rosary.recReason.sorrowful": { ko: "지친 마음을 주님의 수난에 기대어요.", en: "Let a tired heart rest against the Passion." },
    "rosary.recReason.glorious": { ko: "소망과 위로가 필요한 때에 좋아요.", en: "Good when you need hope and comfort." },
    "rosary.decade": { ko: "{n}단", en: "Decade {n}" },
    "rosary.bead": { ko: "{n}/10알", en: "Bead {n}/10" },
    "rosary.opening": { ko: "개시 기도", en: "Opening prayers" },
    "rosary.beadBtn": { ko: "한 알 바치기", en: "Pray this bead" },
    "rosary.beadBtnMed": { ko: "이 신비로 시작", en: "Begin this mystery" },
    "rosary.medTitle": { ko: "이 단의 신비", en: "The mystery of this decade" },
    "rosary.autoStart": { ko: "자동 진행", en: "Auto" },
    "rosary.autoStop": { ko: "일시정지", en: "Pause" },
    "rosary.voiceOn": { ko: "음성 켜짐", en: "Voice on" },
    "rosary.voiceOff": { ko: "음성 안내", en: "Voice" },
    "rosary.voiceGender": { ko: "목소리", en: "Voice" },
    "rosary.voiceFemale": { ko: "여성", en: "Female" },
    "rosary.voiceMale": { ko: "남성", en: "Male" },
    "rosary.voicePace": { ko: "속도", en: "Pace" },
    "rosary.paceSlow": { ko: "천천히", en: "Slow" },
    "rosary.paceNormal": { ko: "보통", en: "Normal" },
    "rosary.paceFast": { ko: "빠르게", en: "Fast" },
    "rosary.bgmOn": { ko: "켜짐", en: "On" },
    "rosary.bgmOff": { ko: "꺼짐", en: "Off" },
    "rosary.bgmLabel": { ko: "성당 배경음", en: "Cathedral organ" },
    "rosary.bgmToastOn": { ko: "성당 배경음 켜짐", en: "Cathedral organ on" },
    "rosary.bgmToastOff": { ko: "성당 배경음 꺼짐", en: "Cathedral organ off" },
    "rosary.prevStep": { ko: "이전 기도", en: "Previous prayer" },
    "rosary.nextStep": { ko: "다음 기도", en: "Next prayer" },
    "rosary.seek": { ko: "기도 진행 위치", en: "Prayer position" },
    "rosary.focusOn": { ko: "집중 모드", en: "Focus mode" },
    "rosary.focusOff": { ko: "집중 모드 끄기", en: "Exit focus" },
    "rosary.reset": { ko: "처음부터", en: "Start over" },
    "rosary.progress": { ko: "{cur} / {total}", en: "{cur} / {total}" },
    "rosary.note": { ko: "10알을 마치면 오늘의 묵주기도 1단이 자동으로 기록돼요.", en: "Finishing a decade records today's Rosary automatically." },
    "rosary.decadeDone": { ko: "{n}단을 마쳤어요. 수고하셨어요.", en: "Decade {n} complete. Nicely done." },
    "rosary.doneTitle": { ko: "5단을 모두 마쳤어요", en: "You have prayed all five decades" },
    "rosary.doneBody": { ko: "지금 이 마음을 주님께 그대로 맡겨 두세요. 오늘의 기도는 이미 마음 곁에 남아 있어요.", en: "Leave this heart with the Lord as it is. Today's prayer stays with you." },
    "rosary.doneAgain": { ko: "다시 기도하기", en: "Pray again" },
    "rosary.doneRoutine": { ko: "루틴 보기", en: "See my routine" },
    "rosary.recorded": { ko: "기도 기록이 저장되었어요", en: "Prayer saved to your routine" },
    "rosary.voiceUnsupported": { ko: "카톡 등 인앱 브라우저에선 음성이 막혀요. 크롬·사파리로 열어 보세요.", en: "Voice is blocked in in-app browsers like KakaoTalk. Open in Chrome or Safari." },
    "rosary.complete": { ko: "완료", en: "Done" },
    "rosary.closing": {
      ko: "주님, 오늘의 기도를 받아 주시고 이 마음을 평화로 채워 주소서. 아멘.",
      en: "Lord, receive today's prayer and fill this heart with your peace. Amen."
    },
    "rosary.tapHint": { ko: "버튼을 누르거나 알을 하나씩 바쳐 보세요", en: "Tap the button, one bead at a time" },

    "prayer.sign.title": { ko: "성호경", en: "Sign of the Cross" },
    "prayer.creed.title": { ko: "사도신경", en: "Apostles' Creed" },
    "prayer.ourFather.title": { ko: "주님의 기도", en: "Our Father" },
    "prayer.hailMary.title": { ko: "성모송", en: "Hail Mary" },
    "prayer.glory.title": { ko: "영광송", en: "Glory Be" },
    "prayer.fatima.title": { ko: "구원의 기도", en: "Fatima Prayer" },

    "coach.title": { ko: "AI 코치", en: "AI Coach" },
    "coach.sub": { ko: "지금 마음을 적어 주세요. 함께 기도로 이어 갈게요.", en: "Tell me where your heart is. We'll turn it into prayer." },
    "coach.placeholder": { ko: "오늘 어떤 하루였나요?", en: "How was your day?" },
    "coach.send": { ko: "보내기", en: "Send" },
    "coach.intro": { ko: "안녕하세요. 오늘 마음이 어떤지 편하게 적어 주세요. 판단하지 않고 들을게요.", en: "Hello. Tell me how your heart is today — I'll listen without judging." },
    "coach.actionLabel": { ko: "오늘의 1분 행동", en: "One minute of action" },
    "coach.verseTitle": { ko: "함께 볼 말씀", en: "A verse to hold" },
    "coach.prayCta": { ko: "추천 기도 시작", en: "Pray with me" },
    "coach.typing": { ko: "마음을 읽고 있어요", en: "Listening to your heart" },
    "coach.suggest": { ko: "이런 이야기도 괜찮아요", en: "Any of these is a fine start" },
    "coach.you": { ko: "나", en: "You" },
    "coach.mysteryNote": {
      ko: "{mystery} 신비로 이어 갈게요.",
      en: "We'll continue with the {mystery} Mysteries."
    },
    "coach.empty": { ko: "아직 나눈 이야기가 없어요. 아래에서 시작해 보세요.", en: "Nothing shared yet — start below." },
    "coach.chip1": { ko: "오늘 너무 지쳐요", en: "I'm so worn out today" },
    "coach.chip2": { ko: "마음이 불안해요", en: "My heart is anxious" },
    "coach.chip3": { ko: "감사할 일이 있어요", en: "Something to be thankful for" },
    "coach.chip4": { ko: "외로워요", en: "I feel lonely" },
    "coach.chip5": { ko: "자꾸 미안한 마음이 들어요", en: "I keep feeling guilty" },
    "coach.chip6": { ko: "어디로 가야 할지 모르겠어요", en: "I don't know where to go" },
    "coach.chip7": { ko: "가족을 위해 기도하고 싶어요", en: "Pray for my family" },
    "coach.chip1Mind": { ko: "오늘 너무 지쳐요", en: "I'm so worn out today" },
    "coach.chip2Mind": { ko: "마음이 불안해요", en: "My heart is anxious" },
    "coach.chip3Mind": { ko: "감사할 일이 있어요", en: "Something to be thankful for" },
    "coach.chip4Mind": { ko: "외로워요", en: "I feel lonely" },
    "coach.chip5Mind": { ko: "자꾸 미안한 마음이 들어요", en: "I keep feeling guilty" },
    "coach.chip6Mind": { ko: "어디로 가야 할지 모르겠어요", en: "I don't know where to go" },
    "coach.chip7Mind": { ko: "가족 생각이 자꾸 나요", en: "My family is on my mind" },
    "coach.lineTitleMind": { ko: "마음챙김 한 줄", en: "A mindful line" },
    "coach.prayCtaMind": { ko: "마음 명상 시작", en: "Begin a meditation" },
    "coach.topicNoteMind": { ko: "{topic}으로 이어 갈게요.", en: "We'll continue with {topic}." },
    "coach.emptyMind": { ko: "아직 나눈 이야기가 없어요. 아래에서 시작해 보세요.", en: "Nothing shared yet — start below." },
    "coach.subMind": { ko: "지금 마음을 적어 주세요. 함께 호흡으로 이어 갈게요.", en: "Tell me where your heart is. We'll turn it into breathing." },

    "routine.title": { ko: "루틴 · Pi", en: "Routine & Pi" },
    "routine.streakLabel": { ko: "연속", en: "Streak" },
    "routine.dayUnit": { ko: "일", en: "days" },
    "routine.best": { ko: "최고 기록", en: "Best" },
    "routine.weekTitle": { ko: "최근 7일", en: "Last 7 days" },
    "routine.todayTitle": { ko: "오늘의 체크", en: "Today's check" },
    "routine.feedbackTitle": { ko: "흐름 피드백", en: "How your flow looks" },
    "routine.fb.good": { ko: "아주 좋은 흐름이에요. 이 결을 오래 지켜 가요.", en: "This is a good flow. Keep this thread." },
    "routine.fb.steady": { ko: "꾸준히 오고 계세요. 오늘 한 가지만 더 채워 볼까요?", en: "You've been steady. One more small thing today?" },
    "routine.fb.restart": { ko: "잠시 쉬어 갔네요. 오늘은 1분 기도부터 다시 시작해요.", en: "You rested for a while. Start again with one minute today." },
    "routine.fb.start": { ko: "오늘 첫걸음을 아직 안 뗐어요. 1분이면 충분해요.", en: "Today's first step is still waiting. One minute is enough." },
    "routine.fb.none": { ko: "아직 기록이 없어요. 오늘 마음을 고르고 1분 기도로 시작해 보세요.", en: "No record yet. Pick your heart and begin with one minute." },
    "routine.legend": { ko: "기도 · 묵주 · 말씀", en: "Prayer · Rosary · Word" },
    "routine.legendMind": { ko: "호흡 · 명상 · 기록", en: "Breath · Meditation · Note" },
    "routine.missed": { ko: "쉼", en: "rest" },
    "routine.fb.restartMind": { ko: "잠시 쉬어 갔네요. 오늘은 1분 호흡부터 다시 시작해요.", en: "You rested for a while. Start again with one minute of breathing." },
    "routine.fb.noneMind": { ko: "아직 기록이 없어요. 오늘 마음을 고르고 1분 호흡으로 시작해 보세요.", en: "No record yet. Pick your heart and begin with one minute of breathing." },

    "pi.title": { ko: "Pi와 연결", en: "Connected to Pi" },
    "pi.sub": { ko: "기도 기록은 내 계정에, 작은 감사는 투명하게.", en: "Your prayer record on your account, small thanks given transparently." },
    "pi.demo": { ko: "데모 모드", en: "Demo mode" },
    "pi.piBrowser": { ko: "Pi Browser 감지됨", en: "Pi Browser detected" },
    "pi.connect": { ko: "Pi로 로그인", en: "Sign in with Pi" },
    "pi.connecting": { ko: "연결 중…", en: "Connecting…" },
    "pi.connectedAs": { ko: "Pi 계정", en: "Pi account" },
    "pi.demoUser": { ko: "pi 데모 파이오니어", en: "pi demo pioneer" },
    "pi.logout": { ko: "연결 해제", en: "Disconnect" },
    "pi.offerTitle": { ko: "감사 봉헌", en: "Gratitude offering" },
    "pi.offerDesc": { ko: "마음에 남은 감사만큼 작은 Pi를 봉헌해 보세요. 봉헌 내역은 투명하게 남습니다.", en: "Offer a small amount of Pi for the thanks you carry. Every offering is recorded openly." },
    "pi.amount": { ko: "봉헌 금액", en: "Amount" },
    "pi.memoLabel": { ko: "한 줄 메모 (선택)", en: "A short note (optional)" },
    "pi.memoPlaceholder": { ko: "오늘 감사한 일", en: "What I'm thankful for" },
    "pi.offerBtn": { ko: "Pi로 봉헌하기", en: "Offer with Pi" },
    "pi.processing": { ko: "결제 확인 중…", en: "Confirming payment…" },
    "pi.success": { ko: "감사 봉헌이 기록되었어요", en: "Your offering is recorded" },
    "pi.demoSuccess": { ko: "데모 모드로 봉헌을 기록했어요 (실제 결제 없음)", en: "Recorded in demo mode (no real payment)" },
    "pi.cancelled": { ko: "봉헌이 취소되었어요", en: "Offering cancelled" },
    "pi.failed": { ko: "결제를 완료하지 못했어요. 잠시 후 다시 시도해 주세요.", en: "Payment did not complete. Please try again shortly." },
    "pi.backendMissing": { ko: "결제 승인 서버에 연결하지 못해 실제 결제는 진행되지 않았어요.", en: "No approval server was reachable, so no real payment was made." },
    "pi.demoLogin": { ko: "Pi 로그인을 시작하지 못해 데모 파이오니어로 이어가요 (실제 결제 없음)", en: "Continuing as a demo pioneer (no real payment)" },
    "pi.needConnect": { ko: "먼저 Pi로 로그인해 주세요.", en: "Sign in with Pi first." },
    "pi.recent": { ko: "최근 봉헌", en: "Recent offerings" },
    "pi.noRecent": { ko: "아직 봉헌 기록이 없어요", en: "No offerings yet" },
    "pi.solidTitle": { ko: "글로벌 묵주기도 연대", en: "Global Rosary Solidarity" },
    "pi.solidDesc": { ko: "오늘 함께 기도한 파이오니어", en: "Pioneers praying with you today" },
    "pi.solidNote": { ko: "데모 모드에서는 예시 숫자로 표시돼요.", en: "Shown as a sample number in demo mode." },
    "pi.solidMine": { ko: "내가 함께한 횟수 {n}회", en: "Your part: {n} times" },
    "pi.solidAdd": { ko: "오늘의 기도로 한 사람이 더 함께했어요", en: "Your prayer added one more today" },
    "pi.reset": { ko: "내 기록 초기화", en: "Reset my data" },
    "pi.resetConfirm": { ko: "저장된 기도 기록과 Pi 기록을 모두 지울까요? 되돌릴 수 없어요.", en: "Delete all saved prayer and Pi records? This cannot be undone." },
    "pi.resetConfirmMind": { ko: "저장된 마음 기록과 Pi 기록을 모두 지울까요? 되돌릴 수 없어요.", en: "Delete all saved mind and Pi records? This cannot be undone." },
    "pi.note": { ko: "이 프로토타입은 브라우저 로컬 저장소에만 기록해요. 실제 Pi 결제는 Pi Browser와 서버 승인 API가 있어야 해요.", en: "This prototype stores data only in your browser. Real Pi payments need Pi Browser and server approval endpoints." },
    "pi.demoHint": { ko: "일반 브라우저에서는 안전한 데모 시뮬레이션으로 동작해요.", en: "In a normal browser this runs as a safe demo simulation." },
    "pi.modeLive": { ko: "Pi Browser · 실결제", en: "Pi Browser · live" },
    "pi.modeDemoPay": { ko: "Pi Browser · 데모", en: "Pi Browser · demo" },
    "pi.subMind": { ko: "마음의 기록은 내 계정에, 작은 응원은 투명하게.", en: "Your mind record on your account, small support given transparently." },
    "pi.offerTitleMind": { ko: "마음 돌봄 응원", en: "Mind care support" },
    "pi.offerDescMind": {
      ko: "오늘의 마음 돌봄을 함께 이어가고 싶다면 작은 Pi로 응원해 주세요. 응원 내역은 투명하게 남습니다.",
      en: "If you would like this mind care to keep going, send a small Pi of support. Every contribution is recorded openly."
    },
    "pi.memoPlaceholderMind": { ko: "오늘 마음에 남은 것", en: "What stayed with me today" },
    "pi.offerBtnMind": { ko: "Pi로 응원하기", en: "Support with Pi" },
    "pi.successMind": { ko: "응원이 기록되었어요", en: "Your support is recorded" },
    "pi.demoSuccessMind": { ko: "데모 모드로 응원을 기록했어요 (실제 결제 없음)", en: "Recorded in demo mode (no real payment)" },
    "pi.solidTitleMind": { ko: "글로벌 마음 돌봄", en: "Global Mind Care" },
    "pi.solidDescMind": { ko: "오늘 함께 마음을 돌본 파이오니어", en: "Pioneers caring for their minds today" },
    "pi.solidAddMind": { ko: "오늘의 마음으로 한 사람이 더 함께했어요", en: "Your session added one more today" },

    "minute.title": { ko: "1분 기도", en: "One-minute prayer" },
    "minute.start": { ko: "1분 시작하기", en: "Begin one minute" },
    "minute.step": { ko: "{n} / {total}", en: "{n} / {total}" },
    "minute.remaining": { ko: "{s}초", en: "{s}s" },
    "minute.doneTitle": { ko: "1분을 마쳤어요", en: "One minute, complete" },
    "minute.doneBody": { ko: "짧아도 괜찮아요. 오늘의 기도가 하루의 중심이 됩니다.", en: "Short is fine. Today's prayer becomes the center of the day." },
    "minute.close": { ko: "닫기", en: "Close" },
    "minute.finish": { ko: "마치기", en: "Finish" },
    "minute.voice": { ko: "귀로 듣기", en: "Listen" },

    "common.amen": { ko: "아멘", en: "Amen" },
    "common.cancel": { ko: "취소", en: "Cancel" },
    "common.close": { ko: "닫기", en: "Close" },
    "common.today": { ko: "오늘", en: "Today" },
    "common.pi": { ko: "Pi", en: "Pi" },
    "common.settings": { ko: "설정", en: "Settings" },
    "common.langSwitch": { ko: "English로 보기", en: "한국어로 보기" },
    "common.footer": { ko: "SoulSync · Pi Next Hackathon MVP", en: "SoulSync · Pi Next Hackathon MVP" },
    "common.privacy": { ko: "개인정보처리방침", en: "Privacy Policy" }
  };

  /* ------------------------------------------------------------------ Moods */
  var MOODS = [
    {
      key: "tired", emoji: "😮‍💨", mystery: "sorrowful",
      label: { ko: "지침", en: "Tired" },
      message: {
        ko: "오늘은 마음이 조금 지쳐 있네요. 게을러서가 아니라, 오래 참아 왔기 때문이에요. 1분만 숨을 고르고 수고한 나를 위해 짧은 기도를 드려 보세요.",
        en: "Your heart is tired today. Not because you are lazy — because you have carried a lot for a long time. Breathe for one minute and offer a short prayer for the part of you that kept going."
      },
      mindMessage: {
        ko: "오늘은 마음이 조금 지쳐 있네요. 게을러서가 아니라, 오래 애써 왔기 때문이에요. 1분만 숨을 고르고 수고한 나에게 다정한 말 한마디를 건네 보세요.",
        en: "Your heart is tired today. Not because you are lazy — because you have carried a lot for a long time. Breathe for one minute and say something kind to the part of you that kept going."
      }
    },
    {
      key: "anxious", emoji: "😰", mystery: "sorrowful",
      label: { ko: "불안", en: "Anxious" },
      message: {
        ko: "생각이 꼬리를 물고 돌아가고 있나요? 불안은 나를 지키려는 마음이 앞서는 신호예요. 손을 무릎에 두고 천천히 숨을 쉬며 '주님, 맡깁니다' 한마디면 충분해요.",
        en: "Are your thoughts looping? Anxiety is often your heart trying to protect you. Rest your hands on your knees, breathe slowly, and say one short prayer: “Lord, I place this in your hands.”"
      },
      mindMessage: {
        ko: "생각이 꼬리를 물고 돌아가고 있나요? 불안은 나를 지키려는 마음이 앞서는 신호예요. 손을 무릎에 두고 천천히 숨을 쉬며, 지금 이 순간 나는 안전하다고 되뇌어 보세요.",
        en: "Are your thoughts looping? Anxiety is often your heart trying to protect you. Rest your hands on your knees, breathe slowly, and remind yourself: right now, in this moment, I am safe."
      }
    },
    {
      key: "calm", emoji: "🌿", mystery: "luminous",
      label: { ko: "평온", en: "Calm" },
      message: {
        ko: "평온한 날이네요. 이런 날은 작은 감사 하나를 발견하기 좋아요. 오늘 나에게 선한 것을 하나 찾아 두면 마음의 중심이 더 단단해집니다.",
        en: "A calm day. These are good days for noticing one small gift. Name one good thing from today and your center will hold a little steadier."
      },
      mindMessage: {
        ko: "평온한 날이네요. 이런 날은 작은 감사 하나를 발견하기 좋아요. 오늘 나에게 좋았던 것을 하나 찾아 두면 마음의 중심이 더 단단해집니다.",
        en: "A calm day. These are good days for noticing one small gift. Name one good thing from today and your center will hold a little steadier."
      }
    },
    {
      key: "grateful", emoji: "🙏", mystery: "joyful",
      label: { ko: "감사", en: "Grateful" },
      message: {
        ko: "감사가 마음에 있는 날이네요. 감사는 그냥 두면 사라지고, 말하면 자랍니다. 지금 떠오르는 그 한 가지를 소리 내어 말해 보세요.",
        en: "Gratitude is here today. It fades when it stays silent and grows when it is spoken. Say the one thing out loud."
      },
      mindMessage: {
        ko: "감사가 마음에 있는 날이네요. 감사는 그냥 두면 사라지고, 말하면 자랍니다. 지금 떠오르는 그 한 가지를 소리 내어 말해 보세요.",
        en: "Gratitude is here today. It fades when it stays silent and grows when it is spoken. Say the one thing out loud."
      }
    },
    {
      key: "lonely", emoji: "🌙", mystery: "glorious",
      label: { ko: "외로움", en: "Lonely" },
      message: {
        ko: "마음 한쪽이 허전한 순간이네요. 외로움은 사랑할 곳이 필요하다는 신호예요. 함께 계신다는 말씀 한 줄과 1분 기도로 곁을 만들어 보세요.",
        en: "A part of your heart feels empty right now. Loneliness is a sign that your heart has love to give. Take one line of Scripture and one minute of prayer, and let that be company."
      },
      mindMessage: {
        ko: "마음 한쪽이 허전한 순간이네요. 외로움은 사랑할 곳이 필요하다는 신호예요. 1분 호흡으로 곁을 만들어 보세요. 이 시간만큼은 저도 함께 있을게요.",
        en: "A part of your heart feels empty right now. Loneliness is a sign that your heart has love to give. Take one minute of breathing and let that be company — I will stay here with you."
      }
    },
    {
      key: "joyful", emoji: "✨", mystery: "joyful",
      label: { ko: "기쁨", en: "Joyful" },
      message: {
        ko: "기쁨이 있는 하루네요. 기쁠 때의 마음은 오래 기억해 둘 만해요. 그 기쁨을 한 사람과 나누면 더 오래 갑니다.",
        en: "There is joy in this day, and joy is worth remembering. Share it with one person and it will last longer."
      },
      mindMessage: {
        ko: "기쁨이 있는 하루네요. 기쁠 때의 마음은 오래 기억해 둘 만해요. 그 기쁨을 한 사람과 나누면 더 오래 갑니다.",
        en: "There is joy in this day, and joy is worth remembering. Share it with one person and it will last longer."
      }
    }
  ];

  /* --------------------------------------------------------------- Prayers */
  var PRAYERS = {
    sign: {
      title: { ko: "성호경", en: "Sign of the Cross" },
      text: {
        ko: "성부와 성자와 성령의 이름으로. 아멘.",
        en: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen."
      },
      seconds: 6
    },
    creed: {
      title: { ko: "사도신경", en: "Apostles' Creed" },
      text: {
        ko: "전능하신 천주 성부\n천지의 창조주를 저는 믿나이다.\n그 외아들 우리 주 예수 그리스도님\n성령으로 인하여 동정 마리아께 잉태되어 나시고\n본시오 빌라도 통치 아래서 고난을 받으시고\n십자가에 못 박혀 돌아가시고 묻히셨으며\n저승에 가시어 사흗날에 죽은 이들 가운데서 부활하시고\n하늘에 올라 전능하신 천주 성부 오른편에 앉으시며\n그리로부터 산 이와 죽은 이를 심판하러 오시리라 믿나이다.\n성령을 믿으며\n거룩하고 보편된 교회와 모든 성인의 통공을 믿으며\n죄의 용서와 육신의 부활을 믿으며\n영원한 삶을 믿나이다.\n아멘.",
        en: "I believe in God, the Father almighty, Creator of heaven and earth, and in Jesus Christ, his only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; he descended into hell; on the third day he rose again from the dead; he ascended into heaven, and is seated at the right hand of God the Father almighty; from there he will come to judge the living and the dead. I believe in the Holy Spirit, the holy catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen."
      },
      seconds: 35
    },
    ourFather: {
      title: { ko: "주님의 기도", en: "Our Father" },
      text: {
        ko: "하늘에 계신 우리 아버지,\n아버지의 이름이 거룩히 빛나시며\n아버지의 나라가 오시며\n아버지의 뜻이 하늘에서와 같이\n땅에서도 이루어지소서!\n\n오늘 저희에게 일용할 양식을 주시고\n저희에게 잘못한 이를 저희가 용서하오니\n저희 죄를 용서하시고\n저희를 유혹에 빠지지 않게 하시고\n악에서 구하소서.\n아멘.",
        en: "Our Father, who art in heaven, hallowed be thy name; thy kingdom come; thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen."
      },
      seconds: 22
    },
    hailMary: {
      title: { ko: "성모송", en: "Hail Mary" },
      text: {
        ko: "은총이 가득하신 마리아님, 기뻐하소서!\n주님께서 함께 계시니 여인 중에 복되시며\n태중의 아들 예수님 또한 복되시나이다.\n\n천주의 성모 마리아님,\n이제와 저희 죽을 때에\n저희 죄인을 위하여 빌어주소서.\n아멘.",
        en: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen."
      },
      seconds: 9
    },
    glory: {
      title: { ko: "영광송", en: "Glory Be" },
      text: {
        ko: "영광이 성부와 성자와 성령께\n처음과 같이 이제와 항상 영원히. 아멘.",
        en: "Glory be to the Father, and to the Son, and to the Holy Spirit: as it was in the beginning, is now, and ever shall be, world without end. Amen."
      },
      seconds: 10
    },
    fatima: {
      title: { ko: "구원의 기도", en: "Fatima Prayer" },
      text: {
        ko: "오, 예수님, 저희 죄를 용서하시고 저희를 지옥 불에서 구하시고 모든 영혼을, 특히 가장 도움이 필요한 영혼을 천국으로 이끌어 주소서. 아멘.",
        en: "O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to heaven, especially those who have most need of thy mercy. Amen."
      },
      seconds: 13
    }
  };

  /* ------------------------------------------------------------- Mysteries */
  var MYSTERIES = {
    joyful: {
      key: "joyful",
      label: { ko: "환희의 신비", en: "The Joyful Mysteries" },
      short: { ko: "환희", en: "Joyful" },
      accent: "#E0A458",
      items: [
        {
          name: { ko: "수태고지", en: "The Annunciation" },
          meditation: {
            ko: "천사 가브리엘의 인사 앞에 '예' 하고 응답하신 마리아의 겸손을 묵상합니다.",
            en: "Contemplate Mary's humble yes to the angel Gabriel's greeting."
          }
        },
        {
          name: { ko: "마리아의 엘리사벳 방문", en: "The Visitation" },
          meditation: {
            ko: "도움이 필요한 이를 찾아간 마리아처럼, 오늘 내 곁의 한 사람을 떠올립니다.",
            en: "Like Mary going to Elizabeth, remember one person near you who needs help."
          }
        },
        {
          name: { ko: "예수 탄생", en: "The Nativity" },
          meditation: {
            ko: "가장 낮은 곳에서 빛난 아기 예수, 그 작은 빛을 마음에 모십니다.",
            en: "The child who shone in the lowest place — gather that small light into your heart."
          }
        },
        {
          name: { ko: "예수 성전 봉헌", en: "The Presentation" },
          meditation: {
            ko: "봉헌은 내가 가진 것을 기꺼이 내려놓는 일임을 기억합니다.",
            en: "To present is to set down what I hold, willingly."
          }
        },
        {
          name: { ko: "예수 성전에서 발견", en: "The Finding in the Temple" },
          meditation: {
            ko: "잃어버린 것 같던 마음이 다시 길을 찾을 때, 함께 기뻐합니다.",
            en: "Rejoice when a heart that seemed lost finds its way again."
          }
        }
      ]
    },
    luminous: {
      key: "luminous",
      label: { ko: "빛의 신비", en: "The Luminous Mysteries" },
      short: { ko: "빛", en: "Luminous" },
      accent: "#8FA9D9",
      items: [
        {
          name: { ko: "예수 세례", en: "The Baptism of Jesus" },
          meditation: {
            ko: "물 위에 머무는 성령처럼, 오늘 하루가 조용히 채워지길 바랍니다.",
            en: "Like the Spirit over the water, let today be quietly filled."
          }
        },
        {
          name: { ko: "가나 혼인 잔치", en: "The Wedding at Cana" },
          meditation: {
            ko: "기쁨의 자리에서 첫 표징을 보이신 예수님, 작은 기쁨을 알아채게 하소서.",
            en: "You showed your first sign at a celebration — teach me to notice small joys."
          }
        },
        {
          name: { ko: "하느님 나라 선포", en: "The Proclamation of the Kingdom" },
          meditation: {
            ko: "가난한 마음이 복되다고 하셨으니, 오늘 내 마음의 가난을 받아들입니다.",
            en: "Blessed are the poor in spirit — let me accept the poverty of my own heart today."
          }
        },
        {
          name: { ko: "거룩한 변화", en: "The Transfiguration" },
          meditation: {
            ko: "빛나는 얼굴처럼, 내 안의 좋은 마음이 드러나게 하소서.",
            en: "Like that shining face, let the good in me become visible."
          }
        },
        {
          name: { ko: "성체성사 제정", en: "The Institution of the Eucharist" },
          meditation: {
            ko: "나를 내어주신 사랑 앞에 서면, 너무 많은 것이 가벼워집니다.",
            en: "Standing before a love that gave itself away, many burdens grow light."
          }
        }
      ]
    },
    sorrowful: {
      key: "sorrowful",
      label: { ko: "고통의 신비", en: "The Sorrowful Mysteries" },
      short: { ko: "고통", en: "Sorrowful" },
      accent: "#B58BA6",
      items: [
        {
          name: { ko: "겟세마니에서의 기도", en: "The Agony in the Garden" },
          meditation: {
            ko: "피 같은 땀을 흘리신 기도, 내가 감당 못 할 것 같을 때 떠올립니다.",
            en: "A prayer in blood and sweat — remember it when you feel you cannot bear this."
          }
        },
        {
          name: { ko: "채찍질", en: "The Scourging" },
          meditation: {
            ko: "상처받은 몸과 마음도 주님 앞에서 존귀합니다.",
            en: "A wounded body and heart are still precious before the Lord."
          }
        },
        {
          name: { ko: "가시관 씌움", en: "The Crowning with Thorns" },
          meditation: {
            ko: "조롱과 온갖 무게를 지신 주님이 오늘 내 피로를 이해하십니다.",
            en: "He who carried mockery and weight understands today's fatigue."
          }
        },
        {
          name: { ko: "십자가의 길", en: "The Carrying of the Cross" },
          meditation: {
            ko: "넘어지고 또 일어나신 걸음, 오늘의 작은 한 걸음을 견디게 합니다.",
            en: "He fell and rose again — let that steady today's one small step."
          }
        },
        {
          name: { ko: "십자가형", en: "The Crucifixion" },
          meditation: {
            ko: "용서하시고 마지막까지 사랑하신 그 마음에 내 슬픔을 맡깁니다.",
            en: "I entrust my sorrow to the heart that forgave and loved to the end."
          }
        }
      ]
    },
    glorious: {
      key: "glorious",
      label: { ko: "영광의 신비", en: "The Glorious Mysteries" },
      short: { ko: "영광", en: "Glorious" },
      accent: "#C9AE6A",
      items: [
        {
          name: { ko: "부활", en: "The Resurrection" },
          meditation: {
            ko: "죽음보다 강한 빛, 지금 막막한 일에도 그 빛이 있습니다.",
            en: "A light stronger than death — it is in today's dead ends too."
          }
        },
        {
          name: { ko: "승천", en: "The Ascension" },
          meditation: {
            ko: "보이지 않아도 함께 계신다는 약속을 붙잡습니다.",
            en: "I hold the promise that he is with us even unseen."
          }
        },
        {
          name: { ko: "성령 강림", en: "The Descent of the Holy Spirit" },
          meditation: {
            ko: "다른 언어로도 같은 마음이 되게 하신 성령, 서로를 이해하게 하소서.",
            en: "Spirit who made one heart out of many languages, help us understand one another."
          }
        },
        {
          name: { ko: "성모 승천", en: "The Assumption" },
          meditation: {
            ko: "끝이 이별이 아니라 돌아감임을 기억합니다.",
            en: "Remember that the end is not a goodbye but a homecoming."
          }
        },
        {
          name: { ko: "성모 관관", en: "The Coronation" },
          meditation: {
            ko: "감사로 남은 하루가 마음의 왕관이 되게 하소서.",
            en: "Let a day kept in gratitude become a crown for the heart."
          }
        }
      ]
    }
  };

  /* ---------------------------------------------------------------- Verses */
  var VERSES = {
    rest: {
      ref: { ko: "마태오 11,28", en: "Matthew 11:28" },
      text: {
        ko: "“수고하고 무거운 짐 진 자들아 다 내게로 오너라. 내가 너희를 쉬게 하리라.”",
        en: "“Come to me, all you who are weary and burdened, and I will give you rest.”"
      }
    },
    peace: {
      ref: { ko: "필리피 4,6-7", en: "Philippians 4:6-7" },
      text: {
        ko: "“아무것도 염려하지 말고 다만 모든 일에 기도와 간구로 하느님께 아뢰어라. 그러면 모든 이해를 뛰어넘는 하느님의 평화가 너희 마음과 생각을 지켜 줄 것이다.”",
        en: "“Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds.”"
      }
    },
    courage: {
      ref: { ko: "이사야 41,10", en: "Isaiah 41:10" },
      text: {
        ko: "“두려워하지 마라, 내가 너와 함께 있다. 놀라지 마라, 내가 너의 하느님이다.”",
        en: "“Do not fear, for I am with you; do not be dismayed, for I am your God.”"
      }
    },
    trust: {
      ref: { ko: "시편 23,1", en: "Psalm 23:1" },
      text: {
        ko: "“주님은 나의 목자, 나는 아쉬울 것 없어라.”",
        en: "“The Lord is my shepherd; I shall not want.”"
      }
    },
    forgive: {
      ref: { ko: "1요한 1,9", en: "1 John 1:9" },
      text: {
        ko: "“우리가 우리 죄를 고백하면, 그분은 성실하시고 의로우신 분이시므로 우리 죄를 용서하시고 모든 불의에서 깨끗하게 해 주십니다.”",
        en: "“If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.”"
      }
    },
    lonely: {
      ref: { ko: "시편 34,19", en: "Psalm 34:18" },
      text: {
        ko: "“주님은 마음이 꺾인 이들에게 가까이 계시고 마음이 상한 이들을 구하신다.”",
        en: "“The Lord is close to the brokenhearted and saves those who are crushed in spirit.”"
      }
    },
    blessing: {
      ref: { ko: "민수기 6,24-26", en: "Numbers 6:24-26" },
      text: {
        ko: "“주님께서 당신을 축복하시고 지켜 주시기를. 주님께서 당신에게 당신의 얼굴을 비추시고 당신에게 은총을 베푸시기를. 주님께서 당신에게 당신의 얼굴을 들어 보이시고 당신에게 평화를 주시기를.”",
        en: "“The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you; the Lord turn his face toward you and give you peace.”"
      }
    },
    thanks: {
      ref: { ko: "1코린토 10,31", en: "1 Corinthians 10:31" },
      text: {
        ko: "“무엇을 먹든지 마시든지 무엇을 하든지 다 하느님의 영광을 위하여 하십시오.”",
        en: "“Whatever you do, do it all for the glory of God.”"
      }
    },
    hope: {
      ref: { ko: "갈라티아 6,9", en: "Galatians 6:9" },
      text: {
        ko: "“선한 일을 하다가 낙심하지 맙시다. 지칠 때가 되면 거두게 될 것입니다.”",
        en: "“Let us not become weary in doing good, for at the proper time we will reap a harvest.”"
      }
    },
    stillness: {
      ref: { ko: "시편 46,11", en: "Psalm 46:10" },
      text: {
        ko: "“멈추어라, 그리고 내가 하느님임을 알아라.”",
        en: "“Be still, and know that I am God.”"
      }
    }
  };

  /* ------------------------------------------------------------- Mind lines */
  /* The "오늘의 한 줄" of the mind-care mode. Scripture is what the Catholic mode
     carries, so these are original, unattributed lines: warm, plain, and true
     whether or not the reader believes anything. One turns up each day. */
  var MIND_LINES = [
    {
      text: {
        ko: "숨을 한 번 깊게 들이쉬는 것만으로도, 오늘의 나를 다시 만날 수 있어요.",
        en: "One deep breath is enough to meet yourself again today."
      }
    },
    {
      text: {
        ko: "마음이 복잡한 날은, 잠깐 멈추는 것만으로도 충분해요.",
        en: "On a crowded day, simply stopping for a moment is enough."
      }
    },
    {
      text: {
        ko: "지금 여기에 있다는 것. 그것이 오늘의 가장 작은 성취예요.",
        en: "Being here, now — that is today's smallest achievement."
      }
    },
    {
      text: {
        ko: "생각은 지나가는 구름 같아요. 붙잡지 않아도 괜찮아요.",
        en: "Thoughts are passing clouds. You do not have to hold them."
      }
    },
    {
      text: {
        ko: "애쓰지 않아도 괜찮은 시간이 하루에 한 번은 필요해요.",
        en: "A day needs one stretch of time where trying is not required."
      }
    },
    {
      text: {
        ko: "내 마음을 다그치지 않을 때, 마음은 조금씩 편안해져요.",
        en: "When I stop hurrying my heart, it settles a little."
      }
    },
    {
      text: {
        ko: "오늘 느낀 것은 그냥 느낀 채로 두어도 괜찮아요.",
        en: "What you felt today may simply be left as it was felt."
      }
    },
    {
      text: {
        ko: "작은 것 하나를 알아차리는 일이 마음을 돌보는 시작이에요.",
        en: "Noticing one small thing is where caring for the mind begins."
      }
    },
    {
      text: {
        ko: "숨이 들어오고 나가는 동안, 이 순간은 온전히 나의 것이에요.",
        en: "While the breath comes and goes, this moment is wholly yours."
      }
    },
    {
      text: {
        ko: "잘하고 있는지보다, 지금 어떤지에 귀를 기울여 보세요.",
        en: "Listen to how you are, more than to how well you are doing."
      }
    },
    {
      text: {
        ko: "마음에도 쉬어 가는 자리가 필요해요.",
        en: "The mind needs places to rest along the way."
      }
    },
    {
      text: {
        ko: "오늘 하루, 나에게 조금 더 다정해도 괜찮아요.",
        en: "Today, you may be a little kinder to yourself."
      }
    }
  ];

  /* ------------------------------------------------------- Coach themes */
  /* Keyword rule for Korean: every keyword is a stem of at least two syllables
     that people actually type, never a bare syllable. Korean matches as a
     substring (조사 are glued on), so a short syllable fires inside unrelated
     words — "울" is in 소울싱크·서울·울타리, "웃" is in 웃어른, "딸" is in 딸기,
     "아이" is in 아이디어. Nouns are listed with their common 조사 or in a
     phrase ("지침이", "아이들", "우리 딸") so the feeling is still recognised
     without catching words that merely contain those letters. */
  var COACH_THEMES = {
    tired: {
      keywords: {
        ko: ["지쳐", "지쳤", "지치", "피곤", "힘들", "녹초", "무기력", "번아웃", "지침이", "졸려", "버거운", "버겁", "버거워", "기운이 없", "쉬고 싶", "쉬고싶"],
        en: ["tired", "exhausted", "drained", "burnout", "worn out", "no energy", "weary", "sleepy", "overwhelmed"]
      },
      empathy: {
        ko: "오늘 정말 많이 애쓰셨어요. 지금의 지침은 의지가 약해서가 아니라 오래 버텼기 때문이에요. 스스로를 몰아붙이지 않아도 괜찮습니다.",
        en: "You have carried a lot today. This tiredness is not weak will — it is what long endurance feels like. You do not have to push yourself right now."
      },
      action: {
        ko: "의자에 깊게 앉아 어깨를 내리고, 숨을 네 번 천천히 쉬어 보세요. 그다음 “주님, 오늘은 여기까지 했습니다”라고 말해 보세요.",
        en: "Sit back in your chair, let your shoulders drop, and take four slow breaths. Then say: “Lord, this is what I could do today.”"
      },
      mind: {
        empathy: {
          ko: "오늘 정말 많이 애쓰셨어요. 지금의 지침은 의지가 약해서가 아니라 오래 버텼기 때문이에요. 스스로를 몰아붙이지 않아도 괜찮습니다.",
          en: "You have carried a lot today. This tiredness is not weak will — it is what long endurance feels like. You do not have to push yourself right now."
        },
        action: {
          ko: "의자에 깊게 앉아 어깨를 내리고, 숨을 네 번 천천히 쉬어 보세요. 그다음 “오늘은 여기까지 했어요”라고 말해 보세요.",
          en: "Sit back in your chair, let your shoulders drop, and take four slow breaths. Then say: “This is what I could do today.”"
        },
        line: { ko: "쉬는 것도 오늘 해야 할 일의 하나예요.", en: "Resting is one of today's tasks too." },
        topic: "breath"
      },
      verse: "rest",
      mystery: "sorrowful"
    },
    anxious: {
      keywords: {
        ko: ["불안", "걱정", "초조", "두려", "무서", "조마", "조바심", "긴장", "마음이 답답", "숨이 막"],
        en: ["anxious", "anxiety", "worried", "worry", "nervous", "afraid", "scared", "panic", "tense"]
      },
      empathy: {
        ko: "불안은 아직 오지 않은 일을 미리 견디느라 생기는 피로예요. 지금 이 순간, 당신은 안전합니다. 마음이 앞서가도 괜찮아요.",
        en: "Anxiety is the fatigue of living through things that have not happened yet. Right now, in this moment, you are safe."
      },
      action: {
        ko: "손바닥을 무릎에 두고 4초 들이쉬고 6초 내쉬기를 다섯 번 해 보세요. 그다음 걱정 하나를 적고 옆에 “맡깁니다”라고 써 보세요.",
        en: "Rest your palms on your knees: breathe in for four, out for six, five times. Then write one worry down and beside it write “I place this in your hands.”"
      },
      mind: {
        empathy: {
          ko: "불안은 아직 오지 않은 일을 미리 견디느라 생기는 피로예요. 지금 이 순간, 당신은 안전합니다. 마음이 앞서가도 괜찮아요.",
          en: "Anxiety is the fatigue of living through things that have not happened yet. Right now, in this moment, you are safe."
        },
        action: {
          ko: "손바닥을 무릎에 두고 4초 들이쉬고 6초 내쉬기를 다섯 번 해 보세요. 그다음 걱정 하나를 적고 옆에 “지금은 여기까지”라고 써 보세요.",
          en: "Rest your palms on your knees: breathe in for four, out for six, five times. Then write one worry down and beside it write “this is as far as it goes for now.”"
        },
        line: { ko: "아직 오지 않은 일은, 아직 내 몫이 아니에요.", en: "What has not happened yet is not yours to carry yet." },
        topic: "breath"
      },
      verse: "peace",
      mystery: "sorrowful"
    },
    guilt: {
      keywords: {
        ko: ["미안", "죄책", "후회", "용서", "잘못", "자책", "부끄", "실수"],
        en: ["guilty", "guilt", "sorry", "regret", "forgive", "my fault", "shame", "mistake"]
      },
      empathy: {
        ko: "미안한 마음이 오래 머물고 있네요. 주님의 자비는 당신이 완벽해지기를 기다리지 않아요. 이미 알고 계시고, 이미 사랑하고 계십니다.",
        en: "That sorry feeling has been staying with you a while. God's mercy is not waiting for you to be perfect — you are already known and already loved."
      },
      action: {
        ko: "잘못 하나를 떠올리고 “주님, 용서해 주세요. 다시 해 보겠습니다”라고 짧게 기도하세요. 그리고 자신에게도 똑같이 말해 주세요.",
        en: "Name one thing, and pray briefly: “Lord, forgive me. I will try again.” Then say the same words to yourself."
      },
      mind: {
        empathy: {
          ko: "미안한 마음이 오래 머물고 있네요. 스스로를 벌하는 마음보다, 다음에 어떻게 할지가 더 오래 남습니다.",
          en: "That sorry feeling has been staying with you a while. What you do next lasts longer than punishing yourself for what passed."
        },
        action: {
          ko: "잘못 하나를 떠올리고 “이번엔 다르게 해 볼게요”라고 짧게 말해 보세요. 그리고 자신에게도 똑같이 말해 주세요.",
          en: "Name one thing, and say briefly: “I will try it differently next time.” Then say the same words to yourself."
        },
        line: { ko: "나를 용서하는 연습도 마음 돌봄의 일부예요.", en: "Learning to forgive myself is part of caring for this mind." },
        topic: "mindful"
      },
      verse: "forgive",
      mystery: "sorrowful"
    },
    lonely: {
      keywords: {
        ko: ["외로", "혼자", "쓸쓸", "고독", "아무도", "허전", "빈자리"],
        en: ["lonely", "alone", "isolated", "empty", "no one", "miss someone"]
      },
      empathy: {
        ko: "혼자인 시간은 마음이 유난히 크게 들리는 때예요. 외로움은 사랑할 곳이 있다는 뜻이기도 합니다.",
        en: "Time alone makes the heart sound louder. Loneliness also means there is love in you with somewhere to go."
      },
      action: {
        ko: "지금 떠오르는 한 사람에게 짧은 안부를 보내 보세요. 그리고 그 사람을 위해 10초만 기도해 주세요.",
        en: "Send one short hello to the person who just came to mind. Then pray for them for ten seconds."
      },
      mind: {
        empathy: {
          ko: "혼자인 시간은 마음이 유난히 크게 들리는 때예요. 외로움은 사랑할 곳이 있다는 뜻이기도 합니다.",
          en: "Time alone makes the heart sound louder. Loneliness also means there is love in you with somewhere to go."
        },
        action: {
          ko: "지금 떠오르는 한 사람에게 짧은 안부를 보내 보세요. 그리고 그 사람을 10초만 마음에 담아 보세요.",
          en: "Send one short hello to the person who just came to mind. Then hold them in your heart for ten seconds."
        },
        line: { ko: "연결은 가까이 있지 않아도 만들어질 수 있어요.", en: "Connection can be made without being close." },
        topic: "gratitude"
      },
      verse: "lonely",
      mystery: "glorious"
    },
    family: {
      keywords: {
        ko: ["가족", "가정을", "가정이", "가정의", "우리 가정", "부모", "어머니", "아버지", "엄마", "아빠", "아이들", "아이가", "아이를", "아이의", "아이에게", "아이와", "아이랑", "아이 키", "아들", "딸이", "딸을", "딸은", "딸도", "딸의", "딸에게", "딸아이", "딸래미", "딸과", "우리 딸", "자녀", "남편", "아내", "부부", "형제", "자매", "손주", "며느리", "사위", "중보", "우리 집", "집안", "사랑", "평화", "건강"],
        en: ["family", "families", "parents", "parent", "mother", "father", "mom", "mum", "dad", "son", "daughter", "children", "child", "kids", "spouse", "husband", "wife", "sibling", "brother", "sister", "grandchild", "intercede", "intercession", "household", "my home", "love", "loved", "loving", "peace", "peaceful", "health", "healthy"]
      },
      empathy: {
        ko: "가족이 마음에 가득하네요. 가까운 사이일수록 마음이 잘 닿지 않아 애가 타기도 하지요. 그 마음을 그대로 주님께 가져가면 혼자 꾹 안고 있지 않아도 됩니다.",
        en: "Your family is on your heart today. The closer people are, the more it can ache when words do not reach. Bring that love to the Lord as it is — you do not have to hold it alone."
      },
      action: {
        ko: "가족 중 한 사람의 이름을 소리 내어 부르고, 그 사람에게 지금 필요한 것 하나를 떠올려 보세요. 그다음 1분 동안 그 이름을 마음에 두고 기도해 보세요.",
        en: "Say the name of one family member out loud, then name one thing they need right now. Keep that name in your heart and pray for one minute."
      },
      mind: {
        empathy: {
          ko: "가족이 마음에 가득하네요. 가까운 사이일수록 마음이 잘 닿지 않아 애가 타기도 하지요. 그 마음을 혼자 꾹 안고 있지 않아도 됩니다.",
          en: "Your family is on your heart today. The closer people are, the more it can ache when words do not reach. You do not have to hold it alone."
        },
        action: {
          ko: "가족 중 한 사람의 이름을 소리 내어 부르고, 그 사람에게 지금 필요한 것 하나를 떠올려 보세요. 그다음 1분 동안 그 이름을 마음에 두고 호흡해 보세요.",
          en: "Say the name of one family member out loud, then name one thing they need right now. Keep that name in your heart and breathe for one minute."
        },
        line: { ko: "말하지 못한 마음은 마음속에서 천천히 자라요.", en: "Feelings without words still grow quietly in the heart." },
        topic: "gratitude"
      },
      verse: "blessing",
      mystery: "joyful"
    },
    grateful: {
      keywords: {
        ko: ["감사", "고마", "기뻐", "기쁨", "기뻤", "기쁘", "좋은 일", "행복", "웃음", "웃었", "웃어", "웃는", "웃고", "웃겨", "선물"],
        en: ["grateful", "thankful", "thanks", "good day", "happy", "joy", "blessed"]
      },
      empathy: {
        ko: "감사가 마음에 차 있는 날이네요. 이 마음은 그냥 지나가면 금방 흐려지지만, 남겨 두면 오래 힘이 됩니다.",
        en: "Your heart is full of thanks today. Left alone it fades quickly; written down, it keeps its strength."
      },
      action: {
        ko: "감사한 일 하나를 구체적으로 적고, 그 일에 함께한 사람을 위해 1분 기도해 주세요.",
        en: "Write one specific thing you are thankful for, then pray for one minute for someone who was part of it."
      },
      mind: {
        empathy: {
          ko: "감사가 마음에 차 있는 날이네요. 이 마음은 그냥 지나가면 금방 흐려지지만, 남겨 두면 오래 힘이 됩니다.",
          en: "Your heart is full of thanks today. Left alone it fades quickly; written down, it keeps its strength."
        },
        action: {
          ko: "감사한 일 하나를 구체적으로 적고, 그 일에 함께한 사람을 1분 동안 마음에 담아 보세요.",
          en: "Write one specific thing you are thankful for, then hold the person who was part of it in your heart for one minute."
        },
        line: { ko: "감사는 적어 두면 다시 읽을 수 있는 마음이 돼요.", en: "Written down, gratitude becomes a page you can read again." },
        topic: "gratitude"
      },
      verse: "thanks",
      mystery: "joyful"
    },
    lost: {
      keywords: {
        ko: ["모르겠", "막막", "방향을", "방향이", "방향성", "선택을", "선택이", "선택해야", "선택할", "결정을", "결정해야", "결정하기", "결정할", "고민", "어떻게", "길을", "진로"],
        en: ["don't know", "lost", "stuck", "decide", "decision", "confused", "direction", "what to do"]
      },
      empathy: {
        ko: "어디로 가야 할지 모를 때는, 방향을 정하기 전에 마음을 먼저 쉬게 해야 해요. 답은 조용한 곳에서 들립니다.",
        en: "When you cannot see the way, rest the heart before choosing a direction. Answers are heard in quiet places."
      },
      action: {
        ko: "오늘 결정할 것 하나를 잠시 미루고, 1분 동안 “주님, 길을 보여 주세요”만 반복해 보세요.",
        en: "Set one decision down for a moment, and for one minute repeat only: “Lord, show me the way.”"
      },
      mind: {
        empathy: {
          ko: "어디로 가야 할지 모를 때는, 방향을 정하기 전에 마음을 먼저 쉬게 해야 해요. 답은 조용한 곳에서 들립니다.",
          en: "When you cannot see the way, rest the heart before choosing a direction. Answers are heard in quiet places."
        },
        action: {
          ko: "오늘 결정할 것 하나를 잠시 미루고, 1분 동안 천천히 숨만 쉬어 보세요.",
          en: "Set one decision down for a moment, and for one minute do nothing but breathe slowly."
        },
        line: { ko: "길은 서두르지 않을 때 더 잘 보여요.", en: "The way shows itself better when you do not rush it." },
        topic: "mindful"
      },
      verse: "trust",
      mystery: "luminous"
    },
    sad: {
      keywords: {
        ko: ["슬퍼", "슬프", "슬픔", "슬펐", "서러", "울고", "울었", "울어", "울면", "울음", "울먹", "울컥", "울적", "울보", "울 것", "울 거", "울 듯", "운다", "우울", "눈물", "마음이 아", "상처", "그리워", "그리운", "그립다", "그립습니다"],
        en: ["sad", "cry", "tears", "hurt", "grief", "depressed", "miss", "broken"]
      },
      empathy: {
        ko: "마음이 가라앉아 있네요. 슬픔은 약함이 아니라 사랑이 남긴 자리예요. 그 자리를 서둘러 지우지 않아도 됩니다.",
        en: "Your heart is low. Sadness is not weakness — it is the place love left behind. You do not have to erase it quickly."
      },
      action: {
        ko: "울컥하는 마음을 억지로 밀어내지 말고, 1분 동안 그대로 두고 기도해 보세요. “주님, 이 마음을 아십니다.”",
        en: "Do not push the feeling away. Hold it for one minute and pray: “Lord, you know this heart.”"
      },
      mind: {
        empathy: {
          ko: "마음이 가라앉아 있네요. 슬픔은 약함이 아니라 사랑이 남긴 자리예요. 그 자리를 서둘러 지우지 않아도 됩니다.",
          en: "Your heart is low. Sadness is not weakness — it is the place love left behind. You do not have to erase it quickly."
        },
        action: {
          ko: "울컥하는 마음을 억지로 밀어내지 말고, 1분 동안 그대로 두고 숨을 쉬어 보세요.",
          en: "Do not push the feeling away. Hold it for one minute and breathe."
        },
        line: { ko: "슬픔에도 머물 시간이 필요해요.", en: "Sadness needs time to stay, too." },
        topic: "body"
      },
      verse: "hope",
      mystery: "glorious"
    },
    fallback: {
      keywords: { ko: [], en: [] },
      empathy: {
        ko: "이야기해 주셔서 고마워요. 지금 이 마음을 다 정리하지 않아도 괜찮아요. 함께 조용히 있어 볼게요.",
        en: "Thank you for telling me. You do not have to sort all of this out now — let's be quiet together for a moment."
      },
      action: {
        ko: "1분 동안 숨을 세 번 천천히 쉬고, 지금 마음에 가장 남는 단어 하나를 골라 보세요. 그 단어를 기도에 담아 드리면 됩니다.",
        en: "Breathe slowly three times, then choose the one word that stays with you. Bring that word into prayer."
      },
      mind: {
        empathy: {
          ko: "이야기해 주셔서 고마워요. 지금 이 마음을 다 정리하지 않아도 괜찮아요. 함께 조용히 있어 볼게요.",
          en: "Thank you for telling me. You do not have to sort all of this out now — let's be quiet together for a moment."
        },
        action: {
          ko: "1분 동안 숨을 세 번 천천히 쉬고, 지금 마음에 가장 남는 단어 하나를 골라 보세요.",
          en: "Breathe slowly three times, then choose the one word that stays with you."
        },
        line: { ko: "설명되지 않는 마음도 그대로 두어도 괜찮아요.", en: "A feeling you cannot explain may simply be left as it is." },
        topic: "breath"
      },
      verse: "stillness",
      mystery: "luminous"
    }
  };

  /* ------------------------------------------------------- 1-minute prayer */
  var MINUTE_PRAYER = {
    seconds: 60,
    steps: [
      {
        title: { ko: "숨을 고르기", en: "Breathe" },
        text: {
          ko: "어깨의 힘을 풀고, 숨을 천천히 들이쉬고 내쉬어요. 지금 여기에 있는 것만으로 충분해요.",
          en: "Let your shoulders drop. Breathe in slowly, out slowly. Being here is already enough."
        }
      },
      {
        title: { ko: "마음을 보여 드리기", en: "Show your heart" },
        text: {
          ko: "지금 마음에 있는 것을 있는 그대로 주님께 보여 드려요. 정리하지 않아도 괜찮아요.",
          en: "Show the Lord what is in your heart, exactly as it is. It does not need to be tidy."
        }
      },
      {
        title: { ko: "짧은 기도", en: "A short prayer" },
        text: {
          ko: "“주님, 저를 도와주세요. 오늘 하루를 맡깁니다.” 마음속으로 세 번 천천히 반복해 보세요.",
          en: "“Lord, help me. I entrust this day to you.” Repeat it slowly, three times."
        }
      },
      {
        title: { ko: "감사로 마무리", en: "Close with thanks" },
        text: {
          ko: "오늘 감사한 것 하나를 떠올리며, 천천히 ‘아멘’으로 마무리해요.",
          en: "Hold one thing you are thankful for, and close slowly with “Amen.”"
        }
      }
    ],

    /* Four 15-second steps for each heart the home screen offers. The sheet
       picks the set that matches today's mood; the generic steps above stay as
       the fallback for a day with no mood chosen yet.  Tone: warm, Catholic,
       never "you must" — every prayer asks for help rather than demands it. */
    byMood: {
      tired: [
        {
          title: { ko: "숨 고르기", en: "Breathe" },
          text: {
            ko: "어깨에 힘을 빼고 숨을 천천히 들이쉬고 내쉬어요. 오늘 여기까지 온 것만으로 충분히 애쓰셨어요.",
            en: "Let your shoulders drop and breathe in and out slowly. Getting here today was already a lot."
          }
        },
        {
          title: { ko: "지친 마음 그대로", en: "This tired heart" },
          text: {
            ko: "지금의 지침은 게을러서가 아니라 오래 견뎠기 때문이에요. 마음을 정리하지 않고 그대로 주님께 가져가요.",
            en: "This tiredness is not laziness — it is what long endurance feels like. Bring your heart to the Lord just as it is, without tidying it up."
          }
        },
        {
          title: { ko: "짧은 기도", en: "A short prayer" },
          text: {
            ko: "“주님, 오늘은 여기까지 했습니다. 남은 하루는 맡깁니다.” 마음속으로 두 번 천천히 반복해 보세요.",
            en: "“Lord, this is what I could do today. I place the rest in your hands.” Repeat it slowly, twice."
          }
        },
        {
          title: { ko: "쉬게 하소서", en: "Rest" },
          text: {
            ko: "“수고하고 무거운 짐 진 자들아 다 내게로 오너라”(마태오 11,28)를 떠올리며, 숨을 한 번 길게 내쉬고 ‘아멘’.",
            en: "Hold “Come to me, all you who are weary” (Matthew 11:28), breathe out once, long and slow, and close with “Amen.”"
          }
        }
      ],
      anxious: [
        {
          title: { ko: "손 내려놓기", en: "Let your hands rest" },
          text: {
            ko: "손바닥을 무릎에 얹고 4초 들이쉬고 6초 내쉬기를 세 번 해 보세요. 지금 이 순간, 나는 안전합니다.",
            en: "Rest your palms on your knees: breathe in for four, out for six, three times. Right now, in this moment, you are safe."
          }
        },
        {
          title: { ko: "걱정 하나만", en: "Just one worry" },
          text: {
            ko: "떠오르는 걱정 하나를 골라 마음속으로 이름을 붙여요. 아직 오지 않은 일을 미리 견디지 않아도 괜찮아요.",
            en: "Choose one worry and name it quietly. You do not have to live through what has not happened yet."
          }
        },
        {
          title: { ko: "짧은 기도", en: "A short prayer" },
          text: {
            ko: "“주님, 제가 붙잡고 있는 이 걱정을 맡깁니다. 제 마음을 평화로 지켜 주세요.” 세 번 천천히.",
            en: "“Lord, I place this worry in your hands. Guard my heart with your peace.” Slowly, three times."
          }
        },
        {
          title: { ko: "평화로 마무리", en: "Close in peace" },
          text: {
            ko: "“아무것도 염려하지 말고…”(필리피 4,6-7)를 떠올리며 숨을 길게 내쉬고 ‘아멘’.",
            en: "Hold “Do not be anxious about anything” (Philippians 4:6-7), breathe out long, and close with “Amen.”"
          }
        }
      ],
      calm: [
        {
          title: { ko: "지금 느끼기", en: "Notice now" },
          text: {
            ko: "조용한 지금을 그대로 느껴 보세요. 서두르지 않아도 되는 시간이에요.",
            en: "Notice the quiet that is here. This is a time that does not need to be rushed."
          }
        },
        {
          title: { ko: "작은 선함 찾기", en: "One small good thing" },
          text: {
            ko: "오늘 나에게 좋았던 작은 것 하나를 떠올려요. 평온한 날은 발견하기에 좋은 날이에요.",
            en: "Name one small good thing from today. A calm day is a good day for noticing."
          }
        },
        {
          title: { ko: "짧은 기도", en: "A short prayer" },
          text: {
            ko: "“주님, 이 고요함을 주셔서 감사합니다. 이 마음을 오래 지켜 주세요.”",
            en: "“Lord, thank you for this quiet. Keep this heart steady.”"
          }
        },
        {
          title: { ko: "나누며 마무리", en: "Close by sharing" },
          text: {
            ko: "이 고요함이 필요한 한 사람을 떠올리며 축복하고, 천천히 ‘아멘’.",
            en: "Hold someone who needs this quiet too, bless them, and close slowly with “Amen.”"
          }
        }
      ],
      grateful: [
        {
          title: { ko: "숨으로 받기", en: "Receive with breath" },
          text: {
            ko: "숨을 한 번 깊게 들이쉬고 내쉬며, 오늘 하루를 선물로 받아들여요.",
            en: "Breathe in deeply, breathe out, and receive today as a gift."
          }
        },
        {
          title: { ko: "감사 하나 꺼내기", en: "Name one thanks" },
          text: {
            ko: "지금 떠오르는 감사 하나를 소리 내어 말해 보세요. 감사는 말할수록 오래 남아요.",
            en: "Say one thing you are thankful for out loud. Gratitude lasts longer when it is spoken."
          }
        },
        {
          title: { ko: "짧은 기도", en: "A short prayer" },
          text: {
            ko: "“주님, 이 기쁨을 주신 분이 당신임을 압니다. 감사합니다.” 두 번 천천히.",
            en: "“Lord, I know this joy came from you. Thank you.” Slowly, twice."
          }
        },
        {
          title: { ko: "나눔으로 마무리", en: "Close by sharing" },
          text: {
            ko: "그 감사에 함께한 사람 한 명을 떠올리며 축복하고 ‘아멘’.",
            en: "Remember one person who was part of it, bless them, and close with “Amen.”"
          }
        }
      ],
      lonely: [
        {
          title: { ko: "곁을 느끼기", en: "Feel the company" },
          text: {
            ko: "한 손을 가슴에 얹고 숨을 천천히 쉬어요. 이 자리에 혼자 있는 것이 아니에요.",
            en: "Rest one hand on your heart and breathe slowly. You are not alone in this place."
          }
        },
        {
          title: { ko: "비어 있는 마음", en: "The empty feeling" },
          text: {
            ko: "빈 느낌을 억지로 채우지 않아요. 외로움은 사랑할 곳이 있다는 신호예요.",
            en: "You do not have to fill the emptiness by force. Loneliness is a sign that your heart has love to give."
          }
        },
        {
          title: { ko: "짧은 기도", en: "A short prayer" },
          text: {
            ko: "“주님, 제 곁에 계신 것을 알게 해 주세요. 이 시간을 함께해 주세요.”",
            en: "“Lord, let me know you are beside me. Stay with me now.”"
          }
        },
        {
          title: { ko: "한 사람 떠올리기", en: "One person" },
          text: {
            ko: "떠오르는 한 사람을 위해 짧게 기도하고, “주님은 마음이 꺾인 이들에게 가까이 계시고”(시편 34,19)로 마무리해요.",
            en: "Pray briefly for one person who comes to mind, and close with “The Lord is close to the brokenhearted” (Psalm 34:18)."
          }
        }
      ],
      joyful: [
        {
          title: { ko: "기쁨에 머물기", en: "Stay with the joy" },
          text: {
            ko: "오늘 웃음이 났던 순간을 하나 떠올리며 숨을 천천히 쉬어요.",
            en: "Remember one moment today when you smiled, and breathe slowly."
          }
        },
        {
          title: { ko: "기쁨의 출처", en: "Where it came from" },
          text: {
            ko: "이 기쁨이 어디서 왔는지 잠깐 생각해 봐요. 혼자 만든 것이 아닐 수도 있어요.",
            en: "Wonder for a moment where this joy came from. You may not have made it alone."
          }
        },
        {
          title: { ko: "짧은 기도", en: "A short prayer" },
          text: {
            ko: "“주님, 이 기쁨을 주셔서 감사합니다. 이 마음을 오래 간직하게 도와주세요.”",
            en: "“Lord, thank you for this joy. Help me keep it.”"
          }
        },
        {
          title: { ko: "나눔으로 마무리", en: "Close by sharing" },
          text: {
            ko: "그 기쁨을 나눌 한 사람을 떠올리며 축복하고 ‘아멘’.",
            en: "Think of one person to share it with, bless them, and close with “Amen.”"
          }
        }
      ]
    }
  };

  /* -------------------------------------------------- 1-minute breathing */
  /* The mind-care mode's minute: no scripture and no prayer, only the body,
     the breath and one kind sentence to oneself. Same sixty seconds and the
     same four-step rhythm as the prayer, so the sheet feels like the app. */
  var MINDFUL_MINUTE = {
    seconds: 60,
    steps: [
      {
        title: { ko: "자리 잡기", en: "Settle in" },
        text: {
          ko: "의자에 편하게 앉아 발바닥을 바닥에 두고, 어깨의 힘을 천천히 빼 보세요. 지금 여기에 있는 것만으로 충분해요.",
          en: "Sit comfortably, rest your feet on the floor, and let your shoulders drop. Being here is already enough."
        }
      },
      {
        title: { ko: "숨 알아차리기", en: "Notice the breath" },
        text: {
          ko: "코로 천천히 들이쉬고, 조금 길게 내쉬어요. 숨이 들어오고 나가는 감각에만 마음을 두어 보세요.",
          en: "Breathe in slowly through your nose, and out a little longer. Keep your attention on the breath coming and going."
        }
      },
      {
        title: { ko: "몸의 감각", en: "Feel the body" },
        text: {
          ko: "손바닥과 발바닥에서 느껴지는 온기를 알아차려요. 생각이 흘러가면, 다시 숨으로 돌아오면 됩니다.",
          en: "Notice the warmth in your palms and the soles of your feet. When thoughts drift, just come back to the breath."
        }
      },
      {
        title: { ko: "한마디 건네기", en: "One kind word" },
        text: {
          ko: "지금 내 마음에 ‘잘하고 있어요’라고 한마디 건네고, 천천히 눈을 떠 보세요.",
          en: "Say to yourself, “you are doing fine,” and open your eyes slowly."
        }
      }
    ]
  };

  /* ------------------------------------------------------ meditation mode */
  /* Four things to rest on, and the 4-2-6 rhythm the breathing guide follows:
     the circle fills on the in-breath, waits, and empties on the out-breath.
     Twelve seconds a breath, so the count is the same whether the reader is on
     a Korean phone or an English one. */
  var MEDITATION = {
    cycle: { inhale: 4, hold: 2, exhale: 6 },
    durations: [3, 5, 10],
    defaultDuration: 10,
    topics: [
      { key: "breath", label: "med.topic.breath", guide: "med.guide.breath" },
      { key: "mindful", label: "med.topic.mindful", guide: "med.guide.mindful" },
      { key: "body", label: "med.topic.body", guide: "med.guide.body" },
      { key: "gratitude", label: "med.topic.gratitude", guide: "med.guide.gratitude" }
    ]
  };

  /* The four steps for a given heart; the generic set when none is chosen. */
  function minuteStepsFor(moodKey) {
    var set = moodKey ? MINUTE_PRAYER.byMood[moodKey] : null;
    return set && set.length ? set : MINUTE_PRAYER.steps;
  }

  var DATA = {
    ui: UI,
    moods: MOODS,
    prayers: PRAYERS,
    mysteries: MYSTERIES,
    verses: VERSES,
    coachThemes: COACH_THEMES,
    coachThemeOrder: ["tired", "anxious", "guilt", "lonely", "family", "grateful", "lost", "sad"],
    minute: MINUTE_PRAYER,
    minuteStepsFor: minuteStepsFor,
    mindfulMinute: MINDFUL_MINUTE,
    mindLines: MIND_LINES,
    meditation: MEDITATION,
    langs: ["ko", "en"],
    defaults: { lang: "ko", mystery: "joyful", piAmount: 1 }
  };

  root.SS_DATA = DATA;
  if (typeof module !== "undefined" && module.exports) module.exports = DATA;
})(typeof window !== "undefined" ? window : globalThis);
