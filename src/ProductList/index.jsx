import {
  Box,
  Modal,
  Typography,
  IconButton,
  Button,
  Checkbox,
  TextField,
  TablePagination,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useCallback, useEffect, useState } from "react";
import { dataSet } from "../constant";
import ProductVariantList from "./ProductVariantList";
import { Close, Search } from "@mui/icons-material";
import axios from "axios";
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
  height: "80vh",
};
const handleDebouncing = (delay) => {
  let timer;
  return (cb, ...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => cb(...args), delay);
  };
};
function ProductList(props) {
  const { openProductList, handleClose, handleProductAdd } = props;
  const [restructuredProductList, setRestructuredProductList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceFetch = useCallback(handleDebouncing(1000), []);
  useEffect(() => {
    fetchAndUpdateProductList(searchText, page);
  }, []);
  useEffect(() => {
    console.log({ selectedItems });
  }, [selectedItems]);
  const fetchAndUpdateProductList = async (searchText, page) => {
    try {
      setIsLoading(true);
      const queryParams = { search: searchText, page: page, limit: 5 };
      const headers = { "x-api-key": "72njgfa948d9aS7gs5" };
      const url = "https://stageapi.monkcommerce.app/task/products/search";
      const response = await axios.get(url, {
        params: queryParams,
        headers,
      });
      setIsLoading(false);
      if (response.status === 200 && response.data) {
        const products = response.data;
        setRestructuredProductList(products);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  const handleProductCheck = (product, isChecked) => {
    setSelectedItems((prev) => {
      const updated = [...prev];
      const existingProductIndex = updated.findIndex(
        (item) => item.id === product.id
      );

      if (isChecked) {
        if (existingProductIndex !== -1) {
          const existingProduct = updated[existingProductIndex];
          const unselectedVariants = product.variants.filter(
            (variant) =>
              !existingProduct.variants.some(
                (selectedVariant) => selectedVariant.id === variant.id
              )
          );
          existingProduct.variants.push(...unselectedVariants);
        } else {
          updated.push({
            ...product,
            variants: [...product.variants],
          });
        }
      } else {
        return updated.filter((item) => item.id !== product.id);
      }

      return updated;
    });
  };

  const handleVariantCheck = (product, variant, isChecked) => {
    setSelectedItems((prev) => {
      const updated = [...prev];
      const productIndex = updated.findIndex((item) => item.id === product.id);

      if (productIndex === -1 && isChecked) {
        updated.push({
          ...product,
          variants: [variant],
        });
      } else if (productIndex !== -1) {
        const existingProduct = updated[productIndex];
        if (isChecked) {
          existingProduct.variants.push(variant);
        } else {
          existingProduct.variants = existingProduct.variants.filter(
            (v) => v.id !== variant.id
          );
          if (existingProduct.variants.length === 0) {
            updated.splice(productIndex, 1);
          }
        }
      }

      return updated;
    });
  };

  const handleAddProductsClick = () => {
    handleProductAdd(selectedItems);
    handleClose();
  };
  const handleSearch = (searchValue) => {
    setSearchText(searchValue);
    debounceFetch(fetchAndUpdateProductList, searchValue, 0);
  };
  const isProductSelected = (product) => {
    const selectedProduct = selectedItems.find(
      (item) => item.id === product.id
    );

    if (!selectedProduct) {
      return false;
    }

    return selectedProduct.variants.length === product.variants.length;
  };

  const isVariantSelected = (product, variant) => {
    const selectedProduct = selectedItems.find(
      (item) => item.id === product.id
    );
    if (selectedProduct) {
      const isVariantFound = selectedProduct.variants.some(
        (v) => v.id === variant.id
      );
      return Boolean(isVariantFound);
    }
    return false;
  };
  return (
    <Modal
      open={openProductList}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={isLoading}
          onClick={() => {}}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
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
            onChange={(evt) => handleSearch(evt.target.value)}
            slotProps={{
              input: {
                startAdornment: <Search sx={{ marginRight: "4px" }} />,
                endAdornment: searchText.length ? (
                  <IconButton disableRipple onClick={() => handleSearch("")}>
                    <Close />
                  </IconButton>
                ) : null,
              },
            }}
          />
        </Box>
        <hr />
        <Box sx={{ height: "calc(100% - 180px)", overflowY: "auto" }}>
          {restructuredProductList?.length ? (
            restructuredProductList?.map((data) => (
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
                      handleProductCheck(data, evt.target.checked);
                    }}
                    color="success"
                    checked={isProductSelected(data)}
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
                    onVariantChange={(variant, isChecked) =>
                      handleVariantCheck(data, variant, isChecked)
                    }
                    checkIsVariantSelected={(variant) => {
                      const isSelected = isVariantSelected(data, variant);
                      return isSelected;
                    }}
                  />
                </Box>
                <hr />
              </>
            ))
          ) : (
            <Box>No Data Available</Box>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            borderTop: "1px solid #ddd",
            pt: 1,
            pb: 1,
            mt: 2,
            position: "fixed",
            bottom: 0,
            width: "94%",
            background: "white",
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
