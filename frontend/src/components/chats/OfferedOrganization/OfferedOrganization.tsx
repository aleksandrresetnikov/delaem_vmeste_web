import s from './OfferedOrganization.module.css'
import React, {FC, useEffect, useState} from 'react';
import Image from 'next/image'
import {getOrganizationById, OrganizationCardData, OrganizationData} from "@/api/organizations";
import {useAsync} from "react-use";
import InfoBadge from "@/components/organizations/InfoBadge/InfoBadge";
import useModal from "@/hooks/useModal";

interface OfferedOrganizationProps {
    orgId: number,
    isBest: boolean
}

const OfferedOrganization: FC<OfferedOrganizationProps> = ({orgId, isBest}) => {
    const [orgData, setOrgData] = useState<OrganizationData | null>(null)
    const modal = useModal();

    useAsync(async () => {
        const {data} = await getOrganizationById(orgId)
        setOrgData(data)
    }, [orgId]);

    const handleShowInfo = () => {
        modal?.switchModal('organization', {
            organizationModal: {
                id: orgId
            }
        })
    }
    return (
        <div className={s.wrapper} onClick={handleShowInfo}>
            <Image
                src={orgData?.imageUrl || '/icons/heart.png'}
                alt={'org logo'}
                width={200}
                height={200}
            />
            <h4>
                {orgData?.name}
            </h4>
            {
                isBest && <InfoBadge type={'rate'} text={'Наиболее подходящий вариант'}/>
            }
        </div>
    );
};

export default OfferedOrganization;