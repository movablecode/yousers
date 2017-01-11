--  config.moon
import config from require "lapis.config"

config {"development", "production"},->
  num_workers 1
  num_connections 4*1024
  daemon_flag "on"

  pcall ->
    include require "secret.keys"

  session_name "gongsess"
  secret "glass glider interactive compactness"
  app_name "gongapps"
  admin_email "babelier@gmail.com"


config {"development"},->
  port 3000
  code_cache "off"
  log_prefix "DEV_"
  postgres {
    backend: "pgmoon"
    host: "127.0.0.1"
    user: "smlee"
    password: "onetwo12"
    database: "bbl2"
  }

config "production",->
  port 80
  code_cache "on"
  log_prefix "PROD_"
  postgres {
    backend: "pgmoon"
    host: "127.0.0.1"
    user: "smlee"
    password: "onetwo12"
    database: "bbl1"
  }
