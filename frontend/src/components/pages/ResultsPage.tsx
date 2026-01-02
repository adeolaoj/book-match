import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookCopy, ArrowLeft, Star, TrendingUp, Sparkles } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  description: string;
  genres: string[];
  matchScore?: number;
  matchReason?: string;
}

// Mock recommendation data
const MOCK_RECOMMENDATIONS: Book[] = [
  {
    id: '1',
    title: 'The Night Circus',
    author: 'Erin Morgenstern',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
    rating: 4.5,
    description: 'A mesmerizing tale of two young magicians bound in competition, set in a mysterious circus that appears without warning.',
    genres: ['Fantasy', 'Romance', 'Historical Fiction'],
    matchScore: 98,
  },
  {
    id: '2',
    title: 'The Shadow of the Wind',
    author: 'Carlos Ruiz Zafón',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop',
    rating: 4.7,
    description: 'A literary thriller set in post-war Barcelona about a boy who discovers a mysterious book that changes his life.',
    genres: ['Mystery', 'Historical Fiction', 'Literary Fiction'],
    matchScore: 96,
  },
  {
    id: '3',
    title: 'The Starless Sea',
    author: 'Erin Morgenstern',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop',
    rating: 4.3,
    description: 'A love letter to stories and storytelling, about a graduate student who discovers a mysterious book that leads him to an underground library.',
    genres: ['Fantasy', 'Literary Fiction'],
    matchScore: 94,
  },
  {
    id: '4',
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop',
    rating: 4.6,
    description: 'The tale of the legendary Kvothe, from his childhood in a troupe of traveling players to his years as a fugitive.',
    genres: ['Fantasy', 'Adventure'],
    matchScore: 92,
  },
  {
    id: '5',
    title: 'The Ten Thousand Doors of January',
    author: 'Alix E. Harrow',
    cover: 'https://images.unsplash.com/photo-1495640452828-3df6795cf69b?w=300&h=450&fit=crop',
    rating: 4.4,
    description: 'A story about a young woman who discovers mysterious portals to other worlds in early 1900s America.',
    genres: ['Fantasy', 'Historical Fiction'],
    matchScore: 90,
  },
  {
    id: '6',
    title: 'The Invisible Life of Addie LaRue',
    author: 'V.E. Schwab',
    cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=450&fit=crop',
    rating: 4.5,
    description: 'A woman makes a Faustian bargain to live forever but is cursed to be forgotten by everyone she meets.',
    genres: ['Fantasy', 'Romance', 'Historical Fiction'],
    matchScore: 89,
  },
  {
    id: '7',
    title: 'Mexican Gothic',
    author: 'Silvia Moreno-Garcia',
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=450&fit=crop',
    rating: 4.2,
    description: 'A gothic horror novel set in 1950s Mexico about a socialite who travels to the countryside to investigate disturbing letters.',
    genres: ['Horror', 'Mystery', 'Historical Fiction'],
    matchScore: 87,
  },
  {
    id: '8',
    title: 'Piranesi',
    author: 'Susanna Clarke',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop',
    rating: 4.6,
    description: 'A haunting story about a man living in a mysterious house full of thousands of rooms and endless corridors.',
    genres: ['Fantasy', 'Mystery'],
    matchScore: 86,
  },
];

export function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { books, personalized, recommendations } = location.state || { books: [], personalized: false, recommendations: null };
  const [hoveredBookId, setHoveredBookId] = useState<string | null>(null);

  useEffect(() => {
    if (books.length === 0) {
      navigate('/');
    }
  }, [books.length, navigate]);

  if (books.length === 0) {
    return null;
  }

  const topRecommendations = recommendations ? recommendations.map((rec: any) => ({
    ...rec,
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop', // default cover
    rating: 4.0, // default rating
    description: 'A recommended book based on your preferences.',
    genres: [],
  })) : MOCK_RECOMMENDATIONS.slice(0, 5);
  
  // Extended recommendations with match reasons
  const extendedRecommendations = [
    {
      id: '9',
      title: 'Circe',
      author: 'Madeline Miller',
      cover: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=300&h=450&fit=crop',
      rating: 4.5,
      description: 'A stunning reimagining of Greek mythology following the witch Circe.',
      genres: ['Fantasy', 'Mythology'],
      matchScore: 85,
      matchReason: 'Similar lyrical prose and character-focused storytelling, though mythology themes are more prominent than your usual reads.'
    },
    {
      id: '10',
      title: 'The Golem and the Jinni',
      author: 'Helene Wecker',
      cover: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=450&fit=crop',
      rating: 4.3,
      description: 'A magical tale of two mythical creatures in 1899 New York.',
      genres: ['Fantasy', 'Historical Fiction'],
      matchScore: 83,
      matchReason: 'The dual narrative structure differs from your preferences, but the magical realism and immigrant themes add depth similar to your selections.'
    },
    {
      id: '11',
      title: 'The Bear and the Nightingale',
      author: 'Katherine Arden',
      cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=450&fit=crop',
      rating: 4.4,
      description: 'A fairy tale set in medieval Russia blending folklore with coming-of-age.',
      genres: ['Fantasy', 'Folklore'],
      matchScore: 82,
      matchReason: 'Features stronger folkloric elements than you typically read, but the atmospheric world-building matches your taste.'
    },
    {
      id: '12',
      title: 'The Song of Achilles',
      author: 'Madeline Miller',
      cover: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=300&h=450&fit=crop',
      rating: 4.6,
      description: 'A retelling of the Iliad from Patroclus\' perspective.',
      genres: ['Fantasy', 'Romance'],
      matchScore: 81,
      matchReason: 'Romance takes center stage more than in your usual picks, though the emotional storytelling aligns with your preferences.'
    },
    {
      id: '13',
      title: 'The Priory of the Orange Tree',
      author: 'Samantha Shannon',
      cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop',
      rating: 4.4,
      description: 'An epic standalone fantasy with dragons and political intrigue.',
      genres: ['Fantasy', 'Adventure'],
      matchScore: 79,
      matchReason: 'More action-oriented with a larger cast than you typically enjoy, but shares the intricate world-building you appreciate.'
    },
    {
      id: '14',
      title: 'Uprooted',
      author: 'Naomi Novik',
      cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop',
      rating: 4.2,
      description: 'A dark fantasy inspired by Eastern European folklore.',
      genres: ['Fantasy', 'Romance'],
      matchScore: 78,
      matchReason: 'The darker tone and faster pacing differ slightly from your selections, but the fairy tale influence resonates with your taste.'
    },
    {
      id: '15',
      title: 'The City of Brass',
      author: 'S.A. Chakraborty',
      cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop',
      rating: 4.3,
      description: 'A thrilling adventure set in 18th century Cairo with djinn and magic.',
      genres: ['Fantasy', 'Historical Fiction'],
      matchScore: 77,
      matchReason: 'More complex world-building and political intrigue than your usual reads, but the magical setting aligns with your interests.'
    },
    {
      id: '16',
      title: 'The Witch\'s Heart',
      author: 'Genevieve Gornichec',
      cover: 'https://images.unsplash.com/photo-1495640452828-3df6795cf69b?w=300&h=450&fit=crop',
      rating: 4.1,
      description: 'A Norse mythology retelling from the perspective of the witch Angrboda.',
      genres: ['Fantasy', 'Mythology'],
      matchScore: 76,
      matchReason: 'Norse mythology focus is different from your typical choices, though the character-driven narrative fits your style.'
    },
    {
      id: '17',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=450&fit=crop',
      rating: 4.2,
      description: 'A library between life and death where each book is a different life you could have lived.',
      genres: ['Fantasy', 'Contemporary'],
      matchScore: 75,
      matchReason: 'Contemporary setting differs from historical fantasy you prefer, but the philosophical themes and unique premise may appeal to you.'
    },
  ];

  const handleBookClick = (book: Book) => {
    navigate(`/book/${book.id}`, { state: { book } });
  };

  const getMatchReason = (book: Book) => {
    const reasons = [
      'Strong character development matches your preferences',
      'Similar writing style to your favorite books',
      'Highly rated by readers who enjoyed your selections',
      'Explores themes you\'ve shown interest in',
      'Author known for similar storytelling approach',
    ];
    return reasons[parseInt(book.id) % reasons.length];
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-orange-100/20 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#4A6163]/10 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <BookCopy className="w-7 h-7 text-orange-600" />
            <h1 className="text-black text-2xl font-bold font-[Jomolhari]">BookMatch</h1>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 cursor-pointer hover:bg-gradient-to-r hover:from-orange-300 hover:to-rose-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          New Search
        </Button>

        {/* Search Info */}
        <div className="text-center mb-8">
          <h2 className="text-black mb-3 font-[Jomolhari] text-4xl flex items-center justify-center gap-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#F9A66C] to-[#F17A7E] rounded-full shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            {personalized ? 'Personalized Recommendations' : 'Recommendations'} based on:
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {books.map((book: string, index: number) => (
              <span key={index} className="px-4 py-2 bg-gradient-to-r from-[#FFC94B]/20 to-[#F9A66C]/20 text-[rgb(0,0,0)] rounded-full font-medium">
                {book}
              </span>
            ))}
          </div>
        </div>

        {/* Top 5 Recommendations */}
        <section className="mb-16">
          
          <div className="grid grid-cols-5 gap-6">
            {topRecommendations.map((book: Book) => (
              <Card
                key={book.id}
                onClick={() => handleBookClick(book)}
                className="overflow-hidden hover:shadow-[0_0_20px_rgba(251,146,60,0.15),0_0_40px_rgba(244,114,182,0.08)] transition-all duration-300 cursor-pointer group border-[1.5px] border-[#4A6163]/15 bg-white/95 backdrop-blur-sm hover:scale-[1.02] hover:border-orange-500 rounded-xl"
              >
                <div className="aspect-[3/4] relative overflow-hidden bg-[#F9FAF4]">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {book.matchScore && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-[#F9A66C] hover:bg-[#F9A66C]/90 text-white shadow-md text-xs font-semibold rounded-full px-3 py-1">
                        {book.matchScore}% Match
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="text-black mb-1 line-clamp-2 font-bold">{book.title}</h4>
                  <p className="text-[#4A6163]/70 text-sm mb-2">{book.author}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-[#FFC94B] text-[#FFC94B]" />
                    <span className="text-sm text-[#4A6163] font-medium">{book.rating}</span>
                  </div>
                  <p className="text-xs text-[#F9A66C] italic mb-2 line-clamp-2">
                    {getMatchReason(book)}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {book.genres.slice(0, 2).map((genre, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-[#F9FAF4] text-[#4A6163] border border-[#4A6163]/10">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Other Recommendations */}
        <section>
          <h3 className="text-black mb-6 text-3xl font-bold font-[Jomolhari]">More Recommendations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {extendedRecommendations.map((book) => (
              <Card
                key={book.id}
                onClick={() => handleBookClick(book)}
                className="overflow-hidden hover:shadow-[0_0_20px_rgba(251,146,60,0.15),0_0_40px_rgba(244,114,182,0.08)] transition-all duration-300 cursor-pointer group border-[1.5px] border-[#4A6163]/15 bg-white/95 backdrop-blur-sm hover:border-orange-500 rounded-xl flex flex-col"
              >
                <div className="flex gap-3 p-3 pb-1">
                  <div className="w-20 h-20 flex-shrink-0 bg-[#F9FAF4] overflow-hidden rounded-lg">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {book.matchReason && (
                    <p className="text-xs text-[#4A6163]/70 italic line-clamp-4 flex-1">
                      {book.matchReason}
                    </p>
                  )}
                </div>
                <div className="px-3 pb-3 pt-1.5 border-t border-[#4A6163]/10">
                  <h4 className="text-black mb-1 line-clamp-1 font-bold">{book.title}</h4>
                  <p className="text-[#4A6163]/70 text-xs mb-2">{book.author}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-[#FFC94B] text-[#FFC94B]" />
                      <span className="text-xs text-[#4A6163] font-medium">{book.rating}</span>
                    </div>
                    {book.matchScore && (
                      <span className="text-xs text-[#F9A66C] font-medium">{book.matchScore}% match</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}