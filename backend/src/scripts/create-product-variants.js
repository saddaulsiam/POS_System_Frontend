import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createProductWithVariants() {
  try {
    console.log("🧪 Creating test product with variants...\n");

    // Find or create a category
    let category = await prisma.category.findFirst({
      where: { name: "Beverages" },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: "Beverages",
          icon: "🥤",
        },
      });
      console.log("✅ Created Beverages category");
    }

    // Create the main product (parent)
    const product = await prisma.product.create({
      data: {
        name: "Premium Water Bottle",
        image: "https://res.cloudinary.com/dtkl4ic8s/image/upload/v1762253769/pos/products/pqwcgpasm8cumjco4bhp.jpg",
        sku: "WATER-001",
        barcode: "8901234567890",
        description: "Premium filtered water in various sizes",
        categoryId: category.id,
        purchasePrice: 15.0,
        sellingPrice: 25.0,
        stockQuantity: 0, // Parent product has no stock (variants have stock)
        lowStockThreshold: 10,
        isWeighted: false,
        isActive: true,
        taxRate: 5.0,
        hasVariants: true, // Enable variants for this product
      },
    });

    console.log(`✅ Created product: ${product.name} (ID: ${product.id})\n`);

    // Create variants
    const variants = [
      {
        name: "500ml",
        sku: "WATER-001-500ML",
        barcode: "8901234567891",
        purchasePrice: 15.0,
        sellingPrice: 25.0,
        stockQuantity: 50,
      },
      {
        name: "1 Liter",
        sku: "WATER-001-1L",
        barcode: "8901234567892",
        purchasePrice: 25.0,
        sellingPrice: 40.0,
        stockQuantity: 40,
      },
      {
        name: "2 Liter",
        sku: "WATER-001-2L",
        barcode: "8901234567893",
        purchasePrice: 40.0,
        sellingPrice: 65.0,
        stockQuantity: 30,
      },
      {
        name: "5 Liter",
        sku: "WATER-001-5L",
        barcode: "8901234567894",
        purchasePrice: 80.0,
        sellingPrice: 120.0,
        stockQuantity: 20,
      },
    ];

    console.log("Creating variants:");
    for (const variantData of variants) {
      const variant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          ...variantData,
          isActive: true,
        },
      });
      console.log(`  ✅ ${variant.name} - ${variant.sku} (Stock: ${variant.stockQuantity})`);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createProductWithVariants();
