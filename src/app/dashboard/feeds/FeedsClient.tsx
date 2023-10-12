"use client";

import { firestore } from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
import { Skeleton } from "@/components/ui/skeleton";
import FeedCard from "@/components/page/feeds-page/FeedCard";

interface IFeedsClient {}

interface IFeedsColumn {
  id: string;
  feeds: FeedType[];
}

const FeedsClient: React.FC<IFeedsClient> = ({}) => {
  const [data, setData] = useState<IFeedsColumn[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [feeds, setFeeds] = useState<FeedType[] | null>(null);
  const [trips, setTrips] = useState<TripType[] | null>(null);
  const [addTripId, setAddTripId] = useState<String | null>(null);
  const [feedToDelete, setFeedToDelete] = useState<FeedType | null>(null);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const newData = [...JSON.parse(JSON.stringify(data))]; //shallow copy concept
    const droppableIndex = newData.findIndex((x) => x.id == source.droppableId);
    const [item] = newData[droppableIndex].feeds.splice(source.index, 1);
    newData[droppableIndex].feeds.splice(destination.index, 0, item);
    setData([...newData]);
  };

  useEffect(() => {
    const feedsUnsub = onSnapshot(
      query(collection(firestore, "feeds"), orderBy("index")),
      (_data) => {
        const _feeds: FeedType[] = [];
        _data.docs.map((_doc) => {
          _feeds.push({ ...(_doc.data() as FeedType), id: _doc.id });
        });

        setFeeds(_feeds);
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
    const _data: IFeedsColumn[] = [
      {
        id: "feeds",
        feeds: [],
      },
    ];

    if (feeds) {
      _data[0].feeds = [...feeds];
    }

    setData(_data);
  }, [feeds]);

  useEffect(() => {
    if (data.length != 0) {
      for (let index = 0; index < data[0].feeds.length; index++) {
        const element = data[0].feeds[index];

        updateDoc(doc(firestore, "feeds", element.id), {
          index: index,
        });
      }
    }
  }, [data]);

  const handleAddNewClicked = () => {
    setShowAddModal(true);
  };

  const handleAddFeed = () => {
    setAdding(true);
    addFeed()
      .then(() => {})
      .catch((err: any) => {
        toast.error("Something went wrong :(");
        console.error(err.message);
      })
      .finally(() => {
        setAdding(false);
        setShowAddModal(false);
        setAddTripId(null);
      });
  };

  const addFeed = async () => {
    if (addTripId) {
      await addDoc(collection(firestore, "feeds"), {
        index: data[0].feeds.length - 1,
        tripId: addTripId,
      });
    }
  };

  const handleDeleteFeed = () => {
    setDeleting(true);
    deleteFeed()
      .then(() => {})
      .catch((err: any) => {
        toast.error("Something went wrong :(");
        console.error(err.message);
      })
      .finally(() => {
        setDeleting(false);
        setShowDeleteModal(false);
        setAddTripId(null);
      });
  };

  const deleteFeed = async () => {
    if (feedToDelete) {
      const deleteDocRef = doc(firestore, "feeds", feedToDelete.id);

      await deleteDoc(deleteDocRef);
    }
  };

  return (
    <div>
      <h1 className="text-2xl">Feeds</h1>
      <div className="mt-5">
        <DndContext onDragEnd={onDragEnd}>
          <div className="flex flex-wrap justify-center gap-2 my-5 mx-4 flex-col lg:flex-row">
            {data.map((val, index) => {
              return (
                <Droppable key={index} droppableId={`${val.id}`}>
                  {(provided) => (
                    <div
                      className="p-5 lg:w-1/3 w-full lg:min-w-[800px] bg-white border border-zinc-300 rounded-lg border-dashed"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <Button onClick={handleAddNewClicked}>Add new</Button>
                      {val.feeds?.map((_feed, index) => (
                        <Draggable
                          key={_feed.id}
                          draggableId={_feed.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className="flex items-center justify-between bg-white border border-zinc-200 active:shadow-[0_6px_14px_rgb(0,0,0,0.08)] transition-all rounded-lg text-sm mx-1 px-4 py-3 my-3 shadow-[0_4px_12px_rgb(0,0,0,0.04)]"
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                            >
                              <FeedCard
                                tripId={_feed.tripId}
                                onRemove={() => {
                                  setShowDeleteModal(true);
                                  setFeedToDelete(_feed);
                                }}
                              />
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
              <DialogTitle>Add new feed</DialogTitle>
              <DialogDescription>
                <div className="w-full mx-auto max-w-[300px] md:max-w-[800px]">
                  <div className="mt-5 flex flex-col items-start">
                    <span className="mr-5 w-[100px]">Trip</span>
                    <div className="mt-2 w-full">
                      {trips ? (
                        <Select
                          onValueChange={(e) => {
                            setAddTripId(e);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Trip" />
                          </SelectTrigger>
                          <SelectContent>
                            {trips.map((_trip, index) => (
                              <SelectItem value={_trip.id} key={index}>
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
                  onClick={handleAddFeed}
                  className="w-[130px] mx-auto"
                  disabled={adding}
                >
                  {adding ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Add"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>This will remove the feed.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant={"destructive"}
                disabled={deleting}
                onClick={handleDeleteFeed}
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
    </div>
  );
};

export default FeedsClient;
