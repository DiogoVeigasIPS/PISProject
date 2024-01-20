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
        const responseUser = await fetch(`http://localhost:8081/api/user/${responseData.id}`);

        if (responseUser.status == 200) {
            const responseUserData = await responseUser.json();
            const userFullName = document.getElementById('userFullName');
            const userImage = document.getElementById('userImage');
            const userName = document.getElementById('userName');
            const userEmail = document.getElementById('userEmail');

            userFullName.innerText = responseUserData.firstName + responseUserData.lastName;
            userImage.src = responseUserData.image ?? '/img/chefProfilePicture.png';
            userName.innerText = responseUserData.username;
            userEmail.innerText = responseUserData.email;
            document.title = `${responseUserData.lastName}' profile`;

            document.getElementById('container').classList.remove('d-none');
            addRecipes(responseUserData.id);
        }

    } catch (err) {
        console.error(err);
    }
})();

const addRecipes = async (userId) => {
    try {
        const response = await fetch(`http://localhost:8081/api/user/${userId}/favoriteRecipe?partial=true`);

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
                method: "DELETE"
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