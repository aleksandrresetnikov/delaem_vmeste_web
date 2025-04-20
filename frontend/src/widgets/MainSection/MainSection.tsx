"use client";
import s from './MainSection.module.css'
import React from 'react';
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import Image from 'next/image'
import ActionButton from "@/components/shared/ActionButton/ActionButton";
import { useRouter } from 'next/navigation';

const MainSection = () => {
  const router = useRouter();

  return (
      <div className={s.wrapper}>
        {/*Контенер заголвока*/}
        <div className={s.headerWrapper}>
          <h1>
            Сильным тоже<br/>
            <span style={{color: 'var(--primary)'}}> требуется помощь</span>
          </h1>

        </div>

        {/*Контейнер кнопок*/}
        <div className={cn(s.container, s.btnContainer)}>
          <ActionButton onClick={() => router.push("/auth")}
              action={'Получить помощь'}
          />

          <Button variant='secondary' size='xl' onClick={() => router.push("/auth?asVolunteer=true")}>
            <h4>Я волонтер</h4>
          </Button>
        </div>

        <div className={s.bgImageContainer}>
          <Image
              className={s.bgImage}
              src={'/icons/hand.png'}
              width={1000}
              height={1000}
              alt={'bg-image'}
          />
        </div>
      </div>
  );
};

export default MainSection;