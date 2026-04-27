import api from "@/config/axios";

export const getAllRecipes = async () => {
    const response = await api.get("/recipes");
    return response.data;
};

// export const getRecipeDetail = async (id) => {
//     const response = await api.get(`/recipes/${id}`);
//     return response.data;
// };