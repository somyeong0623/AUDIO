//로그인 로그아웃 관련 함수 있음.

// const socket = io.connect("/");

// socket.on("BUY_GOODS", function (data) {
//   const { nickname, goodsId, goodsName, date } = data;
//   makeBuyNotification(nickname, goodsName, goodsId, date);
// });

function initAuthenticatePage() {
  // socket.emit("CHANGED_PAGE", `${location.pathname}${location.search}`);
}

function bindSamePageViewerCountEvent(callback) {
  // socket.on("SAME_PAGE_VIEWER_COUNT", callback);
}

function getSelf(callback) {
  $.ajax({
    type: "GET",
    url: `/api/users/me`,
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    success: function (response) {
      console.log("getSelf 함수 성공!");
      callback(response.user);
    },
    error: function (xhr, status, error) {
      if (status == 401) {
        alert("로그인이 필요합니다.");
      } else {
        console.log(error);
        localStorage.clear();
        alert("알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.");
      }
      window.location.href = "/html/";
    },
  });
}

function signOut() {
  localStorage.clear();
  window.location.href = "/html/";
}
