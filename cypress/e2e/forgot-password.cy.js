describe('forgot password', () => {
  it('the reset email arrives and its link works', () => {
    // A recipient only this run uses, so runs that share an inbox never see each other's mail.
    const email = `reset-${Date.now()}@example.com`

    // 1. Note where the inbox is now, so older mail can never satisfy this run.
    cy.task('emailMark').then((after) => {
      // 2. Do what a user does: open the page, type the address, submit.
      cy.visit('/forgot-password')
      cy.get('input[type=email]').type(email)
      cy.contains('button', 'Send reset link').click()
      cy.contains('h1', 'Check your email')

      // 3. Wait for the message (no cy.wait(5000), no polling loop) and take the link from it.
      cy.task('waitForEmail', { after, to: email, subject: 'Reset your password' }).then((message) => {
        const link = message.links.find((l) => l.includes('/reset-password'))
        expect(link, 'the email should contain the reset link').to.be.a('string')

        // 4. Follow the link like the user would.
        cy.visit(link)
        cy.get('input[type=password]').type('correct-horse-battery')
        cy.contains('button', 'Update password').click()
        cy.contains('h1', 'Password updated')
      })
    })
  })
})
