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
  Divider,
  Pagination,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useCallback, useEffect, useState } from "react";
import { dataSet } from "../constant";
import ProductVariantList from "./ProductVariantList";
import { ChevronLeft, ChevronRight, Close, Search } from "@mui/icons-material";
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
  pb: 5,
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
  const [isPageIncrementDisabled, setIsPageIncrementDisabled] = useState(false);
  useEffect(() => {
    fetchAndUpdateProductList(searchText, page);
  }, []);
  const fetchAndUpdateProductList = async (searchText, page) => {
    try {
      setIsLoading(true);
      isPageIncrementDisabled && setIsPageIncrementDisabled(false);
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
        if (products?.length < 5) {
          setIsPageIncrementDisabled(true);
        }
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
    setPage(1);
    debounceFetch(fetchAndUpdateProductList, searchValue, 1);
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
  // const handlePageChange = (event, page) => {
  //   setPage(page);
  //   fetchAndUpdateProductList(searchText, page);
  // };
  const handlePageIncrement = () => {
    setPage((prev) => prev + 1);
    fetchAndUpdateProductList(searchText, page + 1);
  };
  const pageDecrement = () => {
    setPage((prev) => prev - 1);
    fetchAndUpdateProductList(searchText, page - 1);
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
            p: 2,
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
        <Box sx={{ margin: "8px" }}>
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
        <Divider />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Box
            sx={{
              display: "flex",
              padding: "8px",
              marginRight: "8px",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Tooltip title="Prev">
              <IconButton disabled={page === 1} onClick={pageDecrement}>
                <ChevronLeft />
              </IconButton>
            </Tooltip>
            {page}
            <Tooltip title="Next">
              <IconButton
                onClick={handlePageIncrement}
                disabled={isPageIncrementDisabled}
              >
                <ChevronRight />
              </IconButton>
            </Tooltip>
          </Box>
          {/* <Pagination
            count={10} // Total number of pages
            page={page} // Current page
            onChange={handlePageChange} // Page change handler
            color="success" // Customizes the color
            sx={{ mt: 2 }}
          /> */}
        </Box>
        <Box
          sx={{
            height: "calc(100% - 180px)",
            overflowY: "auto",
            padding: "8px",
            mt: 1,
          }}
        >
          {restructuredProductList?.length ? (
            restructuredProductList?.map((data) => (
              <>
                <Box
                  key={data.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    margin: "12px 0",
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
                <Divider />
              </>
            ))
          ) : (
            <Box>No Data Available</Box>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            borderTop: "1px solid #ddd",
            padding: "8px 16px",
            position: "absolute",
            bottom: 0,
            width: "100%",
            background: "white",
            boxSizing: "border-box",
            borderRadius: "8px",
          }}
        >
          <Typography>{selectedItems.length} products selected</Typography>
          <Box sx={{ display: "flex", gap: "8px" }}>
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
      </Box>
    </Modal>
  );
}

export default ProductList;
