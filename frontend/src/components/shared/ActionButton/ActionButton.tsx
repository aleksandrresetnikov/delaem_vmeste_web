import s from './ActionButton.module.css'
import React, {HTMLAttributes} from 'react';
import Image from "next/image";
import {Button} from "@/components/ui/button";

interface IActionButtonProps extends HTMLAttributes<HTMLButtonElement>{
  action: string,
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
}

const ActionButton = (props: IActionButtonProps) => {
  return (
      <Button className={s.container} size='xl' variant={props.variant} {...props}>
        <h4>{props.action}</h4>
        <Image
            src={'/icons/arrow.svg'}
            width={40}
            height={10}
            alt={''}
        />
      </Button>

  );
};

export default ActionButton;