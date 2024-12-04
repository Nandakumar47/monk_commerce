import { useState } from "react";
import ProductEntry from "./ProductEntry";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Box, Button } from "@mui/material";
import { v4 as uuid } from "uuid";
import ProductList from "./ProductList";
function OfferFunnel() {
  const [selectedProductsList, setSelectedProductsList] = useState([
    {
      productItemId: uuid(),
      id: "",
      name: "",
      productVariants: [],
      discountValue: 0,
      discountType: "",
    },
  ]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedEditItemIndex, setSelectedEditItemIndex] = useState(null);
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(selectedProductsList);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    setSelectedProductsList(reorderedItems);
  };
  const handleProductDetailsChange = (id, values) => {
    debugger;
    const updatedData = selectedProductsList.map((item) => {
      if (item.productItemId === id) {
        return {
          ...item,
          ...values,
        };
      }
      return item;
    });
    setSelectedProductsList(updatedData);
  };

  const handleProductListClose = () => {
    setShowProductModal(false);
  };
  const handleProductListOpen = () => {
    setShowProductModal(true);
  };
  const handleDeleteProduct = (productItemId) => {
    const updatedData = selectedProductsList.filter(
      (item) => item.productItemId !== productItemId
    );
    setSelectedProductsList(updatedData);
  };
  const handleEditItemClick = (id) => {
    setSelectedEditItemIndex(id);
    handleProductListOpen();
  };

  const handleProductAdd = (selectedItems) => {
    const position = selectedEditItemIndex;
    if (!selectedItems || selectedItems.length === 0) return;

    setSelectedProductsList((prevItems) => {
      const updatedItems = [...prevItems];
      const currentCount = updatedItems.length;

      if (position !== null) {
        const selectedProduct = selectedItems[0];
        updatedItems[position] = {
          ...updatedItems[position],
          id: selectedProduct.id,
          name: selectedProduct.title,
          productVariants: selectedProduct.variants.map((variant) => ({
            ...variant,
            productVariantId: uuid(),
          })),
        };

        if (selectedItems.length > 1) {
          const additionalItems = selectedItems.slice(1).map((product) => ({
            productItemId: uuid(),
            id: product.id,
            name: product.title,
            productVariants: product.variants.map((variant) => ({
              ...variant,
              productVariantId: uuid(),
            })),
            discountValue: 0,
            discountType: "",
          }));

          const itemsToAdd = Math.max(4 - updatedItems.length, 0);
          return [...updatedItems, ...additionalItems.slice(0, itemsToAdd)];
        }
      } else {
        const newItems = selectedItems.map((product) => ({
          productItemId: uuid(),
          id: product.id,
          name: product.title,
          productVariants: product.variants.map((variant) => ({
            ...variant,
            productVariantId: uuid(),
          })),
          discountValue: 0,
          discountType: "",
        }));

        const itemsToAdd = Math.max(4 - updatedItems.length, 0);
        return [...updatedItems, ...newItems.slice(0, itemsToAdd)];
      }

      setSelectedEditItemIndex(null);
      return updatedItems;
    });
  };
  const handleVariantDelete = (productId, id) => {
    setSelectedProductsList((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === productId) {
          return {
            ...item,
            productVariants: item.productVariants.filter(
              (variant) => variant.id !== id
            ),
          };
        }
        return item;
      });
    });
  };

  return (
    <Box
      style={{
        width: "800px",
        margin: "auto",
        padding: "16px",
      }}
    >
      <h1>OfferFunnel</h1>
      <Box>
        <h4>Add bundle product-max 4 products</h4>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  padding: "16px",
                  minHeight: "200px",
                }}
              >
                {selectedProductsList.map((item, index) => (
                  <Draggable
                    key={item.productItemId}
                    draggableId={item.productItemId}
                    index={index}
                  >
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          padding: "10px",
                          margin: "5px 0",
                          borderRadius: "4px",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <ProductEntry
                            dragHandleProps={provided.dragHandleProps}
                            position={index}
                            productData={item}
                            handleProductDetailsChange={
                              handleProductDetailsChange
                            }
                            handleEditItemClick={handleEditItemClick}
                            handleDeleteProduct={handleDeleteProduct}
                            showRemoveIcon={selectedProductsList.length > 1}
                            handleVariantDelete={handleVariantDelete}
                          />
                        </Box>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {selectedProductsList.length < 4 && (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      color="success"
                      variant="outlined"
                      onClick={handleProductListOpen}
                    >
                      Add Product
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
      {showProductModal && (
        <ProductList
          openProductList={showProductModal}
          handleClose={handleProductListClose}
          handleProductAdd={handleProductAdd}
        />
      )}
    </Box>
  );
}

export default OfferFunnel;
