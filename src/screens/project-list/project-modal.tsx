import React from "react";
import { Drawer } from "antd";
import { useProjectModal } from "./util";

export const ProjectModal = () => {
  const { projectModalOpen, close } = useProjectModal();
  return (
    <Drawer visible={projectModalOpen} onClose={close}>
      <h1>Project Model</h1>
    </Drawer>
  );
};
