import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { apiClient } from './api-client';

describe('TMDB live connectivity test', () => {
  it('connects to TMDB API and receives real movies', async () => {
    // Read token from .env.local without exposing in logs
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const match = content.match(/NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN=(.+)/);
      if (match) {
        process.env.NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN = match[1].trim();
      }
    }

    const data = await apiClient<{ results: { id: number; title: string }[] }>(
      'movie/now_playing',
      {
        params: { page: 1 },
      }
    );

    expect(data).toBeDefined();
    expect(Array.isArray(data.results)).toBe(true);
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results[0].title).toBeDefined();
  });
});
