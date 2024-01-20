window.addEventListener("load", (e) => {
    const favoriteRecipe = document.getElementById('favoriteRecipe');
    favoriteRecipe.onclick = async () => {
        try {
            const token = localStorage.getItem('auth');
            const response = await fetch("http://localhost:8081/api/user/loggedIn", {
                headers: { 'x-access-token': token }
            });

            if (response.status == 200) {
                const responseData = await response.json();
                const userId = responseData.id;

                const recipeId = document.getElementById('recipeId').textContent;
                
                const favoriteResponse = await fetch(`http://localhost:8081/api/user/${userId}/favoriteRecipe/${recipeId}`, 
                {
                    method: 'POST'
                });

                const textResponse = await favoriteResponse.text();

                if(favoriteResponse.status == 201){
                    showToast(textResponse, false);
                }else{
                    showToast(textResponse, true);
                }
            } else {
                showToast('Log in required to favorite a recipe', true);
            }
        } catch (err) {
            console.error(err);
        }
    }
});