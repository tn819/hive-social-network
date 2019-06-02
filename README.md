#Social Network

Features:

| Description             | Tech                                                                      | Overview                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Front-end               | React, Redux, Third-Party components (React Modal), Animations, Keyframes | Authenticated page structure, Redux store and actions                                                             |
| Back-end                | Node, Express, Express Router                                             | Node server and routing set-up                                                                                    |
| Database                | Postgres SQL                                                              | Node server and routing set-up                                                                                    |
|                         |
| Authentication/Security | bcrypt, cookie-session, csurf                                             | user log-in handled securely with bcrypt, common web security concerns addressed via csurf, cookies, other set-up |
| Test                    | Jest, Enzyme, Supertest                                                   | examples of route testing                                                                                         |

## landing page

friend requests, built-in pop up group live chat
![alt text](https://raw.githubusercontent.com/tn819/hive-social-network/master/public/landing-page.png)

## upload page

file upload with multer, update coordinates and information
![alt text](https://raw.githubusercontent.com/tn819/hive-social-network/master/public/modal.png)

## login page

verified log-in and validation
![alt text](https://raw.githubusercontent.com/tn819/hive-social-network/master/public/sign-in.png)

```
npm install

concurrent dev script execution (webpack + node server):
npm run dev

requires ENV variables for DATABASE_URL (postgres url), AWS_KEY, AWS_SECRET, s3Url (AWS bucket url)
```
