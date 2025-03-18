import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers"; // Next.js 15

const prisma = new PrismaClient();

export async function GET() { // req supprimé car non utilisé
    try {
      const cookieStore = await cookies(); // ATTENTION : cookies() doit être await dans Next.js 15
      const userId = cookieStore.get("userId")?.value; // Accès correct au cookie
   
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
