import { config } from "../configs/config";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { ApiError } from "../errors/api-error";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";
import {
  IForgotPassword,
  IForgotPasswordSet,
  IUser,
  IUserCreateDto,
} from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "./email.service";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import { userService } from "./user.service";

class AuthService {
  public async signUp(
    dto: IUserCreateDto,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    await userService.isEmailUnique(dto.email);
    const password = await passwordService.hashPassword(dto.password);
    const user = await userRepository.create({ ...dto, password });
    const tokens = tokenService.generateTokens({
      userId: user._id,
      role: user.role,
    });
    await tokenRepository.create({ ...tokens, _userId: user._id });
    await emailService.sendEmail(
      EmailTypeEnum.WELCOME,
      "oleksandr.v.stetsiuk@gmail.com",
      { name: user.name, frontUrl: config.frontUrl },
    );
    return { user, tokens };
  }

  public async signIn(dto: any): Promise<{ user: IUser; tokens: ITokenPair }> {
    const user = await userRepository.getByEmail(dto.email);
    if (!user) {
      throw new ApiError("Incorrect email or password", 401);
    }
    const isPasswordCorrect = await passwordService.comparePassword(
      dto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new ApiError("Incorrect email or password", 401);
    }
    const tokens = tokenService.generateTokens({
      userId: user._id,
      role: user.role,
    });
    await tokenRepository.create({ ...tokens, _userId: user._id });
    return { user, tokens };
  }

  public async refresh(
    tokenPayload: ITokenPayload,
    refreshToken: string,
  ): Promise<ITokenPair> {
    await tokenRepository.deleteOneByParams({ refreshToken });
    const tokens = tokenService.generateTokens({
      userId: tokenPayload.userId,
      role: tokenPayload.role,
    });
    await tokenRepository.create({ ...tokens, _userId: tokenPayload.userId });
    return tokens;
  }

  public async logout(
    tokenPayload: ITokenPayload,
    tokenId: string,
  ): Promise<void> {
    const user = await userRepository.getById(tokenPayload.userId);
    await tokenRepository.deleteOneByParams({ _id: tokenId });
    await emailService.sendEmail(
      EmailTypeEnum.LOGOUT,
      "oleksandr.v.stetsiuk@gmail.com",
      {
        name: user.name,
        frontUrl: config.frontUrl,
      },
    );
  }

  public async logoutAll(tokenPayload: ITokenPayload): Promise<void> {
    const user = await userRepository.getById(tokenPayload.userId);
    await tokenRepository.deleteAllByParams({ _userId: user._id });
    await emailService.sendEmail(
      EmailTypeEnum.LOGOUT,
      "oleksandr.v.stetsiuk@gmail.com",
      {
        name: user.name,
        frontUrl: config.frontUrl,
      },
    );
  }

  public async forgotPassword(dto: IForgotPassword): Promise<void> {
    const user = await userRepository.getByEmail(dto.email);
    if (!user) {
      return;
    }

    const token = tokenService.generateActionTokens(
      {
        userId: user._id,
        role: user.role,
      },
      ActionTokenTypeEnum.FORGOT_PASSWORD,
    );
    await actionTokenRepository.create({
      type: ActionTokenTypeEnum.FORGOT_PASSWORD,
      _userId: user._id,
      token,
    });

    await emailService.sendEmail(
      EmailTypeEnum.FORGOT_PASSWORD,
      "oleksandr.v.stetsiuk@gmail.com",
      {
        name: user.name,
        frontUrl: config.frontUrl,
        actionToken: token,
      },
    );
  }

  public async forgotPasswordSet(dto: IForgotPasswordSet): Promise<void> {
    const payload = tokenService.verifyToken(
      dto.token,
      ActionTokenTypeEnum.FORGOT_PASSWORD,
    );
    const entity = await actionTokenRepository.findOneByParams({
      token: dto.token,
    });
    if (!entity) {
      throw new ApiError("Invalid token", 401);
    }
    const password = await passwordService.hashPassword(dto.password);
    await userRepository.updateById(payload.userId, { password });

    await Promise.all([
      actionTokenRepository.deleteOneByParams({ token: dto.token }),
      tokenRepository.deleteAllByParams({ _userId: payload.userId }),
    ]);
  }
}

export const authService = new AuthService();
