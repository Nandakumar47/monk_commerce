import {
  Box,
  Button,
  FormControl,
  Grid2,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  Close,
  DragIndicator,
  Edit,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { useState } from "react";
import ProductVariants from "./ProductVariants";
function ProductEntry(props) {
  const {
    position,
    productData,
    handleProductDetailsChange,
    dragHandleProps,
    handleDeleteProduct,
    showRemoveIcon,
    handleEditItemClick,
    handleVariantDelete,
  } = props;
  const [showDiscountOptions, setShowDiscountOptions] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "100%",
          paddingBottom: "8px",
        }}
      >
        <IconButton {...dragHandleProps} sx={{ cursor: "grab" }}>
          <DragIndicator />
        </IconButton>
        <Typography>{position + 1}</Typography>
        <Grid2
          container
          sx={{ width: "100%" }}
          alignItems={"center"}
          gap={"8px"}
        >
          <Grid2 size={{ xs: 8 }}>
            <TextField
              id="outlined-password-input"
              variant="outlined"
              disabled
              size="small"
              placeholder="Select Product"
              value={productData.name}
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          handleEditItemClick(position);
                        }}
                      >
                        <Edit style={{ cursor: "pointer" }} color="success" />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid2>
          <Grid2 size={{ xs: 3 }}>
            {showDiscountOptions ? (
              <Box sx={{ display: "flex", gap: "4px" }}>
                <TextField
                  size="small"
                  type="number"
                  value={productData.discountValue}
                  onChange={(evt) => {
                    handleProductDetailsChange(productData.productItemId, {
                      discountValue: evt.target.value,
                    });
                  }}
                />
                <FormControl fullWidth>
                  <Select
                    size="small"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={productData.discountType || "flat_off"}
                    onChange={(evt) => {
                      handleProductDetailsChange(productData.productItemId, {
                        discountType: evt.target.value,
                      });
                    }}
                  >
                    <MenuItem value={"flat_off"}>flat off</MenuItem>
                    <MenuItem value={"percentage_off"}>% off</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            ) : (
              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{ padding: "8px" }}
                onClick={() => {
                  setShowDiscountOptions(true);
                }}
              >
                Add Discount
              </Button>
            )}
          </Grid2>
        </Grid2>
        <IconButton
          disabled={!showRemoveIcon}
          onClick={() => {
            handleDeleteProduct(productData.productItemId);
          }}
        >
          <Close />
        </IconButton>
      </Box>

      {productData.productVariants?.length ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "40px",
          }}
        >
          <Box
            component={"span"}
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "underline",
              color: "#1976d2",
              cursor: "pointer",
            }}
            onClick={() => setShowVariants((prev) => !prev)}
          >
            Show variant
            <IconButton color="primary">
              {showVariants ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
            </IconButton>
          </Box>
        </Box>
      ) : null}
      {showVariants && (
        <Box sx={{ marginLeft: "48px" }}>
          <ProductVariants
            variants={productData.productVariants}
            handleVariantDelete={handleVariantDelete}
          />
        </Box>
      )}
    </Box>
  );
}

export default ProductEntry;
