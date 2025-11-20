import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum AppointmentStatus {
	PENDING = 'pending',
	CANCELLED = 'cancelled',
	DONE = 'done',
}

@Entity()
export class Appointment {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('uuid')
	idUser: string;

	@Column('uuid')
	doctorId: string;

	@Column('timestamp')
	datetime: Date;

	@Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.PENDING })
	status: AppointmentStatus;

	@CreateDateColumn({ name: 'created_add' })
	created_add: Date;
}