import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// Mock book database
const MOCK_BOOKS = [
  'To Kill a Mockingbird',
  '1984',
  'Pride and Prejudice',
  'The Great Gatsby',
  'Harry Potter and the Sorcerer\'s Stone',
  'The Lord of the Rings',
  'The Catcher in the Rye',
  'Animal Farm',
  'The Hobbit',
  'Jane Eyre',
  'Brave New World',
  'The Chronicles of Narnia',
  'The Hunger Games',
  'Twilight',
  'The Da Vinci Code',
  'Gone Girl',
  'The Fault in Our Stars',
  'Divergent',
  'The Girl with the Dragon Tattoo',
  'The Alchemist',
  'The Book Thief',
  'Educated',
  'Becoming',
  'Where the Crawdads Sing',
  'Circe',
  'The Silent Patient',
  'Project Hail Mary',
  'The Midnight Library',
  'Klara and the Sun',
  'The Seven Husbands of Evelyn Hugo',
];

interface BookSearchInputProps {
  onSelectBook: (book: string) => void;
  disabled?: boolean;
}

export function BookSearchInput({ onSelectBook, disabled }: BookSearchInputProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      const filtered = MOCK_BOOKS.filter(book =>
        book.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectBook = (book: string) => {
    onSelectBook(book);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#4A6163]/50" />
        <Input
          type="text"
          placeholder="Search for a book..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => query && setShowSuggestions(true)}
          disabled={disabled}
          className="pl-10 h-14 text-base border-[#4A6163]/20 focus:border-[#F9A66C] bg-[#F9FAF4] focus:bg-white transition-colors"
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-[#4A6163]/20 max-h-64 overflow-y-auto z-20">
          {suggestions.map((book, index) => (
            <button
              key={index}
              onClick={() => handleSelectBook(book)}
              className="w-full text-left px-4 py-3 hover:bg-[#FFC94B]/20 transition-colors border-b border-[#4A6163]/10 last:border-b-0 cursor-pointer"
            >
              <span className="text-[#4A6163] font-medium">{book}</span>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && query && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-[#4A6163]/20 p-4 z-20">
          <p className="text-[#4A6163]/60 text-center">No books found</p>
        </div>
      )}
    </div>
  );
}