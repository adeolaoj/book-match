import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { BookCopy, ArrowLeft, ArrowRight, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { RecommendationInput } from '../../../../shared/recommendation';

interface QuizAnswers {
  aspect: string;
  genre: string[];
  pacing: string;
  length: string;
  additionalContext: string;
}

export function PersonalizedQuiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedBooks = location.state?.books || [];

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswers>({
    aspect: '',
    genre: [],
    pacing: '',
    length: '',
    additionalContext: '',
  });

  useEffect(() => {
    if (selectedBooks.length === 0) {
      navigate('/');
    }
  }, [selectedBooks.length, navigate]);

  if (selectedBooks.length === 0) {
    return null;
  }

  const totalSteps = 5; // 4 questions + 1 final elaboration

  const handleGenreToggle = (genre: string) => {
    setAnswers(prev => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre],
    }));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        if (!answers.aspect) {
          toast.error('Please select an option');
          return false;
        }
        break;
      case 1:
        if (answers.genre.length === 0) {
          toast.error('Please select at least one genre');
          return false;
        }
        break;
      case 2:
        if (!answers.pacing) {
          toast.error('Please select a pacing preference');
          return false;
        }
        break;
      case 3:
        if (!answers.length) {
          toast.error('Please select a book length preference');
          return false;
        }
        break;
      case 4:
        // Optional step, no validation needed
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);

    try {
      const formattedInput: RecommendationInput = {
        seedBooks: selectedBooks,
        quizAnswers: {
          aspects: answers.aspect === 'writing' ? 'writingStyle' : answers.aspect === 'world' ? 'worldBuilding' : answers.aspect as any,
          genres: answers.genre,
          pacing: answers.pacing === 'moderate' ? 'medium' : answers.pacing as any,
          length: answers.length === 'any' ? 'noPreference' : answers.length as any,
          additionalContext: answers.additionalContext || undefined,
        }
      };

      const response = await fetch('http://localhost:5000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedInput)
      });

      if (!response.ok) throw new Error('Failed to get recommendations');

      const data = await response.json();

      navigate('/results', { 
        state: { 
          books: selectedBooks, 
          personalized: true,
          recommendations: data.recommendations 
        } 
      });
    } catch (error) {
      toast.error('Failed to get recommendations. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCurrentStepAnswered = () => {
    switch (currentStep) {
      case 0:
        return !!answers.aspect;
      case 1:
        return answers.genre.length > 0;
      case 2:
        return !!answers.pacing;
      case 3:
        return !!answers.length;
      case 4:
        return true; // Optional step, always enabled
      default:
        return false;
    }
  };

  const renderQuestion = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="p-8 border-[#4A6163]/15 shadow-xl bg-white/95 backdrop-blur-sm">
            <h3 className="text-black mb-7 text-3xl font-bold font-[Jomolhari]">What did you like most about these books?</h3>
            <RadioGroup value={answers.aspect} onValueChange={(value) => setAnswers({ ...answers, aspect: value })}>
              <div className="space-y-3">
                {[
                  { value: 'characters', label: 'Deep, complex characters' },
                  { value: 'plot', label: 'Engaging plot and story' },
                  { value: 'writing', label: 'Beautiful writing style' },
                  { value: 'world', label: 'Rich world-building' },
                  { value: 'themes', label: 'Thought-provoking themes' },
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 p-4 rounded-2xl hover:bg-[#FFC94B]/20 transition-colors border border-transparent hover:border-[#F9A66C]/30 cursor-pointer">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="cursor-pointer flex-1 text-[#4A6163]">{option.label}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </Card>
        );

      case 1:
        return (
          <Card className="p-8 border-[#4A6163]/15 shadow-xl bg-white/95 backdrop-blur-sm">
            <h3 className="text-black mb-4 text-3xl font-bold font-[Jomolhari]">What genres interest you?</h3>
            <p className="text-[#4A6163]/70 mb-7">Select all that apply</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Fantasy',
                'Science Fiction',
                'Mystery',
                'Romance',
                'Thriller',
                'Historical Fiction',
                'Literary Fiction',
                'Contemporary',
              ].map((genre) => (
                <div key={genre} className="flex items-center space-x-3 p-4 rounded-2xl hover:bg-[#FFC94B]/20 transition-colors border border-transparent hover:border-[#F9A66C]/30 cursor-pointer">
                  <Checkbox
                    id={genre}
                    checked={answers.genre.includes(genre)}
                    onCheckedChange={() => handleGenreToggle(genre)}
                  />
                  <Label htmlFor={genre} className="cursor-pointer flex-1 text-[#4A6163]">{genre}</Label>
                </div>
              ))}
            </div>
          </Card>
        );

      case 2:
        return (
          <Card className="p-8 border-[#4A6163]/15 shadow-xl bg-white/95 backdrop-blur-sm">
            <h3 className="text-black mb-7 text-3xl font-bold font-[Jomolhari]">What pacing do you prefer?</h3>
            <RadioGroup value={answers.pacing} onValueChange={(value) => setAnswers({ ...answers, pacing: value })}>
              <div className="space-y-3">
                {[
                  { value: 'fast', label: 'Fast-paced and action-packed' },
                  { value: 'moderate', label: 'Balanced pacing' },
                  { value: 'slow', label: 'Slow and contemplative' },
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 p-4 rounded-2xl hover:bg-[#FFC94B]/20 transition-colors border border-transparent hover:border-[#F9A66C]/30 cursor-pointer">
                    <RadioGroupItem value={option.value} id={`pacing-${option.value}`} />
                    <Label htmlFor={`pacing-${option.value}`} className="cursor-pointer flex-1 text-[#4A6163]">{option.label}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </Card>
        );

      case 3:
        return (
          <Card className="p-8 border-[#4A6163]/15 shadow-xl bg-white/95 backdrop-blur-sm">
            <h3 className="text-black mb-7 text-3xl font-bold font-[Jomolhari]">Preferred book length?</h3>
            <RadioGroup value={answers.length} onValueChange={(value) => setAnswers({ ...answers, length: value })}>
              <div className="space-y-3">
                {[
                  { value: 'short', label: 'Short reads (< 300 pages)' },
                  { value: 'medium', label: 'Medium length (300-500 pages)' },
                  { value: 'long', label: 'Long books (> 500 pages)' },
                  { value: 'any', label: 'No preference' },
                ].map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 p-4 rounded-2xl hover:bg-[#FFC94B]/20 transition-colors border border-transparent hover:border-[#F9A66C]/30 cursor-pointer">
                    <RadioGroupItem value={option.value} id={`length-${option.value}`} />
                    <Label htmlFor={`length-${option.value}`} className="cursor-pointer flex-1 text-[#4A6163]">{option.label}</Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </Card>
        );

      case 4:
        return (
          <Card className="p-8 border-[#4A6163]/15 shadow-xl bg-white/95 backdrop-blur-sm">
            <div className="mb-6">
              <h3 className="text-black mb-4 text-3xl font-bold font-[Jomolhari]">Tell us more (Optional)</h3>
              <p className="text-[#4A6163]/70 text-base">
                Elaborate on your preferences or share any specific details about what you're looking for in your next book.
              </p>
            </div>
            <Textarea
              value={answers.additionalContext}
              onChange={(e) => setAnswers({ ...answers, additionalContext: e.target.value })}
              placeholder="For example: I love books with strong female protagonists, complex family dynamics, or unexpected plot twists..."
              className="min-h-[200px] resize-none border-[#4A6163]/20 focus:border-[#F9A66C] bg-white/80"
            />
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-orange-100/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-orange-100/30 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#4A6163]/10 z-10 shadow-sm sticky top-0">
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

      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 cursor-pointer hover:bg-gradient-to-r hover:from-orange-300 hover:to-rose-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </div>

        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-4">
            <h2 className="text-black mb-3 font-[Jomolhari] text-4xl flex items-center justify-center gap-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#F9A66C] to-[#F17A7E] rounded-full shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              Personalize Your Recommendations
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {selectedBooks.map((book: string, index: number) => (
                <span key={index} className="px-3 py-1.5 bg-[#FFC94B]/30 text-[rgb(0,0,0)] text-sm font-medium rounded-full">
                  {book}
                </span>
              ))}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#4A6163]/70 font-medium">
                Question {currentStep + 1} of {totalSteps}
              </span>
              <span className="text-sm text-[#4A6163]/70 font-medium">
                {Math.round(((currentStep + 1) / totalSteps) * 100)}%
              </span>
            </div>
            <Progress value={((currentStep + 1) / totalSteps) * 100} className="h-2" />
          </div>

          {/* Question */}
          <div className="mb-4">
            {renderQuestion()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 pb-6">
            <Button
              onClick={handleBack}
              disabled={currentStep === 0}
              variant="outline"
              className="flex-1 h-11 border-orange-300/50 hover:bg-orange-50/50 text-[#4A6163] font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep < totalSteps - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!isCurrentStepAnswered()}
                className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white h-11 shadow-lg hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400 cursor-pointer"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white h-11 shadow-lg hover:shadow-xl transition-all font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Getting Recommendations...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Get Recommendations
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}