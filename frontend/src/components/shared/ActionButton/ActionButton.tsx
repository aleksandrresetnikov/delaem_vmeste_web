import s from './ActionButton.module.css'
import React from 'react';
import Image from "next/image";
import {Button} from "@/components/ui/button";

interface IActionButtonProps {
  action: string,
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
}

const ActionButton = ({action, variant}: IActionButtonProps) => {
  return (
      <Button className={s.container} size='xl' variant={variant}>
        <h4>{action}</h4>
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