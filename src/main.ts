import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformationInterceptor } from './common/interceptor/response.interceptor';
import { RequestGuard } from './common/utils/guards';
import { HttpExceptionFilter } from './common/filter/filter';
import { ValidationPipe } from '@nestjs/common';
import { environment } from './common/config/environment';
import helmet from 'helmet';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as timeout from 'connect-timeout';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(timeout(30 * 60 * 1000));
  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.json({ limit: '900mb' }));
  app.use(bodyParser.urlencoded({ limit: '900mb', extended: true }));

  // guards
  app.useGlobalGuards(new RequestGuard());

  // interceptors
  app.useGlobalInterceptors(new TransformationInterceptor(app.get(Reflector)));

  // filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // prefix
  app.setGlobalPrefix('/api/v1');

  // pipeline validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(environment.APP.PORT || 3000);
}
bootstrap();
