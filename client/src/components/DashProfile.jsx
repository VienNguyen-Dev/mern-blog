import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, updateUserFailure, updateUserSuccess, updateUserstart } from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function DashProfile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUpLoading, setImageFileUpLoading] = useState(false);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [uploadUserError, setUploadUserError] = useState(null);
  const [uploadUserSuccess, setUploadUserSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const filePickerRef = useRef(null);
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    //Setup to save iamage ito firebase
    //service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size <2*1024*1024 &&
    //       request.resource.contentType.matches('image/.*');
    //     }
    //   }
    // }
    setImageFileUploadError(null);
    setImageFileUpLoading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        return setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("Could not upload image (Image have must less than 2MB)");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUpLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setFormData({ ...formData, profilePicture: downloadUrl });
          setImageFileUpLoading(false);
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadUserError(null);
    setUploadUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUploadUserError("No change made");
      return;
    }
    if (imageFileUpLoading) {
      setUploadUserError("Please wait for image to upload");
    }
    try {
      dispatch(updateUserstart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateUserFailure(data.message));
        setUploadUserSuccess(data.message);
      } else {
        dispatch(updateUserSuccess(data));
        setUploadUserSuccess("User updated successfully!");
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setUploadUserSuccess(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
        navigate("/sign-in");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className=" max-w-lg mx-auto p-3 w-full">
      <h1 className=" text-3xl font-semibold text-center py-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="file" onChange={handleImageChange} accept="image/*" ref={filePickerRef} hidden />
        <div className=" relative w-32 h-32 shadow-md overflow-hidden rounded-full self-center cursor-pointer" onClick={() => filePickerRef.current.click()}>
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: { width: "100%", height: "100%", position: "absolute", top: 0, left: 0 },
                path: { stroke: `rgba(62, 152, 199), ${imageFileUploadProgress / 100}` },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`w-full h-full object-cover rounded-full border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && "opacity-60"}`}
          />
        </div>
        {imageFileUploadError && <Alert color={"failure"}>{imageFileUploadError}</Alert>}
        {error && <Alert color={"failure"}>{error}</Alert>}
        <TextInput type="text" placeholder="username" id="username" defaultValue={currentUser.username} onChange={handleChange} />
        <TextInput type="email" placeholder="email" id="email" defaultValue={currentUser.email} onChange={handleChange} />
        <TextInput type="password" placeholder="password" id="password" onChange={handleChange} />
        <Button gradientDuoTone={"purpleToBlue"} outline type="submit">
          Update
        </Button>
      </form>
      <div className=" text-red-500 mt-5 flex justify-between">
        <span className=" cursor-pointer hover:underline" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className=" cursor-pointer hover:underline">Sign out</span>
      </div>
      {uploadUserSuccess && (
        <Alert color={"success"} className="mt-5">
          {uploadUserSuccess}
        </Alert>
      )}
      {uploadUserError && (
        <Alert color={"failure"} className="mt-5">
          {uploadUserError}
        </Alert>
      )}
      {showModal && (
        <Modal show={showModal} onClose={() => setShowModal(false)} size={"md"} popup>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto w-14 h-14 text-gray-400 dark:text-gray-200 mb-4" />
              <h3 className="mb-5 text-gray-500 dark:text-gray-400">Are you sure you want to delete your account?</h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteUser}>
                  Yes, I'm sure
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
