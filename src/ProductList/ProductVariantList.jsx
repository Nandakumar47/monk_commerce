import { Box, Checkbox, Typography } from "@mui/material";
import React from "react";

function ProductVariantList({
  variants,
  onVariantChange,
  checkIsVariantSelected,
}) {
  return (
    <>
      {variants.map((data) => (
        <Box
          key={data.id}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              onChange={(evt) => {
                onVariantChange(data, evt.target.checked);
              }}
              color="success"
              checked={checkIsVariantSelected(data)}
            />
            <Typography variant="body1">{data.title}</Typography>
          </Box>
          <Typography variant="body1">₹{data.price}</Typography>
        </Box>
      ))}
    </>
  );
}

export default ProductVariantList;
