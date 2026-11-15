import express from "express";
import cors from "cors";
import { prisma } from "./config/prisma.js";
import authRoutes from "./routes/auth.routes.js";
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/api/health", async (_req, res) => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        res.json({
            status: "ok",
            message: "PsiCode API funcionando",
            database: "connected",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "API funcionando, mas banco de dados indisponivel",
        });
    }
});
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map