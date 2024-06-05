import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class EncryptionService {
  /**
   * Generates a hash from the password
   *
   * @param plainText the user's password
   * @param saltRounds the number of rounds to use when creating the hash
   * @returns A hash string.
   */
  public generateHash(plainText: string, saltRounds = 10): string {
    try {
      const salt = bcrypt.genSaltSync(saltRounds);

      const hash = bcrypt.hashSync(plainText, salt);

      return hash;
    } catch (error) {
      console.error('Generating hash failed.');
      throw new Error(`generateHash: ${error}`);
    }
  }

  /**
   * Compare a plaintext against a hash
   *
   * @param plainText the plaintext to compare
   * @param hash the hash to compare against
   */
  public compareHash(plainText: string, hash: string): boolean {
    try {
      return bcrypt.compareSync(plainText, hash);
    } catch (error) {
      console.error('Compare hash failed.');
      throw new Error(`compareHash: ${error}`);
    }
  }
}
