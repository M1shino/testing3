import { getDb } from "@/lib/db";

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const { q } = await searchParams;

    console.log("q:", q);

    if (q == null || q === "") {
        return <div>No Search query</div>;
    }

    const db = getDb();

    const songs = await db
        .selectFrom("songs")
        .innerJoin("albums", "songs.album_id", "albums.id")
        .innerJoin("authors", "albums.author_id", "authors.id")
        .select([
            "songs.id",
            "songs.name",
            "albums.name as album_name",
            "authors.name as author_name",
        ])
        .where("songs.name", "like", `%${q}%`)
        .execute();

    const albums = await db
        .selectFrom("albums")
        .innerJoin("authors", "albums.author_id", "authors.id")
        .select([
            "albums.id",
            "albums.name",
            "albums.release_date",
            "authors.name as author_name",
            "authors.id as author_id",
        ])
        .where("albums.name", "like", `%${q}%`)
        .execute();

    const authors = await db
        .selectFrom("authors")
        .selectAll()
        .where("authors.name", "like", `%${q}%`)
        .execute();

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <div>
                    <p data-cy="songs-section-title">Songs</p>
                    <ul data-cy="songs-list">
                        {songs.map((song) => (
                            <li data-cy="song-item" key={song.id}>
                                {song.name} - {song.album_name} -{" "}
                                {song.author_name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p data-cy="albums-section-title">Albums</p>
                    <ul data-cy="albums-list">
                        {albums.map((album) => (
                            <li data-cy="album-item" key={album.id}>
                                {album.name} - {album.author_name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p data-cy="authors-section-title">Authors</p>
                    <ul data-cy="authors-list">
                        {authors.map((author) => (
                            <li data-cy="author-item" key={author.id}>
                                {author.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}
