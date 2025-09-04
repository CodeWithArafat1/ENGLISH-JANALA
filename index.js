const lessonBtnContainer = document.getElementById("lesson-btn--container");
const cardContainer = document.getElementById("card-container");
const modalContainer = document.getElementById("show-modal");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");

// Search System
searchBtn.addEventListener("click", async () => {
  showSpinner(true);
  try {
    const url = `https://openapi.programming-hero.com/api/words/all`;
    const res = await fetch(url);
    const data = await res.json();
    cardContainer.innerHTML = "";
    const input = searchInput.value.trim().toLowerCase();
    if (input === "") {
      return showAlert(
        "শব্দ খুঁজে পাওয়া যায়নি।",
        "দয়া করে কিছু লিখে সার্চ করুন। "
      );
    }
    const allWords = data.data.filter((word) =>
      word.word.toLowerCase().includes(input)
    );
    if (!allWords || allWords.length === 0) {
      showAlert(
        `${input} শব্দ খুঁজে পাওয়া যায়নি।`,
        "অনুগ্রহ করে অন্য শব্দ লিখে চেষ্টা করুন।"
      );
    } else {
      randerCards(allWords, true);
    }
  } catch (err) {
    cardContainer.innerHTML = "";
    showAlert("সার্চ করতে সমস্যা হয়েছে", "ইন্টারনেট কানেকশন চেক করুন।");
  } finally {
    showSpinner(false);
  }
});

// Speak Sentence
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

// Show Alert
const showAlert = (title, msg) => {
  const div = document.createElement("div");
  div.className =
    "flex flex-col justify-center items-center col-span-4 py-20 gap-4 text-center";
  div.innerHTML = `<div class="flex items-center flex-col justify-center gap-5">
            <figure>
              <img src="./assets/alert-error.png" alt="" />
            </figure>
            <p class="text-gray-500">
              ${title}
            </p>
            <h1 class="text-3xl font-bold">${msg}</h1>
          </div>`;

  cardContainer.appendChild(div);
};

// Array to Html element
const Showsynonyms = (arr) => {
  const htmlElement = arr.map((ele) => {
    return `<span class="btn mx-1" onclick="pronounceWord('${ele}')">${ele}</span>`;
  });
  return htmlElement.join(" ");
};

// Show loading spinner
const showSpinner = (status) => {
  const spinner = document.getElementById("spinner");
  if (status) {
    spinner.classList.remove("hidden");
    spinner.classList.add("flex");
    cardContainer.classList.add("hidden");
  } else {
    spinner.classList.remove("flex");
    spinner.classList.add("hidden");
    cardContainer.classList.remove("hidden");
    cardContainer.classList.add("flex");
  }
};

// Show Modal window
const showModal = async (id) => {
  try {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    const ele = data.data;
    modalContainer.innerHTML = "";
    const dialog = document.createElement("dialog");
    dialog.className = "modal modal-bottom sm:modal-middle";
    dialog.id = "my_modal";

    dialog.innerHTML = ` <div class="modal-box">
        <h3 class="text-2xl font-semibold" >${ele.word}</h3>
       
        <div class="py-3 space-y-2">
         <h1 class="font-bold text-xl">Meaning</h1>
         <p>${ele.meaning || "অর্থ খুঁজে পাওয়া যায়নি।"}</p>
        </div>
        <div class="py-3 space-y-2">
         <h1 class="font-bold text-xl">Example</h1>
         <p>${ele.sentence}</p>
        </div>
        <div class="py-3 space-y-2">
         <h1 class="font-bold text-xl">সমার্থক শব্দ গুলো</h1>
         <p>${
           Showsynonyms(ele.synonyms) || "সমার্থক শব্দ খুঁজে পাওয়া যায়নি। "
         }</p>
        </div>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn">Close</button>
          </form>
        </div>
      </div>`;

    modalContainer.appendChild(dialog);
    document.getElementById("my_modal").showModal();
  } catch (err) {
    showAlert("ডাটা লোড সফল হয়নি। ", "ইন্টারনেট কানেকশন চেক করুন।");
  }
};

// Active lesson Button
const activeLessonBun = (lessonBtn) => {
  const btns = document.querySelectorAll(".lesson-btn");
  if (lessonBtn) {
    btns.forEach((btn) => {
      btn.classList.remove("active");
    });
  }
  lessonBtn.classList.add("active");
};

// Load leasson Buttons
const loadLessonBtn = async () => {
  showSpinner(true);
  const url = "https://openapi.programming-hero.com/api/levels/all";
  const res = await fetch(url);
  const data = await res.json();
  data.data.forEach((btn) => {
    const button = document.createElement("button");
    button.className = " hover:bg-indigo-600 hover:text-white btn lesson-btn";
    button.innerHTML = `<i class="ri-book-open-line"></i> Lesson - ${btn.level_no}`;
    lessonBtnContainer.appendChild(button);

    button.addEventListener("click", (e) => {
      displayCard(btn.level_no);
      activeLessonBun(button);
    });
  });
  showSpinner(false);
};

// Display card
const displayCard = async (id) => {
  showSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  const res = await fetch(url);
  const data = await res.json();

  randerCards(data.data);
  showSpinner(false);
};

// Rander Cards
const randerCards = (words, formSearch = false) => {
  cardContainer.innerHTML = "";
  if (!words || words.length === 0) {
    if (!formSearch) {
      showAlert(
        "এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।",
        "নেক্সট Lesson এ যান"
      );
    }
  }

  words.forEach((ele) => {
    const div = document.createElement("div");
    div.className =
      "bg-white shadow-md py-2 flex flex-col justify-between rounded-md";
    div.innerHTML = `
          <div class="space-y-4">
            <h1 class="text-2xl font-bold">${ele.word}</h1>
            <p class="text-lg">Meaning / Pronounciation</p>
            <p class="text-lg font-bold">${
              ele.meaning || "অর্থ খুঁজে পাওয়া যায়নি। "
            } / ${ele.pronunciation || "অর্থ খুঁজে পাওয়া যায়নি। "}</p>
          </div>

          <div class="flex justify-between px-4 py-2 mt-5">
            <button class="btn" onclick="showModal(${ele.id})">
              <i class="text-xl ri-information-line"></i>
            </button>
            <button class="btn" onclick="pronounceWord('${ele.word}')">
              <i class="text-xl ri-volume-up-line"></i>
            </button>
          </div>
        `;
    cardContainer.appendChild(div);
  });
};

loadLessonBtn();
