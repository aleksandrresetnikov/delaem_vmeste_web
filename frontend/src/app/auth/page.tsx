"use client";
import React from 'react';
import Authorization from "@/widgets/Authorization/Authorization";
import {useSearchParams} from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const asVolunteer: boolean = searchParams.get("asVolunteer") !== null;
  const createOrg: boolean = searchParams.get("createOrg") !== null;

  return (
      <div>
        <Authorization asVolunteer={asVolunteer} createOrg={createOrg}/>
      </div>
  );
};

export default Page;