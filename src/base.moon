--  base.moon
package.path ..= ""

export __ = require("moses")
export sf = sf or (string.format)
export lfs = require("lfs")

cl = lfs.currentdir()
export expand_path = (path) ->
  abs_path = cl.."/"..path
  package.path ..= sf ";%s/?.lua",abs_path


-------------------------------------------------------------------------------
--  Utilities
--
__genOrderedIndex = ( t ) ->
  orderedIndex = {}
  for key in pairs(t)
    table.insert( orderedIndex, key )
  table.sort( orderedIndex )
  return orderedIndex


orderedNext = (t, state) ->
  if state == nil
    -- the first time, generate the index
    t.__orderedIndex = __genOrderedIndex( t )
    key = t.__orderedIndex[1]
    return key, t[key]
  key = nil
  for i = 1,table.getn(t.__orderedIndex)
    if t.__orderedIndex[i] == state
      key = t.__orderedIndex[i+1]
  if key
    return key, t[key]
  t.__orderedIndex = nil
  return

export orderedPairs = (t) ->
  return orderedNext, t, nil

-- _G["orderedPairs"] = orderedPairs


--  string.trim
export trim = (s) ->
  return (s\gsub("^%s*(.-)%s*$", "%1"))


--  string.split
export split = (str, pat) ->
  t = {}
  fpat = "(.-)" .. pat
  last_end = 1
  s, e, cap = str\find(fpat, 1)
  while s
    if s != 1 or cap != ""
      table.insert(t,trim(cap))
    last_end = e+1
    s, e, cap = str\find(fpat, last_end)
  if last_end <= #str
    cap = str\sub(last_end)
    table.insert(t,trim(cap))
  return t


-- string split... to array (table)
export split_spc = (ln) ->
  vars = {}
  if not string.match(ln, "^#")
    for item in string.gmatch(ln,"%S+")
      -- vars[]
      vars[#vars+1] = item
  return vars


-- string split... to array (table) pure
export split_space = (ln) ->
  vars = {}
  for item in string.gmatch(ln,"%S+")
    -- vars[]
    vars[#vars+1] = item
  return vars

--  scan dir.
export scandir = (directory) ->
  if unexpected_condition then error()
  i, t, popen = 0, {}, io.popen
  for filename in popen('ls -a '..directory)\lines()
    i = i + 1
    t[i] = filename
  return t

--
--  array
--

export push_head = (q,v) -> table.insert(q,1,v)
export push_tail = (q,v) -> q[#q+1]=v
export pop_head = (q) ->
  item=nil
  if (#q>0)
    item = q[1]
    table.remove(q,1) 
  return item
export pop_tail = (q) ->
  item=nil
  if (#q>0)
    item= q[#q]
    table.remove(q,#q)
  return item


--
--  files
--

-- _G["file_exist"] = (fname) ->
export file_exist = (fname) -> 
  f = io.open(fname,"r")
  if (f!=nil)
    f\close()
    return true
  return false

export get_file_ext = (fname) ->
  va = split(fname,"[.]")
  return va[#va]

export load_pages = (fpath,subpath) ->
  skip=0
  fpath = fpath.."/"..subpath
  subpath2,fn = subpath.."."
  for fn in lfs.dir(fpath)
    f1 = fn\sub(1,1)
    if ((fn==".") or (fn=="..") or (f1=="."))
      skip = skip + 1
    else
      fname = fpath.."/"..fn
      attr = lfs.attributes(fname)
      mode = attr.mode
      ext = fn\sub(-4)
      if (ext==".lua")
        va = fn\sub(1,(#fn-4))
        require(subpath2..va)
      elseif (ext=="moon")
        va = fn\sub(1,(#fn-5))
        -- require(subpath2..va)
