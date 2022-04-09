import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function TableSkeleton({ base, highlight }) {
  return (
    <div className="overflow-hidden">
      <SkeletonTheme duration={2.5} baseColor={base} highlightColor={highlight}>
        <Skeleton />
      </SkeletonTheme>
    </div>
  );
}
