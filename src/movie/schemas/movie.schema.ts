import { Schema } from 'mongoose';

export const MovieSchema = new Schema({
  title: { type: String, required: true },
  titleType: String,
  year: String,
  runningTimeInMinutes: String,
});
