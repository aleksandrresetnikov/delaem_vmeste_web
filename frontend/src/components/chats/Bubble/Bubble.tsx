import React, {ReactNode} from 'react';
import styles from "./Bubble.module.css";
import {cn} from "@/lib/utils";

interface BubbleProps {
  children: ReactNode | string;
  byMe: boolean;
  time: string;
}

const Bubble: React.FC<BubbleProps> = ({children, byMe, time}) => {
  return (
      <div className={styles.wrapper}>
        <div className={cn(styles.bubble, byMe ? styles.my : "")}>
          {typeof children === "string" ? <span>{children}</span> : children}
        </div>
        <span className={styles.time}>{time}</span>
      </div>
  );
};

export default Bubble;