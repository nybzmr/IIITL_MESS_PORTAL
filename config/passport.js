const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function configurePassport(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;

          if (!email) {
            return done(
              new Error(
                'Google account did not provide an email address'
              )
            );
          }

          const userData = {
            googleId: profile.id,
            displayName: profile.displayName,
            email,
          };

          let user = await User.findOne({
            googleId: profile.id,
          });

          if (!user) {
            user = await User.create(userData);
          }

          return done(null, user);
        } catch (error) {
          console.error(
            'Google authentication error:',
            error
          );

          return done(error);
        }
      }
    )
  );

  /* ---------------------------------------------------------------------- */
  /* Serialize user                                                         */
  /* ---------------------------------------------------------------------- */

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  /* ---------------------------------------------------------------------- */
  /* Deserialize user                                                       */
  /* ---------------------------------------------------------------------- */

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);

      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};