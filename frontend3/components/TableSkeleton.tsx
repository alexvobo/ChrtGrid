import React from "react";
import { Shimmer } from "react-shimmer";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function TableSkeleton({ base, highlight }) {
  return (
    <div className="overflow-hidden">
      <SkeletonTheme duration={2} baseColor={base} highlightColor={highlight}>
        <Skeleton />
      </SkeletonTheme>
    </div>
  );
}
