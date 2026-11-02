import 'dotenv/config' // loads .env: SMTP_* for the app, EBH_* for these tasks
import { defineConfig } from 'cypress'
import { inbox } from 'emailblackhole'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    video: false,
    taskTimeout: 90_000,
    setupNodeEvents(on) {
      // Cypress tests run in the browser; these two tasks run in Node and talk to Email Blackhole.
      const ebh = inbox() // reads EBH_URL, EBH_ID, EBH_SECRET
      on('task', {
        // The inbox position now. Take it BEFORE the action that sends the email.
        emailMark: () => ebh.mark(),
        // Wait for a message newer than `after`. Returns { subject, text, html, links, codes, ... }.
        waitForEmail: (filter) => ebh.waitForEmail(filter),
      })
    },
  },
})
