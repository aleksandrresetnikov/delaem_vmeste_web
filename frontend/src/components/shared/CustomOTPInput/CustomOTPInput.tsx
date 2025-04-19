"use client";
import React, {ClipboardEvent, KeyboardEvent, useEffect, useRef, useState} from 'react';
import styles from './CustomOTPInput.module.css';
import {cn} from "@/lib/utils";

interface OTPInputProps {
  length?: number;
  onChange?: (otp: string) => void;
  className?: string;
}

const CustomOTPInput: React.FC<OTPInputProps> = ({length = 8, onChange, className}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (onChange) {
      onChange(otp.join(''));
    }
  }, [otp]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value ? value[value.length - 1] : '';
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputsRef.current[index - 1]?.focus();
      e.preventDefault();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\s/g, '').slice(0, length);
    if (!/^\d+$/.test(pasteData)) {
      return;
    }
    const pasteValues = pasteData.split('');
    const newOtp = [...otp];
    pasteValues.forEach((char, idx) => {
      if (idx < length) {
        newOtp[idx] = char;
        if (inputsRef.current[idx]) {
          inputsRef.current[idx]!.value = char;
        }
      }
    });
    setOtp(newOtp);
    const nextIndex = pasteValues.length >= length ? length - 1 : pasteValues.length;
    inputsRef.current[nextIndex]?.focus();
  };

  return (
      <div className={cn(styles.container, className)}>
        {Array(length)
            .fill(0)
            .map((_, index) => (
                <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className={styles.input}
                    value={otp[index]}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    ref={(el: any) => (inputsRef.current[index] = el)}
                />
            ))}
      </div>
  );
};

export default CustomOTPInput;
