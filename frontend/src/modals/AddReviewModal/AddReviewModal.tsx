'use client'
import s from './AddReviewModal.module.css'
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog"
import useModal from "@/hooks/useModal";
import {Slider} from "@/components/ui/slider";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import useChat from "@/hooks/useChat";
import {Input} from "@/components/ui/input";
import {ReviewData, sendOrganizationReview} from "@/api/review";

const AddReviewModal = () => {
  const modal = useModal()
  const chat = useChat()
  const isOpen = modal?.isOpen('rate')

  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')


  const onClose = (state: boolean) => {
    modal?.onClose(state)
  }

  const handleSubmitRate = async () => {
    const chatId = chat?.currentChat?.id;
    if (chatId) {
      const reviewData: ReviewData = {
        rating,
        chatId,
        text: review.trim()
      }
      await sendOrganizationReview(reviewData);
    }
    setReview('')
    chat?.invalidateData();
    modal?.closeAll()
  }

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle/>
            <h3>Стараемся для Вас</h3>
            <p>Пожалуйста, оставьте отзыв о проделанной работе</p>
          </DialogHeader>
          <div className={s.wrapper}>
            <div className={s.contentWrapper}>
              <h2>{rating.toFixed(1)}</h2>
              <Slider
                  defaultValue={[5]}
                  max={5}
                  min={1}
                  step={0.2}
                  onValueChange={(value) => setRating(value[0])}
              />
            </div>

            <Input placeholder={'Здесь вы можете написать приятные слова'}
                   value={review} onChange={(e) => setReview(e.target.value)}/>
          </div>
          <Button onClick={handleSubmitRate}>Отправить</Button>
        </DialogContent>
      </Dialog>
  )
}
export default AddReviewModal