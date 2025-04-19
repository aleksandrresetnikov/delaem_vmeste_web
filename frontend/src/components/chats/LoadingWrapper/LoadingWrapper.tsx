import React from 'react';
import {LoadingSpinner} from "@/components/ui/spinner";
import s from "./LoadingWrapper.module.css";

const LoadingWrapper = () => {
  return (
      <div className={s.wrapper}>
        <LoadingSpinner size={100}/>
      </div>
  );
};

export default LoadingWrapper;