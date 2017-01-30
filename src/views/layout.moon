html = require "lapis.html"
wgHeaderNavBar = require "widgets.wgHeaderNavBar"

class DefaultLayout extends html.Widget
  content: =>
    html_5 lang:"ko", ->
      head ->
        meta charset:"utf-8"
        meta ["http-equiv"]:"X-UA-Compatible",content:"IE=edge"
        meta name:"description",content:"Gong Studio"
        meta name:"viewport",content:"width=device-width, initial-scale=1.0, minimum-scale=1.0"
        title @title or "Gong Studio"
        link rel:"icon",href:"/img/fav_bbl.ico"
        --  material design lite
        -- link rel:'stylesheet',href:'/css/journal_gray.min.css',type:'text/css'
        link rel:'stylesheet',href:'/css/darkhero.min.css',type:'text/css'
        -- link rel:'stylesheet',href:'/css/gongbase.css',type:'text/css'
        -- link rel:'stylesheet',href:'/css/gs.css',type:'text/css'
        script src:'/js/bundle.js'
        script src:'/js/app.js'

        --  scripts
        script ->
          raw [[
            // GS LINT
          ]]
      body ->
        widget wgHeaderNavBar {u:@current_user}

        -- div class:"container",->
        div class:nil,->
          @content_for "inner"

        -- footer class:"text-center top_line",style:"background-color: #f0f0f0;",->
        footer class:"landing1",style:"background-color: #000 !important;",->
          div class:"container hero",->
            div class:"row",->
              div class:"col-md-4",->
                h3 "Tools & Services"
                div -> a href:"http://www.babelier.com","Babelier"
                div -> a href:"http://www.gongtrader.com","Gong Trader"
                div -> a href:"/production/strobe","Strobe"
                div -> a href:"/production/pulsor","Pulsor"
              div class:"col-md-4",->
                h3 "Company"
                div -> a href:"/about","About"
              div class:"col-md-4",->
                h3 "Follow Us"
              div class:"col-md-12 text-center",->
                p ->
                  raw "&copy; 2016 "
                  a href:"/", "Gong Studio"
                  raw " All Rights Reserved."
