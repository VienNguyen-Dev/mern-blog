import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null; // ScrollToTop trả về null vì nó không có giao diện người dùng cụ thể và không cần hiển thị bất kỳ nội dung nào. Thành phần này chỉ cần thực hiện hành động cuộn lên đầu trang khi cần thiết.
};

export default ScrollToTop;
