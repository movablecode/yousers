html = require "lapis.html"

class EmbedLayout extends html.Widget
  content: =>
    html_5 lang:"ko", ->
      head ->
        meta charset:"utf-8"
        meta ["http-equiv"]:"X-UA-Compatible",content:"IE=edge"
        meta name:"description",content:"Gong Studio"
        meta name:"viewport",content:"width=device-width, initial-scale=1.0, minimum-scale=1.0"
        title @title or "Gong Studio"
        link rel:"icon",href:"/img/fav_bbl.ico"
        link rel:'stylesheet',href:'/css/theme.min.css',type:'text/css'
        link rel:'stylesheet',href:'/css/gongbase.css',type:'text/css'
        link rel:'stylesheet',href:'/css/gs.css',type:'text/css'
        script src:'/js/bundle.js'
        script src:'/js/app.js'
      body ->
        div class:"container",->
          p "Layout Embed"
        div class:nil,->
          @content_for "inner"
