import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly repo: Repository<Appointment>,
  ) {}

  private obtenerRol(usuario: any): string {
    return usuario?.rol ?? 'patient';
  }

  async agendarCita(dto: CreateAppointmentDto, usuario: any) {
    if (!dto.idUser || !dto.datetime) throw new BadRequestException('Datos incompletos');
    if (this.obtenerRol(usuario) !== 'patient') throw new ForbiddenException('Solo pacientes pueden agendar');
    const cita = this.repo.create({
      ...dto,
      status: AppointmentStatus.PENDING,
      created_add: new Date(),
    });
    return await this.repo.save(cita);
  }

  async obtenerCitas(usuario: any) {
    const rol = this.obtenerRol(usuario);
    if (rol === 'admin') return this.repo.find();
    if (rol === 'doctor') return this.repo.find({ where: { doctorId: usuario.id } });
    return this.repo.find({ where: { idUser: usuario.id } });
  }

  async detalleCita(id: string, usuario: any) {
    const cita = await this.repo.findOne({ where: { id } });
    if (!cita) throw new NotFoundException('Cita no encontrada');
    const rol = this.obtenerRol(usuario);
    if (rol === 'admin') return cita;
    if (rol === 'doctor' && cita.doctorId !== usuario.id) throw new ForbiddenException('Acceso denegado');
    if (rol === 'patient' && cita.idUser !== usuario.id) throw new ForbiddenException('Acceso denegado');
    return cita;
  }

  async cambiarEstado(id: string, dto: UpdateAppointmentDto, usuario: any) {
    const cita = await this.repo.findOne({ where: { id } });
    if (!cita) throw new NotFoundException('Cita no encontrada');
    if (this.obtenerRol(usuario) !== 'doctor') throw new ForbiddenException('Solo doctores pueden modificar estado');
    if (cita.status !== AppointmentStatus.PENDING) throw new BadRequestException('Solo citas pendientes pueden cambiar estado');
    if (!dto.status || ![AppointmentStatus.DONE, AppointmentStatus.CANCELLED].includes(dto.status)) throw new BadRequestException('Estado inválido');
    cita.status = dto.status;
    return await this.repo.save(cita);
  }

  async eliminarCita(id: string, usuario: any) {
    const cita = await this.repo.findOne({ where: { id } });
    if (!cita) throw new NotFoundException('Cita no encontrada');
    if (this.obtenerRol(usuario) !== 'patient' || cita.idUser !== usuario.id) throw new ForbiddenException('Solo el paciente puede cancelar su cita');
    await this.repo.remove(cita);
    return true;
  }
}