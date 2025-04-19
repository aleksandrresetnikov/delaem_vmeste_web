"use client";
import React, {FormEvent, useEffect, useRef, useState} from 'react';
import {CATEGORIES, STEPS, TIMER_INITIAL_VALUE, TITLES} from "@/mocks/Registration.mock";
import useAuth from '@/hooks/useAuth';
import {fetchLogin, fetchVerify} from '@/api/auth';
import {toast} from 'sonner';
import {AxiosError} from 'axios';
import {useAsync} from "react-use";
import s from "./Authorization.module.css";
import {Button} from '@/components/ui/button';
import {cn} from "@/lib/utils";
import {IMaskInput} from "react-imask";
import CustomOTPInput from "@/components/shared/CustomOTPInput/CustomOTPInput";
import {ChevronRight} from "lucide-react";
import {LoadingSpinner} from "@/components/ui/spinner";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {IFormResult} from "@/widgets/Authorization/types";
import {fetchProfileUpdate} from "@/api/profile";
import {useRouter} from "next/navigation";
import {createOrganization, generateOrganizationLink} from "@/api/organizations";

const Authorization = ({asVolunteer, createOrg}: { asVolunteer: boolean, createOrg: boolean }) => {
  const [step, setStep] = useState<number>(createOrg ? STEPS.ORGANIZATION : STEPS.EMAIL);
  const [loading, setLoading] = useState(false);

  const [code, setCode] = useState<number>(0);
  const [email, setEmail] = useState<string>('');

  const [animationKey, setAnimationKey] = useState<number>(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [organizationData, setOrganizationData] = useState<{name: string, description: string}>({name: "", description: ""});

  const [timeLeft, setTimeLeft] = useState<number>(TIMER_INITIAL_VALUE);

  const formRef = useRef<HTMLFormElement>(null);

  const auth = useAuth();
  const router = useRouter();

  // Обновление анимаций
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [step]);

  // Таймер для переотправки
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const getSubtitle = (): string => {
    switch (step) {
      case STEPS.EMAIL:
        return "Укажите свою электронную почту";
      case STEPS.CODE:
        return `Введите код, отправленный на <b>${email}</b>`;
      case STEPS.ORGANIZATION:
        return `Организация позволит вам связываться с нуждающимися`;
      default:
        return `Заполните данные для завершения регистрации`;
    }
  };

  // Отправка OTP на указанный емеил
  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      await fetchLogin({email});
      setStep(STEPS.CODE);
      setTimeLeft(TIMER_INITIAL_VALUE);
      setCode(0);
      toast.success("Код отправлен на вашу почту");
    } catch (e) {
      console.error(e);
      toast.error("Не удалось отправить письмо");
    }
    setLoading(false);
  };

  // При отправке OTP-кода
  const handleCodeSubmit = async () => {
    setLoading(true);
    try {
      const result = await fetchVerify({email, otp: code});
      if (result.status === 200 && result.data) {
        setStep(STEPS.COMPLETE);
        setCode(0);
        auth?.login(result.data.token);
        await auth?.updateProfile();
      } else {
        setCode(0);
        toast.error("Неверный или истёкший код");
      }
    } catch (e: unknown) {
      const knownErr = e as AxiosError;
      if (knownErr.status === 401) {
        setCode(0);
        setLoading(false);
        return;
      }
      console.error(knownErr);
      toast.error("Кажется, нам не удалось проверить код :(");
    }
    setLoading(false);
  };

  // Вкл/Выкл категории
  const toggleCategory = (category: string): void => {
    setSelectedCategories(prev =>
        prev.includes(category)
            ? prev.filter(c => c !== category)
            : [...prev, category]
    );
  };

  // При сохранении данных профиля
  const handleSaveProfileClick = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    // Данные формы
    const formData = new FormData(formRef.current);

    // Собираем данные формы в объект

    const data: any = {};
    formData.forEach((value, key) => data[key] = value);

    console.log(data);
    // Проверяем поля (делается на быструю руку, сорян, я знаю что нужно делать верификацию формы через zod и regexp)
    if (data.address === "" || data.skills === "" || data.birthDate === "" || data.fullname === "") return;
    if (asVolunteer && data.skills === "") return;
    if (selectedCategories.length < 1) return;
    try {
      await fetchProfileUpdate({
        ...data as IFormResult,
        username: (email || auth?.user?.email || "something@happend").split("@")[0],
        role: !auth?.user?.role ? (asVolunteer ? "VOLUNTEER" : "MEMBER"): undefined
      });
      if (asVolunteer) {
        setStep(STEPS.ORGANIZATION)
      } else {
        router.push("/messages");
      }
    } catch (e: any) {
      console.error(e);
      toast.error("Не удалось сохранить профиль " + e.toString());
    }
  };

  // Создать организацию
  const handleOrganizationCreate = async () => {
    if(organizationData.name === "" || organizationData.description === "") return;

    try {
      await createOrganization(organizationData);
      const result = await auth?.updateProfile();

      if(typeof result === "boolean" || !result) throw Error("Failed to fetch");
      if(!result.ownedCompany?.id) throw Error("No owner company in profile");

      await generateOrganizationLink(result.ownedCompany.id);
      router.push("/messages");
    } catch (e: any) {
      console.error(e);
      toast.error("Не удалось создать организацию. " + e.toString());
    }
  }

  // Рендер формы ввода email
  const renderEmailForm = () => {
    return (
        <form
            key={`form-${animationKey}`}
            onSubmit={handleEmailSubmit}
            className={s.form__animated}
            ref={formRef}
        >
          <div className={s.emailInput}>
            <input
                type="email"
                placeholder="Введите email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                autoFocus
            />
            {
              !loading ? (<Button size={"icon"} type='submit'>
                <ChevronRight/>
              </Button>) : (<LoadingSpinner className={s.loader} size={40}/>)
            }
          </div>
        </form>
    )
  }

  // Рендер формы ввода OTP-кода
  const renderCodeForm = () => {
    return (<>
      <CustomOTPInput length={4} onChange={(otp) => setCode(+otp)}/>
      {timeLeft > 0 ? (
          <p className={s.timer}>Можно запросить новый код через: {timeLeft} сек.</p>
      ) : (
          <Button
              variant="outline"
              onClick={handleEmailSubmit}
              className={s.resend__button}
              disabled={timeLeft > 0}
          >
            Отправить код повторно
          </Button>
      )}
    </>)
  }

  // Рендер формы заполнения профиля
  const renderProfileFillForm = () => {
    return (
        <div className={s.completionForm}>
          <form ref={formRef}>
            <label>ФИО</label>
            <Input
                type="text"
                placeholder="Иванов Иван Иванович"
                required
                name="fullname"
            />

            <label>Телефон</label>
            <IMaskInput
                mask="+7(000)-000-00-00"
                definitions={{
                  '0': /[0-9]/,
                }}
                placeholder="+7(922)-924-23-53"
                overwrite
                name="phone"
            />

            <label>Дата рождения</label>
            <Input
                type="date"
                required
                name="birthDate"
            />

            <label>Адрес</label>
            <Input
                type="text"
                placeholder="Город, улица, дом"
                required
                name="address"
            />

            {!asVolunteer && (
                <>
                  <label>
                    Категория населения <small>необязательно</small>
                  </label>
                  <div className={s.categories_container}>
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            type="button"
                            className={`${s.category_button} ${
                                selectedCategories.includes(category) ? s.active : ''
                            }`}
                            onClick={() => toggleCategory(category)}
                        >
                          {category}
                        </button>
                    ))}
                  </div>
                </>
            )}

            {asVolunteer && (
                <>
                  <label>Навыки</label>
                  <Textarea
                      placeholder="Опишите ваши навыки и опыт"
                      required
                      name="skills"
                  />
                </>
            )}


          </form>
          <Button
              size='mk'
              variant="default"
              onClick={handleSaveProfileClick}
              className={s.submitButton}
          >
            Завершить регистрацию
          </Button>
        </div>
    )
  }

  const renderOrganizationAsk = () => {
    return (
        <div className={s.completionForm}>
          <div className={s.orgSelectForm}>
            <Input type={"text"} placeholder={"Название организации"} onChange={(e) => setOrganizationData({...organizationData, name: e.target.value})} />
            <Textarea placeholder={"Описание вашей организации (чем она занимается?)"} onChange={(e) => setOrganizationData({...organizationData, description: e.target.value})} />
            <Button onClick={handleOrganizationCreate}>Создать сейчас!</Button>
            <Button variant="link" onClick={() => router.push("/messages")}>Создам позже или войду по ссылке</Button>
          </div>
        </div>
    )
  }

  // При заполнении всего OTP-кода
  useAsync(async () => {
    if (code < 1000 || code > 9999) return;
    if (step !== STEPS.CODE) return;

    await handleCodeSubmit();
  }, [code]);

  useAsync(async () => {
    if (!auth?.loading) {
      if (auth?.user && !createOrg) {
        // Если юзер уже залогинен
        setStep(STEPS.COMPLETE);
      }
    }
  }, [auth?.loading, auth?.user]);

  return (
      <main className={s.wrapper}>
        <img
            src="/glass-element-29.png"
            alt="Decoration"
            className={`${s.decoration_left} ${step === STEPS.EMAIL ? s.decoration_left_pos1 : s.decoration_left_pos2}`}
        />
        {/*<img*/}
        {/*    src="/glass-element-49.png"*/}
        {/*    alt="Decoration"*/}
        {/*    className={`${s.decoration_right} ${step === STEPS.EMAIL ? s.decoration_right_pos1 : s.decoration_right_pos2}`}*/}
        {/*/>*/}

        <div className={cn(s.form, (step === STEPS.COMPLETE || step === STEPS.ORGANIZATION) && s.grid)}>
          <div className={s.gridTitles}>
            <h1
                key={`title-${animationKey}`}
                className={cn(s.title, s.title__animated)}
            >
              {TITLES[step - 1]}
            </h1>

            <h2
                key={`subtitle-${animationKey}`}
                className={cn(s.subtitle, s.subtitle__animated)}
                dangerouslySetInnerHTML={{__html: getSubtitle()}}
            />
          </div>

          {step === STEPS.EMAIL && renderEmailForm()}
          {step === STEPS.CODE && (!loading ? renderCodeForm() : null)}
          {step === STEPS.COMPLETE && renderProfileFillForm()}
          {step === STEPS.ORGANIZATION && renderOrganizationAsk()}
        </div>
      </main>
  );
};

export default Authorization;