'use client'
import s from './AddRateModal.module.css'
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
import {sendOrganizationRate} from "@/api/organizations";

const AddRateModal = () => {
    const modal = useModal()
    const chat = useChat()
    const isOpen = modal?.isOpen('rate')

    const [rate, setRate] = useState(5)

    const onClose = (state: boolean) => {
        modal?.onClose(state)
    }

    const handleSubmitRate = async () => {
        const orgId = chat?.currentChat?.company.id
        if (orgId) await sendOrganizationRate(orgId)
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
                        <h2>{rate.toFixed(1)}</h2>
                        <Slider
                            defaultValue={[5]}
                            max={5}
                            step={0.2}
                            onValueChange={(value) => setRate(value[0])}
                        />
                    </div>
                </div>
                <Button onClick={handleSubmitRate}>Отправить</Button>
            </DialogContent>
        </Dialog>
    )
}

export default AddRateModal