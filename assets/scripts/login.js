import { BaseDB } from './db.js';
document.addEventListener("DOMContentLoaded", () => {
    // Check if JWT session is active
    const token = localStorage.getItem("jwtToken");

    if (token && decodeJwt(token).exp > Math.floor(Date.now() / 1000)) {
        renderProfileDashboard(token);
        return;
    }

    let generatedOTP = null;

    const emailInput = document.getElementById("emailInput");
    const sendPinBtn = document.getElementById("sendPinBtn");
    const otpForm = document.getElementById("otpForm");
    const otpInputs = Array.from(document.querySelectorAll("#otpInputs .otp-input"));

    // 1. Disable OTP inputs initially
    otpInputs.forEach((input) => {
        input.disabled = true;
    });

    // Helper: Find the first empty OTP field index
    function getFirstEmptyIndex() {
        return otpInputs.findIndex((input) => input.value === "");
    }

    // 2. OTP Input Focus and Typing Logic
    otpInputs.forEach((input, index) => {
        input.addEventListener("focus", () => {
            if (!generatedOTP) return;

            const firstEmptyIndex = getFirstEmptyIndex();
            // If user clicks ahead of an empty slot, redirect focus to the first empty slot
            if (firstEmptyIndex !== -1 && firstEmptyIndex < index) {
                otpInputs[firstEmptyIndex].focus();
            }
        });

        input.addEventListener("input", (e) => {
            const firstEmptyIndex = getFirstEmptyIndex();

            // Ensure focus shifts to the next empty input or next sequential field
            if (e.target.value.length === 1) {
                if (firstEmptyIndex !== -1) {
                    otpInputs[firstEmptyIndex].focus();
                } else if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !e.target.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });

    // 3. Email Validation & OTP Generation
    sendPinBtn.addEventListener("click", () => {
        const userEmail = emailInput.value.trim().toLowerCase();

        if (!userEmail.endsWith("ichat.sp.edu.sg")) {
            alert("Invalid email domain. Must end with 'ichat.sp.edu.sg'.");
            return;
        }

        // Enable OTP inputs once generated
        generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

        otpInputs.forEach((input) => {
            input.disabled = false;
            input.value = ""; // Clear existing values if re-sending
        });

        // Auto-focus the first slot
        otpInputs[0].focus();

        spawnFallingOTPCard(generatedOTP);
    });

    // 4. Validate OTP & Grant JWT Session
    otpForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!generatedOTP) {
            alert("Please request an OTP first.");
            return;
        }

        const enteredOTP = otpInputs.map((input) => input.value).join("");

        if (enteredOTP === generatedOTP) {
            const userEmail = emailInput.value.trim().toLowerCase();
            const userRole = userEmail === "admin@ichat.sp.edu.sg" ? "admin" : "user";
            const jwtToken = generateMockJWT(userEmail, userRole);

            localStorage.setItem("jwtToken", jwtToken);

            renderProfileDashboard(jwtToken);
        } else {
            alert("Invalid OTP code. Please try again.");
        }
    });

    // Helper: Generates a Base64-encoded mock JWT
    function generateMockJWT(email, role) {
        const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
        const payload = btoa(
            JSON.stringify({
                sub: email,
                role: role,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 3600
            })
        );
        const signature = btoa("mock_secret_signature");

        return `${header}.${payload}.${signature}`;
    }

    function decodeJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    }

    // 5. Clear <main> and Render Profile Dashboard UI
    async function renderProfileDashboard(token) {
        const decodedToken = decodeJwt(token);
        const email = decodedToken.sub;
        const role = decodedToken.role;
        const mainContainer = document.querySelector("main");
        if (!mainContainer) return;

        mainContainer.innerHTML = `
      <div class="container my-4" style="max-width: 900px;">
        <div class="card shadow-lg border-0 overflow-hidden mb-4">
          <div class="bg-primary-custom py-2"></div>
          <div class="card-body p-4 text-center">
            <span class="badge ${role === "admin" ? "bg-danger" : "bg-primary"} text-uppercase px-3 py-2 mb-2">
              ${role} Account
            </span>
            <h2 class="fw-bold mb-1">User Profile</h2>
            <p class="text-muted small">${email}</p>
            <button id="logoutBtn" class="btn btn-outline-secondary btn-sm rounded-pill px-4">Log Out</button>
          </div>
        </div>

        ${role === "admin"
                ? `
          <div class="card shadow border-0 p-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="fw-bold mb-0"><i class="bi bi-database"></i> Announcement IndexedDB Manager</h4>
              <button id="addNewBtn" class="btn btn-success btn-sm"><i class="bi bi-plus-lg"></i> Add New Record</button>
            </div>
            
            <!-- Table Container -->
            <div class="table-responsive">
              <table class="table table-hover align-middle small">
                <thead class="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Organizer</th>
                    <th>Date/Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="dbTableBody">
                  <tr><td colspan="5" class="text-center">Loading IndexedDB records...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        `
                : ""
            }
      </div>
    `;

        document.getElementById("logoutBtn").addEventListener("click", () => {
            localStorage.clear();
            window.location.reload();
        });
        if (role === "admin") {
            const db = new BaseDB("Announcement", 1, "announcements");
            await db.connect();
            await loadAndRenderDBRecords(db);

            document.getElementById("addNewBtn").addEventListener("click", () => {
                showEditModal(db, null);
            });
        }
    }

    // Render Table Rows from IndexedDB
    async function loadAndRenderDBRecords(db) {
        const tableBody = document.getElementById("dbTableBody");
        const records = await db.getAll();

        if (records.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No announcements found.</td></tr>`;
            return;
        }

        tableBody.innerHTML = records
            .map(
                (item) => `
      <tr>
        <td><strong>${item.id}</strong></td>
        <td>${item.title}</td>
        <td>${item.organizer || "-"}</td>
        <td>${item.time ? new Date(item.time).toLocaleString() : "-"}</td>
        <td>
          <button class="btn btn-sm btn-primary edit-btn" data-id="${item.id}">Edit</button>
          <button class="btn btn-sm btn-danger delete-btn" data-id="${item.id}">Delete</button>
        </td>
      </tr>
    `
            )
            .join("");

        // Bind Edit Action
        tableBody.querySelectorAll(".edit-btn").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const id = Number(btn.getAttribute("data-id"));
                const record = await db.getById(id);
                showEditModal(db, record);
            });
        });

        // Bind Delete Action
        tableBody.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const id = Number(btn.getAttribute("data-id"));
                if (confirm(`Are you sure you want to delete announcement #${id}?`)) {
                    await db.delete(id);
                    await loadAndRenderDBRecords(db);
                }
            });
        });
    }

    // Display Inline Edit Form Dialog with Image Validation
    function showEditModal(db, item = null) {
        const isEdit = !!item;
        const itemData = item || {
            title: "",
            organizer: "",
            description: "",
            location: "",
            time: new Date().toISOString().slice(0, 16),
            redirectURI: "",
            desktopImage: "",
            mobileImage: ""
        };

        const modalHtml = `
      <div class="modal fade show d-block" id="adminModal" tabindex="-1" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title fw-bold">${isEdit ? "Edit Announcement" : "Add Announcement"}</h5>
              <button type="button" class="btn-close" id="closeModalBtn"></button>
            </div>
            <div class="modal-body">
              <form id="editForm">
                <div class="mb-2">
                  <label class="form-label small fw-semibold">Title</label>
                  <input type="text" class="form-control" id="m_title" value="${itemData.title}" required />
                </div>

                <div class="row g-2 mb-2">
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Organizer</label>
                    <input type="text" class="form-control" id="m_organizer" value="${itemData.organizer || ""}" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Event Time</label>
                    <input type="datetime-local" class="form-control" id="m_time" value="${itemData.time ? new Date(itemData.time).toISOString().slice(0, 16) : ""}" />
                  </div>
                </div>

                <div class="mb-2">
                  <label class="form-label small fw-semibold">Location</label>
                  <input type="text" class="form-control" id="m_location" value="${itemData.location || ""}" />
                </div>

                <!-- Desktop & Mobile Image Uploads -->
                <div class="row g-2 mb-2">
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Desktop Image (< 800KB, 1920x1080)</label>
                    <input type="file" class="form-control" id="m_desktopImage" accept="image/*" />
                    ${itemData.desktopImage ? `<div class="form-text text-truncate">Current: <code>${itemData.desktopImage.slice(0, 30)}...</code></div>` : ""}
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Mobile Image (< 800KB, 1080x1380)</label>
                    <input type="file" class="form-control" id="m_mobileImage" accept="image/*" />
                    ${itemData.mobileImage ? `<div class="form-text text-truncate">Current: <code>${itemData.mobileImage.slice(0, 30)}...</code></div>` : ""}
                  </div>
                </div>

                <div class="mb-2">
                  <label class="form-label small fw-semibold">Description</label>
                  <textarea class="form-control" id="m_description" rows="3">${itemData.description || ""}</textarea>
                </div>

                <div class="mb-2">
                  <label class="form-label small fw-semibold">Redirect Link</label>
                  <input type="url" class="form-control" id="m_redirectURI" value="${itemData.redirectURI || ""}" />
                </div>

                <div class="text-end mt-3">
                  <button type="button" class="btn btn-secondary" id="cancelModalBtn">Cancel</button>
                  <button type="submit" class="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

        document.body.insertAdjacentHTML("beforeend", modalHtml);

        const modalEl = document.getElementById("adminModal");
        const closeModal = () => modalEl.remove();

        document.getElementById("closeModalBtn").onclick = closeModal;
        document.getElementById("cancelModalBtn").onclick = closeModal;

        // Helper: Validates File Size & Aspect Ratio, then Returns Base64 Data URL
        const validateAndProcessImage = (file, targetWidth, targetHeight, label) => {
            return new Promise((resolve, reject) => {
                if (!file) return resolve(null);

                // 1. File Size Restriction (< 800 KB)
                const MAX_SIZE_BYTES = 800 * 1024;
                if (file.size >= MAX_SIZE_BYTES) {
                    return reject(`${label} exceeds the 800 KB limit. Current size: ${(file.size / 1024).toFixed(1)} KB.`);
                }

                // 2. Aspect Ratio / Dimension Validation
                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = (e) => {
                    const img = new Image();
                    img.src = e.target.result;

                    img.onload = () => {
                        const expectedRatio = targetWidth / targetHeight;
                        const actualRatio = img.width / img.height;

                        // Allow a tiny tolerance margin (0.01) for floating point calculations
                        if (Math.abs(actualRatio - expectedRatio) > 0.01) {
                            return reject(
                                `${label} aspect ratio must be ${targetWidth}:${targetHeight} (or ${targetWidth}x${targetHeight}). Uploaded image size: ${img.width}x${img.height}.`
                            );
                        }

                        resolve(e.target.result); // Returns Base64 string
                    };

                    img.onerror = () => reject(`Failed to load ${label} image file.`);
                };

                reader.onerror = () => reject(`Error reading ${label} file.`);
            });
        };

        document.getElementById("editForm").onsubmit = async (e) => {
            e.preventDefault();

            const desktopFileInput = document.getElementById("m_desktopImage").files[0];
            const mobileFileInput = document.getElementById("m_mobileImage").files[0];

            try {
                // Validate desktop image (1920x1080) and mobile image (1080x1380)
                const newDesktopImage = await validateAndProcessImage(desktopFileInput, 1920, 1080, "Desktop Image");
                const newMobileImage = await validateAndProcessImage(mobileFileInput, 1080, 1380, "Mobile Image");

                const updatedItem = {
                    ...itemData,
                    title: document.getElementById("m_title").value,
                    organizer: document.getElementById("m_organizer").value,
                    time: new Date(document.getElementById("m_time").value).toISOString(),
                    location: document.getElementById("m_location").value,
                    description: document.getElementById("m_description").value,
                    redirectURI: document.getElementById("m_redirectURI").value,
                    desktopImage: newDesktopImage || itemData.desktopImage,
                    mobileImage: newMobileImage || itemData.mobileImage
                };

                await db.save(updatedItem);
                closeModal();
                await loadAndRenderDBRecords(db);
            } catch (error) {
                alert(error); // Displays error if file size or ratio validation fails
            }
        };
    }
    // 6. Falling Leaf Card Animation
    function spawnFallingOTPCard(otpCode) {
        const card = document.createElement("div");
        card.innerText = `Your OTP: ${otpCode}`;

        Object.assign(card.style, {
            position: "fixed",
            top: "-60px",
            left: `${25 + Math.floor(Math.random() * 51)}%`,
            transform: "translateX(-50%)",
            padding: "12px 24px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: "18px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            zIndex: "9999",
            pointerEvents: "none",
            transition: "opacity 0.2s ease"
        });

        document.body.appendChild(card);

        let topPos = -60;
        let angle = 0;
        const targetHeight = window.innerHeight * 0.6;

        function animateLeafFall() {
            topPos += 2;
            angle += 0.02;

            const horizontalSway = Math.sin(angle) * 60;
            const rotation = Math.sin(angle) * 15;

            card.style.top = `${topPos}px`;
            card.style.transform = `translateX(calc(-50% + ${horizontalSway}px)) rotate(${rotation}deg)`;

            if (topPos < targetHeight) {
                requestAnimationFrame(animateLeafFall);
            } else {
                card.style.opacity = "0";
                setTimeout(() => card.remove(), 500);
            }
        }

        requestAnimationFrame(animateLeafFall);
    }
});