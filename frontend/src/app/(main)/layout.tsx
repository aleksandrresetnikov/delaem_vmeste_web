import React from 'react';
import HomeLayout from "@/layouts/HomeLayout/HomeLayout";

const Layout = ({children}: { children: React.ReactNode }) => {
  return (
      <HomeLayout>
        {children}
      </HomeLayout>
  );
};

export default Layout;