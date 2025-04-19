import s from './GoalsSection.module.css'
import React from 'react';
import GoalCard from "@/components/GoalCard/GoalCard";
import {goalsData} from "@/mocks/Goals.mock";


const GoalsSection = () => {
  return (
      <div className={s.wrapper} id={'goals'}>
        <div className={s.goalsContainer}>
          <h2>
            Цели проекта<br/>
            <span
                style={{color: 'var(--primary)', whiteSpace: 'wrap'}}>
                    Вместе Лучше
                </span>
          </h2>
          {
            goalsData.map((goal, index) =>
                <GoalCard
                    key={index}
                    title={goal.title}
                    description={goal.description}
                    imageUrl={goal.imageUrl}
                />
            )
          }
        </div>
      </div>
  );
};

export default GoalsSection;