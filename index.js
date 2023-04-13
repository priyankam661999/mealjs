const search_input = document.querySelector('.search-input');
const search_icon = document.querySelector('.search-icon');
const meal_container = document.querySelector('.meal');

const popup_container = document.querySelector('.pop-up-container');
const close_popup_btn = document.querySelector('.pop-up > i');
const popup = document.querySelector('.pop-up-inner');


// Fetch Meal upon search
async function getMealsBySearch(term) {
  const resp = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  const respData = await resp.json();
  const meals = respData.meals;

  return meals;
}

// Search Meal Operation
search_icon.addEventListener('click', async () => {
  meal_container.innerHTML = '';
  const searchVal = search_input.value;
  const meals = await getMealsBySearch(searchVal);

  if (meals) {
    meals.forEach((meal) => {
      addMeal(meal);
    });
    document.querySelector('.covermeal> h2').innerText =
      'Search Results';
  } else {
    document.querySelector('.covermeal> h2').innerText =
      'No Meals Found';
    meal_container.innerHTML = '';
  }
});

// Add Meal Searched by User
function addMeal(meal) {
  const covermeal = document.createElement('div');
  covermeal.classList.add('covermeal');
  covermeal.innerHTML = `
        <div class="covermeal-img-container">
            <img
            src="${meal.strMealThumb}"
            />
        </div>
        <div class="meal-name">
            <p>${meal.strMeal}</p>
            <i class="fa-regular fa-heart"></i>
        </div>`;

  const btn = covermeal.querySelector('.fa-heart');
  btn.addEventListener('click', () => {
    // check  if the meal is added to favourite 
    if (btn.classList.contains('fa-regular')) {
      btn.setAttribute('class', 'fa-solid fa-heart');
      addMealLS(meal.idMeal);
    } else {
      btn.setAttribute('class', 'fa-regular fa-heart');
      removeMealLS(meal.idMeal);
    }
  });

  meal_container.appendChild(covermeal);
  covermeal.firstChild.nextSibling.addEventListener('click', () => {
    showMealPopup(meal);
  });
}

// Fetches the Meal from the Local Storage
function getMealLS() {
  const mealIds = JSON.parse(localStorage.getItem('mealIds'));

  return mealIds === null ? [] : mealIds;
}

// Add Meal to the Local Storage
function addMealLS(mealID) {
  const mealIds = getMealLS();
  localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealID]));
  alert("Add To Favourites")
}

// Remove Meal from Local Storage
function removeMealLS(mealID) {
  const mealIds = getMealLS();
  localStorage.setItem(
    'mealIds',
    JSON.stringify(mealIds.filter((id) => id !== mealID))
    );
}

// Displays the Meal Details in Modal
function showMealPopup(meal) {
  popup.innerHTML = '';

  const newPopup = document.createElement('div');
  newPopup.classList.add('pop-up-inner');

  const ingredients = [];
  for (let i = 1; i <= 30; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  newPopup.innerHTML = `<div class="left">
  <div class="covermeal">
    <div class="covermeal-img-container">
      <img
        src="${meal.strMealThumb}"
      />
    </div>
    <div class="meal-name">
      <p>${meal.strMeal}</p>
      <i class="fa-regular fa-heart"></i>
    </div>
  </div>
  <div class="recipe-link">
  <a href="${meal.strYoutube}" target="_blank">
  <button type="button" class="btn">
  Watch Recipe
  </button>
  </a>
  </div>
</div>
<div class="right">
  <div>
    <h2>Instructions</h2>
    <p class="meal-info">
     ${meal.strInstructions}
    </p>
  </div>
  <div>
    <h2>Ingredients / Measures</h2>
    <ul>
      ${ingredients.map((e) => `<li>${e}</li>`).join('')}
    </ul>
  </div>
</div>`;

  popup.appendChild(newPopup);
  popup_container.style.display = 'flex';
}

// Close the Popup Modal
close_popup_btn.addEventListener('click', () => {
  popup_container.style.display = 'none';
});