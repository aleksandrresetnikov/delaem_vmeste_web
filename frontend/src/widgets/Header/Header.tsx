"use client";
import s from './Header.module.css'
import React, {useState} from 'react';
import Image from 'next/image'
import Link from 'next/link'
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Menu} from "lucide-react";
import useAuth from "@/hooks/useAuth";

const Header = () => {
  const [open, setOpen] = useState(false);
  const auth = useAuth();

  const renderLoginButton = () => {
    return (
        <Link href={'/auth'}>
          <Button variant='default'>
            Войти в аккаунт
          </Button>
        </Link>
    )
  }

  const renderLKButton = () => {
    return (
        <Link href={'/messages'}>
          <Button variant='secondary'>
            Личный кабинет
          </Button>
        </Link>
    )
  }

  const renderMenuButton = () => {
    if (auth?.loading) return;

    if (!auth?.user) return renderLoginButton();
    return renderLKButton();
  }

  return (
      <div className={s.wrapper}>
        {/*Лого*/}
        <Link href={'/'} className={s.container}>
          <Image
              src={'/icons/logo.png'}
              width={48}
              height={48}
              alt={''}
          />

          <b>Вместе Лучше</b>
        </Link>

        {/* Десктопная навигация*/}
        <div className="hidden md:flex">
          <nav className={cn(s.container, s.nav)}>
            <Link href={'#goals'}>Цели</Link>
            <Link href={'#veterans'}>Ветеранам</Link>
          </nav>

          {renderMenuButton()}
        </div>

        {/* Мобильное меню (появляется на мобильных) */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4"/>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Меню</SheetTitle>
              </SheetHeader>
              <div className="h-full flex flex-col gap-4 items-center justify-center">
                <Link href={'#goals'}><Button>Цели</Button></Link>
                <Link href={'#veterans'}><Button>Ветеранам</Button></Link>
                {renderMenuButton()}
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
  );
};

export default Header;