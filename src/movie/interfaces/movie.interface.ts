import { Document } from 'mongoose';

export interface Movie extends Document {
  readonly title: string;
  readonly titleType: string;
  readonly year: string;
  readonly runningTimeInMinutes: string;
}
