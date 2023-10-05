"use client";

import React, { useEffect, useState } from "react";
import StayImageCard, {
  AddStayImageCard,
  StayImageCardSkeleton,
} from "@/components/page/trips-page/StayImageCard";
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
import ImageInput from "@/components/common/image-input/ImageInput";
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
import { firestore, storage } from "@/firebase";
import toast from "react-hot-toast";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

interface IStayPage {
  trip: TripType;
}

const StayPage: React.FC<IStayPage> = ({ trip }) => {
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [primarySaving, setPrimarySaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<any>(undefined);
  const [stayImages, setStayImages] = useState<StayImageType[] | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currentStayImage, setCurrentStayImage] =
    useState<StayImageType | null>(null);

  useEffect(() => {
    const stayImagesUnsub = onSnapshot(
      query(collection(firestore, "trips", trip.id, "stayImages")),
      (_data) => {
        const _stayImages: StayImageType[] = [];
        _data.docs.map((_doc) => {
          _stayImages.push({ ...(_doc.data() as StayImageType), id: _doc.id });
        });

        setStayImages(_stayImages);
      }
    );
  }, []);

  useEffect(() => {
    if (trip) {
      setDescription(trip.stayDescription);
    }
  }, [trip]);

  useEffect(() => {
    if (currentStayImage) {
      setTitle(currentStayImage.title);
      setImage(currentStayImage.imageURL);
    } else {
      setTitle("");
      setImage("");
    }
  }, [currentStayImage]);

  useEffect(() => {
    if (showModal == false) {
      setImageFile(null);
      setTitle("");
      setImage("");
    }
  }, [showModal]);

  const handleImageChange = (value: any) => {
    if (value) {
      setImageFile(value);
      setImage(URL.createObjectURL(value));
    } else {
      setImageFile(null);
      setImage("");
    }
  };

  const handleAddStayImageCardClicked = () => {
    setShowModal(true);
  };

  const handleSave = () => {
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
    var newDocId: string = "";
    // Image Deleting
    if (currentStayImage) {
      if (
        (currentStayImage.imageURL !== "" && image == "") ||
        (currentStayImage.imageURL !== "" &&
          image != currentStayImage!.imageURL)
      ) {
        const deleteImageRef = ref(storage, currentStayImage.imageURL);
        await deleteObject(deleteImageRef);

        setImage("");

        await updateDoc(
          doc(firestore, "trips", trip.id, "stayImages", currentStayImage.id),
          {
            imageURL: "",
          }
        );
      }
    }

    if (currentStayImage) {
      // Update
      await updateDoc(
        doc(firestore, "trips", trip.id, "stayImages", currentStayImage.id),
        {
          title: title,
        }
      );
    } else {
      const newDocRef = await addDoc(
        collection(firestore, "trips", trip.id, "stayImages"),
        {
          title: title,
          imageURL: image,
          createdAt: serverTimestamp(),
        }
      );

      newDocId = newDocRef.id;
    }

    if (imageFile) {
      // Image Upload
      const uploadRef = ref(storage, `/images/trips/${imageFile.name}`);

      const snapshot = await uploadBytes(uploadRef, imageFile);
      const url = await getDownloadURL(snapshot.ref);
      await updateDoc(
        doc(
          firestore,
          "trips",
          trip.id,
          "stayImages",
          currentStayImage ? currentStayImage.id : newDocId
        ),
        {
          imageURL: url,
        }
      );

      setImage(url);
      setImageFile(null);
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
    if (currentStayImage) {
      const deleteDocRef = doc(
        firestore,
        "trips",
        trip.id,
        "stayImages",
        currentStayImage.id
      );

      await deleteDoc(deleteDocRef);
    }
  };

  const savePrimaryData = async () => {
    await updateDoc(doc(firestore, "trips", trip.id), {
      stayDescription: description,
    });
  };

  const handlePrimarySave = () => {
    setPrimarySaving(true);
    savePrimaryData()
      .then(() => {})
      .catch((err: any) => {
        toast.error("Something went wrong :(");
        console.error(err.message);
      })
      .finally(() => {
        setPrimarySaving(false);
      });
  };

  return (
    <div>
      <div className="mt-5 flex flex-col md:flex-row md:items-start items-start">
        <span className="mr-5 w-[80px]">Description</span>
        <Textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          className="max-w-[600px] h-[250px] mt-1 md:mt-0"
        />
      </div>
      <div className="mt-5 flex flex-col md:flex-row md:items-start items-start">
        <span className="mr-5 min-w-[80px]">Images</span>
        <div className="flex flex-wrap mt-1 md:mt-0 gap-3">
          {stayImages ? (
            stayImages.map((_stayImage, index) => (
              <StayImageCard
                onClick={() => {
                  setCurrentStayImage(_stayImage);
                  setShowModal(true);
                }}
                stayImage={_stayImage}
                key={index}
              />
            ))
          ) : (
            <>
              <StayImageCardSkeleton opacity={0} />
              <StayImageCardSkeleton opacity={1} />
              <StayImageCardSkeleton opacity={2} />
            </>
          )}
          <AddStayImageCard onClick={handleAddStayImageCardClicked} />
        </div>
      </div>
      <div className="flex gap-3 items-center mt-16 max-w-[680px] justify-center">
        <Button
          onClick={handlePrimarySave}
          className="w-[130px] mx-auto"
          disabled={primarySaving}
        >
          {primarySaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save"
          )}
        </Button>
      </div>

      <Dialog
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          open == false && setCurrentStayImage(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit image</DialogTitle>
            <DialogDescription>
              <div className="w-full mx-auto max-w-[300px] md:max-w-[400px]">
                <div className="flex flex-col md:flex-row md:items-start items-start mt-5">
                  <span className="mr-5 w-[80px] text-start">Title</span>
                  <Input
                    className="max-w-[300px] md:mt-0 mt-1"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>
                <div className="mt-5 flex flex-col md:flex-row md:items-start items-start">
                  <span className="mr-5 w-[80px] text-start">Image</span>
                  <div className="max-w-[300px] w-full h-[290px] mt-1 md:mt-0">
                    <ImageInput
                      image={image}
                      onImageChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="w-fit mx-auto flex flex-col md:flex-row gap-2 mt-5">
              <Button
                onClick={handleSave}
                className="w-[130px] mx-auto"
                disabled={saving || deleting}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
              </Button>
              {currentStayImage && (
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

export default StayPage;
