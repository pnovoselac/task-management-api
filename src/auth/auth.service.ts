import { Inject, Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AuthService {
  constructor(
    @Inject("FirebaseAdmin") private readonly firebaseAdmin: typeof admin,
    private readonly httpService: HttpService
  ) {}
  async registerUser(
    email: string,
    password: string
  ): Promise<{ uid: string; email: string }> {
    try {
      const userRecord = await admin.auth().createUser({ email, password });
      return { uid: userRecord.uid, email: String(userRecord.email) };
    } catch (error) {
      if (error instanceof Error) {
        console.error("Registration error:", error.message);
        throw new Error("User registration failed");
      } else {
        console.error("Unexpected error:", error);
        throw new Error("An unexpected error occurred during registration");
      }
    }
  }
  async loginUser(email: string, password: string) {
    try {
      const { idToken, refreshToken, expiresIn } =
        await this.signInWithEmailAndPassword(email, password);
      return { idToken, refreshToken, expiresIn };
    } catch (error: any) {
      if (error.message.includes("EMAIL_NOT_FOUND")) {
        throw new Error("User not found.");
      } else if (error.message.includes("INVALID_PASSWORD")) {
        throw new Error("Invalid password.");
      } else {
        throw new Error(error.message);
      }
    }
  }
  private async signInWithEmailAndPassword(email: string, password: string) {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`;
    return await this.sendPostRequest(url, {
      email,
      password,
      returnSecureToken: true,
    });
  }
  private async sendPostRequest(url: string, data: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, data, {
          headers: { "Content-Type": "application/json" },
        })
      );
      return response.data;
    } catch (error) {
      console.error("Error in sendPostRequest:", error);
      throw error;
    }
  }
  async validateRequest(req): Promise<boolean> {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return false;

    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) return false;

    try {
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(token);
      return true;
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error) {
        const err = error as { code: string };
        if (err.code === "auth/id-token-expired")
          console.error("Token expired");
        else if (err.code === "auth/invalid-id-token")
          console.error("Invalid token");
        else console.error("Error verifying token:", err.code);
      } else {
        console.error("Unexpected error:", error);
      }
      return false;
    }
  }
}
