--  config.moon
import config from require "lapis.config"

config {"development", "production"},->
  num_workers 1
  num_connections 1*1024
  daemon_flag "on"
  port 3102

  pcall ->
    include require "secret.keys"

  session_name "gongsess"
  secret "glass glider interactive compactness"
  app_name "gongapps"
  admin_email "babelier@gmail.com"


config {"development"},->
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
  num_workers 1
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
