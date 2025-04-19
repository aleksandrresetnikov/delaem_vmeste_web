import React, {ReactNode} from 'react';
import styles from './HomeLayout.module.css';
import HomeHeader from "@/widgets/HomeHeader/HomeHeader";

const HomeLayout = ({children}: { children: ReactNode }) => {
  return (
      <div className={styles.wrapper}>
        <HomeHeader/>
        <div className={styles.inner}>{children}</div>
      </div>
  );
};

export default HomeLayout;