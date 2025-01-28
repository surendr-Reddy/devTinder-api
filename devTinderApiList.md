# DevTinder APIs

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password // Forgot password API

## connectionRequestRouter
- POST /request/send/intereted/:userId
- POST /request/send/ignored/:userId

- POST /request/review/accepted/:requestedId
- POST /request/review/rejected/:requestedId

Instead of using 4 separate APIs, we can simplify this by using the following 2 APIs:
- POST /request/send/:status/:userId 
- POST /request/review/:status/:requestId

## userRouter
- GET /user/requests/received
- GET /user/connections
- GET /user/feed - Gets you the profiles of other users on platform


Status: ignored, interested, accepeted, rejected