"use client";

import Link from "next/link";
import { GET } from "@/app/api/albums/route";
import { useApi } from "@/lib/utils/useApi";

type Albums = Awaited<ReturnType<typeof GET>>;

export default function Home() {
    const { data: albums, isLoading, error } = useApi<Albums>("/api/albums");

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <header>
                    <p data-cy="title" className="text-4xl font-bold">
                        Spotify
                    </p>
                </header>
                {isLoading && <p>Loading...</p>}
                {error && <p>Failed to load albums</p>}

                <div className="grid grid-cols-2 gap-4">
                    {albums?.map((album) => (
                        <div key={album.id} className="card w-64 bg-base-100 shadow-sm">
                            <div className="card-body">
                                <span className="badge badge-xs badge-warning">Pop</span>
                                <h2 className="text-3xl font-bold">{album.name}</h2>

                                <p>ID: {album.id}</p>
                                <p>
                                    Author:{" "}
                                    <Link href={`/author/${album.author_id}`}>
                                        {album.author_name}
                                    </Link>
                                </p>
                                <p>Release Date: {new Date(album.release_date).toDateString()}</p>
                                <div className="mt-6">
                                    <Link
                                        className="btn btn-primary btn-block"
                                        href={`/album/${album.id}`}
                                    >
                                        Detail
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                <p>Footer</p>
            </footer>
        </div>
    );
}
