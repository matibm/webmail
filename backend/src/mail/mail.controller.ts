import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { MailService } from './mail.service';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('mail')
@UseGuards(AuthGuard('jwt'))
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Get()
    async getEmails(
        @Request() req, 
        @Query('folder') folder: string,
        @Query('limit') limit?: string,
        @Query('offset') offset?: string
    ) {
        const limitNum = limit ? parseInt(limit, 10) : 50;
        const offsetNum = offset ? parseInt(offset, 10) : 0;
        return this.mailService.getMessages(req.user, folder, limitNum, offsetNum);
    }

    @Get('message/:uid')
    async getMessage(@Request() req, @Param('uid') uid: string, @Query('folder') folder: string) {
        return this.mailService.getMessageBody(req.user, uid, folder);
    }

    @Post('send')
    @UseInterceptors(FilesInterceptor('attachments'))
    async send(
        @Request() req,
        @Body() body: { to: string; subject: string; body: string },
        @UploadedFiles() files: Array<Express.Multer.File>
    ) {
        // Note: frontend sends 'body', service expects 'text'
        return this.mailService.sendMail(req.user, body.to, body.subject, body.body, files);
    }

    @Patch(':id/read')
    async markAsRead(@Request() req, @Param('id') id: string) {
        return this.mailService.markMessage(req.user, id, 'read');
    }

    @Patch(':id/star')
    async toggleStar(@Request() req, @Param('id') id: string) {
        // Logic could be smarter (toggle), but simple 'star' for now
        return this.mailService.markMessage(req.user, id, 'star');
    }

    @Patch(':id/archive')
    async archive(@Request() req, @Param('id') id: string) {
        return this.mailService.markMessage(req.user, id, 'archive');
    }

    @Delete(':id')
    async delete(@Request() req, @Param('id') id: string) {
        return this.mailService.markMessage(req.user, id, 'trash');
    }
}
