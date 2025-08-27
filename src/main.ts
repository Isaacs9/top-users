import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: Number(process.env.PORT || 4001) }
  });
  await app.listen();
  console.log(`Users microservice (TCP) listening on port ${process.env.PORT || 4001}`);
}
bootstrap();
