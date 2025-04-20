export interface RoomJoinData {
    email: string;
    room: string;
}
  
export interface CallData {
    to: string;
    offer: any;
}

export interface AnswerData {
    to: string;
    ans: any;
}

export interface NegotiationData {
    to: string;
    offer?: any;
    ans?: any;
}