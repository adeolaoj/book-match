
export type RecommendationInput = {
    seedBooks: string[];
    quizAnswers?: {
        aspects?: 'characters' | 'plot' | 'writingStyle' | 'worldBuilding' | 'themes';
        genres?: string[];
        pacing?: 'slow' | 'medium' | 'fast';
        length?: 'short' | 'medium' | 'long' | 'noPreference';
        additionalContext?: string;
    };
};