import s from './Comment.module.css'
import React, {FC} from 'react';
import {IComment} from "@/api/organizations";


const Comment: FC<Omit<IComment, 'id'>> = ({author, text}) => {
  return (
      <div className={s.wrapper}>
        <span><b>{author}</b></span>
        <p>{text}</p>
      </div>
  );
};

export default Comment;