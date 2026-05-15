import styled, { keyframes } from "styled-components";

type SkeletonProps = {
  className?: string;
};

const shimmer = keyframes`
  0% {
    background: #2b3c42;
  }
  50% {
     background: #3a5058;
  }
   100% {
     background: #2b3c42;
  }
`;

const SkeletonBlock = styled.div`
  background: #f1f1f1;
  animation: ${shimmer} 1.6s ease-in-out infinite;
  display: block;
`;

const Skeleton = ({ className }: SkeletonProps) => {
  return <SkeletonBlock className={className} />;
};

export default Skeleton;
