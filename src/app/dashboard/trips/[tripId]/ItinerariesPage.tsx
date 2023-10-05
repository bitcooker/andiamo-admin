"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import TravelItineraryCard, {
  AddTravelItineraryCard,
  TravelItineraryCardSkeleton,
} from "@/components/page/trips-page/TravelItineraryCard";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "@/firebase";
import toast from "react-hot-toast";

interface IItinerariesPage {
  trip: TripType;
}

const ItinerariesPage: React.FC<IItinerariesPage> = ({ trip }) => {
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [day, setDay] = useState(1);
  const [itinerary, setItinerary] = useState("");
  const [description, setDescription] = useState("");

  const [date, setDate] = React.useState<Date>(new Date());
  const [itineraries, setitineraries] = useState<TravelitineraryType[] | null>(
    null
  );
  const [currentItinerary, setCurrentItinerary] =
    useState<TravelitineraryType | null>(null);

  useEffect(() => {
    const itinerariesUnsub = onSnapshot(
      query(
        collection(firestore, "trips", trip.id, "travelItineraries"),
        orderBy("day", "asc")
      ),
      (_data) => {
        const _itineraries: TravelitineraryType[] = [];
        _data.docs.map((_doc) => {
          _itineraries.push({
            ...(_doc.data() as TravelitineraryType),
            id: _doc.id,
          });
        });

        setitineraries(_itineraries);
      }
    );
  }, []);

  const hadleSaveClicked = () => {
    setSaving(true);
    saveData()
      .then(() => {})
      .catch((err: any) => {
        toast.error("Something went wrong :(");
        console.error(err.message);
      })
      .finally(() => {
        setSaving(false);
        setShowModal(false);
      });
  };

  const handleDelete = () => {
    setDeleting(true);
    deleteData()
      .then(() => {})
      .catch((err: any) => {
        toast.error("Something went wrong :(");
        console.error(err.message);
      })
      .finally(() => {
        setSaving(false);
        setDeleting(false);
        setShowModal(false);
      });
  };

  const deleteData = async () => {
    if (currentItinerary) {
      const deleteDocRef = doc(
        firestore,
        "trips",
        trip.id,
        "travelItineraries",
        currentItinerary.id
      );
      await deleteDoc(deleteDocRef);
    }
  };

  const saveData = async () => {
    if (currentItinerary) {
      await updateDoc(
        doc(
          firestore,
          "trips",
          trip.id,
          "travelItineraries",
          currentItinerary.id
        ),
        {
          day: day,
          itinerary: itinerary,
          description: description,
          date: date,
        }
      );
    } else {
      await addDoc(
        collection(firestore, "trips", trip.id, "travelItineraries"),
        {
          day: day,
          itinerary: itinerary,
          description: description,
          date: date,
          createdAt: serverTimestamp(),
        }
      );
    }
  };

  useEffect(() => {
    if (currentItinerary) {
      setDay(currentItinerary.day);
      setItinerary(currentItinerary.itinerary);
      setDescription(currentItinerary.description);
      setDate(currentItinerary.date.toDate());
    } else {
      setDay(1);
      setItinerary("");
      setDescription("");
      setDate(new Date());
    }
  }, [currentItinerary]);

  useEffect(() => {
    if (showModal == false) {
      setCurrentItinerary(null);
      setDay(1);
      setItinerary("");
      setDescription("");
      setDate(new Date());
    }
  }, [showModal]);

  const handleAddTravelItineraryCardClicked = () => {
    setShowModal(true);
    setCurrentItinerary(null);
  };

  return (
    <div>
      <div className="mt-5 flex flex-col md:flex-row md:items-start items-start">
        <span className="mr-5 min-w-[80px]">Itineraries</span>
        <div className="flex flex-col mt-1 md:mt-0 gap-3 w-full md:max-w-[600px]">
          {itineraries ? (
            itineraries.map((_itinerary, index) => (
              <TravelItineraryCard
                key={index}
                itinerary={_itinerary}
                onClick={() => {
                  setShowModal(true);
                  setCurrentItinerary(_itinerary);
                }}
              />
            ))
          ) : (
            <>
              <TravelItineraryCardSkeleton opacity={0} />
              <TravelItineraryCardSkeleton opacity={1} />
              <TravelItineraryCardSkeleton opacity={2} />
            </>
          )}
          <AddTravelItineraryCard
            onClick={handleAddTravelItineraryCardClicked}
          />
        </div>
      </div>

      <Dialog
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Itinerary</DialogTitle>
            <DialogDescription>
              <div className="w-full mx-auto max-w-[300px] md:max-w-[400px]">
                <div className="flex flex-col md:flex-row md:items-start items-start mt-5">
                  <span className="mr-5 w-[80px] text-start">Day</span>
                  <Input
                    className="max-w-[300px] md:mt-0 mt-1"
                    value={day}
                    onChange={(e) => {
                      setDay(parseInt(e.currentTarget.value));
                    }}
                  />
                </div>
                <div className="flex flex-col md:flex-row md:items-start items-start mt-5">
                  <span className="mr-5 w-[80px] text-start">itinerary</span>
                  <Input
                    className="max-w-[300px] md:mt-0 mt-1"
                    value={itinerary}
                    onChange={(e) => {
                      setItinerary(e.currentTarget.value);
                    }}
                  />
                </div>
                <div className="mt-5 flex flex-col md:flex-row md:items-start items-start">
                  <span className="mr-5 w-[80px] text-start">Date</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "max-w-[300px] w-full justify-start text-left font-normal md:mt-0 mt-1",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(_date) => {
                          _date && setDate(_date);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="mt-5 flex flex-col md:flex-row md:items-start items-start">
                  <span className="mr-5 w-[80px]">Description</span>
                  <Textarea
                    className="max-w-[600px] h-[250px] mt-1 md:mt-0"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.currentTarget.value);
                    }}
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="w-fit mx-auto flex flex-col md:flex-row gap-2 mt-5">
              <Button
                onClick={hadleSaveClicked}
                className="w-[130px] mx-auto"
                disabled={saving || deleting}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
              </Button>
              {currentItinerary && (
                <Button
                  onClick={handleDelete}
                  className="w-[130px] mx-auto"
                  disabled={saving || deleting}
                  variant={"destructive"}
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItinerariesPage;
