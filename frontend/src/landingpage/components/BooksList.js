import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import ActionAreaCard from "./BookCard";
import { useTheme } from "@mui/material/styles";
import {
  Pagination,
  Typography,
  Autocomplete,
  Stack,
  TextField,
  Box,
  Avatar,
} from "@mui/material";

const GET_BOOKS = gql`
  query GetBooks($limit: Int, $offset: Int) {
    books(limit: $limit, offset: $offset) {
      id
      title
      author
      coverPhotoURL
      readingLevel
    }
    totalBooks
  }
`;

function BooksList({ type }) {
  const theme = useTheme();
  const [localBooks, setLocalBooks] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 12;
  // Destructure refetch here from useQuery
  const { loading, error, data, refetch } = useQuery(GET_BOOKS, {
    variables: { limit, offset: (page - 1) * limit },
    fetchPolicy: "network-only", // This bypasses the cache
  });

  useEffect(() => {
    // Make sure refetch is called inside useEffect and check if it's defined
    if (refetch) {
      refetch({ limit, offset: (page - 1) * limit });
    }
  }, [page, refetch, limit]);

  useEffect(() => {
    if (type === "mylist") {
      const rawData = localStorage.getItem("savedBooks");
      try {
        const savedBooks = JSON.parse(rawData || "[]");
        setLocalBooks(savedBooks);
      } catch (error) {
        console.error("Failed to parse books from localStorage:", error);
        localStorage.removeItem("savedBooks"); // Optionally clear corrupted data
        setLocalBooks([]); // Set to empty array if parsing fails
      }
    }
  }, [type]);

  const booksToDisplay = type === "books" ? data?.books || [] : localBooks;

  const totalPages =
    type === "books"
      ? Math.ceil(data?.totalBooks / limit)
      : Math.ceil(localBooks.length / limit);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading && type === "books") return <p>Loading...</p>;
  if (error && type === "books") return <p>Error :(</p>;

  return (
    <div>
      <Stack
        direction="row"
        sx={{ p: 2 }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography
          variant="h1"
          sx={{ textAlign: "left", fontSize: "clamp(1.5rem, 3vw, 1rem)" }}
        >
          Explore &nbsp;
          <Typography
            component="span"
            variant="h5"
            sx={{
              color: (theme) =>
                theme.palette.mode === "light"
                  ? "primary.main"
                  : "primary.light",
            }}
          >
            {type === "books" ? "All Books" : "My List"}
          </Typography>
        </Typography>
        <Autocomplete
          disablePortal
          id="book-search"
          options={booksToDisplay}
          getOptionLabel={(option) => option.title || ""}
          sx={{
            width: 300,
            "& .MuiInputBase-root": {
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.background.paper,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor:
                theme.palette.mode === "light"
                  ? "rgba(0, 0, 0, 0.23)"
                  : "rgba(255, 255, 255, 0.63)",
            },
          }}
          renderInput={(params) => (
            <TextField {...params} label="Search Books" variant="outlined" />
          )}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }}
            >
              <Avatar
                src={option.coverPhotoURL}
                sx={{ width: 24, height: 24, marginRight: 2 }}
              />
              {option.title}
            </Box>
          )}
        />
      </Stack>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {booksToDisplay.slice((page - 1) * limit, page * limit).map((book) => (
          <ActionAreaCard
            key={book.id} // Use the `id` as the key
            id={book.id}
            image={book.coverPhotoURL}
            title={book.title}
            author={book.author}
            readingLevel={book.readingLevel}
          />
        ))}
      </div>
      <div
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default BooksList;
