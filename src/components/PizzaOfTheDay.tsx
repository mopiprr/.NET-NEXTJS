import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { getPizzas } from "../lib/data";
import { formatPrice, lowestPrice } from "../lib/format";

const timeReset = 24 * 60 * 60 * 1000;

export default async function PizzaOfTheDay() {
    "use cache";
    cacheLife("days");

    const pizzas = await getPizzas();
    if (pizzas.length === 0) {
        return null;
    }

    const dayNumber = Math.floor(Date.now() / timeReset);
    const pizzaOfTheDay = pizzas[dayNumber % pizzas.length];

    return (
            <aside
            aria-label="Pizza of the day"
            className="relative mb-10 overflow-hidden rounded-3xl bg-linear-to-br from-brand to-brand-dark text-white shadow-lg ring-1 ring-black/10 has-[:checked]:hidden">

            {/* State tutup: checkbox tersembunyi, dikontrol oleh label "Tutup" */}
            <input id="pizza-of-the-day" type="checkbox" className="peer sr-only" />

            <div className="relative flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
                {/* Gambar pizza dengan cincin putih */}
                <Image
                src={pizzaOfTheDay.image}
                alt={pizzaOfTheDay.name}
                width={160}
                height={160}
                className="size-32 shrink-0 rounded-full object-cover shadow-xl ring-4 ring-white/80 sm:size-40" />

                <div className="flex flex-1 flex-col gap-3 text-center sm:text-left">
                {/* Badge + kategori */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-black uppercase tracking-widest text-ink">
                    Pizza of the Day
                    </span>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                    {pizzaOfTheDay.category}
                    </span>
                </div>

                {/* Nama pizza */}
                <h2 className="text-3xl font-black leading-tight">
                    <Link href={`/pizza/${pizzaOfTheDay.id}`} className="hover:underline">
                    {pizzaOfTheDay.name}
                    </Link>
                </h2>

                {/* Deskripsi (baru) */}
                <p className="line-clamp-3 max-w-2xl text-white/85">
                    {pizzaOfTheDay.description}
                </p>

                {/* Harga + tombol aksi */}
                <div className="mt-1 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                    <span className="text-lg">
                    mulai <strong className="text-2xl font-black">{formatPrice(lowestPrice(pizzaOfTheDay))}</strong>
                    </span>
                    <Link
                    href={`/pizza/${pizzaOfTheDay.id}`}
                    className="rounded-full bg-white px-5 py-2 font-bold text-brand shadow transition hover:scale-105 hover:bg-crust">
                    Lihat detail
                    </Link>
                </div>
                </div>
            </div>
            {/* <input id="pizza-of-the-day" type="checkbox" className="peer absolute inset-0 w-full cursor-pointer opacity-0 sr-only right-4 top-4" /> */}
            <label
            htmlFor="pizza-of-the-day"
            className="absolute right-4 top-4 cursor-pointer rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider transition hover:bg-white/30 peer-focus-visible:outline-2 peer-focus-visible:outline-white">
            Tutup ✕
          </label>
        </aside>
    )
}