import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, IconButton, Grid, Box } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

export default function ActionAreaCard({
  id,
  image,
  title,
  author,
  readingLevel,
}) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const rawData = localStorage.getItem("savedBooks");
      const existingBooks = JSON.parse(rawData || "[]");
      const isBookSaved = existingBooks.some((book) => book.id === id);
      setIsSaved(isBookSaved);
    } catch (error) {
      console.error("Failed to parse books from localStorage:", error);
      setIsSaved(false); // Assume not saved if there's an error
    }
  }, [id]); // Depend on id

  const handleSaveToLocalStorage = () => {
    const bookDetails = { id, title, author, image, readingLevel };
    const existingBooks = JSON.parse(
      localStorage.getItem("savedBooks") || "[]"
    );
    if (!existingBooks.some((book) => book.id === id)) {
      existingBooks.push(bookDetails);
      localStorage.setItem("savedBooks", JSON.stringify(existingBooks));
      setIsSaved(true);
    }
  };

  function importImage(imagePath) {
    try {
      return require(`../../${imagePath}`);
    } catch (err) {
      return require("../../assets/default.webp"); // Path to a default image
    }
  }

  return (
    <Card sx={{ width: 200, position: "relative" }}>
      <CardActionArea>
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="140"
            image={importImage(image)}
            alt={title}
          />
          <Box
            sx={{
              position: "absolute",
              top: 2,
              right: 2,
              background: "rgba(0, 0, 50, 0.5)",
              color: "white",
              padding: "2px 5px",
              borderRadius: "10px",
            }}
          >
            {readingLevel}
          </Box>
        </Box>
        <CardContent>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item xs={9}>
              <Typography gutterBottom variant="body" component="div">
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {author}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <IconButton
                onClick={!isSaved ? handleSaveToLocalStorage : undefined}
              >
                {isSaved ? <CheckBoxIcon /> : <AddBoxIcon />}
              </IconButton>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
