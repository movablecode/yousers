--  sandbox.moon
lapis = require "lapis"
html = require "lapis.html"
util = require "lapis.util"
--red = require "lib.lapis_redis"


class extends lapis.Application
  "/sandbox": =>
    @html ->
      p "SandBox"

  "/sandbox/redis": =>
    @html ->
      p "SandBox REDIS"

  "/sandbox/a01": =>
    @html ->
      p "A - 01"
