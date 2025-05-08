import React, { useEffect, useRef } from 'react';
import { Image, Transformer, Group, Rect, Text } from 'react-konva';
import { COLORS, STACK_OFFSET } from '../constants';
import { Product as ProductType } from '../types';
import { usePlanogram } from '../context/PlanogramContext';
import useImage from '../hooks/useImage';

interface ProductProps {
  product: ProductType;
  isSelected: boolean;
}

const Product: React.FC<ProductProps> = ({ product, isSelected }) => {
  const { dispatch, state } = usePlanogram();
  const imageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  
  const { id, name, image, x, y, width, height, rotation, stackSize } = product;
  const imageNode = useImage(image);
  
  useEffect(() => {
    if (isSelected && transformerRef.current && imageRef.current) {
      transformerRef.current.nodes([imageRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleDragStart = () => {
    dispatch({ type: 'SELECT_PRODUCT', payload: id });
  };

  const handleDragEnd = (e: any) => {
    const { x, y } = e.target.position();
    const stage = e.target.getStage();
    const shelves = stage.find('.shelf');
    const products = state.products.filter(p => p.id !== id && !p.stackedOn);
    
    let shelfId: string | null = null;
    let stackedOn: string | null = null;
    
    // Check shelf collision
    shelves.forEach((shelf: any) => {
      const shelfRect = shelf.getClientRect();
      const productRect = imageRef.current.getClientRect();
      
      if (
        productRect.x + productRect.width / 2 > shelfRect.x &&
        productRect.x + productRect.width / 2 < shelfRect.x + shelfRect.width &&
        productRect.y + productRect.height / 2 > shelfRect.y &&
        productRect.y + productRect.height / 2 < shelfRect.y + shelfRect.height
      ) {
        shelfId = shelf.id();
        
        // Check for stacking with other products
        products.forEach((otherProduct) => {
          if (otherProduct.shelfId === shelfId) {
            const dx = Math.abs(x - otherProduct.x);
            const dy = Math.abs(y - otherProduct.y);
            
            if (dx < width / 2 && dy < height / 2) {
              stackedOn = otherProduct.id;
            }
          }
        });
      }
    });
    
    dispatch({
      type: 'MOVE_PRODUCT',
      payload: { id, x, y, shelfId, stackedOn },
    });
  };

  const handleClick = () => {
    dispatch({ type: 'SELECT_PRODUCT', payload: id });
  };

  const handleTransformEnd = (e: any) => {
    const node = imageRef.current;
    const rotation = node.rotation();
    
    dispatch({
      type: 'ROTATE_PRODUCT',
      payload: { id, rotation },
    });
  };

  if (!imageNode) {
    return null;
  }

  return (
    <Group
      x={x}
      y={y}
      draggable={!product.stackedOn}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onTap={handleClick}
    >
      {/* Stack visualization */}
      {stackSize > 1 && Array.from({ length: stackSize - 1 }).map((_, i) => (
        <Rect
          key={i}
          width={width}
          height={height}
          offsetX={width / 2}
          offsetY={height / 2}
          fill={COLORS.stack}
          x={i * STACK_OFFSET}
          y={i * STACK_OFFSET}
          rotation={rotation}
          cornerRadius={5}
        />
      ))}
      
      <Image
        ref={imageRef}
        image={imageNode}
        width={width}
        height={height}
        offsetX={width / 2}
        offsetY={height / 2}
        x={(stackSize - 1) * STACK_OFFSET}
        y={(stackSize - 1) * STACK_OFFSET}
        rotation={rotation}
        name="product"
        stroke={isSelected ? COLORS.selectedProduct : 'transparent'}
        strokeWidth={isSelected ? 2 : 0}
        shadowColor={isSelected ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)'}
        shadowBlur={isSelected ? 10 : 5}
        shadowOffsetY={isSelected ? 4 : 2}
        cornerRadius={5}
      />
      
      {stackSize > 1 && (
        <Text
          text={`×${stackSize}`}
          fontSize={14}
          fill={COLORS.text}
          x={(stackSize - 1) * STACK_OFFSET - 20}
          y={(stackSize - 1) * STACK_OFFSET - 20}
        />
      )}
      
      {isSelected && (
        <Transformer
          ref={transformerRef}
          rotationSnaps={[0, 90, 180, 270]}
          boundBoxFunc={(oldBox, newBox) => oldBox}
          enabledAnchors={[]}
          rotateEnabled={true}
          resizeEnabled={false}
          onTransformEnd={handleTransformEnd}
        />
      )}
    </Group>
  );
};

export default Product;