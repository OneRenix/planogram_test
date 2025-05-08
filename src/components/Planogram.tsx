import React, { useRef, useCallback } from 'react';
import { Stage, Layer, Group } from 'react-konva';
import { STAGE_WIDTH, STAGE_HEIGHT, COLORS } from '../constants';
import { usePlanogram } from '../context/PlanogramContext';
import Shelf from './Shelf';
import Product from './Product';

const Planogram: React.FC = () => {
  const { state, dispatch } = usePlanogram();
  const { products, shelves, selectedProductId } = state;
  const stageRef = useRef<any>(null);

  const handleStageClick = useCallback((e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() !== 'product';
    if (clickedOnEmpty) {
      dispatch({ type: 'SELECT_PRODUCT', payload: null });
    }
  }, [dispatch]);
  
  return (
    <div 
      className="relative bg-white rounded-lg shadow-md overflow-hidden"
      style={{ 
        width: STAGE_WIDTH, 
        height: STAGE_HEIGHT,
        margin: '0 auto'
      }}
    >
      <Stage
        ref={stageRef}
        width={STAGE_WIDTH}
        height={STAGE_HEIGHT}
        onClick={handleStageClick}
        onTap={handleStageClick}
      >
        <Layer>
          {/* Background */}
          <Group>
            {shelves.map((shelf) => (
              <Shelf key={shelf.id} shelf={shelf} />
            ))}
          </Group>
          
          {/* Products */}
          <Group>
            {products.map((product) => (
              <Product
                key={product.id}
                product={product}
                isSelected={product.id === selectedProductId}
              />
            ))}
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

export default Planogram;