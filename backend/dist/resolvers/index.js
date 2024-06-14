import { booksData } from '../data/books.js';
export const resolvers = {
    Query: {
        books: (_, { limit, offset }) => {
            return booksData.slice(offset, offset + limit);
        },
        totalBooks: () => {
            return booksData.length;
        },
    },
};
