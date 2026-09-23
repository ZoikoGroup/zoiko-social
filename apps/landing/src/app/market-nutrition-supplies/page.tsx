import type { Metadata } from "next";
import Hero from "./components/Hero";
import ProductListing from "./components/ProductListing";
import ShopWithConfidence from "./components/ShopWithConfidence";
import FAQ from "./components/FAQ";

export const metadata: Metadata = {
  title: "Nutrition & Supplies | Zoiko Social Market",
  description:
    "Discover pet food, nutrition, and care supplies from trusted sources. Browse by species, life stage, and product type with clear, source-approved information.",
};

export default function MarketNutritionSuppliesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <ProductListing />
      <ShopWithConfidence />
      <FAQ />
    </div>
  );
}
