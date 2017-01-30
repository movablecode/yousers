--  wgEmbed.moon
lapis = require "lapis"
import Widget from require "lapis.html"
util = require "lapis.util"

class extends Widget
  content: =>
    div class:"container",->
      div class:"row",->
        p "it is wg.Embed Widget"
