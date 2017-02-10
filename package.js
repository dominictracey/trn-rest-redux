Package.describe({
  name: "trn:rest-redux",
  version: "0.3.1",
});

Package.onUse( function(api) {

  api.versionsFrom("METEOR@1.0");

  api.use([
    'nova:core@1.0.0',
  ]);

  api.mainModule("lib/modules.js", ["client", "server"]);
});
