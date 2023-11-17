# Graphic-representation-realt

RealT is a company that does real estate tokenization on blockchain, with the aim of exploring blockchain in order to make statistics.
This project allows me to learn react and explore blockchain

domain for this project : https://graphic-realt-application.netlify.app/

## Graphic :

```shell
- % by TYPE of home mono-family/Multy-family/SFR Portfolio
- % by country USA (see in state ?), Panama....
- % of portfolio by city (Detroit, Cleveland)
- % of portfolio in section 8, section 42, normal
- % of portfolio in dollas/Euros...
```

## How To create/use

```shell
npx create-react-app graphic-representation-realt
cd graphic-representation-realt
npm install, npm update, , npm start
go to http://localhost:3000/
```

## Contributing

We love contributors, so don't hesitate to contribute, ask questions and get in touch with the project creator: yohanndurand76@gmail.com
To contribute, create a branch and propose a pull request
We prefer smaller features to improve maintenance.

## Technology :

Technology is React,
chart.js library for graphic

TheGraph for explore blockchain

```shell
xdai : https://api.thegraph.com/subgraphs/name/realtoken-thegraph/realtoken-xdai
rmm : https://api.thegraph.com/subgraphs/name/realtoken-thegraph/rmm-realt
eth : https://api.thegraph.com/subgraphs/name/realtoken-thegraph/realtoken-eth
```
RealT communitary api :

```shell
get info for each property : https://api.realt.community/v1/token/0x4637aa1a13aa4050c6e4bcd6dde9c39e80e9dd54
```

## TODO LIST TASK for V1:

Graphics :
- % make graphic by country USA , Panama (with property address, where is country?) (use openstreet api with coordinate data?)
- % of portfolio is located, not located, partially located (in $)
- % add composition on wallet fee/construction/value asset property/renovation

PropertyInfo Table :
- add in array property (price per interior sqft, price per door, rent by month)
- can sort each table column

Other :
- update %graphic% for add % in graphics legend (for remove left part data)
- Improved overall design
- layout of all graphics
- loader when wait response api and calculate all data for each property (async response?)
- add analyctics link for calculate trafic
- if input is empty, run useEffect

Header (link dashboard):
- rent by day/week/month/years
- add total fee realT when display realT wallet, not with my wallet
- manage different currency for each graphic (convert each monney in $ for have correct proportion in %)

## Goal in version

- V1 : Homepage : Statistic on wallet (graph, % wallet)
- V1 : page for manage version and add contact informations for manage idee

- V2 : page to compare different real estate markets according to your portfolio

- V3 SecondPage : Calculate invest return with CSV distribution, CSV reevaluation (where CSV, methods? necessary discussion)
