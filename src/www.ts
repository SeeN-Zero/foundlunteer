#!/usr/bin/env node

/**
 * Module dependencies.
 */
import app from './app'
import http from 'http'

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort('3000')
app.set('port', port)

/**
 * Create HTTP server.
 */

const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val: string): unknown {
  const port = parseInt(val)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}
