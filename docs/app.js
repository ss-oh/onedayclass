const form = document.getElementById("apply-form");
const menuBtn = document.getElementById("menu-btn");
const navMenu = document.getElementById("nav-menu");

// 모바일 햄버거 메뉴 토글
menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const name = formData.get("name").trim();
  const phone = formData.get("phone").trim();
  const lesson = formData.get("lesson");

  if (!name || !phone || !lesson) {
    alert("모든 항목을 입력해 주세요.");
    return;
  }

  try {
    await fetch("https://onedayclass-sms-server.onrender.com/send-sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "hmac-sha256 NCSXTXVEMJC7BTKC:FDC1BAWYZD9A4KCB2EYHU6GWJEEPMW15",
      },
      body: JSON.stringify({ name, phone, lesson }),
    });

    alert("신청이 완료되었습니다.");
    form.reset();
  } catch (error) {
    alert("서버 연결 실패: " + error.message);
  }
});
