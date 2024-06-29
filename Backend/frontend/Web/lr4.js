function daysUntilFridayThe13th() {
    let today = new Date();
    let next13th = new Date(today.getFullYear(), today.getMonth(), 13);

    while (next13th.getDay() !== 5) {
        next13th.setMonth(next13th.getMonth() + 1); // Переходимо до наступного місяця
    }

    let daysUntil = Math.ceil((next13th.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil;
}



function daysUntilAugust23() {
    let today = new Date();
    let august23 = new Date(today.getFullYear(), 7, 23); // Серпень - місяць з індексом 7 
    let daysUntil = Math.ceil((august23 - today) / (1000 * 60 * 60 * 24));
    return daysUntil;
}

//поточний час
function getCurrentTime() {
    let now = new Date();
    return now.toLocaleString();
}


document.getElementById("okButton").addEventListener("click", function() {
    let inputField = document.getElementById("inputField");
    inputField.value = `${daysUntilFridayThe13th()} days until 13th Friday.`;
});


document.getElementById("okButton2").addEventListener("click", function() {
    let inputField2 = document.getElementById("inputField2");
    inputField2.value = ` ${daysUntilAugust23()} days until the next August 23.`;
});


document.getElementById("cancelButton").addEventListener("click", function() {
    let inputField = document.getElementById("inputField");
    inputField.value = "";
});


document.getElementById("cancelButton2").addEventListener("click", function() {
    let inputField2 = document.getElementById("inputField2");
    inputField2.value = "";
});


document.getElementById("infoLink").addEventListener("click", function(event) {
    event.preventDefault(); 
    alert(`Time: ${getCurrentTime()}`);
});
let intervalID; 

// Функція для оновлення поточного часу
function updateTime() {
    let now = new Date();
    let timeString = now.toLocaleTimeString();
    let dateContainer = document.getElementById("dateContainer");
    dateContainer.textContent = timeString;
}


let dateContainer = document.getElementById("dateContainer");
dateContainer.addEventListener("mouseenter", function() {

    intervalID = setInterval(updateTime, 1000);
});

// Функція для оновлення поточної дати
function updateDate() {
    let now = new Date();
    let dateContainer = document.getElementById("dateContainer");
    dateContainer.textContent = now.toLocaleDateString();
}

dateContainer.addEventListener("mouseleave", function() {

    clearInterval(intervalID);
    updateDate();
});

updateDate();

document.addEventListener('DOMContentLoaded', function() {
  const crown = document.querySelector('.hover-crown');
  const butterfly = document.querySelector('.hover-butterfly');

  crown.addEventListener('mouseenter', function() {
      this.src = 'Asset2new.png';
      this.style.transform = 'scale(1.1)';
  });

  crown.addEventListener('mouseleave', function() {
      this.src = 'Asset2.png';
      this.style.transform = 'scale(1)';
  });

  butterfly.addEventListener('mouseenter', function() {
      this.src = 'Asset3new.png';
      this.style.transform = 'scale(1.1)';
  });

  butterfly.addEventListener('mouseleave', function() {
      this.src = 'Asset3.png';
      this.style.transform = 'scale(1)';
  });
});
