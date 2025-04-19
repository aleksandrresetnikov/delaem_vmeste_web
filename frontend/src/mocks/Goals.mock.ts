export interface IGoalCard {
  title: string,
  description: string,
  imageUrl: string,
}

export const goalsData: IGoalCard[] = [
  {
    title: 'Объединение сердец',
    description: 'Проект нацелен на быструю и удобную связь волонтерских организаций с нуждающимися и наооборот',
    imageUrl: '/icons/heart.png'
  },
  {
    title: 'Мы вместе',
    description: 'Все волонтерские организации в одном месте, на удобной для пользования платформе',
    imageUrl: '/icons/hand.png'
  },
  {
    title: 'Быстрая помощь',
    description: 'Волонтеры на протяжении всего рабочего времени ждут заявки от нуждающихся',
    imageUrl: '/icons/rocket.png'
  }
]