migrate((db) => {
  const collection = new Collection({
    "id": "g9r0ym80b2895yo",
    "created": "2023-02-25 14:01:55.921Z",
    "updated": "2023-02-25 14:01:55.921Z",
    "name": "data",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "6ckxiq9w",
        "name": "parameters",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "rgs3y4pt",
        "name": "folderPath",
        "type": "text",
        "required": true,
        "unique": true,
        "options": {
          "min": 0,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "8wizthb8",
        "name": "numMolecules",
        "type": "number",
        "required": true,
        "unique": false,
        "options": {
          "min": 1,
          "max": null
        }
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("g9r0ym80b2895yo");

  return dao.deleteCollection(collection);
})
