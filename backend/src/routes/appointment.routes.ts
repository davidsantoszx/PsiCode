import { Router } from "express";
import { prisma } from "../config/prisma.js";
import {
  authenticateToken,
  AuthRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

/*
 * CONSULTAS DO PACIENTE
 */
router.get(
  "/me",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const appointments =
        await prisma.appointment.findMany({
          where: {
            patientId: req.user!.userId,
          },
          include: {
            service: true,
            payment: true,
          },
          orderBy: {
            date: "asc",
          },
        });

      return res.json(appointments);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro ao buscar consultas",
      });
    }
  },
);

/*
 * CONSULTAS DA PSICÓLOGA
 */
router.get(
  "/psychologist",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      if (req.user!.role !== "PSYCHOLOGIST") {
        return res.status(403).json({
          message: "Acesso permitido apenas para psicologa",
        });
      }

      const appointments =
        await prisma.appointment.findMany({
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
            service: true,
            payment: true,
          },
          orderBy: {
            date: "asc",
          },
        });

      return res.json(appointments);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro ao buscar consultas",
      });
    }
  },
);

/*
 * CRIAR CONSULTA
 */
router.post(
  "/",
  authenticateToken,
  async (req: AuthRequest, res) => {
    try {
      const {
        serviceId,
        date,
        modality,
        notes,
      } = req.body;

      if (!serviceId || !date || !modality) {
        return res.status(400).json({
          message:
            "Servico, data e modalidade sao obrigatorios",
        });
      }

      if (
        modality !== "ONLINE" &&
        modality !== "IN_PERSON"
      ) {
        return res.status(400).json({
          message: "Modalidade invalida",
        });
      }

      const appointmentDate = new Date(date);

      if (Number.isNaN(appointmentDate.getTime())) {
        return res.status(400).json({
          message: "Data invalida",
        });
      }

      if (appointmentDate <= new Date()) {
        return res.status(400).json({
          message:
            "Nao e possivel agendar uma consulta no passado",
        });
      }

      const service = await prisma.service.findFirst({
        where: {
          id: serviceId,
          active: true,
        },
      });

      if (!service) {
        return res.status(404).json({
          message: "Servico nao encontrado",
        });
      }

      /*
       * Evita dois atendimentos no mesmo horario.
       */
      const existingAppointment =
        await prisma.appointment.findFirst({
          where: {
            date: appointmentDate,
            status: {
              not: "CANCELLED",
            },
          },
        });

      if (existingAppointment) {
        return res.status(409).json({
          message:
            "Este horario ja esta reservado",
        });
      }

      const appointment =
        await prisma.appointment.create({
          data: {
            date: appointmentDate,
            modality,
            status: "CONFIRMED",
            notes,
            patientId: req.user!.userId,
            serviceId,
            payment: {
              create: {
                amount: service.price,
                status: "PENDING",
              },
            },
          },
          include: {
            service: true,
            payment: true,
          },
        });

      return res.status(201).json({
        message: "Consulta agendada com sucesso",
        appointment,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro ao criar consulta",
      });
    }
  },
);

export default router;