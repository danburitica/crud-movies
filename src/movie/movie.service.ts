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
    try {
      return await movie.save();
    } catch (error) {
      console.error(error);
    }
  }

  async getMovies(): Promise<Movie[]> {
    try {
      const movies = await this.movieModel.find();
      return !movies.length ? this.getMoviesFromApi() : movies;
    } catch (error) {
      console.error(error);
    }
  }

  async getMovie(movieID: string): Promise<Movie> {
    try {
      const movie = await this.movieModel.findById(movieID);
      return movie;
    } catch (error) {
      console.error(error);
    }
  }

  async updateMovie(
    movieID: string,
    createMovieDTO: CreateMovieDTO,
  ): Promise<Movie> {
    try {
      const updatedMovie = await this.movieModel.findByIdAndUpdate(
        movieID,
        createMovieDTO,
        { new: true },
      );
      return updatedMovie;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteMovie(movieID: string): Promise<Movie> {
    try {
      const deletedMovie = await this.movieModel.findByIdAndDelete(movieID);
      return deletedMovie;
    } catch (error) {
      console.error(error);
    }
  }

  // Methods external API

  async getMoviesFromApi(): Promise<any[]> {
    try {
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
    } catch (error) {
      console.error(error);
    }
  }

  async getDetailsMoviesFromApi(moviesApi): Promise<any[]> {
    const detailsMovies = [];
    for (let i = 0; i < moviesApi.length; i++) {
      try {
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
      } catch (error) {
        console.error(error);
      }
    }

    return detailsMovies;
  }
}
