import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as CryptoJS from 'crypto-js';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly secretKey = 'grwegregrelhywbel wibhfl weuifwefw57egr7reg'; // Use uma chave segura para criptografia
  private readonly jwtSecret = ';p jimtrq qetvrdvjdsv0w43094t34 u-[u9 55 9'; // Use uma chave JWT segura
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}
  async create(dto: CreateUserDto): Promise<User> {
    const encryptedPassword = CryptoJS.AES.encrypt(
      dto.password,
      this.secretKey,
    ).toString();
    const user = this.repository.create({
      ...dto,
      password: encryptedPassword,
    });

    return this.repository.save(user);
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const decryptedPassword = this.decryptPassword(user.password);
    if (decryptedPassword !== password) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' });

    return { accessToken };
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { email } });
  }

  private decryptPassword(encryptedPassword: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOneBy({ id });
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      return null;
    }
    this.repository.merge(user, dto);
    return this.repository.save(user);
  }

  async remove(id: number) {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      return null;
    }
    return this.repository.remove(user);
  }
}
