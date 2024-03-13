import React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function ChatLoading() {
  const skeletonCount = 24;
  const animationTypes = ["pulse", "wave", "pulse", false, "wave", false]; // Customize animations as needed

  const renderSkeletons = () => {
    const skeletons = [];
    for (let i = 0; i < skeletonCount; i++) {
      const animation = animationTypes[i % animationTypes.length];
      skeletons.push(<Skeleton key={i} animation={animation} />);
    }
    return skeletons;
  };

  return <Box sx={{ width: 300 }}>{renderSkeletons()}</Box>;
}
