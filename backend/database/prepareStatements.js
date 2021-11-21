/**
 * Prepared db statements for reuse in the dtatsource component
 * @param {import('better-sqlite3').Database} db 
 * @returns 
 */
async function prepareStatements(db)
{
    return {
        ingredients:
        {
            get:
            {
                all:db.prepare(`SELECT * FROM ingredients`),
                byId:db.prepare('SELECT * FROM ingredients WHERE id=?'),
            }
        },
        ingredient_names:
        {
            get:
            {
                byIngredient:db.prepare(`
                    SELECT * FROM ingredient_names
                WHERE ingredient_id = ?`),
            }
        },
        recipes:
        {
            get:
            {
                all:db.prepare(`SELECT * FROM recipes`),
                byId:db.prepare('SELECT * FROM recipes WHERE id=?'),
            }
        },
        recipe_ingredients:
        {
            get:
            {
                byRecipe:db.prepare(`
                    SELECT * FROM recipe_ingredients
                WHERE recipe_id = ?`),
            }
        },
        tags:
        {
            get:
            {
                byRecipe:db.prepare(`
                    SELECT 
                        t.id as id,
                        t.name as name 
                    FROM recipe_tags
                    left join 
                        tags t on t.id = recipe_tags.tag_id
                    WHERE 
                        recipe_id = ? 
                    `),
            }
        },
        
    }
}

module.exports = prepareStatements