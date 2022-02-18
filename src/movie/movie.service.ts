import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMovieDTO } from './dto/movie.dto';
import { Movie } from './interfaces/movie.interface';

@Injectable()
export class MovieService {
  constructor(@InjectModel('Movie') readonly movieModel: Model<Movie>) {}

  async getMovies(): Promise<Movie[]> {
    const movies = await this.movieModel.find();
    return movies;
  }

  async getMovie(movieID: string): Promise<Movie> {
    const movie = await this.movieModel.findById(movieID);
    return movie;
  }

  async createMovie(createMovieDTO: CreateMovieDTO): Promise<Movie> {
    const movie = new this.movieModel(createMovieDTO);
    return await movie.save();
  }
  async updateMovie(
    movieID: string,
    createMovieDTO: CreateMovieDTO,
  ): Promise<Movie> {
    const updatedMovie = await this.movieModel.findByIdAndUpdate(
      movieID,
      createMovieDTO,
      { new: true },
    );
    return updatedMovie;
  }

  async deleteMovie(movieID: string): Promise<Movie> {
    const deletedMovie = await this.movieModel.findByIdAndDelete(movieID);
    return deletedMovie;
  }
}
