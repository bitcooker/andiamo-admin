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
import NeedToKnowCard, {
  AddNeedToKnowCard,
  NeedToKnowCardSkeleton,
} from "@/components/page/trips-page/NeedToKnowCard";
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
import { firestore } from "@/firebase";
import toast from "react-hot-toast";

interface INeedToKnowPage {
  trip: TripType;
}

const NeedToKnowPage: React.FC<INeedToKnowPage> = ({ trip }) => {
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [needToKnows, setNeedToKnows] = useState<NeedToKnowType[] | null>(null);
  const [currentNeedToKnow, setCurrentNeedToKnow] =
    useState<NeedToKnowType | null>(null);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    const needToKnowsUnsub = onSnapshot(
      query(collection(firestore, "trips", trip.id, "needToKnows")),
      (_data) => {
        const _needToKnows: NeedToKnowType[] = [];
        _data.docs.map((_doc) => {
          _needToKnows.push({
            ...(_doc.data() as NeedToKnowType),
            id: _doc.id,
          });
        });

        setNeedToKnows(_needToKnows);
      }
    );
  }, []);

  useEffect(() => {
    if (currentNeedToKnow) {
      setDescription(currentNeedToKnow.description);
      setTitle(currentNeedToKnow.title);
    } else {
      setDescription("");
      setTitle("");
    }
  }, [currentNeedToKnow]);

  useEffect(() => {
    if (showModal == false) {
      setDescription("");
      setTitle("");
    }
  }, [showModal]);

  const handleAddNeedToKnowCardClicked = () => {
    setShowModal(true);
    setCurrentNeedToKnow(null);
  };

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

  const saveData = async () => {
    if (currentNeedToKnow) {
      await updateDoc(
        doc(firestore, "trips", trip.id, "needToKnows", currentNeedToKnow.id),
        {
          title: title,
          description: description,
        }
      );
    } else {
      await addDoc(collection(firestore, "trips", trip.id, "needToKnows"), {
        title: title,
        description: description,
        createdAt: serverTimestamp(),
      });
    }
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
    if (currentNeedToKnow) {
      const deleteDocRef = doc(
        firestore,
        "trips",
        trip.id,
        "needToKnows",
        currentNeedToKnow.id
      );
      await deleteDoc(deleteDocRef);
    }
  };

  return (
    <div>
      <div className="mt-5 flex flex-col md:flex-row md:items-start items-start">
        <span className="mr-5 min-w-[80px]">Need to know</span>
        <div className="flex flex-col mt-1 md:mt-0 gap-3 w-full md:max-w-[600px]">
          {needToKnows ? (
            needToKnows.map((_needToKnow, index) => (
              <NeedToKnowCard
                onClick={() => {
                  setShowModal(true);
                  setCurrentNeedToKnow(_needToKnow);
                }}
                key={index}
                needToKnow={_needToKnow}
              />
            ))
          ) : (
            <>
              <NeedToKnowCardSkeleton opacity={0} />
              <NeedToKnowCardSkeleton opacity={1} />
              <NeedToKnowCardSkeleton opacity={2} />
            </>
          )}
          <AddNeedToKnowCard onClick={handleAddNeedToKnowCardClicked} />
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit description</DialogTitle>
            <DialogDescription>
              <div className="w-full mx-auto max-w-[300px] md:max-w-[400px]">
                <div className="mt-5 flex flex-col items-start">
                  <span className="mr-5 w-[100px]">Title</span>
                  <Input
                    className="max-w-[600px] mt-1"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>
                <div className="mt-5 flex flex-col items-start">
                  <span className="mr-5 w-[100px]">Description</span>
                  <Textarea
                    className="max-w-[600px] h-[250px] mt-1"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
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
              {currentNeedToKnow && (
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

export default NeedToKnowPage;
