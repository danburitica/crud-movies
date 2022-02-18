import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { CreateMovieDTO } from './dto/movie.dto';
import { Movie } from './interfaces/movie.interface';

@Injectable()
export class MovieService {
  constructor(@InjectModel('Movie') readonly movieModel: Model<Movie>) {}

  // Methods CRUD

  async createMovie(createMovieDTO: CreateMovieDTO): Promise<Movie> {
    const movie = new this.movieModel(createMovieDTO);
    return await movie.save();
  }

  async getMovies(): Promise<Movie[]> {
    const movies = await this.movieModel.find();
    return !movies.length ? this.getMoviesFromApi() : movies;
  }

  async getMovie(movieID: string): Promise<Movie> {
    const movie = await this.movieModel.findById(movieID);
    return movie;
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

  // Methods external API

  async getMoviesFromApi(): Promise<any[]> {
    const { data: topMoviesApi } = await axios.get(`${process.env.API_URL}`, {
      headers: {
        'x-rapidapi-host': `${process.env.API_HOST}`,
        'x-rapidapi-key': `${process.env.API_KEY}`,
      },
    });

    const detailsMovies = this.getDetailsMoviesFromApi(topMoviesApi);

    (await detailsMovies).forEach((movie) =>
      this.createMovie({
        title: movie.title,
        titleType: movie.titleType,
        year: movie.year,
      }),
    );

    return detailsMovies;
  }

  async getDetailsMoviesFromApi(moviesApi): Promise<any[]> {
    const detailsMovies = [];
    for (let i = 0; i < moviesApi.length; i++) {
      const { data: detailsMovie } = await axios.get(
        `https://imdb8.p.rapidapi.com/title/get-details`,
        {
          params: { tconst: moviesApi[i].split('/')[2] },
          headers: {
            'x-rapidapi-host': 'imdb8.p.rapidapi.com',
            'x-rapidapi-key':
              '2a58b5e542msh076c7ded954eea3p1d16b5jsnf9bd76edd1db',
          },
        },
      );
      detailsMovies.push(detailsMovie);
    }

    return detailsMovies;
  }
}
