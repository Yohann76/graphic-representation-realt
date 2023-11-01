# Graphic-representation-realt

RealT is a company that does real estate tokenization on blockchain, with the aim of exploring blockchain in order to make statistics.

This project allows me to learn react and explore blockchain

### Graphic :

- % by TYPE of home mono-family/Multy-family/SFR Portfolio
- % by country USA (see in state ?), Panama....
- % of portfolio by city (Detroit, Cleveland)
- % of portfolio in section 8, section 42, normal
- % of portfolio in dollas/Euros...

### How To create/use

`npx create-react-app graphic-representation-realt`
`cd graphic-representation-realt`
`npm install`, `npm update`, , `npm start`
go to `http://localhost:3000/`

### Contributing

We love contributors, so don't hesitate to contribute, ask questions and get in touch with the project creator: yohanndurand76@gmail.com

To contribute, create a branch and propose a pull request

We prefer smaller features to improve maintenance.

### Technology :

Technology is React,
chart.js for graphic

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

#### Features

- Use Docker
- add project on netlify
- add github action task

### ToDO LIST TASK :

- % make graphic for CityPropertyChart.js (80 from detroit, 15 from chicago)
- CityPropertyChart.js : get city from other const (maybe address, with API?)
- % make graphic each zone in USA (12 from NY, 14 from OH..)
- % make graphic by country USA , Panama (with property address)

- % by TYPE of home mono-family/Multy-family/SFR Portfolio (where is this information?)
- % of portfolio in section 8, section 42, basic (where is this information?)

- loader when wait response api and calculate all data for each property

- Calculate invest return with CSV distribution, CSV reevaluation (where CSV, methods? necessary discussion)
