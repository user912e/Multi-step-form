let data = {};

// get active step
let active = get("form>.show");

// active aside step
let activeStep = get(".steps>.active");

// next step
function next(step = active.nextElementSibling) {
  active = get("form>.show");
  if (active.classList.contains("thank-you")) {
    return;
  }
  if (step.classList.contains("thank-you")) {
    getData();
  }
  if (!active.nextElementSibling.classList.contains("thank-you")) {
    activeStep = get(".steps>.active");
    if (!activeStep) {
      get(`li[data-step="info"]`).classList.add("active");
    }

    removeClass("active");

    activeStep.nextElementSibling.classList.add("active");
  }
  removeClass("show");
  step.classList.add("show");
  active = get("form>.show");
}

//  previous step
function back(step = active.previousElementSibling) {
  if (active.classList.contains("info")) {
    console.log(step);
    return;
  }

  if (step !== null) {
    activeStep = get(".steps>.active");
    removeClass("active");
    // console.log(activeStep.previousElementSibling);
    if (activeStep.previousElementSibling)
      activeStep.previousElementSibling.classList.add("active");
  }

  removeClass("show");
  step.classList.add("show");
  active = get("form>.show");
}

// remove passed class
function removeClass(className) {
  document.querySelectorAll(`.${className}`).forEach((cl) => {
    cl.classList.remove(className);
  });
}

// short hand to get elements
function get(element) {
  if (element) return document.querySelector(element);
  throw new Error(
    `Please check "${selection}" selector, no such element exist!`
  );
}

function getData() {
  let selectedPlan = [...document.querySelectorAll(`input[name="plan"]`)]
    .filter((p) => {
      return p.checked;
    })
    .map((p) => {
      return p.id;
    });
  let selectedServices = [...document.querySelectorAll(".add-on>input")]
    .filter((s) => {
      return s.checked;
    })
    .map((s) => {
      return s.id;
      // console.log({
      //   id: s.id,
      //   price: s.parentElement.lastElementChild.innerText,
      // });
    });
  data = {
    name: get("#name").value,
    email: get("#email").value,
    phone: get("#phone").value,
    plan: selectedPlan.toString(),
    period: get(".switch-button-checkbox").checked ? "yearly" : "monthly",
    // services: selectedServices,
  };
  console.log(data);
}

function finichingUp() {
  let totalPrice = 0;
  // plan
  let selectedPlan = [...document.querySelectorAll(`input[name="plan"]`)]
    .filter((p) => {
      return p.checked;
    })
    .map((p) => {
      return {
        id: p.id,
        price: p.nextElementSibling.lastElementChild.lastElementChild.innerText,
      };
    });
  console.log(selectedPlan);
  totalPrice += parseInt(selectedPlan[0].price.substring(1));
  get(".selected-plan").innerHTML = "";
  let div = document.createElement("div");
  let p = document.createElement("p");
  p.innerText = selectedPlan[0].id;
  let h6 = document.createElement("h6");
  h6.setAttribute("id", "change-plan");
  h6.innerText = "Change";
  div.appendChild(p);
  div.appendChild(h6);

  let span = document.createElement("span");
  span.setAttribute("class", "price");
  span.innerText = selectedPlan[0].price;
  get(".selected-plan").appendChild(div);
  get(".selected-plan").appendChild(span);
  // services
  let selectedServices = [...document.querySelectorAll(".add-on>input")]
    .filter((s) => {
      return s.checked;
    })
    .map((s) => {
      return {
        id: s.id,
        price: s.parentElement.lastElementChild.innerText,
      };
    });

  get("ul.selected-add-ons").innerHTML = "";
  selectedServices.forEach((sele) => {
    totalPrice += parseInt(sele.price.substring(1));
    let li = document.createElement("li");
    li.setAttribute("class", "s-add-on");
    let p = document.createElement("p");
    p.innerText = sele.id;
    let span = document.createElement("span");
    span.innerText = sele.price;
    li.appendChild(p);
    li.appendChild(span);
    get("ul.selected-add-ons").appendChild(li);
  });
  console.log(totalPrice);
  get(".summary>.total>p").innerText = get(".switch-button-checkbox").checked
    ? "total(year)"
    : "total(month)";
  get(".summary>.total>span").innerText = "+$" + totalPrice + "/mo";
  // change plan button

  get("h6#change-plan").addEventListener("click", () => {
    back(get(".plans"));
    removeClass("active");
    get(`li[data-step="plan"]`).classList.add("active");
    active = get("form>.show");
  });
}
// console.log(finichingUp());

function clickBack() {
  finichingUp();
  // pouse the click event
  get("button#back").removeEventListener("click", clickBack);
  setTimeout(() => {
    back();
    get("button#back").addEventListener("click", clickBack);
  }, 200);
}
function clickNext() {
  finichingUp();
  // pouse the click event
  get("button#next").removeEventListener("click", clickNext);
  setTimeout(() => {
    next();
    get("button#next").addEventListener("click", clickNext);
  }, 200);
}
// next button
get("button#back").addEventListener("click", clickBack);

// back button
get("button#next").addEventListener("click", clickNext);
