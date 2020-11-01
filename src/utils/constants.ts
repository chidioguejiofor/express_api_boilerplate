/* This represents how we a token key in redis. 
 It is to be have the form LOGIN_TOKEN_{email}_{unique-id}
 The idea here is that you delete all the login tokens of a particular user by deleting tokens with key `LOGIN_TOKEN_{user-email}_*`, which can be very useful
 incase there is a security breach.
*/
export const REDIS_LOGIN_TOKEN_CACHE_KEY = "LOGIN_TOKEN_%s_%s";

export const LOGIN_TOKEN_AGE = 3 * 60 * 60 * 24;
