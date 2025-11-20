import { IsEnum, IsOptional } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class UpdateAppointmentDto {
	@IsEnum(AppointmentStatus)
	@IsOptional()
	status?: AppointmentStatus;
}
