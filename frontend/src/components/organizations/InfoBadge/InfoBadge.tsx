import s from './InfoBadge.module.css'
import React, {FC} from 'react';
import {Heart, Star} from "lucide-react";
import {Badge} from "@/components/ui/badge"
import {cn} from "@/lib/utils";

interface InfoBadgeProps {
  type: 'likes' | 'rate',
  count?: number,
  text?: string,
  className?: string
}

const InfoBadge: FC<InfoBadgeProps> = ({
                                         type, text, count, className
                                       }) => {
  return (
      <Badge variant='secondary' className={cn(s.wrapper, className)}>
        <div className={s.iconContainer}>
          {
            type === 'likes'
                ? <Heart className={s.icon}/>
                : <Star className={s.icon}/>
          }
          <span>{count}</span>
        </div>

        <span>{text}</span>
      </Badge>
  );
};

export default InfoBadge;