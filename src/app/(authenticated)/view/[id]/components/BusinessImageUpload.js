import React, { useState } from "react";
import { Upload } from "lucide-react";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import toast from "react-hot-toast";
import { uploadBusinessImage } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function BusinessImageUpload({ id, businessImages, summary, downloadBase64Doc }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async (e, imgName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(imgName);
    try {
      const base64 = await convertToBase64(file);
      const resp = await uploadBusinessImage(id, imgName, base64);
      if (resp?.success || resp?.status === 200 || !resp?.error) {
        toast.success(`${imgName.replace(/_/g, ' ')} uploaded successfully!`);
        router.refresh();
      } else {
        toast.error(`Failed to upload ${imgName}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Error uploading image`);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const images = [
    { key: "business_image", label: "Main Image" },
    { key: "business_image_1", label: "Image 1" },
    { key: "business_image_2", label: "Image 2" },
    { key: "business_image_3", label: "Image 3" },
    { key: "business_image_4", label: "Image 4" },
  ];

  const getExistingImage = (key) => {
    return businessImages?.[key] || summary?.[key];
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-white mt-8 shadow-sm">
      <div className="bg-linear-to-r from-brand-blue to-[#043662] px-6 py-4 select-none">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Upload / Update Business Images
        </h3>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map(({ key, label }) => {
          const existingImage = getExistingImage(key);

          return (
            <div key={key} className="border border-gray-150 rounded-2xl p-4 flex flex-col justify-between items-center text-center bg-gray-50/50 min-h-[160px]">
              <span className="text-xs font-bold text-gray-600 mb-4 uppercase tracking-wider">
                {label}
              </span>
              
              {existingImage ? (
                <div className="flex flex-col items-center w-full gap-3 mt-auto">
                  <img 
                    src={`data:image/jpeg;base64,${existingImage}`} 
                    alt={label} 
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => downloadBase64Doc?.(existingImage, `${label}.jpg`, "image/jpeg")}
                    title="Click to download"
                  />
                  <div className="relative w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUpload(e, key)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      disabled={loading !== false}
                    />
                    <Button
                      variant="outline"
                      className="w-full justify-center flex gap-2 pointer-events-none text-xs"
                      disabled={loading !== false}
                    >
                      {loading === key ? <Spinner size="small" /> : <Upload size={14} />}
                      {loading === key ? "Updating..." : "Update Image"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative w-full mt-auto">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUpload(e, key)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    disabled={loading !== false}
                  />
                  <Button
                    variant="outline"
                    className="w-full justify-center flex gap-2 pointer-events-none text-xs"
                    disabled={loading !== false}
                  >
                    {loading === key ? <Spinner size="small" /> : <Upload size={14} />}
                    {loading === key ? "Uploading..." : "Upload Image"}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
