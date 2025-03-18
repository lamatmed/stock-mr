import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Utilise le PrismaClient global
import { cookies } from "next/headers"; // Next.js 15

export async function GET() {
    try {
      const cookieStore = cookies(); // Pas besoin de await
      const userId = (await cookieStore).get("userId")?.value;
   
      if (!userId) {
        return NextResponse.json({ message: "Utilisateur non connecté" }, { status: 401 });
      }

      const user = await prisma.user.findUnique({
        where: { id: String(userId) },
        select: { id: true, nom: true, admin: true },
      });

      if (!user) {
        return NextResponse.json({ message: "Utilisateur introuvable" }, { status: 404 });
      }

      return NextResponse.json(user, { status: 200 });
    } catch (error) {
      console.error("Erreur serveur :", error);
      return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}
