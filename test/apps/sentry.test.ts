import * as Sentry from '@sentry/node'
import { Application } from '../../src'
import appFn = require('../../src/apps/sentry')
import { createApp } from './helper'

describe('sentry app', () => {
  let app: Application

  beforeEach(async () => {
    app = createApp()
  })

  beforeEach(() => {
    // Clean up env variable
    delete process.env.SENTRY_DSN
  })

  describe('with an invalid SENTRY_DSN', () => {
    test('throws an error', () => {
      process.env.SENTRY_DSN = '1233'
      expect(() => {
        appFn(app)
      }).toThrow(/Invalid Dsn/)
    })
  })

  describe('with a SENTRY_DSN', () => {
    beforeEach(() => {
      process.env.SENTRY_DSN = 'https://user:pw@sentry.io/123'
      appFn(app)
      Object.defineProperty(Sentry, 'captureException', { value: jest.fn() })
    })

    test('sends reported errors to sentry', () => {
      const err = new Error('test message')
      app.log.error(err)

      expect(Sentry.captureException).toHaveBeenCalledWith(err, expect.objectContaining({
        extra: expect.anything()
      }))
    })
  })
})
