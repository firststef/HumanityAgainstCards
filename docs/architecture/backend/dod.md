# Definition of done
## Sprint 1

- [ ] Create and configurate a basic mongodb database 
- [ ] Create a database schema for all the required objects
- [ ] Create a route (or a socket) that returns a list of all avaiable ongoing games
- [ ] Create a route that allows autentification
- [ ] Prepare for user page

## Auth 
- Using cookie sessions
- md5 password encoding 

### Auth requirements
- [ ] Login module
- [ ] Logout route
- [ ] Register module
- [ ] Password recovery module trough email
- [ ] Make the module togable

## Ongoing games route
- Returns an object containing an array, of all the ongoing games.
- In order to return 200 it requires the cookie session of the auth module.

### Ongoing games requirements
- [ ] Allow a set of basic filters to pass trough the request
- [ ] Prepare for pagination (In case a page parameter has been provided as wel, as an elements per page parameter, return only the required numbers of elems)

## Prepare for user page
- Basic routes to return basic info about an user
