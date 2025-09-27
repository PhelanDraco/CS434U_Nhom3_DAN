const apiURL = "http://localhost:3000/api/ve";
let selectedId = null; 

async function loadVe() {
  try {
    const res = await fetch(apiURL);
    const data = await res.json();
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    data.forEach((ve) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${ve.maVe}</td>
        <td>${ve.giaVe}</td>
        <td>${ve.tenPhim}</td>
        <td>${ve.theLoai}</td>
        <td>${ve.ngay}</td>
      `;

      tr.onclick = () => {
        selectedId = ve.id; 
        document.getElementById("maVe").value = ve.maVe;
        document.getElementById("giaVe").value = ve.giaVe;
        document.getElementById("tenPhim").value = ve.tenPhim;
        document.getElementById("theLoai").value = ve.theLoai;
        document.getElementById("ngay").value = ve.ngay;
      };

      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Lỗi load vé:", err);
  }
}

async function themVe() {
  const maVe = document.getElementById("maVe").value.trim();
  const giaVe = document.getElementById("giaVe").value.trim();
  const tenPhim = document.getElementById("tenPhim").value.trim();
  const theLoai = document.getElementById("theLoai").value.trim();
  const ngay = document.getElementById("ngay").value;

  if (!maVe || !giaVe || !tenPhim || !theLoai || !ngay) {
    alert("Vui lòng nhập đủ thông tin!");
    return;
  }

  await fetch(apiURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ maVe, giaVe, tenPhim, theLoai, ngay }),
  });

  await loadVe();
  resetForm();
}

async function suaVe() {
  if (!selectedId) {
    alert("Hãy chọn một vé trong bảng để sửa!");
    return;
  }

  const maVe = document.getElementById("maVe").value.trim();
  const giaVe = document.getElementById("giaVe").value.trim();
  const tenPhim = document.getElementById("tenPhim").value.trim();
  const theLoai = document.getElementById("theLoai").value.trim();
  const ngay = document.getElementById("ngay").value;

  await fetch(`${apiURL}/${selectedId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ maVe, giaVe, tenPhim, theLoai, ngay }),
  });

  await loadVe();
  resetForm();
}

async function xoaTheoMa() {
  const maVe = document.getElementById("maVe").value.trim();
  if (!maVe) {
    alert("⚠️ Vui lòng nhập Mã vé để xóa!");
    return;
  }
  const res = await fetch(apiURL);
  const data = await res.json();
  const ve = data.find(v => v.maVe === maVe);
  if (!ve) {
    alert(`Không tìm thấy vé có Mã vé: ${maVe}`);
    return;
  }
  await fetch(`${apiURL}/${ve.id}`, { method: "DELETE" });
  alert(`Đã xóa vé có Mã vé: ${maVe}`);
  await loadVe();
  resetForm();
}

function dongForm() {
  document.querySelector(".overlay").classList.add("hidden");
}


window.onload = loadVe;
