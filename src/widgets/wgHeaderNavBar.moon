--  wgHeaderNavBar.moon
import Widget from require "lapis.html"
-- import getAvatarURL from require "computil"

class extends Widget
  content: =>
    u = nil
    if @u
      u = {
        id:             @u.id
        email:          @u.email
        -- thumbnail_src:  getAvatarURL @u,32
        exp:            @u.exp
        bbl:            @u.bbl
        gold:           @u.gold
        lvl:            @u.lvl
        step:           @u.step
      }
    -- header class:"container bottom_line",->
    -- header class:"bottom_line",->
    header ->
      -- nav class:"navbar-sm navbar-inverse navbar-top",style:"border: 0;",->
      nav class:"navbar-sm navbar navbar-top",style:"border: 0;",->
        div class:"container",->
          div class:"navbar-header",->
            button class:"navbar-toggle collapsed",type:"button",["data-toggle"]:"collapse",["data-target"]:"#navbar",["aria-expanded"]:false,["aria-controls"]:"navbar",->
              span class:"sr-only", "Toggle Navigation"
              span class:"icon-bar"
              span class:"icon-bar"
              span class:"icon-bar"
            a class:"navbar-left",href:"/",->
              -- img src:"/img/gs_80.png",alt:"Alt Text"
              text "Yousers"
            -- a class:"navbar-brand navbar-left",href:"/", "Zevo Online"
          div id:"navbar",class:"navbar-collapse collapse", ->
            ul class:"nav navbar-nav navbar-right",->
              li ->
                a href:"/board/gs_news/list/1", "News"
              li ->
                a class:"dropdown-toggle",["data-toggle"]:"dropdown",["aria-haspopup"]:true,["aria-expanded"]:false,->
                  text "Products "
                  span class:"caret"
                ul class:"dropdown-menu text-center",->
                  li -> a href:"/products/oms2", "OMS/2"
                  li -> a href:"/products/strobe", "Strobe"
                  li -> a href:"/products/pulsor", "Pulsor"
                  li role:"separator",class:"divider"
                  li -> a href:"/products/babelier", "Babelier"
                  li -> a href:"/products/gongtrader", "Gong Trader"
                  li role:"separator",class:"divider"
                  li -> a href:"/article/a01", "Dev.Pipeline"
              li ->
                a href:"#contact", "Contanct Us"
              li ->
                a href:"/about", "About"
