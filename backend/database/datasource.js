const preparedStatements = require("./prepareStatements")
const cfg = require("../config");
const db = require('better-sqlite3')(cfg.database.path)


/**
 * Abstraction layer for persistant data interaction
 */
class Datasource
{
    /**
     * @typedef {Object} Ingredient
     * @property {number} id - The id of the ingredient
     * @property {string} unit - The unit the ingredient is measured in
     * @property {string} url - The url to the ingredients wikipedia page
     * @property {Array<IngredientName>} names - The names of the ingredient
     */

    /**
     * @typedef {Object} IngredientName
     * @property {number} id - The id of the ingredient name
     * @property {string} name - The name of the ingredient
     * @property {number} ingredient_id - The id of the ingredient referenced by this name
     * @property {Boolean} is_default - Whether this name is the preferred name for the ingredient
     */

    /**
     * @typedef {Object} RecipeIngredient
     * @property {number} id - The id of the recipe ingredient
     * @property {number} recipe_id - The id of the recipe referenced by this recipe ingredient
     * @property {number} ingredient_id - The id of the ingredient referenced by this recipe ingredient
     * @property {number} amount - The amount of the ingredient in the recipe
     */

    /**
     * @typedef {Object} Tags 
     * @property {number} id - The id of the tag
     * @property {string} name - The name of the tag
     */

    /**
     * @typedef {Object} Recipe
     * @property {number} id - The id of the recipe
     * @property {string} name - The name of the recipe
     * @property {string} description - The instructions for the recipe
     * @property {Array<RecipeIngredient>} ingredients - The ingredients required for the recipe
     * @property {Array<Tags>} tags - The tags associated with the recipe
     */

    async initialize()
    {
        try
        {
            //check for version
            const version = await db.prepare("select version from system").get()
            console.log(version)

            //todo: database upgrades
        }
        catch
        {
            //if version check fails initialize the database
            await require("./upgrade/0")(db)
        }

        this.smt = await preparedStatements(db)
    }

    /**
     * Returns a list of all ingredients
     * @returns {Array<Ingredient>}
     */
    async getAllIngredients()
    {
        const ingr = await this.smt.getAllIngredients()
        const inr_prom = ingr.map(async i => i.names = await this.smt.ingredient_names.get.byIngredient(i.id))
        await Promise.all(inr_prom)
        return ingr
    }

    /**
     * Returns a list of all recipes
     * @returns {Array<Recipe>}
     */
    async getAllRecipes()
    {
        const recipes = await this.smt.getAllRecipes()
        const recep_prom = recipes.map(
            async r => {
                r.ingredients = await this.smt.recipe_ingredients.get.byRecipe(r.id)
                r.tags = await this.smt.tags.get.byRecipe(r.id)
            }
        )
        await Promise.all(recep_prom)
        return recipes
    }

    /**
     * Returns a list of all tags
     * @returns {Array<Tags>}
     */
    async getAllTags()
    {
        return await this.smt.getAllTags()
    }

}

module.exports = Datasource