import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ContactsModule } from './contacts/contacts.module';
import { Contact } from './contacts/contact.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        
        // Si hay DATABASE_URL (Neon), usarla directamente
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [Contact],
            synchronize: true,
            ssl: {
              rejectUnauthorized: false, // Necesario para Neon
            },
          };
        }
        
        // Fallback a variables individuales
        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USER'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          entities: [Contact],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    MailModule,
    ContactsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
