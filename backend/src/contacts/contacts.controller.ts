import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('contacts')
@UseGuards(AuthGuard('jwt'))
export class ContactsController {
    constructor(private readonly contactsService: ContactsService) { }

    @Get()
    findAll(@Request() req) {
        return this.contactsService.findAll(req.user.email);
    }

    @Post()
    create(@Request() req, @Body() body: { name: string; email: string; notes?: string }) {
        return this.contactsService.create(req.user.email, body);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.contactsService.remove(id, req.user.email);
    }
}
