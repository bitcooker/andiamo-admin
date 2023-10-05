import { Timestamp } from "firebase/firestore";
export declare global {
  interface UserType {
    id: string;
    email: string;
    name: string;
    photoURL: string;
  }

  interface AdminType {
    id: String;
    email: String;
    password?: String;
  }

  interface SimpleChatType {
    id: string;
    title: string;
    image: string;
    userUid: string;
    userUnreads: number;
    adminUnreads: number;
    updatedAt: Timestamp;
  }

  interface MessageType {
    id: string;
    text: string;
    role: string;
    createdAt: Timestamp;
  }

  interface PaymentCardType {
    id: string;
    fullName: string;
    billingAddress: string;
    city: string;
    zipCode: string;
    country: string;
    createdAt: Timestamp;
  }

  interface PassportCardType {
    id: string;
    fullName: string;
    passportNumber: string;
    nationality: string;
    dateOfIssue: Timestamp;
    dateOfExpiry: Timestamp;
    createdAt: Timestamp;
  }

  interface TripType {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    stayDescription: string;
    imageURL: string;
  }

  interface StayImageType {
    id: string;
    title: string;
    imageURL: string;
    createdAt: Timestamp;
  }

  interface TravelitineraryType {
    id: string;
    day: number;
    itinerary: string;
    date: Timestamp;
    description: string;
    createdAt: Timestamp;
  }

  interface NeedToKnowType {
    id: string;
    description: string;
  }

  interface TripPlanType {
    id: string;
    status: "planning" | "planned" | "completed";
    tripId: string;
    tripTitle: string;
  }

  interface FeedType {
    id: string;
    tripId: string;
    index: number;
  }
}
