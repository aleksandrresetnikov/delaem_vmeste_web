//функции помогаторы
export const correctWordForm = (count: number): string => {
  if (count % 10 === 1 && count % 100 !== 11) {
    return "Доброе дело";
  } else if (
      count % 10 >= 2 &&
      count % 10 <= 4 &&
      (count % 100 < 10 || count % 100 >= 20)
  ) {
    return "Добрых дела";
  } else {
    return "Добрых дел";
  }
}
export const checkRate = (rate: number): string => {
  if (0 <= rate && rate <= 2) return 'Организация сомнительная'
  else if (2 < rate && rate <= 3.5) return 'Организация нормальная'
  else if (3.5 < rate && rate <= 5) return 'Организация Хорошая'
  else return 'Организация сомнительная'
}
