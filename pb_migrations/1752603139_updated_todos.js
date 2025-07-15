/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_113564862")

  // update collection data
  unmarshal({
    "createRule": "\"\" = \"\"",
    "deleteRule": "\"\" = \"\"",
    "updateRule": "\"\" = \"\"",
    "viewRule": "\"\" = \"\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_113564862")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "updateRule": null,
    "viewRule": ""
  }, collection)

  return app.save(collection)
})
