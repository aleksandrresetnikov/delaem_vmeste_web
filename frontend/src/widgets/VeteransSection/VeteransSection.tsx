"use client";
import s from './VeteransSection.module.css'
import React from 'react';
import Image from "next/image";
import ActionButton from "@/components/shared/ActionButton/ActionButton";
import {useRouter} from "next/navigation";

const VeteransSection = () => {
  const router = useRouter();

  return (
      <div className={s.wrapper} id={"veterans"}>
        <h2>Мы помним</h2>
        <p>
          Сегодня Ветераны заслуживают не только памяти,
          но и нашей заботы, внимания и поддержки.
          Их подвиги нельзя забывать, а их потребности нельзя игнорировать.
        </p>
        <ActionButton
            action={'Я ветеран'}
            variant='destructive'
            onClick={() => router.push("/auth")}
        />
        <div className={s.imageBlock}>
          <Image
              src={'/icons/george.png'}
              width={1000}
              height={1000}
              alt={'Георгиевская лента'}
          />
        </div>
        <video className={s.video} autoPlay muted loop playsInline>
          <source src="/sparkles.webm" type="video/webm"/>
        </video>

      </div>
  );
};

export default VeteransSection;