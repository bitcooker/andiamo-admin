"use client";

import React, { useState, useEffect, useReducer, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DndContext } from "@/context/DndContext";
import { Draggable, DropResult, Droppable } from "react-beautiful-dnd";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "@/firebase";
import { BsPlus, BsPlusSquareDotted } from "react-icons/bs";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";

interface ITripsPage {
  userId: string;
}

interface ITripPlanColumn {
  id: string;
  title: string;
  plans: TripPlanType[];
}

const TripsPage: React.FC<ITripsPage> = ({ userId }) => {
  const [data, setData] = useState<ITripPlanColumn[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [tripPlans, setTripPlans] = useState<TripPlanType[] | null>(null);
  const [addStatus, setAddStatus] = useState("planning");
  const [addTrip, setAddTrip] = useState<TripType | null>(null);
  const [deleteTripPlan, setDeleteTripPlan] = useState<TripPlanType | null>(
    null
  );
  const [trips, setTrips] = useState<TripType[] | null>(null);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId !== destination.droppableId) {
      const newData = [...JSON.parse(JSON.stringify(data))]; //shallow copy concept
      const oldDroppableIndex = newData.findIndex(
        (x) => x.id == source.droppableId
      );
      const newDroppableIndex = newData.findIndex(
        (x) => x.id == destination.droppableId
      );
      const [item] = newData[oldDroppableIndex].plans.splice(source.index, 1);

      updateDoc(doc(firestore, "users", userId, "tripPlans", item.id), {
        status: destination.droppableId,
      }).then(() => {
        newData[newDroppableIndex].plans.splice(destination.index, 0, item);
        setData([...newData]);
      });
    } else {
      const newData = [...JSON.parse(JSON.stringify(data))]; //shallow copy concept
      const droppableIndex = newData.findIndex(
        (x) => x.id == source.droppableId
      );
      const [item] = newData[droppableIndex].plans.splice(source.index, 1);
      newData[droppableIndex].plans.splice(destination.index, 0, item);
      setData([...newData]);
    }
  };

  useEffect(() => {
    const tripPlansUnsub = onSnapshot(
      query(collection(firestore, "users", userId, "tripPlans")),
      (_data) => {
        const _tripPlans: TripPlanType[] = [];
        _data.docs.map((_doc) => {
          _tripPlans.push({ ...(_doc.data() as TripPlanType), id: _doc.id });
        });

        setTripPlans(_tripPlans);
      }
    );

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

  useEffect(() => {
    const _data: ITripPlanColumn[] = [
      {
        id: "planning",
        title: "Planning",
        plans: [],
      },
      {
        id: "planned",
        title: "Planned",
        plans: [],
      },
      {
        id: "completed",
        title: "Completed",
        plans: [],
      },
    ];

    if (tripPlans) {
      _data[0].plans = [
        ...tripPlans.filter((_tripPlan) => _tripPlan.status == "planning"),
      ];

      _data[1].plans = [
        ...tripPlans.filter((_tripPlan) => _tripPlan.status == "planned"),
      ];

      _data[2].plans = [
        ...tripPlans.filter((_tripPlan) => _tripPlan.status == "completed"),
      ];
    }

    setData(_data);
  }, [tripPlans]);

  const handleAddNewClicked = (_status: string) => {
    setShowAddModal(true);
    setAddStatus(_status);
  };

  const handleAddTripChanged = (e: TripType) => {
    setAddTrip(e);
  };

  const handleAddTripPlan = () => {
    setAdding(true);
    addTripPlan()
      .then(() => {})
      .catch((err: any) => {
        toast.error("Something went wrong :(");
        console.error(err.message);
      })
      .finally(() => {
        setAdding(false);
        setShowAddModal(false);
      });
  };

  const addTripPlan = async () => {
    if (addTrip) {
      await addDoc(collection(firestore, "users", userId, "tripPlans"), {
        status: addStatus,
        tripTitle: addTrip.title,
        tripId: addTrip.id,
      });
    }
  };

  const handleDeleteTripPlan = () => {
    setDeleting(true);
    deletePlan()
      .then(() => {})
      .catch((err: any) => {
        toast.error("Something went wrong :(");
        console.error(err.message);
      })
      .finally(() => {
        setDeleting(false);
        setShowDeleteModal(false);
      });
  };

  const deletePlan = async () => {
    if (deleteTripPlan) {
      const deleteDocRef = doc(
        firestore,
        "users",
        userId,
        "tripPlans",
        deleteTripPlan.id
      );

      await deleteDoc(deleteDocRef);
    }
  };

  return (
    <div>
      <DndContext onDragEnd={onDragEnd}>
        <div className="flex flex-wrap justify-center gap-2 my-20 mx-4 flex-col lg:flex-row">
          {data.map((val, index) => {
            return (
              <Droppable key={index} droppableId={`${val.id}`}>
                {(provided) => (
                  <div
                    className="p-5 lg:w-1/3 w-full min-w-[400px] bg-white border border-zinc-300 rounded-lg border-dashed"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <h2 className="relative text-center font-bold mb-6 text-black">
                      {val.title}

                      <div
                        onClick={() => {
                          handleAddNewClicked(val.id);
                        }}
                        className="absolute right-2 bottom-[50%] translate-y-[50%] text-zinc-500 hover:text-zinc-900 cursor-pointer transition-all active:scale-90"
                      >
                        <BsPlus size={20} />
                      </div>
                    </h2>
                    {val.plans?.map((plan, index) => (
                      <Draggable
                        key={plan.id}
                        draggableId={plan.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="flex items-center justify-between bg-white border active:shadow-[0_6px_14px_rgb(0,0,0,0.08)] transition-all rounded-lg text-sm mx-1 px-4 py-3 my-3 shadow-[0_4px_12px_rgb(0,0,0,0.04)]"
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                          >
                            <div className="truncate flex-grow">
                              {plan.tripTitle}
                            </div>
                            <div
                              onClick={() => {
                                setShowDeleteModal(true);
                                setDeleteTripPlan(plan);
                              }}
                              className="text-zinc-300 hover:text-zinc-800 active:scale-95 cursor-pointer"
                            >
                              <AiOutlineClose />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DndContext>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new trip plan</DialogTitle>
            <DialogDescription>
              <div className="w-full mx-auto max-w-[300px] md:max-w-[800px]">
                <div className="mt-5 flex flex-col items-start">
                  <span className="mr-5 w-[100px]">Trip</span>
                  <div className="mt-2 w-full">
                    {trips ? (
                      <Select>
                        <SelectTrigger className="w-full"></SelectTrigger>
                        <SelectContent>
                          {trips.map((_trip, index) => (
                            <SelectItem
                              value={_trip.title}
                              key={index}
                              onClick={() => {
                                setAddTrip(_trip);
                              }}
                            >
                              {_trip.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Skeleton className="w-full rounded-sm bg-zinc-200/30 h-[40px]" />
                    )}
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="w-fit mx-auto flex flex-col md:flex-row gap-2 mt-5">
              <Button
                onClick={handleAddTripPlan}
                className="w-[130px] mx-auto"
                disabled={adding}
              >
                {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will remove the trip plan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={"destructive"}
              disabled={deleting}
              onClick={handleDeleteTripPlan}
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

export default TripsPage;
