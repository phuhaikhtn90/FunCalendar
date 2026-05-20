window.STUDY_DATA = {
  childProfile: {
    name: "My child",
    age: 7,
    preferredDailyLoad: "3-4 clear and manageable tasks each day, with simple goals and a clear finish."
  },
  subjects: {
    english: { label: "English", className: "english" },
    math: { label: "Math", className: "math" },
    chinese: { label: "Chinese", className: "chinese" },
    chess: { label: "Chess", className: "chess" },
    microbit: { label: "Micro:bit", className: "microbit" },
    reading: { label: "Reading / discovery", className: "reading" }
  },
  resourceLibrary: [
    {
      title: "Peppa Pig Official",
      description: "Short videos that work well for listening practice and 2-3 sentence retelling.",
      url: "https://www.youtube.com/@PeppaPigOfficial"
    },
    {
      title: "Cambridge English Activities",
      description: "Structured practice ideas that fit the weekly Cambridge session.",
      url: "https://www.cambridgeenglish.org/learning-english/parents-and-children/activities-for-children/"
    },
    {
      title: "Lichess Practice",
      description: "Quick chess practice and puzzles, ideal for a 15-20 minute session.",
      url: "https://lichess.org/practice"
    },
    {
      title: "Micro:bit Projects",
      description: "Fun drag-and-drop projects and coding ideas for young learners.",
      url: "https://microbit.org/projects/make-it-code-it/"
    }
  ],
  monthlyThemes: {
    1: {
      title: "Animals and the world around us",
      focus: "Listening, observing, and building core vocabulary.",
      ideas: ["Read an animal picture book", "Draw one animal and tell 3 facts", "Watch a short science video"]
    },
    2: {
      title: "Family and feelings",
      focus: "Expressing thoughts, gratitude, and confidence in communication.",
      ideas: ["Tell a story about the happiest day", "Role-play a family conversation in English", "Read a book about emotions"]
    },
    3: {
      title: "Space and planets",
      focus: "Fueling imagination and curiosity with big why-questions.",
      ideas: ["Make a solar system model", "Watch a video about astronauts", "Read 5 fun facts about the moon"]
    },
    4: {
      title: "Mini science at home",
      focus: "Observing, predicting, and trying simple experiments.",
      ideas: ["Make a baking soda volcano", "Try a sink-or-float experiment", "Record results with drawings"]
    },
    5: {
      title: "Transportation",
      focus: "Expanding vocabulary and comparing how things move.",
      ideas: ["Sort vehicles by land, water, and air", "Build a paper vehicle model", "Tell a story about a dream trip"]
    },
    6: {
      title: "Summer discovery",
      focus: "Mixing light movement, reading, and creative projects.",
      ideas: ["Create a summer scrapbook", "Do an outdoor reading challenge", "Practice a 1-minute talk about a holiday"]
    },
    7: {
      title: "Cultures around the world",
      focus: "Exploring languages, food, and celebrations from different countries.",
      ideas: ["Learn one new flag each week", "Practice 5 greetings in Chinese", "Cook one simple dish with parents"]
    },
    8: {
      title: "Back to school",
      focus: "Rebuilding a steady and manageable learning routine.",
      ideas: ["Organize the study corner", "Review visual note-taking", "Set a goal for the new month"]
    },
    9: {
      title: "Plants and nature",
      focus: "Observing change and learning how to care for living things.",
      ideas: ["Plant a mini seedling", "Measure plant height each week", "Read a book about forests and nature"]
    },
    10: {
      title: "Creative storytelling",
      focus: "Combining speaking, reading, writing, and drawing in one flow.",
      ideas: ["Make a 4-panel comic story", "Dub a character voice", "Retell one story using simple multilingual phrases"]
    },
    11: {
      title: "Logic and puzzles",
      focus: "Building problem-solving and thinking skills.",
      ideas: ["Solve a number puzzle", "Play with tangram shapes", "Make a Micro:bit guessing game"]
    },
    12: {
      title: "Year-end celebration projects",
      focus: "Bringing skills together and feeling proud of progress.",
      ideas: ["Make a mini achievement board", "Choose 3 favorite books", "Record a short video about what was learned"]
    }
  },
  recurringTemplates: [
    {
      id: "eng-peppa-mon",
      subject: "english",
      title: "Watch Peppa Pig and retell it",
      note:
        "Watch one 4-6 minute clip. Suggested steps: 1) listen without subtitles, 2) watch again with subtitles, 3) note 3 new words, 4) answer 3 questions: who, where, what happened, 5) retell it in 2-4 sentences.",
      weekday: 1,
      link: "https://www.youtube.com/@PeppaPigOfficial"
    },
    {
      id: "chinese-mon",
      subject: "chinese",
      title: "Chinese daily topic practice",
      note: "Learn 6-8 words, practice 2 sentence patterns, repeat after audio, and point to matching pictures.",
      weekday: 1,
      link: ""
    },
    {
      id: "math-tue",
      subject: "math",
      title: "Fun thinking math",
      note: "15-20 minutes. Mix addition-subtraction, short word problems, and one small logic game.",
      weekday: 1,
      link: ""
    },
    {
      id: "english-gemini-tue",
      subject: "english",
      title: "Speak English with Gemini",
      note:
        "Suggested topics: introduce yourself, favorite objects, animals, or today’s activities. Goal: speak in short sentences and handle 4-5 back-and-forth turns.",
      weekday: 2,
      link: "https://gemini.google.com/"
    },
    {
      id: "chess-tue",
      subject: "chess",
      title: "Chess: short tactics practice",
      note: "Learn a key move idea, solve 3-5 easy puzzles, then play one short game.",
      weekday: 2,
      link: "https://lichess.org/practice"
    },
    {
      id: "chinese-tue",
      subject: "chinese",
      title: "Chinese listening and speaking",
      note: "Repeat a short audio line, read along, and match vocabulary to pictures.",
      weekday: 2,
      link: ""
    },
    {
      id: "cambridge-wed",
      subject: "english",
      title: "Cambridge practice",
      note: "Once a week. Choose one light section such as phonics, vocabulary, a speaking card, or a short 20-minute worksheet.",
      weekday: 3,
      link: "https://www.cambridgeenglish.org/learning-english/parents-and-children/activities-for-children/"
    },
    {
      id: "chinese-wed",
      subject: "chinese",
      title: "Chinese character recognition and writing",
      note: "Choose 4-6 characters to recognize, trace, color, and explain through pictures.",
      weekday: 3,
      link: ""
    },
    {
      id: "microbit-wed",
      subject: "microbit",
      title: "Micro:bit mini project",
      note: "Build one 20-minute project such as a heart icon, timer, guessing game, or shake sensor activity.",
      weekday: 3,
      link: "https://microbit.org/projects/make-it-code-it/"
    },
    {
      id: "reading-wed",
      subject: "reading",
      title: "Read or learn something new",
      note: "Choose one picture book or one short science video, then draw one thing you remember best.",
      weekday: 0,
      link: ""
    },
    {
      id: "english-dub-thu",
      subject: "english",
      title: "Character dubbing or shadowing",
      note: "Choose 30-60 seconds of dialogue. Listen twice, copy the voice, and try acting as the character.",
      weekday: 4,
      link: "https://www.youtube.com/@PeppaPigOfficial"
    },
    {
      id: "chinese-thu",
      subject: "chinese",
      title: "Chinese through songs or chants",
      note: "Learn with a short song, repeat with rhythm, and remember 5 key words.",
      weekday: 4,
      link: ""
    },
    {
      id: "chess-thu",
      subject: "chess",
      title: "Chess: opening basics",
      note: "Learn one opening principle and use it in one short practice game.",
      weekday: 4,
      link: "https://lichess.org/practice"
    },
    {
      id: "math-fri",
      subject: "math",
      title: "Applied math",
      note: "Use math in daily life: count money, measure length, read the calendar, or group objects.",
      weekday: 5,
      link: ""
    },
    {
      id: "english-gemini-fri",
      subject: "english",
      title: "Speak English with Gemini",
      note: "Practice role-play conversations. Gemini can act as a teddy bear, teacher, or friend.",
      weekday: 0,
      link: "https://gemini.google.com/"
    },
    {
      id: "chinese-fri",
      subject: "chinese",
      title: "Chinese weekly review",
      note: "Review 10 learned words, say 3 short sentences, and play a small vocabulary game.",
      weekday: 5,
      link: ""
    },
    {
      id: "reading-fri",
      subject: "reading",
      title: "Monthly theme discovery",
      note: "Do one fun activity linked to the monthly theme: draw, experiment, read, or watch a short video.",
      weekday: 5,
      link: ""
    },
    {
      id: "chinese-sat",
      subject: "chinese",
      title: "Light Chinese weekend practice",
      note: "Review with flashcards, household objects, colors, counting, or a point-and-name game.",
      weekday: 6,
      link: ""
    },
    {
      id: "microbit-sat",
      subject: "microbit",
      title: "Playful Micro:bit practice",
      note: "Redo a favorite project and change the icon, sounds, or score display.",
      weekday: 6,
      link: "https://microbit.org/projects/make-it-code-it/"
    },
    {
      id: "chess-sat",
      subject: "chess",
      title: "Fun chess game time",
      note: "Play 1-2 short games with a parent or computer, then look back at one nice move.",
      weekday: 6,
      link: "https://lichess.org/practice"
    },
    {
      id: "reading-sun",
      subject: "reading",
      title: "Free reading or fun experiment",
      note: "A lighter day. Choose a book, build Lego from a model, or watch a 10-minute science video and share one new idea.",
      weekday: 0,
      link: ""
    }
  ]
};
