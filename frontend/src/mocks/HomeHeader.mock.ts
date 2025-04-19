interface IHeaderUrl {
  title: string;
  url: string;
}

export const HomeHeaderData: IHeaderUrl[] = [
  {
    title: "Заявки",
    url: "/messages"
  },
  {
    title: "Организации",
    url: "/organizations"
  }
];