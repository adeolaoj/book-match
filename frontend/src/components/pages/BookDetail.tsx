import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookCopy, ArrowLeft, Star, ExternalLink, ShoppingCart, Library } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

// Mock reviews data
const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Sarah M.',
    rating: 5,
    text: 'Absolutely mesmerizing! This book transported me to another world. The prose is beautiful and the story is captivating from start to finish.',
    date: 'October 10, 2024',
  },
  {
    id: '2',
    author: 'James K.',
    rating: 4,
    text: 'A wonderful read with rich characters and an intricate plot. Took me a while to get into it, but once I did, I couldn\'t put it down.',
    date: 'September 28, 2024',
  },
  {
    id: '3',
    author: 'Emma L.',
    rating: 5,
    text: 'One of the best books I\'ve read this year. The world-building is exceptional and the writing style is truly unique.',
    date: 'September 15, 2024',
  },
  {
    id: '4',
    author: 'Michael R.',
    rating: 4,
    text: 'Beautiful storytelling with a magical atmosphere. Some parts felt a bit slow, but overall a fantastic experience.',
    date: 'August 30, 2024',
  },
];

export function BookDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const book = location.state?.book;
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!book) {
      navigate('/');
    }
  }, [book, navigate]);

  if (!book) {
    return null;
  }

  // Mock official synopsis - in a real app this would come from the book data
  const officialSynopsis = book.synopsis || "In this captivating tale, the author weaves a rich tapestry of emotion, adventure, and discovery. The story follows unforgettable characters through a journey that will challenge everything they thought they knew about themselves and the world around them. With beautiful prose and masterful storytelling, this book has captured the hearts of readers worldwide. From the very first page to the stunning conclusion, you'll be transported to a world that feels both familiar and entirely new. A must-read for anyone who loves deeply moving, thought-provoking literature that stays with you long after you've turned the final page.";

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-[#FFC94B] text-[#FFC94B]'
                : 'text-[#4A6163]/20'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#4A6163]/10 sticky top-0 z-10 shadow-sm">
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
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Info Section */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden sticky top-24 border-[#4A6163]/15 shadow-xl bg-white/95 backdrop-blur-sm">
              <div className="aspect-[4/3] bg-[#F9FAF4]">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-black mb-2 text-3xl font-bold font-[Jomolhari]">{book.title}</h2>
                <p className="text-[#4A6163]/70 mb-4 text-lg">by {book.author}</p>
                
                <div className="flex items-center gap-2 mb-4">
                  {renderStars(Math.round(book.rating))}
                  <span className="text-[#4A6163] font-medium">{book.rating}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {book.genres.map((genre: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="bg-[#F9FAF4] text-[#4A6163] border border-[#4A6163]/10">
                      {genre}
                    </Badge>
                  ))}
                </div>

                <Separator className="my-6" />

                {/* Purchase/Borrow Options */}
                <div className="space-y-3">
                  <h3 className="text-black text-xl font-bold font-[Jomolhari]">Get This Book</h3>
                  
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 shadow-lg hover:shadow-xl transition-shadow font-semibold">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy on Amazon
                  </Button>
                  
                  <Button variant="outline" className="w-full border-orange-300/50 hover:bg-orange-50 text-[#4A6163] font-medium">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Buy on Bookshop.org
                  </Button>
                  
                  <Button variant="outline" className="w-full border-orange-300/50 hover:bg-orange-50 text-[#4A6163] font-medium">
                    <Library className="w-4 h-4 mr-2" />
                    Find at Local Library
                  </Button>
                  
                  <Button variant="outline" className="w-full border-orange-300/50 hover:bg-orange-50 text-[#4A6163] font-medium">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Check Kindle Unlimited
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Reviews Section */}
          <div className="lg:col-span-2">
            <Card className="p-6 mb-6 border-[#4A6163]/15 shadow-lg bg-white/95 backdrop-blur-sm">
              <h3 className="text-black mb-4 text-2xl font-bold font-[Jomolhari]">About This Book</h3>
              <div className="relative">
                <p className={`text-[#4A6163]/80 leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
                  {officialSynopsis}
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-[#F9A66C] hover:text-[#F9A66C]/80 hover:bg-transparent p-0 h-auto font-medium cursor-pointer"
                >
                  {isExpanded ? 'Read Less' : 'Read More'}
                </Button>
              </div>
              {book.matchScore && (
                <div className="mt-4 p-4 bg-gradient-to-r from-[#FFC94B]/20 to-[#F9A66C]/20 rounded-2xl border border-[#F9A66C]/30 shadow-sm">
                  <div className="flex items-start gap-2">
                    <Badge className="bg-[#F9A66C] shadow-sm font-semibold shrink-0">{book.matchScore}% Match</Badge>
                    <span className="text-[#4A6163]/80 leading-relaxed">
                      {book.matchReason || "This book is a great match based on your preferences!"}
                    </span>
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6 border-[#4A6163]/15 shadow-lg bg-white/95 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-black text-2xl font-bold font-[Jomolhari]">Goodreads Reviews</h3>
                <Button variant="outline" size="sm" className="border-[#4A6163]/20 hover:bg-[#FFC94B]/20 text-[#4A6163] font-medium" asChild>
                  <a href="https://www.goodreads.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Goodreads
                  </a>
                </Button>
              </div>

              <div className="space-y-6">
                {MOCK_REVIEWS.map((review) => (
                  <div key={review.id} className="border-b border-[#4A6163]/10 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-[#4A6163] font-semibold">{review.author}</p>
                        <p className="text-sm text-[#4A6163]/60">{review.date}</p>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-[#4A6163]/80 leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Button variant="outline" className="border-[#4A6163]/20 hover:bg-[#FFC94B]/20 text-[#4A6163] font-medium" asChild>
                  <a href="https://www.goodreads.com" target="_blank" rel="noopener noreferrer">
                    Read More Reviews on Goodreads
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}