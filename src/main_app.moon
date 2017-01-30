--  main_app.moon
lapis = require "lapis"
require "dist.base"

-- require "lib.lapis_redis"

-- module "my_module", package.seeall
-- export print_result

class extends lapis.Application
  layout: "layout"

  --  include sub appplications
  @include "routes.sandbox"
  --@include "routes.article"
  --@include "routes.embed"

  [index:"/"]: => render:true

  -- "/": =>
  --   isFile = file_exist "dist/app.lua"
  --   "Welcome to Gong Studio HOME #{require "lapis.version"}! #{isFile}"

  "/test/x1": =>
    @html ->
      p package.path
      p "AAA"
