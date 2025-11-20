import { IsUUID, IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class CreateAppointmentDto {
	@IsUUID()
	@IsNotEmpty()
	idUser: string;

	@IsDateString()
	@IsNotEmpty()
	datetime: Date;

	@IsEnum(AppointmentStatus)
	@IsOptional()
	status?: AppointmentStatus;
}
