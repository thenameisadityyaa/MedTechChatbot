document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("medicineForm");
  const tableBody = document.getElementById("medicineTableBody");
  const totalEl = document.getElementById("totalMedicines");
  const lowStockEl = document.getElementById("lowStockCount");
  const expiringEl = document.getElementById("expiringSoonCount");
  const searchInput = document.getElementById("searchInput");
  const formTitle = document.getElementById("formTitle");
  const editIndex = document.getElementById("editIndex");

  function loadInventory() {
    const inventory = JSON.parse(localStorage.getItem("medInventory")) || [];
    tableBody.innerHTML = "";
    let lowStock = 0, expiringSoon = 0;

    inventory.forEach((med, index) => {
      const expiryDate = med.expiry ? new Date(med.expiry) : null;
      const today = new Date();
      const isExpiring = expiryDate && (expiryDate - today <= 7 * 24 * 60 * 60 * 1000);
      const isLow = parseInt(med.quantity) <= 5;

      if (isExpiring) expiringSoon++;
      if (isLow) lowStock++;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${med.name}<br/><small>Added: ${med.date}</small></td>
        <td>${med.quantity} <br> <span class="${isLow ? 'status-critical' : 'status-adequate'}">${isLow ? 'Critical' : 'Adequate'}</span></td>
        <td>${med.expiry || 'N/A'}${isExpiring ? `<br><small class="status-critical">Expires in ${Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))} days</small>` : ''}</td>
        <td>${isLow ? 'Critical' : 'Adequate'}</td>
        <td class="actions">
          <button onclick="editMedicine(${index})" title="Edit">✏️</button>
          <button onclick="deleteMedicine(${index})" title="Delete">🗑️</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    totalEl.textContent = inventory.length;
    lowStockEl.textContent = lowStock;
    expiringEl.textContent = expiringSoon;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("medicineName").value.trim();
    const quantity = document.getElementById("quantity").value.trim();
    const expiry = document.getElementById("expiry").value.trim();
    const index = editIndex.value;
    const date = new Date().toLocaleDateString();

    if (!name || !quantity) return alert("Please fill all required fields.");
    const inventory = JSON.parse(localStorage.getItem("medInventory")) || [];

    if (index === "") {
      // Add
      inventory.push({ name, quantity, expiry, date });
    } else {
      // Edit
      inventory[index] = { name, quantity, expiry, date };
    }

    localStorage.setItem("medInventory", JSON.stringify(inventory));
    form.reset();
    editIndex.value = "";
    formTitle.textContent = "Add New Medicine";
    loadInventory();
  });

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    const rows = tableBody.querySelectorAll("tr");
    rows.forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(term) ? "" : "none";
    });
  });

  window.editMedicine = function(index) {
    const inventory = JSON.parse(localStorage.getItem("medInventory")) || [];
    const med = inventory[index];

    document.getElementById("medicineName").value = med.name;
    document.getElementById("quantity").value = med.quantity;
    document.getElementById("expiry").value = med.expiry || "";
    editIndex.value = index;
    formTitle.textContent = "Edit Medicine";
  };

  window.deleteMedicine = function(index) {
    const inventory = JSON.parse(localStorage.getItem("medInventory")) || [];
    inventory.splice(index, 1);
    localStorage.setItem("medInventory", JSON.stringify(inventory));
    loadInventory();
  };

  loadInventory();
});
