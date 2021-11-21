/**
 * Given an empty database, will initialize it.
 * if the database is not empty - it will be initialized anyway (probably with a lot of exeptions)
 * @param {Database} db 
 */
function upgrade(db)
{
    const ingredients = `
        CREATE TABLE ingredients
        (
            id INTEGER PRIMARY KEY,
            unit TEXT,
            url TEXT
        )
    `

    const ingredient_names = `
        CREATE TABLE ingredient_names
        (
            id INTEGER PRIMARY KEY,
            ingredient_id INTEGER,
            name TEXT UNIQUE,
            is_default NUMBER,

            FOREIGN KEY (ingredient_id)
                REFERENCES ingredients (id) ON DELETE CASCADE
        )
    `

    const recipes = `
        CREATE TABLE recipes
        (
            id INTEGER PRIMARY KEY,
            name TEXT,
            description TEXT
        )
    `

    const ingredient_recipe = `
        CREATE TABLE ingredient_recipe
        (
            ingredient_id INTEGER,
            recipe_id INTEGER,
            amount INTEGER,

            PRIMARY KEY(ingredient_id,recipe_id)

            FOREIGN KEY (ingredient_id)
                REFERENCES ingredients (id) ON DELETE RESTRICT
            FOREIGN KEY (recipe_id)
                REFERENCES recipes (id) ON DELETE CASCADE
        )
    `

    const substitution_recipe = `
        CREATE TABLE substitution_recipes
        (
            id INTEGER PRIMARY KEY,
            name TEXT,
            description TEXT,
            substituted_ingredient INTEGER,

            PRIMARY KEY(id)

            FOREIGN KEY (substituted_ingredient)
                REFERENCES ingredients (id) ON DELETE RESTRICT
        )
    `

    const ingredient_substitution_recipe = `
        CREATE TABLE ingredient_substitution_recipe
        (
            ingredient_id INTEGER,
            recipe_id INTEGER,
            amount INTEGER,

            PRIMARY KEY(ingredient_id,recipe_id)

            FOREIGN KEY (ingredient_id)
                REFERENCES ingredients (id) ON DELETE RESTRICT
            FOREIGN KEY (recipe_id)
                REFERENCES substitution_recipes (id) ON DELETE CASCADE
        )
    `

    const recipe_tag = `
        CREATE TABLE recipe_tags
        (
            recipe_id INTEGER,
            tag_id INTEGER,

            PRIMARY KEY(recipe_id,tag_id) 

            FOREIGN KEY (tag_id)
                REFERENCES tags (id) ON DELETE CASCADE
            FOREIGN KEY (recipe_id)
                REFERENCES recipes (id) ON DELETE CASCADE
        )
    `

    const ingredient_tag = `
        CREATE TABLE ingredient_tags
        (
            ingredient_id INTEGER,
            tag_id INTEGER,

            PRIMARY KEY(ingredient_id,tag_id) 

            FOREIGN KEY (tag_id)
                REFERENCES tags (id) ON DELETE CASCADE
            FOREIGN KEY (ingredient_id)
                REFERENCES ingredients (id) ON DELETE CASCADE
        )
    `

    const tags = `
        CREATE TABLE tags
        (
            id INTEGER PRIVATE KEY,
            name TEXT
        )
    `

    const system = `
        CREATE TABLE system
        (
            id INTEGER PRIVATE KEY,
            version INTEGER
        )
    `
    db.exec(tags)
    db.exec(ingredients)
    db.exec(ingredient_names)
    db.exec(recipes)
    db.exec(ingredient_recipe)
    db.exec(recipe_tag)
    db.exec(ingredient_tag)
    db.exec(system)
    db.exec(languages)
    db.exec(ingredient_substitution_recipe)
    db.exec(substitution_recipe)
    db.exec("insert into system (version) values (0)")
}

module.exports = upgrade