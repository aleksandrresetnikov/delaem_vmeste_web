"use client";
import React from 'react';
import Authorization from "@/widgets/Authorization/Authorization";
import {useSearchParams} from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const asVolunteer: boolean = searchParams.get("asVolunteer") !== null;
  const createOrg: boolean = searchParams.get("createOrg") !== null;

  return (
      <>
        <Authorization asVolunteer={asVolunteer} createOrg={createOrg}/>
      </>
  );
};

export default Page;