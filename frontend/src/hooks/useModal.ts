import {useContext} from 'react';
import ModalsContext from "@/context/modals.context";

const useModal = () => useContext(ModalsContext);

export default useModal;