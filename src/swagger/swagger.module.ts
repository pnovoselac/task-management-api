import { Module } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

@Module({})
export class SwaggerConfigModule {
  static setup(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle("Task Management API")
      .setDescription(
        "REST API for a task management application where users can create, manage, and organize tasks into project"
      )
      .setVersion("1.0")
      .addBearerAuth(
        {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          name: "Authorization",
          description: 'Type in JWT token without "Bearer " prefix',
          in: "header",
        },
        "access-token"
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);
  }
}
