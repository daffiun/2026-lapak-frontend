export interface Building {
   id: number;
   name: string;
   address: string;
   operatorName: string;
   description: string;
}

export interface Room {
   id: number;
   name: string;
   roomNumber: string;
   description: string;
   headOfRoom: string;
   buildingId: number;
   building?: Building;
}

export interface Booking {
   id: number;
   borrowerName: string;
   borrowerNrp: string;
   roomId: number;
   room?: Room; 
   bookingDate: string; 
   startDate: string;
   endDate: string;
   status: string; 
   operatorName: string;
}