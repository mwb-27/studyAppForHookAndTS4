import React from "react";
import { Drawer } from "antd";
import {
  projectListActions,
  selectProjectModalOpen,
} from "./project-list.slice";
import { useDispatch, useSelector } from "react-redux";

export const ProjectModal = () => {
  const dispatch = useDispatch();
  const projectModalOpen = useSelector(selectProjectModalOpen);
  return (
    <Drawer
      width={"100%"}
      visible={projectModalOpen}
      onClose={() => dispatch(projectListActions.closeProjectModal())}
    >
      <h1>Project Model</h1>
    </Drawer>
  );
};
