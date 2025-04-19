import s from './OfferedOrganizationList.module.css'
import React, {FC} from 'react';
import OfferedOrganization from "@/components/chats/OfferedOrganization/OfferedOrganization";



const OfferedOrganizationList= () => {
    return (
        <div className={s.wrapper}>
            <OfferedOrganization orgId={'13'} isBest={true}/>
            <OfferedOrganization orgId={'13'} isBest={false}/>
            <OfferedOrganization orgId={'13'} isBest={false}/>
        </div>
    );
};

export default OfferedOrganizationList;