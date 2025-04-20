import React, {ReactNode} from 'react';
import styles from "./Bubble.module.css";
import {cn} from "@/lib/utils";
import {format, parseISO} from "date-fns";
import {Bot} from 'lucide-react';

interface BubbleProps {
  children: ReactNode | string;
  byMe: boolean;
  time: string;
  byAi?: boolean;
}

const Bubble: React.FC<BubbleProps> = ({children, byMe, time, byAi = false}) => {
  // Парсинг времени
  const parseTime = (time: string) => {
    return format(parseISO(time), 'HH:mm');
  }

  return (
      <div className={styles.wrapper}>
        <div className={cn(styles.bubble, byMe ? styles.my : "")}>
          {typeof children === "string" ? <span>{children}</span> : children}
        </div>
        <span className={styles.time}>{parseTime(time)}</span>
        {byAi && <Bot className={styles.ai}/>}
      </div>
  );
};

export default Bubble;