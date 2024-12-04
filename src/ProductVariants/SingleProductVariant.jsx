import { Close, DragIndicator } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React from "react";

function SingleProductVariant({
  dragHandleProps,
  singleVariantData,
  handleVariantDelete,
  disableDelete,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Box sx={{ display: "flex" }}>
        <IconButton {...dragHandleProps} sx={{ cursor: "grab" }}>
          <DragIndicator />
        </IconButton>
        <Box
          sx={{
            padding: "8px 16px",
            border: "1px solid lightgrey",
            borderRadius: "16px",
            minWidth: "500px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>{singleVariantData.title}</Box>
          <Box>₹{singleVariantData.price}</Box>
        </Box>
      </Box>
      <IconButton
        disabled={disableDelete}
        onClick={() => {
          handleVariantDelete(
            singleVariantData.product_id,
            singleVariantData.id
          );
        }}
      >
        <Close />
      </IconButton>
    </Box>
  );
}

export default SingleProductVariant;
