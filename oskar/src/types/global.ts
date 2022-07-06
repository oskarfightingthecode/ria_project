export type Author = {
  id: number;
  firstName: string;
  lastName: string;
};

export type Book = {
  id: number;
  title: string;
  author: Author;
  price: number;
};
