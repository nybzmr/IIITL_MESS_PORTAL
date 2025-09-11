const express = require('express');
const passport = require('passport');

const router = express.Router();

/* -------------------------------------------------------------------------- */
/* Sign in                                                                     */
/* -------------------------------------------------------------------------- */

router.get(
  '/signin',
  passport.authenticate('google', {
    prompt: 'select_account',
    scope: ['profile', 'email'],
  })
);

/* -------------------------------------------------------------------------- */
/* Sign out                                                                    */
/* -------------------------------------------------------------------------- */

router.get('/signout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session?.destroy((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }

      return res.redirect(
        process.env.FRONTEND || '/'
      );
    });
  });
});

/* -------------------------------------------------------------------------- */
/* Google callback                                                             */
/* -------------------------------------------------------------------------- */

router.get(
  '/google/callback',

  passport.authenticate('google', {
    failureRedirect: process.env.FRONTEND || '/',
  }),

  (req, res) => {
    res.redirect(
      process.env.FRONTEND || '/'
    );
  }
);

module.exports = router;