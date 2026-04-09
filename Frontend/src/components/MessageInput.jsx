import React, { useEffect, useState, useRef } from "react";
import useChatStore from "../store/useChatStore";
import authStore from "../store/userAuth.store";
import useKeysound from "../hooks/useKeysound";
import { X, ImageIcon, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

function MessageInput() {
  const {
    isSoundOn,
    isImageUploading,
    getTokenForUpload,
    uploadOnCloudinary,
    sendMessage
  } = useChatStore();
  const [previewImage, setPreviewImage] = useState();
  const [actualImage, setActualImage] = useState();
  const [text, setText] = useState("");

  const sound = useKeysound();

  const imageInput = useRef();
  

  useEffect(() => {
    const handlekeydown = () => {
      if (isSoundOn) {
        sound.playSound();
      }
    };

    window.addEventListener("keydown", handlekeydown);

    return () => {
      window.removeEventListener("keydown", handlekeydown);
    };
  }, [isSoundOn]);

  const handleImage = async (e) => {
    
    
    if (e.target.files.length > 0) {
       const file = e.target.files[0];
      setActualImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const messageSend = async (e) => {
    e.preventDefault();

    let url;
    if (actualImage) {
      let signature;
      try {
        signature = await getTokenForUpload("messages");
      } catch (error) {
        console.error("Error fetching upload token:", error);
      }

      // console.log("signature from messageSend", signature);

      const formData = new FormData();
      console.log("actual image in messsage ",actualImage)
      formData.append("file", actualImage);
      formData.append("signature", signature.signature);
      formData.append("timestamp", signature.timestamp);
      formData.append("api_key", signature.apiKey);
      formData.append("folder", "messages");

      try {
        const response = await uploadOnCloudinary(formData);
        url = response.secure_url;
        console.log("message image link ",url)
        if (!response) {
          toast.error("Error uploading image");
        }
      } catch (error) {
        console.error("error is now kjdfnkjvngsf ", error);
      }
    }

    try {
      const resp = await sendMessage(url, text);
      // console.log(resp);
    } catch (error) {
      console.log(error)
    }

    setText("");
    setPreviewImage(null);
    setActualImage(null);
    if (imageInput.current) {
      imageInput.current.value = "";
    }
  };
  const removeImage = () => {
    setPreviewImage(null);
    if (imageInput.current) {
      imageInput.current.value = "";
    }
  };

  return (
    <div className="w-full  ring-1 ring-white p-2">
      {previewImage && (
        <div className="relative w-fit ">
          <img
            src={previewImage}
            className="h-20 w-30 object-cover ring-1 ring-gray-500"
          />
          {isImageUploading && (
            <div className="absolute inset-0 bg-black/50 flex justify-center items-center">
              <Loader2 className="animate-spin" />
            </div>
          )}
          <button className="absolute right-0 top-0" onClick={removeImage}>
            <X size={12} className={`hover:scale-120 hover:cursor-pointer`} />
          </button>
        </div>
      )}
      <div>
        <form
          onSubmit={messageSend}
          action="submit"
          className="flex flex-row items-center justify-between"
        >
          <input
            onChange={(e) => setText(e.target.value)}
            type="text"
            value={text}
            placeholder="message..."
            className="input text-white w-85/100 mt-2 bg-amber-50/50 p-0.5   "
          />

          <input
            type="file"
            accept="image/*"
            ref={imageInput}
            onChange={handleImage}
            className="hidden"
          />

          <ImageIcon
            size={34}
            className="mt-2 hover:cursor-pointer"
            onClick={() => {
              imageInput.current.click();
            }}
          />
          {/* onSubmit={messageSend} */}
          <button type="submit">
            <Send size={32} className="mt-2 hover:cursor-pointer" />
          </button>
        </form>
      </div>
     
    </div>
    
  );
}

export default MessageInput;
