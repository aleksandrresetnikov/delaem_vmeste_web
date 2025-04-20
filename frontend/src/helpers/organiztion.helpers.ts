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
  if(rate > 0 && rate < 3.5) return 'Организация сомнительная';
  if(rate >= 3.5 && rate < 4.5) return 'Организация нормальная';
  if(rate >= 4.5) return 'Организация отличная';

  return 'Организация неизвестна';
}
