import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import * as admin from "firebase-admin";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    @Inject("FirebaseAdmin") private readonly firebaseAdmin: typeof admin,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}
  async registerUser(
    email: string,
    password: string
  ): Promise<{ uid: string; email: string }> {
    try {
      const userRecord = await this.firebaseAdmin
        .auth()
        .createUser({ email, password });
      console.log("New user:", userRecord);

      return { uid: userRecord.uid, email: userRecord.email! };
    } catch (error) {
      throw new BadRequestException("You cannot be double registered", {
        cause: new Error(),
        description: "This user is already registered",
      });
    }
  }
  async loginUser(
    email: string,
    password: string
  ): Promise<{ idToken: string }> {
    try {
      await admin.auth().getUserByEmail(email);
    } catch (error) {
      throw new UnauthorizedException("Invalid email");
    }
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.configService.get<string>(
      "FIREBASE_API_KEY"
    )}`;

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, {
          email,
          password,
          returnSecureToken: true,
        })
      );

      return { idToken: response.data.idToken };
    } catch (error: any) {
      const firebaseError = error.response?.data?.error?.message;
      console.log(firebaseError);
      if (firebaseError.includes("INVALID_LOGIN_CREDENTIALS")) {
        throw new UnauthorizedException("Invalid password.");
      } else {
        throw new UnauthorizedException("Invalid login.");
      }
    }
  }
}
