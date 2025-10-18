import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookSearchInput } from './BookSearchInput';
import { BookCopy, Sparkles, Search } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function HomePage() {
  const navigate = useNavigate();
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);

  const handleAddBook = (book: string) => {
    if (selectedBooks.length >= 3) {
      toast.error('Maximum of 3 books reached. Please remove a book before adding another one.', { duration: 3000 });
      return;
    }
    if (selectedBooks.includes(book)) {
      toast.error('This book is already added');
      return;
    }
    setSelectedBooks([...selectedBooks, book]);
    toast.success('Book added!', { duration: 1500 });
  };

  const handleRemoveBook = (index: number) => {
    setSelectedBooks(selectedBooks.filter((_, i) => i !== index));
  };

  const handleRegularSearch = () => {
    if (selectedBooks.length === 0) {
      toast.error('Please add at least one book');
      return;
    }
    navigate('/results', { state: { books: selectedBooks, personalized: false } });
  };

  const handlePersonalizedSearch = () => {
    if (selectedBooks.length === 0) {
      toast.error('Please add at least one book');
      return;
    }
    navigate('/quiz', { state: { books: selectedBooks } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-orange-100/20 rounded-full blur-3xl"></div>
      
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

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <h2 className="text-black mb-4 text-3xl tracking-tight font-[Jomolhari] font-bold text-[48px]">Discover Your Next Great Read</h2>
            <p className="text-[#4A6163]/70 text-lg">
              Enter up to 3 books you love, and we'll find your perfect next book
            </p>
          </div>

          {/* Book Search Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-[#4A6163]/10">
            <BookSearchInput 
              onSelectBook={handleAddBook} 
              disabled={selectedBooks.length >= 3}
            />

            {/* Selected Books */}
            {selectedBooks.length > 0 && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[#4A6163] font-medium">
                    Selected Books ({selectedBooks.length}/3)
                  </p>
                </div>
                
                {selectedBooks.map((book, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between bg-gradient-to-r from-[#FFC94B]/20 to-[#F9A66C]/20 rounded-2xl p-4 border border-[#F9A66C]/30 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-orange-600" />
                      <span className="text-[rgb(0,0,0)] font-medium">{book}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveBook(index)}
                      className="text-[#4A6163]/40 hover:text-[#F17A7E] transition-colors text-2xl leading-none cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleRegularSearch}
                disabled={selectedBooks.length === 0}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-14 shadow-lg hover:shadow-xl transition-all text-base font-semibold cursor-pointer"
              >
                <Search className="w-5 h-5 mr-2" />
                Quick Search
              </Button>
              
              <Button
                onClick={handlePersonalizedSearch}
                disabled={selectedBooks.length === 0}
                className="flex-1 bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white h-14 shadow-lg hover:shadow-xl transition-all text-base font-semibold cursor-pointer"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Personalized Search
              </Button>
            </div>

            <p className="text-center text-[#4A6163]/60 mt-5">
              Use Personalized Search for tailored recommendations based on your preferences
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}