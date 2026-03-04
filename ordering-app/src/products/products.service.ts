import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';

const PRODUCTS_DATA = [
  {
    "item_id": "HV-STR-80P",
    "listing": "Freeze-Dried Strawberry Powder, Organic — Harvest Valley Co.",
    "category": "Fruits",
    "details": { "form": "Powder (80 mesh)", "process": "Freeze-Dried" },
    "certifications": "USDA Organic | OU-D Kosher | Non-GMO Project Verified | Gluten-Free",
    "sourcing": "Watsonville, California, USA",
    "pricing": "$42.50/kg, MOQ 25 kg",
    "availability": "In stock",
    "technical": "Aw 0.22, Moisture 3.5%, Shelf life 24 mo",
    "suggested_use": "Smoothie mixes, nutrition bars, supplements, yogurt inclusions",
    "notes": "Vibrant red color. Excellent flavor profile."
  },
  {
    "item_id": "TV-MNG-10D",
    "listing": "Mango Diced 10mm — TropiVerde Ingredients",
    "category": "Tropical Fruits",
    "details": { "form": "Diced", "size": "10mm cubes", "process": "Air-Dried" },
    "certifications": "Kosher (Triangle-K), FSSC 22000",
    "sourcing": "Sinaloa, Mexico",
    "pricing": "$28.00/kg, MOQ 50 kg",
    "availability": "Available, 2 week lead time",
    "technical": "Aw 0.35, Moisture 6.2%, 18 month shelf life",
    "suggested_use": "Trail mix, cereal, baked goods, snack bars",
    "notes": ""
  },
  {
    "item_id": "HV-WBB-WH",
    "listing": "Organic Wild Blueberry, Whole Freeze-Dried — Harvest Valley Co.",
    "category": "Fruits",
    "details": { "form": "Whole", "process": "Freeze-Dried" },
    "certifications": "USDA Organic | OU Kosher | Non-GMO Project Verified",
    "sourcing": "Quebec, Canada",
    "pricing": "$68.00/kg, MOQ 10 kg",
    "availability": "In stock",
    "technical": "Aw 0.18, Moisture 2.8%, 24 month shelf life",
    "suggested_use": "Cereals, trail mix, baking, snack mixes, smoothie bowls",
    "notes": "Premium wild variety. Intense purple color. Hand-sorted."
  },
  {
    "item_id": "TV-GVA-SL",
    "listing": "Guava Slices, Dried — TropiVerde Ingredients",
    "category": "Tropical Fruits",
    "details": { "form": "Slices (3mm)", "process": "Air-Dried" },
    "certifications": "Kosher",
    "sourcing": "Colombia",
    "pricing": "$14.50/kg (MOQ: 100 kg)",
    "availability": "In stock",
    "technical": "Aw 0.32, Moisture 5%, Shelf life: 12 months",
    "suggested_use": "Trail mix, snacking, cereal topping, smoothies",
    "notes": "Pink flesh variety. Light dusting of cane sugar. Sweet-tart flavor."
  },
  {
    "item_id": "PH-SPN-100P",
    "listing": "Spinach Powder, Organic — Pacific Harvest Ltd.",
    "category": "Vegetables & Greens",
    "details": { "form": "Powder (100 mesh)", "process": "Air-Dried" },
    "certifications": "USDA Organic; EU Organic; OU Kosher",
    "sourcing": "Shandong, China",
    "pricing": "$22.00/kg, MOQ 50 kg",
    "availability": "In stock",
    "technical": "Aw 0.20; Moisture 5.0%; Shelf life 18 months",
    "suggested_use": "Smoothies, pasta, supplements, baby food, soups",
    "notes": "Rich dark green color. High iron content."
  },
  {
    "item_id": "PH-TOM-FL",
    "listing": "Sun-Dried Tomato Flakes — Pacific Harvest Ltd.",
    "category": "Vegetables",
    "details": { "form": "Flakes", "process": "Sun-Dried" },
    "certifications": "FSSC 22000, BRC Grade AA",
    "sourcing": "Turkey",
    "pricing": "$15.00/kg, MOQ 100 kg",
    "availability": "Seasonal - available now",
    "technical": "Aw 0.40, Moisture 8.0%, Shelf life 12 months",
    "suggested_use": "Sauces, pizzas, breads, seasoning blends, dressings",
    "notes": "Intense umami flavor. Rehydrates in 10-15 minutes."
  },
  {
    "item_id": "HV-APL-6D",
    "listing": "Apple Diced 6mm, Organic — Harvest Valley Co.",
    "category": "Fruits",
    "details": { "form": "Diced", "size": "6mm", "process": "Air-Dried", "variety": "Fuji/Gala blend" },
    "certifications": "USDA Organic | OU Kosher | Non-GMO Project Verified",
    "sourcing": "Washington State, USA",
    "pricing": "$32.00/kg, MOQ 25 kg",
    "availability": "In stock",
    "technical": "Aw 0.28, Moisture 4.5%, 18 mo shelf life",
    "suggested_use": "Oatmeal, cereal, baked goods, trail mix, baby food",
    "notes": "Treated with citric acid to prevent browning."
  },
  {
    "item_id": "PH-CRN-HV",
    "listing": "Sweetened Dried Cranberry Halves — Pacific Harvest Ltd.",
    "category": "Fruits & Berries",
    "details": { "form": "Halves", "process": "Infused, Dried" },
    "certifications": "Kosher, Non-GMO Project Verified",
    "sourcing": "Massachusetts, USA",
    "pricing": "$18.50/kg, MOQ 50 kg",
    "availability": "In stock",
    "technical": "Aw 0.45, Moisture 12.0%, 12 months shelf life",
    "suggested_use": "Trail mix, baked goods, salads, cereals, snacking",
    "notes": "Sweetened with cane sugar. Contains sunflower oil (processing aid). Sulfite-free."
  },
  {
    "item_id": "HV-BRT-60P",
    "listing": "Organic Beetroot Powder — Harvest Valley Co.",
    "category": "Vegetables & Roots",
    "details": { "form": "Powder (60 mesh)", "process": "Air-Dried" },
    "certifications": "USDA Organic | EU Organic | OU Kosher | Non-GMO Project Verified | Gluten-Free",
    "sourcing": "Rajasthan, India",
    "pricing": "$26.00/kg, MOQ 25 kg",
    "availability": "In stock, limited quantity",
    "technical": "Aw 0.19, Moisture 4.0%, 24 months shelf life",
    "suggested_use": "Natural colorant, smoothies, supplements, pasta, sports nutrition",
    "notes": "Commonly used as natural red/pink colorant. High nitrate content."
  },
  {
    "item_id": "TV-DRG-WH",
    "listing": "Dragon Fruit Pieces, Freeze-Dried — TropiVerde Ingredients",
    "category": "Tropical Fruits",
    "details": { "form": "Pieces", "size": "~15mm irregular", "process": "Freeze-Dried" },
    "certifications": "Kosher, FSSC 22000",
    "sourcing": "Vietnam",
    "pricing": "$38.00/kg, MOQ 25 kg",
    "availability": "In stock",
    "technical": "Aw 0.18, Moisture 2.5%, Shelf life: 24 months",
    "suggested_use": "Smoothie bowls, cereal, chocolate inclusions, baking, snack mixes",
    "notes": "White flesh variety with distinctive black seeds. Crunchy texture. Vivid magenta skin pieces included."
  }
];

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
        private readonly configService: ConfigService,
          private readonly httpService: HttpService,


  ) {}

  async searchWithLLM(query: string): Promise<Product[]> {
  try {
    const allProducts = await this.productRepo.find();

    const catalog = allProducts.map((p) => ({
      item_id: p.item_id,
      listing: p.listing,
      category: p.category,
      supplier: p.supplier,
      certifications: p.certifications,
      suggested_use: p.suggested_use,
      notes: p.notes,
      details: p.details,
    }));

    const llmUrl = 'http://localhost:8000';

    const response = await firstValueFrom(
      this.httpService.post(`${llmUrl}/search`, {
        query,
        products: catalog,
      }),
    );

    const matchedIds: string[] = response.data.matched_ids;

    if (!matchedIds || matchedIds.length === 0) return [];

    const products = await Promise.all(
      matchedIds.map((id) => this.productRepo.findOneBy({ item_id: id })),
    );

    return products.filter((p): p is Product => p !== null);
  } catch (error) {
    // fallback to regular keyword search
    return this.findAll({ q: query });
  }
}

  async findAll(query: { category?: string; cert?: string; supplier?: string; q?: string }): Promise<Product[]> {
  const qb = this.productRepo.createQueryBuilder('product');

  if (query.category) {
    qb.andWhere('LOWER(product.category) = LOWER(:category)', { category: query.category });
  }

  if (query.supplier) {
    qb.andWhere('LOWER(product.supplier) = LOWER(:supplier)', { supplier: query.supplier });
  }

  if (query.cert) {
    qb.andWhere(':cert = ANY(product.certifications)', { cert: query.cert });
  }

  if (query.q) {
    qb.andWhere(
      'LOWER(product.listing) LIKE LOWER(:q) OR LOWER(product.notes) LIKE LOWER(:q) OR LOWER(product.suggested_use) LIKE LOWER(:q)',
      { q: `%${query.q}%` },
    );
  }

  return qb.getMany();
}

async findOne(item_id: string): Promise<Product> {
  const product = await this.productRepo.findOneBy({ item_id });
  if (!product) throw new NotFoundException(`Product ${item_id} not found`);
  return product;
}

  private parseSupplier(listing: string): string {
    const match = listing.match(/—\s*(.+)$/);
    return match ? match[1].trim() : 'Unknown';
  }

  private parsePriceAndMoq(pricing: string): { price_per_kg: number | null; moq_kg: number | null } {
    const priceMatch = pricing.match(/\$([0-9.]+)\/kg/);
    const moqMatch = pricing.match(/MOQ\s*:?\s*(\d+)\s*kg/i);
    return {
      price_per_kg: priceMatch ? parseFloat(priceMatch[1]) : null,
      moq_kg: moqMatch ? parseInt(moqMatch[1]) : null,
    };
  }

  private parseCertifications(certs: string): string[] {
    return certs.split(/[|,;]/).map((c) => c.trim()).filter(Boolean);
  }

  private parseInStock(availability: string): boolean {
    return availability.toLowerCase().includes('in stock');
  }

  async seed(): Promise<{ seeded: number; skipped: number }> {
    let seeded = 0;
    let skipped = 0;

    for (const item of PRODUCTS_DATA) {
      const existing = await this.productRepo.findOneBy({ item_id: item.item_id });
      if (existing) {
        skipped++;
        continue;
      }

      const { price_per_kg, moq_kg } = this.parsePriceAndMoq(item.pricing);

      const product = this.productRepo.create({
        item_id: item.item_id,
        listing: item.listing,
        category: item.category,
        supplier: this.parseSupplier(item.listing),
        details: item.details,
        certifications: this.parseCertifications(item.certifications),
        sourcing: item.sourcing,
        price_per_kg,
        moq_kg,
        in_stock: this.parseInStock(item.availability),
        technical: item.technical,
        suggested_use: item.suggested_use,
        notes: item.notes,
      } as Product);

      await this.productRepo.save(product);
      seeded++;
    }

    return { seeded, skipped };
  }
}