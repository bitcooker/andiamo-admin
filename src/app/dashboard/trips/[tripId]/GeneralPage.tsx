"use client";

import React, { useEffect, useState } from "react";
import ImageInput from "@/components/common/image-input/ImageInput";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaLessThan } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { firestore, storage } from "@/firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

interface IGeneralPage {
  trip: TripType | null;
}

const GeneralPage: React.FC<IGeneralPage> = ({ trip }) => {
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<any>(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");

  console.log(trip?.id);

  useEffect(() => {
    if (trip) {
      setTitle(trip.title);
      setDescription(trip.description);
      setSubtitle(trip.subtitle);
      setImage(trip.imageURL);
    }
  }, [trip]);

  const handleImageChange = (value: any) => {
    if (value) {
      setImageFile(value);
      setImage(URL.createObjectURL(value));
    } else {
      setImageFile(null);
      setImage("");
    }
  };

  const handleReset = () => {
    setImage(trip!.imageURL);
    setTitle(trip!.title);
    setSubtitle(trip!.subtitle);
    setDescription(trip!.description);
    setImageFile(null);
  };

  const updateTripData = async () => {
    // Image Deleting
    if (
      (trip!.imageURL !== "" && image == "") ||
      (trip!.imageURL !== "" && image != trip!.imageURL)
    ) {
      const deleteImageRef = ref(storage, trip!.imageURL);
      await deleteObject(deleteImageRef);

      setImage("");

      await updateDoc(doc(firestore, "trips", trip!.id), {
        imageURL: "",
      });
    }

    if (imageFile) {
      // Image Upload
      const uploadRef = ref(storage, `/images/trips/${imageFile.name}`);

      const snapshot = await uploadBytes(uploadRef, imageFile);
      const url = await getDownloadURL(snapshot.ref);
      await updateDoc(doc(firestore, "trips", trip!.id), {
        imageURL: url,
      });

      setImage(url);
      setImageFile(null);
    }

    // Other fields Update
    await updateDoc(doc(firestore, "trips", trip!.id), {
      title: title,
    });
    await updateDoc(doc(firestore, "trips", trip!.id), {
      subtitle: subtitle,
    });
    await updateDoc(doc(firestore, "trips", trip!.id), {
      description: description,
    });
  };

  const handleUpdate = () => {
    setIsUpdating(true);
    updateTripData()
      .then(() => {})
      .catch((err: any) => {
        toast.error("Something went wrong :(");
        console.error(err.message);
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center items-start mt-5">
        <span className="mr-5 w-[80px]">Title</span>
        <Input
          className="max-w-[600px] md:mt-0 mt-1"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </div>
      <div className="mt-5 flex flex-col md:flex-row md:items-center items-start">
        <span className="mr-5 w-[80px] ">Subtitle</span>
        <Input
          className="max-w-[600px] mt-1 md:mt-0"
          value={subtitle}
          onChange={(e) => {
            setSubtitle(e.target.value);
          }}
        />
      </div>
      <div className="mt-5 flex flex-col md:flex-row md:items-start items-start">
        <span className="mr-5 w-[80px]">Description</span>
        <Textarea
          className="max-w-[600px] h-[250px] mt-1 md:mt-0"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
      </div>
      <div className="mt-5 flex flex-col md:flex-row md:items-start items-start">
        <span className="mr-5 w-[80px]">Image</span>
        <div className="max-w-[600px] w-full h-[320px] mt-1 md:mt-0">
          <ImageInput image={image} onImageChange={handleImageChange} />
        </div>
      </div>
      <div className="flex gap-3 items-center mt-16 max-w-[680px] justify-center">
        <Button onClick={handleUpdate} disabled={isUpdating}>
          {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
        </Button>
        <Button disabled={isUpdating} variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default GeneralPage;
