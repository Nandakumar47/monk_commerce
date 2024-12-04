import { Box, Checkbox, Typography } from "@mui/material";
import React from "react";

function ProductVariantList({ variants, changeSelection }) {
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
                changeSelection(
                  false,
                  evt.target.checked,
                  data.product_id,
                  data.id
                );
              }}
              color="success"
              checked={data?.isSelected}
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
