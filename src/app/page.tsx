"use client";
import ImageGrid from "@/components/imageGrid";
import SearchBar from "@/components/searchbar";
import { UnsplashColor, UnsplashImage } from "@/types/unsplash";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import FilterOnColor from "@/components/filterOnColor";
import { get } from "http";

export default function Home() {
  const nbrImagesPerPage: number = 24;

  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("search") || "";
  const initialColors =
    (searchParams.get("colors")?.split(",") as UnsplashColor[]) || [];

  const page = Number(searchParams.get("page") || 1);

  const [query, setQuery] = useState(initialQuery);
  const [totalPages, setTotalPages] = useState(1);
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedColors, setSelectedColors] =
    useState<UnsplashColor[]>(initialColors);

  useEffect(() => {
    console.log("testing for race condition");
    if (initialQuery) {
      if (page < 1) {
        console.log("Redirecting to page 1");
        router.push(`/?search=${encodeURIComponent(initialQuery)}&page=1`);
        return;
      }
      getImages(initialQuery, page);
    } else {
      // Clear states if no initial Query
      setHasSearched(false);
      setQuery("");
      setImages([]);
      setIsLoading(false);
      setSelectedColors([]);
    }
  }, [initialQuery, page]);

  async function getImages(
    query: string,
    newPage: number
  ): Promise<UnsplashImage[]> {
    setIsLoading(true);
    setHasSearched(true);

    const params = new URLSearchParams({
      q: query,
      per_page: nbrImagesPerPage.toString(),
      page: newPage.toString(),
    });

    if (selectedColors[0]) {
      params.set("color", selectedColors[0]);
    }

    const res = await fetch(`/api/search?${params.toString()}`, {
      cache: "no-store",
    });

    const data = await res.json();

    setTotalPages(data.total_pages);

    if (page > data.total_pages && data.total_pages > 0) {
      router.push(`/?search=${encodeURIComponent(query)}&page=${1}`);
    }

    {
      /*
      Check for errors
    */
    }

    if (data.error) {
      console.error("Error fetching images:", data.error);
      setIsLoading(false);
      return [];
    }

    setImages(data.images);
    setIsLoading(false);

    return data.images;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/?search=${encodeURIComponent(query)}&page=1`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (query) {
        console.log("Searching for", query);
        const params = new URLSearchParams(searchParams.toString());
        params.set("search", query);
        params.set("page", "1");
        router.push(`?${params.toString()}`);
        getImages(query, 1);
      }
    }
  };

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString()); // from useSearchParams()
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const updateColorUrl = (colors: UnsplashColor[]) => {
    console.log("Updating colors in URL:", colors);
    const params = new URLSearchParams(searchParams.toString());
    if (colors.length > 0) {
      params.set("colors", colors.join(","));
    } else {
      params.delete("colors");
    }
    router.push(`?${params.toString()}`);
  };

  const handleRemove = (value: UnsplashColor) => {
    if (!selectedColors.includes(value)) return;
    const updated = selectedColors.filter((v) => v !== value);
    console.log("Removing", value, updated);
    setSelectedColors(updated);
    updateColorUrl(updated);
  };

  const handleSelect = (value: UnsplashColor) => {
    if (selectedColors.includes(value)) {
      handleRemove(value);
      return;
    }
    const updated = [...selectedColors, value];
    setSelectedColors(updated);
    updateColorUrl(updated);
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-24 gap-5">
      {/* TODOD: Add a header and a footer */}
      <Link href="/" className="block">
        <h1 className="text-4xl md:text-7xl font-bold p-10 cursor-pointer">
          Image Search
        </h1>
        {/* Search icon */}
      </Link>
      <form
        onSubmit={handleSearch}
        className="flex flex-col justify-center items-center mb-4 w-96"
      >
        <SearchBar
          searchTerm={query}
          setSearchTerm={setQuery}
          handleKeyDown={handleKeyDown}
        />
        <FilterOnColor
          selectedColors={selectedColors}
          setSelectedColors={setSelectedColors}
          handleRemove={handleRemove}
          handleSelect={handleSelect}
        />
      </form>
      {hasSearched || isLoading ? (
        <>
          <ImageGrid
            images={images}
            isLoading={isLoading}
            nbrImagesPerPage={nbrImagesPerPage}
          />
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) setPage(page - 1);
                      }}
                      className={
                        page === 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {/* Current page */}
                  <PaginationItem>
                    <PaginationLink isActive>{page}</PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < totalPages) setPage(page + 1);
                      }}
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <>
          <img
            src="/undraw_searching_no1g.svg"
            alt="searching"
            className="w-1/4"
          />
          {/* <p>Search for some images!</p> */}
        </>
      )}
    </div>
  );
}
