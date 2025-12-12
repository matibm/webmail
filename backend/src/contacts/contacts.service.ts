import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';

@Injectable()
export class ContactsService {
    constructor(
        @InjectRepository(Contact)
        private contactsRepository: Repository<Contact>,
    ) { }

    findAll(userEmail: string): Promise<Contact[]> {
        return this.contactsRepository.find({ where: { userEmail } });
    }

    create(userEmail: string, contactData: Partial<Contact>): Promise<Contact> {
        const contact = this.contactsRepository.create({
            ...contactData,
            userEmail,
        });
        return this.contactsRepository.save(contact);
    }

    async remove(id: string, userEmail: string): Promise<void> {
        // Only allow deleting own contacts
        await this.contactsRepository.delete({ id, userEmail });
    }
}
