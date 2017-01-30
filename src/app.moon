require "dist.base"
lapis = require "lapis"
expand_path "dist"

g_app = require "dist.main_app"

export GET = (path,fn) -> g_app\get path,fn
export POST = (path,fn) -> g_app\post path,fn
export MATCH = (path,fn) -> g_app\match path,fn

return g_app
