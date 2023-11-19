# status report on the future api and its requirements (for V2 or V4)

what is api's data?
what are api's needs?
what are the api endpoints?

if api is to be used, node.js can be very effective with react.

Response :

the api can be useful to have the starting price of each token and thus calculate the return on investment of each token.

the database must be able to self-fill with the community api, my api would be a kind of complement to have other data

## Database and Data

### Property

- uuid (token)
- name (token)
- active
- unit
- currency
- city
- Country
- State
- TotalToken
- tokenPrice

- StartValue (token)
- CurrentValue (token)

- StartNetRentIn%
- CurrentNetRentIn%

- InitialAssetPrice
- CurrentAssetPrice

- Units
- RentedUnits
- RentedUnitsPercent




- SquareMeterPrice
- DoorPrice

## endpoint

- GET /v1/uuid (authorize all person)
- PUT /v1/uuid (just me with token)
- DELETE /v1/uuid (just me with token)
