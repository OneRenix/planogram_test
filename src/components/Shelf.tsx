import React from 'react';
import { Rect, Group, Text } from 'react-konva';
import { COLORS } from '../constants';
import { Shelf as ShelfType } from '../types';

interface ShelfProps {
  shelf: ShelfType;
}

const Shelf: React.FC<ShelfProps> = ({ shelf }) => {
  const { id, name, x, y, width, height } = shelf;

  return (
    <Group>
      {/* Shelf background */}
      <Rect
        id={id}
        x={x}
        y={y}
        width={width}
        height={height}
        fill={COLORS.shelf}
        stroke={COLORS.shelfBorder}
        strokeWidth={1}
        shadowColor="rgba(0,0,0,0.1)"
        shadowBlur={5}
        shadowOffsetY={2}
        cornerRadius={4}
      />
      
      {/* Shelf label */}
      <Text
        x={x + 10}
        y={y + 5}
        text={name}
        fontSize={14}
        fontFamily="Arial"
        fill={COLORS.text}
      />
      
      {/* Shelf edge */}
      <Rect
        x={x}
        y={y + height - 8}
        width={width}
        height={8}
        fill={COLORS.shelfBorder}
        cornerRadius={[0, 0, 4, 4]}
      />
    </Group>
  );
};

export default Shelf;