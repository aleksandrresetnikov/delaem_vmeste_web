"use client";
import React, {useState} from 'react';
import {HomeHeaderData} from "@/mocks/HomeHeader.mock";
import styles from "./HomeHeader.module.css";
import Link from "next/link";
import Image from "next/image";
import {ThemeSwitch} from "@/components/shared/ThemeSwitch/ThemeSwitch";
import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Menu} from "lucide-react";

const HomeHeader = () => {
  const [open, setOpen] = useState(false);

  return (
      <div className={styles.header}>
        {/* Логотип */}
        <Link href={'/'} className={styles.logoContainer}>
          <Image
              src={'/icons/logo.png'}
              width={48}
              height={48}
              alt={'Логотип Вместе Лучше'}
          />
          <b>Вместе Лучше</b>
        </Link>

        {/* Разрыв (только для десктопа) */}
        <div className={`${styles.splitter} `}></div>

        {/* Десктопная навигация */}
        <div className="hidden md:flex items-center gap-4">
          <nav className={styles.nav}>
            {HomeHeaderData.map(item => (
                <Link key={item.title} href={item.url}>{item.title}</Link>
            ))}
          </nav>

          <ThemeSwitch/>
        </div>

        {/* Мобильное меню */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeSwitch/>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4"/>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="text-left">Меню</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-6">
                {HomeHeaderData.map(item => (
                    <Link key={item.title} href={item.url}>
                      <Button variant="ghost" className="w-full justify-start">
                        {item.title}
                      </Button>
                    </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
  );
};

export default HomeHeader;