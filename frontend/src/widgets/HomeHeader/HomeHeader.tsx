"use client";
import React, {useState} from 'react';
import {HomeHeaderData} from "@/mocks/HomeHeader.mock";
import styles from "./HomeHeader.module.css";
import Link from "next/link";
import Image from "next/image";
import {ThemeSwitch} from "@/components/shared/ThemeSwitch/ThemeSwitch";
import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Copy, Menu} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Input} from "@/components/ui/input";
import {User} from "prisma-client-45545ba697cc4784aab4e48e93f883a0ef70eced577eefae45ed1be0665c6d35";
import {toast} from "sonner";

const HomeHeader = () => {
  const [open, setOpen] = useState(false);
  const auth = useAuth();

  const copyToClipboard = (text: string) => {navigator.clipboard.writeText(text)};

  const copyLink = () => {
    copyToClipboard(`https://some.link/join/${auth?.user?.ownedCompany.links[0].link || ""}`);
    toast.success("Ссылка скопирована!");
  }

  const renderOrganizationDropdown = () => {
    if(!auth?.user?.ownedCompany || !auth?.user?.memberCompany) return;

    return (<DropdownMenu>
      <DropdownMenuTrigger><Button variant={"outline"}>Ваша организация</Button></DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* Название организации */}
        <DropdownMenuLabel>Название</DropdownMenuLabel>
        <DropdownMenuItem>
          {auth?.user?.ownedCompany.name || auth?.user?.memberCompany.name}
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {
          auth?.user?.ownedCompany && (
              <>
                <DropdownMenuLabel>Ссылка на вступление в организацию</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Input type={"text"} value={`https://some.link/join/${auth?.user?.ownedCompany.links[0].link || ""}`} />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyLink}>
                  <Button>Скопировать ссылку</Button>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Список участников</DropdownMenuLabel>
                {
                  auth.user.ownedCompany.members.map((item: User) => (
                      <DropdownMenuItem>
                        {item.fullname}
                      </DropdownMenuItem>
                  ))
                }
              </>
            )
        }
      </DropdownMenuContent>
    </DropdownMenu>)
  }

  return (
      <div className={styles.header}>
        {/* Логотип */}
        <Link href={'/'}>
          <div className={styles.logoContainer}>
            <Image
                src={'/icons/logo.png'}
                width={48}
                height={48}
                alt={'Логотип Вместе Лучше'}
            />
            <b>Вместе Лучше</b>
          </div>
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

          {renderOrganizationDropdown()}

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
                {renderOrganizationDropdown()}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
  );
};

export default HomeHeader;