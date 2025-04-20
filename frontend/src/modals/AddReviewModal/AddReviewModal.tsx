'use client'
import s from './AddReviewModal.module.css'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import useModal from "@/hooks/useModal";
import {Slider} from "@/components/ui/slider";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import useChat from "@/hooks/useChat";
import {OrganizationReview, sendOrganizationReview} from "@/api/organizations";
import {Input} from "@/components/ui/input";

const AddReviewModal = () => {
    const modal = useModal()
    const chat = useChat()
    const isOpen = modal?.isOpen('rate')

    const [rate, setRate] = useState(5)
    const [review, setReview] = useState('')


    const onClose = (state: boolean) => {
        modal?.onClose(state)
    }

    const handleSubmitRate = async () => {
        const orgId = chat?.currentChat?.company.id
        const reviewData: OrganizationReview = {
            rate,
            review: review.trim() || undefined
        }
        if (orgId) await sendOrganizationReview(orgId, reviewData)
        setReview('')
        modal?.closeAll()
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle/>
                    <h3>Стараемся для Вас</h3>
                    <p>Пожалуйста, оставьте отзыв о проделанной работе</p>
                </DialogHeader>
                <div className={s.wrapper}>
                    <div className={s.contentWrapper}>
                        <h2>{rate.toFixed(1)}</h2>
                        <Slider
                            defaultValue={[5]}
                            max={5}
                            step={0.2}
                            onValueChange={(value) => setRate(value[0])}
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