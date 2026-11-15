import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET nao configurado no .env");
}
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, phone, birthDate } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Nome, email e senha sao obrigatorios",
            });
        }
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(409).json({
                message: "Email ja cadastrado",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                birthDate: birthDate ? new Date(birthDate) : undefined,
            },
        });
        return res.status(201).json({
            message: "Usuario criado com sucesso",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Erro ao criar usuario",
        });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email e senha sao obrigatorios",
            });
        }
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({
                message: "Email ou senha invalidos",
            });
        }
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return res.status(401).json({
                message: "Email ou senha invalidos",
            });
        }
        const token = jwt.sign({
            userId: user.id,
            role: user.role,
        }, JWT_SECRET, {
            expiresIn: "7d",
        });
        return res.json({
            message: "Login realizado com sucesso",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Erro ao realizar login",
        });
    }
});
export default router;
//# sourceMappingURL=auth.routes.js.map