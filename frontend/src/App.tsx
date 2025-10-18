import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@/components/pages/HomePage';
import { PersonalizedQuiz } from '@/components/pages/PersonalizedQuiz';
import { ResultsPage } from './components/pages/ResultsPage';
import { BookDetail } from '@/components/pages/BookDetail';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-orange-50/40 via-amber-50/30 to-stone-50/50">
        <Toaster />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz" element={<PersonalizedQuiz />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
