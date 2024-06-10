import { booksData } from '../data/books.js';
export const resolvers = {
    Query: {
        books: () => booksData,
    },
};
