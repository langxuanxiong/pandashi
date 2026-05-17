import { NextRequest, NextResponse } from "next/server";
import { searchCatalogStocks } from "@/lib/stockCatalog";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  return NextResponse.json({ stocks: searchCatalogStocks(query) });
}
