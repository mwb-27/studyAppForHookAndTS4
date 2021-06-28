import React from "react";
import { Rate } from "antd";

interface pinProps extends React.ComponentProps<typeof Rate> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Pin = (props: pinProps) => {
  const { checked, onCheckedChange, ...restProps } = props;
  return (
    <Rate
      count={1}
      value={checked ? 1 : 0}
      onChange={(value) => {
        onCheckedChange?.(!!value);
      }}
      {...restProps}
    />
  );
};
