import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import SingleProductVariant from "./SingleProductVariant";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";

function ProductVariants({ variants, handleVariantDelete }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    debugger;
    setItems(variants);
  }, [variants]);
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    setItems(reorderedItems);
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                padding: "16px",
              }}
            >
              {items?.map((item, index) => (
                <Draggable
                  key={item.productVariantId}
                  draggableId={item.productVariantId}
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
                        background: "#fff",
                        borderRadius: "4px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <SingleProductVariant
                          dragHandleProps={provided.dragHandleProps}
                          singleVariantData={item}
                          disableDelete={items.length === 1}
                          handleVariantDelete={handleVariantDelete}
                        />
                      </Box>
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
}

export default ProductVariants;
