"use client";

import TripCard, {
  TripCardSkeleton,
} from "@/components/page/trips-page/TripCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { firestore } from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { PiMagnifyingGlassLight } from "react-icons/pi";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ITripsClient {}

const TripsClient: React.FC<ITripsClient> = ({}) => {
  const [trips, setTrips] = useState<TripType[] | null>(null);
  const [removeTrip, setRemoveTrip] = useState<TripType | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const tripsUnsub = onSnapshot(
      query(collection(firestore, "trips")),
      (_data) => {
        const _trips: TripType[] = [];
        _data.docs.map((_doc) => {
          _trips.push({ ...(_doc.data() as TripType), id: _doc.id });
        });

        setTrips(_trips);
      }
    );
  }, []);

  const handleAddTrip = () => {
    setLoading(true);

    addDoc(collection(firestore, "trips"), {
      title: "Untitled trip",
      subtitle: "",
      description: "",
      stayDescription: "",
      exploringDescription: "",
      diningDescription: "",
      imageURL: "",
      createdAt: serverTimestamp(),
    })
      .then((_doc) => {
        router.push(`/dashboard/trips/${_doc.id}`);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong :(");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRemoveTripClicked = (tripToRemove: TripType) => {
    setRemoveTrip(tripToRemove);
    setOpenDialog(true);
  };

  const handleRemoveTrip = () => {
    if (removeTrip) {
      setDeleting(true);
      const deleteDocRef = doc(firestore, "trips", removeTrip.id);
      deleteDoc(deleteDocRef)
        .catch((err) => {
          console.error(err);
          toast.error("Something went wrong :(");
        })
        .finally(() => {
          setDeleting(false);
          setOpenDialog(false);
        });
    }
  };

  return (
    <div>
      <h1 className="text-2xl">Trips</h1>
      <div className="w-full mt-5 flex flex-col items-start lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:w-fit">
          <Button
            className="w-full lg:w-[100px]"
            disabled={loading}
            onClick={handleAddTrip}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add new"}
          </Button>
        </div>
        <div className="mt-5 lg:mt-0 w-full flex lg:justify-end">
          <div className="flex items-center w-full lg:w-fit">
            <PiMagnifyingGlassLight size={24} className="mr-2 text-zinc-500" />
            <Input
              type="search"
              placeholder="Search Trips..."
              name="searchText"
              className="w-full lg:w-[450px]"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-8 mt-5 lg:mt-8">
        {trips ? (
          trips.length > 0 ? (
            trips.map((_trip, index) => (
              <TripCard
                onRemoveTripClick={handleRemoveTripClicked}
                trip={_trip}
                key={index}
              />
            ))
          ) : (
            <div className="text-sm text-zinc-300">No trips</div>
          )
        ) : (
          <>
            <TripCardSkeleton opacity={0} />
            <TripCardSkeleton opacity={1} />
            <TripCardSkeleton opacity={2} />
          </>
        )}
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the trip.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={"destructive"}
              disabled={deleting}
              onClick={handleRemoveTrip}
              className="w-full md:w-[200px] md:mx-auto"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Confirm delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TripsClient;
