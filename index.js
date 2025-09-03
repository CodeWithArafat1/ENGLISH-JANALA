const activeLessonBtn = (lessonBtn) => {
  document.querySelectorAll(".lesson-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  lessonBtn.classList.add("active");
};
const showSentence = (arr) => {
  return arr.map((ele) => {
    return `<span class="btn">${ele}</span>`;
  });
};

const openModal = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  const ele = data.data;

  const modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = "";

  const dialog = document.createElement("dialog");
  dialog.id = "my_modal";
  dialog.className = "modal modal-bottom sm:modal-middle";
  dialog.innerHTML = `<div class="modal-box">
      <h3 class="text-lg font-bold">${ele.word} ( ${ele.pronunciation} ) </h3>
      <div  class="py-4 space-y-2">
      <p class="text-xl font-bold">Meannign</p>
      <p>${ele.meaning || 'মিননিং  খুঁজে পাওয়া যাইনি '}</p>
      </div>
      <div  class="py-4 space-y-2">
      <p class="text-xl font-bold">Example</p>
      <p>${ele.sentence}</p>
      </div>
      <div  class="py-4 space-y-2">
      <p class="text-xl font-bold">সমার্থক শব্দ গুলো</p>
      <p>${showSentence(ele.synonyms)}</p>
      </div>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn">Close</button>
        </form>
      </div>
    </div>`;

  modalContainer.appendChild(dialog);
  my_modal.showModal();
  console.log(ele);
};

const fetchLavelData = async () => {
  const url = "https://openapi.programming-hero.com/api/levels/all";
  const res = await fetch(url);
  const data = await res.json();

  const btnContainer = document.getElementById("btn-lesson");
  data.data.forEach((level) => {
    const btn = document.createElement("button");
    btn.id = "lesson-id-${level.level_no}";
    btn.className =
      "outline lesson-btn cursor-pointer px-4 py-1 rounded flex gap-3 font-bold hover:bg-indigo-600 hover:text-white";
    btn.innerHTML = `<i class="ri-book-open-line"></i>Lesson - ${level.level_no}`;
    btnContainer.appendChild(btn);

    btn.addEventListener("click", () => {
      activeLessonBtn(btn);
      getIDShowData(level.level_no);
    });
  });
};
fetchLavelData();

const getIDShowData = async (id) => {
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  const showCards = document.getElementById("show-cards");
  showCards.innerHTML = "";

  if (data.data.length === 0) {
    const div = document.createElement("div");
    div.className =
      "col-span-4 text-center flex justify-center items-center flex-col gap-5 py-10";
    div.innerHTML = `
        <figure>
            <img src="./assets/alert-error.png" alt="">
        </figure>
          <p class="text-xl">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
          <h1 class="text-5xl font-bold">নেক্সট Lesson এ যান</h1>
        `;

    showCards.appendChild(div);
  }
  data.data.forEach((ele) => {
    const div = document.createElement("div");
    div.innerHTML = `
         <div
          class="bg-white shadow-md rounded-lg p-6 text-center space-y-3 "
        >
          <!-- Word -->
          <h2 class="text-xl font-bold">${ele.word}</h2>
          <p class="text-sm text-gray-600">Meaning / Pronounciation</p>
          <p class="text-2xl font-semibold text-gray-700">${ele.meaning || 'মিননিং  খুঁজে পাওয়া যাইনি '} / ${ele.pronunciation}</p>

          <!-- Icons -->
          <div class="flex justify-between items-center pt-4">
            <button
            id ='${ele.id}'
            onclick="openModal(${ele.id})"
              class="p-2 rounded-lg bg-blue-50 text-gray-700 hover:bg-blue-100 lesson-info"
            >
              <i class="ri-information-line text-xl"></i>
            </button>
            <button
              class="p-2 rounded-lg bg-blue-50 text-gray-700 hover:bg-blue-100"
            >
              <i class="ri-volume-up-line text-xl"></i>
            </button>
          </div>
        </div>
        `;
    showCards.appendChild(div);
  });
};
