const { response } = require("express");
const knex = require("../database/knex")

class NotesController {
  async create(request, response) {
    const { title, description, tags, links } = request.body;
    const user_id  = request.user.id;

    const [note_id] = await knex("notes").insert({
      title,
      description,
      user_id
    });

    const linksInsert = links.map(link => {
      return {
        note_id,
        url: link
      }
    })
    await knex("links").insert(linksInsert);

    const tagsInsert = tags.map(name => {
      return {
        note_id,
        name,
        user_id
      }
    })  
    await knex("tags").insert(tagsInsert);

    return response.json();
  }

  async show(req, resp) {
    const {id} = req.params;

    const note = await knex("notes").where({id}).first()

    return resp.json(note)
  }

  async delete(req, resp) {
    const {id} = req.params;

    await knex("notes").where({ id }).delete();

    return resp.json();
  }

  async index(req, resp) {
    const {title, tags} = req.query;
    const user_id = req.user.id;

    let notes;

    if(tags) {
      const filterTags = tags.split(",").map(tag => tag.trim());

      notes = await knex("tags")
      .select([
        "notes.id",
        "notes.title",
        "notes.user_id",
      ])
      .where("notes.user_id", user_id)
      .whereLike("notes.title", `%${title}%`)
      .whereIn("name", filterTags)
      .innerJoin("notes", "notes.id", "tags.note_id")
      .orderBy("notes.title")
    } else {
      notes = await knex("notes")
      .where({user_id})
      .orderBy("title")
      .whereLike("title", `%${title}%`);
    }

    const userTags = await knex("tags").where({user_id});

    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags
      }
    });


    return resp.json(notesWithTags);
  }
}

module.exports = NotesController;