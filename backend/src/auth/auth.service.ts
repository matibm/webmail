import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as imaps from 'imap-simple';
import { EncryptionService } from './encryption.service';

@Injectable()
export class AuthService {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        private encryptionService: EncryptionService
    ) { }

    async login(user: any) {
        const config = {
            imap: {
                user: user.email,
                password: user.password,
                host: this.configService.get('IMAP_HOST'),
                port: this.configService.get('IMAP_PORT'),
                tls: true,
                authTimeout: 10000,
            },
        };

        try {
            const connection = await imaps.connect(config);
            await connection.end();

            // Encrypt password for stateless JWT
            const encryptedPassword = this.encryptionService.encrypt(user.password);

            const payload = {
                email: user.email,
                p: encryptedPassword // Storing encrypted password in token
            };

            return {
                access_token: this.jwtService.sign(payload),
                email: user.email
            };
        } catch (error) {
            console.error('IMAP Auth Error:', error);
            throw new UnauthorizedException('Invalid credentials or IMAP connection failed');
        }
    }
}
