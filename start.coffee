cluster = require 'cluster'
os = require 'os'
http = require 'http'
numCPUs = os.cpus()

workerList = []
createWorker = () ->
    worker = cluster.fork()
    worker.on "message", (data) ->
      console.log "the worker " + worker.id + "|" + worker.process.pid + " accept data: " + JSON.stringify(data)
      if data.type and data.type is "broadcast"
        workerList.forEach (wk) ->
          wk.send data.body
          return
      return
    return worker;

if cluster.isMaster
  console.log "master process start..."
  for i in numCPUs
    workerList.push createWorker()

  cluster.on 'listening', (worker, address) ->
    console.log "A worker with #" + worker.id + " pid " + worker.process.pid +
      " is now connected to " + address.address + ":" + address.port
    return
  cluster.on 'exit', (worker, code, signal) ->
    console.log 'worker ' + worker.process.pid + ' died'
    process.nextTick () ->
      cluster.fork();
      return
    return
else
　　require './app.coffee'
