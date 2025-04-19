import React, {FC, ReactNode} from 'react';
import styles from "./Status.module.css";
import {LoadingSpinner} from "@/components/ui/spinner";

interface ChatStatusProps {
  children: ReactNode | string;
  loader?: boolean;
}

const Status: FC<ChatStatusProps> = ({children, loader = false}) => {
  return (
      <div className={styles.status}>
        {loader && <LoadingSpinner size={24}/>}
        {typeof children === "string" ? <span>{children}</span> : children}
      </div>
  );
};

export default Status;