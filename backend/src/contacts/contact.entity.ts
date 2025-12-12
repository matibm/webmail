import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contact {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userEmail: string; // The owner of this contact

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({ type: 'text', nullable: true })
    notes: string;
}
