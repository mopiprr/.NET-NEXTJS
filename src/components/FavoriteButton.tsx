"use client";

import { use, useOptimistic, useState, useTransition } from "react";
import { toggleFavoriteAction } from "@/app/actions";

export default function FavoriteButton({
  pizzaId,
  pizzaName,
  favoriteIdsPromise,
}: {
  pizzaId: string;
  pizzaName: string;
  favoriteIdsPromise: Promise<string[]>;
}) {
  // isFavorite menyimpan nilai asli dari server, yang diperoleh dari favoriteIdsPromise. Nilai ini akan digunakan untuk menentukan apakah pizza saat ini sudah menjadi favorit atau belum.
  const isFavorite = use(favoriteIdsPromise).includes(pizzaId);
  // optimisticFavorite menyimpan nilai favorit yang bersifat optimis. Nilai ini akan diubah secara langsung ketika pengguna mengklik tombol favorit, sehingga UI akan segera menampilkan perubahan sebelum aksi server selesai.
  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(isFavorite);
  // isPending menyimpan status transisi, yang akan menjadi true ketika aksi toggleFavoriteAction sedang berlangsung. startTransition digunakan untuk menandai bahwa kita akan melakukan update state yang bersifat transisi.
  const [isPending, startTransition] = useTransition();
  // isError menyimpan status error, yang akan menjadi true jika aksi toggleFavoriteAction gagal. setError digunakan untuk mengatur nilai error ketika aksi gagal.
  const [error, setError] = useState<string | null>(null);

  // penjelasan singkat: handleClick akan dipanggil ketika tombol favorit diklik. Fungsi ini akan mengatur error menjadi null, kemudian memulai transisi untuk mengubah status favorit secara optimis. Jika aksi toggleFavoriteAction gagal, error akan diatur dengan pesan error yang diterima.
  function handleClick() {
    // setError(null) untuk menghapus error sebelumnya sebelum memulai aksi baru.
    setError(null);
    // startTransition digunakan untuk menandai bahwa kita akan melakukan update state yang bersifat transisi. Ini memungkinkan React untuk menunda rendering hingga aksi selesai, sehingga UI tetap responsif.
    startTransition(async () => {
      // setOptimisticFavorite(!optimisticFavorite) untuk mengubah status favorit secara optimis. Ini berarti UI akan langsung menampilkan perubahan sebelum aksi server selesai.
      setOptimisticFavorite(!optimisticFavorite);
      const result = await toggleFavoriteAction(pizzaId);
      // jika gagal, kita mengembalikan status favorit ke nilai sebelumnya dengan setOptimisticFavorite(!optimisticFavorite). Ini memastikan bahwa UI tetap konsisten dengan status server jika aksi gagal.
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <div className="flex shrink-0 flex-col items-end">
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={optimisticFavorite}
        aria-busy={isPending}
        aria-label={`${optimisticFavorite ? "Hapus" : "Tambah"} ${pizzaName} ${optimisticFavorite ? "dari" : "ke"} favorit`}
        className={`text-2xl leading-none text-brand transition-opacity ${
          isPending ? "opacity-50" : ""
        }`}
      >
        {optimisticFavorite ? "♥" : "♡"}
      </button>
      {error && (
        <p
          role="alert"
          className="mt-1 max-w-32 text-right text-xs text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  );
}
