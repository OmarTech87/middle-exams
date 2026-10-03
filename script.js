// ===============================
// DARK MODE
// ===============================

const themeButton = document.getElementById("theme-toggle");


// Load saved theme
const savedTheme = localStorage.getItem("theme");


if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeButton.textContent = "☀️";

}


// Change theme when button is clicked
themeButton.addEventListener("click", function () {

    document.body.classList.toggle("dark");


    if (document.body.classList.contains("dark")) {

        themeButton.textContent = "☀️";

        localStorage.setItem("theme", "dark");

    } else {

        themeButton.textContent = "🌙";

        localStorage.setItem("theme", "light");

    }

});



// ===============================
// SUBJECT CHECKLIST
// ===============================

const checkboxes =
    document.querySelectorAll(".subject-checkbox");

const subjectCards =
    document.querySelectorAll(".subject-card");

const progressText =
    document.getElementById("progress-text");

const progressPercentage =
    document.getElementById("progress-percentage");

const progressFill =
    document.getElementById("progress-fill");



// Get previously finished subjects
let finishedSubjects =
    JSON.parse(localStorage.getItem("finishedSubjects")) || [];



// ===============================
// LOAD CHECKBOXES
// ===============================

checkboxes.forEach(function (checkbox) {

    const subjectName =
        checkbox.dataset.subject;


    if (finishedSubjects.includes(subjectName)) {

        checkbox.checked = true;

        checkbox
            .closest(".subject-card")
            .classList.add("completed");

    }

});



// ===============================
// CHECKBOX CHANGE
// ===============================

checkboxes.forEach(function (checkbox) {

    checkbox.addEventListener("change", function () {

        const subjectName =
            checkbox.dataset.subject;

        const card =
            checkbox.closest(".subject-card");


        // Subject finished
        if (checkbox.checked) {

            if (!finishedSubjects.includes(subjectName)) {

                finishedSubjects.push(subjectName);

            }

            card.classList.add("completed");

        }


        // Subject not finished
        else {

            finishedSubjects =
                finishedSubjects.filter(function (subject) {

                    return subject !== subjectName;

                });


            card.classList.remove("completed");

        }


        // Save finished subjects
        localStorage.setItem(
            "finishedSubjects",
            JSON.stringify(finishedSubjects)
        );


        updateProgress();

    });

});



// ===============================
// UPDATE PROGRESS
// ===============================

function updateProgress() {

    const totalSubjects =
        checkboxes.length;

    const finished =
        document.querySelectorAll(
            ".subject-checkbox:checked"
        ).length;


    let percentage = 0;


    if (totalSubjects > 0) {

        percentage =
            Math.round(
                (finished / totalSubjects) * 100
            );

    }


    progressText.textContent =
        finished +
        " of " +
        totalSubjects +
        " subjects finished";


    progressPercentage.textContent =
        percentage + "%";


    progressFill.style.width =
        percentage + "%";

}



// Run when page loads
updateProgress();



// ===============================
// SUBJECT SEARCH
// ===============================

const searchInput =
    document.getElementById("subject-search");


searchInput.addEventListener("input", function () {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    subjectCards.forEach(function (card) {

        const subjectName =
            card.dataset.name.toLowerCase();


        if (subjectName.includes(searchText)) {

            card.classList.remove("hidden");

        } else {

            card.classList.add("hidden");

        }

    });

});
