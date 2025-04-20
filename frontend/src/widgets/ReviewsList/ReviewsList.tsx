import {IComment} from "@/api/organizations";
import React, {useEffect, useState} from "react";
import s from "./ReviewsList.module.css";
import Comment from "@/components/organizations/Comment/Comment";

const ReviewsList = ({reviews}: { reviews: IComment[] }) => {
  useEffect(() => {
    console.log(reviews);
  }, [reviews]);
  const [maxShow, setMaxShow] = useState<number>(2)
  const isFull = maxShow < reviews.length

  const handleShowMore = () => {
    if (isFull) {
      setMaxShow(prevState => prevState + 3)
    } else {
      setMaxShow(2)
    }
  }
  return (
      <>
        <div className={s.reviewsList}>
          {
            reviews.slice(0, maxShow).map(review =>
                <Comment
                    key={review.id}
                    author={review.author}
                    text={review.text}
                />
            )
          }
        </div>
        <span
            onClick={handleShowMore}
            className={s.showMore}
        >
                {
                    reviews.length >= maxShow && (
                        isFull
                            ? 'Показать еще'
                            : 'Скрыть'
                    )
                }
            </span>
      </>
  )
}

export default ReviewsList