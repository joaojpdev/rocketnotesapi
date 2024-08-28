const knex = require("../database/knex");

class TagsController {
  async index(req, resp) {
    const user_id = req.user.id;

    const tags = await knex("tags")
    .where({user_id})
    .groupBy("name");
    
    return resp.json(tags);
  }
}

module.exports = TagsController