import {
  Box,
  Modal,
  Typography,
  IconButton,
  Button,
  Checkbox,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import { dataSet } from "../constant";
import ProductVariantList from "./ProductVariantList";
import { Search } from "@mui/icons-material";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 500,
  bgcolor: "background.paper",
  border: "1px solid lightgrey",
  borderRadius: "8px",
  boxShadow: 24,
  p: 2,
};

function ProductList(props) {
  const { openProductList, handleClose, handleProductAdd } = props;
  const [restructuredProductList, setRestructuredProductList] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    const searchResultValues = restructuredProductList.filter((result) => {
      return result.title.toLowerCase().includes(searchText.toLowerCase());
    });
    setSearchResult(searchResultValues);
  }, [searchText, restructuredProductList]);
  useEffect(() => {
    const modifiedList = dataSet.map((product) => {
      return {
        ...product,
        isSelected: false,
        variants: product.variants.map((variant) => ({
          ...variant,
          isSelected: false,
        })),
      };
    });
    setRestructuredProductList(modifiedList);
    setSearchResult(modifiedList);
  }, []);

  const changeSelection = (isProduct, isChecked, productId, variantId) => {
    if (isProduct) {
      const updatedList = restructuredProductList.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            isSelected: isChecked,
            variants: product.variants.map((variant) => ({
              ...variant,
              isSelected: isChecked,
            })),
          };
        } else {
          return product;
        }
      });
      setRestructuredProductList(updatedList);
    } else {
      const updatedList = restructuredProductList.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            variants: product.variants.map((variant) => {
              if (variant.id === variantId) {
                return {
                  ...variant,
                  isSelected: isChecked,
                };
              } else {
                return variant;
              }
            }),
          };
        } else {
          return product;
        }
      });
      setRestructuredProductList(updatedList);
    }
  };
  const handleAddProductsClick = () => {
    const selectedProducts = restructuredProductList
      .filter(
        (product) =>
          product.isSelected ||
          product.variants.some((variant) => variant.isSelected)
      )
      .map((product) => ({
        ...product,
        variants: product.variants.filter((variant) => variant.isSelected),
      }));
    handleProductAdd(selectedProducts);
    handleClose();
  };
  return (
    <Modal
      open={openProductList}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #ddd",
            pb: 1,
            mb: 2,
          }}
        >
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Add products
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ marginBottom: "8px" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search products"
            value={searchText}
            onChange={(evt) => setSearchText(evt.target.value)}
            slotProps={{
              input: { startAdornment: <Search sx={{ marginRight: "4px" }} /> },
            }}
          />
        </Box>
        <hr />
        {searchResult?.length ? (
          searchResult?.map((data) => (
            <>
              <Box
                key={data.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <Checkbox
                  onChange={(evt) => {
                    changeSelection(true, evt.target.checked, data.id);
                  }}
                  color="success"
                  checked={data.isSelected}
                />
                <img
                  src={data.image.src}
                  alt={data.title}
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    border: "1px solid grey",
                  }}
                />
                <Typography variant="body1">{data.title}</Typography>
              </Box>
              <Box sx={{ marginLeft: "40px" }}>
                <ProductVariantList
                  variants={data.variants}
                  changeSelection={changeSelection}
                />
              </Box>
              <hr />
            </>
          ))
        ) : (
          <Box>No Data Available</Box>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            borderTop: "1px solid #ddd",
            pt: 1,
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={handleAddProductsClick}
          >
            Add
          </Button>
          <Button variant="outlined" color="success" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default ProductList;
