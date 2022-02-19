import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { CreateMovieDTO } from './dto/movie.dto';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Post('/create')
  async createMovie(@Res() res, @Body() createMovieDTO: CreateMovieDTO) {
    try {
      const movie = await this.movieService.createMovie(createMovieDTO);
      return res.status(HttpStatus.OK).json({
        message: 'Success',
        movie,
      });
    } catch (error) {
      console.error(error);
    }
  }

  @Get('/')
  async getMovies(@Res() res) {
    try {
      const movies = await this.movieService.getMovies();
      movies.length
        ? res.status(HttpStatus.OK).json(movies)
        : res.status(HttpStatus.NOT_FOUND).json({
            message: 'Sorry, no movies found',
          });
    } catch (error) {
      console.error(error);
    }
  }

  @Get('/:movieID')
  async getMovie(@Res() res, @Param('movieID') movieID) {
    try {
      const movie = await this.movieService.getMovie(movieID);
      movie
        ? res.status(HttpStatus.OK).json(movie)
        : res.status(HttpStatus.NOT_FOUND).json({
            message: 'Sorry, no movie found',
          });
    } catch (error) {
      console.error(error);
    }
  }

  @Put('/:movieID')
  async updateMovie(
    @Res() res,
    @Param('movieID') movieID,
    @Body() createMovieDTO: CreateMovieDTO,
  ) {
    try {
      const updatedMovie = await this.movieService.updateMovie(
        movieID,
        createMovieDTO,
      );
      updatedMovie
        ? res.status(HttpStatus.OK).json({
            message: 'Success',
            updatedMovie,
          })
        : res.status(HttpStatus.NOT_FOUND).json({
            message: 'Sorry, no movie found',
          });
    } catch (error) {
      console.error(error);
    }
  }

  @Delete('/:movieID')
  async deleteMovie(@Res() res, @Param('movieID') movieID) {
    try {
      const deletedMovie = await this.movieService.deleteMovie(movieID);
      deletedMovie
        ? res.status(HttpStatus.OK).json({
            message: 'Success',
            deletedMovie,
          })
        : res.status(HttpStatus.NOT_FOUND).json({
            message: 'Sorry, no movie found',
          });
    } catch (error) {
      console.error(error);
    }
  }
}
