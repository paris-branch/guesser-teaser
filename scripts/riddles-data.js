// Riddles data structure
// Each riddle has a number, reveal date, and answer
// Riddle text is stored in the HTML file for easy editing
// IMPORTANT: All answers must be DANCE NAMES from the Scottish Country Dance programs

const riddlesData = [
    {
        number: 1,
        date: '2026-07-20',
        answers: ["The Compleat Gardener"],
        program: 'Friday',
        position: 5,
        revealed: false
    },
    {
        number: 2,
        date: '2026-07-27',
        answers: ["Mairi's Wedding"],
        program: 'Saturday',
        position: 16,
        revealed: false
    },
    {
        number: 3,
        date: '2026-08-03',
        answers: ["One Set Short of a Hundred"],
        program: 'Saturday',
        position: 14,
        revealed: false
    },
    {
        number: 4,
        date: '2026-08-10',
        answers: ["The Duke and Duchess of Edinburgh"],
        program: 'Friday',
        position: 14,
        revealed: false
    },
    {
        number: 5,
        date: '2026-08-17',
        answers: ["General Stuart's Reel"],
        program: 'Friday',
        position: 7,
        revealed: false
    },
    {
        number: 6,
        date: '2026-08-24',
        answers: [""],
        revealed: false
    },
    {
        number: 7,
        date: '2026-08-31',
        answers: [""],
        revealed: false
    },
    {
        number: 8,
        date: '2026-09-07',
        answers: [""],
        revealed: false
    },
    {
        number: 9,
        date: '2026-09-14',
        answers: [""],
        revealed: false
    },
    {
        number: 10,
        date: '2026-09-21',
        answers: [""],
        revealed: false
    },
    {
        number: 11,
        date: '2026-09-28',
        answers: [""],
        revealed: false
    },
    {
        number: 12,
        date: '2026-10-05',
        answers: [""],
        revealed: false
    }
];

// Answer suggestions - Scottish Country Dance names from Friday and Saturday programs
const allAnswerSuggestions = [
    "A Fairy-Tale House",
    "Back to Back",
    "Farewell to Balfour Road",
    "General Stuart's Reel",
    "Jeannie Blue E'en",
    "Karin's Strathspey",
    "Kilt Swing",
    "La Tempête",
    "Le Béret Rose",
    "Let's Have Music and Dance",
    "Mairi's Wedding",
    "Midnight Oil",
    "Miss Allie Anderson",
    "One Set Short of a Hundred",
    "Quarries' Jig",
    "Ramadan-ce",
    "Rougemont Castle",
    "Salute to Glasgow",
    "Sibylle's Mother",
    "Sueno's Stone",
    "Summer Wooing",
    "Thank You Patricia",
    "The Compleat Gardener",
    "The Duke and Duchess of Edinburgh",
    "The Elephant's Stampede",
    "The Golden Sun of Early Spring",
    "The Grassmarket Reel",
    "The Rutland Reel",
    "The Waternish Tangle",
    "Ysobel Stewart of Fish Hoek"
];
