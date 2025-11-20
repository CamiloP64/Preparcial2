import { Controller, Post, Get, Patch, Delete, Param, Body, Req, Res, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';


@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentSrv: AppointmentService) {}

  @Post()
  async agendar(@Body() body: CreateAppointmentDto, @Req() req: Request, @Res() res: Response) {
    const usuario = req['user'] ?? { id: body.idUser, rol: 'patient' };
    try {
      const cita = await this.appointmentSrv.agendarCita(body, usuario);
      res.status(HttpStatus.CREATED).json({ mensaje: 'Cita registrada', cita });
    } catch (err) {
      res.status(err.status || 500).json({ mensaje: err.message || 'Error interno' });
    }
  }

  @Get()
  async listar(@Req() req: Request, @Res() res: Response) {
    const usuario = req['user'] ?? { id: 'test', rol: 'patient' };
    try {
      const citas = await this.appointmentSrv.obtenerCitas(usuario);
      res.status(HttpStatus.OK).json({ mensaje: 'Citas consultadas', citas });
    } catch (err) {
      res.status(err.status || 500).json({ mensaje: err.message || 'Error interno' });
    }
  }

  @Get(':id')
  async detalle(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const usuario = req['user'] ?? { id: 'test', rol: 'patient' };
    try {
      const cita = await this.appointmentSrv.detalleCita(id, usuario);
      res.status(HttpStatus.OK).json({ mensaje: 'Detalle de cita', cita });
    } catch (err) {
      res.status(err.status || 500).json({ mensaje: err.message || 'Error interno' });
    }
  }

  @Patch(':id')
  async modificarEstado(@Param('id') id: string, @Body() body: UpdateAppointmentDto, @Req() req: Request, @Res() res: Response) {
    const usuario = req['user'] ?? { id: 'test', rol: 'doctor' };
    try {
      const cita = await this.appointmentSrv.cambiarEstado(id, body, usuario);
      res.status(HttpStatus.OK).json({ mensaje: 'Estado actualizado', cita });
    } catch (err) {
      res.status(err.status || 500).json({ mensaje: err.message || 'Error interno' });
    }
  }

  @Delete(':id')
  async cancelar(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const usuario = req['user'] ?? { id: 'test', rol: 'patient' };
    try {
      await this.appointmentSrv.eliminarCita(id, usuario);
      res.status(HttpStatus.OK).json({ mensaje: 'Cita eliminada' });
    } catch (err) {
      res.status(err.status || 500).json({ mensaje: err.message || 'Error interno' });
    }
  }
}