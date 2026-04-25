import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from 'src/generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    switch (exception.code) {
      case 'P2002': // P2002: Data exists.
        response.status(409).json({
          statusCode: 409,
          message: 'A record with this unique data already exists',
        });
        console.log(exception);
        break;
      case 'P2003': // P2003: Foreign Key Conflict
        response.status(409).json({
          statusCode: 400,
          message: 'Bad request',
        });
        console.log(exception);
        break;
      case 'P2025': // P2025: Not Found
        response.status(404).json({
          statusCode: 404,
          message: 'Not Found',
        });
        console.log(exception);
        break;
      default:
        console.error(exception);
        response.status(500).json({
          statusCode: 500,
          message: 'Internal Server Error',
        });
    }
  }
}
