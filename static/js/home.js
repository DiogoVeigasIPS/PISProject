(async () => {
    try {
        const token = localStorage.getItem('auth');
        const loggedResponse = await fetch("http://localhost:8081/api/user/loggedIn", {
            headers: { 'x-access-token': token }
        });

        if(!loggedResponse.ok) return;
        
        const userId = (await loggedResponse.json()).id;
        const response = await fetch(`http://localhost:8081/api/user/${userId}/favoriteRecipe?partial=true&max=4`,
            {
                headers: { 'x-access-token': localStorage.getItem('auth') }
            }
        );

        if (response.ok) {
            const responseData = await response.json();
            const title = document.getElementById('favorite-recipes-title');
            const container = document.getElementById('favorite-recipes-container');
            const line = document.getElementById('favorite-recipes-line');

            responseData.forEach(element => {
                createRecipeCard(element, userId)
            });

            if(responseData.length != 0){
                title.classList.remove('d-none');
                container.classList.remove('d-none');
                line.classList.remove('d-none');
            }
        }

    } catch (err) {
        console.error(err);
    }
})();

const createRecipeCard = (data, userId) => {
    const recipeCard = document.createElement('div');

    // Set the inner HTML of the div
    recipeCard.innerHTML = `
    <div class="col">
        <div class="card recipe-card">
            <img src="${data.image}" class="card-img-top" alt="${data.name} Image">
            <div class="card-body">
                <h5 class="card-title">${data.name}</h5>
                <a href="/recipe/${data.id}" class="btn btn-primary">View Details</a>
            </div>
        </div>
    </div>
    `;

    // Append the created div to the favorite-recipes-container
    document.getElementById('favorite-recipes-container').appendChild(recipeCard);
}