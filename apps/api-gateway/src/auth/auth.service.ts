import { SERVICE_PORTS } from '@app/common';
import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class AuthService {
  private readonly authServiceUrl = `http://localhost:${SERVICE_PORTS.AUTH_SERVICE}`;
  constructor(private readonly httpService: HttpService) {}

  async register(payload: {
    email: string;
    password: string;
    name: string;
  }): Promise<AxiosResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/register`, payload),
      );
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async login(payload: {
    email: string;
    password: string;
  }): Promise<AxiosResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/login`, payload),
      );
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getProfile(token: string): Promise<AxiosResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/profile`, {
          headers: {
            Authorization: token,
          },
        }),
      );
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error.response) {
      throw new HttpException(error.response.data, error.response.status);
    }
    throw new HttpException('Something unexpected happened', 503);
  }
}
