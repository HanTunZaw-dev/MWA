import { IVolunteer } from "./IVolunteer.interface"

export interface IDesire{
  _id: string,
  title: string,
  description: string,
  status: string,
  category: string,
  requestTime: Date,
  location?: {type: [number]},
  address: string,
  contactInfo: string,
  estimateInHours: number,
  numberOfVolunteerNeeded: number,
  volunteers?: [IVolunteer]
  updatedAt?: Date,
  createdBy: {
    userId: string,
    fullname: string,
    email: string
  },
}
