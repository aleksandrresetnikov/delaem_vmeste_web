import React from 'react';
import {LoadingSpinner} from "@/components/ui/spinner";
import s from "./LoadingWrapper.module.css";

const LoadingWrapper = () => {
  return (
      <div className={s.wrapper}>
        <LoadingSpinner/>
      </div>
  );
};

export default LoadingWrapper;