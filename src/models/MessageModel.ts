// this holds key info about every message

interface MessageModel {
  uid: string;   
  status: string;  
  date: Date;       
  message: string;  
  title: string;  
  sender: string;   
  isIncoming: boolean;
}

export default MessageModel;
