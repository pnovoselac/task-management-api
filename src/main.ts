import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerConfigModule } from "./swagger/swagger.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfigModule.setup(app);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
