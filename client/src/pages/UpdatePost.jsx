import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePost() {
  const [formData, setformData] = useState({});
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setimageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  console.log(formData);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          setUpdateError(data.message);
          return;
        } else {
          setUpdateError(null);
          setformData(data.posts[0]);
        }
      } catch (error) {
        setUpdateError(error.message);
      }
    };
    fetchPost();
  }, [postId]);
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storeageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storeageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          return setimageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setimageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((dowloadURL) => {
            setformData({
              ...formData,
              image: dowloadURL,
            });
            setImageUploadError(null);
            setimageUploadProgress(null);
          });
        }
      );
    } catch (error) {
      setImageUploadError("image upload failed");
      setimageUploadProgress(null);
    }
  };

  const hanldeSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setUpdateError(data.message);
        return;
      } else {
        setUpdateError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setUpdateError("Something went wrong");
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className=" text-3xl py-7 font-semibold text-center">Update this Post</h1>
      <form className="flex flex-col gap-4" onSubmit={hanldeSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput type="text" placeholder="Title" required id="title" className="flex-1" onChange={(e) => setformData({ ...formData, title: e.target.value })} value={formData.title} />
          <Select onChange={(e) => setformData({ ...formData, category: e.target.value })} value={formData.category}>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
          <Button disabled={imageUploadProgress} type="button" gradientDuoTone={"purpleToBlue"} size={"sm"} outline onClick={handleUploadImage}>
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
              </div>
            ) : (
              "Upload image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color={"failure"}>{imageUploadError}</Alert>}
        {formData.image && <img src={formData.image} alt="upload" className="w-full h-72 object-cover" />}
        <ReactQuill theme="snow" placeholder="Write something..." className="h-72 mb-12" required onChange={(value) => setformData({ ...formData, content: value })} value={formData.content} />
        <Button type="submit" gradientDuoTone={"purpleToPink"}>
          Update Post
        </Button>
        {updateError && (
          <Alert color={"failure"} className="mt-5">
            {updateError}
          </Alert>
        )}
      </form>
    </div>
  );
}
