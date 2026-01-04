import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';

// Get paths to input CSV and output JSON
const csvPath = path.join(__dirname, '../../books.csv');
const outputPath = path.join(__dirname, '../../shared/books.json');

interface RawBook {
  '': string; // index
  Book: string;
  Author: string;
  Description: string;
  Genres: string;
  Avg_Rating: string;
  Num_Ratings: string;
  URL: string;
}

interface ProcessedBook {
  title: string;
  author: string;
  description: string;
  genres: string[];
  averageRating: number;
  numberOfRatings: number;
  url: string;
  lengthBucket: 'short' | 'medium' | 'long';
  pacing: 'fast' | 'medium' | 'slow';
  aspects: string[];
  series?: string | undefined;
}

function normalizeGenres(genresStr: string): string[] {
  try {
    const genres = JSON.parse(genresStr);
    return genres.map((g: string) => g.toLowerCase().trim());
  } catch {
    return [];
  }
}

function bucketLength(description: string): 'short' | 'medium' | 'long' {
  const wordCount = description.split(/\s+/).length;
  if (wordCount < 200) return 'short';
  if (wordCount > 1000) return 'long';
  return 'medium';
}

function inferPacing(description: string): 'fast' | 'medium' | 'slow' {
  const desc = description.toLowerCase();
  if (desc.includes('fast-paced') || desc.includes('action-packed') || desc.includes('thrilling')) return 'fast';
  if (desc.includes('slow burn') || desc.includes('gradual') || desc.includes('introspective') || desc.includes('contemplative')) return 'slow';
  return 'medium';
}

function inferAspects(description: string, genres: string[]): string[] {
  const aspects: string[] = [];
  const desc = description.toLowerCase();
  if (desc.includes('romance') || genres.includes('romance')) aspects.push('romantic');
  if (desc.includes('mystery') || desc.includes('thriller') || genres.includes('mystery') || genres.includes('thriller')) aspects.push('mysterious');
  if (desc.includes('adventure') || genres.includes('adventure')) aspects.push('adventurous');
  if (desc.includes('horror') || genres.includes('horror')) aspects.push('horrific');
  if (desc.includes('fantasy') || genres.includes('fantasy')) aspects.push('fantastical');
  // will come back to add more later
  return aspects;
}

function extractSeries(title: string): string | undefined {
  const match = title.match(/\((.*?)\)/);
  return match ? match[1] : undefined;
}

const books: ProcessedBook[] = [];

fs.createReadStream(csvPath)
  .pipe(csv())
  .on('data', (data: RawBook) => {
    const genres = normalizeGenres(data.Genres);
    const lengthBucket = bucketLength(data.Description);
    const pacing = inferPacing(data.Description);
    const aspects = inferAspects(data.Description, genres);
    const series = extractSeries(data.Book);

    books.push({
      title: data.Book,
      author: data.Author,
      description: data.Description,
      genres,
      averageRating: parseFloat(data.Avg_Rating),
      numberOfRatings: parseInt(data.Num_Ratings.replace(/,/g, '')),
      url: data.URL,
      lengthBucket,
      pacing,
      aspects,
      series,
    });
  })
  .on('end', () => {
    fs.writeFileSync(outputPath, JSON.stringify(books, null, 2));
    console.log('Processed books saved to', outputPath);
  })
  .on('error', (err) => {
    console.error('Error processing CSV:', err);
  });