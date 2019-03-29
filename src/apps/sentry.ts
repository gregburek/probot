import * as Sentry from '@sentry/node'
import sentryStream from 'bunyan-sentry-stream'
import { Application } from '../application'

export = (app: Application) => {
  // If sentry is configured, report all logged errors
  if (process.env.SENTRY_DSN) {
    app.log.debug(process.env.SENTRY_DSN, 'Errors will be reported to Sentry')
    Sentry.init({
      autoBreadcrumbs: true,
      dsn: process.env.SENTRY_DSN
    })

    app.log.target.addStream(sentryStream(Sentry))
  }
}
