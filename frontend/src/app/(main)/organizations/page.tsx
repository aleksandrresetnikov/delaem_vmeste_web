'use client'
import s from './volunteers.module.css'
import React, {useState} from 'react';
import {fetchOrganizations, OrganizationCardData} from "@/api/organizations";
import CardList from "@/widgets/CardList/CardList";
import Search from "@/components/organizations/Search/Search";
import {useAsync} from "react-use";

const Page = () => {
  const [cardData, setCardData] = useState<OrganizationCardData[]>([])
  useAsync(async () => {
    try {
      const {data} = await fetchOrganizations()
      setCardData(data)
    } catch (e: any) {
      setCardData([])
    }
  }, [])

  const handleSearch = (search: string) => {
    //fetchData
    //setCardData()
    console.log(search);
  }

  return (
      <div className={s.wrapper}>
        <Search emitSearch={handleSearch}/>
        <CardList data={cardData}/>
      </div>
  );
};

export default Page;