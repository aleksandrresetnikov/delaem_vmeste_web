"use client";
import React, {useState} from 'react';
import styles from "./MessageBox.module.css";
import {Button} from '@/components/ui/button';
import {ChevronRight} from "lucide-react";

const MessageBox = () => {
  const [text, setText] = useState("");

  return (
      <div className={styles.wrapper}>
        <input onChange={(e) => setText(e.target.value)} type={"text"} placeholder={"Введите текст"}/>
        <Button variant={"default"} disabled={!text}>
          <ChevronRight/>
        </Button>
      </div>
  );
};

export default MessageBox;