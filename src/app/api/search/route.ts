// app/api/search/route.ts
import { UnsplashImage } from "@/types/unsplash";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const params = new URLSearchParams();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const perPage = searchParams.get("per_page") || "24";
  const page = searchParams.get("page") || "1";
  const color = searchParams.get("color") || ""; // Currently not used


  if (!query) {
    console.log("Missing query parameter");
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  if (query) params.set("query", query);
  if (perPage) params.set("per_page", perPage.toString());
  if (page) params.set("page", page.toString());
  if (color) params.set("color", color);

  try {

    const res = await fetch(
      `https://api.unsplash.com/search/photos?${params.toString()}`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from Unsplash" },
        { status: res.status }
      );
    }

    const data = await res.json();

    const images: UnsplashImage[] = data.results.map((img: any) => ({
      id: img.id,
      alt_description: img.alt_description,
      description: img.description,
      urls: img.urls,
      user: {
        name: img.user.name,
        username: img.user.username,
        portfolio_url: img.user.portfolio_url,
        profile_image: img.user.profile_image,
      },
      likes: img.likes,
      width: img.width,
      height: img.height,
    }));

    const result = {
      total: data.total,
      total_pages: data.total_pages,
      images: images,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
