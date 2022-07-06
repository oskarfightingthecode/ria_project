import { db } from '../utils/db.server';
import type { Author } from '../author/author.service';

type BookRead = {
  id: number;
  title: string;
  author: Author;
  //   authorId: number;
};

type BookWrite = {
  title: string;
  authorId: number;
  price: number;
};

export const listBooks = async (): Promise<BookRead[]> => {
  return db.book.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      //   authorId: true,
    },
  });
};

export const getBook = async (id: number): Promise<BookRead | null> => {
  return db.book.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      price: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const createBook = async (book: BookWrite): Promise<BookRead> => {
  const { title, authorId, price } = book;

  return db.book.create({
    data: {
      title,
      authorId,
      price,
    },
    select: {
      id: true,
      title: true,
      price: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const updateBook = async (
  book: BookWrite,
  id: number
): Promise<BookRead> => {
  const { title, authorId, price } = book;
  return db.book.update({
    where: {
      id,
    },
    data: {
      title,
      authorId,
      price,
    },
    select: {
      id: true,
      title: true,
      price: true,
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const deleteBook = async (id: number): Promise<void> => {
  await db.book.delete({
    where: {
      id,
    },
  });
};
