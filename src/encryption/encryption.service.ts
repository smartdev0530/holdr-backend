import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as CryptoJS from 'crypto-js';
import { ethers } from 'ethers';
import { wavesABI } from 'src/abis/waves.abi';
@Injectable()
export class EncryptionService {
  private readonly key: string;
  private readonly rpcUrl: string;
  private readonly platformPrivateKey: string;
  private readonly provider: ethers.JsonRpcProvider;
  private readonly platformWallet: ethers.Wallet;
  private readonly contractAddress: string;

  constructor(private readonly configService: ConfigService) {
    this.key = configService.get('ENCRYPTION_KEY') || 'default-encryption-key';
    this.rpcUrl = configService.get('RPC_URL');
    this.platformPrivateKey = configService.get('PLATFORM_PRIVATE_KEY');
    this.contractAddress = configService.get('CONTRACT_ADDRESS');

    this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
    this.platformWallet = new ethers.Wallet(
      this.platformPrivateKey,
      this.provider,
    );
  }
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

  encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.key).toString();
  }

  decrypt(cipherText: string): string {
    const bytes = CryptoJS.AES.decrypt(cipherText, this.key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  generateKeyPair() {
    const newWallet = ethers.Wallet.createRandom(this.provider);
    const privateKey = this.encrypt(newWallet.privateKey);
    const publicKey = ethers.computeAddress(newWallet.publicKey);
    return { privateKey, publicKey };
  }

  async sendEth(recipientAddress: string, amount: string) {
    try {
      const tx = await this.platformWallet.sendTransaction({
        to: recipientAddress,
        value: ethers.parseEther(amount),
      });
      await tx.wait(); // Wait for the transaction to be mined
    } catch (error) {
      console.error('Error sending ETH:', error);
      throw new InternalServerErrorException(
        `Failed to send ETH to ${recipientAddress}`,
      );
    }
  }

  async createNewToken(creatorAddress: string, amount: number) {
    const contract = new ethers.Contract(
      this.contractAddress,
      wavesABI,
      this.platformWallet,
    );

    try {
      const tx = await contract.createNewMembership(amount, creatorAddress);
      const receipt = await tx.wait();
      return Number(receipt.logs[1].args[1]); // this is tokenId
    } catch (error) {
      console.error('Error calling createNewMembership:', error);
      throw new InternalServerErrorException('Can not create new membership');
    }
  }
}
