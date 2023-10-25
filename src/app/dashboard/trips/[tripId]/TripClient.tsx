"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import GeneralPage from "./GeneralPage";
import StayPage from "./StayPage";
import ItinerariesPage from "./ItinerariesPage";
import NeedToKnowPage from "./NeedToKnowPage";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/firebase";
import ExploringPage from "./ExploringPage";
import DiningPage from "./DiningPage";

interface ITripClient {
  tripId: string;
}

const TripClient: React.FC<ITripClient> = ({ tripId }) => {
  const [tab, setTab] = useState("General");
  const [trip, setTrip] = useState<TripType | null>(null);

  useEffect(() => {
    const tripDocUnsub = onSnapshot(
      doc(firestore, "trips", tripId),
      (tripDoc) => {
        const _trip = tripDoc.data() as TripType;
        setTrip({ ..._trip, id: tripDoc.id });
      }
    );
  }, []);

  const handleTabClicked = (label: string) => {
    setTab(label);
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row w-[200px]  md:w-full items-center mx-auto justify-center gap-0">
        <Button
          onClick={() => {
            handleTabClicked("General");
          }}
          variant={`${tab == "General" ? "outline" : "ghost"}`}
        >
          General
        </Button>
        <Button
          onClick={() => {
            handleTabClicked("Where to Stay");
          }}
          variant={`${tab == "Where to Stay" ? "outline" : "ghost"}`}
        >
          Where to stay
        </Button>
        <Button
          onClick={() => {
            handleTabClicked("Exploring & Adventure");
          }}
          variant={`${tab == "Exploring & Adventure" ? "outline" : "ghost"}`}
        >
          Exploring & Adventure
        </Button>
        <Button
          onClick={() => {
            handleTabClicked("Dining & Cuisine");
          }}
          variant={`${tab == "Dining & Cuisine" ? "outline" : "ghost"}`}
        >
          Dining & Cuisine
        </Button>
        <Button
          onClick={() => {
            handleTabClicked("Travel Itineraries");
          }}
          variant={`${tab == "Travel Itineraries" ? "outline" : "ghost"}`}
        >
          Travel Itineraries
        </Button>
        <Button
          onClick={() => {
            handleTabClicked("Need to Know");
          }}
          variant={`${tab == "Need to Know" ? "outline" : "ghost"}`}
        >
          Need To Know
        </Button>
      </div>
      <hr className="mt-3" />
      <div className="mt-8">
        {tab == "General" && <GeneralPage trip={trip} />}
        {tab == "Where to Stay" && trip && <StayPage trip={trip} />}
        {tab == "Exploring & Adventure" && trip && (
          <ExploringPage trip={trip} />
        )}
        {tab == "Dining & Cuisine" && trip && <DiningPage trip={trip} />}
        {tab == "Travel Itineraries" && trip && <ItinerariesPage trip={trip} />}
        {tab == "Need to Know" && trip && <NeedToKnowPage trip={trip} />}
      </div>
    </div>
  );
};

export default TripClient;
