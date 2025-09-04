const showCards = document.getElementById("show-cards");

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN";
  window.speechSynthesis.speak(utterance);
}

document
  .getElementById("btn-search")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    const input = document
      .getElementById("search-input")
      .value.trim()
      .toLowerCase();
    const url = "https://openapi.programming-hero.com/api/words/all";
    const res = await fetch(url);
    const data = await res.json();
    const allWords = data.data;

    const filterWords = allWords.filter((word) =>
      word.word.toLowerCase().includes(input)
    );
    displayData(
      filterWords,
      "কোন Vocabulary খুঁজে পাওয়া যায়নি।",
      "দয়া করে অন্য কিছু সার্চ করুন"
    );
  });

const displayData = (data, fmsg, smgs) => {
  showCards.innerHTML = "";

  if (data.length === 0) {
    const div = document.createElement("div");
    div.className =
      "col-span-4 text-center flex justify-center items-center flex-col gap-5 py-10";
    div.innerHTML = `
        <figure>
            <img src="./assets/alert-error.png" alt="">
        </figure>
          <p class="text-xl">${fmsg}</p>
          <h1 class="text-5xl font-bold">${smgs}</h1>
        `;

    showCards.appendChild(div);
  }
  data.forEach((ele) => {
    const div = document.createElement("div");

    div.innerHTML = `
         <div
          class="bg-white shadow-md rounded-lg p-6 text-center space-y-3 "
        >
          <!-- Word -->
          <h2 class="text-xl font-bold">${ele.word}</h2>
          <p class="text-sm text-gray-600">Meaning / Pronounciation</p>
          <p class="text-2xl font-semibold text-gray-700">${
            ele.meaning || "মিননিং  খুঁজে পাওয়া যাইনি "
          } / ${ele.pronunciation}</p>

          <!-- Icons -->
          <div class="flex justify-between items-center pt-4">
            <button
            id ='${ele.id}'
            onclick="openModal(${ele.id})"
              class="p-2 rounded-lg bg-blue-50 text-gray-700 hover:bg-blue-100 lesson-info"
            >
              <i class="ri-information-line text-xl"></i>
            </button>
            <button onclick="pronounceWord('${ele.word}')"
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

const activeLessonBtn = (lessonBtn) => {
  document.querySelectorAll(".lesson-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  lessonBtn.classList.add("active");
};
const showSentence = (arr) => {
  const htmlElement = arr.map((ele) => {
    return `<span class="btn">${ele}</span>`;
  });
  return htmlElement.join(" ");
};

const showLoading = (status) => {
  const loading = document.getElementById("loading");
  if (status) {
    loading.classList.remove("hidden");
    loading.classList.add("flex");
    document.getElementById("show-cards").classList.add("hidden");
  } else {
    loading.classList.remove("flex");
    loading.classList.add("hidden");
    document.getElementById("show-cards").classList.remove("hidden");
  }
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
      <p>${ele.meaning || "মিননিং  খুঁজে পাওয়া যাইনি "}</p>
      </div>
      <div  class="py-4 space-y-2">
      <p class="text-xl font-bold">Example</p>
      <p>${ele.sentence}</p>
      </div>
      <div  class="py-4 space-y-2">
      <p class="text-xl font-bold">সমার্থক শব্দ গুলো</p>
      <p>${showSentence(ele.synonyms) || "সমর্থক শব্দ খুঁজে পাওয়া যায়নি"}</p>
      </div>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn">Close</button>
        </form>
      </div>
    </div>`;

  modalContainer.appendChild(dialog);
  my_modal.showModal();
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
  showLoading(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  const res = await fetch(url);
  const data = await res.json();

  const elements = data.data;
  displayData(
    elements,
    "এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।",
    "নেক্সট Lesson এ যান"
  );
  showLoading(false);
};
