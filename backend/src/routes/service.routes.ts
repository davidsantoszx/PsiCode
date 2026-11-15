import { Router } from "express";
import { prisma } from "../config/prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        active: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.json(services);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao buscar servicos",
    });
  }
});

export default router;