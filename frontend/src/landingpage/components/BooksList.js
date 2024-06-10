import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import ActionAreaCard from "./BookCard";
const images = require.context("../../assets/", true, /\.webp$/);

const GET_BOOKS = gql`
  query GetBooks {
    books {
      title
      author
      coverPhotoURL
      readingLevel
    }
  }
`;

function importImage(imagePath) {
  try {
    return require(`../../${imagePath}`);
  } catch (err) {
    return require("../../assets/default.webp"); // Path to a default image
  }
}

function BooksList() {
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px",
      }}
    >
      {data.books.map(({ title, coverPhotoURL, author }) => (
        <ActionAreaCard
          key={title}
          image={importImage(coverPhotoURL)}
          title={title}
          author={author}
        />
      ))}
    </div>
  );
}

export default BooksList;
