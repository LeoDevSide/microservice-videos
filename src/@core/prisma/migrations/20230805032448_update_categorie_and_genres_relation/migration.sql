/*
  Warnings:

  - You are about to drop the `_CategoryToGenre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToGenre" DROP CONSTRAINT "_CategoryToGenre_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToGenre" DROP CONSTRAINT "_CategoryToGenre_B_fkey";

-- DropTable
DROP TABLE "_CategoryToGenre";

-- CreateTable
CREATE TABLE "GenreOnCategories" (
    "genre_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "GenreOnCategories_pkey" PRIMARY KEY ("genre_id","category_id")
);

-- AddForeignKey
ALTER TABLE "GenreOnCategories" ADD CONSTRAINT "GenreOnCategories_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenreOnCategories" ADD CONSTRAINT "GenreOnCategories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
