import {Router} from 'express';
import { RecommendationInput } from '../../../shared/recommendation';

// Mock book pool for temporary use
const MOCK_BOOK_POOL: CandidateBook[] = [
  {
    title: 'The Night Circus',
    author: 'Erin Morgenstern',
    genres: ['Fantasy', 'Romance', 'Historical Fiction'],
    matchScore: 0,
  },
  {
    title: 'The Shadow of the Wind',
    author: 'Carlos Ruiz Zafón',
    genres: ['Mystery', 'Historical Fiction', 'Literary Fiction'],
    matchScore: 0,
  },
  {
    title: 'The Starless Sea',
    author: 'Erin Morgenstern',
    genres: ['Fantasy', 'Literary Fiction'],
    matchScore: 0,
  },
  {
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    genres: ['Fantasy', 'Adventure'],
    matchScore: 0,
  },
  {
    title: 'The Ten Thousand Doors of January',
    author: 'Alix E. Harrow',
    genres: ['Fantasy', 'Historical Fiction'],
    matchScore: 0,
  },
  {
    title: 'The Invisible Life of Addie LaRue',
    author: 'V.E. Schwab',
    genres: ['Fantasy', 'Romance', 'Historical Fiction'],
    matchScore: 0,
  },
  {
    title: 'Mexican Gothic',
    author: 'Silvia Moreno-Garcia',
    genres: ['Horror', 'Mystery', 'Historical Fiction'],
    matchScore: 0,
  },
  {
    title: 'Piranesi',
    author: 'Susanna Clarke',
    genres: ['Fantasy', 'Mystery'],
    matchScore: 0,
  },
  {
    title: 'Circe',
    author: 'Madeline Miller',
    genres: ['Fantasy', 'Mythology'],
    matchScore: 0,
  },
  {
    title: 'The Golem and the Jinni',
    author: 'Helene Wecker',
    genres: ['Fantasy', 'Historical Fiction'],
    matchScore: 0,
  },
  {
    title: 'The Bear and the Nightingale',
    author: 'Katherine Arden',
    genres: ['Fantasy', 'Folklore'],
    matchScore: 0,
  },
  {
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    genres: ['Fantasy', 'Romance'],
    matchScore: 0,
  },
  {
    title: 'The Priory of the Orange Tree',
    author: 'Samantha Shannon',
    genres: ['Fantasy', 'Adventure'],
    matchScore: 0,
  },
  {
    title: 'Uprooted',
    author: 'Naomi Novik',
    genres: ['Fantasy', 'Romance'],
    matchScore: 0,
  },
  {
    title: 'The City of Brass',
    author: 'S.A. Chakraborty',
    genres: ['Fantasy', 'Historical Fiction'],
    matchScore: 0,
  },
  {
    title: 'The Witch\'s Heart',
    author: 'Genevieve Gornichec',
    genres: ['Fantasy', 'Mythology'],
    matchScore: 0,
  },
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genres: ['Fantasy', 'Contemporary'],
    matchScore: 0,
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genres: ['Classic', 'Literary Fiction'],
    matchScore: 0,
  },
  {
    title: '1984',
    author: 'George Orwell',
    genres: ['Dystopian', 'Science Fiction'],
    matchScore: 0,
  },
];

// Create a router instance
const router = Router();

// Define a POST endpoint for recommendations
router.post('/', (req, res) => {

    // Extract input from request body
    const input = req.body as RecommendationInput;

    const preprocessed = preprocessInput(input);
    const candidates = getCandidateBooks(preprocessed);

    const recommendations = candidates.slice(0, 10).map((book, i) => ({
        id: i,
        title: book.title,
        author: book.author,
        matchScore: 80 + Math.floor(Math.random() * 20),
        matchReason: 'Matched based on selected genres.'
    })); // top 10 candidates

    console.log('Seed Books:', input.seedBooks);
  
    // Sample response with dummy recommendations
    res.json({recommendations});

});

// Preprocess input data
function preprocessInput(input: RecommendationInput) {
    return {
        seedBooks: input.seedBooks.map(book => book.trim().toLowerCase()),
        preferences: {
            ...input.quizAnswers,
            genres: input.quizAnswers?.genres?.map(genre => genre.toLowerCase())
        }
    };
}

type CandidateBook = {
  title: string;
  author: string;
  genres: string[];
  matchScore: number;
};

// Simple filtering based on genres to get candidate books (not yet AI-based)
function getCandidateBooks(preprocessed: ReturnType<typeof preprocessInput>): CandidateBook[] {

  // TEMP: static pool
  return MOCK_BOOK_POOL.filter(book => {
    if (!preprocessed.preferences?.genres) return true;
    return book.genres.some(g =>
      preprocessed.preferences!.genres!.includes(g)
    );
  });
}


export default router