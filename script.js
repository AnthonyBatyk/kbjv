document.addEventListener("DOMContentLoaded", () => {

  /* ================================================= */
  /*                  TABS                              */
  /* ================================================= */

  const tabs = document.querySelectorAll(".tab");
  const pages = document.querySelectorAll(".page");

  const TAB_STORAGE_KEY = "kbjv-active-tab";


  function activateTab(target) {

    tabs.forEach(tab => {
      tab.classList.toggle(
        "active",
        tab.dataset.tab === target
      );
    });


    pages.forEach(page => {
      page.classList.toggle(
        "active",
        page.id === target
      );
    });


    localStorage.setItem(
      TAB_STORAGE_KEY,
      target
    );

  }


  tabs.forEach(tab => {

    tab.addEventListener("click", () => {

      activateTab(tab.dataset.tab);

    });

  });


  const savedTab =
    localStorage.getItem(TAB_STORAGE_KEY);


  if (
    savedTab &&
    document.getElementById(savedTab)
  ) {

    activateTab(savedTab);

  } else {

    activateTab("blocks");

  }


  /* ================================================= */
  /*                  BLOCKS                            */
  /* ================================================= */

  const searchInput =
    document.getElementById("search");

  const clearSearch =
    document.getElementById("clear-search");


  function getFoodCards() {

    return document.querySelectorAll(
      ".food-card"
    );

  }


  /* ================= SEARCH ================= */

  searchInput.addEventListener(
    "input",
    () => {

      const query =
        searchInput.value
          .toLowerCase()
          .trim();


      getFoodCards().forEach(card => {

        const name =
          card
            .getAttribute("data-text")
            .toLowerCase()
            .trim();


        card.style.display =
          name.includes(query)
            ? ""
            : "none";

      });


      clearSearch.style.display =
        query
          ? "inline"
          : "none";

    }
  );


  /* ================= CLEAR SEARCH ================= */

  clearSearch.addEventListener(
    "click",
    () => {

      searchInput.value = "";


      getFoodCards().forEach(card => {

        card.style.display = "";

      });


      clearSearch.style.display =
        "none";


      searchInput.focus();

    }
  );


  /* ================================================= */
  /*              PRODUCT ACTION MODAL                 */
  /* ================================================= */

  const productModal =
    document.getElementById("product-modal");

  const productModalName =
    document.getElementById("product-modal-name");

  const productWeight =
    document.getElementById("product-weight");

  const productCancel =
    document.getElementById("product-cancel");

  const productCopy =
    document.getElementById("product-copy");

  const productCalculator =
    document.getElementById("product-calculator");


  let selectedProduct = null;


  /* ================================================= */
  /*              CALCULATE PRODUCT                    */
  /* ================================================= */

  function calculateProduct(card, weight) {

    const name =
      card.getAttribute("data-text");


    const kcal100 =
      parseFloat(
        card.getAttribute("data-kcal")
      );


    const protein100 =
      parseFloat(
        card.getAttribute("data-protein")
      );


    const fat100 =
      parseFloat(
        card.getAttribute("data-fat")
      );


    const carb100 =
      parseFloat(
        card.getAttribute("data-carb")
      );


    const kcal =
      (kcal100 * weight / 100)
        .toFixed(0);


    const protein =
      (protein100 * weight / 100)
        .toFixed(1);


    const fat =
      (fat100 * weight / 100)
        .toFixed(1);


    const carb =
      (carb100 * weight / 100)
        .toFixed(1);


    return {

      name,

      weight,

      kcal,

      protein,

      fat,

      carb,

      text:
        `${name}, для ${weight} грам - ` +
        `${kcal} ккал / ` +
        `${protein} білка / ` +
        `${fat} жирів / ` +
        `${carb} вуглеводів`

    };

  }


  /* ================================================= */
  /*              OPEN PRODUCT MODAL                   */
  /* ================================================= */

  document.addEventListener(
    "click",
    (e) => {

      const card =
        e.target.closest(".food-card");


      if (!card) {
        return;
      }


      selectedProduct = card;


      const name =
        card.getAttribute("data-text");


      productModalName.textContent =
        name;


      productWeight.value = "100";


      productModal.classList.add(
        "active"
      );


      setTimeout(() => {

        productWeight.focus();

        productWeight.select();

      }, 50);

    }
  );

  /* ================================================= */
  /*                  CANCEL                           */
  /* ================================================= */

  productCancel.addEventListener(
    "click",
    () => {

      selectedProduct = null;

      productModal.classList.remove(
        "active"
      );

      const originalText =
        productCancel.textContent;

      productCancel.textContent =
        "Скасовано ✕";

      productCancel.classList.remove(
        "success"
      );

      productCancel.classList.add(
        "error"
      );

      setTimeout(() => {

        productCancel.textContent =
          originalText;

        productCancel.classList.remove(
          "error"
        );

      }, 1200);

    }
  );


  /* ================================================= */
  /*              CLOSE BY BACKDROP                    */
  /* ================================================= */

  productModal.addEventListener(
    "click",
    (e) => {

      if (
        e.target === productModal
      ) {

        selectedProduct = null;

        productModal.classList.remove(
          "active"
        );

      }

    }
  );


  /* ================================================= */
  /*                  ESCAPE                            */
  /* ================================================= */

  document.addEventListener(
    "keydown",
    (e) => {

      if (
        e.key === "Escape" &&
        productModal.classList.contains(
          "active"
        )
      ) {

        selectedProduct = null;

        productModal.classList.remove(
          "active"
        );

      }

    }
  );


  /* ================================================= */
  /*              GET PRODUCT DATA                     */
  /* ================================================= */

  function getSelectedProductData() {

    if (!selectedProduct) {
      return null;
    }


    const weight =
      parseFloat(
        productWeight.value
      );


    if (
      isNaN(weight) ||
      weight <= 0
    ) {

      return null;

    }


    return calculateProduct(
      selectedProduct,
      weight
    );

  }


  /* ================================================= */
  /*              COPY PRODUCT                         */
  /* ================================================= */

  productCopy.addEventListener(
    "click",
    async () => {

      const data =
        getSelectedProductData();


      if (!data) {

        productWeight.focus();

        return;

      }


      try {

        await navigator.clipboard.writeText(
          data.text
        );


        const originalText =
          productCopy.textContent;


        productCopy.textContent =
          "Скопійовано ✓";


        productCopy.classList.add(
          "success"
        );


        setTimeout(() => {

          productCopy.textContent =
            originalText;

          productCopy.classList.remove(
            "success"
          );

        }, 1200);

      } catch (error) {

        console.error(
          "Copy error:",
          error
        );


        const originalText =
          productCopy.textContent;


        productCopy.textContent =
          "Помилка ✕";


        productCopy.classList.add(
          "error"
        );


        setTimeout(() => {

          productCopy.textContent =
            originalText;

          productCopy.classList.remove(
            "error"
          );

        }, 1200);

      }

    }
  );


  /* ================================================= */
  /*              SEND TO CALCULATOR                   */
  /* ================================================= */

  productCalculator.addEventListener(
    "click",
    () => {

      const data =
        getSelectedProductData();


      if (!data) {

        productWeight.focus();

        return;

      }


      /*
       * Беремо поточний текст
       * калькулятора.
       */

      const currentText =
        calcInput.value;


      /*
       * Якщо textarea порожня —
       * просто вставляємо продукт.
       */

      if (
        currentText.trim() === ""
      ) {

        calcInput.value =
          data.text;

      } else {

        /*
         * Прибираємо зайві порожні
         * рядки в кінці.
         */

        const cleanText =
          currentText.replace(
            /\s+$/,
            ""
          );


        calcInput.value =
          cleanText +
          "\n" +
          data.text;

      }


      /*
       * Зберігаємо textarea.
       */

      localStorage.setItem(
        CALC_INPUT_KEY,
        calcInput.value
      );


      /*
       * Зелений статус кнопки.
       */

      const originalText =
        productCalculator.textContent;


      productCalculator.textContent =
        "Додано ✓";


      productCalculator.classList.remove(
        "error"
      );


      productCalculator.classList.add(
        "success"
      );


      /*
       * Закриваємо модальне вікно.
       */

      selectedProduct = null;

      productModal.classList.remove(
        "active"
      );


      /*
       * Після короткої паузи
       * повертаємо кнопку назад.
       */

      setTimeout(() => {

        productCalculator.textContent =
          originalText;


        productCalculator.classList.remove(
          "success"
        );

      }, 1200);


      /*
       * НЕ переходимо на вкладку
       * калькулятора.
       *
       * Користувач залишається
       * на поточній вкладці.
       */

    }
  );


  /* ================================================= */
  /*          ENTER = SEND TO CALCULATOR               */
  /* ================================================= */

  productWeight.addEventListener(
    "keydown",
    (e) => {

      if (
        e.key === "Enter"
      ) {

        e.preventDefault();

        productCalculator.click();

      }

    }
  );


  /* ================================================= */
  /*                  CALCULATOR                        */
  /* ================================================= */

  let total = {

    kcal: 0,

    protein: 0,

    fat: 0,

    carb: 0

  };


  const calcLog = [];


  /* ================================================= */
  /*                  STORAGE                           */
  /* ================================================= */

  const CALC_TOTAL_KEY =
    "kbjv-total";

  const CALC_LOG_KEY =
    "kbjv-log";

  const CALC_INPUT_KEY =
    "kbjv-calculator-input";


  function saveCalculator() {

    localStorage.setItem(
      CALC_TOTAL_KEY,
      JSON.stringify(total)
    );


    localStorage.setItem(
      CALC_LOG_KEY,
      JSON.stringify(calcLog)
    );

  }


  function loadCalculator() {

    try {

      const savedTotal =
        localStorage.getItem(
          CALC_TOTAL_KEY
        );


      const savedLog =
        localStorage.getItem(
          CALC_LOG_KEY
        );


      if (savedTotal) {

        const parsed =
          JSON.parse(savedTotal);


        total.kcal =
          Number(parsed.kcal) || 0;


        total.protein =
          Number(parsed.protein) || 0;


        total.fat =
          Number(parsed.fat) || 0;


        total.carb =
          Number(parsed.carb) || 0;

      }


      if (savedLog) {

        const parsed =
          JSON.parse(savedLog);


        calcLog.length = 0;

        calcLog.push(
          ...parsed
        );

      }

    } catch (error) {

      console.error(
        "Calculator storage error:",
        error
      );

    }

  }


  /* ================================================= */
  /*                  CALCULATOR INPUT                 */
  /* ================================================= */

  const calcInput =
    document.getElementById(
      "calc-input"
    );


  const savedCalcInput =
    localStorage.getItem(
      CALC_INPUT_KEY
    );


  if (savedCalcInput !== null) {

    calcInput.value =
      savedCalcInput;

  }


  calcInput.addEventListener(
    "input",
    () => {

      localStorage.setItem(
        CALC_INPUT_KEY,
        calcInput.value
      );

    }
  );


  /* ================================================= */
  /*                  PARSER                           */
  /* ================================================= */

  function parseLine(line) {

    const kcal =
      line.match(
        /(\d+(?:\.\d+)?)\s*ккал/
      );


    const protein =
      line.match(
        /(\d+(?:\.\d+)?)\s*біл/
      );


    const fat =
      line.match(
        /(\d+(?:\.\d+)?)\s*жир/
      );


    const carb =
      line.match(
        /(\d+(?:\.\d+)?)\s*вугл/
      );


    return {

      kcal:
        kcal
          ? Number(kcal[1])
          : 0,


      protein:
        protein
          ? Number(protein[1])
          : 0,


      fat:
        fat
          ? Number(fat[1])
          : 0,


      carb:
        carb
          ? Number(carb[1])
          : 0

    };

  }


  /* ================================================= */
  /*                  RENDER CALCULATOR                */
  /* ================================================= */

  function renderCalculator() {

    document.getElementById(
      "kcal"
    ).textContent =
      total.kcal.toFixed(0);


    document.getElementById(
      "protein"
    ).textContent =
      total.protein.toFixed(1);


    document.getElementById(
      "fat"
    ).textContent =
      total.fat.toFixed(1);


    document.getElementById(
      "carb"
    ).textContent =
      total.carb.toFixed(1);


    document.getElementById(
      "calc-log"
    ).innerHTML =

      calcLog
        .map(
          (item, index) => `

            <div class="log-item">

              <span>
                ${escapeHTML(item.text)}
              </span>

              <button
                data-index="${index}"
                class="remove calc-remove"
              >
                Відняти
              </button>

            </div>

          `
        )
        .join("");

  }


  /* ================================================= */
  /*                  ADD                              */
  /* ================================================= */

  document
    .getElementById("calc-add")
    .addEventListener(
      "click",
      () => {

        const btn =
          document.getElementById(
            "calc-add"
          );


        const text =
          calcInput.value.trim();


        if (!text) {

          btn.textContent =
            "Немає даних ✕";


          btn.classList.add(
            "error"
          );


          setTimeout(() => {

            btn.textContent =
              "Додати";

            btn.classList.remove(
              "error"
            );

          }, 1200);


          return;

        }


        const lines =
          text
            .split("\n")
            .map(
              line => line.trim()
            )
            .filter(Boolean);


        for (const line of lines) {

          const p =
            parseLine(line);


          total.kcal +=
            p.kcal;


          total.protein +=
            p.protein;


          total.fat +=
            p.fat;


          total.carb +=
            p.carb;


          calcLog.push({

            text: line,

            kcal: p.kcal,

            protein: p.protein,

            fat: p.fat,

            carb: p.carb

          });

        }


        calcInput.value = "";


        localStorage.removeItem(
          CALC_INPUT_KEY
        );


        renderCalculator();

        saveCalculator();


        btn.textContent =
          "Додано ✓";


        btn.classList.add(
          "success"
        );


        setTimeout(() => {

          btn.textContent =
            "Додати";

          btn.classList.remove(
            "success"
          );

        }, 1200);

      }
    );


  /* ================================================= */
  /*                  REMOVE                           */
  /* ================================================= */

  document
    .getElementById("calc-log")
    .addEventListener(
      "click",
      (e) => {

        const btn =
          e.target.closest(
            ".calc-remove"
          );


        if (!btn) return;


        const index =
          Number(
            btn.dataset.index
          );


        const item =
          calcLog[index];


        if (!item) return;


        total.kcal -=
          item.kcal;


        total.protein -=
          item.protein;


        total.fat -=
          item.fat;


        total.carb -=
          item.carb;


        total.kcal =
          Math.max(
            0,
            total.kcal
          );


        total.protein =
          Math.max(
            0,
            total.protein
          );


        total.fat =
          Math.max(
            0,
            total.fat
          );


        total.carb =
          Math.max(
            0,
            total.carb
          );


        calcLog.splice(
          index,
          1
        );


        renderCalculator();

        saveCalculator();

      }
    );


  /* ================================================= */
  /*              CLEAR TEXT                           */
  /* ================================================= */

  document
    .getElementById("calc-clear-text")
    .addEventListener(
      "click",
      () => {

        const btn =
          document.getElementById(
            "calc-clear-text"
          );


        if (!calcInput.value.trim()) {

          btn.textContent =
            "Немає даних ✕";


          btn.classList.add(
            "error"
          );


          setTimeout(() => {

            btn.textContent =
              "Очистити текст";

            btn.classList.remove(
              "error"
            );

          }, 1200);


          return;

        }


        calcInput.value = "";


        localStorage.removeItem(
          CALC_INPUT_KEY
        );


        btn.textContent =
          "Очищено ✓";


        btn.classList.add(
          "success"
        );


        setTimeout(() => {

          btn.textContent =
            "Очистити текст";

          btn.classList.remove(
            "success"
          );

        }, 1200);

      }
    );


  /* ================================================= */
  /*              CLEAR BLOCKS                         */
  /* ================================================= */

  document
    .getElementById("calc-clear-blocks")
    .addEventListener(
      "click",
      () => {

        const btn =
          document.getElementById(
            "calc-clear-blocks"
          );


        if (calcLog.length === 0) {

          btn.textContent =
            "Немає даних ✕";


          btn.classList.add(
            "error"
          );


          setTimeout(() => {

            btn.textContent =
              "Очистити блоки";

            btn.classList.remove(
              "error"
            );

          }, 1200);


          return;

        }


        total = {

          kcal: 0,

          protein: 0,

          fat: 0,

          carb: 0

        };


        calcLog.length = 0;


        renderCalculator();

        saveCalculator();


        btn.textContent =
          "Очищено ✓";


        btn.classList.add(
          "success"
        );


        setTimeout(() => {

          btn.textContent =
            "Очистити блоки";

          btn.classList.remove(
            "success"
          );

        }, 1200);

      }
    );


  /* ================================================= */
  /*                  DAILY SUMMARY                   */
  /* ================================================= */

  function getDailySummary(date = null) {

    const d =
      date
        ? new Date(`${date}T12:00:00`)
        : new Date();


    const day =
      String(
        d.getDate()
      ).padStart(2, "0");


    const month =
      String(
        d.getMonth() + 1
      ).padStart(2, "0");


    const year =
      d.getFullYear();


    return (

      `Денний підсумок за ` +
      `${day}.${month}.${year} - ` +

      `${total.kcal.toFixed(0)} ккал / ` +

      `${total.protein.toFixed(1)} білка / ` +

      `${total.fat.toFixed(1)} жирів / ` +

      `${total.carb.toFixed(1)} вуглеводів`

    );

  }


  /* ================================================= */
  /*                  COPY SUMMARY                     */
  /* ================================================= */

  document
    .getElementById("copy-total")
    .addEventListener(
      "click",
      async () => {

        const btn =
          document.getElementById(
            "copy-total"
          );


        const text =
          getDailySummary();


        try {

          await navigator.clipboard.writeText(
            text
          );


          const original =
            btn.textContent;


          btn.textContent =
            "Скопійовано ✓";


          btn.classList.add(
            "success"
          );


          setTimeout(() => {

            btn.textContent =
              original;

            btn.classList.remove(
              "success"
            );

          }, 1200);

        } catch {

          btn.textContent =
            "Помилка";


          btn.classList.add(
            "error"
          );


          setTimeout(() => {

            btn.textContent =
              "Скопіювати підсумок";

            btn.classList.remove(
              "error"
            );

          }, 1200);

        }

      }
    );


  /* ================================================= */
  /*                  ARCHIVE                          */
  /* ================================================= */

  const ARCHIVE_KEY =
    "kbzv_archive";


  let archive = [];


  /* ================================================= */
  /*             ARCHIVE DATA MIGRATION                */
  /* ================================================= */

  function normalizeArchive() {

    const saved =
      localStorage.getItem(
        ARCHIVE_KEY
      );


    if (!saved) {

      archive = [];

      return;

    }


    try {

      const parsed =
        JSON.parse(saved);


      if (!Array.isArray(parsed)) {

        archive = [];

        return;

      }


      archive =
        parsed
          .map(item => {

            if (
              typeof item === "object" &&
              item !== null &&
              item.text
            ) {

              return {

                date:
                  item.date ||
                  extractDateFromSummary(
                    item.text
                  ),

                text:
                  item.text

              };

            }


            if (
              typeof item === "string"
            ) {

              return {

                date:
                  extractDateFromSummary(
                    item
                  ),

                text:
                  item

              };

            }


            return null;

          })
          .filter(Boolean);


      saveArchive();


    } catch (error) {

      console.error(
        "Archive storage error:",
        error
      );


      archive = [];

    }

  }


  /* ================================================= */
  /*             EXTRACT DATE FROM TEXT                */
  /* ================================================= */

  function extractDateFromSummary(text) {

    const match =
      text.match(
        /Денний підсумок за\s+(\d{2})\.(\d{2})\.(\d{4})/
      );


    if (!match) {

      return getTodayInputDate();

    }


    return (

      `${match[3]}-` +
      `${match[2]}-` +
      `${match[1]}`

    );

  }


  /* ================================================= */
  /*                  DATE HELPERS                     */
  /* ================================================= */

  function getTodayInputDate() {

    const d =
      new Date();


    const year =
      d.getFullYear();


    const month =
      String(
        d.getMonth() + 1
      ).padStart(2, "0");


    const day =
      String(
        d.getDate()
      ).padStart(2, "0");


    return (
      `${year}-${month}-${day}`
    );

  }


  function formatDate(date) {

    if (!date) {

      return "";

    }


    const parts =
      date.split("-");


    if (parts.length !== 3) {

      return date;

    }


    return (

      `${parts[2]}.` +
      `${parts[1]}.` +
      `${parts[0]}`

    );

  }


  function updateSummaryDate(
    text,
    newDate
  ) {

    const formattedDate =
      formatDate(newDate);


    return text.replace(
      /Денний підсумок за\s+\d{2}\.\d{2}\.\d{4}/,
      `Денний підсумок за ${formattedDate}`
    );

  }


  /* ================================================= */
  /*                  ARCHIVE STORAGE                  */
  /* ================================================= */

  function saveArchive() {

    localStorage.setItem(
      ARCHIVE_KEY,
      JSON.stringify(archive)
    );

  }


  /* ================================================= */
  /*          ARCHIVE BUTTON FEEDBACK                 */
  /* ================================================= */

  function showDateSuccess(button) {

    button.textContent =
      "Змінено дату ✓";


    button.classList.remove(
      "error"
    );


    button.classList.add(
      "success"
    );


    setTimeout(() => {

      if (!document.body.contains(button)) {
        return;
      }


      button.textContent =
        "Змінити дату";


      button.classList.remove(
        "success"
      );

    }, 1200);

  }


  function showDateError(button) {

    button.textContent =
      "Дату не змінено ✕";


    button.classList.remove(
      "success"
    );


    button.classList.add(
      "error"
    );


    setTimeout(() => {

      if (!document.body.contains(button)) {
        return;
      }


      button.textContent =
        "Змінити дату";


      button.classList.remove(
        "error"
      );

    }, 1200);

  }


  /* ================================================= */
  /*             FINISH DATE EDIT                     */
  /* ================================================= */

  function finishDateEdit(
    row,
    item,
    editBtn,
    dateInput,
    originalDate
  ) {

    if (
      !dateInput ||
      !document.body.contains(dateInput)
    ) {

      return;

    }


    const selectedDate =
      dateInput.value;


    const finalDate =
      selectedDate ||
      originalDate;


    const dateChanged =
      finalDate !== originalDate;


    if (dateChanged) {

      item.date =
        finalDate;


      item.text =
        updateSummaryDate(
          item.text,
          finalDate
        );


      saveArchive();

      showDateSuccess(
        editBtn
      );

    } else {

      showDateError(
        editBtn
      );

    }


    dateInput.remove();

  }


  /* ================================================= */
  /*                  RENDER ARCHIVE                   */
  /* ================================================= */

  function renderArchive() {

    const log =
      document.getElementById(
        "archive-log"
      );


    log.innerHTML = "";


    archive.forEach(
      (item, index) => {

        const row =
          document.createElement(
            "div"
          );


        row.className =
          "log-item archive-item";


        const content =
          document.createElement(
            "div"
          );


        content.className =
          "archive-content";


        const text =
          document.createElement(
            "span"
          );


        text.textContent =
          item.text;


        content.appendChild(
          text
        );


        const actions =
          document.createElement(
            "div"
          );


        actions.className =
          "archive-actions";


        /* ============================================= */
        /*             КНОПКА ЗМІНИ ДАТИ                */
        /* ============================================= */

        const editBtn =
          document.createElement(
            "button"
          );


        editBtn.textContent =
          "Змінити дату";


        editBtn.className =
          "edit-date";


        let dateInput = null;

        let originalDate = null;


        editBtn.addEventListener(
          "click",
          () => {

            if (
              dateInput &&
              document.body.contains(
                dateInput
              )
            ) {

              finishDateEdit(
                row,
                item,
                editBtn,
                dateInput,
                originalDate
              );


              dateInput = null;

              return;

            }


            originalDate =
              item.date ||
              extractDateFromSummary(
                item.text
              );


            dateInput =
              document.createElement(
                "input"
              );


            dateInput.type =
              "date";


            dateInput.className =
              "archive-date-input";


            dateInput.value =
              originalDate;


            actions.insertBefore(
              dateInput,
              editBtn
            );


            editBtn.textContent =
              "Підтвердити дату";


            dateInput.addEventListener(
              "change",
              () => {

                if (!dateInput.value) {
                  return;
                }


                const changed =
                  dateInput.value !==
                  originalDate;


                if (changed) {

                  item.date =
                    dateInput.value;


                  item.text =
                    updateSummaryDate(
                      item.text,
                      dateInput.value
                    );


                  saveArchive();


                  dateInput.remove();

                  dateInput = null;


                  editBtn.textContent =
                    "Дату змінено ✓";


                  editBtn.classList.remove(
                    "error"
                  );


                  editBtn.classList.add(
                    "success"
                  );


                  text.textContent =
                    item.text;


                  setTimeout(() => {

                    if (
                      !document.body.contains(
                        editBtn
                      )
                    ) {
                      return;
                    }


                    editBtn.textContent =
                      "Змінити дату";


                    editBtn.classList.remove(
                      "success"
                    );

                  }, 1200);

                }

              }
            );


            dateInput.addEventListener(
              "blur",
              () => {

                setTimeout(() => {

                  if (
                    !dateInput ||
                    !document.body.contains(
                      dateInput
                    )
                  ) {

                    return;

                  }


                  if (
                    dateInput.value &&
                    dateInput.value !==
                    originalDate
                  ) {

                    finishDateEdit(
                      row,
                      item,
                      editBtn,
                      dateInput,
                      originalDate
                    );

                    dateInput = null;

                    text.textContent =
                      item.text;

                  }

                }, 250);

              }
            );


            dateInput.focus();


            try {

              dateInput.showPicker();

            } catch {

            }

          }
        );


        /* ============================================= */
        /*             КНОПКА ВИДАЛЕННЯ                 */
        /* ============================================= */

        const removeBtn =
          document.createElement(
            "button"
          );


        removeBtn.textContent =
          "Видалити";


        removeBtn.className =
          "remove";


        removeBtn.addEventListener(
          "click",
          () => {

            const confirmed =
              confirm(
                "Ви точно хочете видалити цей денний підсумок?"
              );


            if (!confirmed) {

              return;

            }


            archive.splice(
              index,
              1
            );


            saveArchive();

            renderArchive();

          }
        );


        actions.appendChild(
          editBtn
        );


        actions.appendChild(
          removeBtn
        );


        row.appendChild(
          content
        );


        row.appendChild(
          actions
        );


        log.appendChild(
          row
        );

      }
    );

  }


  /* ================================================= */
  /*             SAVE CURRENT DAY TO ARCHIVE           */
  /* ================================================= */

  document
    .getElementById("save-archive")
    .addEventListener(
      "click",
      () => {

        const btn =
          document.getElementById(
            "save-archive"
          );


        if (

          total.kcal === 0 &&

          total.protein === 0 &&

          total.fat === 0 &&

          total.carb === 0

        ) {

          btn.textContent =
            "Немає даних ✕";


          btn.classList.add(
            "error"
          );


          setTimeout(() => {

            btn.textContent =
              "Зберегти в архів";


            btn.classList.remove(
              "error"
            );

          }, 1200);


          return;

        }


        const date =
          getTodayInputDate();


        const summary =
          getDailySummary(
            date
          );


        archive.unshift({

          date:
            date,

          text:
            summary

        });


        saveArchive();

        renderArchive();


        btn.textContent =
          "Збережено ✓";


        btn.classList.add(
          "success"
        );


        setTimeout(() => {

          btn.textContent =
            "Зберегти в архів";


          btn.classList.remove(
            "success"
          );

        }, 1200);

      }
    );


  /* ================================================= */
  /*                  ESCAPE HTML                      */
  /* ================================================= */

  function escapeHTML(text) {

    const div =
      document.createElement(
        "div"
      );


    div.textContent =
      text;


    return div.innerHTML;

  }


  /* ================================================= */
  /*                  INIT                             */
  /* ================================================= */

  normalizeArchive();

  loadCalculator();

  renderCalculator();

  renderArchive();

});
