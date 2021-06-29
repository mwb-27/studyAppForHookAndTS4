import React from "react";
import { Drawer } from "antd";

export const ProjectModal = (props: {
  projectModalOpen: boolean;
  onClose: () => void;
}) => {
  const { projectModalOpen, onClose } = props;
  return (
    <Drawer visible={projectModalOpen} onClose={onClose}>
      <h1>Project Model</h1>
    </Drawer>
  );
};
