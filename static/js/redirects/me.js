(async () => {
    try {
        const token = localStorage.getItem('auth');
        const response = await fetch("http://localhost:8081/api/user/loggedIn", {
            headers: { 'x-access-token': token }
        });

        if (response.status != 200) {
            window.location.href = '/auth';
            return;
        }

        const responseData = await response.json();
        const responseUser = await fetch(`http://localhost:8081/api/user/${responseData.id}`,
            { headers: { 'x-access-token': localStorage.getItem('auth') } });

        if (responseUser.status == 200) {
            const responseUserData = await responseUser.json();
            const userFullName = document.getElementById('userFullName');
            const userImage = document.getElementById('userImage');
            const userName = document.getElementById('userName');
            const userEmail = document.getElementById('userEmail');

            userFullName.innerText = `${responseUserData.firstName} ${responseUserData.lastName}`;
            userImage.src = responseUserData.image ?? '/img/chefProfilePicture.png';
            userName.innerText = responseUserData.username;
            userEmail.innerText = responseUserData.email;
            document.title = `${responseUserData.lastName}' profile`;

            document.getElementById('searchInput').value = "";

            document.getElementById('container').classList.remove('d-none');
            addRecipes(responseUserData.id);
        }

    } catch (err) {
        console.error(err);
    }
})();

const addRecipes = async (userId) => {
    try {
        const response = await fetch(`http://localhost:8081/api/user/${userId}/favoriteRecipe?partial=true`,
            { headers: { 'x-access-token': localStorage.getItem('auth') } });

        if (response.ok) {
            const responseData = await response.json();
            responseData.forEach(element => {
                createRecipeCard(element, userId)
            });
        }

    } catch (err) {
        console.error(err);
    }
}

const createRecipeCard = (data, userId) => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('col');
    recipeCard.id = data.id;

    // Set the inner HTML of the div
    recipeCard.innerHTML = `
        <div class="card recipe-card">
            <img src="${data.image}" class="card-img-top" alt="${data.name}">
            <div class="card-body">
                <h5 class="card-title">${data.name}</h5>
                <div class="d-flex justify-content-between">
                    <a href="/recipe/${data.id}" class="btn btn-primary">View Details</a>
                    <button type="button" class="btn btn-danger" onClick="removeFavoriteRecipe('${userId}', '${data.id}', '${data.name}')">
                        <i class="bi bi-trash"></i> Recipe
                    </button>
                </div>
            </div>
        </div>
    `;

    // Append the created div to the favorite-recipes-container
    document.getElementById('favorite-recipes-container').appendChild(recipeCard);
}

const removeFavoriteRecipe = async (userId, recipeId, recipeName) => {
    const deleteModalName = document.getElementById('deleteModalName');
    deleteModalName.innerText = recipeName;

    const confirmDeletion = document.getElementById('confirmDeletion');

    confirmDeletion.onclick = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/user/${userId}/favoriteRecipe/${recipeId}`, {
                method: "DELETE",
                headers: { 'x-access-token': localStorage.getItem('auth') }
            });

            const responseData = await response.text();
            if (response.ok) {
                removeFavoriteRecipeDOM(recipeId);
                showToast(responseData);
            } else {
                showToast(responseData, true);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

const removeFavoriteRecipeDOM = (id) => {
    console.log(id)
    const recipeCard = document.getElementById(id);
    const parent = recipeCard.parentNode;
    parent.removeChild(recipeCard)
}

window.addEventListener('load', () => {
    // Log out
    const logoutButton = document.querySelector('#logoutButton');

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('auth');
        window.location = '/auth';
    })

    // Dynamic search
    const searchInput = document.getElementById('searchInput');
    const formSearch = document.getElementById('formSearch');

    formSearch?.addEventListener('submit', function (e) {
        e.preventDefault();
        filterRecipes(searchInput.value);
    });

    searchInput?.addEventListener('input', function () {
        filterRecipes(searchInput.value);
    });

    const filterRecipes = (stringSearch) => {
        const container = document.getElementById('favorite-recipes-container');
        const recipeCards = container.querySelectorAll('.recipe-card');

        recipeCards.forEach((recipeCard) => {
            const recipeName = recipeCard.querySelector('.card-title').innerText.toLowerCase();
            const shouldShow = recipeName.includes(stringSearch.toLowerCase());

            if (shouldShow) {
                recipeCard.parentElement.classList.remove('d-none');
            } else {
                recipeCard.parentElement.classList.add('d-none');
            }
        });
    };
})