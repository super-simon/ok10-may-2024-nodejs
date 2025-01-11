import { IToken } from "../interfaces/token.interface";
import { Token } from "../models/token.model";

class TokenRepository {
  public async create(dto: any): Promise<IToken> {
    return await Token.create(dto);
  }

  public async findByParams(params: Partial<IToken>): Promise<IToken> {
    return await Token.findOne(params);
  }

  public async deleteOneByParams(params: Partial<IToken>): Promise<void> {
    await Token.deleteOne(params);
  }

  public async deleteAllByParams(params: Partial<IToken>): Promise<void> {
    await Token.deleteMany(params);
  }
}

export const tokenRepository = new TokenRepository();
