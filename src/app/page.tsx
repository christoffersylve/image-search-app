"use client";
import ImageGrid from "@/components/imageGrid";
import SearchBar from "@/components/searchbar";
import { UnsplashImage } from "@/types/unsplash";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";

export default function Home() {
  const nbrImagesPerPage: number = 24;

  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);

  const [query, setQuery] = useState(initialQuery);
  const [totalPages, setTotalPages] = useState(1);
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    if (initialQuery) {
      if (page < 1) {
        router.push(`/?search=${encodeURIComponent(initialQuery)}&page=1`);
        return;
      }

      getImages(initialQuery, page);
    } else {
      setHasSearched(false);
      setQuery("");
      setImages([]);
      setIsLoading(false);
    }
  }, [initialQuery, page]);

  async function getImages(
    query: string,
    newPage: number
  ): Promise<UnsplashImage[]> {
    setIsLoading(true);
    setHasSearched(true);

    const res = await fetch(
      `/api/search?q=${query}&per_page=${nbrImagesPerPage}&page=${newPage}`,
      { cache: "no-store" }
    );

    const data = await res.json();

    setTotalPages(data.total_pages);

    if (page > data.total_pages && data.total_pages > 0) {
      router.push(`/?search=${encodeURIComponent(query)}&page=${1}`);
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
        router.push(`/?search=${encodeURIComponent(query)}&page=1`);
      }
    }
  };

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString()); // from useSearchParams()
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-24 gap-5">
      {/* TODOD: Add a header and a footer */}
      <Link href="/" className="block">
        <h1 className="text-4xl md:text-7xl font-bold p-10 cursor-pointer">
          Image Search
        </h1>
      </Link>
      <form onSubmit={handleSearch} className="mb-4">
        <SearchBar
          searchTerm={query}
          setSearchTerm={setQuery}
          handleKeyDown={handleKeyDown}
        />
      </form>
      {(hasSearched || isLoading) && (
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
      )}
    </div>
  );
}
