import s from './Landing.module.css'
import React from 'react';

const Landing = ({children}: { children: React.ReactNode }) => {
  return (
      <div className={s.wrapper}>
        {children}
      </div>
  );
};

export default Landing;