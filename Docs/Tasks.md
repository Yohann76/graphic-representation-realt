## TODO LIST (V1)

## Graphics :
- % add composition on Monthly Cost :

- propertyManagement : (in api) Property Management (8.00%)
- realtPlatform : (in data) RealT Platform (2.00%)
- propertyMaintenanceMonthly : (in api) : Maintenance Expenses
- propertyTaxes : 225 : (in api)
- insurance : 480 (in api)

- % add composition on wallet fee/value asset property/renovation
example : https://realt.co/product/1-holdings-monterey-st-detroit-mi-48206#tab-title-financials_tab
Data in graphics (Total Investment composition)  :

- underlyingAssetPrice : 280000 (in api)
- miscellaneousCosts : 600 (in api)
- realtListingFee : 38,187.78 (already in data)
- renovationReserve : 50,000.00 (in api)
- initialMaintenanceReserve : 10,590.00  (in api)
- totalInvestment (already in data i think)
- soustract totalInvestment for determine "Administrative Fees & Rounding Difference" (calcul)

Check that the data is correct in relation to the portfolio in $ and not in relation to the number of houses.

## PropertyInfo Table :
- Add in array property (rent by month)
- Can sort each table column
- unit xx/xx(xx%)
- Total yield in % (Total Value Actual / TT rent per Years) (purchase price and actualValue)

## Other :
- Design input (in navbar in header?)
- Add other type of property (to 100%...)
- Legend for each graphic must be is white
- Loader component when wait response api and calculate all data for each property (async response?)
- Add analyctics link for calculate trafic
- If input is empty, run useEffect for load data when website is load

- Put input in url parameter ??
- Add .env data

- All website must be in english

## Header (link dashboard):
- improve design for header (rent section, fee section...)
- manage different currency for each graphic (convert each monney in $ for have correct proportion in %)
- Number city
- Number country
