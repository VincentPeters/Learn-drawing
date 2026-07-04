import { getCollection, type CollectionEntry } from 'astro:content';
import { lessonUrl } from './modules';

export type Lesson = CollectionEntry<'lessons'>;
export type Phase = CollectionEntry<'phases'>;

export async function lessonsOf(m: 1 | 2): Promise<Lesson[]> {
  const all = await getCollection('lessons', (e) => e.data.module === m);
  return all.sort((a, b) => a.data.number - b.data.number);
}

export async function phasesOf(m: 1 | 2): Promise<Phase[]> {
  const all = await getCollection('phases', (e) => e.data.module === m);
  return all.sort((a, b) => a.data.index - b.data.index);
}

export interface SeqItem {
  m: 1 | 2;
  n: number;
  title: string;
  url: string;
  entry: Lesson;
}

/** All 45 lessons in course order: module 1 then module 2. */
export async function sequence(): Promise<SeqItem[]> {
  const seq: SeqItem[] = [];
  for (const m of [1, 2] as const) {
    for (const entry of await lessonsOf(m)) {
      seq.push({ m, n: entry.data.number, title: entry.data.title, url: lessonUrl(m, entry.data.number), entry });
    }
  }
  return seq;
}
