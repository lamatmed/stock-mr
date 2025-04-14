/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
interface SaleRecord {
  productId: string;
  quantity: number;
  totalPrice: number;
  purchasePrice: number;
}
import { PrismaClient } from "@prisma/client";
// 🔹 Ajouter un utilisateur

const prisma = new PrismaClient();

import { cookies } from "next/headers"; // Pour gérer les cookies
import bcrypt from "bcryptjs";

export async function addUser(
  nom: string,
  password: string,
  admin: boolean = false  // Par défaut, un utilisateur est un utilisateur normal
) {
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: { nom },
    });

    if (existingUser) {
      return { error: "Un utilisateur avec ce nom existe déjà !" };
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    await prisma.user.create({
      data: {
        nom,
        password: hashedPassword,
        admin,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur:", error);
    return { error: "Erreur lors de l'ajout de l'utilisateur" };
  }
}

  

// 🔹 Récupérer tous les produits
export async function getAllProducts() {
  try {
    return await prisma.product.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        quantity: true,
        price_v: true,
        price_a: true,
        expirationDate: true,
        codeBar: true, 
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    return [];
  }
}

// 🔹 Modifier un utilisateur
export async function updateUser(
    id: string,
    nom: string,
    password?: string,  // Mot de passe optionnel
    admin: boolean = false
  ) {
    try {
      const updateData: any = {
        nom,
        admin,
      };
  
      // Si un mot de passe est fourni, le hacher avant de le mettre à jour
      if (password) {
        updateData.password = bcrypt.hashSync(password, 10);
      }
  
      // Mettre à jour l'utilisateur
      await prisma.user.update({
        where: { id },
        data: updateData,
      });
  
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la modification de l'utilisateur:", error);
      return { error: "Erreur lors de la modification de l'utilisateur" };
    }
  }

  // 🔹 Supprimer un utilisateur
export async function deleteUser(id: string) {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      return { error: "Erreur lors de la suppression de l'utilisateur" };
    }
  }

  // 🔹 Récupérer tous les utilisateurs
export async function getAllUsers() {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      return [];
    }
  }
  
  
// 🔹 Ajouter un produit
export async function addProduct(
  code: number,
  name: string,
  quantity: number,
  price_v: number,
  price_a: number,
  expirationDate: string,
  codeBar: string,
) {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: { code },
    });
    const existingProductcodeBar = await prisma.product.findUnique({
      where: { codeBar },
    });

    if (existingProduct) {
      return { error: "Ce code de produit existe déjà !" };
    }
    if (existingProductcodeBar) {
      return { error: "Ce code de barre de produit existe déjà !" };
    }

    if (price_v <= price_a) {
      return { error: "Le prix de vente doit être supérieur au prix d'achat !" };
    }

    if (quantity < 0) {
      return { error: "La quantité ne peut pas être négative !" };
    }

    await prisma.product.create({
      data: {
        code,
        name,
        quantity,
        price_v,
        price_a,
        expirationDate: new Date(expirationDate),
        codeBar, // Stocker l'image
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit:", error);
    return { error: "Erreur lors de l'ajout du produit" };
  }
}

// 🔹 Modifier un produit
export async function updateProduct(
  id: string,
  code: number,
  name: string,
  quantity: number,
  price_v: number,
  price_a: number,
  expirationDate: string,
  codeBar: string 
) {
  try {
    await prisma.product.update({
      where: { id },
      data: {
        code,
        name,
        quantity,
        price_v,
        price_a,
        expirationDate: new Date(expirationDate),
        codeBar, 
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la modification du produit:", error);
    return { error: "Erreur lors de la modification du produit" };
  }
}

// 🔹 Supprimer un produit
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error);
    return { error: "Erreur lors de la suppression du produit" };
  }
}

// 🔹 Récupérer un produit par son ID
export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        name: true,
        quantity: true,
        price_v: true,
        price_a: true,
        expirationDate: true,
        createdAt: true,
        codeBar: true, // Ajout de l'image
      },
    });

    if (!product) {
      return { error: "Produit non trouvé" };
    }

    return {
      ...product,
      expirationDate: product.expirationDate.toISOString(),
      createdAt: product.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    return { error: "Erreur lors de la récupération du produit" };
  }
}

// 🔹 Récupérer les 5 derniers produits ajoutés
export async function getLatestProducts() {
  try {
    const latestProducts = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        code: true,
        name: true,
        quantity: true,
        price_v: true,
        price_a: true,
        expirationDate: true,
        codeBar: true, // Ajout de l'image
      },
    });

    return latestProducts;
  } catch (error) {
    console.error("Erreur lors de la récupération des derniers produits :", error);
    return [];
  }
}

// 🔹 Récupérer les statistiques du dashboard
export async function getDashboardStats() {
  try {
    const totalProducts = await prisma.product.count();

    const sales = await prisma.sale.findMany({
      select: {
        totalPrice: true,
        purchasePrice: true,
      },
    });

    const totalSales = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const totalPurchaseCost = sales.reduce((sum, sale) => sum + sale.purchasePrice, 0);
    const totalProfit = totalSales - totalPurchaseCost;

    const totalOrders = await prisma.sale.count();

    return {
      totalProducts,
      totalSales: totalSales || 0,
      totalProfit: totalProfit || 0,
      totalOrders,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques :", error);
    return {
      totalProducts: 0,
      totalSales: 0,
      totalProfit: 0,
      totalOrders: 0,
    };
  }
}


export async function addMultipleSales(salesData: { productId: string; quantity: number }[]) {
  try {
    const products = await prisma.product.findMany({
      where: {
        id: { in: salesData.map(sale => sale.productId) },
      },
    });

    let totalAmount = 0;
    let purchaseTotal = 0;
    const salesRecords: SaleRecord[] = [];

    // Vérifier que tous les produits ont assez de stock
    for (const sale of salesData) {
      const product = products.find(p => p.id === sale.productId);
      if (!product) return { error: `Produit introuvable: ${sale.productId}` };
      if (product.quantity < sale.quantity) return { error: `Stock insuffisant pour ${product.name}` };

      const totalPrice = product.price_v * sale.quantity;
      const purchasePrice = product.price_a * sale.quantity;
      totalAmount += totalPrice;
      purchaseTotal += purchasePrice;

      salesRecords.push({
        productId: sale.productId,
        quantity: sale.quantity,
        totalPrice,
        purchasePrice,
      });
    }

    // Création de la facture et enregistrement des ventes
    const saleTransaction = await prisma.$transaction(async (prisma) => {
      const invoice = await prisma.invoice.create({
        data: {
          totalAmount,
          purchaseTotal,
        },
      });

      for (const record of salesRecords) {
        await prisma.sale.create({
          data: {
            ...record,
            invoiceId: invoice.id,
          },
        });

        await prisma.product.update({
          where: { id: record.productId },
          data: {
            quantity: { decrement: record.quantity },
          },
        });
      }

      return invoice.id;
    });

    return { success: true, invoiceId: saleTransaction };
  } catch (error) {
    console.error("Erreur lors de l'ajout des ventes:", error);
    return { error: "Erreur lors de l'ajout des ventes" };
  }
}

// 🔹 Récupérer l'historique des ventes
export async function getSalesHistory() {
  try {
    const sales = await prisma.sale.findMany({
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    return sales.map((sale) => ({
      id: sale.id,
      productName: sale.product?.name,
      quantity: sale.quantity,
      totalPrice: sale.totalPrice,
      purchasePrice: sale.purchasePrice,
      createdAt: sale.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des ventes:", error);
    return [];
  }
}
export async function getInvoiceHistory() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        sales: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return invoices.map((invoice) => ({
      id: invoice.id,
      totalAmount: invoice.totalAmount,
      purchaseTotal: invoice.purchaseTotal,
      createdAt: invoice.createdAt.toISOString(),
      sales: invoice.sales.map((sale) => ({
        productName: sale.product?.name ?? "", // 🔥 Assure que productName est toujours une string
        quantity: sale.quantity,
        totalPrice: sale.totalPrice,
      })),
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des factures:", error);
    return [];
  }
}

export async function getMonthlySales() {
  try {
    const sales = await prisma.sale.groupBy({
      by: ["createdAt"],
      _sum: { totalPrice: true },
      orderBy: { createdAt: "asc" },
    });

    const formattedSales = sales.map((sale) => ({
      month: new Date(sale.createdAt).toLocaleString("fr-FR", { month: "long" }),
      totalSales: sale._sum.totalPrice || 0,
    }));

    return formattedSales;
  } catch (error) {
    console.error("Erreur lors de la récupération des ventes mensuelles:", error);
    return [];
  }
}




export async function addClient(nom: string, tel: string, nif: string | null) {
  try {
    // Créer un nouveau client
    const newClient = await prisma.client.create({
      data: {
        nom,
        tel,
        nif,
      },
    });

    return { success: true, client: newClient };
  } catch (error) {
    console.error("Erreur lors de l'ajout du client:", error);
    return { error: "Erreur lors de l'ajout du client" };
  }
}

export async function updateClient(id: string, nom?: string, tel?: string, nif?: string) {
    try {
      // Mettre à jour un client avec un ID donné
      const updatedClient = await prisma.client.update({
        where: { id },
        data: {
          nom,
          tel,
          nif,
        },
      });
  
      return { success: true, client: updatedClient };
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client:", error);
      return { error: "Erreur lors de la mise à jour du client" };
    }
  }

  export async function deleteClient(id: string) {
    try {
      // Supprimer un client avec un ID donné
      await prisma.client.delete({
        where: { id },
      });
  
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la suppression du client:", error);
      return { error: "Erreur lors de la suppression du client" };
    }
  }

  export async function getAllClients() {
    try {
      // Récupérer tous les clients
      const clients = await prisma.client.findMany();
      return { success: true, clients };
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      return { error: "Erreur lors de la récupération des clients" };
    }
  }
  

  export async function loginUser(nom: string, password: string) {
    try {
      const user = await prisma.user.findFirst({
        where: { nom },
      });
  
      if (!user) {
        return { error: "لم يتم العثور على المستخدم" };
      }
  
      const isPasswordValid = bcrypt.compareSync(password, user.password);
  
      if (!isPasswordValid) {
        return { error: "كلمة مرور غير صحيحة" };
      }
  
      (await
        
        cookies()).set("userId", user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24, // Expire en 1 jour
      });
  
      return { success: true, user };
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      return { error: "Erreur lors de la connexion." };
    }
  }
  
  export async function getLastProductCode() {
    try {
      const lastProduct = await prisma.product.findFirst({
        orderBy: { code: "desc" }, // Récupère le produit avec le plus grand code
        select: { code: true },
      });
  
      return lastProduct ? lastProduct.code : null; // Retourne le dernier code sans l'incrémenter
    } catch (error) {
      console.error("Erreur lors de la récupération du dernier code produit :", error);
      return null; // Retourne null en cas d'erreur
    }
  }
  
  export async function deleteAllProducts() { 
    try {
      await prisma.product.deleteMany();
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la suppression des produits:", error);
      return { error: "Erreur lors de la suppression des produits" };
    }
  }
  
  export async function deleteAllSales() {
    try {
      await prisma.sale.deleteMany();
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la suppression des ventes:", error);
      return { error: "Erreur lors de la suppression des ventes" };
    }
  }


  export async function updateQuantitePrice(
    id: string,
    quantity: number,
    price_v: number,
    price_a: number
  ) {
    try {
      await prisma.product.update({
        where: { id },
        data: {
          quantity,
          price_v,
          price_a,
        },
      });
  
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      return { error: "Erreur lors de la mise à jour du produit" };
    }
  }
  

  export async function deleteInvoice(invoiceId: string) {
    try {
        // Récupérer toutes les ventes liées à la facture
        const sales = await prisma.sale.findMany({
            where: { invoiceId },
            include: { product: true },
        });

        // Restaurer les quantités des produits vendus
        for (const sale of sales) {
            if (sale.productId) {
                await prisma.product.update({
                    where: { id: sale.productId },
                    data: {
                        quantity: {
                            increment: sale.quantity, // Réajoute les produits vendus au stock
                        },
                    },
                });
            }
        }

        // Supprimer toutes les ventes liées à la facture
        await prisma.sale.deleteMany({
            where: { invoiceId },
        });

        // Supprimer la facture
        await prisma.invoice.delete({
            where: { id: invoiceId },
        });

        console.log('Facture supprimée avec succès et stock restauré.');
        
        // ✅ Retourner un objet indiquant le succès de l'opération
        return { success: true, message: 'Facture supprimée avec succès.' };

    } catch (error) {
        console.error('Erreur lors de la suppression de la facture :', error);
        
        // ✅ Retourner un objet en cas d'erreur
        return { success: false, message: 'Erreur lors de la suppression de la facture.' };
    } finally {
        await prisma.$disconnect();
    }
}

  