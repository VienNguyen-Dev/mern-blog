import { Button } from "flowbite-react";
import React from "react";
import { AiFillGithub, AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { signinFailure, signinStart, signinSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const auth = getAuth(app);
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    // const provider = new GoogleAuthProvider();/Dòng này tạo một đối tượng GoogleAuthProvider mới từ Firebase Authentication SDK
    provider.setCustomParameters({ prompt: "select_account" }); //rong trường hợp này, tham số tùy chỉnh được đặt là {prompt: "select_account"}, có nghĩa là khi người dùng thực hiện đăng nhập bằng Google, họ sẽ luôn được yêu cầu chọn tài khoản Google để sử dụng, thậm chí nếu họ đã đăng nhập vào trình duyệt với một tài khoản khác. Điều này đảm bảo rằng người dùng có thể chọn tài khoản đúng để sử dụng khi đăng nhập vào ứng dụng của bạn

    try {
      dispatch(signinStart());
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(signinFailure(data.message));
        return;
      }
      if (res.ok) {
        dispatch(signinSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signinFailure(error.message));
    }
  };

  return (
    <>
      <Button type="button" gradientDuoTone={"pinkToOrange"} outline onClick={handleGoogleClick}>
        <AiFillGoogleCircle className="w-6 h-6 mr-2" />
        Continue with Google
      </Button>
    </>
  );
}
