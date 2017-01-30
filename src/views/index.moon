--  index.moon
lapis = require "lapis"
import Widget from require "lapis.html"
util = require "lapis.util"

class extends Widget
  content: =>
    div class:"landing1",style:"background-image: linear-gradient(-190deg, #101010 1%, #777777 100%) !important;",->
      div class:"container hero",->

        div class:"row",->
          div class:"col-md-6 left",->
            h1 "Build the best software tools & services with us"
            ul ->
              li "Mobile & Web Apps",->
                span id:"tools",""
              li "Discover new tools and services"
            p "Left"
          div class:"col-md-6 right",->
            -- 바벨리어
            div class:"col-md-12 hero-tool flex_con_c",->
              div class:"col-md-3",->
                img class:"img-responsive img-round", src:"/img/bbl3_80.png"
              div class:"col-md-8",->
                h3 "Babelier"
                p class:"text-gray","Collective Translation Community"
              div class:"col-md-1",->
                -- button class:"btn btn-sm btn-transparent borderless",type:"submit",value:"Contact Us",->
                --   i class:"glyphicon glyphicon-share-alt"
                a href:"http://www.babelier.com",->
                  i class:"glyphicon glyphicon-share-alt"

            -- 공트레이더
            div class:"col-md-12 hero-tool flex_con_c",->
              div class:"col-md-3",->
                img class:"img-responsive img-round", src:"/img/gong_72_48.png"
                img class:"img-responsive img-round", src:"/img/trader_78_44.png"
              div class:"col-md-8",->
                h3 "Gong Trader"
                p class:"text-gray","The Social Trading Platform"
              div class:"col-md-1",->
                a href:"http://www.gongtrader.com",->
                  i class:"glyphicon glyphicon-share-alt"

            -- 코스콤 Open API
            div class:"col-md-12 hero-tool flex_con_c",->
              div class:"col-md-3",->
                img class:"img-responsive img-round", src:"/img/logo_koscom.png"
              div class:"col-md-8",->
                h3 "Financial Open API"
                p class:"text-gray","Financial Information Open API via HTTP/WebSockets"
              div class:"col-md-1",->
                a href:"http://www.koscom.com",->
                  i class:"glyphicon glyphicon-share-alt"


    -- div class:"landing1",style:"background-image: linear-gradient(-190deg, #101010 1%, #777777 100%) !important;",->
    div class:"landing1",style:"background-color: #fff !important;",->
      div class:"container white_hero",->
        div class:"row text-center",->
          -- h1 "True Open-Source Solutions"
          div class:"col-md-6 left",style:"padding: 48px;",->
            img class:"img-responsive img-rect", src:"/img/ss_tools.jpg"
          div class:"col-md-6 right",->
            h1 "All the best software tools and cloud infrastructure services in one studio"



    --  Contact
    div class:"landing1",style:"background-image: url('/img/black_tile_01.jpg');",->
      div class:"container hero",->
        div class:"row",->
          h1 "Contact Us"
          div class:"col-md-6",id:"contact",->
            h3 class:"text-gray","Send Message"
            -- br!
            form action:"http://mailthis.to/sangmin.lna@gmail.com",method:"post",->
              div ->
                label for:"email", "Your Email:"
                br!
                input type:"email",name:"email",id:"name",placeholder:"youraddress@yourdomain.com",style:"width:100%;color: black;"
              br!
              div ->
                label for:"message","Message:"
                br!
                textarea rows:"12",name:"message",style:"width:100%;color: black;",placeholder:"write your messages"
              div ->
                -- button type:"submit",value:"Contact Us"
                -- input type:"submit",value:"Contact Us"
                button class:"btn btn-default btn-sm btn-transparent borderless",type:"submit",value:"Contact Us",->
                    i class:"glyphicon glyphicon-envelope",
                  " Contact Us"
          div class:"col-md-6",id:"about",->
            h3 class:"text-gray","About Us"
            div ->
              p "공스튜디오는 다양한 모바일 / 웹 서비스들을 개발하고 있습니다."

    --  Carousel
    div class:"landing1",style:"background-color: #fff !important;",->
      div class:"container white_hero",->
        div class:"row",->
          div class:"col-md-12",->
            h1 "Carousel"
