import { Amplify } from 'aws-amplify'

const userPoolId = import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID
const userPoolClientId = import.meta.env.VITE_AWS_COGNITO_USER_POOL_CLIENT_ID

export const isAwsAuthConfigured = Boolean(userPoolId && userPoolClientId)

if (isAwsAuthConfigured) {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
        loginWith: {
          email: true,
        },
      },
    },
  })
}
